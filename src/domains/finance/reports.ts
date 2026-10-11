import type {Account, JournalTransaction} from "../../core/types";
import {validateJournal} from "./ledger";
export const ACCOUNTS: Account[]=["cash","equity","revenue","expense","inventory","receivable","payable","loan","fixedAsset","accumulatedDepreciation"];
export interface TrialBalanceRow {account:Account; debit:number; credit:number; net:number}
export function trialBalance(journals:JournalTransaction[],companyId:string):TrialBalanceRow[]{
  const amounts=new Map<Account,number>(ACCOUNTS.map(a=>[a,0]));
  for(const j of journals.filter(j=>j.companyId===companyId)){
    validateJournal(j);
    for(const e of j.entries) amounts.set(e.account,amounts.get(e.account)!+e.debit-e.credit);
  }
  return ACCOUNTS.map(account=>{const net=amounts.get(account)!;return {account,net,debit:Math.max(net,0),credit:Math.max(-net,0)};});
}
export interface FinanceSnapshot {cash:number;receivable:number;payable:number;inventory:number;revenue:number;expenses:number;equity:number;netIncome:number;balanced:boolean}
export function financialSnapshot(journals:JournalTransaction[],companyId:string):FinanceSnapshot{
 const rows=trialBalance(journals,companyId);
 const net=(a:Account)=>rows.find(r=>r.account===a)!.net;
 const revenue=-net("revenue"),expenses=net("expense");
 const sum=rows.reduce((n,r)=>n+r.net,0);
 return {cash:net("cash"),receivable:net("receivable"),payable:-net("payable"),inventory:net("inventory"),revenue,expenses,equity:-net("equity"),netIncome:revenue-expenses,balanced:sum===0};
}
export type BusinessTransaction =
 | {kind:"capital";id:string;companyId:string;month:`${number}-${number}`;amount:number}
 | {kind:"invoice";id:string;companyId:string;month:`${number}-${number}`;amount:number}
 | {kind:"collection";id:string;companyId:string;month:`${number}-${number}`;amount:number}
 | {kind:"bill";id:string;companyId:string;month:`${number}-${number}`;amount:number}
 | {kind:"payment";id:string;companyId:string;month:`${number}-${number}`;amount:number};
export function businessJournal(t:BusinessTransaction, current:FinanceSnapshot):JournalTransaction{
 if(!Number.isSafeInteger(t.amount)||t.amount<=0)throw new Error("Positive integer yen required");
 if(t.kind==="collection"&&current.receivable<t.amount)throw new Error("Insufficient receivables");
 if(t.kind==="payment"&&current.payable<t.amount)throw new Error("Insufficient payables");
 if(t.kind==="payment"&&current.cash<t.amount)throw new Error("Insufficient cash");
 const pairs:Record<BusinessTransaction["kind"],[Account,Account]>={
  capital:["cash","equity"],invoice:["receivable","revenue"],collection:["cash","receivable"],bill:["expense","payable"],payment:["payable","cash"]
 };
 const [debit,credit]=pairs[t.kind];
 return {id:t.id,companyId:t.companyId,month:t.month,description:t.kind,entries:[{account:debit,debit:t.amount,credit:0},{account:credit,debit:0,credit:t.amount}]};
}
