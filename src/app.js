import {newGame,exits,beginDoor,answer,enter,ascend,useTorch,pointsFor,validSave,TIERS,pathTo} from './engine.js';
import {CATEGORIES,QUESTIONS,sourceURL} from './questions.js';
import {inhabitantFor} from './inhabitants.js';
import {drawRoom,drawMap,drawPortrait} from './renderer.js';
import {article,searchArticles} from './wiki.js';
import {CastleSound} from './audio.js';
const $=id=>document.getElementById(id);
const SAVE_KEY='remindmaze.lanternlight.v1';
const sound=new CastleSound();
const categories=CATEGORIES.map(c=>c.id);
let state,hasJourney=false,saveAvailable=true,dialogueIndex=0,route=[],routeUntil=0,readerAbort,toastTimeout;
try{
  const saved=JSON.parse(localStorage.getItem(SAVE_KEY));
  if(saved && validSave(saved,QUESTIONS,categories)){state=saved;hasJourney=true;}
  else if(saved) setTimeout(()=>toast('This saved journey could not be read. Start a new journey or import a backup.'),250);
}catch{saveAvailable=false;}
state ||= newGame({},482613);
function save(){
  if(!hasJourney)return;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));saveAvailable=true;$('save-status').textContent='Journey saved on this device. Export a backup in your journal.';}
  catch{saveAvailable=false;$('save-status').textContent='Browser saving is unavailable. Export your journey from the journal.';}
}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),4200);}
function openDialog(id){if(!$(id).open)$(id).showModal();}
function closeDialog(id){if($(id).open)$(id).close();}
function button(text,cls,fn){const b=document.createElement('button');b.className=cls;b.textContent=text;b.addEventListener('click',fn);return b;}
function text(tag,content,cls=''){const e=document.createElement(tag);e.textContent=content;e.className=cls;return e;}
function link(label,url){const a=document.createElement('a');a.textContent=label;a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
const roman=n=>n<=10?['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n]:String(n);
function render(){
  const p=inhabitantFor(state),room=`${String.fromCharCode(65+state.pos%10)}${Math.floor(state.pos/10)+1}`;
  $('journey-label').textContent=hasJourney?`${state.name}’s journey · ${TIERS[state.difficulty-1]} · ${state.mode==='study'?'Study pace':'Classic pace'}`:'A castle of questions. A world to discover.';
  $('floor-heading').textContent=`FLOOR ${roman(state.floor)} · ${state.won?'THE AWAKENED CASTLE':'THE FORGOTTEN HALLS'}`;
  $('room-title').textContent=p.room;
  $('room-coordinates').textContent=`ROOM ${room} · FACING NORTH`;
  $('room').setAttribute('aria-label',`${p.room}, facing north. Available doors: ${exits(state).map(d=>d.label+(d.open?' open':' locked')).join(', ')}. ${p.name}, ${p.role}, is here.`);
  $('scene-label').textContent=state.pos===state.exit?'THE STAIRWAY TO THE NEXT CHAPTER':state.won?'THE CASTLE REMEMBERS':'THE CURSE OF FORGETTING';
  $('person-name').textContent=p.name.toUpperCase();$('person-role').textContent=p.role.toUpperCase();$('dialogue-text').textContent=p.lines[dialogueIndex%p.lines.length];
  $('person-hotspot-label').textContent=`Speak to ${p.name}`;$('person-button').setAttribute('aria-label',`Speak to ${p.name}, ${p.role}`);$('portrait-button').setAttribute('aria-label',`Speak to ${p.name}, ${p.role}`);
  $('door-hotspots').replaceChildren();$('direction-buttons').replaceChildren();
  const symbols={n:'↑',e:'→',s:'↓',w:'←'};
  for(const d of exits(state)){
    const b=button('',`hotspot door-${d.id}`,()=>move(d.to));
    b.append(text('span',`${symbols[d.id]} ${d.label}${d.open?' · open':''}`));b.setAttribute('aria-label',`${d.open?'Walk':'Unlock'} ${d.label.toLowerCase()} door`);b.disabled=state.won;
    $('door-hotspots').append(b);
  }
  for(const id of ['w','n','s','e']){
    const d=exits(state).find(e=>e.id===id);if(!d)continue;
    const b=button(`${symbols[id]} ${d.label}`,`direction-button${d.open?' open':''}`,()=>move(d.to));b.title=d.open?'This door is open':'Answer a question to unlock';b.disabled=state.won;$('direction-buttons').append(b);
  }
  $('stairs-button').hidden=state.pos!==state.exit||state.won;
  $('stairs-button').textContent=state.score>=state.goal?'Enter the throne room ↗':'Ascend the stairs ↗';
  $('scene-hint').textContent=state.won?'The castle remembers. Your discoveries are safe in the journal.':state.pos===state.exit?'The stairway is here. Continue exploring, or climb to the next chapter.':'Choose a doorway. Every answer opens a little more of the world.';
  $('map-floor').textContent=String(state.floor).padStart(2,'0');
  $('map').setAttribute('aria-label',`Floor ${state.floor} map. You are in room ${room}. Stairs are at ${String.fromCharCode(65+state.exit%10)}${Math.floor(state.exit/10)+1}. ${state.visited.length} of 100 rooms explored.`);
  $('score').textContent=state.score.toLocaleString();$('score-goal').textContent=`/ ${state.goal.toLocaleString()}`;
  $('score-fill').style.width=`${Math.min(100,state.score/state.goal*100)}%`;
  $('score-progress').setAttribute('aria-valuemax',state.goal);$('score-progress').setAttribute('aria-valuenow',Math.min(state.goal,state.score));
  $('rooms-count').textContent=state.visited.length;$('answers-count').textContent=state.solved;
  $('quest-text').textContent=state.won?'The curse is lifted. The world is yours to discover.':state.score>=state.goal?'The spell is weakening. Find the stairs to finish your journey.':'Gather knowledge. Find the stairs. Break the spell.';
  $('torch-count').textContent=`${state.torches} / 5`;$('torch-button').disabled=state.torches===0||Date.now()<routeUntil||state.won;
  if(!route.length)$('map-note').textContent=state.torches?'Five lights for the whole journey.':'Your lights are spent. Trust your map.';
  drawRoom($('room'),state,Date.now()/600);drawMap($('map'),state,route);drawPortrait($('portrait'),p);
  if(!saveAvailable)$('save-status').textContent='Browser saving is unavailable. Export your journey from the journal.';
}
function refreshRoute(){if(Date.now()<routeUntil)route=pathTo(state.maze,state.pos,state.exit);else{route=[];routeUntil=0;}}
function move(to){
  if(!hasJourney){openWelcome();return;}
  if(state.pending){showQuestion();return;}
  const result=beginDoor(state,to,QUESTIONS);save();
  if(result==='moved'){dialogueIndex=0;refreshRoute();sound.door();render();}
  else if(result==='question')showQuestion();
}
function moveDirection(id){const d=exits(state).find(d=>d.id===id);if(d)move(d.to);}
function showQuestion(){renderQuestion();openDialog('question-dialog');}
function renderQuestion(){
  const p=state.pending;if(!p)return;
  const q=QUESTIONS.find(q=>q.id===p.id),cat=CATEGORIES.find(c=>c.id===q.category);
  const dir=exits(state).find(d=>d.to===p.to);
  $('question-category').textContent=`${cat.symbol} ${cat.name.toUpperCase()}`;$('question-tier').textContent=`${roman(q.level)} · ${TIERS[q.level-1]}`;
  $('question-context').textContent=`A question guards the ${dir.label.toLowerCase()} door.`;$('question-title').textContent=q.prompt;
  $('answers').replaceChildren();p.options.forEach((choice,i)=>{
    const cls=p.status!=='asking'&&choice===q.answer?' correct':p.wrong.includes(choice)?' wrong':'';
    const b=button('',`answer-button${cls}`,()=>chooseAnswer(choice));b.append(text('kbd',i+1),text('span',choice));
    b.disabled=p.status!=='asking'||p.wrong.includes(choice);if(cls===' correct')b.setAttribute('aria-label',`${choice}, correct answer`);$('answers').append(b);
  });
  const feedback=$('answer-feedback');feedback.className=`answer-feedback${p.wrong.length&&p.status!=='correct'?' error':''}`;
  feedback.textContent=p.status==='correct'?`The door remembers. +${p.payout} points. ${q.explanation}`:p.status==='failed'?`The answer is ${q.answer}. ${q.explanation}`:p.wrong.length?'Not quite. One more attempt—or take a look in the reading room.':'';
  $('question-next').hidden=p.status==='asking';$('question-next').textContent=p.status==='correct'?'Open the door →':'Try a new question →';
  $('question-foot').textContent=p.researched?'Research helps the castle remember. Base points still count; the speed bonus is waived.':'Two attempts. No loss of accumulated points. Keys 1–4 choose an answer.';
  updateMeter();
}
function updateMeter(){
  const p=state.pending;if(!p)return;const q=QUESTIONS.find(q=>q.id===p.id);
  $('points-available').textContent=p.status==='correct'?`${p.payout} points earned`:p.status==='failed'?'A little wiser already':`${pointsFor(state,q)} points available`;
  const bonus=state.mode==='classic'&&!p.researched;
  $('bonus-fill').style.width=`${bonus?Math.max(0,100-p.elapsed/500):100}%`;
  $('timer-label').textContent=bonus?`${Math.max(0,50-Math.floor(p.elapsed/1000))}s bonus`:(p.researched?'Research pace':'No timer');
}
function chooseAnswer(choice){
  const result=answer(state,choice,QUESTIONS);if(!result)return;
  result==='correct'?sound.correct():sound.wrong();save();renderQuestion();render();
  if(result!=='asking')$('question-next').focus();
}
function leaveQuestion(){state.pending=null;save();closeDialog('question-dialog');render();}
$('leave-question').onclick=leaveQuestion;
$('question-dialog').addEventListener('cancel',event=>{event.preventDefault();leaveQuestion();});
$('question-next').onclick=()=>{
  const p=state.pending;if(!p)return;
  if(p.status==='correct'){enter(state,p.to);dialogueIndex=0;refreshRoute();sound.door();closeDialog('question-dialog');save();render();}
  else if(p.status==='failed'){const to=p.to;state.pending=null;beginDoor(state,to,QUESTIONS);save();renderQuestion();$('answers').querySelector('button').focus();}
};
function talk(){dialogueIndex++;$('dialogue-text').textContent=inhabitantFor(state).lines[dialogueIndex%3];}
for(const id of ['talk-button','person-button','portrait-button'])$(id).onclick=talk;
$('torch-button').onclick=()=>{
  if(Date.now()<routeUntil||!hasJourney)return;
  route=useTorch(state);if(!route.length)return;routeUntil=Date.now()+12000;sound.note(440,0,1,.025);save();render();
  const next=route[1],d=exits(state).find(d=>d.to===next);toast(d?`The torch points ${d.label.toLowerCase()}. Follow the gold trail on your map.`:'The stairs are in this room.');
};
$('stairs-button').onclick=()=>{
  const result=ascend(state);if(!result)return;dialogueIndex=0;route=[];routeUntil=0;save();render();
  if(result==='won'){sound.win();showWin();}else{sound.door();toast(`Floor ${state.floor}. New halls, new possibilities.`);}
};
function showWin(){
  $('win-stats').textContent=`${state.name} · ${state.score.toLocaleString()} points · ${state.solved} doors unlocked · ${state.floor} ${state.floor===1?'floor':'floors'}`;openDialog('win-dialog');
}
function openWelcome(){
  $('continue-button').hidden=!hasJourney;$('close-welcome').hidden=!hasJourney;$('start-button').firstChild.textContent=hasJourney?'Begin a new journey ':'Enter the castle ';
  if(hasJourney){$('traveler-name').value=state.name;$('start-form').elements.difficulty.value=state.difficulty;$('start-form').elements.goal.value=state.goal;$('start-form').elements.mode.value=state.mode;for(const input of document.querySelectorAll('input[name="category"]'))input.checked=!state.categories.length||state.categories.includes(input.value);}
  openDialog('welcome-dialog');
}
for(const c of CATEGORIES){
  const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.name='category';input.value=c.id;input.checked=true;label.append(input,text('span',c.symbol),document.createTextNode(c.name));$('category-options').append(label);
}
$('select-all').onclick=()=>{for(const i of document.querySelectorAll('input[name="category"]'))i.checked=true;};
$('start-form').onsubmit=event=>{
  event.preventDefault();const form=new FormData(event.currentTarget),selected=form.getAll('category');
  if(!selected.length){toast('Choose at least one subject for your journey.');document.querySelector('input[name="category"]').focus();return;}
  if(hasJourney&&!state.won&&!confirm('Begin a new journey? This replaces the saved journey on this device. You can export a backup in the journal first.'))return;
  state=newGame({name:form.get('name'),difficulty:Number(form.get('difficulty')),goal:Number(form.get('goal')),mode:form.get('mode'),categories:selected});
  hasJourney=true;dialogueIndex=0;route=[];routeUntil=0;save();closeDialog('welcome-dialog');render();sound.door();
};
function resume(){closeDialog('welcome-dialog');if(state.pending)showQuestion();else if(state.won)showWin();}
$('continue-button').onclick=resume;$('close-welcome').onclick=resume;
$('welcome-dialog').addEventListener('cancel',e=>{e.preventDefault();if(hasJourney)resume();});
$('menu-button').onclick=openWelcome;
$('new-journey').onclick=()=>{closeDialog('win-dialog');openWelcome();};
$('help-button').onclick=()=>openDialog('help-dialog');
for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>closeDialog(b.dataset.close);
$('reader-dialog').addEventListener('close',()=>readerAbort?.abort());
function prepareReader(){
  readerAbort?.abort();readerAbort=new AbortController();
  if(state.pending?.status==='asking'){state.pending.researched=true;save();renderQuestion();}
  $('reader-links').replaceChildren();openDialog('reader-dialog');return readerAbort.signal;
}
function sourceLinks(title,revision){
  $('reader-links').replaceChildren(link('Read the full article ↗',sourceURL(title)),link('Contributors & history ↗',`https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&action=history`));
  if(revision)$('reader-links').append(link('This revision ↗',`https://en.wikipedia.org/w/index.php?oldid=${revision}`));
}
async function readArticle(title){
  const signal=prepareReader();$('reader-title').textContent=title;$('article-search').value=title;$('reader-content').replaceChildren(text('p','Opening the encyclopedia…','reader-status'));sourceLinks(title);
  try{
    const page=await article(title,signal);if(signal.aborted)return;
    $('reader-title').textContent=page.title;$('reader-content').replaceChildren(text('p','FROM WIKIPEDIA · INTRODUCTORY EXTRACT','reader-status'),text('p',page.text));sourceLinks(page.title,page.revision);
  }catch{
    if(signal.aborted)return;
    const notes=QUESTIONS.filter(q=>q.source===title).map(q=>q.explanation);
    $('reader-content').replaceChildren(text('p','Wikipedia could not be reached. You can keep playing. The full article link is below.','reader-status'));
    if(notes.length)$('reader-content').append(text('h3','Notes from the castle’s collection'),text('p',notes.join('\n\n')));
    else $('reader-content').append(text('p','Try again when you are connected, or choose a subject from the castle collection.'));
  }
}
function openLibrary(){
  prepareReader();$('reader-title').textContent='Follow your curiosity.';$('article-search').value='';
  $('reader-content').replaceChildren(text('p','A question is only the beginning. Search Wikipedia, or open a book from the castle’s collection.','reader-status'));
  const list=document.createElement('div');list.className='reader-results';
  for(const c of CATEGORIES){const q=QUESTIONS.find(q=>q.category===c.id);list.append(button(`${c.symbol} ${q.source}`,'',()=>readArticle(q.source)));}$('reader-content').append(list);
}
$('search-form').onsubmit=async e=>{
  e.preventDefault();const query=$('article-search').value.trim();if(!query)return;
  const signal=prepareReader();$('reader-title').textContent='Searching the shelves…';$('reader-content').replaceChildren(text('p','Searching Wikipedia…','reader-status'));
  try{
    const results=await searchArticles(query,signal);if(signal.aborted)return;
    $('reader-title').textContent='Where shall we wander?';const list=document.createElement('div');list.className='reader-results';results.forEach(title=>list.append(button(title,'',()=>readArticle(title))));
    $('reader-content').replaceChildren(text('p',results.length?'Choose an article to read.':'No matches found. Try another name or spelling.','reader-status'),list);
  }catch{if(!signal.aborted){$('reader-title').textContent='The shelves are out of reach.';$('reader-content').replaceChildren(text('p','Wikipedia search is unavailable right now. The castle’s questions still work.','reader-status'));$('reader-links').replaceChildren(link('Search on Wikipedia ↗',`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`));}}
};
$('research-question').onclick=()=>{if(state.pending)readArticle(QUESTIONS.find(q=>q.id===state.pending.id).source);};
$('painting-button').onclick=()=>readArticle(inhabitantFor(state).source);$('library-button').onclick=openLibrary;
function openJournal(){
  $('journal-summary').textContent=`${state.solved} doors unlocked · ${state.attempts} answers given · ${state.score.toLocaleString()} points. Your most recent 200 discoveries are kept here.`;
  $('journal-entries').replaceChildren();
  if(!state.journal.length)$('journal-entries').append(text('p','An empty page, a waiting castle. Your discoveries will appear here.'));
  for(const j of state.journal){
    const q=QUESTIONS.find(q=>q.id===j.id),entry=document.createElement('article');entry.className='journal-entry';
    entry.append(text('p',`${j.correct?'DOOR UNLOCKED':'SOMETHING LEARNED'} · FLOOR ${j.floor} · ${j.points} POINTS`),text('h3',q.prompt),text('p',`${q.answer}. ${q.explanation}`),button(`Read: ${q.source} ↗`,'text-button',()=>readArticle(q.source)));$('journal-entries').append(entry);
  }
  $('export-save').disabled=!hasJourney;openDialog('journal-dialog');
}
$('journal-button').onclick=openJournal;$('win-journal').onclick=()=>{closeDialog('win-dialog');openJournal();};
$('export-save').onclick=()=>{
  if(!hasJourney)return;const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='reMindMaze-journey.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('import-save').onchange=async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    if(file.size>1000000)throw new Error('This file is too large to be a journey.');
    const imported=JSON.parse(await file.text());if(!validSave(imported,QUESTIONS,categories))throw new Error('This is not a compatible reMindMaze journey.');
    if(hasJourney&&!confirm('Replace the current journey with this saved journey?'))return;
    state=imported;hasJourney=true;route=[];routeUntil=0;dialogueIndex=0;save();closeDialog('journal-dialog');render();if(state.pending)showQuestion();else if(state.won)showWin();toast('Your journey has been restored.');
  }catch(err){$('import-status').textContent=err instanceof SyntaxError?'That file could not be read as a journey.':err.message;}
  finally{e.target.value='';}
};
$('sound-button').onclick=async()=>{
  try{const on=await sound.toggle();$('sound-state').textContent=on?'on':'off';$('sound-button').setAttribute('aria-label',`Turn sound ${on?'off':'on'}`);$('sound-button').title=`Turn sound ${on?'off':'on'}`;}
  catch{toast('Audio is unavailable in this browser.');}
};
document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
  const opened=[...document.querySelectorAll('dialog[open]')];
  if(opened.length){
    if($('question-dialog').open&&!$('reader-dialog').open&&/^[1-4]$/.test(e.key)){e.preventDefault();$('answers').children[Number(e.key)-1]?.click();}return;
  }
  const dirs={ArrowUp:'n',ArrowRight:'e',ArrowDown:'s',ArrowLeft:'w',w:'n',d:'e',s:'s',a:'w'};
  if(dirs[e.key]){e.preventDefault();moveDirection(dirs[e.key]);}
  else if(e.key.toLowerCase()==='t')$('torch-button').click();else if(e.key.toLowerCase()==='j')openJournal();else if(e.key.toLowerCase()==='l')openLibrary();
});
let last=performance.now(),lastSaved=last;
setInterval(()=>{
  const now=performance.now(),delta=now-last;last=now;
  if(document.hidden)return;
  if(state.pending?.status==='asking'&&$('question-dialog').open&&!$('reader-dialog').open){state.pending.elapsed+=delta;updateMeter();}
  if(route.length){const left=Math.ceil((routeUntil-Date.now())/1000);if(left<=0){route=[];routeUntil=0;render();}else{$('map-note').textContent=`The path glows for ${left} more seconds.`;$('torch-button').disabled=true;}}
  if(now-lastSaved>5000){save();lastSaved=now;}
},250);
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden)save();});
window.addEventListener('pagehide',save);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{if(!document.hidden&&!document.querySelector('dialog[open]'))drawRoom($('room'),state,Date.now()/600);},500);
render();openWelcome();
if('serviceWorker' in navigator && ['http:','https:'].includes(location.protocol))navigator.serviceWorker.register('./sw.js').catch(()=>{});
