//Global Variables
var cityInputFormEl = document.querySelector("#inputform");
var cityInputEl = document.querySelector("#cityinput");
var displayCityEl = document.querySelector("#results-container");
var containerEl = document.querySelector("#city-container");
var cityEl = document.querySelector("#city");
var weatherIconEl = document.querySelector("#weatherIcon");
var tempEl = document.querySelector("#temp");
var humidEl = document.querySelector("#humid");
var windEl = document.querySelector("#wind");
var uvindexEl = document.querySelector("#uvIndex");
var uvIconEl = document.querySelector("#uvicon");

var forecastContainerEl = document.querySelector("#forecast-container");
var forecastEl = document.querySelector("#forecast");

var card1El = document.querySelector("#card1");
var card2El = document.querySelector("#card2");
var card3El = document.querySelector("#card3");
var card4El = document.querySelector("#card4");
var card5El = document.querySelector("#card5");

var day1El = document.querySelector("#day1");
var day2El = document.querySelector("#day2");
var day3El = document.querySelector("#day3");
var day4El = document.querySelector("#day4");
var day5El = document.querySelector("#day5");

var day1IconEl = document.querySelector("#day1icon");
var day2IconEl = document.querySelector("#day2icon");
var day3IconEl = document.querySelector("#day3icon");
var day4IconEl = document.querySelector("#day4icon");
var day5IconEl = document.querySelector("#day5icon");

var futureTemp1El = document.querySelector("#futuretemp1");
var futureTemp2El = document.querySelector("#futuretemp2");
var futureTemp3El = document.querySelector("#futuretemp3");
var futureTemp4El = document.querySelector("#futuretemp4");
var futureTemp5El = document.querySelector("#futuretemp5");

var futureHumidity1El = document.querySelector("#futurehumidity1");
var futureHumidity2El = document.querySelector("#futurehumidity2");
var futureHumidity3El = document.querySelector("#futurehumidity3");
var futureHumidity4El = document.querySelector("#futurehumidity4");
var futureHumidity5El = document.querySelector("#futurehumidity5");

var weatherEl = document.querySelector("#weather");

var showHiddenEl = document.querySelector("#hidden");

var searchContainerEl = document.querySelector("#searchcontainer");

var lat
var lon
var uvUrl

var newArray = [];


var listItemClicker = function(event) {
    var clickedCity = event.currentTarget.textContent;

    getWeather(clickedCity);
    getForecast(clickedCity);
}

var formSubmit = function(event) {
    event.preventDefault();
    cityName = cityInputEl.value.trim();

    if (cityName) {
        getWeather(cityName);
        getForecast(cityName);

        newArray.push(cityName);

        localStorage.setItem("city", JSON.stringify(newArray));

        cityInputEl.value = "";
    } else {
        alert("Enter a new City")
    }
}


var getWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=4a49e0edd9da85f227ea97a1d030377f";
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(jsonResponse) {
                console.log(jsonResponse);
                var cityName = jsonResponse.name;

                var timezone = jsonResponse.timezone;

                var localDate

                var calcLocalDate = function() {
                    var date = new Date();

                    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

                    var timeZoneOffset = now_utc + (timezone * 1000);

                    var newDate = timeZoneOffset + (timezone * 1000);
                    var unformattedNewDate = new Date(newDate);

                    localDate = moment(unformattedNewDate).format('(MM/DD/YYYY)');
                }
                calcLocalDate();

                var weatherIcon = jsonResponse.weather[0].main;

                if (weatherIcon === 'Clouds') {
                    weatherIconEl.setAttribute("src", "./assets/images/cloudy.png");
                } else if (weatherIcon === "Clear") {
                    weatherIconEl.setAttribute("src", "./assets/images/sunny.png")
                }
                else if (weatherIcon === "Fog") {
                    weatherIconEl.setAttribute("src", "./assets/images/fog.png")
                }
                else if (weatherIcon === "Snow") {
                    weatherIconEl.setAttribute("src", "./assets/images/snow.png")
                }
                else if (weatherIcon === "Rain") {
                    weatherIconEl.setAttribute("src", "./assets/images/heavy-rain.png")
                }
                else if (weatherIcon === "Drizzle") {
                    weatherIconEl.setAttribute("src", "./assets/images/rain.png")
                }
                else if (weatherIcon === "Thunderstorm") {
                    weatherIconEl.setAttribute("src", "./assets/images/thunder.png")
                }
                else if (weatherIcon === "Mist") {
                    weatherIconEl.setAttribute("src", "./assets/images/drizzle.png")
                }

                var temperature = jsonResponse.main.temp;

                var humidity = jsonResponse.main.humidity;

                var windSpeed = jsonResponse.wind.speed;

                lat = jsonResponse.coord.lat;

                lon = jsonResponse.coord.lon;

                uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=4a49e0edd9da85f227ea97a1d030377f&lat=" + lat + "&lon=" + lon;
                getUvIndex(uvUrl);

                containerEl.innerHTML = cityName + " " + localDate;
                tempEl.innerHTML = "Temperature: " + temperature + " ℃";          
                humidEl.innerHTML = "Humidity: " + humidity + " %";   
                windEl.innerHTML = "Wind Speed: "  + windSpeed + " MPH";


                //add the current location to the page
                displayCityEl.appendChild(containerEl);
                //add icon to the page
                displayCityEl.appendChild(weatherIconEl);
                //add temperature to the page
                displayCityEl.appendChild(tempEl);
                //add humidity to the page
                displayCityEl.appendChild(humidEl);
                //add windspeed to the page
                displayCityEl.appendChild(windEl);

                var newListItemEl = document.createElement("li");
                newListItemEl.className = "list-group-item";
                newListItemEl.textContent = cityName;
                newListItemEl.addEventListener("click", listItemClicker);

                searchContainerEl.appendChild(newListItemEl); 
                
            })
        } else {
            alert("Error: " + response.statusText)
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather Map")
    })
}

