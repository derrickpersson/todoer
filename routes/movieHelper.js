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

module.exports = () => {
  return {
    randomSearchByname: (title, today) => {
      return new Promise((resolve, reject) => {
        showTimeBydateAndZip('V3R2T2', today).
        then((data) => {
          let result;
          data.forEach((movie) => {
            if (movie.title.toLowerCase() === title) resolve(movie);
          })
          resolve(null);
        }).
        catch((err) => reject(err));
      })
    }
  }
}
