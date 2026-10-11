import {test,expect} from "@playwright/test";
test("reads legacy schemaVersion 1 save and migrates on next write",async({page})=>{
 await page.goto("/");
 await page.evaluate(async()=>{
  const old={schemaVersion:1,calendar:{year:1960,month:6},seed:195001,companies:[{id:"player",name:"日本自動車工業",founded:"1950-01"}],journals:[],completedCommandIds:[],revision:0};
  await new Promise<void>((resolve,reject)=>{
   const o=indexedDB.open("japan-auto-tycoon",1);
   o.onupgradeneeded=()=>{if(!o.result.objectStoreNames.contains("saves"))o.result.createObjectStore("saves");};
   o.onerror=()=>reject(o.error);
   o.onsuccess=()=>{const db=o.result,tx=db.transaction("saves","readwrite");tx.objectStore("saves").put(old,"slot-1");tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};
  });
 });
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText("年月：1960-06")).toBeVisible();
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 const result=await page.evaluate(async()=>new Promise<{format:number;year:number}>((resolve,reject)=>{
  const o=indexedDB.open("japan-auto-tycoon",1);o.onerror=()=>reject(o.error);
  o.onsuccess=()=>{const db=o.result,tx=db.transaction("saves","readonly"),q=tx.objectStore("saves").get("slot-1");q.onsuccess=()=>{resolve({format:q.result.format,year:q.result.payload.calendar.year});};q.onerror=()=>reject(q.error);tx.oncomplete=()=>db.close();};
 }));
 expect(result).toEqual({format:2,year:1960});
});
test("aborted IndexedDB write does not damage committed primary",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.evaluate(async()=>{
  await new Promise<void>((resolve,reject)=>{
   const o=indexedDB.open("japan-auto-tycoon",1);
   o.onerror=()=>reject(o.error);
   o.onsuccess=()=>{const db=o.result,tx=db.transaction("saves","readwrite");tx.objectStore("saves").put({format:2,digest:"invalid",payload:{}}, "slot-1");tx.abort();tx.onabort=()=>{db.close();resolve();};tx.onerror=()=>{/* abort also emits error; onabort handles expected rollback */};};
  });
 });
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存データを読み込みました");
 await expect(page.getByText("年月：1950-01")).toBeVisible();
});
