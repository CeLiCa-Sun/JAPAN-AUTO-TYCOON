import {test,expect} from "@playwright/test";
test("recovers historical slot:backup when primary and modern generations are absent",async({page})=>{
 await page.goto("/");
 await page.evaluate(async()=>{
  const old={schemaVersion:1,calendar:{year:1972,month:4},seed:195001,companies:[{id:"player",name:"日本自動車工業",founded:"1950-01"}],journals:[],completedCommandIds:[],revision:0};
  await new Promise<void>((resolve,reject)=>{
   const r=indexedDB.open("japan-auto-tycoon",1);
   r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains("saves"))r.result.createObjectStore("saves");};
   r.onerror=()=>reject(r.error);
   r.onsuccess=()=>{const db=r.result,tx=db.transaction("saves","readwrite");tx.objectStore("saves").put(old,"slot-1:backup");tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};
  });
 });
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText("年月：1972-04")).toBeVisible();
 await expect(page.getByRole("status")).toContainText("バックアップ世代");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.reload();
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText("年月：1972-04")).toBeVisible();
});
