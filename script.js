const APP_KEY = 'formFitnessTrackerV4';
const LEGACY_KEYS = ['formFitnessTrackerV3','formFitnessTrackerV2','formFitnessTrackerV1'];
const MODE_CONFIG = {
  normal:{label:'Normal',icon:'⚪',color:'normal',description:'Balanced strength, consistency and health.',goal:'Build consistency',focus:'Balanced strength + healthy habits',calorieFactor:1.0,proteinPerKg:1.6,weeklySessions:3},
  bulk:{label:'Bulk',icon:'🟠',color:'bulk',description:'Build muscle and bodyweight with progressive training.',goal:'Gain size & strength',focus:'Hypertrophy + recovery',calorieFactor:1.12,proteinPerKg:1.8,weeklySessions:4},
  comeback:{label:'Comeback',icon:'🟣',color:'comeback',description:'Rebuild strength, conditioning and movement capacity.',goal:'Regain lost ability',focus:'Reconditioning + progressive skill work',calorieFactor:.9,proteinPerKg:1.8,weeklySessions:3}
};
const MODE_PLANS = {
 normal:{title:'Balanced day plan',workout:['Full-body strength','Push + pull + legs + core in moderate volume.'],meal:['Protein at every meal','Keep portions balanced and flexible; include vegetables and useful carbs.'],win:['Show up','Complete a sustainable session and log it.']},
 bulk:{title:'Build day plan',workout:['Hypertrophy session','Focus on 3–5 exercises, controlled reps and progressive overload.'],meal:['Surplus + protein','Build meals around protein, carbs and calorie-dense whole foods.'],win:['Progress one movement','Beat a previous rep/weight/volume target without sacrificing form.']},
 comeback:{title:'Rebuild day plan',workout:['Reconditioning session','Start with manageable sets: push-up progression + core hold + lower body + walking.'],meal:['Protein + recovery','Prioritize protein, hydration and filling foods; keep the deficit controlled if weight loss is a goal.'],win:['Bank one clean win','Finish the planned basics with good form, then recover.']}
};
const EXERCISE_LIBRARY = [
  // Chest
  {name:'Push-ups',muscle:'Chest',equipment:'Bodyweight',stance:'Floor',icon:'🤸'},
  {name:'Knee Push-ups',muscle:'Chest',equipment:'Bodyweight',stance:'Floor',icon:'🤸'},
  {name:'Bench Press',muscle:'Chest',equipment:'Barbell',stance:'Flat bench',icon:'🏋️'},
  {name:'Incline Bench Press',muscle:'Chest',equipment:'Barbell',stance:'Incline bench',icon:'🏋️'},
  {name:'Dumbbell Bench Press',muscle:'Chest',equipment:'Dumbbells',stance:'Flat bench',icon:'💪'},
  {name:'Incline Dumbbell Press',muscle:'Chest',equipment:'Dumbbells',stance:'Incline bench',icon:'💪'},
  {name:'Chest Press',muscle:'Chest',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Cable Fly',muscle:'Chest',equipment:'Cable',stance:'Standing',icon:'🪢'},
  {name:'Pec Deck',muscle:'Chest',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Decline Bench Press',muscle:'Chest',equipment:'Barbell',stance:'Decline bench',icon:'🏋️'},
  // Back
  {name:'Lat Pulldown',muscle:'Back',equipment:'Cable',stance:'Seated',icon:'🪢'},
  {name:'Seated Cable Row',muscle:'Back',equipment:'Cable',stance:'Seated',icon:'🪢'},
  {name:'One-arm Dumbbell Row',muscle:'Back',equipment:'Dumbbell',stance:'Supported',icon:'💪'},
  {name:'Barbell Row',muscle:'Back',equipment:'Barbell',stance:'Bent over',icon:'🏋️'},
  {name:'Chest-supported Row',muscle:'Back',equipment:'Machine',stance:'Supported',icon:'🦾'},
  {name:'T-bar Row',muscle:'Back',equipment:'T-bar',stance:'Standing',icon:'🏋️'},
  {name:'Pull-ups',muscle:'Back',equipment:'Bodyweight',stance:'Hanging',icon:'🤸'},
  {name:'Assisted Pull-ups',muscle:'Back',equipment:'Machine',stance:'Kneeling',icon:'🦾'},
  {name:'Straight-arm Pulldown',muscle:'Back',equipment:'Cable',stance:'Standing',icon:'🪢'},
  {name:'Face Pull',muscle:'Back',equipment:'Cable',stance:'Standing',icon:'🪢'},
  // Shoulders
  {name:'Shoulder Press',muscle:'Shoulders',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Dumbbell Shoulder Press',muscle:'Shoulders',equipment:'Dumbbells',stance:'Seated',icon:'💪'},
  {name:'Arnold Press',muscle:'Shoulders',equipment:'Dumbbells',stance:'Seated',icon:'💪'},
  {name:'Lateral Raise',muscle:'Shoulders',equipment:'Dumbbells',stance:'Standing',icon:'💪'},
  {name:'Cable Lateral Raise',muscle:'Shoulders',equipment:'Cable',stance:'Standing',icon:'🪢'},
  {name:'Front Raise',muscle:'Shoulders',equipment:'Dumbbells',stance:'Standing',icon:'💪'},
  {name:'Reverse Pec Deck',muscle:'Shoulders',equipment:'Machine',stance:'Seated',icon:'🦾'},
  // Arms
  {name:'Bicep Curl',muscle:'Arms',equipment:'Dumbbells',stance:'Standing',icon:'💪'},
  {name:'Hammer Curl',muscle:'Arms',equipment:'Dumbbells',stance:'Standing',icon:'💪'},
  {name:'EZ-bar Curl',muscle:'Arms',equipment:'EZ Bar',stance:'Standing',icon:'🏋️'},
  {name:'Preacher Curl',muscle:'Arms',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Cable Curl',muscle:'Arms',equipment:'Cable',stance:'Standing',icon:'🪢'},
  {name:'Tricep Pushdown',muscle:'Arms',equipment:'Cable',stance:'Standing',icon:'🪢'},
  {name:'Overhead Tricep Extension',muscle:'Arms',equipment:'Cable',stance:'Standing',icon:'🪢'},
  {name:'Dips',muscle:'Arms',equipment:'Bodyweight',stance:'Parallel bars',icon:'🤸'},
  // Legs
  {name:'Squat',muscle:'Legs',equipment:'Barbell',stance:'Standing',icon:'🏋️'},
  {name:'Front Squat',muscle:'Legs',equipment:'Barbell',stance:'Standing',icon:'🏋️'},
  {name:'Smith Machine Squat',muscle:'Legs',equipment:'Smith machine',stance:'Standing',icon:'🧱'},
  {name:'Leg Press',muscle:'Legs',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Hack Squat',muscle:'Legs',equipment:'Machine',stance:'Supported',icon:'🦵'},
  {name:'Romanian Deadlift',muscle:'Legs',equipment:'Barbell',stance:'Standing',icon:'🏋️'},
  {name:'Leg Curl',muscle:'Legs',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Lying Leg Curl',muscle:'Legs',equipment:'Machine',stance:'Lying',icon:'🦾'},
  {name:'Leg Extension',muscle:'Legs',equipment:'Machine',stance:'Seated',icon:'🦾'},
  {name:'Calf Raise',muscle:'Legs',equipment:'Machine',stance:'Standing',icon:'🦵'},
  {name:'Bulgarian Split Squat',muscle:'Legs',equipment:'Dumbbells',stance:'Split stance',icon:'💪'},
  {name:'Walking Lunges',muscle:'Legs',equipment:'Dumbbells',stance:'Walking',icon:'💪'},
  {name:'Goblet Squat',muscle:'Legs',equipment:'Kettlebell',stance:'Standing',icon:'🔔'},
  // Core / Calisthenics
  {name:'Plank',muscle:'Core',equipment:'Bodyweight',stance:'Floor',icon:'🤸'},
  {name:'L-sit',muscle:'Core',equipment:'Bodyweight',stance:'Support',icon:'🤸'},
  {name:'Tuck L-sit',muscle:'Core',equipment:'Bodyweight',stance:'Support',icon:'🤸'},
  {name:'Hanging Knee Raise',muscle:'Core',equipment:'Bodyweight',stance:'Hanging',icon:'🤸'},
  {name:'Hanging Leg Raise',muscle:'Core',equipment:'Bodyweight',stance:'Hanging',icon:'🤸'},
  {name:'Cable Crunch',muscle:'Core',equipment:'Cable',stance:'Kneeling',icon:'🪢'},
  {name:'Crunches',muscle:'Core',equipment:'Bodyweight',stance:'Floor',icon:'🤸'},
  {name:'Russian Twist',muscle:'Core',equipment:'Dumbbell',stance:'Seated',icon:'💪'},
  // Cardio
  {name:'Walking',muscle:'Cardio',equipment:'Bodyweight',stance:'Upright',icon:'🚶'},
  {name:'Incline Walking',muscle:'Cardio',equipment:'Treadmill',stance:'Upright',icon:'🏃'},
  {name:'Running',muscle:'Cardio',equipment:'Treadmill',stance:'Upright',icon:'🏃'},
  {name:'Cycling',muscle:'Cardio',equipment:'Bike',stance:'Seated',icon:'🚴'},
  {name:'Elliptical',muscle:'Cardio',equipment:'Machine',stance:'Upright',icon:'🏃'},
  {name:'Rowing Machine',muscle:'Cardio',equipment:'Machine',stance:'Seated',icon:'🚣'},
  {name:'Stair Climber',muscle:'Cardio',equipment:'Machine',stance:'Upright',icon:'🪜'}
];
const EXERCISES = EXERCISE_LIBRARY.map(x=>[x.name,x.muscle]);
const DEFAULTS = {version:4,mode:'normal',trainingMode:'auto',autoStyle:'guided',profile:{name:'',height:180,weight:null,goalWeight:null,calorieTarget:null,proteinTarget:null,waterTarget:8,stepTarget:8000,weeklyGymTarget:3,calorieOverride:false,proteinOverride:false},workouts:[],meals:[],weighins:[],strength:[],measurements:[],sleep:[],steps:[],goals:[],favorites:[]};
let data = load();
let activeWorkoutFilter = 'all';

const $ = id => document.getElementById(id);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(16).slice(2));
const localISODate = (date=new Date()) => {
  const d=new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const today = () => localISODate();
const fmtDate = d => new Date(d+'T00:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
const shortDay = d => new Date(d+'T00:00:00').toLocaleDateString(undefined,{weekday:'short'}).slice(0,2);
const daysAgo = n => {const d=new Date();d.setDate(d.getDate()-n);return localISODate(d)};
const weekDates = () => [...Array(7)].map((_,i)=>daysAgo(6-i));
const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const formatDuration = mins => `${Math.floor(num(mins)/60)}h ${num(mins)%60}m`;

function normalize(raw){
  const d={...DEFAULTS,...(raw||{})};
  d.profile={...DEFAULTS.profile,...(d.profile||{})};
  if(!('calorieOverride' in d.profile))d.profile.calorieOverride=Boolean(d.profile.calorieTarget);
  if(!('proteinOverride' in d.profile))d.profile.proteinOverride=Boolean(d.profile.proteinTarget);
  d.mode=MODE_CONFIG[d.mode]?d.mode:'normal';
  d.trainingMode=['auto','manual'].includes(d.trainingMode)?d.trainingMode:'auto';
  d.autoStyle=['guided','automatic'].includes(d.autoStyle)?d.autoStyle:'guided';
  d.favorites=Array.isArray(d.favorites)?d.favorites.filter(x=>EXERCISE_LIBRARY.some(e=>e.name===x)).slice(0,30):[];
  for(const key of ['workouts','meals','weighins','strength','measurements','sleep','steps','goals']) d[key]=Array.isArray(d[key])?d[key].slice(0,5000):[];
  return d;
}
function migrate(){
  try{
    const current=localStorage.getItem(APP_KEY);
    if(current){
      try{normalize(JSON.parse(current));return;}catch(e){console.warn('Current FORM data invalid; trying legacy backup.',e)}
    }
    for(const k of LEGACY_KEYS){
      const v=localStorage.getItem(k);
      if(v){
        try{localStorage.setItem(APP_KEY,JSON.stringify(normalize(JSON.parse(v))));break;}catch(e){console.warn('Legacy migration failed for '+k,e)}
      }
    }
  }catch(e){console.warn('Migration skipped',e)}
}
function load(){migrate();try{return normalize(JSON.parse(localStorage.getItem(APP_KEY)||'{}'))}catch{return normalize({})}}
function save(){
  try{data.version=4;localStorage.setItem(APP_KEY,JSON.stringify(data));}
  catch(err){console.error('FORM save failed',err);alert('FORM could not save this change. Export a backup and check browser storage.');return false;}
  renderAll();return true;
}

function fitnessLevel(){
  // This is intentionally a product heuristic, not a medical/scientific ranking.
  const w=currentWeight(), b=bmi(w,data.profile.height);
  let perf=0;
  const push = bestExercise(['Push-ups','Knee Push-ups']);
  const lsit = bestExercise(['L-sit','Tuck L-sit']);
  const pull = bestExercise(['Pull-ups','Assisted Pull-ups']);
  const last7=weekDates(), last28=[...Array(28)].map((_,i)=>daysAgo(27-i));
  const c7=data.workouts.filter(w=>last7.includes(w.date)).length/Math.max(1,currentMode().weeklySessions);
  const c28=data.workouts.filter(w=>last28.includes(w.date)).length/Math.max(1,currentMode().weeklySessions*4);
  const consistency=clamp(Math.min(c7,1)*.6+Math.min(c28,1)*.4,0,1);
  perf += clamp((push?.best||0)/30,0,1)*25;
  perf += clamp((lsit?.best||0)/60,0,1)*20;
  perf += clamp((pull?.best||0)/10,0,1)*15;
  perf += consistency*25;
  let bmiContext=0;
  if(b!==null){if(b>=18.5&&b<25)bmiContext=15;else if(b>=25&&b<30)bmiContext=10;else bmiContext=6}
  const score=Math.round(clamp(perf+bmiContext,0,100));
  const level=Math.max(1,Math.min(10,Math.ceil(score/10)));
  const names=['Rebuilding','Rebuilding','Beginner','Beginner','Developing','Developing','Advanced','Advanced','Elite','Elite'];
  return {score,level,name:names[level-1],next:score<100?`Reach ${Math.min(100,Math.floor(score/10)*10+10)} to move up.`:'Top of the current scale.',components:{performance:Math.round(perf),bmi:bmiContext}};
}
function strengthRecordsFor(name){return data.strength.filter(s=>s.exercise.toLowerCase()===name.toLowerCase()).sort((a,b)=>a.date.localeCompare(b.date))}
function parseResult(text){const m=String(text||'').match(/([0-9]+(?:\.[0-9]+)?)/);return m?Number(m[1]):0}
function bestExercise(names){
  const matches=[];
  for(const n of names){const rows=data.strength.filter(s=>s.exercise.toLowerCase()===n.toLowerCase());for(const r of rows)matches.push({best:parseResult(r.result),date:r.date,result:r.result,exercise:r.exercise})}
  return matches.length?matches.sort((a,b)=>b.best-a.best)[0]:null;
}

function bmi(weight,height){return weight&&height?weight/Math.pow(height/100,2):null}
function bmiLabel(v){if(v===null)return 'Add height + weight';if(v<18.5)return 'Underweight';if(v<25)return 'Healthy range';if(v<30)return 'Overweight';return 'High range'}
function weightHistory(){return data.weighins.slice().sort((a,b)=>a.date.localeCompare(b.date))}
function currentWeight(){return data.profile.weight ?? weightHistory().at(-1)?.weight ?? null}
function weightTrend(){const h=weightHistory();if(h.length<2)return null;return {first:h[0],last:h.at(-1),diff:h.at(-1).weight-h[0].weight}}
function streak(){const s=new Set(data.workouts.map(w=>w.date));let n=0;const d=new Date(today()+'T00:00:00');while(s.has(localISODate(d))){n++;d.setDate(d.getDate()-1)}return n}
function weekWorkouts(){const set=new Set(weekDates());return data.workouts.filter(w=>set.has(w.date))}
function recoveryScore(){
  const sleep=data.sleep.filter(x=>x.date===today()).at(-1);
  const steps=data.steps.filter(x=>x.date===today()).at(-1);
  if(!sleep&&!steps)return 0;
  let score=0,weight=0;
  if(sleep){
    const hours=num(sleep.value);
    const duration=clamp(100-Math.abs(8-hours)*25,0,100);
    const quality={poor:35,fair:60,good:85,great:100}[String(sleep.quality||'').toLowerCase()]||70;
    score+=(duration*.7+quality*.3)*.65;weight+=.65;
  }
  if(steps){
    const target=Math.max(1,data.profile.stepTarget||8000);
    score+=clamp(num(steps.value)/target,0,1)*100*.35;weight+=.35;
  }
  return weight?Math.round(score/weight):0;
}
function fitnessLevel(){
  const w=currentWeight(), b=bmi(w,data.profile.height);
  let perf=0;
  const push=bestExercise(['Push-ups','Knee Push-ups']);
  const lsit=bestExercise(['L-sit','Tuck L-sit']);
  const pull=bestExercise(['Pull-ups','Assisted Pull-ups']);
  const last7=weekDates(),last28=[...Array(28)].map((_,i)=>daysAgo(27-i));
  const c7=data.workouts.filter(x=>last7.includes(x.date)).length/Math.max(1,currentMode().weeklySessions);
  const c28=data.workouts.filter(x=>last28.includes(x.date)).length/Math.max(1,currentMode().weeklySessions*4);
  const consistency=clamp(Math.min(c7,1)*.6+Math.min(c28,1)*.4,0,1);
  perf+=clamp((push?.best||0)/30,0,1)*25;
  perf+=clamp((lsit?.best||0)/60,0,1)*20;
  perf+=clamp((pull?.best||0)/10,0,1)*15;
  perf+=consistency*25;
  let bmiContext=0;
  if(b!==null){if(b>=18.5&&b<25)bmiContext=15;else if(b>=25&&b<30)bmiContext=10;else bmiContext=6}
  const score=Math.round(clamp(perf+bmiContext,0,100));
  const level=Math.max(1,Math.min(10,Math.ceil(score/10)));
  const names=['Rebuilding','Rebuilding','Beginner','Beginner','Developing','Developing','Advanced','Advanced','Elite','Elite'];
  return {score,level,name:names[level-1],next:score<100?`Reach ${Math.min(100,Math.floor(score/10)*10+10)} to move up.`:'Top of the current scale.',components:{performance:Math.round(perf),bmi:bmiContext}};
}
function strengthRecordsFor(name){return data.strength.filter(s=>s.exercise.toLowerCase()===name.toLowerCase()).sort((a,b)=>a.date.localeCompare(b.date))}
function parseResult(text){const m=String(text||'').match(/([0-9]+(?:\.[0-9]+)?)/);return m?Number(m[1]):0}
function bestExercise(names){
  const matches=[];
  for(const n of names){
    const rows=data.strength.filter(s=>s.exercise.toLowerCase()===n.toLowerCase());
    for(const r of rows)matches.push({best:Number.isFinite(Number(r.value))&&Number(r.value)>0?Number(r.value):parseResult(r.result),date:r.date,result:r.result,exercise:r.exercise});
  }
  return matches.length?matches.sort((a,b)=>b.best-a.best)[0]:null;
}

function currentMode(){return MODE_CONFIG[data.mode]||MODE_CONFIG.normal}
function recommendTargets(){
  const m=currentMode(), w=currentWeight();
  const recommendedCalories=w?Math.round(w*24*m.calorieFactor/50)*50:2200;
  const recommendedProtein=w?Math.round(w*m.proteinPerKg):150;
  return {
    calories:data.profile.calorieOverride&&data.profile.calorieTarget?data.profile.calorieTarget:recommendedCalories,
    protein:data.profile.proteinOverride&&data.profile.proteinTarget?data.profile.proteinTarget:recommendedProtein,
    recommendedCalories,recommendedProtein,
    water:data.profile.waterTarget||8,
    steps:data.profile.stepTarget||8000
  };
}

function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  const titles={dashboard:'Dashboard',workouts:'Workouts',nutrition:'Nutrition',progress:'Progress',goals:'Goals',settings:'Settings'};
  $('pageTitle').textContent=titles[id]||'Dashboard';
  if(id==='dashboard'||id==='progress'){document.querySelectorAll('.mobile-nav-item').forEach(b=>b.classList.toggle('active',b.dataset.mobileAction===(id==='dashboard'?'home':'progress')))}
  window.scrollTo({top:0,behavior:'smooth'});
}
function openDialog(id){const d=$(id);if(!d)return;d.showModal();const pairs={workoutModal:'workoutDate',mealModal:'mealDate',progressModal:'progressDate',strengthModal:'strengthDate',sleepModal:'sleepDate',stepsModal:'stepsDate',measurementModal:'measurementDate'};if(pairs[id]&&$(pairs[id]))$(pairs[id]).value=today();if(id==='workoutModal'&&$('exerciseRows')&&!$('exerciseRows').children.length)addExerciseRow();}
function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(d=>d.close())}


function trainingModeLabel(){
  if(data.trainingMode==='manual') return 'MANUAL';
  return `AUTO · ${data.autoStyle==='automatic'?'AUTOMATIC':'GUIDED'}`;
}
function exerciseMuscle(name){return exerciseInfo(name).muscle||'Other'}
function recentWorkoutRows(limit=8){
  return data.workouts.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,limit);
}
function musclesInWorkout(w){
  return [...new Set((w.exercises||[]).map(e=>exerciseMuscle(e.name)).filter(x=>x&&x!=='Cardio'))];
}
function recentMuscles(days=3){
  const dates=new Set([...Array(days)].map((_,i)=>daysAgo(i)));
  return new Set(data.workouts.filter(w=>dates.has(w.date)).flatMap(musclesInWorkout));
}
function lastTrainedDate(muscle){
  for(const w of recentWorkoutRows(30)){
    if(musclesInWorkout(w).includes(muscle)) return w.date;
  }
  return null;
}
function daysSince(date){
  if(!date)return 99;
  return Math.round((new Date(today())-new Date(date+'T00:00:00'))/86400000);
}
function lastExercisePerformance(name){
  const rows=[];
  data.workouts.forEach(w=>(w.exercises||[]).forEach(e=>{
    if(e.name===name) rows.push({...e,date:w.date});
  }));
  rows.sort((a,b)=>b.date.localeCompare(a.date));
  return rows[0]||null;
}
function plannedExercise(name, defaults){
  const last=lastExercisePerformance(name);
  if(!last)return {name,...defaults};
  let weight=num(last.weight), reps=num(last.reps)||defaults.reps, sets=num(last.sets)||defaults.sets;
  if(weight>0 && reps>=Math.max(1,defaults.reps)) weight=Math.round(weight*1.025*2)/2;
  else if(weight>0) weight=Math.round(weight*2)/2;
  if(reps>=defaults.reps+2) reps=defaults.reps;
  return {name,sets,reps,weight,rest:last.rest||defaults.rest};
}
function autoPlan(){
  const mode=data.mode||'normal';
  const recovery=recoveryScore();
  const recent=recentMuscles(2);
  const weekday=new Date(today()+'T00:00:00').getDay();
  const sessions=data.workouts.filter(w=>w.date>=daysAgo(13)).length;

  if(recovery<35){
    const names=mode==='comeback'?['Walking','Plank','Tuck L-sit']:['Walking','Plank','Cable Crunch'];
    return {
      title:'Recovery + movement',
      focus:'Light movement',
      reason:`Recovery is ${recovery}%. FORM is protecting today's training quality.`,
      why:'Low recovery',
      duration:25,
      exercises:names.map(n=>plannedExercise(n,{sets:3,reps:n==='Walking'?20:10,weight:0,rest:45})),
      meal:mode==='bulk'?'Protein + carbs':'Protein + hydration',
      win:'Recover on purpose'
    };
  }

  let focus='Full body';
  if(mode==='bulk'){
    const splits=[
      {focus:'Push · Chest + Shoulders + Triceps',muscles:['Chest','Shoulders','Arms'],names:['Bench Press','Shoulder Press','Lateral Raise','Tricep Pushdown']},
      {focus:'Pull · Back + Biceps',muscles:['Back','Arms'],names:['Lat Pulldown','Seated Cable Row','Face Pull','Bicep Curl']},
      {focus:'Legs · Quads + Hamstrings',muscles:['Legs'],names:['Squat','Leg Press','Romanian Deadlift','Leg Curl']}
    ];
    const available=splits.filter(s=>!s.muscles.some(m=>recent.has(m)));
    const chosen=available[(weekday+sessions)%Math.max(1,available.length)]||splits[weekday%splits.length];
    focus=chosen.focus;
    return {
      title:'Auto hypertrophy session',
      focus,
      reason:`${recovery}% recovery · ${mode.toUpperCase()} mode · recent muscle history considered.`,
      why:'Progressive overload',
      duration:50,
      exercises:chosen.names.map(n=>plannedExercise(n,{sets:3,reps:10,weight:10,rest:90})),
      meal:'Surplus + protein',
      win:'Beat one previous number'
    };
  }

  if(mode==='comeback'){
    const comebackSets=recent.has('Chest')||recent.has('Back')?['Knee Push-ups','Tuck L-sit','Leg Press','Walking']:['Knee Push-ups','Lat Pulldown','Tuck L-sit','Leg Press','Walking'];
    const names=comebackSets.slice(0,5);
    focus='Rebuild · Full body + skill';
    return {
      title:'Auto comeback session',
      focus,
      reason:`${recovery}% recovery · low-to-moderate volume · rebuilding today's capacity.`,
      why:'Comeback progression',
      duration:35,
      exercises:names.map(n=>plannedExercise(n,{sets:n==='Walking'?1:3,reps:n==='Walking'?20:n.includes('L-sit')?10:8,weight:n==='Leg Press'?40:0,rest:60})),
      meal:'Protein + recovery',
      win:'Clean reps beat hard reps'
    };
  }

  // Normal mode: use a simple rotating full-body emphasis.
  const candidates=[
    {focus:'Full body · Push emphasis',names:['Chest Press','Lat Pulldown','Leg Press','Lateral Raise','Plank']},
    {focus:'Full body · Pull emphasis',names:['Lat Pulldown','Chest Press','Romanian Deadlift','Bicep Curl','Tuck L-sit']},
    {focus:'Full body · Legs emphasis',names:['Leg Press','Chest Press','Seated Cable Row','Leg Curl','Plank']}
  ];
  const preferred=candidates.find(c=>c.names.some(n=>!recent.has(exerciseMuscle(n))))||candidates[weekday%3];
  focus=preferred.focus;
  return {
    title:'Auto balanced session',
    focus,
    reason:`${recovery}% recovery · recent training and weekly rhythm considered.`,
    why:'Balanced consistency',
    duration:40,
    exercises:preferred.names.map(n=>plannedExercise(n,{sets:3,reps:10,weight:10,rest:75})),
    meal:'Protein at every meal',
    win:'Show up and complete the core'
  };
}
function workoutAlreadyLoggedToday(){return data.workouts.some(w=>w.date===today())}
function fillWorkoutFromPlan(plan){
  $('workoutDate').value=today();
  $('workoutType').value='gym';
  $('workoutDuration').value=plan.duration;
  $('workoutIntensity').value=data.mode==='comeback'?6:7;
  $('workoutLocation').value=$('workoutLocation').value||'';
  $('workoutNotes').value=`Auto plan · ${plan.focus}`;
  $('exerciseRows').innerHTML='';
  plan.exercises.forEach(e=>addExerciseRow(e));
}
function startTodaysPlan(){
  if(data.trainingMode==='manual'){
    openDialog('workoutModal');
    return;
  }
  const plan=autoPlan();
  openDialog('workoutModal');
  fillWorkoutFromPlan(plan);
}
function renderAutoPlanCard(){
  const auto=data.trainingMode==='auto';
  const plan=auto?autoPlan():null;
  const chip=$('planTrainingChip'),preview=$('autoPlanPreview'),reason=$('planReason');
  $('planTrainingChip').textContent=trainingModeLabel();
  $('planTrainingChip').classList.toggle('manual',!auto);
  $('planTrainingChip').classList.toggle('auto',auto);
  $('planTitle').textContent=auto?plan.title:'Your manual training';
  $('planReason').textContent=auto?plan.reason:'You are in control — FORM will record and analyze what you choose.';
  $('planWorkout').textContent=auto?plan.focus:'Build your own session';
  $('planWorkoutText').textContent=auto?plan.exercises.map(e=>`${e.name} ${e.sets}×${e.reps}${e.weight?' · '+e.weight+' kg':''}`).slice(0,3).join(' · ')+'…':'Choose exercises, sets, reps and weight yourself.';
  $('planMeal').textContent=auto?plan.meal:'Nutrition still adapts to your mode';
  $('planMealText').textContent=auto?`Mode: ${currentMode().label} · targets remain visible in Nutrition.`:'Your meals, targets and progress tracking continue normally.';
  $('planWin').textContent=auto?plan.win:'Train your way';
  $('planWinText').textContent=auto?`Suggested duration · ${plan.duration} min`:'Every manual workout still feeds progress and fitness level.';
  preview.innerHTML=auto
    ? plan.exercises.map(e=>`<button type="button" class="auto-plan-exercise" data-auto-exercise="${esc(e.name)}"><span>${exerciseInfo(e.name).icon}</span><div><strong>${esc(e.name)}</strong><small>${e.sets} sets · ${e.reps} reps${e.weight?' · '+e.weight+' kg':''}</small></div><b>›</b></button>`).join('')
    : `<div class="manual-plan-state"><span>✍️</span><div><strong>Manual mode</strong><small>You choose the workout. FORM will still track and analyze it.</small></div></div>`;
  $('startPlanBtn').textContent=auto?(data.autoStyle==='automatic'?'▶ Start automatic plan':'▶ Use today’s plan'):'＋ Log manual workout';
  $('customizePlanBtn').style.display=auto?'inline-flex':'none';
}

function renderDashboard(){
  const m=currentMode(), targets=recommendTargets(), last7=weekDates(), active=last7.filter(d=>data.workouts.some(w=>w.date===d)).length;
  const score=clamp(Math.round(active/Math.max(1,data.profile.weeklyGymTarget||m.weeklySessions)*100),0,100);
  $('modeChip').textContent=m.label.toUpperCase();$('heroModeLabel').textContent=m.label.toUpperCase()+' MODE';$('heroGoalLabel').textContent=m.goal;
  $('heroTitle').textContent = data.mode==='comeback' ? 'Rebuild the strength you remember.' : data.mode==='bulk' ? 'Build size with intention.' : 'Build the version of you you want.';
  $('heroText').textContent = m.description+' Your plan adapts to the data you log.';
  $('activityScore').textContent=score+'%';$('activityRing').style.setProperty('--p',score);
  $('dashConsistency').textContent=Math.round(active/7*100)+'%';$('dashStreak').textContent=streak()+' days';
  const meals=data.meals.filter(x=>x.date===today());const water=meals.reduce((a,x)=>a+num(x.water),0),protein=meals.reduce((a,x)=>a+num(x.protein),0),cal=meals.reduce((a,x)=>a+num(x.calories),0);
  $('dashWater').textContent=water+' glasses';$('dashProtein').textContent=protein+'g';
  const month=today().slice(0,7);const monthRows=data.workouts.filter(w=>w.date.startsWith(month));$('gymVisits').textContent=monthRows.length;$('gymTime').textContent=formatDuration(monthRows.reduce((a,w)=>a+w.duration,0));
  const cw=currentWeight(), b=bmi(cw,data.profile.height);$('currentWeight').textContent=cw?cw+' kg':'—';const wt=weightTrend();$('weightChange').textContent=wt?`${wt.diff>0?'+':''}${wt.diff.toFixed(1)} kg total`:cw?'Current':'Set your weight';$('bmiValue').textContent=b?b.toFixed(1):'—';$('bmiLabel').textContent=bmiLabel(b);
  $('focusCalories').textContent=`${cal} / ${targets.calories}`;$('focusProtein').textContent=`${protein} / ${targets.protein}g`;
  const sl=data.sleep.filter(x=>x.date===today()).at(-1), st=data.steps.filter(x=>x.date===today()).at(-1);$('focusSleep').textContent=sl?sl.value.toFixed(1)+'h':'—';$('focusSteps').textContent=st?st.value.toLocaleString():'—';
  const workoutToday=data.workouts.some(w=>w.date===today()), rc=recoveryScore();
  $('focusTitle').textContent=workoutToday?'Workout logged. Recover like it matters.':rc>=70?'Recovery looks good. Today is a good training day.':'Build the habit, not the perfect workout.';
  const plan=MODE_PLANS[data.mode]||MODE_PLANS.normal;$('planTitle').textContent=plan.title;$('planMode').textContent=m.label.toUpperCase();$('planWorkout').textContent=plan.workout[0];$('planWorkoutText').textContent=plan.workout[1];$('planMeal').textContent=plan.meal[0];$('planMealText').textContent=plan.meal[1];$('planWin').textContent=plan.win[0];$('planWinText').textContent=plan.win[1];
  renderAutoPlanCard();
  $('focusText').textContent=workoutToday?`${water} glasses · ${protein}g protein · ${rc}% recovery.`:`${m.focus}. A short session still counts.`;$('focusBadge').textContent=workoutToday?'DONE':rc>=70?'GO':'READY';
  $('weekGrid').innerHTML=last7.map(d=>`<div class="day-cell ${data.workouts.some(w=>w.date===d)?'done':''}"><span>${shortDay(d)}</span><div class="day-dot"></div></div>`).join('');$('streakText').textContent=streak()?`${streak()} day streak`:`${active}/${data.profile.weeklyGymTarget||m.weeklySessions} target days`;
  const recent=data.workouts.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);$('recentWorkouts').innerHTML=recent.length?recent.map(w=>`<div class="list-item"><div><div class="list-title">${esc(w.sessionName||w.type+' workout')}</div><div class="list-sub">${fmtDate(w.date)} · ${w.exercises?.length||0} exercises</div></div><div class="list-value">${w.duration} min</div></div>`).join(''):'<div class="empty">No workouts logged yet.</div>';
  const lvl=fitnessLevel();$('levelBadge').textContent='Lv '+lvl.level;$('levelName').textContent=lvl.name;$('levelScore').textContent=lvl.score+' / 100';$('levelFill').style.width=lvl.score+'%';$('levelNext').textContent=lvl.next;$('progressLevel').textContent='Lv '+lvl.level;$('progressLevelText').textContent=`${lvl.name} · ${lvl.score}/100`;
}

function defaultExerciseRow(){return {name:'Push-ups',sets:3,reps:10,weight:0,rest:60}}
function exerciseRowHTML(x){
  const info=exerciseInfo(x.name);
  const rowId=x.id||uid();
  return `<div class="exercise-row exercise-row-v2" data-row-id="${rowId}" data-exercise-name="${esc(x.name)}">
    <div class="exercise-card-head">
      <div class="exercise-row-art">${info.icon}</div>
      <div class="exercise-row-copy"><span class="row-eyebrow">${esc(info.equipment)} · ${esc(info.muscle)}</span><strong>${esc(info.name)}</strong><small>${esc(info.stance)}</small></div>
      <button type="button" class="exercise-change-btn" data-change-row="${rowId}">Change</button>
      <button type="button" class="delete-btn remove-exercise" aria-label="Remove exercise">×</button>
    </div>
    <div class="exercise-row-controls">
      <label class="mini-field"><span>Sets</span><input class="ex-sets" type="number" min="1" max="20" value="${x.sets||3}" aria-label="Sets"></label>
      <label class="mini-field"><span>Reps</span><input class="ex-reps" type="number" min="1" max="100" value="${x.reps||10}" aria-label="Reps"></label>
      <label class="mini-field"><span>Weight</span><input class="ex-weight" type="number" min="0" max="1000" step="0.5" value="${x.weight||0}" aria-label="Weight"></label>
      <label class="mini-field rest-field"><span>Rest</span><input class="ex-rest" type="number" min="0" max="600" value="${x.rest||60}" aria-label="Rest seconds"></label>
    </div>
  </div>`;
}
let exercisePickerTargetRowId=null;
function addExerciseRow(x=defaultExerciseRow()){
  $('exerciseRows').insertAdjacentHTML('beforeend',exerciseRowHTML(x));
  bindExerciseRowActions();
}
function bindExerciseRowActions(){
  document.querySelectorAll('#exerciseRows .remove-exercise').forEach(b=>b.onclick=()=>b.closest('.exercise-row').remove());
  document.querySelectorAll('#exerciseRows [data-change-row]').forEach(b=>b.onclick=()=>{
    exercisePickerTargetRowId=b.dataset.changeRow;
    openExercisePicker();
  });
}
function readExerciseRows(){
  return [...document.querySelectorAll('#exerciseRows .exercise-row')].map(row=>({
    name:row.dataset.exerciseName,
    sets:num(row.querySelector('.ex-sets').value),
    reps:num(row.querySelector('.ex-reps').value),
    weight:num(row.querySelector('.ex-weight').value),
    rest:num(row.querySelector('.ex-rest').value)
  })).filter(x=>x.name);
}

function renderWorkouts(){
  const rows=data.workouts.filter(w=>activeWorkoutFilter==='all'||w.type===activeWorkoutFilter).sort((a,b)=>b.date.localeCompare(a.date));const wk=weekWorkouts();const target=Math.max(1,data.profile.weeklyGymTarget||currentMode().weeklySessions);
  $('workoutWeekCount').textContent=wk.length;$('workoutWeekTime').textContent=formatDuration(wk.reduce((a,w)=>a+w.duration,0));$('workoutStreak').textContent=streak();$('workoutGoalProgress').textContent=clamp(Math.round(wk.length/target*100),0,100)+'%';
  $('workoutList').innerHTML=rows.length?rows.map(w=>`<article class="record"><div class="record-top"><div><h3>${esc(w.sessionName||w.type+' workout')}</h3><p>${fmtDate(w.date)} · ${esc(w.location||w.type)}</p></div><button class="delete-btn" data-delete-collection="workouts" data-delete-id="${w.id}" aria-label="Delete record">×</button></div><div class="record-meta"><span class="meta">${esc(w.type)}</span><span class="meta">${w.duration} min</span>${w.intensity?`<span class="meta">RPE ${w.intensity}/10</span>`:''}<span class="meta">${w.exercises?.length||0} exercises</span></div>${(w.exercises||[]).map(e=>`<div class="list-item"><div><div class="list-title">${esc(e.name)}</div><div class="list-sub">${e.sets} sets · ${e.reps} reps · ${e.weight||0} kg</div></div><div class="list-value">${e.sets*e.reps} reps</div></div>`).join('')}${w.notes?`<div class="record-note">${esc(w.notes)}</div>`:''}</article>`).join(''):'<div class="card empty" style="grid-column:1/-1">No workouts in this filter yet.</div>';
}

function renderNutrition(){
  const meals=data.meals.filter(m=>m.date===today()), targets=recommendTargets();const cal=meals.reduce((a,m)=>a+num(m.calories),0),protein=meals.reduce((a,m)=>a+num(m.protein),0),water=meals.reduce((a,m)=>a+num(m.water),0);
  $('dayCalories').textContent=cal;$('dayProtein').textContent=protein+'g';$('dayWater').textContent=water;$('dayMeals').textContent=meals.length;$('calorieTargetText').textContent=targets.calories+' target';$('proteinTargetText').textContent=targets.protein+'g target';$('waterTargetText').textContent=targets.water+' glasses target';
  $('calorieFill').style.width=clamp(cal/targets.calories*100,0,100)+'%';$('proteinFill').style.width=clamp(protein/targets.protein*100,0,100)+'%';$('waterFill').style.width=clamp(water/targets.water*100,0,100)+'%';
  $('mealList').innerHTML=data.meals.length?data.meals.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<article class="record"><div class="record-top"><div><h3>${esc(m.type)}</h3><p>${fmtDate(m.date)}</p></div><button class="delete-btn" data-delete-collection="meals" data-delete-id="${m.id}" aria-label="Delete record">×</button></div><div class="record-meta"><span class="meta">${m.calories||0} kcal</span><span class="meta">${m.protein||0}g protein</span><span class="meta">${m.water||0} water</span></div><div class="record-note">${esc(m.food||'No food description added.')}</div></article>`).join(''):'<div class="card empty" style="grid-column:1/-1">No meals logged yet.</div>';
}

function renderProgress(){
  const h=weightHistory(), latest=h.at(-1), first=h[0], wt=weightTrend(), range=$('progressRange').value;
  let points=h.slice();
  if(range!=='all'){const cutoff=daysAgo(Number(range));points=points.filter(x=>x.date>=cutoff)}

  const rs=recoveryScore(), lvl=fitnessLevel(), month=today().slice(0,7);
  const monthWorkouts=data.workouts.filter(w=>w.date.startsWith(month));
  const currentW=currentWeight();
  const currentStreak=streak();
  const weeklyDates=weekDates();
  const weekSessions=data.workouts.filter(w=>weeklyDates.includes(w.date)).length;
  const consistency=clamp(Math.round(weekSessions/Math.max(1,data.profile.weeklyGymTarget||currentMode().weeklySessions)*100),0,100);
  const momentum=clamp(Math.round((lvl.score*0.55)+(rs*0.20)+(consistency*0.25)),0,100);

  const mode=currentMode();
  $('progressModePill').textContent=mode.label.toUpperCase();
  $('progressHeroStatus').textContent=mode.heroGoal || mode.goal || 'Build consistency';
  $('progressHeroLevel').textContent=`Lv ${lvl.level} · ${lvl.name}`;
  $('progressCurrentWeight').textContent=currentW?currentW+' kg':'—';
  $('progressHeroRecovery').textContent=rs+'%';
  $('progressMomentumScore').textContent=momentum;

  const orb=$('.score-orb-ring');
  if(orb)orb.style.background=`conic-gradient(#78a0ff ${momentum*3.6}deg,rgba(255,255,255,.15) 0)`;

  $('progressWeightNow').textContent=currentW?currentW+' kg':'—';
  $('progressWeightDelta').textContent=wt?`${wt.diff>0?'+':''}${wt.diff.toFixed(1)} kg total`:'No trend yet';
  $('progressLevel').textContent='Lv '+lvl.level;
  $('progressLevelText').textContent=`${lvl.name} · ${lvl.score}/100`;
  $('recoveryScore').textContent=rs+'%';
  $('recoveryText').textContent=rs===0?'Add sleep + steps':rs>=75?'Strong recovery base':rs>=50?'Decent recovery':'Recovery needs attention';
  $('progressWorkoutCount').textContent=monthWorkouts.length;

  if(!first){
    $('progressHeroTitle').textContent='Start your progress story.';
    $('progressHeroText').textContent='One useful check-in is enough to give FORM something real to measure.';
  } else if(wt){
    $('progressHeroTitle').textContent=wt.diff<0?'You are moving toward your goal.':wt.diff>0?'Your trend is moving upward.':'You are holding steady.';
    $('progressHeroText').textContent=`${first.weight} kg at the start · ${latest.weight} kg now. Keep logging and FORM will make the pattern visible.`;
  } else {
    $('progressHeroTitle').textContent='Your first check-in is saved.';
    $('progressHeroText').textContent='Add another weigh-in, PR or recovery entry to unlock richer trends.';
  }

  $('startWeight').textContent=first?first.weight+' kg':'—';
  $('goalWeightView').textContent=data.profile.goalWeight?data.profile.goalWeight+' kg':'—';
  $('progressJourneyCurrent').textContent=currentW?currentW+' kg':'—';
  $('journeyDelta').textContent=wt?`${wt.diff>0?'+':''}${wt.diff.toFixed(1)} kg since start`:'Add 2+ weigh-ins to measure change';
  const journeyTarget=data.profile.goalWeight&&first?Math.abs(first.weight-data.profile.goalWeight):0;
  const journeyDone=wt&&journeyTarget?Math.abs(wt.diff):0;
  $('journeyFill').style.width=journeyTarget?clamp(journeyDone/journeyTarget*100,0,100)+'%':'0%';
  $('journeyStatus').textContent=data.profile.goalWeight&&first?(wt&&Math.abs(wt.diff)>=journeyTarget?'Goal range reached':'In progress'):'Set a goal';

  const showEmpty=points.length<2;
  $('chartEmptyState').classList.toggle('visible',showEmpty);
  $('weightChart').classList.toggle('hidden',showEmpty);
  $('progressSummary').textContent=latest?`${latest.weight} kg${wt&&wt.diff!==0?' · '+(wt.diff>0?'+':'')+wt.diff.toFixed(1)+' kg total':''}`:'No weigh-ins yet';
  drawChart(points);

  $('strengthList').innerHTML=data.strength.length?
    data.strength.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(s=>`<div class="list-item"><div><div class="list-title">${esc(s.exercise)}</div><div class="list-sub">${fmtDate(s.date)}</div></div><div class="list-value">${esc(s.result)}</div></div>`).join(''):
    `<div class="empty-state-compact"><strong>No PRs yet.</strong><span>Add one benchmark and FORM can start showing your strength story.</span><button class="text-btn" data-empty-action="strength">＋ Add PR</button></div>`;

  const comeback=[['Push-ups',['Push-ups','Knee Push-ups'],'Target: 30 reps'],['L-sit',['L-sit','Tuck L-sit'],'College best: 60 sec'],['Pull-ups',['Pull-ups','Assisted Pull-ups'],'Target: 10 reps']];
  $('comebackList').innerHTML=comeback.map(([label,names,bench])=>{
    const best=bestExercise(names);
    return `<div class="list-item"><div><div class="list-title">${label}</div><div class="list-sub">${bench}</div></div><div class="list-value">${best?esc(best.result):'<span class="muted-action">Log best</span>'}</div></div>`;
  }).join('');

  const measures=data.measurements.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  $('measurementList').innerHTML=measures.length?
    measures.map(m=>`<div class="list-item"><div><div class="list-title">${fmtDate(m.date)}</div><div class="list-sub">Waist ${m.waist||'—'} · Chest ${m.chest||'—'} · Arms ${m.arms||'—'} · Thighs ${m.thighs||'—'}</div></div><button class="delete-btn" data-delete-collection="measurements" data-delete-id="${m.id}" aria-label="Delete record">×</button></div>`).join(''):
    `<div class="empty-state-compact"><strong>No measurements yet.</strong><span>Use waist, chest, arms and thighs to see body changes beyond the scale.</span><button class="text-btn" data-empty-action="measurement">＋ Add measurements</button></div>`;

  const sleeps=data.sleep.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,2);
  const steps=data.steps.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,2);
  $('recoveryList').innerHTML=(sleeps.length||steps.length)?
    [...sleeps.map(s=>`<div class="list-item"><div><div class="list-title">🌙 ${fmtDate(s.date)}</div><div class="list-sub">Sleep · ${s.quality||'—'}</div></div><div class="list-value">${Number(s.value).toFixed(1)}h</div></div>`),
     ...steps.map(s=>`<div class="list-item"><div><div class="list-title">👟 ${fmtDate(s.date)}</div><div class="list-sub">Steps</div></div><div class="list-value">${num(s.value).toLocaleString()}</div></div>`)].join(''):
    `<div class="empty-state-compact"><strong>No recovery check-ins yet.</strong><span>Log sleep or steps and the recovery card will start reflecting your routine.</span><div class="empty-action-row"><button class="soft-btn" id="progressSleepEmptyBtn">🌙 Sleep</button><button class="soft-btn" id="progressStepsEmptyBtn">👟 Steps</button></div></div>`;

  $('progress').querySelectorAll('[data-empty-action="strength"]').forEach(b=>b.onclick=()=>openDialog('strengthModal'));
  $('progress').querySelectorAll('[data-empty-action="measurement"]').forEach(b=>b.onclick=()=>openDialog('measurementModal'));
  $('progressSleepEmptyBtn')?.addEventListener('click',()=>openDialog('sleepModal'));
  $('progressStepsEmptyBtn')?.addEventListener('click',()=>openDialog('stepsModal'));
}

function drawChart(points){const c=$('weightChart'),ctx=c.getContext('2d'),rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=Math.max(300,rect.width)*dpr;c.height=280*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,280);if(points.length<2){ctx.fillStyle='#9aa3b1';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('Add at least 2 weigh-ins to see your trend.',rect.width/2,140);return}const min=Math.min(...points.map(p=>p.weight))-2,max=Math.max(...points.map(p=>p.weight))+2,pad=35,w=rect.width-pad*2,h=210;ctx.strokeStyle='#edf0f5';for(let i=0;i<5;i++){const y=22+i*44;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(rect.width-pad,y);ctx.stroke()}ctx.strokeStyle='#5b7cfa';ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>{const x=pad+i/(points.length-1)*w,y=22+(max-p.weight)/(max-min)*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillStyle='#8b5cf6';points.forEach((p,i)=>{const x=pad+i/(points.length-1)*w,y=22+(max-p.weight)/(max-min)*h;ctx.beginPath();ctx.arc(x,y,4.5,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#6b7280';ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText(points[0].weight+' kg',pad,270);ctx.fillText(points.at(-1).weight+' kg',rect.width-pad,270)}

function goalDirection(goal){
  if(goal?.direction)return goal.direction;
  if(String(goal?.category||'').toLowerCase().includes('weight loss'))return 'decrease';
  return 'increase';
}
function goalCurrentValue(goal){
  const c=String(goal?.category||'').toLowerCase();
  if(c.includes('weight'))return currentWeight()||0;
  if(c.includes('push'))return bestExercise(['Push-ups','Knee Push-ups'])?.best||0;
  if(c.includes('l-sit'))return bestExercise(['L-sit','Tuck L-sit'])?.best||0;
  if(c.includes('pull-up'))return bestExercise(['Pull-ups','Assisted Pull-ups'])?.best||0;
  if(c.includes('step'))return num(data.steps.find(x=>x.date===today())?.value||0);
  return num(goal?.current||0);
}
function goalProgress(goal){
  const current=goalCurrentValue(goal),target=num(goal?.target),direction=goalDirection(goal);
  if(!target)return 0;
  const start=goal?.startValue!=null?num(goal.startValue):current;
  if(direction==='decrease'){if(start<=target)return current<=target?100:0;return clamp((start-current)/(start-target)*100,0,100);}
  return clamp(current/target*100,0,100);
}
function renderGoals(){
  const m=currentMode();$('goalModeTitle').textContent=m.goal;$('goalModeText').textContent=m.description;
  $('goalList').innerHTML=data.goals.length?data.goals.slice().sort((a,b)=>Number(a.done)-Number(b.done)).map(g=>{
    const p=goalProgress(g),cur=goalCurrentValue(g);
    return `<article class="goal-card ${g.done?'complete':''}"><div class="goal-top"><div><div class="goal-title">${g.done?'✅ ':''}${esc(g.title)}</div><div class="goal-meta">${esc(g.category||'Goal')} ${g.deadline?'· due '+fmtDate(g.deadline):''}</div></div><button class="delete-btn" data-delete-collection="goals" data-delete-id="${esc(g.id)}" aria-label="Delete goal">×</button></div><div class="goal-progress"><i style="width:${p}%"></i></div><div class="goal-foot"><span>${cur}${g.unit?' '+esc(g.unit):''} / ${g.target??0}${g.unit?' '+esc(g.unit):''}</span><button class="text-btn" data-toggle-goal="${esc(g.id)}">${g.done?'Reopen':'Complete'}</button></div></article>`;
  }).join(''):'<div class="card empty" style="grid-column:1/-1">No goals yet. Add your first milestone.</div>';
}
function renderSettings(){
  const m=currentMode();
  const targets=recommendTargets();
  $('settingsModeName').textContent=m.label.toUpperCase()+' MODE';
  $('settingsModeGoal').textContent=m.goal;
  $('settingsHeroMode').textContent=m.label;
  $('settingsHeroTitle').textContent=data.mode==='comeback'?'Rebuild your strength with intent.':data.mode==='bulk'?'Build size with intention.':'A balanced plan built around consistency.';
  $('settingsHeroText').textContent=m.description+' Your workouts and history stay untouched when you switch phases.';
  $('settingsModeFocus').textContent=m.focus;
  $('settingsModeSessions').textContent=(m.weeklySessions||3)+' sessions / week';
  $('settingsModeProtein').textContent='~'+m.proteinPerKg.toFixed(1)+' g/kg';
  $('settingsModeDot').style.background=data.mode==='bulk'?'#ffb07a':data.mode==='comeback'?'#b8a0ff':'#9fb0ff';

  document.querySelectorAll('#modeOptions .mode-option').forEach(b=>{
    const active=b.dataset.mode===data.mode;
    b.classList.toggle('active',active);
    b.setAttribute('aria-pressed',String(active));
    b.onclick=()=>{
      if(data.mode===b.dataset.mode)return;
      data.mode=b.dataset.mode;
      save();
    };
  });


  $('settingsTrainingBadge').textContent=trainingModeLabel();
  document.querySelectorAll('#trainingModeOptions .training-mode-card').forEach(b=>{
    const active=b.dataset.trainingMode===data.trainingMode;
    b.classList.toggle('active',active);
    b.setAttribute('aria-pressed',String(active));
  });
  document.querySelectorAll('#autoStyleOptions .auto-style-card').forEach(b=>{
    const active=b.dataset.autoStyle===data.autoStyle;
    b.classList.toggle('active',active);
    b.setAttribute('aria-pressed',String(active));
  });
  $('autoStylePanel').style.display=data.trainingMode==='auto'?'block':'none';
  $('trainingEngineSummary').innerHTML=data.trainingMode==='auto'
    ? `<span class="engine-dot"></span><div><strong>${data.autoStyle==='automatic'?'Automatic planning is active.':'Guided auto planning is active.'}</strong><small>FORM considers ${currentMode().label} mode, recovery, recent muscles, recent performance, weekday and training frequency.</small></div>`
    : `<span class="engine-dot manual"></span><div><strong>Manual logging is active.</strong><small>FORM won't prescribe your workout, but every session still feeds progress, PRs, recovery and fitness level.</small></div>`;

  const p=data.profile;
  $('profileName').value=p.name||'';
  $('profileHeight').value=p.height||'';
  $('profileWeight').value=p.weight||'';
  $('profileGoalWeight').value=p.goalWeight||'';
  $('profileCalories').value=p.calorieOverride&&p.calorieTarget?p.calorieTarget:targets.recommendedCalories;
  $('profileProtein').value=p.proteinOverride&&p.proteinTarget?p.proteinTarget:targets.recommendedProtein;
  $('profileWater').value=p.waterTarget||8;
  $('profileSteps').value=p.stepTarget||8000;
  $('profileGymTarget').value=p.weeklyGymTarget||m.weeklySessions;

  $('settingsSaveHint').textContent='Saved locally on this device.';
}

function renderAll(){renderDashboard();renderWorkouts();renderNutrition();renderProgress();renderGoals();renderSettings()}

function removeItem(collection,id){if(!Array.isArray(data[collection]))return;data[collection]=data[collection].filter(x=>x.id!==id);save()}
function toggleGoal(id){const g=data.goals.find(x=>x.id===id);if(g){g.done=!g.done;g.current=goalCurrentValue(g);save()}}
window.removeItem=removeItem;window.toggleGoal=toggleGoal;


document.querySelectorAll('[data-training-mode]').forEach(b=>b.onclick=()=>{
  data.trainingMode=b.dataset.trainingMode;
  save();
});
document.querySelectorAll('[data-auto-style]').forEach(b=>b.onclick=()=>{
  data.autoStyle=b.dataset.autoStyle;
  save();
});
$('startPlanBtn').onclick=()=>startTodaysPlan();
$('customizePlanBtn').onclick=()=>{
  if(data.trainingMode==='auto'){openDialog('workoutModal');fillWorkoutFromPlan(autoPlan());}
};
document.addEventListener('click',e=>{
  const ex=e.target.closest('[data-auto-exercise]');
  if(ex && data.trainingMode==='auto'){
    openDialog('workoutModal');
    const plan=autoPlan();
    fillWorkoutFromPlan({...plan,exercises:plan.exercises.filter(x=>x.name===ex.dataset.autoExercise)});
  }
});

// Navigation and actions

document.querySelectorAll('[data-progress-target]').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('.progress-tab').forEach(x=>x.classList.toggle('active',x===btn));
  const target=$(btn.dataset.progressTarget);
  target?.scrollIntoView({behavior:'smooth',block:'start'});
});

$('todayLabel').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
// Mobile navigation: Home, unified Log, Progress, More. Desktop navigation stays unchanged.
document.querySelectorAll('[data-mobile-action]').forEach(btn=>btn.onclick=()=>{
  const action=btn.dataset.mobileAction;
  document.querySelectorAll('.mobile-nav-item').forEach(x=>x.classList.toggle('active',x===btn));
  if(action==='home') showSection('dashboard');
  if(action==='progress') showSection('progress');
  if(action==='log') openDialog('mobileLogDialog');
  if(action==='more') openDialog('mobileMoreDialog');
});
document.querySelectorAll('[data-log-target]').forEach(btn=>btn.onclick=()=>{
  const target=btn.dataset.logTarget;
  const sheet=$('mobileLogDialog');
  if(sheet?.open) sheet.close();
  const map={workout:'workoutModal',meal:'mealModal',weight:'progressModal',sleep:'sleepModal',steps:'stepsModal',measurement:'measurementModal'};
  const dialogId=map[target];
  if(dialogId && $(dialogId)) openDialog(dialogId);
});
document.querySelectorAll('[data-more-target]').forEach(btn=>btn.onclick=()=>{
  const target=btn.dataset.moreTarget;
  $('mobileMoreDialog').close();
  showSection(target);
});
document.querySelectorAll('[data-mobile-close]').forEach(btn=>btn.onclick=()=>{
  const dialog=btn.closest('dialog');
  if(dialog?.open) dialog.close();
});

document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showSection(b.dataset.section));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showSection(b.dataset.go));
$('quickWorkoutBtn').onclick=()=>data.trainingMode==='auto'&&data.autoStyle==='automatic'?startTodaysPlan():openDialog('workoutModal');$('heroWorkoutBtn').onclick=()=>data.trainingMode==='auto'&&data.autoStyle==='automatic'?startTodaysPlan():openDialog('workoutModal');$('addWorkoutBtn').onclick=()=>data.trainingMode==='auto'&&data.autoStyle==='automatic'?startTodaysPlan():openDialog('workoutModal');$('addMealBtn').onclick=()=>openDialog('mealModal');$('addProgressBtn').onclick=()=>openDialog('progressModal');$('addStrengthBtn').onclick=()=>openDialog('strengthModal');$('logSleepBtn').onclick=()=>openDialog('sleepModal');$('logStepsBtn').onclick=()=>openDialog('stepsModal');$('addMeasurementBtn').onclick=()=>openDialog('measurementModal');$('addGoalBtn').onclick=()=>openDialog('goalModal');$('progressHeroLogBtn').onclick=()=>openDialog('mobileLogDialog');$('progressHeroStrengthBtn').onclick=()=>openDialog('strengthModal');$('chartEmptyBtn').onclick=()=>openDialog('progressModal');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('workoutFilters').querySelectorAll('.filter').forEach(b=>b.onclick=()=>{activeWorkoutFilter=b.dataset.filter;$('workoutFilters').querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderWorkouts()});
$('progressRange').onchange=renderProgress;window.addEventListener('resize',()=>{if($('progress').classList.contains('active'))renderProgress()});


let activeExerciseFilter='All';

function exerciseInfo(name){
  return EXERCISE_LIBRARY.find(x=>x.name===name)||{name,muscle:'Other',equipment:'',stance:'',icon:'🏋️'};
}
function favoriteExercise(name){
  return data.favorites.includes(name);
}
function toggleFavoriteExercise(name){
  if(favoriteExercise(name)) data.favorites=data.favorites.filter(x=>x!==name);
  else if(data.favorites.length<30) data.favorites.unshift(name);
  localStorage.setItem(APP_KEY,JSON.stringify(data));
  renderExercisePicker();
  renderWorkoutFavorites();
}
function exerciseCardHTML(ex, quick=false){
  const fav=favoriteExercise(ex.name);
  return `<article class="exercise-card ${fav?'is-favorite':''}">
    <button type="button" class="exercise-fav" data-fav-exercise="${esc(ex.name)}" aria-label="${fav?'Remove from favorites':'Add to favorites'}">${fav?'★':'☆'}</button>
    <div class="exercise-art"><span>${ex.icon}</span><small>${esc(ex.equipment)}</small></div>
    <div class="exercise-card-copy"><strong>${esc(ex.name)}</strong><span>${esc(ex.muscle)} · ${esc(ex.stance)}</span></div>
    <button type="button" class="exercise-add" data-add-exercise="${esc(ex.name)}">${quick?'Add':'＋ Add'}</button>
  </article>`;
}
function recentExerciseNames(){
  const names=[];
  data.workouts.slice().sort((a,b)=>b.date.localeCompare(a.date)).forEach(w=>(w.exercises||[]).forEach(e=>{if(e?.name&&!names.includes(e.name))names.push(e.name)}));
  return names.slice(0,8);
}
function recommendedExercises(){
  const mode=data.mode||'normal';
  const normal=['Bench Press','Lat Pulldown','Squat','Shoulder Press','Seated Cable Row','Walking'];
  const bulk=['Bench Press','Incline Dumbbell Press','Lat Pulldown','Leg Press','Lateral Raise','Tricep Pushdown'];
  const comeback=['Knee Push-ups','Tuck L-sit','Assisted Pull-ups','Leg Press','Walking','Plank'];
  const names=mode==='bulk'?bulk:mode==='comeback'?comeback:normal;
  return names.map(exerciseInfo);
}
function renderWorkoutFavorites(){
  const box=$('workoutFavoriteStrip');
  if(!box)return;
  const favorites=data.favorites.map(exerciseInfo).slice(0,6);
  box.innerHTML=favorites.length
    ? `<div class="workout-favorite-head"><div><span class="eyebrow">YOUR REGULARS</span><strong>Quick add</strong></div><button type="button" class="text-btn" id="openLibraryFromFavorites">View library</button></div><div class="favorite-mini-grid">${favorites.map(ex=>`<button type="button" class="favorite-mini" data-add-exercise="${esc(ex.name)}"><span>${ex.icon}</span><div><strong>${esc(ex.name)}</strong><small>${esc(ex.muscle)} · ${esc(ex.equipment)}</small></div><b>＋</b></button>`).join('')}</div>`
    : `<div class="workout-favorite-empty"><div><span class="eyebrow">YOUR REGULARS</span><strong>Favourite exercises you do often.</strong><small>Star an exercise in the library and it will appear here for one-tap adding.</small></div><button type="button" class="soft-btn" id="openLibraryFromFavorites">Browse library</button></div>`;
  $('openLibraryFromFavorites')?.addEventListener('click',openExercisePicker);
}
function openExercisePicker(targetRowId=null){
  exercisePickerTargetRowId=targetRowId;
  $('exerciseSearch').value='';
  activeExerciseFilter='All';
  document.querySelectorAll('.exercise-filter').forEach(b=>b.classList.toggle('active',b.dataset.exFilter==='All'));
  $('exercisePickerModal').showModal();
  renderExercisePicker();
}
function renderExercisePicker(){
  const q=($('exerciseSearch')?.value||'').trim().toLowerCase();
  const mode=data.mode||'normal';
  const modeLabel=MODE_CONFIG[mode]?.label||'Normal';
  $('exerciseModeNote').textContent=`${modeLabel} mode · smart picks`;
  const favorites=data.favorites.map(exerciseInfo).filter(ex=>!q||`${ex.name} ${ex.equipment} ${ex.muscle} ${ex.stance}`.toLowerCase().includes(q)).slice(0,5);
  const quick=recommendedExercises().filter(ex=>!q||`${ex.name} ${ex.equipment} ${ex.muscle}`.toLowerCase().includes(q)).slice(0,5);
  const picks=[...favorites];
  quick.forEach(x=>{if(!picks.some(p=>p.name===x.name))picks.push(x)});
  $('exerciseQuickPicks').innerHTML=picks.length
    ? picks.map(ex=>exerciseCardHTML(ex,true)).join('')
    : `<div class="exercise-empty-mini">Star a few exercises or search the library to build your quick picks.</div>`;
  const filter=activeExerciseFilter;
  let rows=EXERCISE_LIBRARY.filter(ex=>{
    const hay=`${ex.name} ${ex.muscle} ${ex.equipment} ${ex.stance}`.toLowerCase();
    const matchesQ=!q||hay.includes(q);
    const matchesFilter=filter==='All'||(filter==='Favorites'?favoriteExercise(ex.name):ex.muscle===filter);
    return matchesQ&&matchesFilter;
  });
  $('exerciseResultCount').textContent=`${rows.length} exercise${rows.length===1?'':'s'}`;
  $('exerciseLibraryGrid').innerHTML=rows.length
    ? rows.map(ex=>exerciseCardHTML(ex,false)).join('')
    : `<div class="exercise-empty-state"><span>⌕</span><strong>No exercises found</strong><small>Try another search or category.</small></div>`;
  bindExercisePickerActions();
}
function bindExercisePickerActions(){
  document.querySelectorAll('[data-fav-exercise]').forEach(b=>b.onclick=()=>toggleFavoriteExercise(b.dataset.favExercise));
  document.querySelectorAll('[data-add-exercise]').forEach(b=>b.onclick=()=>{
    const name=b.dataset.addExercise;
    if(exercisePickerTargetRowId){
      const row=document.querySelector(`#exerciseRows .exercise-row[data-row-id="${CSS.escape(exercisePickerTargetRowId)}"]`);
      if(row){
        const info=exerciseInfo(name);
        row.dataset.exerciseName=name;
        row.querySelector('.exercise-row-art').textContent=info.icon;
        row.querySelector('.row-eyebrow').textContent=`${info.equipment} · ${info.muscle}`;
        row.querySelector('.exercise-row-copy strong').textContent=info.name;
        row.querySelector('.exercise-row-copy small').textContent=info.stance;
      }
      exercisePickerTargetRowId=null;
    }else{
      addExerciseRow({name,sets:3,reps:10,weight:0,rest:60});
    }
    bindExerciseRowActions();
    $('exercisePickerModal').close();
    renderWorkoutFavorites();
  });
}
$('exerciseSearch').addEventListener('input',renderExercisePicker);
$('exerciseFilterRow').querySelectorAll('.exercise-filter').forEach(b=>b.onclick=()=>{
  activeExerciseFilter=b.dataset.exFilter;
  $('exerciseFilterRow').querySelectorAll('.exercise-filter').forEach(x=>x.classList.toggle('active',x===b));
  renderExercisePicker();
});
$('exerciseClearSearch').onclick=()=>{$('exerciseSearch').value='';renderExercisePicker()};

// Exercise builder
$('addExerciseRowBtn').onclick=()=>{exercisePickerTargetRowId=null;openExercisePicker()}; renderWorkoutFavorites();

// Forms
$('workoutForm').onsubmit=e=>{e.preventDefault();const ex=readExerciseRows();if(!ex.length){alert('Add at least one exercise.');return}data.workouts.unshift({id:uid(),date:$('workoutDate').value,type:$('workoutType').value,duration:num($('workoutDuration').value),intensity:num($('workoutIntensity').value),location:$('workoutLocation').value.trim(),sessionName:ex[0].name+' session',planningMode:data.trainingMode,planFocus:data.trainingMode==='auto'?autoPlan().focus:null,exercises:ex.map(x=>({...x,...exerciseInfo(x.name)})),notes:$('workoutNotes').value.trim()});e.target.closest('dialog').close();e.target.reset();$('exerciseRows').innerHTML='';addExerciseRow();save()};
$('mealForm').onsubmit=e=>{e.preventDefault();data.meals.unshift({id:uid(),date:$('mealDate').value,type:$('mealType').value,calories:num($('mealCalories').value),protein:num($('mealProtein').value),water:num($('mealWater').value),food:$('mealFood').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('progressForm').onsubmit=e=>{e.preventDefault();const weight=num($('progressWeight').value);data.weighins.push({id:uid(),date:$('progressDate').value,weight,note:$('progressNote').value.trim()});data.weighins.sort((a,b)=>a.date.localeCompare(b.date));data.profile.weight=weight;e.target.closest('dialog').close();e.target.reset();save()};
$('strengthForm').onsubmit=e=>{e.preventDefault();data.strength.push({id:uid(),exercise:$('strengthExercise').value.trim(),result:$('strengthResult').value.trim(),date:$('strengthDate').value});e.target.closest('dialog').close();e.target.reset();save()};
$('sleepForm').onsubmit=e=>{e.preventDefault();data.sleep.push({id:uid(),date:$('sleepDate').value,value:num($('sleepHours').value),quality:$('sleepQuality').value,note:$('sleepNote').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('stepsForm').onsubmit=e=>{e.preventDefault();data.steps.push({id:uid(),date:$('stepsDate').value,value:num($('stepsValue').value),note:$('stepsNote').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('measurementForm').onsubmit=e=>{e.preventDefault();data.measurements.push({id:uid(),date:$('measurementDate').value,waist:num($('measurementWaist').value),chest:num($('measurementChest').value),arms:num($('measurementArms').value),thighs:num($('measurementThighs').value),note:$('measurementNote').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('goalForm').onsubmit=e=>{e.preventDefault();data.goals.push({id:uid(),title:$('goalTitleInput').value.trim(),category:$('goalCategory').value,current:num($('goalCurrent').value),target:num($('goalTarget').value),unit:$('goalUnit').value.trim(),deadline:$('goalDeadline').value,done:false});e.target.closest('dialog').close();e.target.reset();save()};
$('profileForm').onsubmit=e=>{e.preventDefault();data.profile={...data.profile,name:$('profileName').value.trim(),height:num($('profileHeight').value)||null,weight:num($('profileWeight').value)||null,goalWeight:num($('profileGoalWeight').value)||null,calorieTarget:num($('profileCalories').value)||null,proteinTarget:num($('profileProtein').value)||null,waterTarget:num($('profileWater').value)||8,stepTarget:num($('profileSteps').value)||8000,weeklyGymTarget:num($('profileGymTarget').value)||currentMode().weeklySessions};save();$('settingsSaveHint').textContent='Saved just now.'};

$('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`FORM-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href)};
$('importInput').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=normalize(JSON.parse(reader.result));if(!confirm('Replace current FORM data with this backup?'))return;data=imported;save();alert('Backup imported.')}catch{alert('That file is not a valid FORM backup.')}};reader.readAsText(file)};
$('resetDataBtn').onclick=()=>{if(!confirm('Reset all FORM data? This cannot be undone. Export a backup first if you need it.'))return;localStorage.removeItem(APP_KEY);data=normalize({});renderAll()};

// Set initial modal contents
$('exerciseRows').innerHTML='';addExerciseRow();


// Mobile touch reliability: explicitly convert touchend into a single button activation.
// Some emulated/mobile browsers can suppress the synthetic click after complex modal/layout updates.
document.addEventListener('touchend',e=>{
  const button=e.target.closest('button');
  if(!button || button.disabled) return;
  e.preventDefault();
  button.click();
},{passive:false});

renderAll();

document.addEventListener('click',e=>{const d=e.target.closest('[data-delete-collection]');if(d){removeItem(d.dataset.deleteCollection,d.dataset.deleteId);return;}const t=e.target.closest('[data-toggle-goal]');if(t)toggleGoal(t.dataset.toggleGoal);});

window.addEventListener('error',event=>console.error('FORM runtime error:',event.error||event.message));
