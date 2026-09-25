import { random, exits, SIZE, pathTo } from './engine.js';
import { inhabitantFor } from './inhabitants.js';
function poly(c, points, fill, stroke) {
  c.beginPath(); points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.closePath();
  if(fill) { c.fillStyle=fill; c.fill(); } if(stroke) { c.strokeStyle=stroke; c.stroke(); }
}
function ellipse(c,x,y,rx,ry,color) { c.beginPath(); c.ellipse(x,y,rx,ry,0,0,Math.PI*2); c.fillStyle=color; c.fill(); }
function line(c,x1,y1,x2,y2,color,width=1) { c.strokeStyle=color; c.lineWidth=width; c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke(); }
function arch(c,x,y,w,h) {
  c.beginPath(); c.moveTo(x,y+h); c.lineTo(x,y+w*.5); c.bezierCurveTo(x,y+w*.17,x+w*.3,y,x+w*.5,y-14);
  c.bezierCurveTo(x+w*.7,y,x+w,y+w*.17,x+w,y+w*.5); c.lineTo(x+w,y+h); c.closePath();
}
function masonry(c, points, rng, tint=0) {
  c.save(); poly(c,points); c.clip();
  for(let row=0;row<15;row++) for(let col=-1;col<18;col++) {
    const x=col*70+(row%2)*35,y=row*40;
    const light=20+Math.floor(rng()*9)+tint;
    c.fillStyle=`hsl(35 13% ${light}%)`; c.fillRect(x+1,y+1,68,38);
    line(c,x+2,y+2,x+66,y+2,`hsla(43,30%,80%,${.07+rng()*.04})`);
    line(c,x+68,y+4,x+68,y+36,'#151816',1);
    for(let t=0;t<7;t++) {c.fillStyle=rng()>.5?'#ffffff06':'#00000018';c.fillRect(x+rng()*68,y+rng()*38,2+rng()*6,1);}
  }
  c.restore();
}
function door(c,x,y,w,h,open,seed) {
  c.save(); arch(c,x-13,y-13,w+26,h+13);c.fillStyle='#746958';c.fill();c.strokeStyle='#282820';c.lineWidth=4;c.stroke();
  arch(c,x-5,y-5,w+10,h+5);c.strokeStyle='#b2a17c';c.lineWidth=2;c.stroke();
  arch(c,x,y,w,h);c.fillStyle=open?'#141d22':'#2d241c';c.fill();c.save();c.clip();
  if(open) {
    const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#090f13');g.addColorStop(1,'#3b4a43');c.fillStyle=g;c.fillRect(x,y-20,w,h+30);
    for(let i=0;i<5;i++){c.strokeStyle='#5b655638';c.strokeRect(x+12+i*10,y+50+i*20,w-24-i*20,h-30);}
    poly(c,[[x,y+h],[x+w*.48,y+h*.6],[x+w*.65,y+h*.6],[x+w,y+h]],'#88744c28');
  } else {
    const rng=random(seed);
    for(let xx=x;xx<x+w;xx+=13){c.fillStyle=`hsl(28 27% ${18+rng()*9}%)`;c.fillRect(xx,y-20,11,h+30);line(c,xx+2,y,xx+2,y+h,'#d3ac6720');}
    for(const yy of [y+h*.45,y+h*.8]) {c.fillStyle='#171c1b';c.fillRect(x,yy,w,8);for(let xx=x+8;xx<x+w;xx+=22)ellipse(c,xx,yy+4,2,2,'#80745b');}
    c.strokeStyle='#c7a663';c.lineWidth=3;c.beginPath();c.arc(x+w*.72,y+h*.62,7,0,Math.PI*2);c.stroke();
    c.shadowColor='#d8bd75';c.shadowBlur=12;poly(c,[[x+w*.5,y+37],[x+w*.5+7,y+48],[x+w*.5,y+59],[x+w*.5-7,y+48]],'#d5bf82');c.shadowBlur=0;
  }
  c.restore();
  for(let i=0;i<5;i++)line(c,x-13,y+w*.5+i*30,x-1,y+w*.5+i*30,'#34352c',2);
  c.restore();
}
function windowArch(c,x,y,w,h) {
  arch(c,x-8,y-8,w+16,h+8);c.fillStyle='#807664';c.fill();arch(c,x,y,w,h);c.fillStyle='#314858';c.fill();
  c.save();c.clip();const sky=c.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,'#182c41');sky.addColorStop(1,'#7a8990');c.fillStyle=sky;c.fillRect(x,y-20,w,h+30);
  ellipse(c,x+w*.68,y+h*.27,13,13,'#e3ddbc');ellipse(c,x+w*.75,y+h*.23,12,12,'#283e50');
  poly(c,[[x-5,y+h],[x+w*.1,y+h*.65],[x+w*.3,y+h*.8],[x+w*.7,y+h*.6],[x+w,y+h*.78],[x+w+5,y+h]],'#202e39');
  line(c,x+w/2,y-20,x+w/2,y+h,'#9d947d',7);line(c,x,y+h*.48,x+w,y+h*.48,'#9d947d',7);c.restore();
}
function torch(c,x,y,t) {
  const glow=c.createRadialGradient(x,y,0,x,y,95);glow.addColorStop(0,'#ffba5438');glow.addColorStop(.4,'#eea44815');glow.addColorStop(1,'#ffbe5400');c.fillStyle=glow;c.fillRect(x-95,y-95,190,190);
  c.fillStyle='#171c1a';c.fillRect(x-6,y+11,12,48);c.fillStyle='#947751';c.fillRect(x-3,y+12,6,33);ellipse(c,x,y+14,13,5,'#383627');
  c.save();c.shadowColor='#ffc062';c.shadowBlur=22;
  poly(c,[[x-9,y+13],[x-13,y-2],[x-3,y-16],[x+2+Math.sin(t)*3,y-32],[x+7,y-8],[x+13,y],[x+8,y+13]],'#d99038');
  poly(c,[[x-5,y+12],[x-6,y],[x+2,y-14],[x+7,y+7],[x+3,y+15]],'#ffe2a1');c.restore();
}
export function portrait(c, person, x,y,scale=1) {
  c.save();c.translate(x,y);c.scale(scale,scale);
  ellipse(c,0,128,49,11,'#00000045');
  poly(c,[[-34,14],[-51,97],[-43,126],[41,126],[50,97],[31,14]],person.color,'#292520');
  poly(c,[[-13,17],[-7,57],[0,72],[9,55],[15,17]],'#d7caa6');
  poly(c,[[-34,16],[-16,7],[-1,77],[-28,97]],'#ffffff12');
  poly(c,[[34,16],[16,7],[1,77],[28,97]],'#00000022');
  c.fillStyle='#493d2b';c.fillRect(-39,83,78,8);c.strokeStyle='#c3a667';c.lineWidth=3;c.strokeRect(-7,82,14,10);
  c.fillStyle=person.skin;c.fillRect(-10,-2,20,23);
  ellipse(c,0,-26,27,37,person.hair);ellipse(c,0,-22,22,30,person.skin);
  ellipse(c,-21,-19,4,7,person.skin);ellipse(c,21,-19,4,7,person.skin);
  poly(c,[[-26,-32],[-22,-54],[-3,-63],[20,-52],[27,-31],[11,-40],[4,-48],[-5,-34]],person.hair);
  line(c,-15,-26,-5,-27,'#49372b',2);line(c,5,-27,15,-26,'#49372b',2);
  ellipse(c,-10,-22,2,2,'#202522');ellipse(c,10,-22,2,2,'#202522');line(c,0,-18,-2,-10,'#694638',1.5);
  c.beginPath();c.arc(0,-9,8,.2,Math.PI-.2);c.strokeStyle='#6c4737';c.lineWidth=1.8;c.stroke();
  if(person.kind==='scholar') {
    c.strokeStyle='#c9b581';c.lineWidth=1.5;for(const xx of [-10,10]){c.beginPath();c.arc(xx,-21,8,0,Math.PI*2);c.stroke();}line(c,-2,-21,2,-21,'#c9b581',1.5);
    poly(c,[[-30,40],[0,45],[0,81],[-30,73]],'#b99254','#382d23');poly(c,[[0,45],[30,40],[30,73],[0,81]],'#dfcd9e','#382d23');
    for(let yy=48;yy<71;yy+=6)line(c,5,yy,23,yy-2,'#998558',1);
    ellipse(c,-30,61,6,10,person.skin);ellipse(c,30,61,6,10,person.skin);
  }else if(person.kind==='wizard') {
    poly(c,[[-37,-50],[0,-108],[29,-50]],person.color,'#323243');ellipse(c,-3,-50,42,8,person.color);poly(c,[[0,1],[-17,-5],[0,46],[18,-5]],person.hair);
    line(c,44,-39,44,123,'#897148',7);ellipse(c,44,-44,10,13,'#91c3c0');
  }else if(person.kind==='knight') {
    poly(c,[[-29,-29],[-28,-56],[0,-72],[28,-56],[29,-29],[22,-34],[20,-49],[-20,-49],[-22,-34]],'#989f96','#414d4a');
    poly(c,[[8,45],[52,45],[49,90],[30,111],[9,90]],'#4f6262','#c3b389');poly(c,[[30,53],[38,70],[30,91],[22,70]],'#bdab73');
  }else if(person.kind==='bard') {
    ellipse(c,15,61,24,31,'#b18a4f');ellipse(c,15,61,9,10,'#393225');line(c,20,48,40,2,'#be9e61',10);for(let k=0;k<3;k++)line(c,13+k*3,83,38+k,6,'#e3d4a2',.7);
  }else if(person.kind==='gardener') {
    ellipse(c,-2,-49,43,9,'#af9153');poly(c,[[-24,-51],[-18,-77],[13,-77],[26,-51]],'#b69e63');line(c,40,-7,40,120,'#9d875e',5);
  }else {
    poly(c,[[-33,-48],[-9,-76],[20,-72],[32,-44]],person.color);ellipse(c,0,-44,40,7,person.color);
    c.fillStyle='#bdab77';c.fillRect(-27,43,43,31);line(c,-18,48,8,64,'#887754',2);line(c,-24,66,3,48,'#887754',1);
  }
  c.restore();
}
export function drawPortrait(canvas,person) {
  const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);
  const g=c.createRadialGradient(70,75,1,70,75,95);g.addColorStop(0,'#625443');g.addColorStop(1,'#252d28');c.fillStyle=g;c.fillRect(0,0,canvas.width,canvas.height);
  portrait(c,person,canvas.width/2,canvas.height*.55,.95);
}
export function drawRoom(canvas,state,t=0) {
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  c.save();c.scale(w/960,h/560);
  const rng=random(state.seed+state.pos*1231+state.floor),person=inhabitantFor(state);
  c.fillStyle='#171c19';c.fillRect(0,0,960,560);
  masonry(c,[[230,108],[730,108],[730,365],[230,365]],rng,4);
  masonry(c,[[0,0],[230,108],[230,365],[0,560]],rng,-3);
  masonry(c,[[960,0],[730,108],[730,365],[960,560]],rng,-5);
  poly(c,[[0,0],[960,0],[730,108],[230,108]],'#252c28');
  for(let i=0;i<5;i++){c.beginPath();c.moveTo(i*240,0);c.quadraticCurveTo(480,30,230+i*125,108);c.strokeStyle='#4c5042';c.lineWidth=7;c.stroke();}
  const floor=c.createLinearGradient(0,365,0,560);floor.addColorStop(0,'#4d493b');floor.addColorStop(1,'#242c28');c.fillStyle=floor;poly(c,[[230,365],[730,365],[960,560],[0,560]],floor);
  for(const yy of [374,390,412,444,490,558])line(c,0,yy,960,yy,'#131b18',3);
  for(let x=-960;x<1900;x+=180)line(c,480,330,x,560,'#131b18',2);
  poly(c,[[433,370],[527,370],[614,560],[346,560]],'#3e5750');poly(c,[[440,370],[520,370],[601,560],[359,560]],'#385048');
  line(c,439,370,357,560,'#b39a594f',2);line(c,521,370,603,560,'#b39a594f',2);
  for(let y=400;y<560;y+=35){const size=(y-330)*.09;poly(c,[[480,y-size],[480+size,y],[480,y+size],[480-size,y]],null,'#b79d604f');}
  // Heavy corner pillars and a ribbed vault frame the room.
  for(const x of [215,730]) {
    const g=c.createLinearGradient(x,0,x+18,0);g.addColorStop(0,'#7b7560');g.addColorStop(.5,'#575b4b');g.addColorStop(1,'#252d27');c.fillStyle=g;c.fillRect(x,100,18,276);
    c.fillStyle='#817963';c.fillRect(x-7,101,32,13);c.fillRect(x-8,356,33,16);
    for(let y=122;y<350;y+=45)line(c,x,y,x+18,y,'#2c332a',2);
  }
  c.strokeStyle='#7a7560';c.lineWidth=12;c.beginPath();c.moveTo(230,113);c.bezierCurveTo(350,87,410,42,480,26);c.bezierCurveTo(550,42,610,87,730,113);c.stroke();
  c.strokeStyle='#a19572';c.lineWidth=2;c.stroke();
  const doors=exits(state);
  const north=doors.find(d=>d.id==='n');
  if(north)door(c,418,160,124,211,north.open,state.pos);else windowArch(c,439,151,82,164);
  const west=doors.find(d=>d.id==='w');
  if(west){c.save();c.transform(1,-.22,0,1,0,35);door(c,57,197,105,227,west.open,state.pos+1);c.restore();}
  else {c.save();c.transform(1,-.2,0,1,0,40);windowArch(c,58,166,82,180);c.restore();}
  const east=doors.find(d=>d.id==='e');
  if(east){c.save();c.transform(1,.22,0,1,0,-176);door(c,798,197,105,227,east.open,state.pos+2);c.restore();}
  else {c.save();c.transform(1,.2,0,1,0,-155);windowArch(c,820,166,82,180);c.restore();}
  // A framed atlas: a clickable invitation to read beyond the room.
  c.fillStyle='#272820';c.fillRect(270,166,94,124);c.fillStyle='#a08850';c.fillRect(274,170,86,116);c.fillStyle='#293b36';c.fillRect(279,175,76,106);
  c.strokeStyle='#b9b180';c.lineWidth=1;c.beginPath();c.arc(317,221,27,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(317,221,12,27,0,0,Math.PI*2);c.stroke();line(c,290,221,344,221,'#b9b180');line(c,317,194,317,248,'#b9b180');
  for(let i=0;i<10;i++)ellipse(c,286+rng()*64,179+rng()*92,.6,.6,'#d2b980');
  c.fillStyle='#81744e';c.fillRect(296,263,42,3);
  // Cloth banner with an original lantern emblem.
  poly(c,[[615,133],[681,133],[681,280],[648,298],[615,280]],person.color,'#222a24');
  line(c,611,132,686,132,'#ac945e',5);line(c,621,140,621,278,'#d4bc7d50',1);line(c,675,140,675,278,'#d4bc7d50',1);
  c.strokeStyle='#dfcb91';c.lineWidth=2;c.strokeRect(637,184,23,30);poly(c,[[633,184],[648,174],[664,184]],null,'#dfcb91');line(c,634,217,663,217,'#dfcb91',2);ellipse(c,648,201,4,7,'#e0c887');
  torch(c,383,225,t);torch(c,577,225,t+2);
  // Shelves in the foreground, varying spines from a stable room seed.
  c.fillStyle='#27261e';c.fillRect(250,319,118,56);c.fillStyle='#665037';c.fillRect(245,315,129,7);
  for(let i=0;i<13;i++){const bh=21+rng()*22;c.fillStyle=['#756146','#5d735e','#815549','#666583'][i%4];c.fillRect(254+i*8,364-bh,6,bh);line(c,255+i*8,368-bh,259+i*8,368-bh,'#c7b579',1);}
  c.fillStyle='#705a3d';c.fillRect(246,365,127,6);
  portrait(c,person,657,334,.79);
  // Cool window light across the floor, warm falloff in the corners.
  poly(c,[[700,364],[787,332],[960,440],[877,560]],'#9aa89908');
  const vignette=c.createRadialGradient(480,295,110,480,295,600);vignette.addColorStop(0,'#00000000');vignette.addColorStop(.75,'#07100d30');vignette.addColorStop(1,'#050c09b0');c.fillStyle=vignette;c.fillRect(0,0,960,560);
  for(let i=0;i<1000;i++){c.fillStyle=i%2?'#edd9a507':'#040b0714';c.fillRect(rng()*960,rng()*560,1,1);}
  c.restore();
}
export function drawMap(canvas,state,route=[]) {
  const c=canvas.getContext('2d');const cell=canvas.width/SIZE;
  c.clearRect(0,0,canvas.width,canvas.height);c.fillStyle='#cbbd92';c.fillRect(0,0,canvas.width,canvas.height);
  const visited=new Set(state.visited), revealed=new Set([...state.visited,...route]);
  for(let n=0;n<100;n++){
    const x=n%10*cell,y=Math.floor(n/10)*cell;
    c.fillStyle=visited.has(n)?'#eee1b6':route.includes(n)?'#d6c68d':'#b1a785';c.fillRect(x+1,y+1,cell-2,cell-2);
    if(!revealed.has(n)){ellipse(c,x+cell/2,y+cell/2,1,1,'#918b70');continue;}
    const ns=state.maze[n];
    for(const [a,b,neighbor] of [ [[x,y],[x+cell,y],n-10],[[x+cell,y],[x+cell,y+cell],n+1],[[x,y+cell],[x+cell,y+cell],n+10],[[x,y],[x,y+cell],n-1] ]){
      if(!ns.includes(neighbor))line(c,...a,...b,'#70674d',2);
      else if(!state.unlocked.includes([Math.min(n,neighbor),Math.max(n,neighbor)].join(':'))){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;ellipse(c,mx,my,1.7,1.7,'#ad8755');}
    }
  }
  if(route.length){c.strokeStyle='#b27a31';c.lineWidth=3;c.setLineDash([3,3]);c.beginPath();route.forEach((n,i)=>{const x=(n%10+.5)*cell,y=(Math.floor(n/10)+.5)*cell;i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();c.setLineDash([]);}
  const sx=(state.exit%10)*cell,sy=Math.floor(state.exit/10)*cell;
  for(let i=0;i<4;i++){c.fillStyle='#7e6436';c.fillRect(sx+5+i*3,sy+cell-6-i*4,4,3+i*4);}
  const px=(state.pos%10+.5)*cell,py=(Math.floor(state.pos/10)+.5)*cell;
  ellipse(c,px,py,cell*.28,cell*.28,'#3a5b4b');poly(c,[[px,py-cell*.25],[px+cell*.18,py+cell*.16],[px-cell*.18,py+cell*.16]],'#fff5d4');
}
