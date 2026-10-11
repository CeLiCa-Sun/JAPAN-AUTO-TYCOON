import {test,expect} from "@playwright/test";

test("startup automatically restores the last playable business state",async({page})=>{
 await page.goto("/");
 const panel=page.getByRole("region",{name:"経営サイクル試作"});
 await panel.getByRole("button",{name:"1. 新規経営デモ開始"}).click();
 await expect(panel.getByText(/経営デモを開始しました/)).toBeVisible();
 await panel.getByRole("button",{name:"2. 部品を発注・納入"}).click();
 await expect(panel.getByText(/買掛金と仕入原価を計上/)).toBeVisible();
 await panel.getByRole("button",{name:"3. エンジン製造"}).click();
 await expect(panel.getByText(/2基を製造/)).toBeVisible();
 await page.reload();
 await expect(page.getByRole("status")).toContainText("前回の経営データを自動復元しました");
 await expect(panel.getByText("2基",{exact:true})).toBeVisible();
 await expect(panel.getByRole("button",{name:"1. 新規経営デモ開始"})).toBeDisabled();
});

test("monthly advance is atomically saved and loaded without a manual click",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"12ヶ月進行"}).click();
 await expect(page.getByRole("status")).toContainText("自動保存済み");
 await expect(page.getByText("年月：1951-01")).toBeVisible();
 await page.reload();
 await expect(page.getByText("年月：1951-01")).toBeVisible();
 await expect(page.getByRole("status")).toContainText("自動復元しました");
});

test("mobile layout has reachable management actions and quick price choices",async({page,isMobile})=>{
 test.skip(!isMobile,"Mobile viewport regression only");
 await page.goto("/");
 const viewport=page.viewportSize();
 expect(viewport).not.toBeNull();
 const play=page.getByRole("link",{name:"経営サイクルを遊ぶ"});
 await expect(play).toBeVisible();
 await play.click();
 const panel=page.getByRole("region",{name:"経営サイクル試作"});
 await expect(panel).toBeInViewport();
 const preset=panel.getByRole("button",{name:"900,000円"});
 await preset.click();
 await expect(preset).toHaveAttribute("aria-pressed","true");
 await expect(panel.getByRole("spinbutton",{name:/販売単価/})).toHaveValue("900000");
 const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
 expect(fits).toBe(true);
 const box=await panel.getByRole("button",{name:"1. 新規経営デモ開始"}).boundingBox();
 expect(box).not.toBeNull();
 expect(box!.height).toBeGreaterThanOrEqual(44);
});
