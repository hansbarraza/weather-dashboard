var city = document.getElementById("enter-city");
var searchBtn = document.getElementById("search-button");
var clearBtn = document.getElementById("clear-history");
var nameEl = document.getElementById("city-name");
var currentImg = document.getElementById("current-pic");
var currentTemp = document.getElementById("temperature");
var currentHumidity = document.getElementById("humidity");
var currentWindSpeed = document.getElementById("wind-speed");
var currentFeelsLike = document.getElementById("feels-like");
var historyForm = document.getElementById("history");
var fivedayForcast = document.getElementById("fiveday-forecast");
var currentWeatherEl = document.getElementById("current-weather");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var APIKey = "344083a1a2fdaa86634fe8e2dd97d4fd";


searchBtn.addEventListener("click", function() {
    search();
})

city.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        search();
    }
})

function search() {
    var searchTerm = city.value;
    if (searchTerm === "") {
        return 
    }
    getCurrentWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    createSearchHistory();
    city.value = ""
}
// Get current weather API function
function getCurrentWeather(cityName) {
    var currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    axios.get(currentQueryURL)
        .then(function (response) {
            currentWeatherEl.classList.remove("d-none");

            // Display current weather
            var currentDate = dayjs(response.data.dt * 1000).format("MM/DD/YYYY");
            nameEl.innerHTML = response.data.name + " (" + currentDate + ")";
            var weatherPic = response.data.weather[0].icon;
            currentImg.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentImg.setAttribute("alt", response.data.weather[0].description);
            currentTemp.innerHTML = "Temperature: " + kelvin2Fahrenheit(response.data.main.temp) + " &#8457";
            currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            currentWindSpeed.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
            currentFeelsLike.innerHTML = "Feels Like: " + kelvin2Fahrenheit(response.data.main.feels_like) + " &#8457";
            // store cityID to pass to next api
            var cityID = response.data.id;
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            // get weather for the 5-day forecast from second API
    axios.get(forecastQueryURL)
        .then(function (response) {
        fivedayForcast.classList.remove("d-none");
        console.log(response.data)
        // Display the 5-day forecast
        var forecastDivs = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastDivs.length; i++) {
            forecastDivs[i].innerHTML = "";
            var forecastIndex = i * 8 + 4;
            var forecastDate = dayjs(response.data.list[forecastIndex].dt * 1000).format("MM/DD/YYYY");
            var forecastDateEl = document.createElement("p");
            forecastDateEl.setAttribute("class", "mt-3 mb-0");
            forecastDateEl.innerHTML = forecastDate;
            forecastDivs[i].append(forecastDateEl);

            var forecastWeather = document.createElement("img");
            forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeather.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
            forecastDivs[i].append(forecastWeather);
            
            var forecastTemp = document.createElement("p");
            forecastTemp.innerHTML = "Temp: " + kelvin2Fahrenheit(response.data.list[forecastIndex].main.temp) + " &#8457";
            forecastDivs[i].append(forecastTemp);
            
            var forecastHumidity = document.createElement("p");
            forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
            forecastDivs[i].append(forecastHumidity);
            
            var forecastWindSpeed = document.createElement("p");
            forecastWindSpeed.innerHTML = "Wind Speed: " + response.data.list[forecastIndex].wind.speed + " MPH";
            forecastDivs[i].append(forecastWindSpeed);
            
            var forecastFeelsLike = document.createElement("p");
            forecastFeelsLike.innerHTML = "Feels Like: " + kelvin2Fahrenheit(response.data.list[forecastIndex].main.feels_like) + " &#8457";
            forecastDivs[i].append(forecastFeelsLike)
        }
    })

})
}

clearBtn.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    createSearchHistory();
})

// converting kelvin to fahrenheit Equation
function kelvin2Fahrenheit(k) {
    return Math.floor((k - 273.15) * 1.8 + 32);
}
// creating input elements to add to the search history form
function createSearchHistory() {
    historyForm.innerHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        var searchHistoryItem = document.createElement("input");
        searchHistoryItem.setAttribute("type", "text");
        searchHistoryItem.setAttribute("readonly", true);
        searchHistoryItem.setAttribute("class", "form-control d-block bg-white");
        searchHistoryItem.setAttribute("value", searchHistory[i]);
        searchHistoryItem.addEventListener("click", function(event) {
            getCurrentWeather(event.target.value);
        })
        historyForm.append(searchHistoryItem);
    }
}
// calling createSearchHistory function to show search history when reload page
createSearchHistory()





