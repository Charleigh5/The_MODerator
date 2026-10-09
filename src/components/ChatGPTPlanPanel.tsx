type Props={
  open:boolean;
  status:ChatGPTAuthStatus;
  models:ChatGPTModelOption[];
  selectedModel:string;
  busy:boolean;
  error:string|null;
  file:ModeratorLocalFile|null;
  onClose:()=>void;
  onSignIn:()=>void;
  onDisconnect:()=>void;
  onSelectModel:(model:string)=>void;
  onRefreshModels:()=>void;
  onPickFile:()=>void;
};

function formatBytes(bytes:number){
  if(bytes<1024)return `${bytes} B`;
  if(bytes<1024*1024)return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
}

export default function ChatGPTPlanPanel(props:Props){
  if(!props.open)return null;
  const {status}=props;
  return (
    <>
      <button aria-label="Close ChatGPT Plan panel" onClick={props.onClose} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" />
      <aside className="fixed right-4 top-4 bottom-4 z-[90] w-[min(430px,calc(100vw-32px))] overflow-y-auto rounded-xl border-2 border-maize-400/70 bg-navy-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl tracking-[0.12em] text-maize-400">CHATGPT PLAN</div>
            <div className="mt-1 text-sm text-chalk/60">Local intelligence bridge · no API key required for eligible plan usage</div>
          </div>
          <button onClick={props.onClose} className="rounded border border-navy-600 px-2 py-1 text-chalk/70 hover:border-maize-400/70">✕</button>
        </div>

        {!status.desktop && (
          <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">
            ChatGPT-plan usage runs in MODerator Desktop. The browser build keeps the deterministic compiler but cannot hold the local OAuth session.
          </div>
        )}

        {status.desktop && !status.connected && (
          <div className="space-y-4">
            <div className="rounded-lg border border-navy-600 bg-navy-900/70 p-4 text-sm leading-6 text-chalk/80">
              Sign in with the ChatGPT account that should power this installation. The authorization happens in your system browser and credentials are stored locally on this PC.
            </div>
            <button disabled={props.busy} onClick={props.onSignIn} className="w-full rounded-lg bg-maize-400 px-4 py-3 font-bold text-navy-950 disabled:opacity-50">
              {props.busy?"OPENING CHATGPT…":"CONTINUE WITH CHATGPT"}
            </button>
          </div>
        )}

        {status.desktop && status.connected && (
          <div className="space-y-5">
            <div className="rounded-lg border border-maize-400/30 bg-navy-900/70 p-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${status.planEnabled?"bg-emerald-400":"bg-amber-400"}`} />
                <span className="font-semibold text-chalk">{status.planEnabled?"Using ChatGPT plan":"Signed in · plan usage not granted"}</span>
              </div>
              <div className="mt-2 text-sm text-chalk/60">{status.name||status.email||"ChatGPT account"}</div>
              {status.email&&status.name&&<div className="text-xs text-chalk/40">{status.email}</div>}
            </div>

            {status.planEnabled && (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-maize-400/80">Model</label>
                <div className="flex gap-2">
                  <select value={props.selectedModel} onChange={(e)=>props.onSelectModel(e.target.value)} className="min-w-0 flex-1 rounded-md border border-navy-600 bg-navy-900 px-3 py-2 text-chalk">
                    {modelsOrFallback(props.models,props.selectedModel).map((m)=><option key={m.slug} value={m.slug}>{m.displayName}</option>)}
                  </select>
                  <button onClick={props.onRefreshModels} disabled={props.busy} className="rounded-md border border-navy-600 px-3 text-sm text-maize-300 disabled:opacity-50">↻</button>
                </div>
                <div className="mt-2 text-xs leading-5 text-chalk/45">The list comes from the models currently visible to this signed-in ChatGPT account.</div>
              </div>
            )}

            <div className="border-t border-navy-700 pt-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-maize-400/80">Local source</div>
              <button onClick={props.onPickFile} disabled={props.busy} className="w-full rounded-md border border-maize-400/40 bg-navy-900 px-3 py-2 text-left text-sm text-chalk hover:border-maize-400/70 disabled:opacity-50">
                {props.file?"CHANGE LOCAL FILE":"SELECT SAVE / MOD / SOURCE FILE"}
              </button>
              {props.file&&(
                <div className="mt-3 rounded-md bg-black/20 p-3 font-mono text-[11px] leading-5 text-chalk/65">
                  <div>{props.file.name} · {formatBytes(props.file.size)}</div>
                  <div className="break-all">SHA-256 {props.file.sha256}</div>
                  <div className="mt-1 text-emerald-300/80">Read-only inspection · original untouched</div>
                </div>
              )}
            </div>

            <button onClick={props.onDisconnect} disabled={props.busy} className="w-full rounded-md border border-red-400/30 px-3 py-2 text-sm text-red-200/80 hover:border-red-400/60 disabled:opacity-50">Disconnect this PC</button>
          </div>
        )}

        {props.error&&<div className="mt-4 rounded-md border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-100">{props.error}</div>}

        <div className="mt-5 border-t border-navy-700 pt-4 text-xs leading-5 text-chalk/45">
          ChatGPT sign-in does not give MODerator access to your ChatGPT conversations or memory. AI requests use the account and model you authorize; MODerator keeps game/save truth gated by its local evidence compiler.
        </div>
      </aside>
    </>
  );
}

function modelsOrFallback(models:ChatGPTModelOption[],selected:string){
  if(models.length)return models;
  return selected?[{slug:selected,displayName:selected}]:[{slug:"",displayName:"No model catalog loaded"}];
}
