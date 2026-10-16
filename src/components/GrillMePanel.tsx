import {useEffect,useState} from "react";
import {CheckCircle2,ChevronLeft,ShieldAlert} from "lucide-react";
import {currentGrillQuestion,type Session,type OptionId,type GridironSpecV2} from "../lib/grillMeFlow";
import "./GrillMePanel.css";
export default function GrillMePanel({session,brief,onChoose,onBack,onConfirm}:{
 session:Session;brief:GridironSpecV2|null;
 onChoose:(option:OptionId,custom?:string)=>void;onBack:()=>void;onConfirm:()=>void
}){
 const [customOpen,setCustomOpen]=useState(false);
 const [customText,setCustomText]=useState("");
 useEffect(()=>{setCustomOpen(false);setCustomText("");},[session.step,session.originalPrompt]);
 const q=currentGrillQuestion(session);
 return <section className="m27-grill" aria-label="GrillMe mod intent interview" data-grill-round={q.round}>
  <div className="m27-grill-heading"><div><span>GRILLME / INTENT ENGINE</span><strong>{q.label}</strong></div><div className="m27-grill-progress">{Math.min(session.step+1,4)} / 4</div></div>
  <div className="m27-grill-meter" aria-hidden="true"><span style={{width:String(Math.min((session.step+1)*25,100))+"%"}}/></div>
  {!brief ? <>
   <h2>{q.question}</h2><p className="m27-grill-why">{q.why}</p>
   {session.step<3 ? <div className="m27-grill-choices">
    {q.options.map(option=><button type="button" key={option.id} className="m27-grill-choice"
      onClick={()=>{if(option.id==="D")setCustomOpen(true);else onChoose(option.id);}}>
      <span className="m27-grill-letter">{option.id}</span><span className="m27-grill-choice-copy"><strong>{option.title}{option.recommended&&<small>RECOMMENDED</small>}</strong><span>{option.effect}</span><em>{option.feasibility}</em></span>
    </button>)}
    {customOpen&&<div className="m27-grill-custom"><label htmlFor="m27-grill-custom-text">Describe the exact custom behavior</label>
      <textarea id="m27-grill-custom-text" value={customText} maxLength={360} rows={3}
       onChange={e=>setCustomText(e.target.value)} placeholder="What should happen, in what situation, and what must stay unchanged?"/>
      <button type="button" disabled={customText.trim().length<8} onClick={()=>onChoose("D",customText)}>Use custom option D</button></div>}
   </div> : <div className="m27-grill-review">
     {(["MECHANISM","SITUATION","SEPARATION"] as const).map(key=><div key={key}><small>{key}</small><strong>{session.answers[key]?.title}</strong><p>{session.answers[key]?.customText||session.answers[key]?.effect}</p></div>)}
     <div className="m27-grill-notice"><ShieldAlert size={16}/> Confirmation approves a design brief, not a playable mod or game physics behavior.</div>
     <button className="m27-grill-confirm" type="button" onClick={onConfirm}><CheckCircle2 size={17}/> Confirm Mod Brief v2</button>
    </div>}
   {session.step>0&&<button className="m27-grill-back" type="button" onClick={onBack}><ChevronLeft size={14}/> Revise previous decision</button>}
  </> : <div className="m27-grill-complete" role="status"><CheckCircle2 size={20}/><div><strong>GRIDIRON_MOD_SPEC_V2 confirmed</strong><p>{brief.id} · {brief.readiness.replaceAll("_"," ")} · GAME ARTIFACT NOT BUILT · RUNTIME NOT RUN</p></div><button type="button" onClick={onBack}>Revise</button></div>}
  <footer>Football intent is not proof of Madden 27 engine access. All game bindings require independent verification.</footer>
 </section>;
}
