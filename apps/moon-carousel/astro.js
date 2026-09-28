/* Moon Carousel astronomy: Meeus, Astronomical Algorithms (2nd ed.), ch. 12, 22 (main nutation term), 25 (Sun, low precision),
   47 (Moon, the larger terms of tables 47.A/B), 48 (phase angle, bright limb). Accurate to a few arcminutes, plenty for a picture. */
var Astro=(function(){
var D2R=Math.PI/180,R2D=180/Math.PI;
function n360(a){a%=360;return a<0?a+360:a;}
function sin(d){return Math.sin(d*D2R);}function cos(d){return Math.cos(d*D2R);}
function jd(ms){return ms/86400000+2440587.5;}
/* TT − UT in seconds (Espenak & Meeus polynomials, trimmed) */
function deltaT(y){var t;
  if(y>=2005&&y<2050){t=y-2000;return 62.92+.32217*t+.005589*t*t;}
  if(y>=1986&&y<2005){t=y-2000;return 63.86+.3345*t-.060374*t*t+.0017275*t*t*t+.000651814*t*t*t*t+.00002373599*t*t*t*t*t;}
  if(y>=1961&&y<1986){t=y-1975;return 45.45+1.067*t-t*t/260-t*t*t/718;}
  if(y>=1941&&y<1961){t=y-1950;return 29.07+.407*t-t*t/233+t*t*t/2547;}
  if(y>=1920&&y<1941){t=y-1920;return 21.20+.84493*t-.076100*t*t+.0020936*t*t*t;}
  if(y>=2050&&y<2150){return -20+32*Math.pow((y-1820)/100,2)-.5628*(2150-y);}
  var u=(y-1820)/100;return -20+32*u*u;}
/* table 47.A: D M M' F Σl(1e-6°) Σr(1e-3 km) */
var LR=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],
[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],
[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],
[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],
[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],
[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],
[2,-1,-2,0,2390,10056],[1,0,1,0,-2348,6322],[2,-2,0,0,2236,-9884],[0,1,2,0,-2120,5751],[0,2,0,0,-2069,0],
[2,-2,-1,0,2048,-4950],[2,0,1,-2,-1773,4130],[2,0,0,2,-1595,0],[4,-1,-1,0,1215,-3958],[0,0,2,2,-1110,0],
[3,0,-1,0,-892,3258],[2,1,1,0,-810,2616],[4,-1,-2,0,759,-1897],[0,2,-1,0,-713,-2117],[2,2,-1,0,-700,2354],
[2,1,-2,0,691,0],[2,-1,0,-2,596,0],[4,0,1,0,549,-1423],[0,0,4,0,537,-1117],[4,-1,0,0,520,-1571],
[1,0,-2,0,-487,-1739],[2,1,0,-2,-399,0],[0,0,2,-2,-381,-4421],[1,1,1,0,351,0],[3,0,-2,0,-340,0],
[4,0,-3,0,330,0],[2,-1,2,0,327,0],[0,2,1,0,-323,1165],[1,1,-1,0,299,0],[2,0,3,0,294,0],[2,0,-1,-2,0,8752]];
/* table 47.B: D M M' F Σb(1e-6°) */
var B=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],
[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],
[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794],
[0,0,0,3,-1749],[0,1,-1,1,-1565],[1,0,0,1,-1491],[0,1,1,1,-1475],[0,1,1,-1,-1410],[0,1,0,-1,-1344],[1,0,0,-1,-1335],
[0,0,3,1,1107],[4,0,0,-1,1021],[4,0,-1,1,833]];
function moonEcl(T){
  var Lp=n360(218.3164477+481267.88123421*T-.0015786*T*T+T*T*T/538841-T*T*T*T/65194000),
      D=n360(297.8501921+445267.1114034*T-.0018819*T*T+T*T*T/545868-T*T*T*T/113065000),
      M=n360(357.5291092+35999.0502909*T-.0001536*T*T+T*T*T/24490000),
      Mp=n360(134.9633964+477198.8675055*T+.0087414*T*T+T*T*T/69699-T*T*T*T/14712000),
      F=n360(93.2720950+483202.0175233*T-.0036539*T*T-T*T*T/3526000+T*T*T*T/863310000),
      A1=n360(119.75+131.849*T),A2=n360(53.09+479264.290*T),A3=n360(313.45+481266.484*T),
      E=1-.002516*T-.0000074*T*T,sl=0,sr=0,sb=0,i,r,a,e;
  for(i=0;i<LR.length;i++){r=LR[i];a=r[0]*D+r[1]*M+r[2]*Mp+r[3]*F;e=Math.abs(r[1])===1?E:Math.abs(r[1])===2?E*E:1;sl+=r[4]*e*sin(a);sr+=r[5]*e*cos(a);}
  for(i=0;i<B.length;i++){r=B[i];a=r[0]*D+r[1]*M+r[2]*Mp+r[3]*F;e=Math.abs(r[1])===1?E:Math.abs(r[1])===2?E*E:1;sb+=r[4]*e*sin(a);}
  sl+=3958*sin(A1)+1962*sin(Lp-F)+318*sin(A2);
  sb+=-2235*sin(Lp)+382*sin(A3)+175*sin(A1-F)+175*sin(A1+F)+127*sin(Lp-Mp)-115*sin(Lp+Mp);
  return {lon:n360(Lp+sl/1e6),lat:sb/1e6,dist:385000.56+sr/1000,F:F};}
