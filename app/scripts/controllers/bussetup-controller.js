'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BusserviceControllerCtrl
 * @description
 * # BusserviceControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('BussetupControllerCtrl', function ($rootScope, $window,$http, BusSetupService, $cookies, $timeout, $state, APP_MESSAGES, toastr, generateexcelFactory) {
        var BussetCtrl = this;
        BussetCtrl.detailsMode = false;
        BussetCtrl.editMode = false;
        BussetCtrl.viewValue = {};
        BussetCtrl.locationPoints = [];
        BussetCtrl.location={};
        BussetCtrl.selectedpoints = [];
        BussetCtrl.busdatails = [];
        BussetCtrl.formroutesFields={};
        BussetCtrl.selectedPointsData = [];
        // var trakingurl="http://139.162.6.194:3003/explorer/";
        //Get Busservice details by School ID
        var selectBus;
        BussetCtrl.schoolId = $cookies.getObject('uds').schoolId;
        //Defaults
        BussetCtrl.routesEditMode = false;
        BussetCtrl.cars = [{id:1, name: 'Audi'}, {id:2, name: 'BMW'}, {id:1, name: 'Honda'}];
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
        // console.log(roleAccess);

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
          if (roleAccess[0].RolesData[i].name === "Add Bus") {
    
            BussetCtrl.roleView = roleAccess[0].RolesData[i].view;
            BussetCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
            BussetCtrl.roledelete = roleAccess[0].RolesData[i].delete;
          }
    
    
        }

        function Init() {
          // alert(" i amcoming");
            this.getBusserviceDetails = function () {
                BusSetupService.getBusserviceDetailsBySchoolId(BussetCtrl.schoolId).then(function (result) {
                    if (result) {
                        BussetCtrl.busserviceList = result;
                      //  console.log("bus data "+JSON.stringify(BussetCtrl.busserviceList));
                        if(BussetCtrl.busserviceList.length>0)
                        {
                            BussetCtrl.location=BussetCtrl.busserviceList[0];
                            //console.log(BussetCtrl.busserviceList[0].routePoints);
                            //BussetCtrl.locationPoints.concat(BussetCtrl.busserviceList[0].routePoints);
                            BussetCtrl.locationPoints=angular.copy(BussetCtrl.busserviceList[0].routePoints);

                        }
                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
            this.getParentData = function (){
              BusSetupService.getParentData(BussetCtrl.schoolId).then(function (result) {
                BussetCtrl.busdatails = result.data;
                // console.log(BussetCtrl.busdatails);
                //    console.log(result);
                       
                      // if (response) {
                      //   console.log(response);
                      //    if(response.data.length>0)
                      //   var userDetails= response.data[0]
                      //   BussetCtrl.finalURL= trakingurl+'?=username='+userDetails.username+'?password='+userDetails.password
                        
                      // }
                  }, function (error) {
                      console.log('Error while fetching subject list . Error stack : ' + error);
                  });
                
    
          };
            this.getBusDetails = function () {
                // console.log(BussetCtrl.schoolId)
                BusSetupService.getBusDetailsBySchoolId(BussetCtrl.schoolId).then(function (result) {
                    if (result) {
                        // BussetCtrl.busList = result;
                        // console.log(BussetCtrl.busList);
                        // alert(JSON.stringify(BussetCtrl.busList));
                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
            this.getvehicle = function () {
                BusSetupService.getVehicleDetailsbySchoolId(BussetCtrl.schoolId).then(function (response) {
                    ////console.log(classId);    
                    if (response) {
                        BussetCtrl.serviceList = response;
                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });

            };
            this.getRoutesDetails = function () {
                BusSetupService.getRoutesDetailsBySchooleId(BussetCtrl.schoolId).then(function (response) {
                    ////console.log(classId);    
                    // console.log("BussetCtrl.getRoutesPointList"+response)
                    if (response) {
                        BussetCtrl.getRoutesPointList = response;
                        console.log("BussetCtrl.getRoutesPointList",JSON.stringify(response))
                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });

            };

        }
        (new Init()).getvehicle();
        (new Init()).getParentData();
        
        
        (new Init()).getBusserviceDetails();
        (new Init()).getBusDetails();
        (new Init()).getRoutesDetails();

        //Show Table Of Bus Services
        // BussetCtrl.showTable = function () {
        //   // alert("hi");
        //     document.getElementById('serviceid').style.display = 'block';
        //     document.getElementById('map').style.display = 'none';
        //     document.getElementById('pointsid').style.display = 'none';
        //     document.getElementById('backid').style.display = 'none';
        // }
        //Initialize the Table Component
        //Setting up float label
        // BussetCtrl.setFloatLabel = function () {
        //     Metronic.setFlotLabel($('input[name=serviceStartPoint]'));
        //     Metronic.setFlotLabel($('input[name=serviceDropPoint]'));
        //     Metronic.setFlotLabel($('input[name=serviceNo]'));
        //     Metronic.setFlotLabel($('input[name=busId]'));
        //     Metronic.setFlotLabel($('input[name=servicePickupPointTime]'));
        //     Metronic.setFlotLabel($('input[name=serviceDropPointTime]'));
        // };
        //Close or Open modal
        BussetCtrl.closeModal = function () {
          
            var modal = $('#add-bus');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        BussetCtrl.openModal = function () {
            var modal = $('#add-bus');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            BussetCtrl.formFields = {};
            var modal = $('#add-bus');
            modal.modal('hide');
        }
        //Delete confirmation box
        BussetCtrl.confirmCallbackMethod = function (index) {
            deleteBusSerice(index);
        };
        //Delete cancel box
        BussetCtrl.confirmCallbackCancel = function () {
            return false;
        };

        function convertToDateTime(time) {
            var currentDT = new Date();
            var hours = time.split(':')[0];
            var minutes = time.split(':')[1];
            return currentDT.setHours(hours, minutes);
        }
        //Delete Action
        var deleteBusSerice = function (index) {
            // alert("kjdshf");
            // console.log(BussetCtrl.busdatails.index);
            if (BussetCtrl.busdatails) {
                // alert("dfjkdsfaaaaaaaaaaa");
                // console.log(BussetCtrl.busdatails[index].id);
                BusSetupService.deleteBusSerice(index).then(function (result) {
                    // console.log(result);
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getBusserviceDetails();
                        (new Init()).getParentData();
                        BussetCtrl.closeModal();
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Busservice. Error Stack' + error);
                });
            }
        };
        //More Details
        BussetCtrl.moreDetails = function (index) {
            BussetCtrl.detailsMode = true;
            BussetCtrl.openModal();
            BussetCtrl.viewValue = BussetCtrl.busserviceList[index];

        };
        //Date Change event
        $('#servicepickup').on('dp.change', function () {
            BussetCtrl.formFields.servicePickupPointTime = $(this).val();
        });
        $('#servicedrop').on('dp.change', function () {
            BussetCtrl.formFields.serviceDropPointTime = $(this).val();
        });
        $('#routetime').on('dp.change', function () {
            BussetCtrl.formFields.routeTime = $(this).val();
        });
        //Close Routes modal
        BussetCtrl.closeRoutesModal = function () {
            var modal = $('#edit-routes');
            modal.modal('hide');
          
            clearformfields();
        };
        //Open Routes modal
        BussetCtrl.openRoutesModal = function () {
            var modal = $('#edit-routes');
            modal.modal('show');
        };
        // A code start
        function initMap() {
            // start
            // var input = document.getElementById('start');
            // var autocomplete = new google.maps.places.Autocomplete(input);

            // // waypoints

            // var input = document.getElementById('waypoints');
            // var autocomplete = new google.maps.places.Autocomplete(input);
            // // end
            // var input = document.getElementById('end');
            // var autocomplete = new google.maps.places.Autocomplete(input);
            // //   ==========================
            // var directionsService = new google.maps.DirectionsService;
            // var directionsDisplay = new google.maps.DirectionsRenderer;
            // var map = new google.maps.Map(document.getElementById('map'), {
            //     zoom: 10,
            //     center: { lat: 17.3850, lng: 78.4867 }
            // });
            // directionsDisplay.setMap(map);

            // document.getElementById('submit').addEventListener('click', function () {
            //     calculateAndDisplayRoute(directionsService, directionsDisplay);
            // });
        }


        var checkboxArray = [];
        //   BussetCtrl.addwaypt = function(){
        //         var checkbxArray = document.getElementById('waypoints').value;
        //         checkboxArray.push(checkbxArray);
        //         alert(checkboxArray);

        //   }

        BussetCtrl.choices = {};
        BussetCtrl.addNewChoiceData = function () {
            // var newItemNo = $scope.choices.length+1;
            // alert("enter");
            var data = {
                waypoints: document.getElementById('waypoints').value,
                pointTime: document.getElementById('pointTime').value,
                pointPrice: document.getElementById('pointPrice').value
            };
            if (data.waypoints != null && data.pointTime != null && data.pointPrice != '') {
                checkboxArray.push({ 'name': data });
                document.getElementById('waypoints').value = "";
                document.getElementById('pointTime').value = "";
                document.getElementById('pointPrice').value = "";
            }
            //alert( JSON.stringify(checkboxArray) );   

            //console.log(JSON.stringify(checkboxArray));
            BussetCtrl.MiddleRoute = checkboxArray
            ////console.log("BussetCtrl.MiddleRoute..."+JSON.stringify(BussetCtrl.MiddleRoute));
            //BussetCtrl.checkbxArray=$scope.choices;
            //alert(JSON.stringify( BussetCtrl.checkbxArray));
        };
        BussetCtrl.deletewaypt = function (name) {
            // var name = BussetCtrl.MiddleRoute.length-1;
            //alert(name);
            BussetCtrl.MiddleRoute.splice(name, 1);

        }


        // $scope.removeChoice = function() {
        //     var lastItem = $scope.choices.length-1;
        //     $scope.choices.splice(lastItem);
        // };

        google.maps.event.addDomListener(window, 'load', initMap);
        initMap();
        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            var waypts = [];
            // var checkboxArray = document.getElementById('waypoints');
            //var checkboxArray = BussetCtrl.checkbxArray;
            //alert(JSON.stringify(checkboxArray) );
            for (var i = 0; i < checkboxArray.length; i++) {
                //if (checkboxArray.id[i]==BussetCtrl.checkbxArray.id) {
                waypts.push({
                    location: checkboxArray[i].name.waypoints,
                    stopover: true
                });
                //console.log("108" + checkboxArray[i].name);
                //console.log("108" + waypts);
                //}
            }
            BussetCtrl.startPoint = document.getElementById('start').value;
            BussetCtrl.endPoint = document.getElementById('end').value;
            //console.log("startPoint.." + JSON.stringify(BussetCtrl.startPoint));
            //console.log("endPoint.." + JSON.stringify(BussetCtrl.endPoint));
            directionsService.route({
                origin: document.getElementById('start').value,
                destination: document.getElementById('end').value,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                    ////console.log("route..."+JSON.stringify(route));
                    var summaryPanel = document.getElementById('directions-panel');
                    summaryPanel.innerHTML = '';
                    // For each route, display summary information.
                    for (var i = 0; i < route.legs.length; i++) {
                        var routeSegment = i + 1;
                        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                            '</b><br>';
                        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                        BussetCtrl.createBusRoute();
                    }
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
        //var serviceNme= BussetCtrl.startPoint;
        //********************************** Create or Update New Record
        // var submitted = false;
        // BussetCtrl.createBusRoute = function (invalid) {
            // if (invalid) {
            //     return;
            // }
            //alert(serviceNme);
            //alert(BussetCtrl.startPoint+'-'+BussetCtrl.endPoint);
            // submitted = true;
            // var data = {
            //     schoolId: BussetCtrl.schoolId,
            //     start: BussetCtrl.startPoint,
            //     MiddleRoute: BussetCtrl.MiddleRoute,
            //     end: BussetCtrl.endPoint,
            //     serviceNo: BussetCtrl.serviceNo,
            //     vehicleNo: BussetCtrl.vehNo,
            //     serviceName: (BussetCtrl.startPoint + '--' + BussetCtrl.endPoint)
            // };
            //alert(serviceName);
            //console.log("496" + JSON.stringify(data));
            // if (submitted) {
            //     BusSetupService.CreateBusService(data).then(function (result) {
            //         if (result) {
                        //Re initialize the data
                        //(new Init()).fnSubjectList();
                        //Close Modal Window
                        //BussetCtrl.closeModal();
                        //Clear Fields
                        // clearformfields();
                        //Show Toast
                    //     toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                    // }

                // }, function (error) {
                    //toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    // //console.log('Error while fetching records. Error stack : ' + JSON.stringify(error));
            //     });
            // }
            // }

            // }
            //$window.location.reload();
        // };

//         BussetCtrl.selectBusData=function(selectvacl){
// console.log(JSON.stringify(selectvacl));
//     selectBus=selectvacl;
//         };
        // BussetCtrl.getMapData = function (route) {
        //     document.getElementById('map').style.display = 'block';
        //     document.getElementById('pointsid').style.display = 'block';
        //     document.getElementById('serviceid').style.display = 'none';
        //     document.getElementById('backid').style.display = 'block';
        //     BussetCtrl.dispData = route;
        //     BussetCtrl.wayData = BussetCtrl.dispData.MiddleRoute;
        //     BussetCtrl.startPoint = route.start;
        //     ////console.log('----------' + JSON.stringify(route));
        //     var waypts = [];
        //     angular.forEach(route.MiddleRoute, function (v, i) {

        //         waypts.push({
        //             location: v.name.waypoints,
        //             stopover: true
        //         });
        //     });

        //     BussetCtrl.waypoints = waypts;
            // //console.log("----"+ JSON.stringify(BussetCtrl.waypoints));
        //     BussetCtrl.endPoint = route.end;
        //     var directionsService = new google.maps.DirectionsService;
        //     var directionsDisplay = new google.maps.DirectionsRenderer;
        //     var map = new google.maps.Map(document.getElementById('map'), {
        //         zoom: 10,
        //         center: { lat: 17.3850, lng: 78.4867 }
        //     });
        //     directionsDisplay.setMap(map);
        //     calculateAndDisplayRouteView(directionsService, directionsDisplay, route, waypts)



        // }
        // function calculateAndDisplayRouteView(directionsService, directionsDisplay, route, waypts) {
        //     directionsService.route({
        //         origin: route.start,
        //         destination: route.end,
        //         waypoints: waypts,
        //         optimizeWaypoints: true,
        //         travelMode: 'DRIVING'
        //     }, function (response, status) {
        //         if (status === 'OK') {
        //             directionsDisplay.setDirections(response);
        //             var route = response.routes[0];
        //             ////console.log("route..."+JSON.stringify(route));
        //             var summaryPanel = document.getElementById('directions-panel');
        //             summaryPanel.innerHTML = '';
        //             // For each route, display summary information.
        //             for (var i = 0; i < route.legs.length; i++) {
        //                 var routeSegment = i + 1;
        //                 summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
        //                     '</b><br>';
        //                 summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        //                 summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        //                 summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        //                 BussetCtrl.createBusRoute();
        //             }
        //         } else {
        //             window.alert('Directions request failed due to ' + status);
        //         }
        //     });
        // };
        BussetCtrl.editbuslist = function(busdata){
            // console.log(busdata);
            var data = busdata;
            // alert("sdhgfds");
          BussetCtrl.formFields = data;
          BussetCtrl.edate = new Date(BussetCtrl.formFields.pollutionExpiryDate);
          BussetCtrl.formFields.pollutionExpiryDate = BussetCtrl.edate;
          BussetCtrl.cdate = new Date(BussetCtrl.formFields.pollutionIssueDate);
          BussetCtrl.formFields.pollutionIssueDate = BussetCtrl.cdate;
          BussetCtrl.ddate = new Date(BussetCtrl.formFields.insuranceExpiryDate);
          BussetCtrl.formFields.insuranceExpiryDate = BussetCtrl.ddate;
        }

        // var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
        // var directionsService = new google.maps.DirectionsService();
        // var map;

        ///////////////////////////// start creating bus by sudheer///////////////////////
        // BussetCtrl.image = {
        //     url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        //     size: [20, 32],
        //     origin: [0,0],
        //     anchor: [0, 32]
        //   };
        //   BussetCtrl.shape = {
        //     coords: [1, 1, 1, 20, 18, 20, 18 , 1],
        //     type: 'poly'
        //   };
        
        // BussetCtrl.placeChanged=function(){
        //    let place = this.getPlace();
        //    var lat = place.geometry.location.lat();
        //    var  lng = place.geometry.location.lng();
        //    var address=place.formatted_address;
        //    console.log(place.name);
        //    BussetCtrl.locationPoints.push({id:BussetCtrl.locationPoints.length+1,name:place.name,position:[lat,lng],selectName:address});
          
        //    BussetCtrl.userselectlocation='';
        // }
        //my code
        // var lat,lng,address,name
        // BussetCtrl.placeChanged=function(){
        //     // alert("dsh");
        //     // BussetCtrl.userselectlocation
        //    let place = this.getPlace();
        //    console.log(place);
        //    name = place.name;
        //    lat = place.geometry.location.lat();
        //    lng = place.geometry.location.lng();
        //    address=place.formatted_address;
        //    BussetCtrl.locationPoints.push({name:address,position:[lat,lng]});
          
        //    BussetCtrl.userselectlocation='';
        // }
        // BussetCtrl.placeChanged1 = function(){
            // alert("gayss");
        //     BussetCtrl.locationPoints.push({id:BussetCtrl.locationPoints.length+1,name:name,position:[lat,lng],selectName:address,Fee:BussetCtrl.userselectlocationFee});
          
        //     BussetCtrl.userselectlocation='';
            
        // }
        BussetCtrl.closeModal1 = function () {
          var modal = $('#edit-Compleint2');
          modal.modal('hide');
          clearformfields();

        }
    
        BussetCtrl.openModal = function () {
          var modal = $('#edit-Compleint');
          modal.modal('show');
    
        };
        // end

        // BussetCtrl.delLocation=function(index){
        //     console.log(index);
        //     BussetCtrl.locationPoints.splice(index,1);
        // };
        // BussetCtrl.showInRoutes=function(){

        // };
        // BussetCtrl.selected=function(){

        // }
        // BussetCtrl.showPointData=function(){
        //     console.log(" BussetCtrl.location"+JSON.stringify(BussetCtrl.location.routePoints))
        //     BussetCtrl.selectedPointsData=angular.copy(BussetCtrl.location.routePoints)
        // }
    //     BussetCtrl.addLocationPoints=function(validation){
    //         if (validation &&  BussetCtrl.locationPoints.length<=0) {
    //             return;
    //         }

    //         BussetCtrl.location.routePoints=BussetCtrl.locationPoints;
    //         BussetCtrl.location.schoolId=BussetCtrl.schoolId;
    //         BussetCtrl.location.serviceNo="2222222222222";
    //         BussetCtrl.location.serviceName='sudheer'

           
    //         if(BussetCtrl.location.id){
              
    //             BusSetupService.updateBusService(BussetCtrl.location).then(function (result) {
    //                 if (result) {
                      
                       
                        
    //                     toastr.success(APP_MESSAGES.INSERT_SUCCESS);
    //                 }
    
    //             }, function (error) {
                  
    //             });
    //         }else{
                
    //    BusSetupService.CreateBusService(BussetCtrl.location).then(function (result) {
    //             if (result) {
                  
                  
                    
    //                 toastr.success(APP_MESSAGES.INSERT_SUCCESS);
    //             }

    //         }, function (error) {
              
    //         });
    //         }
         
    //     }
       
        BussetCtrl.addRoutes=function(invalid){
            if(BussetCtrl.formFields.pollutionIssueDate == null && BussetCtrl.formFields.pollutionExpiryDate == null){
                BussetCtrl.formFields.pollutionIssueDate = "";
                BussetCtrl.formFields.pollutionExpiryDate = "";
            }
        //   alert("hidshjuds");
        //   alert(invalid);
            if (invalid) {
                return;
            }
            
         // console.log(JSON.stringify(BussetCtrl.formFields));
        //  alert("i not comhng");
          BussetCtrl.formFields.schoolId=BussetCtrl.schoolId;
          if(BussetCtrl.editMode){
              
            BusSetupService.updateBus(BussetCtrl.formFields).then(function(result){
              if(result){
                clearformfields();
                BussetCtrl.closeModal1();
                //Show Toast
        (new Init()).getBusDetails();
                
                toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            
              }
            }, function(error){
            //   console.log(error);
            })
          } else {
          BusSetupService.CreateBus(BussetCtrl.formFields).then(function (result) {
            // console.log(result);
            if (result) {

                //Re initialize the data
                //(new Init()).fnSubjectList();
                //Close Modal Window
                //BussetCtrl.closeModal();
                //Clear Fields
                clearformfields();
                BussetCtrl.closeModal1();
                //Show Toast
        (new Init()).getBusDetails();
        (new Init()).getParentData();
                toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            }

        }, function (error) {
            //toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            // //console.log('Error while fetching records. Error stack : ' + JSON.stringify(error));
        });
      }
        }

        // BussetCtrl.addPointeRoutes=function(invalid){
        //     if (invalid) {
        //         return;
        //     }
        //  // console.log(JSON.stringify(BussetCtrl.formFields));
        //  BussetCtrl.formroutesFields.schoolId=BussetCtrl.schoolId;
        //  BussetCtrl.formroutesFields.busId=selectBus.id;
        //  BussetCtrl.formroutesFields.busNo=selectBus.busNo;
        //  BussetCtrl.formroutesFields.pointDetails=BussetCtrl.selectedpoints;
        //  BussetCtrl.formroutesFields.pickupLocation="sssaaa";
        //  console.log(JSON.stringify(BussetCtrl.formroutesFields))
        //   BusSetupService.CreateBusroutes(BussetCtrl.formroutesFields).then(function (result) {
        //     if (result) {
        //       console.log("result"+JSON.stringify(result));
               
        //     }

        // }, function (error) {
           
        // });
        // }


        // BussetCtrl.theWaypoints=[];
        // BussetCtrl.viewRoute=function(index,data){
        //     console.log(JSON.stringify(data));
        //     BussetCtrl.pointsData=data.pointDetails;
        //     BussetCtrl.startPosition=data.pointDetails[0].position;
        //     BussetCtrl.endPosition=data.pointDetails[data.pointDetails.length-1].position;
        //     for (var i = 1; i < data.pointDetails.length - 1; i++ ){
        //         var obj = {
        //           location:{
        //             lat: data.pointDetails[i].position[0],
        //             lng: data.pointDetails[i].position[1]
        //           },
        //             stopover: true
        //           };
        //           BussetCtrl.theWaypoints.push(obj);
        //           console.log(JSON.stringify(BussetCtrl.theWaypoints))
        //       }
        // };
       ///////////////////////////// end creating bus by sudheer///////////////////////
       BussetCtrl.ValidateEndDate = function () {
        $("#pollutiondate2").change(function () {

            var startDate = document.getElementById("pollutiondate2").value;
            var endDate = document.getElementById("pollutiondate1").value;

            if ((Date.parse(endDate) < Date.parse(startDate))) {
                alert("End date should be greater than Start date");
                document.getElementById("pollutiondate2").value = "";
            }
        });

        $("#pollutiondate1").change(function () {

            var startDate = document.getElementById("pollutiondate2").value;
            var endDate = document.getElementById("pollutiondate1").value;

            if ((Date.parse(endDate) < Date.parse(startDate))) {
                alert("End date should be greater than Start date");
                document.getElementById("pollutiondate1").value = "";
            }
        });
    }
    });
