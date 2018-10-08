var urlExists = require('url-exists');
var sendmail = require('./Mail.js');
var lc = require('./logcreator.js');
var fs = require('fs');


var today = new Date();
var today3h = new Date();
today3h.setHours(today.getHours() + 5);
console.log(today3h);
var datevar = (("" + today.getFullYear()).slice(-2)) + (("0" + (today.getMonth() + 1)).slice(-2)) + (("0" + today.getDate()).slice(-2))
var minusvar = (("" + today3h.getFullYear()).slice(-2)) + (("0" + (today3h.getMonth() + 1)).slice(-2)) + (("0" + today3h.getDate()).slice(-2))
var airquality = 'https://video.euronews.com/mp4/weather/' + minusvar + '_WQSU_000.mp4';
var meteo_airport = 'https://video.euronews.com/mp4/weather/' + minusvar + '_WASU_000.mp4';
var meteo_europe = 'https://video.euronews.com/mp4/weather/' + minusvar + '_WWSU_000.mp4';
var airquality_tomorrow = 'https://video.euronews.com/mp4/weather/' + minusvar + '_WQSU_120.mp4';
var meteo_airport_tomorrow = 'https://video.euronews.com/mp4/weather/' + minusvar + '_WASU_120.mp4';
var meteo_europe_tomorrow = 'https://video.euronews.com/mp4/weather/' + minusvar + '_WWSU_120.mp4';

const vlist = [
  [airquality, 'Air Quality Video'],
  [meteo_airport, 'Airport Weather Video'],
  [meteo_europe, 'Europe Weather Video'],
  [airquality_tomorrow, 'Tomorrow Air Quality Video'],
  [meteo_airport_tomorrow, 'Tomorrow Airport Weather Video'],
  [meteo_europe_tomorrow, 'Tomorrow Europe Weather Video'],
];
var rep = [];
var r = [];
console.log(vlist[1][1]);

let jsonexporter = function (vindex, r) {
	return new Promise ((resolve, reject) =>{

		var now = new Date();
		now = now.setHours(now.getHours +2);
	  var json = {
			"Time": now,
	    "Time": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
	    "Videos Today": {
	      "airquality": {
	        "Name": vindex[0][1],
	        "Link": vindex[0][0],
	        "Result": r[0]
	      },
	      "meteo_airport": {
	        "Name": vindex[1][1],
	        "Link": vindex[1][0],
	        "Result": r[1]
	      },
	      "meteo_europe": {
	        "Name": vindex[2][1],
	        "Link": vindex[2][0],
	        "Result": r[2]
	      }
	    },
	    "Videos Tomorrow": {
	      "airquality": {
	        "Name": vindex[3][1],
	        "Link": vindex[3][0],
	        "Result": r[3]
	      },
	      "meteo_airport": {
	        "Name": vindex[4][1],
	        "Link": vindex[4][0],
	        "Result": r[4]
	      },
	      "meteo_europe": {
	        "Name": vindex[5][1],
	        "Link": vindex[5][0],
	        "Result": r[5]
	      }
	    },
	    "Final_Result": "SUCCESS"
	  };
	  json = JSON.stringify(json, null, 2);
	  fs.writeFile('Monitoring_state.json', json, (err) => {
	    if (err) { reject (err); throw err;}
	    console.log('json file has been saved!');
			resolve(r)
	  });
	})
}
let url_response = (url) => {
	return new Promise ((resolve, reject) =>{
			urlExists(url, function(err, exists){
				if (exists){
					resolve('SUCCESS')
				}
				else{
					reject ('FAIL')
				}
			});
		});
}
url_response('http://www.google.com').then((result)=>{
	console.log();
})
let index_checker = function (videolist, index, r) {
  if (index < videolist.length) {
    urlExists(videolist[index][0], function(err, exists) {
      // Report if exist is false
      if (!exists) {
        r[index] = 'FAIL';
      } else {
        r[index] = 'SUCCESS';
      }
      index++
      index_checker(videolist, index, r);
    });
  }
	if(r.length == videolist.length){
		jsonexporter (videolist, r).then((result)=>{
			console.log(result);
		}) ;
	}

}
index_checker(vlist, 0,r);



function testUrlvideolist(videolist, index, report, r) {
  // Warning verify overflow
  var head = '[' + new Date().toLocaleString() + '] : ';
  var headline = '';
  if (report.length > 0) {
    var results = '<body style =" allign = right; font-family: Arial; "><p>Hello,</p><div style = "font-family: Arial; Line-Height: 8pt"><p>This a automated monitoring Alert confirming a fall down in one or more of the Weather page videos, more details down below : </p><p>Reporting Date : <b>' + new Date().toLocaleString() + '</b> </p><p><br>Unavailable Videos are :</p></div><table style ="text-align: center;  width: 50%; font-size: 13px; font-family: Arial, Times, serif;  height: 80px;  text-align: center;  border-collapse: collapse;  padding-left : 5px;" class="paleBlueRows"><tbody style = "border: 1px solid #BBB;">';
    for (var i in report) {
      results += '<tr><td style = "border: 1px solid #BBB; background: #CD0000; width: 5%; font-weight: bold; color: white;">' + (1 + parseInt(i)) + '</td><td style = "border: 1px solid #BBB; background: #D0E4F5;  font-weight: bold;">[' + report[i].name + ']</td><td style = "border: 1px solid #BBB; background: #F9FFFF;    font-family: consolas, Times, serif;">' + report[i].url + '</td></tr>';
      headline += head + 'FAILED : ' + report[i].name + ' (' + report[i].url + ')\r\n';
    }
    headline = headline.substring(0, headline.length - 2)
    results += '</tbody></table></body>'
    // console.log(results);
    lc.logcreator(headline);
    f_result = 'FAIL';
    //sendmail.sendmail(results);
    console.log("         !!! FAIL !!!\r\n-----------------------------------\r\nMonitoring Mail sent! \r\n***********************************\r\n")
  } else {
    f_result = 'SUCCESS';
    headline += head + 'SUCCESS : All videos are available';
    lc.logcreator(headline);
  };
  console.log("logfile updated!\r\n***********************************\r\n");


}

//testUrlvideolist(vlist, 0, rep, r);
