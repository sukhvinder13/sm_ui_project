'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BussubscriptionControllerCtrl
 * @description
 * # BussubscriptionControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('BussubscriptionController', function (BussubscriptionService, $cookies, $timeout, toastr, APP_MESSAGES, generateexcelFactory, busLiveService, BusserviceService) {
        var BussubscriptionCtrl = this;
        var trakingurl = "http://23.239.2.100/vts/index.php/sessions/login"
        BussubscriptionCtrl.detailsMode = false;
        BussubscriptionCtrl.viewValue = {};
        //defaults
        BussubscriptionCtrl.value = null;
        //Get Bussubscription details by School ID
        BussubscriptionCtrl.schoolId = $cookies.getObject('uds').schoolId;
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Bus Subscription") {
                BussubscriptionCtrl.VehicleroleView = roleAccess[0].RolesData[i].view;
                BussubscriptionCtrl.VehicleroleEdit = roleAccess[0].RolesData[i].edit;
                BussubscriptionCtrl.VehicleroleView = roleAccess[0].RolesData[i].delete;
            }

        }
        function Init() {

            this.getRoutesDetails = function () {

                BusserviceService.getRoutesDetailsBySchooleId(BussubscriptionCtrl.schoolId).then(function (response) {
                    ////console.log(classId);    
                    if (response) {
                        BussubscriptionCtrl.getRoutesPointList = response.data;
                        //console.log("BusserviceCtrl.getRoutesPointList",JSON.stringify(response))
                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });

            };

        }
        (new Init()).getRoutesDetails();


        //Initialize the Table Component
        //Close or Open modal

        //Clear Fields

        //Delete confirmation box
        BussubscriptionCtrl.confirmCallbackMethod = function (index) {
            deleteBussubscription(index);
        };
        //Delete cancel box
        BussubscriptionCtrl.confirmCallbackCancel = function () {
            return false;
        };
        // Add Action
        BussubscriptionCtrl.deleteBussubscription = function (index) {
            if (BussubscriptionCtrl.getRoutesPointList) {
                // alert("dfjkdsfaaaaaaaaaaa");
                // console.log(BussubscriptionListCtrl.busdatails[index].id);
                BussubscriptionService.deleteBussubscription(index).then(function (result) {
                    // console.log(result);
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getBusserviceDetails();
                        (new Init()).getParentData();
                        BussubscriptionListCtrl.closeModal();
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Busservice. Error Stack' + error);
                });
            }
        }

        //Bind Value to Routes

        //Export to Excel
        BussubscriptionCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'library Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        BussubscriptionCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            BussubscriptionCtrl.newWin = window.open("");
            BussubscriptionCtrl.newWin.document.write(divToPrint.outerHTML);
            BussubscriptionCtrl.newWin.print();
            BussubscriptionCtrl.newWin.close();
        }

        //End Print View
    })
    .controller('BussubscriptionListController', function (BussubscriptionService, $stateParams, $window, $cookies, $timeout, toastr, APP_MESSAGES, generateexcelFactory, busLiveService, BusserviceService, classService, addStudentService) {
        var BussubscriptionListCtrl = this;
        BussubscriptionListCtrl.schoolId = $cookies.getObject('uds').schoolId;
        BussubscriptionListCtrl.busserviceList = {};
        BussubscriptionListCtrl.busserviceList = [];
        BussubscriptionListCtrl.busSubscriptionData = {};
        BussubscriptionListCtrl.saveSubscription = {
            "schoolId": BussubscriptionListCtrl.schoolId
        };

        var servicesId = $stateParams.servicesId;
        var busId = $stateParams.busId;
        function Init() {

            this.getClassDetails = function () {

                classService.findClassBySchoolId(BussubscriptionListCtrl.schoolId).then(function (response) {
                    if (response) {
                        BussubscriptionListCtrl.schoolList = response;
                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });

            };
            this.getBusserviceDetails = function () {
                BusserviceService.getBusserviceDetailsBySchoolId(servicesId).then(function (result) {
                    if (result) {
                        console.log(result);
                        BussubscriptionListCtrl.busserviceList = result.data.routePoints;


                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
            this.getBusSubscriptionList = function () {
                BussubscriptionService.getBusSubscDetails(servicesId).then(function (result) {
                    if (result) {
                        BussubscriptionListCtrl.busSubscrList = result.data;
                        console.log(BussubscriptionListCtrl.busSubscrList);


                    }
                }, function (error) {
                    //console.log('Error while fetching the Busservice records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getClassDetails();
        (new Init()).getBusserviceDetails();
        (new Init()).getBusSubscriptionList();
        var classData, studentData, pickpoint;
        BussubscriptionListCtrl.selectClass = function (data) {

            classData = data;
            getStudent(data)

        };
        BussubscriptionListCtrl.confirmCallbackMethod = function (index, id) {
            BussubscriptionListCtrl.delRec(index, id);
        };
        //Delete cancel box
        BussubscriptionListCtrl.confirmCallbackCancel = function (index) {
            return false;
        };
        BussubscriptionListCtrl.delRec = function (index, id) {
            // alert("sddhddshdd");
            if (BussubscriptionListCtrl.busSubscrList) {
                // alert("dfjkdsfaaaaaaaaaaa");
                // console.log(BussubscriptionListCtrl.busdatails[index].id);
                BussubscriptionService.deleteBusSerice(index, id).then(function (result) {
                    // console.log(result);
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getClassDetails();
                        (new Init()).getBusserviceDetails();
                        (new Init()).getBusSubscriptionList();
                        // (new Init()).getParentData();
                        // BussubscriptionListCtrl.closeModal();
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Busservice. Error Stack' + error);
                });
            }
        }

        function getStudent(classId) {
            console.log(classId);
            addStudentService.getStudentDetailsByClassId(classId).then(function (response) {
                if (response) {


                    BussubscriptionListCtrl.studentList = response;
                }
            }, function (error) {
            });
        };

        BussubscriptionListCtrl.selectStudent = function (data) {
            studentData = data;

        };
        BussubscriptionListCtrl.selectPickPoint = function (selectpoint) {
            pickpoint = selectpoint;
            BussubscriptionListCtrl.dsblAddButton=true;
        };

        BussubscriptionListCtrl.addToList = function () {
            BussubscriptionListCtrl.dsblAddButton=false;
            BussubscriptionListCtrl.busSubscriptionData['schoolId'] = BussubscriptionListCtrl.schoolId;
            BussubscriptionListCtrl.busSubscriptionData['pickupLocation'] = pickpoint.name;
            BussubscriptionListCtrl.busSubscriptionData['serviceId'] = servicesId;
            BussubscriptionListCtrl.busSubscriptionData['busId'] = busId;
            BussubscriptionListCtrl.busSubscriptionData['pickupDetails'] = {
                "pickUpTime": pickpoint.pickUpTime,
                "fee": pickpoint.fee,
                "lat": pickpoint.lat,
                "log": pickpoint.log
            };

            //console.log("BussubscriptionListCtrl.saveSubscription"+JSON.stringify(BussubscriptionListCtrl.saveSubscription));

            BussubscriptionService.CreateBussubscription(BussubscriptionListCtrl.busSubscriptionData).then(function (result) {
                console.log(BussubscriptionListCtrl.busSubscriptionData);
                if (result) {
                    //  BussubscriptionListCtrl.busserviceList = result.data;
                    BussubscriptionListCtrl.clearfileds();
                    // alert("Record Created");
                    BussubscriptionListCtrl.closeModal1();
                    (new Init()).getClassDetails();
                    (new Init()).getBusserviceDetails();
                    (new Init()).getBusSubscriptionList();
                }
            }, function (error) {
                console.log('Error while fetching the Busservice records. Error stack : ' + JSON.stringify(error));
                if (error.data.error.message == 'Seats not available for current bus') {
                    toastr.error('Seats not available for current bus');
                } else if (error.data.error.code == 'alreadysubscribed') {
                    toastr.error('Student alredy subscribed');
                }

            });

        }
        BussubscriptionListCtrl.clearfileds = function () {
            BussubscriptionListCtrl.busserviceList.servicesId = "";
            BussubscriptionListCtrl.busSubscriptionData.studentId = "";
            BussubscriptionListCtrl.busSubscriptionData.classId = "";

        }
        BussubscriptionListCtrl.addRoutes = function (service) {
            console.log(BussubscriptionListCtrl.busserviceList);
            BussubscriptionListCtrl.busserviceList.map(function (item) {
                if (item.name === service.pickupLocation) {
                    BussubscriptionListCtrl.busserviceList.servicesId = item;
                }
            })
            var data = service;
            BussubscriptionListCtrl.editBusSubscriptionData = data;
            //    BussubscriptionListCtrl.busserviceList.servicesId  = data;
            //    console.log(BussubscriptionListCtrl.busserviceList.servicesId);
            //    BussubscriptionListCtrl.busserviceList  = data;
            BussubscriptionListCtrl.selectClass(BussubscriptionListCtrl.editBusSubscriptionData.classId);
            // BussubscriptionListCtrl.busserviceList.servicesId = service.serviceId;
        }
        BussubscriptionListCtrl.closeModal1 = function () {
            var modal = $('#edit-Compleint2');
            modal.modal('hide');
            $window.location.reload();
            BussubscriptionListCtrl.clearfileds();
        }

        BussubscriptionListCtrl.openModal = function () {
            var modal = $('#edit-Compleint');
            modal.modal('show');

        };

        BussubscriptionListCtrl.addToList1 = function (data) {
            console.log(BussubscriptionListCtrl.busserviceList.servicesId);
            //   return;
            BussubscriptionListCtrl.editBusSubscriptionData['pickupLocation'] = pickpoint.name;
            BussubscriptionListCtrl.editBusSubscriptionData['serviceId'] = servicesId;

            BussubscriptionListCtrl.editBusSubscriptionData['pickupDetails'] = {
                "pickUpTime": pickpoint.pickUpTime,
                "fee": pickpoint.fee,
                "lat": pickpoint.lat,
                "log": pickpoint.log
            };


            //console.log("BussubscriptionListCtrl.saveSubscription"+JSON.stringify(BussubscriptionListCtrl.saveSubscription));

            BussubscriptionService.EDitBussubscription(BussubscriptionListCtrl.editBusSubscriptionData).then(function (result) {
                if (result) {

                    //  BussubscriptionListCtrl.busserviceList = result.data;
                    $window.location.reload();
                    BussubscriptionListCtrl.closeModal1();
                    //    console.log(BussubscriptionListCtrl.busSubscriptionData.id);
                    //    BussubscriptionListCtrl.busSubscriptionData.id="";
                    BussubscriptionListCtrl.clearfileds();           // alert("Record Created");
                    (new Init()).getClassDetails();
                    (new Init()).getBusserviceDetails();
                    (new Init()).getBusSubscriptionList();
                }
            }, function (error) {
                //  console.log('Error while fetching the Busservice records. Error stack : ' + error);
            });

        }
    })