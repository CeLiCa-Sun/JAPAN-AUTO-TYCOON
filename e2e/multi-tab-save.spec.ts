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
test("two same-origin tabs preserve primary and previous generation",async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a.goto("/"),b.goto("/")]);
 await a.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await a.getByRole("button",{name:"保存",exact:true}).click();
 await expect(a.getByRole("status")).toContainText("保存しました");
 await b.getByRole("button",{name:"保存",exact:true}).click();
 await expect(b.getByRole("status")).toContainText("保存しました");
 expect(await readGenerations(a)).toEqual([2,3]);
 await a.close();await b.close();
});
test("an older tab cannot overwrite a newer committed save",async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a.goto("/"),b.goto("/")]);
 await a.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"保存",exact:true}).click();
 await expect(b.getByRole("status")).toContainText("保存しました");
 await a.getByRole("button",{name:"保存",exact:true}).click();
 await expect(a.getByRole("status")).toContainText("Save conflict");
 expect(await readGenerations(a)).toEqual([-1,3]);
 await a.close();await b.close();
});
test("simultaneous saves are ordered when Web Locks is available",async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a.goto("/"),b.goto("/")]);
 const locked=await a.evaluate(()=>Boolean(navigator.locks?.request));
 test.skip(!locked,"Browser has no Web Locks cross-tab guarantee");
 await a.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await Promise.all([a.getByRole("button",{name:"保存",exact:true}).click(),b.getByRole("button",{name:"保存",exact:true}).click()]);
 await Promise.all([expect(a.getByRole("status")).toContainText(/保存しました|Save conflict/),expect(b.getByRole("status")).toContainText("保存しました")]);
 const months=await readGenerations(a);
 expect(months[months.length-1]).toBe(3);
 await a.close();await b.close();
});
