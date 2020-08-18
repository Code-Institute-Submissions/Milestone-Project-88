



fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/EUR/en-US/BUEA-sky/FTEA-sky/anytime", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "2ed47672a1mshfe827335d43a73ep158491jsnc62f265ff059"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});


function hotelList (lat, lon) {
    fetch('https://tripadvisor1.p.rapidapi.com/hotels/list-by-latlng?lang=en_US&limit=30&currency=USD&&distance=15&latitude=' + lat + '&longitude=' + lon, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
		"x-rapidapi-key": "2ed47672a1mshfe827335d43a73ep158491jsnc62f265ff059"
	}
    })

    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        console.log(data);
        var hotelIcon = "http://maps.google.com/mapfiles/kml/pal2/icon20.png"
        mapMarkers (data, hotelIcon);
	})
    .catch(err => {
	console.log(err);
    });
}

//Create Array of Markers with Data
function mapMarkers (d, Icon) {  
    var Markers = [];
    var i;
    for (var i=0; i<d.data.length; i++) {
        if ((typeof d.data[i].name !== "undefined")&&(typeof d.data[i].latitude !== "undefined")){          
            Markers.push({
            name: d.data[i].name,
            lat: d.data[i].latitude,
            long: d.data[i].longitude,
            stars: d.data[i].rating,
            description: d.data[i].description,
            url: d.data[i].web_url,
            })  
        }
    }
    console.log(Markers)
    initMap(Markers, Icon);
}