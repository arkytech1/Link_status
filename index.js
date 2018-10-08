//var SDC = require('statsd-client'),
//	sdc = new SDC({host: '127.0.0.1'});

var i = 0;
var timer = new Date();
//sdc.increment('test.counter'); // Increment by one.
//sdc.gauge('test.gauge', 100); // Set gauge to 10
//sdc.timing('test.timer', timer); // Calculates time diff
//sdc.histogram('test.histogram', 100, {arf: 'ka'}) // Histogram with tags
i = Math.round(Math.random()*Math.floor(20)*Math.floor(35));
console.log(i);
//sdc.increment ('test.mount', i);
//sdc.set ('video1', i);

let gauge_maker=(name, value)=>{
  return new Promise((resolve, reject) => {
		var x = name +'.gauge'
		//sdc.gauge(x, value);
		console.log(x, value);
		resolve();
	});
}
gauge_maker('hello', i).then(()=>{
	console.log('done');
});
