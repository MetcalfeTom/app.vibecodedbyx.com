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
  ['anchorage','Anchorage',61.218,-149.9,'America/Anchorage'],['vancouver','Vancouver',49.283,-123.121,'America/Vancouver'],
  ['edmonton','Edmonton',53.546,-113.49,'America/Edmonton'],['toronto','Toronto',43.653,-79.383,'America/Toronto'],['la','Los Angeles',34.052,-118.244,'America/Los_Angeles'],
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
/* v1.5 the film stamp reads like the chosen formats (Tatum: it used to be bare numbers, '26 9 28, so the choice didn't show) */
function stampOf(p){var y="'"+String(p.y).slice(2),m=MON[p.mo-1].toUpperCase();return (FMT.date==='iso'?p.y+'-'+pad(p.mo)+'-'+pad(p.d):FMT.date==='mdy'?m+' '+pad(p.d)+' '+y:pad(p.d)+' '+m+' '+y)+'  '+tm(p).toUpperCase();}
function dayKey(p){return p.y*400+p.mo*32+p.d;}

/* ---------- a procedural Moon map: albedo + relief, selenographic lat/lon (east +, the right side with north up) ---------- */
var TW=1024,TH=512,TEX=null; /* 4 floats a texel: albedo, east slope, north slope, height (Moon radii) */
function ihash(x,y,z){var h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(z|0,1440662683))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
function vnoise(x,y,z){var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,
  u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf),
  a=ihash(xi,yi,zi),b=ihash(xi+1,yi,zi),c=ihash(xi,yi+1,zi),d=ihash(xi+1,yi+1,zi),e=ihash(xi,yi,zi+1),f=ihash(xi+1,yi,zi+1),g=ihash(xi,yi+1,zi+1),h=ihash(xi+1,yi+1,zi+1);
  a+=(b-a)*u;c+=(d-c)*u;e+=(f-e)*u;g+=(h-g)*u;a+=(c-a)*v;e+=(g-e)*v;return a+(e-a)*w;}
function fbm(x,y,z,o){var s=0,a=.5,f=1,i;for(i=0;i<o;i++){s+=a*vnoise(x*f,y*f,z*f);f*=2.03;a*=.5;}return s/(1-Math.pow(.5,o));}
/* the seas, traced from a lunar map: [albedo, lat,lon, lat,lon, ...] or an ellipse [albedo, 'e', lat,lon, lat radius, lon radius] */
var MARIA=[
 [.55, 54,-58, 50,-48, 45,-43, 40,-41, 30,-39, 22,-36, 17,-33, 14,-36, 10,-35, 5,-32, 0,-30, -4,-30, -8,-33, -12,-38, -14,-44, -11,-50, -6,-56, -2,-61, 3,-65, 10,-68, 18,-70, 25,-72, 32,-73, 40,-72, 47,-69, 53,-66, 57,-62], /* Oceanus Procellarum */
 [.74, 22,-53, 27,-55, 29,-50, 26,-46, 22,-48], /* the Aristarchus plateau, a pale island in the ocean */
 [.56, 47.5,-16, 47,-9, 45.5,-3, 42,2, 38,5, 33,4, 28,2, 24,-1, 20,-5, 17,-10, 15.5,-16, 15.5,-24, 17,-30, 21,-35, 27,-38, 34,-40, 40,-41, 42,-37, 44.5,-37.5, 47,-35, 48,-31, 47,-27, 48,-21], /* Imbrium + Sinus Iridum */
 [.66, 57,-52, 58,-44, 60.5,-36, 61.5,-26, 59.5,-18, 60,-8, 58.5,2, 59,12, 57,22, 57.5,33, 56,44, 53.5,43, 54.5,33, 53,24, 55,13, 54,4, 55.5,-6, 54.5,-17, 56,-26, 54,-36, 52.5,-46, 54.5,-58], /* Frigoris */
 [.58, 13,-34, 14,-27, 13,-21, 11,-15, 8,-12, 4,-13, 0,-16, -3,-21, -5,-27, -3,-31, 2,-33, 8,-35], /* Insularum */
 [.60, -5,-19, -7,-17, -12,-19, -14,-24, -12,-28, -7,-28, -4,-24], /* Cognitum */
 [.62, -13,-12, -15,-7, -18,-5, -23,-6, -27,-9, -29,-14, -29,-20, -27,-25, -23,-27, -19,-26, -15,-22, -13,-17], /* Nubium */
 [.57,'e', -24.4,-38.6, 6,6.6], /* Humorum */
 [.52,'e', 28,17.5, 9.8,11.2], [.63,'e', 28.6,17.3, 7.6,8.8], /* Serenitatis, darker at the shore */
 [.50, 20.5,24, 19.5,29, 17,32, 15,36, 13.5,41, 11,45, 7,47, 3,46, 0,43, -2,38, -4,33, -5,29, -6,25, -3,22, 0,19.5, 4,19, 8,20, 13,21, 17,21.5], /* Tranquillitatis */
 [.58, 4,47, 3,52, 0,56, -5,59, -11,58, -16,56, -21,53, -22,49, -18,46, -12,45.5, -7,43, -3,42, 0,43], /* Fecunditatis */
 [.60, -3,26, -6,28, -10,30, -11,33, -8,34, -5,32], /* Sinus Asperitatis */
 [.60,'e', -15.2,35.3, 5,5.3], /* Nectaris */
 [.55,'e', 17,59.1, 7.5,10], /* Crisium */
 [.58,'e', 13.3,3.6, 4,4.5], [.62,'e', 2.4,1.7, 2.5,3.5], [.50,'e', 11.5,-8.5, 3,4.5], [.60,'e', 26.5,.4, 3,3.5], /* Vaporum, Sinus Medii, Aestuum, Palus Putredinis */
 [.62,'e', 37,30, 4,6], [.62,'e', 45,27, 2.5,3.5], [.62,'e', 7,69, 2,3], [.64,'e', 1,65, 1.5,2], [.64,'e', 22,67.5, 1.5,2], /* Somniorum, Mortis, Undarum, Spumans, Anguis */
 [.62,'e', 13,86.5, 4,5], [.58,'e', 1.5,87.5, 5,6], [.62,'e', 57,81, 4,7], /* Marginis, Smythii, Humboldtianum */
 [.66,'e', -38,86, 3,5], [.66,'e', -45,95, 4,6], [.66,'e', -35,95, 3,4], [.68,'e', -47,80, 2.5,4], /* Australe, in patches */
 [.58,'e', -19,-93, 4,5], [.62,'e', -15,-85, 2.5,3.5], [.64,'e', -10,-83, 2,3]]; /* Orientale, Lacus Veris, Autumni */
