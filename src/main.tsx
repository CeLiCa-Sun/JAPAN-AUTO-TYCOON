import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import {dispatch,advanceMonths} from "./core/reducer";
import {initialState,yearMonth} from "./core/types";
import {exportSave,importSave} from "./storage/backup";
import {Dashboard} from "./app/Dashboard";
import {EngineDesigner} from "./app/EngineDesigner";
import {FactoryPanel} from "./app/FactoryPanel";
import {saveAtomic,recoverAtomic,recoverBackupGeneration} from "./storage/atomic";
import "./style.css";
function App(){
 const [game,setGame]=useState(()=>initialState());
 const [status,setStatus]=useState("Stage 0 / Stage 1 preview — 未検証");
 const [slot,setSlot]=useState("slot-1");
 const advance=(n:1|3|6|12)=>{try{
  const id=`ui:${game.revision}`;
  setGame(n===1?dispatch(game,{id,kind:"AdvanceMonth"}).state:advanceMonths(game,n,id).state);
  setStatus(`${n}ヶ月進行しました（試作）`);
 }catch(e){setStatus(String(e));}};
 const save=async()=>{try{await saveAtomic(slot,game);setStatus("保存しました（前回データをバックアップ）");}catch(e){setStatus(String(e));}};
 const load=async()=>{try{const x=await recoverAtomic(slot);if(x.state)setGame(x.state);setStatus(x.generation===null?"保存データがありません":x.generation>0?"バックアップ世代 "+x.generation+" から読み込みました":"保存データを読み込みました");}catch(e){setStatus(String(e));}};
 const restore=async()=>{try{const x=await recoverBackupGeneration(slot);setGame(x);setStatus("バックアップを読み込みました（保存は未実施）");}catch(e){setStatus(String(e));}};
 const exportJson=()=>{const blob=new Blob([exportSave(game)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="japan-auto-tycoon-save.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 const importJson=async(file:File|null)=>{if(!file)return;try{setGame(importSave(await file.text()));setStatus("JSONを取り込みました（保存は未実施）");}catch(e){setStatus(String(e));}};
 return <div className="app"><header><strong>JAPAN AUTO TYCOON</strong><small>Stage 0 基盤 / Stage 1 工学プレビュー</small></header><main>
 <section><h1>{game.companies[0]?.name??"不明な企業"}</h1><p>年月：{yearMonth(game.calendar)}</p><p>進行コマンド数：{game.revision}</p><div className="actions">{([1,3,6,12] as const).map(n=><button key={n} onClick={()=>advance(n)}>{n}ヶ月進行</button>)}</div></section>
 <section><h2>セーブ管理</h2><label>スロット名 <input value={slot} onChange={e=>setSlot(e.target.value)} /></label><div className="actions"><button onClick={save}>保存</button><button onClick={load}>読み込み</button><button onClick={restore}>バックアップ復元</button><button onClick={exportJson}>JSON出力</button></div><label>JSON取り込み <input type="file" accept=".json,application/json" onChange={e=>void importJson(e.target.files?.[0]??null)} /></label><p role="status">{status}</p></section>
 <Dashboard game={game}/>
 <EngineDesigner/>
 <FactoryPanel game={game} onSaved={setGame} slot={slot}/>
 <section><h2>未実装・制約</h2><p>工場・市場・NPC企業・レース・税務・実車走行は未実装。月次進行はカレンダー主体で、経営イベントとの完全連動は未完成です。</p></section>
 </main></div>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
