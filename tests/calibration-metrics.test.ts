import {describe,it,expect} from "vitest";
import {calculateEngine,DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {evaluateCalibration} from "../src/domains/engine/calibration";
const points=[1500,3000,5000].map(rpm=>({rpm,powerKw:calculateEngine({...DEFAULT_ENGINE,rpm}).powerKw,source:"synthetic—not laboratory measured"}));
describe("dyno error diagnostics",()=>{
 it("returns zero RMSE and zero signed bias for synthetic reference",()=>{
  const r=evaluateCalibration(DEFAULT_ENGINE,points);
  expect(r.rootMeanSquaredErrorKw).toBeCloseTo(0,8);
  expect(r.meanBiasKw).toBeCloseTo(0,8);
 });
 it("detects systematic bias instead of relying on only percentage error",()=>{
  const r=evaluateCalibration(DEFAULT_ENGINE,points.map(p=>({...p,powerKw:p.powerKw*1.1})));
  expect(r.rootMeanSquaredErrorKw).toBeGreaterThan(0);
  expect(r.meanBiasKw).toBeLessThan(0);
 });
 it("rejects duplicated RPM records",()=>{
  expect(()=>evaluateCalibration(DEFAULT_ENGINE,[points[0],points[1],points[1]])).toThrow(/Duplicate/);
 });
});
