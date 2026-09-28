/* Moon Carousel: slides of the real Moon (astro.js does the sky, this file draws and runs the carousel) */
(function(){
'use strict';
var D2R=Math.PI/180,$=function(id){return document.getElementById(id);};
var PLACES=[
 ['Cities',[
  ['london','London',51.507,-0.128,'Europe/London'],['paris','Paris',48.857,2.352,'Europe/Paris'],
  ['berlin','Berlin',52.52,13.405,'Europe/Berlin'],['reykjavik','Reykjavík',64.147,-21.94,'Atlantic/Reykjavik'],
  ['moscow','Moscow',55.756,37.617,'Europe/Moscow'],['cairo','Cairo',30.044,31.236,'Africa/Cairo'],
  ['nairobi','Nairobi',-1.286,36.817,'Africa/Nairobi'],['capetown','Cape Town',-33.925,18.424,'Africa/Johannesburg'],
  ['dubai','Dubai',25.205,55.271,'Asia/Dubai'],['mumbai','Mumbai',19.076,72.878,'Asia/Kolkata'],
  ['singapore','Singapore',1.352,103.82,'Asia/Singapore'],['beijing','Beijing',39.904,116.407,'Asia/Shanghai'],
  ['tokyo','Tokyo',35.676,139.65,'Asia/Tokyo'],['sydney','Sydney',-33.869,151.209,'Australia/Sydney'],
  ['auckland','Auckland',-36.848,174.763,'Pacific/Auckland'],['honolulu','Honolulu',21.307,-157.858,'Pacific/Honolulu'],
  ['anchorage','Anchorage',61.218,-149.9,'America/Anchorage'],['la','Los Angeles',34.052,-118.244,'America/Los_Angeles'],
  ['chicago','Chicago',41.878,-87.63,'America/Chicago'],['newyork','New York',40.713,-74.006,'America/New_York'],
  ['mexico','Mexico City',19.433,-99.133,'America/Mexico_City'],['saopaulo','São Paulo',-23.55,-46.633,'America/Sao_Paulo'],
  ['buenosaires','Buenos Aires',-34.604,-58.382,'America/Argentina/Buenos_Aires']]],
 ['Odd corners',[
  ['quito','Quito, on the equator',-0.18,-78.467,'America/Guayaquil'],['tromso','Tromsø, Arctic Norway',69.649,18.956,'Europe/Oslo'],
  ['svalbard','Longyearbyen, Svalbard',78.223,15.647,'Arctic/Longyearbyen'],['mcmurdo','McMurdo Station, Antarctica',-77.846,166.676,'Antarctica/McMurdo'],
  ['ushuaia','Ushuaia, Tierra del Fuego',-54.801,-68.303,'America/Argentina/Ushuaia'],['maunakea','Mauna Kea summit',19.821,-155.468,'Pacific/Honolulu'],
  ['atacama','Atacama Desert',-23.029,-67.755,'America/Santiago']]]];
var BYID={};PLACES.forEach(function(g){g[1].forEach(function(p){BYID[p[0]]={id:p[0],name:p[1],lat:p[2],lon:p[3],tz:p[4]};});});
var UNITS={m:60000,h:3600000,d:86400000,w:604800000},UNIT_KEY={60000:'m',3600000:'h',86400000:'d',604800000:'w'};
var BROWSER_TZ='UTC';try{BROWSER_TZ=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';}catch(e){}

/* ---------- time zones ---------- */
var dtfCache={};
function dtf(tz){return dtfCache[tz]||(dtfCache[tz]=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'short'}));}
function parts(tz,ms){var p={};dtf(tz).formatToParts(new Date(ms)).forEach(function(x){p[x.type]=x.value;});
  return {y:+p.year,mo:+p.month,d:+p.day,h:+p.hour%24,mi:+p.minute,s:+p.second,wd:p.weekday};}
function offsetMin(tz,ms){var p=parts(tz,ms);return Math.round((Date.UTC(p.y,p.mo-1,p.d,p.h,p.mi,p.s)-Math.floor(ms/1000)*1000)/60000);}
function wallToUTC(tz,y,mo,d,h,mi){var g=Date.UTC(y,mo-1,d,h,mi),o=offsetMin(tz,g),t=g-o*60000,o2=offsetMin(tz,t);return o2===o?t:g-o2*60000;}
function validTz(tz){try{dtf(tz);return true;}catch(e){return false;}}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function pad(n){return (n<10?'0':'')+n;}
function hhmm(p){return pad(p.h)+':'+pad(p.mi);}
/* date and time formats: guessed from the browser, changeable in the tray, remembered per viewer */
var FMT={clock:'24',date:'dmy'};
(function(){try{var o=new Intl.DateTimeFormat(undefined,{hour:'numeric'}).resolvedOptions();FMT.clock=(o.hourCycle==='h12'||o.hourCycle==='h11'||o.hour12)?'12':'24';
  var ps=new Intl.DateTimeFormat(undefined,{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date(2026,8,28)).filter(function(x){return x.type!=='literal';}).map(function(x){return x.type[0];}).join('');
  FMT.date=ps==='mdy'?'mdy':ps==='ymd'?'iso':'dmy';}catch(e){}
  try{var sv=JSON.parse(localStorage.getItem('moonCarousel.fmt')||'null');if(sv){if(sv.clock==='12'||sv.clock==='24')FMT.clock=sv.clock;if(['dmy','mdy','iso'].indexOf(sv.date)>=0)FMT.date=sv.date;}}catch(e){}})();
function tm(p){if(FMT.clock==='24')return hhmm(p);return (p.h%12||12)+':'+pad(p.mi)+(p.h<12?' am':' pm');}
function dt(p,yr,wd){var s=FMT.date==='iso'?(yr?p.y+'-':'')+pad(p.mo)+'-'+pad(p.d):FMT.date==='mdy'?MON[p.mo-1]+' '+p.d+(yr?', '+p.y:''):p.d+' '+MON[p.mo-1]+(yr?' '+p.y:'');return (wd?p.wd+' ':'')+s;}
function stampOf(p){var y="'"+String(p.y).slice(2);return (FMT.date==='iso'?y+' '+p.mo+' '+pad(p.d):FMT.date==='mdy'?p.mo+' '+pad(p.d)+' '+y:pad(p.d)+' '+p.mo+' '+y)+'  '+tm(p);}
function dayKey(p){return p.y*400+p.mo*32+p.d;}

/* ---------- a procedural Moon map (albedo, selenographic lat/lon) ---------- */
var TW=720,TH=360,TEX=null;
function hash3(x,y,z){var h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h);}
function vnoise(x,y,z){var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,
  u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf),L=function(a,b,t){return a+(b-a)*t;};
  return L(L(L(hash3(xi,yi,zi),hash3(xi+1,yi,zi),u),L(hash3(xi,yi+1,zi),hash3(xi+1,yi+1,zi),u),v),
           L(L(hash3(xi,yi,zi+1),hash3(xi+1,yi,zi+1),u),L(hash3(xi,yi+1,zi+1),hash3(xi+1,yi+1,zi+1),u),v),w);}
