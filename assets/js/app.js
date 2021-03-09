const $input = $('#city-input');
const $inputButton = $('.btn');
const $featuredH2 = $('h2');
const featuredTemp = $('.featured-temperature').text();

const getWeatherData = cityName => {
    let apiKey = '7740f742ec7905224fc725aeef79fcd9';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    // make api request
    fetch(apiUrl).then(function(response){
        // reformat into json
        response.json().then(function(data) {
            console.log(data.list);
            let counter =1;
            for(let i=0; i < data.list.length; i+=8){
                // current day in the forecast
                const currentDay = data.list[i];
                const $forecastDayEl = $("#forecast-day-"+ counter);

                // grab header
                const $forecastDayHeaderEl = $(".date");
                console.log($forecastDayHeaderEl);

                // grab icon & create element
                const weatherIconId = currentDay.weather[0].icon;
                const iconSrc = `http://openweathermap.org/img/w/${weatherIconId}.png`
                const $iconImg = $("<img>").attr("src", iconSrc).addClass("icon");

                // grab temperature & create p element
                const degreeSign = '\u00B0';
                const tempKelvin = currentDay.main.temp;

                const fahrenheitConverter = kelvin => (((kelvin - 273.15)*9)/5)+32;
                const tempFahrenheit = Math.floor(fahrenheitConverter(tempKelvin));
                const $tempEl = $("<p>").text(`Temp: ${tempFahrenheit} ${degreeSign}F`);

                // grab humidity & create p element
                const humidity = currentDay.main.humidity;
                const $humidityEl = $("<p>").text(`Humidity: ${humidity}%`)

                // append to container
                $forecastDayEl.append($iconImg);
                $forecastDayEl.append($tempEl);
                $forecastDayEl.append($humidityEl);

                // add to counter
                counter++;
            }
        });
    });
    displayWeatherData(cityName);
};

const displayWeatherData = cityName => {
    $featuredH2.text(cityName)
    // TO DO: append date and icon
    $featuredH2.append(" (date)")

};

// accepts button input and fetches relevant city data
const submitButtonHandler = (e) => {
    e.preventDefault();
    let cityName = $input.val();
    getWeatherData(cityName);
    $input.val('');
};

$inputButton.on("click", submitButtonHandler);
