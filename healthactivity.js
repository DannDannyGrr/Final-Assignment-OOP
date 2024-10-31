document.addEventListener("DOMContentLoaded", function() {
    // Load weather data for a default location on page load
    fetchWeatherData("Kuala Lumpur");

    // Add event listener for the button to fetch weather data
    document.getElementById("fetchWeatherButton").addEventListener("click", buttonClicked);
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
        
        document.getElementById("demo1").textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById("demo2").src = "https:" + data.current.condition.icon;

        // Get the temperature
        const temperature = data.current.temp_c;

        // Show all activities and indicate suitability
        showAllActivities(temperature);
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}

function showAllActivities(temperature) {
    const activitiesContainer = document.getElementById("activities-container");
    activitiesContainer.innerHTML = ''; // Clear existing activities

    const activities = [
        { title: "Yoga", description: "A relaxing activity suitable for all weather.", minTemp: null, maxTemp: 35, equipment: ["Yoga mat", "Water bottle"] },
        { title: "Running", description: "Best on sunny days.", minTemp: 10, maxTemp: 25, equipment: ["Running shoes", "Comfortable clothes"] },
        { title: "Cycling", description: "Enjoyable in mild weather.", minTemp: 5, maxTemp: 30, equipment: ["Bicycle", "Helmet"] },
        { title: "Swimming", description: "Beat the heat with a refreshing dip.", minTemp: 20, maxTemp: 40, equipment: ["Swimsuit", "Towel"] },
        { title: "Home Cooking", description: "Try a new recipe or bake something special.", minTemp: null, maxTemp: 30, equipment: ["Ingredients", "Cookware"] },
        { title: "Reading", description: "Curl up with a good book.", minTemp: null, maxTemp: 35, equipment: ["Book", "Cozy blanket"] },
        { title: "Light Jogging", description: "Enjoy the cool breeze.", minTemp: 10, maxTemp: 20, equipment: ["Jogging shoes", "Comfortable clothes"] },
        { title: "Outdoor Picnic", description: "Perfect for a sunny day!", minTemp: 10, maxTemp: 30, equipment: ["Picnic blanket", "Food", "Drinks"] },
        { title: "Gardening", description: "Get your hands dirty in the fresh air.", minTemp: 5, maxTemp: 30, equipment: ["Gardening tools", "Seeds"] },
    ];

    // Check activity suitability based on the current temperature
    activities.forEach((activity, index) => {
        const isSuitable = (activity.minTemp === null || temperature >= activity.minTemp) &&
                           (activity.maxTemp === null || temperature <= activity.maxTemp);
        
        // Create an activity item
        const activityItem = document.createElement("div");
        activityItem.classList.add("activity-item", isSuitable ? "suitable" : "not-suitable");
        activityItem.innerHTML = 
            `<div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-status ${isSuitable ? '' : 'not-suitable'}">
                ${isSuitable ? "Suitable" : "Not Suitable"}
            </div>`;
        activityItem.addEventListener('click', () => openModal(activity, index)); // Open modal on click
        activitiesContainer.appendChild(activityItem);
    });
}

let addedActivities = []; // To store added activities

function openModal(activity, index) {
    const modal = document.getElementById("add-activity-modal");
    const equipmentCheckboxes = document.getElementById("equipment-checkboxes");
    equipmentCheckboxes.innerHTML = ''; // Clear previous checkboxes

    // Create checkboxes for the activity's equipment
    activity.equipment.forEach(item => {
        const checkboxDiv = document.createElement("div");
        checkboxDiv.innerHTML = `<input type="checkbox" id="${item}" value="${item}"> ${item}`;
        equipmentCheckboxes.appendChild(checkboxDiv);
    });

    modal.style.display = "block"; // Show the modal
    document.getElementById("btnCreate").onclick = () => addActivity(activity);
}

function addActivity(activity) {
    const selectedEquipment = Array.from(document.querySelectorAll("#equipment-checkboxes input[type='checkbox']:checked"))
                                    .map(checkbox => checkbox.value);

    // Add activity details along with selected equipment to the addedActivities array
    addedActivities.push({ title: activity.title, equipment: selectedEquipment });

    // Display the added activities
    displayAddedActivities();
    
    // Close the modal
    closeModal();
}

function displayAddedActivities() {
    const addedActivitiesContainer = document.getElementById("added-activities");
    addedActivitiesContainer.innerHTML = ''; // Clear previous added activities

    addedActivities.forEach((activity, index) => {
        const activityBox = document.createElement("div");
        activityBox.classList.add("activity-box");
        activityBox.innerHTML = 
            `<h3>${activity.title}</h3>
            <p>Equipment: ${activity.equipment.join(', ') || 'None'}</p>
            <button onclick="openUpdateModal(${index})">Update</button>
            <button onclick="deleteActivity(${index})">Delete</button>`; 
        addedActivitiesContainer.appendChild(activityBox);
    });

    // Show the added items container
    document.getElementById("added-items-container").style.display = 'block';
}

function closeModal() {
    document.getElementById("add-activity-modal").style.display = "none";
}

// Attach click event to close button
document.getElementById("closeModal").addEventListener("click", closeModal);

// Optionally, you can also add a click event to close the modal when clicking outside the modal
window.onclick = function(event) {
    const modal = document.getElementById("add-activity-modal");
    if (event.target === modal) {
        closeModal();
    }
}

function toggleAddedItems() {
    const addedItemsContainer = document.getElementById("added-items-container");
    addedItemsContainer.style.display = addedItemsContainer.style.display === 'none' ? 'block' : 'none';
}

function deleteActivity(index) {
    // Remove the activity from the array
    addedActivities.splice(index, 1);
    displayAddedActivities(); // Refresh the display
}

function openUpdateModal(index) {
    const activity = addedActivities[index]; // Get the selected activity
    const modal = document.getElementById("add-activity-modal");
    const equipmentCheckboxes = document.getElementById("equipment-checkboxes");
    equipmentCheckboxes.innerHTML = ''; // Clear previous checkboxes

    // Define equipment options specific to each activity
    const equipmentOptions = {
        "Yoga": ["Yoga mat", "Water bottle"],
        "Running": ["Running shoes", "Comfortable clothes"],
        "Cycling": ["Bicycle", "Helmet"],
        "Swimming": ["Swimsuit", "Towel"],
        "Home Cooking": ["Ingredients", "Cookware"],
        "Reading": ["Book", "Cozy blanket"],
        "Light Jogging": ["Jogging shoes", "Comfortable clothes"],
        "Outdoor Picnic": ["Outdoor picnic blanket", "Food", "Drinks"],
        "Gardening": ["Gardening tools", "Seeds"]
    };

    // Create checkboxes for the activity's specific equipment
    const specificEquipment = equipmentOptions[activity.title] || [];
    specificEquipment.forEach(item => {
        const checkboxDiv = document.createElement("div");
        checkboxDiv.innerHTML = `<input type="checkbox" id="${item}" value="${item}">${item}`;
        // Check the checkbox if it's already in the activity's equipment
        if (activity.equipment.includes(item)) {
            checkboxDiv.firstChild.checked = true; // Check the checkbox
        }
        equipmentCheckboxes.appendChild(checkboxDiv);
    });

    // Show the modal
    modal.style.display = "block"; 
    document.getElementById("btnCreate").onclick = () => updateActivity(index);
}

function updateActivity(index) {
    const selectedEquipment = Array.from(document.querySelectorAll("#equipment-checkboxes input[type='checkbox']:checked"))
                                    .map(checkbox => checkbox.value);

    // Update the activity's equipment in the array
    addedActivities[index].equipment = selectedEquipment;

    // Refresh the display
    displayAddedActivities();
    
    // Close the modal
    closeModal();
}
