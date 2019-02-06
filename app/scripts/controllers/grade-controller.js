'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:GradeControllerCtrl
 * @description
 * # GradeControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('GradeController', function (gradeService, $cookies, $timeout, toastr, APP_MESSAGES, generateexcelFactory) {
        var GradeCtrl = this;
        GradeCtrl.formFields = {};
        GradeCtrl.editmode = false;
        GradeCtrl.detailsMode = false;
        GradeCtrl.viewValue = {};
        //Get Grade details by School ID
        GradeCtrl.schoolId = $cookies.getObject('uds').schoolId;
   var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
 
      for(var i = 0; i<roleAccess[0].RolesData.length;i++){
          if(roleAccess[0].RolesData[i].name === "Grade Configuration"){
            GradeCtrl.roleView = roleAccess[0].RolesData[i].view;
            GradeCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
            GradeCtrl.roledelete = roleAccess[0].RolesData[i].delete;
          }
          
      }
        function Init() {
            this.getGradeList = function () {
                gradeService.getGradeDetailsBySchoolId(GradeCtrl.schoolId).then(function (result) {
                    if (result) {
                        GradeCtrl.gradeList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching library records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getGradeList();

        //Close or Open modal
        GradeCtrl.closeModal = function () {
            var modal = $('#edit-grades');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        GradeCtrl.openModal = function () {
            var modal = $('#edit-grades');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            GradeCtrl.formFields = {};
        }
        //Delete confirmation box
        GradeCtrl.confirmCallbackMethod = function (index) {
            deleteGrade(index);
        };
        //Delete cancel box
        GradeCtrl.confirmCallbackCancel = function () {
            return false;
        };
        // Add Action
        GradeCtrl.gradeAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: GradeCtrl.schoolId,
                gradeName: GradeCtrl.formFields.gradeName,
                gradePoint: GradeCtrl.formFields.gradePoint,
                percentageRangeFrom: GradeCtrl.formFields.percentageRangeFrom,
                percentageRangeTo: GradeCtrl.formFields.percentageRangeTo
            };
            if (data) {
                //Check whether editmode or normal mode
                if (!GradeCtrl.editmode) {
                    gradeService.getExistingGrades(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            //console.log.log('data already exists');
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            gradeService.CreateOrUpdateGrade(data).then(function (res) {
                                if (res) {
                                    (new Init()).getGradeList();
                                    GradeCtrl.closeModal();
                                    //Show Toast Message Success
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                }

                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log.log('Error while Fetching the Records' + error);
                            });
                        }
                    });
                }
                else {
                    data.id = GradeCtrl.editingGradeId;
                    gradeService.editGrade(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getGradeList();
                            //Close Modal
                            GradeCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                        //console.log.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };
        //More Details
        GradeCtrl.moreDetails = function (index) {
            GradeCtrl.detailsMode = true;
            GradeCtrl.openModal();
            GradeCtrl.viewValue = GradeCtrl.gradeList[index];
        };
        //Delete Action
        var deleteGrade = function (index) {
            if (GradeCtrl.gradeList) {
                gradeService.deleteGrade(GradeCtrl.gradeList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getGradeList();
                        GradeCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting grade. Error Stack' + error);
                });
            }
        };
        //Edit Action
        GradeCtrl.editGrade = function (index) {
            GradeCtrl.formFields.gradeName = GradeCtrl.gradeList[index].gradeName;
            GradeCtrl.formFields.gradePoint = GradeCtrl.gradeList[index].gradePoint;
            GradeCtrl.formFields.percentageRangeFrom = GradeCtrl.gradeList[index].percentageRangeFrom;
            GradeCtrl.formFields.percentageRangeTo = GradeCtrl.gradeList[index].percentageRangeTo;
            GradeCtrl.editingGradeId = GradeCtrl.gradeList[index].id;
            //Set View Mode false
            GradeCtrl.detailsMode = false;
            //Open Modal
            GradeCtrl.openModal();
            $timeout(function () {
                GradeCtrl.setFloatLabel();
                //Enable Edit Mode
                GradeCtrl.editmode = true;
            });
        };
        //Setting up float label
        GradeCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=gradeName]'));
            Metronic.setFlotLabel($('input[name=gradePoint]'));
            Metronic.setFlotLabel($('input[name=percentageRangeFrom]'));
            Metronic.setFlotLabel($('input[name=percentageRangeTo]'));

        };
        //Export to Excel
        GradeCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Grade Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
          //Bhasha Print View
        GradeCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            GradeCtrl.newWin = window.open("");
            GradeCtrl.newWin.document.write(divToPrint.outerHTML);
            GradeCtrl.newWin.print();
            GradeCtrl.newWin.close();
        }

        //End Print View
    });
