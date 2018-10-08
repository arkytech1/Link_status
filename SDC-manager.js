var SDC = require('statsd-client'),
sdc = new SDC({host: '10.3.70.219'});

//sdc.increment('test.counter'); // Increment by one.
//sdc.gauge('test.gauge', 100); // Set gauge to 10
//sdc.timing('test.timer', timer); // Calculates time diff
//sdc.histogram('test.histogram', 100, {arf: 'ka'}) // Histogram with tags
//sdc.increment ('test.mount', i);
//sdc.set ('video1', i);

let counter=(name, value)=>{
  return new Promise((resolve, reject) => {
		var x = name +'.gauge'
    sdc.increment(x, value);
    resolve();
	});
}

let gauge=(name, value)=>{
  return new Promise((resolve, reject) => {
		var x = name +'.gauge'
    sdc.gauge(x, value);
		resolve();
	});
}


module.exports.counter = counter;
module.exports.gauge = gauge;
