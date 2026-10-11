import {describe,it,expect} from "vitest";
import {calculateEngine,DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {evaluateCalibration} from "../src/domains/engine/calibration";
describe("calibration input integrity",()=>{
 it("rejects outside-engine-range RPM before comparison",()=>{const a=[400,1500,3000].map(rpm=>({rpm,powerKw:10,source:"bench"}));expect(()=>evaluateCalibration(DEFAULT_ENGINE,a)).toThrow();});
 it("rejects physically inconsistent torque and power",()=>{const a=[1500,3000,5000].map(rpm=>({rpm,powerKw:10,torqueNm:200,source:"bench"}));expect(()=>evaluateCalibration(DEFAULT_ENGINE,a)).toThrow();});
 it("accepts consistent synthetic power and torque inputs",()=>{const a=[1500,3000,5000].map(rpm=>{const r=calculateEngine({...DEFAULT_ENGINE,rpm});return {rpm,powerKw:r.powerKw,torqueNm:r.torqueNm,source:"synthetic"};});expect(evaluateCalibration(DEFAULT_ENGINE,a).meanAbsolutePercentageError).toBeCloseTo(0);});
});
