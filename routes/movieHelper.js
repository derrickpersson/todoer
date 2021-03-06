const request = require('request');
const token = process.env.MOVIE_TOKEN;

var showTimeBydateAndZip = (zip, date) => {
  return new Promise((resolve, reject) => {
    request(`http://data.tmsapi.com/v1.1/movies/showings?startDate=${date}&zip=${zip}&api_key=${token}`, {
      json: true
    }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    })
  })
}

var searchByname = (title, today) => {
  return new Promise((resolve, reject) => {
    showTimeBydateAndZip('V6J4L2', today).
    then((data) => {
      let result = null;
      console.log("____________________________");
      console.log(typeof data);
      console.log(Object.keys(data));
      if (!data.errorCode) {
        data.forEach((movie) => {
          if (movie.title.toLowerCase() === title) {
            console.log("found movie___________________", movie);
            result = movie;
          }
        });
      }
      resolve(result);
    }).
    catch((err) => {
      console.log(err);
      reject(err);
    })
  })
}

var searchBackward = (name, today) => {
  return new Promise((resolve, reject) => {
    console.log("Back: current search movie", name);
    searchByname(name, today).
    then((data) => {
      resolve(data);
    }).
    catch((err) => {
      reject(err);
    });
  }).then((data) => {
    let nextSearch = [];
    let temp = name.split(' ');
    temp.forEach((w, i) => {
      (i < temp.lengh - 1) ? nextSearch.push(w): void 0;
    });
    console.log("Back: next search movie");
    if (data != null && data.title == name) {
      return Promise.resole(data);
    } else if (nextSearch.length === 0) {
      return Promise.resolve(null);
    } else if (data == null || data.title != name) {
      return searchBackward(nextSearch.join(' '), today);
    }
  });
}

var randomSearch = (name, today) => {
  return new Promise((resolve, reject) => {
    console.log("Forward: current search movie", name);
    if (name.length === 0) resolve(null);
    searchByname(name, today).
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
          } else if (backData == null) resolve(null);
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
    console.log("Forward: next search movie", result);
    if (transformed.length == 0 || data != null) return Promise.resolve(data);
    else if (transformed.length == 0 && data == null) return Promise.resolve(null);
    else if (transformed.length != 0) return randomSearch(result, today);
  }).
  catch((err) => {
    reject(err);
  })
}

module.exports = () => {
  return {
    randomSearchByname: (title, today) => {
      return new Promise((resolve, reject) => {
        randomSearch(title, today).
        then((data) => {
          resolve(data);
        }).
        catch((err) => {
          reject(err);
        })
      })
    }
  }
}
