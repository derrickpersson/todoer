let stopwords = ["she", "he", "i", "a", "at", "around", "about"]

let eat = [
  'eat',
  'lunch',
  'dinner',
  'eat',
  'grab',
  'food',
  'meet',
  'breakfast'
];

let watch = [
  'watch',
  'see',
  'attend',
  'catch',
  'cinema',
  'film',
  'movie'
]

let read = [
  'read'
]

let buy = [
  'buy',
  'get',
  'want'
]

getType = (data, actionSet, action) => {
  let type = {
    action: 'uncategorized'
  };
  data.forEach((word, index) => {
    if (actionSet.indexOf(word) != -1) {
      type.action = action;
      type.action_index = index;
      return type;
    }
  });
  return type;
}

var getTarget = (clean, action_index) => {
  let target = "";
  clean.forEach((w, i) => {
    if (i != action_index && i > action_index) {
      target += w + ' ';
    }
  });
  return target.trim();
}

module.exports = () => {
  return {
    classifier: (data) => {
      let clean = [];
      let obj = {};
      data.toLowerCase().split(' ').forEach((word) => {
        if (stopwords.indexOf(word) == -1) clean.push(word)
      });
      let food = getType(clean, eat, 'restaurant');
      let movie = getType(clean, watch, 'movie');
      let book  = getType(clean, read, 'book');
      let product = getType(clean, buy, 'product');
      if (food.action != 'uncategorized') {
        obj.action = food.action;
        obj.target = getTarget(clean, food.action_index);
      } else if (movie.action != 'uncategorized') {
        obj.action = movie.action;
        obj.target = getTarget(clean, movie.action_index);
      } else if (book.action != 'uncategorized') {
        obj.action = book.action;
        obj.target = getTarget(clean, book.action_index);
      } else if (product.action != 'uncategorized') {
        obj.action = product.action;
        obj.target = getTarget(clean, product.action_index);
      } else {
        obj.action = "uncategorized";
        obj.target = data;
      }
      console.log(obj);
      return obj;
    },
    classifier_movie: (data) => {
      let clean = [];
      let obj = {};
      data.toLowerCase().split(' ').forEach((word) => {
        if (stopwords.indexOf(word) == -1) clean.push(word)
      });
      let target = "";
      let action_index;
      clean.forEach((word, index) => {
        if (watch.indexOf(word) != -1) {
          obj.action = 'restaurant';
          action_index = index;
        }
      })
      clean.forEach((w, i) => {
        if (i != action_index && i > action_index) {
          target += w + ' ';
        }
      })
      obj.target = target.trim();
      return obj;
    }
  }
}
