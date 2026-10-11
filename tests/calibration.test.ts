import {describe,it,expect} from "vitest";
import {evaluateCalibration} from "../src/domains/engine/calibration";
import {calculateEngine,DEFAULT_ENGINE} from "../src/domains/engine/calculation";
describe("measured-data calibration harness",()=>{
 it("zero error for synthetic reference - harness validation only",()=>{
  const points=[1500,3000,5000].map(rpm=>({rpm,powerKw:calculateEngine({...DEFAULT_ENGINE,rpm}).powerKw,source:"synthetic unit test"}));
  expect(evaluateCalibration(DEFAULT_ENGINE,points).meanAbsolutePercentageError).toBeCloseTo(0,8);
 });
 it("rejects nonexistent source labels",()=>expect(()=>evaluateCalibration(DEFAULT_ENGINE,[{rpm:1000,powerKw:10,source:""},{rpm:2000,powerKw:20,source:"x"},{rpm:3000,powerKw:30,source:"x"}])).toThrow());
});
