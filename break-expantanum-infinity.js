//Maximum Growth Rate - Expansion:Ackermannian

;(function (globalScope) {
  "use strict";
  const OmegaNum=(function(){"use strict";var e={maxArrow:1e3,serializeMode:0,debug:0},t="[OmegaNumError] ",n=t+"Invalid argument: ",i=/^[-\+]*(Infinity|NaN|(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/,a=Math.log10(9007199254740991),o={},u={},s={ZERO:0,ONE:1};s.E=Math.E,s.LN2=Math.LN2,s.LN10=Math.LN10,s.LOG2E=Math.LOG2E,s.LOG10E=Math.LOG10E,s.PI=Math.PI,s.SQRT1_2=Math.SQRT1_2,s.SQRT2=Math.SQRT2,s.MAX_SAFE_INTEGER=9007199254740991,s.MIN_SAFE_INTEGER=Number.MIN_SAFE_INTEGER,s.NaN=Number.NaN,s.NEGATIVE_INFINITY=Number.NEGATIVE_INFINITY,s.POSITIVE_INFINITY=Number.POSITIVE_INFINITY,s.E_MAX_SAFE_INTEGER="e9007199254740991",s.EE_MAX_SAFE_INTEGER="ee9007199254740991",s.TETRATED_MAX_SAFE_INTEGER="10^^9007199254740991",o.absoluteValue=o.abs=function(){var r=this.clone();return r.sign=1,r},u.absoluteValue=u.abs=function(r){return new e(r).abs()},o.negate=o.neg=function(){var r=this.clone();return r.sign=-1*r.sign,r},u.negate=u.neg=function(r){return new e(r).neg()},o.compareTo=o.cmp=function(r){if(r instanceof e||(r=new e(r)),isNaN(this.array[0])||isNaN(r.array[0]))return NaN;if(this.array[0]==1/0&&r.array[0]!=1/0)return this.sign;if(this.array[0]!=1/0&&r.array[0]==1/0)return-r.sign;if(1==this.array.length&&0===this.array[0]&&1==r.array.length&&0===r.array[0])return 0;if(this.sign!=r.sign)return this.sign;var t,n=this.sign;if(this.array.length>r.array.length)t=1;else if(this.array.length<r.array.length)t=-1;else{for(var i=this.array.length-1;i>=0;--i){if(this.array[i]>r.array[i]){t=1;break}if(this.array[i]<r.array[i]){t=-1;break}}t=t||0}return t*n},u.compare=u.cmp=function(r,t){return new e(r).cmp(t)},o.greaterThan=o.gt=function(r){return this.cmp(r)>0},u.greaterThan=u.gt=function(r,t){return new e(r).gt(t)},o.greaterThanOrEqualTo=o.gte=function(r){return this.cmp(r)>=0},u.greaterThanOrEqualTo=u.gte=function(r,t){return new e(r).gte(t)},o.lessThan=o.lt=function(r){return this.cmp(r)<0},u.lessThan=u.lt=function(r,t){return new e(r).lt(t)},o.lessThanOrEqualTo=o.lte=function(r){return this.cmp(r)<=0},u.lessThanOrEqualTo=u.lte=function(r,t){return new e(r).lte(t)},o.equalsTo=o.equal=o.eq=function(r){return 0===this.cmp(r)},u.equalsTo=u.equal=u.eq=function(r,t){return new e(r).eq(t)},o.notEqualsTo=o.notEqual=o.neq=function(r){return 0!==this.cmp(r)},u.notEqualsTo=u.notEqual=u.neq=function(r,t){return new e(r).neq(t)},o.minimum=o.min=function(r){return this.lt(r)?this.clone():new e(r)},u.minimum=u.min=function(r,t){return new e(r).min(t)},o.maximum=o.max=function(r){return this.gt(r)?this.clone():new e(r)},u.maximum=u.max=function(r,t){return new e(r).max(t)},o.isPositive=o.ispos=function(){return this.gt(e.ZERO)},u.isPositive=u.ispos=function(r){return new e(r).ispos()},o.isNegative=o.isneg=function(){return this.lt(e.ZERO)},u.isNegative=u.isneg=function(r){return new e(r).isneg()},o.isNaN=function(){return isNaN(this.array[0])},u.isNaN=function(r){return new e(r).isNaN()},o.isFinite=function(){return isFinite(this.array[0])},u.isFinite=function(r){return new e(r).isFinite()},o.isInfinite=function(){return this.array[0]==1/0},u.isInfinite=function(r){return new e(r).isInfinite()},o.isInteger=o.isint=function(){return-1==this.sign?this.abs().isint():!!this.gt(e.MAX_SAFE_INTEGER)||Number.isInteger(this.toNumber())},u.isInteger=u.isint=function(r){return new e(r).isint()},o.floor=function(){return this.isInteger()?this.clone():new e(Math.floor(this.toNumber()))},u.floor=function(r){return new e(r).floor()},o.ceiling=o.ceil=function(){return this.isInteger()?this.clone():new e(Math.ceil(this.toNumber()))},u.ceiling=u.ceil=function(r){return new e(r).ceil()},o.round=function(){return this.isInteger()?this.clone():new e(Math.round(this.toNumber()))},u.round=function(r){return new e(r).round()};var f=!1;o.plus=o.add=function(r){var n=this.clone();if(r=new e(r),e.debug>=e.NORMAL&&(console.log(this+"+"+r),f||(console.warn(t+"Debug output via 'debug' is being deprecated and will be removed in the future!"),f=!0)),-1==n.sign)return n.neg().add(r.neg()).neg();if(-1==r.sign)return n.sub(r.neg());if(n.eq(e.ZERO))return r;if(r.eq(e.ZERO))return n;if(n.isNaN()||r.isNaN()||n.isInfinite()&&r.isInfinite()&&n.eq(r.neg()))return e.NaN.clone();if(n.isInfinite())return n;if(r.isInfinite())return r;var i,a=n.min(r),o=n.max(r);if(o.gt(e.E_MAX_SAFE_INTEGER)||o.div(a).gt(e.MAX_SAFE_INTEGER))i=o;else if(o.array[1]){if(1==o.array[1]){var u=a.array[1]?a.array[0]:Math.log10(a.array[0]);i=new e([u+Math.log10(Math.pow(10,o.array[0]-u)+1),1])}}else i=new e(n.toNumber()+r.toNumber());return a=o=null,i},u.plus=u.add=function(r,t){return new e(r).add(t)},o.minus=o.sub=function(r){var t=this.clone();if(r=new e(r),e.debug>=e.NORMAL&&console.log(t+"-"+r),-1==t.sign)return t.neg().sub(r.neg()).neg();if(-1==r.sign)return t.add(r.neg());if(t.eq(r))return e.ZERO.clone();if(r.eq(e.ZERO))return t;if(t.isNaN()||r.isNaN()||t.isInfinite()&&r.isInfinite())return e.NaN.clone();if(t.isInfinite())return t;if(r.isInfinite())return r.neg();var n,i=t.min(r),a=t.max(r),o=r.gt(t);if(a.gt(e.E_MAX_SAFE_INTEGER)||a.div(i).gt(e.MAX_SAFE_INTEGER))n=a,n=o?n.neg():n;else if(a.array[1]){if(1==a.array[1]){var u=i.array[1]?i.array[0]:Math.log10(i.array[0]);n=new e([u+Math.log10(Math.pow(10,a.array[0]-u)-1),1]),n=o?n.neg():n}}else n=new e(t.toNumber()-r.toNumber());return i=a=null,n},u.minus=u.sub=function(r,t){return new e(r).sub(t)},o.times=o.mul=function(r){var t=this.clone();if(r=new e(r),e.debug>=e.NORMAL&&console.log(t+"*"+r),t.sign*r.sign==-1)return t.abs().mul(r.abs()).neg();if(-1==t.sign)return t.abs().mul(r.abs());if(t.isNaN()||r.isNaN()||t.eq(e.ZERO)&&r.isInfinite()||t.isInfinite()&&r.abs().eq(e.ZERO))return e.NaN.clone();if(r.eq(e.ZERO))return e.ZERO.clone();if(r.eq(e.ONE))return t.clone();if(t.isInfinite())return t;if(r.isInfinite())return r;if(t.max(r).gt(e.EE_MAX_SAFE_INTEGER))return t.max(r);var n=t.toNumber()*r.toNumber();return n<=9007199254740991?new e(n):e.pow(10,t.log10().add(r.log10()))},u.times=u.mul=function(r,t){return new e(r).mul(t)},o.divide=o.div=function(r){var t=this.clone();if(r=new e(r),e.debug>=e.NORMAL&&console.log(t+"/"+r),t.sign*r.sign==-1)return t.abs().div(r.abs()).neg();if(-1==t.sign)return t.abs().div(r.abs());if(t.isNaN()||r.isNaN()||t.isInfinite()&&r.isInfinite()||t.eq(e.ZERO)&&r.eq(e.ZERO))return e.NaN.clone();if(r.eq(e.ZERO))return e.POSITIVE_INFINITY.clone();if(r.eq(e.ONE))return t.clone();if(t.eq(r))return e.ONE.clone();if(t.isInfinite())return t;if(r.isInfinite())return e.ZERO.clone();if(t.max(r).gt(e.EE_MAX_SAFE_INTEGER))return t.gt(r)?t.clone():e.ZERO.clone();var n=t.toNumber()/r.toNumber();if(n<=9007199254740991)return new e(n);var i=e.pow(10,t.log10().sub(r.log10())),a=i.floor();return i.sub(a).lt(new e(1e-9))?a:i},u.divide=u.div=function(r,t){return new e(r).div(t)},o.reciprocate=o.rec=function(){return e.debug>=e.NORMAL&&console.log(this+"^-1"),this.isNaN()||this.eq(e.ZERO)?e.NaN.clone():this.abs().gt("2e323")?e.ZERO.clone():new e(1/this)},u.reciprocate=u.rec=function(r){return new e(r).rec()},o.modular=o.mod=function(r){return(r=new e(r)).eq(e.ZERO)?e.ZERO.clone():this.sign*r.sign==-1?this.abs().mod(r.abs()).neg():-1==this.sign?this.abs().mod(r.abs()):this.sub(this.div(r).floor().mul(r))},u.modular=u.mod=function(r,t){return new e(r).mod(t)};o.gamma=function(){var r=this.clone();if(r.gt(e.TETRATED_MAX_SAFE_INTEGER))return r;if(r.gt(e.E_MAX_SAFE_INTEGER))return e.exp(r);if(r.gt(e.MAX_SAFE_INTEGER))return e.exp(e.mul(r,e.ln(r).sub(1)));var t=r.array[0];if(t>1){if(t<24)return new e(function(r){if(!isFinite(r))return r;if(r<-50)return r==Math.trunc(r)?Number.NEGATIVE_INFINITY:0;for(var e=1;r<10;)e*=r,++r;var t=.9189385332046727;t+=(.5+(r-=1))*Math.log(r),t-=r;var n=r*r,i=r;return t+=1/(12*i),t+=1/(360*(i*=n)),t+=1/(1260*(i*=i*n)),t+=1/(1680*(i*=n)),t+=1/(1188*(i*=n)),t+=691/(360360*(i*=n)),t+=7/(1092*(i*=n)),t+=3617/(122400*(i*=n)),Math.exp(t)/e}(r.sign*t));var n=t-1,i=.9189385332046727;i+=(n+.5)*Math.log(n);var a=n*n,o=n,u=12*o,s=1/u,f=(i-=n)+s;if(f==i)return e.exp(i);if((f=(i=f)-(s=1/(u=360*(o*=a))))==i)return e.exp(i);i=f;var l=1/(u=1260*(o*=a));return i+=l,i-=l=1/(u=1680*(o*=a)),e.exp(i)}return this.rec()},u.gamma=function(r){return new e(r).gamma()},u.factorials=[1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368e3,20922789888e3,355687428096e3,6402373705728e3,0x1b02b9306890000,243290200817664e4,5109094217170944e4,0x3ceea4c2b3e0d80000,2.585201673888498e22,6.204484017332394e23,1.5511210043330986e25,4.0329146112660565e26,1.0888869450418352e28,3.0488834461171387e29,8.841761993739702e30,2.6525285981219107e32,8.222838654177922e33,2.631308369336935e35,8.683317618811886e36,2.9523279903960416e38,1.0333147966386145e40,3.7199332678990125e41,1.3763753091226346e43,5.230226174666011e44,2.0397882081197444e46,8.159152832478977e47,3.345252661316381e49,1.40500611775288e51,6.041526306337383e52,2.658271574788449e54,1.1962222086548019e56,5.502622159812089e57,2.5862324151116818e59,1.2413915592536073e61,6.082818640342675e62,3.0414093201713376e64,1.5511187532873822e66,8.065817517094388e67,4.2748832840600255e69,2.308436973392414e71,1.2696403353658276e73,7.109985878048635e74,4.0526919504877214e76,2.3505613312828785e78,1.3868311854568984e80,8.32098711274139e81,5.075802138772248e83,3.146997326038794e85,1.98260831540444e87,1.2688693218588417e89,8.247650592082472e90,5.443449390774431e92,3.647111091818868e94,2.4800355424368305e96,1.711224524281413e98,1.1978571669969892e100,8.504785885678623e101,6.1234458376886085e103,4.4701154615126844e105,3.307885441519386e107,2.48091408113954e109,1.8854947016660504e111,1.4518309202828587e113,1.1324281178206297e115,8.946182130782976e116,7.156945704626381e118,5.797126020747368e120,4.753643337012842e122,3.945523969720659e124,3.314240134565353e126,2.81710411438055e128,2.4227095383672734e130,2.107757298379528e132,1.8548264225739844e134,1.650795516090846e136,1.4857159644817615e138,1.352001527678403e140,1.2438414054641308e142,1.1567725070816416e144,1.087366156656743e146,1.032997848823906e148,9.916779348709496e149,9.619275968248212e151,9.426890448883248e153,9.332621544394415e155,9.332621544394415e157,9.42594775983836e159,9.614466715035127e161,9.90290071648618e163,1.0299016745145628e166,1.081396758240291e168,1.1462805637347084e170,1.226520203196138e172,1.324641819451829e174,1.4438595832024937e176,1.588245541522743e178,1.7629525510902446e180,1.974506857221074e182,2.2311927486598138e184,2.5435597334721877e186,2.925093693493016e188,3.393108684451898e190,3.969937160808721e192,4.684525849754291e194,5.574585761207606e196,6.689502913449127e198,8.094298525273444e200,9.875044200833601e202,1.214630436702533e205,1.506141741511141e207,1.882677176888926e209,2.372173242880047e211,3.0126600184576594e213,3.856204823625804e215,4.974504222477287e217,6.466855489220474e219,8.47158069087882e221,1.1182486511960043e224,1.4872707060906857e226,1.9929427461615188e228,2.6904727073180504e230,3.659042881952549e232,5.012888748274992e234,6.917786472619489e236,9.615723196941089e238,1.3462012475717526e241,1.898143759076171e243,2.695364137888163e245,3.854370717180073e247,5.5502938327393044e249,8.047926057471992e251,1.1749972043909107e254,1.727245890454639e256,2.5563239178728654e258,3.80892263763057e260,5.713383956445855e262,8.62720977423324e264,1.3113358856834524e267,2.0063439050956823e269,3.0897696138473508e271,4.789142901463394e273,7.471062926282894e275,1.1729568794264145e278,1.853271869493735e280,2.9467022724950384e282,4.7147236359920616e284,7.590705053947219e286,1.2296942187394494e289,2.0044015765453026e291,3.287218585534296e293,5.423910666131589e295,9.003691705778438e297,1.503616514864999e300,2.5260757449731984e302,4.269068009004705e304,7.257415615307999e306],o.factorial=o.fact=function(){var r=this.clone(),t=e.factorials;if(r.lt(e.ZERO)||!r.isint())return r.add(1).gamma();if(r.lte(170))return new e(t[+r]);var n=+r;return n<500&&(n+=163879/209018880*Math.pow(n,5)),n<1e3&&(n+=-571/2488320*Math.pow(n,4)),n<5e4&&(n+=-139/51840*Math.pow(n,3)),n<1e7&&(n+=1/288*Math.pow(n,2)),n<1e20&&(n+=1/12*n),r.div(e.E).pow(r).mul(r.mul(e.PI).mul(2).sqrt()).times(1)},u.factorial=u.fact=function(r){return new e(r).fact()},o.toPower=o.pow=function(r){if(r=new e(r),e.debug>=e.NORMAL&&console.log(this+"^"+r),r.eq(e.ZERO))return e.ONE.clone();if(r.eq(e.ONE))return this.clone();if(r.lt(e.ZERO))return this.pow(r.neg()).rec();if(this.lt(e.ZERO)&&r.isint())return r.mod(2).lt(e.ONE)?this.abs().pow(r):this.abs().pow(r).neg();if(this.lt(e.ZERO))return e.NaN.clone();if(this.eq(e.ONE))return e.ONE.clone();if(this.eq(e.ZERO))return e.ZERO.clone();if(this.max(r).gt(e.TETRATED_MAX_SAFE_INTEGER))return this.max(r);if(this.eq(10))return r.gt(e.ZERO)?(r.array[1]=r.array[1]+1||1,r.normalize(),r):new e(Math.pow(10,r.toNumber()));if(r.lt(e.ONE))return this.root(r.rec());var t=Math.pow(this.toNumber(),r.toNumber());return t<=9007199254740991?new e(t):e.pow(10,this.log10().mul(r))},u.toPower=u.pow=function(r,t){return new e(r).pow(t)},o.exponential=o.exp=function(){return e.pow(Math.E,this)},u.exponential=u.exp=function(r){return e.pow(Math.E,r)},o.squareRoot=o.sqrt=function(){return this.root(2)},u.squareRoot=u.sqrt=function(r){return new e(r).root(2)},o.cubeRoot=o.cbrt=function(){return this.root(3)},u.cubeRoot=u.cbrt=function(r){return new e(r).root(3)},o.root=function(r){return r=new e(r),e.debug>=e.NORMAL&&console.log(this+"root"+r),r.eq(e.ONE)?this.clone():r.lt(e.ZERO)?this.root(r.neg()).rec():r.lt(e.ONE)?this.pow(r.rec()):this.lt(e.ZERO)&&r.isint()&&r.mod(2).eq(e.ONE)?this.neg().root(r).neg():this.lt(e.ZERO)?e.NaN.clone():this.eq(e.ONE)?e.ONE.clone():this.eq(e.ZERO)?e.ZERO.clone():this.max(r).gt(e.TETRATED_MAX_SAFE_INTEGER)?this.gt(r)?this.clone():e.ZERO.clone():e.pow(10,this.log10().div(r))},u.root=function(r,t){return new e(r).root(t)},o.generalLogarithm=o.log10=function(){var r=this.clone();return e.debug>=e.NORMAL&&console.log("log"+this),r.lt(e.ZERO)?e.NaN.clone():r.eq(e.ZERO)?e.NEGATIVE_INFINITY.clone():r.lte(e.MAX_SAFE_INTEGER)?new e(Math.log10(r.toNumber())):r.isFinite()?r.gt(e.TETRATED_MAX_SAFE_INTEGER)?r:(r.array[1]--,r.normalize()):r},u.generalLogarithm=u.log10=function(r){return new e(r).log10()},o.logarithm=o.logBase=function(r){return void 0===r&&(r=Math.E),this.log10().div(e.log10(r))},u.logarithm=u.logBase=function(r,t){return new e(r).logBase(t)},o.naturalLogarithm=o.log=o.ln=function(){return this.logBase(Math.E)},u.naturalLogarithm=u.log=u.ln=function(r){return new e(r).ln()};o.lambertw=function(){var r=this.clone();if(r.isNaN())return r;if(r.lt(-.3678794411710499))throw Error("lambertw is unimplemented for results less than -1, sorry!");return r.gt(e.TETRATED_MAX_SAFE_INTEGER)?r:r.gt(e.EE_MAX_SAFE_INTEGER)?(r.array[1]--,r):r.gt(e.MAX_SAFE_INTEGER)?function(r,t){var n,i,a,o;if(void 0===t&&(t=1e-10),!(r=new e(r)).isFinite())return r;if(0===r)return r;if(1===r)return.5671432904097838;n=e.ln(r);for(var u=0;u<100;++u){if(i=e.exp(-n),a=n.sub(r.mul(i)),o=n.sub(a.div(n.add(e.ONE).sub(n.add(2).mul(a).div(e.mul(2,n).add(2))))),e.abs(o.sub(n)).lt(e.abs(o).mul(t)))return o;n=o}throw Error("Iteration failed to converge: "+r)}(r):new e(function(r,e){var t,n;if(void 0===e&&(e=1e-10),!Number.isFinite(r))return r;if(0===r)return r;if(1===r)return.5671432904097838;t=r<10?0:Math.log(r)-Math.log(Math.log(r));for(var i=0;i<100;++i){if(n=(r*Math.exp(-t)+t*t)/(t+1),Math.abs(n-t)<e*Math.abs(n))return n;t=n}throw Error("Iteration failed to converge: "+r)}(r.sign*r.array[0]))},u.lambertw=function(r){return new e(r).lambertw()},o.tetrate=o.tetr=function(r,t){void 0===t&&(t=e.ONE);var n,i=this.clone();if(r=new e(r),(t=new e(t)).neq(e.ONE)&&(r=r.add(t.slog(i))),e.debug>=e.NORMAL&&console.log(i+"^^"+r),i.isNaN()||r.isNaN()||t.isNaN())return e.NaN.clone();if(r.isInfinite()&&r.sign>0)return i.gte(Math.exp(1/Math.E))?e.POSITIVE_INFINITY.clone():(n=i.ln().neg()).lambertw().div(n);if(r.lte(-2))return e.NaN.clone();if(i.eq(e.ZERO))return r.eq(e.ZERO)?e.NaN.clone():r.mod(2).eq(e.ZERO)?e.ZERO.clone():e.ONE.clone();if(i.eq(e.ONE))return r.eq(e.ONE.neg())?e.NaN.clone():e.ONE.clone();if(r.eq(e.ONE.neg()))return e.ZERO.clone();if(r.eq(e.ZERO))return e.ONE.clone();if(r.eq(e.ONE))return i;if(r.eq(2))return i.pow(i);if(i.eq(2)){if(r.eq(3))return new e(16);if(r.eq(4))return new e(65536)}if((h=i.max(r)).gt("10^^^9007199254740991"))return h;if(h.gt(e.TETRATED_MAX_SAFE_INTEGER)||r.gt(e.MAX_SAFE_INTEGER)){if(this.lt(Math.exp(1/Math.E)))return(n=i.ln().neg()).lambertw().div(n);var a=i.slog(10).add(r);return a.array[2]=(a.array[2]||0)+1,a.normalize(),a}for(var o=r.toNumber(),u=Math.floor(o),s=i.pow(o-u),f=e.NaN,l=0,h=e.E_MAX_SAFE_INTEGER;0!==u&&s.lt(h)&&l<100;++l)if(u>0){if(s=i.pow(s),f.eq(s)){u=0;break}f=s,--u}else{if(s=s.logBase(i),f.eq(s)){u=0;break}f=s,++u}return(100==l||this.lt(Math.exp(1/Math.E)))&&(u=0),s.array[1]=s.array[1]+u||u,s.normalize(),s},u.tetrate=u.tetr=function(r,t,n){return new e(r).tetr(t,n)},o.iteratedexp=function(r,e){return this.tetr(r,e)},u.iteratedexp=function(r,t,n){return new e(r).iteratedexp(other,n)},o.iteratedlog=function(r,t){void 0===r&&(r=10),void 0===t&&(t=e.ONE.clone());var n=this.clone();return t.eq(ExpantaNum.ZERO)?n:t.eq(ExpantaNum.ONE)?n.logBase(r):(r=new e(r),t=new e(t),r.tetr(n.slog(r).sub(t)))},u.iteratedlog=function(r,t,n){return new e(r).iteratedlog(t,n)},o.layeradd=function(r,t){void 0===t&&(t=10),void 0===r&&(r=e.ONE.clone());var n=this.clone();return t=new e(t),r=new e(r),t.tetr(n.slog(t).add(r))},u.layeradd=function(r,t,n){return new e(r).layeradd(t,n)},o.layeradd10=function(r){return this.layeradd(r)},u.layeradd10=function(r,t){return new e(r).layeradd10(t)},o.ssqrt=o.ssrt=function(){var r=this.clone();if(r.lt(Math.exp(-1/Math.E)))return e.NaN.clone();if(!r.isFinite())return r;if(r.gt(e.TETRATED_MAX_SAFE_INTEGER))return r;if(r.gt(e.EE_MAX_SAFE_INTEGER))return r.array[1]--,r;var t=r.ln();return t.div(t.lambertw())},u.ssqrt=u.ssrt=function(r){return new e(r).ssqrt()},o.slog=function(r){void 0===r&&(r=10);var t=new e(this);if(r=new e(r),t.isNaN()||r.isNaN()||t.isInfinite()&&r.isInfinite())return e.NaN.clone();if(t.isInfinite())return t;if(r.isInfinite())return e.ZERO.clone();if(t.lt(e.ZERO))return e.ONE.neg();if(t.eq(e.ONE))return e.ZERO.clone();if(t.eq(r))return e.ONE.clone();if(r.lt(Math.exp(1/Math.E))){var n=e.tetr(r,1/0);if(t.eq(n))return e.POSITIVE_INFINITY.clone();if(t.gt(n))return e.NaN.clone()}if(t.max(r).gt("10^^^9007199254740991"))return t.gt(r)?t:e.ZERO.clone();if(t.max(r).gt(e.TETRATED_MAX_SAFE_INTEGER))return t.gt(r)?(t.array[2]--,t.normalize(),t.sub(t.array[1])):e.ZERO.clone();var i=0,a=(t.array[1]||0)-(r.array[1]||0);if(a>3){var o=a-3;i+=o,t.array[1]=t.array[1]-o}for(var u=0;u<100;++u)if(t.lt(e.ZERO))t=e.pow(r,t),--i;else{if(t.lte(1))return new e(i+t.toNumber()-1);++i,t=e.logBase(t,r)}return t.gt(10)?new e(i):void 0},u.slog=function(r,t){return new e(r).slog(t)},o.pentate=o.pent=function(r){return this.arrow(3)(r)},u.pentate=u.pent=function(r,t){return e.arrow(r,3,t)},o.arrow=function(r){var t=this.clone();return!(r=new e(r)).isint()||r.lt(e.ZERO)?function(r){return e.NaN.clone()}:r.eq(e.ZERO)?function(r){return t.mul(r)}:r.eq(e.ONE)?function(r){return t.pow(r)}:r.eq(2)?function(r){return t.tetr(r)}:function(n){if(n=new e(n),e.debug>=e.NORMAL&&console.log(t+"{"+r+"}"+n),n.lt(e.ZERO))return e.NaN.clone();if(n.eq(e.ZERO))return e.ONE.clone();if(n.eq(e.ONE))return t.clone();if(r.gte(e.maxArrow))return console.warn("Number too large to reasonably handle it: tried to "+(typeof r=="number" ? r+2 : r.add(2))+"-ate."),e.POSITIVE_INFINITY.clone();var i,a=r.toNumber();if(n.eq(2))return t.arrow(r.sub(e.ONE))(t);if(t.max(n).gt("10{"+(a+1)+"}9007199254740991"))return t.max(n);if(t.gt("10{"+a+"}9007199254740991")||n.gt(e.MAX_SAFE_INTEGER)){t.gt("10{"+a+"}9007199254740991")?((i=t.clone()).array[a]--,i.normalize()):i=t.gt("10{"+(a-1)+"}9007199254740991")?new e(t.array[a-1]):e.ZERO;var o=i.add(n);return o.array[a]=(o.array[a]||0)+1,o.normalize(),o}var u=n.toNumber(),s=Math.floor(u),f=r.sub(e.ONE);i=t.arrow(f)(u-s);for(var l=0,h=new e("10{"+(a-1)+"}9007199254740991");0!==s&&i.lt(h)&&l<100;++l)s>0&&(i=t.arrow(f)(i),--s);return 100==l&&(s=0),i.array[a-1]=i.array[a-1]+s||s,i.normalize(),i}},o.chain=function(r,e){return this.arrow(e)(r)},u.arrow=function(r,t,n){return new e(r).arrow(t)(n)},u.chain=function(r,t,n){return new e(r).arrow(n)(t)},u.hyper=function(r){return(r=new e(r)).eq(e.ZERO)?function(r,t){return new e(t).eq(e.ZERO)?new e(r):new e(r).add(e.ONE)}:r.eq(e.ONE)?function(r,t){return e.add(r,t)}:function(t,n){return new e(t).arrow(r.sub(2))(n)}},u.affordGeometricSeries=function(r,t,n,i){r=new e(r),t=new e(t),n=new e(n);var a=t.mul(n.pow(i));return e.floor(r.div(a).mul(n.sub(e.ONE)).add(e.ONE).log10().div(n.log10()))},u.affordArithmeticSeries=function(r,t,n,i){r=new e(r),t=new e(t),n=new e(n),i=new e(i);var a=t.add(i.mul(n)).sub(n.div(2)),o=a.pow(2);return a.neg().add(o.add(n.mul(r).mul(2)).sqrt()).div(n).floor()},u.sumGeometricSeries=function(r,t,n,i){return t=new e(t),n=new e(n),t.mul(n.pow(i)).mul(e.sub(e.ONE,n.pow(r))).div(e.sub(e.ONE,n))},u.sumArithmeticSeries=function(r,t,n,i){r=new e(r),t=new e(t),i=new e(i);var a=t.add(i.mul(n));return r.div(2).mul(a.mul(2).plus(r.sub(e.ONE).mul(n)))},u.choose=function(r,t){return new e(r).factorial().div(new e(t).factorial().mul(new e(r).sub(new e(t)).factorial()))},o.choose=function(r){return e.choose(this,r)},o.normalize=function(){var r,t=this;e.debug>=e.ALL&&console.log(t.toString()),t.array&&t.array.length||(t.array=[0]),1!=t.sign&&-1!=t.sign&&("number"!=typeof t.sign&&(t.sign=Number(t.sign)),t.sign=t.sign<0?-1:1);for(var n=t.array.length,i=0;i<n;i++){var o=t.array[i];if(null!=o){if(isNaN(o))return t.array=[NaN],t;if(!isFinite(o))return t.array=[1/0],t;0===i||Number.isInteger(o)||(t.array[i]=Math.floor(o))}else t.array[i]=0}do{for(e.debug>=e.ALL&&console.log(t.toString()),r=!1;t.array.length&&0===t.array[t.array.length-1];)t.array.pop(),r=!0;for(t.array[0]>9007199254740991&&(t.array[1]=(t.array[1]||0)+1,t.array[0]=Math.log10(t.array[0]),r=!0);t.array[0]<a&&t.array[1];)t.array[0]=Math.pow(10,t.array[0]),t.array[1]--,r=!0;if(t.array.length>2&&!t.array[1]){for(i=2;!t.array[i];++i)continue;t.array[i-1]=t.array[0],t.array[0]=1,t.array[i]--,r=!0}for(n=t.array.length,i=1;i<n;++i)if(t.array[i]>9007199254740991){t.array[i+1]=(t.array[i+1]||0)+1,t.array[0]=t.array[i]+1;for(var u=1;u<=i;++u)t.array[u]=0;r=!0}}while(r);return t.array.length||(t.array=[0]),t};var l=!1;o.standardize=function(){return l||(console.warn(t+"'standardize' method is being deprecated in favor of 'normalize' and will be removed in the future!"),l=!0),this.normalize()},o.toNumber=function(){return-1==this.sign?-1*this.abs():this.array.length>=2&&(this.array[1]>=2||1==this.array[1]&&this.array[0]>Math.log10(Number.MAX_VALUE))?1/0:1==this.array[1]?Math.pow(10,this.array[0]):this.array[0]},o.toString=function(){if(-1==this.sign)return"-"+this.abs();if(isNaN(this.array[0]))return"NaN";if(!isFinite(this.array[0]))return"Infinity";var r="";if(this.array.length>=2)for(var e=this.array.length-1;e>=2;--e){var t=e>=5?"{"+e+"}":"^".repeat(e);this.array[e]>1?r+="(10"+t+")^"+this.array[e]+" ":1==this.array[e]&&(r+="10"+t)}return this.array[1]?this.array[1]<3?r+="e".repeat(this.array[1]-1)+Math.pow(10,this.array[0]-Math.floor(this.array[0]))+"e"+Math.floor(this.array[0]):this.array[1]<8?r+="e".repeat(this.array[1])+this.array[0]:r+="(10^)^"+this.array[1]+" "+this.array[0]:r+=String(this.toNumber()),r};var h=function(r,e){var t=e+1,n=Math.ceil(Math.log10(Math.abs(r)));n<100&&(n=0);var i=Math.round(r*Math.pow(10,t-n))*Math.pow(10,n-t);return parseFloat(i.toFixed(Math.max(t-n,0)))};o.toStringWithDecimalPlaces=function(r,e){if(-1==this.sign)return"-"+this.abs();if(isNaN(this.array[0]))return"NaN";if(!isFinite(this.array[0]))return"Infinity";var t=0,n="",i=Math.pow(10,r);if(this.array.length>=2)for(var a=this.array.length-1;!t&&a>=2;--a){var o=this.array[a];e&&o>=i?(++a,t=o,o=1):e&&this.array[a-1]>=i&&(++o,t=this.array[a-1]);var u=a>=5?"{"+a+"}":"^".repeat(a);o>1?n+="(10"+u+")^"+o+" ":1==o&&(n+="10"+u)}var s=this.array[0],f=this.array[1]||0;return s>i&&(s=Math.log10(s),++f),n+=t?h(t,r):f?f<3?"e".repeat(f-1)+h(Math.pow(10,s-Math.floor(s)),r)+"e"+h(Math.floor(s),r):f<8?"e".repeat(f)+h(s,r):e?"(10^)^"+h(f,r)+" "+h(s,r):"(10^)^"+f+" "+h(s,r):String(h(s,r))},o.toExponential=function(r,e){return 1==this.array.length?(this.sign*this.array[0]).toExponential(r):this.toStringWithDecimalPlaces(r,e)},o.toFixed=function(r,e){return 1==this.array.length?(this.sign*this.array[0]).toFixed(r):this.toStringWithDecimalPlaces(r,e)},o.toPrecision=function(r,e){return 0===this.array[0]?(this.sign*this.array[0]).toFixed(r-1,e):1==this.array.length&&this.array[0]<1e-6?this.toExponential(r-1,e):1==this.array.length&&r>Math.log10(this.array[0])?this.toFixed(r-Math.floor(Math.log10(this.array[0]))-1,e):this.toExponential(r-1,e)},o.valueOf=function(){return this.toString()},o.toJSON=function(){return e.serializeMode==e.JSON?{array:this.array.slice(0),sign:this.sign}:e.serializeMode==e.STRING?this.toString():void 0},o.toHyperE=function(){if(-1==this.sign)return"-"+this.abs().toHyperE();if(isNaN(this.array[0]))return"NaN";if(!isFinite(this.array[0]))return"Infinity";if(this.lt(e.MAX_SAFE_INTEGER))return String(this.array[0]);if(this.lt(e.E_MAX_SAFE_INTEGER))return"E"+this.array[0];for(var r="E"+this.array[0]+"#"+this.array[1],t=2;t<this.array.length;++t)r+="#"+(this.array[t]+1);return r},u.fromNumber=function(r){if("number"!=typeof r)throw Error(n+"Expected Number");var t=new e;return t.array[0]=Math.abs(r),t.sign=r<0?-1:1,t.normalize(),t};u.fromBigInt=function(r){if("bigint"!=typeof r)throw Error(n+"Expected BigInt");var t=new e,i=r<BigInt(0)?-r:r;return t.sign=r<BigInt(0)?-1:1,i<=9007199254740991?t.array[0]=Number(i):t.array=[function(r){for(var e=BigInt(64);r>=BigInt(1)<<e;)e*=BigInt(2);for(var t=e/BigInt(2);t>BigInt(0);)r>=BigInt(1)<<e?e+=t:e-=t,t/=BigInt(2);var n=e-BigInt(54),i=r>>n;return Math.log10(Number(i))+Math.LOG10E/Math.LOG2E*Number(n)}(i),1],t.normalize(),t};var c=function(r){return Math.log10(Number(r.substring(0,17)))+(r.length-17)};function g(r){if(!r||"object"!=typeof r)throw Error(t+"Object expected");var e,i,a,o=["maxArrow",1,Number.MAX_SAFE_INTEGER,"serializeMode",0,1,"debug",0,2];for(e=0;e<o.length;e+=3)if(void 0!==(a=r[i=o[e]])){if(!(Math.floor(a)===a&&a>=o[e+1]&&a<=o[e+2]))throw Error(n+i+": "+a);this[i]=a}return this}u.fromString=function(r){if("string"!=typeof r)throw Error(n+"Expected String");var o=!1;if("string"==typeof r&&("["==r[0]||"{"==r[0]))try{JSON.parse(r)}finally{o=!0}if(o)return e.fromJSON(r);var u=new e;if(u.array=[0],!i.test(r))return console.warn(t+"Malformed input: "+r),u.array=[NaN],u;var s=!1;if("-"==r[0]||"+"==r[0]){var f=r.search(/[^-\+]/);s=r.substring(0,f).match(/-/g).length%2==1,r=r.substring(f)}if("NaN"==r)u.array=[NaN];else if("Infinity"==r)u.array=[1/0];else{for(var l,h,g,E,N;r&&/^\(?10[\^\{]/.test(r);){var y;if("("==r[0]&&(r=r.substring(1)),"^"==r[2]?(y=l=r.substring(2).search(/[^\^]/),h=l+2):(l=r.indexOf("}"),y=Number(r.substring(3,l)),h=l+1),y>=e.maxArrow){console.warn("Number too large to reasonably handle it: tried to "+(typeof y=="number" ? y+2 : y.add(2))+"-ate."),u.array=[1/0],r="Infinity";break}if(")"==(r=r.substring(h))[0]?(l=r.indexOf(" "),g=Number(r.substring(2,l)),r=r.substring(l+1)):g=1,1==y)u.array[1]=(u.array[1]||0)+g;else if(2==y)l=u.array[1]||0,(h=u.array[0]||0)>=1e10&&++l,h>=10&&++l,u.array[0]=l,u.array[1]=0,u.array[2]=(u.array[2]||0)+g;else{for(l=u.array[y-1]||0,(h=u.array[y-2]||0)>=10&&++l,N=1;N<y;++N)u.array[N]=0;u.array[0]=l,u.array[y]=(u.array[y]||0)+g}}for(l=r.split(/[Ee]/),h=[u.array[0],0],g=1,N=l.length-1;N>=0;--N){h[0]<a&&0===h[1]?h[0]=Math.pow(10,g*h[0]):-1==g?(0===h[1]?h[0]=Math.pow(10,g*h[0]):1==h[1]&&h[0]<=Math.log10(Number.MAX_VALUE)?h[0]=Math.pow(10,g*Math.pow(10,h[0])):h[0]=0,h[1]=0):h[1]++;var m=l[N].indexOf("."),d=-1==m?l[N].length:m;0===h[1]?d>=17?(h[0]=Math.log10(h[0])+c(l[N].substring(0,d)),h[1]=1):l[N]&&(h[0]*=Number(l[N])):(E=d>=17?c(l[N].substring(0,d)):l[N]?Math.log10(Number(l[N])):0,1==h[1]?h[0]+=E:2==h[1]&&h[0]<a+Math.log10(E)&&(h[0]+=Math.log10(1+Math.pow(10,Math.log10(E)-h[0])))),h[0]<a&&h[1]?(h[0]=Math.pow(10,h[0]),h[1]--):h[0]>9007199254740991&&(h[0]=Math.log10(h[0]),h[1]++)}u.array[0]=h[0],u.array[1]=(u.array[1]||0)+h[1]}return s&&(u.sign*=-1),u.normalize(),u},u.fromArray=function(r,t){var i,a;if(r instanceof Array&&(void 0===t||"number"==typeof t))i=r,a=t;else{if(!(t instanceof Array&&"number"==typeof r))throw Error(n+"Expected an Array [and Boolean]");i=t,a=r}var o=new e;return o.array=i.slice(0),o.sign=a?Number(a):1,o.normalize(),o},u.fromObject=function(r){if("object"!=typeof r)throw Error(n+"Expected Object");if(null===r)return e.ZERO.clone();if(r instanceof Array)return e.fromArray(r);if(r instanceof e)return new e(r);if(!(r.array instanceof Array))throw Error(n+"Expected that property 'array' exists");if(void 0!==r.sign&&"number"!=typeof r.sign)throw Error(n+"Expected that property 'sign' is Number");var t=new e;return t.array=r.array.slice(0),t.sign=Number(r.sign)||1,t.normalize(),t},u.fromJSON=function(r){if("object"==typeof r)return e.fromObject(t);if("string"!=typeof r)throw Error(n+"Expected String");var t,i;try{t=JSON.parse(r)}catch(r){throw t=null,r}finally{i=e.fromObject(t)}return t=null,i},u.fromHyperE=function(r){if("string"!=typeof r)throw Error(n+"Expected String");var i=new e;if(i.array=[0],!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#[1-9]\d*)*)$/.test(r))return console.warn(t+"Malformed input: "+r),i.array=[NaN],i;var a=!1;if("-"==r[0]||"+"==r[0]){var o=r.search(/[^-\+]/);a=r.substring(0,o).match(/-/g).length%2==0,r=r.substring(o)}if("NaN"==r)i.array=[NaN];else if("Infinity"==r)i.array=[1/0];else if("E"!=r[0])i.array[0]=Number(r);else if(-1==r.indexOf("#"))i.array[0]=Number(r.substring(1)),i.array[1]=1;else for(var u=r.substring(1).split("#"),s=0;s<u.length;++s){var f=Number(u[s]);s>=2&&--f,i.array[s]=f}return a&&(i.sign*=-1),i.normalize(),i},o.clone=function(){var r=new e;return r.array=this.array.slice(0),r.sign=this.sign,r},(e=function(r){for(var t in s)s.hasOwnProperty(t)&&(Object.defineProperty?Object.defineProperty(r,t,{configurable:!1,enumerable:!0,writable:!1,value:new e(s[t])}):r[t]=new e(s[t]));return r}(e=function r(e){var t,n,i;function a(r,e){var t=this;if(!(t instanceof a))return new a(r,e);t.constructor=a;var n,i,o=null;if("string"==typeof r&&("["==r[0]||"{"==r[0]))try{o=JSON.parse(r)}catch(r){}return"number"!=typeof r||e instanceof Array?"bigint"==typeof r?n=a.fromBigInt(r):o?n=a.fromObject(o):"string"==typeof r&&"E"==r[0]?n=a.fromHyperE(r):"string"==typeof r?n=a.fromString(r):r instanceof Array||e instanceof Array?n=a.fromArray(r,e):r instanceof a?(n=r.array.slice(0),i=r.sign):"object"==typeof r?n=a.fromObject(r):(n=[NaN],i=1):n=a.fromNumber(r),void 0===i?(t.array=n.array,t.sign=n.sign):(t.array=n,t.sign=i),t}for(var s in a.prototype=o,a.JSON=0,a.STRING=1,a.NONE=0,a.NORMAL=1,a.ALL=2,a.clone=r,a.config=a.set=g,u)u.hasOwnProperty(s)&&(a[s]=u[s]);if(void 0===e&&(e={}),e)for(i=["maxArrow","serializeMode","debug"],t=0;t<i.length;)e.hasOwnProperty(n=i[t++])||(e[n]=this[n]);return a.config(e),a}(e))).default=e.OmegaNum=e;return e})();
  // --  EDITABLE DEFAULTS  -- //
    var ExpantaNum = {
      // The maximum number of operators stored in array.
      // If the number of operations exceed the limit, then the least significant operations will be discarded.
      // This is to prevent long loops and eating away of memory and processing time.
      // 1000 means there are at maximum of 1000 elements in array.
      // It is not recommended to make this number too big.
      // `ExpantaNum.maxOps = 1000;`
      maxOps: 1e3,

      // Specify what format is used when serializing for JSON.stringify
      // 
      // JSON   0 JSON object
      // STRING 1 String
      serializeMode: 0,
      
      // Level of debug information printed in console
      // 
      // NONE   0 Show no information.
      // NORMAL 1 Show operations.
      // ALL    2 Show everything.
      debug: 0
    },


  // -- END OF EDITABLE DEFAULTS -- //


    external = true,

    expantaNumError = "[ExpantaNumError] ",
    invalidArgument = expantaNumError + "Invalid argument: ",

    isExpantaNum = /^[-\+]*(Infinity|NaN|(J+|J\^\(?(Infinity|NaN|(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))\)? )?(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/,
    isOmegaNum = /^[-\+]*(Infinity|NaN|(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))/,

    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER), //15.954589770191003

    // ExpantaNum.prototype object
    P={},
    // ExpantaNum static object
    Q={},
    // ExpantaNum constants
    R={};

  // ExpantaNum prototype methods

  /*
   *  absoluteValue             abs
   *  affordArithmeticSeries
   *  affordGeometricSeries
   *  arrow
   *  ceiling                   ceil
   *  chain
   *  choose
   *  comparedTo                cmp
   *  cubeRoot                  cbrt
   *  divide                    div
   *  equals                    eq
   *  expansion
   *  exponential               exp
   *  factorial                 fact
   *  floor
   *  gamma
   *  generalLogarithm          log10
   *  greaterThan               gt
   *  greaterThanOrEqualTo      gte
   *  hyper
   *  isFinite
   *  isInfinite
   *  isInteger                 isint
   *  isNaN
   *  isNegative                isneg
   *  isPositive                ispos
   *  iteratedexp
   *  iteratedlog
   *  lambertw
   *  layeradd
   *  layeradd10
   *  lessThan                  lt
   *  lessThanOrEqualTo         lte
   *  logarithm                 logBase
   *  minus                     sub
   *  modulo                    mod
   *  naturalLogarithm          ln        log
   *  negated                   neg
   *  notequals                 neq
   *  pentate                   pent
   *  plus                      add
   *  reciprocate               rec
   *  root
   *  round
   *  slog
   *  squareRoot                sqrt
   *  ssqrt                     ssrt
   *  sumArithmeticSeries
   *  sumGeometricSeries
   *  times                     mul
   *  tetrate                   tetr
   *  toExponential
   *  toFixed
   *  toHyperE
   *  toJSON
   *  toNumber
   *  toPower                   pow
   *  toPrecision
   *  toString
   *  toStringWithDecimalPlaces
   *  valueOf
   */
  R.ZERO=0;
  R.ONE=1;
  R.E=Math.E;
  R.LN2=Math.LN2;
  R.LN10=Math.LN10;
  R.LOG2E=Math.LOG2E;
  R.LOG10E=Math.LOG10E;
  R.PI=Math.PI;
  R.SQRT1_2=Math.SQRT1_2;
  R.SQRT2=Math.SQRT2;
  R.MAX_SAFE_INTEGER=MAX_SAFE_INTEGER;
  R.MIN_SAFE_INTEGER=Number.MIN_SAFE_INTEGER;
  R.NaN=Number.NaN;
  R.NEGATIVE_INFINITY=Number.NEGATIVE_INFINITY;
  R.POSITIVE_INFINITY=Number.POSITIVE_INFINITY;
  R.E_MAX_SAFE_INTEGER="e"+MAX_SAFE_INTEGER;
  R.EE_MAX_SAFE_INTEGER="ee"+MAX_SAFE_INTEGER;
  R.TETRATED_MAX_SAFE_INTEGER="10^^"+MAX_SAFE_INTEGER;
  R.GRAHAMS_NUMBER="J^63 10^^^(10^)^7625597484984 3638334640023.7783";
  P.absoluteValue=P.abs=function(){
    var x=this.clone();
    x.sign=1;
    return x;
  };
  Q.absoluteValue=Q.abs=function(x){
    return new ExpantaNum(x).abs();
  };
  P.negate=P.neg=function (){
    var x=this.clone();
    x.sign=x.sign*-1;
    return x;
  };
  Q.negate=Q.neg=function (x){
    return new ExpantaNum(x).neg();
  };
  P.compareTo=P.cmp=function (other){
    if (!(other instanceof ExpantaNum)) other=new ExpantaNum(other);
    if (isNaN(this.array[0][1])||isNaN(other.array[0][1])) return NaN;
    if (this.array[0][1]==Infinity&&other.array[0][1]!=Infinity) return this.sign;
    if (this.array[0][1]!=Infinity&&other.array[0][1]==Infinity) return -other.sign;
    if (this.array.length==1&&this.array[0][1]===0&&other.array.length==1&&other.array[0][1]===0) return 0;
    if (this.sign!=other.sign) return this.sign;
    var m=this.sign;
    var r;
    if (this.layer.gt(other.layer)) r=1;
    else if (this.layer.lt(other.layer)) r=-1;
    else{
      var e,f;
      for (var i=0,l=Math.min(this.array.length,other.array.length);i<l;++i){
        e=this.array[this.array.length-1-i];
        f=other.array[other.array.length-1-i];
        if (e[0]>f[0]||e[0]==f[0]&&e[1]>f[1]){
          r=1;
          break;
        }else if (e[0]<f[0]||e[0]==f[0]&&e[1]<f[1]){
          r=-1;
          break;
        }
      }
      if (r===undefined){
        if (this.array.length==other.array.length){
          r=0;
        }else if (this.array.length>other.array.length){
          e=this.array[this.array.length-l];
          if (e[0]>=1||e[1]>10){
            r=1;
          }else{
            r=-1;
          }
        }else{
          e=other.array[other.array.length-l];
          if (e[0]>=1||e[1]>10){
            r=-1;
          }else{
            r=1;
          }
        }
      }
    }
    return r*m;
  };
  Q.compare=Q.cmp=function (x,y){
    return new ExpantaNum(x).cmp(y);
  };
  P.greaterThan=P.gt=function (other){
    return this.cmp(other)>0;
  };
  Q.greaterThan=Q.gt=function (x,y){
    return new ExpantaNum(x).gt(y);
  };
  P.greaterThanOrEqualTo=P.gte=function (other){
    return this.cmp(other)>=0;
  };
  Q.greaterThanOrEqualTo=Q.gte=function (x,y){
    return new ExpantaNum(x).gte(y);
  };
  P.lessThan=P.lt=function (other){
    return this.cmp(other)<0;
  };
  Q.lessThan=Q.lt=function (x,y){
    return new ExpantaNum(x).lt(y);
  };
  P.lessThanOrEqualTo=P.lte=function (other){
    return this.cmp(other)<=0;
  };
  Q.lessThanOrEqualTo=Q.lte=function (x,y){
    return new ExpantaNum(x).lte(y);
  };
  P.equalsTo=P.equal=P.eq=function (other){
    return this.cmp(other)===0;
  };
  Q.equalsTo=Q.equal=Q.eq=function (x,y){
    return new ExpantaNum(x).eq(y);
  };
  P.notEqualsTo=P.notEqual=P.neq=function (other){
    return this.cmp(other)!==0;
  };
  Q.notEqualsTo=Q.notEqual=Q.neq=function (x,y){
    return new ExpantaNum(x).neq(y);
  };
  P.minimum=P.min=function (other){
    return this.lt(other)?this.clone():new ExpantaNum(other);
  };
  Q.minimum=Q.min=function (x,y){
    return new ExpantaNum(x).min(y);
  };
  P.maximum=P.max=function (other){
    return this.gt(other)?this.clone():new ExpantaNum(other);
  };
  Q.maximum=Q.max=function (x,y){
    return new ExpantaNum(x).max(y);
  };
  P.isPositive=P.ispos=function (){
    return this.gt(ExpantaNum.ZERO);
  };
  Q.isPositive=Q.ispos=function (x){
    return new ExpantaNum(x).ispos();
  };
  P.isNegative=P.isneg=function (){
    return this.lt(ExpantaNum.ZERO);
  };
  Q.isNegative=Q.isneg=function (x){
    return new ExpantaNum(x).isneg();
  };
  P.isNaN=function (){
    return isNaN(this.array[0][1]);
  };
  Q.isNaN=function (x){
    return new ExpantaNum(x).isNaN();
  };
  P.isFinite=function (){
    return isFinite(this.array[0][1]);
  };
  Q.isFinite=function (x){
    return new ExpantaNum(x).isFinite();
  };
  P.isInfinite=function (){
    return this.array[0][1]==Infinity;
  };
  Q.isInfinite=function (x){
    return new ExpantaNum(x).isInfinite();
  };
  P.isInteger=P.isint=function (){
    if (this.sign==-1) return this.abs().isint();
    if (this.gt(ExpantaNum.MAX_SAFE_INTEGER)) return true;
    return Number.isInteger(this.toNumber());
  };
  Q.isInteger=Q.isint=function (x){
    return new ExpantaNum(x).isint();
  };
  P.floor=function (){
    if (this.isInteger()) return this.clone();
    return new ExpantaNum(Math.floor(this.toNumber()));
  };
  Q.floor=function (x){
    return new ExpantaNum(x).floor();
  };
  P.ceiling=P.ceil=function (){
    if (this.isInteger()) return this.clone();
    return new ExpantaNum(Math.ceil(this.toNumber()));
  };
  Q.ceiling=Q.ceil=function (x){
    return new ExpantaNum(x).ceil();
  };
  P.round=function (){
    if (this.isInteger()) return this.clone();
    return new ExpantaNum(Math.round(this.toNumber()));
  };
  Q.round=function (x){
    return new ExpantaNum(x).round();
  };
  var debugMessageSent=false;
  P.plus=P.add=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL){
      console.log(this+"+"+other);
      if (!debugMessageSent) console.warn(expantaNumError+"Debug output via 'debug' is being deprecated and will be removed in the future!"),debugMessageSent=true;
    }
    if (x.sign==-1) return x.neg().add(other.neg()).neg();
    if (other.sign==-1) return x.sub(other.neg());
    if (x.eq(ExpantaNum.ZERO)) return other;
    if (other.eq(ExpantaNum.ZERO)) return x;
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()&&x.eq(other.neg())) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other;
    var p=x.min(other);
    var q=x.max(other);
    var op0=q.operator(0);
    var op1=q.operator(1);
    var t;
    if (q.gt(ExpantaNum.E_MAX_SAFE_INTEGER)||q.div(p).gt(ExpantaNum.MAX_SAFE_INTEGER)){
      t=q;
    }else if (!op1){
      t=new ExpantaNum(x.toNumber()+other.toNumber());
    }else if (op1==1){
      var a=p.operator(1)?p.operator(0):Math.log10(p.operator(0));
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)+1),1]);
    }
    p=q=null;
    return t;
  };
  Q.plus=Q.add=function (x,y){
    return new ExpantaNum(x).add(y);
  };
  P.minus=P.sub=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"-"+other);
    if (x.sign==-1) return x.neg().sub(other.neg()).neg();
    if (other.sign==-1) return x.add(other.neg());
    if (x.eq(other)) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ZERO)) return x;
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other.neg();
    var p=x.min(other);
    var q=x.max(other);
    var n=other.gt(x);
    var op0=q.operator(0);
    var op1=q.operator(1);
    var t;
    if (q.gt(ExpantaNum.E_MAX_SAFE_INTEGER)||q.div(p).gt(ExpantaNum.MAX_SAFE_INTEGER)){
      t=q;
      t=n?t.neg():t;
    }else if (!op1){
      t=new ExpantaNum(x.toNumber()-other.toNumber());
    }else if (op1==1){
      var a=p.operator(1)?p.operator(0):Math.log10(p.operator(0));
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)-1),1]);
      t=n?t.neg():t;
    }
    p=q=null;
    return t;
  };
  Q.minus=Q.sub=function (x,y){
    return new ExpantaNum(x).sub(y);
  };
  P.times=P.mul=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"*"+other);
    if (x.sign*other.sign==-1) return x.abs().mul(other.abs()).neg();
    if (x.sign==-1) return x.abs().mul(other.abs());
    if (x.isNaN()||other.isNaN()||x.eq(ExpantaNum.ZERO)&&other.isInfinite()||x.isInfinite()&&other.abs().eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ONE)) return x.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other;
    if (x.max(other).gt(ExpantaNum.EE_MAX_SAFE_INTEGER)) return x.max(other);
    var n=x.toNumber()*other.toNumber();
    if (n<=MAX_SAFE_INTEGER) return new ExpantaNum(n);
    return ExpantaNum.pow(10,x.log10().add(other.log10()));
  };
  Q.times=Q.mul=function (x,y){
    return new ExpantaNum(x).mul(y);
  };
  P.divide=P.div=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"/"+other);
    if (x.sign*other.sign==-1) return x.abs().div(other.abs()).neg();
    if (x.sign==-1) return x.abs().div(other.abs());
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()||x.eq(ExpantaNum.ZERO)&&other.eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.POSITIVE_INFINITY.clone();
    if (other.eq(ExpantaNum.ONE)) return x.clone();
    if (x.eq(other)) return ExpantaNum.ONE.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return ExpantaNum.ZERO.clone();
    if (x.max(other).gt(ExpantaNum.EE_MAX_SAFE_INTEGER)) return x.gt(other)?x.clone():ExpantaNum.ZERO.clone();
    var n=x.toNumber()/other.toNumber();
    if (n<=MAX_SAFE_INTEGER) return new ExpantaNum(n);
    var pw=ExpantaNum.pow(10,x.log10().sub(other.log10()));
    var fp=pw.floor();
    if (pw.sub(fp).lt(new ExpantaNum(1e-9))) return fp;
    return pw;
  };
  Q.divide=Q.div=function (x,y){
    return new ExpantaNum(x).div(y);
  };
  P.reciprocate=P.rec=function (){
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"^-1");
    if (this.isNaN()||this.eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (this.abs().gt("2e323")) return ExpantaNum.ZERO.clone();
    return new ExpantaNum(1/this);
  };
  Q.reciprocate=Q.rec=function (x){
    return new ExpantaNum(x).rec();
  };
  P.modular=P.mod=function (other){
    other=new ExpantaNum(other);
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (this.sign*other.sign==-1) return this.abs().mod(other.abs()).neg();
    if (this.sign==-1) return this.abs().mod(other.abs());
    return this.sub(this.div(other).floor().mul(other));
  };
  Q.modular=Q.mod=function (x,y){
    return new ExpantaNum(x).mod(y);
  };
  //All of these are from Patashu's break_eternity.js
  //from HyperCalc source code
  var f_gamma=function (n){
    if (!isFinite(n)) return n;
    if (n<-50){
      if (n==Math.trunc(n)) return Number.NEGATIVE_INFINITY;
      return 0;
    }
    var scal1=1;
    while (n<10){
      scal1=scal1*n;
      ++n;
    }
    n-=1;
    var l=0.9189385332046727; //0.5*Math.log(2*Math.PI)
    l+=(n+0.5)*Math.log(n);
    l-=n;
    var n2=n*n;
    var np=n;
    l+=1/(12*np);
    np*=n2;
    l+=1/(360*np);
    np*=np*n2;
    l+=1/(1260*np);
    np*=n2;
    l+=1/(1680*np);
    np*=n2;
    l+=1/(1188*np);
    np*=n2;
    l+=691/(360360*np);
    np*=n2;
    l+=7/(1092*np);
    np*=n2;
    l+=3617/(122400*np);
    return Math.exp(l)/scal1;
  };
  //from HyperCalc source code
  P.gamma=function (){
    var x=this.clone();
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(ExpantaNum.E_MAX_SAFE_INTEGER)) return ExpantaNum.exp(x);
    if (x.gt(ExpantaNum.MAX_SAFE_INTEGER)) return ExpantaNum.exp(ExpantaNum.mul(x,ExpantaNum.ln(x).sub(1)));
    var n=x.operator(0);
    if (n>1){
      if (n<24) return new ExpantaNum(f_gamma(x.sign*n));
      var t=n-1;
      var l=0.9189385332046727; //0.5*Math.log(2*Math.PI)
      l+=((t+0.5)*Math.log(t));
      l-=t;
      var n2=t*t;
      var np=t;
      var lm=12*np;
      var adj=1/lm;
      var l2=l+adj;
      if (l2==l) return ExpantaNum.exp(l);
      l=l2;
      np*=n2;
      lm=360*np;
      adj=1/lm;
      l2=l-adj;
      if (l2==l) return ExpantaNum.exp(l);
      l=l2;
      np*=n2;
      lm=1260*np;
      var lt=1/lm;
      l+=lt;
      np*=n2;
      lm=1680*np;
      lt=1/lm;
      l-=lt;
      return ExpantaNum.exp(l);
    }else return this.rec();
  };
  Q.gamma=function (x){
    return new ExpantaNum(x).gamma();
  };
  //end break_eternity.js excerpt
  Q.factorials=[1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368000,20922789888000,355687428096000,6402373705728000,121645100408832000,2432902008176640000,51090942171709440000,1.1240007277776076800e+21,2.5852016738884978213e+22,6.2044840173323941000e+23,1.5511210043330986055e+25,4.0329146112660565032e+26,1.0888869450418351940e+28,3.0488834461171387192e+29,8.8417619937397018986e+30,2.6525285981219106822e+32,8.2228386541779224302e+33,2.6313083693369351777e+35,8.6833176188118859387e+36,2.9523279903960415733e+38,1.0333147966386145431e+40,3.7199332678990125486e+41,1.3763753091226345579e+43,5.2302261746660111714e+44,2.0397882081197444123e+46,8.1591528324789768380e+47,3.3452526613163807956e+49,1.4050061177528799549e+51,6.0415263063373834074e+52,2.6582715747884488694e+54,1.1962222086548018857e+56,5.5026221598120891536e+57,2.5862324151116817767e+59,1.2413915592536072528e+61,6.0828186403426752249e+62,3.0414093201713375576e+64,1.5511187532873821895e+66,8.0658175170943876846e+67,4.2748832840600254848e+69,2.3084369733924137924e+71,1.2696403353658276447e+73,7.1099858780486348103e+74,4.0526919504877214100e+76,2.3505613312828784949e+78,1.3868311854568983861e+80,8.3209871127413898951e+81,5.0758021387722483583e+83,3.1469973260387939390e+85,1.9826083154044400850e+87,1.2688693218588416544e+89,8.2476505920824715167e+90,5.4434493907744306945e+92,3.6471110918188683221e+94,2.4800355424368305480e+96,1.7112245242814129738e+98,1.1978571669969892213e+100,8.5047858856786230047e+101,6.1234458376886084639e+103,4.4701154615126843855e+105,3.3078854415193862416e+107,2.4809140811395399745e+109,1.8854947016660503806e+111,1.4518309202828587210e+113,1.1324281178206296794e+115,8.9461821307829757136e+116,7.1569457046263805709e+118,5.7971260207473678414e+120,4.7536433370128420198e+122,3.9455239697206587884e+124,3.3142401345653531943e+126,2.8171041143805501310e+128,2.4227095383672734128e+130,2.1077572983795278544e+132,1.8548264225739843605e+134,1.6507955160908460244e+136,1.4857159644817615149e+138,1.3520015276784029158e+140,1.2438414054641308179e+142,1.1567725070816415659e+144,1.0873661566567430754e+146,1.0329978488239059305e+148,9.9167793487094964784e+149,9.6192759682482120384e+151,9.4268904488832479837e+153,9.3326215443944153252e+155,9.3326215443944150966e+157,9.4259477598383598816e+159,9.6144667150351270793e+161,9.9029007164861804721e+163,1.0299016745145628100e+166,1.0813967582402909767e+168,1.1462805637347083683e+170,1.2265202031961380050e+172,1.3246418194518290179e+174,1.4438595832024936625e+176,1.5882455415227430287e+178,1.7629525510902445874e+180,1.9745068572210740115e+182,2.2311927486598137657e+184,2.5435597334721876552e+186,2.9250936934930159967e+188,3.3931086844518980862e+190,3.9699371608087210616e+192,4.6845258497542909237e+194,5.5745857612076058231e+196,6.6895029134491271205e+198,8.0942985252734440920e+200,9.8750442008336010580e+202,1.2146304367025329301e+205,1.5061417415111409314e+207,1.8826771768889261129e+209,2.3721732428800468512e+211,3.0126600184576594309e+213,3.8562048236258040716e+215,4.9745042224772874590e+217,6.4668554892204741474e+219,8.4715806908788206314e+221,1.1182486511960043298e+224,1.4872707060906857134e+226,1.9929427461615187928e+228,2.6904727073180504073e+230,3.6590428819525488642e+232,5.0128887482749919605e+234,6.9177864726194885808e+236,9.6157231969410893532e+238,1.3462012475717525742e+241,1.8981437590761708898e+243,2.6953641378881628530e+245,3.8543707171800730787e+247,5.5502938327393044385e+249,8.0479260574719917061e+251,1.1749972043909107097e+254,1.7272458904546389230e+256,2.5563239178728653927e+258,3.8089226376305697893e+260,5.7133839564458546840e+262,8.6272097742332399855e+264,1.3113358856834524492e+267,2.0063439050956822953e+269,3.0897696138473507759e+271,4.7891429014633940780e+273,7.4710629262828942235e+275,1.1729568794264144743e+278,1.8532718694937349890e+280,2.9467022724950384028e+282,4.7147236359920616095e+284,7.5907050539472189932e+286,1.2296942187394494177e+289,2.0044015765453026266e+291,3.2872185855342959088e+293,5.4239106661315886750e+295,9.0036917057784375454e+297,1.5036165148649991456e+300,2.5260757449731984219e+302,4.2690680090047051083e+304,7.2574156153079990350e+306];
  P.factorial=P.fact=function (){
    var x=this.clone();
    var f=ExpantaNum.factorials;
    if (x.lt(ExpantaNum.ZERO)||!x.isint()) return x.add(1).gamma();
    if (x.lte(170)) return new ExpantaNum(f[+x]);
    var errorFixer=1;
    var e=+x;
    if (e<500) e+=163879/209018880*Math.pow(e,5);
    if (e<1000) e+=-571/2488320*Math.pow(e,4);
    if (e<50000) e+=-139/51840*Math.pow(e,3);
    if (e<1e7) e+=1/288*Math.pow(e,2);
    if (e<1e20) e+=1/12*e;
    return x.div(ExpantaNum.E).pow(x).mul(x.mul(ExpantaNum.PI).mul(2).sqrt()).times(errorFixer);
  };
  Q.factorial=Q.fact=function (x){
    return new ExpantaNum(x).fact();
  };
  P.toPower=P.pow=function (other){
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"^"+other);
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
    if (other.eq(ExpantaNum.ONE)) return this.clone();
    if (other.lt(ExpantaNum.ZERO)) return this.pow(other.neg()).rec();
    if (this.lt(ExpantaNum.ZERO)&&other.isint()){
      if (other.mod(2).lt(ExpantaNum.ONE)) return this.abs().pow(other);
      return this.abs().pow(other).neg();
    }
    if (this.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (this.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
    if (this.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (this.max(other).gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return this.max(other);
    if (this.eq(10)){
      if (other.gt(ExpantaNum.ZERO)){
        other.operator(1,(other.operator(1)+1)||1);
        other.normalize();
        return other;
      }else{
        return new ExpantaNum(Math.pow(10,other.toNumber()));
      }
    }
    if (other.lt(ExpantaNum.ONE)) return this.root(other.rec());
    var n=Math.pow(this.toNumber(),other.toNumber());
    if (n<=MAX_SAFE_INTEGER) return new ExpantaNum(n);
    return ExpantaNum.pow(10,this.log10().mul(other));
  };
  Q.toPower=Q.pow=function (x,y){
    return new ExpantaNum(x).pow(y);
  };
  P.exponential=P.exp=function (){
    return ExpantaNum.pow(Math.E,this);
  };
  Q.exponential=Q.exp=function (x){
    return ExpantaNum.pow(Math.E,x);
  };
  P.squareRoot=P.sqrt=function (){
    return this.root(2);
  };
  Q.squareRoot=Q.sqrt=function (x){
    return new ExpantaNum(x).root(2);
  };
  P.cubeRoot=P.cbrt=function (){
    return this.root(3);
  };
  Q.cubeRoot=Q.cbrt=function (x){
    return new ExpantaNum(x).root(3);
  };
  P.root=function (other){
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"root"+other);
    if (other.eq(ExpantaNum.ONE)) return this.clone();
    if (other.lt(ExpantaNum.ZERO)) return this.root(other.neg()).rec();
    if (other.lt(ExpantaNum.ONE)) return this.pow(other.rec());
    if (this.lt(ExpantaNum.ZERO)&&other.isint()&&other.mod(2).eq(ExpantaNum.ONE)) return this.neg().root(other).neg();
    if (this.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (this.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
    if (this.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (this.max(other).gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return this.gt(other)?this.clone():ExpantaNum.ZERO.clone();
    return ExpantaNum.pow(10,this.log10().div(other));
  };
  Q.root=function (x,y){
    return new ExpantaNum(x).root(y);
  };
  P.generalLogarithm=P.log10=function (){
    var x=this.clone();
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log("log"+this);
    if (x.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (x.eq(ExpantaNum.ZERO)) return ExpantaNum.NEGATIVE_INFINITY.clone();
    if (x.lte(ExpantaNum.MAX_SAFE_INTEGER)) return new ExpantaNum(Math.log10(x.toNumber()));
    if (!x.isFinite()) return x;
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    x.operator(1,x.operator(1)-1);
    return x.normalize();
  };
  Q.generalLogarithm=Q.log10=function (x){
    return new ExpantaNum(x).log10();
  };
  P.logarithm=P.logBase=function (base){
    if (base===undefined) base=Math.E;
    return this.log10().div(ExpantaNum.log10(base));
  };
  Q.logarithm=Q.logBase=function (x,base){
    return new ExpantaNum(x).logBase(base);
  };
  P.naturalLogarithm=P.log=P.ln=function (){
    return this.logBase(Math.E);
  };
  Q.naturalLogarithm=Q.log=Q.ln=function (x){
    return new ExpantaNum(x).ln();
  };
  //All of these are from Patashu's break_eternity.js
  var OMEGA=0.56714329040978387299997;  //W(1,0)
  //from https://math.stackexchange.com/a/465183
  //The evaluation can become inaccurate very close to the branch point
  var f_lambertw=function (z,tol){
    if (tol===undefined) tol=1e-10;
    var w;
    var wn;
    if (!Number.isFinite(z)) return z;
    if (z===0) return z;
    if (z===1) return OMEGA;
    if (z<10) w=0;
    else w=Math.log(z)-Math.log(Math.log(z));
    for (var i=0;i<100;++i){
      wn=(z*Math.exp(-w)+w*w)/(w+1);
      if (Math.abs(wn-w)<tol*Math.abs(wn)) return wn;
      w=wn;
    }
    throw Error("Iteration failed to converge: "+z);
    //return Number.NaN;
  };
  //from https://github.com/scipy/scipy/blob/8dba340293fe20e62e173bdf2c10ae208286692f/scipy/special/lambertw.pxd
  //The evaluation can become inaccurate very close to the branch point
  //at ``-1/e``. In some corner cases, `lambertw` might currently
  //fail to converge, or can end up on the wrong branch.
  var d_lambertw=function (z,tol){
    if (tol===undefined) tol=1e-10;
    z=new ExpantaNum(z);
    var w;
    var ew, wewz, wn;
    if (!z.isFinite()) return z;
    if (z===0) return z;
    if (z===1){
      //Split out this case because the asymptotic series blows up
      return OMEGA;
    }
    //Get an initial guess for Halley's method
    w=ExpantaNum.ln(z);
    //Halley's method; see 5.9 in [1]
    for (var i=0;i<100;++i){
      ew=ExpantaNum.exp(-w);
      wewz=w.sub(z.mul(ew));
      wn=w.sub(wewz.div(w.add(ExpantaNum.ONE).sub((w.add(2)).mul(wewz).div((ExpantaNum.mul(2,w).add(2))))));
      if (ExpantaNum.abs(wn.sub(w)).lt(ExpantaNum.abs(wn).mul(tol))) return wn;
      w = wn;
    }
    throw Error("Iteration failed to converge: "+z);
    //return Decimal.dNaN;
  };
  //The Lambert W function, also called the omega function or product logarithm, is the solution W(x) === x*e^x.
  //https://en.wikipedia.org/wiki/Lambert_W_function
  //Some special values, for testing: https://en.wikipedia.org/wiki/Lambert_W_function#Special_values
  P.lambertw=function (){
    var x=this.clone();
    if (x.isNaN()) return x;
    if (x.lt(-0.3678794411710499)) throw Error("lambertw is unimplemented for results less than -1, sorry!");
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(ExpantaNum.EE_MAX_SAFE_INTEGER)){
      x.operator(1,x.operator(1)-1);
      return x;
    }
    if (x.gt(ExpantaNum.MAX_SAFE_INTEGER)) return d_lambertw(x);
    else return new ExpantaNum(f_lambertw(x.sign*x.operator(0)));
  };
  Q.lambertw=function (x){
    return new ExpantaNum(x).lambertw();
  };
  //end break_eternity.js excerpt
  //Uses linear approximations for real height
  P.tetrate=P.tetr=function (other,payload){
    if (payload===undefined) payload=ExpantaNum.ONE;
    var t=this.clone();
    other=new ExpantaNum(other);
    payload=new ExpantaNum(payload);
    if (payload.neq(ExpantaNum.ONE)) other=other.add(payload.slog(t));
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(t+"^^"+other);
    var negln;
    if (t.isNaN()||other.isNaN()||payload.isNaN()) return ExpantaNum.NaN.clone();
    if (other.isInfinite()&&other.sign>0){
      if (t.gte(Math.exp(1/Math.E))) return ExpantaNum.POSITIVE_INFINITY.clone();
      //Formula for infinite height power tower.
      negln = t.ln().neg();
      return negln.lambertw().div(negln);
    }
    if (other.lte(-2)) return ExpantaNum.NaN.clone();
    if (t.eq(ExpantaNum.ZERO)){
      if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
      if (other.mod(2).eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
      return ExpantaNum.ONE.clone();
    }
    if (t.eq(ExpantaNum.ONE)){
      if (other.eq(ExpantaNum.ONE.neg())) return ExpantaNum.NaN.clone();
      return ExpantaNum.ONE.clone();
    }
    if (other.eq(ExpantaNum.ONE.neg())) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
    if (other.eq(ExpantaNum.ONE)) return t;
    if (other.eq(2)) return t.pow(t);
    if (t.eq(2)){
      if (other.eq(3)) return new ExpantaNum(16);
      if (other.eq(4)) return new ExpantaNum(65536);
    }
    var m=t.max(other);
    if (m.gt("10^^^"+MAX_SAFE_INTEGER)) return m;
    if (m.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)||other.gt(ExpantaNum.MAX_SAFE_INTEGER)){
      if (this.lt(Math.exp(1/Math.E))){
        negln = t.ln().neg();
        return negln.lambertw().div(negln);
      }
      var j=t.slog(10).add(other);
      j.operator(2,(j.operator(2)||0)+1);
      j.normalize();
      return j;
    }
    var y=other.toNumber();
    var f=Math.floor(y);
    var r=t.pow(y-f);
    var l=ExpantaNum.NaN;
    for (var i=0,w=new ExpantaNum(ExpantaNum.E_MAX_SAFE_INTEGER);f!==0&&r.lt(w)&&i<100;++i){
      if (f>0){
        r=t.pow(r);
        if (l.eq(r)){
          f=0;
          break;
        }
        l=r;
        --f;
      }else{
        r=r.logBase(t);
        if (l.eq(r)){
          f=0;
          break;
        }
        l=r;
        ++f;
      }
    }
    if (i==100||this.lt(Math.exp(1/Math.E))) f=0;
    r.operator(1,(r.operator(1)+f)||f);
    r.normalize();
    return r;
  };
  Q.tetrate=Q.tetr=function (x,y,payload){
    return new ExpantaNum(x).tetr(y,payload);
  };
  //Implementation of functions from break_eternity.js
  P.iteratedexp=function (other,payload){
    return this.tetr(other,payload);
  };
  Q.iteratedexp=function (x,y,payload){
    return new ExpantaNum(x).iteratedexp(other,payload);
  };
  //This implementation is highly inaccurate and slow, and probably be given custom code
  P.iteratedlog=function (base,other){
    if (base===undefined) base=10;
    if (other===undefined) other=ExpantaNum.ONE.clone();
    var t=this.clone();
    if (other.eq(ExpantaNum.ZERO)) return t;
    if (other.eq(ExpantaNum.ONE)) return t.logBase(base);
    base=new ExpantaNum(base);
    other=new ExpantaNum(other);
    return base.tetr(t.slog(base).sub(other));
  };
  Q.iteratedlog=function (x,y,z){
    return new ExpantaNum(x).iteratedlog(y,z);
  };
  P.layeradd=function (other,base){
    if (base===undefined) base=10;
    if (other===undefined) other=ExpantaNum.ONE.clone();
    var t=this.clone();
    base=new ExpantaNum(base);
    other=new ExpantaNum(other);
    return base.tetr(t.slog(base).add(other));
  };
  Q.layeradd=function (x,y,z){
    return new ExpantaNum(x).layeradd(y,z);
  };
  P.layeradd10=function (other){
    return this.layeradd(other);
  };
  Q.layeradd10=function (x,y){
    return new ExpantaNum(x).layeradd10(y);
  };
  //End implementation from break_eternity.js
  //All of these are from Patashu's break_eternity.js
  //The super square-root function - what number, tetrated to height 2, equals this?
  //Other sroots are possible to calculate probably through guess and check methods, this one is easy though.
  //https://en.wikipedia.org/wiki/Tetration#Super-root
  P.ssqrt=P.ssrt=function (){
    var x=this.clone();
    if (x.lt(Math.exp(-1/Math.E))) return ExpantaNum.NaN.clone();
    if (!x.isFinite()) return x;
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(ExpantaNum.EE_MAX_SAFE_INTEGER)){
      x.operator(1,x.operator(1)-1);
      return x;
    }
    var l=x.ln();
    return l.div(l.lambertw());
  };
  Q.ssqrt=Q.ssrt=function (x){
    return new ExpantaNum(x).ssqrt();
  };
  //Super-logarithm, one of tetration's inverses, tells you what size power tower you'd have to tetrate base to to get number. By definition, will never be higher than 1.8e308 in break_eternity.js, since a power tower 1.8e308 numbers tall is the largest representable number.
  //Uses linear approximation
  //https://en.wikipedia.org/wiki/Super-logarithm
  P.slog=function (base){
    if (base===undefined) base=10;
    var x=new ExpantaNum(this);
    base=new ExpantaNum(base);
    if (x.isNaN()||base.isNaN()||x.isInfinite()&&base.isInfinite()) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (base.isInfinite()) return ExpantaNum.ZERO.clone();
    if (x.lt(ExpantaNum.ZERO)) return ExpantaNum.ONE.neg();
    if (x.eq(ExpantaNum.ONE)) return ExpantaNum.ZERO.clone();
    if (x.eq(base)) return ExpantaNum.ONE.clone();
    if (base.lt(Math.exp(1/Math.E))){
      var a=ExpantaNum.tetr(base,Infinity);
      if (x.eq(a)) return ExpantaNum.POSITIVE_INFINITY.clone();
      if (x.gt(a)) return ExpantaNum.NaN.clone();
    }
    if (x.max(base).gt("10^^^"+MAX_SAFE_INTEGER)){
      if (x.gt(base)) return x;
      return ExpantaNum.ZERO.clone();
    }
    if (x.max(base).gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)){
      if (x.gt(base)){
        x.operator(2,x.operator(2)-1);
        x.normalize();
        return x.sub(x.operator(1));
      }
      return ExpantaNum.ZERO.clone();
    }
    var r=0;
    var t=(x.operator(1)||0)-(base.operator(1)||0);
    if (t>3){
      var l=t-3;
      r+=l;
      x.operator(1,x.operator(1)-l);
    }
    for (var i=0;i<100;++i){
      if (x.lt(ExpantaNum.ZERO)){
        x=ExpantaNum.pow(base,x);
        --r;
      }else if (x.lte(1)){
        return new ExpantaNum(r+x.toNumber()-1);
      }else{
        ++r;
        x=ExpantaNum.logBase(x,base);
      }
    }
    if (x.gt(10))
    return new ExpantaNum(r);
  };
  Q.slog=function (x,y){
    return new ExpantaNum(x).slog(y);
  };
  //end break_eternity.js excerpt
  P.pentate=P.pent=function (other){
    return this.arrow(3)(other);
  };
  Q.pentate=Q.pent=function (x,y){
    return ExpantaNum.arrow(x,3,y);
  };
  //Uses linear approximations for real height
  P.arrow=function (arrows){
    var t=this.clone();
    arrows=new ExpantaNum(arrows);
    if (!arrows.isint()||arrows.lt(ExpantaNum.ZERO)) return function(other){return ExpantaNum.NaN.clone();};
    if (arrows.eq(ExpantaNum.ZERO)) return function(other){return t.mul(other);};
    if (arrows.eq(ExpantaNum.ONE)) return function(other){return t.pow(other);};
    if (arrows.eq(2)) return function(other){return t.tetr(other);};
    return function (other){
      var depth;
      if (arguments.length==2) depth=arguments[1]; //must hide
      else depth=0;
      other=new ExpantaNum(other);
      var r;
      if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(t+"{"+arrows+"}"+other);
    if (t.isNaN()||other.isNaN()) return ExpantaNum.NaN.clone();
      if (other.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
      if (t.eq(ExpantaNum.ZERO)){
        if (other.eq(ExpantaNum.ONE)) return ExpantaNum.ZERO.clone();
        return ExpantaNum.NaN.clone();
      }
      if (t.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
      if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
      if (other.eq(ExpantaNum.ONE)) return t.clone();
      if (arrows.gt(ExpantaNum.MAX_SAFE_INTEGER)){
        r=arrows.clone();
        r.layer=r.layer.add(1);
        return r;
      }
      var arrowsNum=arrows.toNumber();
      if (other.eq(2)) return t.arrow(arrowsNum-1)(t,depth+1);
      if (t.max(other).gt("10{"+(arrowsNum+1)+"}"+MAX_SAFE_INTEGER)) return t.max(other);
      if (t.gt("10{"+arrowsNum+"}"+MAX_SAFE_INTEGER)||other.gt(ExpantaNum.MAX_SAFE_INTEGER)){
        if (t.gt("10{"+arrowsNum+"}"+MAX_SAFE_INTEGER)){
          r=t.clone();
          r.operator(arrowsNum,r.operator(arrowsNum)-1);
          r.normalize();
        }else if (t.gt("10{"+(arrowsNum-1)+"}"+MAX_SAFE_INTEGER)){
          r=new ExpantaNum(t.operator(arrowsNum-1));
        }else{
          r=ExpantaNum.ZERO;
        }
        var j=r.add(other);
        j.operator(arrowsNum,(j.operator(arrowsNum)||0)+1);
        j.normalize();
        return j;
      }
      if (depth>=ExpantaNum.maxOps+10){
        return new ExpantaNum([[0,10],[arrowsNum,1]]);
      }
      var y=other.toNumber();
      var f=Math.floor(y);
      var arrows_m1=arrows.sub(ExpantaNum.ONE);
      r=t.arrow(arrows_m1)(y-f,depth+1);
      for (var i=0,m=new ExpantaNum("10{"+(arrowsNum-1)+"}"+MAX_SAFE_INTEGER);f!==0&&r.lt(m)&&i<100;++i){
        if (f>0){
          r=t.arrow(arrows_m1)(r,depth+1);
          --f;
        }
      }
      if (i==100) f=0;
      r.operator(arrowsNum-1,(r.operator(arrowsNum-1)+f)||f);
      r.normalize();
      return r;
    };
  };
  P.chain=function (other,arrows){
    return this.arrow(arrows)(other);
  };
  Q.arrow=function (x,z,y){
    return new ExpantaNum(x).arrow(z)(y);
  };
  Q.chain=function (x,y,z){
    return new ExpantaNum(x).arrow(z)(y);
  };
  Q.hyper=function (z){
    z=new ExpantaNum(z);
    if (z.eq(ExpantaNum.ZERO)) return function(x,y){return new ExpantaNum(y).eq(ExpantaNum.ZERO)?new ExpantaNum(x):new ExpantaNum(x).add(ExpantaNum.ONE);};
    if (z.eq(ExpantaNum.ONE)) return function(x,y){return ExpantaNum.add(x,y);};
    return function(x,y){return new ExpantaNum(x).arrow(z.sub(2))(y);};
  };
  P.expansion=function (other){
    var t=this.clone();
    other=new OmegaNum(other);
    var r;
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log("{"+t+","+other+",1,2}");
    if (other.lte(ExpantaNum.ZERO)||!other.isint()) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ONE)) return t.clone();
    if (!t.isint()) return ExpantaNum.NaN.clone();
    if (t.eq(2)) return new ExpantaNum(4);
    if (other.eq(OmegaNum.POSITIVE_INFINITY)) return ExpantaNum.POSITIVE_INFINITY.clone();
    var f=other.sub(1);
    r=t;
    for (var i=0;!f.eq(0)&&r.lt(ExpantaNum.MAX_SAFE_INTEGER)&&i<100;++i){
      if (f.gt(0)){
        r=t.arrow(r)(t);
        f=f.sub(1);
      }
    }
    if (i==100) f=new OmegaNum(0);
    r.layer=r.layer.add(f);
    r.normalize();
    return r;
  };
  Q.expansion=function (x,y){
    return new ExpantaNum(x).expansion(y);
  };
  // All of these are from Patashu's break_eternity.js
  Q.affordGeometricSeries = function (resourcesAvailable, priceStart, priceRatio, currentOwned) {
    /*
      If you have resourcesAvailable, the price of something starts at
      priceStart, and on each purchase it gets multiplied by priceRatio,
      and you have already bought currentOwned, how many of the object
      can you buy.
    */
    resourcesAvailable=new ExpantaNum(resourcesAvailable);
    priceStart=new ExpantaNum(priceStart);
    priceRatio=new ExpantaNum(priceRatio);
    var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
    return ExpantaNum.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(ExpantaNum.ONE)).add(ExpantaNum.ONE).log10().div(priceRatio.log10()));
  };
  Q.affordArithmeticSeries = function (resourcesAvailable, priceStart, priceAdd, currentOwned) {
    /*
      If you have resourcesAvailable, the price of something starts at
      priceStart, and on each purchase it gets increased by priceAdd,
      and you have already bought currentOwned, how many of the object
      can you buy.
    */
    resourcesAvailable=new ExpantaNum(resourcesAvailable);
    priceStart=new ExpantaNum(priceStart);
    priceAdd=new ExpantaNum(priceAdd);
    currentOwned=new ExpantaNum(currentOwned);
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));
    var b = actualStart.sub(priceAdd.div(2));
    var b2 = b.pow(2);
    return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
  };
  Q.sumGeometricSeries = function (numItems, priceStart, priceRatio, currentOwned) {
    /*
      If you want to buy numItems of something, the price of something starts at
      priceStart, and on each purchase it gets multiplied by priceRatio,
      and you have already bought currentOwned, what will be the price of numItems
      of something.
    */
    priceStart=new ExpantaNum(priceStart);
    priceRatio=new ExpantaNum(priceRatio);
    return priceStart.mul(priceRatio.pow(currentOwned)).mul(ExpantaNum.sub(ExpantaNum.ONE, priceRatio.pow(numItems))).div(ExpantaNum.sub(ExpantaNum.ONE, priceRatio));
  };
  Q.sumArithmeticSeries = function (numItems, priceStart, priceAdd, currentOwned) {
    /*
      If you want to buy numItems of something, the price of something starts at
      priceStart, and on each purchase it gets increased by priceAdd,
      and you have already bought currentOwned, what will be the price of numItems
      of something.
    */
    numItems=new ExpantaNum(numItems);
    priceStart=new ExpantaNum(priceStart);
    currentOwned=new ExpantaNum(currentOwned);
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));

    return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(ExpantaNum.ONE).mul(priceAdd)));
  };
  // Binomial Coefficients n choose k
  Q.choose = function (n, k) {
    /*
      If you have n items and you take k out,
      how many ways could you do this?
    */
    return new ExpantaNum(n).factorial().div(new ExpantaNum(k).factorial().mul(new ExpantaNum(n).sub(new ExpantaNum(k)).factorial()));
  };
  P.choose = function (other) {
    return ExpantaNum.choose(this, other);
  };
  //end break_eternity.js excerpt
  P.normalize=function (){
    var b;
    var x=this;
    if (ExpantaNum.debug>=ExpantaNum.ALL) console.log(x.toString());
    if (!x.array||!x.array.length) x.array=[[0,0]];
    if (x.sign!=1&&x.sign!=-1){
      if (typeof x.sign!="number") x.sign=Number(x.sign);
      x.sign=x.sign<0?-1:1;
    }
    if (x.layer.isint()) x.layer=x.layer.floor();
    for (var i=0;i<x.array.length;++i){
      var e=x.array[i];
      if (e[0]===null||e[0]===undefined){
        e[0]=0;
      }
      if (e[0]!==0&&(e[1]===0||e[1]===null||e[1]===undefined)){
        x.array.splice(i,1);
        --i;
        continue;
      }
      if (isNaN(e[0])||isNaN(e[1])){
        x.array=[[0,NaN]];
        return x;
      }
      if (!isFinite(e[0])||!isFinite(e[1])){
        x.array=[[0,Infinity]];
        return x;
      }
      if (!Number.isInteger(e[0])) e[0]=Math.floor(e[0]);
      if (e[0]!==0&&!Number.isInteger(e[1])) e[1]=Math.floor(e[1]);
    }
    do{
      if (ExpantaNum.debug>=ExpantaNum.ALL) console.log(x.toString());
      b=false;
      x.array.sort(function (a,b){return a[0]>b[0]?1:a[0]<b[0]?-1:0;});
      if (x.array.length>ExpantaNum.maxOps) x.array.splice(0,x.array.length-ExpantaNum.maxOps);
      if (!x.array.length) x.array=[[0,0]];
      if (x.array[x.array.length-1][0]>MAX_SAFE_INTEGER){
        x.layer=x.layer.add(1);
        x.array=[[0,x.array[x.array.length-1][0]]];
        b=true;
      }else if (x.layer.gt(0)&&x.array.length==1&&x.array[0][0]===0){
        x.layer=x.layer.sub(1);
        if (x.array[0][1]===0) x.array=[[0,10]];
        else x.array=[[0,10],[Math.round(x.array[0][1]),1]];
        b=true;
      }
      if (x.array.length<ExpantaNum.maxOps&&x.array[0][0]!==0) x.array.unshift([0,10]);
      for (i=0;i<x.array.length-1;++i){
        if (x.array[i][0]==x.array[i+1][0]){
          x.array[i][1]+=x.array[i+1][1];
          x.array.splice(i+1,1);
          --i;
          b=true;
        }
      }
      if (x.array[0][0]===0&&x.array[0][1]>MAX_SAFE_INTEGER){
        if (x.array.length>=2&&x.array[1][0]==1){
          x.array[1][1]++;
        }else{
          x.array.splice(1,0,[1,1]);
        }
        x.array[0][1]=Math.log10(x.array[0][1]);
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[0][1]<MAX_E&&x.array[1][0]==1&&x.array[1][1]){
        x.array[0][1]=Math.pow(10,x.array[0][1]);
        if (x.array[1][1]>1){
          x.array[1][1]--;
        }else{
          x.array.splice(1,1);
        }
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[0][1]==1&&x.array[1][1]){
        if (x.array[1][1]>1){
          x.array[1][1]--;
        }else{
          x.array.splice(1,1);
        }
        x.array[0][1]=10;
      }
      if (x.array.length>=2&&x.array[0][0]===0&&x.array[1][0]!=1){
        if (x.array[0][1]) x.array.splice(1,0,[x.array[1][0]-1,x.array[0][1]]);
        x.array[0][1]=1;
        if (x.array[2][1]>1){
          x.array[2][1]--;
        }else{
          x.array.splice(2,1);
        }
        b=true;
      }
      for (i=1;i<x.array.length;++i){
        if (x.array[i][1]>MAX_SAFE_INTEGER){
          if (i!=x.array.length-1&&x.array[i+1][0]==x.array[i][0]+1){
            x.array[i+1][1]++;
          }else{
            x.array.splice(i+1,0,[x.array[i][0]+1,1]);
          }
          if (x.array[0][0]===0){
            x.array[0][1]=x.array[i][1]+1;
          }else{
            x.array.splice(0,0,[0,x.array[i][1]+1]);
          }
          x.array.splice(1,i);
          b=true;
        }
      }
    }while(b);
    if (new OmegaNum(x.layer).eq(OmegaNum.POSITIVE_INFINITY)){
      x.array=[[0,Infinity]];
      x.layer=new OmegaNum(0);
      return x;
    }
    if (!x.array.length) x.array=[[0,0]];
    return x;
  };
  var standardizeMessageSent=false;
  P.standardize=function (){
    if (!standardizeMessageSent) console.warn(expantaNumError+"'standardize' method is being deprecated in favor of 'normalize' and will be removed in the future!"),standardizeMessageSent=true;
    return this.normalize();
  }
  P.toNumber=function (){
    //console.log(this.array);
    if (this.sign==-1) return -1*this.abs();
    if (this.array.length>=2&&(this.array[1][0]>=2||this.array[1][1]>=2||this.array[1][1]==1&&this.array[0][1]>Math.log10(Number.MAX_VALUE))) return Infinity;
    if (this.array.length>=2&&this.array[1][1]==1) return Math.pow(10,this.array[0][1]);
    return this.array[0][1];
  };
  P.toString=function (){
    if (this.sign==-1) return "-"+this.abs();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    var s="";
    if (this.layer.eq(0)) s+="";
    else if (this.layer.lt(3)) s+="J".repeat(this.layer);
    else s+="J^("+this.layer+") ";
    if (this.array.length>=3||this.array.length==2&&this.array[1][0]>=2){
      for (var i=this.array.length-1;i>=2;--i){
        var e=this.array[i];
        var q=e[0]>=5?"{"+e[0]+"}":"^".repeat(e[0]);
        if (e[1]>1) s+="(10"+q+")^"+e[1]+" ";
        else if (e[1]==1) s+="10"+q;
      }
    }
    var op0=this.operator(0);
    var op1=this.operator(1);
    if (!op1) s+=String(op0);
    else if (op1<3) s+="e".repeat(op1-1)+Math.pow(10,op0-Math.floor(op0))+"e"+Math.floor(op0);
    else if (op1<8) s+="e".repeat(op1)+op0;
    else s+="(10^)^"+op1+" "+op0;
    return s;
  };
  //from break_eternity.js
  var decimalPlaces=function decimalPlaces(value,places){
    var len=places+1;
    var numDigits=Math.ceil(Math.log10(Math.abs(value)));
    if (numDigits<100) numDigits=0; //A hack-y solution to https://github.com/Naruyoko/ExpantaNum.js/issues/22
    var rounded=Math.round(value*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);
    return parseFloat(rounded.toFixed(Math.max(Math.min(len-numDigits,100),0)));
  };
  P.toStringWithDecimalPlaces=function (places,applyToOpNums){
    if (this.sign==-1) return "-"+this.abs();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    var b=0;
    var s="";
    var m=Math.pow(10,places);
    if (this.layer.eq(0)) s+="";
    else if (this.layer.lt(3)) s+="J".repeat(this.layer);
    else s+="J^"+this.layer+" ";
    if (this.array.length>=3||this.array.length==2&&this.array[1][0]>=2){
      for (var i=this.array.length-1;!b&&i>=2;--i){
        var e=this.array[i];
        var w=e[0];
        var x=e[1];
        if (applyToOpNums&&x>=m){
          ++w;
          b=x;
          x=1;
        }else if (applyToOpNums&&this.array[i-1][0]==w-1&&this.array[i-1][1]>=m){
          ++x;
          b=this.array[i-1][1];
        }
        var q=w>=5?"{"+w+"}":"^".repeat(w);
        if (x>1) s+="(10"+q+")^"+x+" ";
        else if (x==1) s+="10"+q;
      }
    }
    var k=this.operator(0);
    var l=this.operator(1);
    if (k>m){
      k=Math.log10(k);
      ++l;
    }
    if (b) s+=decimalPlaces(b,places);
    else if (!l) s+=String(decimalPlaces(k,places));
    else if (l<3) s+="e".repeat(l-1)+decimalPlaces(Math.pow(10,k-Math.floor(k)),places)+"e"+decimalPlaces(Math.floor(k),places);
    else if (l<8) s+="e".repeat(l)+decimalPlaces(k,places);
    else if (applyToOpNums) s+="(10^)^"+decimalPlaces(l,places)+" "+decimalPlaces(k,places);
    else s+="(10^)^"+l+" "+decimalPlaces(k,places);
    return s;
  };
  //these are from break_eternity.js as well
  P.toExponential=function (places,applyToOpNums){
    if (this.array.length==1) return (this.sign*this.array[0][1]).toExponential(places);
    return this.toStringWithDecimalPlaces(places,applyToOpNums);
  };
  P.toFixed=function (places,applyToOpNums){
    if (this.array.length==1) return (this.sign*this.array[0][1]).toFixed(places);
    return this.toStringWithDecimalPlaces(places,applyToOpNums);
  };
  P.toPrecision=function (places,applyToOpNums){
    if (this.array[0][1]===0) return (this.sign*this.array[0][1]).toFixed(places-1,applyToOpNums);
    if (this.array.length==1&&this.array[0][1]<1e-6) return this.toExponential(places-1,applyToOpNums);
    if (this.array.length==1&&places>Math.log10(this.array[0][1])) return this.toFixed(places-Math.floor(Math.log10(this.array[0][1]))-1,applyToOpNums);
    return this.toExponential(places-1,applyToOpNums);
  };
  P.valueOf=function (){
    return this.toString();
  };
  //Note: toArray() would be impossible without changing the layout of the array or lose the information about the sign
  P.toJSON=function (){
    if (ExpantaNum.serializeMode==ExpantaNum.JSON){
      var a=[];
      for (var i=0;i<this.array.length;++i) a.push([this.array[i][0],this.array[i][1]]);
      return {
        array:a,
        layer:this.layer,
        sign:this.sign
      };
    }else if (ExpantaNum.serializeMode==ExpantaNum.STRING){
      return this.toString();
    }
  };
  P.toHyperE=function (){
    if (this.layer.gt(0)) throw Error(expantaNumError+"Sorry, but this prototype doesn't support correct Hyper-E notation for numbers larger than 10{MSI}10");
    if (this.sign==-1) return "-"+this.abs().toHyperE();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    if (this.lt(ExpantaNum.MAX_SAFE_INTEGER)) return String(this.array[0][1]);
    if (this.lt(ExpantaNum.E_MAX_SAFE_INTEGER)) return "E"+this.array[0][1];
    var r="E"+this.operator(0)+"#"+this.operator(1);
    var l=1;
    for (var i=Math.ceil(this.getOperatorIndex(2));i<this.array.length;++i){
      if (l+1<this.array[i][0]) r+="#1".repeat(this.array[i][0]-l-1);
      l=this.array[i][0];
      r+="#"+(this.array[i][1]+1);
    }
    if (this.layer.eq(0)) r=""+r;
    else if (this.layer.lt(3)) r="J".repeat(this.layer)+r;
    else r="J^("+this.layer+") "+r;
    return r;
  };
  Q.fromNumber=function (input){
    if (typeof input!="number") throw Error(invalidArgument+"Expected Number");
    var x=new ExpantaNum();
    x.array[0][1]=Math.abs(input);
    x.sign=input<0?-1:1/input<0?-1:1;
    x.normalize();
    return x;
  };
  var log10PosBigInt=function log10PosBigInt(input){
    var exp=BigInt(64);
    while (input>=BigInt(1)<<exp) exp*=BigInt(2);
    var expdel=exp/BigInt(2);
    while (expdel>BigInt(0)){
      if (input>=BigInt(1)<<exp) exp+=expdel;
      else exp-=expdel;
      expdel/=BigInt(2);
    }
    var cutbits=exp-BigInt(54);
    var firstbits=input>>cutbits;
    return Math.log10(Number(firstbits))+Math.LOG10E/Math.LOG2E*Number(cutbits);
  }
  Q.fromBigInt=function (input){
    if (typeof input!="bigint") throw Error(invalidArgument+"Expected BigInt");
    var x=new ExpantaNum();
    var abs=input<BigInt(0)?-input:input;
    x.sign=input<BigInt(0)?-1:1;
    if (abs<=MAX_SAFE_INTEGER) x.array[0][1]=Number(abs);
    else x.array=[[0,log10PosBigInt(abs)],[1,1]];
    x.normalize();
    return x;
  }
  var LONG_STRING_MIN_LENGTH=17;
  var log10LongString=function log10LongString(str){
    return Math.log10(Number(str.substring(0,LONG_STRING_MIN_LENGTH)))+(str.length-LONG_STRING_MIN_LENGTH);
  }
  Q.fromString=function (input){
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var isJSON=false;
    if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
      try {
        JSON.parse(input);
      }finally{
        isJSON=true;
      }
    }
    if (isJSON){
      return ExpantaNum.fromJSON(input);
    }
    var x=new ExpantaNum();
    x.array=[[0,0]];
    if (!isExpantaNum.test(input)){
      console.warn(expantaNumError+"Malformed input: "+input);
      x.array=[[0,NaN]];
      return x;
    }
    var negateIt=false;
    if (input[0]=="-"||input[0]=="+"){
      var numSigns=input.search(/[^-\+]/);
      var signs=input.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2==1;
      input=input.substring(numSigns);
    }
    if (input=="NaN") x.array=[[0,NaN]];
    else if (input=="Infinity") x.array=[[0,Infinity]];
    else{
      var a,b,c,d,i;
      if (input[0]=="J"){
        if (input[1]=="^"){
          
          var a2=input.substring(2).startsWith("(")?3:2;
          a=input.substring(2).startsWith("(")?input.substring(3):input.substring(2);
          x.layer=new OmegaNum(a.match(isOmegaNum)[0]);
          input=input.substring(a2+a.match(isOmegaNum)[0].length+2*input.slice(a2+a.match(isOmegaNum)[0].length).startsWith(")"));
        }else{
          a=input.search(/[^J]/);
          x.layer=new OmegaNum(a);
          input=input.substring(a);
        }
      }
      while (input){
        if (/^\(?10[\^\{]/.test(input)){
          if (input[0]=="("){
            input=input.substring(1);
          }
          var arrows;
          if (input[2]=="^"){
            a=input.substring(2).search(/[^\^]/);
            arrows=a;
            b=a+2;
          }else{
            a=input.indexOf("}");
            arrows=Number(input.substring(3,a));
            b=a+1;
          }
          input=input.substring(b);
          if (input[0]==")"){
            a=input.indexOf(" ");
            c=Number(input.substring(2,a));
            input=input.substring(a+1);
          }else{
            c=1;
          }
          if (arrows==1){
            if (x.array.length>=2&&x.array[1][0]==1){
              x.array[1][1]+=c;
            }else{
              x.array.splice(1,0,[1,c]);
            }
          }else if (arrows==2){
            a=x.array.length>=2&&x.array[1][0]==1?x.array[1][1]:0;
            b=x.array[0][1];
            if (b>=1e10) ++a;
            if (b>=10) ++a;
            x.array[0][1]=a;
            if (x.array.length>=2&&x.array[1][0]==1) x.array.splice(1,1);
            d=x.getOperatorIndex(2);
            if (Number.isInteger(d)) x.array[d][1]+=c;
            else x.array.splice(Math.ceil(d),0,[2,c]);
          }else{
            a=x.operator(arrows-1);
            b=x.operator(arrows-2);
            if (b>=10) ++a;
            d=x.getOperatorIndex(arrows);
            x.array.splice(1,Math.ceil(d)-1);
            x.array[0][1]=a;
            if (Number.isInteger(d)) x.array[1][1]+=c;
            else x.array.splice(1,0,[arrows,c]);
          }
        }else{
          break;
        }
      }
      a=input.split(/[Ee]/);
      b=[x.array[0][1],0];
      c=1;
      for (i=a.length-1;i>=0;--i){
        //The things that are already there
        if (b[0]<MAX_E&&b[1]===0){
          b[0]=Math.pow(10,c*b[0]);
        }else if (c==-1){
          if (b[1]===0){
            b[0]=Math.pow(10,c*b[0]);
          }else if (b[1]==1&&b[0]<=Math.log10(Number.MAX_VALUE)){
            b[0]=Math.pow(10,c*Math.pow(10,b[0]));
          }else{
            b[0]=0;
          }
          b[1]=0;
        }else{
          b[1]++;
        }
        //Multiplying coefficient
        var decimalPointPos=a[i].indexOf(".");
        var intPartLen=decimalPointPos==-1?a[i].length:decimalPointPos;
        if (b[1]===0){
          if (intPartLen>=LONG_STRING_MIN_LENGTH) b[0]=Math.log10(b[0])+log10LongString(a[i].substring(0,intPartLen)),b[1]=1;
          else if (a[i]) b[0]*=Number(a[i]);
        }else{
          d=intPartLen>=LONG_STRING_MIN_LENGTH?log10LongString(a[i].substring(0,intPartLen)):a[i]?Math.log10(Number(a[i])):0;
          if (b[1]==1){
            b[0]+=d;
          }else if (b[1]==2&&b[0]<MAX_E+Math.log10(d)){
            b[0]+=Math.log10(1+Math.pow(10,Math.log10(d)-b[0]));
          }
        }
        //Carrying
        if (b[0]<MAX_E&&b[1]){
          b[0]=Math.pow(10,b[0]);
          b[1]--;
        }else if (b[0]>MAX_SAFE_INTEGER){
          b[0]=Math.log10(b[0]);
          b[1]++;
        }
      }
      x.array[0][1]=b[0];
      if (b[1]){
        if (x.array.length>=2&&x.array[1][0]==1) x.array[1][1]+=b[1];
        else x.array.splice(1,0,[1,b[1]]);
      }
    }
    if (negateIt) x.sign*=-1;
    x.normalize();
    return x;
  };
  Q.fromArray=function (input1,input2,input3){
    var array,layer,sign;
    if (input1 instanceof Array&&(input2===undefined||typeof input2=="number")&&(input3===undefined||typeof input3=="number"||typeof input3=="string"||typeof input3=="object")){
      array=input1;
      sign=input2;
      layer=new OmegaNum(input3||0);
    }else if (typeof input1=="number"&&input2 instanceof Array&&(input3===undefined||typeof input3=="number"||typeof input3=="string"||typeof input3=="object")){
      array=input2;
      sign=input1;
      layer=new OmegaNum(input3||0);
    }else if (typeof input1=="number"&&(typeof input2=="number"||typeof input2=="string"||typeof input3=="object")&&input3 instanceof Array){
      array=input3;
      sign=input1;
      layer=new OmegaNum(input2);
    }else{
      throw Error(invalidArgument+"Expected an Array [and 1 or 2 Number]");
    }
    var x=new ExpantaNum();
    var i;
    if (!array.length) x.array=[[0,0]];
    else if (typeof array[0]=="number"){
      x.array=[];
      for (i=0;i<array.length;i++){
        if (typeof array[i]!="number") throw Error(invalidArgument+"Expected Array of Number");
        x.array.push([i,array[i]]);
      }
    }else if (array[0] instanceof Array){
      x.array=[];
      for (i=0;i<array.length;i++){
        if (!(array[i] instanceof Array)||typeof array[i][0]!="number"||typeof array[i][1]!="number") throw Error(invalidArgument+"Expected Array of pair of Number");
        x.array.push([array[i][0],array[i][1]]);
      }
    }else throw Error(invalidArgument+"Expected Array of Number or Array of pair of Number");
    if (sign) x.sign=Number(sign);
    else x.sign=1;
    if (layer) x.layer=new OmegaNum(layer).round();
    else x.layer=new OmegaNum(0);
    x.normalize();
    return x;
  };
  Q.fromObject=function (input){
    if (typeof input!="object") throw Error(invalidArgument+"Expected Object");
    if (input===null) return ExpantaNum.ZERO.clone();
    if (input instanceof Array) return ExpantaNum.fromArray(input);
    if (input instanceof ExpantaNum) return new ExpantaNum(input);
    if (!(input.array instanceof Array)) throw Error(invalidArgument+"Expected that property 'array' exists");
    if (input.sign!==undefined&&typeof input.sign!="number") throw Error(invalidArgument+"Expected that property 'sign' is Number");
    if (input.layer!==undefined&&(typeof input.layer!="number"&&typeof input.layer!="object")) throw Error(invalidArgument+"Expected that property 'layer' is Number");
    return ExpantaNum.fromArray(input.array,input.sign,input.layer);
    /*var x=new ExpantaNum();
    x.array=[];
    for (var i=0;i<input.array.length;i++) x.array.push([input.array[i][0],input.array[i][1]]);
    x.sign=Number(input.sign)||1;
    x.layer=Number(input.layer)||0;
    x.normalize();
    return x;*/
  };
  Q.fromJSON=function (input){
    if (typeof input=="object") return ExpantaNum.fromObject(parsedObject);
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var parsedObject,x;
    try{
      parsedObject=JSON.parse(input);
    }catch(e){
      parsedObject=null;
      throw e;
    }finally{
      x=ExpantaNum.fromObject(parsedObject);
    }
    parsedObject=null;
    return x;
  };
  Q.fromHyperE=function (input){
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var x=new ExpantaNum();
    x.array=[[0,0]];
    if (!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#[1-9]\d*)*)$/.test(input)){
      console.warn(expantaNumError+"Malformed input: "+input);
      x.array=[[0,NaN]];
      return x;
    }
    var negateIt=false;
    if (input[0]=="-"||input[0]=="+"){
      var numSigns=input.search(/[^-\+]/);
      var signs=input.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2===0;
      input=input.substring(numSigns);
    }
    if (input=="NaN") x.array=[[0,NaN]];
    else if (input=="Infinity") x.array=[[0,Infinity]];
    else if (input[0]!="E"){
      x.array[0][1]=Number(input);
    }else if (input.indexOf("#")==-1){
      x.array[0][1]=Number(input.substring(1));
      x.array[1]=[1,1];
    }else{
      var array=input.substring(1).split("#");
      for (var i=0;i<array.length;++i){
        var t=Number(array[i]);
        if (i>=2){
          --t;
        }
        x.array[i]=[i,t];
      }
    }
    if (negateIt) x.sign*=-1;
    x.normalize();
    return x;
  };
  P.getOperatorIndex=function (i){
    if (typeof i!="number") i=Number(i);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var a=this.array;
    var min=0,max=a.length-1;
    if (a[max][0]<i) return max+0.5;
    if (a[min][0]>i) return -0.5;
    while (min!=max){
      if (a[min][0]==i) return min;
      if (a[max][0]==i) return max;
      var mid=Math.floor((min+max)/2);
      if (min==mid||a[mid][0]==i){
        min=mid;
        break;
      }
      if (a[mid][0]<i) min=mid;
      if (a[mid][0]>i) max=mid;
    }
    return a[min][0]==i?min:min+0.5;
  };
  P.getOperator=function (i){
    if (typeof i!="number") i=Number(i);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i);
    if (Number.isInteger(ai)) return this.array[ai][1];
    else return i===0?10:0;
  };
  P.setOperator=function (i,value){
    if (typeof i!="number") i=Number(i);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i);
    if (Number.isInteger(ai)) this.array[ai][1]=value;
    else{
      ai=Math.ceil(ai);
      this.array.splice(ai,0,[i,value]);
    }
    this.normalize();
  };
  P.operator=function (i,value){
    if (value===undefined) return this.getOperator(i);
    else this.setOperator(i,value);
  };
  P.clone=function (){
    var temp=new ExpantaNum();
    var array=[];
    for (var i=0;i<this.array.length;++i) array.push([this.array[i][0],this.array[i][1]]);
    temp.array=array;
    temp.sign=this.sign;
    temp.layer=this.layer;
    return temp;
  };
  // ExpantaNum methods

  /*
   *  clone
   *  config/set
   */

  /*
   * Create and return a ExpantaNum constructor with the same configuration properties as this ExpantaNum constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;
    function ExpantaNum(input,input2) {
      var x=this;
      if (!(x instanceof ExpantaNum)) return new ExpantaNum(input,input2);
      x.constructor=ExpantaNum;
      var parsedObject=null;
      if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
        try {
          parsedObject=JSON.parse(input);
        }catch(e){
          //lol just keep going
        }
      }
      var temp,temp2,temp3;
      if (typeof input=="number"&&!(input2 instanceof Array)){
        temp=ExpantaNum.fromNumber(input);
      }else if (typeof input=="bigint"){
        temp=ExpantaNum.fromBigInt(input);
      }else if (parsedObject){
        temp=ExpantaNum.fromObject(parsedObject);
      }else if (typeof input=="string"&&input[0]=="E"){
        temp=ExpantaNum.fromHyperE(input);
      }else if (typeof input=="string"){
        temp=ExpantaNum.fromString(input);
      }else if (input instanceof Array||input2 instanceof Array){
        temp=ExpantaNum.fromArray(input,input2);
      }else if (input instanceof ExpantaNum){
        temp=[];
        for (var i=0;i<input.array.length;++i) temp.push([input.array[i][0],input.array[i][1]]);
        temp2=input.sign;
        temp3=new OmegaNum(input.layer);
      }else if (typeof input=="object"){
        temp=ExpantaNum.fromObject(input);
      }else{
        temp=[[0,NaN]];
        temp2=1;
        temp3=new OmegaNum(0);
      }
      if (typeof temp2=="undefined"){
        x.array=temp.array;
        x.sign=temp.sign;
        x.layer=temp.layer;
      }else{
        x.array=temp;
        x.sign=temp2;
        x.layer=temp3;
      }
      return x;
    }
    ExpantaNum.prototype = P;

    ExpantaNum.JSON = 0;
    ExpantaNum.STRING = 1;
    
    ExpantaNum.NONE = 0;
    ExpantaNum.NORMAL = 1;
    ExpantaNum.ALL = 2;

    ExpantaNum.clone=clone;
    ExpantaNum.config=ExpantaNum.set=config;
    
    //ExpantaNum=Object.assign(ExpantaNum,Q);
    for (var prop in Q){
      if (Q.hasOwnProperty(prop)){
        ExpantaNum[prop]=Q[prop];
      }
    }
    
    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['maxOps', 'serializeMode', 'debug'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    ExpantaNum.config(obj);
    
    return ExpantaNum;
  }

  function defineConstants(obj){
    for (var prop in R){
      if (R.hasOwnProperty(prop)){
        if (Object.defineProperty){
          Object.defineProperty(obj,prop,{
            configurable: false,
            enumerable: true,
            writable: false,
            value: new ExpantaNum(R[prop])
          });
        }else{
          obj[prop]=new ExpantaNum(R[prop]);
        }
      }
    }
    return obj;
  }

  /*
   * Configure global settings for a ExpantaNum constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *
   * E.g. ExpantaNum.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj){
    if (!obj||typeof obj!=='object') {
      throw Error(expantaNumError+'Object expected');
    }
    var i,p,v,
      ps = [
        'maxOps',1,Number.MAX_SAFE_INTEGER,
        'serializeMode',0,1,
        'debug',0,2
      ];
    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (Math.floor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }


  // Create and configure initial ExpantaNum constructor.
  ExpantaNum=clone(ExpantaNum);

  ExpantaNum=defineConstants(ExpantaNum);

  ExpantaNum['default']=ExpantaNum.ExpantaNum=ExpantaNum;
  ExpantaNum.OmegaNum=OmegaNum;

  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return ExpantaNum;
    });
  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = ExpantaNum;
    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }
    globalScope.ExpantaNum = ExpantaNum;
  }
})(this);
