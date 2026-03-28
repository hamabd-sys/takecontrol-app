import { useState, useEffect, useReducer, createContext, useContext, useCallback, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --bg:#080808; --bg1:#0e0e0f; --bg2:#151517; --bg3:#1c1c1f; --bg4:#242428;
      --border:#2a2a2e; --border2:#3a3a40;
      --text:#f5f5f5;
      --text2:#c0c0c8;
      --text3:#909098;
      --accent:#00e5b0; --accent-dim:rgba(0,229,176,.12);
      --accent2:#00b8e6;
      --purple:#b06cfe; --purple-dim:rgba(176,108,254,.12);
      --warn:#e6a000; --success:#00c97a;
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
    @keyframes revealUp {from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
    @keyframes shake    {0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-7px);}40%,80%{transform:translateX(7px);}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,176,.3);}50%{box-shadow:0 0 18px 4px rgba(0,229,176,.12);}}
    @keyframes purpleGlow{0%,100%{box-shadow:0 0 0 0 rgba(176,108,254,.3);}50%{box-shadow:0 0 20px 4px rgba(176,108,254,.15);}}
    @keyframes swordSpin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
    .fu {animation:fadeUp .35s ease both;}
    .fu1{animation:fadeUp .35s .06s ease both;}
    .fu2{animation:fadeUp .35s .12s ease both;}
    .fu3{animation:fadeUp .35s .18s ease both;}
    .fu4{animation:fadeUp .35s .24s ease both;}
    .fu5{animation:fadeUp .35s .30s ease both;}
    .modal-bg  {animation:fadeIn .2s ease;}
    .modal-card{animation:scaleIn .25s cubic-bezier(.34,1.56,.64,1);}
    .ob-logo{animation:revealUp .55s .15s cubic-bezier(.2,1,.3,1) both;}
    .ob-h1  {animation:revealUp .6s  .35s cubic-bezier(.2,1,.3,1) both;}
    .ob-h2  {animation:revealUp .6s  .50s cubic-bezier(.2,1,.3,1) both;}
    .ob-sub {animation:revealUp .5s  .65s cubic-bezier(.2,1,.3,1) both;}
    .ob-inp {animation:revealUp .5s  .78s cubic-bezier(.2,1,.3,1) both;}
    .ob-btn {animation:revealUp .5s  .90s cubic-bezier(.2,1,.3,1) both;}
    .shake  {animation:shake .4s ease;}
    .glow-complete{animation:glowPulse 1.8s ease 3;}
  `}</style>
);

// ─── LOGO MARK ────────────────────────────────────────────────────────────────
function LogoMark({ size = 36, animated = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <filter id="cyanGlow">
          <feGaussianBlur stdDeviation="1.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="purpleGlow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Bow arc — outer curve */}
      <path d="M9,5 C26,5 33,13 27,35" stroke="#00e5b0" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyanGlow)"/>
      {/* Bowstring */}
      <line x1="9" y1="5" x2="27" y2="35" stroke="#00e5b0" strokeWidth="0.8" strokeDasharray="2.5,2.5" opacity="0.55"/>
      {/* Sword blade — diagonal slash across the bow */}
      <line x1="32" y1="8" x2="12" y2="32" stroke="#f5f5f5" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Crossguard */}
      <line x1="18" y1="20" x2="26" y2="14" stroke="#f5f5f5" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Pommel dot — purple */}
      <circle cx="32" cy="8" r="2.5" fill="#b06cfe" filter="url(#purpleGlow)" opacity="0.9"/>
      {/* Arrow nocked on string */}
      <circle cx="18" cy="20" r="1.5" fill="#00e5b0" opacity="0.7"/>
      {/* Tip glow */}
      <circle cx="12" cy="32" r="1.5" fill="#00e5b0" opacity="0.4"/>
    </svg>
  );
}

// ─── QUOTES ───────────────────────────────────────────────────────────────────
const QUOTES = [
  {text:"The nafs is your greatest enemy — and your greatest conquest.",              src:""},
  {text:"Discipline is the bridge between who you are and who you must become.",       src:""},
  {text:"He who controls himself controls his destiny.",                               src:""},
  {text:"Sufferance now. Sovereignty later.",                                          src:""},
  {text:"Every day you win or you lose. There is no middle.",                          src:""},
  {text:"The strong is not the one who overcomes people. The strong overcomes himself.",src:"Prophet Muhammad ﷺ"},
  {text:"Whoever controls the morning controls the day.",                              src:""},
  {text:"Your habits are your character. Build them deliberately.",                    src:""},
  {text:"An arrow can only fly forward after being pulled back.",                      src:""},
  {text:"Accountability to yourself is the hardest and most important form.",          src:""},
  {text:"Allah does not change the condition of a people until they change themselves.",src:"Quran 13:11"},
  {text:"The wound is where the light enters.",                                        src:"Rumi"},
  {text:"Sleep on your intentions. Wake on your actions.",                             src:""},
  {text:"Comfort is the enemy of progress. Embrace the resistance.",                  src:""},
];
const getDailyQuote = () => {
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  return QUOTES[daysSinceEpoch % QUOTES.length];
};

// ─── SURAHS (all 114) ─────────────────────────────────────────────────────────
const SURAHS = [
  {n:1,  en:"Al-Fatihah",     ar:"الفاتحة",    alt:["fatiha","opening","fatihah"]},
  {n:2,  en:"Al-Baqarah",     ar:"البقرة",      alt:["baqara","baqarah","cow","baqra"]},
  {n:3,  en:"Aali Imran",     ar:"آل عمران",    alt:["ali imran","imran","family of imran"]},
  {n:4,  en:"An-Nisa",        ar:"النساء",      alt:["nisa","women"]},
  {n:5,  en:"Al-Ma'idah",     ar:"المائدة",     alt:["maidah","table"]},
  {n:6,  en:"Al-An'am",       ar:"الأنعام",     alt:["anam","cattle","livestock"]},
  {n:7,  en:"Al-A'raf",       ar:"الأعراف",     alt:["araf","heights"]},
  {n:8,  en:"Al-Anfal",       ar:"الأنفال",     alt:["anfal","spoils"]},
  {n:9,  en:"At-Tawbah",      ar:"التوبة",      alt:["tawbah","tawba","repentance","bara'ah"]},
  {n:10, en:"Yunus",          ar:"يونس",        alt:["yunus","jonah"]},
  {n:11, en:"Hud",            ar:"هود",         alt:["hud"]},
  {n:12, en:"Yusuf",          ar:"يوسف",        alt:["yusuf","joseph"]},
  {n:13, en:"Ar-Ra'd",        ar:"الرعد",       alt:["rad","thunder"]},
  {n:14, en:"Ibrahim",        ar:"إبراهيم",     alt:["ibrahim","abraham"]},
  {n:15, en:"Al-Hijr",        ar:"الحجر",       alt:["hijr","rocky tract"]},
  {n:16, en:"An-Nahl",        ar:"النحل",       alt:["nahl","bee"]},
  {n:17, en:"Al-Isra",        ar:"الإسراء",     alt:["isra","night journey","bani israel"]},
  {n:18, en:"Al-Kahf",        ar:"الكهف",       alt:["kahf","cave"]},
  {n:19, en:"Maryam",         ar:"مريم",        alt:["maryam","mary"]},
  {n:20, en:"Ta-Ha",          ar:"طه",          alt:["taha","ta ha"]},
  {n:21, en:"Al-Anbiya",      ar:"الأنبياء",    alt:["anbiya","prophets"]},
  {n:22, en:"Al-Hajj",        ar:"الحج",        alt:["hajj","pilgrimage"]},
  {n:23, en:"Al-Mu'minun",    ar:"المؤمنون",    alt:["muminun","believers"]},
  {n:24, en:"An-Nur",         ar:"النور",       alt:["nur","light"]},
  {n:25, en:"Al-Furqan",      ar:"الفرقان",     alt:["furqan","criterion"]},
  {n:26, en:"Ash-Shu'ara",    ar:"الشعراء",     alt:["shuara","poets"]},
  {n:27, en:"An-Naml",        ar:"النمل",       alt:["naml","ants"]},
  {n:28, en:"Al-Qasas",       ar:"القصص",       alt:["qasas","stories"]},
  {n:29, en:"Al-Ankabut",     ar:"العنكبوت",    alt:["ankabut","spider"]},
  {n:30, en:"Ar-Rum",         ar:"الروم",       alt:["rum","romans"]},
  {n:31, en:"Luqman",         ar:"لقمان",       alt:["luqman"]},
  {n:32, en:"As-Sajdah",      ar:"السجدة",      alt:["sajdah","prostration"]},
  {n:33, en:"Al-Ahzab",       ar:"الأحزاب",     alt:["ahzab","confederates"]},
  {n:34, en:"Saba",           ar:"سبإ",         alt:["saba","sheba"]},
  {n:35, en:"Fatir",          ar:"فاطر",        alt:["fatir","originator"]},
  {n:36, en:"Ya-Sin",         ar:"يس",          alt:["yasin","ya sin"]},
  {n:37, en:"As-Saffat",      ar:"الصافات",     alt:["saffat","those who set the ranks"]},
  {n:38, en:"Sad",            ar:"ص",           alt:["sad","saad"]},
  {n:39, en:"Az-Zumar",       ar:"الزمر",       alt:["zumar","groups"]},
  {n:40, en:"Ghafir",         ar:"غافر",        alt:["ghafir","forgiving","mu'min"]},
  {n:41, en:"Fussilat",       ar:"فصلت",        alt:["fussilat","explained in detail"]},
  {n:42, en:"Ash-Shura",      ar:"الشورى",      alt:["shura","consultation"]},
  {n:43, en:"Az-Zukhruf",     ar:"الزخرف",      alt:["zukhruf","ornaments"]},
  {n:44, en:"Ad-Dukhan",      ar:"الدخان",      alt:["dukhan","smoke"]},
  {n:45, en:"Al-Jathiyah",    ar:"الجاثية",     alt:["jathiyah","crouching"]},
  {n:46, en:"Al-Ahqaf",       ar:"الأحقاف",     alt:["ahqaf","wind sandhills"]},
  {n:47, en:"Muhammad",       ar:"محمد",        alt:["muhammad","mohammed"]},
  {n:48, en:"Al-Fath",        ar:"الفتح",       alt:["fath","victory"]},
  {n:49, en:"Al-Hujurat",     ar:"الحجرات",     alt:["hujurat","chambers"]},
  {n:50, en:"Qaf",            ar:"ق",           alt:["qaf"]},
  {n:51, en:"Adh-Dhariyat",   ar:"الذاريات",    alt:["dhariyat","scattering winds"]},
  {n:52, en:"At-Tur",         ar:"الطور",       alt:["tur","mount"]},
  {n:53, en:"An-Najm",        ar:"النجم",       alt:["najm","star"]},
  {n:54, en:"Al-Qamar",       ar:"القمر",       alt:["qamar","moon"]},
  {n:55, en:"Ar-Rahman",      ar:"الرحمن",      alt:["rahman","most gracious"]},
  {n:56, en:"Al-Waqi'ah",     ar:"الواقعة",     alt:["waqiah","waqia","inevitable"]},
  {n:57, en:"Al-Hadid",       ar:"الحديد",      alt:["hadid","iron"]},
  {n:58, en:"Al-Mujadila",    ar:"المجادلة",    alt:["mujadila","dispute"]},
  {n:59, en:"Al-Hashr",       ar:"الحشر",       alt:["hashr","exile"]},
  {n:60, en:"Al-Mumtahanah",  ar:"الممتحنة",    alt:["mumtahanah","testing"]},
  {n:61, en:"As-Saf",         ar:"الصف",        alt:["saf","saff","ranks"]},
  {n:62, en:"Al-Jumu'ah",     ar:"الجمعة",      alt:["jumu'ah","juma","friday","congregation"]},
  {n:63, en:"Al-Munafiqun",   ar:"المنافقون",   alt:["munafiqun","hypocrites"]},
  {n:64, en:"At-Taghabun",    ar:"التغابن",     alt:["taghabun","mutual disillusion"]},
  {n:65, en:"At-Talaq",       ar:"الطلاق",      alt:["talaq","divorce"]},
  {n:66, en:"At-Tahrim",      ar:"التحريم",     alt:["tahrim","prohibition"]},
  {n:67, en:"Al-Mulk",        ar:"الملك",       alt:["mulk","sovereignty","dominion"]},
  {n:68, en:"Al-Qalam",       ar:"القلم",       alt:["qalam","pen"]},
  {n:69, en:"Al-Haqqah",      ar:"الحاقة",      alt:["haqqah","reality","inevitable"]},
  {n:70, en:"Al-Ma'arij",     ar:"المعارج",     alt:["ma'arij","ascending stairways"]},
  {n:71, en:"Nuh",            ar:"نوح",         alt:["nuh","noah"]},
  {n:72, en:"Al-Jinn",        ar:"الجن",        alt:["jinn"]},
  {n:73, en:"Al-Muzzammil",   ar:"المزمل",      alt:["muzzammil","enshrouded"]},
  {n:74, en:"Al-Muddaththir", ar:"المدثر",      alt:["muddaththir","wrapped"]},
  {n:75, en:"Al-Qiyamah",     ar:"القيامة",     alt:["qiyamah","resurrection"]},
  {n:76, en:"Al-Insan",       ar:"الإنسان",     alt:["insan","human","dahr"]},
  {n:77, en:"Al-Mursalat",    ar:"المرسلات",    alt:["mursalat","emissaries"]},
  {n:78, en:"An-Naba",        ar:"النبإ",       alt:["naba","great news","tidings"]},
  {n:79, en:"An-Nazi'at",     ar:"النازعات",    alt:["nazi'at","soul-snatchers"]},
  {n:80, en:"Abasa",          ar:"عبس",         alt:["abasa","he frowned"]},
  {n:81, en:"At-Takwir",      ar:"التكوير",     alt:["takwir","folding up"]},
  {n:82, en:"Al-Infitar",     ar:"الانفطار",    alt:["infitar","cleaving"]},
  {n:83, en:"Al-Mutaffifin",  ar:"المطففين",    alt:["mutaffifin","defrauding"]},
  {n:84, en:"Al-Inshiqaq",    ar:"الانشقاق",    alt:["inshiqaq","splitting open"]},
  {n:85, en:"Al-Buruj",       ar:"البروج",      alt:["buruj","constellations"]},
  {n:86, en:"At-Tariq",       ar:"الطارق",      alt:["tariq","morning star"]},
  {n:87, en:"Al-A'la",        ar:"الأعلى",      alt:["ala","a'la","the most high"]},
  {n:88, en:"Al-Ghashiyah",   ar:"الغاشية",     alt:["ghashiyah","overwhelming"]},
  {n:89, en:"Al-Fajr",        ar:"الفجر",       alt:["fajr","dawn"]},
  {n:90, en:"Al-Balad",       ar:"البلد",       alt:["balad","city"]},
  {n:91, en:"Ash-Shams",      ar:"الشمس",       alt:["shams","sun"]},
  {n:92, en:"Al-Layl",        ar:"الليل",       alt:["layl","night"]},
  {n:93, en:"Ad-Duha",        ar:"الضحى",       alt:["duha","forenoon"]},
  {n:94, en:"Ash-Sharh",      ar:"الشرح",       alt:["sharh","relief","inshirah"]},
  {n:95, en:"At-Tin",         ar:"التين",       alt:["tin","fig"]},
  {n:96, en:"Al-Alaq",        ar:"العلق",       alt:["alaq","clot","iqra"]},
  {n:97, en:"Al-Qadr",        ar:"القدر",       alt:["qadr","night of decree","power"]},
  {n:98, en:"Al-Bayyinah",    ar:"البينة",      alt:["bayyinah","clear evidence"]},
  {n:99, en:"Az-Zalzalah",    ar:"الزلزلة",     alt:["zalzalah","earthquake"]},
  {n:100,en:"Al-Adiyat",      ar:"العاديات",    alt:["adiyat","war horses"]},
  {n:101,en:"Al-Qari'ah",     ar:"القارعة",     alt:["qari'ah","calamity"]},
  {n:102,en:"At-Takathur",    ar:"التكاثر",     alt:["takathur","rivalry"]},
  {n:103,en:"Al-Asr",         ar:"العصر",       alt:["asr","time","afternoon"]},
  {n:104,en:"Al-Humazah",     ar:"الهمزة",      alt:["humazah","slanderer"]},
  {n:105,en:"Al-Fil",         ar:"الفيل",       alt:["fil","elephant"]},
  {n:106,en:"Quraysh",        ar:"قريش",        alt:["quraysh","quraish"]},
  {n:107,en:"Al-Ma'un",       ar:"الماعون",     alt:["ma'un","small kindnesses"]},
  {n:108,en:"Al-Kawthar",     ar:"الكوثر",      alt:["kawthar","abundance"]},
  {n:109,en:"Al-Kafirun",     ar:"الكافرون",    alt:["kafirun","disbelievers","kafiroon"]},
  {n:110,en:"An-Nasr",        ar:"النصر",       alt:["nasr","victory","help"]},
  {n:111,en:"Al-Masad",       ar:"المسد",       alt:["masad","palm fiber","lahab","abu lahab"]},
  {n:112,en:"Al-Ikhlas",      ar:"الإخلاص",     alt:["ikhlas","sincerity","purity"]},
  {n:113,en:"Al-Falaq",       ar:"الفلق",       alt:["falaq","daybreak"]},
  {n:114,en:"An-Nas",         ar:"الناس",       alt:["nas","mankind","people"]},
];

const searchSurahs = (q) => {
  if (!q || q.trim().length < 1) return [];
  const lower = q.toLowerCase().replace(/['\-]/g, "");
  return SURAHS.filter(s => {
    const en  = s.en.toLowerCase().replace(/['\-]/g, "");
    const alt = s.alt.some(a => a.replace(/['\-]/g, "").includes(lower));
    return en.includes(lower) || s.ar.includes(q) || alt;
  }).slice(0, 7);
};

// ─── PRAYERS CONFIG ───────────────────────────────────────────────────────────
const PRAYERS_DATA = [
  { key:"fajr",    name:"Fajr",    arabic:"الفجر",  time:"Dawn",         color:"#6ea8fe",
    rows:[{field:"sunnahBefore",type:"sunnah",label:"Sunnah Qabliyya",rak:"2 rak'ah"},{field:"fard",type:"fard",label:"Fard",rak:"2 rak'ah"}] },
  { key:"dhuhr",   name:"Dhuhr",   nameFriday:"Jumu'ah", arabic:"الظهر", arabicFriday:"الجمعة", time:"Midday", timeFriday:"Friday Prayer", color:"#ffd166",
    rows:[{field:"sunnahBefore",type:"sunnah",label:"Sunnah Qabliyya",rak:"4 rak'ah"},{field:"fard",type:"fard",label:"Fard",rak:"4 rak'ah"},{field:"sunnahAfter",type:"sunnah",label:"Sunnah Ba'diyya",rak:"2 rak'ah"}],
    rowsFriday:[{field:"sunnahBefore",type:"sunnah",label:"Sunnah Before Jumu'ah",rak:"2 rak'ah"},{field:"fard",type:"fard",label:"Jumu'ah (Fard)",rak:"2 rak'ah"},{field:"sunnahAfter",type:"sunnah",label:"Sunnah After Jumu'ah",rak:"4 rak'ah"}] },
  { key:"asr",     name:"Asr",     arabic:"العصر",  time:"Afternoon",    color:"#ff9f40",
    rows:[{field:"sunnahBefore",type:"sunnah",label:"Sunnah Qabliyya",rak:"4 rak'ah"},{field:"fard",type:"fard",label:"Fard",rak:"4 rak'ah"}] },
  { key:"maghrib", name:"Maghrib", arabic:"المغرب", time:"After Sunset", color:"#ee6c4d",
    rows:[{field:"fard",type:"fard",label:"Fard",rak:"3 rak'ah"},{field:"sunnahAfter",type:"sunnah",label:"Sunnah Ba'diyya",rak:"2 rak'ah"}] },
  { key:"isha",    name:"Isha",    arabic:"العشاء", time:"Night",        color:"#a29bfe",
    rows:[{field:"fard",type:"fard",label:"Fard",rak:"4 rak'ah"},{field:"sunnahAfter",type:"sunnah",label:"Sunnah + Witr",rak:"2 + 3 rak'ah"}] },
];

const QURAN_PAGES = 604;

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const getTodayDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const getDateNDaysAgo = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const uid = () => Math.random().toString(36).slice(2, 9);
const isFridayToday = () => new Date().getDay() === 5;

const calculateClarity = (streak) => Math.min(100, Math.round((streak / 90) * 100));

// CI: weight=5, prayers=35, wake=20, sleep=20, training=20 → max 100
const calculateControlIndex = (state) => {
  let s = 0; const today = getTodayDate();
  if (state.weight.history.some(h => h.date === today)) s += 5;
  const allPrayers = state.prayers[today] && PRAYERS_DATA.every(p => state.prayers[today][p.key]?.fard);
  if (allPrayers) s += 35;
  const wakeComplete = state.wake.tasks.length > 0 && state.wake.tasks.every(t => t.checked) && state.wake.lastCheck === today;
  if (wakeComplete) s += 20;
  if (state.sleep.lastCheck === today) s += 20;
  if (state.training.lastCheck === today) s += 20;
  return s;
};

const getMostCommonTrigger = (triggers) => {
  const e = Object.entries(triggers);
  if (e.every(([,v]) => v === 0)) return null;
  return e.sort((a,b) => b[1]-a[1])[0][0];
};

// 7-day history: compute CI-equivalent score per past day
const getDayScore = (state, dateStr) => {
  let s = 0;
  if (state.weight.history.some(h => h.date === dateStr)) s += 5;
  const allPrayers = state.prayers[dateStr] && PRAYERS_DATA.every(p => state.prayers[dateStr][p.key]?.fard);
  if (allPrayers) s += 35;
  // wake: check if lastCheck matches
  if (state.wake.lastCheck === dateStr) s += 20;
  if (state.sleep.lastCheck === dateStr) s += 20;
  if (state.training.lastCheck === dateStr) s += 20;
  return s;
};

// ─── DEFAULT TASKS ────────────────────────────────────────────────────────────
const MK_WAKE = () => [
  {id:uid(),label:"No phone for first 30 minutes",    checked:false},
  {id:uid(),label:"Drink 500ml water immediately",     checked:false},
  {id:uid(),label:"5 minutes of deep breathing",       checked:false},
  {id:uid(),label:"Cold exposure — shower or splash",  checked:false},
  {id:uid(),label:"Write down 3 priorities for today", checked:false},
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
  prayers:  {},
  quran:    { logs:[] },
});

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function reorder(arr, id, dir) {
  const a=[...arr]; const i=a.findIndex(t=>t.id===id);
  if(dir==="up"  &&i>0)           [a[i-1],a[i]]=[a[i],a[i-1]];
  if(dir==="down"&&i<a.length-1)  [a[i],a[i+1]]=[a[i+1],a[i]];
  return a;
}

function reducer(state, action) {
  const today = getTodayDate();
  switch (action.type) {
    case "SET_NAME": return { ...state, profile:{ name:action.name, onboarded:true } };
    case "LOG_WEIGHT": {
      if (state.weight.history.some(h=>h.date===today)) return state;
      return { ...state, weight:{ current:action.value, history:[...state.weight.history,{date:today,value:action.value}] } };
    }
    case "TOGGLE_WAKE_TASK": {
      const tasks=state.wake.tasks.map(t=>t.id===action.id?{...t,checked:!t.checked}:t);
      const allDone=tasks.length>0&&tasks.every(t=>t.checked);
      return { ...state, wake:{ ...state.wake, tasks, lastCheck:allDone?today:state.wake.lastCheck } };
    }
    case "ADD_WAKE_TASK":     return { ...state, wake:{ ...state.wake, tasks:[...state.wake.tasks,{id:uid(),label:action.label,checked:false}] } };
    case "DELETE_WAKE_TASK":  return { ...state, wake:{ ...state.wake, tasks:state.wake.tasks.filter(t=>t.id!==action.id) } };
    case "RENAME_WAKE_TASK":  return { ...state, wake:{ ...state.wake, tasks:state.wake.tasks.map(t=>t.id===action.id?{...t,label:action.label}:t) } };
    case "REORDER_WAKE_TASK": return { ...state, wake:{ ...state.wake, tasks:reorder(state.wake.tasks,action.id,action.dir) } };
    case "COMPLETE_TRAINING": {
      if (state.training.lastCheck===today) return state;
      return { ...state, training:{ lastCheck:today } };
    }
    case "TOGGLE_SLEEP_TASK": {
      const tasks=state.sleep.tasks.map(t=>t.id===action.id?{...t,checked:!t.checked}:t);
      const allDone=tasks.length>0&&tasks.every(t=>t.checked);
      return { ...state, sleep:{ ...state.sleep, tasks, tasksLastCheck:allDone?today:state.sleep.tasksLastCheck } };
    }
    case "ADD_SLEEP_TASK":     return { ...state, sleep:{ ...state.sleep, tasks:[...state.sleep.tasks,{id:uid(),label:action.label,checked:false}] } };
    case "DELETE_SLEEP_TASK":  return { ...state, sleep:{ ...state.sleep, tasks:state.sleep.tasks.filter(t=>t.id!==action.id) } };
    case "RENAME_SLEEP_TASK":  return { ...state, sleep:{ ...state.sleep, tasks:state.sleep.tasks.map(t=>t.id===action.id?{...t,label:action.label}:t) } };
    case "REORDER_SLEEP_TASK": return { ...state, sleep:{ ...state.sleep, tasks:reorder(state.sleep.tasks,action.id,action.dir) } };
    case "LOG_SLEEP": {
      if (state.sleep.lastCheck===today) return state;
      return { ...state, sleep:{ ...state.sleep, hours:action.hours, lastCheck:today } };
    }
    case "CONTROL_SUCCESS": {
      if (state.control.lastCheck===today) return state;
      const ns=state.control.streak+1;
      return { ...state, control:{ ...state.control, streak:ns, best:Math.max(state.control.best,ns), lastCheck:today, history:[...state.control.history,{date:today,success:true}] } };
    }
    case "CONTROL_FAIL": {
      if (state.control.lastCheck===today) return state;
      const tr={...state.control.triggers};
      if (action.trigger&&tr[action.trigger]!==undefined) tr[action.trigger]++;
      return { ...state, control:{ ...state.control, streak:0, lastCheck:today, history:[...state.control.history,{date:today,success:false,trigger:action.trigger}], triggers:tr } };
    }
    case "CONTROL_OVERRIDE_FAIL": {
      const tr={...state.control.triggers};
      if (action.trigger&&tr[action.trigger]!==undefined) tr[action.trigger]++;
      const history=state.control.history.map((h,i)=>
        i===state.control.history.length-1&&h.date===today?{date:today,success:false,trigger:action.trigger}:h
      );
      return { ...state, control:{ ...state.control, streak:0, history, triggers:tr } };
    }
    case "TOGGLE_PRAYER": {
      const {date,prayerKey,field}=action;
      const dayLog=state.prayers[date]||{};
      const pLog=dayLog[prayerKey]||{};
      return { ...state, prayers:{ ...state.prayers,[date]:{ ...dayLog,[prayerKey]:{ ...pLog,[field]:!pLog[field] } } } };
    }
    case "LOG_QURAN":        return { ...state, quran:{ logs:[...state.quran.logs,action.entry] } };
    case "DELETE_QURAN_LOG": return { ...state, quran:{ logs:state.quran.logs.filter(l=>l.id!==action.id) } };
    case "RESET": return buildInitial();
    default: return state;
  }
}

// ─── STORE ────────────────────────────────────────────────────────────────────
const Ctx = createContext(null);
function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const raw = localStorage.getItem("tc_v6");
      if (!raw) return buildInitial();
      const s = JSON.parse(raw); const i = buildInitial();
      return { profile:s.profile||i.profile, weight:s.weight||i.weight, wake:s.wake||i.wake, training:s.training||i.training, sleep:s.sleep||i.sleep, control:s.control||i.control, prayers:s.prayers||i.prayers, quran:s.quran||i.quran };
    } catch { return buildInitial(); }
  });
  useEffect(() => { try { localStorage.setItem("tc_v6", JSON.stringify(state)); } catch {} }, [state]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
const useStore = () => useContext(Ctx);

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Card({ children, style={}, cls="", onClick }) {
  return <div className={cls} onClick={onClick} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"16px", padding:"22px", ...style }}>{children}</div>;
}
function Label({ children, purple }) {
  return <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:purple?"var(--purple)":"var(--text2)", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:"14px", paddingBottom:"10px", borderBottom:`1px solid ${purple?"rgba(176,108,254,.2)":"var(--border)"}` }}>{children}</div>;
}
function PageSub({ children }) {
  return <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.15em", marginTop:"5px" }}>{children}</div>;
}
function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
      <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.15em" }}>{label}</div>
      <div style={{ fontFamily:"var(--font-d)", fontSize:"34px", color:accent||"var(--text)" }}>{value??'—'}</div>
      {sub && <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)" }}>{sub}</div>}
    </div>
  );
}
function MiniStat({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.12em", marginBottom:"2px" }}>{label}</div>
      <div style={{ fontFamily:"var(--font-d)", fontSize:"20px", color:accent||"var(--text)" }}>{value}</div>
    </div>
  );
}

const BTN_V = {
  primary:   { background:"var(--accent)", color:"#000", border:"none" },
  secondary: { background:"transparent", color:"var(--text2)", border:"1px solid var(--border2)" },
  danger:    { background:"rgba(230,64,64,.1)", color:"#f87171", border:"1px solid rgba(230,64,64,.28)" },
  warn:      { background:"rgba(230,160,0,.09)", color:"var(--warn)", border:"1px solid rgba(230,160,0,.22)" },
  success:   { background:"rgba(0,201,122,.09)", color:"var(--success)", border:"1px solid rgba(0,201,122,.22)" },
  ghost:     { background:"var(--bg3)", color:"var(--text2)", border:"1px solid var(--border)" },
  purple:    { background:"var(--purple-dim)", color:"var(--purple)", border:"1px solid rgba(176,108,254,.3)" },
};
function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding:"12px 20px", borderRadius:"10px", fontFamily:"var(--font-ui)", fontSize:"13px", fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", cursor:disabled?"default":"pointer", opacity:disabled? 0.4 : 1:1, ...BTN_V[variant], ...style }}>{children}</button>;
}
function Tag({ children, done }) {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"3px 9px", borderRadius:"5px", fontFamily:"var(--font-m)", fontSize:"10px", background:done?"rgba(0,229,176,.07)":"rgba(255,255,255,.03)", color:done?"var(--accent)":"var(--text3)", border:`1px solid ${done?"rgba(0,229,176,.18)":"var(--border)"}` }}>{done?"✓":"·"} {children}</span>;
}
function IconBtn({ children, onClick, disabled, danger, title }) {
  return <button title={title} onClick={onClick} disabled={disabled} style={{ width:"26px", height:"26px", borderRadius:"6px", flexShrink:0, background:danger?"rgba(230,64,64,.07)":"var(--bg4)", border:`1px solid ${danger?"rgba(230,64,64,.18)":"var(--border)"}`, color:danger?"#f87171":"var(--text2)", cursor:disabled?"default":"pointer", opacity:disabled? 0.25 : 1:1, fontSize:"11px", display:"flex", alignItems:"center", justifyContent:"center" }}>{children}</button>;
}

// ─── TASK MANAGER ─────────────────────────────────────────────────────────────
function TaskManager({ tasks, prefix, lastCheck, dispatch }) {
  const [newLabel,setNewLabel] = useState("");
  const [editId,setEditId]     = useState(null);
  const [editVal,setEditVal]   = useState("");
  const ref = useRef(null);
  const today = getTodayDate();
  const checked  = tasks.filter(t=>t.checked).length;
  const allDone  = tasks.length>0&&checked===tasks.length;
  const done     = allDone&&lastCheck===today;

  const handleAdd = () => { const l=newLabel.trim(); if(!l) return; dispatch({type:`ADD_${prefix}_TASK`,label:l}); setNewLabel(""); ref.current?.focus(); };
  const startEdit  = (t) => { setEditId(t.id); setEditVal(t.label); };
  const commitEdit = (id) => { const l=editVal.trim(); if(l) dispatch({type:`RENAME_${prefix}_TASK`,id,label:l}); setEditId(null); };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"13px" }}>
        <div style={{ flex:1, height:"3px", background:"var(--bg4)", borderRadius:"2px" }}>
          <div style={{ height:"100%", width:tasks.length?`${(checked/tasks.length)*100}%`:"0%", background:done?"var(--accent)":"var(--border2)", borderRadius:"2px", transition:"width .4s ease,background .3s" }}/>
        </div>
        <span style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:done?"var(--accent)":"var(--text3)", whiteSpace:"nowrap" }}>{checked}/{tasks.length}{done?" ✓":""}</span>
      </div>
      {done && (
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"11px 14px", borderRadius:"10px", background:"rgba(0,229,176,.06)", border:"1px solid rgba(0,229,176,.2)", marginBottom:"13px" }}>
          <span style={{ fontSize:"18px" }}>✓</span>
          <div>
            <div style={{ fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:700, color:"var(--accent)" }}>Routine Complete</div>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", marginTop:"2px" }}>All tasks done — points applied.</div>
          </div>
        </div>
      )}
      <div style={{ display:"grid", gap:"6px" }}>
        {tasks.map((task,idx) => (
          <div key={task.id} style={{ display:"flex", alignItems:"center", gap:"9px", padding:"10px 11px", borderRadius:"10px", background:task.checked?"rgba(0,229,176,.04)":"var(--bg3)", border:`1px solid ${task.checked?"rgba(0,229,176,.14)":"var(--border)"}`, transition:"all .18s" }}>
            <button onClick={()=>dispatch({type:`TOGGLE_${prefix}_TASK`,id:task.id})}
              style={{ width:"22px", height:"22px", borderRadius:"6px", flexShrink:0, background:task.checked?"var(--accent)":"var(--bg4)", border:`1px solid ${task.checked?"var(--accent)":"var(--border2)"}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:"#000", fontWeight:700, animation:task.checked?"checkPop .22s ease":"none" }}>
              {task.checked?"✓":""}
            </button>
            {editId===task.id?(
              <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
                onBlur={()=>commitEdit(task.id)} onKeyDown={e=>{if(e.key==="Enter")commitEdit(task.id);if(e.key==="Escape")setEditId(null);}}
                style={{ flex:1, background:"var(--bg1)", border:"1px solid var(--border2)", borderRadius:"6px", padding:"4px 8px", color:"var(--text)", fontFamily:"var(--font-ui)", fontSize:"14px", outline:"none" }}/>
            ):(
              <span onDoubleClick={()=>startEdit(task)} title="Double-click to rename"
                style={{ flex:1, fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:500, color:task.checked?"var(--text3)":"var(--text)", textDecoration:task.checked?"line-through":"none", cursor:"text", userSelect:"none" }}>
                {task.label}
              </span>
            )}
            <div style={{ display:"flex", gap:"4px" }}>
              <IconBtn title="Up"     onClick={()=>dispatch({type:`REORDER_${prefix}_TASK`,id:task.id,dir:"up"})}   disabled={idx===0}>↑</IconBtn>
              <IconBtn title="Down"   onClick={()=>dispatch({type:`REORDER_${prefix}_TASK`,id:task.id,dir:"down"})} disabled={idx===tasks.length-1}>↓</IconBtn>
              <IconBtn title="Rename" onClick={()=>startEdit(task)}>✎</IconBtn>
              <IconBtn title="Delete" onClick={()=>dispatch({type:`DELETE_${prefix}_TASK`,id:task.id})} danger>✕</IconBtn>
            </div>
          </div>
        ))}
        {tasks.length===0&&<div style={{ textAlign:"center", padding:"22px", fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)" }}>No tasks — add one below.</div>}
      </div>
      <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
        <input ref={ref} value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Add a task…"
          style={{ flex:1, background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:"8px", padding:"9px 13px", color:"var(--text)", fontFamily:"var(--font-ui)", fontSize:"14px", outline:"none" }}/>
        <Btn variant="ghost" onClick={handleAdd} style={{ padding:"9px 16px", fontSize:"18px", fontWeight:400, letterSpacing:0 }}>+</Btn>
      </div>
    </div>
  );
}