var getForecast = function (cityName) {
    var apiFiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=4a49e0edd9da85f227ea97a1d030377f";
    fetch(apiFiveDayUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function (responseapiFiveDayResponse) {
                console.log(responseapiFiveDayResponse);

                var day1w = responseapiFiveDayResponse.list[0].dt_txt;
                var formattedDay1w = moment(day1w).format('MM/DD/YYYY')

                var day2w = responseapiFiveDayResponse.list[8].dt_txt;
                var formattedDay2w = moment(day2w).format('MM/DD/YYYY')

                var day3w = responseapiFiveDayResponse.list[16].dt_txt;
                var formattedDay3w = moment(day3w).format('MM/DD/YYYY')

                var day4w = responseapiFiveDayResponse.list[24].dt_txt;
                var formattedDay4w = moment(day4w).format('MM/DD/YYYY')

                var day5w = responseapiFiveDayResponse.list[32].dt_txt;
                var formattedDay5w = moment(day5w).format('MM/DD/YYYY')

                //get conditions for icons
                var weatherIcon1 = responseapiFiveDayResponse.list[0].weather[0].main;
                console.log(weatherIcon1);

                if (weatherIcon1 === "Clouds") {
                    day1IconEl.setAttribute("src", "./assets/images/cloudy.png");
                }
                else if (weatherIcon1 === "Clear") {
                    day1IconEl.setAttribute("src", "./assets/images/sunny.png")
                }
                else if (weatherIcon1 === "Fog") {
                    day1IconEl.setAttribute("src", "./assets/images/fog.png")
                }
                else if (weatherIcon1 === "Snow") {
                    day1IconEl.setAttribute("src", "./assets/images/snow.png")
                }
                else if (weatherIcon1 === "Rain") {
                    day1IconEl.setAttribute("src", "./assets/images/heavy-rain.png")
                }
                else if (weatherIcon1 === "Drizzle") {
                    day1IconEl.setAttribute("src", "./assets/images/rain.png")
                }
                else if (weatherIcon1 === "Thunderstorm") {
                    day1IconEl.setAttribute("src", "./assets/images/thunder.png")
                }
                else if (weatherIcon1 === "Mist") {
                    day1IconEl.setAttribute("src", "./assets/images/drizzle.png")
                }


                var weatherIcon2 = responseapiFiveDayResponse.list[8].weather[0].main;
                console.log(weatherIcon2);

                if (weatherIcon2 === "Clouds") {
                    day2IconEl.setAttribute("src", "./assets/images/cloudy.png");
                }
                else if (weatherIcon2 === "Clear") {
                    day2IconEl.setAttribute("src", "./assets/images/sunny.png")
                }
                else if (weatherIcon2 === "Fog") {
                    day2IconEl.setAttribute("src", "./assets/images/fog.png")
                }
                else if (weatherIcon2 === "Snow") {
                    day2IconEl.setAttribute("src", "./assets/images/snow.png")
                }
                else if (weatherIcon2 === "Rain") {
                    day2IconEl.setAttribute("src", "./assets/images/heavy-rain.png")
                }
                else if (weatherIcon2 === "Drizzle") {
                    day2IconEl.setAttribute("src", "./assets/images/rain.png")
                }
                else if (weatherIcon2 === "Thunderstorm") {
                    day2IconEl.setAttribute("src", "./assets/images/thunder.png")
                }
                else if (weatherIcon2 === "Mist") {
                    day2IconEl.setAttribute("src", "./assets/images/drizzle.png")
                }


                var weatherIcon3 = responseapiFiveDayResponse.list[16].weather[0].main;
                console.log(weatherIcon3);

                if (weatherIcon3 === "Clouds") {
                    day3IconEl.setAttribute("src", "./assets/images/cloudy.png");
                }
                else if (weatherIcon3 === "Clear") {
                    day3IconEl.setAttribute("src", "./assets/images/sunny.png")
                }
                else if (weatherIcon3 === "Fog") {
                    day3IconEl.setAttribute("src", "./assets/images/fog.png")
                }
                else if (weatherIcon3 === "Snow") {
                    day3IconEl.setAttribute("src", "./assets/images/snow.png")
                }
                else if (weatherIcon3 === "Rain") {
                    day3IconEl.setAttribute("src", "./assets/images/heavy-rain.png")
                }
                else if (weatherIcon3 === "Drizzle") {
                    day3IconEl.setAttribute("src", "./assets/images/rain.png")
                }
                else if (weatherIcon3 === "Thunderstorm") {
                    day3IconEl.setAttribute("src", "./assets/images/thunder.png")
                }
                else if (weatherIcon3 === "Mist") {
                    day3IconEl.setAttribute("src", "./assets/images/drizzle.png")
                }

                var weatherIcon4 = responseapiFiveDayResponse.list[24].weather[0].main;
                console.log(weatherIcon4);

                if (weatherIcon4 === "Clouds") {
                    day4IconEl.setAttribute("src", "./assets/images/cloudy.png");
                }
                else if (weatherIcon4 === "Clear") {
                    day4IconEl.setAttribute("src", "./assets/images/sunny.png")
                }
                else if (weatherIcon4 === "Fog") {
                    day4IconEl.setAttribute("src", "./assets/images/fog.png")
                }
                else if (weatherIcon4 === "Snow") {
                    day4IconEl.setAttribute("src", "./assets/images/snow.png")
                }
                else if (weatherIcon4 === "Rain") {
                    day4IconEl.setAttribute("src", "./assets/images/heavy-rain.png")
                }
                else if (weatherIcon4 === "Drizzle") {
                    day4IconEl.setAttribute("src", "./assets/images/rain.png")
                }
                else if (weatherIcon4 === "Thunderstorm") {
                    day4IconEl.setAttribute("src", "./assets/images/thunder.png")
                }
                else if (weatherIcon4 === "Mist") {
                    day4IconEl.setAttribute("src", "./assets/images/drizzle.png")
                }


                var weatherIcon5 = responseapiFiveDayResponse.list[32].weather[0].main;
                console.log(weatherIcon5);

                if (weatherIcon5 === "Clouds") {
                    day5IconEl.setAttribute("src", "./assets/images/cloudy.png");
                }
                else if (weatherIcon5 === "Clear") {
                    day5IconEl.setAttribute("src", "./assets/images/sunny.png")
                }
                else if (weatherIcon5 === "Fog") {
                    day5IconEl.setAttribute("src", "./assets/images/fog.png")
                }
                else if (weatherIcon5 === "Snow") {
                    day5IconEl.setAttribute("src", "./assets/images/snow.png")
                }
                else if (weatherIcon5 === "Rain") {
                    day5IconEl.setAttribute("src", "./assets/images/heavy-rain.png")
                }
                else if (weatherIcon5 === "Drizzle") {
                    day5IconEl.setAttribute("src", "./assets/images/rain.png")
                }
                else if (weatherIcon5 === "Thunderstorm") {
                    day5IconEl.setAttribute("src", "./assets/images/thunder.png")
                }
                else if (weatherIcon5 === "Mist") {
                    day5IconEl.setAttribute("src", "./assets/images/drizzle.png")
                }


                //get the next 5 day temperature
                var temperatureDay1 = responseapiFiveDayResponse.list[0].main.temp; 
                var temperatureDay2 = responseapiFiveDayResponse.list[8].main.temp; 
                var temperatureDay3 = responseapiFiveDayResponse.list[16].main.temp; 
                var temperatureDay4 = responseapiFiveDayResponse.list[24].main.temp; 
                var temperatureDay5 = responseapiFiveDayResponse.list[32].main.temp; 


                //get the next 5 day humidity
                var humidityDay1 = responseapiFiveDayResponse.list[0].main.humidity;
                var humidityDay2 = responseapiFiveDayResponse.list[8].main.humidity;
                var humidityDay3 = responseapiFiveDayResponse.list[16].main.humidity;
                var humidityDay4 = responseapiFiveDayResponse.list[24].main.humidity;
                var humidityDay5 = responseapiFiveDayResponse.list[32].main.humidity;


                //5 day forecast title
                forecastEl.innerHTML = "5-Day Forecast: ";

                //add 5 day forecast dates to the page
                day1El.innerHTML = formattedDay1w;
                day2El.innerHTML = formattedDay2w;
                day3El.innerHTML = formattedDay3w;
                day4El.innerHTML = formattedDay4w;
                day5El.innerHTML = formattedDay5w;

                //add 5 day forecast temperatures to the page
                futureTemp1El.innerHTML = "Temp: " + temperatureDay1 + " ℃";
                futureTemp2El.innerHTML = "Temp: " + temperatureDay2 + " ℃";
                futureTemp3El.innerHTML = "Temp: " + temperatureDay3 + " ℃";
                futureTemp4El.innerHTML = "Temp: " + temperatureDay4 + " ℃";
                futureTemp5El.innerHTML = "Temp: " + temperatureDay5 + " ℃";

                //add 5 day forecast humidity to the page
                futureHumidity1El.innerHTML = "Humidity: " + humidityDay1 + "%";
                futureHumidity2El.innerHTML = "Humidity: " + humidityDay2 + "%";
                futureHumidity3El.innerHTML = "Humidity: " + humidityDay3 + "%";
                futureHumidity4El.innerHTML = "Humidity: " + humidityDay4 + "%";
                futureHumidity5El.innerHTML = "Humidity: " + humidityDay5 + "%";

                //add the title to the section of the page
                forecastContainerEl.appendChild(forecastEl);

                showHiddenEl.classList.remove("hidden");
    

            })
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather Map")
    })
}

var getUvIndex = function (uvUrl) {
    fetch(uvUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function (responseUvUrl) {
                var uvIndex = responseUvUrl.value;

                if (uvIndex >=0 && uvIndex <3) {
                    uvIconEl.className = "green"
                } 
                else if (uvIndex >=3 && uvIndex < 6) {
                    uvIconEl.className = "yellow"
                }
                else if (uvIndex >=6 && uvIndex < 8) {
                    uvIconEl.className = "orange"
                }
                else if (uvIndex >=8 && uvIndex < 11) {
                    uvIconEl.className = "red"
                }
                else if (uvIndex >=11) {
                    uvIconEl.className = "purple"
                }

                uvindexEl.innerHTML = "UV Index: " + uvIndex + "   ";

                displayCityEl.appendChild(uvindexEl);
                displayCityEl.appendChild(uvIconEl);

            })
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather Map")
    })
}

cityInputFormEl.addEventListener("submit", formSubmit);

