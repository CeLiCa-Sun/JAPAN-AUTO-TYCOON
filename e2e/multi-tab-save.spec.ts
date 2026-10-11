import {test,expect} from "@playwright/test";
async function readGenerations(page:import("@playwright/test").Page){
 return page.evaluate(async()=>new Promise<number[]>((resolve,reject)=>{
  const o=indexedDB.open("japan-auto-tycoon",1);o.onerror=()=>reject(o.error);
  o.onsuccess=()=>{
   const db=o.result,tx=db.transaction("saves","readonly"),store=tx.objectStore("saves");
   const values=[store.get("slot-1"),store.get("slot-1:generation:1")];
   const months:number[]=[];
   for(const v of values){v.onsuccess=()=>months.push(v.result?.payload?.calendar?.month??-1);v.onerror=()=>reject(v.error);}
   tx.oncomplete=()=>{db.close();resolve(months.sort((a,b)=>a-b));};
   tx.onerror=()=>{db.close();reject(tx.error);};
  };
 }));
}
test("autosaved months preserve the latest two generations across tabs",async({context})=>{
 const a=await context.newPage();
 await a.goto("/");
 await a.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(a.getByRole("status")).toContainText("自動保存済み");
 const b=await context.newPage();
 await b.goto("/");
 await expect(b.getByText("年月：1950-02")).toBeVisible();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(b.getByRole("status")).toContainText("自動保存済み");
 expect(await readGenerations(a)).toEqual([2,3]);
 await a.close();await b.close();
});
test("an older tab cannot overwrite a newer autosaved month",async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a.goto("/"),b.goto("/")]);
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(b.getByRole("status")).toContainText("自動保存済み");
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(b.getByRole("status")).toContainText("自動保存済み");
 await a.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(a.getByRole("status")).toContainText("Save conflict");
 await expect(a.getByText("年月：1950-01")).toBeVisible();
 expect(await readGenerations(a)).toEqual([2,3]);
 await a.close();await b.close();
});
test("simultaneous same-revision autosaves preserve a readable state",async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a.goto("/"),b.goto("/")]);
 const locked=await a.evaluate(()=>Boolean(navigator.locks?.request));
 test.skip(!locked,"Browser has no Web Locks cross-tab guarantee");
 await Promise.all([a.getByRole("button",{name:"1ヶ月進行"}).click(),b.getByRole("button",{name:"1ヶ月進行"}).click()]);
 await Promise.all([expect(a.getByRole("status")).toContainText("自動保存済み"),expect(b.getByRole("status")).toContainText("自動保存済み")]);
 const c=await context.newPage();
 await c.goto("/");
 await expect(c.getByText("年月：1950-02")).toBeVisible();
 await c.getByRole("button",{name:"1ヶ月進行"}).click();
 await expect(c.getByRole("status")).toContainText("自動保存済み");
 expect(await readGenerations(c)).toEqual([2,3]);
 await a.close();await b.close();await c.close();
});