/* named craters: lat, lon, diameter km, kind (r = young with rays, d = lava floor, f = flat floor, o = old and worn, b = bright, p = central peak) */
var CRATERS=[
 [-43.3,-11.2,85,'rp'],[9.6,-20.1,93,'rp'],[8.1,-38,32,'r'],[23.7,-47.4,40,'r'],[16.1,46.8,28,'r'],[73.4,-10.1,50,'r'],[61.8,50.3,31,'r'],[-32.5,54.2,74,'r'],
 [-1.9,47.6,11,'r'],[52.6,-43.4,39,'r'],[-24.5,-63.7,19,'r'],[8.1,-77.6,20,'r'],
 [51.6,-9.4,101,'d'],[-5.2,-68.6,172,'d'],[29.7,-4,81,'d'],[53.9,57,125,'d'],[-3.3,-74.6,139,'d'],[9,15.4,90,'d'],[-21.5,33.2,124,'d'],[-10.6,-42.4,119,'d'],
 [-58.8,-14.1,225,''],[-9.2,-1.8,154,'f'],[-13.4,-3.2,108,'p'],[-18.2,-1.9,97,'p'],[-11.4,26.4,100,'p'],[-13.2,24,98,''],[-18.1,23.4,99,''],
 [-8.9,61,132,'p'],[-25.3,60.4,188,'p'],[31.8,29.9,95,'f'],[14.5,-11.3,58,'p'],[50.2,17.4,88,'p'],[44.3,16.3,67,''],[-5.1,5.2,138,'fo'],[-11.2,4,129,'p'],
 [-50,-6.2,194,'o'],[-49.5,-21.7,146,''],[-44.3,-55.3,206,'f'],[-17.6,-40.1,110,'fp'],[-44.9,41,199,'o'],[-41.8,14,114,''],[-41.1,6,126,'f'],[-33.1,1,132,'o'],
 [-27,80.9,207,''],[-36,60.6,135,''],[2.2,-67.6,115,''],[63.5,-63,142,'p'],[-66.5,-69.1,303,'o'],[14.5,9.1,38,'b'],[16.3,16,26,'b'],[14.6,54.7,22,''],
 [27.7,55.5,125,''],[34.5,56.7,85,''],[46.7,44.4,87,''],[46.7,39.1,69,''],[-29.7,32.2,88,'p'],[-8.6,41.2,74,'o'],[-16.4,61.6,131,'o'],[-29.3,55.7,83,''],
 [-43.1,-20.4,107,'o'],[-29.8,-13.5,106,'f'],[-20.7,-22.2,61,'p'],[3.3,-22.8,42,''],[-.3,-26.6,39,''],[26.7,-13.1,33,''],[25.8,-21,30,''],[23.3,-29.2,27,''],
 [72.1,-32.4,70,''],[73.6,19.2,130,'o'],[-70.6,-5.5,111,'p'],[-60.5,-27.8,110,''],[-63.6,-21.5,105,''],[-33.1,-5.2,256,'o'],[-25.5,-1.9,118,'o'],[-28.3,-1,108,'o'],
 [-28,3.3,70,''],[-30.6,5.2,80,''],[-23.7,16.7,98,'o'],[-13.8,13.9,62,''],[-37.1,47.2,70,''],[-40.3,43.3,88,''],[-42.9,42,78,'p'],[-54.7,33,126,'o'],
 [-41.3,-33.5,70,''],[5.1,-66.8,57,''],[11.9,-50.8,41,''],[7,-54.9,30,''],[21,-66.6,43,''],[23.2,-49.7,34,''],[-24.7,-65.3,87,'']];
/* rays: crater index in CRATERS, ray length in degrees, strength */
var RAYS=[[0,40,.13],[1,18,.11],[2,11,.10],[3,6,.09],[4,9,.07],[5,12,.06],[6,8,.05],[7,10,.06],[8,6,.05],[9,5,.04],[10,8,.05],[11,8,.05]];
/* mountains: height km, half width degrees, then the ridge line as lat,lon pairs */
var RIDGES=[
 [5,1.7, 13.5,-12, 16,-9.5, 18.5,-6.5, 20.5,-4, 22.5,-2, 24.5,0, 26.5,2.5],  /* Apenninus */
 [4,1.4, 33.5,7, 36.5,8.5, 39.5,9.5, 42,10],                                /* Caucasus */
 [3,1.4, 44,-2, 46,0, 48,2.5, 49.5,5],                                      /* Alpes */
 [2.5,1.1, 15,-31, 15.5,-26, 15,-21, 14.3,-17],                             /* Carpatus */
 [3.5,1, 41,-40.5, 44.5,-40, 47.5,-37, 49,-32.5, 48,-27.5],                 /* Jura, round Sinus Iridum */
 [2,1.1, 17,8, 17.5,12, 18.5,15],[2.5,1.8, 26,32, 29,35, 24,37],            /* Haemus, Taurus */
 [3,.8, -30.5,19, -27,21, -24,23.5, -21,26, -19,29],                        /* Rupes Altai */
 [2,1, -14,41, -10,41.5, -6,40.5],[1.5,.7, -5,-28.5, -8,-28, -10,-27],       /* Pyrenaeus, Riphaeus */
 [2.4,.6, 45.7,-8.9, 45.8,-8.7],[2.3,.6, 40.6,-1.1, 40.7,-.9],[1.5,.8, 47.8,-12, 47.9,-10.5]]; /* Pico, Piton, Teneriffe */
function vec(lat,lon){var c=Math.cos(lat*D2R);return [c*Math.sin(lon*D2R),Math.sin(lat*D2R),c*Math.cos(lon*D2R)];}
function angDist(a,b){var d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2];return Math.acos(Math.max(-1,Math.min(1,d)))/D2R;}
function bearing(la1,lo1,la2,lo2){var p1=la1*D2R,p2=la2*D2R,dl=(lo2-lo1)*D2R;return Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl));}
function smooth(e0,e1,x){var t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t);}
var KM=1/1737.4,I0=Math.floor(65/360*TW),I1=Math.ceil(295/360*TW); /* only the near side (lon -115..115) gets the full treatment */
function seaMask(){var cv=document.createElement('canvas'),g,d,m=new Float32Array(TW*TH*2),i,k,q,X=function(lo){return (lo+180)/360*TW;},Y=function(la){return (90-la)/180*TH;};
  cv.width=TW;cv.height=TH;g=cv.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,TW,TH);
  MARIA.forEach(function(q){var c=Math.round(q[0]*255);g.fillStyle='rgb(255,'+c+',0)';g.beginPath();
    if(q[1]==='e')g.ellipse(X(q[3]),Y(q[2]),q[5]/360*TW,q[4]/180*TH,0,0,7);
    else for(k=1;k<q.length;k+=2)g[k===1?'moveTo':'lineTo'](X(q[k+1]),Y(q[k]));
    g.fill();});
  d=g.getImageData(0,0,TW,TH).data;
  for(i=0;i<TW*TH;i++){m[i*2]=d[i*4]/255;m[i*2+1]=d[i*4+1]/255;}
  blur(m,3);blur(m,3);return m;}
function blur(m,r){var t=new Float32Array(m.length),i,j,k,s0,s1,n=2*r+1,a,b;
  for(j=0;j<TH;j++){s0=0;s1=0;for(k=-r;k<=r;k++){a=Math.max(0,Math.min(TW-1,k));s0+=m[(j*TW+a)*2];s1+=m[(j*TW+a)*2+1];}
    for(i=0;i<TW;i++){t[(j*TW+i)*2]=s0/n;t[(j*TW+i)*2+1]=s1/n;a=Math.min(TW-1,i+r+1);b=Math.max(0,i-r);s0+=m[(j*TW+a)*2]-m[(j*TW+b)*2];s1+=m[(j*TW+a)*2+1]-m[(j*TW+b)*2+1];}}
  for(i=0;i<TW;i++){s0=0;s1=0;for(k=-r;k<=r;k++){a=Math.max(0,Math.min(TH-1,k));s0+=t[(a*TW+i)*2];s1+=t[(a*TW+i)*2+1];}
    for(j=0;j<TH;j++){m[(j*TW+i)*2]=s0/n;m[(j*TW+i)*2+1]=s1/n;a=Math.min(TH-1,j+r+1);b=Math.max(0,j-r);s0+=t[(a*TW+i)*2]-t[(b*TW+i)*2];s1+=t[(a*TW+i)*2+1]-t[(b*TW+i)*2+1];}}}
