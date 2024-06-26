# Weather App

Simple weather app that fetches data from OpenWeather API. Built for practice with JavaScript and web design.   

## Features

- **City Search:** Enter a city name to get the current weather data.
- **Current Location:** Automatically fetches weather data for your current location.
- **Temperature Units:** Switch between Fahrenheit and Celsius.
- **Detailed Weather Information:** Provides temperature, weather description, feels like temperature, humidity, and wind speed.

## Technologies Used

- **HTML:** Structure of the application.
- **CSS:** Styling the application for a clean and modern look.
- **JavaScript:** Functionality of the app, including fetching data and handling user interactions.
- **OpenWeather API:** Retrieves current weather data.
- **Geolocation API:** Fetches the user's current location.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jjoej15/JSWeatherApp.git
2. Get free OpenWeather API key by signing up at https://openweathermap.org/
3. Create conf.js file in working directory and enter API key there:
    ```JavaScript
    const conf = {
        API_KEY_WEATHER: YOUR_API_KEY_HERE
    }

    export default conf;
    ```
4. Open index.html with live server.

## Known Bugs

 - When searching for city name that has multiple locations with state name typed out may not give you the correct location. Using state codes will.   
 **Example:** Searching "Portland, Maine" will give you result for Portland, Oregon. But searching "Portland, ME" will give you result of Portland, Maine.
  - Doesn't display state name when viewing current location's weather.

