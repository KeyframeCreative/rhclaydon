// Updated Garage locations
const garages = [
    { 
        name: "Mudslingerz Tyres", 
        town: "Northwich", 
        lat: 53.262, 
        lon: -2.483,
        postcode: "CW9 6GG", 
        url: "https://www.mudslingerztyres.co.uk", 
        email: "info@mudslingerztyres.co.uk", 
        phone: "01565 734277", 
    },
    { 
        name: "Beartown Tyres", 
        town: "Congleton", 
        lat: 53.161, 
        lon: -2.216,
        postcode: "CW12 2AQ", 
        url: "https://www.beartowntyres.com", 
        email: "beartowntyres@outlook.com", 
        phone: "07973 271706", 
    }
];

// Initialize the map
const map = L.map('map').setView([53.211, -2.349], 9);
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
        .bindPopup(`
            <b>${garage.name}</b><br>
            ${garage.town}<br>
            ${garage.postcode}<br>
            <a href="${garage.url}" target="_blank">Visit Website</a><br>
            Email: <a href="mailto:${garage.email}">${garage.email}</a><br>
            Phone: <a href="tel:${garage.phone}">${garage.phone}</a><br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${garage.lat},${garage.lon}" target="_blank">Get Directions</a>
        `);
});

// Function to find the nearest garage
function findNearestGarage() {
    const userPostcode = document.getElementById("postcode").value;

    // Nominatim API for geocoding
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(userPostcode)}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Geocoding API Response:", data);
            if (data.length > 0) {
                const userLat = parseFloat(data[0].lat);
                const userLon = parseFloat(data[0].lon);
                console.log("User's Coordinates:", userLat, userLon);

                let nearestGarage = null;
                let shortestDistance = Infinity;

                garages.forEach((garage, index) => {
                    const distance = calculateDistance(userLat, userLon, garage.lat, garage.lon);
                    console.log(`Distance to ${garage.name}:`, distance);
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
                    document.getElementById("result").textContent = `The nearest garage is ${nearestGarage.name} in ${nearestGarage.town} (${nearestGarage.postcode}), approximately ${shortestDistance.toFixed(2)} km away.`;
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
