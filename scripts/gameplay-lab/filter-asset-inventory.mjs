import fs from "node:fs";
const file=process.argv[2]; if(!file){console.error("usage: node scripts/gameplay-lab/filter-asset-inventory.mjs <ebx-or-res-tsv> [out.json]");process.exit(2);}
const out=process.argv[3]??"pile-leap-candidates.json";
const terms=["tackle","dive","lunge","hitstick","collision","contact","defender","reach","airborne","locomotion","rootmotion","root_motion","gameplay_tuning","jostle"];
const lines=fs.readFileSync(file,"utf8").split(/\r?\n/).filter(Boolean);
const header=lines[0].split("\t");
const rows=lines.slice(1).map((line)=>{const cells=line.split("\t");const text=line.toLowerCase();let score=0;const hits=[];for(const term of terms){if(text.includes(term)){score+=term.includes("_")||term.includes("root")?5:3;hits.push(term);}}return{score,hits,row:Object.fromEntries(header.map((h,i)=>[h,cells[i]??""]))};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
fs.writeFileSync(out,JSON.stringify({source:file,terms,count:rows.length,candidates:rows},null,2));
console.log(`wrote ${rows.length} candidates -> ${out}`);