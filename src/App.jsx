import { useState, useEffect, useReducer, createContext, useContext, useCallback, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --bg:#080808;--bg1:#0f0f0f;--bg2:#161616;--bg3:#1f1f1f;--bg4:#282828;
      --border:#252525;--border2:#383838;
      --text:#efefef;--text2:#888;--text3:#4a4a4a;
      --accent:#00e5b0;--accent2:#00b8e6;--warn:#e6a000;--success:#00c97a;
      --font-d:'Bebas Neue',sans-serif;
      --font-ui:'Rajdhani',sans-serif;
      --font-m:'IBM Plex Mono',monospace;
    }
    body{background:var(--bg);color:var(--text);font-family:var(--font-ui);min-height:100vh;overflow-x:hidden;}
    ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--bg1);}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
    input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:3px;background:var(--bg4);border-radius:2px;outline:none;cursor:pointer;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--accent);cursor:pointer;}
    input[type=number]{-moz-appearance:textfield;}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
    @keyframes fadeUp   {from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
    @keyframes fadeIn   {from{opacity:0;}to{opacity:1;}}
    @keyframes scaleIn  {from{opacity:0;transform:scale(.93);}to{opacity:1;transform:scale(1);}}
    @keyframes urgePulse{0%,100%{box-shadow:0 0 0 0 rgba(230,64,64,.35);}50%{box-shadow:0 0 0 14px rgba(230,64,64,0);}}
    @keyframes checkPop {0%{transform:scale(0);}60%{transform:scale(1.25);}100%{transform:scale(1);}}
    @keyframes cursor   {0%,100%{opacity:1;}50%{opacity:0;}}
    @keyframes revealUp {from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
    @keyframes shake    {0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-7px);}40%,80%{transform:translateX(7px);}}
    .fu {animation:fadeUp .35s ease both;}
    .fu1{animation:fadeUp .35s .06s ease both;}
    .fu2{animation:fadeUp .35s .12s ease both;}
    .fu3{animation:fadeUp .35s .18s ease both;}
    .fu4{animation:fadeUp .35s .24s ease both;}
    .fu5{animation:fadeUp .35s .30s ease both;}
    .modal-bg  {animation:fadeIn .2s ease;}
    .modal-card{animation:scaleIn .25s cubic-bezier(.34,1.56,.64,1);}
    .ob-logo {animation:revealUp .55s .15s cubic-bezier(.2,1,.3,1) both;}
    .ob-h1   {animation:revealUp .6s  .35s cubic-bezier(.2,1,.3,1) both;}
    .ob-h2   {animation:revealUp .6s  .50s cubic-bezier(.2,1,.3,1) both;}
    .ob-sub  {animation:revealUp .5s  .65s cubic-bezier(.2,1,.3,1) both;}
    .ob-inp  {animation:revealUp .5s  .78s cubic-bezier(.2,1,.3,1) both;}
    .ob-btn  {animation:revealUp .5s  .90s cubic-bezier(.2,1,.3,1) both;}
    .shake   {animation:shake .4s ease;}
  `}</style>
);

// ─── PRAYERS CONFIG ───────────────────────────────────────────────────────────
const PRAYERS_DATA = [
  {
    key:"fajr", name:"Fajr", arabic:"الفجر", time:"Dawn — Before Sunrise", color:"#6ea8fe",
    rows:[
      {field:"sunnahBefore",type:"sunnah",label:"Sunnah Qabliyya",rak:"2 rak'ah"},
      {field:"fard",        type:"fard",  label:"Fard",           rak:"2 rak'ah"},
    ],
  },
  {
    key:"dhuhr", name:"Dhuhr", nameFriday:"Jumu'ah",
    arabic:"الظهر", arabicFriday:"الجمعة",
    time:"Midday", timeFriday:"Friday Prayer",
    color:"#ffd166",
    rows:[
      {field:"sunnahBefore",type:"sunnah",label:"Sunnah Qabliyya", rak:"4 rak'ah"},
      {field:"fard",        type:"fard",  label:"Fard",             rak:"4 rak'ah"},
      {field:"sunnahAfter", type:"sunnah",label:"Sunnah Ba'diyya",  rak:"2 rak'ah"},
    ],
    rowsFriday:[
      {field:"sunnahBefore",type:"sunnah",label:"Sunnah Before Jumu'ah",rak:"2 rak'ah"},
      {field:"fard",        type:"fard",  label:"Jumu'ah (Fard)",        rak:"2 rak'ah"},
      {field:"sunnahAfter", type:"sunnah",label:"Sunnah After Jumu'ah",  rak:"4 rak'ah"},
    ],
  },
  {
    key:"asr", name:"Asr", arabic:"العصر", time:"Afternoon", color:"#ff9f40",
    rows:[
      {field:"sunnahBefore",type:"sunnah",label:"Sunnah Qabliyya",rak:"4 rak'ah"},
      {field:"fard",        type:"fard",  label:"Fard",           rak:"4 rak'ah"},
    ],
  },
  {
    key:"maghrib", name:"Maghrib", arabic:"المغرب", time:"After Sunset", color:"#ee6c4d",
    rows:[
      {field:"fard",       type:"fard",  label:"Fard",           rak:"3 rak'ah"},
      {field:"sunnahAfter",type:"sunnah",label:"Sunnah Ba'diyya",rak:"2 rak'ah"},
    ],
  },
  {
    key:"isha", name:"Isha", arabic:"العشاء", time:"Night", color:"#a29bfe",
    rows:[
      {field:"fard",       type:"fard",  label:"Fard",          rak:"4 rak'ah"},
      {field:"sunnahAfter",type:"sunnah",label:"Sunnah + Witr", rak:"2 + 3 rak'ah"},
    ],
  },
];

const QURAN_PAGES = 604;

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const getTodayDate  = () => new Date().toISOString().slice(0,10);
const uid           = () => Math.random().toString(36).slice(2,9);
const isFridayToday = () => new Date().getDay() === 5;
const calculateClarity = (streak) => Math.min(100, Math.round((streak/90)*100));
const getMostCommonTrigger = (triggers) => {
  const e = Object.entries(triggers);
  if (e.every(([,v])=>v===0)) return null;
  return e.sort((a,b)=>b[1]-a[1])[0][0];
};
const calculateControlIndex = (state) => {
  let s = 0; const today = getTodayDate();
  if (state.weight.history.some(h=>h.date===today)) s+=20;
  if (state.wake.tasks.length>0 && state.wake.tasks.every(t=>t.checked) && state.wake.lastCheck===today) s+=30;
  if (state.training.lastCheck===today) s+=30;
  const last = state.control.history[state.control.history.length-1];
  if (last?.date===today && last?.success) s+=20;
  return s;
};

// ─── DEFAULT TASKS ────────────────────────────────────────────────────────────
const MK_WAKE = () => [
  {id:uid(),label:"No phone for first 30 minutes",   checked:false},
  {id:uid(),label:"Drink 500ml water immediately",    checked:false},
  {id:uid(),label:"5 minutes of deep breathing",      checked:false},
  {id:uid(),label:"Cold exposure — shower or splash", checked:false},
  {id:uid(),label:"Write down 3 priorities for today",checked:false},
];
const MK_SLEEP = () => [
  {id:uid(),label:"No screens 30 min before bed",      checked:false},
  {id:uid(),label:"Dim all lights in the room",         checked:false},
  {id:uid(),label:"Journal 3 wins from today",          checked:false},
  {id:uid(),label:"Set tomorrow's top 3 priorities",    checked:false},
  {id:uid(),label:"5 min breathing or body scan",       checked:false},
];

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
const buildInitial = () => ({
  profile:  { name:"", onboarded:false },
  weight:   { current:null, history:[] },
  wake:     { tasks:MK_WAKE(), lastCheck:"" },
  training: { lastCheck:"" },
  sleep:    { tasks:MK_SLEEP(), tasksLastCheck:"", hours:null, lastCheck:"" },
  control:  { streak:0, best:0, lastCheck:"", history:[], triggers:{boredom:0,stress:0,lateNight:0,other:0} },
  prayers:  {},   // { "YYYY-MM-DD": { fajr:{ fard:bool, sunnahBefore:bool }, ... } }
  quran:    { logs:[] },
});

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function reorder(arr,id,dir){
  const a=[...arr]; const i=a.findIndex(t=>t.id===id);
  if(dir==="up"   && i>0)            [a[i-1],a[i]]=[a[i],a[i-1]];
  if(dir==="down" && i<a.length-1)   [a[i],a[i+1]]=[a[i+1],a[i]];
  return a;
}

function reducer(state, action){
  const today = getTodayDate();
  switch(action.type){

    /* PROFILE */
    case "SET_NAME": return {...state, profile:{name:action.name,onboarded:true}};

    /* WEIGHT */
    case "LOG_WEIGHT":{
      if(state.weight.history.some(h=>h.date===today)) return state;
      return{...state,weight:{current:action.value,history:[...state.weight.history,{date:today,value:action.value}]}};
    }

    /* WAKE TASKS */
    case "TOGGLE_WAKE_TASK":{
      const tasks=state.wake.tasks.map(t=>t.id===action.id?{...t,checked:!t.checked}:t);
      const allDone=tasks.length>0&&tasks.every(t=>t.checked);
      return{...state,wake:{...state.wake,tasks,lastCheck:allDone?today:state.wake.lastCheck}};
    }
    case "ADD_WAKE_TASK":    return{...state,wake:{...state.wake,tasks:[...state.wake.tasks,{id:uid(),label:action.label,checked:false}]}};
    case "DELETE_WAKE_TASK": return{...state,wake:{...state.wake,tasks:state.wake.tasks.filter(t=>t.id!==action.id)}};
    case "RENAME_WAKE_TASK": return{...state,wake:{...state.wake,tasks:state.wake.tasks.map(t=>t.id===action.id?{...t,label:action.label}:t)}};
    case "REORDER_WAKE_TASK":return{...state,wake:{...state.wake,tasks:reorder(state.wake.tasks,action.id,action.dir)}};

    /* TRAINING */
    case "COMPLETE_TRAINING":{
      if(state.training.lastCheck===today) return state;
      return{...state,training:{lastCheck:today}};
    }

    /* SLEEP TASKS */
    case "TOGGLE_SLEEP_TASK":{
      const tasks=state.sleep.tasks.map(t=>t.id===action.id?{...t,checked:!t.checked}:t);
      const allDone=tasks.length>0&&tasks.every(t=>t.checked);
      return{...state,sleep:{...state.sleep,tasks,tasksLastCheck:allDone?today:state.sleep.tasksLastCheck}};
    }
    case "ADD_SLEEP_TASK":    return{...state,sleep:{...state.sleep,tasks:[...state.sleep.tasks,{id:uid(),label:action.label,checked:false}]}};
    case "DELETE_SLEEP_TASK": return{...state,sleep:{...state.sleep,tasks:state.sleep.tasks.filter(t=>t.id!==action.id)}};
    case "RENAME_SLEEP_TASK": return{...state,sleep:{...state.sleep,tasks:state.sleep.tasks.map(t=>t.id===action.id?{...t,label:action.label}:t)}};
    case "REORDER_SLEEP_TASK":return{...state,sleep:{...state.sleep,tasks:reorder(state.sleep.tasks,action.id,action.dir)}};

    /* SLEEP HOURS */
    case "LOG_SLEEP":{
      if(state.sleep.lastCheck===today) return state;
      return{...state,sleep:{...state.sleep,hours:action.hours,lastCheck:today}};
    }

    /* CONTROL */
    case "CONTROL_SUCCESS":{
      if(state.control.lastCheck===today) return state;
      const ns=state.control.streak+1;
      return{...state,control:{...state.control,streak:ns,best:Math.max(state.control.best,ns),lastCheck:today,history:[...state.control.history,{date:today,success:true}]}};
    }
    case "CONTROL_FAIL":{
      if(state.control.lastCheck===today) return state;
      const tr={...state.control.triggers};
      if(action.trigger&&tr[action.trigger]!==undefined) tr[action.trigger]++;
      return{...state,control:{...state.control,streak:0,lastCheck:today,history:[...state.control.history,{date:today,success:false,trigger:action.trigger}],triggers:tr}};
    }
    case "CONTROL_OVERRIDE_FAIL":{
      const tr={...state.control.triggers};
      if(action.trigger&&tr[action.trigger]!==undefined) tr[action.trigger]++;
      const history=state.control.history.map((h,i)=>
        i===state.control.history.length-1&&h.date===today
          ?{date:today,success:false,trigger:action.trigger}:h
      );
      return{...state,control:{...state.control,streak:0,history,triggers:tr}};
    }

    /* PRAYERS */
    case "TOGGLE_PRAYER":{
      const{date,prayerKey,field}=action;
      const dayLog=state.prayers[date]||{};
      const pLog=dayLog[prayerKey]||{};
      return{...state,prayers:{...state.prayers,[date]:{...dayLog,[prayerKey]:{...pLog,[field]:!pLog[field]}}}};
    }

    /* QURAN */
    case "LOG_QURAN":
      return{...state,quran:{logs:[...state.quran.logs,action.entry]}};
    case "DELETE_QURAN_LOG":
      return{...state,quran:{logs:state.quran.logs.filter(l=>l.id!==action.id)}};

    case "RESET": return buildInitial();
    default: return state;
  }
}

// ─── STORE ────────────────────────────────────────────────────────────────────
const Ctx = createContext(null);
function StoreProvider({children}){
  const [state,dispatch]=useReducer(reducer,null,()=>{
    try{
      const raw=localStorage.getItem("tc_v4");
      if(!raw) return buildInitial();
      const saved=JSON.parse(raw);
      // Merge in case new fields were added
      const init=buildInitial();
      return{
        profile: saved.profile||init.profile,
        weight:  saved.weight||init.weight,
        wake:    saved.wake||init.wake,
        training:saved.training||init.training,
        sleep:   saved.sleep||init.sleep,
        control: saved.control||init.control,
        prayers: saved.prayers||init.prayers,
        quran:   saved.quran||init.quran,
      };
    }catch{return buildInitial();}
  });
  useEffect(()=>{try{localStorage.setItem("tc_v4",JSON.stringify(state));}catch{}},[state]);
  return <Ctx.Provider value={{state,dispatch}}>{children}</Ctx.Provider>;
}
const useStore=()=>useContext(Ctx);

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Card({children,style={},cls=""}){
  return<div className={cls} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"16px",padding:"22px",...style}}>{children}</div>;
}
function Label({children}){
  return<div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"14px",paddingBottom:"10px",borderBottom:"1px solid var(--border)"}}>{children}</div>;
}
function Stat({label,value,sub,accent}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"3px"}}>
      <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em"}}>{label}</div>
      <div style={{fontFamily:"var(--font-d)",fontSize:"34px",color:accent||"var(--text)"}}>{value??'—'}</div>
      {sub&&<div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)"}}>{sub}</div>}
    </div>
  );
}
function MiniStat({label,value,accent}){
  return(
    <div>
      <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.15em",marginBottom:"2px"}}>{label}</div>
      <div style={{fontFamily:"var(--font-d)",fontSize:"20px",color:accent||"var(--text)"}}>{value}</div>
    </div>
  );
}
const BTN_V={
  primary:  {background:"var(--accent)",color:"#000",border:"none"},
  secondary:{background:"transparent",color:"var(--text2)",border:"1px solid var(--border2)"},
  danger:   {background:"rgba(230,64,64,.1)",color:"#f87171",border:"1px solid rgba(230,64,64,.28)"},
  warn:     {background:"rgba(230,160,0,.09)",color:"var(--warn)",border:"1px solid rgba(230,160,0,.22)"},
  success:  {background:"rgba(0,201,122,.09)",color:"var(--success)",border:"1px solid rgba(0,201,122,.22)"},
  ghost:    {background:"var(--bg3)",color:"var(--text3)",border:"1px solid var(--border)"},
};
function Btn({children,onClick,variant="primary",style={},disabled=false}){
  return<button onClick={onClick} disabled={disabled} style={{padding:"12px 20px",borderRadius:"10px",fontFamily:"var(--font-ui)",fontSize:"13px",fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",cursor:disabled?"default":"pointer",opacity:disabled?.4:1,...BTN_V[variant],...style}}>{children}</button>;
}
function Tag({children,done}){
  return<span style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"3px 9px",borderRadius:"5px",fontFamily:"var(--font-m)",fontSize:"10px",background:done?"rgba(0,229,176,.07)":"rgba(255,255,255,.03)",color:done?"var(--accent)":"var(--text3)",border:`1px solid ${done?"rgba(0,229,176,.18)":"var(--border)"}`}}>{done?"✓":"·"} {children}</span>;
}
function IconBtn({children,onClick,disabled,danger,title}){
  return<button title={title} onClick={onClick} disabled={disabled} style={{width:"26px",height:"26px",borderRadius:"6px",flexShrink:0,background:danger?"rgba(230,64,64,.07)":"var(--bg4)",border:`1px solid ${danger?"rgba(230,64,64,.18)":"var(--border)"}`,color:danger?"#f87171":"var(--text3)",cursor:disabled?"default":"pointer",opacity:disabled?.25:1,fontSize:"11px",display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</button>;
}

// ─── TASK MANAGER ─────────────────────────────────────────────────────────────
function TaskManager({tasks,prefix,lastCheck,dispatch}){
  const [newLabel,setNewLabel]=useState("");
  const [editId,setEditId]=useState(null);
  const [editVal,setEditVal]=useState("");
  const ref=useRef(null);
  const today=getTodayDate();
  const checked=tasks.filter(t=>t.checked).length;
  const allDone=tasks.length>0&&checked===tasks.length;
  const done=allDone&&lastCheck===today;

  const handleAdd=()=>{
    const l=newLabel.trim(); if(!l) return;
    dispatch({type:`ADD_${prefix}_TASK`,label:l}); setNewLabel(""); ref.current?.focus();
  };
  const startEdit=(t)=>{setEditId(t.id);setEditVal(t.label);};
  const commitEdit=(id)=>{
    const l=editVal.trim(); if(l) dispatch({type:`RENAME_${prefix}_TASK`,id,label:l}); setEditId(null);
  };

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"13px"}}>
        <div style={{flex:1,height:"3px",background:"var(--bg4)",borderRadius:"2px"}}>
          <div style={{height:"100%",width:tasks.length?`${(checked/tasks.length)*100}%`:"0%",background:done?"var(--accent)":"var(--border2)",borderRadius:"2px",transition:"width .4s ease,background .3s"}}/>
        </div>
        <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:done?"var(--accent)":"var(--text3)",whiteSpace:"nowrap"}}>{checked}/{tasks.length}{done?" ✓":""}</span>
      </div>
      {done&&(
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"11px 14px",borderRadius:"10px",background:"rgba(0,229,176,.05)",border:"1px solid rgba(0,229,176,.14)",marginBottom:"13px"}}>
          <span style={{fontSize:"18px"}}>✓</span>
          <div>
            <div style={{fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:700,color:"var(--accent)"}}>Routine Complete</div>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"2px"}}>All tasks done — points applied.</div>
          </div>
        </div>
      )}
      <div style={{display:"grid",gap:"6px"}}>
        {tasks.map((task,idx)=>(
          <div key={task.id} style={{display:"flex",alignItems:"center",gap:"9px",padding:"10px 11px",borderRadius:"10px",background:task.checked?"rgba(0,229,176,.04)":"var(--bg3)",border:`1px solid ${task.checked?"rgba(0,229,176,.12)":"var(--border)"}`,transition:"all .18s"}}>
            <button onClick={()=>dispatch({type:`TOGGLE_${prefix}_TASK`,id:task.id})} style={{width:"22px",height:"22px",borderRadius:"6px",flexShrink:0,background:task.checked?"var(--accent)":"var(--bg4)",border:`1px solid ${task.checked?"var(--accent)":"var(--border2)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",color:"#000",fontWeight:700,animation:task.checked?"checkPop .22s ease":"none"}}>
              {task.checked?"✓":""}
            </button>
            {editId===task.id?(
              <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
                onBlur={()=>commitEdit(task.id)}
                onKeyDown={e=>{if(e.key==="Enter")commitEdit(task.id);if(e.key==="Escape")setEditId(null);}}
                style={{flex:1,background:"var(--bg1)",border:"1px solid var(--border2)",borderRadius:"6px",padding:"4px 8px",color:"var(--text)",fontFamily:"var(--font-ui)",fontSize:"14px",outline:"none"}}/>
            ):(
              <span onDoubleClick={()=>startEdit(task)} title="Double-click to rename"
                style={{flex:1,fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:500,color:task.checked?"var(--text3)":"var(--text)",textDecoration:task.checked?"line-through":"none",cursor:"text",userSelect:"none"}}>
                {task.label}
              </span>
            )}
            <div style={{display:"flex",gap:"4px"}}>
              <IconBtn title="Up"     onClick={()=>dispatch({type:`REORDER_${prefix}_TASK`,id:task.id,dir:"up"})}   disabled={idx===0}>↑</IconBtn>
              <IconBtn title="Down"   onClick={()=>dispatch({type:`REORDER_${prefix}_TASK`,id:task.id,dir:"down"})} disabled={idx===tasks.length-1}>↓</IconBtn>
              <IconBtn title="Rename" onClick={()=>startEdit(task)}>✎</IconBtn>
              <IconBtn title="Delete" onClick={()=>dispatch({type:`DELETE_${prefix}_TASK`,id:task.id})} danger>✕</IconBtn>
            </div>
          </div>
        ))}
        {tasks.length===0&&<div style={{textAlign:"center",padding:"22px",fontFamily:"var(--font-m)",fontSize:"11px",color:"var(--text3)"}}>No tasks — add one below.</div>}
      </div>
      <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
        <input ref={ref} value={newLabel} onChange={e=>setNewLabel(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Add a task…"
          style={{flex:1,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"9px 13px",color:"var(--text)",fontFamily:"var(--font-ui)",fontSize:"14px",outline:"none"}}/>
        <Btn variant="ghost" onClick={handleAdd} style={{padding:"9px 16px",fontSize:"18px",fontWeight:400,letterSpacing:0}}>+</Btn>
      </div>
    </div>
  );
}

