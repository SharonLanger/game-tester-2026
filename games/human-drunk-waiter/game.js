(() => {
'use strict';
const c=document.getElementById('canvas'),g=c.getContext('2d'),E=id=>document.getElementById(id),W=440,H=540;
const pathname=location.pathname.replace(/\/index\.html$/i,'').replace(/\/$/,'');
const slug=pathname.split('/').pop() || 'human-drunk-waiter';
const profile=slug==='human-drunk-waiter'?'default':slug;
const KEY='tester-human-drunk-waiter-'+profile+'-best-v2';
let best=0; try{best=Number(localStorage.getItem(KEY))||0}catch(e){}
// Carry forward Ben's original high score, if present.
if(profile==='ben')try{best=Math.max(best,Number(localStorage.getItem('tester-human-drunk-waiter-best-v1'))||0)}catch(e){}
E('best').textContent=best;

// Every profile (including default) supplies these four identically named images.
// No profile-specific conditionals are needed: URLs resolve relative to index.html.
const faces={};
for(const mood of ['happy','worried','surprised','scared']){
  const img=new Image();
  img.src='images/'+mood+'.webp';
  faces[mood]=img;
}

let mode='ready',elapsed=0,score=0,cups=2,angle=.035,angularVel=0,slide=0,slideV=0,left=false,right=false,nextCup=8,flash=0,last=0;

function modal(icon,title,desc,label){E('icon').textContent=icon;E('title').textContent=title;E('desc').textContent=desc;E('start').textContent=label;E('overlay').hidden=false}
function begin(){mode='play';elapsed=0;score=0;cups=2;angle=.035;angularVel=0;slide=0;slideV=0;nextCup=8;flash=0;left=false;right=false;E('cups').textContent=2;E('score').textContent=0;E('overlay').hidden=true}
function finish(){mode='over';left=right=false;if(score>best){best=score;// Carry forward Ben's original high score, if present.
if(profile==='ben')try{best=Math.max(best,Number(localStorage.getItem('tester-human-drunk-waiter-best-v1'))||0)}catch(e){}
E('best').textContent=best;try{localStorage.setItem(KEY,String(best))}catch(e){}}
  modal('💥','הכוסות נפלו!','שרדתם '+Math.floor(elapsed)+' שניות וצברתם '+score+' נקודות עם '+cups+' כוסות.','לנסות שוב')}
function update(dt){
  elapsed+=dt;
  if(elapsed>=nextCup){cups=Math.min(8,cups+1);E('cups').textContent=cups;nextCup+=8;flash=1.5}
  const wind=(.20+cups*.10)*Math.sin(elapsed*1.5)+(.1+cups*.032)*Math.sin(elapsed*3.1);
  const input=(right?1:0)-(left?1:0);
  const accel=3.1*Math.sin(angle)+wind+input*5.8-angularVel*2.4;
  angularVel+=accel*dt;angle+=angularVel*dt;
  slideV+=(Math.sin(angle)*55+angularVel*8-slideV*.7)*dt;slide+=slideV*dt;
  flash=Math.max(0,flash-dt);
  score=Math.floor(elapsed*12)+(cups-2)*80;
  E('score').textContent=score;
  if(Math.abs(angle)>.67||Math.abs(slide)>117)finish();
}
function currentFace(){
  const danger=Math.max(Math.abs(angle)/0.67,Math.abs(slide)/117);
  if(danger<0.28) return faces.happy;
  if(danger<0.55) return faces.worried;
  if(danger<0.8) return faces.surprised;
  return faces.scared;
}
function drawFace(img,x,y,w,h){
  if(!img.complete || !img.naturalWidth) return;
  g.save();
  g.translate(x,y);
  g.drawImage(img,-w/2,-h/2,w,h);
  g.restore();
}
function drawRoundedRect(x,y,w,h,r,color){
  g.fillStyle=color; g.beginPath(); g.roundRect(x,y,w,h,r); g.fill();
}
function render(){
  const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#ead59e');sky.addColorStop(1,'#f1e1c4');g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.fillStyle='#d3b68d';for(let i=0;i<8;i++){g.fillRect(i*65-15,85,24,218)}
  g.fillStyle='#976f58';g.fillRect(0,450,W,90);g.fillStyle='#704d45';g.fillRect(0,450,W,13);
  for(let i=0;i<5;i++){g.fillStyle='#c7a371';g.fillRect(i*112+15,125,47,70);g.fillStyle='#ffffff99';g.fillRect(i*112+25,134,12,25)}

  // body
  drawRoundedRect(162,375,118,123,42,'#2a4a60');
  g.fillStyle='#ffffff';g.fillRect(210,375,18,123);
  g.fillStyle='#8d1e2f';g.beginPath();g.moveTo(219,393);g.lineTo(205,431);g.lineTo(233,431);g.closePath();g.fill();
  g.fillStyle='#d6a57c';g.beginPath();g.arc(220,340,32,0,7);g.fill();
  g.fillStyle='#1d3040';g.beginPath();g.arc(220,326,32,Math.PI,Math.PI*2);g.fill();
  // face overlay
  drawFace(currentFace(),220,355,138,138);

  // arm
  g.strokeStyle='#d6a57c';g.lineWidth=15;g.lineCap='round';g.beginPath();g.moveTo(178,417);g.lineTo(145,410);g.lineTo(169,382);g.stroke();

  const cx=220,cy=284;
  g.save();g.translate(cx,cy);g.rotate(angle);
  g.fillStyle='#677990';g.beginPath();g.roundRect(-148,0,296,20,9);g.fill();
  g.fillStyle='#afbed0';g.beginPath();g.roundRect(-148,-8,296,12,8);g.fill();
  g.fillStyle='#dce1e6';g.fillRect(-144,-8,288,4);
  const cupPos=[-100,-52,0,52,100,-79,79,20];const emojis=['🍷','🍺','🥂','🍹','🥤','🍸','🧃','🍷'];
  g.textAlign='center';g.textBaseline='middle';g.font='46px system-ui';
  for(let i=0;i<cups;i++){let x=cupPos[i]+slide;if(x<-147||x>147)continue;g.fillText(emojis[i],x,-33)}
  g.restore();

  // meter
  drawRoundedRect(60,30,320,49,12,'#223a53ca');
  g.fillStyle='#d6e3ef';g.font='bold 16px system-ui';g.textAlign='center';g.fillText('מד נטייה',220,47);
  g.fillStyle='#91c9b2';g.fillRect(105,60,230,8);
  g.fillStyle='#f7a4a4';g.fillRect(105,60,45,8);g.fillRect(290,60,45,8);
  const pointer=220+Math.max(-115,Math.min(115,angle/.67*115));
  g.fillStyle='#27374a';g.beginPath();g.moveTo(pointer,52);g.lineTo(pointer-8,76);g.lineTo(pointer+8,76);g.closePath();g.fill();

  if(flash>0){drawRoundedRect(100,97,240,44,12,'#334861c5');g.fillStyle='#fff';g.font='bold 19px system-ui';g.textAlign='center';g.fillText('עוד כוס! 🍹',220,125)}

  const danger=Math.max(Math.abs(angle)/0.67,Math.abs(slide)/117);
  const faceLabel=danger<0.28?'שמח':danger<0.55?'מודאג':danger<0.8?'מופתע':'מפוחד';
  g.fillStyle='#1f3147cc';g.beginPath();g.roundRect(12,12,106,30,9);g.fill();
  g.fillStyle='#fff';g.font='bold 15px system-ui';g.textAlign='center';g.fillText('מצב: '+faceLabel,65,32);
}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;if(mode==='play')update(dt);render();requestAnimationFrame(loop)}
function hold(id,dir){const e=E(id);e.addEventListener('pointerdown',ev=>{ev.preventDefault();if(mode==='play'){if(dir==='left')left=true;else right=true;e.setPointerCapture?.(ev.pointerId)}});['pointerup','pointercancel','lostpointercapture'].forEach(event=>e.addEventListener(event,()=>{if(dir==='left')left=false;else right=false}))}
hold('left','left');hold('right','right');
let side=null;
c.addEventListener('pointerdown',e=>{if(mode!=='play')return;const r=c.getBoundingClientRect();side=(e.clientX-r.left<r.width/2)?'left':'right';if(side==='left')left=true;else right=true;c.setPointerCapture?.(e.pointerId)});
['pointerup','pointercancel','lostpointercapture'].forEach(type=>c.addEventListener(type,()=>{if(side==='left')left=false;if(side==='right')right=false;side=null}));
addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='ArrowLeft')left=true;if(e.code==='ArrowRight')right=true;if(e.code==='Space'&&mode!=='play'&&!e.repeat)begin()});
addEventListener('keyup',e=>{if(e.code==='ArrowLeft')left=false;if(e.code==='ArrowRight')right=false});
addEventListener('blur',()=>{left=right=false});
E('start').onclick=begin;requestAnimationFrame(loop);
})();
