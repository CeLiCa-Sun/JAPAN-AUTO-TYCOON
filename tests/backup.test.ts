import {describe,it,expect} from "vitest";
import {initialState} from "../src/core/types";
import {exportSave,importSave} from "../src/storage/backup";
describe("Save JSON interchange",()=>{
 it("round-trips valid game",()=>{const s=initialState();expect(importSave(exportSave(s))).toEqual(s);});
 it("rejects corruption",()=>expect(()=>importSave('{"schemaVersion":1}')).toThrow());
 it("rejects bad JSON",()=>expect(()=>importSave("{bad")).toThrow());
});