// ─── WEIGHT CHART ─────────────────────────────────────────────────────────────
function WeightChart({history,period}){
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-period);
  const data=history
    .filter(h=>new Date(h.date)>=cutoff)
    .sort((a,b)=>a.date.localeCompare(b.date));

  if(data.length===0) return(
    <div style={{textAlign:"center",padding:"48px 0",fontFamily:"var(--font-m)",fontSize:"11px",color:"var(--text3)"}}>
      No weight data for this period.<br/>
      <span style={{fontSize:"9px",opacity:.6}}>Log your weight daily to see trends.</span>
    </div>
  );

  const W=500,H=160,PL=50,PR=16,PT=14,PB=28;
  const cW=W-PL-PR, cH=H-PT-PB;
  const vals=data.map(d=>d.value);
  const minV=Math.min(...vals), maxV=Math.max(...vals);
  const range=maxV-minV||0.5;

  const xPos=(i)=>PL+(data.length<2?cW/2:(i/(data.length-1))*cW);
  const yPos=(v)=>PT+cH-((v-minV)/range)*cH;

  const linePath=data.map((d,i)=>`${i===0?"M":"L"}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(" ");
  const areaPath=data.length>=2
    ?`${linePath} L${xPos(data.length-1).toFixed(1)},${(PT+cH).toFixed(1)} L${xPos(0).toFixed(1)},${(PT+cH).toFixed(1)}Z`:"";

  const fmtDate=(s)=>{const d=new Date(s+"T00:00:00"); return `${d.getDate()}/${d.getMonth()+1}`;};
  const xCount=Math.min(5,data.length);
  const xIdx=data.length<=xCount
    ?data.map((_,i)=>i)
    :Array.from({length:xCount},(_,i)=>Math.round(i*(data.length-1)/(xCount-1)));

  const change=data.length>=2?((data[data.length-1].value-data[0].value)).toFixed(1):null;
  const changeColor=change===null?"var(--text3)":parseFloat(change)<0?"var(--accent)":parseFloat(change)>0?"#f87171":"var(--text3)";

  return(
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        <defs>
          <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00e5b0" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#00e5b0" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0,.5,1].map((t,i)=><line key={i} x1={PL} y1={PT+cH*t} x2={W-PR} y2={PT+cH*t} stroke="#252525" strokeWidth="1" strokeDasharray="3,6"/>)}
        {/* Area */}
        {areaPath&&<path d={areaPath} fill="url(#wgrad)"/>}
        {/* Line */}
        {data.length>=2&&<path d={linePath} fill="none" stroke="#00e5b0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>}
        {/* Dots */}
        {data.map((d,i)=><circle key={i} cx={xPos(i)} cy={yPos(d.value)} r={data.length>30?2:3.5} fill="#00e5b0"/>)}
        {/* Y labels */}
        {[minV,(minV+maxV)/2,maxV].map((v,i)=>(
          <text key={i} x={PL-6} y={yPos(v)+4} fill="#4a4a4a" fontSize="9" fontFamily="monospace" textAnchor="end">
            {Math.round(v*10)/10}
          </text>
        ))}
        {/* X labels */}
        {xIdx.map(idx=>(
          <text key={idx} x={xPos(idx)} y={H-5} fill="#4a4a4a" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {fmtDate(data[idx].date)}
          </text>
        ))}
      </svg>
      {/* Stats */}
      <div style={{display:"flex",gap:"20px",marginTop:"18px",flexWrap:"wrap",borderTop:"1px solid var(--border)",paddingTop:"16px"}}>
        <MiniStat label="CURRENT" value={`${data[data.length-1].value} kg`} accent="var(--text)"/>
        {data.length>=2&&<>
          <MiniStat label="START"  value={`${data[0].value} kg`}/>
          <MiniStat label="CHANGE" value={`${parseFloat(change)>0?"+":""}${change} kg`} accent={changeColor}/>
          <MiniStat label="LOW"    value={`${minV} kg`}/>
          <MiniStat label="HIGH"   value={`${maxV} kg`}/>
        </>}
        <MiniStat label="ENTRIES" value={data.length}/>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({onComplete}){
  const [name,setName]=useState("");
  const [shaking,setShaking]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{const t=setTimeout(()=>ref.current?.focus(),1200);return()=>clearTimeout(t);},[]);

  const submit=()=>{
    const n=name.trim();
    if(!n){setShaking(true);setTimeout(()=>setShaking(false),500);return;}
    onComplete(n);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px",overflow:"hidden"}}>
      {/* Subtle grid bg */}
      <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,#00e5b0 40px,#00e5b0 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#00e5b0 40px,#00e5b0 41px)"}}/>
      {/* Glow */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"500px",height:"500px",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,229,176,.04) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{maxWidth:"500px",width:"100%",zIndex:1}}>
        <div className="ob-logo" style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)",letterSpacing:"0.35em",marginBottom:"32px"}}>
          ◈ TAKE CTRL — BEHAVIORAL OS
        </div>

        <div className="ob-h1" style={{fontFamily:"var(--font-d)",fontSize:"clamp(60px,12vw,92px)",lineHeight:.9,color:"var(--accent)"}}>
          CALL
        </div>
        <div className="ob-h2" style={{fontFamily:"var(--font-d)",fontSize:"clamp(60px,12vw,92px)",lineHeight:.95,color:"var(--text)",marginBottom:"10px"}}>
          YOURSELF?
        </div>

        <div className="ob-sub" style={{fontFamily:"var(--font-m)",fontSize:"11px",color:"var(--text3)",letterSpacing:"0.15em",marginBottom:"28px",lineHeight:1.7}}>
          THIS SYSTEM TRACKS YOUR DISCIPLINE.<br/>
          GIVE IT A NAME TO CALL YOU BY.
        </div>

        <div className={`ob-inp${shaking?" shake":""}`} style={{marginBottom:"14px"}}>
          <input
            ref={ref}
            type="text"
            value={name}
            onChange={e=>{setName(e.target.value);}}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            placeholder="Your name"
            maxLength={30}
            style={{
              width:"100%",background:"rgba(255,255,255,.04)",
              border:`1px solid ${shaking?"rgba(230,64,64,.5)":"var(--border2)"}`,
              borderRadius:"12px",padding:"18px 20px",
              color:"var(--text)",fontFamily:"var(--font-d)",fontSize:"36px",
              outline:"none",letterSpacing:"0.1em",
              transition:"border-color .2s",
            }}
          />
          {shaking&&<div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"#f87171",marginTop:"7px",letterSpacing:"0.1em"}}>A NAME IS REQUIRED TO PROCEED.</div>}
        </div>

        <div className="ob-btn">
          <button onClick={submit} style={{
            width:"100%",padding:"18px",background:"var(--accent)",border:"none",
            borderRadius:"12px",color:"#000",fontFamily:"var(--font-d)",fontSize:"28px",
            letterSpacing:"0.18em",cursor:"pointer",
          }}>
            PROCEED →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WEIGHT MODAL ─────────────────────────────────────────────────────────────
function WeightModal({onClose}){
  const{dispatch}=useStore();
  const[val,setVal]=useState("");
  const[unit,setUnit]=useState("kg");
  const submit=()=>{
    const n=parseFloat(val); if(!n||n<=0) return;
    dispatch({type:"LOG_WEIGHT",value:n}); onClose();
  };
  return(
    <div className="modal-bg" style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.78)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div className="modal-card" style={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"20px",padding:"32px",maxWidth:"360px",width:"100%"}}>
        <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.22em",marginBottom:"8px"}}>DAILY CHECK-IN</div>
        <div style={{fontFamily:"var(--font-d)",fontSize:"40px",color:"var(--text)",lineHeight:1,marginBottom:"6px"}}>Log Your Weight</div>
        <div style={{fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)",marginBottom:"24px",lineHeight:1.65}}>Once per day only. Consistency builds awareness.</div>
        <div style={{display:"flex",gap:"8px",marginBottom:"13px"}}>
          {["kg","lbs"].map(u=>(
            <button key={u} onClick={()=>setUnit(u)} style={{flex:1,padding:"8px",borderRadius:"8px",background:unit===u?"rgba(0,229,176,.1)":"var(--bg3)",border:`1px solid ${unit===u?"rgba(0,229,176,.3)":"var(--border)"}`,color:unit===u?"var(--accent)":"var(--text3)",fontFamily:"var(--font-m)",fontSize:"11px",cursor:"pointer"}}>{u}</button>
          ))}
        </div>
        <input autoFocus type="number" placeholder={unit==="kg"?"e.g. 82.5":"e.g. 180"} value={val}
          onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{width:"100%",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"10px",padding:"13px 16px",color:"var(--text)",fontFamily:"var(--font-d)",fontSize:"36px",outline:"none",textAlign:"center",marginBottom:"13px"}}/>
        <div style={{display:"grid",gap:"8px"}}>
          <Btn variant="primary" onClick={submit} style={{width:"100%",padding:"14px"}}>Log — {val||"—"} {val?unit:""}</Btn>
          <Btn variant="ghost"   onClick={onClose} style={{width:"100%",padding:"11px"}}>Skip for Today</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({page,navigate,open,setOpen}){
  const{state}=useStore();
  const ci=calculateControlIndex(state);
  const ciColor=ci>=80?"var(--accent)":ci>=50?"var(--warn)":"var(--text2)";
  const today=getTodayDate();

  // Prayer completion count for sidebar badge
  const dayLog=state.prayers[today]||{};
  const prayersDone=PRAYERS_DATA.filter(p=>dayLog[p.key]?.fard).length;

  const routes=[
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"wake",     label:"Wake",     icon:"◎"},
    {id:"training", label:"Training", icon:"◆"},
    {id:"sleep",    label:"Sleep",    icon:"◐"},
    {id:"prayers",  label:"Prayers",  icon:"✦",badge:prayersDone>0?`${prayersDone}/5`:null},
    {id:"quran",    label:"Quran",    icon:"◉"},
    {id:"control",  label:"Control",  icon:"⬡"},
  ];

  return(
    <>
      {open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:40,background:"rgba(0,0,0,.65)",backdropFilter:"blur(2px)"}}/>}
      <aside style={{position:"fixed",top:0,left:0,bottom:0,width:"220px",zIndex:50,background:"var(--bg1)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",transform:open?"translateX(0)":"translateX(-100%)",transition:"transform .28s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{padding:"24px 18px 18px",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:"26px",letterSpacing:"0.12em",color:"var(--accent)"}}>TAKE CTRL</div>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"3px",letterSpacing:"0.18em"}}>BEHAVIORAL OS v4.0</div>
          {state.profile.name&&(
            <div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text2)",marginTop:"8px",letterSpacing:"0.1em"}}>
              → {state.profile.name.toUpperCase()}
            </div>
          )}
        </div>
        <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em",marginBottom:"5px"}}>CONTROL INDEX</div>
          <div style={{display:"flex",alignItems:"baseline",gap:"5px"}}>
            <span style={{fontFamily:"var(--font-d)",fontSize:"38px",color:ciColor}}>{ci}</span>
            <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)"}}>/100</span>
          </div>
          <div style={{marginTop:"8px",height:"2px",background:"var(--bg3)",borderRadius:"2px"}}>
            <div style={{height:"100%",width:`${ci}%`,background:ciColor,borderRadius:"2px",transition:"width .5s ease"}}/>
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 0",overflowY:"auto"}}>
          {routes.map(r=>{
            const active=page===r.id||( r.id==="weight"&&page==="weight");
            return(
              <button key={r.id} onClick={()=>{navigate(r.id);setOpen(false);}}
                style={{display:"flex",alignItems:"center",gap:"11px",width:"100%",padding:"11px 16px",background:active?"rgba(0,229,176,.07)":"transparent",border:"none",borderLeft:`2px solid ${active?"var(--accent)":"transparent"}`,color:active?"var(--accent)":"var(--text2)",fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
                <span style={{fontSize:"16px",opacity:active?1:.5}}>{r.icon}</span>
                <span style={{flex:1,textAlign:"left"}}>{r.label}</span>
                {r.badge&&<span style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--accent)",background:"rgba(0,229,176,.1)",border:"1px solid rgba(0,229,176,.2)",borderRadius:"4px",padding:"1px 5px"}}>{r.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid var(--border)"}}>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)"}}>{getTodayDate()}</div>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"2px"}}>STREAK: {state.control.streak}d</div>
        </div>
      </aside>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({navigate}){
  const{state}=useStore();
  const today=getTodayDate();
  const ci=calculateControlIndex(state);
  const clarity=calculateClarity(state.control.streak);

  const notLogged=!state.weight.history.some(h=>h.date===today);
  const notDismissed=!sessionStorage.getItem(`wt_${today}`);
  const[showWeight,setShowWeight]=useState(notLogged&&notDismissed);
  useEffect(()=>{if(state.weight.history.some(h=>h.date===today))setShowWeight(false);},[state.weight.history]);
  const dismissWeight=()=>{sessionStorage.setItem(`wt_${today}`,"1");setShowWeight(false);};

  const wakeComplete=state.wake.tasks.length>0&&state.wake.tasks.every(t=>t.checked)&&state.wake.lastCheck===today;
  const trainingToday=state.training.lastCheck===today;
  const sleepToday=state.sleep.lastCheck===today;
  const weightToday=state.weight.history.some(h=>h.date===today);
  const lastCtrl=state.control.history[state.control.history.length-1];
  const ctrlSuccess=lastCtrl?.date===today&&lastCtrl?.success;
  const dayLog=state.prayers[today]||{};
  const prayersDone=PRAYERS_DATA.filter(p=>dayLog[p.key]?.fard).length;

  const ciColor=ci>=80?"var(--accent)":ci>=50?"var(--warn)":ci>=20?"#888":"var(--text3)";

  return(
    <>
      {showWeight&&<WeightModal onClose={dismissWeight}/>}
      <div style={{display:"grid",gap:"18px"}}>

        {/* Hero CI */}
        <Card cls="fu" style={{position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,opacity:.022,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 28px,var(--accent) 28px,var(--accent) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,var(--accent) 28px,var(--accent) 29px)"}}/>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.22em",marginBottom:"4px"}}>
            CONTROL INDEX — {state.profile.name?`${state.profile.name.toUpperCase()} — `:""}{today}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:"10px"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"96px",lineHeight:1,color:ciColor}}>{ci}</div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"32px",color:"var(--text3)"}}>/100</div>
          </div>
          <div style={{marginTop:"16px",height:"3px",background:"var(--bg4)",borderRadius:"2px"}}>
            <div style={{height:"100%",width:`${ci}%`,background:ciColor,borderRadius:"2px",transition:"width .8s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <div style={{marginTop:"12px",display:"flex",flexWrap:"wrap",gap:"6px"}}>
            <Tag done={weightToday}>Weight +20</Tag>
            <Tag done={wakeComplete}>Wake +30</Tag>
            <Tag done={trainingToday}>Training +30</Tag>
            <Tag done={ctrlSuccess}>Control +20</Tag>
          </div>
        </Card>

        {/* Stats row */}
        <div className="fu1" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"13px"}}>
          <Card><Stat label="STREAK"      value={`${state.control.streak}d`} accent={state.control.streak>0?"var(--accent)":undefined}/></Card>
          <Card><Stat label="BEST STREAK" value={`${state.control.best}d`}/></Card>
          <Card><Stat label="CLARITY (90d)" value={`${clarity}%`} accent={clarity>=50?"var(--accent2)":undefined}/></Card>
          {/* Clickable weight card */}
          <Card style={{cursor:"pointer",borderColor:weightToday?"rgba(0,229,176,.2)":"var(--border)"}} cls="fu1"
            onClick={()=>navigate("weight")}>
            <Stat label="WEIGHT" value={state.weight.current??'—'} sub={state.weight.current?"tap for history":"not logged"}/>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"8px"}}>VIEW HISTORY →</div>
          </Card>
        </div>

        {/* Checklist */}
        <Card cls="fu2">
          <Label>Today's Checklist</Label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px"}}>
            {[
              {label:"Weight Log",  done:weightToday,   page:"weight",  pts:"+20"},
              {label:"Wake Routine",done:wakeComplete,   page:"wake",    pts:"+30"},
              {label:"Training",    done:trainingToday,  page:"training",pts:"+30"},
              {label:"Control Mode",done:ctrlSuccess,    page:"control", pts:"+20"},
            ].map(item=>(
              <button key={item.label} onClick={()=>item.page&&navigate(item.page)}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 14px",borderRadius:"10px",background:item.done?"rgba(0,229,176,.04)":"var(--bg3)",border:`1px solid ${item.done?"rgba(0,229,176,.13)":"var(--border)"}`,color:item.done?"var(--accent)":"var(--text2)",fontFamily:"var(--font-ui)",fontSize:"13px",fontWeight:600,cursor:item.page?"pointer":"default",textAlign:"left"}}>
                <span>{item.label}</span>
                <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                  <span style={{fontFamily:"var(--font-m)",fontSize:"9px",color:item.done?"var(--accent)":"var(--text3)"}}>{item.pts}</span>
                  <span>{item.done?"✓":item.page?"→":""}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Prayers summary */}
        <Card cls="fu3" style={{cursor:"pointer"}} onClick={()=>navigate("prayers")}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em",marginBottom:"5px"}}>
                {isFridayToday()?"FRIDAY PRAYERS":"DAILY PRAYERS"}
              </div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"28px",color:prayersDone===5?"var(--accent)":"var(--text)"}}>
                {prayersDone===5?"All Prayers Done":"Prayers"}
              </div>
            </div>
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              {PRAYERS_DATA.map(p=>{
                const done=!!(dayLog[p.key]?.fard);
                return<div key={p.key} style={{width:"10px",height:"10px",borderRadius:"50%",background:done?p.color:"var(--bg4)",border:`1px solid ${done?p.color:"var(--border2)"}`,transition:"all .2s"}}/>;
              })}
              <span style={{fontFamily:"var(--font-d)",fontSize:"26px",color:prayersDone===5?"var(--accent)":"var(--text2)",marginLeft:"8px"}}>{prayersDone}/5</span>
            </div>
          </div>
          <div style={{marginTop:"10px",height:"3px",background:"var(--bg4)",borderRadius:"2px"}}>
            <div style={{height:"100%",width:`${(prayersDone/5)*100}%`,background:prayersDone===5?"var(--accent)":"var(--border2)",borderRadius:"2px",transition:"width .4s ease"}}/>
          </div>
        </Card>

        {sleepToday&&(
          <Card cls="fu4">
            <Label>Last Night's Sleep</Label>
            <Stat label="HOURS SLEPT" value={state.sleep.hours} sub="hours" accent={state.sleep.hours>=7?"var(--accent)":"var(--warn)"}/>
          </Card>
        )}
      </div>
    </>
  );
}

// ─── WAKE ─────────────────────────────────────────────────────────────────────
function Wake(){
  const{state,dispatch}=useStore();
  const hour=new Date().getHours();
  const greeting=hour<12?"Good Morning.":hour<17?"Afternoon Protocol.":"Evening Check.";
  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"620px"}}>
      <Card cls="fu">
        <div style={{fontFamily:"var(--font-d)",fontSize:"54px",lineHeight:1.05,color:"var(--text)",marginBottom:"5px"}}>{greeting}</div>
        <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.2em"}}>WAKE PROTOCOL — {getTodayDate()}</div>
      </Card>
      <Card cls="fu1">
        <Label>Morning Routine — Check Off Each Item</Label>
        <TaskManager tasks={state.wake.tasks} prefix="WAKE" lastCheck={state.wake.lastCheck} dispatch={dispatch}/>
      </Card>
    </div>
  );
}

// ─── TRAINING ─────────────────────────────────────────────────────────────────
function Training(){
  const{state,dispatch}=useStore();
  const today=getTodayDate();
  const done=state.training.lastCheck===today;
  const days=[
    {name:"Push Day", ex:["Bench Press 4×8","Overhead Press 3×10","Incline DB 3×12","Lateral Raises 3×15","Tricep Dips 3×15"]},
    {name:"Pull Day", ex:["Deadlift 4×5","Pull-ups 4×8","Cable Row 3×12","Face Pulls 3×15","Bicep Curl 3×12"]},
    {name:"Leg Day",  ex:["Squat 4×8","Romanian DL 3×10","Leg Press 3×12","Walking Lunge 3×10","Calf Raises 4×20"]},
    {name:"Rest Day", ex:["Light walk 30 min","Stretching 20 min","Foam rolling","Mobility flow 15 min"]},
  ];
  const session=days[new Date().getDay()%days.length];
  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"580px"}}>
      <Card cls="fu" style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:"3px",background:done?"var(--accent)":"var(--bg4)"}}/>
        <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.2em",marginBottom:"10px"}}>TODAY'S SESSION — {today}</div>
        <div style={{fontFamily:"var(--font-d)",fontSize:"52px",color:done?"var(--accent)":"var(--text)"}}>{session.name}</div>
      </Card>
      <Card cls="fu1">
        <Label>Exercise Plan</Label>
        <div style={{display:"grid",gap:"6px"}}>
          {session.ex.map((ex,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"11px 13px",borderRadius:"9px",background:"var(--bg3)",border:"1px solid var(--border)"}}>
              <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)",width:"18px",flexShrink:0}}>{String(i+1).padStart(2,"0")}</span>
              <span style={{fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:600,color:"var(--text)"}}>{ex}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card cls="fu2">
        {done?(
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <span style={{fontSize:"26px"}}>✓</span>
            <div>
              <div style={{fontFamily:"var(--font-ui)",fontSize:"16px",fontWeight:700,color:"var(--accent)"}}>Workout Logged</div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"3px"}}>Already logged today. +30 pts applied.</div>
            </div>
          </div>
        ):(
          <Btn variant="primary" onClick={()=>dispatch({type:"COMPLETE_TRAINING"})} style={{width:"100%",padding:"14px"}}>Workout Completed</Btn>
        )}
      </Card>
    </div>
  );
}

// ─── SLEEP ────────────────────────────────────────────────────────────────────
function Sleep(){
  const{state,dispatch}=useStore();
  const today=getTodayDate();
  const hoursLogged=state.sleep.lastCheck===today;
  const[hours,setHours]=useState(state.sleep.hours||7);
  const getQ=(h)=>{
    if(h>=8)return{label:"Optimal", color:"var(--accent)"};
    if(h>=7)return{label:"Good",    color:"var(--success)"};
    if(h>=6)return{label:"Adequate",color:"var(--warn)"};
    return       {label:"Deficit",  color:"#f87171"};
  };
  const q=getQ(hours);
  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"620px"}}>
      <Card cls="fu">
        <div style={{fontFamily:"var(--font-d)",fontSize:"52px",color:"var(--text)",marginBottom:"5px"}}>Sleep Protocol</div>
        <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.2em"}}>{today} — WIND DOWN ROUTINE</div>
      </Card>
      <Card cls="fu1">
        <Label>Pre-Sleep Routine — Check Off Each Item</Label>
        <TaskManager tasks={state.sleep.tasks} prefix="SLEEP" lastCheck={state.sleep.tasksLastCheck} dispatch={dispatch}/>
      </Card>
      <Card cls="fu2">
        <Label>Hours Slept Last Night</Label>
        <div style={{display:"flex",alignItems:"center",gap:"20px",marginBottom:"18px"}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:"78px",lineHeight:1,color:q.color,transition:"color .3s"}}>{hours}</div>
          <div>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginBottom:"3px"}}>HOURS</div>
            <div style={{fontFamily:"var(--font-ui)",fontSize:"17px",fontWeight:700,color:q.color}}>{q.label}</div>
          </div>
        </div>
        <input type="range" min="2" max="12" step="0.5" value={hours} onChange={e=>setHours(parseFloat(e.target.value))} disabled={hoursLogged}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"5px"}}>
          <span style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)"}}>2h</span>
          <span style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)"}}>12h</span>
        </div>
        <div style={{marginTop:"16px"}}>
          {[{label:"Minimum",value:"6h+",met:hours>=6},{label:"Recommended",value:"7–8h",met:hours>=7},{label:"Optimal",value:"8h+",met:hours>=8}].map(row=>(
            <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)"}}>{row.label}</span>
              <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:row.met?"var(--accent)":"var(--text3)"}}>{row.value}</span>
                <span style={{color:row.met?"var(--accent)":"var(--text3)"}}>{row.met?"✓":"·"}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card cls="fu3">
        {hoursLogged?(
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <span style={{fontSize:"26px"}}>✓</span>
            <div>
              <div style={{fontFamily:"var(--font-ui)",fontSize:"16px",fontWeight:700,color:"var(--accent)"}}>Sleep Logged — {state.sleep.hours}h</div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"3px"}}>Already logged. Sleep well.</div>
            </div>
          </div>
        ):(
          <Btn variant="primary" onClick={()=>dispatch({type:"LOG_SLEEP",hours})} style={{width:"100%",padding:"14px"}}>Save Sleep — {hours}h</Btn>
        )}
      </Card>
    </div>
  );
}

// ─── PRAYERS PAGE ─────────────────────────────────────────────────────────────
function Prayers(){
  const{state,dispatch}=useStore();
  const today=getTodayDate();
  const friday=isFridayToday();
  const dayLog=state.prayers[today]||{};
  const fardDone=PRAYERS_DATA.filter(p=>dayLog[p.key]?.fard).length;
  const allDone=fardDone===5;
  const dayName=new Date().toLocaleDateString("en",{weekday:"long"}).toUpperCase();

  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"640px"}}>
      {/* Header */}
      <Card cls="fu" style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:allDone?"var(--accent)":"var(--border)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.2em",marginBottom:"6px"}}>{today} — {dayName}</div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"52px",lineHeight:1,color:allDone?"var(--accent)":"var(--text)"}}>
              {friday?"Jumu'ah":"Daily Prayers"}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"48px",lineHeight:1,color:allDone?"var(--accent)":"var(--text2)"}}>{fardDone}/5</div>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"3px"}}>FARD</div>
          </div>
        </div>
        <div style={{marginTop:"16px",height:"3px",background:"var(--bg4)",borderRadius:"2px"}}>
          <div style={{height:"100%",width:`${(fardDone/5)*100}%`,background:allDone?"var(--accent)":"var(--border2)",borderRadius:"2px",transition:"width .4s ease"}}/>
        </div>
        {friday&&(
          <div style={{marginTop:"13px",padding:"10px 13px",borderRadius:"9px",background:"rgba(255,209,102,.05)",border:"1px solid rgba(255,209,102,.14)"}}>
            <div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"#ffd166",letterSpacing:"0.1em",marginBottom:"3px"}}>يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ</div>
            <div style={{fontFamily:"var(--font-ui)",fontSize:"12px",color:"var(--text3)"}}>Friday — Dhuhr is replaced with Jumu'ah prayer.</div>
          </div>
        )}
      </Card>

      {/* Prayer cards */}
      {PRAYERS_DATA.map((prayer,pidx)=>{
        const rows=(friday&&prayer.rowsFriday)?prayer.rowsFriday:prayer.rows;
        const name=(friday&&prayer.nameFriday)?prayer.nameFriday:prayer.name;
        const arabic=(friday&&prayer.arabicFriday)?prayer.arabicFriday:prayer.arabic;
        const time=(friday&&prayer.timeFriday)?prayer.timeFriday:prayer.time;
        const pLog=dayLog[prayer.key]||{};
        const fardChecked=!!pLog.fard;
        const allChecked=rows.every(r=>!!pLog[r.field]);

        return(
          <Card key={prayer.key} cls={`fu${Math.min(pidx+1,5)}`}
            style={{borderLeft:`3px solid ${allChecked?prayer.color:prayer.color+"33"}`,transition:"border-color .3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"13px"}}>
              <div>
                <div style={{fontFamily:"var(--font-d)",fontSize:"30px",lineHeight:1,color:fardChecked?prayer.color:"var(--text)"}}>{name}</div>
                <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.1em",marginTop:"2px"}}>{time}</div>
              </div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"22px",color:fardChecked?prayer.color:"var(--text3)",direction:"rtl",letterSpacing:0}}>{arabic}</div>
            </div>

            <div style={{display:"grid",gap:"7px"}}>
              {rows.map((row,ridx)=>{
                const checked=!!pLog[row.field];
                const isFard=row.type==="fard";
                return(
                  <button key={ridx}
                    onClick={()=>dispatch({type:"TOGGLE_PRAYER",date:today,prayerKey:prayer.key,field:row.field})}
                    style={{
                      display:"flex",alignItems:"center",gap:"12px",
                      padding:"11px 13px",borderRadius:"9px",cursor:"pointer",textAlign:"left",
                      background:checked?`${prayer.color}14`:"var(--bg3)",
                      border:`1px solid ${checked?prayer.color+"35":"var(--border)"}`,
                      transition:"all .18s",
                    }}>
                    <div style={{
                      width:"22px",height:"22px",borderRadius:"6px",flexShrink:0,
                      background:checked?prayer.color:"var(--bg4)",
                      border:`1px solid ${checked?prayer.color:"var(--border2)"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"12px",color:"#000",fontWeight:700,
                      animation:checked?"checkPop .22s ease":"none",
                    }}>
                      {checked?"✓":""}
                    </div>
                    <span style={{flex:1,fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:600,color:checked?"var(--text)":"var(--text2)"}}>{row.label}</span>
                    <span style={{
                      fontFamily:"var(--font-m)",fontSize:"9px",flexShrink:0,
                      padding:"3px 8px",borderRadius:"4px",
                      color:isFard?prayer.color:"var(--text3)",
                      background:isFard?`${prayer.color}12`:"transparent",
                      border:isFard?`1px solid ${prayer.color}25`:"none",
                    }}>
                      {row.rak}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}

      {/* Completion message */}
      {allDone&&(
        <Card cls="fu5" style={{border:"1px solid rgba(0,229,176,.2)",background:"rgba(0,229,176,.03)",textAlign:"center",padding:"28px"}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:"36px",color:"var(--accent)",marginBottom:"6px"}}>الحمد لله</div>
          <div style={{fontFamily:"var(--font-ui)",fontSize:"15px",color:"var(--text2)",lineHeight:1.7}}>All five prayers completed.<br/>Your duty is fulfilled for today.</div>
        </Card>
      )}
    </div>
  );
}

