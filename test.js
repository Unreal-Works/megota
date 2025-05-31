const MegotaNumModule = require('./out/MegotaNumber.js');
const MegotaNumber = MegotaNumModule.default;
const ExpantaNum = require('./reference.js');
const original = require('./original.js');

console.log(new ExpantaNum("2e1000").pow("3e1000").toString())