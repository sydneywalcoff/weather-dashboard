const d = new Date();
const day = d.getDate();
const month = d.getMonth();
const year = d.getFullYear();

let apiKey = '7740f742ec7905224fc725aeef79fcd9';
const degreeSign = '\u00B0';

const $input = $('#city-input');
const $inputButton = $('.btn');
const $featuredH2 = $('h2');
const featuredTemp = $('.featured-temperature').text();

const getGeoCodingData = cityName => {
    const geoCodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    fetch(geoCodingApiUrl).then(function(response) {
        response.json().then(function(data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const cityName = data[0].name;

            getWeatherData(lat, lon, cityName)
        });
    });
};

const getWeatherData = (lat, lon, cityName) => {
    const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    date = getDate(month, day, year);

    fetch(oneCallApiUrl).then(function(response) {
        response.json().then(function(data) {

            // grab temperature and append to #featured-temp
            const temp = Math.floor(fahrenheitConverter(data.current.temp));
            $('#featured-temp').append(temp + ' ' + degreeSign + 'F');

            // grab humidity and append to #featured-humidity
            const humidity = Math.floor(data.current.humidity);
            $('#featured-humidity').append(humidity + '%');

            // grab wind speed and append to #featured-wind-speed
            const windSpeed = Math.floor(data.current.wind_speed);
            $('#featured-wind-speed').append(windSpeed + ' ' + 'MPH');

            // grab uv index and append to #featured-uv-index
            const uvIndex = data.current.uvi;
            $('#featured-uv-index').append(uvIndex);

            // get icon
            const weatherIconId = data.current.weather[0].icon;
            const iconSrc = `http://openweathermap.org/img/w/${weatherIconId}.png`;
            const $iconImg = $("<img>").attr("src", iconSrc).addClass("icon-sm");

            // append to $featuredH2
            $featuredH2.text(cityName);
            $featuredH2.append(date);
            $featuredH2.append($iconImg);

            // forecast
            for(let i=1; i < 6; i++){
                // current day in the forecast
                const currentDay = data.daily[i];
                const $forecastDayEl = $("#forecast-day-"+ i);

                // grab date and append to title
                date = getDate(month, day+i, year);
                $("#forecast-day-"+ i +" h4").text(date);

                // grab header
                const $forecastDayHeaderEl = $(".date");

                // grab icon & create element
                const weatherIconId = currentDay.weather[0].icon;
                const iconSrc = `http://openweathermap.org/img/w/${weatherIconId}.png`;
                const $iconImg = $("<img>").attr("src", iconSrc).addClass("icon");

                // grab temperature & create p element
                const tempKelvin = currentDay.temp.max;

                const tempFahrenheit = Math.floor(fahrenheitConverter(tempKelvin));
                const $tempEl = $("<p>").text(`Temp: ${tempFahrenheit} ${degreeSign}F`);

                // grab humidity & create p element
                const humidity = currentDay.humidity;
                const $humidityEl = $("<p>").text(`Humidity: ${humidity}%`);

                // append to container
                $forecastDayEl.append($iconImg);
                $forecastDayEl.append($tempEl);
                $forecastDayEl.append($humidityEl);
            }
        });
    });
};

const fahrenheitConverter = kelvin => (((kelvin - 273.15)*9)/5)+32;

const getDate = (month, day, year) =>  {
    const date = ` ${month}/${day}/${year} `;
    return date;
};

// accepts button input and fetches relevant city data
const submitButtonHandler = (e) => {
    e.preventDefault();
    let cityName = $input.val();
    getGeoCodingData(cityName);
    $input.val('');
};



$inputButton.on("click", submitButtonHandler);
