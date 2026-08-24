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
const EXERCISES = [
  ['Push-ups','Chest'],['Knee Push-ups','Chest'],['Bench Press','Chest'],['Chest Press','Chest'],['Incline Dumbbell Press','Chest'],['Cable Fly','Chest'],
  ['Lat Pulldown','Back'],['Seated Cable Row','Back'],['One-arm Dumbbell Row','Back'],['Pull-ups','Back'],['Assisted Pull-ups','Back'],
  ['Shoulder Press','Shoulders'],['Lateral Raise','Shoulders'],['Face Pull','Shoulders'],['Bicep Curl','Arms'],['Hammer Curl','Arms'],['Tricep Pushdown','Arms'],['Dips','Arms'],
  ['Squat','Legs'],['Leg Press','Legs'],['Romanian Deadlift','Legs'],['Leg Curl','Legs'],['Leg Extension','Legs'],['Calf Raise','Legs'],
  ['Plank','Core'],['L-sit','Core'],['Tuck L-sit','Core'],['Hanging Knee Raise','Core'],['Crunches','Core'],['Walking','Cardio'],['Cycling','Cardio'],['Running','Cardio']
];
const DEFAULTS = {version:4,mode:'normal',profile:{name:'',height:180,weight:null,goalWeight:null,calorieTarget:null,proteinTarget:null,waterTarget:8,stepTarget:8000,weeklyGymTarget:3},workouts:[],meals:[],weighins:[],strength:[],measurements:[],sleep:[],steps:[],goals:[]};
let data = load();
let activeWorkoutFilter = 'all';

const $ = id => document.getElementById(id);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(16).slice(2));
const today = () => new Date().toISOString().slice(0,10);
const fmtDate = d => new Date(d+'T00:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
const shortDay = d => new Date(d+'T00:00:00').toLocaleDateString(undefined,{weekday:'short'}).slice(0,2);
const daysAgo = n => {const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)};
const weekDates = () => [...Array(7)].map((_,i)=>daysAgo(6-i));
const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const formatDuration = mins => `${Math.floor(num(mins)/60)}h ${num(mins)%60}m`;

function normalize(raw){
  const d = {...DEFAULTS,...(raw||{})};
  d.profile = {...DEFAULTS.profile,...(raw?.profile||{})};
  for(const k of ['workouts','meals','weighins','strength','measurements','sleep','steps','goals']) if(!Array.isArray(d[k])) d[k]=[];
  if(!MODE_CONFIG[d.mode]) d.mode='normal';
  return d;
}
function migrate(){
  try{
    if(localStorage.getItem(APP_KEY)) return;
    for(const k of LEGACY_KEYS){const v=localStorage.getItem(k);if(v){localStorage.setItem(APP_KEY,JSON.stringify(normalize(JSON.parse(v))));break}}
  }catch(e){console.warn('Migration skipped',e)}
}
function load(){migrate();try{return normalize(JSON.parse(localStorage.getItem(APP_KEY)||'{}'))}catch{return normalize({})}}
function save(){data.version=4;localStorage.setItem(APP_KEY,JSON.stringify(data));renderAll()}

