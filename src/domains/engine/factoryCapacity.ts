/** 18-stage capacity and depreciation preview, not a discrete-event factory simulator. */
export const ENGINE_FACTORY_STAGES=[
 {id:"materials",label:"材料受入検査"},
 {id:"blockCasting",label:"シリンダーブロック鋳造"},
 {id:"headCasting",label:"シリンダーヘッド鋳造"},
 {id:"blockMachining",label:"ブロック切削"},
 {id:"headMachining",label:"ヘッド切削"},
 {id:"crankshaft",label:"クランク加工"},
 {id:"connectingRods",label:"コンロッド加工"},
 {id:"pistons",label:"ピストン加工"},
 {id:"valvetrain",label:"動弁機構組立"},
 {id:"cylinderHoning",label:"シリンダー仕上"},
 {id:"cleaning",label:"洗浄"},
 {id:"dimensionalCheck",label:"寸法検査"},
 {id:"bottomAssembly",label:"腰下組立"},
 {id:"topAssembly",label:"腰上組立"},
 {id:"timing",label:"タイミング調整"},
 {id:"fluidSystems",label:"燃料・潤滑系組立"},
 {id:"testRun",label:"試運転"},
 {id:"finalInspection",label:"完成検査"}
] as const;
export type FactoryStageId=typeof ENGINE_FACTORY_STAGES[number]["id"];
export interface StageEquipment {stageId:FactoryStageId;machines:number;cycleMinutes:number;setupMinutes:number;defectProbability:number;bookValueYen:number;remainingLifeMonths:number}
export interface FactoryPlan {stages:18;bottleneck:FactoryStageId;monthlyCapacity:number;plannedQuantity:number;feasible:boolean;sequentialLeadMinutes:number;estimatedAccepted:number;expectedDefects:number;monthlyDepreciationYen:number;modelStatus:"planning-preview"}
/** Each stage has a fixed machine count, monthly available minutes and estimated defect rate. */
export function planFactoryBatch(quantity:number,equipment:readonly StageEquipment[],availableMinutesPerMachine:number):FactoryPlan{
 if(!Number.isSafeInteger(quantity)||quantity<1||!Number.isSafeInteger(availableMinutesPerMachine)||availableMinutesPerMachine<1||equipment.length!==ENGINE_FACTORY_STAGES.length)throw new RangeError("Invalid factory plan");
 const ids=new Set<string>();let capacity=Infinity,bottleneck:FactoryStageId=ENGINE_FACTORY_STAGES[0].id;
 let leadMinutes=0,expectedYield=1,monthlyDepreciationYen=0;
 for(const stage of equipment){
  if(ids.has(stage.stageId)||!ENGINE_FACTORY_STAGES.some(s=>s.id===stage.stageId)||!Number.isSafeInteger(stage.machines)||stage.machines<1||!Number.isFinite(stage.cycleMinutes)||stage.cycleMinutes<=0||!Number.isFinite(stage.setupMinutes)||stage.setupMinutes<0||!Number.isFinite(stage.defectProbability)||stage.defectProbability<0||stage.defectProbability>1||!Number.isSafeInteger(stage.bookValueYen)||stage.bookValueYen<0||!Number.isSafeInteger(stage.remainingLifeMonths)||stage.remainingLifeMonths<1)throw new RangeError("Invalid factory equipment");
  ids.add(stage.stageId);
  const possible=Math.max(0,Math.floor((availableMinutesPerMachine-stage.setupMinutes)/stage.cycleMinutes)*stage.machines);
  if(possible<capacity){capacity=possible;bottleneck=stage.stageId;}
  leadMinutes+=stage.setupMinutes+Math.ceil(quantity/stage.machines)*stage.cycleMinutes;
  expectedYield*=1-stage.defectProbability;
  monthlyDepreciationYen+=Math.ceil(stage.bookValueYen/stage.remainingLifeMonths);
 }
 if(!Number.isSafeInteger(monthlyDepreciationYen)||!Number.isFinite(leadMinutes))throw new RangeError("Factory valuation overflow");
 const estimatedAccepted=Math.floor(quantity*expectedYield);
 return {stages:18,bottleneck,monthlyCapacity:capacity,plannedQuantity:quantity,feasible:quantity<=capacity,sequentialLeadMinutes:leadMinutes,estimatedAccepted,expectedDefects:quantity-estimatedAccepted,monthlyDepreciationYen,modelStatus:"planning-preview"};
}
