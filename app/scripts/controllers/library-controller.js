'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:LibraryControllerCtrl
 * @description
 * # LibraryControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('LibraryController', function (libraryService, $cookies,$scope, $timeout, APP_MESSAGES, toastr, generateexcelFactory) {
        var LibraryCtrl = this;
        LibraryCtrl.formFields = {};
        LibraryCtrl.editmode = false;
        LibraryCtrl.circulationMode = false;
        LibraryCtrl.detailsMode = false;
        LibraryCtrl.viewValue = {};
   var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
   
      for(var i = 0; i<roleAccess[0].RolesData.length;i++){
          if(roleAccess[0].RolesData[i].name === "Library"){
            LibraryCtrl.roleView = roleAccess[0].RolesData[i].view;
            LibraryCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
            LibraryCtrl.roledelete = roleAccess[0].RolesData[i].delete;
          }
          
      }

        LibraryCtrl.schoolId = $cookies.getObject('uds').schoolId;
        function Init() {
            this.getLibraryList = function () {
                libraryService.getLibraryBySchoolId(LibraryCtrl.schoolId).then(function (result) {
                    if (result) {
                        LibraryCtrl.libraryList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching library records. Error stack : ' + error);
                });
            };
            this.getClassList = function () {
                libraryService.getClassDetailsBySchoolId(LibraryCtrl.schoolId).then(function (result) {
                    if (result) {
                        LibraryCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching library records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getLibraryList();
        (new Init()).getClassList();
        //Initialize the Table Component
       
        //Close or Open modal
        LibraryCtrl.closeModal = function () {
            var modal = $('#edit-library');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        LibraryCtrl.openModal = function () {
            var modal = $('#edit-library');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            LibraryCtrl.formFields = {};
        }
        //Delete confirmation box
        LibraryCtrl.confirmCallbackMethod = function (index) {
            deleteLibrary(index);
        };
        //Delete cancel box
        LibraryCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        // Add Action
         $scope.first = true;
        LibraryCtrl.libraryAction = function (invalid) {
              var message = formValidations();
          if (message != undefined && message.trim().length > 1) {
                alert(message);
                return;
            }
        $scope.first = !$scope.first;
            if (invalid) {
                return;
            }
            var data = {
                schoolId: LibraryCtrl.schoolId,
                name: LibraryCtrl.formFields.name,
                author: LibraryCtrl.formFields.author,
                description: LibraryCtrl.formFields.description,
                price: LibraryCtrl.formFields.price,
                available: LibraryCtrl.formFields.available,
                classId: LibraryCtrl.formFields.classId,
                studentId: LibraryCtrl.formFields.studentId,
                issuedbooks: LibraryCtrl.formFields.issuedbooks
            };
            if (data) {
                //Check whether editmode or normal mode
                if (!LibraryCtrl.editmode) {
                    libraryService.getExistingLibraryRecords(data).then(function (result) {
                        if (result) {
                            //console.log.log('data already exists');
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            $scope.first = !$scope.first;
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            libraryService.CreateOrUpdateLibrary(data).then(function (res) {
                                if (res) {
                                    (new Init()).getLibraryList();
                                    LibraryCtrl.closeModal();
                                    window.location.reload();
                                    //Show Toast Message Success
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                    $scope.first = !$scope.first;
                                }

                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                $scope.first = !$scope.first;
                                //console.log.log('Error while Fetching the Records' + error);
                            });
                        }
                    });
                }
                if (LibraryCtrl.circulationMode) {
                    data.id = LibraryCtrl.id;
                    libraryService.CreateOrUpdateCirculation(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getLibraryList();
                            //Close Modal
                            LibraryCtrl.closeModal();
                             window.location.reload();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                            $scope.first = !$scope.first;
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        $scope.first = !$scope.first;
                        //console.log.log('Error while creating or updating records. Error stack' + error);
                    });
                }
                else {
                    data.id = LibraryCtrl.id;
                    libraryService.editLibrary(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getLibraryList();
                            //Close Modal
                            LibraryCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                            $scope.first = !$scope.first;
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        $scope.first = !$scope.first;
                        //console.log.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };
        //Delete Action
        var deleteLibrary = function (index) {
            if (LibraryCtrl.libraryList) {
                libraryService.deleteLibrary(LibraryCtrl.libraryList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getLibraryList();
                        LibraryCtrl.closeModal();
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting class. Error Stack' + error);
                });
            }
        };
        //Edit Action
        LibraryCtrl.editLibrary = function (index) {
            LibraryCtrl.formFields.name = LibraryCtrl.libraryList[index].name;
            LibraryCtrl.formFields.author = LibraryCtrl.libraryList[index].author;
            LibraryCtrl.formFields.description = LibraryCtrl.libraryList[index].description;
            LibraryCtrl.formFields.price = LibraryCtrl.libraryList[index].price;
            LibraryCtrl.formFields.available = LibraryCtrl.libraryList[index].available;
            LibraryCtrl.id = LibraryCtrl.libraryList[index].id;
            //Set View Mode false
            LibraryCtrl.detailsMode = false;
            //Open Modal
            LibraryCtrl.openModal();

            $timeout(function () {

                LibraryCtrl.setFloatLabel();
                //Enable Edit Mode
                LibraryCtrl.editmode = true;
            });

        };
        //Setting up float label
        LibraryCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=name]'));
            Metronic.setFlotLabel($('input[name=author]'));
            Metronic.setFlotLabel($('input[name=description]'));
            Metronic.setFlotLabel($('input[name=price]'));
            Metronic.setFlotLabel($('input[name=available]'));
            Metronic.setFlotLabel($('input[name=classId]'));
            Metronic.setFlotLabel($('input[name=studentId]'));
        };
        //More Details
        LibraryCtrl.moreDetails = function (index) {
            LibraryCtrl.detailsMode = true;
            LibraryCtrl.openModal();
            LibraryCtrl.viewValue = LibraryCtrl.libraryList[index];

        };
        //More Details
        LibraryCtrl.circulation = function (index) {
            LibraryCtrl.circulationMode = true;
            LibraryCtrl.openModal();
            LibraryCtrl.formFields.name = LibraryCtrl.libraryList[index].name;
            LibraryCtrl.formFields.author = LibraryCtrl.libraryList[index].author;
            LibraryCtrl.formFields.description = LibraryCtrl.libraryList[index].description;
            LibraryCtrl.formFields.price = LibraryCtrl.libraryList[index].price;
            LibraryCtrl.formFields.available = LibraryCtrl.libraryList[index].available;
            LibraryCtrl.id = LibraryCtrl.libraryList[index].id;
        };
         //Export to Excel
        LibraryCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        LibraryCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            LibraryCtrl.newWin = window.open("");
            LibraryCtrl.newWin.document.write(divToPrint.outerHTML);
            LibraryCtrl.newWin.print();
            LibraryCtrl.newWin.close();
        }

        //End Print View
        //Get Students based on Selected Classes
        LibraryCtrl.selectedClass = function () {
            if (LibraryCtrl.formFields.classId) {
                libraryService.getStudentsByClassId(LibraryCtrl.formFields.classId).then(function (result) {
                    if (result) {
                        LibraryCtrl.studentList = result;
                    }
                });
            }
        };
        //Getting Remaining issuedbooks
        LibraryCtrl.getremaining = function () {
             LibraryCtrl.Remaining = LibraryCtrl.formFields.available - LibraryCtrl.formFields.issuedbooks;
        };
        function formValidations() {
            if (LibraryCtrl.formFields.name == undefined)
                return 'Please Enter Book Name';
          
            if (LibraryCtrl.formFields.author== undefined)
                return 'Please Enter Author Name  ';
             if (LibraryCtrl.formFields.description == undefined)
                return 'Please Enter DEscription ';
          
            if (LibraryCtrl.formFields.price== undefined)
                return 'Please Select TO Date';

            if (LibraryCtrl.formFields.available== undefined)
                return 'Please Select No of Books available';

            return undefined;
        }
    });