function bmi(weight,height){return weight&&height?weight/Math.pow(height/100,2):null}
function bmiLabel(v){if(v===null)return 'Add height + weight';if(v<18.5)return 'Underweight';if(v<25)return 'Healthy range';if(v<30)return 'Overweight';return 'High range'}
function weightHistory(){return data.weighins.slice().sort((a,b)=>a.date.localeCompare(b.date))}
function currentWeight(){return data.profile.weight ?? weightHistory().at(-1)?.weight ?? null}
function weightTrend(){const h=weightHistory();if(h.length<2)return null;return {first:h[0],last:h.at(-1),diff:h.at(-1).weight-h[0].weight}}
function streak(){const s=new Set(data.workouts.map(w=>w.date));let n=0;const d=new Date(today()+'T00:00:00');while(s.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
function weekWorkouts(){const set=new Set(weekDates());return data.workouts.filter(w=>set.has(w.date))}
function recoveryScore(){
  const sleep = data.sleep.filter(x=>x.date===today()).at(-1);
  const steps = data.steps.filter(x=>x.date===today()).at(-1);
  const sleepPart = sleep ? (sleep.value>=7&&sleep.value<=9?35:sleep.value>=6?25:12) : 0;
  const target = data.profile.stepTarget||8000;
  const stepPart = steps ? Math.round(clamp(steps.value/target,0,1)*25) : 0;
  const restPenalty = data.workouts.some(w=>w.date===today()) ? 0 : 0;
  return clamp(sleepPart+stepPart+20+restPenalty,0,100);
}

function fitnessLevel(){
  // This is intentionally a product heuristic, not a medical/scientific ranking.
  const w=currentWeight(), b=bmi(w,data.profile.height);
  let perf=0;
  const push = bestExercise(['Push-ups','Knee Push-ups']);
  const lsit = bestExercise(['L-sit','Tuck L-sit']);
  const pull = bestExercise(['Pull-ups','Assisted Pull-ups']);
  const consistency = clamp(data.workouts.length/24,0,1);
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
function currentMode(){return MODE_CONFIG[data.mode]||MODE_CONFIG.normal}
function recommendTargets(){
  const m=currentMode(), w=currentWeight();
  const calories = data.profile.calorieTarget || (w ? Math.round(w*24*m.calorieFactor/50)*50 : 2200);
  const protein = data.profile.proteinTarget || (w ? Math.round(w*m.proteinPerKg) : 150);
  return {calories,protein,water:data.profile.waterTarget||8,steps:data.profile.stepTarget||8000};
}

function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  const titles={dashboard:'Dashboard',workouts:'Workouts',nutrition:'Nutrition',progress:'Progress',goals:'Goals',settings:'Settings'};
  $('pageTitle').textContent=titles[id]||'Dashboard'; window.scrollTo({top:0,behavior:'smooth'});
}
function openDialog(id){const d=$(id);if(!d)return;d.showModal();const pairs={workoutModal:'workoutDate',mealModal:'mealDate',progressModal:'progressDate',strengthModal:'strengthDate',sleepModal:'sleepDate',stepsModal:'stepsDate',measurementModal:'measurementDate'};if(pairs[id]&&$(pairs[id]))$(pairs[id]).value=today();}
function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(d=>d.close())}

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
  $('focusText').textContent=workoutToday?`${water} glasses · ${protein}g protein · ${rc}% recovery.`:`${m.focus}. A short session still counts.`;$('focusBadge').textContent=workoutToday?'DONE':rc>=70?'GO':'READY';
  $('weekGrid').innerHTML=last7.map(d=>`<div class="day-cell ${data.workouts.some(w=>w.date===d)?'done':''}"><span>${shortDay(d)}</span><div class="day-dot"></div></div>`).join('');$('streakText').textContent=streak()?`${streak()} day streak`:`${active}/${data.profile.weeklyGymTarget||m.weeklySessions} target days`;
  const recent=data.workouts.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);$('recentWorkouts').innerHTML=recent.length?recent.map(w=>`<div class="list-item"><div><div class="list-title">${esc(w.sessionName||w.type+' workout')}</div><div class="list-sub">${fmtDate(w.date)} · ${w.exercises?.length||0} exercises</div></div><div class="list-value">${w.duration} min</div></div>`).join(''):'<div class="empty">No workouts logged yet.</div>';
  const lvl=fitnessLevel();$('levelBadge').textContent='Lv '+lvl.level;$('levelName').textContent=lvl.name;$('levelScore').textContent=lvl.score+' / 100';$('levelFill').style.width=lvl.score+'%';$('levelNext').textContent=lvl.next;$('progressLevel').textContent='Lv '+lvl.level;$('progressLevelText').textContent=`${lvl.name} · ${lvl.score}/100`;
}

