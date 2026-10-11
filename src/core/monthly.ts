import type {DomainEvent,GameState} from "./types";
import {dispatch} from "./reducer";
export type MonthlyPhase="instructions"|"economy"|"npc"|"research"|"procurement"|"production"|"sales"|"racing"|"finance"|"validate";
export const MONTHLY_PHASES:readonly MonthlyPhase[]=["instructions","economy","npc","research","procurement","production","sales","racing","finance","validate"];
export type PhaseHandler=(draft:Readonly<GameState>,phase:MonthlyPhase)=>{state:GameState;events:DomainEvent[]};
export interface MonthRun {state:GameState;events:DomainEvent[];stopped:boolean;executedPhases:MonthlyPhase[]}
/** In-memory candidate; caller persists only successful result. Business handlers not yet wired. */
export function runMonth(state:GameState,id:string,handlers:Partial<Record<MonthlyPhase,PhaseHandler>>={},pause:(events:DomainEvent[])=>boolean=()=>false):MonthRun{
 let draft=state;const events:DomainEvent[]=[];const executedPhases:MonthlyPhase[]=[];
 for(const phase of MONTHLY_PHASES){
  const h=handlers[phase];if(h){const result=h(draft,phase);draft=result.state;events.push(...result.events);}
  executedPhases.push(phase);
  if(pause(events))return {state:draft,events,stopped:true,executedPhases};
 }
 const result=dispatch(draft,{id,kind:"AdvanceMonth"});
 return {state:result.state,events:[...events,...result.events],stopped:false,executedPhases};
}
