let weatherInfoObj = {};


window.addEventListener('load', () => {
   
    // let apiKey= 'fhutGGMpg0pGR2dQ3mCakEYZe0MAm2vv';
    let apiKey='GJoNBBrmltpSFdtKFuuTDsZouN1XxUAB';
    let lat, long;
    let country,locationKey,timeZone,locationName;
    navigator.geolocation.getCurrentPosition((position) => {
       
        lat = position['coords']['latitude'];
        long = position['coords']['longitude'];
        console.log(lat+" "+long)
        let geopositionUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`;
        
        axios.get(geopositionUrl)
        .then((response) => {
            country = response.data.Country.EnglishName;
            locationKey = response.data.Key;
            timeZone = response.data.TimeZone;
            locationName = response.data.LocalizedName;
            
            weatherInfoObj['country'] = response.data.Country.EnglishName;
            weatherInfoObj['locationKey'] = response.data.Key;
            weatherInfoObj['timeZone'] = response.data.TimeZone;
            weatherInfoObj['currentLocation'] = response.data.LocalizedName;
          
            getWeatherData(apiKey,weatherInfoObj.locationKey);
        })
    })
})

function getWeatherData(apiKey,locationKey){
    let weatherUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}`;
    axios.get(weatherUrl).then((response) => {
        console.log(response);
        weatherInfoObj['today'] = response.data.DailyForecasts[0].Date;
        weatherInfoObj['day'] = response.data.DailyForecasts[0].Day;
        weatherInfoObj['night'] = response.data.DailyForecasts[0].Night;
        weatherInfoObj['temperature'] = response.data.DailyForecasts[0].Temperature;
        let today = new Date(weatherInfoObj['today']);
        console.log('weatherInfoObj ' , weatherInfoObj)

        returnId('country').textContent = weatherInfoObj['country'];
        returnId('currentLocation').textContent = weatherInfoObj['currentLocation'];
        returnId('date').textContent = today.getDate()+ '-' + (today.getMonth()+1) + '-' + (today.getFullYear() + " " + weatherInfoObj.timeZone.Code);

        if(weatherInfoObj.day.Icon < 10 ){
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`)
        }else{
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`)
        }

        if(weatherInfoObj.night.Icon  < 10 ){
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`)
        }else{
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`)
        }
        
        returnId('morning-desc').textContent = weatherInfoObj.day.IconPhrase;
        returnId('night-desc').textContent = weatherInfoObj.night.IconPhrase;
            
      
        
            let maxTempFahrenheit = weatherInfoObj.temperature.Maximum.Value;
            let minTempFahrenheit = weatherInfoObj.temperature.Minimum.Value;
        
            let maxTempCelsius = fahrenheitToCelsius(maxTempFahrenheit);
            let minTempCelsius = fahrenheitToCelsius(minTempFahrenheit);
        
            returnId('maxTemperature').textContent = maxTempCelsius.toFixed(2) + " °C"; 
            returnId('minTemperature').textContent = minTempCelsius.toFixed(2) + " °C";
        
    })
}


function returnId(id) {
    return document.getElementById(id);
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}