function defaultExerciseRow(){return {name:'Push-ups',sets:3,reps:10,weight:0,rest:60}}
function exerciseRowHTML(x){return `<div class="exercise-row" data-row-id="${x.id||uid()}"><div class="exercise-main"><select class="ex-name">${EXERCISES.map(([name,cat])=>`<option value="${esc(name)}" ${name===x.name?'selected':''}>${esc(name)} · ${esc(cat)}</option>`).join('')}</select><input class="ex-sets" type="number" min="1" max="20" value="${x.sets||3}" aria-label="sets"><button type="button" class="delete-btn remove-exercise">×</button></div><div class="set-grid"><label class="set-chip"><span>Reps</span><input class="ex-reps" type="number" min="1" max="100" value="${x.reps||10}"></label><label class="set-chip"><span>Weight</span><input class="ex-weight" type="number" min="0" max="1000" step="0.5" value="${x.weight||0}"></label><label class="set-chip"><span>Rest sec</span><input class="ex-rest" type="number" min="0" max="600" value="${x.rest||60}"></label></div></div>`}
function addExerciseRow(x=defaultExerciseRow()){$('exerciseRows').insertAdjacentHTML('beforeend',exerciseRowHTML(x));$('exerciseRows').lastElementChild.querySelector('.remove-exercise').onclick=e=>e.currentTarget.closest('.exercise-row').remove()}
function readExerciseRows(){return [...document.querySelectorAll('#exerciseRows .exercise-row')].map(row=>({name:row.querySelector('.ex-name').value,sets:num(row.querySelector('.ex-sets').value),reps:num(row.querySelector('.ex-reps').value),weight:num(row.querySelector('.ex-weight').value),rest:num(row.querySelector('.ex-rest').value)})).filter(x=>x.name)}

function renderWorkouts(){
  const rows=data.workouts.filter(w=>activeWorkoutFilter==='all'||w.type===activeWorkoutFilter).sort((a,b)=>b.date.localeCompare(a.date));const wk=weekWorkouts();const target=Math.max(1,data.profile.weeklyGymTarget||currentMode().weeklySessions);
  $('workoutWeekCount').textContent=wk.length;$('workoutWeekTime').textContent=formatDuration(wk.reduce((a,w)=>a+w.duration,0));$('workoutStreak').textContent=streak();$('workoutGoalProgress').textContent=clamp(Math.round(wk.length/target*100),0,100)+'%';
  $('workoutList').innerHTML=rows.length?rows.map(w=>`<article class="record"><div class="record-top"><div><h3>${esc(w.sessionName||w.type+' workout')}</h3><p>${fmtDate(w.date)} · ${esc(w.location||w.type)}</p></div><button class="delete-btn" onclick="removeItem('workouts','${w.id}')">×</button></div><div class="record-meta"><span class="meta">${esc(w.type)}</span><span class="meta">${w.duration} min</span>${w.intensity?`<span class="meta">RPE ${w.intensity}/10</span>`:''}<span class="meta">${w.exercises?.length||0} exercises</span></div>${(w.exercises||[]).map(e=>`<div class="list-item"><div><div class="list-title">${esc(e.name)}</div><div class="list-sub">${e.sets} sets · ${e.reps} reps · ${e.weight||0} kg</div></div><div class="list-value">${e.sets*e.reps} reps</div></div>`).join('')}${w.notes?`<div class="record-note">${esc(w.notes)}</div>`:''}</article>`).join(''):'<div class="card empty" style="grid-column:1/-1">No workouts in this filter yet.</div>';
}

