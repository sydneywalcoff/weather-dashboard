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
            // log resulting data
            console.log(data.list[0].weather);
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
