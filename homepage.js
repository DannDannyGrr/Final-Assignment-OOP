document.addEventListener("DOMContentLoaded", function() {
    // Load weather data for a default location on page load
    fetchWeatherData("Kuala Lumpur");
});

function buttonClicked() {
    // Get city input from search bar
    var city = document.querySelector(".search-bar input[type='text']").value;
    // Fetch and display weather data for the specified city
    fetchWeatherData(city);
}

function fetchWeatherData(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        // Update location and main weather information display
        document.getElementById("demo1").textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById("temp-value").textContent = `${data.current.temp_c}°C`;
        document.getElementById("temp-description").textContent = data.current.condition.text;
        document.getElementById("realfeel").textContent = `RealFeel® ${data.current.feelslike_c}°C`;

        // Update additional weather details
        document.getElementById("realfeel-shade").textContent = `${data.current.feelslike_c}°C`;
        document.getElementById("wind").textContent = `${data.current.wind_kph} kph`;
        document.getElementById("humidity").textContent = `${data.current.humidity}%`;
        document.getElementById("visibility").textContent = `${data.current.vis_km} km`;
        document.getElementById("uv-index").textContent = data.current.uv;
        document.getElementById("precipitation").textContent = `${data.current.precip_mm} mm`;
        document.getElementById("time").textContent = `${data.location.localtime}`;

        // Update the weather icons
        document.getElementById("demo2").src = "https:" + data.current.condition.icon;
        document.getElementById("demo3").src = "https:" + data.current.condition.icon;

        // Get rain and snow chances
        const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain; // Adjust based on the API's response structure
        const snowChance = data.forecast.forecastday[0].day.daily_chance_of_snow; // Adjust based on the API's response structure
        document.getElementById("rain-chance").textContent = `${rainChance}%`;
        document.getElementById("snow-chance").textContent = `${snowChance}%`;

        // Get max, min, and avg temperatures
        const maxTemp = data.forecast.forecastday[0].day.maxtemp_c;
        const minTemp = data.forecast.forecastday[0].day.mintemp_c;
        const avgTemp = data.forecast.forecastday[0].day.avgtemp_c;
        document.getElementById("max-temp").textContent = `Max: ${maxTemp}°C`;
        document.getElementById("min-temp").textContent = `Min: ${minTemp}°C`;
        document.getElementById("avg-temp").textContent = `Avg: ${avgTemp}°C`;
        
        const hourlyForecastContainer = document.getElementById("hourly-forecast");
        hourlyForecastContainer.innerHTML = ""; // Clear previous forecast data

        const hourlyData = data.forecast.forecastday[0].hour;  // Get hourly data for the day
        hourlyData.forEach((hour) => {
            const hourItem = document.createElement("div");
            hourItem.classList.add("hourly-item");

            // Format time to show only hours (e.g., 14:00 -> 2 PM)
            const hourTime = new Date(hour.time).toLocaleTimeString([], { hour: 'numeric' });

            hourItem.innerHTML = `
                <p class="hour">${hourTime}</p>
                <img src="https:${hour.condition.icon}" alt="Weather Icon">
                <p class="hour-temp">${hour.temp_c}°C</p>
                <p class="hour-desc">${hour.condition.text}</p>
            `;

            hourlyForecastContainer.appendChild(hourItem);
        });

        // Astro Data
        const astroDetailsContainer = document.getElementById("astro-details");
        astroDetailsContainer.innerHTML = ""; // Clear previous astro data

        const astroData = data.forecast.forecastday[0].astro;

        // Define images for each astro event
        const astroItems = [
            { label: "Sunrise", value: astroData.sunrise, imgSrc: "sunrise.png" },
            { label: "Sunset", value: astroData.sunset, imgSrc: "sunset.png" },
            { label: "Moonrise", value: astroData.moonrise, imgSrc: "moonrise.png" },
            { label: "Moonset", value: astroData.moonset, imgSrc: "moonset.png" }
        ];

        astroItems.forEach((astro) => {
            const astroItem = document.createElement("div");
            astroItem.classList.add("astro-item");

            astroItem.innerHTML = `
                <img src="${astro.imgSrc}" alt="${astro.label} Icon" class="astro-icon">
                <h3>${astro.label}</h3>
                <p>${astro.value}</p>
            `;

            astroDetailsContainer.appendChild(astroItem);
        });


    })
    .catch((error) => console.error("Error fetching weather data:", error));
}
