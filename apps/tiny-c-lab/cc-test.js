const { runC } = require('./cc-core.js');
let pass=0, fail=0;
function t(name, src, expect){
  const r = runC(src);
  const got = r.ok ? r.output : ('!'+r.error);
  if(got === expect){ pass++; console.log(' ✓', name); }
  else { fail++; console.log(' ✗', name, '\n     expected:', JSON.stringify(expect), '\n     got:     ', JSON.stringify(got)); }
}
t('hello','#include <stdio.h>\nint main(){ printf("Hello, World!\\n"); return 0; }','Hello, World!\n');
t('int arith','int main(){ printf("%d\\n", 7/2); }','3\n');
t('float div','int main(){ double x=7; printf("%.1f\\n", x/2); }','3.5\n');
t('printf mix','int main(){ printf("%d %c %s %.2f\\n", 65, 66, "hi", 3.14159); }','65 B hi 3.14\n');
t('width/pad','int main(){ printf("[%5d][%-5d][%05d]\\n", 42, 42, 42); }','[   42][42   ][00042]\n');
t('hex','int main(){ printf("%x %X %#x\\n", 255, 255, 255); }','ff FF ff\n');
t('for loop','int main(){ int s=0; for(int i=1;i<=5;i++) s+=i; printf("%d\\n", s); }','15\n');
t('while','int main(){ int i=0; while(i<3){ printf("%d",i); i++; } printf("\\n"); }','012\n');
t('do-while','int main(){ int i=5; do{ printf("%d",i); i--; }while(i>3); printf("\\n"); }','54\n');
t('if-else','int main(){ int x=7; if(x%2==0) printf("even\\n"); else printf("odd\\n"); }','odd\n');
t('recursion-fib','int fib(int n){ if(n<2) return n; return fib(n-1)+fib(n-2); }\nint main(){ printf("%d\\n", fib(10)); }','55\n');
t('recursion-fact','int fact(int n){ return n<=1?1:n*fact(n-1); }\nint main(){ printf("%d\\n", fact(6)); }','720\n');
t('array','int main(){ int a[5]; for(int i=0;i<5;i++) a[i]=i*i; int s=0; for(int i=0;i<5;i++) s+=a[i]; printf("%d\\n",s); }','30\n');
t('array-init','int main(){ int a[]={3,1,4,1,5}; printf("%d %d\\n", a[0], a[4]); }','3 5\n');
t('fizzbuzz','int main(){ for(int i=1;i<=15;i++){ if(i%15==0) printf("FizzBuzz\\n"); else if(i%3==0) printf("Fizz\\n"); else if(i%5==0) printf("Buzz\\n"); else printf("%d\\n",i);} }',
  '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n');
t('break-continue','int main(){ for(int i=0;i<10;i++){ if(i==3) continue; if(i==6) break; printf("%d",i);} printf("\\n"); }','01245\n');
t('nested-loops','int main(){ for(int i=1;i<=3;i++){ for(int j=1;j<=3;j++) printf("%d",i*j); printf("\\n"); } }','123\n246\n369\n');
t('bitwise','int main(){ printf("%d %d %d %d\\n", 5&3, 5|2, 5^1, 1<<4); }','1 7 4 16\n');
t('ternary-chain','int main(){ int x=5; printf("%s\\n", x>0?"pos":x<0?"neg":"zero"); }','pos\n');
t('define','#define N 5\n#define GREET "hi"\nint main(){ printf("%s %d\\n", GREET, N*N); }','hi 25\n');
t('logic-short','int f(){ printf("called"); return 1; }\nint main(){ if(0 && f()) ; printf("done\\n"); }','done\n');
t('putchar','int main(){ for(char c=65;c<=70;c++) putchar(c); putchar(10); }','ABCDEF\n');
t('global-var','int counter=100;\nvoid bump(){ counter+=5; }\nint main(){ bump(); bump(); printf("%d\\n",counter); }','110\n');
t('sqrt','#include <math.h>\nint main(){ printf("%.1f\\n", sqrt(16.0)); }','4.0\n');
t('char-string-idx','int main(){ char* s="abc"; printf("%c%c\\n", s[0], s[2]); }','ac\n');
t('comment','int main(){ /* block */ int x=5; // line\n printf("%d\\n",x); }','5\n');
t('prefix-postfix','int main(){ int i=5; printf("%d %d %d\\n", i++, ++i, i); }','5 7 7\n');
t('compound-assign','int main(){ int x=10; x*=3; x-=5; x/=5; printf("%d\\n",x); }','5\n');
t('swap-in-if','int main(){int a[2]={1,2};if(a[0]<a[1]){int t=a[0];a[0]=a[1];a[1]=t;}printf("%d%d\\n",a[0],a[1]);}','21\n');
t('bubble-full','int main(){int a[]={5,2,9,1,7};int n=5;for(int i=0;i<n-1;i++)for(int j=0;j<n-1-i;j++)if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;}for(int i=0;i<n;i++)printf("%d",a[i]);printf("\\n");}','12579\n');
t('decl-sees-outer','int main(){int x=10;{int y=x+5;printf("%d\\n",y);}}','15\n');
// error paths
function err(name, src, frag){ const r=runC(src); if(!r.ok && r.error.includes(frag)){ pass++; console.log(' ✓',name); } else { fail++; console.log(' ✗',name,'→',JSON.stringify(r.ok?r.output:r.error)); } }
err('no-main','int foo(){ return 0; }','no main');
err('div-zero','int main(){ printf("%d", 5/0); }','division by zero');
err('undef-var','int main(){ return x; }','undefined variable');
err('infinite-loop','int main(){ while(1){} }','operations');
err('syntax','int main({ }','expected');
console.log('\n'+pass+'/'+(pass+fail)+' checks green'+(fail?' — '+fail+' FAILED':''));
process.exit(fail?1:0);
