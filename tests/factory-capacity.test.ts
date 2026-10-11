import {describe,it,expect} from "vitest";
import {ENGINE_FACTORY_STAGES,planFactoryBatch,type StageEquipment} from "../src/domains/engine/factoryCapacity";
const equipment=():StageEquipment[]=>ENGINE_FACTORY_STAGES.map(s=>({stageId:s.id,machines:2,cycleMinutes:30,setupMinutes:60,defectProbability:0,bookValueYen:120000,remainingLifeMonths:12}));
describe("18-stage capacity preview",()=>{
 it("computes bottleneck throughput depreciation and sequential work",()=>{
  const r=planFactoryBatch(10,equipment(),480);
  expect(r.stages).toBe(18);
  expect(r.monthlyCapacity).toBe(28);
  expect(r.feasible).toBe(true);
  expect(r.estimatedAccepted).toBe(10);
  expect(r.expectedDefects).toBe(0);
  expect(r.monthlyDepreciationYen).toBe(180000);
  expect(r.sequentialLeadMinutes).toBe(3780);
  expect(r.modelStatus).toBe("planning-preview");
 });
 it("identifies an overloaded bottleneck without silently completing orders",()=>{
  const e=equipment();e[8]={...e[8],machines:1,cycleMinutes:240};
  const r=planFactoryBatch(4,e,480);
  expect(r.bottleneck).toBe(e[8].stageId);
  expect(r.monthlyCapacity).toBe(1);
  expect(r.feasible).toBe(false);
 });
 it("rejects incomplete stage plans and invalid machine data",()=>{
  expect(()=>planFactoryBatch(1,equipment().slice(0,17),480)).toThrow();
  const e=equipment();e[0]={...e[0],remainingLifeMonths:0};
  expect(()=>planFactoryBatch(1,e,480)).toThrow();
 });
});