// ─── QURAN PAGE ───────────────────────────────────────────────────────────────
function Quran(){
  const{state,dispatch}=useStore();
  const today=getTodayDate();
  const[pages,setPages]=useState("");
  const[fromPage,setFromPage]=useState("");
  const[surah,setSurah]=useState("");

  const totalRead=state.quran.logs.reduce((s,l)=>s+l.pages,0);
  const khatmahs=Math.floor(totalRead/QURAN_PAGES);
  const currPages=totalRead%QURAN_PAGES;
  const pct=Math.round((currPages/QURAN_PAGES)*100);
  const todayPages=state.quran.logs.filter(l=>l.date===today).reduce((s,l)=>s+l.pages,0);

  const handleLog=()=>{
    const n=parseInt(pages); if(!n||n<=0) return;
    dispatch({type:"LOG_QURAN",entry:{id:uid(),date:today,time:new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}),pages:n,fromPage:fromPage?parseInt(fromPage):null,surah:surah.trim()||null}});
    setPages(""); setFromPage(""); setSurah("");
  };

  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"600px"}}>
      <Card cls="fu">
        <div style={{fontFamily:"var(--font-d)",fontSize:"52px",lineHeight:1,color:"var(--text)",marginBottom:"5px"}}>Quran Log</div>
        <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.2em"}}>{today} — TRACK YOUR RECITATION</div>
      </Card>

      {/* Stats */}
      <div className="fu1" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"13px"}}>
        <Card><Stat label="TOTAL PAGES" value={totalRead||"0"} accent={totalRead>0?"var(--accent)":undefined}/></Card>
        <Card><Stat label="TODAY" value={todayPages||"0"} sub="pages"/></Card>
        <Card><Stat label="KHATMAHS" value={khatmahs} accent={khatmahs>0?"var(--warn)":undefined}/></Card>
      </div>

      {/* Khatmah progress */}
      <Card cls="fu2">
        <Label>Current Khatmah — {QURAN_PAGES} Pages Total</Label>
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"14px"}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:"60px",lineHeight:1,color:pct>=50?"var(--accent)":"var(--text2)"}}>{pct}%</div>
          <div>
            <div style={{fontFamily:"var(--font-ui)",fontSize:"14px",color:"var(--text2)"}}>{currPages} / {QURAN_PAGES} pages</div>
            {khatmahs>0&&<div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--warn)",marginTop:"3px"}}>✓ {khatmahs} khatmah{khatmahs>1?"s":""} complete</div>}
          </div>
        </div>
        <div style={{height:"4px",background:"var(--bg4)",borderRadius:"2px"}}>
          <div style={{height:"100%",width:`${pct}%`,background:"var(--accent)",borderRadius:"2px",transition:"width .6s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"5px"}}>
          <span style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)"}}>p.1</span>
          <span style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)"}}>p.{QURAN_PAGES}</span>
        </div>
      </Card>

      {/* Log form */}
      <Card cls="fu3">
        <Label>Log Recitation Session</Label>
        <div style={{marginBottom:"12px"}}>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em",marginBottom:"6px"}}>PAGES READ *</div>
          <input type="number" min="1" max="604" placeholder="e.g. 5" value={pages}
            onChange={e=>setPages(e.target.value)}
            style={{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"9px",padding:"12px 16px",color:"var(--text)",fontFamily:"var(--font-d)",fontSize:"32px",outline:"none",textAlign:"center"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
          <div>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.15em",marginBottom:"6px"}}>FROM PAGE (optional)</div>
            <input type="number" min="1" max="604" placeholder="e.g. 218" value={fromPage}
              onChange={e=>setFromPage(e.target.value)}
              style={{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"9px 12px",color:"var(--text)",fontFamily:"var(--font-ui)",fontSize:"15px",outline:"none"}}/>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.15em",marginBottom:"6px"}}>SURAH (optional)</div>
            <input type="text" placeholder="e.g. Al-Baqarah" value={surah}
              onChange={e=>setSurah(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLog()}
              style={{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"9px 12px",color:"var(--text)",fontFamily:"var(--font-ui)",fontSize:"15px",outline:"none"}}/>
          </div>
        </div>
        <Btn variant="primary" onClick={handleLog} disabled={!pages||parseInt(pages)<=0} style={{width:"100%",padding:"13px"}}>
          Log {pages?`${pages} Page${parseInt(pages)!==1?"s":""}` :"Recitation"}
        </Btn>
      </Card>

      {/* History */}
      {state.quran.logs.length>0&&(
        <Card cls="fu4">
          <Label>Sessions Log</Label>
          <div style={{display:"grid",gap:"5px"}}>
            {[...state.quran.logs].reverse().slice(0,12).map(entry=>(
              <div key={entry.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:"8px",background:"var(--bg3)"}}>
                <div>
                  <div style={{fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:600,color:"var(--text)"}}>
                    {entry.pages} page{entry.pages!==1?"s":""}
                    {entry.surah?` — ${entry.surah}`:""}
                    {entry.fromPage?` (p.${entry.fromPage})`:""}
                  </div>
                  <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"2px"}}>{entry.date}{entry.time?` · ${entry.time}`:""}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{fontFamily:"var(--font-d)",fontSize:"24px",color:"var(--accent)"}}>{entry.pages}</div>
                  <IconBtn title="Delete" onClick={()=>dispatch({type:"DELETE_QURAN_LOG",id:entry.id})} danger>✕</IconBtn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── WEIGHT DETAIL PAGE ───────────────────────────────────────────────────────
function WeightDetail({navigate}){
  const{state}=useStore();
  const[period,setPeriod]=useState(28);
  const periods=[{label:"7D",days:7},{label:"28D",days:28},{label:"90D",days:90},{label:"365D",days:365}];

  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"640px"}}>
      <div className="fu" style={{display:"flex",alignItems:"center",gap:"14px"}}>
        <button onClick={()=>navigate("dashboard")} style={{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text2)",cursor:"pointer",padding:"8px 14px",borderRadius:"8px",fontFamily:"var(--font-m)",fontSize:"10px",letterSpacing:"0.1em"}}>← BACK</button>
        <div style={{fontFamily:"var(--font-d)",fontSize:"36px",color:"var(--text)"}}>Weight History</div>
      </div>

      {state.weight.current&&(
        <Card cls="fu">
          <div style={{display:"flex",gap:"28px",alignItems:"baseline",flexWrap:"wrap"}}>
            <div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em",marginBottom:"3px"}}>CURRENT</div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"64px",color:"var(--accent)",lineHeight:1}}>{state.weight.current}</div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)"}}>kg</div>
            </div>
            <div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em",marginBottom:"3px"}}>TOTAL LOGS</div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"40px",color:"var(--text2)",lineHeight:1}}>{state.weight.history.length}</div>
            </div>
            <div>
              <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.18em",marginBottom:"3px"}}>FIRST LOGGED</div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"24px",color:"var(--text2)",lineHeight:1}}>
                {state.weight.history.length>0?state.weight.history[0].date:"—"}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Period selector */}
      <div className="fu1" style={{display:"flex",gap:"8px"}}>
        {periods.map(p=>(
          <button key={p.days} onClick={()=>setPeriod(p.days)} style={{flex:1,padding:"10px",borderRadius:"9px",background:period===p.days?"rgba(0,229,176,.1)":"var(--bg3)",border:`1px solid ${period===p.days?"rgba(0,229,176,.3)":"var(--border)"}`,color:period===p.days?"var(--accent)":"var(--text3)",fontFamily:"var(--font-m)",fontSize:"11px",cursor:"pointer",letterSpacing:"0.08em"}}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Card cls="fu2">
        <Label>{periods.find(p=>p.days===period)?.label} WEIGHT TREND</Label>
        <WeightChart history={state.weight.history} period={period}/>
      </Card>

      {/* Full log list */}
      {state.weight.history.length>0&&(
        <Card cls="fu3">
          <Label>All Entries</Label>
          <div style={{display:"grid",gap:"5px",maxHeight:"300px",overflowY:"auto"}}>
            {[...state.weight.history].reverse().map((entry,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:"7px",background:"var(--bg3)"}}>
                <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)"}}>{entry.date}</span>
                <span style={{fontFamily:"var(--font-d)",fontSize:"20px",color:"var(--text)"}}>{entry.value} kg</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── CONTROL MODE ─────────────────────────────────────────────────────────────
function ControlMode({navigate}){
  const{state,dispatch}=useStore();
  const today=getTodayDate();
  const lastEntry=state.control.history[state.control.history.length-1];
  const todayEntry=lastEntry?.date===today?lastEntry:null;
  const logged=!!todayEntry;
  const wasSuccess=todayEntry?.success===true;
  const[mode,setMode]=useState("default");
  const[trigger,setTrigger]=useState(null);
  const clarity=calculateClarity(state.control.streak);
  const mostCommon=getMostCommonTrigger(state.control.triggers);

  const headerMsg=!logged?"Stay in control today.":wasSuccess?"Day secured.":"Reset. Move forward.";
  const headerColor=!logged?"var(--text)":wasSuccess?"var(--accent)":"#f87171";

  const triggerOpts=[{key:"boredom",label:"Boredom",icon:"◌"},{key:"stress",label:"Stress",icon:"⚡"},{key:"lateNight",label:"Late Night",icon:"◐"},{key:"other",label:"Other",icon:"·"}];
  const urgeActions=[{icon:"💪",label:"Do 15 Pushups",sub:"Redirect energy physically"},{icon:"💧",label:"Cold Water",sub:"Splash face or drink 500ml"},{icon:"🚶",label:"Leave the Room",sub:"Change environment immediately"}];

  const resetMode=()=>{setMode("default");setTrigger(null);};
  const handleFail=(isOverride)=>{
    if(!trigger) return;
    dispatch({type:isOverride?"CONTROL_OVERRIDE_FAIL":"CONTROL_FAIL",trigger});
    resetMode();
  };

  const TriggerGrid=({danger,onSubmit,onCancel})=>(
    <>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"13px"}}>
        {triggerOpts.map(t=>(
          <button key={t.key} onClick={()=>setTrigger(t.key)}
            style={{padding:"13px",borderRadius:"9px",background:trigger===t.key?(danger?"rgba(230,64,64,.1)":"rgba(230,160,0,.1)"):"var(--bg3)",border:`1px solid ${trigger===t.key?(danger?"rgba(230,64,64,.35)":"rgba(230,160,0,.35)"):"var(--border)"}`,color:trigger===t.key?(danger?"#f87171":"var(--warn)"):"var(--text2)",fontFamily:"var(--font-ui)",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:"8px"}}>
        <Btn variant="secondary" onClick={onCancel} style={{flex:1}}>Cancel</Btn>
        <Btn variant="danger"    onClick={onSubmit} disabled={!trigger} style={{flex:2}}>Log Reset</Btn>
      </div>
    </>
  );

  return(
    <div style={{display:"grid",gap:"18px",maxWidth:"640px"}}>
      <Card cls="fu" style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:!logged?"var(--border)":wasSuccess?"var(--accent)":"#f87171"}}/>
        <div style={{fontFamily:"var(--font-d)",fontSize:"52px",lineHeight:1,color:headerColor,marginBottom:"5px"}}>{headerMsg}</div>
        <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",letterSpacing:"0.2em"}}>CONTROL MODE — {today}</div>
      </Card>

      <div className="fu1" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"13px"}}>
        <Card><Stat label="STREAK" value={`${state.control.streak}d`} accent={state.control.streak>0?"var(--accent)":undefined}/></Card>
        <Card><Stat label="BEST"   value={`${state.control.best}d`}/></Card>
        <Card>
          <Stat label="CLARITY (90d)" value={`${clarity}%`} accent={clarity>=50?"var(--accent2)":undefined}/>
          <div style={{marginTop:"8px",height:"2px",background:"var(--bg4)",borderRadius:"2px"}}>
            <div style={{height:"100%",width:`${clarity}%`,background:"var(--accent2)",borderRadius:"2px",transition:"width .6s ease"}}/>
          </div>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"5px"}}>{state.control.streak}/90 days</div>
        </Card>
      </div>

      {mode==="urge"&&(
        <Card cls="fu" style={{border:"1px solid rgba(230,64,64,.28)",background:"rgba(230,64,64,.04)",animation:"urgePulse 2s infinite"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"13px"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"30px",color:"#f87171"}}>URGE MODE ACTIVE</div>
            <button onClick={resetMode} style={{background:"none",border:"1px solid var(--border)",color:"var(--text3)",cursor:"pointer",padding:"5px 11px",borderRadius:"7px",fontFamily:"var(--font-m)",fontSize:"10px"}}>CLOSE</button>
          </div>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"#f87171",marginBottom:"13px",letterSpacing:"0.12em"}}>ACT NOW — PICK ONE IMMEDIATELY:</div>
          <div style={{display:"grid",gap:"7px"}}>
            {urgeActions.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 14px",borderRadius:"9px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(230,64,64,.13)"}}>
                <span style={{fontSize:"20px"}}>{a.icon}</span>
                <div>
                  <div style={{fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:700,color:"var(--text)"}}>{a.label}</div>
                  <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"2px"}}>{a.sub}</div>
                </div>
              </div>
            ))}
            <button onClick={()=>{resetMode();navigate("training");}} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 14px",borderRadius:"9px",background:"rgba(0,229,176,.05)",border:"1px solid rgba(0,229,176,.15)",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:"20px"}}>🏋️</span>
              <div>
                <div style={{fontFamily:"var(--font-ui)",fontSize:"14px",fontWeight:700,color:"var(--accent)"}}>Open Workout</div>
                <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--text3)",marginTop:"2px"}}>Redirect to Training</div>
              </div>
            </button>
          </div>
        </Card>
      )}

      {mode==="trigger"&&(
        <Card cls="fu" style={{border:"1px solid rgba(230,160,0,.22)"}}>
          <Label>What triggered it?</Label>
          <TriggerGrid danger={false} onSubmit={()=>handleFail(false)} onCancel={resetMode}/>
        </Card>
      )}
      {mode==="override_trigger"&&(
        <Card cls="fu" style={{border:"1px solid rgba(230,64,64,.22)"}}>
          <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"#f87171",letterSpacing:"0.15em",marginBottom:"10px"}}>OVERRIDING TODAY'S SUCCESS ENTRY</div>
          <Label>What caused the relapse?</Label>
          <TriggerGrid danger={true} onSubmit={()=>handleFail(true)} onCancel={resetMode}/>
        </Card>
      )}

      {mode==="default"&&(
        <Card cls="fu2">
          <Label>{!logged?"Log Today":wasSuccess?"Today Secured — Stay Vigilant":"Logged — Reset & Move On"}</Label>
          <div style={{display:"grid",gap:"8px"}}>
            {!logged&&(
              <>
                <Btn variant="success" onClick={()=>dispatch({type:"CONTROL_SUCCESS"})} style={{width:"100%",padding:"14px"}}>✓ Stayed in Control</Btn>
                <Btn variant="danger"  onClick={()=>setMode("trigger")}         style={{width:"100%",padding:"13px"}}>✕ Reset — Log Failure</Btn>
                <Btn variant="warn"    onClick={()=>setMode("urge")}             style={{width:"100%",padding:"13px"}}>⚡ I Feel an Urge</Btn>
              </>
            )}
            {logged&&wasSuccess&&(
              <>
                <div style={{padding:"12px 14px",borderRadius:"10px",background:"rgba(0,229,176,.04)",border:"1px solid rgba(0,229,176,.13)",fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)",lineHeight:1.65}}>
                  Logged as controlled today. If you slipped later — be honest and log the reset.
                </div>
                <Btn variant="danger" onClick={()=>setMode("override_trigger")} style={{width:"100%",padding:"13px"}}>✕ I Actually Failed — Reset</Btn>
                <Btn variant="warn"   onClick={()=>setMode("urge")}             style={{width:"100%",padding:"13px"}}>⚡ I Feel an Urge</Btn>
              </>
            )}
            {logged&&!wasSuccess&&(
              <>
                <div style={{padding:"12px 14px",borderRadius:"10px",background:"rgba(255,255,255,.02)",border:"1px solid var(--border)",fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)",lineHeight:1.65}}>
                  Today is logged as a reset. Streak is at 0. Tomorrow is a clean slate.
                </div>
                <Btn variant="warn" onClick={()=>setMode("urge")} style={{width:"100%",padding:"13px"}}>⚡ I Feel an Urge</Btn>
              </>
            )}
          </div>
        </Card>
      )}

      <Card cls="fu3">
        <Label>Trigger Breakdown</Label>
        <div style={{display:"grid",gap:"9px"}}>
          {triggerOpts.map(t=>{
            const count=state.control.triggers[t.key];
            const total=Object.values(state.control.triggers).reduce((a,b)=>a+b,0);
            const pct=total>0?Math.round((count/total)*100):0;
            const isTop=mostCommon===t.key&&count>0;
            return(
              <div key={t.key} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{fontFamily:"var(--font-ui)",fontSize:"12px",color:isTop?"var(--warn)":"var(--text2)",width:"76px",flexShrink:0,fontWeight:isTop?700:400}}>{t.label}</div>
                <div style={{flex:1,height:"3px",background:"var(--bg4)",borderRadius:"2px"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:isTop?"var(--warn)":"var(--border2)",borderRadius:"2px",transition:"width .5s ease"}}/>
                </div>
                <div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)",width:"20px",textAlign:"right"}}>{count}</div>
              </div>
            );
          })}
        </div>
        {mostCommon&&(
          <div style={{marginTop:"13px",padding:"10px 12px",borderRadius:"9px",background:"rgba(230,160,0,.05)",border:"1px solid rgba(230,160,0,.12)"}}>
            <div style={{fontFamily:"var(--font-m)",fontSize:"9px",color:"var(--warn)",letterSpacing:"0.12em"}}>MOST COMMON: {mostCommon.toUpperCase()}</div>
            <div style={{fontFamily:"var(--font-ui)",fontSize:"12px",color:"var(--text3)",marginTop:"3px"}}>Build targeted defenses around this trigger.</div>
          </div>
        )}
      </Card>

      {state.control.history.length>0&&(
        <Card cls="fu4">
          <Label>Recent History</Label>
          <div style={{display:"grid",gap:"5px"}}>
            {[...state.control.history].reverse().slice(0,10).map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:"7px",background:"var(--bg3)"}}>
                <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)"}}>{e.date}</span>
                <span style={{fontFamily:"var(--font-ui)",fontSize:"12px",fontWeight:700,color:e.success?"var(--accent)":"#f87171"}}>
                  {e.success?"CONTROLLED":`RESET${e.trigger?` · ${e.trigger}`:""}`}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const PAGE_LABELS={
  dashboard:"Command Center",wake:"Wake Protocol",training:"Training Log",
  sleep:"Sleep Tracker",prayers:"Daily Prayers",quran:"Quran Log",
  control:"Control Mode",weight:"Weight History",
};

