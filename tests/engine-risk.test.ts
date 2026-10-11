import {describe,it,expect} from "vitest";
import {evaluateResearch} from "../src/domains/engine/research";
import {DEFAULT_ENGINE} from "../src/domains/engine/calculation";
const project={id:"research",technologyLevel:2,budgetYen:1000000,testHours:100,octane:98,coolingCapacityKw:1000};
describe("engine research estimates",()=>{
 it("keeps estimated failure probability inside physical probability bounds",()=>{
  for(const hours of [0,100,1000,100000]){
   const r=evaluateResearch({...project,testHours:hours},DEFAULT_ENGINE);
   expect(r.estimatedFailureProbability).toBeGreaterThanOrEqual(0);
   expect(r.estimatedFailureProbability).toBeLessThanOrEqual(1);
  }
 });
 it("larger exposure cannot decrease estimated failure probability",()=>{
  const a=evaluateResearch({...project,testHours:100},DEFAULT_ENGINE);
  const b=evaluateResearch({...project,testHours:1000},DEFAULT_ENGINE);
  expect(b.estimatedFailureProbability).toBeGreaterThan(a.estimatedFailureProbability);
 });
 it("separates coolant load from total rejected heat and labels preview",()=>{
  const r=evaluateResearch(project,DEFAULT_ENGINE);
  expect(r.estimatedCoolantLoadKw).toBeCloseTo(r.thermalLossKw*0.30,8);
  expect(r.modelStatus).toBe("uncalibrated-preview");
 });
});
