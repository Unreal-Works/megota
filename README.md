# MegotaNum.js α1.0.0
A huge number library holding up to {10,9e15,1,1,2}.

This reaches level f<sub>ω<sup>2</sup>+1</sub>, which the operation [megotion](https://googology.wikia.org/wiki/Megotion) also is at, hence the name.
This library is inspired by Naruyoko.

Internally, it is represented as an sign, array, and layer. Sign is 1 or -1. Similarly, it has the same array from ExpantaNum but it has 3 entries (\[a,b,c\]) instead of 2 (\[a,b\]). Layer is a non-negative integer. They together represents sign\*N<sup>layer</sup>topLayer, where Nx is {10,10,10,x} (PsiCubed2's Letter notation).

Functions are as follows: abs, neg, cmp, gt, gte, lt, lte, eq, neq, min, max, ispos, isneg, isNaN, isFinite, isint, floor, ceiling, round, add, sub, mul, div, rec, mod, gamma, fact, pow, exp, sqrt, cbrt, root, log10, logBase, log(alias ln), lambertw, tetr, iteratedexp, iteratedlog, layeradd, layeradd10, ssrt, slog, pent, arrow, chain, hyper, expansion, affordGeometricSeries, affordArithmeticSeries, sumGeometricSeries, sumArithmeticSeries, choose. Of course, there are toNumber(), toString() (toValue, toStringWithDecimalPlaces, toExponential, toFixed, toPrecision), and toJSON().

Feel free to contribute for any fixes or any missing functions to be added.

If you are not planning to make something to the scale of [True Infinity](https://reinhardt-c.github.io/TrueInfinity), then use other libraries, such as, in ascending order:

* [break_infinity.js](https://github.com/Patashu/break_infinity.js) by Patashu - e9e15
* [decimal.js](https://github.com/MikeMcl/decimal.js) by MikeMcl - e9e15
* [logarithmica_numerus_lite.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/logarithmica_numerus_lite.js) by Aarex Tiaokhiao - e1.8e308
* [magna_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/magna_numerus.js) by Aarex Tiaokhiao - ee536870888
* [confractus_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/confractus_numerus.js) by Aarex Tiaokhiao - ee9e15
* [break_eternity.js](https://github.com/Patashu/break_eternity.js) by Patashu - 10^^1.8e308
* [OmegaNum.js](https://github.com/Naruyoko/OmegaNum.js) by Naruyoko - 10{1000}9e15
* [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js) by Naruyoko - {10,9e15,1,2}

If you are using built-in constants: Constants can not be replaced directly, however **the properties of it can. As the constants are also used inside MegotaNum.js, modifying them could CAUSE SERIOUS ISSUES AND POTENTIALLY RENDER THE LIBRARY UNUSABLE.**
Also there is a new constant named [General](https://googology.wikia.org/wiki/General) which is equal to {10,10,10,10} or N10.

number library, big number, big num, bignumber, bignum, big integer, biginteger, bigint, incremental games, idle games, large numbers, huge numbers, googology, javascript