function sunEcl(T){
  var L0=280.46646+36000.76983*T+.0003032*T*T,M=357.52911+35999.05029*T-.0001537*T*T,e=.016708634-.000042037*T-.0000001267*T*T,
      C=(1.914602-.004817*T-.000014*T*T)*sin(M)+(.019993-.000101*T)*sin(2*M)+.000289*sin(3*M),v=M+C,
      R=1.000001018*(1-e*e)/(1+e*cos(v));
  return {lon:n360(L0+C),dist:R*149597870.7};}
function eq(lon,lat,eps){var a=Math.atan2(sin(lon)*cos(eps)-Math.tan(lat*D2R)*sin(eps),cos(lon)),d=Math.asin(sin(lat)*cos(eps)+cos(lat)*sin(eps)*sin(lon));return {ra:n360(a*R2D),dec:d*R2D};}
/* position angle (from north through east) of point 2 as seen from point 1 */
function pa(ra1,dec1,ra2,dec2){return n360(Math.atan2(cos(dec2)*sin(ra2-ra1),sin(dec2)*cos(dec1)-cos(dec2)*sin(dec1)*cos(ra2-ra1))*R2D);}
/* everything the picture needs, for a moment (ms since 1970, UT) and a place (degrees, east +) */
function at(ms,lat,lon){
  var J=jd(ms),y=new Date(ms).getUTCFullYear(),JDE=J+deltaT(y)/86400,T=(JDE-2451545)/36525,Tu=(J-2451545)/36525,
      Om=125.04452-1934.136261*T,dpsi=(-17.20*sin(Om)-1.32*sin(2*(280.4665+36000.7698*T))-.23*sin(2*(218.3165+481267.8813*T))+.21*sin(2*Om))/3600,
      deps=(9.20*cos(Om)+.57*cos(2*(280.4665+36000.7698*T))+.10*cos(2*(218.3165+481267.8813*T))-.09*cos(2*Om))/3600,
      eps0=23.4392911-.0130042*T-1.64e-7*T*T+5.04e-7*T*T*T,eps=eps0+deps,
      m=moonEcl(T),s=sunEcl(T),
      mq=eq(m.lon+dpsi,m.lat,eps),sq=eq(s.lon+dpsi-.00569,0,eps),
      psi=Math.acos(Math.max(-1,Math.min(1,sin(sq.dec)*sin(mq.dec)+cos(sq.dec)*cos(mq.dec)*cos(sq.ra-mq.ra))))*R2D,
      i=n360(Math.atan2(s.dist*sin(psi),m.dist-s.dist*cos(psi))*R2D),k=(1+cos(i))/2,
      chi=pa(mq.ra,mq.dec,sq.ra,sq.dec),
      /* lunar north ≈ the ecliptic pole's direction (the Moon's axis leans only 1.5° off it) */
      pole=eq(0,90,eps),axis=pa(mq.ra,mq.dec,pole.ra,pole.dec),
      gmst=n360(280.46061837+360.98564736629*(J-2451545)+.000387933*Tu*Tu-Tu*Tu*Tu/38710000),lst=n360(gmst+lon+dpsi*cos(eps)),
      H=lst-mq.ra,Hs=lst-sq.ra,
      alt=Math.asin(sin(lat)*sin(mq.dec)+cos(lat)*cos(mq.dec)*cos(H))*R2D,
      az=n360(Math.atan2(sin(H),cos(H)*sin(lat)-Math.tan(mq.dec*D2R)*cos(lat))*R2D+180),
      altTopo=alt-Math.asin(6378.14/m.dist)*R2D*cos(alt),
      sunAlt=Math.asin(sin(lat)*sin(sq.dec)+cos(lat)*cos(sq.dec)*cos(Hs))*R2D,
      sunAz=n360(Math.atan2(sin(Hs),cos(Hs)*sin(lat)-Math.tan(sq.dec*D2R)*cos(lat))*R2D+180),
      q=Math.atan2(sin(H),Math.tan(lat*D2R)*cos(mq.dec)-sin(mq.dec)*cos(H))*R2D,
      elong=n360(m.lon-s.lon),   /* 0 new · 90 first quarter · 180 full · 270 last quarter */
      /* optical libration (ch. 53): which side of the Moon leans toward us, the 'wobble' */
      Omn=125.0445479-1934.1362891*T,W=m.lon+dpsi-Omn,Ii=1.54242,
      lA=Math.atan2(sin(W)*cos(m.lat)*cos(Ii)-sin(m.lat)*sin(Ii),cos(W)*cos(m.lat))*R2D,
      libL=((lA-m.F)%360+540)%360-180,libB=Math.asin(-sin(W)*cos(m.lat)*sin(Ii)-sin(m.lat)*cos(Ii))*R2D;
  return {jd:J,moon:{lon:m.lon,lat:m.lat,dist:m.dist,ra:mq.ra,dec:mq.dec},sun:{ra:sq.ra,dec:sq.dec,dist:s.dist},
    psi:psi,i:i,k:k,chi:chi,axis:axis,q:q,alt:altTopo,az:az,sunAlt:sunAlt,sunAz:sunAz,elong:elong,waxing:elong<180,
    libL:libL,libB:libB,age:elong/360*29.530589,size:.5181*384400/m.dist};}   /* apparent diameter in degrees */