/* the bake is a list of short steps, so it can run in slices between frames */
function texJob(){var S=[],T;
  var A=new Float32Array(TW*TH),H=new Float32Array(TW*TH),MS=new Float32Array(TW*TH),sea,i,j,k,lat,lon,p,m,cov,dk,wx,wy,si,sj,e,hl,mr,seed=20260928;
  function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  S.push(function(){sea=seaMask();});
  /* the smooth noise fields are baked at half size first, then read back blended */
  var LW=TW>>1,LH=TH>>1,LO=new Float32Array(LW*LH*6),li,lj;
  S.push(function(){for(lj=0;lj<LH;lj++){lat=90-(lj*2+1)/TH*180;
    for(li=Math.max(0,(I0>>1)-1);li<=Math.min(LW-1,(I1>>1)+1);li++){lon=(li*2+1)/TW*360-180;p=vec(lat,lon);k=(lj*LW+li)*6;
      LO[k]=fbm(p[0]*3+17,p[1]*3,p[2]*3,3);LO[k+1]=fbm(p[0]*3,p[1]*3+31,p[2]*3,3);LO[k+2]=fbm(p[0]*6,p[1]*6+3,p[2]*6,3);
      LO[k+3]=fbm(p[0]*4+1,p[1]*4,p[2]*4+2,3);LO[k+4]=fbm(p[0]*13,p[1]*13+4,p[2]*13,3);LO[k+5]=fbm(p[0]*7+9,p[1]*7,p[2]*7,3);}}});
  function L(i,j,c){var x=Math.max(0,Math.min(LW-1.001,(i-.5)/2)),y=Math.max(0,Math.min(LH-1.001,(j-.5)/2)),x0=x|0,y0=y|0,fx=x-x0,fy=y-y0,k0=(y0*LW+x0)*6+c,k1=k0+LW*6;
    return (LO[k0]*(1-fx)+LO[k0+6]*fx)*(1-fy)+(LO[k1]*(1-fx)+LO[k1+6]*fx)*fy;}
  for(var c0=0;c0<TH;c0+=24)S.push(rows.bind(null,c0));
  function rows(c0){for(j=c0;j<Math.min(TH,c0+24);j++){lat=90-(j+.5)/TH*180;
    for(i=0;i<TW;i++){lon=(i+.5)/TW*360-180;p=vec(lat,lon);k=j*TW+i;
      if(i<I0||i>I1){A[k]=.82+.08*(vnoise(p[0]*9,p[1]*9,p[2]*9)-.5);continue;}
      /* the shoreline wanders: sample the traced seas through a noisy warp */
      wx=(L(i,j,0)-.5)*30+(vnoise(p[0]*14,p[1]*14+5,p[2]*14)-.5)*9;wy=(L(i,j,1)-.5)*22+(vnoise(p[0]*14+9,p[1]*14,p[2]*14)-.5)*7;
      si=Math.max(0,Math.min(TW-1,Math.round(i+wx)));sj=Math.max(0,Math.min(TH-1,Math.round(j+wy)));
      cov=sea[(sj*TW+si)*2];dk=cov>.01?sea[(sj*TW+si)*2+1]/cov:.6;
      e=fbm(p[0]*16+3,p[1]*16,p[2]*16,2)-.5;
      m=smooth(.24,.7,cov+.34*e+.16*(vnoise(p[0]*34,p[1]*34,p[2]*34)-.5));MS[k]=m;
      hl=m<1?.80+.10*(L(i,j,2)-.5)+.07*e+.05*(vnoise(p[0]*70,p[1]*70,p[2]*70)-.5):0;
      mr=m>0?dk*.82*(1+.34*(L(i,j,3)-.5)+.16*(L(i,j,4)-.5)+.06*(vnoise(p[0]*55,p[1]*55,p[2]*55)-.5)):0;
      A[k]=hl*(1-m)+mr*m;
      H[k]=(1.1*(1-m)*(.6+.8*L(i,j,5))-1.2*smooth(.05,.95,cov))*KM;}}}
  /* stamp(lat, lon, reach in degrees, f(distance, index, lat, lon)) visits every texel within reach */
  function stamp(clat,clon,rad,f){var cv=vec(clat,clon),j0=Math.max(0,Math.floor((90-clat-rad)/180*TH)),j1=Math.min(TH-1,Math.ceil((90-clat+rad)/180*TH)),jj,ii,la,lo,q,dd,span,iw;
    for(jj=j0;jj<=j1;jj++){la=90-(jj+.5)/TH*180;span=Math.abs(la)>88-rad?181:rad/Math.max(.02,Math.cos(la*D2R))+1;
      for(ii=Math.floor((clon-span+180)/360*TW);ii<=Math.ceil((clon+span+180)/360*TW);ii++){
        iw=((ii%TW)+TW)%TW;if(iw<I0||iw>I1)continue;lo=(iw+.5)/TW*360-180;q=vec(la,lo);dd=angDist(q,cv);
        if(dd<rad)f(dd,jj*TW+iw,la,lo);}}}
  /* a crater: bowl, raised rim, ejecta apron; big ones get flat floors and central peaks */
  function crater(clat,clon,D,kind,fresh){var r=D/2/30.32,dep=(D<15?.2*D:1.04*Math.pow(D,.3))*KM*(kind.indexOf('o')>=0?.45:1),rim=dep*.36,
      fl=kind.indexOf('f')>=0||kind.indexOf('d')>=0?.72:D>40?.45:0,pk=kind.indexOf('p')>=0||(D>35&&kind.indexOf('f')<0&&kind.indexOf('d')<0),
      dark=kind.indexOf('d')>=0,bright=kind.indexOf('b')>=0||kind.indexOf('r')>=0;
    stamp(clat,clon,r*2.6,function(dd,k){var t=dd/r,h,w;
      if(t<1){w=t<fl?0:(t-fl)/(1-fl);h=-dep*(1-w*w)*(fl>0&&kind.indexOf('d')>=0?.7:1)+rim*smooth(.55,1,t)+rim*.35*smooth(.8,1,t);
        if(pk)h+=dep*.55*Math.exp(-t*t/.012);
        if(dark&&t<.9)A[k]=A[k]*.35+.44*.65;
        if(bright)A[k]=Math.min(1.12,A[k]+(kind.indexOf('r')>=0?.2:.12)*smooth(1.15,.8,t));
        else if(fresh)A[k]=Math.min(1.1,A[k]+.08);}
      else{h=rim*Math.exp(-(t-1)*(t-1)/.05)+rim*.35*Math.pow(t,-3)*smooth(2.6,1.6,t);
        if(bright||fresh)A[k]=Math.min(1.1,A[k]+(bright?.1:.05)*smooth(2.4,1,t));}
      H[k]+=h;});}
  S.push(function(){CRATERS.forEach(function(c){crater(c[0],c[1],c[2],c[3],c[3].indexOf('r')>=0);});});
  /* the rest of the pockmarks, fewer on the young seas */
  var mi,ml,mo,D,cm;
  S.push(function(){for(k=0;k<2600;k++){ml=Math.asin(2*rnd()-1)/D2R;mo=rnd()*240-120;D=Math.min(170,12*Math.pow(rnd()+.0005,-.55));
    mi=Math.round((90-ml)/180*TH-.5)*TW+Math.round((mo+180)/360*TW-.5);cm=MS[Math.max(0,Math.min(TW*TH-1,mi))];
    if(rnd()<cm*.88||(cm>.4&&D>45))continue;crater(ml,mo,D,rnd()<.4?'o':'',rnd()<.07);}});
  /* mountain ranges: a noisy ridge along each line */
  S.push(function(){var RG=new Float32Array(TW*TH);
  RIDGES.forEach(function(q){var hk=q[0]*KM,w=q[1],n;for(n=2;n+3<q.length;n+=2)(function(a1,o1,a2,o2){
      var cl=(a1+a2)/2,co=(o1+o2)/2,ca=Math.cos(cl*D2R),ax=(o2-o1)*ca,ay=a2-a1,L2=ax*ax+ay*ay||1e-6,reach=Math.sqrt(L2)/2+w*2.5;
      stamp(cl,co,reach,function(dd,k,la,lo){var dx=(lo-o1)*ca,dy=la-a1,t=Math.max(0,Math.min(1,(dx*ax+dy*ay)/L2)),ex=dx-t*ax,ey=dy-t*ay,d=Math.sqrt(ex*ex+ey*ey),pr=vec(la,lo),
          v=Math.exp(-d*d/(w*w))*(.45+1.1*vnoise(pr[0]*60,pr[1]*60,pr[2]*60))*hk;
        if(v>RG[k])RG[k]=v;});})(q[n],q[n+1],q[n+2],q[n+3]);});
  for(k=0;k<TW*TH;k++)if(RG[k]>0){H[k]+=RG[k];A[k]=Math.min(1.05,A[k]+.12*MS[k]*Math.min(1,RG[k]/(2*KM)));}
  /* Rupes Recta, the Straight Wall: the ground steps down to the west */
  stamp(-22,-7.7,2.6,function(dd,k,la,lo){var x=lo+7.7+(la+22)*.18;H[k]+=(smooth(-.45,.45,x)-.5)*.4*KM*smooth(2.2,1.2,Math.abs(la+22))*smooth(2.4,1.4,Math.abs(x));});});
  /* rays: bright streaks thrown from the young craters */
  S.push(function(){RAYS.forEach(function(q){var c=CRATERS[q[0]],r=c[2]/2/30.32,L=q[1],s=q[2],n=Math.round(10+L*.5),rs=[],z;
    for(z=0;z<n;z++)rs.push([rnd()*Math.PI*2,L*(.35+.65*rnd()),r*(.14+.3*rnd()),.005+.016*rnd(),.5+.7*rnd()]);
    stamp(c[0],c[1],L,function(dd,k,la,lo){if(dd<r*1.05)return;var br=bearing(c[0],c[1],la,lo),sum=0,y,db,x,q;
      for(y=0;y<n;y++){q=rs[y];db=br-q[0];db-=Math.round(db/(2*Math.PI))*2*Math.PI;x=db*dd/(q[2]+dd*q[3]);
        if(x<3&&x>-3)sum+=q[4]*Math.exp(-x*x)*smooth(r*1.1,r*3.2,dd)*(1-smooth(q[1]*.3,q[1],dd));}
      A[k]=Math.min(1.12,A[k]+s*(Math.min(1,sum)*(.45+.9*vnoise(dd*1.4,br*6,c[0]))+.5*smooth(r*3.5,r*1.2,dd)));});});
  stamp(7.5,-59,2.2,function(dd,k){A[k]=Math.min(1.05,A[k]+.14*smooth(2.2,.4,dd));}); });/* Reiner Gamma, the swirl */
  /* slopes for the lighting */
  S.push(function(){T=new Float32Array(TW*TH*4);var dl=360/TW*D2R,dy2=2*180/TH*D2R,cl;
  for(j=0;j<TH;j++){lat=90-(j+.5)/TH*180;cl=Math.max(.08,Math.cos(lat*D2R));
    for(i=0;i<TW;i++){k=j*TW+i;T[k*4]=A[k];T[k*4+3]=H[k];
      if(i<=I0||i>=I1||j===0||j===TH-1)continue;
      T[k*4+1]=(H[k+1]-H[k-1])/(2*dl*cl);T[k*4+2]=(H[k-TW]-H[k+TW])/dy2;}}
  });
  return {S:S,T:function(){return T;}};}
