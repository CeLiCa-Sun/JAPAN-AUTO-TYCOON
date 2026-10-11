import type {GameState} from "../core/types";
import {financialSnapshot} from "../domains/finance/reports";
import {calculateEngine,DEFAULT_ENGINE} from "../domains/engine/calculation";
export function Dashboard({game}:{game:GameState}){
 const finance=financialSnapshot(game.journals,"player");
 const engine=calculateEngine(DEFAULT_ENGINE);
 const cashHistory:{id:string;label:string;balance:number;change:number}[]=[];
 let runningCash=0;
 for(const j of game.journals){
  const change=j.entries.filter(e=>e.account==="cash").reduce((n,e)=>n+e.debit-e.credit,0);
  runningCash+=change;
  cashHistory.push({id:j.id,label:j.description,balance:runningCash,change});
  if(cashHistory.length>12)cashHistory.shift();
 }
 const maxCash=Math.max(1,...cashHistory.map(row=>Math.abs(row.balance)));
 const cards=[["現金",finance.cash],["売掛金",finance.receivable],["買掛金",finance.payable],["売上",finance.revenue],["当期損益（累計）",finance.netIncome]];
 const max=Math.max(1,...cards.map(x=>Math.abs(x[1] as number)));
 return <><section><h2>財務ダッシュボード（簡易）</h2><div className="metrics">{cards.map(([label,value])=><div className="metric" key={label}><span>{label}</span><strong>{Number(value).toLocaleString("ja-JP")} 円</strong><div className="bar" aria-hidden="true"><span style={{width:(Math.abs(Number(value))/max*100)+"%"}}/></div></div>)}</div><h3>現金残高の推移（直近12仕訳）</h3><div aria-label="現金残高推移">{cashHistory.length?cashHistory.map(h=><div className="metric" key={h.id}><span>{h.label}：{h.balance.toLocaleString("ja-JP")}円（{h.change>=0?"+":""}{h.change.toLocaleString("ja-JP")}円）</span><div className="bar" aria-hidden="true"><span style={{width:Math.abs(h.balance)/maxCash*100+"%"}}/></div></div>):<p>仕訳の登録後に表示します。</p>}</div><small>試算。勘定体系・期末処理・税務は未実装です。</small></section><section><h2>エンジン設計（基準モデル）</h2><p>直列4気筒、ボア70 mm、ストローク70 mm、3500 rpm</p><dl><dt>排気量</dt><dd>{engine.displacementCc.toFixed(1)} cc</dd><dt>推定出力</dt><dd>{engine.powerKw.toFixed(1)} kW</dd><dt>推定トルク</dt><dd>{engine.torqueNm.toFixed(1)} Nm</dd><dt>推定燃料消費</dt><dd>{engine.fuelKgHour.toFixed(2)} kg/h</dd></dl><small>モデル {engine.modelVersion}。一定吸気条件・効率を仮定した推定値で、実測値ではありません。</small></section></>;
}
