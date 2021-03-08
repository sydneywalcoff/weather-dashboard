// api call for openWeather
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// api key
// 7740f742ec7905224fc725aeef79fcd9


const getWeatherData = cityName => {
    let apiKey = '7740f742ec7905224fc725aeef79fcd9';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    
    fetch(apiUrl);

};
getWeatherData('detroit')
