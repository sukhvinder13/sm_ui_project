'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.mapsService
 * @description
 * # mapsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('mapsService', function ($q) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    // var map;
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.initMap = function (DOMid, center, zoom) {
      var map = new google.maps.Map(document.getElementById(DOMid), {
        zoom: zoom,
        // center: { lat: 17.455439, lng: 78.434185 }
        center: center
      });
      directionsDisplay.setMap(map);
      return map;

    }
    this.createMarker = function (lat, lng, icon, title, map, animation) {

      return new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        animation: animation == undefined ? google.maps.Animation.DROP : google.maps.Animation.BOUNCE,
        title: title,
        icon: {
          url: icon,
          anchor: new google.maps.Point(25, 50),
          scaledSize: new google.maps.Size(50, 50)
        },
        map: map
      });
    }

    this.createMarkerPath = function (lat, lng, rotation, map) {
      return new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 2,
          fillColor: 'green',
          rotation: rotation
        },
        map: map
      });
    }


    this.createRoute = function (latLng1, latLng2) {
      var _activepromise = $q.defer();
      directionsService.route({
        origin: new google.maps.LatLng(latLng1.lat, latLng1.long),
        destination: new google.maps.LatLng(latLng2.lat, latLng2.long),
        travelMode: 'WALKING'
      }, function (response, status) {
        if (status === 'OK') {
          _activepromise.resolve(response);
        } else {
          _activepromise.reject(status);

          // window.alert('Directions request failed due to ' + status);
        }
      });
      return _activepromise.promise;

    }
    this.createRouteWayPoints = function (latLng1, latLng2, wayPoints) {
      var _activepromise = $q.defer();
      directionsService.route({
        origin: new google.maps.LatLng(latLng1.lat, latLng1.long == undefined ? latLng1.lng : latLng1.long),
        destination: new google.maps.LatLng(latLng2.lat, latLng2.long == undefined ? latLng2.lng : latLng2.long),
        waypoints: wayPoints,
        travelMode: 'WALKING'
      }, function (response, status) {
        if (status === 'OK') {
          _activepromise.resolve(response);
        } else {
          _activepromise.reject(status);

          // window.alert('Directions request failed due to ' + status);
        }
      });
      return _activepromise.promise;

    }
    this.routeCreationPolyline = function (points) {
      return new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#73a7d2',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
    }
    this.creationPolyline = function () {
      return new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#73a7d2',
        strokeOpacity: 3.0,
        strokeWeight: 4
      });
    }

  });
