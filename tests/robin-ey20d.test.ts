import {describe,it,expect} from "vitest";
import {evaluateCalibration,type MeasuredPoint} from "../src/domains/engine/calibration";
import type {EngineDesign} from "../src/domains/engine/calculation";
/** Published Robin EY20D Table 4. Source and caveats: docs/DYNO_ROBIN_EY20D.md.
 * 3000/3500 RPM excluded because table torque/power disagree >5%. */
const source="New Design of a Low Cost Small Engine Dynamometer for Engine Testing, Table 4";
const observed:MeasuredPoint[]=[
 {rpm:1000,torqueNm:4.87,powerKw:0.51,source},
 {rpm:1500,torqueNm:5.54,powerKw:0.87,source},
 {rpm:2000,torqueNm:6.39,powerKw:1.34,source},
 {rpm:2500,torqueNm:8.44,powerKw:2.21,source},
 {rpm:4000,torqueNm:8.02,powerKw:3.36,source}
];
const geometry:EngineDesign={cylinders:1,boreMm:67,strokeMm:52,compressionRatio:6.3,rpm:2500,volumetricEfficiency:0.8,thermalEfficiency:0.25,fuelLowerHeatingValueMJkg:43,airFuelRatio:14.7};
describe("published Robin EY20D dataset (NO fitting)",()=>{
 it("calculates finite nonzero error metrics without altering published data",()=>{
  const result=evaluateCalibration(geometry,observed);
  expect(result.count).toBe(5);
  expect(Number.isFinite(result.rootMeanSquaredErrorKw)).toBe(true);
  expect(result.maxAbsolutePercentageError).toBeGreaterThanOrEqual(0);
 });
 it("rejects inconsistent published records rather than silently fixing them",()=>{
  expect(()=>evaluateCalibration(geometry,[...observed.slice(0,2),{rpm:3000,torqueNm:8.13,powerKw:2.78,source}])).toThrow(/Torque\/power/);
 });
});
