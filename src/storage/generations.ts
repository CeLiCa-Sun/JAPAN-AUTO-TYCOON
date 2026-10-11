import type {GameState} from "../core/types";
import {validateGameState} from "../core/validation";
import {saveGame,loadGame} from "./save";
/** Rolling three generations backed by the existing IndexedDB store. Sequential writes are NOT atomic together. */
export const GENERATIONS=3;
export async function saveGenerations(slot:string,state:GameState):Promise<void>{
 validateGameState(state);
 const prior:GameState[]=[];
 for(let i=0;i<GENERATIONS;i++){
  try{const s=await loadGame(i===0?slot:`${slot}:generation:${i}`);if(s)prior.push(s);}
  catch{ /* corrupted generation is excluded from rotation */ }
 }
 for(let i=Math.min(GENERATIONS-1,prior.length);i>=1;i--)await saveGame(`${slot}:generation:${i}`,prior[i-1]);
 await saveGame(slot,state);
}
export async function recoverGenerations(slot:string):Promise<{state:GameState|null;generation:number|null}>{
 for(let i=0;i<GENERATIONS;i++){
  try{const state=await loadGame(i===0?slot:`${slot}:generation:${i}`);if(state){validateGameState(state);return {state,generation:i};}}
  catch{continue;}
 }
 return {state:null,generation:null};
}
