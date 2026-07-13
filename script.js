/* ---------------- AMBIENT CANVAS: sparkles + hearts + koi ---------------- */
const canvas = document.getElementById('ambient');
const ctx = canvas.getContext('2d');
function resize(){canvas.width = innerWidth; canvas.height = innerHeight;}
resize(); addEventListener('resize', resize);

const bits = Array.from({length:22}, () => spawnBit());
function spawnBit(){
  const kinds = ['star','heart'];
  return {
    x: Math.random()*innerWidth, y: Math.random()*-innerHeight,
    r: 6+Math.random()*8, speed:.3+Math.random()*.5, sway:Math.random()*Math.PI*2,
    kind: kinds[Math.floor(Math.random()*kinds.length)],
    color: ['#C2185B','#8B0000','#D9A521','#E3AEB8'][Math.floor(Math.random()*4)]
  };
}
function drawStar(x,y,r,color){
  ctx.save(); ctx.translate(x,y); ctx.fillStyle=color; ctx.globalAlpha=.7;
  ctx.beginPath();
  for(let i=0;i<5;i++){
    ctx.lineTo(Math.cos((18+i*72)*Math.PI/180)*r, -Math.sin((18+i*72)*Math.PI/180)*r);
    ctx.lineTo(Math.cos((54+i*72)*Math.PI/180)*r*.45, -Math.sin((54+i*72)*Math.PI/180)*r*.45);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function drawHeart(x,y,r,color){
  ctx.save(); ctx.translate(x,y); ctx.fillStyle=color; ctx.globalAlpha=.65;
  ctx.beginPath();
  ctx.moveTo(0, r*.3);
  ctx.bezierCurveTo(-r, -r*.6, -r*1.6, r*.5, 0, r*1.3);
  ctx.bezierCurveTo(r*1.6, r*.5, r, -r*.6, 0, r*.3);
  ctx.fill(); ctx.restore();
}
function makeFish(color, y, scale, speed){ return {x:Math.random()*innerWidth, y, color, scale, speed, dir:1, t:Math.random()*10}; }
const fish = [ makeFish('#FFA500', innerHeight*0.78, 1, .32), makeFish('#FF6FA5', innerHeight*0.85, .8, .26), makeFish('#f2c94c', innerHeight*0.72, .6, .4) ];
function drawFish(f){
  ctx.save(); ctx.translate(f.x, f.y+Math.sin(f.t)*8); ctx.scale(f.dir*f.scale, f.scale); ctx.globalAlpha=.5; ctx.fillStyle=f.color;
  ctx.beginPath(); ctx.ellipse(0,0,22,9,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-20,0); ctx.lineTo(-34,-10); ctx.lineTo(-34,10); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  bits.forEach(p=>{
    p.y += p.speed; p.sway += 0.02; p.x += Math.sin(p.sway)*.5;
    if(p.y > innerHeight+20){ Object.assign(p, spawnBit(), {y:-20}); }
    if(p.kind==='star') drawStar(p.x,p.y,p.r,p.color); else drawHeart(p.x,p.y,p.r*.6,p.color);
  });
  fish.forEach(f=>{ f.t+=0.05; f.x+=f.speed*f.dir; if(f.x>innerWidth+40)f.dir=-1; if(f.x<-40)f.dir=1; drawFish(f); });
  requestAnimationFrame(animate);
}
animate();

/* ---------------- glitter cursor trail ---------------- */
const glitterEmojis = ['✦','✧','♥'];
let lastTrail = 0;
addEventListener('mousemove', e=>{
  const now = Date.now();
  if(now - lastTrail < 60) return;
  lastTrail = now;
  const el = document.createElement('div');
  el.className = 'sparkle-trail';
  el.textContent = glitterEmojis[Math.floor(Math.random()*glitterEmojis.length)];
  el.style.left = e.clientX + 'px';
  el.style.top = e.clientY + 'px';
  el.style.color = ['#C2185B','#D9A521','#8B0000'][Math.floor(Math.random()*3)];
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 800);
});

/* ---------------- SCENES ---------------- */
function showScene(id){
  document.querySelectorAll('.scene').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
let boxOpened = false;
function openTheBox(){
  if(boxOpened) return;
  boxOpened = true;
  document.getElementById('boxLid').classList.add('open');
  document.getElementById('seal').classList.add('hide');
  document.getElementById('ribbonV').classList.add('hide');
  document.getElementById('ribbonH').classList.add('hide');
  document.getElementById('boxDuck').classList.add('pop');
  document.getElementById('giftTag').classList.add('hide');
  document.getElementById('burst').classList.add('burst');
  spawnBoxSparkles();
  setTimeout(()=>{ showScene('gate'); document.getElementById('gate-input').focus(); }, 1400);
}
function spawnBoxSparkles(){
  const rect = document.getElementById('giftBox').getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height*0.45;
  const syms = ['✦','✧','♥'];
  const cols = ['#D9A521','#C2185B','#8B0000'];
  for(let i=0;i<16;i++){
    const el = document.createElement('div');
    el.textContent = syms[Math.floor(Math.random()*syms.length)];
    el.style.cssText = `position:fixed; left:${cx}px; top:${cy}px; font-size:${10+Math.random()*10}px; color:${cols[Math.floor(Math.random()*cols.length)]}; z-index:500; pointer-events:none;`;
    document.body.appendChild(el);
    const angle = Math.random()*Math.PI*2;
    const dist = 60+Math.random()*100;
    const dx = Math.cos(angle)*dist, dy = Math.sin(angle)*dist;
    const dur = 700+Math.random()*600;
    el.animate([
      {transform:'translate(0,0) scale(1)', opacity:1},
      {transform:`translate(${dx}px,${dy}px) scale(.3)`, opacity:0}
    ], {duration:dur, easing:'cubic-bezier(.2,.8,.3,1)'});
    setTimeout(()=>el.remove(), dur);
  }
}
document.getElementById('openBoxBtn').addEventListener('click', openTheBox);
document.getElementById('giftBox').addEventListener('click', openTheBox);

/* simple hash so the answers aren't sitting in the source as plain text */
function simpleHash(str){
  let h = 5381;
  for(let i=0;i<str.length;i++){ h = ((h*33) ^ str.charCodeAt(i)) >>> 0; }
  return h;
}
const GATE_HASH = 164697797;
const DUCK_HASH = 193353683;

/* password gate */
const rejections = [
  "This place belongs to someone special.",
  "Hmm... that's not the secret word.",
  "Try again, pretty girl.",
  "Almost. Think warmer, sweeter.",
  "Not quite — you know this one."
];
const gateInput = document.getElementById('gate-input');
const gateMsg = document.getElementById('gate-msg');
function tryGate(){
  const val = gateInput.value.trim().toLowerCase();
  if(val.length && simpleHash(val) === GATE_HASH){ enterSite(); }
  else if(val.length){
    gateMsg.textContent = rejections[Math.floor(Math.random()*rejections.length)];
    gateMsg.classList.remove('shake'); void gateMsg.offsetWidth; gateMsg.classList.add('shake');
  }
}
gateInput.addEventListener('keydown', e=>{ if(e.key==='Enter') tryGate(); });
document.getElementById('gateSubmitBtn').addEventListener('click', tryGate);

const pageTitles = {home:'♡ home.html', letter:'♡ letter.html', gallery:'♡ gallery.html', wall:'♡ wall.html', surprise:'♡ surprise.html'};

function enterSite(){
  showScene('site-scene');
  document.getElementById('taskbar').style.display = 'flex';
  goPage('home');
}

function goPage(target){
  document.querySelectorAll('.content-page').forEach(p=>p.style.display='none');
  document.getElementById(target).style.display='block';
  document.getElementById('crumbTitle').textContent = pageTitles[target];
  document.querySelectorAll('#sideNav button, #start-menu button').forEach(b=>{
    b.classList.toggle('on', b.dataset.target===target);
  });
  document.getElementById('start-menu').classList.remove('show');
  document.querySelector('.browser-window').scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('#sideNav button, #start-menu button').forEach(btn=>{
  btn.addEventListener('click', ()=>goPage(btn.dataset.target));
});

/* start menu toggle */
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
startBtn.addEventListener('click', ()=>startMenu.classList.toggle('show'));
document.addEventListener('click', e=>{
  if(!startMenu.contains(e.target) && e.target !== startBtn) startMenu.classList.remove('show');
});

/* clock */
function tickClock(){
  const d = new Date();
  let h = d.getHours(); const m = d.getMinutes().toString().padStart(2,'0');
  const ampm = h>=12 ? 'PM':'AM'; h = h%12 || 12;
  document.getElementById('taskbar-clock').textContent = `${h}:${m} ${ampm}`;
}
tickClock(); setInterval(tickClock, 1000*15);

/* days together, counting up in real time since the anniversary (edit the date below) */
const ANNIVERSARY_DATE = new Date(2026, 3, 20, 0, 0, 0); // April 20, 2026
function tickCountdown(){
  const now = new Date();
  const diff = Math.max(0, now - ANNIVERSARY_DATE);
  const pad = n => String(n).padStart(2,'0');
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('countdownNum').textContent = `${String(days).padStart(4,'0')}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* polaroid wall build */
const wallGrid = document.getElementById('wallGrid');
const wallPhotos = [
  {img:'https://raw.githubusercontent.com/KaitoTheBuilder/Kingdom-Hearts/main/Polaroid/p1.jpeg', cap:'p1', note:'cuteon ang edit mo pati'},
  {img:'https://raw.githubusercontent.com/KaitoTheBuilder/Kingdom-Hearts/main/Polaroid/p2.jpeg', cap:'p2', note:'favorite mo talagang pose naka kiss eh'},
  {img:'https://raw.githubusercontent.com/KaitoTheBuilder/Kingdom-Hearts/main/Polaroid/p3.jpeg', cap:'p3', note:'syeahhh garo aki HAHAHAHAHAH'},
  {img:'https://raw.githubusercontent.com/KaitoTheBuilder/Kingdom-Hearts/main/Polaroid/p4.png', cap:'p4', note:'angas kang pag ka pic mo dito, naka pose pati si bear'},
  {img:'https://raw.githubusercontent.com/KaitoTheBuilder/Kingdom-Hearts/main/Polaroid/p5.png', cap:'p5', note:'kiss pose ulit AHHAHAHAHAHAHA'},
  {img:'https://raw.githubusercontent.com/KaitoTheBuilder/Kingdom-Hearts/main/Polaroid/p6.png', cap:'p6', note:'ito talaga pinaka fav ko picture mo'}
];
wallPhotos.forEach(item=>{
  const card = document.createElement('div');
  card.className = 'hang-card';
  card.innerHTML = `<div class="clip"></div><div class="hang-photo"><div class="flip-inner"><img src="${item.img}" class="flip-front"><div class="flip-back"><p>${item.note}</p></div></div><span class="flip-hint">tap ↻</span></div>`;
  wallGrid.appendChild(card);
});

/* flip-to-reveal: tap a gallery or wall photo to see the note on the back */
document.addEventListener('click', e=>{
  const face = e.target.closest('.polaroid-photo, .hang-photo');
  if(face) face.classList.toggle('flipped');
});

/* confetti + wish counter -> duck reveal at 20 */
let wishCount = 0;
const WISH_TARGET = 20;
const wishHint = document.getElementById('wishHint');
const wishHints = {
  1:'make another, it can\'t hurt',
  5:'still wishing?',
  10:'halfway to something...',
  15:'almost there...',
  19:'one more.'
};
document.getElementById('confettiBtn').addEventListener('click', ()=>{
  for(let i=0;i<60;i++){
    const c = document.createElement('div');
    const colors = ['#D9A521','#C2185B','#8B0000','#E3AEB8'];
    c.style.cssText = `position:fixed; top:-10px; left:${Math.random()*100}vw; width:8px; height:14px;
      background:${colors[Math.floor(Math.random()*colors.length)]}; z-index:200; pointer-events:none;
      transform:rotate(${Math.random()*360}deg); border-radius:2px;`;
    document.body.appendChild(c);
    const duration = 2200+Math.random()*1800;
    c.animate([
      {transform:`translateY(0) rotate(0deg)`, opacity:1},
      {transform:`translateY(${innerHeight+40}px) rotate(${360+Math.random()*360}deg)`, opacity:.9}
    ], {duration, easing:'cubic-bezier(.4,.6,.6,1)'});
    setTimeout(()=>c.remove(), duration);
  }
  wishCount++;
  if(wishCount < WISH_TARGET){
    wishHint.textContent = wishHints[wishCount] || '';
  } else if(wishCount === WISH_TARGET){
    wishHint.textContent = '';
    document.getElementById('duckReveal').classList.add('show');
  }
});

/* music (both widget + taskbar controls) */
let ytPlayer = null;
let ytReady = false;
let playing = false;
function onYouTubeIframeAPIReady(){
  ytPlayer = new YT.Player('yt-player', {
    height:'2', width:'2', videoId:'W8a6TcbfGOg',
    playerVars:{ autoplay:0, controls:0 },
    events:{ onReady: ()=>{ ytReady = true; } }
  });
}
function toggleMusic(){
  if(!ytReady || !ytPlayer) return;
  if(playing){ ytPlayer.pauseVideo(); } else { ytPlayer.playVideo(); }
  playing = !playing;
  document.getElementById('reelL').classList.toggle('spin', playing);
  document.getElementById('reelR').classList.toggle('spin', playing);
  document.getElementById('widgetMusicBtn').textContent = playing ? '❚❚' : '▶';
  document.getElementById('taskbar-music').textContent = playing ? '❚❚' : '♪';
}
document.getElementById('widgetMusicBtn').addEventListener('click', toggleMusic);
document.getElementById('taskbar-music').addEventListener('click', toggleMusic);

/* duck easter egg */
const duckModal = document.getElementById('duckModal');
const duckInput = document.getElementById('duckInput');
const duckMsg = document.getElementById('duckMsg');
document.getElementById('duck-icon').addEventListener('click', ()=>{
  duckModal.classList.add('show'); duckInput.value=''; duckMsg.textContent='';
});
document.getElementById('duckClose').addEventListener('click', ()=>duckModal.classList.remove('show'));
document.getElementById('duckCancel').addEventListener('click', ()=>duckModal.classList.remove('show'));
document.getElementById('duckSubmit').addEventListener('click', tryDuck);
duckInput.addEventListener('keydown', e=>{ if(e.key==='Enter') tryDuck(); });
function tryDuck(){
  if(duckInput.value.trim().length && simpleHash(duckInput.value.trim()) === DUCK_HASH){
    duckModal.classList.remove('show');
    document.getElementById('futureModal').classList.add('show');
  } else {
    duckMsg.textContent = "The duck doesn't recognize that memory.";
  }
}
document.getElementById('futureClose').addEventListener('click', ()=>{
  document.getElementById('futureModal').classList.remove('show');
});
