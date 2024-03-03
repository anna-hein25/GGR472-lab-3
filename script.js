mapboxgl.accessToken = 'pk.eyJ1IjoiYW5uYS1oZWluMSIsImEiOiJjbHMyOWllNW8wa2J3MmpsZHM1eHk0b3oxIn0.9g1JErkZTD4sg70-swx-YQ'; // public access token

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/anna-hein1/clsezuixj037101qs7pnn05r8',
    // This mapbox style has two vector layers added to it; one is the bike paths in Boston and the other is bike paths in Cambridge. 
    // Both were accessed through the respective cities open data portal website.
    center: [-71.05, 42.36], // I used the coordinates of Boston
    zoom: 10.5,
    maxBounds: [
        [-180, 30],
        [-25, 84]  
    ],
});

// The following code creates a search button on the top-left side of the web page
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "us" // Limit to US locations only
    })
);
// This code adds the zoom and rotation controls to the top left of the map
map.addControl(new mapboxgl.NavigationControl());

// The following block of code adds Blue Bike (the equivalent of Bike Share Toronto) stations in and around the City of Boston as vector layer
map.on('load', () => {
    map.addSource('bluebikestation-data', {
        'type': 'vector',
        'url': 'mapbox://anna-hein1.clt7vkml3121e1mqx3abd1ub8-8gek7' // this is the link to my tileset containing Blue Bike data
    });
    map.addLayer({
        'id': 'bluebikestation',
        'type': 'circle',
        'source': 'bluebikestation-data',
        'paint': {
            'circle-color': 'orange',
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-radius': [
                    'interpolate', //INTERPOLATE expression produces continuous results by interpolating between value pairs
                    ['linear'], //linear interpolation between stops but could be exponential ['exponential', base] where base controls rate at which output increases
                    ['zoom'], //ZOOM expression changes appearance with zoom level
                    7, 1, // when zoom level is 7 or less, circle radius will be 1px
                    9, 6 // when zoom level is 9 or greater, circle radius will be 6px
                ]
        },
        'source-layer': 'GGR472-lab3-blue-bike-stations-2' // this is the name of the data in the tileset
    });
});

map.on('mouseenter', 'bluebikestation', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'bluebikestation', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
});

map.on('click', 'bluebikestation', (e) => {
    // Ensure that a feature is actually clicked
    if (!e.features.length) {
        return;
    }

    // Get properties of the clicked feature
    const properties = e.features[0].properties;

    // When you click the point the Blue Bike station name and number of bike docks will be displayed
    const popupContent = `
        <b>Station Name:</b> ${properties.Name}<br>
        <b>Capacity:</b> ${properties.Total_docks}<br>
    `;

    // Create a popup with the HTML content
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
});
