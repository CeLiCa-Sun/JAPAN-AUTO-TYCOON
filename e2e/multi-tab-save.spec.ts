import {test,expect} from "@playwright/test";
test("two same-origin tabs preserve previous save when writing the same slot",async({context})=>{
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a.goto("/"),b.goto("/")]);
 await a.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await b.getByRole("button",{name:"1ヶ月進行"}).click();
 await Promise.all([
  a.getByRole("button",{name:"保存",exact:true}).click(),
  b.getByRole("button",{name:"保存",exact:true}).click()
 ]);
 await Promise.all([
  expect(a.getByRole("status")).toContainText("保存しました"),
  expect(b.getByRole("status")).toContainText("保存しました")
 ]);
 const records=await a.evaluate(async()=>new Promise<Array<number>>((resolve,reject)=>{
  const request=indexedDB.open("japan-auto-tycoon",1);
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,tx=db.transaction("saves","readonly");
   const store=tx.objectStore("saves");
   const values=[store.get("slot-1"),store.get("slot-1:generation:1")];
   const out:number[]=[];
   for(const v of values){v.onsuccess=()=>out.push(v.result?.payload?.calendar?.month??-1);v.onerror=()=>reject(v.error);}
   tx.oncomplete=()=>{db.close();resolve(out)};
   tx.onerror=()=>{db.close();reject(tx.error)};
  };
 }));
 expect(records.slice().sort((x,y)=>x-y)).toEqual([2,3]);
 await a.close();await b.close();
});