// ─── SURAH AUTOCOMPLETE ───────────────────────────────────────────────────────
function SurahInput({ value, onChange }) {
  const [open,setOpen]   = useState(false);
  const [query,setQuery] = useState(value||"");
  const results = searchSurahs(query);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);

  const select = (s) => { const l=`${s.en} (${s.ar})`; setQuery(l); onChange(l); setOpen(false); };
  const handleChange = (e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(e.target.value.length>0); };

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <input type="text" placeholder="e.g. Kahf, Rahman…" value={query} onChange={handleChange} onFocus={()=>query.length>0&&setOpen(true)}
        style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:"8px", padding:"9px 12px", color:"var(--text)", fontFamily:"var(--font-ui)", fontSize:"15px", outline:"none" }}/>
      {open && results.length>0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:20, background:"var(--bg1)", border:"1px solid var(--border2)", borderRadius:"10px", overflow:"hidden", boxShadow:"0 10px 40px rgba(0,0,0,.7)" }}>
          {results.map(s=>(
            <button key={s.n} onMouseDown={()=>select(s)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 14px", background:"none", border:"none", borderBottom:"1px solid var(--border)", cursor:"pointer", textAlign:"left" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <div>
                <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginRight:"8px" }}>{String(s.n).padStart(3,"0")}</span>
                <span style={{ fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:600, color:"var(--text)" }}>{s.en}</span>
              </div>
              <span style={{ fontFamily:"var(--font-d)", fontSize:"16px", color:"var(--text3)", letterSpacing:0, direction:"rtl" }}>{s.ar}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WEIGHT CHART ─────────────────────────────────────────────────────────────
function WeightChart({ history, period }) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-period);
  const data = history.filter(h=>new Date(h.date+"T12:00:00")>=cutoff).sort((a,b)=>a.date.localeCompare(b.date));
  if (data.length===0) return <div style={{ textAlign:"center", padding:"48px 0", fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)" }}>No data for this period.</div>;

  const W=500,H=160,PL=50,PR=16,PT=14,PB=28;
  const cW=W-PL-PR,cH=H-PT-PB;
  const vals=data.map(d=>d.value);
  const minV=Math.min(...vals),maxV=Math.max(...vals),range=maxV-minV||0.5;
  const xPos=(i)=>PL+(data.length<2?cW/2:(i/(data.length-1))*cW);
  const yPos=(v)=>PT+cH-((v-minV)/range)*cH;
  const lp=data.map((d,i)=>`${i===0?"M":"L"}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(" ");
  const ap=data.length>=2?`${lp} L${xPos(data.length-1).toFixed(1)},${(PT+cH).toFixed(1)} L${xPos(0).toFixed(1)},${(PT+cH).toFixed(1)}Z`:"";
  const fmt=(s)=>{const d=new Date(s+"T12:00:00");return `${d.getDate()}/${d.getMonth()+1}`;};
  const xCount=Math.min(5,data.length);
  const xIdx=data.length<=xCount?data.map((_,i)=>i):Array.from({length:xCount},(_,i)=>Math.round(i*(data.length-1)/(xCount-1)));
  const change=data.length>=2?((data[data.length-1].value-data[0].value)).toFixed(1):null;
  const cc=change===null?"var(--text3)":parseFloat(change)<0?"var(--accent)":parseFloat(change)>0?"#f87171":"var(--text3)";

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
        <defs>
          <linearGradient id="wgrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5b0" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#00e5b0" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,.5,1].map((t,i)=><line key={i} x1={PL} y1={PT+cH*t} x2={W-PR} y2={PT+cH*t} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,6"/>)}
        {ap&&<path d={ap} fill="url(#wgrad2)"/>}
        {data.length>=2&&<path d={lp} fill="none" stroke="#00e5b0" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>}
        {data.map((d,i)=><circle key={i} cx={xPos(i)} cy={yPos(d.value)} r={data.length>30?2:4} fill="#00e5b0"/>)}
        {[minV,(minV+maxV)/2,maxV].map((v,i)=><text key={i} x={PL-6} y={yPos(v)+4} fill="var(--text3)" fontSize="9" fontFamily="monospace" textAnchor="end">{Math.round(v*10)/10}</text>)}
        {xIdx.map(idx=><text key={idx} x={xPos(idx)} y={H-5} fill="var(--text3)" fontSize="9" fontFamily="monospace" textAnchor="middle">{fmt(data[idx].date)}</text>)}
      </svg>
      <div style={{ display:"flex", gap:"20px", marginTop:"16px", flexWrap:"wrap", borderTop:"1px solid var(--border)", paddingTop:"14px" }}>
        <MiniStat label="CURRENT" value={`${data[data.length-1].value} kg`} accent="var(--text)"/>
        {data.length>=2&&<><MiniStat label="CHANGE" value={`${parseFloat(change)>0?"+":""}${change} kg`} accent={cc}/><MiniStat label="LOW" value={`${minV} kg`}/><MiniStat label="HIGH" value={`${maxV} kg`}/></>}
        <MiniStat label="ENTRIES" value={data.length}/>
      </div>
    </div>
  );
}

// ─── 7-DAY HEATMAP ────────────────────────────────────────────────────────────
function WeekHeatmap() {
  const { state } = useStore();
  const days = Array.from({length:7},(_,i)=>{
    const d = getDateNDaysAgo(6-i);
    const score = getDayScore(state,d);
    const label = new Date(d+"T12:00:00").toLocaleDateString("en",{weekday:"short"});
    return { date:d, score, label };
  });

  const getColor = (s) => {
    if (s >= 90) return "#00e5b0";
    if (s >= 60) return "#00b8e6";
    if (s >= 35) return "#b06cfe";
    if (s >= 10) return "#e6a000";
    return "var(--bg4)";
  };

  return (
    <div>
      <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.15em", marginBottom:"10px" }}>7-DAY OVERVIEW</div>
      <div style={{ display:"flex", gap:"6px" }}>
        {days.map(d=>(
          <div key={d.date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"9px", color:"var(--text3)" }}>{d.label.toUpperCase()}</div>
            <div title={`${d.date}: ${d.score}/100`} style={{ width:"100%", height:"36px", borderRadius:"6px", background:getColor(d.score), border:`1px solid ${getColor(d.score) === "var(--bg4)"?"var(--border)":getColor(d.score)+"44"}`, opacity:d.date===getTodayDate()?1:0.7, boxShadow: d.score>=90?`0 0 10px ${getColor(d.score)}55`:"none", transition:"all .2s" }}/>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"9px", color:d.score>0?"var(--text2)":"var(--text3)" }}>{d.score}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:"10px", marginTop:"10px", flexWrap:"wrap" }}>
        {[{c:"#00e5b0",l:"90-100"},{c:"#00b8e6",l:"60-89"},{c:"#b06cfe",l:"35-59"},{c:"#e6a000",l:"10-34"},{c:"var(--bg4)",l:"0-9"}].map(x=>(
          <div key={x.l} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"2px", background:x.c, border:`1px solid ${x.c==="var(--bg4)"?"var(--border)":x.c+"55"}` }}/>
            <span style={{ fontFamily:"var(--font-m)", fontSize:"9px", color:"var(--text3)" }}>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [name,setName]     = useState("");
  const [shaking,setShake] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{ const t=setTimeout(()=>ref.current?.focus(),1100); return ()=>clearTimeout(t); },[]);

  const submit = () => {
    const n=name.trim(); if (!n) { setShake(true); setTimeout(()=>setShake(false),500); return; }
    onComplete(n);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:.022, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,var(--accent) 40px,var(--accent) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,var(--accent) 40px,var(--accent) 41px)" }}/>
      {/* Purple glow */}
      <div style={{ position:"absolute", top:"30%", left:"60%", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle,rgba(176,108,254,.06) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"60%", left:"20%", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,229,176,.04) 0%,transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:"500px", width:"100%", zIndex:1 }}>
        <div className="ob-logo" style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"32px" }}>
          <LogoMark size={40}/>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.32em" }}>TAKE CTRL — BEHAVIORAL OS</div>
        </div>
        <div className="ob-h1" style={{ fontFamily:"var(--font-d)", fontSize:"clamp(58px,11vw,88px)", lineHeight:.9, color:"var(--accent)" }}>WHAT DO WE</div>
        <div className="ob-h2" style={{ fontFamily:"var(--font-d)", fontSize:"clamp(58px,11vw,88px)", lineHeight:.95, color:"var(--text)", marginBottom:"14px" }}>CALL YOU?</div>
        <div className="ob-sub" style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.15em", marginBottom:"28px", lineHeight:1.8 }}>
          THIS SYSTEM TRACKS YOUR DISCIPLINE.<br/>
          <span style={{ color:"var(--purple)" }}>WIN EACH DAY.</span> EVERY DAY.
        </div>
        <div className={`ob-inp${shaking?" shake":""}`} style={{ marginBottom:"12px" }}>
          <input ref={ref} type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Your name" maxLength={30}
            style={{ width:"100%", background:"rgba(255,255,255,.04)", border:`1px solid ${shaking?"rgba(230,64,64,.5)":"rgba(176,108,254,.25)"}`, borderRadius:"12px", padding:"18px 20px", color:"var(--text)", fontFamily:"var(--font-d)", fontSize:"36px", outline:"none", letterSpacing:"0.1em", transition:"border-color .2s", boxShadow:"0 0 0 0 rgba(176,108,254,0)" }}/>
          {shaking&&<div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"#f87171", marginTop:"7px", letterSpacing:"0.1em" }}>A NAME IS REQUIRED TO PROCEED.</div>}
        </div>
        <div className="ob-btn">
          <button onClick={submit} style={{ width:"100%", padding:"18px", background:"var(--accent)", border:"none", borderRadius:"12px", color:"#000", fontFamily:"var(--font-d)", fontSize:"28px", letterSpacing:"0.18em", cursor:"pointer" }}>PROCEED →</button>
        </div>
      </div>
    </div>
  );
}

// ─── WEIGHT MODAL ─────────────────────────────────────────────────────────────
function WeightModal({ onClose }) {
  const { dispatch } = useStore();
  const [val,setVal]   = useState("");
  const [unit,setUnit] = useState("kg");
  const submit = () => { const n=parseFloat(val); if(!n||n<=0) return; dispatch({type:"LOG_WEIGHT",value:n}); onClose(); };
  return (
    <div className="modal-bg" style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,.8)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div className="modal-card" style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:"20px", padding:"32px", maxWidth:"360px", width:"100%" }}>
        <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.2em", marginBottom:"8px" }}>DAILY CHECK-IN</div>
        <div style={{ fontFamily:"var(--font-d)", fontSize:"40px", color:"var(--text)", lineHeight:1, marginBottom:"6px" }}>Log Your Weight</div>
        <div style={{ fontFamily:"var(--font-ui)", fontSize:"14px", color:"var(--text2)", marginBottom:"24px", lineHeight:1.65 }}>Once per day. Consistency builds awareness.</div>
        <div style={{ display:"flex", gap:"8px", marginBottom:"13px" }}>
          {["kg","lbs"].map(u=><button key={u} onClick={()=>setUnit(u)} style={{ flex:1, padding:"8px", borderRadius:"8px", background:unit===u?"var(--accent-dim)":"var(--bg3)", border:`1px solid ${unit===u?"rgba(0,229,176,.35)":"var(--border)"}`, color:unit===u?"var(--accent)":"var(--text2)", fontFamily:"var(--font-m)", fontSize:"11px", cursor:"pointer" }}>{u}</button>)}
        </div>
        <input autoFocus type="number" placeholder={unit==="kg"?"e.g. 82.5":"e.g. 180"} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:"10px", padding:"13px 16px", color:"var(--text)", fontFamily:"var(--font-d)", fontSize:"36px", outline:"none", textAlign:"center", marginBottom:"13px" }}/>
        <div style={{ display:"grid", gap:"8px" }}>
          <Btn variant="primary" onClick={submit} style={{ width:"100%", padding:"14px" }}>Log — {val||"—"} {val?unit:""}</Btn>
          <Btn variant="ghost"   onClick={onClose} style={{ width:"100%", padding:"11px" }}>Skip for Today</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, navigate, open, setOpen }) {
  const { state } = useStore();
  const ci = calculateControlIndex(state);
  const ciColor = ci>=80?"var(--accent)":ci>=50?"var(--purple)":ci>=25?"var(--warn)":"var(--text2)";
  const today   = getTodayDate();
  const dayLog  = state.prayers[today]||{};
  const pDone   = PRAYERS_DATA.filter(p=>dayLog[p.key]?.fard).length;

  const routes = [
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"wake",     label:"Wake",     icon:"◎"},
    {id:"training", label:"Training", icon:"◆"},
    {id:"prayers",  label:"Prayers",  icon:"✦", badge:pDone>0?`${pDone}/5`:null},
    {id:"quran",    label:"Quran",    icon:"◉"},
    {id:"control",  label:"Control",  icon:"⬡"},
    {id:"sleep",    label:"Sleep",    icon:"◐"},
  ];

  return (
    <>
      {open&&<div onClick={()=>setOpen(false)} style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,.7)", backdropFilter:"blur(3px)" }}/>}
      <aside style={{ position:"fixed", top:0, left:0, bottom:0, width:"224px", zIndex:50, background:"var(--bg1)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", transform:open?"translateX(0)":"translateX(-100%)", transition:"transform .28s cubic-bezier(.4,0,.2,1)" }}>

        {/* Logo */}
        <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
            <LogoMark size={34}/>
            <div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:"22px", letterSpacing:"0.14em", color:"var(--accent)", lineHeight:1 }}>TAKE CTRL</div>
              <div style={{ fontFamily:"var(--font-m)", fontSize:"9px", color:"var(--text3)", marginTop:"2px", letterSpacing:"0.15em" }}>BEHAVIORAL OS v6</div>
            </div>
          </div>
          {state.profile.name&&<div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text2)", letterSpacing:"0.1em" }}>→ {state.profile.name.toUpperCase()}</div>}
        </div>

        {/* CI */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.14em", marginBottom:"5px" }}>CONTROL INDEX</div>
          <div style={{ display:"flex", alignItems:"baseline", gap:"5px" }}>
            <span style={{ fontFamily:"var(--font-d)", fontSize:"38px", color:ciColor }}>{ci}</span>
            <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>/100</span>
          </div>
          <div style={{ marginTop:"8px", height:"2px", background:"var(--bg3)", borderRadius:"2px" }}>
            <div style={{ height:"100%", width:`${ci}%`, background:ciColor, borderRadius:"2px", transition:"width .5s ease", boxShadow:`0 0 8px ${ciColor}55` }}/>
          </div>
        </div>

        <nav style={{ flex:1, padding:"8px 0", overflowY:"auto" }}>
          {routes.map(r=>{
            const active=page===r.id||(r.id==="dashboard"&&page==="weight");
            return(
              <button key={r.id} onClick={()=>{navigate(r.id);setOpen(false);}}
                style={{ display:"flex", alignItems:"center", gap:"11px", width:"100%", padding:"11px 16px", background:active?"rgba(0,229,176,.07)":"transparent", border:"none", borderLeft:`2px solid ${active?"var(--accent)":"transparent"}`, color:active?"var(--accent)":"var(--text2)", fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer" }}>
                <span style={{ fontSize:"16px", opacity:active?1:.55 }}>{r.icon}</span>
                <span style={{ flex:1, textAlign:"left" }}>{r.label}</span>
                {r.badge&&<span style={{ fontFamily:"var(--font-m)", fontSize:"9px", color:"var(--accent)", background:"rgba(0,229,176,.1)", border:"1px solid rgba(0,229,176,.2)", borderRadius:"4px", padding:"1px 5px" }}>{r.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding:"13px 18px", borderTop:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>{getTodayDate()}</div>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginTop:"2px" }}>STREAK: <span style={{ color:"var(--purple)" }}>{state.control.streak}d</span></div>
        </div>
      </aside>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ navigate }) {
  const { state } = useStore();
  const today   = getTodayDate();
  const ci      = calculateControlIndex(state);
  const clarity = calculateClarity(state.control.streak);
  const quote   = getDailyQuote();

  // Weight modal
  const notLogged    = !state.weight.history.some(h=>h.date===today);
  const notDismissed = !sessionStorage.getItem(`wt_${today}`);
  const [showWeight,setShowWeight] = useState(notLogged&&notDismissed);
  useEffect(()=>{ if(state.weight.history.some(h=>h.date===today))setShowWeight(false); },[state.weight.history]);
  const dismissWeight = ()=>{ sessionStorage.setItem(`wt_${today}`,"1"); setShowWeight(false); };

  // Compute current states
  const wakeComplete  = state.wake.tasks.length>0&&state.wake.tasks.every(t=>t.checked)&&state.wake.lastCheck===today;
  const trainingToday = state.training.lastCheck===today;
  const sleepToday    = state.sleep.lastCheck===today;
  const weightToday   = state.weight.history.some(h=>h.date===today);
  const dayLog        = state.prayers[today]||{};
  const allPrayers    = PRAYERS_DATA.every(p=>dayLog[p.key]?.fard);
  const prayersDone   = PRAYERS_DATA.filter(p=>dayLog[p.key]?.fard).length;

  // ── Smart checklist: hide items already done when dashboard mounts ──
  const mountSnap = useRef(null);
  if (!mountSnap.current) {
    mountSnap.current = {
      weight:   weightToday,
      wake:     wakeComplete,
      training: trainingToday,
      prayers:  allPrayers,
      sleep:    sleepToday,
    };
  }

  const checklistItems = [
    {key:"weight",  label:"Weight Log",   done:weightToday, page:"weight",  pts:"+5",  glyph:"⬡"},
    {key:"prayers", label:"Prayers",       done:allPrayers,  page:"prayers", pts:"+35", glyph:"✦"},
    {key:"wake",    label:"Wake Routine",  done:wakeComplete, page:"wake",   pts:"+20", glyph:"◎"},
    {key:"sleep",   label:"Sleep",         done:sleepToday,  page:"sleep",   pts:"+20", glyph:"◐"},
    {key:"training",label:"Training",      done:trainingToday,page:"training",pts:"+20",glyph:"◆"},
  ];

  // Items to show: NOT pre-done at mount (show undone + freshly completed this session)
  const visible = checklistItems.filter(item => !mountSnap.current[item.key]);
  const allVisible = visible.length === 0;

  const ciColor = ci>=80?"var(--accent)":ci>=60?"var(--purple)":ci>=35?"var(--warn)":ci>=10?"#888":"var(--text3)";

  return (
    <>
      {showWeight&&<WeightModal onClose={dismissWeight}/>}
      <div style={{ display:"grid", gap:"18px" }}>

        {/* Hero CI */}
        <Card cls="fu" style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:.018, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 28px,var(--accent) 28px,var(--accent) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,var(--accent) 28px,var(--accent) 29px)" }}/>
          {/* Purple corner glow */}
          <div style={{ position:"absolute", top:0, right:0, width:"180px", height:"180px", background:"radial-gradient(circle at 80% 20%, rgba(176,108,254,.08) 0%, transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text2)", letterSpacing:"0.16em", marginBottom:"4px" }}>
            CONTROL INDEX{state.profile.name?` — ${state.profile.name.toUpperCase()}`:""} — {today}
          </div>
          <div style={{ display:"flex", alignItems:"baseline", gap:"10px" }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:"96px", lineHeight:1, color:ciColor, textShadow:ci>=80?`0 0 30px ${ciColor}44`:"none" }}>{ci}</div>
            <div style={{ fontFamily:"var(--font-d)", fontSize:"32px", color:"var(--text3)" }}>/100</div>
          </div>
          <div style={{ marginTop:"16px", height:"3px", background:"var(--bg4)", borderRadius:"2px" }}>
            <div style={{ height:"100%", width:`${ci}%`, background:ciColor, borderRadius:"2px", transition:"width .8s cubic-bezier(.4,0,.2,1)", boxShadow:`0 0 8px ${ciColor}55` }}/>
          </div>
          {/* Point breakdown tags */}
          <div style={{ marginTop:"12px", display:"flex", flexWrap:"wrap", gap:"6px" }}>
            <Tag done={weightToday}>Weight +5</Tag>
            <Tag done={allPrayers}>Prayers +35</Tag>
            <Tag done={wakeComplete}>Wake +20</Tag>
            <Tag done={sleepToday}>Sleep +20</Tag>
            <Tag done={trainingToday}>Training +20</Tag>
          </div>
        </Card>

        {/* Stats row */}
        <div className="fu1" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(138px,1fr))", gap:"13px" }}>
          <Card>
            <Stat label="STREAK" value={`${state.control.streak}d`} accent={state.control.streak>0?"var(--purple)":undefined}/>
            {state.control.streak>0&&<div style={{ marginTop:"6px", height:"2px", background:"var(--bg4)", borderRadius:"2px" }}><div style={{ height:"100%", width:`${clarity}%`, background:"var(--purple)", borderRadius:"2px", boxShadow:"0 0 6px rgba(176,108,254,.5)" }}/></div>}
          </Card>
          <Card><Stat label="BEST STREAK" value={`${state.control.best}d`}/></Card>
          <Card><Stat label="CLARITY" value={`${clarity}%`} sub={`${state.control.streak}/90 days`} accent={clarity>=50?"var(--purple)":undefined}/></Card>
          <Card cls="" style={{ cursor:"pointer", borderColor:weightToday?"rgba(0,229,176,.2)":"var(--border)" }} onClick={()=>navigate("weight")}>
            <Stat label="WEIGHT" value={state.weight.current??'—'} sub={state.weight.current?"tap for history":"not logged"}/>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginTop:"6px" }}>VIEW HISTORY →</div>
          </Card>
        </div>

        {/* Smart Checklist — only shows incomplete or freshly completed items */}
        {allVisible ? (
          <Card cls="fu2" style={{ border:"1px solid rgba(0,229,176,.2)", background:"rgba(0,229,176,.03)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <span style={{ fontSize:"28px" }}>✓</span>
              <div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:"28px", color:"var(--accent)" }}>All Systems Complete</div>
                <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", marginTop:"3px" }}>Every pillar is checked for today. Maximum output achieved.</div>
              </div>
            </div>
          </Card>
        ) : (
          <Card cls="fu2">
            <Label>Today's Remaining Tasks</Label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"9px" }}>
              {visible.map(item=>(
                <button key={item.key} onClick={()=>item.page&&navigate(item.page)}
                  className={item.done?"glow-complete":""}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 14px", borderRadius:"10px", background:item.done?"rgba(0,229,176,.06)":"var(--bg3)", border:`1px solid ${item.done?"rgba(0,229,176,.25)":"var(--border)"}`, color:item.done?"var(--accent)":"var(--text2)", fontFamily:"var(--font-ui)", fontSize:"13px", fontWeight:600, cursor:"pointer", textAlign:"left", transition:"all .2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ fontSize:"13px", opacity:.7 }}>{item.glyph}</span>
                    <span>{item.label}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", flexShrink:0 }}>
                    <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:item.done?"var(--accent)":"var(--text3)", fontWeight:600 }}>{item.pts}</span>
                    <span style={{ fontSize:"14px" }}>{item.done?"✓":"→"}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* 7-day heatmap */}
        <Card cls="fu3">
          <WeekHeatmap/>
        </Card>

        {/* Prayer dots row */}
        <Card cls="fu3" style={{ cursor:"pointer" }} onClick={()=>navigate("prayers")}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.15em", marginBottom:"5px" }}>{isFridayToday()?"FRIDAY PRAYERS":"DAILY PRAYERS"}</div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:"28px", color:allPrayers?"var(--accent)":"var(--text)" }}>{allPrayers?"All Prayers Done":"Prayers"}</div>
            </div>
            <div style={{ display:"flex", gap:"7px", alignItems:"center" }}>
              {PRAYERS_DATA.map(p=>{const d=!!(dayLog[p.key]?.fard);return<div key={p.key} style={{ width:"11px", height:"11px", borderRadius:"50%", background:d?p.color:"var(--bg4)", border:`1px solid ${d?p.color:"var(--border2)"}`, boxShadow:d?`0 0 6px ${p.color}66`:"none", transition:"all .2s" }}/>;});}
              <span style={{ fontFamily:"var(--font-d)", fontSize:"26px", color:allPrayers?"var(--accent)":"var(--text2)", marginLeft:"8px" }}>{prayersDone}/5</span>
            </div>
          </div>
          <div style={{ marginTop:"10px", height:"3px", background:"var(--bg4)", borderRadius:"2px" }}>
            <div style={{ height:"100%", width:`${(prayersDone/5)*100}%`, background:allPrayers?"var(--accent)":"var(--border2)", borderRadius:"2px", transition:"width .4s ease" }}/>
          </div>
        </Card>

        {/* Daily Quote */}
        <Card cls="fu4" style={{ borderLeft:"3px solid var(--purple)", background:"linear-gradient(135deg,rgba(176,108,254,.04) 0%,var(--bg2) 60%)" }}>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--purple)", letterSpacing:"0.15em", marginBottom:"10px" }}>◈ DAILY DISCIPLINE</div>
          <div style={{ fontFamily:"var(--font-ui)", fontSize:"17px", fontWeight:600, color:"var(--text)", lineHeight:1.6, marginBottom:quote.src?"8px":"0" }}>"{quote.text}"</div>
          {quote.src&&<div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>— {quote.src}</div>}
        </Card>

        {sleepToday&&(
          <Card cls="fu5">
            <Label>Last Night's Sleep</Label>
            <Stat label="HOURS SLEPT" value={state.sleep.hours} sub="hours" accent={state.sleep.hours>=7?"var(--accent)":"var(--warn)"}/>
          </Card>
        )}
      </div>
    </>
  );
}

// ─── WAKE ─────────────────────────────────────────────────────────────────────
function Wake() {
  const { state, dispatch } = useStore();
  const hour = new Date().getHours();
  const greeting = hour<12?"Good Morning.":hour<17?"Afternoon Protocol.":"Evening Check.";
  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"620px" }}>
      <Card cls="fu">
        <div style={{ fontFamily:"var(--font-d)", fontSize:"54px", lineHeight:1.05, color:"var(--text)", marginBottom:"4px" }}>{greeting}</div>
        <PageSub>WAKE PROTOCOL — {getTodayDate()}</PageSub>
      </Card>
      <Card cls="fu1">
        <Label>Morning Routine — Check Off Each Item</Label>
        <TaskManager tasks={state.wake.tasks} prefix="WAKE" lastCheck={state.wake.lastCheck} dispatch={dispatch}/>
      </Card>
    </div>
  );
}

// ─── TRAINING ─────────────────────────────────────────────────────────────────
function Training() {
  const { state, dispatch } = useStore();
  const today = getTodayDate();
  const done  = state.training.lastCheck===today;
  const days  = [
    {name:"Push Day", ex:["Bench Press 4×8","Overhead Press 3×10","Incline DB 3×12","Lateral Raises 3×15","Tricep Dips 3×15"]},
    {name:"Pull Day", ex:["Deadlift 4×5","Pull-ups 4×8","Cable Row 3×12","Face Pulls 3×15","Bicep Curl 3×12"]},
    {name:"Leg Day",  ex:["Squat 4×8","Romanian DL 3×10","Leg Press 3×12","Walking Lunge 3×10","Calf Raises 4×20"]},
    {name:"Rest Day", ex:["Light walk 30 min","Full-body stretch 20 min","Foam rolling 15 min","Mobility flow"]},
  ];
  const session = days[new Date().getDay()%days.length];
  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"580px" }}>
      <Card cls="fu" style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, bottom:0, width:"3px", background:done?"var(--accent)":"var(--bg4)" }}/>
        <PageSub>TODAY'S SESSION — {today}</PageSub>
        <div style={{ fontFamily:"var(--font-d)", fontSize:"52px", color:done?"var(--accent)":"var(--text)", marginTop:"6px" }}>{session.name}</div>
      </Card>
      <Card cls="fu1">
        <Label>Exercise Plan</Label>
        <div style={{ display:"grid", gap:"6px" }}>
          {session.ex.map((ex,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 13px", borderRadius:"9px", background:"var(--bg3)", border:"1px solid var(--border)" }}>
              <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", width:"18px", flexShrink:0 }}>{String(i+1).padStart(2,"0")}</span>
              <span style={{ fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:600, color:"var(--text)" }}>{ex}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card cls="fu2">
        {done?(
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"26px" }}>✓</span>
            <div>
              <div style={{ fontFamily:"var(--font-ui)", fontSize:"16px", fontWeight:700, color:"var(--accent)" }}>Workout Logged</div>
              <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", marginTop:"3px" }}>Already logged today. +20 pts applied.</div>
            </div>
          </div>
        ):(
          <Btn variant="primary" onClick={()=>dispatch({type:"COMPLETE_TRAINING"})} style={{ width:"100%", padding:"14px" }}>Workout Completed</Btn>
        )}
      </Card>
    </div>
  );
}

// ─── SLEEP ────────────────────────────────────────────────────────────────────
function Sleep() {
  const { state, dispatch } = useStore();
  const today = getTodayDate();
  const hoursLogged = state.sleep.lastCheck===today;
  const [hours,setHours] = useState(state.sleep.hours||7);
  const getQ=(h)=>{if(h>=8)return{label:"Optimal",color:"var(--accent)"};if(h>=7)return{label:"Good",color:"var(--success)"};if(h>=6)return{label:"Adequate",color:"var(--warn)"};return{label:"Deficit",color:"#f87171"};};
  const q=getQ(hours);
  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"620px" }}>
      <Card cls="fu">
        <div style={{ fontFamily:"var(--font-d)", fontSize:"52px", color:"var(--text)", marginBottom:"4px" }}>Sleep Protocol</div>
        <PageSub>{today} — WIND DOWN ROUTINE</PageSub>
      </Card>
      <Card cls="fu1">
        <Label>Pre-Sleep Routine — Check Off Each Item</Label>
        <TaskManager tasks={state.sleep.tasks} prefix="SLEEP" lastCheck={state.sleep.tasksLastCheck} dispatch={dispatch}/>
      </Card>
      <Card cls="fu2">
        <Label>Hours Slept Last Night</Label>
        <div style={{ display:"flex", alignItems:"center", gap:"20px", marginBottom:"18px" }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:"78px", lineHeight:1, color:q.color, transition:"color .3s" }}>{hours}</div>
          <div>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginBottom:"3px" }}>HOURS</div>
            <div style={{ fontFamily:"var(--font-ui)", fontSize:"17px", fontWeight:700, color:q.color }}>{q.label}</div>
          </div>
        </div>
        <input type="range" min="2" max="12" step="0.5" value={hours} onChange={e=>setHours(parseFloat(e.target.value))} disabled={hoursLogged}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
          <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>2h</span>
          <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>12h</span>
        </div>
        <div style={{ marginTop:"16px" }}>
          {[{label:"Minimum effective",value:"6h+",met:hours>=6},{label:"Recommended target",value:"7–8h",met:hours>=7},{label:"Optimal recovery",value:"8h+",met:hours>=8}].map(row=>(
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontFamily:"var(--font-ui)", fontSize:"13px", color:"var(--text2)" }}>{row.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:row.met?"var(--accent)":"var(--text3)" }}>{row.value}</span>
                <span style={{ color:row.met?"var(--accent)":"var(--text3)" }}>{row.met?"✓":"·"}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card cls="fu3">
        {hoursLogged?(
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"26px" }}>✓</span>
            <div>
              <div style={{ fontFamily:"var(--font-ui)", fontSize:"16px", fontWeight:700, color:"var(--accent)" }}>Sleep Logged — {state.sleep.hours}h</div>
              <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", marginTop:"3px" }}>Already logged. Rest well.</div>
            </div>
          </div>
        ):(
          <Btn variant="primary" onClick={()=>dispatch({type:"LOG_SLEEP",hours})} style={{ width:"100%", padding:"14px" }}>Save Sleep — {hours}h</Btn>
        )}
      </Card>
    </div>
  );
}

// ─── PRAYERS ─────────────────────────────────────────────────────────────────
function Prayers() {
  const { state, dispatch } = useStore();
  const today  = getTodayDate();
  const friday = isFridayToday();
  const dayLog = state.prayers[today]||{};
  const fardDone = PRAYERS_DATA.filter(p=>dayLog[p.key]?.fard).length;
  const allDone  = fardDone===5;
  const dayName  = new Date().toLocaleDateString("en",{weekday:"long"}).toUpperCase();

  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"640px" }}>
      <Card cls="fu" style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:allDone?"var(--accent)":"var(--border)" }}/>
        <div style={{ position:"absolute", top:0, right:0, width:"150px", height:"150px", background:"radial-gradient(circle at 80% 20%,rgba(176,108,254,.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <PageSub>{today} — {dayName}</PageSub>
            <div style={{ fontFamily:"var(--font-d)", fontSize:"52px", lineHeight:1, color:allDone?"var(--accent)":"var(--text)", marginTop:"6px" }}>{friday?"Jumu'ah":"Daily Prayers"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:"48px", lineHeight:1, color:allDone?"var(--accent)":"var(--text2)" }}>{fardDone}/5</div>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginTop:"3px" }}>FARD</div>
          </div>
        </div>
        <div style={{ marginTop:"16px", height:"3px", background:"var(--bg4)", borderRadius:"2px" }}>
          <div style={{ height:"100%", width:`${(fardDone/5)*100}%`, background:allDone?"var(--accent)":"var(--border2)", borderRadius:"2px", transition:"width .4s ease", boxShadow:allDone?"0 0 8px rgba(0,229,176,.5)":"none" }}/>
        </div>
        {friday&&(
          <div style={{ marginTop:"13px", padding:"10px 13px", borderRadius:"9px", background:"rgba(255,209,102,.05)", border:"1px solid rgba(255,209,102,.14)" }}>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"#ffd166", letterSpacing:"0.1em", marginBottom:"3px" }}>يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ</div>
            <div style={{ fontFamily:"var(--font-ui)", fontSize:"13px", color:"var(--text2)" }}>Friday — Dhuhr is replaced with Jumu'ah prayer.</div>
          </div>
        )}
      </Card>

      {PRAYERS_DATA.map((prayer,pidx)=>{
        const rows   =(friday&&prayer.rowsFriday)?prayer.rowsFriday:prayer.rows;
        const name   =(friday&&prayer.nameFriday)?prayer.nameFriday:prayer.name;
        const arabic =(friday&&prayer.arabicFriday)?prayer.arabicFriday:prayer.arabic;
        const time   =(friday&&prayer.timeFriday)?prayer.timeFriday:prayer.time;
        const pLog   = dayLog[prayer.key]||{};
        const fardChecked=!!pLog.fard;
        const allChk =rows.every(r=>!!pLog[r.field]);

        return(
          <Card key={prayer.key} cls={`fu${Math.min(pidx+1,5)}`}
            style={{ borderLeft:`3px solid ${allChk?prayer.color:prayer.color+"30"}`, transition:"border-color .3s", boxShadow:allChk?`-2px 0 12px ${prayer.color}22`:"none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"13px" }}>
              <div>
                <div style={{ fontFamily:"var(--font-d)", fontSize:"30px", lineHeight:1, color:fardChecked?prayer.color:"var(--text)" }}>{name}</div>
                <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", letterSpacing:"0.1em", marginTop:"3px" }}>{time}</div>
              </div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:"22px", color:fardChecked?prayer.color:"var(--text3)", direction:"rtl" }}>{arabic}</div>
            </div>
            <div style={{ display:"grid", gap:"7px" }}>
              {rows.map((row,ridx)=>{
                const checked=!!pLog[row.field]; const isFard=row.type==="fard";
                return(
                  <button key={ridx} onClick={()=>dispatch({type:"TOGGLE_PRAYER",date:today,prayerKey:prayer.key,field:row.field})}
                    style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 13px", borderRadius:"9px", cursor:"pointer", textAlign:"left", background:checked?`${prayer.color}12`:"var(--bg3)", border:`1px solid ${checked?prayer.color+"35":"var(--border)"}`, transition:"all .18s" }}>
                    <div style={{ width:"22px", height:"22px", borderRadius:"6px", flexShrink:0, background:checked?prayer.color:"var(--bg4)", border:`1px solid ${checked?prayer.color:"var(--border2)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:"#000", fontWeight:700, animation:checked?"checkPop .22s ease":"none" }}>
                      {checked?"✓":""}
                    </div>
                    <span style={{ flex:1, fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:600, color:checked?"var(--text)":"var(--text2)" }}>{row.label}</span>
                    <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", flexShrink:0, padding:"3px 8px", borderRadius:"4px", color:isFard?prayer.color:"var(--text3)", background:isFard?`${prayer.color}12`:"transparent", border:isFard?`1px solid ${prayer.color}25`:"none" }}>{row.rak}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}

      {allDone&&(
        <Card cls="fu5" style={{ border:"1px solid rgba(0,229,176,.2)", background:"rgba(0,229,176,.03)", textAlign:"center", padding:"28px" }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:"36px", color:"var(--accent)", marginBottom:"6px" }}>الحمد لله</div>
          <div style={{ fontFamily:"var(--font-ui)", fontSize:"15px", color:"var(--text2)", lineHeight:1.7 }}>All five prayers completed.<br/>Your duty is fulfilled for today.</div>
        </Card>
      )}
    </div>
  );
}

// ─── QURAN ────────────────────────────────────────────────────────────────────
function Quran() {
  const { state, dispatch } = useStore();
  const today = getTodayDate();
  const [pages,setPages]       = useState("");
  const [fromPage,setFromPage] = useState("");
  const [surah,setSurah]       = useState("");

  const totalRead  = state.quran.logs.reduce((s,l)=>s+l.pages,0);
  const khatmahs   = Math.floor(totalRead/QURAN_PAGES);
  const currPages  = totalRead%QURAN_PAGES;
  const pct        = Math.round((currPages/QURAN_PAGES)*100);
  const todayPages = state.quran.logs.filter(l=>l.date===today).reduce((s,l)=>s+l.pages,0);

  const handleLog = () => {
    const n=parseInt(pages); if(!n||n<=0) return;
    dispatch({type:"LOG_QURAN",entry:{id:uid(),date:today,time:new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}),pages:n,fromPage:fromPage?parseInt(fromPage):null,surah:surah.trim()||null}});
    setPages(""); setFromPage(""); setSurah("");
  };

  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"600px" }}>
      <Card cls="fu" style={{ background:"linear-gradient(135deg,var(--bg2) 60%,rgba(176,108,254,.04) 100%)" }}>
        <div style={{ fontFamily:"var(--font-d)", fontSize:"52px", lineHeight:1, color:"var(--text)", marginBottom:"4px" }}>Quran Log</div>
        <PageSub>{today} — TRACK YOUR RECITATION</PageSub>
      </Card>

      <div className="fu1" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"13px" }}>
        <Card><Stat label="TOTAL PAGES" value={totalRead||"0"} accent={totalRead>0?"var(--accent)":undefined}/></Card>
        <Card><Stat label="TODAY"       value={todayPages||"0"} sub="pages"/></Card>
        <Card><Stat label="KHATMAHS"   value={khatmahs}        accent={khatmahs>0?"var(--purple)":undefined}/></Card>
      </div>

      <Card cls="fu2">
        <Label purple>Current Khatmah — {QURAN_PAGES} Pages</Label>
        <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"14px" }}>
          <div style={{ fontFamily:"var(--font-d)", fontSize:"60px", lineHeight:1, color:pct>=50?"var(--purple)":"var(--text2)", textShadow:pct>=50?"0 0 20px rgba(176,108,254,.4)":"none" }}>{pct}%</div>
          <div>
            <div style={{ fontFamily:"var(--font-ui)", fontSize:"14px", color:"var(--text2)" }}>{currPages} / {QURAN_PAGES} pages</div>
            {khatmahs>0&&<div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--purple)", marginTop:"3px" }}>✓ {khatmahs} khatmah{khatmahs>1?"s":""} complete</div>}
          </div>
        </div>
        <div style={{ height:"4px", background:"var(--bg4)", borderRadius:"2px" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"var(--purple)", borderRadius:"2px", transition:"width .6s ease", boxShadow:"0 0 8px rgba(176,108,254,.5)" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
          <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>p.1</span>
          <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>p.{QURAN_PAGES}</span>
        </div>
      </Card>

      <Card cls="fu3">
        <Label>Log Recitation Session</Label>
        <div style={{ marginBottom:"12px" }}>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text2)", letterSpacing:"0.14em", marginBottom:"6px" }}>PAGES READ *</div>
          <input type="number" min="1" max="604" placeholder="e.g. 5" value={pages} onChange={e=>setPages(e.target.value)}
            style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:"9px", padding:"12px 16px", color:"var(--text)", fontFamily:"var(--font-d)", fontSize:"32px", outline:"none", textAlign:"center" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
          <div>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text2)", letterSpacing:"0.12em", marginBottom:"6px" }}>FROM PAGE (optional)</div>
            <input type="number" min="1" max="604" placeholder="e.g. 218" value={fromPage} onChange={e=>setFromPage(e.target.value)}
              style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:"8px", padding:"9px 12px", color:"var(--text)", fontFamily:"var(--font-ui)", fontSize:"15px", outline:"none" }}/>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text2)", letterSpacing:"0.12em", marginBottom:"6px" }}>SURAH (optional)</div>
            <SurahInput value={surah} onChange={setSurah}/>
          </div>
        </div>
        <Btn variant="primary" onClick={handleLog} disabled={!pages||parseInt(pages)<=0} style={{ width:"100%", padding:"13px" }}>
          Log {pages?`${pages} Page${parseInt(pages)!==1?"s":""}` :"Recitation"}
        </Btn>
      </Card>

      {state.quran.logs.length>0&&(
        <Card cls="fu4">
          <Label>Sessions</Label>
          <div style={{ display:"grid", gap:"5px" }}>
            {[...state.quran.logs].reverse().slice(0,12).map(entry=>(
              <div key={entry.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", borderRadius:"8px", background:"var(--bg3)" }}>
                <div>
                  <div style={{ fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:600, color:"var(--text)" }}>
                    {entry.pages} page{entry.pages!==1?"s":""}
                    {entry.surah?` — ${entry.surah}`:""}
                    {entry.fromPage?` (p.${entry.fromPage})`:""}
                  </div>
                  <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginTop:"2px" }}>{entry.date}{entry.time?` · ${entry.time}`:""}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ fontFamily:"var(--font-d)", fontSize:"24px", color:"var(--purple)" }}>{entry.pages}</div>
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

// ─── WEIGHT DETAIL ────────────────────────────────────────────────────────────
function WeightDetail({ navigate }) {
  const { state } = useStore();
  const [period,setPeriod] = useState(28);
  const periods = [{label:"7D",days:7},{label:"28D",days:28},{label:"90D",days:90},{label:"365D",days:365}];
  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"640px" }}>
      <div className="fu" style={{ display:"flex", alignItems:"center", gap:"14px" }}>
        <button onClick={()=>navigate("dashboard")} style={{ background:"var(--bg3)", border:"1px solid var(--border)", color:"var(--text2)", cursor:"pointer", padding:"8px 14px", borderRadius:"8px", fontFamily:"var(--font-m)", fontSize:"10px", letterSpacing:"0.1em" }}>← BACK</button>
        <div style={{ fontFamily:"var(--font-d)", fontSize:"36px", color:"var(--text)" }}>Weight History</div>
      </div>
      {state.weight.current&&(
        <Card cls="fu">
          <div style={{ display:"flex", gap:"28px", alignItems:"baseline", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", letterSpacing:"0.14em", marginBottom:"3px" }}>CURRENT</div>
              <div style={{ fontFamily:"var(--font-d)", fontSize:"64px", color:"var(--accent)", lineHeight:1 }}>{state.weight.current}</div>
              <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>kg</div>
            </div>
            <div><div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginBottom:"3px" }}>TOTAL LOGS</div><div style={{ fontFamily:"var(--font-d)", fontSize:"40px", color:"var(--text2)" }}>{state.weight.history.length}</div></div>
            <div><div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginBottom:"3px" }}>STARTED</div><div style={{ fontFamily:"var(--font-d)", fontSize:"22px", color:"var(--text2)" }}>{state.weight.history.length>0?state.weight.history[0].date:"—"}</div></div>
          </div>
        </Card>
      )}
      <div className="fu1" style={{ display:"flex", gap:"8px" }}>
        {periods.map(p=><button key={p.days} onClick={()=>setPeriod(p.days)} style={{ flex:1, padding:"10px", borderRadius:"9px", background:period===p.days?"var(--accent-dim)":"var(--bg3)", border:`1px solid ${period===p.days?"rgba(0,229,176,.3)":"var(--border)"}`, color:period===p.days?"var(--accent)":"var(--text2)", fontFamily:"var(--font-m)", fontSize:"11px", cursor:"pointer" }}>{p.label}</button>)}
      </div>
      <Card cls="fu2">
        <Label>{periods.find(p=>p.days===period)?.label} WEIGHT TREND</Label>
        <WeightChart history={state.weight.history} period={period}/>
      </Card>
      {state.weight.history.length>0&&(
        <Card cls="fu3">
          <Label>All Entries</Label>
          <div style={{ display:"grid", gap:"5px", maxHeight:"300px", overflowY:"auto" }}>
            {[...state.weight.history].reverse().map((e,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", borderRadius:"7px", background:"var(--bg3)" }}>
                <span style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)" }}>{e.date}</span>
                <span style={{ fontFamily:"var(--font-d)", fontSize:"20px", color:"var(--text)" }}>{e.value} kg</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── CONTROL MODE ─────────────────────────────────────────────────────────────
function ControlMode({ navigate }) {
  const { state, dispatch } = useStore();
  const today     = getTodayDate();
  const lastEntry = state.control.history[state.control.history.length-1];
  const todayEntry= lastEntry?.date===today?lastEntry:null;
  const logged    = !!todayEntry;
  const wasSuccess= todayEntry?.success===true;
  const [mode,setMode]       = useState("default");
  const [trigger,setTrigger] = useState(null);
  const clarity    = calculateClarity(state.control.streak);
  const mostCommon = getMostCommonTrigger(state.control.triggers);

  const headerMsg   = !logged?"Stay in control today.":wasSuccess?"Day secured.":"Reset. Move forward.";
  const headerColor = !logged?"var(--text)":wasSuccess?"var(--accent)":"#f87171";

  const triggerOpts = [{key:"boredom",label:"Boredom",icon:"◌"},{key:"stress",label:"Stress",icon:"⚡"},{key:"lateNight",label:"Late Night",icon:"◐"},{key:"other",label:"Other",icon:"·"}];
  const urgeActions = [{icon:"💪",label:"Do 15 Pushups",sub:"Redirect energy physically"},{icon:"💧",label:"Cold Water",sub:"Splash face or drink 500ml"},{icon:"🚶",label:"Leave the Room",sub:"Change environment immediately"}];
  const resetMode = () => { setMode("default"); setTrigger(null); };
  const handleFail = (isOverride) => { if(!trigger) return; dispatch({type:isOverride?"CONTROL_OVERRIDE_FAIL":"CONTROL_FAIL",trigger}); resetMode(); };

  const TriggerGrid = ({ danger, onSubmit, onCancel }) => (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"13px" }}>
        {triggerOpts.map(t=>(
          <button key={t.key} onClick={()=>setTrigger(t.key)}
            style={{ padding:"13px", borderRadius:"9px", background:trigger===t.key?(danger?"rgba(230,64,64,.1)":"rgba(230,160,0,.1)"):"var(--bg3)", border:`1px solid ${trigger===t.key?(danger?"rgba(230,64,64,.35)":"rgba(230,160,0,.35)"):"var(--border)"}`, color:trigger===t.key?(danger?"#f87171":"var(--warn)"):"var(--text2)", fontFamily:"var(--font-ui)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", gap:"8px" }}>
        <Btn variant="secondary" onClick={onCancel} style={{flex:1}}>Cancel</Btn>
        <Btn variant="danger" onClick={onSubmit} disabled={!trigger} style={{flex:2}}>Log Reset</Btn>
      </div>
    </>
  );

  return (
    <div style={{ display:"grid", gap:"18px", maxWidth:"640px" }}>
      <Card cls="fu" style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:!logged?"var(--border)":wasSuccess?"var(--accent)":"#f87171" }}/>
        <div style={{ position:"absolute", top:0, right:0, width:"150px", height:"150px", background:"radial-gradient(circle at 80% 20%,rgba(176,108,254,.06) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ fontFamily:"var(--font-d)", fontSize:"52px", lineHeight:1, color:headerColor, marginBottom:"4px" }}>{headerMsg}</div>
        <PageSub>CONTROL MODE — {today}</PageSub>
      </Card>

      <div className="fu1" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"13px" }}>
        <Card>
          <Stat label="STREAK" value={`${state.control.streak}d`} accent={state.control.streak>0?"var(--purple)":undefined}/>
          {state.control.streak>0&&<div style={{ marginTop:"6px", height:"2px", background:"var(--bg4)", borderRadius:"2px" }}><div style={{ height:"100%", width:`${Math.min((state.control.streak/90)*100,100)}%`, background:"var(--purple)", borderRadius:"2px", boxShadow:"0 0 6px rgba(176,108,254,.5)" }}/></div>}
        </Card>
        <Card><Stat label="BEST" value={`${state.control.best}d`}/></Card>
        <Card>
          <Stat label="CLARITY (90d)" value={`${clarity}%`} accent={clarity>=50?"var(--purple)":undefined}/>
          <div style={{ marginTop:"8px", height:"2px", background:"var(--bg4)", borderRadius:"2px" }}><div style={{ height:"100%", width:`${clarity}%`, background:"var(--purple)", borderRadius:"2px", transition:"width .6s ease", boxShadow:"0 0 6px rgba(176,108,254,.4)" }}/></div>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"10px", color:"var(--text3)", marginTop:"5px" }}>{state.control.streak}/90 days</div>
        </Card>
      </div>

      {mode==="urge"&&(
        <Card cls="fu" style={{ border:"1px solid rgba(230,64,64,.28)", background:"rgba(230,64,64,.04)", animation:"urgePulse 2s infinite" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"13px" }}>
            <div style={{ fontFamily:"var(--font-d)", fontSize:"30px", color:"#f87171" }}>URGE MODE ACTIVE</div>
            <button onClick={resetMode} style={{ background:"none", border:"1px solid var(--border)", color:"var(--text2)", cursor:"pointer", padding:"5px 11px", borderRadius:"7px", fontFamily:"var(--font-m)", fontSize:"10px" }}>CLOSE</button>
          </div>
          <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"#f87171", marginBottom:"13px", letterSpacing:"0.12em" }}>ACT NOW — PICK ONE IMMEDIATELY:</div>
          <div style={{ display:"grid", gap:"7px" }}>
            {urgeActions.map((a,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", borderRadius:"9px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(230,64,64,.13)" }}>
                <span style={{fontSize:"20px"}}>{a.icon}</span>
                <div>
                  <div style={{ fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:700, color:"var(--text)" }}>{a.label}</div>
                  <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", marginTop:"2px" }}>{a.sub}</div>
                </div>
              </div>
            ))}
            <button onClick={()=>{resetMode();navigate("training");}} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", borderRadius:"9px", background:"var(--accent-dim)", border:"1px solid rgba(0,229,176,.2)", cursor:"pointer", textAlign:"left" }}>
              <span style={{fontSize:"20px"}}>🏋️</span>
              <div>
                <div style={{ fontFamily:"var(--font-ui)", fontSize:"14px", fontWeight:700, color:"var(--accent)" }}>Open Workout</div>
                <div style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text3)", marginTop:"2px" }}>Redirect to Training</div>
              </div>
            </button>
          </div>
        </Card>
      )}
      {mode==="trigger"&&(<Card cls="fu" style={{border:"1px solid rgba(230,160,0,.22)"}}><Label>What triggered it?</Label><TriggerGrid danger={false} onSubmit={()=>handleFail(false)} onCancel={resetMode}/></Card>)}
      {mode==="override_trigger"&&(<Card cls="fu" style={{border:"1px solid rgba(230,64,64,.22)"}}><div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"#f87171",letterSpacing:"0.15em",marginBottom:"10px"}}>OVERRIDING TODAY'S SUCCESS</div><Label>What caused the relapse?</Label><TriggerGrid danger={true} onSubmit={()=>handleFail(true)} onCancel={resetMode}/></Card>)}

      {mode==="default"&&(
        <Card cls="fu2">
          <Label>{!logged?"Log Today":wasSuccess?"Today Secured — Stay Vigilant":"Logged — Reset & Move On"}</Label>
          <div style={{display:"grid",gap:"8px"}}>
            {!logged&&<>
              <Btn variant="success" onClick={()=>dispatch({type:"CONTROL_SUCCESS"})} style={{width:"100%",padding:"14px"}}>✓ Stayed in Control</Btn>
              <Btn variant="danger"  onClick={()=>setMode("trigger")}         style={{width:"100%",padding:"13px"}}>✕ Reset — Log Failure</Btn>
              <Btn variant="warn"    onClick={()=>setMode("urge")}             style={{width:"100%",padding:"13px"}}>⚡ I Feel an Urge</Btn>
            </>}
            {logged&&wasSuccess&&<>
              <div style={{padding:"12px 14px",borderRadius:"10px",background:"rgba(0,229,176,.04)",border:"1px solid rgba(0,229,176,.13)",fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)",lineHeight:1.65}}>Logged as controlled. If you slipped later — be honest and log the reset.</div>
              <Btn variant="danger" onClick={()=>setMode("override_trigger")} style={{width:"100%",padding:"13px"}}>✕ I Actually Failed — Reset</Btn>
              <Btn variant="warn"   onClick={()=>setMode("urge")}             style={{width:"100%",padding:"13px"}}>⚡ I Feel an Urge</Btn>
            </>}
            {logged&&!wasSuccess&&<>
              <div style={{padding:"12px 14px",borderRadius:"10px",background:"rgba(255,255,255,.02)",border:"1px solid var(--border)",fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)",lineHeight:1.65}}>Today is logged as a reset. Streak at 0. Tomorrow is a clean slate.</div>
              <Btn variant="warn" onClick={()=>setMode("urge")} style={{width:"100%",padding:"13px"}}>⚡ I Feel an Urge</Btn>
            </>}
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
                <div style={{flex:1,height:"3px",background:"var(--bg4)",borderRadius:"2px"}}><div style={{height:"100%",width:`${pct}%`,background:isTop?"var(--warn)":"var(--border2)",borderRadius:"2px",transition:"width .5s ease"}}/></div>
                <div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)",width:"20px",textAlign:"right"}}>{count}</div>
              </div>
            );
          })}
        </div>
        {mostCommon&&<div style={{marginTop:"13px",padding:"10px 12px",borderRadius:"9px",background:"rgba(230,160,0,.05)",border:"1px solid rgba(230,160,0,.12)"}}>
          <div style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--warn)",letterSpacing:"0.12em"}}>MOST COMMON: {mostCommon.toUpperCase()}</div>
          <div style={{fontFamily:"var(--font-ui)",fontSize:"13px",color:"var(--text2)",marginTop:"3px"}}>Build targeted defenses around this trigger.</div>
        </div>}
      </Card>

      {state.control.history.length>0&&(
        <Card cls="fu4">
          <Label>Recent History</Label>
          <div style={{display:"grid",gap:"5px"}}>
            {[...state.control.history].reverse().slice(0,10).map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:"7px",background:"var(--bg3)"}}>
                <span style={{fontFamily:"var(--font-m)",fontSize:"10px",color:"var(--text3)"}}>{e.date}</span>
                <span style={{fontFamily:"var(--font-ui)",fontSize:"12px",fontWeight:700,color:e.success?"var(--accent)":"#f87171"}}>{e.success?"CONTROLLED":`RESET${e.trigger?` · ${e.trigger}`:""}`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const PAGE_LABELS = {
  dashboard:"Command Center", wake:"Wake Protocol", training:"Training Log",
  sleep:"Sleep Protocol", prayers:"Daily Prayers", quran:"Quran Log",
  control:"Control Mode", weight:"Weight History",
};

function AppInner() {
  const { state, dispatch } = useStore();
  const [page,setPage]         = useState("dashboard");
  const [sidebarOpen,setSidebar] = useState(false);
  const navigate = useCallback(p => setPage(p), []);

  if (!state.profile.onboarded) {
    return <Onboarding onComplete={name=>dispatch({type:"SET_NAME",name})}/>;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard navigate={navigate}/>;
      case "wake":      return <Wake/>;
      case "training":  return <Training/>;
      case "sleep":     return <Sleep/>;
      case "prayers":   return <Prayers/>;
      case "quran":     return <Quran/>;
      case "weight":    return <WeightDetail navigate={navigate}/>;
      case "control":   return <ControlMode navigate={navigate}/>;
      default:          return <Dashboard navigate={navigate}/>;
    }
  };

  return (
    <>
      <Sidebar page={page} navigate={navigate} open={sidebarOpen} setOpen={setSidebar}/>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <header style={{ height:"56px", display:"flex", alignItems:"center", padding:"0 20px", gap:"14px", borderBottom:"1px solid var(--border)", background:"var(--bg1)", position:"sticky", top:0, zIndex:30 }}>
          <button onClick={()=>setSidebar(o=>!o)}
            style={{ background:"none", border:"1px solid var(--border)", color:"var(--text2)", cursor:"pointer", width:"32px", height:"32px", borderRadius:"7px", fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center" }}>☰</button>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ fontFamily:"var(--font-m)", fontSize:"11px", color:"var(--text2)", letterSpacing:"0.18em" }}>{PAGE_LABELS[page]||""}</span>
          </div>
        </header>
        <main style={{ flex:1, padding:"24px 20px", maxWidth:"860px" }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <GlobalStyles/>
      <AppInner/>
    </StoreProvider>
  );
}
