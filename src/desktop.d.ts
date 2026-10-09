export {};

declare global {
  interface ChatGPTAuthStatus {
    desktop: boolean;
    connected: boolean;
    planEnabled: boolean;
    email?: string | null;
    name?: string | null;
    clientId?: string | null;
    expiresAt?: number | null;
  }
  interface ChatGPTModelOption { slug:string; displayName:string; }
  interface ModeratorLocalFile {
    path:string;
    name:string;
    extension:string;
    size:number;
    sha256:string;
    preview:string|null;
  }
  interface ModeratorDesktopBridge {
    isDesktop:true;
    auth:{
      status:()=>Promise<ChatGPTAuthStatus>;
      signIn:()=>Promise<ChatGPTAuthStatus>;
      disconnect:()=>Promise<ChatGPTAuthStatus>;
    };
    ai:{
      models:()=>Promise<ChatGPTModelOption[]>;
      chat:(request:{
        requestId:string;
        model:string;
        instructions:string;
        input:Array<{role:"user"|"assistant";content:string}>;
      })=>Promise<{requestId:string;text:string;model:string;completed:boolean}>;
      onDelta:(callback:(payload:{requestId:string;delta:string})=>void)=>()=>void;
    };
    files:{pick:()=>Promise<ModeratorLocalFile|null>};
  }
  interface Window { moderatorDesktop?:ModeratorDesktopBridge; }
}
