import {describe,it,expect} from "vitest";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {estimateReliability} from "../src/domains/engine/reliability";
describe("heuristic engine reliability",()=>{
 it("flags greater stress at higher RPM",()=>{const low=estimateReliability({...DEFAULT_ENGINE,rpm:3000},200,95),high=estimateReliability({...DEFAULT_ENGINE,rpm:7500},200,95);expect(high.stressIndex).toBeGreaterThan(low.stressIndex);});
 it("flags cooling deficit",()=>{const adequate=estimateReliability(DEFAULT_ENGINE,1000,95),poor=estimateReliability(DEFAULT_ENGINE,1,95);expect(poor.stressIndex).toBeGreaterThan(adequate.stressIndex);});
 it("rejects invalid coolant rating",()=>expect(()=>estimateReliability(DEFAULT_ENGINE,-1,95)).toThrow());
});
