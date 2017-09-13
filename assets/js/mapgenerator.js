'use strict';

function initMap() {
    app.init();
}

const app = {

    settings: {
        map: undefined,
        setupGoogleMap: undefined,
        containerMap: undefined,
        currentPosition: {
            lat: 0,
            lng: 0
        },

        sourcePosition: undefined,
        destinationPosition: undefined,
        directionsService: undefined,
        directionsDisplay: undefined,
        latitudOrigin: undefined,
        longitudOrigin: undefined,
        price_stimated: undefined
    },

    init: function () {
        app.containerMap = document.getElementById("map"),
            app.currentPosition = {
                lat: -33.4724728,
                lng: -70.9100251
            }

        app.setupGoogleMap = {
            zoom: 10,
            center: app.currentPosition,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false
        }

        app.settings.map = new google.maps.Map(app.containerMap, app.setupGoogleMap);
        app.setup();
    },

    setup: function () {
        
        $("#ruta").click(function () {
            app.drawingRoute(app.settings.directionsService, app.settings.directionsDisplay);
            $('#price').append("<div>"+app.settings.price_stimated+"</div>")
        });
        
        app.settings.destinationPosition = $('#destino')[0];
        app.autocompletePosition(app.settings.destinationPosition);

        app.settings.directionsService = new google.maps.DirectionsService;
        app.settings.directionsDisplay = new google.maps.DirectionsRenderer;
        app.settings.directionsDisplay.setMap(app.settings.map);
        
        app.searchMyPosition();
    },

    // MY CURRENT LOCATION
    searchMyPosition: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(app.markerPosition, app.funcionError);
        }
    },
    // MARKER POSITION
    markerPosition: function (position) {
        app.latitudOrigin = position.coords.latitude;
        app.longitudOrigin= position.coords.longitude;

        let location = new google.maps.InfoWindow();
        let marker = app.createMarker(app.settings.map);

        marker.setPosition(new google.maps.LatLng(app.latitudOrigin , app.longitudOrigin));
        app.settings.map.setCenter({
            lat: app.latitudOrigin,
            lng: app.longitudOrigin
        });
        app.settings.map.setZoom(17);
        marker.setVisible(true);

        location.setContent('<div><strong>My current location!!</strong><br>');
        location.open(app.settings.map, marker);
    },
    funcionError: function (error) {
        alert("Tenemos un problema para encontrar tu ubicación");
    },

    //AUTOCOMPLITED
    autocompletePosition: function (input) {
        let autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', app.settings.map);
        let location = new google.maps.InfoWindow();
        let marker = app.createMarker(app.settings.map);
        autocomplete.addListener('place_changed', function () {
            location.close();
            marker.setVisible(false);
            let place = autocomplete.getPlace();
            app.markerLocation(place, location, marker);
        });
    },

    createMarker: function (map) {
        let icon = {
            url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        let marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icon,
            anchorPoint: new google.maps.Point(0, -29)
        });

        return marker;
    },

    markerLocation: function (place, location, marker) {
        if (!place.geometry) {
            window.alert("We did not find the place you indicated: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            app.settings.map.fitBounds(place.geometry.viewport);
        } else {
            app.settings.map.setCenter(place.geometry.location);
            app.settings.map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        location.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        location.open(app.settings.map, marker);
    },

    // DRAWING ROUTE
    drawingRoute: function (directionsService, directionsDisplay) {
        let origin = new google.maps.LatLng(app.latitudOrigin , app.longitudOrigin);
        let destination = $('#destino').val();

        if (destination != "" && destination != "") {
            app.settings.directionsService.route({
                    origin: origin,
                    destination: destination,
                    travelMode: "DRIVING"
                },
                function (response, status) {
                    if (status === "OK") {
                        app.settings.directionsDisplay.setDirections(response);
                    } else {
                        app.error();
                    }
                });
        }
    },

    error: function () {
        alert("You did not enter a valid source and destination");
    }
}