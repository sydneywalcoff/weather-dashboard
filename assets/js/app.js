const $input = $('#city-input');
const $inputButton = $('.btn');

const getWeatherData = cityName => {
    let apiKey = '7740f742ec7905224fc725aeef79fcd9';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    // make api request
    fetch(apiUrl).then(function(response){
        // reformat into json
        response.json().then(function(data) {
            // log resulting data
            console.log(data.city.name);
        });
    });
};


// accepts button input and fetches relevant city data
const getCityInput = (e) => {
    e.preventDefault();
    let cityName = $input.val();
    getWeatherData(cityName);
    $input.val('');
};

$inputButton.on("click", getCityInput);
