// Heidelberg Blocks · Hirschhorn (v1.34, for Flax): loaded only when Kapitän Jupp takes you UP the Neckar.
// build(H) writes a small valley town into the shared voxel grid: the Neckar bending round the Ersheim meadow, the old
// town on the outside of the bend with its wall along the water, Burg Hirschhorn on the hill right above it, the old
// Ersheim chapel across the river. +x = east, +z = south, the old town street at y = TOWN, the riverside path at 13.
export function build(H){
  const {THREE,set,get,B,TOWN:T,WATER:W,blockyGeo,TS,person}=H;
  const R=H.rngOf(4711);
  // ---- tiles (free atlas slots 49-62): half-timbering in two plasters, windows with shutters, timber, wall rubble, roof tiles ----
  const g=H.atlasC.getContext('2d'), ge=H.emC.getContext('2d');
  const slot=i=>[(i%8)*TS,Math.floor(i/8)*TS];
  const tile=(i,base,fn)=>{ const [ox,oy]=slot(i); g.fillStyle=base; g.fillRect(ox,oy,TS,TS); ge.fillStyle='#000'; ge.fillRect(ox,oy,TS,TS);
    const px=(x,y,c,w,h)=>{ g.fillStyle=c; g.fillRect(ox+x,oy+y,w||1,h||1); }; fn(px,ox,oy); };
  const speck=(px,c,n)=>{ for(let k=0;k<n;k++) px(R()*TS|0,R()*TS|0,c); };
  const TL={fwW:49,fwPW:50,fwRW:51,fwDW:52,fwC:53,fwPC:54,fwRC:55,fwDC:56,win:57,winL:58,winR:59,beam:60,rubble:61,roofH:62};
  const BM='#4b2f1d', BM2='#62402a';
  const beamV=px=>{ px(0,0,BM,3,TS); px(1,0,BM2,1,TS); };
  const beamH=px=>{ px(0,0,BM,TS,3); px(0,1,BM2,TS,1); };
  const diag=px=>{ for(let x=3;x<TS;x++){ const y=Math.round((TS-1)-(x-3)*(TS-1)/(TS-4)); px(x,Math.max(0,y-1),BM,1,3); } };
  for(const [k,base,sh] of [['W','#efe9dc','#ddd3c0'],['C','#ead09c','#d6b981']]){
    const pl=px=>speck(px,sh,22);
    tile(TL['fw'+k],base,px=>pl(px));
    tile(TL['fwP'+k],base,px=>{ pl(px); beamV(px); });
    tile(TL['fwR'+k],base,px=>{ pl(px); beamV(px); beamH(px); });
    tile(TL['fwD'+k],base,px=>{ pl(px); beamV(px); diag(px); }); }
  const winT=(i,sh,shD,lit)=>tile(i,BM,(px,ox,oy)=>{
    px(4,2,'#2b3442',8,11); px(4,7,'#e8e0d0',8,1); px(7,2,'#e8e0d0',2,11); px(5,3,'#56708c',2,2); px(9,3,'#56708c',2,2);
    px(0,1,sh,3,13); px(13,1,sh,3,13); for(let y=2;y<14;y+=2){ px(0,y,shD,3,1); px(13,y,shD,3,1); }
    px(3,13,'#cdbfa6',10,2);
    if(lit){ ge.fillStyle='#ffbf6a'; for(const [a,b] of [[4,2],[9,2],[4,8],[9,8]]) ge.fillRect(ox+a,oy+b,3,5); } });
  winT(TL.win,'#3f6a4a','#2f5238',0); winT(TL.winL,'#3f6a4a','#2f5238',1); winT(TL.winR,'#9a3c2c','#7a2c20',1);
  tile(TL.beam,BM,px=>{ for(let y=0;y<TS;y+=3) px(0,y,BM2,TS,1); speck(px,'#3a2416',14); });
  tile(TL.rubble,'#8f8574',px=>{ const C=['#a8705a','#b48266','#9a9384','#8c5e4c','#c09478','#a59d8c','#b9a58a'];
    for(const [y,hh] of [[0,5],[5,6],[11,5]]){ let x=-(R()*4|0); while(x<TS){ const w=4+(R()*5|0), x0=Math.max(0,x), c=C[R()*C.length|0];
      px(x0,y,c,Math.min(w-1,TS-x0),hh-1); px(x0,y,'#ffffff18',Math.min(w-1,TS-x0),1); px(x0+(R()*(w-2)|0),y+1+(R()*(hh-2)|0),'#00000022',2,1); x+=w; } } });
  tile(TL.roofH,'#7e3324',px=>{ for(let y=0;y<TS;y+=4){ const o=(y/4%2)*2; for(let x=-o;x<TS;x+=4){ px(Math.max(0,x),y,'#a24a34',3,3); px(Math.max(0,x),y+3,'#6a2a1c',3,1); } } speck(px,'#b85a40',8); });
  H.atlas.needsUpdate=true; H.emTex.needsUpdate=true;
  const HB={}; for(const k in TL){ const n='hh_'+k; HB[k]=B[n]||H.def(n,TL[k]); }

  // ---- the valley: the Neckar bends round the Ersheim meadow; the old town sits on the outside of the bend ----
  const HW=12;   // half the river's width
  const RP=[[-58,700],[-58,50],[-54,14],[-44,-8],[-30,-20],[30,-20],[44,-8],[54,14],[56,50],[56,700]];
  const segD=(px,pz,a,b)=>{ const dx=b[0]-a[0], dz=b[1]-a[1]; let t=((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz); t=t<0?0:t>1?1:t; return Math.hypot(px-a[0]-t*dx,pz-a[1]-t*dz); };
  const rD=(x,z)=>{ let d=1e9; for(let i=0;i<RP.length-1;i++){ const v=segD(x,z,RP[i],RP[i+1]); if(v<d) d=v; } return d; };
  const inside=(x,z)=>{ let c=false; for(let i=0,j=RP.length-1;i<RP.length;j=i++){ const a=RP[i], b=RP[j]; if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]) c=!c; } return c; };
  const nz=(x,z)=>Math.sin(x*.11+1.3)*Math.cos(z*.09-.7)+.5*Math.sin(x*.23-z*.19+2.1);
  function hgtF(x,z,d){   // the natural ground (its top face), smooth
    if(d<HW) return d<HW-6?5:d<HW-3?6.5:d<HW-1?8.5:10;
    if(d<HW+2.5) return 12;
    const e=d-HW-2.5, n=nz(x,z);
    if(inside(x,z)){ const s=Math.max(0,z-26), r=Math.min(s*.7,e*.8), c=46; return 13+(r<c?r:c+(r-c)*.25)+n*Math.min(1,r/8)*2.5; }
    return Math.min(13+e*.9+n*Math.min(1,e/8)*3,66); }
  const X0=-128, Z0=-112, NZ=256, I=(x,z)=>(x-X0)*NZ+(z-Z0), hm=new Int16Array(256*256), km=new Uint8Array(256*256);
  const K={bed:1,shore:2,meadow:3,forest:4,path:5,town:6,street:7,deck:8,court:9,rock:10};
  for(let x=-128;x<=127;x++) for(let z=-112;z<=143;z++){ const d=rD(x+.5,z+.5), h=hgtF(x+.5,z+.5,d), k=I(x,z);
    hm[k]=Math.floor(h); km[k]=d<HW?K.bed:d<HW+2.5?K.shore:inside(x+.5,z+.5)&&h<15?K.meadow:K.forest; }
  const rect=(x0,x1,z0,z1,h,k)=>{ for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ const i=I(x,z); if(h!=null) hm[i]=h; km[i]=k; } };
  const TW={x0:-36,x1:36};                      // the old town: wall z -38..-37, row A z -43..-37, street z -47..-44, row B z -55..-48
  rect(-38,38,-36,-33,13,K.path);               // the Uferweg along the wall
  rect(TW.x0,TW.x1,-55,-37,T,K.town);   // row B backs onto the castle hill
  rect(TW.x0,TW.x1,-47,-44,T,K.street);
  rect(-6,3,-43,-38,T,K.deck);                  // the café terrace over the river
  for(let x=TW.x0;x<=TW.x1;x++) for(let z=-60;z<=-56;z++){ const i=I(x,z); if(hm[i]>T+3) km[i]=K.rock; }
  const CY=46, CS={x0:-26,x1:12,z0:-90,z1:-60};   // Burg Hirschhorn on its plateau right above the town
  rect(CS.x0,CS.x1,CS.z0,CS.z1,CY,K.court);
  rect(-15,16,-1,18,13,K.meadow);               // the chapel's little mound on the Ersheim meadow
  // the Burgweg: from the west end of the old town up round the hill to the castle gate
  const BW=[[-36,-45.5,19],[-41,-46.5,19],[-46,-52,23],[-50,-60,29],[-48,-70,35],[-40,-77,41],[-32,-78.5,45],[-27.5,-76,46]];
  const bwC=new Set();
  for(let i=0;i<BW.length-1;i++){ const a=BW[i], b=BW[i+1], n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.25);
    for(let s=0;s<=n;s++){ const t=s/n, x=a[0]+(b[0]-a[0])*t, z=a[1]+(b[1]-a[1])*t, h=Math.round(a[2]+(b[2]-a[2])*t);
      for(let dx=-1.4;dx<=1.41;dx+=.7) for(let dz=-1.4;dz<=1.41;dz+=.7){ if(dx*dx+dz*dz>2.1) continue; const cx=Math.floor(x+dx), cz=Math.floor(z+dz), k=I(cx,cz);
        if(km[k]===K.town||km[k]===K.street||km[k]===K.court) continue; hm[k]=h; km[k]=K.path; bwC.add(cx+','+cz); } } }
  // write the columns (steep ground turns to rock)
  const TOP={[K.bed]:B.sand,[K.shore]:B.gravel,[K.meadow]:B.grass,[K.forest]:B.forest,[K.path]:B.gravel,[K.town]:B.cobble,[K.street]:B.cobble,[K.deck]:B.plank,[K.court]:B.cobble,[K.rock]:B.stone};
  for(let x=-128;x<=127;x++) for(let z=-112;z<=143;z++){ const k=I(x,z), h=hm[k], kd=km[k];
    let st=0; for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){ const xx=x+dx, zz=z+dz; if(xx<-128||xx>127||zz<-112||zz>143) continue; st=Math.max(st,h-hm[I(xx,zz)]); }
    const steep=st>=3&&(kd===K.forest||kd===K.meadow), mason=(kd===K.court&&(x===CS.x0||x===CS.x1||z===CS.z0||z===CS.z1))||(kd!==K.path&&kd!==K.deck&&x>=TW.x0&&x<=TW.x1&&(z===-38||z===-37));
    for(let y=0;y<h-1;y++) set(x,y,z, mason&&y>=10?HB.rubble : !steep&&y>=h-4&&kd!==K.bed?B.dirt:B.stone);
    set(x,h-1,z, mason?HB.rubble : steep?B.stone : TOP[kd]); }
  // autumn in the Odenwald: the forest roof gets bumps of green, yellow and red leaves
  const leaf=()=>{ const r=R(); return r<.5?B.leaves:r<.8?B.leavesY:B.leavesR; };
  const forestAt=(x,z)=>x>=-128&&x<=127&&z>=-112&&z<=143&&km[I(x,z)]===K.forest;
  for(let x=-127;x<=126;x++) for(let z=-111;z<=142;z++){ if(!forestAt(x,z)) continue; const h=hm[I(x,z)], r=R();
    if(r<.022&&forestAt(x-1,z)&&forestAt(x+1,z)&&forestAt(x,z-1)&&forestAt(x,z+1)){ const b=leaf(); for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++) if(Math.abs(dx)+Math.abs(dz)<2||R()<.6) set(x+dx,hm[I(x+dx,z+dz)],z+dz,b); set(x,h+1,z,b); }
    else if(r<.11) set(x,h,z,leaf()); }

  // ---- helpers ----
  const hsh=(x,y,z)=>{ const v=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453; return v-Math.floor(v); };
  const winB=(x,y,z)=>{ const h=hsh(x,y,z); return h<.28?HB.win:h<.7?HB.winL:HB.winR; };
  const FW={W:{p:HB.fwW,post:HB.fwPW,rail:HB.fwRW,diag:HB.fwDW},C:{p:HB.fwC,post:HB.fwPC,rail:HB.fwRC,diag:HB.fwDC}};
  const wpos=(u,n)=>u>0&&u<n-1&&(u<n/2?u%2===1:(n-1-u)%2===1);
  const BOX=[];   // window boxes: [x,y,z,nx,nz]
  // a house: footprint x0..x1 z0..z1 from y0, fl floors of three blocks, half-timbered (o.pl W/C) or plain (o.solid); steep gable roof
  function house(x0,x1,z0,z1,o){
    const y0=o.y0??T, nf=o.fl||2, P=FW[o.pl||'W'], top=y0+nf*3-1, Wd=x1-x0+1, D=z1-z0+1, gfw=o.gf==='fw', S=o.solid;
    for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) for(let y=y0;y<=top;y++){
      const ex=x===x0||x===x1, ez=z===z0||z===z1;
      if(!ex&&!ez){ set(x,y,z,B.stone); continue; }
      const f=Math.floor((y-y0)/3), r=(y-y0)%3, onZ=ez&&!ex, u=onZ?x-x0:z-z0, n=onZ?Wd:D;
      const isWin=(onZ||(o.xw&&!ez))&&r===1&&wpos(u,n);
      let b;
      if(S) b=ex&&ez?B.sandstone:isWin?(hsh(x,y,z)<.62?B.windowLit:B.window):S;
      else if(ex&&ez) b=f===0&&!gfw?B.sandstone:HB.beam;
      else if(f===0&&!gfw) b=isWin?winB(x,y,z):(o.gs||B.sandstone);
      else if(isWin) b=winB(x,y,z);
      else b=r===2?P.rail:(u===1||u===n-2)&&r===0?P.diag:u%2===0?P.post:P.p;
      set(x,y,z,b);
      if(isWin&&!S&&(f>=1||o.box0)&&R()<.85&&!(o.nobox&&o.nobox(x,z))) BOX.push(onZ?[x,y,z,0,z===z0?-1:1]:[x,y,z,x===x0?-1:1,0]); }
    if(o.door) for(const [dx,dz] of [o.door]){ set(dx,y0,dz,B.door); set(dx,y0+1,dz,B.door); }
    const st=o.st||2, yr=top+1, gt=S||null;
    const gab=(u,L,n,x,y,z)=>gt?(L>0&&L<3&&Math.abs(u-(n-1)/2)<.6?B.windowLit:gt):L===0?P.rail:(L===2||L===3)&&Math.abs(u-(n-1)/2)<.6&&n>=5?winB(x,y,z):u%2===0?P.post:P.p;
    if((o.ridge||'z')==='z'){
      for(let L=0;;L++){ const xa=x0-1+Math.floor(L/st), xb=x1+1-Math.floor(L/st); if(xa>xb) break; const y=yr+L;
        for(let x=xa;x<=xb;x++){ if(x===xa||x===xb){ for(let z=z0-1;z<=z1+1;z++) set(x,y,z,o.rb||HB.roofH); continue; }
          for(let z=z0;z<=z1;z++) set(x,y,z,z===z0||z===z1?gab(x-x0,L,Wd,x,y,z):B.stone); } }
    } else {
      for(let L=0;;L++){ const za=z0-1+Math.floor(L/st), zb=z1+1-Math.floor(L/st); if(za>zb) break; const y=yr+L;
        for(let z=za;z<=zb;z++){ if(z===za||z===zb){ for(let x=x0-1;x<=x1+1;x++) set(x,y,z,o.rb||HB.roofH); continue; }
          for(let x=x0;x<=x1;x++) set(x,y,z,x===x0||x===x1?gab(z-z0,L,D,x,y,z):B.stone); } } }
    return top; }
  function pyr(x0,x1,z0,z1,y,st,b){ let L=0;
    for(;;L++){ const i=Math.floor(L/st)-1, xa=x0+i, xb=x1-i, za=z0+i, zb=z1-i; if(xa>xb||za>zb) break;
      for(let x=xa;x<=xb;x++) for(let z=za;z<=zb;z++) set(x,y+L,z,x===xa||x===xb||z===za||z===zb?b:B.stone); }
    const cx=Math.floor((x0+x1)/2), cz=Math.floor((z0+z1)/2); set(cx,y+L,cz,B.gold); }
  function tower(x0,x1,z0,z1,yb,yt,o){
    for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) for(let y=yb;y<=yt;y++){ const ex=x===x0||x===x1, ez=z===z0||z===z1;
      if(!ex&&!ez){ set(x,y,z,B.stone); continue; }
      const u=ez&&!ex?x-x0:z-z0, n=ez&&!ex?x1-x0+1:z1-z0+1, w=(o.wy||[]).includes(y)&&Math.abs(u-(n-1)/2)<.6&&!(ex&&ez);
      set(x,y,z, ex&&ez?B.sandstone : w?(o.lit&&hsh(x,y,z)<.6?B.windowLit:B.window) : (o.wall||HB.rubble)); }
    if(o.roof) pyr(x0,x1,z0,z1,yt+1,o.st||2,o.roof);
    else for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) if((x===x0||x===x1||z===z0||z===z1)&&(x+z)%2===0) set(x,yt+1,z,o.wall||HB.rubble); }
  function tree(x,z,y,ht,big){ for(let k=0;k<ht;k++) set(x,y+k,z,B.log); const cy=y+ht, r=big?2.7:2.1, lb=R()<.6?B.leaves:leaf();
    for(let dx=-3;dx<=3;dx++) for(let dy=-2;dy<=3;dy++) for(let dz=-3;dz<=3;dz++){ const d=Math.hypot(dx,dy*1.25,dz); if(d<=r+R()*.5&&!get(x+dx,cy+dy,z+dz)) set(x+dx,cy+dy,z+dz,R()<.8?lb:leaf()); } }

  // ---- the old town: the wall along the river, a gate up from the landing, two rows of half-timbered houses ----
  for(let x=-6;x<=3;x++) set(x,T,-37,HB.rubble);                                     // the terrace parapet
  for(let x=TW.x0;x<=-35;x++) set(x,T,-37,HB.rubble);
  const sorted=(L)=>L.slice().sort((a,b)=>a[3]-b[3]);
  const ROWA=[[-34,-29,'W',2,'z','fw'],[-28,-24,'C',2,'z',0],[-23,-18,'W',3,'x',0],[-12,-7,'C',2,'z','fw'],[9,14,'W',2,'z',0],[15,19,'C',3,'z','fw'],[20,25,'W',2,'x',0],[26,30,'C',2,'z','fw']];
  const ROWB=[[-34,-28,'C',2,'z',0],[-27,-22,'W',2,'z','fw'],[-21,-16,'C',3,'x',0],[-15,-10,'W',2,'z','fw'],[-9,-3,'W',2,'z',0,'cafe'],[-2,3,'C',2,'z','fw'],[4,9,'W',3,'z',0],[10,15,'C',2,'x','fw'],[16,21,'W',2,'z',0],[22,27,'C',3,'z','fw'],[28,34,'W',2,'z',0]];
  for(const [x0,x1,pl,fl,ri,gf] of sorted(ROWA)) house(x0,x1,-43,-37,{pl,fl,ridge:ri,gf,door:[Math.floor((x0+x1)/2),-43]});
  for(const [x0,x1,pl,fl,ri,gf,tag] of sorted(ROWB)) house(x0,x1,-55,-48,{pl,fl,ridge:ri,gf,door:[Math.floor((x0+x1)/2),-48],box0:tag==='cafe',gs:tag==='cafe'?B.white:0});
  // the gate tower over the stairs from the landing: path 13 -> street 19
  tower(4,8,-43,-37,12,T+8,{roof:HB.roofH,wy:[T+3,T+6],lit:1});
  for(let z=-43;z<=-37;z++){ const sh=Math.min(T,14+(-37-z)); for(let x=5;x<=7;x++){ for(let y=10;y<sh-1;y++) set(x,y,z,B.stone); set(x,sh-1,z,B.cobble); for(let y=sh;y<=sh+3;y++) set(x,y,z,0); } }
  for(let x=5;x<=7;x++){ set(x,T-1,-44,B.cobble); for(let y=T;y<=T+3;y++) set(x,y,-43,0); }
  tower(-17,-13,-43,-37,10,T+10,{wy:[T+4,T+7]});                                       // a wall tower with battlements
  tower(31,36,-43,-37,10,T+12,{roof:HB.roofH,wy:[T+3,T+6,T+9],lit:1});                 // the corner tower at the east end
  // ---- Burg Hirschhorn ----
  for(let x=CS.x0;x<=CS.x1;x++) for(let z=CS.z0;z<=CS.z1;z++){
    const ring=x<=CS.x0+1||x>=CS.x1-1||z<=CS.z0+1||z>=CS.z1-1; if(!ring) continue;
    if(z>=CS.z1-1&&x>=-15&&x<=1) continue;   // the terrace: open, with a railing over the drop (solid() below)
    const yt=CY+5; for(let y=CY;y<=yt;y++) set(x,y,z,HB.rubble);   // v1.35.1: this loop had slipped into the comment above (floating merlons, Flax 12:35)
    if((x===CS.x0||x===CS.x1||z===CS.z0||z===CS.z1)&&(x+z)%2===0) set(x,CY+6,z,HB.rubble); }
  tower(-27,-23,-79,-73,CY-8,CY+9,{roof:HB.roofH,wy:[CY+6]});                         // the gatehouse, the Burgweg comes in from the west
  for(let x=-27;x<=-23;x++) for(let z=-77;z<=-75;z++){ for(let y=CY;y<=CY+3;y++) set(x,y,z,0); set(x,CY-1,z,B.cobble); }
  tower(-21,-16,-88,-83,CY,CY+22,{wy:[CY+9,CY+15,CY+19]});                            // the Bergfried
  house(2,10,-86,-66,{y0:CY,fl:3,solid:B.white,ridge:'z',st:2,door:[2,-76],xw:1});    // the Palas
  house(-12,-1,-88,-84,{y0:CY,fl:2,pl:'C',ridge:'x',st:2,gf:0,door:[-6,-84]});        // an older wing along the north wall
  // ---- Ersheim: the old chapel in its graveyard on the meadow across the river ----
  const CHY=13;
  for(let x=-15;x<=16;x++) for(let z=-1;z<=18;z++) if((x===-15||x===16||z===-1||z===18)&&!(z===-1&&x>=-1&&x<=1)) set(x,CHY,z,B.sandstone);
  for(let x=-6;x<=7;x++) for(let z=5;z<=11;z++) for(let y=CHY;y<=CHY+6;y++){ const ex=x===-6||x===7, ez=z===5||z===11;
    if(!ex&&!ez){ set(x,y,z,B.stone); continue; }
    const tall=ez&&!ex&&[-3,1,4].includes(x)&&y>=CHY+2&&y<=CHY+4; set(x,y,z, ex&&ez?B.sandstone:tall?(hsh(x,y,z)<.5?B.windowLit:B.window):B.white); }
  set(-1,CHY,5,B.door); set(-1,CHY+1,5,B.door);
  for(let L=0;;L++){ const za=4+Math.floor(L/2), zb=12-Math.floor(L/2); if(za>zb) break;
    for(let z=za;z<=zb;z++) for(let x=-6;x<=7;x++) set(x,CHY+7+L,z, z===za||z===zb?B.slate:(x===-6||x===7)?B.white:B.stone); }
  for(let x=8;x<=11;x++) for(let z=6;z<=10;z++) for(let y=CHY;y<=CHY+4;y++) set(x,y,z,(x===11||z===6||z===10)?(y===CHY+2&&z===8?B.window:B.white):B.stone);
  for(let L=0;;L++){ const za=5+Math.floor(L/2), zb=11-Math.floor(L/2); if(za>zb) break; for(let z=za;z<=zb;z++) for(let x=8;x<=12;x++) set(x,CHY+5+L,z,z===za||z===zb||x===12?B.slate:B.stone); }
  tower(-10,-7,6,9,CHY,CHY+11,{wall:B.white,roof:B.slate,st:3,wy:[CHY+9]});          // the little tower with its spire
  // ---- the landing: a wooden jetty in front of the gate ----
  for(let x=2;x<=10;x++) for(let z=-32;z<=-29;z++) set(x,11,z,B.plank);
  // ---- trees: lindens in the castle yard and the graveyard, fruit trees on the Ersheim meadow ----
  tree(-12,-70,CY,4,1); tree(-12,15,CHY,4,1); tree(13,2,CHY,4,1); tree(13,15,CHY,3,0);
  { let n=0; for(let t=0;t<400&&n<14;t++){ const x=Math.floor(-40+R()*84), z=Math.floor(-4+R()*28), k=I(x,z);
      if(km[k]!==K.meadow||hm[k]>13||rD(x+.5,z+.5)<HW+5||(x>=-17&&x<=18&&z>=-3&&z<=20)) continue; tree(x,z,hm[k],2+(R()*2|0),0); n++; } }
  for(const [x,z] of [[-39,-34.5],[37,-34.5]]) tree(Math.floor(x),Math.floor(z),13,3,0);

  // ---- props (one mesh): window boxes full of geraniums, the café terrace, the well, benches, the angler's spot, gravestones ----
  const L=[], LH=[], LAMPS=[], POOL=[];
  const P=(w,h,d,x,y,z,c,ry,rx)=>L.push([w,h,d,x,y,z,c,ry||0,0,rx||0]);
  const FLW=['#d8323c','#e04450','#f06a8a','#ffffff','#c03050','#e86a2a','#d8323c','#f4c03a'];
  for(const [x,y,z,nx,nz] of BOX){ const cx=x+.5+nx*.63, cz=z+.5+nz*.63, along=nz!==0, bc=hsh(x,y,z)<.5?'#6a4428':'#b8583a';
    P(along?.86:.26,.22,along?.26:.86,cx,y+.11,cz,bc); P(along?.8:.2,.12,along?.2:.8,cx,y+.27,cz,'#3f7a34');
    for(let i=0;i<4;i++){ const o=-.3+i*.2; P(.16,.16,.16,cx+(along?o:0),y+.36+(i%2)*.05,cz+(along?0:o),FLW[(hsh(x+i,y,z)*FLW.length)|0]); } }
  function postLamp(x,z,y){ P(.14,2.8,.14,x,y+1.4,z,'#24282c'); P(.32,.12,.32,x,y+.06,z,'#24282c'); P(.48,.08,.48,x,y+3.24,z,'#24282c'); P(.12,.16,.12,x,y+3.36,z,'#24282c');
    LH.push([.34,.42,.34,x,y+3.0,z,'#ffe2a8']); LAMPS.push(x,y+3.0,z); POOL.push([x,z,y]); }
  function wallLamp(x,z,y,nz){ P(.06,.06,.5,x,y+2.95,z+nz*.25,'#24282c'); P(.38,.07,.38,x,y+2.92,z+nz*.55,'#24282c');
    LH.push([.28,.36,.28,x,y+2.7,z+nz*.55,'#ffe2a8']); LAMPS.push(x,y+2.7,z+nz*.55); POOL.push([x,z+nz*1.3,y]); }
  for(const x of [-30.5,-20.5,-9.5,11.5,22.5]) wallLamp(x,-43,T,-1);
  for(const x of [-25.5,-12.5,0.5,13.5,25.5]) wallLamp(x,-47,T,1);
  for(const x of [-30.5,-16.5,-2.5,12.5,27.5]) postLamp(x,-32.6,13);
  postLamp(-14.5,-61.8,CY); postLamp(0.5,-61.8,CY); postLamp(-21.5,-73.5,CY); postLamp(0.5,-2.2,13); postLamp(-46.5,-50.5,21); postLamp(-49,-68.5,31);
  // the café: an awning and the terrace with parasols and guests
  for(let i=0;i<7;i++) P(.98,.1,1.4,-8.5+i,T+2.5,-46.35,i%2?'#f4ead6':'#b8403a',0,-.32);
  const table=(x,z,y,pc)=>{ P(.8,.06,.8,x,y+.74,z,'#e8e0d0'); P(.08,.72,.08,x,y+.36,z,'#3a3a3a'); P(.5,.04,.5,x,y+.02,z,'#3a3a3a');
    for(const [dx,dz] of [[-.75,0],[.75,0],[0,-.75],[0,.75]]){ P(.42,.05,.42,x+dx,y+.45,z+dz,'#6a4a2e'); P(.06,.45,.06,x+dx,y+.22,z+dz,'#3a3a3a'); }
    if(pc){ P(.06,2.3,.06,x,y+1.15,z,'#d8d0c0'); P(2,.1,2,x,y+2.3,z,pc); P(1.4,.12,1.4,x,y+2.4,z,pc); P(.2,.12,.2,x,y+2.5,z,'#d8d0c0'); } };
  const placeP=(parts,x,y,z,ry)=>{ const c=Math.cos(ry), s=Math.sin(ry); for(const p of parts) L.push([p[0],p[1],p[2],x+p[3]*c+p[5]*s,y+p[4],z-p[3]*s+p[5]*c,p[6],(p[7]||0)+ry,0,p[9]||0]); };
  const sitter=(o,x,z,y,ry)=>placeP(person(Object.assign({sit:.45,swing:{legs:0,armL:0,armR:0}},o)),x,y,z,ry);
  table(-4,-40.5,T,'#b8403a'); table(-.5,-40.5,T,'#f4ead6'); table(2.2,-41.6,T,'#b8403a');
  sitter({shirt:'#4a6a9a',pants:'#3a3a44',hair:'#5a3a22'},-4.75,-40.5,T,Math.PI/2); sitter({shirt:'#c86a8a',pants:'#3a3040',hair:'#d8b070'},-3.25,-40.5,T,-Math.PI/2);
  sitter({shirt:'#e8d8b0',pants:'#4a4a3a',hair:'#e0dcd4',skin:'#e8b892'},-.5,-41.25,T,0);
  P(.3,.06,.3,-4.2,T+.8,-40.4,'#f4f1ea'); P(.12,.12,.12,-4.2,T+.88,-40.4,'#6a3a1a'); P(.3,.06,.3,-3.8,T+.8,-40.6,'#f4f1ea'); P(.22,.1,.18,-3.8,T+.85,-40.6,'#e8c070');
  // a ginger cat on the terrace wall, watching the ducks
  P(.26,.26,.42,1.5,T+1.13,-36.6,'#d8862a'); P(.24,.22,.22,1.5,T+1.36,-36.38,'#d8862a'); P(.06,.08,.04,1.42,T+1.5,-36.36,'#d8862a'); P(.06,.08,.04,1.58,T+1.5,-36.36,'#d8862a');
  P(.06,.06,.36,1.5,T+1.05,-36.95,'#c8761a',0,.5); P(.04,.04,.02,1.45,T+1.38,-36.27,'#2a3a1a'); P(.04,.04,.02,1.55,T+1.38,-36.27,'#2a3a1a');
  // benches along the Uferweg, the angler's bucket and stool belong to him
  const bench=(x,z,y,ry)=>{ const c=Math.cos(ry), s=Math.sin(ry), q=(dx,dz)=>[x+dx*c+dz*s,z-dx*s+dz*c];
    let [a,b]=q(0,0); P(1.6,.08,.42,a,y+.45,b,'#7a5434',ry); [a,b]=q(0,-.2); P(1.6,.36,.06,a,y+.7,b,'#7a5434',ry);
    for(const dx of [-.65,.65]){ [a,b]=q(dx,0); P(.08,.45,.4,a,y+.22,b,'#2e3236',ry); } };
  bench(-8.5,-34.9,13,Math.PI); bench(20.5,-34.9,13,Math.PI); bench(-10,-63.5,CY,Math.PI); bench(-2,15.4,CHY,0); bench(9.5,-1.6+0.3,13,Math.PI);
  // the castle: the well and the terrace tables
  P(1.8,.8,1.8,-6,CY+.4,-75,'#8a7a6a'); P(1.3,.06,1.3,-6,CY+.79,-75,'#2a4a5a'); for(const dx of [-.8,.8]) P(.12,1.6,.12,-6+dx,CY+1.6,-75,'#5a3a22'); P(2.1,.1,1.2,-6,CY+2.45,-75,'#7e3324'); P(.08,.08,1.6,-6,CY+2.1,-75,'#5a3a22',Math.PI/2);
  table(-6,-63.4,CY,'#f4ead6'); table(-2.5,-63.6,CY,0);
  sitter({shirt:'#3a6a5a',pants:'#3a3a40',hair:'#2a2420'},-6.75,-63.4,CY,Math.PI/2); sitter({shirt:'#e8a83a',pants:'#4a3a32',hair:'#a85a2a'},-5.25,-63.4,CY,-Math.PI/2);
  for(let x=-15;x<=2;x+=1) P(.07,1.04,.07,x,CY+.52,-58.94,'#2e3236');
  P(17.1,.07,.09,-6.5,CY+1.04,-58.94,'#2e3236'); P(17.1,.04,.05,-6.5,CY+.5,-58.94,'#2e3236');
  // gravestones round the chapel
  for(const [x,z] of [[-12,1.5],[-9.5,1.5],[-12,3.6],[-9.5,3.6],[-12,12.5],[-9.5,13.5],[-6.5,14.2],[-3.5,14.2],[-.5,14.2],[2.5,14.2],[5.5,14.2],[13.5,7],[13.5,9.5],[9.5,13],[12,11.8],[4,1.5],[7,1.5],[10,2.6]]){
    const tall=hsh(x,1,z)<.4, c=hsh(x,2,z)<.5?'#8a8478':'#a8674f'; P(.6,tall?.9:.65,.14,x,CHY+(tall?.45:.33),z,c); if(tall) P(.14,.5,.12,x,CHY+1.1,z,c); P(.5,.06,.5,x,CHY+.03,z+.42,'#4f7a3a'); P(.12,.12,.12,x-.1,CHY+.1,z+.4,FLW[(hsh(z,x,3)*5)|0]); }
  // jetty bollards and a timetable post, a rowing boat pulled up on the Ersheim bank
  for(const x of [2.5,6.5,10.5]) P(.3,.5,.3,x,12.25,-28.4,'#2e3236');
  P(.12,1.6,.12,10.5,13.8,-35.2,'#2e3236');
  P(3,.5,1.1,-26,12.25,-6.2,'#5a7a9a',.25); P(2.6,.1,.8,-26,12.52,-6.2,'#7a5434',.25);

  // a few flowers on the meadow
  for(let t=0,n=0;t<600&&n<70;t++){ const x=-40+R()*84, z=-4+R()*30, k=I(Math.floor(x),Math.floor(z)); if(km[k]!==K.meadow||hm[k]!==13) continue; P(.14,.14,.14,x,13.07,z,FLW[(R()*FLW.length)|0]); n++; }
  const group=new THREE.Group();
  const pm=new THREE.Mesh(blockyGeo(L),new THREE.MeshLambertMaterial({vertexColors:true})); pm.matrixAutoUpdate=false; group.add(pm);
  const headMat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});
  const heads=new THREE.Mesh(blockyGeo(LH),headMat); heads.matrixAutoUpdate=false; group.add(heads);
  const lg=new THREE.BufferGeometry(); lg.setAttribute('position',new THREE.Float32BufferAttribute(LAMPS,3));
  const lamps=new THREE.Points(lg,new THREE.PointsMaterial({color:0xffcf7a,size:1.4,map:H.roundDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  lamps.visible=false; group.add(lamps);
  const pc=document.createElement('canvas'); pc.width=pc.height=64; { const x=pc.getContext('2d'), gr=x.createRadialGradient(32,32,0,32,32,32);
    gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.45,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=gr; x.fillRect(0,0,64,64); }
  const pools=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pc),color:0xffb860,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending,fog:true}),POOL.length);
  { const o=new THREE.Object3D(); POOL.forEach(([x,z,y],i)=>{ o.position.set(x,y+.035,z); o.scale.setScalar(6); o.updateMatrix(); pools.setMatrixAt(i,o.matrix); }); }
  pools.instanceMatrix.needsUpdate=true; pools.frustumCulled=false; pools.visible=false; pools.renderOrder=1; group.add(pools);
  // three ducks paddling in a slow circle off the landing
  const DK=[]; for(let i=0;i<3;i++){ const a=i*2.1, x=Math.sin(a)*2.4, z=Math.cos(a)*2.4, ry=a+Math.PI/2, c=Math.cos(ry), s=Math.sin(ry), m=i===0;
    for(const p of [[.3,.18,.46, 0,.06,0,m?'#8a8a7a':'#8a6a44'],[.18,.18,.2, 0,.24,.22,m?'#2a6a3a':'#7a5a3a'],[.1,.05,.12, 0,.21,.36,'#e8b830'],[.12,.1,.12, 0,.12,-.24,m?'#f4f1ea':'#6a4a2a']])
      DK.push([p[0],p[1],p[2],x+p[3]*c+p[5]*s,p[4],z-p[3]*s+p[5]*c,p[6],ry]); }
  const ducks=new THREE.Mesh(blockyGeo(DK),new THREE.MeshLambertMaterial({vertexColors:true})); ducks.position.set(18,W-.1,-21); group.add(ducks);
  const SW=[]; for(let i=0;i<2;i++){ const a=i*Math.PI, x=Math.sin(a)*3.2, z=Math.cos(a)*3.2, ry=a+Math.PI/2, c=Math.cos(ry), s=Math.sin(ry);
    for(const p of [[.5,.3,.8, 0,.1,0,'#f4f4ee'],[.36,.22,.5, 0,.3,-.18,'#ffffff'],[.12,.62,.12, 0,.55,.32,'#f4f4ee'],[.16,.14,.24, 0,.88,.4,'#f4f4ee'],[.08,.07,.16, 0,.85,.58,'#e07a2a'],[.06,.06,.04, 0,.9,.52,'#1a1a1a']])
      SW.push([p[0],p[1],p[2],x+p[3]*c+p[5]*s,p[4],z-p[3]*s+p[5]*c,p[6],ry]); }
  const swans=new THREE.Mesh(blockyGeo(SW),new THREE.MeshLambertMaterial({vertexColors:true})); swans.position.set(-32,W-.12,-15); group.add(swans);

  // boards (canvas, a little self-lit so they read at night)
  function board(w,h,cw,ch,paint,x,y,z,ry,two){ const c=document.createElement('canvas'); c.width=cw; c.height=ch; paint(c.getContext('2d'),cw,ch);
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.3,side:two?THREE.DoubleSide:THREE.FrontSide}));
    m.position.set(x,y,z); m.rotation.y=ry||0; m.matrixAutoUpdate=false; m.updateMatrix(); group.add(m); return m; }
  const FONT='"Pixelify Sans", ui-monospace, monospace';
  const NB=[];
  const sign=(t1,t2,bg,fg)=>(g,w,h)=>{ g.fillStyle=bg; g.fillRect(0,0,w,h); g.strokeStyle=fg; g.lineWidth=5; g.strokeRect(6,6,w-12,h-12); g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle';
    g.font='700 '+Math.round(h*(t2?.4:.5))+'px '+FONT; g.fillText(t1,w/2,t2?h*.4:h/2+2); if(t2){ g.font='400 '+Math.round(h*.2)+'px '+FONT; g.fillText(t2,w/2,h*.76); } };
  NB.push(board(5.4,1.2,450,100,sign('HIRSCHHORN','Anlegestelle · Neckar','#1f3f7a','#f4f1ea'),11.5,15.7,-35.97,0));
  NB.push(board(3.2,.9,320,90,sign('CAFÉ','Kaffee · Kuchen','#f1e7cf','#5a2a1c'),-5.5,T+3.35,-46.96,0));
  NB.push(board(4,1,400,100,sign('Burg Hirschhorn',0,'#f1e7cf','#5a2a1c'),-27.04,CY+5,-76,-Math.PI/2));
  NB.push(board(3.2,.8,384,96,sign('Ersheimer Kapelle',0,'#f1e7cf','#3a3a3a'),0,CHY+1.2,-1.45,Math.PI,true));
  P(.1,1.2,.1,-1.7,CHY+.6,-1.45,'#4a3a2a'); P(.1,1.2,.1,1.7,CHY+.6,-1.45,'#4a3a2a');
  NB.push(board(2.4,.7,288,84,sign('Burgweg ↑',0,'#f1e7cf','#3a5a2a'),-36.2,T+2.1,-47.6,Math.PI/2));
  P(.1,2,.1,-36.3,T+1,-47.6,'#4a3a2a');

  // far hills beyond the edges of the map, the same valley carried on (the river legs too)
  { const S=8, R0=360, n=Math.round(2*R0/S)+1, pos=[], col=[], idx=[], c=new THREE.Color();
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){ const x=-R0+i*S, z=-R0+16+j*S, d=rD(x,z), out=Math.max(0,Math.max(-128-x,x-128,-112-z,z-144)),
        h=hgtF(x,z,d)+(d>HW+8?Math.max(0,out-24)*.12:0), v=nz(x*.7,z*.7);
      pos.push(x,h,z); if(h<11) c.set('#b8a27a'); else c.set(v>.6?'#8a6a2a':v<-.7?'#7a4a26':v>0?'#4f6a30':'#3f5a2c'); col.push(c.r,c.g,c.b); }
    for(let i=0;i<n-1;i++) for(let j=0;j<n-1;j++){ const x=-R0+i*S, z=-R0+16+j*S; if(x>=-128&&x+S<=128&&z>=-112&&z+S<=144) continue;
      const a=i*n+j, b=a+n; idx.push(a,a+1,b,b,a+1,b+1); }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); geo.setIndex(idx); geo.computeVertexNormals();
    const sk=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true})); sk.matrixAutoUpdate=false; group.add(sk); }

  // ---- the people of Hirschhorn ----
  const still={legs:0,armL:0,armR:0};
  const folk=[
    { id:'hh_seiler', name:'Frau Seiler, Anlegestelle', short:'Frau Seiler', at:[11.6,-34.4,0,13], head:2.2,
      look:person({ shirt:'#22304f', pants:'#3a3a44', hair:'#b8643a', skin:'#f0c8a4', swing:still, extra:[[.42,.1,.42, 0,1.9,0,'#22304f'],[.42,.04,.16, 0,1.86,.24,'#141414'],[.26,.34,.03, .3,1.0,.2,'#c8b088']] }),
      barks:['Boats! Well. One boat. Liselotte.','Mind the step, the jetty wobbles.','*counts the ducks* Three. Still three.','Castle weather today.'],
      talk(){ return ['Willkommen in Hirschhorn! Did Jupp bring you? He always takes the bends a little wide.','They call us the pearl of the Neckar valley. Well. We call us that.',
        'The castle is right above us. The Burgweg starts at the west end of the old town, past the café.','Across the water is Ersheim, with the old chapel. Swimmers climb out on the low bank, everyone else admires it from the terrace.']; } },
    { id:'hh_anni', name:'Anni, Café', short:'Anni', at:[-5.5,-46.2,0,T], head:2.2,
      look:person({ shirt:'#7a3a4a', pants:'#3a3040', hair:'#6a3a1a', skin:'#eec3a0', swing:still, extra:[[.46,.62,.06, 0,.78,.16,'#f4efe2'],[.2,.2,.2, 0,1.95,-.14,'#6a3a1a']] }),
      barks:['Kaffee, Kuchen, Aussicht!','Two Apfelkuchen for the terrace!','*wipes a table*','The cat is not on the menu. She just thinks she runs the place.'],
      talk(){ return ['Hallo! Café on the corner, terrace over the river. Best seats in Hirschhorn.','The Apfelkuchen is still warm. Sit outside, you can see all the way to the chapel.','The castle? Lovely view. Lovely stairs. Have a slice first.']; } },
    { id:'hh_vogt', name:'Herr Vogt, Angler', short:'Herr Vogt', at:[-24.5,-33.4,0,13], head:1.8, fixed:1,
      look:person({ shirt:'#4a5a3a', pants:'#3a3a32', hair:'#c8c0b0', skin:'#e3b392', sit:.4, swing:still, extra:[
        [.46,.1,.46, 0,1.6,0,'#5a6a3a'],[.36,.06,.36, 0,1.67,0,'#5a6a3a'],[.36,.4,.36, 0,.2,-.02,'#3a3a3a'],[.04,.04,3.2, .25,1.4,1.6,'#3a2a1a',0,0,-.45],
        [.015,4.1,.015, .25,.1,3.03,'#d8d8d8'],[.1,.12,.1, .25,-1.95,3.03,'#d8323c'],[.3,.3,.3, -.55,.15,.3,'#6a7a8a']] }),
      barks:['Shh.','*the line twitches. Nothing.*','Today is the day. Probably.','Was that a bite? No. Wind.'],
      talk(){ return ['Shh. The fish are thinking.','Thirty years I\'ve fished this bend. The fish know me by now. That\'s the problem.','Best spot on the Neckar: the castle above, the chapel across, and nobody in a hurry.','Catch nothing and you\'ve still had a nice afternoon. That\'s fishing.']; } },
    { id:'hh_keller', name:'Frau Keller, Ersheim', short:'Frau Keller', at:[-3.2,3,Math.PI,CHY], head:2.1,
      look:person({ shirt:'#5a4a6a', pants:'#3a3440', hair:'#e8e4dc', skin:'#f0caa8', swing:still, extra:[[.05,1.3,.05, .42,.75,.18,'#8a6a40'],[.32,.22,.12, .42,.1,.22,'#c8a860'],[.3,.2,.3, 0,1.98,-.06,'#e8e4dc']] }),
      barks:['*sweeps*','Leaves, leaves, leaves.','Such a quiet bend of the river.','Mind the gravestones, dear.'],
      talk(){ return ['Grüß Gott! You swam over? Brave. Welcome to Ersheim.','This little chapel has watched the river longer than anyone can remember.','From the castle you can see it: Ersheim sits right in the Neckar\'s arm.','I sweep the path every morning. The leaves sweep it back every afternoon.']; } },
    { id:'hh_albrecht', name:'Herr Albrecht, Burgwirt', short:'Herr Albrecht', at:[-8,-64.6,0,CY], head:2.2,
      look:person({ shirt:'#f4f1ea', pants:'#2a2a30', hair:'#4a3a2a', skin:'#e8b892', swing:still, extra:[[.54,.5,.32, 0,1.18,0,'#3a2a22'],[.46,.5,.06, 0,.72,.16,'#f4efe2']] }),
      barks:['Kaffee on the terrace!','Look at that bend in the river.','*polishes a glass*','Best view on the Neckar. I would say that, I sell the coffee.'],
      talk(){ return ['Willkommen auf der Burg! Best view on the whole Neckar, and I\'m not just saying that because I sell the coffee.','Look down: the old town, the wall along the water, and the river bending round Ersheim. Like a drawing.','The tall tower is the Bergfried. Hundreds of years old and still standing up straight. I wish I could say the same.']; } },
    { id:'hh_ruth', name:'Ruth, Ausflüglerin', short:'Ruth', at:[-20,-44.9,Math.PI/2,T], speed:1.05, route:[[-33,-44.9,3],[-4,-44.9,4],[30,-44.9,3]],
      look:person({ shirt:'#b8443a', pants:'#3a3a48', hair:'#d8d0c8', skin:'#f0c8a4', extra:[[.56,.14,.34, 0,1.42,0,'#e8c23a']] }),
      barks:['Up to the castle after the coffee?','Look, the chapel over the river!','Such a pretty little town.'],
      talk(){ return ['We come every October. The leaves, the river, the cake.','Klaus says we go up to the castle. Klaus said that last year too.']; } },
    { id:'hh_klaus', name:'Klaus, Ausflügler', short:'Klaus', at:[-20,-45.9,Math.PI/2,T], speed:1.05, route:[[-33,-45.9,3],[-4,-45.9,4],[30,-45.9,3]],
      look:person({ shirt:'#5a6a4a', pants:'#4a4038', hair:'#9a9a9a', skin:'#e3b392', extra:[[.42,.1,.44, 0,1.9,.04,'#5a4a3a'],[.42,.03,.14, 0,1.86,.26,'#4a3a2a']] }),
      barks:['After the coffee. Definitely after.','I could live here.','Shall we take the boat back?'],
      talk(){ return ['The castle? Yes. After the coffee. And the cake.','Did you come with the old boat? Liselotte? Lovely. Loud, but lovely.']; } },
    { id:'hh_lenz', name:'Herr Lenz and Bello', short:'Herr Lenz', at:[-30,-34.6,Math.PI/2,13], speed:.95, route:[[-36,-34.6,3],[36,-34.6,3]],
      look:person({ shirt:'#4a5a6a', pants:'#2a2a30', hair:'#c8c0b0', skin:'#e8b892', extra:[
        [.24,.22,.55, .78,.38,.1,'#c8a070'],[.22,.22,.24, .78,.56,.44,'#c8a070'],[.12,.1,.12, .78,.5,.6,'#e8d0b0'],[.05,.05,.03, .78,.53,.67,'#1a1a1a'],
        [.06,.12,.06, .7,.7,.4,'#8a6a40'],[.06,.12,.06, .86,.7,.4,'#8a6a40'],[.05,.05,.26, .78,.52,-.26,'#c8a070',0,0,-.6],
        [.07,.28,.07, .7,.14,.3,'#b89060',0,[1.2,.28,.3,0]],[.07,.28,.07, .86,.14,.3,'#b89060',0,[-1.2,.28,.3,0]],
        [.07,.28,.07, .7,.14,-.1,'#b89060',0,[-1.2,.28,-.1,0]],[.07,.28,.07, .86,.14,-.1,'#b89060',0,[1.2,.28,-.1,0]],
        [.025,.025,.62, .56,.66,.2,'#7a2a2a',.82,0,.32]] }),
      barks:['Bello! Not the ducks!','*Bello sniffs everything*','Good boy. Mostly.'],
      talk(){ return ['This is Bello. Bello loves everyone. Except the ducks. The ducks he wants to discuss things with.','Twice a day along the wall, rain or sun. He doesn\'t care, I don\'t care.']; } },
    { id:'hh_mia', name:'Mia', short:'Mia', at:[-30,-44.6,Math.PI/2,T], speed:2.6, jog:1, loop:1, scale:.72, head:2.0, route:[[-30,-44.6],[28,-44.6],[28,-46.4],[-30,-46.4]],
      look:person({ shirt:'#e8c23a', pants:'#3a5a8a', hair:'#6a3a1a', skin:'#f0caa8', extra:[[.12,.22,.12, -.24,1.72,-.06,'#6a3a1a'],[.12,.22,.12, .24,1.72,-.06,'#6a3a1a']] }),
      barks:['Race you to the tower!','I saw a fish! A BIG one!','*runs past*'],
      talk(){ return ['Hi! I\'m doing laps. Ten laps and Anni gives me a Brezel.','That\'s a lie, but maybe she will.']; } },
    { id:'hh_hiker', name:'Wanderer', short:'Wanderer', at:[-38,-45.8,-Math.PI/2,T], speed:.9, route:[[-38,-45.8,3],...BW.slice(1).map(p=>[p[0],p[1]]),[-24,-76,5]],
      look:person({ shirt:'#c8462a', pants:'#5a5040', hair:'#3a2a1a', skin:'#e3b392', extra:[[.4,.5,.22, 0,1.15,-.27,'#3a5a3a'],[.44,.1,.44, 0,1.9,0,'#7a6a3a'],[.04,1.25,.04, .4,.68,.16,'#6a4a2a']] }),
      barks:['Puh. Steep, steep, steep.','The view is worth it. Allegedly.','Almost at the top!'],
      talk(){ return ['Up to the castle and down again, twice. Training for the Odenwald.','The trick is: never look at how far it still is. Look at the river.']; } },
    { id:'hh_ines', name:'Ines, at the railing', short:'Ines', at:[-11.2,-59.55,0,CY], fixed:1,
      look:person({ shirt:'#2f6a7a', pants:'#3a3a48', hair:'#2a1a12', skin:'#c8956a', swing:still, armUp:'R', extra:[[.5,.12,.06, 0,1.62,.2,'#2a2a2a'],[.14,.1,.04, .2,1.95,.3,'#1a1a1a']] }),
      barks:['Ole, look, the chapel!','Wait, one more photo.','You can see the whole bend from here.'],
      talk(){ return ['Isn\'t it unreal? The river goes all the way round that meadow and comes back.','Ole wants to go down for cake. I want one more photo. And then one more.']; } },
    { id:'hh_ole', name:'Ole, at the railing', short:'Ole', at:[-12.1,-59.55,0,CY], fixed:1,
      look:person({ shirt:'#c8a040', pants:'#4a4a3a', hair:'#c8a070', skin:'#efc6a2', swing:still }),
      barks:['Cake?','*leans on the railing*','We could live here. In the castle. Obviously.'],
      talk(){ return ['We came up the Burgweg. My legs are still down there somewhere.','Anni\'s café is right at the bottom. Just saying.']; } },
    { id:'hh_ida', name:'Ida, Ersheim bank', short:'Ida', at:[-21,-6.6,Math.PI,12], scale:.72, head:2.0,
      look:person({ shirt:'#e05a3a', pants:'#3a4a7a', hair:'#d8a050', skin:'#f2cba8', swing:still, armUp:'R', extra:[[.12,.22,.12, -.24,1.72,-.06,'#d8a050']] }),
      barks:['Four hops! FOUR!','*plop*','Theo, that was a sinker.'],
      talk(){ return ['We\'re skipping stones. My record is four hops. Theo\'s record is one plop.','Flat stones only. The round ones go straight to the fish.']; } },
    { id:'hh_theo', name:'Theo, Ersheim bank', short:'Theo', at:[-19.4,-6.4,Math.PI-.3,12], scale:.66, head:2.0,
      look:person({ shirt:'#3a8a5a', pants:'#4a3a2a', hair:'#5a3a22', skin:'#e8b892', swing:still }),
      barks:['That counted!','*searches for a flat stone*','The ducks are cheering for me.'],
      talk(){ return ['It counted. It hopped once in my head.','Ida says the chapel is really, really old. Older than Oma!']; } },
  ];

  // ---- names ----
  function place(x,z,y,wet){
    if(!wet&&x>=1&&x<=12&&z>=-37&&z<=-28&&y<T-2) return 'Anlegestelle';
    if(wet||rD(x,z)<HW) return 'Neckar';
    if(x>=CS.x0-2&&x<=CS.x1+1&&z>=CS.z0-1&&z<=CS.z1+1&&y>CY-3){ if(x>=-22&&x<=-15&&z>=-89&&z<=-82) return 'Bergfried'; return z>=-67?'Burgterrasse':'Burg Hirschhorn'; }
    if(bwC.has(Math.floor(x)+','+Math.floor(z))) return 'Burgweg';
    if(inside(x,z)) return Math.hypot(x-1,z-8)<17&&y<CHY+4?'Ersheimer Kapelle':'Ersheim';
    if(x>=1&&x<=12&&z>=-37&&z<=-28&&y<T-2) return 'Anlegestelle';
    if(x>=TW.x0-3&&x<=TW.x1+3&&z>=-37&&z<=-32&&y<T-2) return 'Uferweg';
    if(x>=4&&x<=9&&z>=-44&&z<=-37) return 'Stadttor';
    if(x>=TW.x0&&x<=TW.x1+1&&z>=-57&&z<=-37){ if(x>=-6&&x<=4&&z>=-43) return 'Altstadt · Terrasse'; return 'Altstadt'; }
    return y>T+4?'Odenwald':'Neckarufer'; }
  function riverD(x,z){ return Math.max(0,rD(x,z)-HW); }
  let nightWas=null;
  // the castle, the chapel and the town wall floodlit at night (drawn in the block shader, see mhMat)
  const flood=[{a:[CS.x0-2,CS.z0-1,CS.x1+1,CS.z1+1],b:[CY-6,CY+26,0,1]},{a:[1,8,13,0],b:[CHY,CHY+20,0,0]},{a:[TW.x0,-38,TW.x1+1,-35.9],b:[12,T+1,0,1]}];
  function tick(dt,night){
    if(night!==nightWas){ nightWas=night; lamps.visible=pools.visible=night; headMat.emissive.set(night?0xffd27a:0x000000); headMat.emissiveIntensity=night?1.3:0;
      for(const b of NB) b.material.emissiveIntensity=night?.85:.3; }
    ducks.rotation.y+=dt*.09; ducks.position.y=W-.1+Math.sin(performance.now()/900)*.03; swans.rotation.y-=dt*.05; }

  const solid=(x,y,z)=>z===-59&&x>=-15&&x<=1&&y>=CY&&y<=CY+2;   // the terrace railing stops you, but you can see straight down past it
  return { group, place, riverD, tick, flood, folk, solid, steps:[{x:6.5,z:-33.5},{x:-1,z:-5}],
    spawn:{x:5.5,z:-30.5,y:12,yaw:.75}, jupp:{x:9,z:-29.6,y:12},
    hint:'Hirschhorn! The castle is right above the old town: the Burgweg starts at its west end. Kapitän Jupp takes you home when you like.',
    jb:['Moin! Liselotte waits right here.','Hirschhorn. Small town, big castle.','Heidelberg is downstream. Just say when.','Up the hill you see the whole bend of the Neckar. My knees say no.','Smell that? Kaffee from the terrace.'],
    arrive:[[-58,128],[-58,80],[-56,30],[-48,0],[-34,-16],[-16,-23.5],[0,-24.6],[6.5,-24.8]],
    trig:[[-58,100,'Hirschhorn ahead! Look up, over the trees on the right: the castle.'],
      [-50,6,'Round the bend... and there is the old town, with its wall along the water.'],
      [-14,-23.8,'Anlegen! Across the river, the little chapel: that\'s Ersheim. Liselotte waits here.']],
    home:[[6.5,-24.8],[-6,-23.2],[-26,-19.5],[-44,-4],[-54,18],[-58,60],[-58,128]],
    thome:[[-12,-22.4,'Leinen los! Downstream to Heidelberg.'],[-54,22,'Tschüss, Hirschhorn! Wave to the castle.']] };
}
