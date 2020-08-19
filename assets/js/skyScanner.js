//SkyScanner Api Connection

//Based on RapidAPI documentation for Sky Scanner https://rapidapi.com/skyscanner/api/skyscanner-flight-search

//Fetchs data between two city id from the Skyscanner api and calls the drawFlights function to parse data
function skyScanner (origin, destination) {
    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/EUR/en-US/"+ origin + "/" + destination + "/anytime", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "2ed47672a1mshfe827335d43a73ep158491jsnc62f265ff059"
        }
    })

    .then(function(resp) { return resp.json(); }) // Convert data to json
    .then(function(data) {
        drawFlights(data);
	})
    .catch(err => {
	console.log(err);
    });
}

//Updates html on Travel Info page to show results for the first 5 flights retrieved by the Scanner API
function drawFlights( d ) {
    var i;
    //Loops through each quote and updates relevent HTML elements. 
    for (i = 0; i < 5; i++){
        var fullDate = d.Quotes[i].OutboundLeg.DepartureDate;
        var shortDate = fullDate.substring(0, 10);
        document.getElementById('date__' + [i]).innerHTML = shortDate;
        document.getElementById('price_' + [i]).innerHTML = d.Quotes[i].MinPrice;
        document.getElementById('carrier_' + [i]).innerHTML = d.Carriers[0].Name;
    }
}