import type {EngineProgram} from "./program";
import {estimateManufacturingCostYen,runEngineTrial} from "./program";
export interface PartSpec {id:string;name:string;unitsPerEngine:number;unitCostYen:number}
export interface MaterialStock {partId:string;quantity:number}
export interface EngineWorkOrder {id:string;programId:string;quantity:number;status:"planned"|"released"|"inspected"|"completed"}
export interface Inspection {accepted:number;rejected:number;defects:readonly string[]}
export interface ProductionPlan {order:EngineWorkOrder;required:MaterialStock[];materialCostYen:number;estimatedOverheadYen:number;totalCostYen:number}
function whole(n:number){return Number.isSafeInteger(n)&&n>=0;}
export function planEngineProduction(program:EngineProgram,orderId:string,quantity:number,bom:readonly PartSpec[],stock:readonly MaterialStock[]):ProductionPlan{
 if(!orderId.trim()||!whole(quantity)||quantity===0||!bom.length)throw new Error("Invalid work order");
 const seen=new Set<string>();const available=new Map<string,number>();
 for(const s of stock){if(!s.partId||!whole(s.quantity)||available.has(s.partId))throw new Error("Invalid stock");available.set(s.partId,s.quantity);}
 let materialCostYen=0;const required:MaterialStock[]=[];
 for(const p of bom){
  if(!p.id||seen.has(p.id)||!whole(p.unitsPerEngine)||p.unitsPerEngine===0||!whole(p.unitCostYen))throw new Error("Invalid BOM");
  seen.add(p.id);const need=p.unitsPerEngine*quantity;if(!whole(need))throw new Error("Quantity overflow");
  if((available.get(p.id)??0)<need)throw new Error("Insufficient component inventory: "+p.id);
  materialCostYen+=need*p.unitCostYen;if(!whole(materialCostYen))throw new Error("Cost overflow");
  required.push({partId:p.id,quantity:need});
 }
 const estimatedTotal=estimateManufacturingCostYen(program,quantity)*quantity;
 if(!whole(estimatedTotal))throw new Error("Cost overflow");
 const estimatedOverheadYen=Math.max(0,estimatedTotal-materialCostYen);
 return {order:{id:orderId,programId:program.id,quantity,status:"planned"},required,materialCostYen,estimatedOverheadYen,totalCostYen:materialCostYen+estimatedOverheadYen};
}
export function inspectWorkOrder(plan:ProductionPlan,accepted:number,defects:readonly string[]):Inspection{
 if(!whole(accepted)||accepted>plan.order.quantity)throw new Error("Invalid inspection quantity");
 return {accepted,rejected:plan.order.quantity-accepted,defects:[...defects]};
}
export function commitProduction(plan:ProductionPlan,stock:readonly MaterialStock[],inspection:Inspection):{order:EngineWorkOrder;stock:MaterialStock[];accepted:number;costYen:number}{
 if(inspection.rejected!==plan.order.quantity-inspection.accepted||inspection.accepted<0||inspection.rejected<0)throw new Error("Invalid inspection");
 const used=new Map(plan.required.map(x=>[x.partId,x.quantity]));
 const remaining=stock.map(s=>{const q=s.quantity-(used.get(s.partId)??0);if(q<0)throw new Error("Insufficient stock on commit");return {...s,quantity:q};});
 if(plan.required.some(r=>!stock.some(s=>s.partId===r.partId)))throw new Error("Missing component");
 return {order:{...plan.order,status:"completed"},stock:remaining,accepted:inspection.accepted,costYen:plan.totalCostYen};
}
export function validatePrototypeForProduction(program:EngineProgram,coolingKw:number,octane:number):void{
 if(!runEngineTrial(program,coolingKw,octane).passed)throw new Error("Prototype trial failed");
}
