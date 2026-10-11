import {describe,it,expect} from "vitest";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
import {runEngineTrial,estimateManufacturingCostYen} from "../src/domains/engine/program";
const program={id:"proto",technologyLevel:2,design:DEFAULT_ENGINE,prototypeHours:100,developmentBudgetYen:50000000};
describe("engine program prototype",()=>{
 it("produces bounded positive power and cost",()=>{const t=runEngineTrial(program,1000,95);expect(t.powerKw).toBeGreaterThan(0);expect(estimateManufacturingCostYen(program,1000)).toBeGreaterThan(0);});
 it("reduces allocated tooling cost at greater volume",()=>expect(estimateManufacturingCostYen(program,10000)).toBeLessThan(estimateManufacturingCostYen(program,1000)));
 it("rejects invalid volume",()=>expect(()=>estimateManufacturingCostYen(program,0)).toThrow());
});
