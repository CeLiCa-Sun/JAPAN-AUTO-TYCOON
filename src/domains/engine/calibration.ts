import {calculateEngine,type EngineDesign} from "./calculation";
export interface MeasuredPoint {rpm:number;powerKw:number;torqueNm?:number;source:string}
export interface CalibrationSummary {count:number;meanAbsolutePercentageError:number;maxAbsolutePercentageError:number;points:Array<{rpm:number;observedKw:number;predictedKw:number;percentageError:number}>}
export function evaluateCalibration(base:EngineDesign,data:readonly MeasuredPoint[]):CalibrationSummary{
 if(data.length<3)throw new Error("At least three measured points required");
 const points=data.map(p=>{
  if(!Number.isFinite(p.rpm)||!Number.isFinite(p.powerKw)||p.powerKw<=0||!p.source.trim())throw new RangeError("Invalid measured point");
  const predictedKw=calculateEngine({...base,rpm:p.rpm}).powerKw;
  const percentageError=100*(predictedKw-p.powerKw)/p.powerKw;
  return {rpm:p.rpm,observedKw:p.powerKw,predictedKw,percentageError};
 });
 const absolute=points.map(p=>Math.abs(p.percentageError));
 return {count:points.length,meanAbsolutePercentageError:absolute.reduce((a,b)=>a+b,0)/absolute.length,maxAbsolutePercentageError:Math.max(...absolute),points};
}
