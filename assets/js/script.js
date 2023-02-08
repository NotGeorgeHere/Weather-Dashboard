/*
TODO

Generate the current weather in the top section of the screen

Generate the 5 day weather report by picking a time and generating the buttons as cards
Add when a city is searched for a button that is generated with this value being stored in local storage
Make the buttons clickable so that they can then direct you to the weathers link

*/

//Sets the APIKey as a global variable as it will be accessed throughout the project, set as CONST so it can't accidentally be changed
const APIKey = "e4182968795963e8549c174bdbd48448";


//Runs when search button is clicked
//Main feature that will happen when everything is run, will contain functions written for it
$('#search-button').on('click', function(event){
    //Makes sure it stays continuous instead of getting reset as a form
    event.preventDefault();
    //Will only run if there is something submitted into input box, edgecasing
    if ($('#search-input').val() !== ''){
        //Removes the current elements appended
        $('#today').children().remove();
        $('#forecast').children().remove();
        //Runs functions needed
        getCityDetails();
        getCurrentWeather();
    }
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
    //Gets query Url made for 5 day forecast and logs result for now
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"       
    }).then(function(response){
        console.log(response);
    })
}

//Function that uses a different API call to get the current weather
function getCurrentWeather(){
    var cityName = $('#search-input').val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        methood: "GET"
    }).then(function(response){
        console.log(response);

        //Creates header for current weather and sets it as the location and date
        var currentDate = moment().format("DD/MM/YYYY");
        var cityName = $('<h2>');
        cityName.attr("class", "currentForcastHeader");
        cityName.text(response.name + " (" + currentDate + ")");

        //Gets the icon and appends it to the cityName
        var icon = response.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
        var currentIcon = $("<img>").attr("src", iconUrl)
        cityName.append(currentIcon);

        //Creates text for current weather and will display temperature, wind and humidity 
        //Converts the Kelvin into Celcius
        var temp = response.main.temp - 273.15
        var tempDisplay = $('<p>');
        tempDisplay.attr("class", "currentForcastText temperature");
        tempDisplay.text("Temp: " + temp.toFixed(2));
        
        var windDisplay = $('<p>');
        windDisplay.attr("class", "currentForcastText wind");
        windDisplay.text("Wind: " + response.wind.speed + " m/s");

        var humidityDisplay = $('<p>');
        humidityDisplay.attr("class", "currentForcastText humidity");
        humidityDisplay.text("Humidity: " + response.main.humidity + "%");

        $('#today').append(cityName, tempDisplay, windDisplay, humidityDisplay);
    })
}

