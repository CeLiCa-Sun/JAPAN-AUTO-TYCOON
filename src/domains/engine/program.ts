import type {EngineDesign} from "./calculation";
import {calculateEngine} from "./calculation";
import {estimateReliability} from "./reliability";
export interface EngineProgram {id:string;technologyLevel:number;design:EngineDesign;prototypeHours:number;developmentBudgetYen:number}
export interface EngineTrial {powerKw:number;torqueNm:number;stress:number;estimatedLifeHours:number;passed:boolean;notes:string[]}
export function runEngineTrial(p:EngineProgram,coolingKw:number,octane:number):EngineTrial{
 if(!p.id||!Number.isInteger(p.technologyLevel)||p.technologyLevel<0||p.technologyLevel>10||!Number.isSafeInteger(p.developmentBudgetYen)||p.developmentBudgetYen<0||!Number.isFinite(p.prototypeHours)||p.prototypeHours<0)throw new RangeError("Invalid program");
 const perf=calculateEngine(p.design),rel=estimateReliability(p.design,coolingKw,octane);
 const notes:string[]=[];if(rel.knockRiskIndex>0.5)notes.push("knock risk");if(rel.heatLoadKw>coolingKw)notes.push("cooling deficit");
 const passed=p.prototypeHours>=50&&rel.estimatedLifeHours>=p.prototypeHours&&!notes.length;
 return {powerKw:perf.powerKw,torqueNm:perf.torqueNm,stress:rel.stressIndex,estimatedLifeHours:rel.estimatedLifeHours,passed,notes};
}
export function estimateManufacturingCostYen(p:EngineProgram,annualVolume:number):number{
 if(!Number.isInteger(annualVolume)||annualVolume<=0)throw new RangeError("Invalid volume");
 const d=p.design,displacement=calculateEngine(d).displacementCc;
 const materials=Math.round(28000+d.cylinders*13000+displacement*22);
 const labor=Math.round((85000+ d.cylinders*8000)/(1+Math.min(p.technologyLevel,10)*0.035));
 const tooling=Math.ceil(p.developmentBudgetYen/annualVolume);
 const cost=materials+labor+tooling;
 if(!Number.isSafeInteger(cost))throw new RangeError("Cost overflow");
 return cost;
}
