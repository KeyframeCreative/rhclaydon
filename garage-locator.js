// Garage locations
const garages = [
    { name: "Garage 1", town: "Cambridge", lat: 52.2053, lon: 0.1218, postcode: "CB1 1AA", url: "https://example.com/cambridge" },
    { name: "Garage 2", town: "Ipswich", lat: 52.0592, lon: 1.1557, postcode: "IP1 1AA", url: "https://example.com/ipswich" },
    { name: "Garage 3", town: "Leeds", lat: 53.8008, lon: -1.5491, postcode: "LS1 1AA", url: "https://example.com/leeds" },
    { name: "Garage 4", town: "York", lat: 53.9590, lon: -1.0815, postcode: "YO1 7AA", url: "https://example.com/york" },
    { name: "Garage 5", town: "London", lat: 51.5074, lon: -0.1278, postcode: "WC2N 5DU", url: "https://example.com/london" }
];

// Initialize the map
const map = L.map('map').setView([54.5, -3.5], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom icon for markers
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Add garage markers to the map
const markers = garages.map(garage => {
    return L.marker([garage.lat, garage.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${garage.name}</b><br>${garage.town}<br>${garage.postcode}<br>
            <a href="${garage.url}" target="_blank">Visit Website</a><br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${garage.lat},${garage.lon}" target="_blank">Get Directions</a>`);
});

// Function to find the nearest garage
function findNearestGarage() {
    const userPostcode = document.getElementById("postcode").value;

    // Nominatim API for geocoding
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(userPostcode)}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const userLat = parseFloat(data[0].lat);
                const userLon = parseFloat(data[0].lon);
                let nearestGarage = null;
                let shortestDistance = Infinity;

                garages.forEach((garage, index) => {
                    const distance = calculateDistance(userLat, userLon, garage.lat, garage.lon);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestGarage = garage;

                        // Close all popups
                        markers.forEach(marker => marker.closePopup());

                        // Open popup for the nearest garage
                        markers[index].openPopup();
                    }
                });

                if (nearestGarage) {
                    document.getElementById("result").textContent = `The nearest garage is ${nearestGarage.name} in ${nearestGarage.town} (${nearestGarage.postcode}), which is approximately ${shortestDistance.toFixed(2)} km away.`;
                    map.setView([nearestGarage.lat, nearestGarage.lon], 14);
                } else {
                    document.getElementById("result").textContent = "No garages found.";
                }
            } else {
                document.getElementById("result").textContent = "Invalid postcode. Please try again.";
            }
        })
        .catch(error => console.error('Error fetching geocode data:', error));
}

// Function to calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
