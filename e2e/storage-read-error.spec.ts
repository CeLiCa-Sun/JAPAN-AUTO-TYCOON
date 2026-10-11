import {test,expect} from "@playwright/test";
test("IndexedDB read failure must be reported rather than treated as empty save",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>{
  const original=IDBObjectStore.prototype.get;
  IDBObjectStore.prototype.get=function(this:IDBObjectStore,...args:Parameters<IDBObjectStore["get"]>){
   if(this.name==="saves")throw new DOMException("Simulated read failure","UnknownError");
   return original.apply(this,args);
  };
 });
 await page.getByRole("button",{name:"読み込み",exact:true}).click();
 await expect(page.getByRole("status")).toContainText("Simulated read failure");
});
