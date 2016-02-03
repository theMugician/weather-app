$( document ).ready(function() {
    var lonLat = "";
    var city = "";
    var region = "";

    function convertUnits() {
        var currTemp = parseInt($("#temp").html());
        var newTemp;
        if ($('.cmn-toggle').prop('checked')) {
            //Farenheit is true
            //Celsius is false
            newTemp = (currTemp - 32) * 5 / 9;
        } else {
            newTemp = currTemp * 9 / 5 + 32;
        }
        console.log("new temp: " + newTemp);
        $("#temp").html(Math.round(newTemp) + "&deg;");
    }

    function toggleColor(temp) {
        if (temp <= -30) {
            return "toggle-color1";
        }
        if (temp >= -29 && temp <= -21) {
            return "toggle-color2";
        }
        if (temp >= -20 && temp <= -11) {
            return "toggle-color3";
        }
        if (temp >= -10 && temp <= 4) {
            return "toggle-color4";
        }
        if (temp >= 5 && temp <= 15) {
            return "toggle-color5";
        }
        if (temp >= 16 && temp <= 24) {
            return "toggle-color6";
        }
        if (temp >= 25 && temp <= 32) {
            return "toggle-color7";
        }
        if (temp >= 33 && temp <= 38) {
            return "toggle-color8";
        }
        if (temp >= 39) {
            return "toggle-color9";
        }
    }

    function appColor(temp) {
        if (temp <= -30) {
            return "app-bg1";
        }
        if (temp >= -29 && temp <= -21) {
            return "app-bg2";
        }
        if (temp >= -20 && temp <= -11) {
            return "app-bg3";
        }
        if (temp >= -10 && temp <= 4) {
            return "app-bg4";
        }
        if (temp >= 5 && temp <= 15) {
            return "app-bg5";
        }
        if (temp >= 16 && temp <= 24) {
            return "app-bg6";
        }
        if (temp >= 25 && temp <= 32) {
            return "app-bg7";
        }
        if (temp >= 33 && temp <= 38) {
            return "app-bg8";
        }
        if (temp >= 39) {
            return "app-bg9";
        }
    }

//var theLabel =  $("label[for='cmn-toggle-4']");
//convert Units
    $("label[for='cmn-toggle-4']").on("click", function () {
        var currTemp = parseInt($("#temp").html());
        var newTemp;
        if ($('.cmn-toggle').prop('checked')) {
            //Farenheit is true
            //Celsius is false
            newTemp = (currTemp - 32) * 5 / 9;
        } else {
            newTemp = currTemp * 9 / 5 + 32;
        }
        console.log("new temp: " + newTemp);
        $("#temp").html(Math.round(newTemp) + "&deg;");
    });

//console.log(theLabel);

    function getLocation() {
        $.getJSON("http://ipinfo.io", function (location) {
            getWeather(location.loc, location.country);
            $("#city").html(location.city);

            //$("#forecast").html
        }, "jsonp")
            .done(function () {
                console.log("API is a success");
            })
            .fail(function () {
                console.log("API failed");
            })
    }

    function dailyWeather(day) {
        var dayOfWeek = new Date(1000 * day.time);
        dayOfWeek = dayOfWeek.subString(0, 3);
        var icon = day.icon;
        var minTemp = day.temperatureMin;
        var minTemp = day.temperatureMax;
    }

//Set Body background function
    function background(weather) {
        weather = weather.toLowerCase();
        if (weather.indexOf("snow") > -1) {
            return "snow";
        }
        if (weather.indexOf("flurries") > -1) {
            return "snow";
        }
        if (weather.indexOf("rain") > -1) {
            return "rain";
        }
        if (weather.indexOf("cloud") > -1) {
            return "cloudy-day";
        }
        if (weather.indexOf("overcast") > -1) {
            return "cloudy-day";
        }
        if (weather.indexOf("clear") > -1) {
            return "clear-day";
        }
        return "clear-day";
    }

    function getIcon(weather) {
        weather = weather.toLowerCase();
        if (weather.indexOf("snow") > -1) {
            return "snow";
        }
        if (weather.indexOf("rain") > -1) {
            return "rain";
        }
        if (weather.indexOf("cloud") > -1) {
            return "cloudy";
        }
        if (weather.indexOf("clear") > -1) {
            return "day-sunny";
        }
        if (weather.indexOf("fog") > -1) {
            return "fog";
        }
        return "day-sunny";
    }

    /*
     Bahamas, Belize, the Cayman Islands, Palau and the United States

     */
    function getWeather(theLocation, country) {
        //grab units
        var units = "";
        console.log(country);
        if (country !== 'US' || 'BS' || 'BZ' || 'KY' || 'PW') {
            units = "c";
        } else {
            units = "f";
        }
        var apiUnits = "";

        //api weather key
        var apiKey = "da873615a66687071bfbd65cd81de4e5";
        var forecastApi = "https://api.forecast.io/forecast/";
        if (units === "c") {
            apiUnits = "?units=si";
            $(".cmn-toggle").prop('checked', false);
        } else {
            $(".cmn-toggle").prop('checked', true);
        }

        $.get(forecastApi + apiKey + '/' + theLocation + apiUnits, function (weather) {

            var currWeather = weather.currently;

            var now = currWeather.time;
            now = new Date(now * 1000);
            console.log("The current time is: " + now);

            //Current Weather
            var temp = Math.round(currWeather.temperature);
            var summary = currWeather.summary;
            var humidity = 100 * currWeather.humidity;
            console.log(typeof humidity);
            var precipitation = currWeather.precipProbability;
            var wind = currWeather.windSpeed;
            $(".spec-wind").html(wind + " KMH");
            $(".spec-hum").html(humidity + "%");
            $(".spec-precip").html(precipitation + "%");

            //Weekly Weather
            var dailyWeather = weather.daily;
            for (var i = 1; i <= 3; i++) {
                dailyWeather.data[i];
            }

            $("#forecast").html(summary);
            $("#temp").html(temp + "&deg;");

            // Get Weather icon
            var icon = currWeather.icon;
            var wiIcon = "wi-" + getIcon(icon);
            $(".main-wi").addClass(wiIcon);
            console.log(wiIcon);

            //Apply body background
            var bodyBg = "https://s3-us-west-2.amazonaws.com/weather-app/" + background(summary) + ".jpg";
            $("body").css("background-image", "url('" + bodyBg + "')");

            //Apply App background Image
            var appBg = "https://s3-us-west-2.amazonaws.com/weather-app/app-bg/app-" + background(summary) + ".jpg";
            $("#top").css("background-image", "url('" + appBg + "')");


            //Apply App background color
            var celsiusTemp = temp;
            if (units === "f") {
                celsiusTemp = Math.round(celsiusTemp * 9 / 5 + 32);
            }
            var $appCol = "<div class='" + appColor(celsiusTemp) + "'></div>";
            console.log("this is $appCol: " + $appCol);
            $("#app").prepend($appCol);
            //$("#top").addClass('app-bg1');

            //Apply toggle color
            //var $toggle = $("input.cmn-toggle-round-flat + label:after");
            $("input.cmn-toggle-round-flat + label:after").css("background-color", "red");
            console.log($toggle);

        }, "jsonp")
            .done(function () {
                console.log("Weather API is a success");
            })
            .fail(function () {
                console.log("Weather API failed");
            });
    }

    getLocation();

});