import {test,expect} from "@playwright/test";
test("dashboard loads and advances one month",async({page})=>{
 await page.goto("/");
 await expect(page.getByText("JAPAN AUTO TYCOON",{exact:true})).toBeVisible();
 await expect(page.getByText("年月：1950-01")).toBeVisible();
 await page.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(page.getByText("年月：1950-02")).toBeVisible();
 await expect(page.getByText("財務ダッシュボード（簡易）")).toBeVisible();
});
test("save and load keeps the latest auto-saved month",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(page.getByRole("status")).toContainText("自動保存済み");
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText("年月：1950-02")).toBeVisible();
});