function fbm(x,y,z,o){var s=0,a=.5,f=1,i;for(i=0;i<o;i++){s+=a*vnoise(x*f,y*f,z*f);f*=2.03;a*=.5;}return s/(1-Math.pow(.5,o));}
var MARIA=[ /* lat, lon (east +, the right side with north up), size in degrees; blobs melt together like metaballs */
 [10,-60,11],[22,-55,11],[32,-56,9],[0,-48,9],[-8,-45,8],[15,-45,9],[40,-48,7],[26,-66,8],[5,-68,7],[-2,-58,7],  // Oceanus Procellarum
 [33,-16,14],[38,-25,9],[28,-27,8],[42,-10,7],                                                        // Imbrium
 [56,-40,3.6],[57,-25,3.4],[58,-10,3.4],[57,5,3.4],[56,18,3.4],[55,30,3.4],                                       // Frigoris
 [28,17,9],[8.5,31,9.5],[4,24,6],[14,36,6],[17,59,6.5],                                               // Serenitatis, Tranquillitatis, Crisium
 [-8,51,7.5],[-2,48,5.5],[-15,52,5],[-15,35,5],[-21,-17,8.5],[-15,-11,5.5],[-24,-39,5.5],             // Fecunditatis, Nectaris, Nubium, Humorum
 [7,-31,6.5],[-10,-23,5.5],[13,4,4.5],[2,1,3],[20,6,3.5],[13,86,4],[1,87,5],[-19,-93,4],[-46,91,5],[-40,80,4]];
var BRIGHT=[ /* lat, lon, crater radius, ray length, ray strength: Tycho, Copernicus, Kepler, Aristarchus, Proclus */
 [-43.3,-11.2,1.5,38,.16],[9.6,-20.1,1.6,17,.13],[8.1,-38,.7,11,.10],[23.7,-47.4,.7,3,.08],[16.1,46.8,.5,9,.07]];
function vec(lat,lon){var c=Math.cos(lat*D2R);return [c*Math.sin(lon*D2R),Math.sin(lat*D2R),c*Math.cos(lon*D2R)];}
function angDist(a,b){var d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2];return Math.acos(Math.max(-1,Math.min(1,d)))/D2R;}
function bearing(la1,lo1,la2,lo2){var p1=la1*D2R,p2=la2*D2R,dl=(lo2-lo1)*D2R;return Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl));}
function smooth(e0,e1,x){var t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t);}
function makeTex(){
  var a=new Float32Array(TW*TH),i,j,k,lat,lon,p,m,n,base,c2,dens,seed=20260928;
  function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  var mv=MARIA.map(function(q){var r=q[2]*D2R;return {v:vec(q[0],q[1]),k:.8/(r*r)};});
  for(j=0;j<TH;j++){lat=90-(j+.5)/TH*180;
    for(i=0;i<TW;i++){lon=(i+.5)/TW*360-180;p=vec(lat,lon);
      n=fbm(p[0]*3+7,p[1]*3,p[2]*3,4);
      base=.80+.12*(fbm(p[0]*9,p[1]*9+3,p[2]*9,3)-.5)+.08*(n-.5)+.05*(vnoise(p[0]*40,p[1]*40,p[2]*40)-.5);
      for(dens=0,k=0;k<mv.length;k++){c2=(p[0]-mv[k].v[0])*(p[0]-mv[k].v[0])+(p[1]-mv[k].v[1])*(p[1]-mv[k].v[1])+(p[2]-mv[k].v[2])*(p[2]-mv[k].v[2]);
        if(c2<.5)dens+=Math.exp(-mv[k].k*c2);}
      m=smooth(.16,.72,dens*(1+.8*(n-.5)+.5*(fbm(p[0]*14+5,p[1]*14,p[2]*14,3)-.5)));
      a[j*TW+i]=base*(1-m)+(.46+.16*(fbm(p[0]*6+1,p[1]*6,p[2]*6+2,4)-.5))*m;}}
  /* craters: soft floors and faint rims, a few young bright ones */
  for(k=0;k<420;k++){var cl=Math.asin(2*rnd()-1)/D2R,co=rnd()*360-180,cr=Math.min(5,.3*Math.pow(rnd()+.02,-.6)),young=rnd()<.08;
    stamp(cl,co,cr*1.7,(function(cr,young){return function(dd,v){var t=dd/cr;
      return v*(1-(young?-.08:.05)*smooth(.85,.2,t)+(young?.14:.05)*Math.exp(-(t-1)*(t-1)/.03)+(young?.05*smooth(1.7,1,t):0));};})(cr,young));}
  BRIGHT.forEach(function(b){
    stamp(b[0],b[1],b[3],function(dd,v,la,lo){
      if(dd<b[2]*.8)return Math.min(1.1,v*.9+.18);if(dd<b[2]*1.25)return Math.min(1.15,v+.22);
      if(dd<b[2]*2.2)v*=.93; /* the dark collar round a young crater */
      var br=bearing(b[0],b[1],la,lo),ray=Math.pow(Math.max(0,Math.cos(br*7+Math.sin(br*3)*1.4)),3)*smooth(b[3],b[2]*2,dd)*vnoise(dd*.9,br*4,b[0])*1.6;
      return Math.min(1.15,v+b[4]*(ray*.8+.5*smooth(b[2]*4,b[2]*1.6,dd)));});});
  function stamp(clat,clon,rad,f){var cv=vec(clat,clon),j0=Math.max(0,Math.floor((90-clat-rad)/180*TH)),j1=Math.min(TH-1,Math.ceil((90-clat+rad)/180*TH)),jj,ii,la,lo,q,dd,span;
    for(jj=j0;jj<=j1;jj++){la=90-(jj+.5)/TH*180;span=Math.abs(la)>88-rad?181:rad/Math.max(.02,Math.cos(la*D2R))+1;
      for(ii=Math.floor((clon-span+180)/360*TW);ii<=Math.ceil((clon+span+180)/360*TW);ii++){
        var iw=((ii%TW)+TW)%TW;lo=(iw+.5)/TW*360-180;q=vec(la,lo);dd=angDist(q,cv);
        if(dd<rad)a[jj*TW+iw]=f(dd,a[jj*TW+iw],la,lo);}}}
  return a;}
function albedo(lat,lon){
  var x=(lon+180)/360*TW-.5,y=(90-lat)/180*TH-.5,x0=Math.floor(x),y0=Math.max(0,Math.min(TH-2,Math.floor(y))),fx=x-x0,fy=Math.max(0,Math.min(1,y-y0)),
      xa=((x0%TW)+TW)%TW,xb=(xa+1)%TW,r0=y0*TW,r1=r0+TW;
  return (TEX[r0+xa]*(1-fx)+TEX[r0+xb]*fx)*(1-fy)+(TEX[r1+xa]*(1-fx)+TEX[r1+xb]*fx)*fy;}