function makeTex(){var t=performance.now(),j=texJob(),i;for(i=0;i<j.S.length;i++)j.S[i]();window.__bakeMs=Math.round(performance.now()-t);return j.T();}
/* at page load: bake in slices so the page paints first, and the Moon develops a moment later */
var texBusy=false;
function bakeTex(done){if(TEX||texBusy)return;texBusy=true;var j=texJob(),i=0,busy=0;
  (function next(){if(TEX){texBusy=false;return done();}var t=performance.now();while(i<j.S.length&&performance.now()-t<16)j.S[i++]();busy+=performance.now()-t;
    if(i<j.S.length)return setTimeout(next,0);TEX=j.T();texBusy=false;window.__bakeMs=Math.round(busy);done();})();}

/* the disc: zenith up, lit side toward the Sun, turned by the parallactic angle, rocked by libration; relief and shadows near the terminator */
var moonBuf=document.createElement('canvas'),RELIEF=3;
function drawMoon(ctx,cx,cy,R,r,o){
  if(!TEX&&!texBusy)TEX=makeTex();
  var S=Math.ceil(R*2+4),c=moonBuf,g,img,px,x,y,u,v,d2,z,xn,yn,P0,P1,P2,la,lo,B,lit,es,aa,idx,dist,mu0,mr,cl,al,gx,gy,hh,tx,ty,x0,y0,fx,fy,xa,xb,r0,r1,w0,w1,w2,w3,
      i0,i1,i2,i3,ee0,ee2,en0,en1,en2,se,sn,st,tanE,di,dj,sh,kk,ex,sx,sy,hk,mv,nn,kz,T=TEX,flat=!T;
  c.width=S;c.height=S;g=c.getContext('2d');img=g.createImageData(S,S);px=img.data;
  var a=(r.axis-r.q)*D2R,b=(r.chi-r.q)*D2R,ii=r.i*D2R,ca=Math.cos(a),sa=Math.sin(a),
      Sx=-Math.sin(ii)*Math.sin(b),Sy=Math.sin(ii)*Math.cos(b),Sz=Math.cos(ii),
      lL=r.libL*D2R,lB=r.libB*D2R,zv=[Math.cos(lB)*Math.sin(lL),Math.sin(lB),Math.cos(lB)*Math.cos(lL)],xv=[Math.cos(lL),0,-Math.sin(lL)],
      yv=[zv[1]*xv[2]-zv[2]*xv[1],zv[2]*xv[0]-zv[0]*xv[2],zv[0]*xv[1]-zv[1]*xv[0]],
      gain=o.gain,earth=o.earth*(1-r.k),half=S/2,tn=o.tint||[1,1,1],cr=255*tn[0],cg=249*tn[1],cb=236*tn[2],
      sxn=Sx*ca+Sy*sa,syn=-Sx*sa+Sy*ca,
      SB0=sxn*xv[0]+syn*yv[0]+Sz*zv[0],SB1=sxn*xv[1]+syn*yv[1]+Sz*zv[1],SB2=sxn*xv[2]+syn*yv[2]+Sz*zv[2],
      K=RELIEF*smooth(8,40,R),shv=smooth(.02,.2,1-Sz),dl=360/TW*D2R,dlat=180/TH*D2R,ds=1.5*dl;
  for(y=0;y<S;y++){v=-(y+.5-half)/R;
    for(x=0;x<S;x++){u=(x+.5-half)/R;d2=u*u+v*v;if(d2>=1+3/R)continue;
      dist=Math.sqrt(d2);aa=Math.max(0,Math.min(1,(1-dist)*R+.5));if(aa<=0)continue;
      z=Math.sqrt(Math.max(0,1-d2));
      xn=u*ca+v*sa;yn=-u*sa+v*ca;
      P0=xn*xv[0]+yn*yv[0]+z*zv[0];P1=xn*xv[1]+yn*yv[1]+z*zv[1];P2=xn*xv[2]+yn*yv[2]+z*zv[2];
      la=Math.asin(Math.max(-1,Math.min(1,P1)))/D2R;lo=Math.atan2(P0,P2)/D2R;
      if(flat)al=.74;else{tx=(lo+180)/360*TW-.5;ty=Math.max(0,Math.min(TH-1.001,(90-la)/180*TH-.5));x0=Math.floor(tx);y0=Math.floor(ty);fx=tx-x0;fy=ty-y0;
      xa=((x0%TW)+TW)%TW;xb=(xa+1)%TW;r0=y0*TW;r1=Math.min(TH-1,y0+1)*TW;
      w0=(1-fx)*(1-fy);w1=fx*(1-fy);w2=(1-fx)*fy;w3=fx*fy;i0=(r0+xa)*4;i1=(r0+xb)*4;i2=(r1+xa)*4;i3=(r1+xb)*4;
      al=T[i0]*w0+T[i1]*w1+T[i2]*w2+T[i3]*w3;}
      mu0=u*Sx+v*Sy+z*Sz;mr=mu0;mv=z;hh=0;sh=1;
      if(K>0&&!flat&&mu0>-.12){kz=z<.3?K*smooth(0,.3,z):K;gx=(T[i0+1]*w0+T[i1+1]*w1+T[i2+1]*w2+T[i3+1]*w3)*kz;gy=(T[i0+2]*w0+T[i1+2]*w1+T[i2+2]*w2+T[i3+2]*w3)*kz;
        hh=(T[i0+3]*w0+T[i1+3]*w1+T[i2+3]*w2+T[i3+3]*w3)*kz;
        cl=Math.sqrt(P0*P0+P2*P2);
        if(cl>.02){ee0=P2/cl;ee2=-P0/cl;en0=-P1*P0/cl;en1=cl;en2=-P1*P2/cl;
          se=SB0*ee0+SB2*ee2;sn=SB0*en0+SB1*en1+SB2*en2;
          nn=1/Math.sqrt(1+gx*gx+gy*gy);mr=(mu0-gx*se-gy*sn)*nn;mv=(z-gx*(zv[0]*ee0+zv[2]*ee2)-gy*(zv[0]*en0+zv[1]*en1+zv[2]*en2))*nn;if(mv<.06){ex=smooth(-.02,.06,mv);mr=mr*ex+mu0*(1-ex);mv=Math.max(.02,mv*ex+z*(1-ex));}
          /* low Sun: walk toward it and see if a rim or a peak stands in the way */
          if(mu0<.3&&mr>0){st=Math.sqrt(se*se+sn*sn);if(st>1e-4){tanE=mu0/st;di=se/st*ds/(dl*Math.max(.08,cl));dj=-sn/st*ds/dlat;ex=0;
            for(kk=1;kk<=7;kk++){sx=((Math.round(tx+di*kk)%TW)+TW)%TW;sy=Math.round(ty+dj*kk);if(sy<0||sy>=TH)break;
              hk=T[(sy*TW+sx)*4+3]*kz-hh-kk*ds*tanE;if(hk>ex)ex=hk;}
            sh=1-shv*smooth(0,.0012,ex);}}}}
      /* Lommel–Seeliger: a full Moon looks flat to the edge, the terminator fades in; peaks catch the Sun a little past it */
      B=mr>0?Math.min(1.3,2*mr/(mr+mv+.02)):0;lit=smooth(-.015,.035,mu0+Math.sqrt(2*Math.max(0,hh)));
      es=earth*(1-smooth(-.015,.035,mu0));B*=sh;
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
var evCaches={},evN=0;
function eventsIn(from,to,lat,lon){var k=lat.toFixed(3)+','+lon.toFixed(3),evCache=evCaches[k];if(!evCache){if(++evN>8){evCaches={};evN=1;}evCache=evCaches[k]={};}
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
var st={place:null,place2:null,mode:'daily',hm:'21:00',n:1,unit:3600000,off:30,frames:30,d0:'',t0:'',slide:0},frames=[],frames2=[],playing=null,thumbs=[];
var slide=$('slide'),sctx=slide.getContext('2d'),slide2=$('slide2'),sctx2=slide2.getContext('2d');

function fillPlaces(){var s=$('place'),h='';PLACES.forEach(function(g){h+='<optgroup label="'+g[0]+'">';g[1].forEach(function(p){h+='<option value="'+p[0]+'">'+p[1]+'</option>';});h+='</optgroup>';});
  s.innerHTML=h+'<option value="custom">Custom latitude / longitude</option>';$('place2').innerHTML=s.innerHTML;
  try{if(Intl.supportedValuesOf){$('zones').innerHTML=Intl.supportedValuesOf('timeZone').map(function(z){return '<option value="'+z+'">';}).join('');}}catch(e){}}
function guessPlace(){var best='london';Object.keys(BYID).forEach(function(k){if(BYID[k].tz===BROWSER_TZ)best=k;});return best;}
function setPlace(id){var p=BYID[id];if(!p)return;st.place={id:id,name:p.name,lat:p.lat,lon:p.lon,tz:p.tz};$('place').value=id;$('lat').value=p.lat;$('lon').value=p.lon;$('tz').value=p.tz;}
/* the second place (compare mode): same instants, its own sky */
function placeOf(id){var p=BYID[id];return p?{id:id,name:p.name,lat:p.lat,lon:p.lon,tz:p.tz}:null;}
function syncCmp(){var on=!!st.place2,b=$('cmp'),q=st.place2;b.setAttribute('aria-expanded',on);b.textContent=on?'\u2212 stop comparing':'+ compare with a second place';$('cmpBox').hidden=!on;
  if(on){$('place2').value=q.id;$('lat2').value=q.lat;$('lon2').value=q.lon;$('tz2').value=q.tz;}}
function cmpOn(){return !!st.place2&&frames.length>0&&frames2.length===frames.length;}
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
  if(q.f)$('frames').value=clamp(+q.f|0,2,100);st.slide=clamp(+q.s|0,0,99);
  if(q.c&&BYID[q.c])st.place2=placeOf(q.c);
  else if(q.clat!=null&&q.clon!=null&&q.clat!==''&&q.clon!==''&&isFinite(+q.clat)&&isFinite(+q.clon)){var la=clamp(+q.clat,-90,90),lo=clamp(+q.clon,-180,180);
    st.place2={id:'custom',name:q.cname?q.cname.slice(0,40):(fmtLat(la)+' '+fmtLon(lo)),lat:la,lon:lo,tz:q.ctz&&validTz(q.ctz)?q.ctz:BROWSER_TZ};}
  return true;}
function writeHash(){if(!st.place)return;var p=st.place,h=p.id!=='custom'?'p='+p.id:'lat='+p.lat+'&lon='+p.lon+'&tz='+encodeURIComponent(p.tz);
  h+='&d='+$('d0').value+'&t='+$('t0').value+'&m='+st.mode;
  if(st.mode==='daily')h+='&hm='+$('hm').value;else if(st.mode==='every')h+='&n='+$('n').value+'&u='+UNIT_KEY[$('unit').value];else h+='&o='+$('off').value;
  h+='&f='+$('frames').value+'&s='+st.slide;
  if(st.place2){var c=st.place2;h+=c.id!=='custom'?'&c='+c.id:'&clat='+c.lat+'&clon='+c.lon+'&ctz='+encodeURIComponent(c.tz);}
  try{history.replaceState(null,'','#'+h);}catch(e){}}
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
    if(!times.length){frames=[];frames2=[];render();status('The Moon never '+(want?'rises':'sets')+' there within 400 days of that date. Polar nights are wild.',true);return;}}
  frames=times.map(function(t){return {t:t,r:Astro.at(t,p.lat,p.lon)};});
  var q2=st.place2;frames2=q2?times.map(function(t){return {t:t,r:Astro.at(t,q2.lat,q2.lon)};}):[];
  st.slide=clamp(st.slide,0,frames.length-1);
  var a=parts(tz,frames[0].t),b=parts(tz,frames[frames.length-1].t);
  $('span').textContent=frames.length+' slides · '+dt(a,a.y!==b.y||FMT.date==='iso')+' → '+dt(b,true)+(q2?' · '+p.name+' and '+q2.name:'');
  status(frames.length<F?'Only found '+frames.length+' '+(st.mode==='rise'?'moonrises':'moonsets')+' in 400 days here.':'');
  makeStrip();render();writeHash();}

/* ---------- the carousel strip ---------- */
function label(f,tz,withDay){var p=parts(tz,f.t);return dt(p,false,withDay)+' '+tm(p);}
function makeStrip(){var s=$('strip'),tz=st.place.tz,two=cmpOn(),q=st.place2,F=frames,F2=frames2;s.innerHTML='';thumbs=[];
  frames.forEach(function(f,i){var b=document.createElement('button'),dn=f.r.alt+f.r.size/2+.5667<0,f2=two?F2[i]:null,dn2=two&&f2.r.alt+f2.r.size/2+.5667<0;
    b.className='mount'+(two?' pair':'')+((two?dn&&dn2:dn)?' below':'');b.type='button';
    b.setAttribute('aria-label','Slide '+(i+1)+': '+label(f,tz,true)+', '+Astro.phaseName(f.r.elong)+', '+Math.round(f.r.k*100)+'% lit'+(dn?', below the horizon':'')+(two?'; '+q.name+': '+label(f2,q.tz,true)+(dn2?', below the horizon':''):''));
    b.innerHTML='<span class="dot"></span><span class="n">'+(i+1)+'</span><canvas width="10" height="10"></canvas>'+(two?'<span class="labs"><span class="lab">'+label(f,tz)+'</span><span class="lab">'+label(f2,q.tz)+'</span></span>':'<span class="lab">'+label(f,tz)+'</span>');
    b.onclick=function(){go(i,true);};s.appendChild(b);thumbs.push(b);});
  var i=0,dpr=Math.min(2,window.devicePixelRatio||1),P=st.place,T=thumbs;
  (function batch(){if(T!==thumbs)return;var end=Math.min(F.length,i+6);for(;i<end;i++){var cv=T[i].querySelector('canvas'),w=Math.round((two?268:132)*dpr),h=Math.round(88*dpr);cv.width=w;cv.height=h;
      if(two)drawPair(cv.getContext('2d'),w,h,F[i],F2[i],P,q,{},{},Math.round(4*dpr),'#e9e2d0');else drawScene(cv.getContext('2d'),w,h,F[i],P,{});}
    if(i<F.length)setTimeout(batch,0);})();}
/* two skies in one picture: each half clipped, so glows never spill across */
function drawPair(g,W,H,fa,fb,pa,pb,oa,ob,gap,gapColor){var w=Math.floor((W-gap)/2);g.fillStyle=gapColor;g.fillRect(0,0,W,H);
  g.save();g.beginPath();g.rect(0,0,w,H);g.clip();drawScene(g,w,H,fa,pa,oa);g.restore();
  g.save();g.translate(W-w,0);g.beginPath();g.rect(0,0,w,H);g.clip();drawScene(g,w,H,fb,pb,ob);g.restore();}
function sceneOpts(f,place){var c=around(f,place),up=f.r.alt+f.r.size/2+.5667>=0,p=parts(place.tz,f.t);
  return {stamp:stampOf(p),place:place.name,note:up?'':(c.nextRise!=null?'rises '+when(c.nextRise,f.t,place.tz):''),detail:true};}
function sizeSlide(cv){var dpr=Math.min(2,window.devicePixelRatio||1),w=Math.round(Math.min(1800,cv.clientWidth*dpr||900)),h=Math.round(w*2/3);if(cv.width!==w){cv.width=w;cv.height=h;}return [w,h];}

/* ---------- the big slide + caption ---------- */
function describeSky(r){var h=r.alt+r.size/2+.5667;if(h>=0)return 'Up in the '+compass(r.az)+', <b>'+Math.max(0,Math.round(r.alt))+'°</b> above the horizon'+(r.alt<8?' · our air tints it orange this low':'');
  return '<span class="down">Below the horizon, '+Math.round(-r.alt)+'° down in the '+compass(r.az)+'</span>';}
function sunText(a){if(a>6)return 'Daylight, the Sun is '+Math.round(a)+'° up';if(a>-0.83)return 'Golden hour, the Sun is low';if(a>-6)return 'Civil twilight, the Sun just set or is about to rise';
  if(a>-12)return 'Nautical twilight';if(a>-18)return 'Astronomical twilight';return 'Full night, the Sun is '+Math.round(-a)+'° below';}
function when(t,ref,tz){var p=parts(tz,t),q=parts(tz,ref);return (dayKey(p)!==dayKey(q)?p.wd+' ':'')+tm(p);}
function clock(r){var th=((r.chi-r.q)%360+360)%360,c=Math.round((360-th)/30)%12;return c===0?12:c;}
function render(){
  var two=!!st.place2;slide2.hidden=!two;$('beam').classList.toggle('cmp',two);
  var wh=sizeSlide(slide),w=wh[0],h=wh[1],wh2=two?sizeSlide(slide2):null;
  if(!frames.length){sctx.fillStyle='#000';sctx.fillRect(0,0,w,h);if(two){sctx2.fillStyle='#000';sctx2.fillRect(0,0,wh2[0],wh2[1]);}$('caption').innerHTML='';$('count').textContent='';renderTable();return;}
  var f=frames[st.slide],r=f.r,tz=st.place.tz,c=around(f,st.place),up=r.alt+r.size/2+.5667>=0,p=parts(tz,f.t),
      note=up?'':(c.nextRise!=null?'rises '+when(c.nextRise,f.t,tz):'');
  drawScene(sctx,w,h,f,st.place,{stamp:stampOf(p),place:st.place.name,note:note,detail:true});
  var rs;if(up)rs=(c.prevRise!=null?'rose '+when(c.prevRise,f.t,tz):'up all day')+' · '+(c.nextSet!=null?'sets <b>'+when(c.nextSet,f.t,tz)+'</b>':'doesn\u2019t set for over a day');
  else rs=(c.prevSet!=null?'set '+when(c.prevSet,f.t,tz):'down all day')+' · '+(c.nextRise!=null?'rises <b>'+when(c.nextRise,f.t,tz)+'</b>':'doesn\u2019t rise for over a day');
  var big=Math.round((r.size/.5181-1)*100),km=Math.round(r.moon.dist/100)*100,also='';
  if(two&&frames2[st.slide]){var f2=frames2[st.slide],r2=f2.r,q=st.place2,z2=q.tz,p2=parts(z2,f2.t),c2=around(f2,q),up2=r2.alt+r2.size/2+.5667>=0;
    drawScene(sctx2,wh2[0],wh2[1],f2,q,sceneOpts(f2,q));
    also='<dt>Compare</dt><dd><b>'+esc(q.name)+'</b> · '+dt(p2,false,true)+', '+tm(p2)+' · '+
      (up2?'up in the '+compass(r2.az)+', '+Math.max(0,Math.round(r2.alt))+'° high'+(c2.nextSet!=null?' · sets '+when(c2.nextSet,f2.t,z2):''):'<span class="down">below the horizon</span>'+(c2.nextRise!=null?' · rises '+when(c2.nextRise,f2.t,z2):''))+
      (r2.k>.03&&r2.k<.97?' · lit side toward '+clock(r2)+' o\u2019clock':'')+'</dd>';
    slide2.setAttribute('aria-label',Astro.phaseName(r2.elong)+', '+(up2?'up in the '+compass(r2.az):'below the horizon')+', '+label(f2,z2,true)+' in '+q.name);}
  $('caption').innerHTML='<h3 class="phase">'+Astro.phaseName(r.elong)+'<small>'+dt(p,true,true)+', '+tm(p)+' · '+esc(st.place.name)+'</small></h3>'+
    '<dt>Lit</dt><dd><b>'+(r.k*100).toFixed(r.k>.995||r.k<.005?1:0)+'%</b> · '+r.age.toFixed(1)+' days since new'+(r.k>.03&&r.k<.97?' · lit side toward '+clock(r)+' o\u2019clock':'')+'</dd>'+
    '<dt>Sky</dt><dd>'+describeSky(r)+'</dd>'+also+
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
var ac=null,soundOn=true,recDest=null;
function clack(){if(!soundOn)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
  var t=ac.currentTime,n=ac.createBuffer(1,ac.sampleRate*.06|0,ac.sampleRate),d=n.getChannelData(0),i;for(i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
  var src=ac.createBufferSource(),bp=ac.createBiquadFilter(),g=ac.createGain();src.buffer=n;bp.type='bandpass';bp.frequency.value=1700;bp.Q.value=2.5;
  g.gain.value=.28;src.connect(bp);bp.connect(g);g.connect(ac.destination);if(recDest)g.connect(recDest);src.start(t);
  var o=ac.createOscillator(),g2=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(60,t+.07);
  g2.gain.setValueAtTime(.18,t);g2.gain.exponentialRampToValueAtTime(.001,t+.09);o.connect(g2);g2.connect(ac.destination);if(recDest)g2.connect(recDest);o.start(t);o.stop(t+.1);}catch(e){}}

/* ---------- playback ---------- */
function play(){if(playing||frames.length<2||rec)return;$('play').textContent='❚❚ Pause';$('play').setAttribute('aria-pressed','true');$('caption').setAttribute('aria-live','off');
  playing=setInterval(function(){go(st.slide+1);},+$('speed').value);}
function stop(){if(!playing)return;clearInterval(playing);playing=null;$('play').textContent='▶ Play';$('play').setAttribute('aria-pressed','false');$('caption').setAttribute('aria-live','polite');writeHash();}

/* ---------- wiring ---------- */
var tmr=null;function rebuild(){clearTimeout(tmr);tmr=setTimeout(function(){st.slide=0;build();},250);}
function init(){
  fillPlaces();
  if(!readHash()){setPlace(guessPlace());$('d0').value=todayIn(st.place.tz);$('t0').value=nowHourIn(st.place.tz);setMode('daily');}
  else setMode(st.mode);
  syncCmp();
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
  $('cmp').onclick=function(){if(st.place2){st.place2=null;frames2=[];}else st.place2=placeOf(st.place.id==='quito'?'london':'quito');syncCmp();build();};
  var tmr2=null;function rebuild2(){clearTimeout(tmr2);tmr2=setTimeout(build,250);}
  $('place2').onchange=function(){if(!st.place2)return;if(this.value==='custom'){st.place2.id='custom';st.place2.name=fmtLat(st.place2.lat)+' '+fmtLon(st.place2.lon);}else st.place2=placeOf(this.value);syncCmp();rebuild2();};
  function custom2(){var la=+$('lat2').value,lo=+$('lon2').value;if(!st.place2)return;if(!isFinite(la)||!isFinite(lo)||$('lat2').value===''||$('lon2').value===''||Math.abs(la)>90||Math.abs(lo)>180){status('Latitude runs from \u221290 to 90, longitude from \u2212180 to 180.',true);return;}
    st.place2={id:'custom',name:fmtLat(la)+' '+fmtLon(lo),lat:la,lon:lo,tz:st.place2.tz};$('place2').value='custom';rebuild2();}
  $('lat2').oninput=custom2;$('lon2').oninput=custom2;
  $('tz2').onchange=function(){var z=this.value.trim();if(!st.place2)return;if(!validTz(z)){status('I don\u2019t know the time zone \u201c'+z+'\u201d. Try one like America/Guayaquil.',true);return;}st.place2.tz=z;if(st.place2.id!=='custom'){st.place2.id='custom';$('place2').value='custom';}rebuild2();};
  $('now').onclick=function(){$('d0').value=todayIn(st.place.tz);var p=parts(st.place.tz,Date.now());$('t0').value=hhmm(p);rebuild();};
  ['d0','t0','hm','n','unit','off','frames'].forEach(function(id){$(id).addEventListener('change',rebuild);});
  each('input[name=mode]',function(x){x.onchange=function(){setMode(this.value);rebuild();};});
  $('prev').onclick=function(){stop();go(st.slide-1,true);};$('next').onclick=function(){stop();go(st.slide+1,true);};
  $('play').onclick=function(){playing?stop():play();};
  $('speed').onchange=function(){if(playing){stop();play();}};
  $('sound').onclick=function(){soundOn=!soundOn;this.setAttribute('aria-pressed',soundOn);this.textContent=soundOn?'🔊':'🔈';};
  tableOn=window.matchMedia?!window.matchMedia('(max-width:640px)').matches:true;$('tbl').setAttribute('aria-pressed',tableOn);
  function flipTable(){tableOn=!tableOn;$('tbl').setAttribute('aria-pressed',tableOn);renderTable();if(tableOn&&window.innerWidth<=640)$('tableBox').scrollIntoView({block:'nearest',behavior:'smooth'});}
  $('tbl').onclick=flipTable;slide.onclick=flipTable;slide2.onclick=flipTable;
  $('clock').value=FMT.clock;$('datef').value=FMT.date;
  $('clock').onchange=$('datef').onchange=function(){FMT.clock=$('clock').value;FMT.date=$('datef').value;try{localStorage.setItem('moonCarousel.fmt',JSON.stringify(FMT));}catch(e){}build();};
  $('save').onclick=saveSlide;$('share').onclick=share;$('vid').onclick=saveVideo;$('sheet').onclick=saveSheet;
  document.addEventListener('keydown',function(e){var t=e.target.tagName;if(t==='INPUT'||t==='SELECT'||t==='TEXTAREA')return;
    if(e.key==='ArrowRight'){stop();go(st.slide+1,true);e.preventDefault();}else if(e.key==='ArrowLeft'){stop();go(st.slide-1,true);e.preventDefault();}
    else if(e.key===' '&&t!=='BUTTON'){playing?stop():play();e.preventDefault();}});
  var rt=null;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(render,120);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){render();});
  bakeTex(function(){if(frames.length){makeStrip();centerThumb(false);}render();});
  build();
  centerThumb(false);
  window.__moonReady=true;document.title='Moon Carousel';}

