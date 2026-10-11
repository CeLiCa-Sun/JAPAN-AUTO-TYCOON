import {test,expect} from "@playwright/test";

test("deployed browser game can procure, manufacture, sell, save and reload",async({page})=>{
  const url=process.env.PLAYWRIGHT_LIVE_URL!;
  const response=await page.goto(url,{waitUntil:"domcontentloaded"});
  expect(response?.ok()).toBe(true);
  const expectedSha=process.env.PLAYWRIGHT_LIVE_SHA;
  if(!expectedSha)throw new Error("PLAYWRIGHT_LIVE_SHA required for release acceptance");
  await expect(page.locator('meta[name="jat-release-sha"]')).toHaveAttribute("content",expectedSha);
  await expect(page.getByText("JAPAN AUTO TYCOON",{exact:true})).toBeVisible();
  const panel=page.getByRole("region",{name:"経営サイクル試作"});
  await expect(panel.getByText("初回プレイガイド")).toBeVisible();
  await panel.getByRole("button",{name:"1. 新規経営デモ開始"}).click();
  await expect(panel.getByText(/経営デモを開始しました/)).toBeVisible();
  await panel.getByRole("button",{name:"2. 部品を発注・納入"}).click();
  await expect(panel.getByText(/買掛金と仕入原価を計上/)).toBeVisible();
  await panel.getByRole("button",{name:"3. エンジン製造"}).click();
  await expect(panel.getByText(/2基を製造/)).toBeVisible();
  await panel.getByRole("button",{name:"4. 完成品を販売"}).click();
  await expect(panel.getByText(/需要内で完成品を販売/)).toBeVisible();
  await panel.getByRole("button",{name:"5. 仕入代金を支払う"}).click();
  await expect(panel.getByText(/買掛金を現金で支払いました/)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("status")).toContainText("前回の経営データを自動復元しました");
  await expect(page.getByRole("link",{name:"経営サイクルを遊ぶ"})).toBeVisible();
  await page.getByRole("button",{name:"読み込み",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("保存データを読み込みました");
  await expect(panel.getByText("0基",{exact:true})).toBeVisible();
  await expect(panel.getByText("840,000円",{exact:true})).toBeVisible();
  await expect(page.getByText("年月：1950-01")).toBeVisible();

  await page.getByRole("button",{name:"1ヶ月進行"}).click();
  await expect(page.getByText("年月：1950-02")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("自動保存済み");
  await page.getByRole("button",{name:"保存",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("保存しました");
  await page.reload();
  await page.getByRole("button",{name:"読み込み",exact:true}).click();
  await expect(page.getByText("年月：1950-02")).toBeVisible();
  if(page.viewportSize() && page.viewportSize()!.width<600){
    const preset=panel.getByRole("button",{name:"350,000円"});
    await preset.click();
    await expect(preset).toHaveAttribute("aria-pressed","true");
    await expect(panel.getByRole("spinbutton",{name:/販売単価/})).toHaveValue("350000");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
