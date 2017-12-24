var Yelp = require('yelp-v3');
var yelp = new Yelp({
  access_token: "Ly8AE__VAU9P5AvlbBIh6Dw15iBeLQPftWgebNJV5nR8La-VTW6XXw2yYtKeCFuTf4vEkDsFR8RRPfa6LaIXktBs7Tx7wk69CYZ7Tv1N4weMC7Uz-YYcHTq4dkQ7WnYx"
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
