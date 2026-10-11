import {calculateEngine, DEFAULT_ENGINE, type EngineDesign} from "./calculation";
export interface Tuning {intake:"standard"|"performance";exhaust:"standard"|"performance";camPeakRpm:number}
export interface CurvePoint {rpm:number;torqueNm:number;powerKw:number;fuelKgHour:number}
export function engineCurve(design:EngineDesign,tuning:Tuning,step=250):CurvePoint[]{
 if(!Number.isFinite(tuning.camPeakRpm)||tuning.camPeakRpm<1500||tuning.camPeakRpm>8000||!Number.isInteger(step)||step<100||step>2000)throw new RangeError("Invalid curve settings");
 const output:CurvePoint[]=[];
 // Heuristic VE envelope, explicitly NOT calibrated to dynamometer data.
 for(let rpm=750;rpm<=7500;rpm+=step){
  const offset=(rpm-tuning.camPeakRpm)/2600;
  const breathing=Math.max(0.52,1-0.27*offset*offset);
  const intake=tuning.intake==="performance"?1.035:1;
  const exhaust=tuning.exhaust==="performance"?1.025:1;
  const ve=Math.min(1.2,Math.max(0.4,design.volumetricEfficiency*breathing*intake*exhaust));
  const result=calculateEngine({...design,rpm,volumetricEfficiency:ve});
  output.push({rpm,torqueNm:result.torqueNm,powerKw:result.powerKw,fuelKgHour:result.fuelKgHour});
 }
 return output;
}
export const DEFAULT_TUNING:Tuning={intake:"standard",exhaust:"standard",camPeakRpm:4000};
export const previewCurve=()=>engineCurve(DEFAULT_ENGINE,DEFAULT_TUNING);
