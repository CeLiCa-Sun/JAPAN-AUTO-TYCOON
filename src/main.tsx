import React, {useState} from "react";import{createRoot}from"react-dom/client";
import {dispatch,advanceMonths} from "./core/reducer";
import {initialState,yearMonth} from "./core/types";
import {saveGame,loadGame} from "./storage/save";
import "./style.css";
function App(){const [game,setGame]=useState(()=>initialState());const [status,setStatus]=useState("Stage 0 — 基盤試作");
const advance=(n:1|3|6|12)=>{try{const id=`ui:${game.revision}`;setGame(n===1?dispatch(game,{id,kind:"AdvanceMonth"}).state:advanceMonths(game,n,id).state);}catch(e){setStatus(String(e));}};
return <div className="app"><header><strong>JAPAN AUTO TYCOON</strong><small>Stage 0 / 未完成</small></header><main><section><h1>{game.companies[0].name}</h1><p>年月：{yearMonth(game.calendar)}</p><p>進行ターン：{game.revision}</p><div className="actions">{([1,3,6,12] as const).map(n=><button key={n} onClick={()=>advance(n)}>{n}ヶ月進行</button>)}</div></section><section><h2>セーブ管理</h2><div className="actions"><button onClick={async()=>{try{await saveGame("slot-1",game);setStatus("保存しました");}catch(e){setStatus(String(e));}}}>保存</button><button onClick={async()=>{try{const x=await loadGame("slot-1");if(x){setGame(x);setStatus("読み込みました");}else setStatus("保存データなし");}catch(e){setStatus(String(e));}}}>読み込み</button></div><p role="status">{status}</p></section><section><h2>開発状況</h2><p>月次進行・会計骨格・IndexedDBの検証前試作。市場・工場・エンジン・NPC・レースは未実装です。</p></section></main></div>}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