function saveSlide(){if(!TEX)TEX=makeTex();if(!frames.length)return;if(cmpOn())return savePair();var f=frames[st.slide],tz=st.place.tz,p=parts(tz,f.t),W=1500,H=1000,cv=document.createElement('canvas');cv.width=W;cv.height=H+150;
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
/* ---------- downloads, the paired slide, the video, and the contact sheet ---------- */
var lastDl=null;
function download(blob,name){lastDl={name:name,size:blob.size,type:blob.type};var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href);},60000);}
function slug(p){return p.id==='custom'?'sky':p.id;}
function ymd(p){return p.y+pad(p.mo)+pad(p.d);}
function fit(g,s,max){if(g.measureText(s).width<=max)return s;while(s.length>3&&g.measureText(s+'\u2026').width>max)s=s.slice(0,-1);return s+'\u2026';}
function skyShort(r){return r.alt+r.size/2+.5667>=0?'up in the '+compass(r.az)+', '+Math.max(0,Math.round(r.alt))+'° high':'below the horizon';}
function savePair(){if(!TEX)TEX=makeTex();var f=frames[st.slide],f2=frames2[st.slide],P=st.place,Q=st.place2,p=parts(P.tz,f.t),SW=1080,SH=720,W=30+SW+20+SW+30,H=30+SH+150,cv=document.createElement('canvas');cv.width=W;cv.height=H;
  var g=cv.getContext('2d');g.fillStyle='#e9e2d0';g.fillRect(0,0,W,H);
  [[f,P,30],[f2,Q,30+SW+20]].forEach(function(a){var inner=document.createElement('canvas'),pp=parts(a[1].tz,a[0].t);inner.width=SW;inner.height=SH;
    drawScene(inner.getContext('2d'),SW,SH,a[0],a[1],sceneOpts(a[0],a[1]));g.drawImage(inner,a[2],30);
    g.font='300 24px "IBM Plex Mono",monospace';g.fillStyle='#5b574b';g.textAlign='left';g.textBaseline='alphabetic';
    g.fillText(fit(g,a[1].name+' · '+dt(pp,true,true)+', '+tm(pp)+' · '+skyShort(a[0].r),SW-8),a[2]+4,30+SH+112);});
  g.fillStyle='#2b2a33';g.font='italic 60px "Instrument Serif",Georgia,serif';g.fillText(Astro.phaseName(f.r.elong)+' · '+Math.round(f.r.k*100)+'% lit',34,30+SH+62);
  g.font='40px "Reenie Beanie",cursive';g.textAlign='right';g.fillStyle='#8a826c';g.fillText('Moon Carousel',W-36,30+SH+62);
  cv.toBlob(function(b){if(!b){status('Couldn\u2019t make the picture, sorry.',true);return;}
    download(b,'moon-'+slug(P)+'-vs-'+slug(Q)+'-'+ymd(p)+'-'+pad(p.h)+pad(p.mi)+'.png');status('Slide saved.');},'image/png');}

