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


//Code adapted from Tutorial @ https://bithacker.dev/fetch-weather-openweathermap-api-javascript
function weatherBalloon( lat, lon ) {
  var key = '1ff96bbb948a7c7b5371e9abe2d4b304';
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&exclude=minutely&appid='+ key)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    console.log(data);
  })
  .catch(function() {
    // catch any errors
  });
}

window.onload = function() {
    this.weatherBalloon ( -50.941961, -73.406960 );
};