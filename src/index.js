import "./style.css";

// function that handles all DOM tasks
const dom = (dataObj) => {
  const verify = document.querySelector(".verify");
  verify.textContent = "";
  const description = document.querySelector(".description");
  description.textContent =
    dataObj.description.charAt(0).toUpperCase() + dataObj.description.slice(1);
  const location = document.querySelector(".location");
  location.textContent = dataObj.location;
  const temp = document.querySelector(".temp");
  temp.textContent = `${dataObj.temp}°F`;
  const feels = document.querySelector(".feels");
  feels.textContent = `Feels like: ${dataObj.feels}°F`;
  const wind = document.querySelector(".wind");
  wind.textContent = `Wind: ${dataObj.wind} MPH`;
  const humidity = document.querySelector(".humidity");
  humidity.textContent = `Humidity: ${dataObj.humidity}%`;
  const time = document.querySelector(".time");
  time.textContent = `Time: ${dataObj.time}`;
  const day = document.querySelector(".day");
  day.textContent = `${dataObj.monthDay}`;
};

// function that processes the API data and returns all wanted data points in an object
const processData = (data) => {
  const { description } = data.weather[0];
  const location = data.name;
  const temp = Math.round(((data.main.temp - 273.15) * 9) / 5 + 32);
  const feels = Math.round(((data.main.feels_like - 273.15) * 9) / 5 + 32);
  const wind = Math.round(data.wind.speed * 2.23694);
  const { humidity } = data.main;
  const unixTime = data.dt + data.timezone;
  const date = new Date(unixTime * 1000);
  const day = date.getUTCDate();
  const monthNum = date.getUTCMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[monthNum];
  const monthDay = `${month} ${day}`;
  const hours = date.getUTCHours();
  const minutes = `0${date.getUTCMinutes()}`;
  let time;
  if (hours > 12) {
    time = `${hours - 12}:${minutes.slice(-2)}pm`;
  } else if (hours === 12) {
    time = `${hours}:${minutes.slice(1)}pm`;
  } else time = `${hours}:${minutes.slice(-2)}am`;
  dom({ description, location, temp, feels, wind, humidity, time, monthDay });
};

const handleError = () => {
  const verify = document.querySelector(".verify");
  verify.textContent = "Enter a valid city name";
};

// function that fetches data from the API
// changes the url based on the city name or zip code input by the user
/*
const getData = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d19178c4f972f37b67dde5952a2af765`;
  const data = await fetch(url, { mode: "cors" })
    .then(
      (response) => response.json(),
      () => handleError()
    )
    .then((response) => response);
  console.log(data);
  processData(data);
};
*/

const getData = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d19178c4f972f37b67dde5952a2af765`;
  const data = await fetch(url, { mode: "cors" })
    .then((response) => {
      if (!response.ok) {
        handleError();
      }
      return response;
    })
    .then(
      (response) => response.json(),
      () => handleError()
    )
    .then((response) => response);
  console.log(data);
  processData(data);
};

// function that toggles between C and F

// get input from user
// eslint-disable-next-line no-unused-vars
const getInput = (() => {
  const input = document.querySelector("input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value !== "") {
      getData(input.value);
      input.value = "";
    }
  });
})();

getData("chicago");

/*
https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=d19178c4f972f37b67dde5952a2af765

{"coord":{"lon":-87.65,"lat":41.85},
"weather":[{"id":601,"main":"Snow","description":"snow","icon":"13d"},
{"id":701,"main":"Mist","description":"mist","icon":"50d"}],
"base":"stations",
"main":{"temp":272.26,"feels_like":267.04,"temp_min":271.27,"temp_max":272.76,"pressure":1005,"humidity":84},
"visibility":2816,"wind":{"speed":5.14,"deg":210},"snow":{"1h":0.58},"clouds":{"all":100},
"dt":1671205575,"sys":{"type":2,"id":2005153,
"country":"US","sunrise":1671196316,"sunset":1671229241},"timezone":-21600,"id":4887398,"name":"Chicago","cod":200}
*/
