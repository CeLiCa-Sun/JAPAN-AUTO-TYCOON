import {test,expect} from "@playwright/test";
test("factory state survives primary corruption through previous generation",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"デモ資本金・部品在庫を設定"}).click();
 await expect(page.getByText("初期資金と部品在庫を保存しました")).toBeVisible();
 await page.getByRole("button",{name:"製造・仕訳・保存"}).click();
 await expect(page.getByText(/完成指示：1件 \/ ブロック在庫：49/)).toBeVisible();
 await page.getByRole("button",{name:"製造・仕訳・保存"}).click();
 await expect(page.getByText(/完成指示：2件 \/ ブロック在庫：48/)).toBeVisible();
 await page.evaluate(async()=>new Promise<void>((resolve,reject)=>{
  const open=indexedDB.open("japan-auto-tycoon",1);
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{const db=open.result,tx=db.transaction("saves","readwrite"),store=tx.objectStore("saves");
   store.put({format:2,digest:"corrupt",payload:{}},"slot-1");
   tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
  };
 }));
 await page.reload();
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("バックアップ世代 1");
 await expect(page.getByText(/完成指示：1件 \/ ブロック在庫：49/)).toBeVisible();
});
test("demo initialization in a later month uses current journal period",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"1ヶ月進行"}).click();
 await page.getByRole("button",{name:"デモ資本金・部品在庫を設定"}).click();
 await expect(page.getByText("初期資金と部品在庫を保存しました")).toBeVisible();
 await page.getByRole("button",{name:"製造・仕訳・保存"}).click();
 await expect(page.getByText(/完成指示：1件/)).toBeVisible();
});
