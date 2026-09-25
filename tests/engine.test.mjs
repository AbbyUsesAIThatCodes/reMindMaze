import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,makeFloor,pathTo,exits,beginDoor,answer,enter,ascend,useTorch,validSave,pointsFor,random,questionPool} from '../src/engine.js';
import {QUESTIONS,CATEGORIES} from '../src/questions.js';
const cats=CATEGORIES.map(c=>c.id);
function challenge(s){const d=exits(s).find(d=>!d.open);beginDoor(s,d.to,QUESTIONS,random(15));return QUESTIONS.find(q=>q.id===s.pending.id);}
test('108 unambiguous, sourced questions cover every subject and tier',()=>{
  assert.equal(QUESTIONS.length,108);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,108);
  for(const q of QUESTIONS){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.choices.includes(q.answer));assert.ok(q.url.startsWith('https://en.wikipedia.org/wiki/'));assert.ok(q.explanation);}
  for(const c of cats)for(let level=1;level<=4;level++)assert.equal(QUESTIONS.filter(q=>q.category===c&&q.level===level).length,3);
});
test('100 seeded mazes have connected, reciprocal, adjacent rooms and reachable stairs',()=>{
  for(let seed=0;seed<100;seed++){
    const s=makeFloor(seed);assert.equal(s.maze.length,100);assert.deepEqual(s,makeFloor(seed));
    for(let room=0;room<100;room++){
      assert.ok(pathTo(s.maze,s.pos,room).length);
      for(const n of s.maze[room]){assert.ok(s.maze[n].includes(room));assert.equal(Math.abs(n%10-room%10)+Math.abs(Math.floor(n/10)-Math.floor(room/10)),1);}
    }
    assert.ok(pathTo(s.maze,s.pos,s.exit).length>10);
  }
});
test('a correct answer unlocks both directions and cannot award twice',()=>{
  const s=newGame({},13),start=s.pos,q=challenge(s),to=s.pending.to;
  assert.equal(enter(s,to),false);assert.equal(answer(s,q.answer,QUESTIONS),'correct');const score=s.score;
  assert.equal(answer(s,q.answer,QUESTIONS),null);assert.equal(s.score,score);
  assert.equal(enter(s,to),true);assert.equal(beginDoor(s,start,QUESTIONS),'moved');assert.equal(s.score,score);assert.equal(s.pos,start);
});
test('two distinct wrong attempts fail without reducing accumulated points',()=>{
  const s=newGame({},11);s.score=1200;const q=challenge(s),wrong=q.choices.filter(c=>c!==q.answer);
  assert.equal(answer(s,wrong[0],QUESTIONS),'asking');assert.equal(answer(s,wrong[0],QUESTIONS),null);assert.equal(s.pending.wrong.length,1);
  assert.equal(answer(s,wrong[1],QUESTIONS),'failed');assert.equal(s.score,1200);assert.equal(s.unlocked.length,0);assert.equal(s.journal[0].correct,false);
});
test('speed bonus is bounded and research or study removes it',()=>{
  const s=newGame({},1),q=challenge(s),initial=pointsFor(s,q);
  s.pending.elapsed=50000;assert.equal(pointsFor(s,q),initial-200);
  s.pending.elapsed=0;s.pending.researched=true;assert.equal(pointsFor(s,q),initial-200);
  s.pending.researched=false;s.mode='study';assert.equal(pointsFor(s,q),initial-200);
  s.pending.wrong.push(q.choices.find(c=>c!==q.answer));assert.equal(pointsFor(s,q),initial-250);
});
test('five torches provide real routes and cannot go negative',()=>{
  const s=newGame({},12);
  for(let i=0;i<5;i++){const path=useTorch(s);assert.equal(path[0],s.pos);assert.equal(path.at(-1),s.exit);}
  assert.equal(s.torches,0);assert.deepEqual(useTorch(s),[]);assert.equal(s.torches,0);
});
test('only stairs permit ascent; reaching the goal alone does not win',()=>{
  const s=newGame({goal:5000},22);s.score=5000;assert.equal(ascend(s),false);assert.equal(s.won,false);
  s.pos=s.exit;assert.equal(ascend(s),'won');assert.equal(s.won,true);assert.equal(ascend(s),false);
  const t=newGame({},22);t.pos=t.exit;t.score=100;assert.equal(ascend(t),'floor');assert.equal(t.floor,2);assert.equal(t.score,100);assert.equal(t.torches,5);assert.deepEqual(t.visited,[90]);assert.deepEqual(t.maze,makeFloor(22,2).maze);
});
test('questions respect subjects and maximum tier and exhaust before repeating',()=>{
  const s=newGame({categories:['nature'],difficulty:2},8);assert.equal(questionPool(s,QUESTIONS).length,6);
  const seen=new Set();for(let i=0;i<6;i++){challenge(s);assert.ok(!seen.has(s.pending.id));seen.add(s.pending.id);s.pending=null;}
  const last=s.seen.at(-1);challenge(s);assert.notEqual(s.pending.id,last);assert.equal(s.seen.length,1);
});
test('save round trips include pending order, wrong attempts, elapsed time, and earned doors',()=>{
  const s=newGame({categories:['history']},42),q=challenge(s);s.pending.elapsed=28000;answer(s,q.choices.find(c=>c!==q.answer),QUESTIONS);
  const restored=JSON.parse(JSON.stringify(s));assert.ok(validSave(restored,QUESTIONS,cats));assert.deepEqual(restored,s);
  answer(restored,q.answer,QUESTIONS);assert.ok(validSave(restored,QUESTIONS,cats));
  enter(restored,restored.pending.to);assert.ok(validSave(restored,QUESTIONS,cats));
});
test('corrupt or incompatible saves are rejected safely',()=>{
  for(const patch of [{version:99},{pos:999},{torches:-1},{maze:[]},{categories:['missing']},{score:NaN},{visited:'bad'},{unlocked:['999:1']},{pending:{id:'missing'}},{journal:[{}]},{name:'a'.repeat(30)}])assert.equal(validSave({...newGame({},2),...patch},QUESTIONS,cats),false);
  for(const value of [null,{},[],1,'hello'])assert.equal(validSave(value,QUESTIONS,cats),false);
});
test('a complete multi-floor campaign reaches a valid ending',()=>{
  const s=newGame({goal:20000,difficulty:4},88);let safety=0;
  while(!s.won&&safety++<500){
    if(s.pos===s.exit){ascend(s);continue;}
    const to=pathTo(s.maze,s.pos,s.exit)[1];const outcome=beginDoor(s,to,QUESTIONS);
    if(outcome==='question'){const q=QUESTIONS.find(q=>q.id===s.pending.id);answer(s,q.answer,QUESTIONS);enter(s,to);}
    assert.ok(validSave(s,QUESTIONS,cats));
  }
  assert.equal(s.won,true);assert.ok(s.score>=20000);assert.ok(s.floor>=1);
});
