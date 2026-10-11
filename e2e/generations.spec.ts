import {test,expect} from "@playwright/test";
test("three rolling generations restore the most recent valid backup",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 for(let i=0;i<3;i++){
   await page.getByRole("button",{name:"1ヶ月進行"}).click();
   await expect(page.getByText(`年月：1950-0${i+2}`)).toBeVisible();
   await expect(page.getByRole("status")).toContainText("自動保存済み");
 }
 await page.getByRole("button",{name:"バックアップ復元"}).click();
 await expect(page.getByText("年月：1950-03")).toBeVisible();
});
test("corrupt primary and generation 1 recover generation 2",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 for(let i=0;i<2;i++){
  await page.getByRole("button",{name:"1ヶ月進行"}).click();
  await expect(page.getByText(`年月：1950-0${i+2}`)).toBeVisible();
  await expect(page.getByRole("status")).toContainText("自動保存済み");
 }
 await page.evaluate(async()=>new Promise<void>((resolve,reject)=>{
   const o=indexedDB.open("japan-auto-tycoon",1);o.onerror=()=>reject(o.error);
   o.onsuccess=()=>{const db=o.result,tx=db.transaction("saves","readwrite"),store=tx.objectStore("saves");
    for(const key of ["slot-1","slot-1:generation:1"])store.put({format:2,digest:"bad",payload:{}},key);
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
   };
 }));
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("バックアップ世代 2");
 await expect(page.getByText("年月：1950-01")).toBeVisible();
});
