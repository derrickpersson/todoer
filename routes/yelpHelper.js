const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
var Yelp = require('yelp-v3');
var yelp = new Yelp({
  access_token: process.env.YELP_API_KEY
});

var searchByname = (name) => {
  return new Promise((resolve, reject) => {
    yelp.search({term: name, location: 'vancouver'}, (err,data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

var searchBackward = (itemStr) => {
  return new Promise((resolve, reject) => {
    console.log("Back: First yelp search", itemStr);
    searchByname(itemStr).
    then((data) => {
     resolve(data);
    }).
    catch((err) => {
      reject(err);
    });
  }).
  then((data) => {
    if (data.total > 0) {
      console.log("searchByname result", data.businesses[0].name);
    }
    let nextSearch = [];
    let temp = itemStr.split(' ');
    temp.forEach((w, i) => {
      (i < temp.length - 1)  ? nextSearch.push(w) : void 0;
    });
    console.log("Back: next yelp search", nextSearch);
    // may be data.businesses[0].name == itemStr
    if (data.total > 0) {
      return Promise.resolve(data['businesses'][0]);
    } else if (nextSearch.length === 0) {
      return Promise.resolve(null);
    } else if (data.total === 0 || (data.total > 0 && data.businesses[0].name != itemStr)) {
      return (searchBackward(nextSearch.join(' ')));
    }
  });
};

var randomSearch = (itemStr) => {
  return new Promise ((resolve, reject) => {
    if (itemStr.length === 0) resolve(null);
    console.log("forward: first search", itemStr);
    searchByname(itemStr).
    then((data) => {
      if (data.total > 0) {
        console.log("forward found", data['businesses'][0].name)
        resolve(data['businesses'][0]);
      }
      console.log("data", data.total);
      if (data.total == 0) {
        searchBackward(itemStr).
        then((backData) => {
          if (backData != null) {
            console.log("backward found", backData.name);
            resolve(backData);
          }
          else if (backData == null) resolve(null);
        });
      }
    });
  }).then((data) => {
    console.log("prev random output", data);
    let temp = itemStr.split(' ');
    let transformed =[];
    temp.forEach((w, i) => {
        if (i != 0) transformed.push(w);
    });
    let result = transformed.join(' ');
    console.log("Forward: next search", result);
    console.log("new forward input length", transformed.length);
    if (transformed.length == 0 || data != null) return Promise.resolve(data);
    else if (transformed.length == 0 && data == null) return Promise.resolve(null);
    else if (transformed.length != 0) return randomSearch(result);
  }).
  catch((err) => {
    reject(err);
  })
};

module.exports = () => {
  return {
    randomSearchByname: (todoID) => {
      return new Promise((resolve, reject) => {
        knex.select('recommendation_request').
        from('todos').
        where('id', todoID).
        then((name) => {
          console.log("serach for ", name[0].recommendation_request);
          randomSearch(name[0].recommendation_request).
          then((data) => {
            if (data !== null) data.action = 'restaurant';
            resolve(data);
          }).
          catch((err) => reject(err));
        }).
        catch((err) => reject(err));
      })
    }
  }
}