function renderNutrition(){
  const meals=data.meals.filter(m=>m.date===today()), targets=recommendTargets();const cal=meals.reduce((a,m)=>a+num(m.calories),0),protein=meals.reduce((a,m)=>a+num(m.protein),0),water=meals.reduce((a,m)=>a+num(m.water),0);
  $('dayCalories').textContent=cal;$('dayProtein').textContent=protein+'g';$('dayWater').textContent=water;$('dayMeals').textContent=meals.length;$('calorieTargetText').textContent=targets.calories+' target';$('proteinTargetText').textContent=targets.protein+'g target';$('waterTargetText').textContent=targets.water+' glasses target';
  $('calorieFill').style.width=clamp(cal/targets.calories*100,0,100)+'%';$('proteinFill').style.width=clamp(protein/targets.protein*100,0,100)+'%';$('waterFill').style.width=clamp(water/targets.water*100,0,100)+'%';
  $('mealList').innerHTML=data.meals.length?data.meals.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<article class="record"><div class="record-top"><div><h3>${esc(m.type)}</h3><p>${fmtDate(m.date)}</p></div><button class="delete-btn" onclick="removeItem('meals','${m.id}')">×</button></div><div class="record-meta"><span class="meta">${m.calories||0} kcal</span><span class="meta">${m.protein||0}g protein</span><span class="meta">${m.water||0} water</span></div><div class="record-note">${esc(m.food||'No food description added.')}</div></article>`).join(''):'<div class="card empty" style="grid-column:1/-1">No meals logged yet.</div>';
}

function renderProgress(){
  const h=weightHistory(), latest=h.at(-1), first=h[0], wt=weightTrend(), range=$('progressRange').value;let points=h.slice();if(range!=='all'){const cutoff=daysAgo(Number(range));points=points.filter(x=>x.date>=cutoff)}
  $('startWeight').textContent=first?first.weight+' kg':'—';$('goalWeightView').textContent=data.profile.goalWeight?data.profile.goalWeight+' kg':'—';$('journeyDelta').textContent=wt?`${wt.diff>0?'+':''}${wt.diff.toFixed(1)} kg`:'';const journeyTarget=data.profile.goalWeight&&first?Math.abs(first.weight-data.profile.goalWeight):0;const journeyDone=wt&&journeyTarget?Math.abs(wt.diff):0;$('journeyFill').style.width=journeyTarget?clamp(journeyDone/journeyTarget*100,0,100)+'%':'0%';$('progressSummary').textContent=latest?`${latest.weight} kg · ${wt&&wt.diff!==0?(wt.diff>0?'+':'')+wt.diff.toFixed(1)+' kg total':''}`:'No weigh-ins yet';
  drawChart(points);const rs=recoveryScore();$('recoveryScore').textContent=rs;$('recoveryText').textContent=rs>=75?'Good base for training today.':rs>=50?'Okay — improve sleep or daily movement.':'Recovery data is light; log sleep and steps.';
  const lvl=fitnessLevel();$('progressLevel').textContent='Lv '+lvl.level;$('progressLevelText').textContent=`${lvl.name} · ${lvl.score}/100`;
  $('strengthList').innerHTML=data.strength.length?data.strength.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(s=>`<div class="list-item"><div><div class="list-title">${esc(s.exercise)}</div><div class="list-sub">${fmtDate(s.date)}</div></div><div class="list-value">${esc(s.result)}</div></div>`).join(''):'<div class="empty">No personal bests logged.</div>';
  const comeback=[['Push-ups',['Push-ups','Knee Push-ups'],'5 reps baseline'],['L-sit',['L-sit','Tuck L-sit'],'60 sec college best'],['Pull-ups',['Pull-ups','Assisted Pull-ups'],'10 reps benchmark']];
  $('comebackList').innerHTML=comeback.map(([label,names,bench])=>{const best=bestExercise(names);return `<div class="list-item"><div><div class="list-title">${label}</div><div class="list-sub">${bench}</div></div><div class="list-value">${best?esc(best.result):'Log best'}</div></div>`}).join('');
  const measures=data.measurements.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);$('measurementList').innerHTML=measures.length?measures.map(m=>`<div class="list-item"><div><div class="list-title">${fmtDate(m.date)}</div><div class="list-sub">Waist ${m.waist||'—'} · Chest ${m.chest||'—'} · Arms ${m.arms||'—'} · Thighs ${m.thighs||'—'}</div></div><button class="delete-btn" onclick="removeItem('measurements','${m.id}')">×</button></div>`).join(''):'<div class="empty">No measurements yet.</div>';
  const sleeps=data.sleep.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4),steps=data.steps.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);$('recoveryList').innerHTML=[...sleeps.map(s=>`<div class="list-item"><div><div class="list-title">🌙 ${fmtDate(s.date)}</div><div class="list-sub">Sleep · ${s.quality||'—'}</div></div><div class="list-value">${Number(s.value).toFixed(1)}h</div></div>`),...steps.map(s=>`<div class="list-item"><div><div class="list-title">👟 ${fmtDate(s.date)}</div><div class="list-sub">Steps</div></div><div class="list-value">${num(s.value).toLocaleString()}</div></div>`)].join('')||'<div class="empty">No recovery data yet.</div>';
}
function drawChart(points){const c=$('weightChart'),ctx=c.getContext('2d'),rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=Math.max(300,rect.width)*dpr;c.height=280*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,280);if(points.length<2){ctx.fillStyle='#9aa3b1';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('Add at least 2 weigh-ins to see your trend.',rect.width/2,140);return}const min=Math.min(...points.map(p=>p.weight))-2,max=Math.max(...points.map(p=>p.weight))+2,pad=35,w=rect.width-pad*2,h=210;ctx.strokeStyle='#edf0f5';for(let i=0;i<5;i++){const y=22+i*44;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(rect.width-pad,y);ctx.stroke()}ctx.strokeStyle='#5b7cfa';ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>{const x=pad+i/(points.length-1)*w,y=22+(max-p.weight)/(max-min)*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillStyle='#8b5cf6';points.forEach((p,i)=>{const x=pad+i/(points.length-1)*w,y=22+(max-p.weight)/(max-min)*h;ctx.beginPath();ctx.arc(x,y,4.5,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#6b7280';ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText(points[0].weight+' kg',pad,270);ctx.fillText(points.at(-1).weight+' kg',rect.width-pad,270)}

function renderGoals(){
  const m=currentMode();$('goalModeTitle').textContent=m.goal;$('goalModeText').textContent=m.description;
  $('goalList').innerHTML=data.goals.length?data.goals.slice().sort((a,b)=>Number(a.done)-Number(b.done)).map(g=>{const p=clamp(g.target?((g.current||0)/g.target)*100:(g.done?100:0),0,100);return `<article class="goal-card ${g.done?'complete':''}"><div class="goal-top"><div><div class="goal-title">${g.done?'✅ ':''}${esc(g.title)}</div><div class="goal-meta">${esc(g.category||'Goal')} ${g.deadline?'· due '+fmtDate(g.deadline):''}</div></div><button class="delete-btn" onclick="removeItem('goals','${g.id}')">×</button></div><div class="goal-progress"><i style="width:${p}%"></i></div><div class="goal-foot"><span>${g.current??0}${g.unit?' '+esc(g.unit):''} / ${g.target??0}${g.unit?' '+esc(g.unit):''}</span><button class="text-btn" onclick="toggleGoal('${g.id}')">${g.done?'Reopen':'Complete'}</button></div></article>`}).join(''):'<div class="card empty" style="grid-column:1/-1">No goals yet. Add your first milestone.</div>';
}
function renderSettings(){
  const modes=Object.entries(MODE_CONFIG);$('modeOptions').innerHTML=modes.map(([key,m])=>`<button class="mode-option ${data.mode===key?'active':''}" data-mode="${key}"><div class="mode-icon">${m.icon}</div><strong>${m.label}</strong><small>${m.description}</small></button>`).join('');document.querySelectorAll('.mode-option').forEach(b=>b.onclick=()=>{data.mode=b.dataset.mode;save();});
  const p=data.profile;$('profileName').value=p.name||'';$('profileHeight').value=p.height||'';$('profileWeight').value=p.weight||'';$('profileGoalWeight').value=p.goalWeight||'';$('profileCalories').value=p.calorieTarget||'';$('profileProtein').value=p.proteinTarget||'';$('profileWater').value=p.waterTarget||8;$('profileSteps').value=p.stepTarget||8000;$('profileGymTarget').value=p.weeklyGymTarget||currentMode().weeklySessions;
}
function renderAll(){renderDashboard();renderWorkouts();renderNutrition();renderProgress();renderGoals();renderSettings()}

function removeItem(collection,id){data[collection]=data[collection].filter(x=>x.id!==id);save()}
function toggleGoal(id){const g=data.goals.find(x=>x.id===id);if(g){g.done=!g.done;save()}}
window.removeItem=removeItem;window.toggleGoal=toggleGoal;

// Navigation and actions
$('todayLabel').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showSection(b.dataset.section));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showSection(b.dataset.go));
$('quickWorkoutBtn').onclick=()=>openDialog('workoutModal');$('heroWorkoutBtn').onclick=()=>openDialog('workoutModal');$('addWorkoutBtn').onclick=()=>openDialog('workoutModal');$('addMealBtn').onclick=()=>openDialog('mealModal');$('addProgressBtn').onclick=()=>openDialog('progressModal');$('addStrengthBtn').onclick=()=>openDialog('strengthModal');$('logSleepBtn').onclick=()=>openDialog('sleepModal');$('logStepsBtn').onclick=()=>openDialog('stepsModal');$('addMeasurementBtn').onclick=()=>openDialog('measurementModal');$('addGoalBtn').onclick=()=>openDialog('goalModal');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('workoutFilters').querySelectorAll('.filter').forEach(b=>b.onclick=()=>{activeWorkoutFilter=b.dataset.filter;$('workoutFilters').querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderWorkouts()});
$('progressRange').onchange=renderProgress;window.addEventListener('resize',()=>{if($('progress').classList.contains('active'))renderProgress()});

// Exercise builder
$('addExerciseRowBtn').onclick=()=>addExerciseRow();

// Forms
$('workoutForm').onsubmit=e=>{e.preventDefault();const ex=readExerciseRows();if(!ex.length){alert('Add at least one exercise.');return}data.workouts.unshift({id:uid(),date:$('workoutDate').value,type:$('workoutType').value,duration:num($('workoutDuration').value),intensity:num($('workoutIntensity').value),location:$('workoutLocation').value.trim(),sessionName:ex[0].name+' session',exercises:ex,notes:$('workoutNotes').value.trim()});e.target.closest('dialog').close();e.target.reset();$('exerciseRows').innerHTML='';addExerciseRow();save()};
$('mealForm').onsubmit=e=>{e.preventDefault();data.meals.unshift({id:uid(),date:$('mealDate').value,type:$('mealType').value,calories:num($('mealCalories').value),protein:num($('mealProtein').value),water:num($('mealWater').value),food:$('mealFood').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('progressForm').onsubmit=e=>{e.preventDefault();const weight=num($('progressWeight').value);data.weighins.push({id:uid(),date:$('progressDate').value,weight,note:$('progressNote').value.trim()});data.weighins.sort((a,b)=>a.date.localeCompare(b.date));data.profile.weight=weight;e.target.closest('dialog').close();e.target.reset();save()};
$('strengthForm').onsubmit=e=>{e.preventDefault();data.strength.push({id:uid(),exercise:$('strengthExercise').value.trim(),result:$('strengthResult').value.trim(),date:$('strengthDate').value});e.target.closest('dialog').close();e.target.reset();save()};
$('sleepForm').onsubmit=e=>{e.preventDefault();data.sleep.push({id:uid(),date:$('sleepDate').value,value:num($('sleepHours').value),quality:$('sleepQuality').value,note:$('sleepNote').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('stepsForm').onsubmit=e=>{e.preventDefault();data.steps.push({id:uid(),date:$('stepsDate').value,value:num($('stepsValue').value),note:$('stepsNote').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('measurementForm').onsubmit=e=>{e.preventDefault();data.measurements.push({id:uid(),date:$('measurementDate').value,waist:num($('measurementWaist').value),chest:num($('measurementChest').value),arms:num($('measurementArms').value),thighs:num($('measurementThighs').value),note:$('measurementNote').value.trim()});e.target.closest('dialog').close();e.target.reset();save()};
$('goalForm').onsubmit=e=>{e.preventDefault();data.goals.push({id:uid(),title:$('goalTitleInput').value.trim(),category:$('goalCategory').value,current:num($('goalCurrent').value),target:num($('goalTarget').value),unit:$('goalUnit').value.trim(),deadline:$('goalDeadline').value,done:false});e.target.closest('dialog').close();e.target.reset();save()};
$('profileForm').onsubmit=e=>{e.preventDefault();data.profile={...data.profile,name:$('profileName').value.trim(),height:num($('profileHeight').value)||null,weight:num($('profileWeight').value)||null,goalWeight:num($('profileGoalWeight').value)||null,calorieTarget:num($('profileCalories').value)||null,proteinTarget:num($('profileProtein').value)||null,waterTarget:num($('profileWater').value)||8,stepTarget:num($('profileSteps').value)||8000,weeklyGymTarget:num($('profileGymTarget').value)||currentMode().weeklySessions};save()};

$('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`FORM-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href)};
$('importInput').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=normalize(JSON.parse(reader.result));if(!confirm('Replace current FORM data with this backup?'))return;data=imported;save();alert('Backup imported.')}catch{alert('That file is not a valid FORM backup.')}};reader.readAsText(file)};
$('resetDataBtn').onclick=()=>{if(!confirm('Reset all FORM data? This cannot be undone. Export a backup first if you need it.'))return;localStorage.removeItem(APP_KEY);data=normalize({});renderAll()};

// Set initial modal contents
$('exerciseRows').innerHTML='';addExerciseRow();

renderAll();
