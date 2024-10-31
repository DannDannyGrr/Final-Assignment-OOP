document.addEventListener("DOMContentLoaded", function() {
    // Load hourly weather data for a default location on page load
    fetchHourlyWeatherData("Kuala Lumpur");
});

function buttonClicked() {
    // Get city input from search bar
    var city = document.querySelector(".search-bar input[type='text']").value;
    // Fetch and display hourly weather data for the specified city
    fetchHourlyWeatherData(city);
}

function fetchHourlyWeatherData(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}&hours=24`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        // Update location display
        document.getElementById("demo1").textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById("demo2").src = "https:" + data.current.condition.icon;

        const hourlyWeatherContainer = document.getElementById("hourly-weather");
        hourlyWeatherContainer.innerHTML = ""; // Clear previous weather data

        // Loop through the hourly forecast data
        data.forecast.forecastday[0].hour.forEach((hour) => {
            const hourlyCard = document.createElement("div");
            hourlyCard.classList.add("hourly-weather-card");

            // Calculate "feels like" temperature
            const feelsLike = hour.feelslike_c;

            // Determine wind direction based on degrees
            const windDirection = getWindDirection(hour.wind_degree);

            hourlyCard.innerHTML = `
                <h3>${new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
                <div class="temperature">${hour.temp_c}°C</div>
                <div class="description">${hour.condition.text}</div>
                <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" style="width: 50px; height: 50px;">
                <p><strong>Feels Like:</strong> ${feelsLike}°C</p>
                <p><strong>Humidity:</strong> ${hour.humidity}%</p>
                <p><strong>Wind:</strong> ${hour.wind_kph} kph <br> <strong>Direction:</strong> ${windDirection}</p>
            `;

            hourlyWeatherContainer.appendChild(hourlyCard);
        });
    })
    .catch((error) => {
        console.error("Error fetching hourly weather data:", error);
    });
}

// Function to convert wind degree to direction
function getWindDirection(degree) {
    const directions = [
        { name: "N", min: 348.75, max: 11.25 },
        { name: "NNE", min: 11.25, max: 33.75 },
        { name: "NE", min: 33.75, max: 56.25 },
        { name: "ENE", min: 56.25, max: 78.75 },
        { name: "E", min: 78.75, max: 101.25 },
        { name: "ESE", min: 101.25, max: 123.75 },
        { name: "SE", min: 123.75, max: 146.25 },
        { name: "SSE", min: 146.25, max: 168.75 },
        { name: "S", min: 168.75, max: 191.25 },
        { name: "SSW", min: 191.25, max: 213.75 },
        { name: "SW", min: 213.75, max: 236.25 },
        { name: "WSW", min: 236.25, max: 258.75 },
        { name: "W", min: 258.75, max: 281.25 },
        { name: "WNW", min: 281.25, max: 303.75 },
        { name: "NW", min: 303.75, max: 326.25 },
        { name: "NNW", min: 326.25, max: 348.75 },
    ];

    for (let direction of directions) {
        if (degree >= direction.min && degree < direction.max) {
            return direction.name;
        }
    }
    return "N"; // Default to North if no direction found
}