/* rise/set = the upper limb on the horizon: topocentric centre altitude + semi-diameter + 34′ of refraction = 0 */
function h0(ms,lat,lon){var r=at(ms,lat,lon);return {r:r,h:r.alt+r.size/2+.5667};}
/* rise and set within [from, to): a coarse 10-minute scan, then bisection to the second */
function riseSet(from,to,lat,lon){
  var out=[],step=600000,t=from,a=h0(t,lat,lon).h,b,t2,lo,hi,j,mid,hm;
  for(;t<to;t=t2,a=b){t2=Math.min(to,t+step);b=h0(t2,lat,lon).h;
    if((a<0)!==(b<0)){lo=t;hi=t2;for(j=0;j<20;j++){mid=(lo+hi)/2;hm=h0(mid,lat,lon).h;if((hm<0)===(a<0))lo=mid;else hi=mid;}
      out.push({t:Math.round((lo+hi)/2),rise:a<0});}}
  return out;}
function phaseName(e){return e<6.5||e>=353.5?'New Moon':e<83.5?'Waxing Crescent':e<96.5?'First Quarter':e<173.5?'Waxing Gibbous':e<186.5?'Full Moon':e<263.5?'Waning Gibbous':e<276.5?'Last Quarter':'Waning Crescent';}
return {at:at,riseSet:riseSet,phaseName:phaseName,moonEcl:moonEcl,sunEcl:sunEcl,deltaT:deltaT,jd:jd};
})();
if(typeof module!=='undefined')module.exports=Astro;
