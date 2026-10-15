// Heidelberg Blocks · Mannheim (v1.30-33, for Flax): loaded only when Kapitän Jupp takes you down the Neckar.
// build(H) writes the Quadratestadt into the shared voxel grid (the main file meshes it with the same blocks)
// and returns the props, the place names and the boat's arrival route. +x = east, +z = south, streets at y = TOWN.
export function build(H){
  const {THREE,set:set0,get,B,TOWN:T,WATER:W,blockyGeo,TS}=H;
  // v1.33 lit windows come in three moods at night (by place, not by dice, so the town stays the same): warm, curtained, TV blue
  const hsh=(x,y,z)=>{ const v=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453; return v-Math.floor(v); };
  const litV=(x,y,z)=>{ const h=hsh(x,y,z), tv=!((z>=84&&x<66)||z>=110); return h<.22?B.winCurt:tv&&h<.29?B.winTv:tv&&h<.36?B.winTv2:B.windowLit; };
  const set=(x,y,z,b)=>set0(x,y,z,b===B.windowLit?litV(x,y,z):b);
  const R=H.rngOf(1607);   // Mannheim got its town charter in 1607
  // ---- four new tiles in free atlas slots: asphalt, pavement slabs, verdigris copper, shop glass ----
  const g=H.atlasC.getContext('2d'), ge=H.emC.getContext('2d');
  const tile=(i,base,fn)=>{ const ox=(i%8)*TS, oy=Math.floor(i/8)*TS; g.fillStyle=base; g.fillRect(ox,oy,TS,TS);
    const px=(x,y,c)=>{ g.fillStyle=c; g.fillRect(ox+x,oy+y,1,1); }; fn(px,ox,oy); };
  const speck=(px,c,n)=>{ for(let k=0;k<n;k++) px(R()*TS|0,R()*TS|0,c); };
  const TL={asphalt:40,pave:41,copper:42,shop:43,shopLit:44,track:45,winCurt:46,winTv:47,winTv2:48};
  tile(TL.asphalt,'#5c5e62',px=>{ speck(px,'#6b6d71',40); speck(px,'#4d4f53',34); });
  tile(TL.pave,'#b9b3a7',px=>{ for(let k=0;k<TS;k++){ px(k,7,'#9c968b'); px(k,15,'#9c968b'); px(7,k<8?k:0,'#9c968b'); px(15,k>=8?k:8,'#9c968b'); } speck(px,'#c9c3b7',14); });
  tile(TL.copper,'#5f9e88',px=>{ for(let y=0;y<TS;y++) for(let x=0;x<TS;x+=4) px(x,y,'#4b8774'); speck(px,'#7dbca6',22); speck(px,'#3f7666',14); });
  const shop=(px)=>{ for(let y=1;y<TS;y++) for(let x=1;x<TS-1;x++) px(x,y,(x+y)%9===0?'#4a5f86':'#26324a'); for(let x=0;x<TS;x++) px(x,0,'#d8d2c4'); for(let y=0;y<TS;y++){ px(0,y,'#d8d2c4'); px(TS-1,y,'#d8d2c4'); px(8,y,'#bdb6a8'); } px(3,3,'#9fb4d6'); px(4,3,'#7d93b8'); };
  tile(TL.shop,'#26324a',shop); tile(TL.shopLit,'#26324a',shop);
  { const ox=(TL.shopLit%8)*TS, oy=Math.floor(TL.shopLit/8)*TS; ge.fillStyle='#ffd9a0'; ge.fillRect(ox+1,oy+1,7,TS-1); ge.fillRect(ox+9,oy+1,6,TS-1); }
  tile(TL.track,'#8f877a',px=>{ speck(px,'#6f675c',40); speck(px,'#aaa293',20); for(let y=1;y<TS;y+=4) for(let x=1;x<TS-1;x++) px(x,y,'#6b4a2e'); for(let y=0;y<TS;y++){ px(4,y,'#c8c8cc'); px(11,y,'#c8c8cc'); } });
  // v1.33 three window tiles copied from the plain window: curtains (pale fabric by day, an orange glow at night), two TV-blue ones
  const slot=i=>[(i%8)*TS,Math.floor(i/8)*TS], wt=slot(H.BL?H.BL[B.window].t:17), wimg=g.getImageData(wt[0],wt[1],TS,TS);
  for(const i of [TL.winCurt,TL.winTv,TL.winTv2]){ const [ox,oy]=slot(i); g.putImageData(wimg,ox,oy); }
  { const [ox,oy]=slot(TL.winCurt); g.fillStyle='#e8dcc8'; g.fillRect(ox+3,oy+2,2,12); g.fillRect(ox+11,oy+2,2,12); g.fillStyle='#c9b9a0'; g.fillRect(ox+4,oy+2,1,12); g.fillRect(ox+11,oy+2,1,12);
    ge.fillStyle='#ff9a3c'; ge.fillRect(ox+5,oy+2,3,5); ge.fillRect(ox+9,oy+2,2,5); ge.fillRect(ox+5,oy+8,3,6); ge.fillRect(ox+9,oy+8,2,6); ge.fillStyle='#8a4a1c'; ge.fillRect(ox+3,oy+2,2,12); ge.fillRect(ox+11,oy+2,2,12); }
  const tvPaint=(i,k,blu)=>{ const [ox,oy]=slot(i), c=`rgb(${(110+40*blu)*k|0},${(150+30*blu)*k|0},${255*k|0})`; ge.fillStyle='#000'; ge.fillRect(ox,oy,TS,TS); ge.fillStyle=c;
    ge.fillRect(ox+3,oy+2,5,5); ge.fillRect(ox+9,oy+2,4,5); ge.fillRect(ox+3,oy+8,5,6); ge.fillRect(ox+9,oy+8,4,6); };
  tvPaint(TL.winTv,.8,0); tvPaint(TL.winTv2,.7,1);
  H.atlas.needsUpdate=true; H.emTex.needsUpdate=true;
  if(!B.asphalt){ H.def('asphalt',TL.asphalt); H.def('pave',TL.pave); H.def('copper',TL.copper); H.def('shop',TL.shop); H.def('shopLit',TL.shopLit); H.def('track',TL.track); }
  if(!B.winCurt){ H.def('winCurt',TL.winCurt); H.def('winTv',TL.winTv); H.def('winTv2',TL.winTv2); }

  // ---- the plan ----
  const RIV={n:-99,s:-80};                    // the Neckar: water z -99..-80, quay walls at -100 and -79
  const AX={x0:-14,x1:-7,c:-10.5};            // Breite Straße (north of the Planken) / Kurpfalzstraße (south)
  const PLK={z0:18,z1:23};                    // the Planken
  const KR={x0:80,x1:87};                     // Kaiserring
  const WT={x:100.5,z:20.5};                  // Wasserturm on the Friedrichsplatz (v1.58 6 west, by the Kaiserring)
  const ROWW='KIHGFEDCBA', ROWE='UTSRQPONML';  // north (by the Neckar) to south (by the Schloss); there is no J (v1.61 fix: the I-squares are real, the J ones aren't)
  const rowZ=r=>-62+r*14+(r>=6?2:0);
  const QD=[];
  for(let r=0;r<10;r++) for(let n=1;n<=6;n++){
    const z0=rowZ(r), z1=z0+9, xe=-6+(n-1)*15, xw=-25-(n-1)*15;
    QD.push({code:ROWW[r]+n,x0:xw,x1:xw+10,z0,z1,r,n,w:1},{code:ROWE[r]+n,x0:xe,x1:xe+10,z0,z1,r,n,w:0}); }
  for(const q of QD){ if(q.code==='G1') q.sq='Marktplatz'; if(q.code==='O1') q.sq='Paradeplatz'; }
  const inR=(x,z,q,m)=>x>=q.x0-(m||0)&&x<=q.x1+(m||0)&&z>=q.z0-(m||0)&&z<=q.z1+(m||0);
  const SCH={x0:-85,x1:64,z0:96,z1:105,cx0:-24,cx1:3,w1:[-50,-43],w2:[22,29],wz0:84};   // the Schloss: main wing + Ehrenhof wings
  const HBF={x0:70,x1:124,z0:114,z1:125,hx0:89,hx1:105,vz0:96};                          // Hauptbahnhof + forecourt
  const FP={x0:88,x1:127,z0:-9,z1:50};                                                    // Friedrichsplatz (v1.58 was z -2..43)
  const BR={x0:-16,x1:-5};                                                                // Kurpfalzbrücke

  // ---- ground ----
  for(let x=-128;x<=127;x++) for(let z=-112;z<=143;z++){
    let top=T, b=B.asphalt;
    if(z>=RIV.n&&z<=RIV.s){ top=6; b=B.sand; }
    else if(z===RIV.s+1||z===RIV.n-1){ top=T; b=B.quay; }
    else if(z<RIV.n) b=(x+z)%7===0?B.stone:B.asphalt;
    else if(z>=-78&&z<=-71) b=B.cobble;
    else if(x>=FP.x0&&z>=FP.z0&&z<=FP.z1) b=B.grass;
    else if(x>=66&&z>=HBF.vz0&&z<HBF.z0) b=B.pave;
    else if(x>=66&&z>HBF.z1) b=B.track;
    else if(z>SCH.z1&&x<66) b=B.grass;
    else if(x<-108) b=B.grass;
    else if(x>=SCH.w1[1]+1&&x<=SCH.w2[0]-1&&z>=SCH.wz0&&z<=SCH.z0-1) b=B.gravel;
    else if(x>=SCH.x0&&x<=SCH.x1&&z>=SCH.wz0&&z<SCH.z0) b=B.cobble;
    for(let y=0;y<top-1;y++) set(x,y,z,z===RIV.s+1||z===RIV.n-1?B.quay:B.stone); set(x,top-1,z,b);
  }
  // sidewalks round every block, squares in cobbles
  for(const q of QD){ for(let x=q.x0;x<=q.x1;x++) for(let z=q.z0;z<=q.z1;z++) set(x,T-1,z,q.sq?B.cobble:B.pave); }
  // the Friedrichsplatz's paths, basin and water staircase: see v1.58 below

  // ---- the Neckar landing: steps for swimmers, bollards come as props ----
  const steps=[];
  const flight=(xa)=>{ for(let i=0;i<7;i++){ const x=xa+i; for(const z of [RIV.s+1,RIV.s+2]){ for(let y=W+i+1;y<T+3;y++) set(x,y,z,0); for(let y=0;y<=W+i;y++) set(x,y,z,B.quay); } } steps.push({x:xa+3,z:RIV.s+1}); };
  flight(26); flight(-62);

  // ---- Kurpfalzbrücke over the Neckar ----
  for(let x=BR.x0;x<=BR.x1;x++) for(let z=RIV.n;z<=RIV.s;z++){ set(x,T-2,z,B.stone); set(x,T-1,z,x===BR.x0+1||x===BR.x1-1?B.pave:B.asphalt); if(x===BR.x0||x===BR.x1){ set(x,T-1,z,B.stone); set(x,T,z,B.parapet); } }
  for(const z0 of [-94,-86]) for(let z=z0;z<z0+2;z++) for(let x=BR.x0+1;x<=BR.x1-1;x++) for(let y=0;y<T-2;y++) set(x,y,z,B.stone);

  // ---- houses ----
  const WALLS=[B.cream,B.ochre,B.pink,B.white,B.blue,B.cream,B.white,B.sandstone,B.ochre];
  const lit=()=>R()<.33?B.windowLit:B.window, shp=()=>R()<.4?B.shopLit:B.shop;
  const PKH=[];   // v1.65 every house's footprint, for the Planken shop fronts
  function block(x0,z0,x1,z1,floors,wall,roof){   // one house, ground floor shops, flat roof or a slate mansard
    const top=T+1+floors*3, man=roof!=null; PKH.push([x0,z0,x1,z1]);
    for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){
      const ex=x===x0||x===x1, ez=z===z0||z===z1;
      for(let y=T;y<top;y++){ let b=wall;
        if(ex||ez){ const along=ex?z-z0:x-x0, corner=ex&&ez;
          if(y<T+3){ if(corner) b=B.sandstone; else if(y===T&&along%4===2) b=B.door; else if(along%4===0) b=wall; else b=y===T?B.sandstone:shp(); }
          else if(y===T+3) b=B.trim;
          else { const yy=(y-T-4)%3; if(!corner&&yy===1&&along%2===1) b=lit(); } }
        set(x,y,z,b); }
      set(x,top,z,(ex||ez)?B.trim:B.gravel);
    }
    if(man) for(let k=1;k<=2;k++){ const xa=x0+k-1, xb=x1-k+1, za=z0+k-1, zb=z1-k+1; if(xa>xb||za>zb) break;
      for(let x=xa;x<=xb;x++) for(let z=za;z<=zb;z++){ const edge=x===xa||x===xb||z===za||z===zb; set(x,top+k,z,edge?(k===1&&(x+z)%3===0?B.window:roof):roof); } }
  }
  for(const q of QD){ if(q.sq) continue;
    const fx0=q.x0+1, fx1=q.x1-1, fz0=q.z0+1, fz1=q.z1-1;
    const cuts=[[4,4],[3,6],[6,3],[9],[5,4]][Math.floor(R()*5)];   // widths along x (9 in all)
    let x=fx0; for(let i=0;i<cuts.length;i++){ const xb=i===cuts.length-1?fx1:x+cuts[i]-1;
      block(x,fz0,xb,fz1,3+Math.floor(R()*3),WALLS[Math.floor(R()*WALLS.length)],R()<.45?(R()<.6?B.slate:B.roof):null); x=xb+1; } }
  // ---- v1.38 L2 (Flax): one house over the whole block, cream, flat roof. A bricked-up doorway on its west side
  // (x 10, z 70..71) is a ghost: index.html's solidAt lets you walk through it (w.ghost). Inside a quiet memorial hall
  // with a stone floor; a stone stair along the south + east walls climbs through a hatch onto the roof ----
  // v1.56 (Flax 08:57 "close the walk through possibility in L2. Keep L2 but close the way to enter"): the doorway is plain
  // brick again (ghost:null below), the hall and stair stay inside, sealed ----
  // v1.46 (Flax 18:25 "L2 please higher building"): six more storeys on top (HC = the old roof, now the hall ceiling, LT = the
  // new roof, 9 storeys in all, ~10 above the tallest neighbour). Built by hand, not with block(), so R() and the rest of
  // Mannheim stay exactly as they were. A second flight of floating steps runs once round the stairwell to the same roof hatch.
  const L2={x0:10,x1:18,z0:67,z1:74}, HC=T+10, LT=T+28, L2G=[10,10,T,T+2,70,71];   // ghost box: x0,x1,y0,y1,z0,z1
  for(let x=L2.x0;x<=L2.x1;x++) for(let z=L2.z0;z<=L2.z1;z++) for(let y=T;y<LT+8;y++) set(x,y,z,0);
  block(L2.x0,L2.z0,L2.x1,L2.z1,3,B.cream,null);
  for(let x=L2.x0+1;x<L2.x1;x++) for(let z=L2.z0+1;z<L2.z1;z++){ set(x,T-1,z,B.stone); for(let y=T;y<HC;y++) set(x,y,z,0); }
  for(let x=L2.x0;x<=L2.x1;x++) for(let z=L2.z0;z<=L2.z1;z++){ const ex=x===L2.x0||x===L2.x1, ez=z===L2.z0||z===L2.z1;
    for(let y=HC;y<LT;y++){ let b=0;
      if(ex||ez){ const along=ex?z-L2.z0:x-L2.x0, corner=ex&&ez; b=B.cream;
        if(y===HC||y===T+19) b=B.trim;   // belt courses: the old roof line and one more up
        else if(corner) b=B.sandstone;   // sandstone quoins up the corners
        else if(!corner&&(y-T-4)%3===1&&along%2===1) b=hsh(x,y,z)<.33?B.windowLit:B.window; }
      else if(y===HC) b=B.cream;   // the hall ceiling = the stairwell floor
      set(x,y,z,b); }
    set(x,LT,z,(ex||ez)?B.trim:B.gravel); }
  for(const [x,z] of [[L2.x0,L2.z0],[L2.x1,L2.z0],[L2.x0,L2.z1],[L2.x1,L2.z1]]) for(let y=T+4;y<HC;y++) set(x,y,z,B.sandstone);   // the quoins run down to the shops
  for(let y=T;y<=T+2;y++){ set(10,y,69,B.sandstone); set(10,y,72,B.sandstone); set(10,y,70,B.cream); set(10,y,71,B.cream); }
  const L2S=[[12,73],[13,73],[14,73],[15,73],[16,73],[17,73],[17,72],[17,71],[17,70],[17,69],[17,68]];   // 11 steps, the last one level with the roof
  L2S.forEach(([x,z],i)=>{ for(let y=T;y<=T+i;y++) set(x,y,z,y===T+i?B.sandstone:B.stone); });
  set(17,HC,71,0); set(17,HC,70,0); set(17,HC,69,0);   // the hatch into the stairwell
  // the stairwell: west along the north wall, south down the west wall, east along the south wall, north up the east wall,
  // one rise per step with flat landings at three corners and mid-south; the last step is level with the roof (y LT)
  const L2U=[]; for(let x=16;x>=11;x--) L2U.push([x,68]); for(let z=69;z<=73;z++) L2U.push([11,z]); for(let x=12;x<=17;x++) L2U.push([x,73]); for(let z=72;z>=68;z--) L2U.push([17,z]);
  let uh=HC; L2U.forEach(([x,z],i)=>{ if(!(i===5||i===10||i===13||i===16)) uh++; set(x,uh,z,B.sandstone); if(uh-1>HC) set(x,uh-1,z,B.stone); });
  set(17,LT,71,0); set(17,LT,70,0); set(17,LT,69,0);   // the roof hatch
  for(let x=L2.x0;x<=L2.x1;x++) for(let z=L2.z0;z<=L2.z1;z++) if(x===L2.x0||x===L2.x1||z===L2.z0||z===L2.z1) set(x,LT+1,z,B.parapet);   // a low parapet (no stepping over)
  for(let y=LT+1;y<=LT+3;y++){ set(11,y,73,B.sandstone); set(12,y,73,B.sandstone); } set(11,LT+4,73,B.trim); set(12,LT+4,73,B.trim);   // a chimney
  // Oststadt: two big blocks beyond the Kaiserring, south of the Friedrichsplatz
  block(90,48,104,62,4,B.cream,B.slate); block(110,48,124,62,5,B.ochre,null); block(90,68,104,86,4,B.white,B.roof); block(110,68,124,86,3,B.pink,B.slate);
  // north bank: harbour sheds and three silos
  for(const [xa,xb] of [[-124,-104],[-98,-78],[-40,-22],[90,120]]){ for(let x=xa;x<=xb;x++) for(let z=-111;z<=-105;z++){ const ex=x===xa||x===xb||z===-111||z===-105;
      for(let y=T;y<T+7;y++) set(x,y,z,ex&&y>T+1&&y<T+5&&(x+y)%3===0?B.window:B.castle);
      for(let k=0;k<4;k++){ if(z>=-111+k&&z<=-105-k) set(x,T+7+k,z,(z===-111+k||z===-105+k)?B.roofDark:B.roofDark); } } }
  for(const sx of [44,51,58]){ for(let x=sx-3;x<=sx+3;x++) for(let z=-111;z<=-105;z++){ const d=Math.hypot(x+.5-sx-.5,z+.5+107.5); if(d<=3.2) for(let y=T;y<T+18;y++) set(x,y,z,y===T+17?B.stone:B.white); } }

  // ---- the Wasserturm (red sandstone, copper dome) ----
  { const cx=WT.x, cz=WT.z, R0=(r,y0,y1,b,win)=>{ for(let x=Math.floor(cx-r-1);x<=cx+r+1;x++) for(let z=Math.floor(cz-r-1);z<=cz+r+1;z++){ const d=Math.hypot(x+.5-cx,z+.5-cz); if(d>r) continue;
        const rim=d>r-1.05; for(let y=y0;y<y1;y++) set(x,y,z,win&&rim&&win(x,y,z)?B.window:b); } };
    R0(9.6,T,T+1,B.trim); R0(8.4,T+1,T+2,B.trim);
    R0(7.6,T+2,T+7,B.sandstone,(x,y,z)=>y<T+5&&((x+z)&3)===0);
    R0(8.3,T+7,T+8,B.trim);
    R0(7,T+8,T+22,B.sandstone,(x,y,z)=>(y-T)%5===1&&((x*3+z)&3)===1);
    R0(8,T+22,T+23,B.trim); R0(7.4,T+23,T+24,B.trim);
    R0(6.2,T+24,T+27,B.sandstone,(x,y,z)=>y===T+25&&((x+z)&1)===0);
    const dome=[[6.4,0],[6,1],[5.4,2],[4.6,3],[3.6,4],[2.4,5],[1.2,6]]; for(const [r,k] of dome) R0(r,T+27+k,T+28+k,B.copper);
    R0(.8,T+34,T+36,B.trim); R0(.8,T+36,T+37,B.copper); }

  // ---- the Schloss: a long baroque front, mirror-symmetric about the Kurpfalzstraße (block x = -10.5) ----
  const SU=x=>Math.abs(x-AX.c)-.5, SCHP=[];   // 0 at the two middle columns, the same number on both sides
  function sch(x0,x1,z0,z1,h,roofK){
    for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ const ex=x===x0||x===x1, ez=z===z0||z===z1;
      for(let y=T;y<T+h;y++){ let b=B.cream;
        if(ex||ez){ const along=ez?SU(x):z-z0, yy=(y-T)%4;
          if(y===T||(ex&&ez)) b=B.sandstone; else if(yy===0) b=B.trim; else if(along%4===0) b=B.sandstone; else if(along%2===0&&yy<3) b=lit(); }
        set(x,y,z,b); }
      set(x,T+h,z,B.trim); }
    const K=roofK??3;
    for(let k=1;k<=K;k++) for(let x=x0+k-1;x<=x1-k+1;x++) for(let z=z0+k-1;z<=z1-k+1;z++){ const edge=x===x0+k-1||x===x1-k+1||z===z0+k-1||z===z1-k+1; set(x,T+h+k,z,edge&&k<3&&SU(x)%4===2?B.window:B.slate); }
  }
  sch(SCH.x0,SCH.x1,SCH.z0,SCH.z1,12);                                    // the long main front
  sch(SCH.x0,SCH.x0+11,SCH.z0-3,SCH.z1,14); sch(SCH.x1-11,SCH.x1,SCH.z0-3,SCH.z1,14);   // end pavilions
  sch(SCH.w1[0],SCH.w1[1],SCH.wz0,SCH.z0-1,12); sch(SCH.w2[0],SCH.w2[1],SCH.wz0,SCH.z0-1,12);   // the Ehrenhof wings
  sch(SCH.w1[0]-1,SCH.w1[1]+1,SCH.wz0,SCH.wz0+5,14); sch(SCH.w2[0]-1,SCH.w2[1]+1,SCH.wz0,SCH.wz0+5,14);   // their head pavilions
  sch(SCH.cx0,SCH.cx1,SCH.z0-3,SCH.z1,16);                                 // the corps de logis
  // the middle risalit: giant pilasters, tall windows, the main portal under a balcony, a pediment with the arms, a gable roof
  const RZ=SCH.z0-5, RX0=-19, RX1=-2;
  for(let x=RX0;x<=RX1;x++) for(let z=RZ;z<=SCH.z1;z++){ const u=SU(x), front=z===RZ, side=x===RX0||x===RX1;
    for(let y=T;y<T+17;y++){ let b=B.cream; const f=(y-T)%4;
      if(front||side){
        if(y===T||u===3||u===8) b=B.sandstone;
        else if(f===0) b=B.trim;
        else if(front&&u<=1){ b=y<T+3?B.door:y===T+3?B.trim:B.window; if(y>=T+5&&R()<.5) b=B.windowLit; }
        else if(front&&u===2&&y<T+4) b=B.sandstone;
        else if((u===5&&front)||(side&&(z-RZ)%3===1)) b=lit(); }
      set(x,y,z,b); }
    set(x,T+17,z,B.trim); }
  for(let k=0;k<=8;k++) for(let x=RX0+k;x<=RX1-k;x++) for(let z=RZ;z<=SCH.z1;z++){ const face=z===RZ||z===SCH.z1, rim=k===0||x===RX0+k||x===RX1-k;
    set(x,T+18+k,z,face?(rim?B.trim:B.cream):B.slate); }
  // the portico: four sandstone columns carrying the balcony
  for(const x of [-18,-14,-7,-3]){ for(let y=T;y<T+3;y++) set(x,y,RZ-2,B.sandstone); set(x,T+3,RZ-2,B.trim); }
  for(let x=-18;x<=-3;x++) for(const z of [RZ-2,RZ-1]){ set(x,T+4,z,B.trim); if(z===RZ-2||x===-18||x===-3) set(x,T+5,z,B.parapet); }
  SCHP.push([-10,T+21,RZ-.04]);   // the arms in the pediment (a board, below)
  // gate pillars where the Ehrenhof meets the Bismarckstraße
  for(const x0 of [-17,-5]) for(let x=x0;x<=x0+1;x++) for(let z=SCH.wz0;z<=SCH.wz0+1;z++){ for(let y=T;y<T+4;y++) set(x,y,z,y===T+3?B.trim:B.sandstone); }

  // ---- the Hauptbahnhof: a long cream front, a tall hall in the middle, platforms behind ----
  for(let x=HBF.x0;x<=HBF.x1;x++) for(let z=HBF.z0;z<=HBF.z1;z++){ const hall=x>=HBF.hx0&&x<=HBF.hx1, h=hall?16:9, ex=x===HBF.x0||x===HBF.x1||(hall&&(x===HBF.hx0||x===HBF.hx1)), ez=z===HBF.z0||z===HBF.z1;
    for(let y=T;y<T+h;y++){ let b=B.cream;
      if(ex||ez){ const yy=(y-T)%4;
        if(hall&&ez){ const a=(x-HBF.hx0)%6; if(y>=T+1&&y<T+11&&a>=2&&a<=4&&!(y===T+10&&a!==3)) b=y<T+3&&a===3?B.door:(R()<.3?B.windowLit:B.window); else if(y===T||y===T+11||y===T+15) b=B.trim; else if(a===0) b=B.sandstone; }
        else if(y===T||yy===0) b=B.sandstone; else if(x%3===1&&yy<3) b=lit(); }
      set(x,y,z,b); }
    set(x,T+h,z,B.trim); if(!hall&&x!==HBF.x0&&x!==HBF.x1&&z!==HBF.z0&&z!==HBF.z1) set(x,T+h+1,z,B.slate); }
  for(let k=1;k<=4;k++) for(let x=HBF.hx0+k;x<=HBF.hx1-k;x++) for(let z=HBF.z0+k;z<=HBF.z1-k;z++) set(x,T+16+k,z,B.slate);   // the hall's hipped roof
  for(let x=HBF.x0;x<=127;x+=1) for(let z=HBF.z1+3;z<=143;z+=5) if(x%18<14) set(x,T,z,B.trim);   // platforms (low kerbs)

  // ---- the Paradeplatz (O1): a stone pyramid fountain in a round basin, lime trees at the corners ----
  const PP={x:-.5,z:28.5};
  for(let x=-5;x<=4;x++) for(let z=24;z<=33;z++){ const d=Math.hypot(x+.5-PP.x,z+.5-PP.z); if(d>3.4) continue;
    if(d>2.45) set(x,T,z,B.quay); else set(x,T-1,z,B.blue); }
  for(let x=-2;x<=0;x++) for(let z=27;z<=29;z++) for(let y=T-1;y<T+2;y++) set(x,y,z,y===T+1&&(x!==-1||z!==28)?B.quay:B.stone);
  for(let y=T+2;y<T+7;y++) set(-1,y,28,y===T+6?B.bronze:B.stone);
  // ---- v1.48 (Flax 00:45 "give mannheim a make over"): the Altes Rathaus and St. Sebastian, a town hall and a church joined by one
  // bell tower (foundation stone 1700, done by 1713), and the Marktplatzbrunnen. Really the pair stands on the south edge of the
  // Marktplatz inside G1; ours stands across the lane in F1 so the little square stays open. Seen from the square the Rathaus is on
  // the left (east, by the Breite Straße) and the church on the right. Built over F1's houses after they were made and with no R(),
  // so every other house, tree and container in Mannheim stays exactly where it was.
  for(let x=-25;x<=-15;x++) for(let z=-5;z<=2;z++){ set(x,T-1,z,B.pave); for(let y=T;y<T+36;y++) set(x,y,z,0); }
  const rhBox=(x0,x1,z0,z1,y0,y1,b)=>{ for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) for(let y=y0;y<=y1;y++) set(x,y,z,b); };
  rhBox(-25,-22,-5,2,T,T+11,B.ochre); rhBox(-18,-15,-5,2,T,T+11,B.ochre);   // the church wing (west), the Rathaus wing (east)
  rhBox(-21,-19,-2,2,T,T+7,B.ochre); rhBox(-21,-19,-5,-3,T,T+19,B.ochre);   // a lower link behind, the bell tower in the middle
  // one face: cells in order along it, rule(i,f,n) picks the block at height f (null keeps the ochre, 'L' = a window that may be lit;
  // set0 skips the curtain/TV moods, nobody watches TV in the Rathaus)
  const rhRun=(x0,z0,x1,z1)=>{ const c=[]; for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) c.push([x,z]); return c; };
  const rhFace=(cells,f0,f1,rule)=>cells.forEach(([x,z],i)=>{ for(let f=f0;f<=f1;f++){ let b=rule(i,f,cells.length); if(b==null) continue;
    if(b==='L') b=hsh(x,T+f,z)<.35?B.windowLit:B.window; (b===B.windowLit?set0:set)(x,T+f,z,b); } });
  const qn=(i,n)=>i===0||i===n-1, belt=f=>f===3||f===11;
  const rhStd=win=>(i,f,n)=>qn(i,n)||f===0?B.sandstone:belt(f)?B.trim:win(i)&&(f===1||f===2||f===4||f===5||f===8||f===9)?'L':null;
  // the Rathaus: three storeys of paired windows; on the square a portal, and Justitia in a niche up top. Quoins only on the outer
  // corners, belts at the ground floor and the cornice (more ochre, less red)
  rhFace(rhRun(-15,-5,-15,2),0,11,rhStd(i=>i===1||i===3||i===4||i===6));
  rhFace(rhRun(-18,2,-15,2),0,11,rhStd(i=>i===1||i===2));
  rhFace(rhRun(-18,-2,-18,2),8,11,(i,f)=>f===11?B.trim:(f===8||f===9)&&(i===1||i===3)?'L':null);
  rhFace(rhRun(-18,-5,-15,-5),0,11,(i,f)=>i===3?B.sandstone:i===0?(f===0?B.sandstone:belt(f)?B.trim:null):f<=2?B.door:belt(f)?B.trim:f===4||f===5?'L':f===8||f===9?0:null);
  // St. Sebastian: tall church windows down the side lane, the same front as the Rathaus (Mannheim likes its symmetry), Pietas in the niche
  rhFace(rhRun(-25,-5,-25,2),0,11,(i,f,n)=>qn(i,n)||f===0?B.sandstone:f===3||f===11?B.trim:(i===2||i===5)?(f===10?B.sandstone:f!==3?B.window:null):null);
  rhFace(rhRun(-25,2,-22,2),0,11,(i,f,n)=>qn(i,n)||f===0?B.sandstone:f===3||f===11?B.trim:(i===1||i===2)&&f>=4?(f===10?B.sandstone:B.window):null);
  rhFace(rhRun(-22,-2,-22,2),8,11,(i,f)=>f===11?B.trim:(f===8||f===9)&&(i===1||i===3)?B.window:null);
  rhFace(rhRun(-25,-5,-22,-5),0,11,(i,f)=>i===0?B.sandstone:i===3?(f===0?B.sandstone:belt(f)?B.trim:null):f<=2?B.door:belt(f)?B.trim:f>=4&&f<=6?B.window:f===8||f===9?0:null);
  // the link behind the tower: two storeys, a flat roof
  rhFace(rhRun(-21,2,-19,2),0,7,(i,f)=>f===0?B.sandstone:f===3||f===7?B.trim:i===1&&(f===1||f===2||f===4||f===5)?'L':null);
  for(let x=-21;x<=-19;x++) for(let z=-2;z<=1;z++) set(x,T+7,z,B.gravel);
  // the tower: a portal, the plaque, two windows, the clock above the roofs (boards), an open belfry with its bell (props), then the helm
  const twr=(i,f,n)=>qn(i,n)?B.sandstone:belt(f)||f===16||f===19?B.trim:i===1&&(f===17||f===18)?0:null;
  rhFace(rhRun(-21,-5,-19,-5),0,19,(i,f,n)=>i===1&&f<=2?B.door:i===1&&(f===8||f===9)?B.window:f===0&&!qn(i,n)?B.sandstone:twr(i,f,n));
  rhFace(rhRun(-19,-5,-19,-3),12,19,twr); rhFace(rhRun(-21,-5,-21,-3),12,19,twr);
  rhFace(rhRun(-21,-3,-19,-3),8,19,(i,f,n)=>i===1&&(f===8||f===9)?B.window:twr(i,f,n));
  set(-20,T+17,-4,0); set(-20,T+18,-4,0);
  for(let x=-21;x<=-19;x++) for(let z=-5;z<=-3;z++) set(x,T+20,z,B.slate);
  // roofs: a steep gable over the church (its end faces the square), a slate mansard with dormers over the Rathaus
  for(let x=-25;x<=-22;x++) for(let z=-5;z<=2;z++){ const end=z===-5||z===2, rim=x===-25||x===-22;
    set(x,T+12,z,end?(rim?B.trim:B.ochre):B.roofDark); if(!rim) set(x,T+13,z,end?B.trim:B.roofDark); }
  for(let x=-18;x<=-15;x++) for(let z=-5;z<=2;z++){ const edge=x===-18||x===-15||z===-5||z===2; set(x,T+12,z,edge&&(x+z)%3===0?B.window:B.slate);
    if(x>-18&&x<-15&&z>-5&&z<2) set(x,T+13,z,B.slate); }
  // ---- v1.48 the Marktplatzbrunnen in the middle of G1: a red sandstone rim you can't step over (the real one has a railing),
  // water, a stone base with four spouts; the figures are props (below) ----
  const MB={x:-19.5,z:-15.5};
  for(let x=-24;x<=-15;x++) for(let z=-20;z<=-11;z++){ const d=Math.hypot(x+.5-MB.x,z+.5-MB.z); if(d>3.4) continue; if(d>2.45) set(x,T,z,B.parapet); else set(x,T-1,z,B.blue); }
  for(let x=-21;x<=-19;x++) for(let z=-17;z<=-15;z++) for(let y=T-1;y<=T+1;y++) set(x,y,z,y===T+1&&(x!==-20||z!==-16)?B.quay:B.stone);

  // ---- v1.49 (Flax's Mannheim makeover, step two) the Jesuitenkirche: Alessandro Galli da Bibiena's design, foundation stone 1733,
  // consecrated 1760, modelled on Il Gesù in Rome; burned out in the air raids, rebuilt and consecrated again in 1960. A two-tower front
  // of red sandstone facing east, plain light long sides, an octagonal dome over the crossing. Really it fills part of A4 (about 74 x 29 m,
  // the Jesuit college had the rest); ours takes A4 and A5 and the lane between them, so the dome has room and the plan keeps its 5:2.
  // Built over the houses after they were made and with no R(), like the Rathaus. In through the middle portal: pews, the high altar,
  // and up into the dome, white inside (Asam's frescoes were not painted again after the war).
  const JK={x0:-84,x1:-61,z0:66,z1:74,cx:-75.5,cz:70.5};
  const jkO=(x,z)=>{ const a=Math.abs(x+.5-JK.cx), b=Math.abs(z+.5-JK.cz); return Math.max(a,b,(a+b)*.7071); };   // octagon radius of a cell round the crossing
  for(let x=JK.x0;x<=JK.x1;x++) for(let z=JK.z0;z<=JK.z1;z++){ set(x,T-1,z,B.stone); for(let y=T;y<T+45;y++) set(x,y,z,0); }
  for(let x=-74;x<=-71;x++) set(x,T-1,75,B.pave);   // where the lane met the Bismarckstraße: pavement now
  rhBox(JK.x0,-64,JK.z0,JK.z1,T,T+13,B.cream);   // nave, crossing and choir in one long box (light plaster)
  rhBox(-63,-61,69,71,T,T+19,B.sandstone); rhBox(-63,-61,66,68,T,T+24,B.sandstone); rhBox(-63,-61,72,74,T,T+24,B.sandstone);   // the front: middle + two towers
  // the long sides: plain plaster between sandstone pilasters, a small window and a tall one in every bay, the main cornice
  const jkSide=(i,f)=>f===13?B.trim:f===0||i%4===0?B.sandstone:i%4===2&&(f===1||f===2||(f>=5&&f<=10))?B.window:null;
  rhFace(rhRun(JK.x0,JK.z0,-64,JK.z0),0,13,jkSide); rhFace(rhRun(JK.x0,JK.z1,-64,JK.z1),0,13,jkSide);
  rhFace(rhRun(JK.x0,JK.z0,JK.x0,JK.z1),0,13,(i,f,n)=>f===13?B.trim:f===0||qn(i,n)?B.sandstone:(i===2||i===6)&&f>=4&&f<=10?B.window:null);   // the choir end (the high altar stands against it inside)
  // the towers: belts at the porch, the main cornice and the belfry, windows on the outer faces, an open belfry, the cap
  const jkTw=win=>(i,f)=>f===0?B.sandstone:f===6||f===13||f===19||f===24?B.trim:i===1&&f>=20&&f<=22?0:win&&i===1&&((f>=8&&f<=10)||(f>=15&&f<=17))?B.window:null;
  for(const [za,zb] of [[66,68],[72,74]]){
    rhFace(rhRun(-61,za,-61,zb),0,24,jkTw(1)); rhFace(rhRun(-63,za,-63,zb),13,24,jkTw(0));
    rhFace(rhRun(-63,za,-61,za),0,24,jkTw(za===66)); rhFace(rhRun(-63,zb,-61,zb),0,24,jkTw(zb===74));
    for(let f=20;f<=22;f++) set(-62,T+f,za+1,0);
    rhBox(-63,-61,za,zb,T+24,T+24,B.trim); }
  // the middle: three round-arched portals (the arches are props), a tall window, the upper storey, a small pediment
  rhFace(rhRun(-61,69,-61,71),0,21,(i,f)=>f<=2?(i===1?0:B.door):f===6||f===13||f===19||f===20?B.trim:f===21?(i===1?B.trim:null):i===1&&f>=8&&f<=11?B.window:null);
  rhBox(-63,-62,69,71,T+20,T+20,B.trim); set(-62,T+21,70,B.trim); set(-63,T+21,70,B.trim);
  // the roof: a long slate gable, the choir end closed in plaster
  for(let x=JK.x0;x<=-64;x++) for(let k=0;k<=4;k++){ const y=T+14+k, za=JK.z0+k, zb=JK.z1-k;
    for(let z=za;z<=zb;z++){ if(z===za||z===zb) set(x,y,z,B.slate); else if(x===JK.x0) set(x,y,z,B.cream); } }
  // inside: one hall under a white ceiling, a porch behind the portals, the choir a step up
  rhBox(-83,-64,67,73,T,T+12,0); rhBox(-63,-62,69,71,T,T+5,0);
  for(let x=-83;x<=-64;x++) for(let z=67;z<=73;z++) set(x,T+13,z,B.white);
  rhBox(-83,-81,67,73,T,T,B.quay);
  // the crossing: an octagonal drum on the walls (windows all round), the cornice level with the towers' (raised to match them in the
  // rebuild), the dome in two skins (copper outside, white inside), a lantern
  for(let x=-81;x<=-71;x++) for(let z=65;z<=75;z++){ const o=jkO(x,z), a=Math.abs(x+76), b=Math.abs(z-70);
    if(o<=3.45) set(x,T+13,z,0);
    for(let f=14;f<=23;f++){ if(o<=3.45) set(x,T+f,z,0); else if(o<=4.45){ const ax=Math.max(a,b)===4&&Math.min(a,b)===0, dg=a===3&&b===3;
      set(x,T+f,z,f===14||f===23?B.trim:(ax||dg)&&f>=16&&f<=20?B.window:Math.max(a,b)===4&&Math.min(a,b)===2?B.sandstone:B.cream); } }
    if(o<=5) set(x,T+24,z,o<=3.45?0:B.trim); }
  [4.45,4.4,4.2,3.9,3.45,2.9,2.2,1.45].forEach((r,j)=>{ for(let x=-81;x<=-71;x++) for(let z=65;z<=75;z++){ const o=jkO(x,z); if(o<=r) set(x,T+25+j,z,o>r-1?B.copper:o>r-2?B.white:0); } });
  for(let x=-77;x<=-75;x++) for(let z=69;z<=71;z++){ const mid=Math.abs(x+76)+Math.abs(z-70)===1;
    for(let f=33;f<=35;f++) set(x,T+f,z,f===35?B.trim:mid?B.window:B.cream); set(x,T+36,z,B.copper); }
  set(-76,T+37,70,B.copper);

  // ---- v1.58 (Flax 10:18 "Friedrichsplatz way to squeezed. way bigger waterplays") the Friedrichsplatz with room round the tower.
  // Real (Bruno Schmitz, 1899-1903, done for Mannheim's 300th birthday in 1907): the Wasserturm stands at the west end by the
  // Kaiserring; from its terrace a water staircase runs down into a long basin with the big fountain (it first played on
  // 9 September 1893); pergolas flank the steps and curve out into the park; a wide path circles the basin and the tower; two red
  // sandstone arcade houses with turrets curve round the east end, the Augustaanlage leaves between them; the Rosengarten faces the
  // tower from the north and the Kunsthalle (Hermann Billing, 1907) from the south. Ours: the tower moved 6 west (WT), the
  // Rosengarten 7 north, the Kunsthalle 7 south (narrower, no back wing), the arcades follow a flattened oval because the map ends
  // at x 127, and the park stays level with the street (really it lies lower). Built after the houses and with no R(); the tree
  // trunk cells stay free (tree() skips a taken cell and the dice shift).
  for(let x=88;x<=127;x++) for(let z=-30;z<=64;z++){
    if(Math.hypot(x+.5-WT.x,z+.5-WT.z)>=10.3) for(let y=T;y<=T+30;y++) set(x,y,z,0);
    set(x,T-1,z,z>=FP.z0&&z<=FP.z1?B.grass:B.asphalt); }
  const BAS={x0:113,x1:121,z0:1,z1:40};   // the big basin (was x 120..124 z 3..38), round corners: basD > 1 water, 0..1 the rim, < 0 outside
  const basD=(x,z)=>{ const cx=Math.min(Math.max(x+.5,BAS.x0+3),BAS.x1-2), cz=Math.min(Math.max(z+.5,BAS.z0+3),BAS.z1-2); return 3-Math.hypot(x+.5-cx,z+.5-cz); };
  const FF=[[100.5,-.5],[100.5,41.5]];   // the two round fountains on the tower's cross axis (were 106.5, 2.5 / 38.5)
  // the arcades' front: a flattened oval |u/a|^4 + |v/b|^4 = 1 round (AC.x, AC.z), only its east end (x >= 114) is built.
  // acS = roughly the distance out from the front, acL = the length along the front from the axis, acAt(L) = that point + its normal
  const AC={x:109,z:20.5,a:15,b:30.5}, ACD=7;
  const acR=(u,v)=>Math.pow(Math.pow(Math.abs(u)/AC.a,4)+Math.pow(Math.abs(v)/AC.b,4),.25);
  const acS=(px,pz)=>{ const u=px-AC.x, v=pz-AC.z, e=.01; return (acR(u,v)-1)/Math.hypot((acR(u+e,v)-acR(u-e,v))/(2*e),(acR(u,v+e)-acR(u,v-e))/(2*e)); };
  const ACT=[0]; { let pu=AC.a, pv=0; for(let k=1;k<=2000;k++){ const t=k/2000*Math.PI/2, u=AC.a*Math.sqrt(Math.cos(t)), v=AC.b*Math.sqrt(Math.sin(t)); ACT.push(ACT[k-1]+Math.hypot(u-pu,v-pv)); pu=u; pv=v; } }
  const acL=(px,pz)=>{ const f=Math.atan2(((pz-AC.z)/AC.b)**2,((px-AC.x)/AC.a)**2)/(Math.PI/2)*2000, k=Math.min(1999,Math.floor(f)); return ACT[k]+(ACT[k+1]-ACT[k])*(f-k); };
  const acAt=L=>{ let lo=0, hi=2000; while(hi-lo>1){ const m=(lo+hi)>>1; if(ACT[m]<L) lo=m; else hi=m; }
    const t=hi/2000*Math.PI/2, u=AC.a*Math.sqrt(Math.cos(t)), v=AC.b*Math.sqrt(Math.sin(t)), nx=u**3/AC.a**4, nz=v**3/AC.b**4, n=Math.hypot(nx,nz); return {u,v,nx:nx/n,nz:nz/n}; };
  // the gardens' ground: gravel paths (the north-south axis from the Rosengarten to the Kunsthalle, across through the round
  // fountains, along the Kaiserring, the wide path round the basin), a paved terrace round the tower, a ring of flower beds
  for(let x=88;x<=123;x++) for(let z=FP.z0;z<=FP.z1;z++){ const bd=basD(x,z); if(bd>=0) continue;
    if(Math.abs(x+.5-WT.x)<1.51||(x<=112&&(Math.abs(z+.5-FF[0][1])<1.51||Math.abs(z+.5-FF[1][1])<1.51))||x===88||bd>=-2) set(x,T-1,z,B.gravel); }
  for(let x=88;x<=114;x++) for(let z=4;z<=37;z++){ const ux=x+.5-WT.x, uz=z+.5-WT.z, d=Math.hypot(ux,uz);
    if(d<12.5) set(x,T-1,z,B.pave);
    else if(d<14.2&&x>88&&Math.abs(Math.atan2(uz,ux))>.7&&Math.abs(ux)>=1.51&&Math.abs(uz)>=2.5) set(x,T-1,z,d<13.35?B.leavesR:B.leavesY); }
  for(let x=100;x<=118;x++) for(let z=0;z<=41;z++){ const ux=x+.5-WT.x, uz=Math.abs(z+.5-WT.z), d=Math.hypot(ux,uz), a=Math.atan2(uz,ux)*180/Math.PI;
    if(d>=14&&d<16.6&&a>=44&&a<=84&&basD(x,z)<0) set(x,T-1,z,B.gravel); }   // the floor under the two pergolas
  for(const [cx,cz] of FF) for(let x=94;x<=107;x++) for(let z=Math.floor(cz)-6;z<=Math.floor(cz)+6;z++){ const d=Math.hypot(x+.5-cx,z+.5-cz);
    if(d<3.2){ set(x,T-1,z,B.blue); if(d<.8){ set(x,T,z,B.trim); set(x,T+1,z,B.trim); } }
    else if(d<4.1) set(x,T,z,B.trim);
    else if(d<5.7&&Math.abs(x+.5-cx)>=2&&Math.abs(z+.5-cz)>=1.51) set(x,T-1,z,(z+.5<cz)===(x+.5<cx)?B.leavesR:B.leavesY); }
  // the street round the park in front of the arcades, the Augustaanlage between them
  for(let x=108;x<=127;x++) for(let z=-12;z<=53;z++){ const s=acS(x+.5,z+.5); if(s>=-3&&s<0&&basD(x,z)<0) set(x,T-1,z,B.cobble); }
  for(let x=124;x<=127;x++) for(let z=17;z<=23;z++) set(x,T-1,z,z===17||z===23?B.pave:B.asphalt);
  // the basin: a low red rim, open on the west where the water staircase comes down
  for(let x=BAS.x0;x<=BAS.x1;x++) for(let z=BAS.z0;z<=BAS.z1;z++){ const d=basD(x,z); if(d<0) continue;
    if(d>=1||(x===BAS.x0&&z>=16&&z<=24)) set(x,T-1,z,B.blue); else set(x,T,z,B.trim); }
  // the Wassertreppe: two terraces step down from the tower's terrace into the basin (their water and the jets are meshes, see 'jets')
  for(let z=15;z<=25;z++){ const sd=z===15||z===25;
    for(let x=109;x<=110;x++) for(let y=T;y<=T+(sd?2:1);y++) set(x,y,z,B.trim);
    for(let x=111;x<=112;x++) for(let y=T;y<=T+(sd?1:0);y++) set(x,y,z,B.trim); }

  // the arcade houses: band 0 = the front on pillars with round-headed arches, 1 = the walk under them, 2 = the shop fronts,
  // 3..5 the houses, 6 the back. Turrets by the Augustaanlage (|v| <= 10) and at the far ends (x < 120) with stepped copper caps,
  // a slate mansard between. The end walls and the walls facing the Augustaanlage get windows, the walk opens out through them.
  const FIN={};
  for(let x=114;x<=127;x++) for(let z=-22;z<=63;z++){ const v=z+.5-AC.z, av=Math.abs(v); if(av<3.5) continue;
    const s=acS(x+.5,z+.5); if(s<0||s>=ACD) continue;
    const bd=Math.floor(s), i=Math.floor(acL(x+.5,z+.5)-3.5), tA=av<10.5?Math.min(av-4,10-av):x<120?Math.min(x-114,119-x):-1, tur=tA>=0, top=tur?19:15;
    const side=x===114||av===4, win=f=>hsh(x,T+f,z)<.35?B.windowLit:B.window, cor=f=>f===3||f===8||f===12||f===top||(tur&&f===16);
    set(x,T-1,z,B.pave);
    for(let f=0;f<=top;f++){ let b=B.sandstone;
      if(side&&bd>=1){ if(bd===1&&f<=3) b=0; else if(cor(f)) b=B.trim; else if(f>=5&&(f%4===1||f%4===2)&&(bd===2||bd===4)) b=win(f); else if(f<=2&&(bd===3||bd===5)) b=f===0?B.sandstone:B.shop; }
      else if(bd===0){ const p=i%4===0||side;
        if(f<=2) b=p?B.sandstone:f<2||i%4===2?0:B.sandstone;
        else if(cor(f)) b=B.trim;
        else if(!p&&(tur||i%4!==2)&&(f%4===1||f%4===2)) b=win(f); }
      else if(bd===1) b=f<=3?0:B.sandstone;
      else if(bd===2){ if(f<=2) b=i%4===0?B.sandstone:f===2?B.trim:f===0&&i%4===2&&(i>>2)%2?B.door:hsh(x,f,z)<.5?B.shopLit:B.shop; }
      else if(bd===ACD-1){ if(f===0) b=B.sandstone; else if(cor(f)) b=B.trim; else if((f%4===1||f%4===2)&&i%2===1) b=win(f); }
      set(x,T+f,z,b); }
    if(tur){ const ins=Math.min(tA,bd,ACD-1-bd), key=(av<10.5?'g':'e')+(v<0?'n':'s');
      for(let k=0;k<=ins;k++) set(x,T+20+k,z,B.copper);
      if(!FIN[key]||ins>FIN[key][3]) FIN[key]=[x+.5,T+21+ins,z+.5,ins]; }
    else { const rb=Math.min(bd,ACD-1-bd); for(let k=1;k<=rb;k++) set(x,T+15+k,z,k===1&&bd===1&&i%4===2?B.window:B.slate); } }

  // the Rosengarten facing the tower from the north: red sandstone, a roof of green glazed tiles, the Musensaal's great arched window
  for(let x=88;x<=112;x++) for(let z=-14;z<=-10;z++) set(x,T-1,z,B.pave);
  rhBox(90,110,-27,-15,T,T+11,B.sandstone);
  rhBox(95,105,-16,-14,T,T+15,B.sandstone);
  rhBox(90,93,-18,-15,T,T+15,B.sandstone); rhBox(107,110,-18,-15,T,T+15,B.sandstone);
  const rgW=(i,f,n)=>f===0||qn(i,n)?B.sandstone:f===3||f===11?B.trim:i%3===0?(f>=4?B.trim:null):(f===1||f===2||(f>=5&&f<=9))?'L':null;
  rhFace(rhRun(94,-15,94,-15).concat(rhRun(106,-15,106,-15)),0,11,(i,f)=>f===3||f===11?B.trim:f>=5&&f<=9?'L':null);
  for(const x of [90,110]) rhFace(rhRun(x,-26,x,-19),0,11,rgW);
  rhFace(rhRun(91,-27,109,-27),0,11,rgW);
  for(const [a,b] of [[90,93],[107,110]]){ const tw=(i,f)=>f===0||f===3||f===11||f===15?(f===0?B.sandstone:B.trim):f<3?null:(i===1||i===2)&&((f>=5&&f<=9)||f===13||f===14)?'L':null;
    rhFace(rhRun(a,-15,b,-15),0,15,tw); rhFace(rhRun(a===90?90:110,-18,a===90?90:110,-15),0,15,tw); }
  rhFace(rhRun(95,-14,105,-14),0,15,(i,f)=>{ const a=Math.hypot(i-5,Math.max(0,f-11));
    if(f<=2) return i===0||i===10?B.sandstone:i%2===1?B.door:null;
    if(f===3||f===15) return B.trim;
    if(i>=2&&i<=8&&f>=5&&(f<=11||a<=3.5)) return i===2||i===8||(f>11&&a>2.55)?B.trim:B.windowLit;
    return null; });
  for(let k=0;k<4;k++) for(let x=96+k;x<=104-k;x++) for(let z=-15;z<=-14;z++) set(x,T+16+k,z,x===96+k||x===104-k?B.trim:B.sandstone);
  set(100,T+20,-14,B.copper);
  for(let k=0;k<5;k++) for(let x=90+k;x<=110-k;x++) for(let z=-27+k;z<=-15-k;z++) if(!get(x,T+12+k,z)) set(x,T+12+k,z,B.copper);
  for(const a of [90,107]){ rhBox(a,a+3,-18,-15,T+16,T+16,B.copper); rhBox(a+1,a+2,-17,-16,T+17,T+17,B.copper); }

  // the Kunsthalle facing it from the south: Billing's red sandstone front, a dome over the entrance hall
  for(let x=88;x<=112;x++) for(let z=51;z<=64;z++) set(x,T-1,z,z<=63?B.pave:B.grass);
  rhBox(89,111,55,63,T,T+8,B.sandstone);
  rhBox(95,105,54,63,T,T+11,B.sandstone); rhBox(89,91,54,63,T,T+9,B.sandstone); rhBox(109,111,54,63,T,T+9,B.sandstone);
  rhBox(92,108,56,62,T+8,T+8,B.slate);
  const khW=(i,f)=>f===0?B.sandstone:f===4||f===8?B.trim:i%3===1&&((f>=1&&f<=3)||f===6)?B.window:null;
  rhFace(rhRun(92,55,94,55).concat(rhRun(106,55,108,55)),0,8,khW);
  for(const x of [89,111]) rhFace(rhRun(x,55,x,63),0,8,khW);
  rhFace(rhRun(90,63,110,63),0,8,khW);
  rhFace(rhRun(89,54,91,54).concat(rhRun(109,54,111,54)),0,9,(i,f)=>f===0?B.sandstone:f===4||f===9?B.trim:i===1&&((f>=1&&f<=3)||(f>=5&&f<=7))?B.window:null);
  rhFace(rhRun(95,54,105,54),0,11,(i,f)=>{ if(i>=4&&i<=6&&(f<=2||(f===3&&i===5))) return 0;
    if(f===4||f===11) return B.trim; if(f>=7&&f<=10&&i%2===0&&i>0&&i<10) return B.window; return null; });
  for(let x=99;x<=101;x++) for(let f=0;f<=2;f++) set(x,T+f,55,B.door); set(100,T+3,55,B.door);
  { const cx=100.5, cz=58.5, rr=(r,y,b,win)=>{ for(let x=95;x<=105;x++) for(let z=53;z<=64;z++){ const d=Math.hypot(x+.5-cx,z+.5-cz); if(d<=r) set(x,y,z,win&&d>r-1.05&&((x+z)&1)?B.window:b); } };
    rr(3.7,T+12,B.sandstone,1); rr(3.7,T+13,B.sandstone); rr(4.2,T+14,B.trim);
    [[3.9,15],[3.6,16],[3.1,17],[2.4,18],[1.5,19]].forEach(([r,f])=>rr(r,T+f,B.copper)); rr(.8,T+20,B.trim); rr(.8,T+21,B.copper); }

  // ---- v1.51 (Flax) the Barockschloss the way it looks since the 2005-07 restoration: yellow plaster, red sandstone frames.
  // Real: begun 1720 by Elector Carl Philipp after he moved his court from Heidelberg (the quarrel over the Heiliggeistkirche),
  // done about 1760, almost 450 m long round the Ehrenhof; the Rittersaal in the Mittelbau, Asam's ceiling (1728-30) lost in
  // 1943-44 and painted again by Carolus Vocke in the 1960s; today the University. Ours: the long front stays 150 blocks, the
  // Ehrenhof stays shallow (the Bismarckstrasse and the A row on one side, the Schlossgarten on the other), the plain stretches
  // lose their giant pilasters (pavilions and the corps keep them), and a smaller Rittersaal fills the middle risalit upstairs
  // under an original painted sky (not Asam's or Vocke's fresco). Two new tiles, painted by place (no dice, the town stays put).
  { const hp=i=>{ const v=Math.sin(i*91.345+7.13)*43758.5453; return v-Math.floor(v); };
    tile(36,'#f4d27c',px=>{ for(let i=0;i<TS*TS;i++){ const h=hp(i); if(h<.1) px(i%TS,i/TS|0,'#e8c46c'); else if(h>.93) px(i%TS,i/TS|0,'#fae2a4'); } });
    tile(37,'#c26850',px=>{ for(let i=0;i<TS*TS;i++){ const x=i%TS, y=i/TS|0, h=hp(i+400); if(y===TS-1) px(x,y,'#ad5a44'); else if(h<.1) px(x,y,'#b55f48'); else if(h>.92) px(x,y,'#cf785e'); } });
    tile(38,'#f8f1e3',px=>{ for(let i=0;i<TS*TS;i++){ const h=hp(i+900); if(h<.08) px(i%TS,i/TS|0,'#efe5d2'); else if(h>.95) px(i%TS,i/TS|0,'#fdf9f0'); } });   // stucco for the rooms
    H.atlas.needsUpdate=true; if(!B.schYel){ H.def('schYel',36); H.def('schRed',37); H.def('stucco',38); } }
  { const winAt=(x,y,z)=>set(x,y,z,hsh(x+.31,y,z+.17)<.33?B.windowLit:B.window);
    const isWin=b=>b===B.window||b===B.windowLit||b===B.winCurt||b===B.winTv||b===B.winTv2;
    // the plain stretches of the long front: a window every two blocks, cream between, red only at the base and the cornice
    const pav=x=>x<=SCH.x0+11||x>=SCH.x1-11||(x>=SCH.cx0&&x<=SCH.cx1);
    const plain=(x,z,along,ox,oz)=>{ for(let y=T+1;y<T+12;y++){ const b=get(x,y,z); if((b!==B.sandstone&&b!==B.trim)||get(x+ox,y,z+oz)) continue;
      const yy=(y-T)%4; if((yy===1||yy===2)&&along%2===0) winAt(x,y,z); else set0(x,y,z,B.cream); } };
    for(let x=SCH.x0;x<=SCH.x1;x++) if(!pav(x)){ plain(x,SCH.z0,SU(x),0,-1); plain(x,SCH.z1,SU(x),0,1); }
    for(const w of [SCH.w1,SCH.w2]) for(const x of w) for(let z=SCH.wz0+6;z<SCH.z0-1;z++) plain(x,z,z-SCH.wz0,x===w[0]?-1:1,0);
    // the garden side of the risalit gets the same windows as the court side (it was a blank wall)
    for(let x=RX0;x<=RX1;x++){ const u=SU(x); for(let y=T;y<T+17;y++){ const f=(y-T)%4;
      if(y===T||u===3||u===8||f===0) set0(x,y,SCH.z1,B.sandstone); else if(u<=1||u===5) winAt(x,y,SCH.z1); else set0(x,y,SCH.z1,B.cream); } }
    // yellow plaster, red sandstone: every Schloss block from the court to the garden
    for(let x=SCH.x0;x<=SCH.x1;x++) for(let z=SCH.wz0;z<=SCH.z1;z++) for(let y=T;y<=T+30;y++){ const b=get(x,y,z);
      if(b===B.cream) set0(x,y,z,B.schYel); else if(b===B.sandstone||b===B.trim) set0(x,y,z,B.schRed); }
    // the storey bands go yellow too where they only cross plaster (pilasters, quoins, lintels and cornices stay red)
    for(let x=SCH.x0;x<=SCH.x1;x++) for(let z=SCH.wz0;z<=SCH.z1;z++) for(let y=T+4;y<=T+28;y+=4){ if(get(x,y,z)!==B.schRed) continue; const a=get(x,y+1,z);
      if(a===B.schYel||isWin(a)) set0(x,y,z,B.schYel); }
    // the Ehrenhof: a paved way on the axis from the gate to the portal
    for(let x=-12;x<=-9;x++) for(let z=SCH.wz0;z<RZ;z++) set0(x,T-1,z,B.pave);
    // walk in: the portal open, an entrance hall under the Rittersaal, a carpeted stair up through the hall's floor
    const HX0=-17, HX1=-4, HZ0=93, HZ1=103;   // the Rittersaal's air (white plaster walls one block in from the risalit's)
    for(let x=RX0+1;x<=RX1-1;x++) for(let z=RZ+1;z<=SCH.z1-1;z++) for(let y=T;y<=T+13;y++) set0(x,y,z,B.stucco);
    for(let x=-12;x<=-9;x++) for(let y=T;y<=T+2;y++) set0(x,y,RZ,0);
    for(let x=RX0+1;x<=RX1-1;x++) for(let z=RZ+1;z<=RZ+3;z++){ set0(x,T-1,z,B.pave); for(let y=T;y<=T+3;y++) set0(x,y,z,0); }
    for(let k=0;k<4;k++){ const z=95+k; for(let x=-13;x<=-8;x++){ set0(x,T+k,z,B.carpet); for(let y=T+k+1;y<=(z===95?T+3:T+4);y++) set0(x,y,z,0); } }
    for(let x=HX0;x<=HX1;x++) for(let z=HZ0;z<=HZ1;z++){ const well=x>=-13&&x<=-8&&z>=96&&z<=98;
      set0(x,T+4,z,well?0:B.plank); for(let y=T+5;y<=T+12;y++) set0(x,y,z,0); }
    // deep window niches where the outer wall has a window
    for(let x=HX0;x<=HX1;x++) for(let y=T+5;y<=T+12;y++){ if(isWin(get(x,y,RZ))) set0(x,y,RZ+1,0); if(isWin(get(x,y,SCH.z1))) set0(x,y,SCH.z1-1,0); }
  }

  // ---- v1.52 (Flax 06:44) the Popakademie Baden-Wuerttemberg: the state's college for pop music and the music business, founded
  // 2003, in its new building in the Jungbusch since the winter of 2004/05 (two floors added 2011/12). Real: on the city side by the
  // harbour canal. Ours: across the Neckar from the landing on the north-bank harbour, where there was room (the crane that stood
  // here moved to x 21). NOT a replica: a plain white block with one big glass front to the river; the real facade is unknown to us.
  { const X0=27, X1=40, Z0=-112, Z1=-105, H=9;
    for(let x=X0;x<=X1;x++) for(let z=Z0;z<=Z1;z++){ const ex=x===X0||x===X1, ez=z===Z0||z===Z1;
      for(let y=T;y<T+H;y++){ let b=B.white;
        if(z===Z1&&!ex&&y<T+7) b=y===T+3?B.white:hsh(x,y,z)<.5?B.shopLit:B.shop;            // the glass front, a slab line between the floors
        else if((ex||ez)&&!(ex&&ez)&&y<T+7&&(y-T)%4!==0&&(y-T)%4!==3) b=B.shop;               // ribbon windows round the sides and back
        set(x,y,z,b); }
      set(x,T+H,z,ex||ez?B.white:B.stone); } }

  // ---- v1.57 (Flax 09:00) the Planetarium (Wilfried Beck-Erlang, opened 1984): a blue glass pyramid with stepped rust-brown ribs on
  // its hips over a low base storey (a dark glass ribbon under a white band), the dome inside. The real one stands on the Europaplatz
  // about 1.3 km east-south-east of the Wasserturm; ours stands on lawns where the two southern Oststadt blocks were, smaller (base
  // 28 x 28, dome 17.8 across, the real dome is 20 m). The hall floor is level with the street: the base storey is a ring of foyer round
  // it, the main doors face the Kaiserring. Built after the houses and with no R(). Glass, ribs, seats and the sky are meshes (see below).
  const PL={cx:110,cz:80,rin:8.6,rout:10.1};
  for(let x=88;x<=126;x++) for(let z=65;z<=95;z++){ for(let y=T;y<=T+22;y++) set(x,y,z,0);   // v1.58 z 63 -> 65 (the Kunsthalle moved south)
    const ux=x+.5-PL.cx, uz=z+.5-PL.cz, m=Math.max(Math.abs(ux),Math.abs(uz));
    set(x,T-1,z,m<14.6||(x<96&&uz>-4&&uz<4)?B.pave:B.grass); }   // lawns, a paved apron and a path in from the Kaiserring
  for(let x=96;x<=123;x++) for(let z=66;z<=93;z++){ const ux=x+.5-PL.cx, uz=z+.5-PL.cz, ax=Math.abs(ux), az=Math.abs(uz), m=Math.max(ax,az), d=Math.hypot(ux,uz);
    if(d<PL.rin){ set(x,T-1,z,B.slate); continue; }   // the hall: open up to the dome
    if(m>13){ const cor=ax>12&&az>12, door=ux<0&&ax>13&&az<2;   // the outer wall: corners in rust-brown, four glass doors on the west
      for(let y=T;y<=T+2;y++) set(x,y,z,cor?B.trim:y===T+2?B.white:door?0:(y===T+1&&(x+z)%2?B.shopLit:B.shop));
      if(cor) set(x,T+3,z,B.trim); continue; }
    if(d<PL.rout){ for(let y=T;y<=T+3;y++) set(x,y,z,ux<0&&az<1&&y<T+3?0:B.white); continue; }   // the hall's round wall, its door on the west
    set(x,T+3,z,B.white); }   // the foyer's ceiling, the white band under the glass
  for(const [x,z] of [[95,65],[124,65],[95,94],[124,94]]) for(let y=T;y<=T+1;y++) set(x,y,z,B.trim);   // the ribs come down as stepped buttresses
  for(let x=109;x<=110;x++) for(let z=79;z<=80;z++) set(x,T,z,B.slate);   // the projector's plinth

  // ---- Carl Benz's Patent-Motorwagen: a low stone dais on the quay east of the landing ----
  const BZ={x:22,z:-74,x0:20,x1:23,z0:-77,z1:-72};
  for(let x=BZ.x0;x<=BZ.x1;x++) for(let z=BZ.z0;z<=BZ.z1;z++) set(x,T-1,z,x===BZ.x0||x===BZ.x1||z===BZ.z0||z===BZ.z1?B.trim:B.stone);

  // ---- trees: on the quay promenade, the Ring, the Schlossgarten, the Friedrichsplatz ----
  function tree(x,z,big){ if(get(x,T,z)) return; const h=big?6:4+(R()*2|0), r=big?3.1:2.3, cy=T+h, leaf=R()<.7?B.leaves:R()<.5?B.leavesY:B.leavesR;
    for(let dx=-3;dx<=3;dx++) for(let dz=-3;dz<=3;dz++) for(let dy=-2;dy<=3;dy++){ const dd=(dx*dx+dz*dz)/(r*r)+(dy*dy)/((r*.85)*(r*.85)); if(dd<=1&&!get(x+dx,cy+dy,z+dz)) set(x+dx,cy+dy,z+dz,leaf); }
    for(let y=T;y<=cy;y++) set(x,y,z,B.log); }
  for(let x=-120;x<=120;x+=9) if(x<BR.x0-2||x>BR.x1+2) if(x<-4||x>30) tree(x,-74);
  for(let i=0;i<70;i++){ const x=-126+Math.floor(R()*188), z=108+Math.floor(R()*34); if(x<64||z>110) tree(x,z,R()<.4); }
  for(let i=0;i<16;i++){ const x=-127+Math.floor(R()*18), z=-60+Math.floor(R()*160); tree(x,z); }
  for(const [x,z] of [[90,-6],[90,6],[90,35],[90,47],[95,-7],[106,-7],[95,48],[106,48],[110,-3],[110,44]]) tree(x,z,true);   // v1.58 new spots, same count + order
  for(const [x,z] of [[-5,24],[3,24],[-5,33],[3,33]]) tree(x,z);   // Paradeplatz
  for(const [x,z] of [[107,1],[107,39],[93,2],[93,39]]) tree(x,z);     // v1.38 lawns round the Wasserspiele (v1.58 new spots)

  // ---- v1.67 the Schillerplatz on B3 (Flax, Monitor q56): B3's houses make way for a small green square round the Schiller
  // monument, a standing bronze on a tall stone base (props below). Cleared after the houses were made and with no R(), so every
  // other house, tree and container in Mannheim stays where it was. Gravel paths cross to the monument, lawn and limes in three
  // corners. The old Nationaltheater (1779-1943, Die Räuber premiered there on 13 January 1782) stood by the square ----
  const SLP={x0:-54,x1:-46,z0:53,z1:60,cx:-50,cz:58};   // the monument a little south of the middle: a forecourt with benches in front of him
  for(let x=SLP.x0;x<=SLP.x1;x++) for(let z=SLP.z0;z<=SLP.z1;z++){ for(let y=T;y<T+30;y++) set(x,y,z,0);
    const dx=x+.5-SLP.cx, dz=z+.5-SLP.cz; set(x,T-1,z,Math.abs(dx)<1||Math.abs(dz)<1||Math.hypot(dx,dz)<3.3||(z>=54&&z<=55&&x>=-53&&x<=-47)?B.gravel:B.grass); }
  for(let x=SLP.cx-1;x<=SLP.cx;x++) for(let z=SLP.cz-1;z<=SLP.cz;z++) for(let y=T;y<T+3;y++) set(x,y,z,B.sandstone);   // the base's core, 2 x 2 x 3
  for(const [x,z] of [[SLP.x0,SLP.z0],[SLP.x0,SLP.z1],[SLP.x1,SLP.z1]]){ const cy=T+5, r=2.2;   // three limes, by hand (no R()); the north-east corner stays open so you see him coming up from the Breite Straße
    for(let dx=-3;dx<=3;dx++) for(let dz=-3;dz<=3;dz++) for(let dy=-2;dy<=2;dy++){ const dd=(dx*dx+dz*dz)/(r*r)+(dy*dy)/((r*.85)*(r*.85));
      if(dd<=1&&!get(x+dx,cy+dy,z+dz)) set(x+dx,cy+dy,z+dz,hsh(x+dx,cy+dy,z+dz)<.85?B.leaves:B.leavesY); }
    for(let y=T;y<=cy;y++) set(x,y,z,B.log); }

  // ---- props: one vertex-coloured mesh (cranes, containers, bollards, benches), boards, corner signs ----
  const group=new THREE.Group(), L=[];
  const P=(w,h,d,x,y,z,c,ry,rx)=>L.push([w,h,d,x,y,z,c,ry||0,0,rx||0]);
  function crane(x,z,c){ const Y=T;
    for(const sx of [-2.3,2.3]) for(const sz of [-1.6,1.6]) P(.45,9,.45,x+sx,Y+4.5,z+sz,c);
    P(5.2,.8,3.8,x,Y+9.4,z,c); P(3.2,3,3.6,x,Y+11.3,z-.4,'#e8e2d4'); P(3.24,.6,.12,x,Y+11.8,z+1.42,'#2a3550');
    P(.4,4.2,.4,x,Y+14.6,z-.4,c); P(.6,.6,17,x,Y+14.3,z+7.6,c,0,-.32); P(2,1.6,2,x,Y+11.2,z-3,'#55575c');
    P(.07,7,.07,x,Y+11.5,z+15.4,'#222222'); P(.5,.4,.5,x,Y+7.8,z+15.4,'#333333');
  }
  for(const [x,c] of [[-112,'#d9a520'],[-86,'#2f6f9f'],[-58,'#d9a520'],[21,'#2f6f9f'],[72,'#d9a520']]) crane(x,-102.6,c);   // v1.52 the blue one moved from x 34 for the Popakademie
  for(const [xa,xb] of [[-126,BR.x0-1],[BR.x1+1,126]]) for(const sz of [-1.6,1.6]) P(xb-xa,.2,.25,(xa+xb)/2,T+.1,-102.6+sz,'#5a5a5e');   // crane rails along the quay
  const CC=['#a83a2a','#2f5f8f','#3f7f4f','#c9782a','#8a8a86','#6a3a6a','#b8b2a4'];
  for(const [xa,xb] of [[-70,-46],[0,26],[64,86]]) for(let x=xa;x<xb;x+=6.4) for(let k=0;k<2+(R()*2|0);k++) P(6.1,2.55,2.4,x+3,T+1.28+k*2.6,-109.2+(R()<.5?0:2.6),CC[Math.floor(R()*CC.length)]);
  for(let x=-120;x<=120;x+=6) if(x<BR.x0||x>BR.x1) P(.38,.55,.38,x,T+.27,-78.4,'#2b2b2e');   // bollards on the quay
  // two Rhine barges moored at the harbour wall, out of the boat's way
  for(const [x,c] of [[74,'#2c3a4a'],[-70,'#4a2c2a']]){ P(26,2.2,4.6,x,W+.1,-96.6,c); P(26.1,.35,4.7,x,W+1.1,-96.6,'#d8d2c4');
    P(17,.6,3.9,x-2.5,W+1.5,-96.6,'#6a5a3a'); for(let k=0;k<5;k++) P(.2,.65,3.95,x-10+k*3.6,W+1.55,-96.6,'#4a3e2a');
    P(3.2,2.4,3.6,x+10.4,W+2.4,-96.6,'#e8e2d4'); P(3.25,.55,3.65,x+10.4,W+3,-96.6,'#2a3550'); P(.3,1.4,.3,x+11.4,W+4.3,-96.6,'#2b2b2e'); }
  // the landing: the welcome board's posts and back, the Wasserturm board's posts
  for(const x of [3.7,12.3]) P(.22,4.3,.22,x,T+2.15,-78.9,'#1f3f7a'); P(9.2,1.8,.1,8,T+3.4,-78.9,'#1f3f7a');
  for(const z of [-1.6,1.6]) P(.14,1.9,.14,WT.x-10.3,T+.95,WT.z+z*1.9,'#3a2a1c');
  // benches round the Wasserturm + street lamps on the Planken
  for(let a=0;a<8;a++){ if(a===1||a===2) continue; const an=a*Math.PI/4+Math.PI/8, x=WT.x+Math.sin(an)*11.5, z=WT.z+Math.cos(an)*11.5; P(1.8,.12,.5,x,T+.45,z,'#7a5232',an); P(1.8,.4,.1,x+Math.sin(an)*.25,T+.75,z+Math.cos(an)*.25,'#7a5232',an); }
  // v1.33 street lamps all over town (iron in the props mesh, the glass in its own mesh that glows at night, a light pool under each)
  const LAMPS=[], LH=[], POOL=[];
  function lamp(x,z,k){ if(k){ P(.18,3.4,.18,x,T+1.7,z,'#24262a'); P(.3,.12,.3,x,T+.06,z,'#24262a'); P(.46,.14,.46,x,T+4.08,z,'#24262a'); P(.16,.22,.16,x,T+4.26,z,'#24262a'); LH.push([.36,.6,.36,x,T+3.72,z,'#fff2cc']); LAMPS.push([x,T+3.72,z]); }
    else { P(.14,4,.14,x,T+2,z,'#2b2b2e'); P(.5,.18,.5,x,T+4.16,z,'#2b2b2e'); LH.push([.38,.14,.38,x,T+4,z,'#fff2cc']); LAMPS.push([x,T+3.85,z]); }
    POOL.push([x,z]); }
  for(let x=-96;x<=76;x+=12) for(const z of [PLK.z0+.6,PLK.z1+.4]) lamp(x,z);                          // the Planken
  for(let z=-66;z<=60;z+=12) for(const x of [AX.x0+.6,AX.x1+.4]) lamp(x,z);                            // Breite Straße + Kurpfalzstraße
  for(let x=-114;x<=114;x+=12) if(!(x>=BR.x0-2&&x<=BR.x1+2)&&!(x>-6&&x<32)) lamp(x,-77.4,1);           // quay lanterns between the trees
  lamp(.6,-77.4,1); lamp(15.4,-77.4,1);                                                                 // two by the landing board
  for(let x=-117;x<=117;x+=15) if(!(x>BR.x0-2&&x<BR.x1+2)) lamp(x,-70.4);                               // the Ringe
  for(let z=-54;z<=90;z+=12) if(z<PLK.z0-1||z>PLK.z1+1) for(const x of [KR.x0+.6,KR.x1+.4]) lamp(x,z);   // Kaiserring
  for(let x=-100;x<=76;x+=12) if(x<AX.x0-1||x>AX.x1+1) lamp(x,76.6);                                     // Bismarckstraße
  for(let z=-54;z<=66;z+=12) lamp(-100.6,z);                                                             // Parkring
  for(let a=0;a<8;a++){ if(a===1||a===2) continue; const an=a*Math.PI/4+Math.PI/8; lamp(WT.x+Math.sin(an)*13.6,WT.z+Math.cos(an)*13.6,1); }    // round the Wasserturm (v1.58 not on the water staircase)
  for(const z of [-96,-89.5,-83]) for(const x of [BR.x0+1.4,BR.x1-1.4]) lamp(x,z);                       // the Kurpfalzbrücke
  for(let x=72;x<=120;x+=12) lamp(x,104,1);                                                              // Bahnhofsvorplatz
  // the Schloss: gold balls on the gate pillars, the yellow-red-yellow Baden flag on the middle ridge
  for(const x of [-16,-4]) P(.8,.8,.8,x,T+4.4,SCH.wz0+1,'#d8a636');
  { const fz=SCH.z0-5+6; P(.14,7,.14,-10,T+29.5,fz,'#2b2b2e'); P(.3,.3,.3,-10,T+33.1,fz,'#d8a636');
    [['#e8c23a',32.4],['#c8202a',31.8],['#e8c23a',31.2]].forEach(([c,y])=>P(2.6,.6,.06,-8.62,T+y,fz,c)); }
  // the Paradeplatz fountain: four bronze figures on the base, water spouting into the basin, a gilded top, benches
  const fig=(x,z,back,c,sc)=>{ for(const p of H.person({skin:c,hair:c,shirt:c,pants:c,shoes:c,sit:.45})) { const k=back?-1:1; L.push([p[0]*sc,p[1]*sc,p[2]*sc,x+p[3]*sc*k,T+2+p[4]*sc,z+p[5]*sc*k,c,0,0,0]); } };
  fig(-1.4,29.45,0,'#7a5a2e',.62); fig(.4,29.45,0,'#6e5028',.62); fig(-1.4,27.55,1,'#6e5028',.62); fig(.4,27.55,1,'#7a5a2e',.62);
  P(.34,.34,.34,-.5,T+7.25,28.5,'#d8a636'); P(.14,.5,.14,-.5,T+7.65,28.5,'#d8a636');
  for(const [dx,dz] of [[1.6,0],[-1.6,0],[0,1.6],[0,-1.6]]){ P(.14,1.1,.14,-.5+dx*1.08,T+.55,28.5+dz*1.08,'#bfe4f0'); P(.5,.06,.5,-.5+dx*1.08,T+.03,28.5+dz*1.08,'#e8f6fa'); }
  for(const [x,z,r] of [[-4.6,28.5,Math.PI/2],[3.6,28.5,Math.PI/2],[-.5,24.9,0],[-.5,32.1,0]]){ P(1.9,.12,.5,x,T+.45,z,'#7a5232',r); P(.12,.45,.4,x+(r?0:-.8),T+.22,z+(r?-.8:0),'#2b2b2e',r); P(.12,.45,.4,x+(r?0:.8),T+.22,z+(r?.8:0),'#2b2b2e',r); }
  // v1.48 the Rathaus + St. Sebastian and the Marktplatzbrunnen: stone figures (one helper, turned to face their way), the tower's helm
  // and bell, the fountain's group, spouts and railing, two benches and lanterns on the square
  const STN='#d8cfbd', STD='#bfb4a0';
  const statue=(x,y,z,ry,sc,o,c)=>{ c=c||STN; const s=Math.sin(ry), co=Math.cos(ry);
    for(const p of H.person(Object.assign({skin:c,hair:c,shirt:c,pants:c,shoes:c,swing:{legs:0,armL:0,armR:0}},o))){ const lx=p[3]*sc, lz=p[5]*sc;
      L.push([p[0]*sc,p[1]*sc,p[2]*sc,x+lx*co+lz*s,y+p[4]*sc,z-lx*s+lz*co,p[6]==='#1d1714'||p[6]==='#9a4a3a'?STD:p[6],ry+(p[7]||0),0,p[9]||0]); } };
  // Justitia (sword up, scales) on the Rathaus, Pietas on the church, each in her niche looking out over the square
  statue(-16,T+8,-4.45,Math.PI,.55,{armUp:'R',extra:[[.05,.8,.05, .34,2.5,.02,STD],[.2,.05,.05, .34,2.17,.02,STD],[.04,.32,.04, -.42,.9,.16,STD],[.52,.04,.04, -.42,1.06,.16,STD],[.17,.03,.17, -.66,.82,.16,STD],[.17,.03,.17, -.18,.82,.16,STD]]});
  statue(-23,T+8,-4.45,Math.PI,.55,{extra:[[.66,.1,.34, 0,1.86,-.02,STN]]});
  // the helm, stepped like the real one (a bell shape, a little open lantern, two more steps, a gilded ball and the spike)
  { const X=-19.5, Z=-3.5, HC='#46505c';
    P(2.5,1,2.5,X,T+21.5,Z,HC); P(1.9,.5,1.9,X,T+22.25,Z,HC);
    for(const [dx,dz] of [[-.48,-.48],[.48,-.48],[-.48,.48],[.48,.48]]) P(.2,1.1,.2,X+dx,T+23.05,Z+dz,HC);
    P(.6,.9,.6,X,T+23.0,Z,'#2a2e34'); P(1.4,.22,1.4,X,T+23.71,Z,HC); P(.95,.6,.95,X,T+24.12,Z,HC); P(.55,.4,.55,X,T+24.62,Z,HC);
    P(.36,.36,.36,X,T+25,Z,'#d8a636'); P(.1,.95,.1,X,T+25.6,Z,'#2b2b2e'); P(.5,.06,.06,X,T+25.75,Z,'#2b2b2e');
    // the bell in the belfry, on its beam
    P(1,.14,.14,X,T+18.85,Z,'#5a3a22'); P(.5,.45,.5,X,T+18.5,Z,'#9a7a3a'); P(.72,.3,.72,X,T+18.15,Z,'#8a6a2a'); P(.82,.08,.82,X,T+17.97,Z,'#9a7a3a'); }
  // the fountain group: the city goddess with her map of Mannheim, Mercury above her, Father Rhine with his oar in front, the Neckar behind
  { const X=MB.x, Z=MB.z, E=Math.PI/2;
    P(1.5,1.6,1.5,X,T+2.8,Z,STD); P(1.8,.2,1.8,X,T+3.7,Z,'#b0a490'); P(1.62,.14,1.62,X,T+2.07,Z,'#b0a490');
    statue(X+.15,T+3.8,Z,E,.62,{extra:[[.03,.3,.36, .44,1.0,.12,STD]]});
    P(.62,1.3,.62,X-.45,T+4.45,Z,STD); statue(X-.45,T+5.1,Z,E,.5,{armUp:'R',extra:[[.44,.1,.42, 0,1.9,0,STN],[.06,.16,.22, -.24,1.95,-.04,STN],[.06,.16,.22, .24,1.95,-.04,STN],[.04,1.0,.04, -.36,1.0,.12,STD]]});
    statue(X+1.0,T+2,Z+.1,E,.6,{sit:.12}); P(.07,2.1,.07,X+1.25,T+2.9,Z-.45,STD,0,.42); P(.2,.55,.06,X+1.25,T+2.25,Z-.86,STD,0,.42);
    statue(X-1.0,T+2,Z-.1,-E,.6,{sit:.12,extra:[[.24,.3,.2, .3,.35,.25,STD]]});
    // the four spouts (on the real one they are named Rhine, Danube, Neckar and Moselle) and their water
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){ P(dx?.45:.16,.16,dz?.45:.16,X+dx*1.62,T+1.45,Z+dz*1.62,STD);
      P(.12,1.35,.12,X+dx*1.98,T+.72,Z+dz*1.98,'#bfe4f0'); P(.5,.05,.5,X+dx*1.98,T+.03,Z+dz*1.98,'#e8f6fa'); }
    // the railing round the rim, iron with gilded knobs
    for(let i=0;i<16;i++){ const a=i*Math.PI/8, r=2.95, b=a+Math.PI/16, len=2*r*Math.sin(Math.PI/16)+.05;
      P(.09,.8,.09,X+Math.sin(a)*r,T+1.4,Z+Math.cos(a)*r,'#26282c'); P(.14,.14,.14,X+Math.sin(a)*r,T+1.86,Z+Math.cos(a)*r,'#c89a3a');
      for(const y of [T+1.25,T+1.7]) P(len,.05,.05,X+Math.sin(b)*r*.99,y,Z+Math.cos(b)*r*.99,'#26282c',b); }
    // the plaque's posts on the Breite Straße side
    for(const z of [Z-1.1,Z+1.1]) P(.14,1.9,.14,-15.12,T+.95,z,'#3a2a1c');
    // two benches on the west side, facing the fountain
    for(const z of [Z-2.2,Z+2.2]){ P(.5,.12,1.9,-24.1,T+.45,z,'#7a5232'); P(.1,.45,1.9,-24.32,T+.75,z,'#7a5232'); for(const s of [-.8,.8]) P(.4,.45,.12,-24.1,T+.22,z+s,'#2b2b2e'); } }
  lamp(-24.4,-19.4,1); lamp(-24.4,-10.6,1);
  // v1.49 the Jesuitenkirche: onion caps with patriarchal crosses on the towers, the same cross on the lantern, bells, the portal arches,
  // the four cardinal virtues on the front (two over the side portals, two on the upper storey), pews and the high altar inside
  { const CU='#5a9682', CD='#4b8774', GD='#d8a636', oct=(w,h,x,y,z,c)=>{ P(w,h,w*.6,x,y,z,c); P(w*.6,h,w,x,y,z,c); };   // a plus: reads round at this size
    const pcross=(x,y,z)=>{ P(.1,1.7,.1,x,y+.85,z,GD); P(.08,.08,.8,x,y+1.05,z,GD); P(.08,.08,.5,x,y+1.42,z,GD); };   // arms across, seen from the front
    for(const Z of [67.5,73.5]){ const X=-61.5;
      oct(2.7,.6,X,T+25.3,Z,CD); oct(2.3,.7,X,T+25.95,Z,CU); oct(2.8,1,X,T+26.8,Z,CU); oct(2.2,.5,X,T+27.55,Z,CU); oct(1.4,.4,X,T+28,Z,CU); oct(.6,.5,X,T+28.45,Z,CD);
      oct(.95,.8,X,T+29.1,Z,CU); P(.6,.6,.98,X,T+29.1,Z,'#2a2e34'); P(.98,.6,.6,X,T+29.1,Z,'#2a2e34'); oct(.7,.35,X,T+29.67,Z,CU); oct(.34,.3,X,T+29.99,Z,CD);
      P(.3,.3,.3,X,T+30.3,Z,GD); pcross(X,T+30.4,Z);
      P(1,.14,.14,X,T+22.82,Z,'#5a3a22'); P(.5,.45,.5,X,T+22.5,Z,'#9a7a3a'); P(.72,.3,.72,X,T+22.15,Z,'#8a6a2a'); P(.82,.08,.82,X,T+21.97,Z,'#9a7a3a'); }
    oct(.9,.5,-75.5,T+38.25,70.5,CU); P(.36,.36,.36,-75.5,T+38.68,70.5,GD); pcross(-75.5,T+38.8,70.5);
    // the portal arches: a round head over each door, slim piers between them
    for(const z of [69.5,70.5,71.5]) for(let i=0;i<4;i++){ const yo=.0625+i*.125; P(.04,.125,2*Math.sqrt(.2025-yo*yo),-59.97,T+3+yo,z,z===70.5?'#2a2018':'#5a3a24'); }
    for(const z of [70,71]) P(.14,3.6,.24,-59.92,T+1.8,z,'#b8644e');
    // the virtues: Justice (sword, scales) and Fortitude (her column) over the side portals, Prudence (a mirror) and Temperance (two jugs) up top
    const E=Math.PI/2;
    for(const [z,y] of [[69.5,T+4],[71.5,T+4],[69.5,T+14],[71.5,T+14]]) P(.5,.12,.8,-59.75,y+.06,z,'#b8644e');
    statue(-59.72,T+4.12,69.5,E,.55,{armUp:'R',extra:[[.05,.8,.05, .34,2.5,.02,STD],[.2,.05,.05, .34,2.17,.02,STD],[.04,.32,.04, -.42,.9,.16,STD],[.52,.04,.04, -.42,1.06,.16,STD],[.17,.03,.17, -.66,.82,.16,STD],[.17,.03,.17, -.18,.82,.16,STD]]});
    statue(-59.72,T+4.12,71.5,E,.55,{extra:[[.24,1.5,.24, .52,.75,0,STD],[.34,.1,.34, .52,1.55,0,STD]]});
    statue(-59.72,T+14.12,69.5,E,.62,{extra:[[.04,.3,.24, -.36,1.36,.18,STN]]});
    statue(-59.72,T+14.12,71.5,E,.62,{extra:[[.16,.24,.16, .36,1.0,.18,STD],[.16,.24,.16, -.36,1.22,.18,STD]]});
    // pews in the nave facing the altar (west), an aisle up the middle; the crossing under the dome stays open
    const WD='#8a5a34', DW='#6a4428';
    for(let r=0;r<6;r++) for(const [a,b] of [[67.15,69.9],[71.1,73.85]]){ const x=-70.4+r*1.2, c=(a+b)/2, n=b-a;
      P(.42,.06,n,x,T+.45,c,WD); P(.06,.5,n,x+.2,T+.72,c,DW); P(.46,.45,.06,x,T+.225,a+.03,DW); P(.46,.45,.06,x,T+.225,b-.03,DW); }
    // the high altar (Paul Egell's design, rebuilt, consecrated again in 1997): marble columns, a gilded crown, the altar table, candles
    const MR='#8a4a42', GL='#c9a24a', AX0=-82.8;
    for(const z of [68.3,69.2,71.8,72.7]) P(.36,5.2,.36,AX0+.15,T+3.6,z,MR);
    P(.05,3.4,2.1,AX0-.15,T+3.9,70.5,GL); P(.05,3.1,1.8,AX0-.12,T+3.9,70.5,'#4a3426');
    P(.6,.4,5,AX0+.1,T+6.4,70.5,GL); P(.4,1.2,2.2,AX0,T+7.2,70.5,GL); P(.3,.7,.7,AX0,T+8.1,70.5,GL);
    for(let i=0;i<7;i++){ const a=(i-3)*.42; P(.06,1.2,.07,AX0+.05,T+8.1+Math.cos(a)*.6,70.5+Math.sin(a)*.6,GL,0,a); }
    P(.9,1,2.4,-81.9,T+1.5,70.5,'#d8cfbd'); P(.95,.05,2.5,-81.9,T+2.02,70.5,'#f4efe2'); P(.02,.4,2.3,-81.43,T+1.8,70.5,'#f4efe2');
    for(const z of [69.6,70.05,70.95,71.4]){ P(.06,.3,.06,-82.1,T+2.2,z,'#f4efe2'); LH.push([.04,.08,.04,-82.1,T+2.39,z,'#ffcf6a']); LAMPS.push([-82.1,T+2.42,z]); }
    P(.05,.6,.05,-82.1,T+2.35,70.5,GL); P(.05,.05,.32,-82.1,T+2.5,70.5,GL);
    // a plaque on posts by the choir step, facing the nave
    for(const z of [67.75,68.85]) P(.1,1.5,.1,-79.6,T+.75,z,'#3a2a1c'); }
  // v1.58 the Friedrichsplatz: Jugendstil lanterns round the fountains and the basin, the two pergolas (red sandstone pillars,
  // beams and rafters) with a bench under each looking up the basin to the big jet, bronze figures on the round fountains, lights
  // in the basin, lamps on the street round the park, lanterns in the arcade walk, balconies with green railings, turret finials
  const cand=(x,z)=>{ P(.16,3.3,.16,x,T+1.65,z,'#1f2a24'); P(.36,.22,.36,x,T+.11,z,'#1f2a24'); P(1.15,.08,.08,x,T+3.2,z,'#1f2a24'); P(.1,.3,.1,x,T+3.45,z,'#1f2a24');
    for(const a of [-.52,.52]) LH.push([.26,.3,.26,x+a,T+3.4,z,'#fff4d6']); LH.push([.24,.28,.24,x,T+3.74,z,'#fff4d6']); LAMPS.push([x,T+3.5,z]); POOL.push([x,z]); };
  for(const [cx,cz] of FF) for(const dx of [-3.4,3.4]) for(const dz of [-3.4,3.4]) cand(cx+dx,cz+dz);
  for(const [x,z] of [[111.7,2.6],[111.7,38.4],[122.6,4.5],[122.6,36.5]]) cand(x,z);
  const PG=['#9a4a38','#a5523e'], PGW='#5a4030', PGS='#c9bea9';
  for(const sg of [-1,1]){ const at=(a,r)=>[WT.x+Math.cos(a)*r,WT.z+sg*Math.sin(a)*r], dg=Math.PI/180, bar=(a1,r1,a2,r2,h,w,y,c)=>{ const [xa,za]=at(a1,r1), [xb,zb]=at(a2,r2);
      P(Math.hypot(xb-xa,zb-za),h,w,(xa+xb)/2,y,(za+zb)/2,c,Math.atan2(-(zb-za),xb-xa)); };
    for(let k=0;k<=4;k++){ const a=(48+8*k)*dg;
      for(const r of [14.2,16.2]){ const [x,z]=at(a,r); P(.5,3,.5,x,T+1.5,z,PG[k%2]); P(.7,.3,.7,x,T+.15,z,PGS); P(.64,.2,.64,x,T+3,z,PGS); }
      bar(a,13.7,a,16.7,.26,.32,T+3.36,PG[0]);   // the cross beam over each pair of pillars
      if(k<4){ for(const r of [14.2,16.2]) bar(a-.6*dg,r,a+8.6*dg,r,.3,.36,T+3.12,PG[1]);   // the long beams
        bar(a+4*dg,13.8,a+4*dg,16.6,.14,.16,T+3.56,PGW); bar(a+2*dg,13.9,a+2*dg,16.5,.12,.12,T+3.56,PGW); bar(a+6*dg,13.9,a+6*dg,16.5,.12,.12,T+3.56,PGW); } } }   // rafters
  const SEATS=[];
  for(const sg of [-1,1]){ const a=60*Math.PI/180, x=WT.x+Math.cos(a)*15.2, z=WT.z+sg*Math.sin(a)*15.2, fx=117.5-x, fz=20.5-z, l=Math.hypot(fx,fz), ux=fx/l, uz=fz/l, an=Math.atan2(-ux,-uz);   // both look up the basin to the big jet
    P(1.8,.12,.5,x,T+.45,z,'#7a5232',an); P(1.8,.45,.1,x-ux*.25,T+.78,z-uz*.25,'#7a5232',an); for(const k of [-.75,.75]) P(.08,.4,.42,x+uz*k,T+.2,z-ux*k,'#2b2b2e',an);
    SEATS.push({x:x+ux*.05,z:z+uz*.05,yaw:an,pitch:.24,stand:[x-ux*1.1,z-uz*1.1]}); }
  const BRZ='#6e5530';
  for(const [cx,cz] of FF){ P(2.3,.32,2.3,cx,T+2.16,cz,'#9a4a38'); P(2.3,.32,2.3,cx,T+2.16,cz,'#9a4a38',Math.PI/4); P(2,.04,2,cx,T+2.33,cz,'#9fd0e4'); P(2,.04,2,cx,T+2.33,cz,'#9fd0e4',Math.PI/4);
    statue(cx-3.65,T+1,cz,Math.PI/2,.5,{armUp:'R'},BRZ);
    statue(cx+3.65,T+1,cz,-Math.PI/2,.5,{extra:[[.05,1.5,.05, .4,1.2,.12,BRZ],[.3,.05,.05, .4,1.95,.12,BRZ],[.05,.2,.05, .27,2.05,.12,BRZ],[.05,.2,.05, .53,2.05,.12,BRZ]]},BRZ);
    LH.push([.9,.04,.9,cx,T+.02,cz,'#e8f8ff']); }
  LH.push([.8,.04,.8,117.5,T+.02,20.5,'#e8f8ff']); for(let k=1;k<=6;k++) for(const sg of [-1,1]) LH.push([.5,.04,.5,117.5,T+.02,20.5+sg*3*k,'#e8f8ff']);   // lights in the basin under the middle row
  for(const L of [25,32]) for(const sg of [-1,1]){ const p=acAt(L); lamp(AC.x+p.u-2*p.nx,AC.z+sg*(p.v-2*p.nz),1); }   // the street round the park
  for(let L=6;L<38;L+=8) for(const sg of [-1,1]){ const p=acAt(L), x=AC.x+p.u+1.5*p.nx, z=AC.z+sg*(p.v+1.5*p.nz);   // lanterns in the arcade walk
    if(x>=114.3&&x<=127.7&&!get(Math.floor(x),T+1,Math.floor(z))){ LH.push([.3,.22,.3,x,T+3.8,z,'#fff2cc']); LAMPS.push([x,T+3.7,z]); } }
  for(let L=14;L<36;L+=7) for(const sg of [-1,1]){ const p=acAt(L), nx=p.nx, nz=sg*p.nz; if(Math.max(Math.abs(nx),Math.abs(nz))<.9) continue;
    const x0=AC.x+p.u, z0=AC.z+sg*p.v; if(x0<120.5) continue;   // balconies on the plain stretches, not the turrets
    for(const f of [5,9,13]){ let d=-1.5; while(d<1.5&&!get(Math.floor(x0+nx*d),T+f,Math.floor(z0+nz*d))) d+=.05; if(d>=1.5) continue;
      const ry=Math.atan2(-nz,nx);
      P(.55,.1,2.7,x0+nx*(d-.28),T+f-.05,z0+nz*(d-.28),'#8a3a2c',ry); P(.06,.5,2.7,x0+nx*(d-.53),T+f+.25,z0+nz*(d-.53),'#4b8774',ry); } }
  for(const k in FIN){ const [x,y,z]=FIN[k]; P(.24,.6,.24,x,y+.3,z,'#4b8774'); P(.14,.14,.14,x,y+.67,z,'#4b8774'); }   // finials on the turret caps
  // v1.51 the Barockschloss: lanterns in the Ehrenhof, the entrance hall, the stair's balustrade, the Rittersaal (gilded pilasters,
  // a cornice, three chandeliers, a grand piano and two dozen chairs for the Schlosskonzerte). The indoor ones are their own mesh,
  // unlit and candle-warm at night (the Schloss floodlights light the rooms' blocks, plain Lambert props went black)
  const RSL=[];
  { const GD='#d4a53c', WH='#f2ede2', RD='#9b2a2a', BK='#141418', Q=(w,h,d,x,y,z,c,ry,rx)=>RSL.push([w,h,d,x,y,z,c,ry||0,0,rx||0]);
    for(const [x,z] of [[-13.6,86.5],[-6.4,86.5],[-38,86],[18,86],[-38,92],[18,92]]) lamp(x,z,1);
    for(const x of [-15,-5]){ Q(.6,3.6,.6,x,T+2,93.6,WH); Q(.8,.2,.8,x,T+.1,93.6,WH); Q(.8,.2,.8,x,T+3.9,93.6,GD); }
    for(const [x,z,f] of [[-14.5,92,1],[-6.5,92,1],[-15.5,95,-1],[-4.5,95,-1]]){ Q(.26,.3,.1,x,T+2.5,z+f*.05,GD); LH.push([.16,.26,.1,x,T+2.8,z+f*.12,'#ffe2a8']); LAMPS.push([x,T+2.8,z+f*.2]); }
    const rail=(x0,z0,x1,z1)=>{ const L=Math.hypot(x1-x0,z1-z0), n=Math.round(L/.4), ax=x0===x1;
      Q(ax?.12:L,.09,ax?L:.12,(x0+x1)/2,T+5.92,(z0+z1)/2,WH);
      for(let i=0;i<=n;i++){ const t=i/n; Q(.08,.82,.08,x0+(x1-x0)*t,T+5.45,z0+(z1-z0)*t,WH); } };
    rail(-13.08,96,-13.08,99); rail(-6.92,96,-6.92,99); rail(-13.08,95.92,-6.92,95.92);
    for(const [x,z] of [[-13.08,95.92],[-6.92,95.92],[-13.08,99],[-6.92,99]]){ Q(.2,1.05,.2,x,T+5.52,z,GD); Q(.24,.12,.24,x,T+6.1,z,GD); }
    for(const x of [-13.5,-6.5]) for(const z of [93.03,103.97]) Q(.5,7.7,.05,x,T+8.85,z,GD);
    for(const z of [95.5,98.5,101.5]) for(const x of [-16.97,-3.03]) Q(.05,7.7,.5,x,T+8.85,z,GD);
    Q(14,.28,.3,-10,T+12.86,93.15,GD); Q(14,.28,.3,-10,T+12.86,103.85,GD); Q(.3,.28,11,-16.85,T+12.86,98.5,GD); Q(.3,.28,11,-3.15,T+12.86,98.5,GD);
    for(const cx of [-14.5,-10,-5.5]){ const cz=98.5, cy=T+10.6;
      Q(.04,2.3,.04,cx,T+11.85,cz,GD); Q(.9,.07,.9,cx,cy,cz,GD); Q(.5,.4,.5,cx,cy-.22,cz,GD); Q(.18,.35,.18,cx,cy-.58,cz,GD); Q(.36,.06,.36,cx,cy+.55,cz,GD);
      for(let a=0;a<8;a++){ const an=a*Math.PI/4, ax=cx+Math.cos(an)*.62, az=cz+Math.sin(an)*.62; Q(.1,.05,.1,ax,cy+.04,az,GD); LH.push([.08,.18,.08,ax,cy+.16,az,'#fff2cc']); }
      LAMPS.push([cx,cy+.1,cz]); }
    { const x=-15.3, z=101.6, y=T+5;   // the grand piano, keyboard to the north, lid open to the chairs
      Q(.95,.32,1.6,x,y+.82,z,BK); Q(1.6,.04,.95,x+.16,y+1.2,z,BK,Math.PI/2,-.5); Q(.04,.42,.04,x+.38,y+1.2,z,BK);
      for(const [dx,dz] of [[-.38,-.68],[.38,-.68],[0,.68]]) Q(.1,.66,.1,x+dx,y+.33,z+dz,BK);
      Q(.95,.05,.2,x,y+.69,z-.88,WH); Q(.95,.04,.06,x,y+.73,z-.85,BK); Q(.7,.07,.34,x,y+.48,z-1.45,BK); Q(.6,.44,.24,x,y+.22,z-1.45,BK); }
    for(const x of [-12.6,-11.4,-10.2,-9,-7.8,-6.6]) for(const z of [100.3,101.1,102.3,103.1]){ const y=T+5;
      Q(.44,.06,.44,x,y+.46,z,RD); Q(.06,.56,.42,x+.2,y+.76,z,GD); Q(.04,.43,.4,x-.18,y+.215,z,GD); Q(.04,.43,.4,x+.18,y+.215,z,GD); }
  }
  // the Benz dais: a low slab (the car sits on it until you drive off), the plaque on a post facing the landing
  P(3.6,.3,5.6,BZ.x,T+.15,BZ.z,'#8f8a80'); P(3.75,.06,5.75,BZ.x,T+.32,BZ.z,'#b8b2a4');
  P(.14,1.05,.14,BZ.x0-.45,T+.52,BZ.z,'#3a2a1c');
  // v1.31b Bäckerei Grumbach on the Friedrichsring (U1's north front): a striped awning, a counter with loaves; Frau Kessler's door in L4
  const BK={x:-1.25,z:-62};
  for(let i=0;i<6;i++) P(.9,.1,1.3,BK.x-2.25+i*.9,T+2.9,BK.z-.62,i%2?'#f4f1ea':'#b8322a',0,-.22);
  P(1.8,.9,.7,BK.x-1.7,T+.45,BK.z-.4,'#7a4a2a'); P(1.9,.08,.8,BK.x-1.7,T+.94,BK.z-.4,'#5a3418');
  P(.5,.22,.28,BK.x-2.2,T+1.09,BK.z-.42,'#c8873a'); P(.5,.22,.28,BK.x-1.6,T+1.09,BK.z-.36,'#a8652a'); P(.36,.1,.3,BK.x-1.05,T+1.03,BK.z-.4,'#8a4a1a');
  // v1.55 (coldpresss 08:32 "where's the nearest doener") the Imbiss am Ring: a döner window in K1's corner on the Breite Straße, in plain
  // sight of Grumbach's door across the street. Awning, a steel counter with the salad trays, the spit turning by its heater (its own mesh,
  // spun in tick), one standing table; the vendor is in index.html's mhFolk. Generic names only
  const DN={x:-14.5,z:-57.9,sx:-14.45,sz:-60.3}, SPL=[];
  for(let i=0;i<6;i++) P(.9,.1,1.9,-14.05,T+3.0,-60.35+i*.9,i%2?'#f2c53a':'#c8322a',-Math.PI/2,-.22);   // a bigger awning than the bakery's, naturally
  for(let i=0;i<6;i++) P(.05,.3,.9,-13.12,T+2.68,-60.35+i*.9,i%2?'#f2c53a':'#c8322a');   // the striped edge you see from the street
  RSL.push([.04,1.7,5,-14.975,T+1.75,-58.1,'#e8dcc0',0,0,0]);   // the tiled back wall, lit at night like the Schloss rooms
  P(.55,1,3.6,-13.85,T+.5,DN.z,'#a8a6a0'); P(.02,.24,3.6,-13.565,T+.72,DN.z,'#f2c53a'); P(.7,.06,3.8,-13.85,T+1.03,DN.z,'#e4e2dc');
  P(.04,.32,3.2,-13.6,T+1.24,DN.z,'#cfe6ee');
  [['#5a9a3a',-56.7],['#c8402a',-57.05],['#f2ecd8',-57.4],['#8a3a6a',-57.75],['#e8e2c8',-58.1]].forEach(([c,z])=>P(.26,.05,.3,-13.95,T+1.08,z,c));
  P(.6,.9,.6,DN.sx,T+.45,DN.sz,'#8a8680'); P(.08,1.1,.5,DN.sx-.38,T+1.55,DN.sz,'#e8702a'); P(.04,1.1,.42,DN.sx-.33,T+1.55,DN.sz,'#ffb048');
  SPL.push([.05,1.3,.05,0,T+1.55,0,'#c8c8c8',0,0,0],[.16,.06,.16,0,T+2.22,0,'#b8b8b8',0,0,0]);
  for(let i=0;i<7;i++){ const w=.24+i*.035; SPL.push([w,.15,w,0,T+1.05+i*.15,0,i%3===1?'#a8602e':i%3?'#7a3e1c':'#8f4c24',i*.28,0,0]); }
  P(.07,1.05,.07,-12.2,T+.525,-57.6,'#5a5a62'); P(.4,.04,.4,-12.2,T+.02,-57.6,'#5a5a62'); P(.64,.05,.64,-12.2,T+1.07,-57.6,'#d8d4cc'); P(.07,.13,.07,-12.05,T+1.16,-57.5,'#c83a2a');
  LH.push([.12,.16,.12,-13.6,T+2.62,-59.2,'#fff2cc'],[.12,.16,.12,-13.6,T+2.62,-56.8,'#fff2cc']); LAMPS.push([-13.6,T+2.5,-59.2],[-13.6,T+2.5,-56.8]);
  P(1,.04,.62,44.5,T+.02,65.6,'#6a4a2a'); P(.42,.5,.42,43.2,T+.25,65.6,'#b85a3a'); P(.56,.42,.56,43.2,T+.7,65.6,'#4a7a3a'); P(.14,.14,.14,43.2,T+.98,65.5,'#d84a6a');
  // two trains at the platforms behind the Hauptbahnhof
  for(const z of [HBF.z1+5.5,HBF.z1+15.5]){ P(40,3,2.8,100,T+1.9,z,'#e8e8ea'); P(40.05,.8,2.85,100,T+2.5,z,'#2a3550'); P(40.1,.4,2.9,100,T+1.1,z,'#c23a2a'); }
  // the gold figure on top of the Wasserturm (Amphitrite), a little blocky
  const amph=H.person({ skin:'#d8a636', hair:'#c8962a', shirt:'#d8a636', pants:'#d8a636', shoes:'#c8962a', extra:[[.08,1.6,.08, .42,1.6,0,'#c8962a']] }).map(p=>{ const q=p.slice(); q[6]=q[6]==='#1d1714'||q[6]==='#9a4a3a'?'#a8761e':q[6]; q[8]=0; return q; });
  for(const p of amph) L.push([p[0]*1.3,p[1]*1.3,p[2]*1.3,WT.x+p[3]*1.3,T+37+p[4]*1.3,WT.z+p[5]*1.3,p[6],0,0,0]);
  // v1.38 the L2 hall: a stone altar under the tablet with candles, two benches, flowers, wall lights; a rooftop bench + pots
  P(3.2,.9,.7,14,T+.45,68.4,'#8f897e'); P(3.4,.08,.8,14,T+.94,68.4,'#a59f93');
  for(const [x,h] of [[12.9,.34],[13.4,.24],[14,.4],[14.6,.24],[15.1,.34]]){ P(.12,h,.12,x,T+.98+h/2,68.4,'#f4efe2'); LH.push([.07,.12,.07,x,T+1.04+h,68.4,'#ffcf6a']); LAMPS.push([x,T+1.1+h,68.4]); }
  for(const x of [12.1,15.9]){ P(.36,.5,.36,x,T+.25,68.55,'#6a6258'); for(let k=0;k<5;k++) P(.16,.16,.16,x-.12+(k%3)*.12,T+.58+(k>2?.1:0),68.5+(k&1)*.1,k%2?'#e8e4dc':'#b8202a'); }
  for(const x of [12.6,15.4]){ P(2.2,.1,.46,x,T+.48,71.2,'#6a4a30'); P(2.2,.5,.08,x,T+.78,71.45,'#6a4a30'); for(const s of [-.9,.9]) P(.1,.44,.4,x+s,T+.22,71.2,'#4a3422'); }
  for(const z of [69.5,71.5]){ P(.14,.3,.1,11.05,T+3.4,z,'#3a3530'); LH.push([.18,.22,.1,11.1,T+3.62,z,'#ffe2a8']); LAMPS.push([11.2,T+3.62,z]); }
  for(const [y,z,f] of [[HC+8.4,68.06,1],[HC+15.4,73.94,-1]]){ P(.3,.3,.1,14,y,z,'#3a3530'); LH.push([.22,.22,.1,14,y+.22,z+f*.05,'#ffe2a8']); LAMPS.push([14,y+.22,z+f*.15]); }   // v1.46 stairwell lamps
  P(2,.1,.46,14,LT+1.48,72.6,'#6a4a30'); P(2,.5,.08,14,LT+1.78,72.85,'#6a4a30'); for(const s of [-.8,.8]) P(.1,.44,.4,14+s,LT+1.22,72.6,'#4a3422');
  for(const [x,z] of [[11.6,68.4],[16.4,73.4]]){ P(.6,.5,.6,x,LT+1.25,z,'#a0582f'); P(.7,.6,.7,x,LT+1.8,z,'#3f7f3a'); }
  // ---- v1.62 trams, v1.65 a new line off the Planken (Flax 13:39 "Tram maybe not in Planken. Pretty less space. Tram maybe better:
  // harbour / castle / main station / Paradeplatz"): a double track from the harbour on the north bank over the Kurpfalzbrücke, down
  // the Breite Straße and the Kurpfalzstraße past the Paradeplatz, left along the Bismarckstraße in front of the Schloss and right
  // down the Kaiserring to the Bahnhofsvorplatz. Stops Hafen, Paradeplatz, Schloss, Hauptbahnhof. One centre line (straights and two
  // quarter circles, sampled every 25 cm), right-hand running, grooved rails in the street, a contact wire over each track on span
  // wires (lamp posts carry them where they stand right, plain masts elsewhere), a crossover before each terminus brings a tram to
  // the platform side and each terminus takes one tram at a time; a glass shelter and a stop sign on each platform. index.html
  // runs the trams from TRM (returned as w.tram).
  const TRM=(()=>{ const ds=.25, RC=7, PTS=[[-10,-111],[-10,80],[84,80],[84,106]], pcs=[], X=[], Z=[], TX=[], TZ=[], arcs=[]; let tot=0;
    for(let i=0;i<PTS.length-1;i++){ const [ax,az]=PTS[i], [bx,bz]=PTS[i+1], l=Math.hypot(bx-ax,bz-az), dx=(bx-ax)/l, dz=(bz-az)/l, a0=i?RC:0, a1=i<PTS.length-2?RC:0;
      pcs.push({l:l-a0-a1,f:s=>[ax+dx*(a0+s),az+dz*(a0+s),dx,dz]});
      if(a1){ const [cx,cz]=PTS[i+2], l2=Math.hypot(cx-bx,cz-bz), ex=(cx-bx)/l2, ez=(cz-bz)/l2, ox=bx-dx*RC+ex*RC, oz=bz-dz*RC+ez*RC;
        pcs.push({l:RC*Math.PI/2,arc:1,f:s=>{ const a=s/RC, c=Math.cos(a), n=Math.sin(a); return [ox+RC*(dx*n-ex*c),oz+RC*(dz*n-ez*c),dx*c+ex*n,dz*c+ez*n]; }}); } }
    for(const p of pcs){ p.u0=tot; tot+=p.l; if(p.arc) arcs.push([p.u0,tot]); }
    for(let k=0;k*ds<=tot+1e-6;k++){ const u=k*ds; let p=pcs[pcs.length-1]; for(const q of pcs) if(u<=q.u0+q.l){ p=q; break; } const r=p.f(Math.min(u-p.u0,p.l)); X.push(r[0]); Z.push(r[1]); TX.push(r[2]); TZ.push(r[3]); }
    const n=X.length, o=1.15, cw=8, ce=9, uW=7, uE=tot-8, sm=k=>(1-Math.cos(Math.PI*Math.max(0,Math.min(1,k))))/2;
    const W={L:tot,o,cw,ce,uW,uE,arcs,stops:[[uW,'Hafen'],[143,'Paradeplatz'],[201,'Schloss'],[uE,'Hauptbahnhof']],plat:[],
      at(u,r){ const f=Math.max(0,Math.min(n-1.0001,u/ds)), i=f|0, k=f-i, tx=TX[i]+(TX[i+1]-TX[i])*k, tz=TZ[i]+(TZ[i+1]-TZ[i])*k, l=Math.hypot(tx,tz)||1;
        r[0]=X[i]+(X[i+1]-X[i])*k; r[1]=Z[i]+(Z[i+1]-Z[i])*k; r[2]=tx/l; r[3]=tz/l; return r; },                     // the centre line at u: x, z, tangent
      lat(u,d){ return o-2*o*sm(d>0?(u-(uE-ce-cw))/cw:(u-(uW+ce))/cw); },                                             // the track a tram going d uses (right of +u)
      pt(u,l,r){ W.at(u,r); const tx=r[2], tz=r[3]; r[0]-=tz*l; r[1]+=tx*l; return r; },                                // l to the right of the centre line
      off(x,z){ let b=1e9; for(let i=0;i<n;i+=4){ const d=(X[i]-x)**2+(Z[i]-z)**2; if(d<b) b=d; } return Math.sqrt(b); } };
    return W; })();
  { const RG='#2a2b2f', RS='#a4a6aa', WI='#25272b', MA='#2b2b2e', GLs='#a9c3cb', FR='#4a4e54', q=[0,0,0,0], q2=[0,0,0,0], u1=TRM.L;
    // a line beside the centre line (lateral fn(u)) from ua to ub: straight runs merged into one box, bends in short pieces
    const run=(ua,ub,fn,lay)=>{ const pts=[]; for(let u=ua;;u=Math.min(ub,u+1)){ TRM.pt(u,fn(u),q); pts.push([q[0],q[1]]); if(u>=ub) break; }
      let i0=0; for(let i=2;i<=pts.length;i++){ let ok=i<pts.length;
        if(ok){ const [ax,az]=pts[i0], [bx,bz]=pts[i], l=Math.hypot(bx-ax,bz-az); for(let j=i0+1;j<i&&ok;j++) if(Math.abs((pts[j][0]-ax)*(bz-az)-(pts[j][1]-az)*(bx-ax))/l>.03) ok=false; }
        if(!ok){ lay(pts[i0][0],pts[i0][1],pts[i-1][0],pts[i-1][1]); i0=i-1; } } };
    const rail=(xa,za,xb,zb)=>{ const dx=xb-xa, dz=zb-za, l=Math.hypot(dx,dz)+.04, ry=Math.atan2(-dz,dx), cx=(xa+xb)/2, cz=(za+zb)/2;
      P(l,.025,.11,cx,T+.012,cz,RG,ry); P(l,.03,.045,cx,T+.016,cz,RS,ry); };
    const wire=(xa,za,xb,zb)=>{ const dx=xb-xa, dz=zb-za; P(Math.hypot(dx,dz)+.03,.035,.035,(xa+xb)/2,T+4.75,(za+zb)/2,WI,Math.atan2(-dz,dx)); };
    const o=TRM.o, xE=[TRM.uE-TRM.ce-TRM.cw,TRM.uE-TRM.ce], xW=[TRM.uW+TRM.ce,TRM.uW+TRM.ce+TRM.cw];
    for(const sg of [1,-1]){ for(const r of [-.5,.5]) run(0,u1,()=>sg*o+r,rail); run(1.5,u1-1.5,()=>sg*o,wire); }
    for(const [d,[ua,ub]] of [[1,xE],[-1,xW]]){ for(const r of [-.5,.5]) run(ua,ub,u=>TRM.lat(u,d)+r,rail); run(ua,ub,u=>TRM.lat(u,d),wire); }
    for(const [u,f] of [[0,1],[u1,-1]]) for(const sg of [1,-1]){ TRM.pt(u-f*.2,sg*o,q); P(1.5,.55,.3,q[0],T+.28,q[1],'#3a3c40',Math.atan2(-q[3],q[2])+Math.PI/2); P(1.3,.14,.32,q[0],T+.42,q[1],'#c8a22a',Math.atan2(-q[3],q[2])+Math.PI/2); }   // buffer stops
    // masts every 24 m, a lamp post standing within 1.5 m of the spot grows the mast instead; a span wire across, a dropper to each wire
    for(const u of [2,21,45,69,93,117,141,165,189,213,237,261,285,u1-2]){ const m=[];
      for(const sg of [1,-1]){ TRM.pt(u,sg*3.4,q); let lp=null, bd=1.5; for(const l of LAMPS){ const dd=Math.hypot(l[0]-q[0],l[2]-q[1]); if(dd<bd&&l[1]>T+3.8){ bd=dd; lp=l; } }
        if(lp){ P(.12,1.1,.12,lp[0],T+4.75,lp[2],MA); P(.18,.08,.18,lp[0],T+5.33,lp[2],MA); m.push([lp[0],lp[2]]); }
        else { P(.16,5.35,.16,q[0],T+2.67,q[1],MA); P(.28,.12,.28,q[0],T+.06,q[1],MA); m.push([q[0],q[1]]); } }
      const [[xa,za],[xb,zb]]=m, dx=xb-xa, dz=zb-za; P(Math.hypot(dx,dz),.035,.035,(xa+xb)/2,T+5.2,(za+zb)/2,WI,Math.atan2(-dz,dx));
      for(const sg of [1,-1]){ TRM.pt(u,sg*o,q); P(.03,.45,.03,q[0],T+4.97,q[1],WI); } }
    // the shelters: glass back and one glass side, a flat roof, a bench, a white timetable panel, the stop sign's pole beside it;
    // [u, side (1 = right of +u), lateral of the glass back, stop]
    for(const [u,sg,lb,nm] of [[3.5,1,4.4,'Hafen'],[145,1,4.95,'Paradeplatz'],[145,-1,4.95,'Paradeplatz'],[199.5,-1,4.85,'Schloss'],[202.5,1,4.3,'Schloss'],[TRM.uE+2,-1,3.8,'Hauptbahnhof']]){
      TRM.pt(u,sg*lb,q); const fx=TRM.at(u,q2)[3]*sg, fz=-q2[2]*sg, cx=q[0], cz=q[1], ry=Math.atan2(fx,fz), Q=(w,h,d,dx,y,dz,c)=>P(w,h,d,cx+dx*fz+dz*fx,y,cz-dx*fx+dz*fz,c,ry);
      for(const dx of [-.92,.92]) for(const dz of [0,.8]) Q(.07,2.35,.07,dx,T+1.17,dz,FR);
      Q(1.84,1.75,.04,0,T+1.2,0,GLs); Q(.04,1.75,.76,-.92,T+1.2,.4,GLs);
      Q(2.06,.09,1.12,0,T+2.39,.42,FR); Q(2.06,.13,.05,0,T+2.36,.98,'#5c6168');
      Q(1.3,.07,.34,.2,T+.5,.26,'#8a9098'); for(const dx of [-.35,.75]) Q(.06,.46,.3,dx,T+.23,.26,FR);
      Q(.62,.82,.03,-.45,T+1.5,.035,'#f4f1ea'); Q(.5,.06,.031,-.45,T+1.78,.04,'#2a6a4a');
      const sx=cx+1.15*fz+.75*fx, sz=cz-1.15*fx+.75*fz; P(.07,2.62,.07,sx,T+1.31,sz,'#5a5e64'); TRM.plat.push([sx,sz,Math.atan2(fz,-fx),nm]);
      const xs=[cx-2.3*fz,cx+2.3*fz,cx+(lb-2.2)*fx-2.3*fz,cx+(lb-2.2)*fx+2.3*fz], zs=[cz+2.3*fx,cz-2.3*fx,cz+(lb-2.2)*fz+2.3*fx,cz+(lb-2.2)*fz-2.3*fx];
      TRM.plat[TRM.plat.length-1].push(Math.min(...xs),Math.max(...xs),Math.min(...zs),Math.max(...zs)); } }
  // ---- v1.65 the Planken comes alive (Flax): the trams take the Breite Straße now, so the Planken is a paved shopping street.
  // Display windows and plain shop signs (just what they sell: no names, no logos), awnings, an Eiscafé in D1 with tables out
  // front, a corner kiosk at N4. index.html walks the shoppers, the pigeons and the buskers (w.plk) ----
  for(let x=-100;x<=79;x++) if(x<AX.x0||x>AX.x1) for(let z=PLK.z0;z<=PLK.z1;z++) if(get(x,T-1,z)===B.asphalt) set(x,T-1,z,B.pave);
  const PKW=[], PKG=[], PKZ=[], isShp=b=>b===B.shop||b===B.shopLit;   // display windows [x0,x1,zf,sd,type], signs [cx,w,zf,sd,type], keep-out zones
  const AWC=['#34506e','#a8442e',0,'#2e2e30','#3f6a3a',0,'#c08a2a',0];   // awning colours by shop type (0 = none)
  for(const h of PKH){ const [x0,z0,x1,z1]=h, sd=z1===PLK.z0-2?1:z0===PLK.z1+2?-1:0; if(!sd||x1<-100||x0>79) continue;
    if(sd<0&&x0<=-16&&x1>=-24) continue;   // D1 is the Eiscafé
    const zc=sd>0?z1:z0, zf=sd>0?z1+1:z0, ty=Math.floor(hsh(x0,7,z0)*8); let run=-1, any=0;
    for(let x=x0+1;x<=x1;x++){ const w=x<x1&&(x-x0)%4!==0&&isShp(get(x,T+1,zc)); if(w&&run<0) run=x;
      if(!w&&run>=0){ PKW.push([run,x,zf,sd,ty]); any=1; const n=x-run, cx=(run+x)/2, c=AWC[ty];
        if(c){ const ry=sd>0?0:Math.PI; P(n+.1,.05,1,cx,T+2.765,zf+sd*.464,c,ry,.38); P(n+.1,.22,.03,cx,T+2.47,zf+sd*.93,'#efe6d2',ry);
          for(let k=-n/2+.35;k<n/2-.2;k+=.7) P(.32,.056,1,cx+k,T+2.765,zf+sd*.464,'#efe6d2',ry,.38); }
        run=-1; } }
    if(any) PKG.push([(x0+x1+1)/2,Math.min(x1-x0-.6,5.2),zf,sd,ty]); }
  // the Eiscafé: an open counter in D1's ground floor (x -22..-18), tubs under a steel hood, Signora Bruna behind it
  for(let x=-22;x<=-18;x++){ for(let z=25;z<=26;z++) for(let y=T;y<T+3;y++) set(x,y,z,0); set(x,T,25,B.sandstone); }
  P(5,.9,.04,-20,T+.5,24.97,'#f2efe6'); P(5,.06,.05,-20,T+.93,24.96,'#b8bcc0'); P(5,.14,.045,-20,T+.18,24.965,'#8fc9b4');
  P(4.8,.04,.8,-20,T+1.02,25.45,'#c8ccd0');
  ['#f4e8c8','#5a3a2a','#e86a8a','#f2e65a','#9ccf7a','#f4a04a','#c84a6a','#f4f0e8'].forEach((c,i)=>{ P(.5,.08,.3,-22.1+i*.6,T+1.07,25.25,c); P(.5,.08,.3,-22.1+i*.6,T+1.07,25.65,['#f2e65a','#f4e8c8','#9ccf7a','#5a3a2a','#e86a8a','#f4f0e8','#f4a04a','#c84a6a'][i]); });
  P(4.9,.04,.04,-20,T+1.45,25.1,'#c8ccd0'); P(4.9,.04,.04,-20,T+1.45,25.8,'#c8ccd0'); for(const x of [-22.45,-17.55]) for(const z of [25.1,25.8]) P(.04,.42,.04,x,T+1.24,z,'#c8ccd0');
  P(5,2,.04,-20,T+1.5,26.97,'#d8efe6'); P(4.8,.9,.5,-20,T+.45,26.72,'#f2efe6'); P(.6,.45,.4,-21.4,T+1.12,26.7,'#2a2a2e'); P(.2,.08,.2,-21.4,T+.94,26.5,'#b8bcc0');
  P(4.6,.05,.25,-20,T+1.85,26.85,'#f4f0e8'); for(let i=0;i<7;i++) P(.1,.2,.1,-19.8+i*.36,T+1.97,26.85,i%2?'#f4f0e8':'#d8a860');
  P(5.3,.05,1,-20,T+2.765,24.536,'#e88aa0',Math.PI,.38); P(5.3,.22,.03,-20,T+2.47,24.07,'#fff4f0',Math.PI); for(let k=-2.3;k<2.5;k+=.7) P(.32,.056,1,-20+k,T+2.765,24.536,'#fff4f0',Math.PI,.38);
  for(const tx of [-23.6,-20,-16.4]){ const tz=22.6;   // tables out front with parasols; the free chairs are seats
    P(.72,.05,.72,tx,T+.74,tz,'#e8e4dc'); P(.06,.7,.06,tx,T+.37,tz,'#5a5e64'); P(.4,.04,.4,tx,T+.02,tz,'#5a5e64');
    P(.05,1.6,.05,tx,T+1.55,tz,'#e8e4dc'); P(1.9,.08,1.9,tx,T+2.3,tz,'#f4efe2'); P(1.1,.1,1.1,tx,T+2.38,tz,'#f4efe2'); P(1.92,.12,1.92,tx,T+2.22,tz,'#e88aa0');
    for(const sg of [-1,1]){ const cx=tx+sg*.62; P(.4,.05,.4,cx,T+.45,tz,'#3a6a5a'); P(.04,.42,.4,cx+sg*.2,T+.68,tz,'#3a6a5a'); for(const dz of [-.17,.17]) P(.36,.42,.03,cx,T+.21,tz+dz,'#5a5e64');
      if(!(tx===-23.6&&sg<0)) SEATS.push({x:cx,z:tz,yaw:sg<0?-Math.PI/2:Math.PI/2,pitch:.15,stand:[cx,tz-1.05]}); } }
  P(.26,.02,.26,-23.5,T+.775,22.6,'#f4f4f0'); P(.18,.05,.18,-23.5,T+.81,22.6,'#f4eac8'); P(.1,.02,.1,-23.5,T+.845,22.6,'#c8202a'); P(.06,.012,.06,-23.47,T+.86,22.58,'#fffaf0');
  PKZ.push([-24.5,-15.5,21.7,23.55]);
  // the kiosk near N4's north-west corner (x 42..44, clear of the N4 plate): a sales window in the ground floor, papers, sweets and a drinks fridge, Herr Gerlach
  for(let x=42;x<=44;x++){ for(let z=39;z<=40;z++) for(let y=T;y<T+3;y++) set(x,y,z,0); set(x,T,39,B.sandstone); }
  P(3,.95,.04,43.5,T+.5,38.97,'#2e4a66'); for(let i=0;i<6;i++) for(let j=0;j<2;j++) P(.24,.32,.02,42.3+i*.48,T+.27+j*.4,38.94,['#d84a3a','#f2c84a','#4a8ad8','#ecebe4','#3aa86a','#e86aa8'][(i+j*3)%6]);
  for(let i=0;i<3;i++){ P(.38,.05,.5,42.45+i*.5,T+1.03,39.35,'#ecebe4'); P(.3,.006,.08,42.45+i*.5,T+1.058,39.2,'#2a2a2a'); }
  ['#d84a3a','#f2c84a','#e86aa8','#3aa86a'].forEach((c,i)=>P(.14,.2,.14,44.05+(i%2)*.2,T+1.1,39.25+(i>>1)*.2,c));
  for(const y of [T+1.3,T+1.75]){ P(2,.04,.22,42.9,y,40.85,'#8a6a4a'); for(let i=0;i<8;i++) P(.16,.18,.12,42.05+i*.24,y+.11,40.85,['#d84a3a','#f2c84a','#4a8ad8','#e86aa8','#7a4a2a','#3aa86a'][(i+(y>T+1.5?2:0))%6]); }
  P(.9,1.95,.55,44.45,T+.98,40.6,'#f2f2ee'); P(.74,1.5,.02,44.45,T+1.15,40.32,'#a8c4d0');
  for(let r=0;r<3;r++) for(let i=0;i<5;i++) P(.08,.26,.02,44.17+i*.14,T+.68+r*.42,40.305,['#3a1a10','#f08a20','#3a9a4a','#9ad0f0','#f0d040'][(i+r)%5]);
  P(3.2,.05,.9,43.5,T+2.79,38.58,'#2a5a8a',Math.PI,.38); P(3.2,.2,.03,43.5,T+2.48,38.16,'#e8e4dc',Math.PI);
  P(.6,1,.25,41.3,T+.5,38.55,'#5a5e64'); P(.5,.32,.03,41.3,T+.8,38.41,'#ecebe4'); P(.5,.32,.03,41.3,T+.4,38.41,'#f2e6c8');
  // ---- v1.66 the bag's places (Flax). A tiny Hinterhof inside N4 behind a little green door on the block's east side
  // (passage x 47..48 at z 43; index.html draws the door, locks it through w.solid and opens it with Herr Gerlach's key),
  // with a bench and a cat. Liesel's Konditorei on the west Planken: her tray tipped on the step (index.html: the five pieces)
  const YD={shut:1,door:[48.96,43.02],bench:[44.4,42.3],cat:[45.02,42.32]};
  for(let x=43;x<=46;x++) for(let z=42;z<=45;z++){ for(let y=T;y<=T+22;y++) set(x,y,z,0); set(x,T-1,z,B.pave); }
  for(let x=47;x<=48;x++){ set(x,T,43,0); set(x,T+1,43,0); set(x,T-1,43,B.pave); }
  for(const [x,z] of [[42,43],[42,45],[44,41],[46,41],[45,46],[47,42],[47,45]]) for(const y of [T+5,T+8,T+11]) if(get(x,y,z)&&get(x,y+1,z)) set(x,y,z,B.windowLit);
  P(1.6,.1,.42,44.4,T+.45,42.32,'#7a5232'); P(1.6,.4,.08,44.4,T+.78,42.1,'#7a5232'); for(const k of [-.68,.68]) P(.08,.42,.38,44.4+k,T+.21,42.32,'#2b2b2e');
  SEATS.push({x:44.05,z:42.62,yaw:Math.PI,pitch:.12,stand:[44.05,43.6],k:'bench',hint:'Sit a while in the quiet yard'});   // v1.67 its own hint (was the fountains one)
  for(const [x,z,c] of [[46.45,45.45,'#c8402a'],[43.5,45.45,'#e8d050']]){ P(.42,.36,.42,x,T+.18,z,'#a85a32'); P(.48,.3,.48,x,T+.5,z,'#4a7a3a'); P(.12,.08,.12,x-.1,T+.69,z,c); P(.12,.08,.12,x+.12,T+.67,z+.1,c); }
  P(.05,1.9,.05,43.06,T+.95,44,'#4a7a3a'); P(.04,1.4,.6,43.04,T+1.4,43.8,'#3f6a3a');   // a climbing rose by the west wall, no flowers yet
  P(2.9,.012,.012,44.9,T+2.3,44.6,'#d8d4cc',Math.PI/2.3); P(.3,.4,.02,44.6,T+2.08,44.3,'#e8dcc8',Math.PI/2.3); P(.26,.32,.02,45.3,T+2.12,44.9,'#8aa8c8',Math.PI/2.3);   // a washing line
  P(.18,.04,.5,49.02,T+1.85,43.5,'#24382c');   // a little lintel over the door
  // v1.67 the Schiller monument: two steps, the stone base dressed a little wider than its voxel core, a cornice, a plinth, and
  // Schiller in green-brown bronze looking north up the square in a long coat, a scroll in his right hand. Two benches on the forecourt
  // look up at him, two lamps by the paths, a stone tablet by the east path for the Nationaltheater
  { const X=SLP.cx, Z=SLP.cz, SS='#c9b59d', SD='#b29c83', BZ='#6f8d79';
    P(3.4,.18,3.4,X,T+.09,Z,'#bdb6aa'); P(2.8,.36,2.8,X,T+.18,Z,'#c9c2b6');
    P(2.24,2.62,2.24,X,T+1.67,Z,SS); P(2.5,.3,2.5,X,T+3.1,Z,SD); P(2.16,.22,2.16,X,T+3.36,Z,SS); P(1.7,.3,1.7,X,T+3.6,Z,SD);
    statue(X,T+3.75,Z,Math.PI,1.3,{extra:[[.13,.44,.13, .42,.92,.13,'#7f9d88'],[.66,.56,.42, 0,.78,-.02,BZ]]},BZ);
    for(const x of [X-2.3,X+2.3]){ const z=SLP.z0+1.6, an=Math.PI;   // two benches on the forecourt, facing him
      P(1.8,.12,.5,x,T+.45,z,'#7a5232',an); P(1.8,.45,.1,x,T+.78,z-.25,'#7a5232',an); for(const k of [-.75,.75]) P(.08,.4,.42,x+k,T+.2,z,'#2b2b2e',an);
      SEATS.push({x,z:z+.05,yaw:Math.atan2(x-X,z-SLP.cz),pitch:.72,stand:[x,z-1.1],k:'bench',hint:'Sit and look up at Schiller'}); }   // the seat turns you to him
    lamp(X+1.4,SLP.z0-.5); lamp(X-1.4,SLP.z1+1.5);
    P(.18,1.0,1.0,SLP.x1-.2,T+.62,55.6,'#9c9488'); P(.34,.16,1.2,SLP.x1-.2,T+.08,55.6,'#8a8276'); }
  const LZ={x:-35,z:17.55};
  P(.52,.03,.36,-34.25,T+.1,18.1,'#c8c8cc',.4,.32); P(.4,.006,.28,-34.25,T+.12,18.08,'#f4f1ea',.4,.32);   // her tipped tray + doily on the step
  PKZ.push([LZ.x-1.3,LZ.x+1.3,17,18.4]);
  const PLKW={x0:-98,x1:77,zones:PKZ,yard:YD,kond:[LZ.x,LZ.z],cafe:[-20,26.05],kiosk:[43,40.3],busk:[[21.6,16.3],[51.6,25.7]],
    flocks:[[-23,20.3],[-52,20.8],[12,20.6],[33,21.2],[63,20.4]]};
  // ---- v1.64 e-scooter stands (Flax 12:23 + 13:14): by Murat's döner window, in the Schloss's Ehrenhof and on the
  // Bahnhofsvorplatz. A painted white parking box on the ground; index.html parks n plain scooters in each, heading h.
  const ESKS=[{x:-13.25,z:-54.2,h:-Math.PI/2,n:3},{x:-14.2,z:86.6,h:0,n:3},{x:81.6,z:110.2,h:0,n:3}];
  for(const e of ESKS){ const Wd=e.n*.9+.3, D=1.5, c=Math.cos(e.h), sn=Math.sin(e.h), L=(lx,lz)=>[e.x+lx*c+lz*sn,e.z-lx*sn+lz*c];
    for(const sd of [-1,1]){ const [ax,az]=L(0,sd*D/2), [bx,bz]=L(sd*Wd/2,0); P(Wd+.06,.012,.06,ax,T+.006,az,'#dcdcd4',e.h); P(.06,.012,D,bx,T+.006,bz,'#dcdcd4',e.h); } }
  const propMat=new THREE.MeshLambertMaterial({vertexColors:true});
  const pm=new THREE.Mesh(blockyGeo(L),propMat); pm.matrixAutoUpdate=false; group.add(pm);
  const spit=new THREE.Mesh(blockyGeo(SPL),propMat); spit.position.set(DN.sx,0,DN.sz); spit.matrixAutoUpdate=false; spit.updateMatrix(); group.add(spit);   // v1.55
  const rsDay=new THREE.MeshLambertMaterial({vertexColors:true}), rsNight=new THREE.MeshBasicMaterial({vertexColors:true,color:0xc8b49a});   // v1.51 the Schloss rooms' props
  const rsm=new THREE.Mesh(blockyGeo(RSL),rsDay); rsm.matrixAutoUpdate=false; group.add(rsm);

  // lamp glow: one Points cloud, only drawn at night
  const lg=new THREE.BufferGeometry(); lg.setAttribute('position',new THREE.Float32BufferAttribute(LAMPS.flat(),3));
  const lamps=new THREE.Points(lg,new THREE.PointsMaterial({color:0xffcf7a,size:1.5,map:H.roundDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  lamps.visible=false; group.add(lamps);
  // v1.33 the lamp glass (dark by day, glowing at night) and a warm pool of light on the ground under every lamp (one instanced mesh)
  const headMat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});
  const heads=new THREE.Mesh(blockyGeo(LH),headMat); heads.matrixAutoUpdate=false; group.add(heads);
  const pc=document.createElement('canvas'); pc.width=pc.height=64; { const x=pc.getContext('2d'), gr=x.createRadialGradient(32,32,0,32,32,32);
    gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.45,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=gr; x.fillRect(0,0,64,64); }
  const ptx=new THREE.CanvasTexture(pc);
  const pools=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:ptx,color:0xffb860,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending,fog:true}),POOL.length);
  { const o=new THREE.Object3D(); POOL.forEach(([x,z],i)=>{ o.position.set(x,T+.035,z); o.scale.setScalar(7); o.updateMatrix(); pools.setMatrixAt(i,o.matrix); }); }
  pools.instanceMatrix.needsUpdate=true; pools.frustumCulled=false; pools.visible=false; pools.renderOrder=1; group.add(pools);

  // boards (canvas textures, a little self-lit so they read at night)
  function board(w,h,cw,ch,paint,x,y,z,ry,two,cut){ const c=document.createElement('canvas'); c.width=cw; c.height=ch; paint(c.getContext('2d'),cw,ch);
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.3,alphaTest:cut?.5:0,side:two?THREE.DoubleSide:THREE.FrontSide}));
    m.position.set(x,y,z); m.rotation.y=ry||0; m.matrixAutoUpdate=false; m.updateMatrix(); group.add(m); return {m,c,t}; }
  const FONT='"Pixelify Sans", ui-monospace, monospace';
  board(9,1.6,576,102,(g,w,h)=>{ g.fillStyle='#1f3f7a'; g.fillRect(0,0,w,h); g.strokeStyle='#f4f1ea'; g.lineWidth=6; g.strokeRect(6,6,w-12,h-12); g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 50px '+FONT; g.fillText('MANNHEIM',w/2,h*.4); g.font='400 22px '+FONT; g.fillText('Anlegestelle · Quadratestadt',w/2,h*.78); },
    8,T+3.4,-78.97,Math.PI);
  const NB=[];   // v1.33 boards that light up at night: [board, day, night]
  // v1.62 the tram stop signs: a yellow disc with a green H over a white name plate (one canvas, cut out, both sides)
  const stopSign=(name,x,z,ry)=>NB.push([board(.62,.84,256,348,(g,w,h)=>{ g.clearRect(0,0,w,h); g.fillStyle='#1f7a3a'; g.beginPath(); g.arc(w/2,118,116,0,Math.PI*2); g.fill();
    g.fillStyle='#f2c81e'; g.beginPath(); g.arc(w/2,118,100,0,Math.PI*2); g.fill(); g.fillStyle='#1f7a3a'; g.fillRect(78,52,26,132); g.fillRect(152,52,26,132); g.fillRect(78,105,100,26);
    g.fillStyle='#f4f4f0'; g.fillRect(6,250,w-12,92); g.strokeStyle='#1f2a2a'; g.lineWidth=4; g.strokeRect(8,252,w-16,88);
    g.fillStyle='#1a1d22'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 38px '+FONT; g.fillText(name,w/2,297,w-30); },x,T+2.95,z,ry,true,true),.3,.8]);
  NB.push([board(3.4,.62,544,100,(g,w,h)=>{ g.fillStyle='#c8322a'; g.fillRect(0,0,w,h); g.strokeStyle='#f2c53a'; g.lineWidth=6; g.strokeRect(6,6,w-12,h-12);
    g.fillStyle='#fff4d8'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 52px '+FONT; g.fillText('DÖNER · DÜRÜM',w/2,h*.54); },-14.95,T+3.62,-58.1,Math.PI/2),.35,.9]);   // v1.55
  NB.push([board(2.8,.5,560,100,(g,w,h)=>{ g.fillStyle='#24452e'; g.fillRect(0,0,w,h); g.fillStyle='#f4ecd0'; g.textBaseline='middle'; g.font='700 30px '+FONT;
    [['Döner','6,50'],['Dürüm','7,00'],['Falafel','6,00'],['Ayran','2,00']].forEach(([a,b],i)=>{ const x=14+i*137; g.textAlign='left'; g.fillText(a,x,h*.33); g.fillStyle='#f2c53a'; g.fillText(b,x,h*.74); g.fillStyle='#f4ecd0'; }); },-14.94,T+2.3,-58.1,Math.PI/2),.35,.9]);   // v1.55 the menu over Murat's head
  NB.push([board(15,1.5,640,64,(g,w,h)=>{ g.fillStyle='#14233f'; g.fillRect(0,0,w,h); g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 40px '+FONT; g.fillText('MANNHEIM HAUPTBAHNHOF',w/2,h/2+2); },
    (HBF.hx0+HBF.hx1+1)/2,T+12.6,HBF.z0-.03,Math.PI),.3,.9]);
  const clock=board(2.6,2.6,128,128,()=>{},(HBF.hx0+HBF.hx1+1)/2,T+14.65,HBF.z0-.04,Math.PI); NB.push([clock,.3,1.25]);
  for(const p of TRM.plat) stopSign(p[3],p[0],p[1],p[2]);   // v1.62, v1.65 the new line
  { // v1.65 the Planken shop fronts: 8 kinds of display window (256x170) and their signs (512x72) on one canvas, one mesh
    const SHT=['Schuhe','Bäckerei','Bücher','Mode','Blumen','Optik','Spielwaren','Uhren · Schmuck'];
    const SGC=[['#1f3550','#f2ead8'],['#7a2e1e','#f6e3b0'],['#25402e','#efe4c4'],['#121214','#f4f1ea'],['#3d5f36','#fbf4e4'],['#e8e6e0','#1f2a3a'],['#c8442a','#fff2c8'],['#2a2440','#e6c870']];
    const c=document.createElement('canvas'); c.width=1024; c.height=640; const g=c.getContext('2d'), rr=H.rngOf(1969);
    const box=(x,y,w,h,col)=>{ g.fillStyle=col; g.fillRect(x,y,w,h); };
    for(let i=0;i<8;i++){ const ox=(i%4)*256, oy=Math.floor(i/4)*170, W=256, Hh=170;
      const gr=g.createLinearGradient(0,oy,0,oy+Hh); gr.addColorStop(0,['#4a3a30','#5a3c26','#3a3226','#2c2a2e','#3a3a2a','#e4e2dc','#3a2c3e','#141626'][i]); gr.addColorStop(1,['#2a201a','#3a2414','#221c14','#18171a','#22261a','#b8b6b0','#221a26','#0a0b14'][i]);
      g.fillStyle=gr; g.fillRect(ox,oy,W,Hh);
      if(i===0) for(let r=0;r<3;r++) for(let k=0;k<6;k++){ const x=ox+14+k*40, y=oy+40+r*44; box(ox+8,y+14,W-16,4,'#d8d0c0'); const col=['#5a2a1a','#c8a070','#1a1a1a','#a83a3a','#e8e4dc','#3a4a6a'][(k+r*2)%6]; box(x,y,24,10,col); box(x,y-6,9,8,col); box(x+20,y+6,6,4,'#1a1a1a'); }
      if(i===1){ box(ox+8,oy+108,W-16,10,'#c8a070'); for(let k=0;k<7;k++){ g.fillStyle=k%2?'#a8642a':'#c88a3a'; g.beginPath(); g.ellipse(ox+28+k*33,oy+98,15,10,0,0,7); g.fill(); }
        g.strokeStyle='#8a4a1e'; g.lineWidth=5; for(let k=0;k<4;k++){ g.beginPath(); g.arc(ox+40+k*58,oy+58,13,0,7); g.stroke(); } box(ox+8,oy+76,W-16,5,'#e8dcc4'); }
      if(i===2) for(let r=0;r<3;r++){ box(ox+8,oy+52+r*44,W-16,5,'#8a6a4a'); for(let x=ox+12;x<ox+W-14;){ const w=6+rr()*9; box(x,oy+18+r*44,w-1,34-rr()*8,['#7a2a2a','#2a4a6a','#d8c890','#3a6a3a','#e8e4dc','#a86a2a','#4a2a5a'][Math.floor(rr()*7)]); x+=w; } }
      if(i===3) for(let k=0;k<3;k++){ const x=ox+50+k*78, col=['#c84a5a','#2a5a8a','#e8d8b0'][k]; g.fillStyle='#e8d8c8'; g.beginPath(); g.arc(x,oy+34,10,0,7); g.fill(); box(x-3,oy+43,6,8,'#e8d8c8');
        g.fillStyle=col; g.beginPath(); g.moveTo(x-16,oy+51); g.lineTo(x+16,oy+51); g.lineTo(x+26,oy+130); g.lineTo(x-26,oy+130); g.fill(); box(x-2,oy+130,4,28,'#2a2a2a'); }
      if(i===4) for(let k=0;k<6;k++){ const x=ox+24+k*40; box(x-12,oy+112,24,40,['#6a6a72','#8a5a3a','#5a6a7a'][k%3]); box(x-1,oy+70,2,44,'#3a6a2a');
        for(let n=0;n<9;n++){ g.fillStyle=['#e84a6a','#f2d23a','#f4f0f4','#c86ae8','#f08a3a'][(k+n)%5]; g.beginPath(); g.arc(x-12+rr()*24,oy+56+rr()*40,5,0,7); g.fill(); } }
      if(i===5){ for(let r=0;r<3;r++){ box(ox+8,oy+58+r*40,W-16,4,'#a8a6a0'); for(let k=0;k<5;k++){ g.strokeStyle=['#1a1a1a','#8a3a2a','#2a4a8a','#c8a050','#3a3a3a'][(k+r)%5]; g.lineWidth=3; const x=ox+34+k*46, y=oy+44+r*40;
        g.beginPath(); g.arc(x-9,y,8,0,7); g.stroke(); g.beginPath(); g.arc(x+9,y,8,0,7); g.stroke(); } } }
      if(i===6){ g.fillStyle='#a8743a'; g.beginPath(); g.arc(ox+60,oy+98,26,0,7); g.fill(); g.beginPath(); g.arc(ox+60,oy+60,18,0,7); g.fill(); g.beginPath(); g.arc(ox+46,oy+44,7,0,7); g.arc(ox+74,oy+44,7,0,7); g.fill();
        g.fillStyle='#e84a3a'; g.beginPath(); g.arc(ox+140,oy+120,20,0,7); g.fill(); box(ox+132,oy+106,16,4,'#f4f0e8');
        ['#3a7ad8','#f2c83a','#3ab86a','#e84a6a'].forEach((col,k)=>box(ox+180+(k%2)*28,oy+128-(k>>1)*28,26,26,col)); box(ox+8,oy+150,W-16,6,'#e8e4dc'); }
      if(i===7){ for(let r=0;r<2;r++){ box(ox+14,oy+60+r*56,W-28,26,'#1e2a5a'); for(let k=0;k<7;k++){ g.strokeStyle=r?'#e6c870':'#d8d8e0'; g.lineWidth=r?2:3; g.beginPath(); g.arc(ox+34+k*31,oy+72+r*56,r?6:9,0,7); g.stroke(); } } }
      // the glass: the window's cells, a sill, a sheen
      g.fillStyle='rgba(210,230,255,.10)'; g.beginPath(); g.moveTo(ox+30,oy); g.lineTo(ox+110,oy); g.lineTo(ox+40,oy+Hh); g.lineTo(ox-40,oy+Hh); g.fill();
      box(ox,oy,W,5,'#d8d2c4'); box(ox,oy+Hh-6,W,6,'#bdb6a8'); for(const x of [0,85,170,251]) box(ox+x,oy,5,Hh,'#d8d2c4'); }
    for(let i=0;i<8;i++){ const ox=(i%2)*512, oy=352+Math.floor(i/2)*72, [bg,fg]=SGC[i]; box(ox,oy,512,72,bg); g.strokeStyle=fg; g.globalAlpha=.55; g.lineWidth=3; g.strokeRect(ox+6,oy+6,500,60); g.globalAlpha=1;
      g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle'; g.font=(i===2||i===7?'italic 700 46px Georgia, "Times New Roman", serif':'700 44px '+FONT); g.fillText(SHT[i],ox+256,oy+38,480); }
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4;
    const sp=[], sn=[], su=[], si=[]; let vc=0;
    const quad=(cx,w,y0,y1,zf,sd,u0,u1,v0,v1)=>{ const z=zf+sd*.025, xa=cx-sd*w/2, xb=cx+sd*w/2;
      sp.push(xa,y0,z, xb,y0,z, xb,y1,z, xa,y1,z); for(let k=0;k<4;k++) sn.push(0,0,sd); su.push(u0,v0,u1,v0,u1,v1,u0,v1); si.push(vc,vc+1,vc+2,vc,vc+2,vc+3); vc+=4; };
    for(const [a,b,zf,sd,ty] of PKW){ const ox=(ty%4)*256, oy=Math.floor(ty/4)*170, n=b-a;
      quad((a+b)/2,n-.04,T+1.02,T+2.98,zf,sd,ox/1024,(ox+256*n/3)/1024,1-(oy+170)/640,1-oy/640); }
    for(const [cx,w,zf,sd,ty] of PKG){ const ox=(ty%2)*512, oy=352+Math.floor(ty/2)*72; quad(cx,w,T+3.18,T+3.82,zf,sd,ox/1024,(ox+512)/1024,1-(oy+72)/640,1-oy/640); }
    const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sg.setAttribute('normal',new THREE.Float32BufferAttribute(sn,3)); sg.setAttribute('uv',new THREE.Float32BufferAttribute(su,2)); sg.setIndex(si);
    const m=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.18})); m.matrixAutoUpdate=false; group.add(m); NB.push([{m},.18,.72]);
    NB.push([board(5,.7,640,90,(g,w,h)=>{ g.fillStyle='#f6efe0'; g.fillRect(0,0,w,h); g.strokeStyle='#d86a84'; g.lineWidth=6; g.strokeRect(5,5,w-10,h-10);
      g.fillStyle='#c23a5a'; g.textAlign='center'; g.textBaseline='middle'; g.font='italic 700 62px Georgia, "Times New Roman", serif'; g.fillText('Eiscafé',w/2,h/2+3); },-20,T+3.5,24.97,Math.PI),.3,.95]);
    NB.push([board(.9,1.25,288,400,(g,w,h)=>{ g.fillStyle='#7a5232'; g.fillRect(0,0,w,h); g.fillStyle='#22382c'; g.fillRect(14,14,w-28,h-28);
      g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 38px '+FONT; g.fillText('Spaghettieis',w/2,56,w-40);
      g.font='400 22px '+FONT; ['Vanilleeis durch','die Presse','Erdbeersoße','weiße Schokolade'].forEach((l,i)=>g.fillText(l,w/2,104+i*30,w-40));
      g.fillStyle='#f2c84a'; g.font='700 28px '+FONT; g.fillText('6,50',w/2,232);
      g.fillStyle='#f4f1ea'; g.font='400 19px '+FONT; g.fillText('Kugel 1,80',w/2,282); g.fillText('erfunden in Mannheim,',w/2,330,w-40); g.fillText('1969',w/2,356); },-23.45,T+1.55,24.96,Math.PI),.3,.9]);
    NB.push([board(2.6,.62,416,100,(g,w,h)=>{ g.fillStyle='#1f4a7a'; g.fillRect(0,0,w,h); g.strokeStyle='#f4f1ea'; g.lineWidth=5; g.strokeRect(6,6,w-12,h-12);
      g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 56px '+FONT; g.fillText('Kiosk',w/2,h/2+3); },43.5,T+3.5,38.97,Math.PI),.3,.95]); PLKW.kb=NB[NB.length-1][0].m;
    NB.push([board(2.9,.62,464,100,(g,w,h)=>{ g.fillStyle='#f3e8d4'; g.fillRect(0,0,w,h); g.strokeStyle='#6a3a22'; g.lineWidth=5; g.strokeRect(6,6,w-12,h-12);
      g.fillStyle='#6a3a22'; g.textAlign='center'; g.textBaseline='middle'; g.font='italic 700 58px Georgia, "Times New Roman", serif'; g.fillText('Konditorei',w/2,h/2+3); },LZ.x,T+3.5,17.03,0),.3,.95]); }
  const RHC=[board(2.1,2.1,128,128,()=>{},-19.5,T+14.4,-5.04,Math.PI,false,true),board(2.1,2.1,128,128,()=>{},-17.96,T+14.4,-3.5,Math.PI/2,false,true)];   // v1.48 the Rathausturm's clocks
  for(const c of RHC) NB.push([c,.3,1.25]);
  function clockDraw(){ const g=clock.c.getContext('2d'), d=new Date(), hh=d.getHours()%12, mm=d.getMinutes(); g.clearRect(0,0,128,128);
    g.fillStyle='#f4f1ea'; g.beginPath(); g.arc(64,64,60,0,7); g.fill(); g.lineWidth=6; g.strokeStyle='#2a2a2e'; g.stroke();
    for(let i=0;i<12;i++){ const a=i*Math.PI/6; g.fillStyle='#2a2a2e'; g.fillRect(64+Math.sin(a)*48-3,64-Math.cos(a)*48-3,6,6); }
    const hand=(a,l,w)=>{ g.lineWidth=w; g.lineCap='square'; g.beginPath(); g.moveTo(64,64); g.lineTo(64+Math.sin(a)*l,64-Math.cos(a)*l); g.stroke(); };
    hand((hh+mm/60)*Math.PI/6,30,8); hand(mm*Math.PI/30,46,5); clock.t.needsUpdate=true; clockDraw.m=mm;
    for(const c of RHC){ const x=c.c.getContext('2d'); x.clearRect(0,0,128,128); x.drawImage(clock.c,0,0); c.t.needsUpdate=true; } }
  clockDraw();
  board(6,1.2,384,77,(g,w,h)=>{ g.fillStyle='#f1e7cf'; g.fillRect(0,0,w,h); g.fillStyle='#5a2a1c'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 30px '+FONT; g.fillText('Wasserturm',w/2,h*.38); g.font='400 18px '+FONT; g.fillText('Friedrichsplatz · 1889',w/2,h*.76); },
    WT.x-10.4,T+1.25,WT.z,-Math.PI/2,true);

  board(2.5,1.05,400,168,(g,w,h)=>{ g.fillStyle='#5a3a1c'; g.fillRect(0,0,w,h); g.strokeStyle='#d8b060'; g.lineWidth=8; g.strokeRect(8,8,w-16,h-16);
      g.fillStyle='#f4e6c0'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 27px '+FONT; g.fillText('Carl Benz, Mannheim 1886,',w/2,h*.38); g.font='700 36px '+FONT; g.fillText('the f\u200Cirst car',w/2,h*.68); },
    BZ.x0-.55,T+1.35,BZ.z,-Math.PI/2);
  board(2.5,1.05,8,8,(g,w,h)=>{ g.fillStyle='#4a2f17'; g.fillRect(0,0,w,h); },BZ.x0-.53,T+1.35,BZ.z,Math.PI/2);
  board(5,.8,400,64,(g,w,h)=>{ g.fillStyle='#3a2414'; g.fillRect(0,0,w,h); g.strokeStyle='#d8b060'; g.lineWidth=4; g.strokeRect(4,4,w-8,h-8); g.fillStyle='#f4e6c0'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 34px '+FONT; g.fillText('BÄCKEREI GRUMBACH',w/2,h/2+2); },
    BK.x,T+3.5,BK.z-.03,Math.PI);
  // v1.48 plaques: over the Rathausturm's portal, and by the Marktplatzbrunnen facing the Breite Straße (a plain back behind it)
  const plq=(t,a,b)=>(g,w,h)=>{ g.fillStyle='#2e2418'; g.fillRect(0,0,w,h); g.strokeStyle='#d8b060'; g.lineWidth=6; g.strokeRect(6,6,w-12,h-12);
    g.fillStyle='#f4e6c0'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 32px '+FONT; g.fillText(t,w/2,h*.28); g.font='400 21px '+FONT; g.fillText(a,w/2,h*.55); g.fillText(b,w/2,h*.77); };
  NB.push([board(2.7,1.3,432,208,plq('Altes Rathaus','and St. Sebastian','one tower · begun 1700'),-19.5,T+5.2,-5.03,Math.PI),.3,.8]);
  NB.push([board(2.5,1.2,416,200,plq('Marktplatzbrunnen','made 1719 for Heidelberg','Mannheim\'s since 1767'),-14.98,T+1.35,MB.z,Math.PI/2),.3,.8]);
  board(2.5,1.2,8,8,(g,w,h)=>{ g.fillStyle='#2e2418'; g.fillRect(0,0,w,h); },-15.0,T+1.35,MB.z,-Math.PI/2);
  // v1.49 plaques: on the south tower by the portals, and inside by the choir step. The IHS relief over the window (Paul Egell's, with angels)
  NB.push([board(2.0,1.0,416,208,plq('Jesuitenkirche','Bibiena · built 1733-1760','rebuilt after the war · 1960'),-59.97,T+1.65,73.4,Math.PI/2),.3,.8]);
  NB.push([board(1.6,.8,416,208,plq('Hochaltar','to Paul Egell\'s design','consecrated again 1997'),-79.54,T+1.35,68.3,Math.PI/2),.25,.6]);
  board(1.6,.8,8,8,(g,w,h)=>{ g.fillStyle='#2e2418'; g.fillRect(0,0,w,h); },-79.66,T+1.35,68.3,-Math.PI/2);
  board(1.0,1.6,128,208,(g,w,h)=>{ g.clearRect(0,0,w,h); const cx=w/2, cy=h*.52;
    g.fillStyle='#d8c8a8'; g.beginPath(); g.ellipse(cx,cy,44,62,0,0,7); g.fill();
    g.strokeStyle='#c9a24a'; g.lineWidth=3; for(let i=0;i<16;i++){ const a=i*Math.PI/8; g.beginPath(); g.moveTo(cx+Math.cos(a)*26,cy+Math.sin(a)*34); g.lineTo(cx+Math.cos(a)*40,cy+Math.sin(a)*56); g.stroke(); }
    g.fillStyle='#c9a24a'; g.font='700 30px '+FONT; g.textAlign='center'; g.textBaseline='middle'; g.fillText('IHS',cx,cy+2); g.fillRect(cx-2,cy-36,4,20); g.fillRect(cx-8,cy-30,16,4);
    for(const s of [-1,1]){ const ax=cx+s*44, ay=h*.16; g.fillStyle='#efe6d2'; g.beginPath(); g.arc(ax,ay,7,0,7); g.fill(); g.beginPath(); g.moveTo(ax-8,ay+7); g.lineTo(ax+8,ay+7); g.lineTo(ax,ay+30); g.fill();
      g.beginPath(); g.ellipse(ax+s*10,ay+12,10,5,s*.6,0,7); g.fill(); }
  },-59.96,T+16.5,70.5,Math.PI/2,false,true);
  // v1.50 the Rosengarten + Kunsthalle names and plaques
  const nameB=(t,w,x,y,z,ry)=>board(w,.7,Math.round(w*80),56,(g,cw,ch)=>{ g.clearRect(0,0,cw,ch); g.fillStyle='#e8c25a'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 40px '+FONT; g.fillText(t,cw/2,ch/2+2); },x,y,z,ry,false,true);
  NB.push([nameB('ROSENGARTEN',5.4,100.5,T+3.5,-12.96,0),.35,1.1]);   // v1.58 both moved with their buildings
  NB.push([nameB('KUNSTHALLE',4.6,100.5,T+5.6,53.96,Math.PI),.35,1.1]);
  NB.push([board(2.5,1.2,416,200,plq('Rosengarten','Bruno Schmitz · 1903','festival hall · Jugendstil'),91.5,T+1.6,-13.97,0),.3,.8]);
  NB.push([board(2.2,1.06,416,200,plq('Kunsthalle','Hermann Billing · 1907','red sandstone · Jugendstil'),96.6,T+1.6,53.97,Math.PI),.3,.8]);
  for(const [x,y,z] of SCHP) board(3.4,3.4,136,136,(g,w,h)=>{ g.clearRect(0,0,w,h);
      g.save(); g.beginPath(); g.ellipse(w/2,h*.58,w*.34,h*.38,0,0,7); g.clip();
      for(let i=-6;i<7;i++) for(let j=-6;j<7;j++){ const cx=w/2+(i-j)*11, cy=h*.58+(i+j)*11; g.fillStyle=(i+j)&1?'#f4f1ea':'#2f6fb8'; g.beginPath(); g.moveTo(cx,cy-11); g.lineTo(cx+11,cy); g.lineTo(cx,cy+11); g.lineTo(cx-11,cy); g.fill(); }
      g.restore(); g.lineWidth=8; g.strokeStyle='#d8a636'; g.beginPath(); g.ellipse(w/2,h*.58,w*.34,h*.38,0,0,7); g.stroke();
      g.fillStyle='#d8a636'; g.fillRect(w*.36,h*.1,w*.28,h*.08); for(const k of [0,1,2]) g.fillRect(w*.36+k*w*.11,h*.02,w*.06,h*.1); },
    x,y,z,Math.PI,false,true);
  // v1.57 the Planetarium: the glass pyramid (four planes, blue panels in a grid), rust-brown ribs stepping up its hips, a mast with a
  // dish on the flat top, its name in blue on the white band; inside the dome hall: seats in rings round the star projector, a dark dome
  // with real stars (Orion, the Plough, Cassiopeia, the Summer Triangle...), turning slowly round the pole as over Mannheim tonight.
  // The hall's blocks are dimmed in the block shader (w.dark, see mhMat), its props are unlit (matcap) so day and night look the same.
  const PLD={};
  { const cx=PL.cx, cz=PL.cz, yb=T+4, hb=13, yt=T+13, ht=4, PLP=[], Q=(w,h,d,x,y,z,c,ry,rx)=>PLP.push([w,h,d,x,y,z,c,ry||0,0,rx||0]);
    const gc=document.createElement('canvas'); gc.width=gc.height=64;
    { const g=gc.getContext('2d'); g.fillStyle='#3a679c'; g.fillRect(0,0,64,64);
      for(const [x,y,c] of [[0,0,'#4776ad'],[32,32,'#34608f'],[32,0,'#3d6ca2']]){ g.fillStyle=c; g.fillRect(x,y,32,32); }
      g.fillStyle='#b8c4cf'; g.fillRect(0,0,64,2); g.fillRect(0,0,2,64); g.fillRect(31,0,2,64); g.fillRect(0,31,64,2); }
    const gt=new THREE.CanvasTexture(gc); gt.colorSpace=THREE.SRGBColorSpace; gt.wrapS=gt.wrapT=THREE.RepeatWrapping; gt.anisotropy=4;
    const pos=[], uv=[], sl=Math.SQRT2*(yt-yb);
    for(let f=0;f<4;f++){ const a=f*Math.PI/2, ca=Math.cos(a), sa=Math.sin(a);
      const C=[[-hb,yb,hb],[hb,yb,hb],[ht,yt,ht],[-ht,yt,ht]].map(([x,y,z])=>[cx+x*ca+z*sa,y,cz-x*sa+z*ca]), U=[[-hb,0],[hb,0],[ht,sl],[-ht,sl]];
      for(const i of [0,1,2,0,2,3]){ pos.push(...C[i]); uv.push(U[i][0]/3,U[i][1]/3); } }
    const gg=new THREE.BufferGeometry(); gg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); gg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); gg.computeVertexNormals();
    PLD.glass=new THREE.Mesh(gg,new THREE.MeshLambertMaterial({map:gt,emissive:0x3a5f9a,emissiveIntensity:0})); PLD.glass.matrixAutoUpdate=false; group.add(PLD.glass);
    const RB='#8e4636';
    for(const [sx,sz] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ for(let k=0;k<9;k++){ const h=hb-k-.5; Q(1.02,1.02,1.02,cx+sx*h,yb+k+.5,cz+sz*h,RB); }
      Q(.6,.6,.6,cx+sx*(ht+.3),yt+.3,cz+sz*(ht+.3),RB); }
    Q(ht*2,.24,ht*2,cx,yt+.12,cz,'#e4e2dc');
    for(let i=0;i<3;i++){ const a=i*2*Math.PI/3, bx=Math.cos(a)*1.3, bz=Math.sin(a)*1.3, an=Math.atan2(-bx,-bz);   // a three-legged mast, the dish on top
      Q(.12,3.9,.12,cx+bx/2,yt+2.1,cz+bz/2,'#d8d8d4',an,Math.atan2(1.3,3.7)); }
    Q(.18,1.4,.18,cx,yt+4.5,cz,'#d8d8d4'); Q(1.7,.14,1.7,cx,yt+4.1,cz+.05,'#f2f2ee',0,-.45); Q(1.7,.14,1.7,cx,yt+4.1,cz+.05,'#f2f2ee',Math.PI/4,-.45);
    Q(4.6,.16,5,cx-15.2,T+2.03,cz,'#e8e6e0'); for(const z of [cz-2.2,cz+2.2]) Q(.14,1.96,.14,cx-16.6,T+.98,z,'#9aa0a8');   // the canopy over the doors
    // the old star projector in the foyer (two blue star balls on one axis, each lit half the sky), the ticket desk across the foyer
    { const ox=99.2, oz=69.2, an=Math.PI/4; Q(.9,.5,.9,ox,T+.25,oz,'#3a3c44',an); Q(.3,1.1,.3,ox,T+1.05,oz,'#4a4c54');
      for(const k of [-1,1]){ const dx=Math.cos(an)*k*.95, dz=-Math.sin(an)*k*.95, dy=k*.32;
        Q(.7,.7,.7,ox+dx,T+1.75+dy,oz+dz,'#2f5f9a'); Q(.7,.7,.7,ox+dx,T+1.75+dy,oz+dz,'#3a6aa6',Math.PI/4); }
      Q(.14,.14,2.1,ox,T+1.75,oz,'#5a5c64',Math.atan2(Math.cos(an),-Math.sin(an)),-.325); Q(.5,.5,.5,ox,T+1.75,oz,'#6a6c74',an); }
    Q(.6,1.1,2.6,98.8,T+.55,90.4,'#ece8e0'); Q(.75,.08,2.75,98.8,T+1.14,90.4,'#3a3c44');
    for(const [x,z] of [[97.2,72.5],[97.2,87.5],[122.4,72.5],[122.4,87.5]]) Q(.5,.5,.5,x,T+.25,z,'#3f6a3a');   // plants by the glass
    NB.push([board(1.2,.6,416,208,plq('Sternprojektor','showed the sky here','1984 to 2002'),100.4,T+1.05,70.4,Math.PI/4),.25,.6]); Q(.08,.75,.08,100.4,T+.37,70.4,'#3a3c44');
    group.add(Object.assign(new THREE.Mesh(blockyGeo(PLP),propMat),{matrixAutoUpdate:false}));
    for(const [x,z,ry] of [[95.97,cz,-Math.PI/2],[cx,94.03,0]]) board(9,.9,720,72,(g,w,h)=>{ g.clearRect(0,0,w,h); g.fillStyle='#2a5aa8'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 62px '+FONT; g.fillText('Planetarium',w/2,h/2+3); },x,T+2.55,z,ry,false,true);
    // the hall
    const mc=document.createElement('canvas'); mc.width=mc.height=64;
    { const g=mc.getContext('2d'), gr=g.createRadialGradient(30,22,3,32,32,33); gr.addColorStop(0,'#ffffff'); gr.addColorStop(.7,'#9a9aa4'); gr.addColorStop(1,'#4a4a52'); g.fillStyle=gr; g.fillRect(0,0,64,64); }
    const mct=new THREE.CanvasTexture(mc); mct.colorSpace=THREE.SRGBColorSpace;
    PLD.mat=new THREE.MeshMatcapMaterial({matcap:mct,vertexColors:true,color:0x9aa0b8,toneMapped:false,fog:false});
    const HL=[], S=(w,h,d,x,y,z,c,ry,rx)=>HL.push([w,h,d,x,y,z,c,ry||0,0,rx||0]), GL=[], PS=[], SC='#3a4876';
    const AIS=[0,Math.PI/2,Math.PI,-Math.PI/2];   // four aisles, the west one from the door
    [3.4,4.6,5.8,7.0].forEach((r,ri)=>{ const n=Math.floor(2*Math.PI*r/.78);
      for(let i=0;i<n;i++){ const a=(i+.5)/n*2*Math.PI; if(AIS.some(b=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))*r<.85)) continue;
        const ox=Math.cos(a), oz=Math.sin(a), x=cx+ox*r, z=cz+oz*r, an=Math.atan2(ox,oz);
        S(.16,.34,.16,x,T+.17,z,'#1a1d26',an); S(.58,.12,.52,x,T+.41,z,SC,an); S(.58,.84,.1,x+ox*.31,T+.82,z+oz*.31,SC,an,.5);
        PS.push({x,z,ox,oz,ri,a}); } });
    for(const b of AIS) for(const r of [2.8,4.0,5.2,6.4,7.6]) GL.push([.1,.03,.1,cx+Math.cos(b)*r,T+.03,cz+Math.sin(b)*r,'#a8641e']);   // aisle lights
    GL.push([.02,.26,.7,102.0,T+3.25,cz,'#1e8a4a']); S(.04,.3,.74,101.97,T+3.25,cz,'#14161c');   // the exit light over the door, dark on its back
    S(1.0,.04,2.1,100.5,T+.02,cz,'#20242e'); S(.56,1.3,.56,cx,T+1.65,cz,'#2a2d38'); S(.9,.18,.9,cx,T+1.08,cz,'#2a2d38'); S(.34,.3,.34,cx,T+2.38,cz,'#2a2d38');
    PLD.hall=new THREE.Mesh(blockyGeo(HL),PLD.mat); PLD.hall.matrixAutoUpdate=false;
    PLD.ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,1),new THREE.MeshMatcapMaterial({matcap:mct,color:0x565c70,flatShading:true,toneMapped:false,fog:false})); PLD.ball.position.set(cx,T+2.95,cz);
    PLD.glow=new THREE.Mesh(blockyGeo(GL),new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false,fog:false})); PLD.glow.matrixAutoUpdate=false;
    // the dome (a dark gradient, deep blue at the horizon) and a smooth dark band round its foot, in front of the stepped wall tops
    const dg=new THREE.SphereGeometry(8.9,40,12,0,Math.PI*2,0,Math.PI/2), cH=new THREE.Color(0x16264a), cZ=new THREE.Color(0x020308), col=[], tc=new THREE.Color();
    { const p=dg.attributes.position; for(let i=0;i<p.count;i++){ tc.lerpColors(cH,cZ,Math.min(1,p.getY(i)/8.9*1.8)); col.push(tc.r,tc.g,tc.b); } dg.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); }
    PLD.dome=new THREE.Mesh(dg,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,toneMapped:false})); PLD.dome.position.set(cx,yb,cz);
    const bg=new THREE.CylinderGeometry(8.05,8.05,1.15,40,1,true), bc=[], cB=new THREE.Color(0x07090f), cT=new THREE.Color(0x1c2c50);
    { const p=bg.attributes.position; for(let i=0;i<p.count;i++){ const c=p.getY(i)>0?cT:cB; bc.push(c.r,c.g,c.b); } bg.setAttribute('color',new THREE.Float32BufferAttribute(bc,3)); }
    PLD.band=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,toneMapped:false})); PLD.band.position.set(cx,T+3.525,cz);
    // the stars: right ascension (h), declination (deg), magnitude, tint; placed for Mannheim's latitude (49.5 N)
    const lat=49.49*Math.PI/180, SR=8.84;
    PLD.pole=new THREE.Vector3(0,Math.sin(lat),-Math.cos(lat));
    const sv=(ra,de)=>{ const a=ra*Math.PI/12, d=de*Math.PI/180, c=Math.cos(d);
      return [c*Math.sin(a)*SR,(c*Math.cos(lat)*Math.cos(a)+Math.sin(d)*Math.sin(lat))*SR,(c*Math.sin(lat)*Math.cos(a)-Math.sin(d)*Math.cos(lat))*SR]; };
    const ST=[[5.919,7.41,.5,'#ffc890'],[5.242,-8.2,.1,'#cfe0ff'],[5.419,6.35,1.6,'#dfe8ff'],[5.533,-.3,2.2,'#dfe8ff'],[5.604,-1.2,1.7,'#dfe8ff'],[5.679,-1.94,1.8,'#dfe8ff'],[5.796,-9.67,2.1,'#dfe8ff'],[5.585,9.93,3.4,'#e8eeff'],   // Orion
      [11.062,61.75,1.8,'#ffe2b0'],[11.031,56.38,2.4,'#fff'],[11.897,53.69,2.4,'#fff'],[12.257,57.03,3.3,'#fff'],[12.9,55.96,1.8,'#fff'],[13.399,54.93,2.2,'#fff'],[13.792,49.31,1.9,'#e8eeff'],   // the Plough
      [.153,59.15,2.3,'#fff8e8'],[.675,56.54,2.2,'#ffe2b0'],[.945,60.72,2.2,'#e8eeff'],[1.43,60.24,2.7,'#fff'],[1.907,63.67,3.4,'#e8eeff'],[2.53,89.26,2.0,'#fff6e0'],   // Cassiopeia, Polaris
      [20.69,45.28,1.25,'#fff'],[20.37,40.26,2.2,'#fff4e0'],[20.77,33.97,2.5,'#ffe8c0'],[19.75,45.13,2.9,'#e8eeff'],[19.512,27.96,3.1,'#ffd8a0'],[18.616,38.78,0,'#dfe8ff'],[19.846,8.87,.8,'#fff'],   // Cygnus, Vega, Altair
      [4.599,16.51,.85,'#ffc080'],[3.79,24.1,2.9,'#dfe8ff'],[3.82,24.05,3.6,'#dfe8ff'],[3.748,24.11,3.7,'#dfe8ff'],[3.763,24.37,3.9,'#dfe8ff'],[3.772,23.95,4.1,'#dfe8ff'],[3.753,24.47,4.3,'#dfe8ff'],   // Aldebaran, the Pleiades
      [6.752,-16.72,-1.46,'#e8f0ff'],[7.655,5.22,.34,'#fff8e8'],[5.278,46.0,.08,'#fff0c8'],[14.261,19.18,-.05,'#ffd8a0'],[7.577,31.89,1.6,'#fff'],[7.755,28.03,1.15,'#ffe2b0'],   // Sirius, Procyon, Capella, Arcturus, Castor + Pollux
      [10.14,11.97,1.4,'#e8eeff'],[11.818,14.57,2.1,'#fff'],[10.333,19.84,2.0,'#ffe2b0'],[11.235,20.52,2.6,'#fff']];   // Leo
    const cls=[[],[],[],[]], tint=new THREE.Color(), hz=sh=>{   // stars under the horizon (they peep through the door) are not drawn
      sh.vertexShader='varying float vH;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvH=(modelMatrix*vec4(transformed,1.)).y;');
      sh.fragmentShader='varying float vH;\n'+sh.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(vH<'+(yb+.15).toFixed(2)+') discard;'); };
    for(const [ra,de,mg,c] of ST){ const k=mg<1?0:mg<2.3?1:2; cls[k].push(sv(ra,de),tint.set(c).toArray()); }
    for(let i=0;i<460;i++){ const de=Math.asin(2*hsh(i,7,1607)-1)*180/Math.PI, ra=24*hsh(i,11,1607), b=.25+.55*hsh(i,13,1607);   // fainter ones, the same every visit
      if(de>-40) cls[3].push(sv(ra,de),[b*.92,b*.95,b]); }
    PLD.sky=new THREE.Group(); PLD.sky.position.set(cx,yb,cz); PLD.eq=new THREE.Group(); PLD.sky.add(PLD.eq);
    [5.2,3.6,2.6,1.7].forEach((sz,k)=>{ const cl=cls[k], pg=new THREE.BufferGeometry(), P3=[], C3=[]; for(let i=0;i<cl.length;i+=2){ P3.push(...cl[i]); C3.push(...cl[i+1]); }
      pg.setAttribute('position',new THREE.Float32BufferAttribute(P3,3)); pg.setAttribute('color',new THREE.Float32BufferAttribute(C3,3));
      PLD.eq.add(new THREE.Points(pg,new THREE.PointsMaterial({size:sz,sizeAttenuation:false,map:H.roundDot(),vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,toneMapped:false,onBeforeCompile:hz}))); });
    PLD.lst=((18.697374558+24.06570982441908*(Date.now()/864e5-10957.5))%24)*Math.PI/12+8.47*Math.PI/180;   // tonight's sidereal time in Mannheim
    PLD.in=[PLD.hall,PLD.ball,PLD.glow,PLD.dome,PLD.band,PLD.sky]; for(const o of PLD.in){ o.visible=false; group.add(o); } PLD.vis=false;
    for(const o of [PLD.hall,PLD.glow]) o.updateMatrix();
    // the visitor who dozed off in the back row (north-east), three free seats for you, Frau Brandt at the hall door
    const pick=(ri,a)=>PS.filter(s=>s.ri===ri).sort((p,q)=>Math.abs(Math.atan2(Math.sin(p.a-a),Math.cos(p.a-a)))-Math.abs(Math.atan2(Math.sin(q.a-a),Math.cos(q.a-a))))[0];
    const dz=pick(3,-.62); PLD.doze=[dz.x+dz.ox*.06,dz.z+dz.oz*.06,Math.atan2(-dz.ox,-dz.oz)];
    for(const [ri,a] of [[1,2.4],[1,.75],[2,-2.3]]){ const s=pick(ri,a); SEATS.push({x:s.x,z:s.z,yaw:Math.atan2(s.ox,s.oz),pitch:.78,stand:[s.x-s.ox*.7,s.z-s.oz*.7],k:'seatp',hint:'Lean back and watch the stars'}); }
    PLD.staff=[98.6,82.4,-Math.PI/2]; }
  // v1.51 the Schloss plaques (entrance hall, Rittersaal) and the Rittersaal's ceiling: an original painted sky in a gilded frame
  NB.push([board(2.0,1.0,416,208,plq('Barockschloss','begun 1720 · Carl Philipp','finished about 1760'),-17.97,T+1.65,93.6,Math.PI/2),.3,.8]);
  NB.push([board(2.0,1.0,416,208,plq('Rittersaal','ceiling: C. D. Asam 1728-30','painted again in the 1960s'),-3.04,T+6.6,100,-Math.PI/2),.3,.8]);
  { const cb=board(14,11,448,352,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h/2,8,w/2,h/2,w*.62);
      gr.addColorStop(0,'#fff3d2'); gr.addColorStop(.3,'#cfe2ef'); gr.addColorStop(1,'#86aed4'); g.fillStyle=gr; g.fillRect(0,0,w,h);
      g.strokeStyle='rgba(232,190,90,.5)'; g.lineWidth=3; for(let i=0;i<24;i++){ const a=i*Math.PI/12; g.beginPath(); g.moveTo(w/2+Math.cos(a)*30,h/2+Math.sin(a)*30); g.lineTo(w/2+Math.cos(a)*(i%2?70:100),h/2+Math.sin(a)*(i%2?70:100)); g.stroke(); }
      g.fillStyle='#f0c050'; g.beginPath(); g.arc(w/2,h/2,22,0,7); g.fill();
      for(const [cx,cy,r] of [[.2,.28,64],[.78,.24,70],[.26,.76,78],[.8,.74,62],[.52,.12,44],[.5,.9,50],[.08,.52,40],[.93,.5,40]]){
        g.fillStyle='rgba(255,250,240,.82)'; for(let k=0;k<4;k++){ g.beginPath(); g.ellipse(cx*w+(k-1.5)*r*.42,cy*h+(k%2)*r*.14,r*.5,r*.3,0,0,7); g.fill(); }
        g.fillStyle='rgba(240,200,170,.5)'; g.beginPath(); g.ellipse(cx*w,cy*h+r*.16,r*.6,r*.12,0,0,7); g.fill(); }
      g.fillStyle='rgba(60,70,90,.55)'; for(const [bx,by] of [[.36,.4],[.4,.36],[.64,.62],[.6,.66],[.68,.6]]){ g.beginPath(); g.moveTo(bx*w-7,by*h); g.quadraticCurveTo(bx*w-3,by*h-5,bx*w,by*h); g.quadraticCurveTo(bx*w+3,by*h-5,bx*w+7,by*h); g.lineTo(bx*w,by*h+2); g.fill(); }
      g.strokeStyle='#d4a53c'; g.lineWidth=16; g.strokeRect(8,8,w-16,h-16); g.strokeStyle='#f2ede2'; g.lineWidth=4; g.strokeRect(22,22,w-44,h-44);
      g.fillStyle='#d4a53c'; for(const [x,y] of [[34,34],[w-34,34],[34,h-34],[w-34,h-34],[w/2,22],[w/2,h-22],[22,h/2],[w-22,h/2]]){ g.beginPath(); g.arc(x,y,11,0,7); g.fill(); } },
    -10,T+12.97,98.5,0);
    cb.m.rotation.x=Math.PI/2; cb.m.updateMatrix(); NB.push([cb,.6,.45]); }
  // v1.52 the Popakademie's name over the glass (plain letters, no logo)
  NB.push([board(9,1.3,720,104,(g,w,h)=>{ g.fillStyle='#1c1c22'; g.fillRect(0,0,w,h); g.fillStyle='#e0307a'; g.fillRect(24,h-20,96,8);
    g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 62px '+FONT; g.fillText('Popakademie',w/2,h/2); },34,T+8,-103.97,0),.35,1.1]);
  // v1.67 SCHILLER on the base (bronze letters, north face) and the Nationaltheater tablet by the east path
  NB.push([board(1.7,.36,340,72,(g,w,h)=>{ g.clearRect(0,0,w,h); g.fillStyle='#3e5547'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 54px Georgia, "Times New Roman", serif'; g.fillText('SCHILLER',w/2,h/2+3); },SLP.cx,T+2.3,SLP.cz-1.13,Math.PI,false,true),.15,.35]);
  NB.push([board(.86,.86,240,240,(g,w,h)=>{ g.fillStyle='#8f877b'; g.fillRect(0,0,w,h); g.strokeStyle='#5c564d'; g.lineWidth=4; g.strokeRect(8,8,w-16,h-16);
    g.fillStyle='#2e2a25'; g.textAlign='center'; g.textBaseline='middle'; const F=(z,t,y)=>{ g.font=z+'px Georgia, "Times New Roman", serif'; g.fillText(t,w/2,y); };
    F('700 21',"Am Schillerplatz stand",40); F('700 21','das Nationaltheater',66); F('700 25','1779 – 1943',100); F('italic 19','Dort wurden Schillers',140); F('italic 19','»Räuber« uraufgeführt,',164); F('italic 19','13. Januar 1782',188); },SLP.x1-.1,T+.66,55.6,Math.PI/2),.2,.5]);
  // corner signs: every block shows its code at all four corners, on both street faces (one draw call)
  const codes=QD.filter(q=>!q.sq), CW=64, CHh=40, per=16, cv=document.createElement('canvas'); cv.width=CW*per; cv.height=CHh*Math.ceil(codes.length/per);
  { const g=cv.getContext('2d'); codes.forEach((q,i)=>{ const x=(i%per)*CW, y=Math.floor(i/per)*CHh; g.fillStyle='#f4f1ea'; g.fillRect(x,y,CW,CHh); g.fillStyle='#1d3a6e'; g.fillRect(x+3,y+3,CW-6,CHh-6);
      g.fillStyle='#ffffff'; g.font='700 27px '+FONT; g.textAlign='center'; g.textBaseline='middle'; g.fillText(q.code,x+CW/2,y+CHh/2+2); q.ti=i; }); }
  const st=new THREE.CanvasTexture(cv); st.colorSpace=THREE.SRGBColorSpace; st.anisotropy=4;
  const sp=[], su=[], sn=[], si=[]; let vc=0;
  function plate(q,cx,cz,nx,nz){ const tx=nz, tz=-nx, w=.42, h=.27, y=T+2.6, u0=(q.ti%per)*CW/cv.width, u1=u0+CW/cv.width, v1=1-Math.floor(q.ti/per)*CHh/cv.height, v0=v1-CHh/cv.height;
    const X=cx+nx*.03, Z=cz+nz*.03;
    sp.push(X-tx*w,y-h,Z-tz*w, X+tx*w,y-h,Z+tz*w, X+tx*w,y+h,Z+tz*w, X-tx*w,y+h,Z-tz*w); for(let k=0;k<4;k++) sn.push(nx,0,nz);
    su.push(u0,v0,u1,v0,u1,v1,u0,v1); si.push(vc,vc+1,vc+2,vc,vc+2,vc+3); vc+=4; }
  for(const q of codes){ if(q.code==='B3') continue;   // v1.67 the Schillerplatz has no houses to carry them
    if(q.code==='A4'||q.code==='A5'){ const X=q.code==='A4'?-60:-84, s=q.code==='A4'?1:-1;   // v1.49 the Jesuitenkirche fills both: signs on its outer corners
      plate(q,X-s*.5,66,0,-1); plate(q,X-s*.5,75,0,1); plate(q,X,66.5,s,0); plate(q,X,74.5,s,0); continue; }
    const f1=q.code==='F1', X0=f1?q.x0:q.x0+1, X1=f1?q.x1+1:q.x1, Z0=q.z0+1, Z1=q.z1, o=f1?.5:.8;   // building faces (the sidewalk ring is outside;
    plate(q,X0+o,Z0,0,-1); plate(q,X1-o,Z0,0,-1); plate(q,X0+o,Z1,0,1); plate(q,X1-o,Z1,0,1);                              // v1.48 F1's Rathaus fills its block, signs on its quoins)
    plate(q,X0,Z0+o,-1,0); plate(q,X0,Z1-o,-1,0); plate(q,X1,Z0+o,1,0); plate(q,X1,Z1-o,1,0); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sg.setAttribute('normal',new THREE.Float32BufferAttribute(sn,3)); sg.setAttribute('uv',new THREE.Float32BufferAttribute(su,2)); sg.setIndex(si);
  const signs=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({map:st,emissive:0xffffff,emissiveMap:st,emissiveIntensity:.35})); signs.matrixAutoUpdate=false; group.add(signs);

  // basin water on the Friedrichsplatz
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(BAS.x1-BAS.x0-1,BAS.z1-BAS.z0-1),new THREE.MeshPhongMaterial({color:0x6f9fb8,shininess:90,transparent:true,opacity:.85}));
  bw.rotation.x=-Math.PI/2; bw.position.set((BAS.x0+BAS.x1+1)/2,T-.15,(BAS.z0+BAS.z1+1)/2); bw.matrixAutoUpdate=false; bw.updateMatrix(); group.add(bw);
  // v1.38 the cascade's water (one see-through mesh) + the fountain jets (one instanced mesh, they breathe in tick)
  // v1.58 the water staircase: water over both terraces and down their edges into the basin
  const CASW=[], wc='#d6f0fa';
  CASW.push([2,.05,9,110,T+2.03,20.5,wc],[2,.05,9,112,T+1.03,20.5,wc]);
  CASW.push([.05,1,9,111.03,T+1.5,20.5,wc],[.05,1.15,9,113.03,T+.43,20.5,wc]);
  const cw=new THREE.Mesh(blockyGeo(CASW),new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:.72,depthWrite:false,emissive:0x5f8fa8,emissiveIntensity:.35}));
  cw.matrixAutoUpdate=false; group.add(cw);
  // v1.58 (Flax 10:18 "way bigger waterplays") the big jet in the middle of the basin (the real one reaches 28 m), a row stepping
  // down from it to both ends, a lower row on each side, small jets on the two water terraces, one in each round fountain
  const JET=[[117.5,20.5,17]];
  [11,9,7,6,5,4.5].forEach((h,k)=>{ for(const sg of [-1,1]) JET.push([117.5,20.5+sg*3*(k+1),h]); });
  for(const x of [115.3,119.7]) for(let k=0;k<6;k++) for(const sg of [-1,1]) JET.push([x,20.5+sg*(1.5+3*k),3.5-k*.2]);
  for(const dz of [-3.5,-1.5,0,1.5,3.5]){ JET.push([110,20.5+dz,1.4,T+2]); JET.push([112,20.5+dz,1.1,T+1]); }
  for(const [x,z] of FF) JET.push([x,z,1.7,T+2.3]);   // v1.50 the round fountains

  const jets=new THREE.InstancedMesh(new THREE.CylinderGeometry(.06,.32,1,7,1,true).translate(0,.5,0),
    new THREE.MeshBasicMaterial({color:0xeef9ff,transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide}),JET.length);
  jets.frustumCulled=false; group.add(jets);
  // v1.50 the falling water round each jet: a faint veil from the top of the jet down to the water (was a white cap halfway up)
  const veil=new THREE.InstancedMesh(jets.geometry,new THREE.MeshBasicMaterial({color:0xeef9ff,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide}),JET.length);
  veil.frustumCulled=false; group.add(veil);
  const jo=new THREE.Object3D(); let jt=0;
  function jetsSet(){ JET.forEach(([x,z,h0,y0],i)=>{ const h=h0*(.9+.08*Math.sin(jt*1.9+i*1.7)+.03*Math.sin(jt*7.3+i)), b=y0??T-.15, s=h0<3?1.2:Math.min(4.6,1.2+h0*.22);   // v1.58 the veil grows with the jet
    jo.position.set(x,b,z); jo.scale.set(1,h,1); jo.updateMatrix(); jets.setMatrixAt(i,jo.matrix);
    jo.position.set(x,b,z); jo.scale.set(s*.8,h*1.02,s*.8); jo.updateMatrix(); veil.setMatrixAt(i,jo.matrix); }); jets.instanceMatrix.needsUpdate=veil.instanceMatrix.needsUpdate=true; }
  jetsSet();
  // v1.38 THE MEMORIAL TEXT DROPS IN HERE: who the L2 hall remembers (Flax is being asked). Until then the tablet stays blank.
  const MEMO={title:'',lines:[]};
  NB.push([board(2.4,1.6,240,160,(g,w,h)=>{ g.fillStyle='#3a3530'; g.fillRect(0,0,w,h); g.strokeStyle='#b89a5a'; g.lineWidth=6; g.strokeRect(8,8,w-16,h-16); g.lineWidth=2; g.strokeRect(17,17,w-34,h-34);
    if(MEMO.title){ g.fillStyle='#e8d6a8'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 22px '+FONT; g.fillText(MEMO.title,w/2,48); g.font='15px '+FONT; MEMO.lines.forEach((t,i)=>g.fillText(t,w/2,82+i*20)); } },
    14,T+2.4,68.03,0),.15,.55]);

  // v1.38 a low hedge where the map ends (Angie 13:27), a rail fence across the tracks, the river left open
  const edgeB=(x,z)=>{ if(!get(x,T,z)) set(x,T,z,get(x,T-1,z)===B.track?B.rail:B.hedge); };
  for(let x=-128;x<=127;x++){ edgeB(x,-112); edgeB(x,143); }
  for(let z=-111;z<=142;z++){ if(z>=RIV.n-1&&z<=RIV.s+1) continue; edgeB(-128,z); edgeB(127,z); }
  // ---- beyond the edge: the flat Rhine plain (no more Odenwald), the Neckar running on, a far skyline ----
  const S=[], SC='#7b7d72';
  const slab=(x0,x1,z0,z1,c)=>S.push([x1-x0,T-6,z1-z0,(x0+x1)/2,(T+6)/2-.02,(z0+z1)/2,c||SC]);
  slab(-1200,1200,-1200,-112,'#77786e'); slab(-1200,1200,144,1200); slab(-1200,-128,-112,RIV.n); slab(-1200,-128,RIV.s+1,144); slab(128,1200,-112,RIV.n); slab(128,1200,RIV.s+1,144);
  S.push([2400,1,RIV.s+1-RIV.n,0,5.4,(RIV.n+RIV.s+1)/2,'#6a6450']);
  for(let i=0;i<90;i++){ const a=R()*Math.PI*2, d=200+R()*230, x=Math.sin(a)*d, z=Math.cos(a)*d; if(z>RIV.n-30&&z<RIV.s+30) continue; const h=5+R()*R()*30;
    S.push([8+R()*22,h,8+R()*22,x,T+h/2,z,['#b9b1a2','#a39a8c','#c9bfa8','#8f8a80','#b28a6a'][Math.floor(R()*5)]]); }
  // v1.38 the city carries on past the hedge (Angie 13:27: the edge looked blank): low house blocks and trees, same mesh
  { let q=0; const cb=(x,z)=>{ q++; if(x>128&&z>=8&&z<=34) return; const a=hsh(q,3,7), b=hsh(q,5,1), c=hsh(q,9,4); if(z>RIV.n-14&&z<RIV.s+14) return; const tr=a<.3, h=tr?4+b*4:6+b*10, w=tr?3+c*3:7+c*7;
      const d=w*(.7+a*.6), X=x+b*5, Z=z+c*5; if(!tr){ S.push([w+.7,1.1,d+.7,X,T+h+.55,Z,['#5a5f6a','#8a4a34','#6a5a50'][Math.floor(a*9)%3]]); for(const f of [.32,.62]) S.push([w+.08,.9,d+.08,X,T+h*f,Z,'#3a3d48']); }
      S.push([w,h,d,X,T+h/2,Z,tr?['#4f6a3a','#5a7440','#465f34'][Math.floor(b*3)]:['#c9bfa8','#b9b1a2','#d2c4a4','#a39a8c','#b28a6a','#c8a890'][Math.floor(c*6)]]); };
    for(let x=-220;x<=220;x+=13) for(const z of [-138,-156,-178,170,188,210]) cb(x,z);
    for(let z=-200;z<=230;z+=13) for(const x of [-154,-172,-194,153,171,193]) cb(x,z); }
  // v1.58 the Augustaanlage runs on east from between the arcades: a road between lawns and lime trees, houses on both sides
  S.push([200,.04,7,228,T+.02,20.5,'#5c5e62'],[200,.04,3,228,T+.03,15,'#7a9a52'],[200,.04,3,228,T+.03,26,'#7a9a52']);
  for(let x=134;x<=320;x+=8) for(const z of [15,26]) S.push([.5,2.2,.5,x,T+1.1,z,'#5a4030'],[3,3,3,x,T+3.6,z,'#4f6a3a']);
  for(let x=132;x<=320;x+=11) for(const sg of [-1,1]){ const h=7+hsh(x,sg,3)*8, w=9+hsh(x,sg,5)*1.5, z=20.5+sg*11.5;
    S.push([w,h,6,x+w/2,T+h/2,z,['#c9bfa8','#b9b1a2','#d2c4a4','#c8a890'][Math.floor(hsh(x,sg,9)*4)]],[w+.6,1,6.6,x+w/2,T+h+.5,z,'#5a5f6a']); }
  for(const [x,z] of [[-330,-260],[-315,-262],[360,250]]){ S.push([5,64,5,x,T+32,z,'#c9c3b8'],[5.3,4,5.3,x,T+58,z,'#b8402c'],[5.3,4,5.3,x,T+48,z,'#e8e2d8']); }
  const sk=new THREE.Mesh(blockyGeo(S),new THREE.MeshLambertMaterial({vertexColors:true})); sk.matrixAutoUpdate=false; group.add(sk);

  // ---- the Patent-Motorwagen: three spoked wheels, a tube frame, a bench over the engine, a flat flywheel at the back, a tiller ----
  const BP=[], FR='#1c1c22', BR2='#b8923a', TY2='#151515', SPK='#d8d4c8', WD='#6b4a2e', LE='#4a2a22';
  const bp=(w,h,d,x,y,z,c,ry,rx)=>BP.push([w,h,d,x,y,z,c,ry||0,0,rx||0]);
  function wheel(x,y,z,r,n){ const ch=2*r*Math.sin(Math.PI/n)+.02;
    for(let k=0;k<n;k++){ const a=k*2*Math.PI/n; bp(.07,.075,ch,x,y+r*Math.cos(a),z+r*Math.sin(a),TY2,0,a); }
    for(let k=0;k<6;k++){ const a=k*Math.PI/6; bp(.025,.025,2*r-.06,x,y,z,SPK,0,a); }
    bp(.16,.12,.12,x,y,z,BR2); }
  wheel(.74,.62,-.72,.62,14); wheel(-.74,.62,-.72,.62,14); wheel(0,.36,1.18,.36,10);
  bp(1.62,.06,.06,0,.62,-.72,FR);                                                    // rear axle
  for(const x of [.42,-.42]) bp(.07,.07,1.9,x,.58,.1,FR);                             // the two frame tubes
  bp(.9,.06,.06,0,.58,1.02,FR); bp(.06,.62,.06,0,.68,1.18,FR);   // front cross tube + fork
  bp(.05,.85,.05,0,.95,.62,FR,0,-.25); bp(.42,.05,.05,0,1.38,.52,BR2);               // the tiller and its handle
  bp(.9,.04,.55,0,.63,.62,WD);                                                       // footboard
  bp(.96,.36,.7,0,.8,-.28,FR); bp(.98,.04,.72,0,.99,-.28,BR2);                       // the seat box, brass edge
  bp(.92,.16,.52,0,1.09,-.24,LE); bp(.92,.42,.1,0,1.33,-.56,LE);                     // cushion + backrest
  bp(.3,.3,.62,.18,.62,-1.02,'#3a3a40'); bp(.24,.38,.24,-.22,1.04,-.98,BR2);         // the engine + its water tank
  bp(.78,.05,.78,0,.5,-1.22,BR2); bp(.78,.05,.78,0,.5,-1.22,BR2,Math.PI/4);         // the flat flywheel
  for(const x of [.62,-.62]) bp(.04,.04,.42,x,.62,-.9,'#2a2a2a');                    // the chains
  const benz={x:BZ.x,z:BZ.z,h:Math.PI,parts:BP,onDais:(x,z)=>x>BZ.x0+.3&&x<BZ.x1+.7&&z>BZ.z0+.3&&z<BZ.z1+.7};

  // ---- names ----
  function nearQ(x,z,m){ let best=null, bd=m; for(const q of QD){ const dx=Math.max(q.x0-x,0,x-q.x1-1), dz=Math.max(q.z0-z,0,z-q.z1-1), d=Math.hypot(dx,dz); if(d<bd){ bd=d; best=q; } } return best; }
  function place(x,z,y,wet){
    if(wet) return 'Neckar';
    if(z<RIV.n) return x>=26.5&&x<41.5?(z<-104?'Popakademie':'Jungbusch · Popakademie'):'Hafen';   // v1.52
    if(z<=RIV.s+1) return x>=BR.x0&&x<=BR.x1+1?'Kurpfalzbrücke':'Neckar';
    if(z<=-71) return x>-4&&x<30?'Anlegestelle':'Neckarufer';
    if(x>=114&&Math.abs(z-AC.z)>=3.5&&z>-24&&z<65){ const s=acS(x,z); if(s>=-.3&&s<ACD+.5) return 'Friedrichsplatz · Arkaden'; }   // v1.50, v1.58 on the curve
    if(x>=121&&Math.abs(z-AC.z)<3.5) return 'Augustaanlage';   // v1.58
    if(x>=89.5&&x<111.5&&z>=-28&&z<-12.8) return 'Rosengarten';   // v1.58 moved with the buildings
    if(x>=88.5&&x<112.5&&z>=53.6&&z<64) return 'Kunsthalle';
    if(x>=88&&z>=63&&z<96) return Math.hypot(x-PL.cx,z-PL.cz)<PL.rout&&y<T+6?'Planetarium · Kuppelsaal':'Planetarium';   // v1.57
    if(x>=FP.x0&&z>=FP.z0&&z<=FP.z1+1) return x>=108.5&&x<122.5&&z>=BAS.z0-1&&z<=BAS.z1+2?'Wasserspiele':Math.hypot(x-WT.x,z-WT.z)<12?'Wasserturm':'Friedrichsplatz';   // v1.58 the basin + its terraces
    if(x>=L2.x0&&x<L2.x1+1&&z>=L2.z0&&z<L2.z1+1&&y>T-1){ if(y>=LT+.5) return 'L2 · Dach'; if(x>=L2.x0+1&&x<L2.x1&&z>=L2.z0+1&&z<L2.z1) return y>=HC+.5?'L2 · Treppenhaus':'Gedenkhalle'; }
    if(x>=66&&z>=HBF.vz0-8) return z>=HBF.z0-.5?'Hauptbahnhof':'Bahnhofsvorplatz';
    if(x>=RX0+1&&x<RX1&&z>=RZ+1&&z<SCH.z1&&y>T-1&&y<T+13) return y>=T+4.5?'Schloss · Rittersaal':z<RZ+4?'Schloss · Eingangshalle':'Schloss · Treppenhaus';   // v1.51
    if(x>=SCH.x0&&x<=SCH.x1+1&&z>=SCH.wz0&&z<=SCH.z1+1) return (x>SCH.w1[1]+1&&x<SCH.w2[0]&&z<SCH.z0-2)?'Schloss · Ehrenhof':'Schloss';
    if(z>SCH.z1+1||x<-108) return 'Schlossgarten';
    if(x>=88&&z>FP.z1) return 'Oststadt';
    if(Math.hypot(x-MB.x,z-MB.z)<4.2) return 'Marktplatzbrunnen';   // v1.48
    if(x>=-26.6&&x<-13.4&&z>=-6.8&&z<3.6) return z<-5&&x>=-21&&x<-18?'Rathausturm':x<-20?'St. Sebastian':'Altes Rathaus';
    if(x>=-84.6&&x<-59.4&&z>=65.4&&z<75.6){ if(!(x>-83&&x<-61&&z>67&&z<74)) return 'Jesuitenkirche';   // v1.49
      return jkO(Math.floor(x),Math.floor(z))<=3.45?'Jesuitenkirche · unter der Kuppel':x<-80?'Jesuitenkirche · Chor':x>-64?'Jesuitenkirche · Vorhalle':'Jesuitenkirche · Langhaus'; }
    if(x>=-15&&x<-12.6&&z>=-61&&z<-55.4) return 'Breite Straße · Imbiss am Ring';   // v1.55
    if(x>=-55&&x<-44&&z>=52&&z<62) return 'Schillerplatz · B3';   // v1.67
    if(x>=43&&x<49&&z>=42&&z<46) return 'Hinterhof · N4';   // v1.66
    for(const p of TRM.plat) if(x>=p[4]&&x<p[5]&&z>=p[6]&&z<p[7]) return 'Haltestelle '+p[3];   // v1.62, v1.65
    const q=nearQ(x,z,2.2), on=q?' · '+q.code:'';
    if(q&&q.sq&&inR(x,z,q)) return q.sq+' · '+q.code;
    if(z<=-62.5) return (x<AX.c?'Luisenring':'Friedrichsring')+on;
    if(x>=KR.x0&&x<=KR.x1+1) return 'Kaiserring'+on;
    if(x>=-108&&x<=-100) return 'Parkring'+on;
    if(z>=76&&z<=84) return 'Bismarckstraße'+on;
    if(z>=PLK.z0&&z<=PLK.z1+1) return 'Planken'+on;
    if(x>=AX.x0&&x<=AX.x1+1) return (z<PLK.z0?'Breite Straße':'Kurpfalzstraße')+on;
    return q?q.code:'Quadrate';
  }
  function riverD(x,z){ return z>RIV.s+1?z-RIV.s-1:z<RIV.n?RIV.n-z:0; }
  let clk=0, tvT=0, nightWas=null;
  // v1.33 floodlights (drawn in the block shader at night, see mhMat): a=[cx,cz,radius,0] round, or [x0,z0,x1,z1] a box lit from the side b.zw faces; b=[y0,y1,dx,dz]
  const flood=[{a:[WT.x,WT.z,10.6,0],b:[T,T+40,0,0]},{a:[SCH.x0-1,SCH.wz0-.5,SCH.x1+1,SCH.z1+1],b:[T,T+31,0,-1]},{a:[HBF.x0-1,HBF.z0-1,HBF.x1+1,HBF.z1+1],b:[T,T+22,0,-1]},{a:[-25.5,-6,-13.5,3.5],b:[T,T+21,0,-1]},{a:[-64,65.5,-59.5,75.5],b:[T,T+33,1,0]},{a:[JK.cx,JK.cz,5.4,0],b:[T+14,T+41,0,0]}];   // v1.48 + the Rathaus front, v1.49 + the Jesuitenkirche front and dome
  function tick(dt,night,cam){
    if(night!==nightWas){ nightWas=night; lamps.visible=pools.visible=night; headMat.emissive.set(night?0xffd27a:0x000000); headMat.emissiveIntensity=night?1.3:0;
      for(const [b,d,n] of NB) b.m.material.emissiveIntensity=night?n:d;
      bw.material.emissive.setHex(night?0x2c6c92:0); cw.material.emissiveIntensity=night?.9:.35; rsm.material=night?rsNight:rsDay; spit.material=night?rsNight:propMat; PLD.glass.material.emissiveIntensity=night?.35:0; }   // v1.50 the fountains are lit at night
    if(night&&(tvT-=dt)<0){ tvT=.1+Math.random()*.35; tvPaint(TL.winTv,.45+Math.random()*.55,Math.random()); if(Math.random()<.5) tvPaint(TL.winTv2,.4+Math.random()*.5,Math.random()); H.emTex.needsUpdate=true; }
    jt+=dt; jetsSet(); spit.rotation.y+=dt*.9; spit.updateMatrix();
    if((clk-=dt)<0){ clk=5; if(new Date().getMinutes()!==clockDraw.m) clockDraw(); }
    if(cam){ const v=Math.abs(cam.x-PL.cx)<16.5&&Math.abs(cam.z-PL.cz)<16.5&&cam.y<T+9; if(v!==PLD.vis){ PLD.vis=v; for(const o of PLD.in) o.visible=v; } }   // v1.57 the Planetarium's hall only draws from close by
    if(PLD.vis){ PLD.lst+=dt*Math.PI*2/86164*60; PLD.eq.quaternion.setFromAxisAngle(PLD.pole,-PLD.lst); } }

  return { mhq:{doner:[DN.x,DN.z,Math.PI/2],baker:[BK.x+.4,BK.z-.75,Math.PI],kessler:[44.5,65.25,Math.PI],hannes:[13.5,-72.6,-2.4]}, group, place, riverD, tick, steps, QD, benz, flood, ghost:null, l2:{x:14,z:71,roofY:LT+1},
    spawn:{x:4.5,z:-74.6,yaw:Math.PI}, pop:{x:34,z:-103}, tram:TRM, esk:ESKS, plk:PLKW, slp:SLP, solid:(x,y,z)=>YD.shut&&Math.floor(x)===48&&Math.floor(z)===43&&y>=T&&y<T+2, jupp:{x:7.2,z:-77.4}, seats:SEATS,
    dark:[PL.cx,PL.cz,PL.rin+.75,PL.rout+.3,T+4.05], pl:{staff:PLD.staff,doze:PLD.doze,mat:PLD.mat},   // v1.57 the Planetarium's dark hall + its two people
    facts:[[SLP.cx,SLP.cz,5.5,'Schillerplatz: Friedrich Schiller (1759-1805) in bronze. His first play, Die Räuber, had its premiere on 13 January 1782 at the Nationaltheater, which stood by this square until 1943.'],[WT.x,WT.z,15,'Wasserturm: 60 m tall, built 1886-1889 to a design by Gustav Halmhuber. Up on the dome stands Amphitrite, the sea goddess, in copper.'],
      [112,20.5,6,'The Wasserspiele: the big fountain first played on 9 September 1893. Bruno Schmitz added the water steps, the basin and the pergolas from 1899. Today 178 nozzles, the tallest jet up to 28 m, from spring to mid-October.'],   // v1.58
      [107,6.8,4,'Bruno Schmitz laid out the square from 1899: the arcade houses, the Rosengarten, the water steps, the pergolas and the lanterns. It was ready for Mannheim\'s 300th birthday in 1907.'],
      [-10,87.5,9,'Mannheim Palace: Elector Carl Philipp quarrelled with Heidelberg\'s Protestants over the Heiliggeistkirche and moved his court down the Neckar. First stone 1720, done about 1760, almost 450 m long. Today: the University.'],   // v1.51
      [34,-102,10,'Popakademie Baden-W\u00fcrttemberg: the state\'s college for pop music and the music business, founded in 2003. It moved into its new building in the Jungbusch, by the harbour, in 2004.'],   // v1.52
      [-10,98.5,6,'Rittersaal: Cosmas Damian Asam painted its ceiling in 1728-30. The bombs of 1943-44 destroyed it; Carolus Vocke painted it again in the 1960s from old photographs. Concerts play here today.',T+5],
      [94,PL.cz,6,'Planetarium Mannheim: opened in 1984 to a design by Wilfried Beck-Erlang, a glass pyramid round a projection dome 20 m across. Mannheim\'s first planetarium (1927) stood in the Luisenpark.'],   // v1.57
      [99.5,69.5,2.6,'The old star projector: it showed the sky in the dome from 1984 to 2002. Each of its two big balls lights one half of the sky.'],
      [PL.cx,PL.cz,6,'The seats tilt back, and the projector in the middle shows the sky as it stands over Mannheim tonight, turning a little faster. Take a free seat and look up.']],
    arrive:[[124,-90],[96,-90.5],[66,-88.5],[40,-84.5],[22,-82.6],[12,-82.4]],
    trig:[[118,-90,'Willkommen in Mannheim! The city of squares. Streets have no names here, only letters and numbers.'],
      [70,-88.5,'Left: the Quadrate. Right: the harbour cranes. Behind it all, flat as a Pfannkuchen.'],
      [30,-83.6,'Anlegen! Mind the gap. Liselotte waits here for the way home.']] };
}
