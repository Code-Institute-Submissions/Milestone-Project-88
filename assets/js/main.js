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
    var replaceText = $(this).parent().hasClass("showContent") ? "Read Less ▲" : "Read More ▼"
    $(this).text(replaceText);

})

//OpenWeatherMap API Connection

//Code adapted from Tutorial @ https://bithacker.dev/fetch-weather-openweathermap-api-javascript & https://openweathermap.org/api/one-call-api#list
function weatherBalloon( lat, lon ) {
    var key = '1ff96bbb948a7c7b5371e9abe2d4b304';
    var url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&exclude=minutely,hourly&appid='+ key;
    fetch(url)  
    .then(function(resp) { return resp.json() }) // Convert data to json
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
        var fahrenheit = Math.round(((parseFloat(d.daily[i].temp.day)-273.15)*1.8)+32);
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
function restaurantList (LocationID) {
    fetch("https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&lunit=km&restaurant_tagcategory=10591&limit=30&currency=USD&lang=en_US&location_id=" + LocationID, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
		"x-rapidapi-key": "2ed47672a1mshfe827335d43a73ep158491jsnc62f265ff059"
	}
    })

    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        console.log(data);
        createRestaurentMarket(data);
	})
    .catch(err => {
	console.log(err);
    });
}

function createRestaurentMarket (d) {
    var i;
    var restaurantMarkers = [];
    for (var i=0; i<d.data.length; i++) {
        if ((typeof d.data[i].name !== "undefined")||(typeof d.data[i].latitude !== "undefined")){
        restaurantMarkers[i] = {
        name: d.data[i].name,
        lat: d.data[i].latitude,
        long: d.data[i].longitude,
        stars: d.data[i].rating,
        description: d.data[i].description,
        urlRestaurant: d.data[i].web_url,
        }
        }
    }
    console.log(restaurantMarkers)
}

window.onload = function() {
  this.restaurantList(670171);
}