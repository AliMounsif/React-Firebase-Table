// I'm not making any firebase config 
//  differenctiation between prod and dev environment, 
//  need a better understanding of rules management,
//  or setting different databases
// now anyone can read, set or update this api 

// console.log(process.env.NODE_ENV);
// if (process.env.NODE_ENV === "production") {
//   module.exports = require("./prod");
// } else {
  module.exports = require("./dev");
// }