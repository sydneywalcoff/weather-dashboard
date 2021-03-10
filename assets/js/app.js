const d = new Date();
const day = d.getDate();
const month = d.getMonth();
const year = d.getFullYear();

const apiKey = '7740f742ec7905224fc725aeef79fcd9';
const degreeSign = '\u00B0';

const $input = $('#city-input');
const $inputButton = $('.btn');
const $featuredH2 = $('h2');
const $savedSearchesEl = $('#saved-searches');

let savedSearches = [];

const getGeoCodingData = cityName => {
    const geoCodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
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
    const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    date = getDate(month, day, year);

    fetch(oneCallApiUrl).then(function(response) {
        response.json().then(function(data) {
            // grab temperature and append to #featured-temp
            const temp = data.current.temp;
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
            
            // color code uv Index
            uvIndexValidator(uvIndex);
            
            // get icon
            const weatherIconId = data.current.weather[0].icon;
            const iconSrc = `https://openweathermap.org/img/w/${weatherIconId}.png`;
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
                
                let dateEl = $("<h4>").text(date);
                $forecastDayEl.append(dateEl);

                // grab icon & create element
                const weatherIconId = currentDay.weather[0].icon;
                const iconSrc = `https://openweathermap.org/img/w/${weatherIconId}.png`;
                const $iconImg = $("<img>").attr("src", iconSrc).addClass("icon");

                // grab temperature & create p element
                const temp = currentDay.temp.max;
                const $tempEl = $("<p>").text(`Temp: ${temp} ${degreeSign}F`);

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

const uvIndexValidator = uvIndex => {
    const uvIndexEl = $('#featured-uv-index');
    // if/else statement to qualify uvIndex number
    if (7 <= uvIndex) {
        uvIndexEl.addClass("badge badge-danger text-light"); // red light text
    } else if(4 <= uvIndex < 7) {
        uvIndexEl.addClass("badge badge-warning text-dark"); // yellow dark text
    } else if(uvIndex < 4) {
        uvIndexEl.addClass("badge badge-success text-light"); // green light text
    } else {
        alert('error');
    }
};

const getDate = (month, day, year) =>  {
    const date = ` ${month}/${day}/${year} `;
    return date;
};

// accepts button input and fetches relevant city data
const submitButtonHandler = (e) => {
    e.preventDefault();
    clearResults();
    let cityName = $input.val();
    getGeoCodingData(cityName);
    saveSearches(cityName);
    $input.val('');
};

// clears past results
const clearResults = () => {
    $("#featured-temp").text("");
    $("#featured-humidity").text("");
    $("#featured-wind-speed").text("");
    $("#featured-uv-index").text("");
    for(let i=1; i< 6; i++) {
        const $forecastDayEl = $("#forecast-day-"+ i);
        $forecastDayEl.text('');
    }
};

const saveSearches = cityName => {
    // create `p` element with content cityName class card-body
    const savedSearchP = $("<p>").addClass("card text-center").text(cityName);

    // append to savedSearchesEl
    $savedSearchesEl.append(savedSearchP);
    savedSearches.push(cityName);

    // add button listener to re-search
    $(savedSearchP).on("click", function() {
        console.log("you clicked ", cityName);
        clearResults();
        getGeoCodingData(cityName);
    });

    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
};

const loadSearches = () => {
    savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
    if(!savedSearches) {
        savedSearches = [];
    }


    for(let i =0; i < savedSearches.length; i++) {
        let currentCity = savedSearches[i];
        const savedSearchP = $("<p>").addClass("card text-center").text(currentCity);

        // append to savedSearchesEl
        $savedSearchesEl.append(savedSearchP);

        // add button listener to re-search
        $(savedSearchP).on("click", function() {
            console.log("you clicked ", currentCity)
            clearResults();
            getGeoCodingData(currentCity);
        });
    };
};


loadSearches();

$inputButton.on("click", submitButtonHandler);
