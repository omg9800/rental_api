var axios = require("axios").default;

var options = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/get-genres",
  params: { tconst: "tt0944947" },
  headers: {
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
    "x-rapidapi-key": "d401c255d1msh76795e09a806f4bp11a219jsnab361e4a7084",
  },
};
var k = "";
axios
  .request(options)
  .then(function (response) {
    k = response.data;
  })
  .catch(function (error) {
    console.error(error);
  });
console.log(k);