/* the video: the carousel played through, ~1.5 s a slide, recorded off a canvas as WebM */
var rec=null,VSEC=1.5;
function webmType(audio){if(!window.MediaRecorder)return null;var L=audio?['video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/webm']:['video/webm;codecs=vp8','video/webm;codecs=vp9','video/webm'],i;
  if(typeof MediaRecorder.isTypeSupported!=='function')return 'video/webm';
  for(i=0;i<L.length;i++){try{if(MediaRecorder.isTypeSupported(L[i]))return L[i];}catch(e){}}return null;}
function vnote(msg,err,frac){var n=$('vidnote');n.hidden=false;n.className='vidnote'+(err?' err':'');$('vmsg').textContent=msg;
  $('vbarBox').hidden=frac==null;if(frac!=null)$('vbar').style.width=Math.round(frac*100)+'%';$('sheet').hidden=!err;}
function vidBtn(i,n){var b=$('vid');if(i==null){b.textContent='Save video';b.className='btn';b.setAttribute('aria-pressed','false');b.removeAttribute('aria-label');return;}
  b.textContent='Stop '+i+'/'+n;b.className='btn rec';b.setAttribute('aria-pressed','true');b.setAttribute('aria-label','Stop recording, slide '+i+' of '+n);}
function noVideo(why){vnote(why+' You can save all the slides as one picture instead.',true);}
function saveVideo(){if(!TEX)TEX=makeTex();if(rec){rec.stop(true);return;}if(!frames.length)return;
  var AC=window.AudioContext||window.webkitAudioContext,audio=soundOn&&!!AC,type=webmType(audio),cv=document.createElement('canvas');
  if(!type&&audio){audio=false;type=webmType(false);}
  if(!window.MediaRecorder||!type||typeof cv.captureStream!=='function'){noVideo('This browser can\u2019t record WebM video (some Safari versions can\u2019t).');return;}
  stop();
  var F=frames.slice(),F2=frames2.slice(),P=st.place,Q=st.place2,two=cmpOn(),W=two?1456:1200,H=two?480:800,g,stream,mr,chunks=[],cache={},cancelled=false,failed='',t0=0,timer=null,cur=-1,total=F.length*VSEC+.6;
  cv.width=W;cv.height=H;g=cv.getContext('2d');
  function pic(i){if(cache[i])return cache[i];var c=document.createElement('canvas'),x;c.width=W;c.height=H;x=c.getContext('2d');
    if(two)drawPair(x,W,H,F[i],F2[i],P,Q,sceneOpts(F[i],P),sceneOpts(F2[i],Q),16,'#07080b');else drawScene(x,W,H,F[i],P,sceneOpts(F[i],P));
    return cache[i]=c;}
  try{g.drawImage(pic(0),0,0);stream=cv.captureStream(25);
    if(audio){try{ac=ac||new AC();if(ac.state==='suspended')ac.resume();recDest=ac.createMediaStreamDestination();stream.addTrack(recDest.stream.getAudioTracks()[0]);}catch(e){recDest=null;}}
    mr=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:5e6});}
  catch(e){recDest=null;noVideo('Video recording couldn\u2019t start in this browser.');return;}
  mr.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
  mr.onerror=function(e){failed=(e&&e.error&&e.error.name)||'error';if(mr.state!=='inactive')mr.stop();};
  mr.onstop=function(){clearInterval(timer);recDest=null;rec=null;vidBtn();
    if(failed){noVideo('The recorder stopped with an error ('+failed+').');return;}
    if(cancelled){vnote('Recording stopped, nothing saved.',false);return;}
    var blob=new Blob(chunks,{type:'video/webm'});
    if(blob.size<2000){noVideo('The recording came out empty in this browser.');return;}
    download(blob,'moon-carousel-'+slug(P)+(two?'-vs-'+slug(Q):'')+'-'+ymd(parts(P.tz,F[0].t))+'.webm');
    vnote('Video saved: '+F.length+' slides, '+Math.round(total)+' s, '+(blob.size/1048576).toFixed(1)+' MB.',false);};
  function frame(){var e=(performance.now()-t0)/1000,i=Math.min(F.length-1,Math.floor(e/VSEC)),u;
    if(i!==cur){cur=i;delete cache[i-1];if(i<frames.length&&frames[i].t===F[i].t)go(i); /* the projector on screen plays along (and clacks into the video) */
      vidBtn(i+1,F.length);vnote('Recording slide '+(i+1)+' of '+F.length+' \u2014 keep this tab open. Tap Stop to cancel.',false,(i+1)/F.length);}
    g.globalCompositeOperation='source-over';g.drawImage(pic(i),0,0);u=(e-i*VSEC)/.32;
    if(u<1){var b=u<.35?.05+1.2*u/.35:1.25-.25*(u-.35)/.65; /* the same clack flash as the projector */
      if(b<1){g.fillStyle='rgba(0,0,0,'+(1-b).toFixed(3)+')';g.fillRect(0,0,W,H);}else{g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,214,160,'+((b-1)*.45).toFixed(3)+')';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';}}
    if(i+1<F.length&&e-i*VSEC>.5)pic(i+1); /* mount the next slide early */
    if(e>=total){clearInterval(timer);if(mr.state!=='inactive')mr.stop();}}
  rec={mr:mr,type:type,W:W,H:H,n:F.length,audio:!!recDest,at:function(){return cur;},stop:function(c){cancelled=!!c;clearInterval(timer);if(mr.state!=='inactive')mr.stop();}};
  try{mr.start(1000);}catch(e){rec=null;recDest=null;noVideo('Video recording couldn\u2019t start in this browser.');return;}
  t0=performance.now();frame();timer=setInterval(frame,40);}
