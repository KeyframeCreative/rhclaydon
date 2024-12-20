
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
        contact: "Margaret Taylor" 
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
        contact: "Julian Wright" 
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
            Contact: ${garage.contact}<br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${garage.lat},${garage.lon}" target="_blank">Get Directions</a>
        `);
});
