import {useState} from "react";
import type {GameState} from "../core/types";
import {yearMonth} from "../core/types";
import {dispatch} from "../core/reducer";
import {financialSnapshot} from "../domains/finance/reports";
import {DEFAULT_ENGINE} from "../domains/engine/calculation";
import {manufactureEngines} from "../domains/engine/persistentProduction";
import {createPurchaseOrder,placePurchaseOrder,receivePurchasedParts,paySupplier} from "../domains/procurement/purchasing";
import {sellFinishedEngines} from "../domains/finance/finishedGoods";
import {saveAtomic} from "../storage/atomic";

const program={id:"market-demo-engine",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:100000};
const bom=[{id:"block",name:"エンジンブロック",unitsPerEngine:1,unitCostYen:20000},{id:"piston",name:"ピストン",unitsPerEngine:4,unitCostYen:3000}] as const;
const quotes=[
 {supplierId:"supplier-block",partId:"block",unitPriceYen:18000,leadMonths:0,minimumOrderQuantity:1},
 {supplierId:"supplier-piston",partId:"piston",unitPriceYen:2500,leadMonths:0,minimumOrderQuantity:1}
] as const;
const yen=(v:number)=>v.toLocaleString("ja-JP")+"円";

/** A deliberately small playable loop. Not an economy simulation or supplier market. */
export function BusinessCyclePanel({game,onSaved,slot}:{game:GameState;onSaved:(state:GameState)=>void;slot:string}){
 const [count,setCount]=useState(2);
 const [unitSalePrice,setUnitSalePrice]=useState(420000);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("最初に経営デモを開始し、部品の発注→製造→販売を試してください。");
 const finance=financialSnapshot(game.journals,"player");
 const outstanding=game.production?.purchaseOrders?.reduce((n,o)=>n+o.quantity-o.receivedQuantity,0)??0;
 const finished=game.production?.finishedLots?.filter(l=>l.remainingQuantity>0)??[];
 const available=game.production?.materials??[];
 const apply=async(action:()=>GameState,success:string)=>{
  if(busy)return;
  setBusy(true);
  try{
   const next=action();
   await saveAtomic(slot,next);
   onSaved(next);
   setMessage(success+"（セーブ済み）");
  }catch(error){setMessage(String(error));}
  finally{setBusy(false);}
 };
 const start=()=>apply(()=>{
  if(game.journals.length||game.production)throw new Error("新規データで開始してください。既存セーブを上書きしません。");
  const funded=dispatch(game,{id:"cycle:capital:"+game.revision,kind:"PostJournal",journal:{
   id:"cycle:capital-j:"+game.revision,companyId:"player",month:yearMonth(game.calendar),
   description:"Initial game capital",entries:[{account:"cash",debit:10000000,credit:0},{account:"equity",debit:0,credit:10000000}]
  }}).state;
  return {...funded,production:{materials:[],completedOrders:[],costLots:[],purchaseOrders:[],finishedLots:[]}};
 },"経営デモを開始しました");
 const procure=()=>apply(()=>{
  if(!Number.isSafeInteger(count)||count<1||count>10)throw new RangeError("製造数量は1～10です");
  if(finance.cash===0)throw new Error("先に経営デモを開始してください");
  if((game.production?.materials.length??0)>0&&!game.production?.costLots?.length)throw new Error("旧デモの原価不明在庫はこの経営サイクルで使用できません");
  let next=game;
  for(const quote of quotes){
   const units=count*(quote.partId==="piston"?4:1);
   const order=createPurchaseOrder("ui:po:"+next.revision,quote,units,next.calendar.year,next.calendar.month);
   next=placePurchaseOrder(next,order,"ui:order:"+next.revision);
   next=receivePurchasedParts(next,order,units,"ui:receipt:"+next.revision);
  }
  return next;
 },"部品を発注・受入し、買掛金と仕入原価を計上しました");
 const manufacture=()=>apply(()=>{
  if(!Number.isSafeInteger(count)||count<1||count>10)throw new RangeError("製造数量は1～10です");
  return manufactureEngines(game,program,"ui:work:"+game.revision,count,bom,count,1000,98);
 },count+"基を製造して完成品在庫を計上しました");
 const sell=()=>apply(()=>{
  if(!Number.isSafeInteger(unitSalePrice)||unitSalePrice<1)throw new RangeError("販売単価は正の整数で入力してください");
  const lot=finished[0];if(!lot)throw new Error("販売可能な完成品がありません");
  return sellFinishedEngines(game,lot.orderId,lot.remainingQuantity,unitSalePrice,"ui:sale:"+game.revision);
 },"完成品を販売し、売上・売上原価を計上しました");
 const pay=()=>apply(()=>{
  if(finance.payable<=0)throw new Error("未払の買掛金がありません");
  return paySupplier(game,finance.payable,"ui:pay:"+game.revision);
 },"仕入先への買掛金を現金で支払いました");

 return <section aria-label="経営サイクル試作">
  <h2>経営サイクル（プレイ試作）</h2>
  <p>資本金を投入し、部品を仕入れ、エンジンを製造して販売する小規模な経営デモです。</p>
  <div className="metrics">
   <div className="metric"><span>現金</span><strong>{yen(finance.cash)}</strong></div>
   <div className="metric"><span>買掛金</span><strong>{yen(finance.payable)}</strong></div>
   <div className="metric"><span>完成品</span><strong>{finished.reduce((n,l)=>n+l.remainingQuantity,0)}基</strong></div>
   <div className="metric"><span>未納品部品</span><strong>{outstanding}個</strong></div>
  </div>
  <p>部品在庫：ブロック {available.find(m=>m.partId==="block")?.quantity??0}個、ピストン {available.find(m=>m.partId==="piston")?.quantity??0}個</p>
  <div className="actions"><button disabled={busy||game.journals.length>0||Boolean(game.production)} onClick={()=>void start()}>1. 新規経営デモ開始</button></div>
  <label>製造数量（1～10） <input type="number" min="1" max="10" value={count} onChange={e=>setCount(Number(e.target.value))}/></label>
  <div className="actions">
   <button disabled={busy} onClick={()=>void procure()}>2. 部品を発注・納入</button>
   <button disabled={busy} onClick={()=>void manufacture()}>3. エンジン製造</button>
  </div>
  <label>販売単価（円／基） <input type="number" min="1" step="1000" value={unitSalePrice} onChange={e=>setUnitSalePrice(Number(e.target.value))}/></label>
  <div className="actions">
   <button disabled={busy||!finished.length} onClick={()=>void sell()}>4. 完成品を販売</button>
   <button disabled={busy||finance.payable<=0} onClick={()=>void pay()}>5. 仕入代金を支払う</button>
  </div>
  <p aria-live="polite" aria-label="経営サイクル操作結果">{message}</p>
  <small>部品は即納、販売価格は手入力、需要・顧客・生産18工程の実行・税務は未実装です。操作は同一スロットに保存され、別タブの古いデータとの競合は拒否されます。</small>
 </section>;
}
