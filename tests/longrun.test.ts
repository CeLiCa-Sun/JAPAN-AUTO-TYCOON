import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {dispatch} from "../src/core/reducer";
describe("1200-month calendar smoke",()=>{
 it("reaches 2050-01 deterministically and remains valid",()=>{
  const start=initialState();let one=start;let two=initialState();
  for(let i=0;i<1200;i++){const cmd={id:"month-"+i,kind:"AdvanceMonth" as const};one=dispatch(one,cmd).state;two=dispatch(two,cmd).state;}
  expect(one.calendar).toEqual({year:2050,month:1});expect(one).toEqual(two);expect(start.calendar).toEqual({year:1950,month:1});
 });
});
