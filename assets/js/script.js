/*
TODO

Generate the current weather in the top section of the screen

Generate the 5 day weather report by picking a time and generating the buttons as cards
Add when a city is searched for a button that is generated with this value being stored in local storage
Make the buttons clickable so that they can then direct you to the weathers link

*/

//Sets the APIKey as a global variable as it will be accessed throughout the project, set as CONST so it can't accidentally be changed
const APIKey = "e4182968795963e8549c174bdbd48448";

//Renders the search list
renderSearches()

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
        $("#history").children().remove();
        //Runs functions needed
        getCityDetails();
        getCurrentWeather();
        saveSearches();
        renderSearches();
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
        //Loops through the whole 5 day forecast
        for (var i = 0; i < response.list.length; i++){
            //I've chosen 3pm as my designated daily forecast time so I look through the whole array to find each array element that includes 3pm
            if (response.list[i].dt_txt.includes("15:00:00")){
                //Generates a bootstrap card that is appended to the forecast section
                var card = $("<div>").attr("class", "card");
                card.attr("style", "width: 200px;");
                var cardBody = $("<div>").attr("class", "card-body futureForecastStyling");
                card.append(cardBody);
                $("#forecast").append(card);
                
                //Generates a header using jquery to get the date for the future forecast
                var cardHead = $("<h5>");
                cardHead.attr("class futureForecast futureHeader");
                //Uses a substring function to only return the date of dt_txt
                cardHead.text(response.list[i].dt_txt.substr(0,10))

                //Generates an icon for the future forecast
                var icon = response.list[i].weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png";
                var currentIcon = $("<img>").attr("src", iconUrl);
                currentIcon.attr("class", "futureForecast icon")

                //Generates the temperature
                //Converts from kelvin to celcius
                var temp = response.list[i].main.temp - 273.15;
                var tempDisplay = $("<p>").attr("class", "futureForecast temperature");
                tempDisplay.text("Temp: " + temp.toFixed(2));

                //Generates the Wind speed
                var windDisplay = $("<p>");
                windDisplay.attr("class", "futureForecast wind");
                windDisplay.text("Wind: " + response.list[i].wind.speed + "m/s");

                //Generates the humidity
                var humidityDisplay = $("<p>");
                humidityDisplay.attr("class", "futureForecast humidity");
                humidityDisplay.text("Humidity: " + response.list[i].main.humidity + "%");

                cardBody.append(cardHead, currentIcon, tempDisplay, windDisplay, humidityDisplay);
            }
        }
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
        var temp = response.main.temp - 273.15;
        var tempDisplay = $('<p>');
        tempDisplay.attr("class", "currentForcastText temperature");
        tempDisplay.text("Temp: " + temp.toFixed(2));
        
        //Creates wind elements
        var windDisplay = $('<p>');
        windDisplay.attr("class", "currentForcastText wind");
        windDisplay.text("Wind: " + response.wind.speed + " m/s");

        //Creates humidity elements
        var humidityDisplay = $('<p>');
        humidityDisplay.attr("class", "currentForcastText humidity");
        humidityDisplay.text("Humidity: " + response.main.humidity + "%");

        $('#today').append(cityName, tempDisplay, windDisplay, humidityDisplay);
        $('#today').attr("class", "currentWeatherStyling")
    })
}

//Saves the searches made by the user and stores in local storage
function saveSearches(){
    //Gets the search query
    var searchQuery = $('#search-input').val();
    //Either gets the search array or creates one
    var searches = JSON.parse(window.localStorage.getItem('searches')) || [];
    //Creates an object to be stored in the array
    var newSearch = {
        "Search": searchQuery
    }
    //Pushes it and sets this in local storage
    searches.push(newSearch);
    window.localStorage.setItem('searches', JSON.stringify(searches));
}


//Renders the search
function renderSearches(){
    var newSearchButton = JSON.parse(window.localStorage.getItem("searches"));

    //If the array isn't empty search through the array and append a button with the search text onto the history Div
    if (newSearchButton !== null){
        for (var i = 0; i < newSearchButton.length; i++){
            var button = $("<button>");
            button.attr("class", "searchButton");
            var buttonText = newSearchButton[i].Search;
            button.text(buttonText);
            $("#history").append(button);
        }
    }
    //Once the buttons are created they can have a click event run on it, this will then put it into the search value input field and run the city details and current weather functions
    $("#history").children().on("click", function(event){
        var currentSearch = event.currentTarget.innerHTML;
        $("#search-input").val(currentSearch);
        $('#today').children().remove();
        $('#forecast').children().remove();
        getCityDetails();
        getCurrentWeather();
    })
}