/* the disc: zenith up, lit side toward the Sun, turned by the parallactic angle, rocked by libration */
var moonBuf=document.createElement('canvas');
function drawMoon(ctx,cx,cy,R,r,o){
  if(!TEX)TEX=makeTex();
  var S=Math.ceil(R*2+4),c=moonBuf,g,img,px,x,y,u,v,d2,z,xn,yn,P0,P1,P2,la,lo,al,mu0,B,lit,es,aa,idx,dist;
  c.width=S;c.height=S;g=c.getContext('2d');img=g.createImageData(S,S);px=img.data;
  var a=(r.axis-r.q)*D2R,b=(r.chi-r.q)*D2R,ii=r.i*D2R,ca=Math.cos(a),sa=Math.sin(a),
      Sx=-Math.sin(ii)*Math.sin(b),Sy=Math.sin(ii)*Math.cos(b),Sz=Math.cos(ii),
      lL=r.libL*D2R,lB=r.libB*D2R,zv=[Math.cos(lB)*Math.sin(lL),Math.sin(lB),Math.cos(lB)*Math.cos(lL)],xv=[Math.cos(lL),0,-Math.sin(lL)],
      yv=[zv[1]*xv[2]-zv[2]*xv[1],zv[2]*xv[0]-zv[0]*xv[2],zv[0]*xv[1]-zv[1]*xv[0]],
      gain=o.gain,earth=o.earth*(1-r.k),half=S/2,tn=o.tint||[1,1,1],cr=255*tn[0],cg=249*tn[1],cb=236*tn[2];
  for(y=0;y<S;y++){v=-(y+.5-half)/R;
    for(x=0;x<S;x++){u=(x+.5-half)/R;d2=u*u+v*v;if(d2>=1+3/R)continue;
      dist=Math.sqrt(d2);aa=Math.max(0,Math.min(1,(1-dist)*R+.5));if(aa<=0)continue;
      z=Math.sqrt(Math.max(0,1-d2));
      xn=u*ca+v*sa;yn=-u*sa+v*ca;
      P0=xn*xv[0]+yn*yv[0]+z*zv[0];P1=xn*xv[1]+yn*yv[1]+z*zv[1];P2=xn*xv[2]+yn*yv[2]+z*zv[2];
      la=Math.asin(Math.max(-1,Math.min(1,P1)))/D2R;lo=Math.atan2(P0,P2)/D2R;al=albedo(la,lo);
      mu0=u*Sx+v*Sy+z*Sz;
      /* Lommel–Seeliger: a full Moon looks flat to the edge, the terminator fades in */
      B=mu0>0?Math.min(1.3,2*mu0/(mu0+z+.02)):0;lit=smooth(-.015,.035,mu0);
      es=earth*(1-lit);
      idx=(y*S+x)*4;
      px[idx]=Math.min(255,(al*B*lit*cr*gain+al*es*190));
      px[idx+1]=Math.min(255,(al*B*lit*cg*gain+al*es*215));
      px[idx+2]=Math.min(255,(al*B*lit*cb*gain+al*es*255));
      px[idx+3]=255*aa;}}
  g.putImageData(img,0,0);
  ctx.save();ctx.globalAlpha=o.alpha==null?1:o.alpha;ctx.globalCompositeOperation='lighter';ctx.drawImage(c,cx-half,cy-half);ctx.restore();}

/* ---------- the sky scene ---------- */
var SKY=[[-90,'#04060d','#0a0e1c'],[-18,'#05070f','#0d1122'],[-13,'#0a1024','#1d2342'],[-8,'#131b3a','#4a4468'],[-4,'#22335e','#c47a5c'],
         [0,'#3a5a92','#f0a262'],[3,'#4878b6','#ecc89c'],[10,'#3f7fc8','#aacdf0'],[90,'#2f6fbf','#9cc5ec']];
