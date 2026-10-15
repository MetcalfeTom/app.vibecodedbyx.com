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
  const WT={x:106.5,z:20.5};                  // Wasserturm on the Friedrichsplatz
  const ROWW='KJHGFEDCBA', ROWE='UTSRQPONML';  // north (by the Neckar) to south (by the Schloss); there is no I
  const rowZ=r=>-62+r*14+(r>=6?2:0);
  const QD=[];
  for(let r=0;r<10;r++) for(let n=1;n<=6;n++){
    const z0=rowZ(r), z1=z0+9, xe=-6+(n-1)*15, xw=-25-(n-1)*15;
    QD.push({code:ROWW[r]+n,x0:xw,x1:xw+10,z0,z1,r,n,w:1},{code:ROWE[r]+n,x0:xe,x1:xe+10,z0,z1,r,n,w:0}); }
  for(const q of QD){ if(q.code==='G1') q.sq='Marktplatz'; if(q.code==='O1') q.sq='Paradeplatz'; }
  const inR=(x,z,q,m)=>x>=q.x0-(m||0)&&x<=q.x1+(m||0)&&z>=q.z0-(m||0)&&z<=q.z1+(m||0);
  const SCH={x0:-85,x1:64,z0:96,z1:105,cx0:-24,cx1:3,w1:[-50,-43],w2:[22,29],wz0:84};   // the Schloss: main wing + Ehrenhof wings
  const HBF={x0:70,x1:124,z0:114,z1:125,hx0:89,hx1:105,vz0:96};                          // Hauptbahnhof + forecourt
  const FP={x0:88,x1:127,z0:-2,z1:43};                                                    // Friedrichsplatz
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
  // Friedrichsplatz: gravel paths, a paved ring round the tower, a long basin to the east
  for(let x=FP.x0;x<=127;x++) for(let z=FP.z0;z<=FP.z1;z++){ const d=Math.hypot(x+.5-WT.x,z+.5-WT.z);
    if(d<13||Math.abs(z+.5-WT.z)<2||Math.abs(x+.5-WT.x)<2||x===FP.x0) set(x,T-1,z,d<13?B.pave:B.gravel); }
  const BAS={x0:120,x1:124,z0:3,z1:38};   // v1.38 the long fountain basin east of the tower (was x 115..126 z 12..29); v1.50 x1 126 -> 124 for the arcades
  for(let x=BAS.x0;x<=BAS.x1;x++) for(let z=BAS.z0;z<=BAS.z1;z++){ const rim=x===BAS.x0||x===BAS.x1||z===BAS.z0||z===BAS.z1; if(rim) set(x,T,z,B.trim); else set(x,T-1,z,B.blue); }
  // v1.38 the Wasserspiele (Flax): a three-step cascade comes down from the tower's terrace into the basin
  // (its water + the animated jets are meshes, see 'jets' below)
  for(let z=18;z<=22;z++){ for(let x=116;x<=119;x++){ const h=x<=117?3:x===118?2:1; for(let y=T;y<T+h;y++) set(x,y,z,B.trim); } set(BAS.x0,T,z,0); set(BAS.x0,T-1,z,B.blue); }

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
  function block(x0,z0,x1,z1,floors,wall,roof){   // one house, ground floor shops, flat roof or a slate mansard
    const top=T+1+floors*3, man=roof!=null;
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

  // ---- v1.50 (Flax) the Friedrichsplatz the way Bruno Schmitz laid it out round the Wasserturm: gardens from 1899, the square done
  // for Mannheim's 300th birthday in 1907. Real: the tower stands at the west end, the park lies about 2.5 m below the street, four
  // red sandstone arcade houses curve round its east end, the Rosengarten (Schmitz, festival hall, 1903) faces the tower from the
  // north and the Kunsthalle (Hermann Billing, 1907) from the south, all three on one axis. Ours: the park stays level with the
  // street, the arcades are one straight row along the east edge of the map (no room for the curve), the Rosengarten and the
  // Kunsthalle stand on the tower's north-south axis (x 106.5), the Kunsthalle over the two old Oststadt blocks.
  // Built after the houses and with no R(); keep the tree trunk cells free (tree() skips a taken cell and the dice shift).
  const AK={z0:-14,z1:62};   // the arcade row: fronts at x 125 on pillars, the walk under the arches x 126, shop windows x 127
  for(let z=AK.z0;z<=AK.z1;z++){ const i=z-AK.z0, pc=z>=14&&z<=27, pe=z<=-6||z>=54, top=pc||pe?19:15, p=i%4===0;   // pavilions: one on the tower's axis, one at each end
    for(let x=125;x<=127;x++){ set(x,T-1,z,B.pave); for(let y=T;y<=T+top;y++) set(x,y,z,B.sandstone); }
    for(let y=T;y<T+4;y++) set(126,y,z,0);
    for(let f=0;f<=2;f++) if(!p&&(f<2||i%4===2)) set(125,T+f,z,0);   // round-headed arches
    set(125,T+3,z,B.trim);
    for(let f=0;f<=2;f++) set(127,T+f,z,p?B.sandstone:f===2?B.trim:f===0&&i%4===2&&(i>>2)%2?B.door:hsh(127,f,z)<.5?B.shopLit:B.shop);
    for(let f=4;f<=top;f++){ let b=null;
      if(f===top||f===8||f===12||(top>15&&f===16)) b=B.trim;
      else if(!p&&(pc||pe?true:i%4!==2)&&(f%4===1||f%4===2)) b=hsh(125,f,z)<.35?B.windowLit:B.window;
      if(b) set(125,T+f,z,b); if(!p&&i%2===1&&f<top&&(f%4===1||f%4===2)) set(127,T+f,z,B.window); }   // windows at the back too (seen from the Rundflug)
    if(top===15){ set(126,T+16,z,i%4===2?B.window:B.slate); set(127,T+16,z,B.slate); set(127,T+17,z,B.slate); } }
  for(const z of [AK.z0,AK.z1]) for(let f=4;f<=19;f++) if(f%4===1||f%4===2) set(126,T+f,z,B.window);
  { const cap=(za,zb,y0)=>{ for(let k=0;za+2*k<=zb-2*k;k++) for(let z=za+2*k;z<=zb-2*k;z++) for(let x=125;x<=127;x++) set(x,y0+k,z,B.copper); };
    cap(14,27,T+20); cap(AK.z0,-6,T+20); cap(54,AK.z1,T+20); }

  // the Rosengarten facing the tower from the north: red sandstone, a roof of green glazed tiles, the Musensaal's great arched window
  for(let x=93;x<=119;x++) for(let z=-7;z<=-3;z++) set(x,T-1,z,B.pave);
  rhBox(96,116,-20,-8,T,T+11,B.sandstone);
  rhBox(101,111,-9,-7,T,T+15,B.sandstone);
  rhBox(96,99,-11,-8,T,T+15,B.sandstone); rhBox(113,116,-11,-8,T,T+15,B.sandstone);
  const rgW=(i,f,n)=>f===0||qn(i,n)?B.sandstone:f===3||f===11?B.trim:i%3===0?(f>=4?B.trim:null):(f===1||f===2||(f>=5&&f<=9))?'L':null;
  rhFace(rhRun(100,-8,100,-8).concat(rhRun(112,-8,112,-8)),0,11,(i,f)=>f===3||f===11?B.trim:f>=5&&f<=9?'L':null);
  for(const x of [96,116]) rhFace(rhRun(x,-19,x,-12),0,11,rgW);
  rhFace(rhRun(97,-20,115,-20),0,11,rgW);
  for(const [a,b] of [[96,99],[113,116]]){ const tw=(i,f)=>f===0||f===3||f===11||f===15?(f===0?B.sandstone:B.trim):f<3?null:(i===1||i===2)&&((f>=5&&f<=9)||f===13||f===14)?'L':null;
    rhFace(rhRun(a,-8,b,-8),0,15,tw); rhFace(rhRun(a===96?96:116,-11,a===96?96:116,-8),0,15,tw); }
  rhFace(rhRun(101,-7,111,-7),0,15,(i,f)=>{ const a=Math.hypot(i-5,Math.max(0,f-11));
    if(f<=2) return i===0||i===10?B.sandstone:i%2===1?B.door:null;
    if(f===3||f===15) return B.trim;
    if(i>=2&&i<=8&&f>=5&&(f<=11||a<=3.5)) return i===2||i===8||(f>11&&a>2.55)?B.trim:B.windowLit;
    return null; });
  for(let k=0;k<4;k++) for(let x=102+k;x<=110-k;x++) for(let z=-8;z<=-7;z++) set(x,T+16+k,z,x===102+k||x===110-k?B.trim:B.sandstone);
  set(106,T+20,-7,B.copper);
  for(let k=0;k<5;k++) for(let x=96+k;x<=116-k;x++) for(let z=-20+k;z<=-8-k;z++) if(!get(x,T+12+k,z)) set(x,T+12+k,z,B.copper);
  for(const a of [96,113]){ rhBox(a,a+3,-11,-8,T+16,T+16,B.copper); rhBox(a+1,a+2,-10,-9,T+17,T+17,B.copper); }

  // the Kunsthalle facing it from the south: Billing's red sandstone front, a dome over the entrance hall, a third wing behind (a T)
  for(let x=90;x<=124;x++) for(let z=48;z<=62;z++){ for(let y=T;y<=T+22;y++) set(x,y,z,0); set(x,T-1,z,z>=57&&(x<102||x>110)?B.grass:B.pave); }
  rhBox(92,120,48,56,T,T+8,B.sandstone); rhBox(102,110,57,62,T,T+8,B.sandstone);
  rhBox(101,111,47,56,T,T+11,B.sandstone); rhBox(92,94,47,56,T,T+9,B.sandstone); rhBox(118,120,47,56,T,T+9,B.sandstone);
  rhBox(95,117,49,55,T+8,T+8,B.slate);
  const khW=(i,f)=>f===0?B.sandstone:f===4||f===8?B.trim:i%3===1&&((f>=1&&f<=3)||f===6)?B.window:null;
  rhFace(rhRun(95,48,100,48).concat(rhRun(112,48,117,48)),0,8,khW);
  for(const x of [92,120]) rhFace(rhRun(x,48,x,56),0,8,khW);
  rhFace(rhRun(95,56,101,56).concat(rhRun(111,56,117,56)),0,8,khW);
  rhFace(rhRun(92,47,94,47).concat(rhRun(118,47,120,47)),0,9,(i,f)=>f===0?B.sandstone:f===4||f===9?B.trim:i===1&&((f>=1&&f<=3)||(f>=5&&f<=7))?B.window:null);
  rhFace(rhRun(101,47,111,47),0,11,(i,f)=>{ if(i>=4&&i<=6&&(f<=2||(f===3&&i===5))) return 0;
    if(f===4||f===11) return B.trim; if(f>=7&&f<=10&&i%2===0&&i>0&&i<10) return B.window; return null; });
  for(let x=105;x<=107;x++) for(let f=0;f<=2;f++) set(x,T+f,48,B.door); set(106,T+3,48,B.door);
  { const cx=106.5, cz=51.5, rr=(r,y,b,win)=>{ for(let x=101;x<=111;x++) for(let z=46;z<=57;z++){ const d=Math.hypot(x+.5-cx,z+.5-cz); if(d<=r) set(x,y,z,win&&d>r-1.05&&((x+z)&1)?B.window:b); } };
    rr(3.7,T+12,B.sandstone,1); rr(3.7,T+13,B.sandstone); rr(4.2,T+14,B.trim);
    [[3.9,15],[3.6,16],[3.1,17],[2.4,18],[1.5,19]].forEach(([r,f])=>rr(r,T+f,B.copper)); rr(.8,T+20,B.trim); rr(.8,T+21,B.copper); }

  // the gardens: a ring of flower beds round the tower's terrace, two round fountains on the cross axis, each with a basin on a stem
  for(let x=FP.x0+1;x<=119;x++) for(let z=FP.z0;z<=FP.z1;z++){ const d=Math.hypot(x+.5-WT.x,z+.5-WT.z);
    if(d>=13&&d<14.7&&Math.abs(z+.5-WT.z)>=2&&Math.abs(x+.5-WT.x)>=2) set(x,T-1,z,d<13.85?B.leavesR:B.leavesY); }
  const FF=[[106.5,2.5],[106.5,38.5]];
  for(const [cx,cz] of FF) for(let x=Math.floor(cx)-5;x<=Math.floor(cx)+5;x++) for(let z=Math.floor(cz)-5;z<=Math.floor(cz)+5;z++){ const d=Math.hypot(x+.5-cx,z+.5-cz);
    if(d<2.45){ set(x,T-1,z,B.blue); if(d<.8){ set(x,T,z,B.trim); set(x,T+1,z,B.trim); } }
    else if(d<3.3) set(x,T,z,B.trim);
    else if(d<4.7&&Math.abs(x+.5-cx)>=2) set(x,T-1,z,(z+.5<cz)===(x+.5<cx)?B.leavesR:B.leavesY); }

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
  for(const [x,z] of [[92,0],[92,10],[92,31],[92,41],[100,40],[113,40],[124,40],[100,1],[113,1],[124,1]]) tree(x,z,true);
  for(const [x,z] of [[-5,24],[3,24],[-5,33],[3,33]]) tree(x,z);   // Paradeplatz
  for(const [x,z] of [[97,6],[116,6],[97,35],[116,35]]) tree(x,z);     // v1.38 lawns round the Wasserspiele

  // ---- props: one vertex-coloured mesh (cranes, containers, bollards, benches), boards, corner signs ----
  const group=new THREE.Group(), L=[];
  const P=(w,h,d,x,y,z,c,ry,rx)=>L.push([w,h,d,x,y,z,c,ry||0,0,rx||0]);
  function crane(x,z,c){ const Y=T;
    for(const sx of [-2.3,2.3]) for(const sz of [-1.6,1.6]) P(.45,9,.45,x+sx,Y+4.5,z+sz,c);
    P(5.2,.8,3.8,x,Y+9.4,z,c); P(3.2,3,3.6,x,Y+11.3,z-.4,'#e8e2d4'); P(3.24,.6,.12,x,Y+11.8,z+1.42,'#2a3550');
    P(.4,4.2,.4,x,Y+14.6,z-.4,c); P(.6,.6,17,x,Y+14.3,z+7.6,c,0,-.32); P(2,1.6,2,x,Y+11.2,z-3,'#55575c');
    P(.07,7,.07,x,Y+11.5,z+15.4,'#222222'); P(.5,.4,.5,x,Y+7.8,z+15.4,'#333333');
  }
  for(const [x,c] of [[-112,'#d9a520'],[-86,'#2f6f9f'],[-58,'#d9a520'],[34,'#2f6f9f'],[72,'#d9a520']]) crane(x,-102.6,c);
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
  for(let a=0;a<8;a++){ const an=a*Math.PI/4+Math.PI/8, x=WT.x+Math.sin(an)*11.5, z=WT.z+Math.cos(an)*11.5; P(1.8,.12,.5,x,T+.45,z,'#7a5232',an); P(1.8,.4,.1,x+Math.sin(an)*.25,T+.75,z+Math.cos(an)*.25,'#7a5232',an); }
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
  for(let a=0;a<8;a++){ const an=a*Math.PI/4+Math.PI/8; lamp(WT.x+Math.sin(an)*13.6,WT.z+Math.cos(an)*13.6,1); }    // round the Wasserturm
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
  // v1.50 the Friedrichsplatz gardens: lanterns on Jugendstil posts, two benches facing the fountains, bronze nixies and tritons on the
  // round fountains (Schmitz had bronze ones by the small basin and stone centaurs by the big one), balconies on the arcade houses
  const cand=(x,z)=>{ P(.16,3.3,.16,x,T+1.65,z,'#1f2a24'); P(.36,.22,.36,x,T+.11,z,'#1f2a24'); P(1.15,.08,.08,x,T+3.2,z,'#1f2a24'); P(.1,.3,.1,x,T+3.45,z,'#1f2a24');
    for(const a of [-.52,.52]) LH.push([.26,.3,.26,x+a,T+3.4,z,'#fff4d6']); LH.push([.24,.28,.24,x,T+3.74,z,'#fff4d6']); LAMPS.push([x,T+3.5,z]); POOL.push([x,z]); };
  for(const [x,z] of [[118.4,9.2],[118.4,31.8],[102.6,2.5],[110.4,2.5],[102.6,38.5],[110.4,38.5]]) cand(x,z);
  const SEATS=[];
  for(const [x,z] of [[118.2,11],[118.2,30]]){ const fx=122.5-x, fz=20.5-z, l=Math.hypot(fx,fz), ux=fx/l, uz=fz/l, an=Math.atan2(-ux,-uz);   // both look up the basin to the big jet
    P(1.8,.12,.5,x,T+.45,z,'#7a5232',an); P(1.8,.45,.1,x-ux*.25,T+.78,z-uz*.25,'#7a5232',an); for(const k of [-.75,.75]) P(.08,.4,.42,x+uz*k,T+.2,z-ux*k,'#2b2b2e',an);
    SEATS.push({x:x+ux*.05,z:z+uz*.05,yaw:an,pitch:.16,stand:[x-ux*1.1,z-uz*1.1]}); }
  const BRZ='#6e5530';
  for(const [cx,cz] of FF){ P(2.3,.32,2.3,cx,T+2.16,cz,'#9a4a38'); P(2.3,.32,2.3,cx,T+2.16,cz,'#9a4a38',Math.PI/4); P(2,.04,2,cx,T+2.33,cz,'#9fd0e4'); P(2,.04,2,cx,T+2.33,cz,'#9fd0e4',Math.PI/4);
    statue(cx-2.9,T+1,cz,Math.PI/2,.5,{armUp:'R'},BRZ);
    statue(cx+2.9,T+1,cz,-Math.PI/2,.5,{extra:[[.05,1.5,.05, .4,1.2,.12,BRZ],[.3,.05,.05, .4,1.95,.12,BRZ],[.05,.2,.05, .27,2.05,.12,BRZ],[.05,.2,.05, .53,2.05,.12,BRZ]]},BRZ);
    LH.push([.9,.04,.9,cx,T+.02,cz,'#e8f8ff']); }
  for(const z of [20.5,15.5,25.5,10.5,30.5,6,35]) LH.push([.6,.04,.6,122.5,T+.02,z,'#e8f8ff']);   // lights in the long basin under each jet
  for(let z=AK.z0+2;z<AK.z1;z+=8){ LH.push([.3,.22,.3,126.5,T+3.8,z,'#fff2cc']); LAMPS.push([126.5,T+3.7,z]); }
  for(let z=AK.z0+2;z<AK.z1;z+=8) if(!(z>=14&&z<=27)) for(const f of [5,9,13]){ P(.55,.1,2.7,124.72,T+f-.05,z,'#8a3a2c'); P(.06,.5,2.7,124.47,T+f+.25,z,'#4b8774'); }
  for(const [z,y] of [[21,T+24.3],[-9.5,T+23.3],[58.5,T+23.3]]) P(.24,.6,.24,126.5,y,z,'#4b8774');   // finials on the pavilion caps
  // the Benz dais: a low slab (the car sits on it until you drive off), the plaque on a post facing the landing
  P(3.6,.3,5.6,BZ.x,T+.15,BZ.z,'#8f8a80'); P(3.75,.06,5.75,BZ.x,T+.32,BZ.z,'#b8b2a4');
  P(.14,1.05,.14,BZ.x0-.45,T+.52,BZ.z,'#3a2a1c');
  // v1.31b Bäckerei Grumbach on the Friedrichsring (U1's north front): a striped awning, a counter with loaves; Frau Kessler's door in L4
  const BK={x:-1.25,z:-62};
  for(let i=0;i<6;i++) P(.9,.1,1.3,BK.x-2.25+i*.9,T+2.9,BK.z-.62,i%2?'#f4f1ea':'#b8322a',0,-.22);
  P(1.8,.9,.7,BK.x-1.7,T+.45,BK.z-.4,'#7a4a2a'); P(1.9,.08,.8,BK.x-1.7,T+.94,BK.z-.4,'#5a3418');
  P(.5,.22,.28,BK.x-2.2,T+1.09,BK.z-.42,'#c8873a'); P(.5,.22,.28,BK.x-1.6,T+1.09,BK.z-.36,'#a8652a'); P(.36,.1,.3,BK.x-1.05,T+1.03,BK.z-.4,'#8a4a1a');
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
  const propMat=new THREE.MeshLambertMaterial({vertexColors:true});
  const pm=new THREE.Mesh(blockyGeo(L),propMat); pm.matrixAutoUpdate=false; group.add(pm);

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
  NB.push([board(15,1.5,640,64,(g,w,h)=>{ g.fillStyle='#14233f'; g.fillRect(0,0,w,h); g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 40px '+FONT; g.fillText('MANNHEIM HAUPTBAHNHOF',w/2,h/2+2); },
    (HBF.hx0+HBF.hx1+1)/2,T+12.6,HBF.z0-.03,Math.PI),.3,.9]);
  const clock=board(2.6,2.6,128,128,()=>{},(HBF.hx0+HBF.hx1+1)/2,T+14.65,HBF.z0-.04,Math.PI); NB.push([clock,.3,1.25]);
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
  NB.push([nameB('ROSENGARTEN',5.4,106.5,T+3.5,-5.96,0),.35,1.1]);
  NB.push([nameB('KUNSTHALLE',4.6,106.5,T+5.6,46.96,Math.PI),.35,1.1]);
  NB.push([board(2.5,1.2,416,200,plq('Rosengarten','Bruno Schmitz · 1903','festival hall · Jugendstil'),97.5,T+1.6,-6.97,0),.3,.8]);
  NB.push([board(2.2,1.06,416,200,plq('Kunsthalle','Hermann Billing · 1907','red sandstone · Jugendstil'),102.6,T+1.6,46.97,Math.PI),.3,.8]);
  for(const [x,y,z] of SCHP) board(3.4,3.4,136,136,(g,w,h)=>{ g.clearRect(0,0,w,h);
      g.save(); g.beginPath(); g.ellipse(w/2,h*.58,w*.34,h*.38,0,0,7); g.clip();
      for(let i=-6;i<7;i++) for(let j=-6;j<7;j++){ const cx=w/2+(i-j)*11, cy=h*.58+(i+j)*11; g.fillStyle=(i+j)&1?'#f4f1ea':'#2f6fb8'; g.beginPath(); g.moveTo(cx,cy-11); g.lineTo(cx+11,cy); g.lineTo(cx,cy+11); g.lineTo(cx-11,cy); g.fill(); }
      g.restore(); g.lineWidth=8; g.strokeStyle='#d8a636'; g.beginPath(); g.ellipse(w/2,h*.58,w*.34,h*.38,0,0,7); g.stroke();
      g.fillStyle='#d8a636'; g.fillRect(w*.36,h*.1,w*.28,h*.08); for(const k of [0,1,2]) g.fillRect(w*.36+k*w*.11,h*.02,w*.06,h*.1); },
    x,y,z,Math.PI,false,true);
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
  for(const q of codes){ if(q.code==='A4'||q.code==='A5'){ const X=q.code==='A4'?-60:-84, s=q.code==='A4'?1:-1;   // v1.49 the Jesuitenkirche fills both: signs on its outer corners
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
  const CASW=[], wc='#d6f0fa';
  CASW.push([2,.05,5,117,T+3.03,20.5,wc],[1,.05,5,118.5,T+2.03,20.5,wc],[1,.05,5,119.5,T+1.03,20.5,wc]);
  CASW.push([.05,1,5,118.03,T+2.5,20.5,wc],[.05,1,5,119.03,T+1.5,20.5,wc],[.05,1.15,5,120.03,T+.43,20.5,wc]);
  const cw=new THREE.Mesh(blockyGeo(CASW),new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:.72,depthWrite:false,emissive:0x5f8fa8,emissiveIntensity:.35}));
  cw.matrixAutoUpdate=false; group.add(cw);
  const JET=[[122.5,20.5,13],[122.5,15.5,8],[122.5,25.5,8],[122.5,10.5,6],[122.5,30.5,6],[122.5,6,4.5],[122.5,35,4.5]];   // v1.50 x 123 -> 122.5 (narrower basin)
  for(const [x,z] of FF) JET.push([x,z,1.7,T+2.3]);   // v1.50 the round fountains

  const jets=new THREE.InstancedMesh(new THREE.CylinderGeometry(.06,.32,1,7,1,true).translate(0,.5,0),
    new THREE.MeshBasicMaterial({color:0xeef9ff,transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide}),JET.length);
  jets.frustumCulled=false; group.add(jets);
  // v1.50 the falling water round each jet: a faint veil from the top of the jet down to the water (was a white cap halfway up)
  const veil=new THREE.InstancedMesh(jets.geometry,new THREE.MeshBasicMaterial({color:0xeef9ff,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide}),JET.length);
  veil.frustumCulled=false; group.add(veil);
  const jo=new THREE.Object3D(); let jt=0;
  function jetsSet(){ JET.forEach(([x,z,h0,y0],i)=>{ const h=h0*(.9+.08*Math.sin(jt*1.9+i*1.7)+.03*Math.sin(jt*7.3+i)), b=y0??T-.15, s=h0<3?1.7:4.2+i%2;
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
  { let q=0; const cb=(x,z)=>{ q++; const a=hsh(q,3,7), b=hsh(q,5,1), c=hsh(q,9,4); if(z>RIV.n-14&&z<RIV.s+14) return; const tr=a<.3, h=tr?4+b*4:6+b*10, w=tr?3+c*3:7+c*7;
      const d=w*(.7+a*.6), X=x+b*5, Z=z+c*5; if(!tr){ S.push([w+.7,1.1,d+.7,X,T+h+.55,Z,['#5a5f6a','#8a4a34','#6a5a50'][Math.floor(a*9)%3]]); for(const f of [.32,.62]) S.push([w+.08,.9,d+.08,X,T+h*f,Z,'#3a3d48']); }
      S.push([w,h,d,X,T+h/2,Z,tr?['#4f6a3a','#5a7440','#465f34'][Math.floor(b*3)]:['#c9bfa8','#b9b1a2','#d2c4a4','#a39a8c','#b28a6a','#c8a890'][Math.floor(c*6)]]); };
    for(let x=-220;x<=220;x+=13) for(const z of [-138,-156,-178,170,188,210]) cb(x,z);
    for(let z=-200;z<=230;z+=13) for(const x of [-154,-172,-194,153,171,193]) cb(x,z); }
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
    if(z<RIV.n) return 'Hafen';
    if(z<=RIV.s+1) return x>=BR.x0&&x<=BR.x1+1?'Kurpfalzbrücke':'Neckar';
    if(z<=-71) return x>-4&&x<30?'Anlegestelle':'Neckarufer';
    if(x>=124.6&&z>=AK.z0-.5&&z<AK.z1+1) return 'Friedrichsplatz · Arkaden';   // v1.50
    if(x>=95.5&&x<117.5&&z>=-21&&z<-5.8) return 'Rosengarten';
    if(x>=91.5&&x<121&&z>=46.6&&z<63) return 'Kunsthalle';
    if(x>=FP.x0&&z>=FP.z0&&z<=FP.z1) return x>=115.5&&z>=BAS.z0&&z<=BAS.z1+1?'Wasserspiele':Math.hypot(x-WT.x,z-WT.z)<12?'Wasserturm':'Friedrichsplatz';
    if(x>=L2.x0&&x<L2.x1+1&&z>=L2.z0&&z<L2.z1+1&&y>T-1){ if(y>=LT+.5) return 'L2 · Dach'; if(x>=L2.x0+1&&x<L2.x1&&z>=L2.z0+1&&z<L2.z1) return y>=HC+.5?'L2 · Treppenhaus':'Gedenkhalle'; }
    if(x>=66&&z>=HBF.vz0-8) return z>=HBF.z0-.5?'Hauptbahnhof':'Bahnhofsvorplatz';
    if(x>=SCH.x0&&x<=SCH.x1+1&&z>=SCH.wz0&&z<=SCH.z1+1) return (x>SCH.w1[1]+1&&x<SCH.w2[0]&&z<SCH.z0-2)?'Schloss · Ehrenhof':'Schloss';
    if(z>SCH.z1+1||x<-108) return 'Schlossgarten';
    if(x>=88&&z>FP.z1) return 'Oststadt';
    if(Math.hypot(x-MB.x,z-MB.z)<4.2) return 'Marktplatzbrunnen';   // v1.48
    if(x>=-26.6&&x<-13.4&&z>=-6.8&&z<3.6) return z<-5&&x>=-21&&x<-18?'Rathausturm':x<-20?'St. Sebastian':'Altes Rathaus';
    if(x>=-84.6&&x<-59.4&&z>=65.4&&z<75.6){ if(!(x>-83&&x<-61&&z>67&&z<74)) return 'Jesuitenkirche';   // v1.49
      return jkO(Math.floor(x),Math.floor(z))<=3.45?'Jesuitenkirche · unter der Kuppel':x<-80?'Jesuitenkirche · Chor':x>-64?'Jesuitenkirche · Vorhalle':'Jesuitenkirche · Langhaus'; }
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
  function tick(dt,night){
    if(night!==nightWas){ nightWas=night; lamps.visible=pools.visible=night; headMat.emissive.set(night?0xffd27a:0x000000); headMat.emissiveIntensity=night?1.3:0;
      for(const [b,d,n] of NB) b.m.material.emissiveIntensity=night?n:d;
      bw.material.emissive.setHex(night?0x2c6c92:0); cw.material.emissiveIntensity=night?.9:.35; }   // v1.50 the fountains are lit at night
    if(night&&(tvT-=dt)<0){ tvT=.1+Math.random()*.35; tvPaint(TL.winTv,.45+Math.random()*.55,Math.random()); if(Math.random()<.5) tvPaint(TL.winTv2,.4+Math.random()*.5,Math.random()); H.emTex.needsUpdate=true; }
    jt+=dt; jetsSet();
    if((clk-=dt)<0){ clk=5; if(new Date().getMinutes()!==clockDraw.m) clockDraw(); } }

  return { mhq:{baker:[BK.x+.4,BK.z-.75,Math.PI],kessler:[44.5,65.25,Math.PI],hannes:[13.5,-72.6,-2.4]}, group, place, riverD, tick, steps, QD, benz, flood, ghost:L2G, l2:{x:14,z:71,roofY:LT+1},
    spawn:{x:4.5,z:-74.6,yaw:Math.PI}, jupp:{x:7.2,z:-77.4}, seats:SEATS,
    facts:[[WT.x,WT.z,15,'Wasserturm: 60 m tall, built 1886-1889 to a design by Gustav Halmhuber. Up on the dome stands Amphitrite, the sea goddess, in copper.'],
      [119,20.5,7,'Bruno Schmitz laid out these gardens from 1899: water steps, basins, arcades, lanterns. The square was ready for Mannheim\'s 300th birthday in 1907.']],
    arrive:[[124,-90],[96,-90.5],[66,-88.5],[40,-84.5],[22,-82.6],[12,-82.4]],
    trig:[[118,-90,'Willkommen in Mannheim! The city of squares. Streets have no names here, only letters and numbers.'],
      [70,-88.5,'Left: the Quadrate. Right: the harbour cranes. Behind it all, flat as a Pfannkuchen.'],
      [30,-83.6,'Anlegen! Mind the gap. Liselotte waits here for the way home.']] };
}