/* the fallback: every slide on one sheet, like a photographer's contact print */
function saveSheet(){if(!TEX)TEX=makeTex();if(!frames.length)return;vnote('Making the picture\u2026',false);setTimeout(function(){
  var two=cmpOn(),F=frames,F2=frames2,P=st.place,Q=st.place2,n=F.length,sw=two?240:300,sh=two?160:200,gap=two?6:0,cw=two?sw*2+gap:sw,cols=Math.min(n,two?3:5),rows=Math.ceil(n/cols),
      pad=24,mt=14,cardW=cw+mt*2,cardH=mt+sh+46,W=pad+cols*(cardW+pad),H=118+rows*(cardH+pad),cv=document.createElement('canvas'),g,p0=parts(P.tz,F[0].t);
  cv.width=W;cv.height=H;g=cv.getContext('2d');g.fillStyle='#121319';g.fillRect(0,0,W,H);
  g.textAlign='left';g.textBaseline='alphabetic';g.fillStyle='#efe7d4';g.font='italic 56px "Instrument Serif",Georgia,serif';g.fillText('Moon Carousel',pad,66);
  g.fillStyle='#a39b87';g.font='300 20px "IBM Plex Mono",monospace';g.fillText(fit(g,$('span').textContent,W-pad*2),pad,98);
  F.forEach(function(f,i){var x=pad+(i%cols)*(cardW+pad),y=118+Math.floor(i/cols)*(cardH+pad);
    g.fillStyle='#e9e2d0';g.fillRect(x,y,cardW,cardH);g.save();g.translate(x+mt,y+mt);
    if(two)drawPair(g,cw,sh,f,F2[i],P,Q,{},{},gap,'#e9e2d0');else{g.beginPath();g.rect(0,0,sw,sh);g.clip();drawScene(g,sw,sh,f,P,{});}g.restore();
    g.textAlign='left';g.textBaseline='alphabetic';g.fillStyle='#2b2a33';g.font='28px "Reenie Beanie",cursive';g.fillText(fit(g,label(f,P.tz),sw-4),x+mt,y+mt+sh+33);
    if(two)g.fillText(fit(g,label(F2[i],Q.tz),sw-4),x+mt+sw+gap,y+mt+sh+33);
    g.textAlign='right';g.fillStyle='#8a826c';g.font='500 12px "IBM Plex Mono",monospace';g.fillText(String(i+1),x+cardW-6,y+11);});
  cv.toBlob(function(b){if(!b){vnote('Couldn\u2019t make the picture in this browser, sorry. Save slide still works one at a time.',true);$('sheet').hidden=true;return;}
    download(b,'moon-carousel-'+slug(P)+(two?'-vs-'+slug(Q):'')+'-'+ymd(p0)+'-slides.png');vnote('Saved all '+n+' slides as one picture.',false);},'image/png');},30);}
window.__moon={stampOf:stampOf,drawMoon:drawMoon,tex:function(){if(!TEX)TEX=makeTex();return TEX;},texBusy:function(){return texBusy;},build:function(){build();},frames:function(){return frames;},frames2:function(){return frames2;},st:st,go:go,drawScene:drawScene,parts:parts,wallToUTC:wallToUTC,
  rec:function(){return rec;},lastDl:function(){return lastDl;},webmType:webmType};
init();
})();
