
$(document).ready(function () {

    var cityList = $("#list");

    var cities = [];
    var city;

    init();

    function renderCities() {
        cityList.empty();
        for (var i = 0; i < cities.length; i++) {
            city = cities[i];
            // console.log(city);
            var li = $("<a>");
            li.attr("href", "#");
            li.text(city);
            li.addClass("list-group-item list-group-item-action");
            li.attr("id", "item" + i);
            li.attr("data-index", i);

            cityList.prepend(li);
        }

        // Render a new li for each city
        // for (var i = 0; i < cities.length; i++) {
        //     city = cities[i];
        //     // console.log(city);
        //     var li = $("<li>");
        //     li.text(city);
        //     li.addClass("list-group-item");
        //     li.attr("id", "item" + i);
        //     cityList.prepend(li);
        // }
    }

    function init() {
        // Get stored todos from localStorage
        // Parsing the JSON string to an object
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        // var json= JSON.parse( localStorage.getItem( 'simpleCart_items' ) );

        // If todos were retrieved from localStorage, update the todos array to it
        if (storedCities !== null) {
            cities = storedCities;

            var lastCity = cities[cities.length - 1];
            $("#input").val(lastCity);
            getWeather(lastCity);
        }

        // Render todos to the DOM
        renderCities();
    }

    function storeCities() {
        // Stringify and set "todos" key in localStorage to todos array
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    $("#search").on("click", function () {
        event.preventDefault();
        var cityInput = $("#input").val();

        // Return from function early if submitted todoText is blank
        if (cityInput === "") {
            return;
        }

        // Add new todoText to todos array, clear the input
        cities.push(cityInput);

        // Store updated todos in localStorage, re-render the list
        storeCities();
        renderCities();
        getWeather(cityInput);
        // cityInput = "";
    });
    $("#list").on("click", function(event) {
        var element = event.target;

        // If that element is a button...
        if (element.matches("a") === true) {
            // Get its data-index value and remove the todo element from the list
            var index = element.getAttribute("data-index");
            var cityClicked = cities[index];
            console.log(cityClicked);
            $("#input").val(cityClicked);

            // Add new todoText to todos array, clear the input
            cities.push(cityClicked);

            // Store updated todos in localStorage, re-render the list
            storeCities();
            renderCities();
            getWeather(cityClicked);
        }
    });



    function getWeather(cityInput) {
        // This is our API key
        var APIKey = "d52290d8a11b7757b4e71a1905043285";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
            "q=" + cityInput + ",AU&units=metric&appid=" + APIKey;

        var lat;
        var lon;

        // https://api.openweathermap.org/data/2.5/weather?q=Melbourne,AU&units=metric&appid=d52290d8a11b7757b4e71a1905043285

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Log the queryURL
                // console.log(queryURL);

                // Log the resulting object
                // console.log(response);


                $(".cit").html("<h2>" + response.name +
                    " (" + moment().format('D/MM/YYYY') + ") " +
                    "<img src=http://openweathermap.org/img/wn/" +
                    response.weather[0].icon + "@2x.png></img>" + "</h2>");
                // console.log(response.weather.description);
                $(".temp").text("Temperature (C): " + response.main.temp);
                $(".humidity").text("Humidity: " + response.main.humidity);
                $(".wind").text("Wind Speed: " + response.wind.speed);
                lat = response.coord.lat;
                lon = response.coord.lon;
                // console.log("lat:" + lat);
                // console.log("lon:" + lon);
                var uviqueryURL = "https://api.openweathermap.org/data/2.5/uvi?" +
                    "lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
                $.ajax({
                    url: uviqueryURL,
                    method: "GET"
                })
                    // We store all of the retrieved data inside of an object called "response"
                    .then(function (response) {

                        $(".uvind").text("UV index: " + response.value);

                    });
                // Converts the temp to Kelvin with the below formula
                // var tempF = (response.main.temp - 273.15) * 1.80 + 32;
                // $(".tempF").text("Temperature (Kelvin) " + tempF);

                // Log the data in the console as well
                // console.log("Wind Speed: " + response.wind.speed);
                // console.log("Humidity: " + response.main.humidity);
                // console.log("Temperature (F): " + response.main.temp);
                // http://api.openweathermap.org/data/2.5/forecast?q=Melbourne,au&units=metric&appid=d52290d8a11b7757b4e71a1905043285
                var daysqueryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
                    "q=" + cityInput + ",au&units=metric&appid=" + APIKey;
                $.ajax({
                    url: daysqueryURL,
                    method: "GET"
                })
                    // We store all of the retrieved data inside of an object called "response"
                    .then(function (response) {

                        // Log the queryURL
                        console.log(daysqueryURL);

                        // Log the resulting object
                        console.log(response);
                        //day1
                        $(".dat").text("(" + moment().format('D/MM/YYYY') + ")");
                        $(".icon").empty();

                        $(".icon").append(
                            $("<img>").attr("src", `http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`),
                        );

                        $(".tem").text("Temp: " + response.list[0].main.temp);
                        $(".humid").text("Humidity: " + response.list[0].main.humidity);

                        //day2
                        $(".dat2").html("(" + moment().add(1, 'days').format('D/MM/YYYY') + ")");
                        $(".icon2").html("<img src=http://openweathermap.org/img/wn/" +
                            response.list[8].weather[0].icon + "@2x.png></img>");

                        $(".tem2").text("Temp: " + response.list[8].main.temp);
                        $(".humid2").text("Humidity: " + response.list[8].main.humidity);

                        //day3
                        $(".dat3").html("(" + moment().add(2, 'days').format('D/MM/YYYY') + ")");
                        $(".icon3").html("<img src=http://openweathermap.org/img/wn/" +
                            response.list[16].weather[0].icon + "@2x.png></img>");

                        $(".tem3").text("Temp: " + response.list[16].main.temp);
                        $(".humid3").text("Humidity: " + response.list[16].main.humidity);

                        //day4
                        $(".dat4").html("(" + moment().add(3, 'days').format('D/MM/YYYY') + ")");
                        $(".icon4").html("<img src=http://openweathermap.org/img/wn/" +
                            response.list[24].weather[0].icon + "@2x.png></img>");

                        $(".tem4").text("Temp: " + response.list[24].main.temp);
                        $(".humid4").text("Humidity: " + response.list[24].main.humidity);

                        //day5
                        $(".dat5").html("(" + moment().add(4, 'days').format('D/MM/YYYY') + ")");
                        $(".icon5").html("<img src=http://openweathermap.org/img/wn/" +
                            response.list[32].weather[0].icon + "@2x.png></img>");

                        $(".tem5").text("Temp: " + response.list[32].main.temp);
                        $(".humid5").text("Humidity: " + response.list[32].main.humidity);
                    });
            })
    }
});        