//Sets the APIKey as a global variable as it will be accessed throughout the project, set as CONST so it can't accidentally be changed
const APIKey = "e4182968795963e8549c174bdbd48448";


//Runs when search button is clicked
//Main feature that will happen when everything is run, will contain functions written for it
$('#search-button').on('click', function(event){
    //Makes sure it stays continuous instead of getting reset as a form
    event.preventDefault();
    getCityDetails()
})

function getCityDetails(){
    //Creates the queryURL to be searched for
    var cityName = $('#search-input').val();
    var queryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;
    //Runs the search on the API using the queryURL and then once thats been recieved will put that into an object response
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        var longitude = response[0].lon;
        var latitude = response[0].lat;
        getFiveDayForecast(longitude, latitude);
    })
}

function getFiveDayForecast(longitude, latitude){
    var queryURL = "api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"       
    }).then(function(response){
        console.log(response);
    })
}