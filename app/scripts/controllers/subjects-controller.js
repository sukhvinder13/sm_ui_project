'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:SubjectsControllerCtrl
 * @description
 * # SubjectsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('SubjectsController', function (subjectsService, $cookies, $timeout, APP_MESSAGES, toastr, generateexcelFactory) {
        var SubjectsCtrl = this;
        //Defaults


        SubjectsCtrl.schoolId = $cookies.getObject('uds').schoolId;
        SubjectsCtrl.formFields = {};
        SubjectsCtrl.editmode = false;
        SubjectsCtrl.viewValue = {};
        SubjectsCtrl.oneTimePay = [];
        SubjectsCtrl.loginId = $cookies.getObject('uds').id;
        SubjectsCtrl.role = $cookies.get('role');
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
        
          for(var i = 0; i<roleAccess[0].RolesData.length;i++){
              if(roleAccess[0].RolesData[i].name === "Subject New"){
                SubjectsCtrl.roleView = roleAccess[0].RolesData[i].view;
                SubjectsCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                SubjectsCtrl.roledelete = roleAccess[0].RolesData[i].delete;
              }
              
          }
        var subjlist;
        //Initialize code
        function Init() {



            this.fnSubjectList = function () {
                subjectsService.getSubjectListBySchoolId(SubjectsCtrl.schoolId, SubjectsCtrl.role, SubjectsCtrl.loginId).then(function (response) {

                    if (response) {
                        SubjectsCtrl.subjectList = response;

                    }
                }, function (error) {
                    //console.log('Error while fetching subject list . Error stack : ' + error);
                });
            };
            this.getClassAndStaffList = function () {
                subjectsService.getClassAndStaffList(SubjectsCtrl.schoolId).then(function (result) {
                    if (result) {
                        SubjectsCtrl.classList = result.classes;
                    }
                }, function (error) {
                    //console.log('Error while fetching class and staff. Error stack ' + error);
                });
            };
             this.getStaffList = function () {
                subjectsService.getStaffList(SubjectsCtrl.schoolId).then(function (result) {
                    if (result) {
                        SubjectsCtrl.staffList = result.staffs;
                       
                    }
                }, function (error) {
                    //console.log('Error while fetching class and staff. Error stack ' + error);
                });
            };
            this.getClassDetails = function () {
                subjectsService.getClassDetailsBySchoolId(SubjectsCtrl.schoolId).then(function (result) {
                    if (result) {
                        SubjectsCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
        }

        (new Init()).fnSubjectList();
        (new Init()).getClassAndStaffList();
        (new Init()).getStaffList();
        (new Init()).getClassDetails();


        // SubjectsCtrl.chooseClass = function (classId){
        //     SubjectsCtrl.classId=classId;
        //     subjectsService.getClassRecordsByClassId(SubjectsCtrl.classId).then(function (result) {
        //             if (result) {
        //                 SubjectsCtrl.subjectList = result;   


        //             }
        //         }, function (error) {
        //             //console.log('Error while fetching subject list . Error stack : ' + error);
        //         });

        // };
        SubjectsCtrl.chooseClass = function (classId) {
            SubjectsCtrl.classId = classId;
            subjectsService.getClassRecordsByClassId(SubjectsCtrl.classId).then(function (result) {
                if (result) {
                    SubjectsCtrl.subjectList = result;

                }
            }, function (error) {
                //console.log('Error while fetching subject list . Error stack : ' + error);
            });

        };

        // $timeout(function () {
        //     var columnsDefs = [null, null, null, {
        //         'orderable': false,
        //         'width': '10%',
        //         'targets': 0
        //     }, {
        //             'orderable': false,
        //             'width': '10%',
        //             'targets': 0
        //         }, {
        //             'orderable': false,
        //             'width': '10%',
        //             'targets': 0
        //         }, {
        //             'orderable': false,
        //             'width': '10%',
        //             'targets': 0
        //         }];
        //     TableEditable.init('#subjects_datatable', columnsDefs);
        //     //Initialize metronic
        //     Metronic.init();
        // }, 1000);

        /* =============================== Modal Functionality ============================= */
        SubjectsCtrl.closeModal = function () {
            var modal = $('#edit-subject');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        SubjectsCtrl.openModal = function () {
            var modal = $('#edit-subject');
            modal.modal('show');
        };
        function clearformfields() {
            SubjectsCtrl.formFields = {};
        }
        //Delete confirmation box
        SubjectsCtrl.confirmCallbackMethod = function (index) {
            deleteSubject(index);
        };
        //Delete cancel box
        SubjectsCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };

        //********************************* Settings to float labels
        SubjectsCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=subjectname]'));
            Metronic.setFlotLabel($('input[name=classname]'));
            Metronic.setFlotLabel($('input[name=staffname]'));
        };
        //********************************* Setting to float labels end

        //********************************** Create or Update New Record
        SubjectsCtrl.CreateOrUpdate = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: SubjectsCtrl.schoolId,
                classId: SubjectsCtrl.formFields.classId,
                subjectName: SubjectsCtrl.formFields.subjectName,
                staffId: SubjectsCtrl.formFields.staffName,
                examFlag: SubjectsCtrl.formFields.examFlag,
                assesments: SubjectsCtrl.oneTimePay
            };

            if (data) {

                if (SubjectsCtrl.editmode) {
                    data.id = SubjectsCtrl.editingSubjectId;
                    subjectsService.updateSubject(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            (new Init()).fnSubjectList();
                            //Close Modal Window
                            SubjectsCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            SubjectsCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.error(APP_MESSAGES.SERVER_ERROR);
                        }
                    });
                }
                else {
                    subjectsService.verifyDataExistsOrNot(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                        }
                    }, function (result1) {
                        if (result1.status === 404) {
                            subjectsService.CreateSubject(data).then(function (result) {
                                if (result) {
                                    //Re initialize the data
                                    (new Init()).fnSubjectList();
                                    //Close Modal Window
                                    SubjectsCtrl.closeModal();
                                    //Clear Fields
                                    clearformfields();
                                    //Show Toast
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                }
                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log('Error while fetching records. Error stack : ' + error);
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
            if (SubjectsCtrl.subjectList) {
                subjectsService.deleteSubject(SubjectsCtrl.subjectList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).fnSubjectList();
                        SubjectsCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting class. Error Stack' + error);
                });
            }
        };
        //********************************** Delete Record Ends
        //**********add subtopic**********************//

        // SubjectsCtrl.oneTimePay = [{
        //     'assesments': SubjectsCtrl.assesments
        // }];

        SubjectsCtrl.addOneTimeRow = function (subjAsses) {
            //alert("235:::"+JSON.stringify(lessonPlnrCtrl.oneTimePay));
            //alert("208"+ lessonPlnrCtrl.file );
            SubjectsCtrl.oneTimePay.push({
            });
        };

        /*********Remove Row***** */
        SubjectsCtrl.delOneTimeRow = function () {
            var Delrow = SubjectsCtrl.oneTimePay.length - 1;
            SubjectsCtrl.oneTimePay.splice(Delrow);
        };

        //Edit Subject
        SubjectsCtrl.editSubject = function (index) {
            SubjectsCtrl.formFields.subjectName = SubjectsCtrl.subjectList[index].subjectName;
            SubjectsCtrl.formFields.classId = SubjectsCtrl.subjectList[index].classId;
            SubjectsCtrl.formFields.staffName = SubjectsCtrl.subjectList[index].staffId;
            SubjectsCtrl.formFields.examFlag = SubjectsCtrl.subjectList[index].examFlag;
            SubjectsCtrl.oneTimePay = SubjectsCtrl.subjectList[index].assesments;
            SubjectsCtrl.editingSubjectId = SubjectsCtrl.subjectList[index].id;

            //Open Modal
            SubjectsCtrl.openModal();

            $timeout(function () {
                SubjectsCtrl.setFloatLabel();
                SubjectsCtrl.editmode = true;
                SubjectsCtrl.viewValue = SubjectsCtrl.subjectList[index];
            });
        };
        /* ==================== More Details Section ========================== */
        SubjectsCtrl.showMoreDetails = function (index) {
            if (index) {
                $timeout(function () {
                    SubjectsCtrl.openProfileModal();
                });
            }
        };
        SubjectsCtrl.openProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('show');
        };
        SubjectsCtrl.closeProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('hide');
        };
        SubjectsCtrl.openTab = function (id, event) {
            $('#' + id).tab('show');
        };
        /* ==================== More Details Section End ====================== */

        /* =============================== Modal Functionality End ========================= */
        //Export to Excel
        SubjectsCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Subject Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        SubjectsCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            SubjectsCtrl.newWin = window.open("");
            SubjectsCtrl.newWin.document.write(divToPrint.outerHTML);
            SubjectsCtrl.newWin.print();
            SubjectsCtrl.newWin.close();
        }

        //End Print View
       
    });