function AppInner(){
  const{state,dispatch}=useStore();
  const[page,setPage]=useState("dashboard");
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const navigate=useCallback((p)=>{setPage(p);},[]);

  // Show onboarding on first ever visit
  if(!state.profile.onboarded){
    return<Onboarding onComplete={(name)=>dispatch({type:"SET_NAME",name})}/>;
  }

  const renderPage=()=>{
    switch(page){
      case "dashboard": return<Dashboard navigate={navigate}/>;
      case "wake":      return<Wake/>;
      case "training":  return<Training/>;
      case "sleep":     return<Sleep/>;
      case "prayers":   return<Prayers/>;
      case "quran":     return<Quran/>;
      case "weight":    return<WeightDetail navigate={navigate}/>;
      case "control":   return<ControlMode navigate={navigate}/>;
      default:          return<Dashboard navigate={navigate}/>;
    }
  };

  return(
    <>
      <Sidebar page={page} navigate={navigate} open={sidebarOpen} setOpen={setSidebarOpen}/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <header style={{height:"56px",display:"flex",alignItems:"center",padding:"0 20px",gap:"14px",borderBottom:"1px solid var(--border)",background:"var(--bg1)",position:"sticky",top:0,zIndex:30}}>
          <button onClick={()=>setSidebarOpen(o=>!o)}
            style={{background:"none",border:"1px solid var(--border)",color:"var(--text2)",cursor:"pointer",width:"32px",height:"32px",borderRadius:"7px",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            ☰
          </button>
          <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)",letterSpacing:"0.2em"}}>
            {PAGE_LABELS[page]||""}
          </span>
        </header>
        <main style={{flex:1,padding:"24px 20px",maxWidth:"860px"}}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default function App(){
  return(
    <StoreProvider>
      <GlobalStyles/>
      <AppInner/>
    </StoreProvider>
  );
}
