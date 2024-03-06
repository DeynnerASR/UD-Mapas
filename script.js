const API_KEY = 'CusSLoYr5g3zz9iPM53H1DZMac2Hw6IY'
let markers = []
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
    let coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
    var coord = new tt.LngLat(coords.longitude,coords.latitude)
    map.setCenter(coord)
}

function hadleResultSelected(event) {
    let result = event.data.result
    
    markers.forEach(function(marker) {
        marker.remove();
    });

    if(result.type === "Geography"){
       let coord = result.position
       var newMarker = new tt.Marker()
       .setLngLat([coord.lng,coord.lat])
       .addTo(map);
       map.setCenter(coord)
       markers.push(newMarker)
    }
}