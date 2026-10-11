import {test,expect} from "@playwright/test";
test("recovers valid previous generation after primary checksum corruption",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.getByRole("button",{name:"1ヶ月進行"}).click();
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.evaluate(async()=>{
  await new Promise<void>((resolve,reject)=>{
   const opening=indexedDB.open("japan-auto-tycoon",1);
   opening.onerror=()=>reject(opening.error);
   opening.onsuccess=()=>{
    const db=opening.result;const tx=db.transaction("saves","readwrite");
    const q=tx.objectStore("saves").get("slot-1");
    q.onsuccess=()=>{const value=q.result as {digest:string};value.digest="00".repeat(32);tx.objectStore("saves").put(value,"slot-1");};
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  });
 });
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("バックアップ世代 1");
 await expect(page.getByText("年月：1950-01")).toBeVisible();
});
test("reopens a valid save after reload",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"1ヶ月進行"}).click();
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.reload();
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText("年月：1950-02")).toBeVisible();
});
