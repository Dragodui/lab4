const API_KEY = '8b94fa64a7f516b879d3bc0f99cbbe11';

let coords = {};

const getIcon = (id) => {
  return `https://openweathermap.org/img/wn/${id}@2x.png`;
};

const getCoords = async (cityName) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`,
    );
    const data = await response.json();
    coords = {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    console.log(error);
  }
};

const getCurrentWeather = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log('Weather data:', response);
        const weatherElement = document.createElement('div');
        weatherElement.classList.add('weather');
        weatherElement.innerHTML = '';
        weatherElement.innerHTML = `
                <h2>Weather in ${response.name}</h2>
                <div className="weather-block">
                    <img src="${getIcon(
                      response.weather[0].icon,
                    )}" alt="Weather icon" />
                    <p>${response.weather[0].description}</p>
                    <p>Temperature: ${response.main.temp}°C</p>
                    <p>Feels like: ${response.main.feels_like}°C</p>
                    <p>Humidity: ${response.main.humidity}%</p>
                </div>
              `;
              
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.appendChild(weatherElement);
      } else {
        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getForecast = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const forecastData = data.list;
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast');

    let forecastHTML = `<h2>Forecast for ${data.city.name}</h2>`;
    forecastHTML+="<div class='forecast-container'>"
    for (let i = 0; i < forecastData.length; i += 8) {
      const weather = forecastData[i];
      const date = new Date(weather.dt * 1000);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      forecastHTML += `
          <div class="weather-block">
            <p class="weather-date">${formattedDate}</p>
            <img src="${getIcon(weather.weather[0].icon)}" alt="Weather icon" />
            <p>${weather.weather[0].description}</p>
            <p>Temperature: ${weather.main.temp}°C</p>
            <p>Feels like: ${weather.main.feels_like}°C</p>
            <p>Humidity: ${weather.main.humidity}%</p>
          </div>`;
    }
    forecastHTML+="</div>"
    forecastElement.innerHTML = forecastHTML;
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.appendChild(forecastElement);
  } catch (error) {
    console.log(error);
  }
};

const getWeather = async () => {
  await getCurrentWeather();
  await getForecast();
};

const cityInput = document.querySelector('#city');
const searchBtn = document.querySelector('#search');

searchBtn.addEventListener('click', async () => {
  const cityName = cityInput.value;
  await getCoords(cityName);
  await getWeather();
});
