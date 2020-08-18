//CSS Effects

$(".showcard").mouseover(function(){
  $(this).css({"background-color": "rgba(26,166,183,0.25)"});
});

$(".showcard").mouseleave(function(){
  $(this).css({"background-color": "#EBECF0"});
});

//Code Adapted from https://www.youtube.com/watch?v=uI18xGocVnw
$(".readmore-btn").on('click', function (){
    $(this).parent().toggleClass("showContent");
    //Shorthand if Statement
    var replaceText = $(this).parent().hasClass("showContent") ? "Read Less ▲" : "Read More ▼";
    $(this).text(replaceText);

});

//OpenWeatherMap API Connection

//Code adapted from Tutorial @ https://bithacker.dev/fetch-weather-openweathermap-api-javascript & https://openweathermap.org/api/one-call-api#list
function weatherBalloon( lat, lon ) {
    var key = '1ff96bbb948a7c7b5371e9abe2d4b304';
    var url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&exclude=minutely,hourly&appid='+ key;
    fetch(url)  
    .then(function(resp) { return resp.json(); }) // Convert data to json
    .then(function(data) {
        drawWeather(data); // Call drawWeather
	})
    .catch(function() {
    console.log('Fail');
    });
}

function drawWeather( d ) {
    var i;
    for (i = 0; i < 5; i++){
        var celcius = Math.round(parseFloat(d.daily[i].temp.day)-273.15);
        var unixTimestamp = d.daily[i].dt;
        var milliseconds = unixTimestamp * 1000;
        var dateObject = new Date(milliseconds);
        var date = dateObject.toLocaleString('En-US', {weekday: 'long'});
        document.getElementById('description_' + [i]).innerHTML = d.daily[i].weather[0].description;
        document.getElementById('temp_' + [i]).innerHTML = celcius + '&deg;';
        document.getElementById('date_' + [i]).innerHTML = date;
        var imgsrc = ('http://openweathermap.org/img/wn/' + d.daily[i].weather[0].icon + '@2x.png');
        document.getElementById('weatherIcon_' + [i]).src=imgsrc;
    }
}

//Trip Advisor API Connection via RapidAPI

//Based on RapidAPI documentation for Trip Advisor https://rapidapi.com/apidojo/api/tripadvisor1?endpoint=apiendpoint_c0d6decf-e541-447d-bc87-2fa023cd96d6

//Restaurant Locations
function restaurantList (lat, lon) {
    fetch('https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=50&currency=USD&distance=15&lunit=km&lang=en_US&latitude=' + lat + '&longitude=' + lon, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
		"x-rapidapi-key": "2ed47672a1mshfe827335d43a73ep158491jsnc62f265ff059"
	}
    })

    .then(function(resp) { return resp.json(); }) // Convert data to json
    .then(function(data) {
        console.log(data);
        var restaurantIcon = "http://maps.google.com/mapfiles/kml/pal2/icon35.png";
        mapMarkers (data, restaurantIcon);
	})
    .catch(err => {
	console.log(err);
    });
}

//Hotel Locations
function hotelList (lat, lon) {
    fetch('https://tripadvisor1.p.rapidapi.com/hotels/list-by-latlng?lang=en_US&limit=30&currency=USD&&distance=15&latitude=' + lat + '&longitude=' + lon, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
		"x-rapidapi-key": "2ed47672a1mshfe827335d43a73ep158491jsnc62f265ff059"
	}
    })

    .then(function(resp) { return resp.json(); }) // Convert data to json
    .then(function(data) {
        console.log(data);
        var hotelIcon = "http://maps.google.com/mapfiles/kml/pal2/icon20.png";
        mapMarkers (data, hotelIcon);
	})
    .catch(err => {
	console.log(err);
    });
}

//Create Array of Markers with Data
function mapMarkers (d, Icon) {  
    var Markers = [];
    for (var i=0; i<d.data.length; i++) {
        if ((typeof d.data[i].name !== "undefined")&&(typeof d.data[i].latitude !== "undefined")){          
            Markers.push({
            name: d.data[i].name,
            lat: d.data[i].latitude,
            long: d.data[i].longitude,
            stars: d.data[i].rating,
            description: d.data[i].description,
            url: d.data[i].web_url,
            });  
        }
    }
    initMap(Markers, Icon);
}


//Create Map and Add Trip Advisor Markers
function initMap(markers, Icon) {
    var mapOptions = {
        center: new google.maps.LatLng(markers[0].lat, markers[0].long),
        zoom: 10,
        mapTypeId: 'satellite'
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Adjust Map Extent
    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i<markers.length; i++) {
            var latlng = new google.maps.LatLng(markers[i].lat, markers[i].long);
            bounds.extend(latlng);   
        }
    
    map.fitBounds(bounds);
    
    //Create and open InfoWindow.
    var infoWindow = new google.maps.InfoWindow();
    for (i = 0; i < markers.length; i++) {
        var data = markers[i];
        var myLatlng = new google.maps.LatLng(data.lat, data.long);
        var marker = new google.maps.Marker({
            position: myLatlng,
            icon: Icon,
            map: map,
            title: data.name
        });
 
        //Attach click event to the marker.
        (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                infoWindow.setContent(`<div style = 'width:150px;min-height:40px;font-weight:bold;text-align:left;'>Name: ` + data.name + `<br>Rating: ` + data.stars + `<br><a href="`+ data.url +`" target="_blank">Website</a></div>`);
                infoWindow.open(map, marker);
            });
        })(marker, data);
    }
}





