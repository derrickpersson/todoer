const request = require('request');
const token = process.env.MOVIE_TOKEN;

var showTimeBydateAndZip = (zip, date) => {
  return new Promise((resolve, reject) => {
    request(`http://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&zip=${zip}&api_key=${token}`,
      { json: true }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    })
  })
}

var searchByname = (title, today) => {
  return new Promise((resolve, reject) => {
    showTimeBydateAndZip('V3R2T2', today).
    then((data) => {
      console.log("current searByname found", data);
      if (data == null) {
        resolve(null);
      }
      //let result;
      else if  (data.title.toLowerCase() === title) {
        resolve(movie);
      }
    }).
    catch((err) => reject(err));
  })
}


var searchBackward = (name) => {
  return new Promise((resolve, reject) => {
    searchByname(name, '2017-12-26').
    then((data) => {
      resolve(data);
    }).
    catch((err) => {
      reject(err);
    });
  }).then((data) => {
    let nextSearch = [];
    let temp = name.split(' ');
    temp.forEach((w,i) => {
      (i < temp.lengh - 1) ? nextSearch.push(w) : void 0;
    });
    if (data != null && data.title == name) {
      return Promise.resole(data);
    } else if (nextSearch.length === 0) {
      return Promise.resolve(null);
    } else if (data == null || data.title != name) {
      return searchBackward(nextSearch.join(' '));
    }
  });
}

var randomSearch = (name) => {
  return new Promise ((resolve, reject) => {
    if (name.length === 0) resolve(null);
    searchByname(name, "2017-12-26").
    then((data) => {
      if (data != null) {
        console.log("movie forward found", data);
        resolve(data);
      } else if (data === null) {
        searchBackward(name).
        then((backData) => {
          if (backData != null) {
            console.log("backward found", backData);
            resolve(backData);
          }
          else if (backData == null) resolve(null);
        });
      }
    });
  }).then((data) => {
    console.log("prev random output", data);
    let temp = name.split(' ');
    let transformed = [];
    temp.forEach((w, i) => {
      if (i != 0) transformed.push(w);
    });
    let result = transformed.join(' ');
    console.log("new forward input", result);
    if (transformed.length == 0 || data != null) return Promise.resolve(data);
    else if (transformed.length != 0) return randomSearch(result);
  }).
  catch((err) => {
    reject(err);
  })
}


module.exports = () => {
  return {
    randomSearchByname: (title, today) => {
      return new Promise((resolve, reject) => {
        randomSearch(title).
        then((data) => {
          resolve(data);
        }).
        catch((err) => {
          reject (err);
        })
      })
    }
  }
}
