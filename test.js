const MegotaNumModule = require('./out/MegotaNumber.js');
const MegotaNumber = MegotaNumModule.default;

console.log(MegotaNumber.fromNumber(5e10).operator([0, 1]))