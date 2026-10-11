import {useState} from "react";
import type {GameState} from "../core/types";
import {yearMonth} from "../core/types";
import {dispatch} from "../core/reducer";
import {DEFAULT_ENGINE} from "../domains/engine/calculation";
import {manufactureEngines} from "../domains/engine/persistentProduction";
import {saveAtomic} from "../storage/atomic";
const program={id:"demo-engine",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"エンジンブロック",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"ピストン",unitsPerEngine:4,unitCostYen:3000}];
export function FactoryPanel({game,onSaved,slot}:{game:GameState;onSaved:(s:GameState)=>void;slot:string}){
 const [quantity,setQuantity]=useState(1);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("試作デモ：資本金・部品在庫の投入後に製造");
 const initialize=async()=>{if(busy)return;setBusy(true);try{
  if(game.production||game.journals.length)throw new Error("既存の経営データがあるため初期化を中止しました");
  const funded=dispatch(game,{id:"demo-capital",kind:"PostJournal",journal:{id:"demo-capital-j",companyId:"player",month:yearMonth(game.calendar),description:"Demo capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]}}).state;
  const next={...funded,production:{materials:[{partId:"block",quantity:50},{partId:"piston",quantity:200}],completedOrders:[]}};
  await saveAtomic(slot,next);onSaved(next);setMessage("初期資金と部品在庫を保存しました");
 }catch(e){setMessage(String(e));}finally{setBusy(false);}};
 const produce=async()=>{if(busy)return;setBusy(true);try{
  const next=manufactureEngines(game,program,"factory:"+game.revision,quantity,bom,quantity,1000,98);
  await saveAtomic(slot,next);onSaved(next);setMessage(quantity+"基を製造し、在庫と会計を保存しました");
 }catch(e){setMessage(String(e));}finally{setBusy(false);}};
 return <section><h2>エンジン製造（デモ）</h2><p>完成指示：{game.production?.completedOrders.length??0}件 / ブロック在庫：{game.production?.materials.find(m=>m.partId==="block")?.quantity??0}</p><label>製造数量<input type="number" min="1" max="50" value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label><div className="actions"><button disabled={busy} onClick={()=>void initialize()}>デモ資本金・部品在庫を設定</button><button disabled={busy} onClick={()=>void produce()}>製造・仕訳・保存</button></div><p aria-live="polite" aria-label="工場操作結果">{message}</p><small>デモ専用です。実際の調達・工場能力・完成品販売は未実装。</small></section>;
}
