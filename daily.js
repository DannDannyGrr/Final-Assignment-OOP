document.addEventListener("DOMContentLoaded", function() {
    // Load daily weather data for a default location on page load
    fetchDailyWeatherData("Kuala Lumpur");
});

function buttonClicked() {
    // Get city input from search bar
    var city = document.querySelector(".search-bar input[type='text']").value;
    // Fetch and display daily weather data for the specified city
    fetchDailyWeatherData(city);
}

function fetchDailyWeatherData(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}&days=7`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        // Update location display
        document.getElementById("demo1").textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById("demo2").src = "https:" + data.current.condition.icon;

        const dailyWeatherContainer = document.getElementById("daily-weather");
        dailyWeatherContainer.innerHTML = ""; // Clear previous weather data

        // Loop through the daily forecast data
        data.forecast.forecastday.forEach((day) => {
            const dailyCard = document.createElement("div");
            dailyCard.classList.add("daily-weather-card");

            dailyCard.innerHTML = `
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" style="width: 50px; height: 50px;">
                <h3>${new Date(day.date).toLocaleDateString()}</h3>
                <div class="temperature">${day.day.avgtemp_c}°C</div>
                <div class="description">${day.day.condition.text}</div>
                <p><strong>Max:</strong> ${day.day.maxtemp_c}°C | <strong>Min:</strong> ${day.day.mintemp_c}°C</p>
                <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
                <p><strong>Wind:</strong> ${day.day.maxwind_kph} kph</p>
            `;

            dailyWeatherContainer.appendChild(dailyCard);
        });
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}
