const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);
var Yelp = require('yelp-v3');
var yelp = new Yelp({
  access_token: "API"
});

module.exports = () => {
  return {
    searchByname: (todoID) => {
      return new Promise((resolve, reject) => {
        knex.select('recommendation_request').
        from('todos').
        where('id', todoID).
        then((name) => {
          console.log("serach for ", name[0].recommendation_request);
          yelp.search({
            term: name[0].recommendation_request,
            location: 'vancouver'
          }, (err, data) => {
            console.log(data);
            if (err) reject(err)
            //console.log("yelp data", data);
            resolve(data["businesses"][0]);
          })
        }).
        catch((err) => reject(err));
      })
    }
  }
}
