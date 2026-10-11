import {describe,it,expect} from "vitest";
import {evaluateResearch} from "../src/domains/engine/research";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
const base={id:"r",technologyLevel:1,budgetYen:1000000,testHours:100,octane:98,coolingCapacityKw:1000};
describe("engine research preview",()=>{
 it("deterministic at equal inputs",()=>expect(evaluateResearch(base,DEFAULT_ENGINE)).toEqual(evaluateResearch(base,DEFAULT_ENGINE)));
 it("requires minimum test hours",()=>expect(evaluateResearch({...base,testHours:1},DEFAULT_ENGINE).passed).toBe(false));
 it("reports uncalibrated status",()=>expect(evaluateResearch(base,DEFAULT_ENGINE).modelStatus).toBe("uncalibrated-preview"));
 it("rejects negative funding",()=>expect(()=>evaluateResearch({...base,budgetYen:-1},DEFAULT_ENGINE)).toThrow());
});
