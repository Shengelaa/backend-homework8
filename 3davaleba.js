//3) Create a server and handle this route
// /time?city=London, it should return what time is that city
// . Try to support few countries like NY, Berlin, Madrid, Pekin, Kiev and etc.

const http = require("http");
const url = require("url");
const queryString = require("querystring");
const fs = require("fs/promises");
const cities = [
  { city: "BakerIsland", offset: -12 },
  { city: "Honolulu", offset: -10 },
  { city: "Anchorage", offset: -9 },
  { city: "LosAngeles", offset: -8 },
  { city: "Denver", offset: -7 },
  { city: "Chicago", offset: -6 },
  { city: "NewYork", offset: -5 },
  { city: "Caracas", offset: -4 },
  { city: "Halifax", offset: -3 },
  { city: "SouthGeorgia", offset: -2 },
  { city: "Azores", offset: -1 },
  { city: "London", offset: 0 },
  { city: "Berlin", offset: 1 },
  { city: "Athens", offset: 2 },
  { city: "Moscow", offset: 3 },
  { city: "Dubai", offset: 4 },
  { city: "Karachi", offset: 5 },
  { city: "Dhaka", offset: 6 },
  { city: "Bangkok", offset: 7 },
  { city: "Beijing", offset: 8 },
  { city: "Tokyo", offset: 9 },
  { city: "Sydney", offset: 10 },
  { city: "Noumea", offset: 11 },
  { city: "Auckland", offset: 12 },
];

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  if (parsedUrl.pathname === "/time" && req.method === "GET") {
    const query = queryString.parse(parsedUrl.query);
    let City = query.city;

    const matchingCity = cities.find(
      (el) => el.city.toLowerCase() === City.toLowerCase()
    );

    const date = new Date();

    console.log(matchingCity.offset);
    const time = date.setTime(
      date.getTime() + matchingCity.offset * 60 * 60 * 1000
    );

    console.log(
      `Time in ${matchingCity.city} Is ${new Date(time).toUTCString()}`
    );

    //UTCSTring roar mimewera boloshi Georgia Standard time-s miwerda
    //da magizianebda

    res.writeHead(200, {
      "content-type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: `Time in ${matchingCity.city} is ${new Date(
          time
        ).toUTCString()}`,
      })
    );
  }
});

server.listen(6000, () => {
  console.log("your server is running on http://localhost:6000");
});
