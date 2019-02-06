'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BuslivecontrollerCtrl
 * @description
 * # BuslivecontrollerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('Buslivecontroller', function (toastr, mapsService, busLiveService, $cookies, $sce, $scope, configService, $timeout) {
    var BusliveCtrl = this;
    BusliveCtrl.schoolId = $cookies.getObject('uds').schoolId;
    BusliveCtrl.loginId = $cookies.getObject('uds').id;
    BusliveCtrl.role = $cookies.get('role');
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
    $scope.positions = [];
    BusliveCtrl.schoollist;
    var position = [];
    var marker;
    var rotationAngle;
    $sce.vechileNo = 'asdasd';
    // $scope.vechileNo = BusliveCtrl.getRegno;


    // map
    var map;
    map = mapsService.initMap('liveStream_canvas_map', { lat: 17.455439, lng: 78.434185 }, 10);
    // map end
    // var regNo = BusliveCtrl.vehList;
    // BusliveCtrl.getRegno(regNo);
    BusliveCtrl.getRegno = function (regNo) {
      socket.removeAllListeners("newRecord");

      $scope.positions.splice(1, $scope.positions.length - 1);
      regNo = JSON.parse(regNo);
      var IMEIByVichleNo = function (subCb) {
        $scope.positions.push({ lat: regNo.pickupDetails.lat, long: regNo.pickupDetails.log, url: 'images/student_traking.png', title: "This Is my student location" })
        busLiveService.getIMEIByVichleNo(regNo.servicerel.vehicleNo).then(function (response) {
          console.log(response);
          if (response.length > 0) {
            IMEIConnect = response[0].IMEINo;
            subCb(null, IMEIConnect);
          }
          else {
            subCb("Record Not Found")
          }
        }, function (error) {
          subCb(error)
        });
      }
      var getLastLatAndLong = function (results, subCb) {
        busLiveService.getLatAndLogByDeviceId(results.IMEIByVichleNo).then(function (response) {

          if (response) {
            $scope.positions.push({
              lat: response.lat
              , long: response.long
              , url: 'images/location-point.svg'
              , title: "This Is my bus point"
            });
            position = [$scope.positions[2].lat, $scope.positions[2].long]
            subCb(null, response);
          }
          else
            subCb('Device data is not avilable');
        }, function (error) {
          subCb(error)
        });

      }
      async.auto({
        IMEIByVichleNo: IMEIByVichleNo,
        getLastLatAndLong: ['IMEIByVichleNo', getLastLatAndLong]
      }, function (err, success) {
        if (err) {
          alert(err);
        } else {
          console.log('$scope.positions');
          console.log($scope.positions);
          console.log('success')
          console.log(success)
          var waypoint = [
            {
              location: new google.maps.LatLng($scope.positions[1].lat, $scope.positions[1].long),
              stopover: true
            }
          ]
          mapsService.createRouteWayPoints($scope.positions[0], $scope.positions[2], waypoint).then(function (success) {
            var rendererOptions = {
              map: map,
              suppressMarkers: true
            }
            var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
            directionsDisplay.setDirections(success);
          });
          mapsService.createMarker($scope.positions[0].lat, $scope.positions[0].long, $scope.positions[0].url, $scope.positions[0].title, map);
          mapsService.createMarker($scope.positions[1].lat, $scope.positions[1].long, $scope.positions[1].url, $scope.positions[1].title, map);
          marker = mapsService.createMarker($scope.positions[2].lat, $scope.positions[2].long, $scope.positions[2].url, $scope.positions[2].title, map, 'bounce');
          // socket call inti here
          connectSocket(success.getLastLatAndLong.device_id);

        }
      })
    };
    // var regNo = BusliveCtrl.vehList;
    // BusliveCtrl.getRegno(regNo);






    function Init() {
      this.getvehicle = function () {
        busLiveService.getVehicleDetailsbySchoolId(BusliveCtrl.schoolId, BusliveCtrl.role, BusliveCtrl.loginId).then(function (response) {
          if (response) {
            BusliveCtrl.vehList = response.data[0];
            console.log('BusliveCtrl.vehList');
            console.log(BusliveCtrl.vehList);
            if (BusliveCtrl.role === 'Student') BusliveCtrl.getRegno(JSON.stringify(BusliveCtrl.vehList));
          } else {
            alert('only student login');
          }
        }, function (error) {
          // console.log(error);
        });

      };

      this.getschoollocation = function () {
        busLiveService.getbyschoollocationSchoolId(BusliveCtrl.schoolId).then(function (response) {
          if (response) {
            BusliveCtrl.schoollist = response;
            $scope.positions.push({ lat: response.lat, long: response.lng, url: 'images/school.svg', "title": "This school location" })
          }
        }, function (error) {
          console.log(error);
        });

      };
    }
    (new Init()).getvehicle();
    (new Init()).getschoollocation();




    var socket = io(configService.GPStracking() + '/');
    var IMEIConnect;
    function connectSocket(IMEIConnect) {
      socket.on('connect', function () {
        console.log('Connected to server');
      });
      socket.on("newRecord", function (message) {
        if (IMEIConnect == message[0].device_id) {
          console.log("message[0].device_id" + message[0].device_id);
          console.log("IMEIConnect" + message[0].lat, message[0].long);
          console.log("direction" + message[0].direction);
          $scope.$apply(function () {
            rotationAngle = message[0].direction;
            // transition([message[0].lat, message[0].long]);
            animatedMove(marker, 0.5, marker.position, new google.maps.LatLng(message[0].lat, message[0].long));

          });
        }
      });
    }

    socket.on('disconnect', function () {
      console.log('Disconnected from server');
    });


    // smooth marker move

    //image rotation (do not touch this code)
    var RotateIcon = function (options) {
      this.options = options || {};
      this.rImg = options.img || new Image();
      this.rImg.src = this.rImg.src || this.options.url || '';
      this.options.width = this.options.width || this.rImg.width || 52;
      this.options.height = this.options.height || this.rImg.height || 60;
      var canvas = document.createElement("canvas");
      canvas.width = this.options.width;
      canvas.height = this.options.height;
      this.context = canvas.getContext("2d");
      this.canvas = canvas;
    };
    RotateIcon.makeIcon = function (url) {
      return new RotateIcon({ url: url });
    };
    RotateIcon.prototype.setRotation = function (options) {
      var canvas = this.context,
        angle = options.deg ? options.deg * Math.PI / 180 :
          options.rad,
        centerX = this.options.width / 2,
        centerY = this.options.height / 2;

      canvas.clearRect(0, 0, this.options.width, this.options.height);
      canvas.save();
      canvas.translate(centerX, centerY);
      canvas.rotate(angle);
      canvas.translate(-centerX, -centerY);
      canvas.drawImage(this.rImg, 0, 0);
      canvas.restore();
      return this;
    };
    RotateIcon.prototype.getUrl = function () {
      return this.canvas.toDataURL('image/png');
    };
    //image rotation end
    function animatedMove(marker, t, current, moveto) {
      var lat = current.lat();
      var lng = current.lng();

      var deltalat = (moveto.lat() - current.lat()) / 100;
      var deltalng = (moveto.lng() - current.lng()) / 100;

      var delay = 30 * t;
      for (var i = 0; i < 100; i++) {
        (function (ind) {
          setTimeout(
            function () {
              var lat = marker.position.lat();
              var lng = marker.position.lng();
              lat += deltalat;
              lng += deltalng;
              marker.setPosition(new google.maps.LatLng(lat, lng));
              marker.setIcon({
                url: 'images/location-point.svg',
                // url: RotateIcon
                //   .makeIcon(
                //     'images/location-point.svg')
                //   .setRotation({ deg: - rotationAngle })
                //   .getUrl(),
                anchor: new google.maps.Point(25, 50),
                scaledSize: new google.maps.Size(50, 50)

              })
            }, delay * ind
          );
        })(i)
      }
    }





  })






  .controller('AdminBuslivecontroller', function (toastr, mapsService, busLiveService, $cookies, configService, $scope, $filter) {

    var BusAdminliveCtrl = this;
    var marker;
    $scope.historyPoints = [];
    $scope.vehicle_stats;
    var flightPath;
    $scope.flightPathStatus=false;
    $scope.polyline_status = true;
    $scope.historydate = new Date();
    $scope.maxDate = function formatDate() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }



    BusAdminliveCtrl.schoolId = $cookies.getObject('uds').schoolId;
    // BusAdminliveCtrl.role = $cookies.get('role');
    var map;
    map = mapsService.initMap('map_canvas_history', { lat: 17.455439, lng: 78.434185 }, 3);
    // map end
    function Init() {
      this.getvehicle = function () {
        busLiveService.getVehicleDetailsbySchoolIdAdmin(BusAdminliveCtrl.schoolId).then(function (response) {
          if (response) {
            BusAdminliveCtrl.vehList = response.data;
          }
        }, function (error) {
          console.log(error);
        });
      }
    }
    (new Init()).getvehicle();


    var paintRoute = function (endPoint) {
      if ($scope.historyPoints.length > 1) {
        mapsService.createMarkerPath(endPoint.lat, endPoint.lng, endPoint.direction, map);
      } else {
        marker = mapsService.createMarker(endPoint.lat, endPoint.lng, 'images/greenmap.svg', 'start point', map, 'bounce');
      }
      if ($scope.flightPathStatus) {//flightPathStatus is to check poly line being drawn or not
        flightPath.getPath().push(new google.maps.LatLng(endPoint.lat, endPoint.lng));
        $scope.polyline_status = true;
      }

    }
    var paintMarkers = function (points) {
      flightPath = mapsService.creationPolyline();
      flightPath.setMap(map);
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < points.length; i++) {
        bounds.extend(new google.maps.LatLng(points[i].location.lat, points[i].location.lng));
      }
      bounds.getCenter();
      map.fitBounds(bounds);
      var carPath = new google.maps.MVCArray();
      async.eachSeries(points, function (way, subCB) {
        way.location.direction = (way.location.direction == undefined) ? 0 : way.location.direction;
        setTimeout(function () {
          // mapsService.createMarkerPath(way.location.lat, way.location.lng, way.location.direction, map);
          // flightPath.getPath().push(new google.maps.LatLng(way.location.lat, way.location.lng))
          carPath.push(new google.maps.LatLng(way.location.lat, way.location.lng));
          flightPath.setPath(carPath);
          subCB();
        }, 100);
      }, function (err, success) {
        $scope.$apply(function () {
          $scope.polyline_status = true;
          $scope.flightPathStatus = true
        });

      })
    }

    $scope.history = function (serviceNo, historydate) {
      socket.removeAllListeners("newRecord");
      if (historydate == undefined) { historydate = new Date(); }
      if (serviceNo == null || historydate == null) {
        toastr.error("Please Select  Service Number and Date");
        return;
      }
      $scope.flightPathStatus = false;
      $scope.polyline_status = false;

      var serno = JSON.parse(serviceNo);
      var date = $filter('date')(historydate, 'yyyy-MM-dd');
      busLiveService.gethistoryDetailsbySchoolId(serno.IMEINo, date).then(function (response) {
        // historydate = response[0].date;
        console.log(response);
        $scope.historyPoints = [];
        if (response.length > 0) {
          for (var x = 0; x < response.length; x++) {
            if (response[x].location.ignition == true) {
              $scope.historyPoints.push(response[x])
            }
          }
          $scope.vehicle_stats = response[response.length - 1].location;
          map = mapsService.initMap('map_canvas_history', { lat: response[response.length - 1].location.lat, lng: response[response.length - 1].location.lng }, 15);
          if ($scope.historyPoints.length > 0) {

            // create star point end point
            mapsService.createMarker($scope.historyPoints[0].location.lat, $scope.historyPoints[0].location.lng, 'images/greenmap.svg', 'start point', map);
            marker = mapsService.createMarker($scope.historyPoints[$scope.historyPoints.length - 1].location.lat, $scope.historyPoints[$scope.historyPoints.length - 1].location.lng, 'images/redmap.svg', 'end point', map, 'bounce');
            // create star point end point end
            paintMarkers($scope.historyPoints);
            if ($filter('date')(historydate, 'yyyy-MM-dd') == $filter('date')(new Date(), 'yyyy-MM-dd')) {
              console.log("helloo test")
              connectSocket(serno.IMEINo);
            }
          } else {
            toastr.error("no route Found");
            if ($filter('date')(historydate, 'yyyy-MM-dd') == $filter('date')(new Date(), 'yyyy-MM-dd')) {
              connectSocket(serno.IMEINo);
            } else {
              $scope.polyline_status = true;
            }
          }
        } else {
          toastr.error("no history Found");
          if ($filter('date')(historydate, 'yyyy-MM-dd') == $filter('date')(new Date(), 'yyyy-MM-dd')) {
            connectSocket(serno.IMEINo);
          } else {
            $scope.polyline_status = true;
          }
        }
      }, function (error) {
        toastr.error("Something went wrong..");
      });
    }




    function animatedMove(marker, t, current, moveto) {
      var lat = current.lat();
      var lng = current.lng();

      var deltalat = (moveto.lat() - current.lat()) / 100;
      var deltalng = (moveto.lng() - current.lng()) / 100;

      var delay = 30 * t;
      for (var i = 0; i < 100; i++) {
        (function (ind) {
          setTimeout(
            function () {
              var lat = marker.position.lat();
              var lng = marker.position.lng();
              lat += deltalat;
              lng += deltalng;
              marker.setPosition(new google.maps.LatLng(lat, lng));
              marker.setIcon({
                url: 'images/location-point.svg',
                // url: RotateIcon
                //   .makeIcon(
                //     'images/location-point.svg')
                //   .setRotation({ deg: - rotationAngle })
                //   .getUrl(),
                anchor: new google.maps.Point(25, 50),
                scaledSize: new google.maps.Size(50, 50)

              })
            }, delay * ind
          );
        })(i)
      }
    }


    var socket = io(configService.GPStracking() + '/');
    function connectSocket(IMEIConnect) {
      socket.on('connect', function () {
        console.log('Connected to server');
      });
      socket.on("newRecord", function (message) {
        if (IMEIConnect == message[0].device_id) {
          console.log("message[0].device_id" + JSON.stringify(message[0]));

          $scope.vehicle_stats = message[0];
          $scope.$apply(function () {
            if (!marker) {
              marker = mapsService.createMarker(message[0].lat, message[0].long, 'images/redmap.svg', 'end point', map);
            }
            animatedMove(marker, 0.5, marker.position, new google.maps.LatLng(message[0].lat, message[0].long));
            $scope.historyPoints.push({
              location: {
                date: message[0].date,
                direction: message[0].direction,
                ignition: message[0].ignition,
                lat: message[0].lat,
                lng: message[0].long,
                speedKPH: message[0].speedKPH,
              }, stopover: true
            })
            paintRoute({ lat: message[0].lat, lng: message[0].long });
          });
        }
      });
    }

    socket.on('disconnect', function () {
      console.log('Disconnected from server');
    });

  });
