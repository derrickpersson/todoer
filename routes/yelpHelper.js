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
          yelp.search({
            term: name,
            location: 'vancouver'
          }, (err, data) => {
            if (err) reject(err)
            resolve(data["businesses"][0]);
          })
        }).
        catch((err) => reject(err));
      })
    }
  }
}
