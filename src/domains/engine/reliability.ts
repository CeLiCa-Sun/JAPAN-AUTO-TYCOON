import {calculateEngine,type EngineDesign} from "./calculation";
export interface ReliabilityEstimate {heatLoadKw:number;frictionLossKw:number;knockRiskIndex:number;stressIndex:number;estimatedLifeHours:number;uncertainty:"high";modelVersion:"0.1-preview"}
/** Uncalibrated comparative engineering estimates. Not physical safety or warranty predictions. */
export function estimateReliability(engine:EngineDesign,coolingCapacityKw:number,octane:number):ReliabilityEstimate{
 if(!Number.isFinite(coolingCapacityKw)||coolingCapacityKw<=0||!Number.isFinite(octane)||octane<70||octane>110)throw new RangeError("Invalid cooling/octane");
 const performance=calculateEngine(engine);
 const fuelPowerKw=performance.fuelKgHour/3600*engine.fuelLowerHeatingValueMJkg*1000;
 // Thermal losses include exhaust, cooling and friction: NOT equivalent to radiator demand.
 const heatLoadKw=Math.max(0,fuelPowerKw-performance.powerKw);
 const frictionLossKw=0.000008*performance.displacementCc*engine.rpm/1000;
 const knockRiskIndex=Math.max(0,(engine.compressionRatio-8)*0.11+(95-octane)*0.025)*(engine.rpm>6000?1.15:1);
 const pistonSpeedStress=Math.pow(performance.meanPistonSpeedMs/15,2);
 // Preview assumption: only 30% of total rejected heat enters the cooling circuit.
 const estimatedCoolantHeatKw=heatLoadKw*0.30;
 const heatStress=Math.max(0,estimatedCoolantHeatKw/coolingCapacityKw-1);
 const stressIndex=pistonSpeedStress+heatStress+knockRiskIndex;
 const estimatedLifeHours=Math.round(Math.max(100,Math.min(20000,8000/(1+stressIndex))));
 return {heatLoadKw,frictionLossKw,knockRiskIndex,stressIndex,estimatedLifeHours,uncertainty:"high",modelVersion:"0.1-preview"};
}
