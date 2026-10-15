import {homedir} from "node:os";
import {join} from "node:path";
import {runCollector} from "./collector.mjs";
const folder=process.env.MODERATOR_WATCH_DATA_DIR||
  join(process.env.APPDATA||join(homedir(),"AppData","Roaming"),"moderator-desktop","mod-watch");
try{
 const receipt=await runCollector({folder});
 console.log(JSON.stringify({task:"MODERATOR_MADDEN27_WATCH",storage:folder,...receipt}));
 if(receipt.status==="FAILED_ALL_SOURCES")process.exitCode=2;
 else if(receipt.status==="PARTIAL")process.exitCode=1;
}catch(err){
 console.error(JSON.stringify({task:"MODERATOR_MADDEN27_WATCH",status:"ERROR",code:String(err?.message??"UNKNOWN").slice(0,150)}));
 process.exitCode=3;
}
