'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BusserviceControllerCtrl
 * @description
 * # BusserviceControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('BusserviceController', function ($rootScope, $window, BusserviceService, $cookies, $timeout, $state,$stateParams, APP_MESSAGES, toastr, generateexcelFactory, $scope) {
        var BusserviceCtrl = this;

        BusserviceCtrl.schoolId = $cookies.getObject('uds').schoolId;
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
    // console.log(roleAccess);

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Bus Services") {

        BusserviceCtrl.roleView = roleAccess[0].RolesData[i].view;
        BusserviceCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        BusserviceCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }


    }
        function Init() {
            this.getBusserviceDetails = function () {
                BusserviceService.getBusserviceDetailsBySchoolId(BusserviceCtrl.schoolId).then(function (result) {
                    if (result) {
                        BusserviceCtrl.busserviceList = result;
                        //  console.log("bus data "+JSON.stringify(BusserviceCtrl.busserviceList));
                        if (BusserviceCtrl.busserviceList.length > 0) {
                            BusserviceCtrl.location = BusserviceCtrl.busserviceList;
                            console.log(" BusserviceCtrl.location" + JSON.stringify(BusserviceCtrl.location));
                            //console.log(BusserviceCtrl.busserviceList[0].routePoints);
                            //BusserviceCtrl.locationPoints.concat(BusserviceCtrl.busserviceList[0].routePoints);
                            //   BusserviceCtrl.locationPoints=angular.copy(BusserviceCtrl.busserviceList[0].routePoints);

                        }
                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
            this.getBusDetails = function () {
                // console.log(BusserviceCtrl.schoolId)
                BusserviceService.getBusDetailsBySchoolId(BusserviceCtrl.schoolId).then(function (result) {
                    if (result) {
                        BusserviceCtrl.busList = result;
                        // console.log(BusserviceCtrl.busList);
                        // alert(JSON.stringify(BusserviceCtrl.busList));
                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
            this.getvehicle = function () {
                BusserviceService.getVehicleDetailsbySchoolId(BusserviceCtrl.schoolId).then(function (response) {
                    ////console.log(classId);    
                    if (response) {
                        BusserviceCtrl.serviceList = response;
                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });

            };
            this.getRoutesDetails = function () {
                BusserviceService.getRoutesDetailsBySchooleId(BusserviceCtrl.schoolId).then(function (response) {
                    ////console.log(classId);    
                    if (response) {
                        BusserviceCtrl.getRoutesPointList = response.data;
                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });

            };

        }
        (new Init()).getvehicle();
        (new Init()).getBusserviceDetails();
        (new Init()).getBusDetails();
        (new Init()).getRoutesDetails();
        BusserviceCtrl.confirmCallbackMethod = function (index) {
            // alert(index);
            // alert("i am");
            BusserviceCtrl.deleteBusSerice(index);
        };
        //Delete cancel box
        BusserviceCtrl.confirmCallbackCancel = function () {
            return false;
        };
        BusserviceCtrl.deleteBusSerice = function (index) {
            if (BusserviceCtrl.getRoutesPointList) {
                // alert("dfjkdsfaaaaaaaaaaa");
                // console.log(BussetCtrl.busdatails[index].id);
                BusserviceService.deleteBusSerice(index).then(function (result) {
                    // console.log(result);
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getvehicle();
                        (new Init()).getBusserviceDetails();
                        (new Init()).getBusDetails();
                        (new Init()).getRoutesDetails();
                        // (new Init()).getParentData();
                        // BussetCtrl.closeModal();
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Busservice. Error Stack' + error);
                });
            }
        }

        ///////////////////////////// end creating bus by sudheer///////////////////////
    }).controller('AddBusserviceController', function ($rootScope, $window, $location, BusserviceService, BusSetupService, $cookies, $timeout, $state, APP_MESSAGES, toastr, generateexcelFactory, $stateParams, $scope) {
        var BusserviceCtrl = this;
        var servicesId = $stateParams.servicesId;
        BusserviceCtrl.busserviceList = {
            routePoints: []
        };
        BusserviceCtrl.latlogpoint='';
        BusserviceCtrl.address="location";
        BusserviceCtrl.theWaypoints = [];
        BusserviceCtrl.schoolId = $cookies.getObject('uds').schoolId;
        // console.log($stateParams.map);
        BusserviceCtrl.mapValue=$stateParams.map;
        function Init() {
            this.getBusserviceDetails = function () {
                BusserviceService.getBusserviceDetailsBySchoolId(servicesId).then(function (result) {
                    if (result) {
                        console.log(result);
                        BusserviceCtrl.busserviceList = result.data;
                        // BusserviceCtrl.date = new date(BusserviceCtrl.busserviceList.pickupStartTime);
                        // BusserviceCtrl.busserviceList.pickupStartTime = BusserviceCtrl.date;
                        BusserviceCtrl.busserviceList["pickupStartTime"]=new Date(result.data.pickupStartTime);
                        BusserviceCtrl.busserviceList["pickupEndTime"]=new Date(result.data.pickupEndTime);
                        BusserviceCtrl.busserviceList["dropStartTime"]=new Date(result.data.dropStartTime);
                        BusserviceCtrl.busserviceList["dropEndTime"]=new Date(result.data.dropEndTime);
                        BusserviceCtrl.startPos = BusserviceCtrl.busserviceList.routePoints[0];
                        BusserviceCtrl.endPos = BusserviceCtrl.busserviceList.routePoints[BusserviceCtrl.busserviceList.routePoints.length - 1];

                        BusserviceCtrl.busserviceList.routePoints.length > 0 ? updateMapByDel() : null;


                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
            this.getBussDetailsBySchoolId = function () {
                BusSetupService.getParentData(BusserviceCtrl.schoolId).then(function (result) {
                    if (result) {
                       
                        BusserviceCtrl.busList = result.data;
                        console.log(BusserviceCtrl.busList);


                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
    

        }
        (new Init()).getBusserviceDetails();
        (new Init()).getBussDetailsBySchoolId();


        servicesId !=="addServices"?(new Init()).getBusserviceDetails():null;
        // (new Init()).getBussDetailsBySchoolId()
        var lat, lng, address, name, index;


        function updateMapByDel() {
            for (var i = 1; i < BusserviceCtrl.busserviceList.routePoints.length - 1; i++) {
                var obj = {
                    location: {
                        lat: BusserviceCtrl.busserviceList.routePoints[i].lat,
                        lng: BusserviceCtrl.busserviceList.routePoints[i].log
                    },
                    stopover: true
                };
                BusserviceCtrl.theWaypoints.push(obj);
            }
        }
       
        BusserviceCtrl.placeChanged = function (data) {
            var place = this.getPlace();
            name = place.name;
            address=place.formatted_address
            lat = place.geometry.location.lat();
            lng = place.geometry.location.lng();


        };
        BusserviceCtrl.selectBusData=function(data){
// console.log(data);
BusserviceCtrl.busList.map(function(item){
    if(item.vehicleNo == data){
        BusserviceCtrl.busserviceList.IMEINo = item.IMEINo;
        // console.log(item);
    }
})
         var busDetails= BusserviceCtrl.busList.filter(function(bus) {
             console.log(busDetails);
            // BusserviceCtrl.busserviceList.IMEINo = 
                    return bus.vehicleNo == data;
                });
                
            BusserviceCtrl.busserviceList.busNo=data;
            BusserviceCtrl.busserviceList.busId=busDetails[0].id;
            
            

        };
        BusserviceCtrl.delRec=function(index){
            var txt;
            if (confirm("Are Sure Want To Delete")) {
                index=index;
                BusserviceCtrl.busserviceList.routePoints.splice(index,1);
                // console.log(index)
    
                updateMapByDel();
            } else {
                // txt = "You pressed Cancel!";
            }
            // index=index;
            // BusserviceCtrl.busserviceList.routePoints.splice(index,1);
            // // console.log(index)

            // updateMapByDel();
            
        };

        BusserviceCtrl.addToList = function (time, fee) {
            // console.log(BusserviceCtrl.busserviceList.routePoints)
            console.log(time);

          
            if(BusserviceCtrl.address=="location"){
                console.log(name);
                if(name){
                BusserviceCtrl.busserviceList.routePoints.push({ name: name,address:address ,pickUpTime: time, fee: fee, lat: lat, log: lng });
                updateMapByDel();
                BusserviceCtrl.clearfieldas();
                } else {
                    alert("Please Enter Correct Address");
                }
            }else{
               
                BusSetupService.getAreaNameByPoint(BusserviceCtrl.latlogpoint).then(function (result) {
                    if (result) {
                     //   BusserviceCtrl.busList = result.data;
          
                    if(result.data.results.length > 0){
                        var locationData=result.data.results[0];
                        console.log(locationData);
                       
                        BusserviceCtrl.busserviceList.routePoints.push({ name: locationData.formatted_address,address:locationData.formatted_address ,pickUpTime: time, fee: fee, lat:locationData.geometry.location.lat, log: locationData.geometry.location.lng });
                        updateMapByDel();
                        BusserviceCtrl.clearfieldas();
                    }

                    }else{
                        alert("Enter valid lat and log point Ex:17.4980408, 78.3346006");
                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            }
            
            // console.log(lat,lng,name)
        };
      
        BusserviceCtrl.clearfieldas = function () {
            // alert("saddf");
            $scope.place = null;
            $scope.time = "";
            $scope.fee = "";
            name = undefined;
            BusserviceCtrl.latlogpoint = "";
            BusserviceCtrl.address = "points";
            $timeout(function(){
            BusserviceCtrl.address = "location";
            },500);
        }

        BusserviceCtrl.updateRecord = function () {
            if (BusserviceCtrl.busserviceList.id) {
console.log(BusserviceCtrl.busserviceList);
var imei = BusserviceCtrl.busList[0].IMEINo;
console.log(imei);
                BusserviceService.updateBusServicesRecord(BusserviceCtrl.busserviceList).then(function (result) {
                    if (result) {
                        // BusserviceCtrl.busList = result.data;

                        alert("Record updates");

                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            } else {
                BusserviceCtrl.busserviceList.schoolId = BusserviceCtrl.schoolId;
                BusserviceService.createBusServicesRecord(BusserviceCtrl.busserviceList).then(function (result) {
                    if (result) {
                        // BusserviceCtrl.busList = result.data;
                        //console.log("result.id" + JSON.stringify(result))
                        alert("Record Created");
                        // console.log($location.url('/busservice/routes/' + result.data.id +'/'+1));
                        $location.url('/busservice/routes/' + result.data.id +'/'+1);
                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            }

        };
        BusserviceCtrl.convertIntoTime = function(data){
            if(data.pickUpTime){
                data.pickUpTime = new Date(data.pickUpTime);
            }
           };
        ///////////////////////////// end creating bus by sudheer///////////////////////

    });
