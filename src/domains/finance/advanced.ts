import type {JournalTransaction,Account} from "../../core/types";
import {financialSnapshot} from "./reports";
export interface Loan {id:string;principalYen:number;annualRate:number;remainingMonths:number}
export function monthlyInterest(loan:Loan):number {
 if(!Number.isSafeInteger(loan.principalYen)||loan.principalYen<0||!Number.isFinite(loan.annualRate)||loan.annualRate<0||loan.annualRate>1||!Number.isInteger(loan.remainingMonths)||loan.remainingMonths<1)throw new RangeError("Invalid loan");
 return Math.round(loan.principalYen*loan.annualRate/12);
}
export function loanOrigination(id:string,companyId:string,month:`${number}-${number}`,amount:number):JournalTransaction {
 if(!Number.isSafeInteger(amount)||amount<=0)throw new RangeError("Invalid principal");
 return {id,companyId,month,description:"Loan drawdown",entries:[{account:"cash",debit:amount,credit:0},{account:"loan",debit:0,credit:amount}]};
}
export function depreciationJournal(id:string,companyId:string,month:`${number}-${number}`,cost:number,usefulLifeMonths:number):JournalTransaction{
 if(!Number.isSafeInteger(cost)||cost<=0||!Number.isInteger(usefulLifeMonths)||usefulLifeMonths<1)throw new RangeError("Invalid depreciation input");
 const amount=Math.floor(cost/usefulLifeMonths);
 if(amount===0)throw new RangeError("Monthly depreciation below 1 yen");
 return {id,companyId,month,description:"Depreciation (simplified straight-line)",entries:[{account:"expense",debit:amount,credit:0},{account:"accumulatedDepreciation",debit:0,credit:amount}]};
}
export function financialStatements(journals:JournalTransaction[],companyId:string){
 const snapshot=financialSnapshot(journals,companyId);
 const sums=new Map<Account,number>();
 for(const j of journals.filter(j=>j.companyId===companyId))for(const e of j.entries)sums.set(e.account,(sums.get(e.account)??0)+e.debit-e.credit);
 const net=(a:Account)=>sums.get(a)??0;
 const liabilities=snapshot.payable-net("loan");
 const assets=snapshot.cash+snapshot.receivable+snapshot.inventory+net("fixedAsset")+net("accumulatedDepreciation");
 const equity=snapshot.equity+snapshot.netIncome;
 return {profitAndLoss:{revenue:snapshot.revenue,expense:snapshot.expenses,netIncome:snapshot.netIncome},balanceSheet:{assets,liabilities,equity,difference:assets-liabilities-equity},cashFlow:{cash: snapshot.cash,periodCashFlow: snapshot.cash},isBalanced:Math.abs(assets-liabilities-equity)<0.0001};
}
