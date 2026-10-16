import {useEffect,useMemo,useState} from "react";
import {Info,ShieldAlert} from "lucide-react";
import {buildFootball22Scenario,focusPlayers,type ScenarioId} from "../lib/football22Model";
import type {PositionGroup} from "../data/footballPositionIntelligence";
import "./Football22Board.css";
export default function Football22Board({focusGroup}:{focusGroup:PositionGroup|null}){
 const [scenarioId,setScenarioId]=useState<ScenarioId>("PASS_COVER3");
 const [selectedId,setSelectedId]=useState("D_FS");
 const [expanded,setExpanded]=useState(true);
 const scenario=useMemo(()=>buildFootball22Scenario(scenarioId),[scenarioId]);
 const all=[...scenario.offense,...scenario.defense];
 const highlighted=focusPlayers(scenario,focusGroup);
 useEffect(()=>{
  if(highlighted.length&&!highlighted.includes(selectedId))setSelectedId(highlighted[0]);
 },[focusGroup,scenarioId]);
 const selected=all.find(p=>p.id===selectedId)??all[0];
 const related=scenario.interactions.filter(e=>e.from===selected.id||e.to===selected.id);
 return <section className="m27-film22" aria-label="11 on 11 football assignment lab" data-player-count={all.length} data-scenario={scenarioId}>
   <div className="m27-film22-head">
    <div><small>FILM ROOM / ASSIGNMENT INTELLIGENCE</small><h3>11 <em>vs</em> 11 <span>FIELD LAB</span></h3></div>
    <button type="button" onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded}>{expanded?"Collapse field":"Expand field"}</button>
   </div>
   <div className="m27-film22-tabs" role="group" aria-label="Football scenario">
    <button type="button" aria-pressed={scenarioId==="PASS_COVER3"} className={scenarioId==="PASS_COVER3"?"active":""} onClick={()=>setScenarioId("PASS_COVER3")}>Pass / Cover 3</button>
    <button type="button" aria-pressed={scenarioId==="RUN_OUTSIDE_ZONE"} className={scenarioId==="RUN_OUTSIDE_ZONE"?"active":""} onClick={()=>setScenarioId("RUN_OUTSIDE_ZONE")}>Run / Outside zone</button>
   </div>
   <p className="m27-film22-call">{scenario.formation} <strong>VS.</strong> {scenario.defensiveCall}</p>
   {expanded&&<>
    <div className="m27-film22-field" aria-label="22-player tactical field, click a position for assignment detail">
     <div className="m27-film22-midline" aria-hidden="true"><span>LINE OF SCRIMMAGE</span></div>
     <span className="m27-film22-end-label" aria-hidden="true">DEFENSE / 4-2-5</span>
     <span className="m27-film22-near-label" aria-hidden="true">OFFENSE / 11</span>
     {all.map(player=><button type="button" key={player.id}
      className={["m27-film22-player",player.side==="OFFENSE"?"offense":"defense",
       highlighted.includes(player.id)?"highlight":"",
       selected.id===player.id?"selected":""].join(" ")}
      style={{left:player.x+"%",top:player.y+"%"}} title={player.id+" · "+player.assignment}
      aria-pressed={selected.id===player.id}
      aria-label={player.id.replaceAll("_"," ")+": "+player.assignment}
      onClick={()=>setSelectedId(player.id)}>{player.label}</button>)}
    </div>
    <div className="m27-film22-legend"><span><i className="offense"/> Offense · 11 players</span><span><i className="defense"/> Defense · 11 players</span><span><i className="focused"/> Focus {focusGroup||"none"}</span></div>
    <article className="m27-film22-detail">
     <div><small>SELECTED RESPONSIBILITY</small><h4>{selected.id.replaceAll("_"," ")} <span>· {selected.side}</span></h4></div>
     <p><strong>Assignment</strong> {selected.assignment}</p>
     <p><strong>Read / key</strong> {selected.readKey}</p>
     <p><strong>Measure</strong> {selected.metric}</p>
     {related.length>0&&<div className="m27-film22-rel"><small>INTERACTIONS ({related.length})</small>
       {related.map(e=><p key={e.id}><b>{e.from.replaceAll("_"," ")} ↔ {e.to.replaceAll("_"," ")}</b> {e.readOrConflict}</p>)}</div>}
    </article>
   </>}
   <div className="m27-film22-proof"><ShieldAlert size={15}/><span>TACTICAL CONCEPT ONLY. Assignments and counterplay are coaching hypotheses—not decoded EA AI, physics or animation. No Madden 27 game runtime proof.</span></div>
   <div className="m27-film22-foot"><Info size={13}/> NFL 2026 rules + USA Football coaching reference; no team/player identity inferred. <a href="https://operations.nfl.com/rules-officiating/2026-nfl-rulebook/" target="_blank" rel="noopener noreferrer">NFL rules</a></div>
 </section>;
}