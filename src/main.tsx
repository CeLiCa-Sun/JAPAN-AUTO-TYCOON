import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {dispatch,advanceMonths} from "./core/reducer";
import {initialState,yearMonth} from "./core/types";
import {exportSave,importSave} from "./storage/backup";
import {Dashboard} from "./app/Dashboard";
import {EngineDesigner} from "./app/EngineDesigner";
import {FactoryPanel} from "./app/FactoryPanel";
import {BusinessCyclePanel} from "./app/BusinessCyclePanel";
import {saveAtomic,recoverAtomic,recoverBackupGeneration} from "./storage/atomic";
import "./style.css";
function App(){
 const [game,setGame]=useState(()=>initialState());
 const [status,setStatus]=useState("保存データを確認しています…");
 const [slot,setSlot]=useState("slot-1");
 const [ready,setReady]=useState(false);
 const [advancing,setAdvancing]=useState(false);
 // Recover only the default startup slot. All controls appear after recovery
 // so an asynchronous load cannot overwrite an early user command.
 useEffect(()=>{
  let active=true;
  void recoverAtomic("slot-1").then(result=>{
   if(!active)return;
   if(result.state){
    setGame(result.state);
    setStatus(result.generation===0?"前回の経営データを自動復元しました":result.generation===null?"保存データがありません":`バックアップ世代 ${result.generation} から自動復元しました。手動保存するまで元の保存内容は変更しません`);
   }else setStatus("新規データです。経営デモを開始できます");
  }).catch(error=>{if(active)setStatus("自動復元に失敗しました。必要に応じて「読み込み」をお試しください: "+String(error));})
   .finally(()=>{if(active)setReady(true);});
  return ()=>{active=false;};
 },[]);
 const advance=async(n:1|3|6|12)=>{
  if(advancing||!ready)return;
  setAdvancing(true);
  try{
   const id=`ui:${game.revision}`;
   const next=n===1?dispatch(game,{id,kind:"AdvanceMonth"}).state:advanceMonths(game,n,id).state;
   await saveAtomic(slot,next);
   setGame(next);
   setStatus(`${n}ヶ月進行しました（自動保存済み）`);
  }catch(e){setStatus("月次進行を保存できませんでした: "+String(e));}
  finally{setAdvancing(false);}
 };
 const save=async()=>{try{await saveAtomic(slot,game);setStatus("保存しました（前回データをバックアップ）");}catch(e){setStatus(String(e));}};
 const load=async()=>{try{const x=await recoverAtomic(slot);if(x.state)setGame(x.state);setStatus(x.generation===null?"保存データがありません":x.generation>0?"バックアップ世代 "+x.generation+" から読み込みました":"保存データを読み込みました");}catch(e){setStatus(String(e));}};
 const restore=async()=>{try{const x=await recoverBackupGeneration(slot);setGame(x);setStatus("バックアップを読み込みました（保存は未実施）");}catch(e){setStatus(String(e));}};
 const exportJson=()=>{const blob=new Blob([exportSave(game)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="japan-auto-tycoon-save.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 const importJson=async(file:File|null)=>{if(!file)return;try{setGame(importSave(await file.text()));setStatus("JSONを取り込みました（保存は未実施）");}catch(e){setStatus(String(e));}};
 if(!ready)return <div className="app"><header><strong>JAPAN AUTO TYCOON</strong></header><main><section aria-label="起動状況"><p role="status">{status}</p></section></main></div>;
 return <div className="app"><header><strong>JAPAN AUTO TYCOON</strong><small>Stage 0 基盤 / Stage 1 工学プレビュー</small></header>
 <nav className="quick-nav" aria-label="主要操作"><a href="#business-cycle">経営サイクルを遊ぶ</a><a href="#save-manager">セーブ管理</a></nav>
 <main>
 <section><h1>{game.companies[0]?.name??"不明な企業"}</h1><p>年月：{yearMonth(game.calendar)}</p><p>進行コマンド数：{game.revision}</p><div className="actions">{([1,3,6,12] as const).map(n=><button key={n} disabled={advancing} onClick={()=>void advance(n)}>{n}ヶ月進行</button>)}</div><small>月次進行は自動保存します。保存失敗時は進行を確定しません。</small></section>
 <section id="save-manager"><h2>セーブ管理</h2><p className="save-hint">起動時は「slot-1」を自動復元します。他のスロットは「読み込み」で切り替えてください。JSON出力で手元にも控えを保存できます。</p><label>スロット名 <input value={slot} onChange={e=>setSlot(e.target.value)} /></label><div className="actions"><button onClick={save}>保存</button><button onClick={load}>読み込み</button><button onClick={restore}>バックアップ復元</button><button onClick={exportJson}>JSON出力</button></div><label>JSON取り込み <input type="file" accept=".json,application/json" onChange={e=>void importJson(e.target.files?.[0]??null)} /></label><p role="status">{status}</p></section>
 <Dashboard game={game}/>
 <EngineDesigner/>
 <BusinessCyclePanel game={game} onSaved={setGame} slot={slot}/>
 <FactoryPanel game={game} onSaved={setGame} slot={slot}/>
 <section><h2>未実装・制約</h2><p>18工程の時間進行・実際の顧客市場・NPC企業の独立経営・レース・税務・実車走行は未実装。簡易需要モデルはゲーム内の仮定値です。月次進行はカレンダー主体で、経営イベントとの完全連動は未完成です。</p></section>
 </main></div>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/>);
