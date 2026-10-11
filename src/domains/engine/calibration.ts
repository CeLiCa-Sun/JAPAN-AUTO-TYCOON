import {calculateEngine,type EngineDesign} from "./calculation";
export interface MeasuredPoint {rpm:number;powerKw:number;torqueNm?:number;source:string}
export interface CalibrationSummary {count:number;meanAbsolutePercentageError:number;maxAbsolutePercentageError:number;rootMeanSquaredErrorKw:number;meanBiasKw:number;points:Array<{rpm:number;observedKw:number;predictedKw:number;percentageError:number}>}
export function evaluateCalibration(base:EngineDesign,data:readonly MeasuredPoint[]):CalibrationSummary{
 if(data.length<3)throw new Error("At least three measured points required");
 const rpmSeen=new Set<number>();
 const points=data.map(p=>{
  if(rpmSeen.has(p.rpm))throw new RangeError("Duplicate measured RPM");rpmSeen.add(p.rpm);
  if(!Number.isFinite(p.rpm)||p.rpm<500||p.rpm>9000||!Number.isFinite(p.powerKw)||p.powerKw<=0||typeof p.source!=="string"||!p.source.trim()||p.torqueNm!==undefined&&(!Number.isFinite(p.torqueNm)||p.torqueNm<=0))throw new RangeError("Invalid measured point");
  if(p.torqueNm!==undefined){const derived=p.torqueNm*2*Math.PI*p.rpm/60000;if(Math.abs(derived-p.powerKw)/p.powerKw>0.05)throw new RangeError("Torque/power measurement inconsistency");}
  const predictedKw=calculateEngine({...base,rpm:p.rpm}).powerKw;
  const percentageError=100*(predictedKw-p.powerKw)/p.powerKw;
  return {rpm:p.rpm,observedKw:p.powerKw,predictedKw,percentageError};
 });
 const absolute=points.map(p=>Math.abs(p.percentageError));
 const errors=points.map(p=>p.predictedKw-p.observedKw);
 const rootMeanSquaredErrorKw=Math.sqrt(errors.reduce((sum,error)=>sum+error*error,0)/errors.length);
 const meanBiasKw=errors.reduce((sum,error)=>sum+error,0)/errors.length;
 return {count:points.length,meanAbsolutePercentageError:absolute.reduce((a,b)=>a+b,0)/absolute.length,maxAbsolutePercentageError:Math.max(...absolute),rootMeanSquaredErrorKw,meanBiasKw,points};
}
