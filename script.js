// The user needs to enter their name and phone number to be captured by our app for sending to emergency services.
//--The name and phone number will be open variables to vary from user to user
// 
/* global firebase */
/* global google */
/* global position */
//Document ready function
$(function() {
    // Upon page load, We show our About modal to give the user directions and to grab their location data.
    $("#aboutWindow").modal("show");




    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBYkMTioukhTliOIKHJauTsX6WVM2aUIfg",
        authDomain: "adventurebuddy-fc144.firebaseapp.com",
        databaseURL: "https://adventurebuddy-fc144.firebaseio.com",
        projectId: "adventurebuddy-fc144",
        storageBucket: "adventurebuddy-fc144.appspot.com",
        messagingSenderId: "599196361369"
    };
    firebase.initializeApp(config);

    var database = firebase.database();


    var lat = "";
    var lng = "";
    var watchID = "";

    $("#getStarted").on("click", function() {
        function getLocation() {
            if (navigator.geolocation) {
                var optn = {
                    enableHighAccuracy: true,
                    timeout: Infinity,
                    maximumAge: 5000
                };
                watchID = navigator.geolocation.watchPosition(copyPosition);
            }
            else {
                alert("Geolocation is not supported by this browser.");
            }

        }

        getLocation();

        function copyPosition(position) {
            var gLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOtn = {
                zoom: 15,
                center: gLatLng,
                mapTypeId: google.maps.MapTypeId.ROAD
            };

            var Pmap = document.getElementById("map");

            var map = new google.maps.Map(Pmap, mapOtn);

            addMarker(map, gLatLng, "Your Location: " + gLatLng, "You Are Here!");

            lat = position.coords.latitude;
            lng = position.coords.longitude;

        }

        function addMarker(map, gLatLng, title, content) {
            var markerOptn = {
                position: gLatLng,
                map: map,
                title: title,
                animation: google.maps.Animation.DROP
            };

            var marker = new google.maps.Marker(markerOptn);

            var infoWindow = new google.maps.InfoWindow({ content: content, position: gLatLng });

            google.maps.event.addListener(marker, "click", function() {
                infoWindow.open(map);
            });
        }
        $("#loginWindow").modal("show");

    });




    $("#formSubmit").on("click", function(event) {
        event.preventDefault();


        var name = $("#fullName").val().trim();
        // console.log("Name: " + name);
        var phone = $("#phoneNumber").val().trim();
        // console.log("Phone: " + phone);

        database.ref().push({
            name: name,
            phone: phone,
            lat: lat,
            lng: lng,
            timeAdded: firebase.database.ServerValue.TIMESTAMP

        });

        var form = document.getElementById("inputForm");
        form.reset();
        $("#loginWindow").modal("hide");

    });

    database.ref().on("child_added", function(snapshot) {
        var s = snapshot.val();

        var fName = s.name;
        var fPhone = s.phone;
        var fLat = s.lat;
        var fLng = s.lng;

        console.log("Name: " + fName);
        console.log("Phone: " + fPhone);
        console.log("Latitude: " + fLat);
        console.log("Longitude: " + fLng);
    });



}); // document ready function end
