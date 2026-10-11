import {describe,it,expect} from "vitest";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {estimateReliability} from "../src/domains/engine/reliability";
describe("thermal model boundary and regression",()=>{
 it("rejects NaN, infinite and nonpositive cooling capacity",()=>{for(const x of [NaN,Infinity,-Infinity,0,-1])expect(()=>estimateReliability(DEFAULT_ENGINE,x,95)).toThrow();});
 it("higher coolant capacity lowers estimated thermal stress",()=>{const poor=estimateReliability(DEFAULT_ENGINE,0.5,95),good=estimateReliability(DEFAULT_ENGINE,1000,95);expect(poor.stressIndex).toBeGreaterThan(good.stressIndex);});
 it("high octane reduces proxy knock risk",()=>{const engine={...DEFAULT_ENGINE,compressionRatio:12};expect(estimateReliability(engine,1000,100).knockRiskIndex).toBeLessThan(estimateReliability(engine,1000,90).knockRiskIndex);});
});
