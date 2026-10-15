const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("moderatorDesktop",{
  isDesktop:true,
  auth:{
    status:()=>ipcRenderer.invoke("moderator:auth-status"),
    signIn:()=>ipcRenderer.invoke("moderator:auth-sign-in"),
    disconnect:()=>ipcRenderer.invoke("moderator:auth-disconnect"),
  },
  ai:{
    models:()=>ipcRenderer.invoke("moderator:list-models"),
    chat:(request)=>ipcRenderer.invoke("moderator:chat",request),
    onDelta:(callback)=>{
      const handler=(_event,payload)=>callback(payload);
      ipcRenderer.on("moderator:ai-delta",handler);
      return()=>ipcRenderer.removeListener("moderator:ai-delta",handler);
    },
  },
  files:{pick:()=>ipcRenderer.invoke("moderator:pick-file")},
});
