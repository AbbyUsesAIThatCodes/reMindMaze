import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {QUESTIONS,CATEGORIES} from '../src/questions.js';
import {newGame,validSave,edge,exits} from '../src/engine.js';
const out='test-results';await mkdir(out,{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error(`Server exited ${code}`)));});
let browser;
const checks=[],errors=[];
try{
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1080},serviceWorkers:'block'});
 const page=await context.newPage();page.on('pageerror',err=>errors.push(err.message));
 await page.goto('http://localhost:4173');
 await page.locator('#welcome-dialog').waitFor({state:'visible'});
 await page.screenshot({path:`${out}/welcome.png`,fullPage:true});
 await page.locator('#traveler-name').fill('Abbey');await page.locator('#start-form select[name="mode"]').selectOption('study');await page.locator('#start-button').click();
 assert.match(await page.locator('#journey-label').innerText(),/Abbey.*Study/);
 await page.screenshot({path:`${out}/castle.png`,fullPage:true});
 checks.push('Start a named journey; desktop castle renders');
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('remindmaze.lanternlight.v1')));
 async function openQuestion(){
  const current=await state(),queue=[[current.pos]],seen=new Set([current.pos]);let route;
  for(let i=0;i<queue.length;i++){
   const path=queue[i],room=path.at(-1);
   if(current.maze[room].some(n=>!current.unlocked.includes(edge(room,n)))){route=path;break;}
   for(const n of current.maze[room])if(current.unlocked.includes(edge(room,n))&&!seen.has(n)){seen.add(n);queue.push([...path,n]);}
  }
  assert.ok(route,'An unlocked route should lead to a new question');
  for(const to of route.slice(1)){
   const door=exits(await state()).find(d=>d.to===to);
   await page.getByRole('button',{name:`Walk ${door.label.toLowerCase()} door`,exact:true}).click();
  }
  await page.locator('#door-hotspots button[aria-label^="Unlock"]').first().click();
 }

 const start=await state();
 await page.locator('#direction-buttons button').first().click();
 const prompt=await page.locator('#question-title').innerText(),q=QUESTIONS.find(q=>q.prompt===prompt);assert.ok(q);
 await page.screenshot({path:`${out}/question.png`,fullPage:true});
 const wrong=q.choices.filter(c=>c!==q.answer);
 await page.getByRole('button',{name:wrong[0],exact:false}).click();
 assert.match(await page.locator('#answer-feedback').innerText(),/One more attempt/);
 await page.reload();await page.locator('#continue-button').click();
 assert.equal(await page.locator('#question-title').innerText(),prompt);assert.match(await page.locator('#answer-feedback').innerText(),/One more attempt/);
 checks.push('An unfinished question and wrong attempt survive reload');
 await page.getByRole('button',{name:q.answer,exact:false}).click();assert.match(await page.locator('#answer-feedback').innerText(),/The door remembers/);
 const earned=(await state()).score;assert.ok(earned>0);await page.locator('#question-next').click();const moved=await state();assert.notEqual(moved.pos,start.pos);
 const delta=start.pos-moved.pos,dir=delta===-10?'North':delta===10?'South':delta===1?'East':'West';
 await page.locator('#direction-buttons').getByRole('button',{name:new RegExp(dir)}).click();assert.equal((await state()).pos,start.pos);assert.equal((await state()).score,earned);assert.equal(await page.locator('#question-dialog').isVisible(),false);
 checks.push('Correct answer opens a door; backtracking is free');
 await openQuestion();
 const prompt2=await page.locator('#question-title').innerText(),current=QUESTIONS.find(q=>q.prompt===prompt2),misses=current.choices.filter(c=>c!==current.answer);
 await page.getByRole('button',{name:misses[0],exact:false}).click();await page.getByRole('button',{name:misses[1],exact:false}).click();
 assert.match(await page.locator('#answer-feedback').innerText(),/The answer is/);assert.equal((await state()).score,earned);await page.locator('#question-next').click();assert.notEqual(await page.locator('#question-title').innerText(),prompt2);await page.locator('#leave-question').click();
 checks.push('Two misses explain the answer and offer a fresh challenge');
 await page.locator('#torch-button').click();assert.equal(await page.locator('#torch-count').innerText(),'4 / 5');assert.ok((await state()).torches===4);assert.equal(await page.locator('#torch-button').isDisabled(),true);
 checks.push('Torch use decrements once and temporarily disables reuse');
 // Deterministic API fixture verifies safe rendering and source attribution.
 await page.route('https://en.wikipedia.org/w/api.php**',async route=>{
  const url=new URL(route.request().url());
  if(url.searchParams.has('list'))return route.fulfill({json:{query:{search:[{title:'Photosynthesis'}]}}});
  return route.fulfill({json:{query:{pages:[{title:'Photosynthesis',extract:'A fixture about light and plants. <img src=x onerror=alert(1)>',lastrevid:12345}]}}});
 });
 await page.locator('#library-button').click();await page.locator('#article-search').fill('plants');await page.locator('#search-form button').click();await page.getByRole('button',{name:'Photosynthesis',exact:true}).click();
 await page.getByText('FROM WIKIPEDIA · INTRODUCTORY EXTRACT').waitFor();
 assert.equal(await page.locator('#reader-content img').count(),0);assert.equal(await page.locator('#reader-links a').count(),3);
 await page.locator('[data-close="reader-dialog"]').click();
 checks.push('Wikipedia search and reader handle successful fixtures as plain text with attribution');
 await page.unroute('https://en.wikipedia.org/w/api.php**');await page.route('https://en.wikipedia.org/w/api.php**',route=>route.abort());
 await page.locator('#painting-button').click();await page.getByText('Notes from the castle’s collection').waitFor();await page.locator('[data-close="reader-dialog"]').click();
 checks.push('Wikipedia outage falls back to local notes');
 await page.locator('#journal-button').click();assert.ok(await page.locator('.journal-entry').count()>=2);
 const downloadPromise=page.waitForEvent('download');await page.locator('#export-save').click();const dl=await downloadPromise;await dl.saveAs(`${out}/journey.json`);const exported=JSON.parse(await readFile(`${out}/journey.json`,'utf8'));assert.ok(validSave(exported,QUESTIONS,CATEGORIES.map(c=>c.id)));await page.locator('[data-close="journal-dialog"]').click();
 checks.push('Journal includes discoveries; exported save validates');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:`${out}/mobile-castle.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await openQuestion();
 await page.screenshot({path:`${out}/mobile-question.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 checks.push('390px mobile room and question have no horizontal overflow');
 // Render the real ending from a valid near-finish test save.
 const winning=newGame({name:'Abbey',difficulty:4,goal:5000},98);winning.pos=winning.exit;winning.visited.push(winning.exit);winning.score=5000;
 await page.addInitScript(s=>localStorage.setItem('remindmaze.lanternlight.v1',JSON.stringify(s)),winning);await page.reload();await page.locator('#continue-button').click();await page.locator('#stairs-button').click();await page.locator('#win-dialog').waitFor({state:'visible'});assert.equal((await state()).won,true);await page.screenshot({path:`${out}/ending.png`,fullPage:true});
 checks.push('Goal plus stairs reaches the ending UI');
 // The portable HTML executes the same code without an HTTP server.
 const portable=await browser.newPage({viewport:{width:1440,height:1080}});portable.on('pageerror',err=>errors.push(err.message));
 await portable.goto(new URL('../dist/reMindMaze.html',import.meta.url).href);await portable.locator('#start-button').click();await portable.locator('#direction-buttons button').first().click();await portable.locator('#question-dialog').waitFor({state:'visible'});
 checks.push('Portable file opens and presents playable questions without a server');
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:checks,errors},null,2));
}finally{await browser?.close();server.kill();}
