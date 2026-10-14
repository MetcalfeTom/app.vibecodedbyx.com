// Heidelberg Blocks · Mannheim (v1.30-31, for Flax): loaded only when Kapitän Jupp takes you down the Neckar.
// build(H) writes the Quadratestadt into the shared voxel grid (the main file meshes it with the same blocks)
// and returns the props, the place names and the boat's arrival route. +x = east, +z = south, streets at y = TOWN.
export function build(H){
  const {THREE,set,get,B,TOWN:T,WATER:W,blockyGeo,TS}=H;
  const R=H.rngOf(1607);   // Mannheim got its town charter in 1607
  // ---- four new tiles in free atlas slots: asphalt, pavement slabs, verdigris copper, shop glass ----
  const g=H.atlasC.getContext('2d'), ge=H.emC.getContext('2d');
  const tile=(i,base,fn)=>{ const ox=(i%8)*TS, oy=Math.floor(i/8)*TS; g.fillStyle=base; g.fillRect(ox,oy,TS,TS);
    const px=(x,y,c)=>{ g.fillStyle=c; g.fillRect(ox+x,oy+y,1,1); }; fn(px,ox,oy); };
  const speck=(px,c,n)=>{ for(let k=0;k<n;k++) px(R()*TS|0,R()*TS|0,c); };
  const TL={asphalt:40,pave:41,copper:42,shop:43,shopLit:44,track:45};
  tile(TL.asphalt,'#5c5e62',px=>{ speck(px,'#6b6d71',40); speck(px,'#4d4f53',34); });
  tile(TL.pave,'#b9b3a7',px=>{ for(let k=0;k<TS;k++){ px(k,7,'#9c968b'); px(k,15,'#9c968b'); px(7,k<8?k:0,'#9c968b'); px(15,k>=8?k:8,'#9c968b'); } speck(px,'#c9c3b7',14); });
  tile(TL.copper,'#5f9e88',px=>{ for(let y=0;y<TS;y++) for(let x=0;x<TS;x+=4) px(x,y,'#4b8774'); speck(px,'#7dbca6',22); speck(px,'#3f7666',14); });
  const shop=(px)=>{ for(let y=1;y<TS;y++) for(let x=1;x<TS-1;x++) px(x,y,(x+y)%9===0?'#4a5f86':'#26324a'); for(let x=0;x<TS;x++) px(x,0,'#d8d2c4'); for(let y=0;y<TS;y++){ px(0,y,'#d8d2c4'); px(TS-1,y,'#d8d2c4'); px(8,y,'#bdb6a8'); } px(3,3,'#9fb4d6'); px(4,3,'#7d93b8'); };
  tile(TL.shop,'#26324a',shop); tile(TL.shopLit,'#26324a',shop);
  { const ox=(TL.shopLit%8)*TS, oy=Math.floor(TL.shopLit/8)*TS; ge.fillStyle='#ffd9a0'; ge.fillRect(ox+1,oy+1,7,TS-1); ge.fillRect(ox+9,oy+1,6,TS-1); }
  tile(TL.track,'#8f877a',px=>{ speck(px,'#6f675c',40); speck(px,'#aaa293',20); for(let y=1;y<TS;y+=4) for(let x=1;x<TS-1;x++) px(x,y,'#6b4a2e'); for(let y=0;y<TS;y++){ px(4,y,'#c8c8cc'); px(11,y,'#c8c8cc'); } });
  H.atlas.needsUpdate=true; H.emTex.needsUpdate=true;
  if(!B.asphalt){ H.def('asphalt',TL.asphalt); H.def('pave',TL.pave); H.def('copper',TL.copper); H.def('shop',TL.shop); H.def('shopLit',TL.shopLit); H.def('track',TL.track); }

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
  const BAS={x0:115,x1:126,z0:12,z1:29};
  for(let x=BAS.x0;x<=BAS.x1;x++) for(let z=BAS.z0;z<=BAS.z1;z++){ const rim=x===BAS.x0||x===BAS.x1||z===BAS.z0||z===BAS.z1; if(rim) set(x,T,z,B.trim); else set(x,T-1,z,B.blue); }

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
  const LAMPS=[];
  for(let x=-96;x<=76;x+=12) for(const z of [PLK.z0+.6,PLK.z1+.4]){ P(.14,4,.14,x,T+2,z,'#2b2b2e'); P(.5,.3,.5,x,T+4.1,z,'#2b2b2e'); LAMPS.push([x,T+3.85,z]); }
  for(let z=-66;z<=60;z+=12) for(const x of [AX.x0+.6,AX.x1+.4]){ P(.14,4,.14,x,T+2,z,'#2b2b2e'); P(.5,.3,.5,x,T+4.1,z,'#2b2b2e'); LAMPS.push([x,T+3.85,z]); }
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
  const propMat=new THREE.MeshLambertMaterial({vertexColors:true});
  const pm=new THREE.Mesh(blockyGeo(L),propMat); pm.matrixAutoUpdate=false; group.add(pm);

  // lamp glow: one Points cloud, only drawn at night
  const lg=new THREE.BufferGeometry(); lg.setAttribute('position',new THREE.Float32BufferAttribute(LAMPS.flat(),3));
  const lamps=new THREE.Points(lg,new THREE.PointsMaterial({color:0xffcf7a,size:1.1,map:H.roundDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  lamps.visible=false; group.add(lamps);

  // boards (canvas textures, a little self-lit so they read at night)
  function board(w,h,cw,ch,paint,x,y,z,ry,two,cut){ const c=document.createElement('canvas'); c.width=cw; c.height=ch; paint(c.getContext('2d'),cw,ch);
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.3,alphaTest:cut?.5:0,side:two?THREE.DoubleSide:THREE.FrontSide}));
    m.position.set(x,y,z); m.rotation.y=ry||0; m.matrixAutoUpdate=false; m.updateMatrix(); group.add(m); return {m,c,t}; }
  const FONT='"Pixelify Sans", ui-monospace, monospace';
  board(9,1.6,576,102,(g,w,h)=>{ g.fillStyle='#1f3f7a'; g.fillRect(0,0,w,h); g.strokeStyle='#f4f1ea'; g.lineWidth=6; g.strokeRect(6,6,w-12,h-12); g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 50px '+FONT; g.fillText('MANNHEIM',w/2,h*.4); g.font='400 22px '+FONT; g.fillText('Anlegestelle · Quadratestadt',w/2,h*.78); },
    8,T+3.4,-78.97,Math.PI);
  board(15,1.5,640,64,(g,w,h)=>{ g.fillStyle='#14233f'; g.fillRect(0,0,w,h); g.fillStyle='#f4f1ea'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 40px '+FONT; g.fillText('MANNHEIM HAUPTBAHNHOF',w/2,h/2+2); },
    (HBF.hx0+HBF.hx1+1)/2,T+12.6,HBF.z0-.03,Math.PI);
  const clock=board(2.6,2.6,128,128,()=>{},(HBF.hx0+HBF.hx1+1)/2,T+14.65,HBF.z0-.04,Math.PI);
  function clockDraw(){ const g=clock.c.getContext('2d'), d=new Date(), hh=d.getHours()%12, mm=d.getMinutes(); g.clearRect(0,0,128,128);
    g.fillStyle='#f4f1ea'; g.beginPath(); g.arc(64,64,60,0,7); g.fill(); g.lineWidth=6; g.strokeStyle='#2a2a2e'; g.stroke();
    for(let i=0;i<12;i++){ const a=i*Math.PI/6; g.fillStyle='#2a2a2e'; g.fillRect(64+Math.sin(a)*48-3,64-Math.cos(a)*48-3,6,6); }
    const hand=(a,l,w)=>{ g.lineWidth=w; g.lineCap='square'; g.beginPath(); g.moveTo(64,64); g.lineTo(64+Math.sin(a)*l,64-Math.cos(a)*l); g.stroke(); };
    hand((hh+mm/60)*Math.PI/6,30,8); hand(mm*Math.PI/30,46,5); clock.t.needsUpdate=true; clockDraw.m=mm; }
  clockDraw();
  board(6,1.2,384,77,(g,w,h)=>{ g.fillStyle='#f1e7cf'; g.fillRect(0,0,w,h); g.fillStyle='#5a2a1c'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 30px '+FONT; g.fillText('Wasserturm',w/2,h*.38); g.font='400 18px '+FONT; g.fillText('Friedrichsplatz · 1889',w/2,h*.76); },
    WT.x-10.4,T+1.25,WT.z,-Math.PI/2,true);

  board(2.5,1.05,400,168,(g,w,h)=>{ g.fillStyle='#5a3a1c'; g.fillRect(0,0,w,h); g.strokeStyle='#d8b060'; g.lineWidth=8; g.strokeRect(8,8,w-16,h-16);
      g.fillStyle='#f4e6c0'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 27px '+FONT; g.fillText('Carl Benz, Mannheim 1886,',w/2,h*.38); g.font='700 36px '+FONT; g.fillText('the f\u200Cirst car',w/2,h*.68); },
    BZ.x0-.55,T+1.35,BZ.z,-Math.PI/2);
  board(2.5,1.05,8,8,(g,w,h)=>{ g.fillStyle='#4a2f17'; g.fillRect(0,0,w,h); },BZ.x0-.53,T+1.35,BZ.z,Math.PI/2);
  board(5,.8,400,64,(g,w,h)=>{ g.fillStyle='#3a2414'; g.fillRect(0,0,w,h); g.strokeStyle='#d8b060'; g.lineWidth=4; g.strokeRect(4,4,w-8,h-8); g.fillStyle='#f4e6c0'; g.textAlign='center'; g.textBaseline='middle'; g.font='700 34px '+FONT; g.fillText('BÄCKEREI GRUMBACH',w/2,h/2+2); },
    BK.x,T+3.5,BK.z-.03,Math.PI);
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
  for(const q of codes){ const X0=q.x0+1, X1=q.x1, Z0=q.z0+1, Z1=q.z1;   // building faces (the sidewalk ring is outside)
    plate(q,X0+.8,Z0,0,-1); plate(q,X1-.8,Z0,0,-1); plate(q,X0+.8,Z1,0,1); plate(q,X1-.8,Z1,0,1);
    plate(q,X0,Z0+.8,-1,0); plate(q,X0,Z1-.8,-1,0); plate(q,X1,Z0+.8,1,0); plate(q,X1,Z1-.8,1,0); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sg.setAttribute('normal',new THREE.Float32BufferAttribute(sn,3)); sg.setAttribute('uv',new THREE.Float32BufferAttribute(su,2)); sg.setIndex(si);
  const signs=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({map:st,emissive:0xffffff,emissiveMap:st,emissiveIntensity:.35})); signs.matrixAutoUpdate=false; group.add(signs);

  // basin water on the Friedrichsplatz
  const bw=new THREE.Mesh(new THREE.PlaneGeometry(BAS.x1-BAS.x0-1,BAS.z1-BAS.z0-1),new THREE.MeshPhongMaterial({color:0x6f9fb8,shininess:90,transparent:true,opacity:.85}));
  bw.rotation.x=-Math.PI/2; bw.position.set((BAS.x0+BAS.x1+1)/2,T-.15,(BAS.z0+BAS.z1+1)/2); bw.matrixAutoUpdate=false; bw.updateMatrix(); group.add(bw);

  // ---- beyond the edge: the flat Rhine plain (no more Odenwald), the Neckar running on, a far skyline ----
  const S=[], SC='#7b7d72';
  const slab=(x0,x1,z0,z1,c)=>S.push([x1-x0,T-6,z1-z0,(x0+x1)/2,(T+6)/2-.02,(z0+z1)/2,c||SC]);
  slab(-1200,1200,-1200,-112,'#77786e'); slab(-1200,1200,144,1200); slab(-1200,-128,-112,RIV.n); slab(-1200,-128,RIV.s+1,144); slab(128,1200,-112,RIV.n); slab(128,1200,RIV.s+1,144);
  S.push([2400,1,RIV.s+1-RIV.n,0,5.4,(RIV.n+RIV.s+1)/2,'#6a6450']);
  for(let i=0;i<90;i++){ const a=R()*Math.PI*2, d=200+R()*230, x=Math.sin(a)*d, z=Math.cos(a)*d; if(z>RIV.n-30&&z<RIV.s+30) continue; const h=5+R()*R()*30;
    S.push([8+R()*22,h,8+R()*22,x,T+h/2,z,['#b9b1a2','#a39a8c','#c9bfa8','#8f8a80','#b28a6a'][Math.floor(R()*5)]]); }
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
    if(x>=FP.x0&&z>=FP.z0&&z<=FP.z1) return Math.hypot(x-WT.x,z-WT.z)<12?'Wasserturm':'Friedrichsplatz';
    if(x>=66&&z>=HBF.vz0-8) return z>=HBF.z0-.5?'Hauptbahnhof':'Bahnhofsvorplatz';
    if(x>=SCH.x0&&x<=SCH.x1+1&&z>=SCH.wz0&&z<=SCH.z1+1) return (x>SCH.w1[1]+1&&x<SCH.w2[0]&&z<SCH.z0-2)?'Schloss · Ehrenhof':'Schloss';
    if(z>SCH.z1+1||x<-108) return 'Schlossgarten';
    if(x>=88&&z>FP.z1) return 'Oststadt';
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
  let clk=0;
  function tick(dt,night){ lamps.visible=night; if((clk-=dt)<0){ clk=5; if(new Date().getMinutes()!==clockDraw.m) clockDraw(); } }

  return { mhq:{baker:[BK.x+.4,BK.z-.75,Math.PI],kessler:[44.5,65.25,Math.PI],hannes:[13.5,-72.6,-2.4]}, group, place, riverD, tick, steps, QD, benz,
    spawn:{x:4.5,z:-74.6,yaw:Math.PI}, jupp:{x:7.2,z:-77.4},
    arrive:[[124,-90],[96,-90.5],[66,-88.5],[40,-84.5],[22,-82.6],[12,-82.4]],
    trig:[[118,-90,'Willkommen in Mannheim! The city of squares. Streets have no names here, only letters and numbers.'],
      [70,-88.5,'Left: the Quadrate. Right: the harbour cranes. Behind it all, flat as a Pfannkuchen.'],
      [30,-83.6,'Anlegen! Mind the gap. Liselotte waits here for the way home.']] };
}
