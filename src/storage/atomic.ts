import type {GameState} from "../core/types";
import {validateGameState} from "../core/validation";
const DB="japan-auto-tycoon",STORE="saves",MAX=3;
type Envelope={format:2;digest:string;payload:GameState};
const key=(slot:string,i:number)=>i===0?slot:`${slot}:generation:${i}`;
function open():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function hash(payload:GameState):Promise<string>{const bytes=new TextEncoder().encode(JSON.stringify(payload));const digest=await crypto.subtle.digest("SHA-256",bytes);return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,"0")).join("");}
async function pack(state:GameState):Promise<Envelope>{validateGameState(state);return {format:2,digest:await hash(state),payload:state};}
async function unpack(value:unknown):Promise<GameState>{if(!value||typeof value!=="object")throw new Error("Invalid envelope");const e=value as Partial<Envelope>;if(e.format!==2||typeof e.digest!=="string"||!e.payload)throw new Error("Invalid envelope");validateGameState(e.payload);if(await hash(e.payload)!==e.digest)throw new Error("Checksum mismatch");return e.payload;}
function getValue(db:IDBDatabase,slot:string):Promise<unknown>{return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).get(slot);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
export async function recoverAtomic(slot:string):Promise<{state:GameState|null;generation:number|null;legacy:boolean}>{
 if(!slot.trim())throw new Error("Empty slot");const db=await open();
 try{for(let i=0;i<MAX;i++){let value:unknown;try{value=await getValue(db,key(slot,i));}catch{continue;}if(value===undefined)continue;
 try{const state=await unpack(value);return {state,generation:i,legacy:false};}
 catch{if(i===0){try{validateGameState(value);return {state:value,generation:0,legacy:true};}catch{/* try backup */}}}
 }
 // Older backup.ts stored an unwrapped backup at slot+":backup". Recover it only after modern generations fail.
 try{const prior=await getValue(db,slot+":backup");if(prior!==undefined){validateGameState(prior);return {state:prior,generation:MAX,legacy:true};}}catch{/* no valid old backup */}
 return {state:null,generation:null,legacy:false};}finally{db.close();}
}
export async function saveAtomic(slot:string,state:GameState):Promise<void>{
 if(!slot.trim())throw new Error("Empty slot");const entry=await pack(state);const db=await open();
 try{
 const previous:Envelope[]=[];
 for(let i=0;i<MAX-1;i++){const value=await getValue(db,key(slot,i));if(value===undefined)continue;try{previous.push(await pack(await unpack(value)));}catch{try{validateGameState(value);previous.push(await pack(value));}catch{continue;}}}
 await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");const store=tx.objectStore(STORE);store.put(entry,key(slot,0));previous.forEach((x,i)=>store.put(x,key(slot,i+1)));for(let i=previous.length+1;i<MAX;i++)store.delete(key(slot,i));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
 }finally{db.close();}
}

export async function recoverBackupGeneration(slot:string):Promise<GameState>{
 if(!slot.trim())throw new Error("Empty slot");const db=await open();
 try{for(let i=1;i<MAX;i++){try{const v=await getValue(db,key(slot,i));if(v!==undefined)return await unpack(v);}catch{continue;}}}
 finally{db.close();}
 throw new Error("Valid backup generation unavailable");
}
