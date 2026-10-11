import type { GameState } from "../core/types";
import { validateGameState } from "../core/validation";
const DB = "japan-auto-tycoon"; const STORE = "saves"; const VERSION = 1;
function openDB(): Promise<IDBDatabase> { return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB,VERSION);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
}); }
async function withStore<T>(mode:IDBTransactionMode, action:(s:IDBObjectStore,resolve:(v:T)=>void,reject:(e:unknown)=>void)=>void):Promise<T>{
 const db=await openDB();return new Promise<T>((resolve,reject)=>{const tx=db.transaction(STORE,mode);const s=tx.objectStore(STORE);let result:T;let has=false;tx.oncomplete=()=>{db.close();if(has)resolve(result);else reject(new Error("Save transaction produced no result"));};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error)};action(s,v=>{result=v;has=true;},reject);});
}
export async function saveGame(slot:string,state:GameState):Promise<void>{if (!slot.trim()) throw new Error("Empty slot"); validateGameState(state); await withStore<void>("readwrite",(s,resolve,reject)=>{const q=s.put(state,slot);q.onsuccess=()=>resolve(undefined);q.onerror=()=>reject(q.error);});}
export async function loadGame(slot:string):Promise<GameState|null>{if (!slot.trim()) throw new Error("Empty slot"); const value=await withStore<GameState|null>("readonly",(s,resolve,reject)=>{const q=s.get(slot);q.onsuccess=()=>resolve(q.result??null);q.onerror=()=>reject(q.error);}); if (value !== null) validateGameState(value); return value; }
