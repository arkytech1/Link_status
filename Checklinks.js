var urlExists = require('url-exists');
var sendmail = require('./Mail.js');
var lc = require('./logcreator.js');
var fs = require('fs');
var sdc = require('./SDC-manager.js');


var today = new Date();
var today3h = new Date();
today3h.setHours(today.getHours() + 5);
console.log(today3h);
var datevar = (("" + today.getFullYear()).slice(-2)) + (("0" + (today.getMonth() + 1)).slice(-2)) + (("0" + today.getDate()).slice(-2))
var minusvar = (("" + today3h.getFullYear()).slice(-2)) + (("0" + (today3h.getMonth() + 1)).slice(-2)) + (("0" + today3h.getDate()).slice(-2))
var airquality = 'https://video.euronews.com/smp4/weather/' + minusvar + '_WQSU_000.mp4';
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

let gauge_maker = (vlist,r)=>{
  return new Promise((resolve, reject) => {
    var promises = [];
    var state=0;
    for (var i = 0; i <vlist.length; i++) {
      if (r[i]=='SUCCESS'){state = 1} else{state = 0}
      console.log(vlist[i][0], state);
      var promise = sdc.gauge(vlist[i][1], state)
    }
    Promise.all(promises).then(() => {
      resolve()
    });

  });

}

let jsonexporter = function(vindex, r) {
  return new Promise((resolve, reject) => {
		var state='SUCCESS';
		for (var i=0; i<r.length;i++){
			if (r[i]=='FAIL'){state='FAIL'}
		}
    var now = today3h;
    now = now.setHours(now.getHours + 2);
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
      "Final_Result": state

    };
    json = JSON.stringify(json, null, 2);
    fs.appendFile('Monitoring_state.json', json, (err) => {
      if (err) {
        reject(err);
        throw err;
      }
      console.log('json file has been saved!');
      resolve(r)
    });
  })
}
let url_check = (url, r, index) => {
  return new Promise((resolve, reject) => {
    urlExists(url, function(err, exists) {
      if (exists) {
        r[index] = 'SUCCESS'
        resolve(r[index])
      } else {
        r[index] = 'FAIL'
        resolve(r[index])
      }
    });
  });
}
let index_ch = (videolist, index, r) => {
  return new Promise((resolve, reject) => {
    var promises = [];
    for (var i = 0; i < videolist.length; i++) {
      var promise = url_check(videolist[i][0], r, i);
      promises.push(promise);
    }
    Promise.all(promises).then((result) => {
      r = result;
      resolve(r)
    });
  });
}

index_ch(vlist, 0, r).then((result) => {
jsonexporter(vlist,result).then((result) => {
gauge_maker(vlist, result);
});
});
