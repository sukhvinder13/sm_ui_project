'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ExamtypeControllerCtrl
 * @description
 * # ExamtypeControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ExamtypeControllerCtrl', function (ExamTypeService, $cookies, $timeout, APP_MESSAGES, toastr, generateexcelFactory) {
        var ExamtypeCtrl = this;

        ExamtypeCtrl.schoolId = $cookies.getObject('uds').schoolId;
        ExamtypeCtrl.formFields = {};
        ExamtypeCtrl.editmode = false;
        ExamtypeCtrl.viewValue = {};
        ExamtypeCtrl.oneTimePay = [];
        ExamtypeCtrl.loginId = $cookies.getObject('uds').id;
        ExamtypeCtrl.role = $cookies.get('role');
        var subjlist;
       var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
          
            for(var i = 0; i<roleAccess[0].RolesData.length;i++){
                if(roleAccess[0].RolesData[i].name === "Exam Type"){
                    ExamtypeCtrl.roleView = roleAccess[0].RolesData[i].view;
                    ExamtypeCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    ExamtypeCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                
            }
        //Initialize code
        function Init() {
            this.fnSubjectList = function () {
                ExamTypeService.getSubjectListBySchoolId(ExamtypeCtrl.schoolId, ExamtypeCtrl.role, ExamtypeCtrl.loginId).then(function (response) {
                    if (response) {
                        ExamtypeCtrl.subjectList = response;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching subject list . Error stack : ' + error);
                });
            };
            this.getClassAndStaffList = function () {
                ExamTypeService.getClassAndStaffList(ExamtypeCtrl.schoolId).then(function (result) {
                    if (result) {
                        ExamtypeCtrl.classList = result.classes;
                        ExamtypeCtrl.staffList = result.staffs;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching class and staff. Error stack ' + error);
                });
            };
            this.getClassDetails = function () {
                ExamTypeService.getClassDetailsBySchoolId(ExamtypeCtrl.schoolId).then(function (result) {
                    if (result) {
                        ExamtypeCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
        }

        (new Init()).fnSubjectList();
        (new Init()).getClassAndStaffList();
        (new Init()).getClassDetails();

        ExamtypeCtrl.chooseClass = function (classId) {
            ExamtypeCtrl.classId = classId;
            ExamTypeService.getClassRecordsByClassId(ExamtypeCtrl.classId).then(function (result) {
                if (result) {
                    ////console.log.log("67"+ JSON.stringify( result))  ;
                    ExamtypeCtrl.subjectList = result;
                    //console.log.log("74" + JSON.stringify(ExamtypeCtrl.subjectList));

                }
            }, function (error) {
                //console.log.log('Error while fetching subject list . Error stack : ' + error);
            });

        };


        /* =============================== Modal Functionality ============================= */
        ExamtypeCtrl.closeModal = function () {
            var modal = $('#edit-subject');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        ExamtypeCtrl.openModal = function () {
            var modal = $('#edit-subject');
            modal.modal('show');
        };
        function clearformfields() {
            ExamtypeCtrl.formFields = {};
        }
        //Delete confirmation box
        ExamtypeCtrl.confirmCallbackMethod = function (index) {
            deleteSubject(index);
        };
        //Delete cancel box
        ExamtypeCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };

        //********************************* Settings to float labels
        ExamtypeCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=subjectname]'));
            Metronic.setFlotLabel($('input[name=subjectassesments]'));
        };
        //********************************* Setting to float labels end

        //********************************** Create or Update New Record
        ExamtypeCtrl.CreateOrUpdate = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ExamtypeCtrl.schoolId,

                examtypeName: ExamtypeCtrl.formFields.subjectName,
                assesments: ExamtypeCtrl.oneTimePay
            };

            if (data) {

                if (ExamtypeCtrl.editmode) {
                    data.id = ExamtypeCtrl.editingExamTypeId;
                    ExamTypeService.updateSubject(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            (new Init()).fnSubjectList();
                            //Close Modal Window
                            ExamtypeCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            ExamtypeCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.error(APP_MESSAGES.SERVER_ERROR);
                        }
                    });
                }
                else {
                    ExamTypeService.verifyDataExistsOrNot(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            //console.log.log('Data already exists');
                        }
                    }, function (result1) {
                        if (result1.status === 404) {
                            ExamTypeService.CreateSubject(data).then(function (result) {
                                if (result) {
                                    //Re initialize the data
                                    (new Init()).fnSubjectList();
                                    //Close Modal Window
                                    ExamtypeCtrl.closeModal();
                                    //Clear Fields
                                    clearformfields();
                                    //Show Toast
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                }
                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log.log('Error while fetching records. Error stack : ' + error);
                            });
                        }
                    });
                }
            }
        };
        //********************************** Create or Update New Record End
        //********************************** Delete Record
        //Delete Action
        var deleteSubject = function (index) {
            if (ExamtypeCtrl.subjectList) {
                ExamTypeService.deleteSubject(ExamtypeCtrl.subjectList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).fnSubjectList();
                        ExamtypeCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting class. Error Stack' + error);
                });
            }
        };

        ExamtypeCtrl.addOneTimeRow = function (subjAsses) {
            ExamtypeCtrl.oneTimePay.push({
            });
        };

        /*********Remove Row***** */
        ExamtypeCtrl.delOneTimeRow = function () {
            var Delrow = ExamtypeCtrl.oneTimePay.length - 1;
            ExamtypeCtrl.oneTimePay.splice(Delrow);
        };

        //Edit Subject
        ExamtypeCtrl.editExamType = function (index) {
            ExamtypeCtrl.formFields.subjectName = ExamtypeCtrl.subjectList[index].examtypeName;
            ExamtypeCtrl.oneTimePay = ExamtypeCtrl.subjectList[index].assesments;
            ExamtypeCtrl.editingExamTypeId = ExamtypeCtrl.subjectList[index].id;

            //Open Modal
            ExamtypeCtrl.openModal();

            $timeout(function () {
                ExamtypeCtrl.setFloatLabel();
                ExamtypeCtrl.editmode = true;
                ExamtypeCtrl.viewValue = ExamtypeCtrl.subjectList[index];
            });
        };
        /* ==================== More Details Section ========================== */
        ExamtypeCtrl.showMoreDetails = function (index) {
            if (index) {
                $timeout(function () {
                    ExamtypeCtrl.openProfileModal();
                });
            }
        };
        ExamtypeCtrl.openProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('show');
        };
        ExamtypeCtrl.closeProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('hide');
        };
        ExamtypeCtrl.openTab = function (id, event) {
            //console.log.log(event);
            $('#' + id).tab('show');
        };
        /* ==================== More Details Section End ====================== */

        /* =============================== Modal Functionality End ========================= */
        //Export to Excel
        ExamtypeCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Subject Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ExamtypeCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            ExamtypeCtrl.newWin = window.open("");
            ExamtypeCtrl.newWin.document.write(divToPrint.outerHTML);
            ExamtypeCtrl.newWin.print();
            ExamtypeCtrl.newWin.close();
        }

        //End Print View
    });
