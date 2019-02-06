'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ExamlistControllerCtrl
 * @description
 * # ExamlistControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ExamlistController', function (examlistService, $timeout, $cookies, toastr, APP_MESSAGES, generateexcelFactory) {
        var ExamlistCtrl = this;
        ExamlistCtrl.formFields = {};
        ExamlistCtrl.editmode = false;
        ExamlistCtrl.detailsMode = false;
        ExamlistCtrl.viewValue = {};
        //Defaults
        ExamlistCtrl.schoolId = $cookies.getObject('uds').schoolId;
        ExamlistCtrl.loginId = $cookies.getObject('uds').id;
        ExamlistCtrl.role = $cookies.get('role');
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
        
          for(var i = 0; i<roleAccess[0].RolesData.length;i++){
              if(roleAccess[0].RolesData[i].name === "Create Exam"){
                ExamlistCtrl.roleView = roleAccess[0].RolesData[i].view;
                ExamlistCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                ExamlistCtrl.roledelete = roleAccess[0].RolesData[i].delete;
              }
              
          }

        function Init() {
            this.getExamList = function () {
                examlistService.getExamListBySchoolId(ExamlistCtrl.schoolId, ExamlistCtrl.role, ExamlistCtrl.loginId).then(function (result) {
                    if (result) {
                        ExamlistCtrl.examList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching records for Exams List. Error stack : ' + error);
                });
            };
            this.getClassDetails = function () {
                examlistService.getClassDetailsBySchoolId(ExamlistCtrl.schoolId).then(function (result) {
                    if (result) {
                        ExamlistCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getExamList();
        (new Init()).getClassDetails();
        ExamlistCtrl.chooseClass = function (classId) {
            ExamlistCtrl.classId = classId;
            examlistService.getClassRecordsByClassId(ExamlistCtrl.classId).then(function (result) {
                if (result) {
                    ////console.log.log("67"+ JSON.stringify( result))  ;
                    ExamlistCtrl.examList = result;
                }
            }, function (error) {
                //console.log.log('Error while fetching subject list . Error stack : ' + error);
            });

        };
        //Trigger the editable datatable
        // $timeout(function () {
        //     var columnsDefs = [null, null, null, null, {
        //         'orderable': false,
        //         'width': '10%',
        //         'targets': 0
        //     }, {
        //             'orderable': false,
        //             'width': '10%',
        //             'targets': 0
        //         }];
        //     TableEditable.init('#examlist_datatable', columnsDefs);
        //     Metronic.init();
        // }, 1000);
        //Close or Open modal
        ExamlistCtrl.closeModal = function () {
            var modal = $('#edit-examlist');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        ExamlistCtrl.openModal = function () {
            var modal = $('#edit-examlist');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            ExamlistCtrl.formFields = {};
        }
        //Delete confirmation box
        ExamlistCtrl.confirmCallbackMethod = function (index) {
            deleteExam(index);
        };
        //Delete cancel box
        ExamlistCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        // Add Action
        ExamlistCtrl.examAction = function (invalid) {

            var subjectWithMarks = [];
            ////console.log.log(ExamlistCtrl.subjectdata);
            if (invalid) {
                return;
            }
            for (var i = 0; i < ExamlistCtrl.subjectdata.length; i++) {

                subjectWithMarks.push({ "subjectName": ExamlistCtrl.subjectdata[i].subjectName, "subjectId": ExamlistCtrl.subjectdata[i].id, "maximumMark": ExamlistCtrl.subjectdata[i].maximumMark, "examDate": ExamlistCtrl.subjectdata[i].examDate, "subSections": ExamlistCtrl.subjectdata[i].assesments });
            }
            //console.log.log(JSON.stringify(subjectWithMarks));
            var data = {
                schoolId: ExamlistCtrl.schoolId,
                examName: ExamlistCtrl.formFields.examName,
                classId: ExamlistCtrl.formFields.classId,
                subjectList: subjectWithMarks,
                subjectName: ExamlistCtrl.viewValue.subjectName
            };
            ////console.log.log(data);
            if (data) {

                //Check whether editmode or normal mode
                if (!ExamlistCtrl.editmode) {
                    examlistService.getExistingExamlists(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            //console.log.log('data already exists');
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            examlistService.CreateOrUpdateExam(data).then(function (res) {
                                if (res) {
                                    (new Init()).getExamList();
                                    ExamlistCtrl.closeModal();
                                    //Show Toast Message Success
                                    ////console.log.log(res);
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                    (new Init()).getExamList();
                                }

                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log.log('Error while Fetching the Records' + error);
                            });
                        }
                    });
                } else {
                    data.id = ExamlistCtrl.editingExamlistId;
                    examlistService.editExamlist(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getExamList();
                            //Close Modal
                            ExamlistCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };
        //Delete Action
        var deleteExam = function (index) {
            if (ExamlistCtrl.examList) {
                examlistService.deleteExam(ExamlistCtrl.examList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getExamList();
                        ExamlistCtrl.closeModal();
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                        (new Init()).getExamList();
                    }
                }, function (error) {
                    //console.log.log('Error while deleting class. Error Stack' + error);
                });
            }
        };
        ExamlistCtrl.classChange = function (data) {
            examlistService.getSubjectDetailsByClassId(data).then(function (result) {
                if (result) {
                    //On Successfull refill the data list
                    ////console.log.log("result" + JSON.stringify(result));
                    ExamlistCtrl.subjectdata = result;
                    //console.log.log('subject Data With Assesements-----' + JSON.stringify(ExamlistCtrl.subjectdata));
                }
            }, function (error) {
                //console.log.log('Error while deleting class. Error Stack' + error);
            });
        };

        ExamlistCtrl.getDate = function (date) {
            if (date)
                return new Date(date);
            else
                return new Date();
        }
        //Edit Action
        ExamlistCtrl.editExamlist = function (index) {
            ExamlistCtrl.subjectdata = ExamlistCtrl.examList[index].subjectList;
            // ExamlistCtrl.subjectdata.assesments = ExamlistCtrl.subjectdata.subjectList;
            _.each(ExamlistCtrl.subjectdata, function (subject) {
                subject.assesments = subject.subSections;
                subject.examDate = new Date(subject.examDate)
            })

            // ExamlistCtrl.subjectdata = [{
            //     classId: ExamlistCtrl.examList[index].classId,
            //     examName: ExamlistCtrl.examList[index].examName,
            //     fromDate: ExamlistCtrl.examList[index].fromDate,
            //     toDate: ExamlistCtrl.examList[index].toDate,
            //     maximumMark: ExamlistCtrl.examList[index].maximumMark
            // }]

            ExamlistCtrl.editingExamlistId = ExamlistCtrl.examList[index].id;


            //Set View Mode false
            ExamlistCtrl.detailsMode = false;
            //Open Modal
            ExamlistCtrl.openModal();

            $timeout(function () {

                ExamlistCtrl.setFloatLabel();
                //Enable Edit Mode
                ExamlistCtrl.editmode = true;
            });

        };
        //Setting up float label
        ExamlistCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=classId]'));
            Metronic.setFlotLabel($('input[name=examName]'));
            Metronic.setFlotLabel($('input[name=fromDate]'));
            Metronic.setFlotLabel($('input[name=toDate]'));
            Metronic.setFlotLabel($('input[name=maximumMark]'));
        };
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#Exam_date1').on('dp.change', function () {
                ExamlistCtrl.formFields.fromDate = $(this).val();
            });
        }, 500);
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#Exam_date2').on('dp.change', function () {
                ExamlistCtrl.formFields.toDate = $(this).val();
            });
        }, 500);
        //More Details
        ExamlistCtrl.moreDetails = function (index) {
            ExamlistCtrl.detailsMode = true;
            ExamlistCtrl.openModal();
            ExamlistCtrl.viewValue = ExamlistCtrl.examList[index];

        };
        //Export to Excel
        ExamlistCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ExamlistCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            ExamlistCtrl.newWin = window.open("");
            ExamlistCtrl.newWin.document.write(divToPrint.outerHTML);
            ExamlistCtrl.newWin.print();
            ExamlistCtrl.newWin.close();
        }

        //End Print View
    });