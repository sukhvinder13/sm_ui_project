'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:LessonplannerControllerCtrl
 * @description
 * # LessonplannerControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('LessonplannerControllerCtrl', function (configService,lessonPlannerService, $sce, $scope, $cookies, $timeout, $http, APP_MESSAGES, toastr, generateexcelFactory, $window) {
        var lessonPlnrCtrl = this;

        lessonPlnrCtrl.schoolId = $cookies.getObject('uds').schoolId;
        lessonPlnrCtrl.formFields = {};
        lessonPlnrCtrl.editmode = false;
        lessonPlnrCtrl.viewValue = {};
        lessonPlnrCtrl.loginId = $cookies.getObject('uds').id;
        lessonPlnrCtrl.role = $cookies.get('role');

        //Initialize code
        function Init() {


            this.getClassDetails = function () {
                lessonPlannerService.getClassDetailsBySchoolId(lessonPlnrCtrl.schoolId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
            this.getSubjectDetails = function () {
                lessonPlannerService.getSubjectDetailsBySchoolId(lessonPlnrCtrl.schoolId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.subjectList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };

        }
        (new Init()).getClassDetails();
        (new Init()).getSubjectDetails();
        // lessonPlnrCtrl.chooseClass = function (classId) {
        //     lessonPlnrCtrllessonPlnrCtrl.classId = classId;
        //     //console.log.log(lessonPlnrCtrl.classId);
        //     lessonPlannerService.getClassRecordsByClassId(lessonPlnrCtrl.classId).then(function (result) {
        //         //console.log.log(classId);    
        //         if (result) {
        //             lessonPlnrCtrl.subjectList = result;
        //         }
        //     }, function (error) {
        //         //console.log.log('Error while fetching subject list . Error stack : ' + error);
        //     });
        // };


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
        lessonPlnrCtrl.closeModal = function () {
            var modal = $('#add-chapter');
            modal.modal('hide');

            //ClearFields
            clearformfields();
            $window.location.reload();
        };
        lessonPlnrCtrl.openModal = function () {
            var modal = $('#add-chapter');
            modal.modal('show');
        };
        function clearformfields() {
            lessonPlnrCtrl.formFields = {};
        }
        //Delete confirmation box
        lessonPlnrCtrl.confirmCallbackMethod = function (index) {
            deleteSubject(index);
        };
        //Delete cancel box
        lessonPlnrCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };


        /*********Add onetimerow***** */

        /*********Add oneTime***** */
        /*********Remove Row***** */
        lessonPlnrCtrl.delOneTimeRow = function () {
            var Delrow = lessonPlnrCtrl.oneTimePay.length - 1;
            lessonPlnrCtrl.oneTimePay.splice(Delrow);
        };


        //Get Subjects based on Selected Classes
        lessonPlnrCtrl.selectedClass = function () {
            lessonPlnrCtrl.showClass = lessonPlnrCtrl.formFields.showClassId;
            if (lessonPlnrCtrl.formFields.showClassId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId) {
                lessonPlannerService.getSubjectsByClassId(lessonPlnrCtrl.formFields.showClassId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.subjectList = result;

                        //console.log.log("118" +JSON.stringify(lessonPlnrCtrl.subjectList));
                    }
                });
            }
        };
        /*************Edit******************/
        lessonPlnrCtrl.editNotice = function (index) {
            debugger;
            lessonPlnrCtrl.editingNoticeId = lessonPlnrCtrl.chapterList[index].id;
            lessonPlnrCtrl.chapterName = lessonPlnrCtrl.chapterList[index].chapterName;
            lessonPlnrCtrl.oneTimePay = lessonPlnrCtrl.chapterList[index].subtopicName;
            lessonPlnrCtrl.abcd = lessonPlnrCtrl.chapterList[index].subtopicName[0].topicPDF;
            //console.log.log("139" + lessonPlnrCtrl.abcd);
            lessonPlnrCtrl.formFields.description = lessonPlnrCtrl.chapterList[index].subtopicName;
            //console.log.log("147 " + JSON.stringify(lessonPlnrCtrl.chapterList[index].subtopicName));

            //Set View Mode false
            lessonPlnrCtrl.detailsMode = false;
            //Open Modal
            lessonPlnrCtrl.openModal();

            $timeout(function () {

                lessonPlnrCtrl.setFloatLabel();
                //Enable Edit Mode
                lessonPlnrCtrl.editmode = true;
            });

        };
        /***************Upload PDF**********************/
        var topicPdfUrl = { "file": "" };
        lessonPlnrCtrl.uploadPDF = function (x) {
            lessonPlnrCtrl.file = document.getElementById('topicPDF').files[0];
            // var date =new Date.now();
            var fd = new FormData();
            fd.append('file', lessonPlnrCtrl.file);
            // var uploadUrl = configService.baseUrl() +"/ImageContainers/topicPDF/upload";
            var uploadUrl = configService.baseUrl() +"/ImageContainers/topicPDF/upload";
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (response) {
                    if (response) {
                        //console.log.log(response);
                        // topicPdfUrl.file = configService.baseUrl() +'/ImageContainers/topicPDF/download/' + response.data.result[0].filename;
                        topicPdfUrl.file = configService.baseUrl() +'/ImageContainers/topicPDF/download/' + response.data.result[0].filename;
                        //console.log.log(topicPdfUrl.file);
                        lessonPlnrCtrl.pdfFile = topicPdfUrl.file;
                        //topicPdfUrl=lessonPlnrCtrl.file;
                        // lessonPlnrCtrl.oneTimePay.subtopicName[].toppdf=lessonPlnrCtrl.file;
                        // //console.log.log("153" +topicPdfUrl);
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
        };
        //showing the topic data
        lessonPlnrCtrl.Topic = function (topic) {
            lessonPlnrCtrl.topicData = topic;
            lessonPlnrCtrl.showData = true;
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $scope.iframe = { src: topic.Iframe };
            //var fileURL = URL.createObjectURL(topic.pdfURL.file);
            $scope.pdfContent = lessonPlnrCtrl.pdfFile;
            //console.log.log($scope.pdfContent);
            //console.log.log("182 " + $scope.iframe);
            //console.log.log("" +JSON.stringify(lessonPlnrCtrl.topicData.Iframe));           
        };

        //Get Subjects based on Selected Classes
        lessonPlnrCtrl.selectedSubject = function (showsubjectId) {
            lessonPlnrCtrl.showsubject = lessonPlnrCtrl.formFields.showsubjectId;
            if (lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId) {
                lessonPlannerService.getTeacherByStaffId(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.staffList = result;
                        //console.log.log("118" + JSON.stringify(lessonPlnrCtrl.staffList));
                        lessonPlnrCtrl.staffId = lessonPlnrCtrl.staffList[0].staff.firstName + " " + lessonPlnrCtrl.staffList[0].staff.lastName;
                    }
                });
                lessonPlannerService.getChapterByCandSId(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.chapterList = result;
                        //console.log.log("150" + JSON.stringify(lessonPlnrCtrl.chapterList));
                    }
                });

            }

        };

        //**********add subtopic**********************//

        lessonPlnrCtrl.oneTimePay = [{
            'subtopicName': lessonPlnrCtrl.subtopicName,
            'Iframe': lessonPlnrCtrl.Iframe,
            'Assignments': lessonPlnrCtrl.Assignments,
            'topicPDF': topicPdfUrl
        }];

        lessonPlnrCtrl.addOneTimeRow = function (stopics) {
            //alert("235:::"+JSON.stringify(lessonPlnrCtrl.oneTimePay));
            //console.log.log("201" + lessonPlnrCtrl.subtopicName);
            //alert("208"+ lessonPlnrCtrl.file );
            lessonPlnrCtrl.oneTimePay.push({
                'subtopicName': "",
                'Iframe': "",
                'Assignments': "",
                'pdfURL': topicPdfUrl
            });
        };
        lessonPlnrCtrl.remove = function () {
            var newDataList = [];
            lessonPlnrCtrl.selectedAll = false;
            angular.forEach(lessonPlnrCtrl.personalDetails, function (selected) {
                if (!selected.selected) {
                    newDataList.push(selected);
                }
            });
            lessonPlnrCtrl.personalDetails = newDataList;
        };
        // *********************************

        //********************************* Settings to float labels
        lessonPlnrCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=subjectname]'));
            Metronic.setFlotLabel($('input[name=classname]'));
            Metronic.setFlotLabel($('input[name=staffname]'));
        };
        //********************************* Setting to float labels end

        //********************************** Create or Update New Record
        lessonPlnrCtrl.chapterAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                classId: lessonPlnrCtrl.showClass,
                subjectId: lessonPlnrCtrl.showsubject,
                teacherName: lessonPlnrCtrl.staffId,
                schoolId: lessonPlnrCtrl.schoolId,
                chapterName: lessonPlnrCtrl.chapterName,
                subtopicName: lessonPlnrCtrl.oneTimePay,
            };

            if (data) {

                if (lessonPlnrCtrl.editmode) {
                    data.id = lessonPlnrCtrl.editingSubjectId;
                    lessonPlannerService.updateSubject(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            // (new Init()).fnSubjectList();
                            //Close Modal Window
                            lessonPlnrCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            lessonPlnrCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.error(APP_MESSAGES.SERVER_ERROR);
                        }
                    });
                }
                else {

                    lessonPlannerService.CreateChapter(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            //(new Init()).fnSubjectList();
                            //Close Modal Window
                            lessonPlnrCtrl.closeModal();
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

            }
            $window.location.reload();
        };
        //********************************** Create or Update New Record End
        //********************************** Delete Record
        //Delete Action
        var deleteSubject = function (index) {
            if (lessonPlnrCtrl.subjectList) {
                lessonPlannerService.deleteSubject(lessonPlnrCtrl.subjectList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).fnSubjectList();
                        lessonPlnrCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting class. Error Stack' + error);
                });
            }
        };
        /********Chapter check**********/
        lessonPlnrCtrl.check = function (showClassId, showsubjectId) {
            if (showClassId == null || showsubjectId == null) {
                alert("Please Select Class & Subject");
            }
            else {
                lessonPlnrCtrl.openModal();
            }
        };
        /********Chapter check End*********/
        /********Chapter check class**********/
        lessonPlnrCtrl.checkclass = function (showClassId) {
            //var selectclass = document.getElementById('selectclass').innerHTML;
            //var selectsubject = document.getElementById('selectsubject').innerHTML;
            //alert(showsubjectId + showClassId);
            if (showClassId == null) {
                alert("Please Select Class");
            }
            else {
            }
        };
        /********Chapter check End*********/
        //********************************** Delete Record Ends

        //Edit Subject
        lessonPlnrCtrl.editSubject = function (index) {
            lessonPlnrCtrl.formFields.subjectName = lessonPlnrCtrl.subjectList[index].subjectName;
            lessonPlnrCtrl.formFields.classId = lessonPlnrCtrl.subjectList[index].classId;
            lessonPlnrCtrl.formFields.staffName = lessonPlnrCtrl.subjectList[index].staffId;
            lessonPlnrCtrl.formFields.examFlag = lessonPlnrCtrl.subjectList[index].examFlag;
            lessonPlnrCtrl.editingSubjectId = lessonPlnrCtrl.subjectList[index].id;

            //Open Modal
            lessonPlnrCtrl.openModal();

            $timeout(function () {
                lessonPlnrCtrl.setFloatLabel();
                lessonPlnrCtrl.editmode = true;
                lessonPlnrCtrl.viewValue = lessonPlnrCtrl.subjectList[index];
            });
        };
        /* ==================== More Details Section ========================== */
        lessonPlnrCtrl.showMoreDetails = function (index) {
            if (index) {
                $timeout(function () {
                    lessonPlnrCtrl.openProfileModal();
                });
            }
        };
        lessonPlnrCtrl.openProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('show');
        };
        lessonPlnrCtrl.closeProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('hide');
        };
        lessonPlnrCtrl.openTab = function (id, event) {
            //console.log.log(event);
            $('#' + id).tab('show');
        };

        /* ==================== More Details Section End ====================== */

        /* =============================== Modal Functionality End ========================= */
        //Export to Excel
        lessonPlnrCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Subject Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
    });
