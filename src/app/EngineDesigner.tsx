import {useMemo,useState} from "react";
import {calculateEngine,DEFAULT_ENGINE,type EngineDesign} from "../domains/engine/calculation";
import {engineCurve,DEFAULT_TUNING,type Tuning} from "../domains/engine/curve";
export function EngineDesigner(){
 const [d,setD]=useState<EngineDesign>(DEFAULT_ENGINE),[t,setT]=useState<Tuning>(DEFAULT_TUNING);
 const result=useMemo(()=>{try{return {points:engineCurve(d,t),base:calculateEngine(d),error:""};}catch(e){return {points:[],base:null,error:String(e)};}},[d,t]);
 const update=(key:keyof EngineDesign,value:number)=>setD(old=>({...old,[key]:value}));
 const W=520,H=180;const maxT=Math.max(1,...result.points.map(p=>p.torqueNm));const maxP=Math.max(1,...result.points.map(p=>p.powerKw));
 const poly=(kind:"torqueNm"|"powerKw",max:number)=>result.points.map((p,i)=>`${(i/Math.max(1,result.points.length-1)*W).toFixed(1)},${(H-10-p[kind]/max*(H-20)).toFixed(1)}`).join(" ");
 return <section className="engine-workspace"><h2>エンジン開発 — 試作モデル</h2><div className="engine-controls">
 {(["cylinders","boreMm","strokeMm","compressionRatio","rpm","volumetricEfficiency"] as const).map(key=><label key={key}>{({cylinders:"気筒数",boreMm:"ボア (mm)",strokeMm:"ストローク (mm)",compressionRatio:"圧縮比",rpm:"評価回転数",volumetricEfficiency:"基準容積効率"} as const)[key]}<input type="number" step={key==="volumetricEfficiency"?.05:1} value={d[key]} onChange={e=>update(key,Number(e.target.value))}/></label>)}
 <label>吸気仕様<select value={t.intake} onChange={e=>setT(o=>({...o,intake:e.target.value as Tuning["intake"]}))}><option value="standard">標準</option><option value="performance">高流量（暫定）</option></select></label>
 <label>排気仕様<select value={t.exhaust} onChange={e=>setT(o=>({...o,exhaust:e.target.value as Tuning["exhaust"]}))}><option value="standard">標準</option><option value="performance">高流量（暫定）</option></select></label>
 <label>ピーク回転数<input type="number" min="1500" max="8000" step="250" value={t.camPeakRpm} onChange={e=>setT(o=>({...o,camPeakRpm:Number(e.target.value)}))}/></label></div>
 {result.error?<p role="alert">{result.error}</p>:<><p>排気量 {result.base!.displacementCc.toFixed(0)} cc / {d.rpm} rpm 推定出力 {result.base!.powerKw.toFixed(1)} kW / トルク {result.base!.torqueNm.toFixed(1)} Nm</p><svg className="rpm-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="RPM別推定トルクと出力の曲線"><polyline fill="none" stroke="#60d7d4" strokeWidth="3" points={poly("torqueNm",maxT)}/><polyline fill="none" stroke="#f7c96b" strokeWidth="3" points={poly("powerKw",maxP)}/></svg><p className="chart-legend">青緑：推定トルク（最大値を100%）／黄：推定出力（最大値を100%）／左750rpm〜右7500rpm</p></>}
 <small>数学的な排気量・平均ピストン速度以外は仮定に基づく未較正の経験モデル。吸排気は暫定係数であり、実機性能を保証しません。</small></section>;
}