function hex(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function mix(a,b,t){a=hex(a);b=hex(b);return 'rgb('+[0,1,2].map(function(i){return Math.round(a[i]+(b[i]-a[i])*t);}).join(',')+')';}
function skyAt(alt){for(var i=0;i<SKY.length-1;i++)if(alt<SKY[i+1][0]){var t=(alt-SKY[i][0])/(SKY[i+1][0]-SKY[i][0]);return [mix(SKY[i][1],SKY[i+1][1],t),mix(SKY[i][2],SKY[i+1][2],t)];}
  return [SKY[SKY.length-1][1],SKY[SKY.length-1][2]];}
function seeded(s){return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
var sceneCache={};
function sceneFor(place){var key=place.lat.toFixed(2)+','+place.lon.toFixed(2);if(sceneCache[key])return sceneCache[key];
  var R=seeded(Math.abs(Math.round(place.lat*977+place.lon*131))+7),stars=[],hills=[],i;
  for(i=0;i<230;i++)stars.push([R(),Math.pow(R(),1.4)*.8,R()*R(),R()]);
  var p1=R()*6,p2=R()*6,p3=R()*6;for(i=0;i<=64;i++){var x=i/64;hills.push(.035+.03*Math.sin(x*6.3+p1)+.018*Math.sin(x*17+p2)+.01*Math.sin(x*41+p3));}
  return sceneCache[key]={stars:stars,hills:hills,dome:.3+R()*.12,trees:[R()*.3+.05,R()*.3+.08,R()*.2+.35]};}
var COMPASS=['N','NE','E','SE','S','SW','W','NW'];
function compass(az){return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(az/22.5)%16];}
function wrap180(x){return ((x%360)+540)%360-180;}

function drawScene(ctx,W,H,f,place,o){
  o=o||{};var r=f.r,face=place.lat>=0?180:0,hy=H*.76,sk=skyAt(r.sunAlt),dark=smooth(-4,-14,r.sunAlt),sc=sceneFor(place),i;
  var gr=ctx.createLinearGradient(0,0,0,hy);gr.addColorStop(0,sk[0]);gr.addColorStop(1,sk[1]);ctx.fillStyle=gr;ctx.fillRect(0,0,W,hy+2);
  var ax=function(az){return W/2+wrap180(az-face)/180*W/2;};
  /* stars, washed out by twilight and by a bright Moon */
  if(dark>0){var sa=dark*(1-.45*r.k*(r.alt>0?1:0));ctx.fillStyle='#fff';
    sc.stars.forEach(function(s){ctx.globalAlpha=sa*(.25+.75*s[3]);var sz=Math.max(.6,W/900)*(s[2]>.85?1.7:1);ctx.fillRect(s[0]*W,s[1]*hy,sz,sz);});ctx.globalAlpha=1;}
  /* glow on the horizon where the Sun is */
  if(r.sunAlt>-14&&r.sunAlt<12){var sx=ax(r.sunAz),gl=smooth(-14,-2,r.sunAlt)*(1-smooth(4,12,r.sunAlt));
    [sx,sx-W,sx+W].forEach(function(x){var rg=ctx.createRadialGradient(x,hy,0,x,hy,W*.45);rg.addColorStop(0,'rgba(255,170,90,'+.55*gl+')');rg.addColorStop(1,'rgba(255,140,80,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,hy+2);});}
  var R=H*.15*(r.size/.5181),top=R+H*.05,h=r.alt+r.size/2+.5667,mx=ax(r.az),my,up=h>=0;
  if(up){my=h<5?hy+R-2*R*(h/5):(hy-R)-(Math.min(h,90)-5)/85*Math.max(0,hy-R-top);}
  /* the Sun, when it's up */
  var sh=r.sunAlt+.8333,sunx=ax(r.sunAz),sR=H*.032;
  if(sh>0){var sy=sh<3?hy+sR-2*sR*(sh/3):(hy-sR)-(Math.min(sh,90)-3)/87*(hy-sR-sR*2);
    [sunx,sunx-W,sunx+W].forEach(function(x){var rg=ctx.createRadialGradient(x,sy,0,x,sy,sR*5);rg.addColorStop(0,'rgba(255,250,230,.95)');rg.addColorStop(.2,'rgba(255,240,200,.6)');rg.addColorStop(1,'rgba(255,230,180,0)');
      ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,sy,sR*5,0,7);ctx.fill();ctx.fillStyle='#fffdf2';ctx.beginPath();ctx.arc(x,sy,sR,0,7);ctx.fill();});}
  /* the Moon: halo, then the disc */
  var dayWash=1-smooth(-6,6,r.sunAlt)*.35,gain=dayWash;
  if(up){[mx,mx-W,mx+W].forEach(function(x){if(x<-R*2||x>W+R*2)return;
      var hg=ctx.createRadialGradient(x,my,R*.9,x,my,R*3.2);hg.addColorStop(0,'rgba(200,215,240,'+(.22*r.k*dark+.02)+')');hg.addColorStop(1,'rgba(200,215,240,0)');
      ctx.fillStyle=hg;ctx.fillRect(x-R*3.2,my-R*3.2,R*6.4,R*6.4);
      drawMoon(ctx,x,my,R,r,{gain:gain,earth:.11*dark,tint:lowTint(r.alt)});});}
  /* the ground */
  var ground=mix('#07080c','#1a2233',smooth(-10,10,r.sunAlt)*.9);ctx.fillStyle=ground;ctx.beginPath();ctx.moveTo(0,H);
  sc.hills.forEach(function(v,k){ctx.lineTo(k/64*W,hy-v*H*.5);});ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  ctx.fillRect(0,hy,W,H-hy);
  var dx=sc.dome*W,dyb=hy-(sc.hills[Math.round(sc.dome*64)]*H*.5)+1,dw=H*.05;
  ctx.beginPath();ctx.arc(dx,dyb-dw*.9,dw,Math.PI,0);ctx.rect(dx-dw,dyb-dw*.9,dw*2,dw*.95);ctx.fill();
  sc.trees.forEach(function(t,k){var tx=t*W,ty=hy-(sc.hills[Math.round(t*64)]*H*.5)+2,th=H*(.05+k*.012);
    ctx.beginPath();ctx.moveTo(tx,ty-th);ctx.lineTo(tx+th*.32,ty);ctx.lineTo(tx-th*.32,ty);ctx.closePath();ctx.fill();});
  if(dark<.5&&r.sunAlt>-8){ctx.fillStyle='rgba(255,236,190,'+(.5-dark)*.6+')';ctx.fillRect(dx+dw*.25,dyb-dw*1.25,dw*.18,dw*.28);}
  /* compass along the horizon */
  var fs=Math.max(9,Math.round(H*.032));ctx.font='500 '+fs+'px "IBM Plex Mono",monospace';ctx.textAlign='center';ctx.textBaseline='top';
  COMPASS.forEach(function(n,k){var x=ax(k*45);if(x<fs||x>W-fs)return;ctx.fillStyle='rgba(230,225,210,'+(n.length===1?.55:.28)+')';
    ctx.fillRect(x-.5,hy+H*.01,1,H*.016);ctx.fillText(n,x,hy+H*.03);});
  /* things below the horizon: a ghost in the ground */
  var gy=hy+H*.125;
  if(!up){var gR=R*.42;ctx.save();ctx.globalAlpha=.8;
    drawMoon(ctx,Math.max(gR+4,Math.min(W-gR-4,mx)),gy,gR,r,{gain:.33,earth:0});ctx.restore();
    ctx.save();ctx.strokeStyle='rgba(200,210,235,.45)';ctx.setLineDash([3,4]);ctx.lineWidth=Math.max(1,H/400);ctx.beginPath();ctx.arc(Math.max(gR+4,Math.min(W-gR-4,mx)),gy,gR+2,0,7);ctx.stroke();ctx.restore();
    if(o.note){ctx.fillStyle='rgba(215,220,235,.8)';ctx.font='300 '+Math.round(fs*.9)+'px "IBM Plex Mono",monospace';
      var nx=Math.max(gR+4,Math.min(W-gR-4,mx)),tx2=nx+gR+8,al='left';if(tx2>W*.72){tx2=nx-gR-8;al='right';}
      ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillText(o.note,tx2,gy);}}
  if(sh<=0&&o.detail){ctx.save();ctx.strokeStyle='rgba(255,200,120,.45)';ctx.setLineDash([2,4]);ctx.lineWidth=Math.max(1,H/400);
    var gx=Math.max(sR+4,Math.min(W-sR-4,sunx));ctx.beginPath();ctx.arc(gx,gy,sR*.8,0,7);ctx.stroke();ctx.restore();
    ctx.fillStyle='rgba(255,200,120,.55)';ctx.font='500 '+Math.round(fs*.8)+'px "IBM Plex Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('☉',gx,gy);}
  /* date stamp, like an old film camera */
  if(o.stamp){ctx.font='500 '+Math.round(H*.036)+'px "IBM Plex Mono",monospace';ctx.textAlign='right';ctx.textBaseline='alphabetic';
    ctx.shadowColor='rgba(255,120,30,.9)';ctx.shadowBlur=H*.012;ctx.fillStyle='#ff9a3c';ctx.fillText(o.stamp,W-H*.035,H-H*.03);ctx.shadowBlur=0;
    if(o.place){ctx.textAlign='left';ctx.fillStyle='rgba(235,230,215,.55)';ctx.font='300 '+Math.round(H*.032)+'px "IBM Plex Mono",monospace';ctx.fillText(o.place,H*.035,H-H*.03);}}
}

/* ---------- rise and set, cached by UTC day ---------- */
var evCache={},evKey='';
function eventsIn(from,to,lat,lon){var k=lat.toFixed(3)+','+lon.toFixed(3);if(k!==evKey){evCache={};evKey=k;}
  var out=[],DAY=864e5,c;for(c=Math.floor(from/DAY);c*DAY<to;c++){if(!evCache[c])evCache[c]=Astro.riseSet(c*DAY,(c+1)*DAY,lat,lon);
    evCache[c].forEach(function(e){if(e.t>=from&&e.t<to)out.push(e);});}
  return out;}
function around(f,place){if(f.ctx)return f.ctx;var ev=eventsIn(f.t-40*36e5,f.t+40*36e5,place.lat,place.lon),c={};
  ev.forEach(function(e){if(e.t<=f.t){if(e.rise)c.prevRise=e.t;else c.prevSet=e.t;}else{if(e.rise&&c.nextRise==null)c.nextRise=e.t;if(!e.rise&&c.nextSet==null)c.nextSet=e.t;}});
  return f.ctx=c;}


/* ---------- the billiard table: Sun, Earth and Moon from above (Tatum's idea) ---------- */
function drawTable(g,S,f,place,tz){
  var r=f.r,ex=S*.58,ey=S*.5,Ro=S*.3,Re=S*.075,Rm=S*.042,A=function(deg){return -deg*D2R;}; /* math angle → canvas */
  g.clearRect(0,0,S,S);
  var fe=g.createRadialGradient(ex,ey,S*.05,ex,ey,S*.75);fe.addColorStop(0,'#1b4a3a');fe.addColorStop(1,'#0c2a21');
  g.fillStyle=fe;g.fillRect(0,0,S,S);
  /* sunlight from the left */
  var sg=g.createRadialGradient(-S*.12,ey,S*.05,-S*.12,ey,S*.34);sg.addColorStop(0,'#fff6d8');sg.addColorStop(.45,'#ffd36b');sg.addColorStop(1,'rgba(255,190,80,0)');
  g.save();g.beginPath();g.rect(S*.018,S*.018,S*.964,S*.964);g.clip(); /* keep the glow inside the rails */
  g.fillStyle=sg;g.beginPath();g.arc(-S*.12,ey,S*.34,0,7);g.fill();g.restore();
  g.strokeStyle='rgba(255,220,140,.12)';g.lineWidth=1;for(var k=-3;k<=3;k++){g.beginPath();g.moveTo(S*.2,ey+k*S*.1);g.lineTo(S*.97,ey+k*S*.1);g.stroke();}
  /* where "you" are: local solar hour angle turns Earth; the fan is the stretch of the Moon's daily circle above your horizon */
  var Hs=r.Hs!=null?r.Hs:hourAngle(r.sunAz,r.sunAlt,r.sun.dec,place.lat),Hmo=r.H!=null?r.H:hourAngle(r.az,r.alt,r.moon.dec,place.lat);
  var obs=180+Hs,x=-Math.tan(place.lat*D2R)*Math.tan(r.moon.dec*D2R),H0=x<=-1?180:x>=1?0:Math.acos(x)/D2R,Hm=wrap180(Hmo),mAng=obs-Hm,up=r.alt+r.size/2+.5667>=0;
  if(H0>0){var fg=g.createRadialGradient(ex,ey,Re,ex,ey,Ro*1.45);fg.addColorStop(0,'rgba(255,212,138,.28)');fg.addColorStop(1,'rgba(255,212,138,.03)');g.fillStyle=fg;
    g.beginPath();g.moveTo(ex,ey);if(H0>=180)g.arc(ex,ey,Ro*1.45,0,7);else g.arc(ex,ey,Ro*1.45,A(obs+H0),A(obs-H0));g.closePath();g.fill();
    if(H0<180){g.strokeStyle='rgba(255,212,138,.55)';g.setLineDash([4,4]);g.lineWidth=1.2;[obs+H0,obs-H0].forEach(function(a){g.beginPath();g.moveTo(ex,ey);g.lineTo(ex+Math.cos(a*D2R)*Ro*1.45,ey-Math.sin(a*D2R)*Ro*1.45);g.stroke();});g.setLineDash([]);}}
  /* the Moon's orbit, running anticlockwise */
  g.strokeStyle='rgba(230,235,245,.35)';g.setLineDash([2,5]);g.lineWidth=1.2;g.beginPath();g.arc(ex,ey,Ro,0,7);g.stroke();g.setLineDash([]);
  var aa=mAng+28;g.strokeStyle='rgba(230,235,245,.5)';g.beginPath();g.arc(ex,ey,Ro,A(mAng+14),A(aa),true);g.stroke();
  var ax2=ex+Math.cos(aa*D2R)*Ro,ay2=ey-Math.sin(aa*D2R)*Ro,t=(aa+90)*D2R;g.fillStyle='rgba(230,235,245,.6)';g.beginPath();
  g.moveTo(ax2+Math.cos(t)*6,ay2-Math.sin(t)*6);g.lineTo(ax2+Math.cos(t+2.5)*6,ay2-Math.sin(t+2.5)*6);g.lineTo(ax2+Math.cos(t-2.5)*6,ay2-Math.sin(t-2.5)*6);g.fill();
  /* balls: lit half always faces the Sun */
  function ball(x,y,R,dark,light){g.fillStyle=dark;g.beginPath();g.arc(x,y,R,0,7);g.fill();g.fillStyle=light;g.beginPath();g.arc(x,y,R,Math.PI/2,Math.PI*1.5);g.fill();
    var sh=g.createRadialGradient(x-R*.4,y-R*.4,R*.1,x,y,R);sh.addColorStop(0,'rgba(255,255,255,.25)');sh.addColorStop(1,'rgba(0,0,0,.25)');g.fillStyle=sh;g.beginPath();g.arc(x,y,R,0,7);g.fill();}
  ball(ex,ey,Re,'#10233f','#3f8fd6');
  var mx=ex+Math.cos(mAng*D2R)*Ro,my=ey-Math.sin(mAng*D2R)*Ro;
  if(up){g.strokeStyle='rgba(255,212,138,.7)';g.lineWidth=1.5;g.beginPath();g.moveTo(ex+Math.cos(obs*D2R)*Re,ey-Math.sin(obs*D2R)*Re);g.lineTo(mx,my);g.stroke();}
  ball(mx,my,Rm,'#2a2c33','#e9e6dc');
  /* you, standing on Earth */
  var ox=ex+Math.cos(obs*D2R)*Re,oy=ey-Math.sin(obs*D2R)*Re,hx=ex+Math.cos(obs*D2R)*(Re+S*.035),hy=ey-Math.sin(obs*D2R)*(Re+S*.035);
  g.strokeStyle='#ff9a3c';g.lineWidth=Math.max(2,S*.008);g.beginPath();g.moveTo(ox,oy);g.lineTo(hx,hy);g.stroke();g.fillStyle='#ff9a3c';g.beginPath();g.arc(hx,hy,S*.011,0,7);g.fill();
  /* labels */
  var fs=Math.round(S*.042);g.font='500 '+fs+'px "IBM Plex Mono",monospace';g.textBaseline='middle';
  g.fillStyle='#3a2a08';g.textAlign='left';g.fillText('Sun',S*.03,ey);
  g.fillStyle='rgba(235,240,250,.85)';g.textAlign='center';
  var lx=ex+Math.cos(mAng*D2R)*(Ro+Rm+fs*1.1),ly=ey-Math.sin(mAng*D2R)*(Ro+Rm+fs*1.1);g.fillText('Moon',Math.max(fs*1.6,Math.min(S-fs*1.6,lx)),Math.max(fs,Math.min(S-fs,ly)));
  var yl=ex+Math.cos(obs*D2R)*(Re+S*.085),yy=ey-Math.sin(obs*D2R)*(Re+S*.085);g.fillStyle='#ffb36b';g.fillText('you',yl,yy);
  var p=parts(tz,f.t);g.textAlign='right';g.textBaseline='alphabetic';g.fillStyle='rgba(235,230,215,.6)';g.font='300 '+Math.round(fs*.85)+'px "IBM Plex Mono",monospace';
  g.fillText(tm(p)+' · '+(up?'Moon up':'Moon down'),S*.965,S*.955);
  /* rails last, so nothing spills over them */
  g.strokeStyle='#07170f';g.lineWidth=S*.036;g.strokeRect(0,0,S,S);g.strokeStyle='rgba(214,170,96,.55)';g.lineWidth=Math.max(1,S*.006);g.strokeRect(S*.018,S*.018,S*.964,S*.964);}
/* hour angle from altitude/azimuth (azimuth from north through east), so the table never depends on newer engine fields */
function hourAngle(A,h,dec,lat){var a=A*D2R,e=h*D2R,d=dec*D2R,f=lat*D2R;
  return Math.atan2(-Math.sin(a)*Math.cos(e)/Math.cos(d),(Math.sin(e)-Math.sin(f)*Math.sin(d))/(Math.cos(f)*Math.cos(d)))/D2R;}
var tableOn=null;
function renderTable(){var box=$('tableBox'),cv=$('table');if(!frames.length||!tableOn){box.hidden=true;box.parentNode.classList.add('notable');return;}
  box.hidden=false;box.parentNode.classList.remove('notable');var dpr=Math.min(2,window.devicePixelRatio||1),S=Math.round((cv.clientWidth||250)*dpr);
  if(cv.width!==S){cv.width=S;cv.height=S;}cv.style.height=(S/dpr)+'px'; /* no aspect-ratio in older browsers */
  var f=frames[st.slide],up=f.r.alt+f.r.size/2+.5667>=0;
  try{drawTable(cv.getContext('2d'),S,f,st.place,st.place.tz);}catch(e){box.querySelector('figcaption').textContent='The table couldn\u2019t draw in this browser ('+e.message+').';return;}
  cv.setAttribute('aria-label','Top-down view: the Moon is '+Math.round(f.r.elong)+' degrees around its orbit from the Sun, and '+(up?'inside':'outside')+' the fan of sky above your horizon, so it is '+(up?'up':'down')+'.');}
/* ---------- state ---------- */
var st={place:null,mode:'daily',hm:'21:00',n:1,unit:3600000,off:30,frames:30,d0:'',t0:'',slide:0},frames=[],playing=null,thumbs=[];
var slide=$('slide'),sctx=slide.getContext('2d');

function fillPlaces(){var s=$('place'),h='';PLACES.forEach(function(g){h+='<optgroup label="'+g[0]+'">';g[1].forEach(function(p){h+='<option value="'+p[0]+'">'+p[1]+'</option>';});h+='</optgroup>';});
  s.innerHTML=h+'<option value="custom">Custom latitude / longitude</option>';
  try{if(Intl.supportedValuesOf){$('zones').innerHTML=Intl.supportedValuesOf('timeZone').map(function(z){return '<option value="'+z+'">';}).join('');}}catch(e){}}
function guessPlace(){var best='london';Object.keys(BYID).forEach(function(k){if(BYID[k].tz===BROWSER_TZ)best=k;});return best;}
function setPlace(id){var p=BYID[id];if(!p)return;st.place={id:id,name:p.name,lat:p.lat,lon:p.lon,tz:p.tz};$('place').value=id;$('lat').value=p.lat;$('lon').value=p.lon;$('tz').value=p.tz;}
function todayIn(tz){var p=parts(tz,Date.now());return p.y+'-'+pad(p.mo)+'-'+pad(p.d);}
function nowHourIn(tz){var p=parts(tz,Date.now());return pad(p.h)+':00';}

function readHash(){var h=location.hash.slice(1);if(!h)return false;var q={};h.split('&').forEach(function(kv){var i=kv.indexOf('=');if(i>0)q[kv.slice(0,i)]=decodeURIComponent(kv.slice(i+1));});
  if(q.p&&BYID[q.p])setPlace(q.p);
  else if(q.lat!=null&&q.lon!=null&&isFinite(+q.lat)&&isFinite(+q.lon)){var tz=q.tz&&validTz(q.tz)?q.tz:BROWSER_TZ;
    st.place={id:'custom',name:q.name?q.name.slice(0,40):(fmtLat(+q.lat)+' '+fmtLon(+q.lon)),lat:clamp(+q.lat,-90,90),lon:clamp(+q.lon,-180,180),tz:tz};
    $('place').value='custom';$('lat').value=st.place.lat;$('lon').value=st.place.lon;$('tz').value=tz;}
  else return false;
  if(/^\d{4}-\d\d-\d\d$/.test(q.d||''))$('d0').value=q.d;if(/^\d\d:\d\d$/.test(q.t||''))$('t0').value=q.t;
  if(['daily','every','rise','set'].indexOf(q.m)>=0)setMode(q.m);
  if(/^\d\d:\d\d$/.test(q.hm||''))$('hm').value=q.hm;if(q.n&&+q.n>0)$('n').value=Math.min(999,+q.n|0);
  if(q.u&&UNITS[q.u])$('unit').value=UNITS[q.u];if(q.o!=null&&isFinite(+q.o))$('off').value=clamp(+q.o|0,0,1440);
  if(q.f)$('frames').value=clamp(+q.f|0,2,100);st.slide=clamp(+q.s|0,0,99);return true;}
function writeHash(){if(!st.place)return;var p=st.place,h=p.id!=='custom'?'p='+p.id:'lat='+p.lat+'&lon='+p.lon+'&tz='+encodeURIComponent(p.tz);
  h+='&d='+$('d0').value+'&t='+$('t0').value+'&m='+st.mode;
  if(st.mode==='daily')h+='&hm='+$('hm').value;else if(st.mode==='every')h+='&n='+$('n').value+'&u='+UNIT_KEY[$('unit').value];else h+='&o='+$('off').value;
  h+='&f='+$('frames').value+'&s='+st.slide;try{history.replaceState(null,'','#'+h);}catch(e){}}
/* NodeList.forEach is missing in some older browsers */
function each(sel,fn){var l=document.querySelectorAll(sel),i;for(i=0;i<l.length;i++)fn(l[i],i);}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function fmtLat(v){return Math.abs(v).toFixed(2)+'°'+(v>=0?'N':'S');}
function fmtLon(v){return Math.abs(v).toFixed(2)+'°'+(v>=0?'E':'W');}
function setMode(m){st.mode=m;each('input[name=mode]',function(x){x.checked=x.value===m;x.parentNode.className=x.checked?'on':'';});
  each('.sub',function(x){x.hidden=!(x.dataset.for===m||(x.dataset.for==='rise'&&m==='set'));});
  $('t0').parentNode.hidden=m==='daily';
  $('offL').textContent=m==='set'?'minutes before it sets':'minutes after it rises';$('off').setAttribute('aria-label',m==='set'?'Minutes before moonset':'Minutes after moonrise');}

function status(t,err){var s=$('status');s.textContent=t;s.className='status'+(err?' err':'');}

/* ---------- building the slide times ---------- */
function build(){
  stop();var p=st.place,tz=p.tz,d=$('d0').value.split('-').map(Number),tm=($('t0').value||'00:00').split(':').map(Number),F=clamp(+$('frames').value|0||30,2,100),times=[],i;
  if(d.length!==3||!d[0]){status('Pick a start date.',true);return;}
  var start=wallToUTC(tz,d[0],d[1],d[2],tm[0],tm[1]);
  if(st.mode==='daily'){var hm=($('hm').value||'21:00').split(':').map(Number);
    for(i=0;i<F;i++){var dd=new Date(Date.UTC(d[0],d[1]-1,d[2]+i));times.push(wallToUTC(tz,dd.getUTCFullYear(),dd.getUTCMonth()+1,dd.getUTCDate(),hm[0],hm[1]));}}
  else if(st.mode==='every'){var step=Math.max(1,+$('n').value|0)*(+$('unit').value);for(i=0;i<F;i++)times.push(start+i*step);}
  else{var off=clamp(+$('off').value||0,0,1440)*6e4,want=st.mode==='rise',t=start,lim=start+400*864e5;
    while(times.length<F&&t<lim){eventsIn(t,t+20*864e5,p.lat,p.lon).forEach(function(e){if(e.rise===want&&times.length<F)times.push(want?e.t+off:e.t-off);});t+=20*864e5;}
    if(!times.length){frames=[];render();status('The Moon never '+(want?'rises':'sets')+' there within 400 days of that date. Polar nights are wild.',true);return;}}
  frames=times.map(function(t){return {t:t,r:Astro.at(t,p.lat,p.lon)};});
  st.slide=clamp(st.slide,0,frames.length-1);
  var a=parts(tz,frames[0].t),b=parts(tz,frames[frames.length-1].t);
  $('span').textContent=frames.length+' slides · '+dt(a,a.y!==b.y||FMT.date==='iso')+' → '+dt(b,true);
  status(frames.length<F?'Only found '+frames.length+' '+(st.mode==='rise'?'moonrises':'moonsets')+' in 400 days here.':'');
  makeStrip();render();writeHash();}

/* ---------- the carousel strip ---------- */
function label(f,tz,withDay){var p=parts(tz,f.t);return dt(p,false,withDay)+' '+tm(p);}
function makeStrip(){var s=$('strip'),tz=st.place.tz;s.innerHTML='';thumbs=[];
  frames.forEach(function(f,i){var b=document.createElement('button');b.className='mount'+(f.r.alt+f.r.size/2+.5667<0?' below':'');b.type='button';
    b.setAttribute('aria-label','Slide '+(i+1)+': '+label(f,tz,true)+', '+Astro.phaseName(f.r.elong)+', '+Math.round(f.r.k*100)+'% lit'+(f.r.alt+f.r.size/2+.5667<0?', below the horizon':''));
    b.innerHTML='<span class="dot"></span><span class="n">'+(i+1)+'</span><canvas width="10" height="10"></canvas><span class="lab">'+label(f,tz)+'</span>';
    b.onclick=function(){go(i,true);};s.appendChild(b);thumbs.push(b);});
  var i=0,dpr=Math.min(2,window.devicePixelRatio||1);
  (function batch(){var end=Math.min(frames.length,i+6);for(;i<end;i++){var cv=thumbs[i].querySelector('canvas'),w=Math.round(132*dpr),h=Math.round(88*dpr);cv.width=w;cv.height=h;
      drawScene(cv.getContext('2d'),w,h,frames[i],st.place,{});}
    if(i<frames.length)setTimeout(batch,0);})();}

/* ---------- the big slide + caption ---------- */
function describeSky(r){var h=r.alt+r.size/2+.5667;if(h>=0)return 'Up in the '+compass(r.az)+', <b>'+Math.max(0,Math.round(r.alt))+'°</b> above the horizon'+(r.alt<8?' · our air tints it orange this low':'');
  return '<span class="down">Below the horizon, '+Math.round(-r.alt)+'° down in the '+compass(r.az)+'</span>';}
function sunText(a){if(a>6)return 'Daylight, the Sun is '+Math.round(a)+'° up';if(a>-0.83)return 'Golden hour, the Sun is low';if(a>-6)return 'Civil twilight, the Sun just set or is about to rise';
  if(a>-12)return 'Nautical twilight';if(a>-18)return 'Astronomical twilight';return 'Full night, the Sun is '+Math.round(-a)+'° below';}
function when(t,ref,tz){var p=parts(tz,t),q=parts(tz,ref);return (dayKey(p)!==dayKey(q)?p.wd+' ':'')+tm(p);}
function clock(r){var th=((r.chi-r.q)%360+360)%360,c=Math.round((360-th)/30)%12;return c===0?12:c;}
function render(){
  var dpr=Math.min(2,window.devicePixelRatio||1),w=Math.round(Math.min(1800,slide.clientWidth*dpr||900)),h=Math.round(w*2/3);
  if(slide.width!==w){slide.width=w;slide.height=h;}
  if(!frames.length){sctx.fillStyle='#000';sctx.fillRect(0,0,w,h);$('caption').innerHTML='';$('count').textContent='';renderTable();return;}
  var f=frames[st.slide],r=f.r,tz=st.place.tz,c=around(f,st.place),up=r.alt+r.size/2+.5667>=0,p=parts(tz,f.t),
      note=up?'':(c.nextRise!=null?'rises '+when(c.nextRise,f.t,tz):'');
  drawScene(sctx,w,h,f,st.place,{stamp:stampOf(p),place:st.place.name,note:note,detail:true});
  var rs;if(up)rs=(c.prevRise!=null?'rose '+when(c.prevRise,f.t,tz):'up all day')+' · '+(c.nextSet!=null?'sets <b>'+when(c.nextSet,f.t,tz)+'</b>':'doesn\u2019t set for over a day');
  else rs=(c.prevSet!=null?'set '+when(c.prevSet,f.t,tz):'down all day')+' · '+(c.nextRise!=null?'rises <b>'+when(c.nextRise,f.t,tz)+'</b>':'doesn\u2019t rise for over a day');
  var big=Math.round((r.size/.5181-1)*100),km=Math.round(r.moon.dist/100)*100;
  $('caption').innerHTML='<h3 class="phase">'+Astro.phaseName(r.elong)+'<small>'+dt(p,true,true)+', '+tm(p)+' · '+esc(st.place.name)+'</small></h3>'+
    '<dt>Lit</dt><dd><b>'+(r.k*100).toFixed(r.k>.995||r.k<.005?1:0)+'%</b> · '+r.age.toFixed(1)+' days since new'+(r.k>.03&&r.k<.97?' · lit side toward '+clock(r)+' o\u2019clock':'')+'</dd>'+
    '<dt>Sky</dt><dd>'+describeSky(r)+'</dd>'+
    '<dt>Rise · set</dt><dd>'+rs+'</dd>'+
    '<dt>Sun</dt><dd>'+sunText(r.sunAlt)+'</dd>'+
    '<dt>Distance</dt><dd>'+km.toLocaleString('en-US')+' km · looks '+(big===0?'average size':Math.abs(big)+'% '+(big>0?'bigger':'smaller')+' than average')+'</dd>';
  slide.setAttribute('aria-label',Astro.phaseName(r.elong)+', '+Math.round(r.k*100)+' percent lit, '+(up?'up in the '+compass(r.az):'below the horizon')+', '+label(f,tz,true)+' in '+st.place.name);
  $('count').textContent=(st.slide+1)+' / '+frames.length;
  thumbs.forEach(function(b,i){b.setAttribute('aria-current',i===st.slide?'true':'false');});
  renderTable();}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* slide the strip sideways only, so the page itself never jumps */
function centerThumb(smooth){var t=thumbs[st.slide],s=$('strip');if(!t)return;var x=t.offsetLeft-s.offsetLeft-(s.clientWidth-t.offsetWidth)/2;
  try{s.scrollTo({left:x,behavior:smooth?'smooth':'auto'});}catch(e){s.scrollLeft=x;}}
function lowTint(alt){var t=1-smooth(-1,14,alt);return [1,1-.28*t,1-.62*t];}
function go(i,user){if(!frames.length)return;st.slide=((i%frames.length)+frames.length)%frames.length;
  var b=$('beam');b.classList.remove('flash');void b.offsetWidth;b.classList.add('flash');clack();render();
  centerThumb(user);
  if(user)writeHash();}

/* ---------- projector sound ---------- */
var ac=null,soundOn=true;
function clack(){if(!soundOn)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
  var t=ac.currentTime,n=ac.createBuffer(1,ac.sampleRate*.06|0,ac.sampleRate),d=n.getChannelData(0),i;for(i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
  var src=ac.createBufferSource(),bp=ac.createBiquadFilter(),g=ac.createGain();src.buffer=n;bp.type='bandpass';bp.frequency.value=1700;bp.Q.value=2.5;
  g.gain.value=.28;src.connect(bp);bp.connect(g);g.connect(ac.destination);src.start(t);
  var o=ac.createOscillator(),g2=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(60,t+.07);
  g2.gain.setValueAtTime(.18,t);g2.gain.exponentialRampToValueAtTime(.001,t+.09);o.connect(g2);g2.connect(ac.destination);o.start(t);o.stop(t+.1);}catch(e){}}

/* ---------- playback ---------- */
function play(){if(playing||frames.length<2)return;$('play').textContent='❚❚ Pause';$('play').setAttribute('aria-pressed','true');$('caption').setAttribute('aria-live','off');
  playing=setInterval(function(){go(st.slide+1);},+$('speed').value);}
function stop(){if(!playing)return;clearInterval(playing);playing=null;$('play').textContent='▶ Play';$('play').setAttribute('aria-pressed','false');$('caption').setAttribute('aria-live','polite');writeHash();}

/* ---------- wiring ---------- */
var tmr=null;function rebuild(){clearTimeout(tmr);tmr=setTimeout(function(){st.slide=0;build();},250);}
function init(){
  fillPlaces();
  if(!readHash()){setPlace(guessPlace());$('d0').value=todayIn(st.place.tz);$('t0').value=nowHourIn(st.place.tz);setMode('daily');}
  else setMode(st.mode);
  if(!$('t0').value)$('t0').value='21:00';
  $('place').onchange=function(){if(this.value==='custom'){st.place.id='custom';st.place.name=fmtLat(st.place.lat)+' '+fmtLon(st.place.lon);rebuild();return;}setPlace(this.value);rebuild();};
  function custom(){var la=+$('lat').value,lo=+$('lon').value;if(!isFinite(la)||!isFinite(lo)||$('lat').value===''||$('lon').value===''||Math.abs(la)>90||Math.abs(lo)>180){status('Latitude runs from −90 to 90, longitude from −180 to 180.',true);return;}
    st.place={id:'custom',name:fmtLat(la)+' '+fmtLon(lo),lat:la,lon:lo,tz:st.place.tz};$('place').value='custom';rebuild();}
  $('lat').oninput=custom;$('lon').oninput=custom;
  $('tz').onchange=function(){var z=this.value.trim();if(!validTz(z)){status('I don\u2019t know the time zone “'+z+'”. Try one like Europe/London.',true);return;}st.place.tz=z;if(st.place.id!=='custom'){st.place.id='custom';$('place').value='custom';}rebuild();};
  $('geo').onclick=function(){if(!navigator.geolocation){status('This browser can\u2019t share a location. Type latitude and longitude instead.',true);return;}status('Asking your browser where you are…');
    navigator.geolocation.getCurrentPosition(function(pos){var la=+pos.coords.latitude.toFixed(3),lo=+pos.coords.longitude.toFixed(3);$('lat').value=la;$('lon').value=lo;
      st.place={id:'custom',name:'My sky',lat:la,lon:lo,tz:BROWSER_TZ};$('tz').value=BROWSER_TZ;$('place').value='custom';status('');build();},
      function(){status('No location shared. Type latitude and longitude instead.',true);},{timeout:12000,maximumAge:6e5});};
  $('now').onclick=function(){$('d0').value=todayIn(st.place.tz);var p=parts(st.place.tz,Date.now());$('t0').value=hhmm(p);rebuild();};
  ['d0','t0','hm','n','unit','off','frames'].forEach(function(id){$(id).addEventListener('change',rebuild);});
  each('input[name=mode]',function(x){x.onchange=function(){setMode(this.value);rebuild();};});
  $('prev').onclick=function(){stop();go(st.slide-1,true);};$('next').onclick=function(){stop();go(st.slide+1,true);};
  $('play').onclick=function(){playing?stop():play();};
  $('speed').onchange=function(){if(playing){stop();play();}};
  $('sound').onclick=function(){soundOn=!soundOn;this.setAttribute('aria-pressed',soundOn);this.textContent=soundOn?'🔊':'🔈';};
  tableOn=window.matchMedia?!window.matchMedia('(max-width:640px)').matches:true;$('tbl').setAttribute('aria-pressed',tableOn);
  function flipTable(){tableOn=!tableOn;$('tbl').setAttribute('aria-pressed',tableOn);renderTable();if(tableOn&&window.innerWidth<=640)$('tableBox').scrollIntoView({block:'nearest',behavior:'smooth'});}
  $('tbl').onclick=flipTable;slide.onclick=flipTable;
  $('clock').value=FMT.clock;$('datef').value=FMT.date;
  $('clock').onchange=$('datef').onchange=function(){FMT.clock=$('clock').value;FMT.date=$('datef').value;try{localStorage.setItem('moonCarousel.fmt',JSON.stringify(FMT));}catch(e){}build();};
  $('save').onclick=saveSlide;$('share').onclick=share;
  document.addEventListener('keydown',function(e){var t=e.target.tagName;if(t==='INPUT'||t==='SELECT'||t==='TEXTAREA')return;
    if(e.key==='ArrowRight'){stop();go(st.slide+1,true);e.preventDefault();}else if(e.key==='ArrowLeft'){stop();go(st.slide-1,true);e.preventDefault();}
    else if(e.key===' '&&t!=='BUTTON'){playing?stop():play();e.preventDefault();}});
  var rt=null;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(render,120);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){render();});
  build();
  centerThumb(false);
  window.__moonReady=true;document.title='Moon Carousel';}

function saveSlide(){if(!frames.length)return;var f=frames[st.slide],tz=st.place.tz,p=parts(tz,f.t),W=1500,H=1000,cv=document.createElement('canvas');cv.width=W;cv.height=H+150;
  var g=cv.getContext('2d');g.fillStyle='#e9e2d0';g.fillRect(0,0,W,H+150);
  var inner=document.createElement('canvas');inner.width=W-60;inner.height=H-40;drawScene(inner.getContext('2d'),inner.width,inner.height,f,st.place,{stamp:stampOf(p),detail:true});
  g.drawImage(inner,30,30);g.fillStyle='#2b2a33';g.font='italic 64px "Instrument Serif",Georgia,serif';g.textBaseline='alphabetic';
  g.fillText(Astro.phaseName(f.r.elong)+' · '+Math.round(f.r.k*100)+'% lit',34,H+62);
  g.font='300 26px "IBM Plex Mono",monospace';g.fillStyle='#5b574b';g.fillText(st.place.name+' · '+dt(p,true,true)+', '+tm(p)+' · '+(f.r.alt+f.r.size/2+.5667>=0?'up in the '+compass(f.r.az)+', '+Math.max(0,Math.round(f.r.alt))+'° high':'below the horizon'),36,H+112);
  g.font='40px "Reenie Beanie",cursive';g.textAlign='right';g.fillStyle='#8a826c';g.fillText('Moon Carousel',W-36,H+112);
  cv.toBlob(function(b){if(!b){status('Couldn\u2019t make the picture, sorry.',true);return;}var a=document.createElement('a');a.href=URL.createObjectURL(b);
    a.download='moon-'+(st.place.id==='custom'?'sky':st.place.id)+'-'+p.y+pad(p.mo)+pad(p.d)+'-'+pad(p.h)+pad(p.mi)+'.png';document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(a.href);},4000);status('Slide saved.');},'image/png');}
function share(){writeHash();var u=location.href;
  (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(u):Promise.reject()).then(function(){status('Link copied: it opens this exact carousel.');},
   function(){var i=document.createElement('input');i.value=u;document.body.appendChild(i);i.select();try{document.execCommand('copy');status('Link copied.');}catch(e){status('Copy the address bar to share this carousel.');}i.remove();});}
window.__moon={drawMoon:drawMoon,tex:function(){if(!TEX)TEX=makeTex();return TEX;},build:function(){build();},frames:function(){return frames;},st:st,go:go,drawScene:drawScene,parts:parts,wallToUTC:wallToUTC};
init();
})();
