import { modIntelligenceCatalog, type ModCatalogEntry } from "../data/modIntelligence.js";
const concepts:Record<string,string[]>={
  visor:["helmet","equipment","face","gear","tint","eye"],
  helmet:["visor","uniform","gear","player","equipment"],
  cleat:["shoe","boots","footwear","equipment","gear"],
  shoe:["cleat","footwear","gear"],
  jersey:["uniform","sleeves","pants","equipment"],
  sleeve:["jersey","equipment","clothing","tattoo"],
  player:["roster","franchise","equipment","likeness"],
  faces:["portrait","likeness","hair","equipment","player"],
  tattoo:["skin","equipment","cosmetic","player"],
  draft:["rookie","rookies","class","franchise"],
  franchise:["roster","salary","progression","sim","draft"],
  authentic:["realistic","real","broadcast","presentation"],
  realism:["realistic","gameplay","simulation","presentation"],
  ratings:["attributes","roster","player","progression"],
  stats:["simulation","sim","franchise","ratings"],
  stadium:["field","jumbotron","entrance","environment","signage","boards"],
  ribbonboard:["stadium","ribbon","jumbotron","signage"],
  advertisements:["stadium","signage","advertising","ad"],
  broadcast:["camera","scorebug","presentation","music"],
  music:["audio","entrance","presentation","broadcast"],
  camera:["skycam","view","broadcast"],
  install:["mod","tools","manager","compilation"],
  build:["compiler","tool","source","code"],
  code:["parser","source","compiler","tools","repository"],
  pc:["windows","madden"],
};
function tokens(text:string):string[]{return text.toLowerCase().replace(/[^a-z0-9]+/g," ").split(/\s+/).filter(w=>w.length>2).slice(0,30);}
const exclude=new Set(["what","are","the","for","madden","please","want","make","some","with","mod","mods","that","would","how","can","get","into","from","does","new","and","where","all","which","change","add","give","this","need"]);
const stems=(s:string):string[]=>{const set=new Set([s]);if(s.endsWith("s")&&s.length>4)set.add(s.slice(0,-1));if(s.endsWith("ing")&&s.length>6)set.add(s.slice(0,-3));return[...set];};
export function matchModSearch(item:ModCatalogEntry,query:string):number{
 const words=tokens(query).filter(x=>!exclude.has(x));
 if(!words.length)return 1;
 const hay=[item.title,item.author,item.description,item.category,item.kind,item.caveat??"",item.language??"",item.paths??""].join(" ").toLowerCase();
 let score=0,hits=0;
 for(const word of words){
  const forms=new Set(stems(word));
  for(const [root,aliases] of Object.entries(concepts))if(forms.has(root)||aliases.includes(word)){forms.add(root);aliases.forEach(a=>forms.add(a));}
  let best=0;
  for(const form of forms){if(item.title.toLowerCase().includes(form))best=Math.max(best,4);else if(item.category.toLowerCase().includes(form))best=Math.max(best,3);else if(hay.includes(form))best=Math.max(best,2);}
  if(best>0)hits++;
  score+=best;
 }
 return hits>=Math.ceil(words.length*0.4)?score:0;
}
export function searchModCatalog(query:string,kind:"All"|"Community mod"|"Code & tools"="All",category="All"):ModCatalogEntry[]{
 return modIntelligenceCatalog
  .filter(item=>(kind==="All"||item.kind===kind)&&(category==="All"||item.category===category))
  .map(item=>({item,score:matchModSearch(item,query)}))
  .filter(x=>x.score>0)
  .sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title))
  .map(x=>x.item);
}
