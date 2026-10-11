import {useState} from "react";
import type {GameState} from "../core/types";
import {yearMonth} from "../core/types";
import {dispatch} from "../core/reducer";
import {financialSnapshot} from "../domains/finance/reports";
import {DEFAULT_ENGINE} from "../domains/engine/calculation";
import {manufactureEngines} from "../domains/engine/persistentProduction";
import {createPurchaseOrder,placePurchaseOrder,receivePurchasedParts,paySupplier} from "../domains/procurement/purchasing";
import {sellEnginesIntoMarket} from "../domains/market/marketSales";
import {estimateEngineMarket,REFERENCE_PRICE_YEN} from "../domains/market/engineMarket";
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
 const salePriceValid=Number.isSafeInteger(unitSalePrice)&&unitSalePrice>0;
 const market=salePriceValid?estimateEngineMarket(game,unitSalePrice,finished[0]?.remainingQuantity??0):null;
 const nextAction=!game.journals.length?"1. 新規経営デモ開始":finished.length?(market?.sellable?"4. 完成品を販売":"翌月に進む、または販売価格を下げる"):(available.find(m=>m.partId==="block")?.quantity??0)>0?"3. エンジン製造":finance.payable>0?"5. 仕入代金を支払う":"2. 部品を発注・納入";
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
  if(!market||market.sellable<1)throw new Error("その価格では購入需要がありません。販売価格を見直してください。");
  return sellEnginesIntoMarket(game,lot.orderId,unitSalePrice,"ui:sale:"+game.revision);
 },"需要内で完成品を販売し、売上・売上原価を計上しました");
 const pay=()=>apply(()=>{
  if(finance.payable<=0)throw new Error("未払の買掛金がありません");
  return paySupplier(game,finance.payable,"ui:pay:"+game.revision);
 },"仕入先への買掛金を現金で支払いました");

 const completedSteps=[game.journals.length>0,(game.production?.purchaseOrders?.length??0)>0,(game.production?.completedOrders?.length??0)>0,(game.marketSales?.reduce((n,s)=>n+s.quantity,0)??0)>0,finance.payable===0&&finance.revenue>0];
 const completedCount=completedSteps.filter(Boolean).length;
 return <section id="business-cycle" aria-label="経営サイクル試作">
  <h2>経営サイクル（プレイ試作）</h2>
  <p>資本金を投入し、部品を仕入れ、エンジンを製造して販売する小規模な経営デモです。</p>
  <div aria-label="プレイガイド">
   <h3>初回プレイガイド</h3>
   <p className="play-progress">今回の経営ステップ：<strong>{completedCount}/5 完了</strong></p>
   <p>次に押すボタン：<strong>{nextAction}</strong></p>
   <p>1. 初期資金 → 2. 部品の発注・受入 → 3. エンジン製造 → 4. 市場へ販売 → 5. 買掛金支払。残った在庫で繰り返し経営できます。</p>
   <small>既存データがある場合は先に「読み込み」で復元してください。旧デモの原価不明在庫とは混合できません。</small>
  </div>
  <div className="metrics">
   <div className="metric"><span>現金</span><strong>{yen(finance.cash)}</strong></div>
   <div className="metric"><span>買掛金</span><strong>{yen(finance.payable)}</strong></div>
   <div className="metric"><span>完成品</span><strong>{finished.reduce((n,l)=>n+l.remainingQuantity,0)}基</strong></div>
   <div className="metric"><span>未納品部品</span><strong>{outstanding}個</strong></div>
   <div className="metric"><span>累計売上</span><strong>{yen(finance.revenue)}</strong></div>
   <div className="metric"><span>累計損益</span><strong>{yen(finance.netIncome)}</strong></div>
  </div>
  <p>部品在庫：ブロック {available.find(m=>m.partId==="block")?.quantity??0}個、ピストン {available.find(m=>m.partId==="piston")?.quantity??0}個</p>
  <div className="actions"><button disabled={busy||game.journals.length>0||Boolean(game.production)} onClick={()=>void start()}>1. 新規経営デモ開始</button></div>
  <label>製造数量（1～10） <input type="number" inputMode="numeric" min="1" max="10" value={count} onChange={e=>setCount(Number(e.target.value))}/></label>
  <div className="actions">
   <button disabled={busy} onClick={()=>void procure()}>2. 部品を発注・納入</button>
   <button disabled={busy} onClick={()=>void manufacture()}>3. エンジン製造</button>
  </div>
  <label>販売単価（円／基） <input type="number" inputMode="numeric" min="1" step="1000" value={unitSalePrice} onChange={e=>setUnitSalePrice(Number(e.target.value))}/></label>
  <div className="price-presets" role="group" aria-label="販売単価の候補"><span>価格の目安</span>{([350000,420000,900000] as const).map(price=><button type="button" key={price} aria-pressed={unitSalePrice===price} onClick={()=>setUnitSalePrice(price)}>{yen(price)}</button>)}</div>
  <div aria-label="市場需要の試算">
   <h3>販売市場（簡易需要モデル）</h3>
   <p>競合の参考価格：{yen(REFERENCE_PRICE_YEN)} ／ 想定購入需要：{market?.maxBuyers??"-"}基 ／ 月内残需要：{market?.remainingBuyers??"-"}基 ／ 今回販売見込：{market?.sellable??"-"}基 ／ 売れ残り：{market?.unsold??"-"}基</p>
   <p>見込売上：{yen(market?.estimatedRevenueYen??0)}。価格が高いほど需要が減少します。</p>
   {market&&market.soldThisMonth>0&&<p>今月の販売済み：{market.soldThisMonth}基。月内の需要は販売ごとに減少し、翌月に更新されます。</p>}
   {finished.length>0&&market?.sellable===0&&<p role="note">この価格では今月の販売枠がありません。販売価格を下げるか、上部の「1ヶ月進行」で翌月へ進めてください。</p>}
  </div>
  <div className="actions">
   <button disabled={busy||!finished.length||!market?.sellable} onClick={()=>void sell()}>4. 完成品を販売</button>
   <button disabled={busy||finance.payable<=0} onClick={()=>void pay()}>5. 仕入代金を支払う</button>
  </div>
  <p aria-live="polite" aria-label="経営サイクル操作結果">{message}</p>
  <small>部品は即納、需要は架空の価格反応モデルです。顧客個別取引・競合企業AI・生産18工程の実行・税務は未実装です。操作は同一スロットに保存され、別タブの古いデータとの競合は拒否されます。</small>
 </section>;
}
