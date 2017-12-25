let stopwords = ["want", "she", "he", "i", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"]

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
  'read',
  ''
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
      if (food.action != 'uncategorized') {
        obj.action = food.action;
        obj.target = getTarget(clean, food.action_index);
      } else if (movie.action != 'uncategorized') {
        obj.action = movie.action;
        obj.target = getTarget(clean, movie.action_index);
      }
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
