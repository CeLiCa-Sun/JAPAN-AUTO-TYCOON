import {calculateEngine,type EngineDesign} from "./calculation";
import {estimateReliability} from "./reliability";
export interface ResearchProject {id:string;technologyLevel:number;budgetYen:number;testHours:number;octane:number;coolingCapacityKw:number}
export interface ResearchOutcome {projectId:string;costYen:number;technologyPoints:number;estimatedPowerKw:number;estimatedLifeHours:number;knockRiskIndex:number;passed:boolean;modelStatus:"uncalibrated-preview"}
/** Deterministic simulator prototype, not measured durability or actual physical test results. */
export function evaluateResearch(project:ResearchProject,design:EngineDesign):ResearchOutcome {
 if(!project.id.trim()||!Number.isInteger(project.technologyLevel)||project.technologyLevel<0||project.technologyLevel>10||!Number.isSafeInteger(project.budgetYen)||project.budgetYen<0||!Number.isFinite(project.testHours)||project.testHours<0)throw new RangeError("Invalid research project");
 const performance=calculateEngine(design);
 const reliability=estimateReliability(design,project.coolingCapacityKw,project.octane);
 const technologyPoints=Math.min(1000,Math.floor(Math.sqrt(project.budgetYen/100000)*Math.log1p(project.testHours)*Math.max(0.1,1-reliability.knockRiskIndex/3)));
 const passed=project.testHours>=50&&project.testHours<=reliability.estimatedLifeHours&&reliability.knockRiskIndex<0.5;
 return {projectId:project.id,costYen:project.budgetYen,technologyPoints,estimatedPowerKw:performance.powerKw,estimatedLifeHours:reliability.estimatedLifeHours,knockRiskIndex:reliability.knockRiskIndex,passed,modelStatus:"uncalibrated-preview"};
}
