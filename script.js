const API_KEY = 'CusSLoYr5g3zz9iPM53H1DZMac2Hw6IY'
let markers = []
let coords = {}
let coord = {}
options={
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}
const error = (err) => {
    alert("No se puede acceder a la geolocalización");
 }

 var map = tt.map({
    key: API_KEY,
    container: "map",
    zoom: 16,
});

map.addControl(new tt.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

// Configurar opciones para la caja de búsqueda
var searchOptions = {
    searchOptions: {
        key: API_KEY,
        language: "es-ES",
        limit: 5,
    },
    autocompleteOptions: {
        key: API_KEY,
        language: "es-ES",
    },
};

// Crear y agregar la caja de búsqueda al elemento con id "searchbox"
var ttSearchBox = new tt.plugins.SearchBox(tt.services, searchOptions);
var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
var searchDiv = document.getElementById("searchbox");
searchDiv.appendChild(searchBoxHTML);

ttSearchBox.on("tomtom.searchbox.resultselected",hadleResultSelected);

navigator.geolocation.getCurrentPosition(initGeolocation, error, options);


function initGeolocation(position) {
    coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
    coord = new tt.LngLat(coords.longitude,coords.latitude)
    map.setCenter(coord)
}

function hadleResultSelected(event) {
    let result = event.data.result
    console.log(result)
    
    markers.forEach(function(marker) {
        marker.remove();
    });

    if(result.type === "Geography" || result.type === "POI"){
       let coord = result.position
       var newMarker = new tt.Marker()
       .setLngLat([coord.lng,coord.lat])
       .addTo(map);
       map.setCenter(coord)
       markers.push(newMarker)
    }else{
        let query = result.value
        tt.services.fuzzySearch({
            key: API_KEY,
            query: query,
            countrySet: "CO",
            language: "es-ES",
            limit: 100,
        })
        .then(handleQueryResults);
    } 
}

function handleQueryResults(result) {
    markers.forEach(function(marker) {
        marker.remove();
    });
    result.results.forEach(function(geocodingResult) {
        let query_coord = geocodingResult.position
        var newMarker = new tt.Marker()
        .setLngLat([query_coord.lng,query_coord.lat])
        .addTo(map);
        markers.push(newMarker)
    });
    map.setCenter(coord)
    map.setZoom(14)
    var user_marker = new tt.Marker({color: "red"})
    .setLngLat([coords.longitude,coords.latitude])
    .addTo(map);
}