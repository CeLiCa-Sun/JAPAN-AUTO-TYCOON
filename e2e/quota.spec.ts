import {test,expect} from "@playwright/test";
test("failed save preserves previous committed record",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("保存しました");
 await page.getByRole("button",{name:"1ヶ月進行"}).click();
 // Deterministic failure injection, NOT an actual device quota exhaustion test.
 await page.evaluate(()=>{
  const original=IDBObjectStore.prototype.put;
  Object.defineProperty(window,"__originalIdbPut",{value:original,configurable:true});
  IDBObjectStore.prototype.put=function(...args:Parameters<IDBObjectStore["put"]>){
   if(this.name==="saves")throw new DOMException("Simulated quota exceeded","QuotaExceededError");
   return original.apply(this,args);
  };
 });
 await page.getByRole("button",{name:"保存",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("QuotaExceededError");
 await page.evaluate(()=>{const original=(window as Window & {__originalIdbPut?:typeof IDBObjectStore.prototype.put}).__originalIdbPut;if(original)IDBObjectStore.prototype.put=original;});
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByText("年月：1950-01")).toBeVisible();
});
