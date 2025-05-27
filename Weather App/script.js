document.getElementById('get-weather-btn').addEventListener('click', async () => {
    const location = document.getElementById('location-input').value.trim();
    const apiKey = '6efc65b2e203b021142720ce5e0362c8';
    const weatherInfoDiv = document.getElementById('weather-info');

    if (!location) {
        weatherInfoDiv.innerHTML = '<p>Please enter a location!</p>';
        return;
    }

    weatherInfoDiv.innerHTML = 'Loading...';

    try {
        // Geocoding API
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length > 0) {
            const { lat, lon, name, country } = geoData[0];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            if (weatherResponse.ok) {
                weatherInfoDiv.innerHTML = `
                    <h2>${name}, ${country}</h2>
                    <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
                    <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
                `;
                return;
            }
        }

        // Fallback to direct city search in Weather API
        const fallbackUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok) {
            weatherInfoDiv.innerHTML = `
                <h2>${fallbackData.name}, ${fallbackData.sys.country}</h2>
                <p><strong>Temperature:</strong> ${fallbackData.main.temp}°C</p>
                <p><strong>Condition:</strong> ${fallbackData.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${fallbackData.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${fallbackData.wind.speed} m/s</p>
            `;
        } else {
            weatherInfoDiv.innerHTML = `<p>Error: ${fallbackData.message}</p>`;
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = '<p>Unable to fetch weather data. Please try again later.</p>';
        console.error(error);
    }
});


document.getElementById('get-weather-btn').addEventListener('click', async () => {
    const location = document.getElementById('location-input').value.trim();
    const apiKey = '6efc65b2e203b021142720ce5e0362c8'; // Replace with your OpenWeatherMap API key
    const weatherInfoDiv = document.getElementById('weather-info');

    if (!location) {
        weatherInfoDiv.innerHTML = '<p class="text-red-500">Please enter a location!</p>';
        return;
    }

    weatherInfoDiv.innerHTML = '<p>Loading...</p>';

    try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch 3-day forecast data
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        if (currentWeatherResponse.ok && forecastResponse.ok) {
            const { name, sys, main, weather, wind } = currentWeatherData;

            const forecastList = forecastData.list;
let forecastDays = {};
let forecastHTML = '<h3 class="text-xl font-semibold mt-4">3-Day Forecast</h3>';

for (const item of forecastList) {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('en-US'); // Unique key for each day

    if (!forecastDays[dayKey]) {
        forecastDays[dayKey] = {
            date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
            description: item.weather[0].description,
            temp: item.main.temp
        };

        // Stop after collecting 3 days of data
        if (Object.keys(forecastDays).length === 3) break;
    }
}

// Generate HTML for forecast
for (const day of Object.values(forecastDays)) {
    forecastHTML += `
        <div class="p-2 border-b">
            <p><strong>${day.date}</strong>: ${day.description}, ${day.temp}°C</p>
        </div>
    `;
}

// Display forecast
weatherInfoDiv.innerHTML += forecastHTML;



            weatherInfoDiv.innerHTML = `
                <h2 class="text-2xl font-bold">${name}, ${sys.country}</h2>
                <p><strong>Temperature:</strong> ${main.temp}°C</p>
                <p><strong>Condition:</strong> ${weather[0].description}</p>
                <p><strong>Humidity:</strong> ${main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
                ${forecastHTML}
            `;
        } else {
            weatherInfoDiv.innerHTML = `<p class="text-red-500">Error: ${currentWeatherData.message}</p>`;
        }
    } catch (error) {
        weatherInfoDiv.innerHTML = '<p class="text-red-500">Unable to fetch weather data. Please try again later.</p>';
        console.error(error);
    }
});

document.getElementById('current-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = '6efc65b2e203b021142720ce5e0362c8';
            const weatherInfoDiv = document.getElementById('weather-info');

            weatherInfoDiv.innerHTML = '<p>Loading...</p>';

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const data = await response.json();

                if (response.ok) {
                    weatherInfoDiv.innerHTML = `
                        <h2 class="text-2xl font-bold">${data.name}, ${data.sys.country}</h2>
                        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                    `;
                } else {
                    weatherInfoDiv.innerHTML = `<p class="text-red-500">Error: ${data.message}</p>`;
                }
            } catch (error) {
                weatherInfoDiv.innerHTML = '<p class="text-red-500">Unable to fetch weather data. Please try again later.</p>';
                console.error(error);
            }
        }, () => {
            alert('Unable to retrieve your location. Please enable location services.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

const favoritesList = document.getElementById('favorites-list');

function addFavorite(city) {
    // Prevent duplicate entries
    if (!Array.from(favoritesList.children).some(item => item.textContent === city)) {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.classList.add('cursor-pointer', 'hover:text-blue-500');
        
        // Add click event to fetch weather for the favorite city
        listItem.addEventListener('click', () => {
            document.getElementById('location-input').value = city;
            document.getElementById('get-weather-btn').click();
        });

        favoritesList.appendChild(listItem);

        // Optionally, save favorites to local storage for persistence
        saveFavorites();
    }
}

function saveFavorites() {
    const cities = Array.from(favoritesList.children).map(item => item.querySelector('.city-name').textContent);
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
}

function loadFavorites() {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    storedFavorites.forEach(city => addFavorite(city));
}


// Trigger saving to favorites when fetching weather
document.getElementById('get-weather-btn').addEventListener('click', () => {
    const city = document.getElementById('location-input').value.trim();
    if (city) {
        addFavorite(city);
    }
});

// Load favorites on page load
window.addEventListener('load', loadFavorites);

function addFavorite(city) {
    // Prevent duplicate entries
    if (!Array.from(favoritesList.children).some(item => item.textContent.includes(city))) {
        const listItem = document.createElement('li');
        listItem.classList.add('flex', 'justify-between', 'items-center', 'cursor-pointer', 'hover:text-blue-500');
        
        // Add city name
        const cityName = document.createElement('span');
        cityName.textContent = city;
        cityName.classList.add('city-name');
        cityName.addEventListener('click', () => {
            document.getElementById('location-input').value = city;
            document.getElementById('get-weather-btn').click();
        });

        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('ml-4', 'px-2', 'py-1', 'text-red-500', 'border', 'border-red-500', 'rounded', 'hover:bg-red-500', 'hover:text-white');
        removeBtn.addEventListener('click', () => {
            listItem.remove();
            saveFavorites();
        });

        // Append city name and remove button to the list item
        listItem.appendChild(cityName);
        listItem.appendChild(removeBtn);

        // Add the list item to the favorites list
        favoritesList.appendChild(listItem);

        // Save favorites to local storage for persistence
        saveFavorites();
    }
}

