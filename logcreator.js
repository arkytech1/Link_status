var fs = require('fs');

function logcreator(Message) {
var today = new Date();
var dir = './logs';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
dir += '/'+today.getFullYear();
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}
dir += '/'+today.toLocaleString('en-us', { month: "long" });
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}
dir += '/Videos_Monitoring_'+today.getDate()+'_'+today.toLocaleString('en-us', { month: "long" })+'_'+today.getFullYear()+'.log';
fs.appendFile(dir,Message+'\r\n');
}
module.exports.logcreator = logcreator;