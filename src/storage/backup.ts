import type {GameState} from "../core/types";
import {validateGameState} from "../core/validation";
import {saveGame,loadGame} from "./save";
/** Rolling copy scheme. Writes are individually transactional, not atomically grouped.
 * Failed primary saves leave the previous primary untouched; backup restoration is explicit. */
export async function saveWithBackup(slot:string,state:GameState):Promise<void>{
 validateGameState(state);
 const previous=await loadGame(slot).catch(()=>null);
 if(previous)await saveGame(slot+":backup",previous);
 await saveGame(slot,state);
}
export async function restoreBackup(slot:string):Promise<GameState>{
 const previous=await loadGame(slot+":backup");
 if(!previous)throw new Error("Backup unavailable");
 validateGameState(previous);
 return previous;
}
export async function loadWithRecovery(slot:string):Promise<{state:GameState|null;source:"primary"|"backup"|"none"}>{
 try{const state=await loadGame(slot);if(state)return {state,source:"primary"};}
 catch{const state=await restoreBackup(slot);return {state,source:"backup"};}
 try{const state=await restoreBackup(slot);return {state,source:"backup"};}catch{return {state:null,source:"none"};}
}
export function exportSave(state:GameState):string{validateGameState(state);return JSON.stringify(state);}
export function importSave(json:string):GameState{const value:unknown=JSON.parse(json);validateGameState(value);return value;}
