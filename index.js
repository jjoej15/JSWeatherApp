import stateCodesMap from './stateCodes.js';
import conf from './conf.js';

const weatherApiKey = conf.API_KEY_WEATHER;
let scale = "imperial";
let currentLocation = true;
getWeather();

document.getElementById("city-input").addEventListener("keydown", event => {
        if (event.key === "Enter") {
            currentLocation = false;
            getWeather();
        }
    });

document.getElementById("get-weather-btn").addEventListener("click", () => {
        currentLocation = false;
        getWeather();
    });

document.getElementById("fahrenheit-btn").addEventListener("click", () => {
        scale = "imperial";
        document.getElementById("fahrenheit-btn").style.color = "rgb(255, 255, 255)";
        document.getElementById("celsius-btn").style.color = "rgb(179, 179, 179)";
        getWeather();
    });

document.getElementById("celsius-btn").addEventListener("click", () => {
        scale = "metric";
        document.getElementById("fahrenheit-btn").style.color = "rgb(179, 179, 179)";
        document.getElementById("celsius-btn").style.color = "rgb(255, 255, 255)";
        getWeather();
    });

document.getElementById("curr-location-btn").addEventListener("click", () => {
    currentLocation = true;
    getWeather();
});


// Gets weather information from OpenWeatherMaps API and displays to app
async function getWeather() {
    const cityInput = document.getElementById("city-input").value;
    try {
        let longitude, latitude, state;
        if (currentLocation) { // If need to find current location's data, call getCurrLocCoords()
            const locationObj = await getCurrLocCoords();
            [longitude, latitude] = [locationObj.longitude, locationObj.latitude];      
        } else { // If user wants a specified city's data, call getCoords(cityInput)
            [longitude, latitude, state] = await getCoords(cityInput);
        }


        const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${weatherApiKey}&units=${scale}`);
        const weatherData = await weatherResponse.json();


        const temp = Math.round(weatherData.main.temp);
        let location;
        state == null ? location = `${weatherData.name}, ${weatherData.sys.country}` : location = `${weatherData.name}, ${state}, ${weatherData.sys.country}`;
        const iconId = weatherData.weather[0].icon;
        const weatherDesc = weatherData.weather[0].main;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const feelsLikeTemp = Math.round(weatherData.main.feels_like);


        document.getElementById("city-name").textContent = location;
        document.getElementById("temperature").textContent = temp;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
        document.getElementById("weather-desc").textContent = weatherDesc; 
        document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
        if (scale === "imperial") {
            document.getElementById("feels-like").textContent = `Feels like: ${feelsLikeTemp} °F`;
            document.getElementById("wind").textContent = `Wind: ${windSpeed} MPH`;
        } else{
            document.getElementById("feels-like").textContent = `Feels like: ${feelsLikeTemp} °C`;
            document.getElementById("wind").textContent = `Wind: ${windSpeed} KM/H`;
        }


        document.getElementById("upper-data").style.visibility = "visible";
        document.getElementById("feels-like").style.visibility = "visible";
        document.getElementById("humidity").style.visibility = "visible";
        document.getElementById("wind").style.visibility = "visible";
    }

    catch(error) {
        if (error.message === "Unable to retrieve user location") {
            console.error(error);
            document.getElementById("city-name").textContent = `Couldn't retrieve location`;
            document.getElementById("upper-data").style.visibility = "hidden";
            document.getElementById("feels-like").textContent = "Search city above";
            document.getElementById("humidity").style.visibility = "hidden";
            document.getElementById("wind").style.visibility = "hidden";


        } else{
            console.error(error);
            document.getElementById("city-name").textContent = `No results found for ${cityInput}`;
            document.getElementById("upper-data").style.visibility = "hidden";
            document.getElementById("feels-like").style.visibility = "hidden";
            document.getElementById("humidity").style.visibility = "hidden";
            document.getElementById("wind").style.visibility = "hidden";
        }
    }
}


// Gets lat/long coords and state of city input string
async function getCoords(cityInput) {
    const inputArr = cityInput.split(`,`).map(word => word.trim());
    if (inputArr.length > 3) throw new Error("Invalid input");

    // If user used state code, converts to state name to pass to API
    if (inputArr.length > 1 && inputArr[1].toUpperCase() in stateCodesMap) {
        let stateCode = inputArr[1].toUpperCase();
        inputArr[1] = stateCodesMap[stateCode][0];
        inputArr.length == 2 ? inputArr.push(stateCodesMap[stateCode][1]) : inputArr[2] = stateCodesMap[stateCode][1];
    }

    // Uses OpenWeather's geocoding API, in order to get lat/long coords of city
    let geolocationResponse;
    if (inputArr.length == 1) {
        geolocationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputArr[0]}&appid=${weatherApiKey}`);

    } else if (inputArr.length == 2) {
        geolocationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputArr[0]},${inputArr[1]}&appid=${weatherApiKey}`);

    } else {
        geolocationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputArr[0]},${inputArr[1]},${inputArr[2]}&appid=${weatherApiKey}`);
    }

    if (!geolocationResponse.ok) {
        throw new Error("Couldn't fetch resource");
    }
    const geolocationData = await geolocationResponse.json();

    return [geolocationData[0].lon, geolocationData[0].lat, geolocationData[0].state];
}


// Finds coordinates of user's current location
function getCurrLocCoords() {
    return new Promise((resolve, reject) => {
        function success(position) {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }

        function error() {
            reject(new Error("Unable to retrieve user location"));
        }

        navigator.geolocation.getCurrentPosition(success, error);
    });
}