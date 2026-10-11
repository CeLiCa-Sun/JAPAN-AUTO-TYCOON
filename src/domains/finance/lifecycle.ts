import type {JournalTransaction,YearMonth} from "../../core/types";
import {monthlyInterest,type Loan} from "./advanced";
import {financialSnapshot} from "./reports";
export interface AssetRegister {id:string;costYen:number;lifeMonths:number;depreciatedMonths:number}
export function repayment(loan:Loan,principalPayment:number,id:string,companyId:string,month:YearMonth,cashAvailable:number):{journal:JournalTransaction;remaining:Loan}{
 if(!Number.isSafeInteger(principalPayment)||principalPayment<0||principalPayment>loan.principalYen)throw new RangeError("Invalid repayment");
 const interest=monthlyInterest(loan),total=principalPayment+interest;
 if(total<=0||cashAvailable<total)throw new Error("Insufficient cash");
 const entries:JournalTransaction["entries"]=[];
 if(principalPayment)entries.push({account:"loan",debit:principalPayment,credit:0});
 if(interest)entries.push({account:"expense",debit:interest,credit:0});
 entries.push({account:"cash",debit:0,credit:total});
 return {journal:{id,companyId,month,description:"Loan installment",entries},remaining:{...loan,principalYen:loan.principalYen-principalPayment,remainingMonths:Math.max(1,loan.remainingMonths-1)}};
}
export function acquireAsset(id:string,companyId:string,month:YearMonth,cost:number,cash:number):JournalTransaction{
 if(!Number.isSafeInteger(cost)||cost<=0||cash<cost)throw new RangeError("Invalid asset purchase");
 return {id,companyId,month,description:"Capital expenditure",entries:[{account:"fixedAsset",debit:cost,credit:0},{account:"cash",debit:0,credit:cost}]};
}
export function depreciateAsset(asset:AssetRegister,id:string,companyId:string,month:YearMonth):{journal:JournalTransaction|null;asset:AssetRegister}{
 if(!Number.isSafeInteger(asset.costYen)||asset.costYen<1||!Number.isInteger(asset.lifeMonths)||asset.lifeMonths<1||!Number.isInteger(asset.depreciatedMonths)||asset.depreciatedMonths<0||asset.depreciatedMonths>asset.lifeMonths)throw new RangeError("Invalid asset register");
 if(asset.depreciatedMonths===asset.lifeMonths)return {journal:null,asset};
 const previous=Math.floor(asset.costYen*asset.depreciatedMonths/asset.lifeMonths);
 const next=Math.floor(asset.costYen*(asset.depreciatedMonths+1)/asset.lifeMonths);
 const amount=next-previous;
 if(amount===0)return {journal:null,asset:{...asset,depreciatedMonths:asset.depreciatedMonths+1}};
 return {journal:{id,companyId,month,description:"Scheduled depreciation",entries:[{account:"expense",debit:amount,credit:0},{account:"accumulatedDepreciation",debit:0,credit:amount}]},asset:{...asset,depreciatedMonths:asset.depreciatedMonths+1}};
}
export function cashPosition(journals:JournalTransaction[],companyId:string){return financialSnapshot(journals,companyId).cash;}
