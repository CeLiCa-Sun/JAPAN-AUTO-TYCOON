import { describe,it,expect } from "vitest";
import { initialState } from "../src/core/types";
import { validateGameState } from "../src/core/validation";
import { advanceMonths } from "../src/core/reducer";
describe("Stage 0 safety checks",()=>{
 it("accepts a clean game",()=>expect(()=>validateGameState(initialState())).not.toThrow());
 it("rejects an invalid calendar",()=>expect(()=>validateGameState({...initialState(),calendar:{year:1950,month:13}})).toThrow());
 it("rejects duplicate command IDs",()=>expect(()=>validateGameState({...initialState(),completedCommandIds:["x","x"]})).toThrow());
 it("stops month batch after a requested checkpoint",()=>{const result=advanceMonths(initialState(),12,"batch",(s)=>s.calendar.month===3);expect(result.state.calendar).toEqual({year:1950,month:3});expect(result.events).toHaveLength(2);});
 it("does not mutate original input on failure",()=>{const original=initialState();expect(()=>advanceMonths(original,12,"",()=>false)).toThrow();expect(original.calendar).toEqual({year:1950,month:1});});
});
