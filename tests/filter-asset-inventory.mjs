import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const dir=fs.mkdtempSync(path.join(os.tmpdir(),"pile-leap-filter-"));
const input=path.join(dir,"fixture.tsv");
const output=path.join(dir,"out.json");
const header="\uFEFFname\tresType\tsuperbundle\tbundle\tcatalog\tcas\toffset\tsize\torigSize";
const lines=[
  header,
  "football/gameplay/attribsys/data/gameplay_tuning/tackle_contact\t1\tgameplay\t1\t0\t1\t100\t200\t200",
  "content/audio/stadium_crowd\t3\taudio\t3\t0\t3\t500\t600\t600"
];
fs.writeFileSync(input,lines.join("\n"),"utf8");
execFileSync(process.execPath,["scripts/gameplay-lab/filter-asset-inventory.mjs",input,output],{stdio:"pipe"});
const result=JSON.parse(fs.readFileSync(output,"utf8"));
assert.equal(result.count,1);
assert.equal(result.candidates[0].row.name,"football/gameplay/attribsys/data/gameplay_tuning/tackle_contact");
assert.equal(Object.prototype.hasOwnProperty.call(result.candidates[0].row,"\uFEFFname"),false);
fs.rmSync(dir,{recursive:true,force:true});
console.log("ASSET_FILTER_PASS");
