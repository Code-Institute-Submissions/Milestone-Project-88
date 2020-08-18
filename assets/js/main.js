//CSS Effects

//Updates background colour on mouse hover event
$(".showcard").mouseover(function(){
  $(this).css({"background-color": "rgba(26,166,183,0.25)"});
});

$(".showcard").mouseleave(function(){
  $(this).css({"background-color": "#EBECF0"});
});

//Jquery function for read more/less buttons used throughout website
//Code Adapted from https://www.youtube.com/watch?v=uI18xGocVnw
$(".readmore-btn").on('click', function (){
    $(this).parent().toggleClass("showContent");
    //Shorthand if Statement
    var replaceText = $(this).parent().hasClass("showContent") ? "Read Less ▲" : "Read More ▼";
    $(this).text(replaceText);

});

//OpenWeatherMap API Connection

//Code adapted from Tutorial @ https://bithacker.dev/fetch-weather-openweathermap-api-javascript & https://openweathermap.org/api/one-call-api#list
//Gets daily weather data for a given lat, long from open weather map api and calls draw weather function which adds it to HTML
function weatherBalloon( lat, lon ) {
    var key = '2f9c7bcaede88b0f0b960054ae50364a';
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

//Formats required api data and adds to HTML elements based on IDs
function drawWeather( d ) {
    var i;
    //loops through weather data for up to 5 days
    for (i = 0; i < 5; i++){
        //Convert from kelvin to Celsius
        var celcius = Math.round(parseFloat(d.daily[i].temp.day)-273.15);
        //covert from unix time stamp to day, date format
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

//Restaurant Locations - gets restaurents within given distance for a lat, long co-ordinate and calls mapping function to add to google maps
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
        var restaurantIcon = "http://maps.google.com/mapfiles/kml/pal2/icon35.png";//for map markers
        mapMarkers (data, restaurantIcon); //mapping function
	})
    .catch(err => {
	console.log(err);
    });
}

//Hotel Locations - gets hotels within given distance for a lat, long co-ordinate and calls mapping function to add to google maps
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
        var hotelIcon = "http://maps.google.com/mapfiles/kml/pal2/icon20.png";//for map markers
        mapMarkers (data, hotelIcon);//mapping function
	})
    .catch(err => {
	console.log(err);
    });
}

//Create Array of Markers with Data
function mapMarkers (d, Icon) {
    //loop through data and extracts relevent data for map popup window creating array of arrays  
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
    //call the initiate google maps function also passing the image for marker icon
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

    //Adjust Map Extent to fit the trip advisor hotels or restaurants
    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i<markers.length; i++) {
            var latlng = new google.maps.LatLng(markers[i].lat, markers[i].long);
            bounds.extend(latlng);   
        }
    
    map.fitBounds(bounds);
    
    //Create and open InfoWindow
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
                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow and pass the Trip Advisor data (name, rating, trip advisor webpage)
                infoWindow.setContent(`<div style = 'width:150px;min-height:40px;font-weight:bold;text-align:left;'>Name: ` + data.name + `<br>Rating: ` + data.stars + `<br><a href="`+ data.url +`" target="_blank">Website</a></div>`);
                infoWindow.open(map, marker);
            });
        })(marker, data);
    }
}

//Form Validation

//Check inputs are provided, names contain only letters and email address is valid, and minimum lengths of input are met then calls emailjs send function.
//Code adapted from here https://www.tutorialspoint.com/javascript/javascript_form_validations.htm
function validate() {
    var emailID = document.myForm.email.value;
    atpos = emailID.indexOf("@");
    dotpos = emailID.lastIndexOf(".");
    var firstname = document.myForm.firstname.value;
    var lastname = document.myForm.lastname.value;
    var query = document.myForm.query.value;
         
    if (atpos < 1 || ( dotpos - atpos < 2 )) {
        alert("Please enter correct email ID")
        document.myForm.Email.focus() ;
        return false;
    }

    if( firstname == "") {
        alert( "Please provide your first name!" );
        document.myForm.firstname.focus() ;
        return false;
    }

    if( firstname.length <= 1) {
        alert( "Sorry that first name is too short, please provide your first name!" );
        document.myForm.firstname.focus() ;
        return false;
    }

    if (!/[^a-zA-Z]/.test(firstname) == false) {
        alert( "Sorry, numbers are not accepted in Names!" );
        document.myForm.firstname.focus() ;
        return false;

    }

    if( lastname == "" ) {
        alert( "Please provide your surname!" );
        document.myForm.lastname.focus() ;
        return false;
    }

    if( lastname.length <= 1) {
        alert( "Sorry that last name is too short, please provide your last name!" );
        document.myForm.lastname.focus() ;
        return false;
    }

    if (!/[^a-zA-Z]/.test(lastname) == false) {
        alert( "Sorry, numbers are not accepted in Names!" );
        document.myForm.lastname.focus() ;
        return false;

    }

    if( query == "" ) {
        alert( "Please add a message!" );
        document.myForm.query.focus() ;
        return false;
    }

    if( query.length <= 5 ) {
        alert( "Please add a longer message!" );
        document.myForm.query.focus() ;
        return false;
    }
    
    return( sendMail(this) );
}



