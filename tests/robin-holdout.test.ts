import {describe,it,expect} from "vitest";
import {fitPowerScaleHoldout} from "../src/domains/engine/holdout";
import type {MeasuredPoint} from "../src/domains/engine/calibration";
import type {EngineDesign} from "../src/domains/engine/calculation";
const source="Robin EY20D paper Table 4";
const engine:EngineDesign={cylinders:1,boreMm:67,strokeMm:52,compressionRatio:6.3,rpm:2500,volumetricEfficiency:0.8,thermalEfficiency:0.25,fuelLowerHeatingValueMJkg:43,airFuelRatio:14.7};
const p=(rpm:number,powerKw:number,torqueNm:number):MeasuredPoint=>({rpm,powerKw,torqueNm,source});
const train=[p(1000,0.51,4.87),p(2000,1.34,6.39),p(4000,3.36,8.02)];
const hold=[p(1500,0.87,5.54),p(2500,2.21,8.44)];
describe("Robin EY20D separated calibration",()=>{
 it("returns finite train and independent holdout errors",()=>{
  const r=fitPowerScaleHoldout(engine,train,hold);
  expect(r.scale).toBeGreaterThan(0);
  expect(r.train.count).toBe(3);expect(r.validation.count).toBe(2);
  expect(Number.isFinite(r.validation.rootMeanSquaredErrorKw)).toBe(true);
  expect(r.status).toBe("empirical-scalar-preview");
 });
 it("rejects overlapping training and validation RPMs",()=>{
  expect(()=>fitPowerScaleHoldout(engine,train,[train[0],hold[0]])).toThrow(/overlap/);
 });
});
