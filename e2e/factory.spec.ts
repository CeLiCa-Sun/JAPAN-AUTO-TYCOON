import {test,expect} from "@playwright/test";
test("factory demo persists production, materials and journal across reload",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"デモ資本金・部品在庫を設定"}).click();
 await expect(page.getByText("初期資金と部品在庫を保存しました")).toBeVisible();
 await page.getByRole("button",{name:"製造・仕訳・保存"}).click();
 await expect(page.getByText("1基を製造し、在庫と会計を保存しました")).toBeVisible();
 await expect(page.getByText(/完成指示：1件 \/ ブロック在庫：49/)).toBeVisible();
 await page.reload();
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText(/完成指示：1件 \/ ブロック在庫：49/)).toBeVisible();
});
