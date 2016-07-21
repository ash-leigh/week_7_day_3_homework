
window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
//
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        }
    }
    handleClick();
    request.send();

};

function handleClick(){
  var button = document.getElementById('find-button');
  button.onclick = function(){
    var location = new GeoLocator(map);
    location.setCenter();
  }
}
//Created map constructor - function that takes in 2 arguements. The position and the zoom value
var Map = function(latLng, zoom){
//give googleMap property to Map which creates a map object provided through the google map api
  this.googleMap = new google.maps.Map(document.getElementById('map'), {
//it takes two arguements - the location that the map is to be in the HTML (found by calling a getElementById), and the location and zoom values that are passed in when we invoke the overarching Map contructor/ function
    center: latLng,
    zoom: zoom
})
//give addMarker property to Map that adds a marker to the point in the map that matches the coordinates
  this.addMarker = function(latLng, title){
    var marker = new google.maps.Marker({
//Marker object is again provided by the google maps api - we assign our own variable to it here. It has three properties - position(passed in when addMarker property function is invoked on a map), title(passed in when addMarker property function is invoked on a map) and which map you would like the market to be applied to - we can use the this.googleMap property we created as part of this constructor.  THIS in these properties usually refer to the whole map object that was created using the constructor. However .bind may need to be used if a function takes you out of map objects scope. - if the function goes into another object this will be the case???
      position: latLng,
      map: this.googleMap,
      title: title
  })
    return marker;
//provides marker to be used later
}
    this.addInfoWindow = function(latLng, title){
//addInfoWindow property for map object - takes in coordinates and a title
        var marker = this.addMarker(latLng, title);
//creates instance of a marker for this map object
        marker.addListener('click', function(){
//addListener is a function provided by the google maps api for marker objects - here we have passed in click as the event and created our own function as the callback
            var infoWindow = new google.maps.InfoWindow({
//in our callback we create an instance of an InfoWindow which is another object provided by the google maps api. We assign it to our own variable. It takes an object as an arguement. We have assigned its content property to the title that we passed in on our addInfoWindow function on each map.
            content: this.title
        })
            infoWindow.open(this.map, marker)
//.open is built in functionality from the google map api - it requires the map and the marker that we want to asign our pop out to be assigned to. We can use this.map as we are within the instance of the map object anf we assigned the variable marker eariler so we can pass this in.
        })
    }
}

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
}

var getLatLng = function(country){
    var latLng = {lat: country.latlng[0], lng: country.latlng[1]};
    return latLng;
}

var GeoLocator = function(map, countries){
  // this.map = map;
  this.setCenter = function(){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = {lat: Math.floor(position.coords.latitude), lng: Math.floor(position.coords.longitude)};
      console.log(pos);
      // this.map.googleMap.panTo(pos);
    }.bind(this))
  }
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}

var updateDisplay = function (country) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = country.name;
    tags[1].innerText = country.population;
    tags[2].innerText = country.capital;
    var map = new Map(getLatLng(country), 5);
    var content = '<p><h2>' + country.name + '</h2></p>' + '<p>' + 'Population: ' + country.population + '</p>' + '<p>' + 'Capital city: ' + country.capital + '</p>';
    map.addInfoWindow(getLatLng(country), content);
    // map.bindClick(content);
}
