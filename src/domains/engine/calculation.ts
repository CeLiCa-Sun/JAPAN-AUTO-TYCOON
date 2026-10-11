/** Stage 1 preliminary SI-based engineering calculations. Empirical outputs are estimates. */
export interface EngineDesign {cylinders:number;boreMm:number;strokeMm:number;compressionRatio:number;rpm:number;volumetricEfficiency:number;thermalEfficiency:number;fuelLowerHeatingValueMJkg:number;airFuelRatio:number}
export interface EngineResult {displacementCc:number;meanPistonSpeedMs:number;torqueNm:number;powerKw:number;powerPs:number;fuelKgHour:number;bsfcGkwh:number;modelVersion:string;quality:"theoretical+estimated"}
export const ENGINE_MODEL_VERSION="0.1.0-preview";
export function calculateEngine(d:EngineDesign):EngineResult{
 const {cylinders,boreMm,strokeMm,compressionRatio,rpm,volumetricEfficiency,thermalEfficiency,fuelLowerHeatingValueMJkg,airFuelRatio}=d;
 const safe=(v:number)=>Number.isFinite(v);
 if(!Number.isInteger(cylinders)||cylinders<1||cylinders>16||![boreMm,strokeMm,compressionRatio,rpm,volumetricEfficiency,thermalEfficiency,fuelLowerHeatingValueMJkg,airFuelRatio].every(safe)
 ||boreMm<40||boreMm>130||strokeMm<40||strokeMm>130||compressionRatio<5||compressionRatio>18||rpm<500||rpm>9000
 ||volumetricEfficiency<0.4||volumetricEfficiency>1.2||thermalEfficiency<0.1||thermalEfficiency>0.5||fuelLowerHeatingValueMJkg<35||fuelLowerHeatingValueMJkg>50||airFuelRatio<9||airFuelRatio>22)throw new RangeError("Engine parameters outside preview model envelope");
 const displacementCc=Math.PI/4*boreMm*boreMm*strokeMm*cylinders/1000;
 const meanPistonSpeedMs=2*(strokeMm/1000)*rpm/60;
 // Assumes 4-stroke cycle, standard intake air density 1.225 kg/m3, fixed load and fixed efficiencies.
 const displacementM3=displacementCc/1e6;
 const airKgSec=displacementM3*(rpm/120)*1.225*volumetricEfficiency;
 const fuelKgSec=airKgSec/airFuelRatio;
 const powerKw=fuelKgSec*fuelLowerHeatingValueMJkg*1000*thermalEfficiency;
 const torqueNm=powerKw*1000/(2*Math.PI*rpm/60);
 return {displacementCc,meanPistonSpeedMs,torqueNm,powerKw,powerPs:powerKw/0.73549875,fuelKgHour:fuelKgSec*3600,bsfcGkwh:fuelKgSec*3600*1000/powerKw,modelVersion:ENGINE_MODEL_VERSION,quality:"theoretical+estimated"};
}
export const DEFAULT_ENGINE:EngineDesign={cylinders:4,boreMm:70,strokeMm:70,compressionRatio:8,rpm:3500,volumetricEfficiency:0.8,thermalEfficiency:0.25,fuelLowerHeatingValueMJkg:43,airFuelRatio:14.7};
