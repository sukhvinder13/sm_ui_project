'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:LessonplannerControllerCtrl
 * @description
 * # LessonplannerControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('LessonplannerControllerCtrl', function (configService, lessonPlannerService, $sce, $rootScope, $scope, $cookies, $timeout, $http, APP_MESSAGES, toastr, FOsubject, Student, Subject, generateexcelFactory, $window, LessonPlanner, $state, $stateParams) {
        var lessonPlnrCtrl = this;

        lessonPlnrCtrl.schoolId = $cookies.getObject('uds').schoolId;
        lessonPlnrCtrl.formFields = {};
        lessonPlnrCtrl.editmode = false;
        lessonPlnrCtrl.viewValue = {};
        lessonPlnrCtrl.loginId = $cookies.getObject('uds').id;
        lessonPlnrCtrl.role = $cookies.get('role');
        $rootScope.videoArray = [];
        $rootScope.documentsArray = [];
        lessonPlnrCtrl.tott = [];
        lessonPlnrCtrl.ind = false;
        // $rootScope.topicsArr = [];
        if (lessonPlnrCtrl.role == 'Student') {
            lessonPlnrCtrl.formFields.showClassId = $cookies.getObject('uds').classId;
            lessonPlnrCtrl.formFields.showsubjectId = $stateParams.id;
            FOsubject.find({ filter: { where: { id: $stateParams.id } } }, function (response) {
                lessonPlnrCtrl.saveclassId = response[0].classId;
                lessonPlnrCtrl.savesubName = response[0].subjectName;
                Subject.find({ filter: { where: { classId: lessonPlnrCtrl.saveclassId, subjectName: lessonPlnrCtrl.savesubName } } }, function (res) {
                    console.log(res[0].id);
                    lessonPlnrCtrl.formFields.showsubjectId = res[0].id;

                })
            })
            $timeout(function () {
                lessonPlnrCtrl.Bhasha();
                lessonPlnrCtrl.selectedSubject(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId);
                lessonPlnrCtrl.viewTable(lessonPlnrCtrl.showsubjectId);
            }, 1000);
        }

        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Lesson Planner") {
                lessonPlnrCtrl.roleView = roleAccess[0].RolesData[i].view;
                lessonPlnrCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                lessonPlnrCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }


        //Initialize code
        function Init() {


            this.getClassDetails = function () {
                lessonPlannerService.getClassDetailsBySchoolId(lessonPlnrCtrl.schoolId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };


        }

        (new Init()).getClassDetails();
        // (new Init()).getSubjectDetails();
        //Get Subjects based on Selected Classes
        lessonPlnrCtrl.Bhasha = function () {
            lessonPlannerService.getSubjectsByClassId(lessonPlnrCtrl.formFields.showClassId).then(function (result) {
                if (result) {
                    lessonPlnrCtrl.subjectList = result;
                }
            });

        };
        lessonPlnrCtrl.defaultChapterNo = function () {
            lessonPlnrCtrl.formFields.chapterName = "";
            var decreasechapterLen;
            lessonPlannerService.getChapterByCandSId(lessonPlnrCtrl.schoolId, lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId).then(function (result) {
                if (result) {
                    lessonPlnrCtrl.getchapData = result;
                    if (lessonPlnrCtrl.getchapData.length == "0") {
                        lessonPlnrCtrl.formFields.chapterNo = "1";
                    } else {
                        decreasechapterLen = lessonPlnrCtrl.getchapData.length - 1;
                        lessonPlnrCtrl.formFields.chapterNo = parseInt(lessonPlnrCtrl.getchapData[decreasechapterLen].chapterNo) + 1;
                    }

                }
            });
        }
        /* =============================== Modal Functionality ============================= */

        lessonPlnrCtrl.closeModal = function () {
            var modal = $('#add-chapter');
            modal.modal('hide');

        };
        lessonPlnrCtrl.openModal = function () {
            var modal = $('#add-chapter');
            modal.modal('show');
        };
        lessonPlnrCtrl.closeModal1 = function () {
            var modal = $('#add-topic');
            modal.modal('hide');
            lessonPlnrCtrl.formFields.chapterNo = "";
            lessonPlnrCtrl.formFields.chapterName = "";
            lessonPlnrCtrl.formFields.noOfClasses = "";
            // $rootScope.videoArray = "";
            // $rootScope.documentsArray = "";

            //ClearFields
            // clearformfields();
        };
        lessonPlnrCtrl.openModal = function () {
            var modal = $('#add-topic');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            // lessonPlnrCtrl.formFields = {};
            lessonPlnrCtrl.formFields.chapterName = "";
            lessonPlnrCtrl.formFields.chapterNo = "";
            lessonPlnrCtrl.formFields.noOfClasses = "";
        }



        /*********Add onetimerow***** */

        /*********Add oneTime***** */
        /*********Remove Row***** */
        lessonPlnrCtrl.delOneTimeRow = function () {
            var Delrow = lessonPlnrCtrl.oneTimePay.length - 1;
            lessonPlnrCtrl.oneTimePay.splice(Delrow);
        };

        lessonPlnrCtrl.resetForm1 = function () {
            lessonPlnrCtrl.formFields.chapterName = "";
            lessonPlnrCtrl.formFields.noOfClasses = "";
            lessonPlnrCtrl.formFields.ScheduleVirtualClassRoom = "";
            lessonPlnrCtrl.formFields.TopicNo = "";
            lessonPlnrCtrl.formFields.PlannedClassToStartDate = "";
            lessonPlnrCtrl.formFields.TopicName = "";
            lessonPlnrCtrl.formFields.PlannedClassToEndDate = "";
        }
        lessonPlnrCtrl.resetForm2 = function () {
            lessonPlnrCtrl.myUpload2 = "";
            lessonPlnrCtrl.formFields.objective = "";
            lessonPlnrCtrl.formFields.otherInfomation = "";
            lessonPlnrCtrl.formFields.video = "";
            lessonPlnrCtrl.formFields.homeAssigment = "";
            lessonPlnrCtrl.formFields.overview = "";
            lessonPlnrCtrl.formFields.PlannedClassToEndDate = "";
        }


        lessonPlnrCtrl.uploadVideo = function () {

            if (lessonPlnrCtrl.formFields.video == undefined) {
                lessonPlnrCtrl.formFields.video = "";

            }
            else {
                $rootScope.videoArray.push({
                    "Iframe": lessonPlnrCtrl.formFields.video
                })
                lessonPlnrCtrl.formFields.video = "";
            }
        };
        //End Uploads



        /*************Edit******************/
        lessonPlnrCtrl.editNotice = function (index) {
            // debugger;
            lessonPlnrCtrl.indexx = index;
            lessonPlnrCtrl.editingNoticeId = lessonPlnrCtrl.showData[index].id;
            lessonPlnrCtrl.formFields.chapterName = lessonPlnrCtrl.showData[index].chapterName;
            lessonPlnrCtrl.formFields.chapterNo = lessonPlnrCtrl.showData[index].chapterNo;
            lessonPlnrCtrl.formFields.noOfClasses = lessonPlnrCtrl.showData[index].noOfClasses;
            lessonPlnrCtrl.formFields.ScheduleVirtualClassRoom = lessonPlnrCtrl.showData[index].ScheduleVirtualClassRoom;
            lessonPlnrCtrl.formFields.TopicNo = lessonPlnrCtrl.showData[index].TopicNo;
            lessonPlnrCtrl.formFields.PlannedClassToStartDate = lessonPlnrCtrl.showData[index].PlannedClassToStartDate;
            lessonPlnrCtrl.formFields.TopicName = lessonPlnrCtrl.showData[index].TopicName;
            lessonPlnrCtrl.formFields.PlannedClassToEndDate = lessonPlnrCtrl.showData[index].PlannedClassToEndDate;


            //Set View Mode false
            lessonPlnrCtrl.detailsMode = false;
            //Open Modal
            // lessonPlnrCtrl.openModal();

            $timeout(function () {

                lessonPlnrCtrl.setFloatLabel();
                //Enable Edit Mode
                lessonPlnrCtrl.editmode = true;
            });

        };

        /***************Upload PDF**********************/
        // lessonPlnrCtrl.documentsArray = [{
        //    "documentFile": lessonPlnrCtrl.pdfFile
        // }];
        lessonPlnrCtrl.uploadPPTorPDF = function (x) {
            lessonPlnrCtrl.file = document.getElementById('topicPDF').files[0];
            // var date =new Date.now();
            var fd = new FormData();
            fd.append('file', lessonPlnrCtrl.file);
            var uploadUrl = configService.baseUrl() + "/ImageContainers/topicPDF/upload";
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (response) {
                    if (response) {
                        lessonPlnrCtrl.pdfFile = configService.baseUrl() + '/ImageContainers/topicPDF/download/' + response.data.result[0].filename;
                        $rootScope.documentsArray.push({ "documentFile": lessonPlnrCtrl.pdfFile })
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
        };
        //Get Subjects based on Selected Classes
        lessonPlnrCtrl.selectedSubject = function (showsubjectId, showClassId) {
            document.getElementById('TBL').style.display = 'block';
            document.getElementById('newthing').style.display = 'block';
            // lessonPlnrCtrl.showsubject = lessonPlnrCtrl.formFields.showsubjectId;
            if (lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId) {
                lessonPlannerService.getTeacherByStaffId(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.role, lessonPlnrCtrl.loginId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.staffList = result;
                        lessonPlnrCtrl.staffId = lessonPlnrCtrl.staffList[0].staff.firstName + " " + lessonPlnrCtrl.staffList[0].staff.lastName;
                    }
                });
                lessonPlannerService.getChapterByCandSId(lessonPlnrCtrl.schoolId, lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId).then(function (result) {
                    if (result) {
                        lessonPlnrCtrl.showData = result;
                        async.each(lessonPlnrCtrl.showData, function (show) {
                            show['noOfClasses'] = _.sumBy(show.topicList, function (sum) { return (sum.noOfClasses) });

                        })
                    }
                });

            }
            // (new Init()).getShowData();

        };
        lessonPlnrCtrl.firstStartDate = function (show) {
            var decreaseArrayLen;
            show['PlannedClassToStartDate'] = show.topicList[0].PlannedClassToStartDate;
            decreaseArrayLen = show.topicList.length - 1;
            show['PlannedClassToEndDate'] = show.topicList[decreaseArrayLen].PlannedClassToEndDate;


        }
        //**********add subtopic**********************//


        lessonPlnrCtrl.addOneTimeRow = function (stopics) {

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
            Metronic.setFlotLabel($('input[name=chapterName]'));
            Metronic.setFlotLabel($('input[name=classname]'));
            Metronic.setFlotLabel($('input[name=staffname]'));
        };
        //********************************* Setting to float labels end

        //********************************** Create or Update New Record
        lessonPlnrCtrl.chapterAction = function (invalid) {
            if (invalid) {
                return;
            }
            if (lessonPlnrCtrl.editmode) {
                var data = {
                    classId: lessonPlnrCtrl.formFields.showClassId,
                    subjectId: lessonPlnrCtrl.formFields.showsubjectId,
                    schoolId: lessonPlnrCtrl.schoolId,
                    chapterNo: lessonPlnrCtrl.formFields.chapterNo,
                    chapterName: lessonPlnrCtrl.formFields.chapterName,
                    // noOfClasses: lessonPlnrCtrl.formFields.noOfClasses,
                    // "topicList":$rootScope.topicsArr,
                    "videoData": $rootScope.videoArray,
                    "docData": $rootScope.documentsArray

                };
            } else {
                var data = {
                    classId: lessonPlnrCtrl.formFields.showClassId,
                    subjectId: lessonPlnrCtrl.formFields.showsubjectId,
                    schoolId: lessonPlnrCtrl.schoolId,
                    chapterNo: lessonPlnrCtrl.formFields.chapterNo,
                    chapterName: lessonPlnrCtrl.formFields.chapterName,
                    // noOfClasses: lessonPlnrCtrl.formFields.noOfClasses,
                    // "topicList":$rootScope.topicsArr,
                    "videoData": $rootScope.videoArray,
                    "docData": $rootScope.documentsArray
                };
            }


            if (data) {
                if (lessonPlnrCtrl.editmode) {
                    data.id = lessonPlnrCtrl.editingNoticeId;
                    lessonPlannerService.updatingRemaing(data).then(function (result) {
                        if (result) {
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                            //Re initialize the data
                            lessonPlnrCtrl.selectedSubject(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId);
                            //Close Modal Window
                            lessonPlnrCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            lessonPlnrCtrl.formFields.chapterNo = "";
                            lessonPlnrCtrl.formFields.chapterName = "";
                            lessonPlnrCtrl.formFields.noOfClasses = "";
                            // $rootScope.videoArray = "";
                            // $rootScope.documentsArray = "";
                            document.getElementById('topicPDF').value = "";

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
                            //Close Modal Window
                            lessonPlnrCtrl.closeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                            lessonPlnrCtrl.selectedSubject(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId);
                            lessonPlnrCtrl.formFields.chapterNo = "";
                            lessonPlnrCtrl.formFields.chapterName = "";
                            lessonPlnrCtrl.formFields.noOfClasses = "";
                            // $rootScope.videoArray = "";
                            // $rootScope.documentsArray = "";
                            document.getElementById('topicPDF').value = "";
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log.log('Error while fetching records. Error stack : ' + error);
                    });
                }

            }

        };



        //********************************** Create or Update New Record End
        //********************************** Delete Record
        //Delete Action
        var deleteSubject = function (index) {
            if (lessonPlnrCtrl.showData) {
                lessonPlannerService.deleteSubject(lessonPlnrCtrl.showData[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        // (new Init()).showData();
                        lessonPlnrCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                        lessonPlnrCtrl.selectedSubject(lessonPlnrCtrl.formFields.showsubjectId, lessonPlnrCtrl.formFields.showClassId)
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting class. Error Stack' + error);
                });
            }
        };

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
        /********Chapter check**********/
        lessonPlnrCtrl.check = function (showClassId, showsubjectId) {
            if (showClassId == null || showsubjectId == null) {
                alert("Please Select Class & Subject");
            }
            else {
                // lessonPlnrCtrl.openModal();
            }
        };
        /********Chapter check End*********/
        /********Chapter check class**********/
        lessonPlnrCtrl.checkclass = function (showClassId) {
            if (showClassId == null) {
                alert("Please Select Class");
            }
            else {
            }
        };
        /********Chapter check End*********/
        lessonPlnrCtrl.returnToAddTopic = function (show) {
            lessonPlnrCtrl.formFields.chapterName = "";

            var url = $state.href('home.addtopic', {
                'id': show.id
            });
            window.open(url, '_blank');
        }

        // saving chapter names end
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
            lessonPlnrCtrl.editingNoticeId = lessonPlnrCtrl.showData[index].id;
            lessonPlnrCtrl.formFields.chapterName = lessonPlnrCtrl.showData[index].chapterName;
            lessonPlnrCtrl.formFields.noOfClasses = lessonPlnrCtrl.showData[index].noOfClasses;
            lessonPlnrCtrl.formFields.ScheduleVirtualClassRoom = lessonPlnrCtrl.showData[index].ScheduleVirtualClassRoom;
            lessonPlnrCtrl.formFields.TopicNo = lessonPlnrCtrl.showData[index].TopicNo;
            lessonPlnrCtrl.formFields.PlannedClassToStartDate = new Date(lessonPlnrCtrl.showData[index].PlannedClassToStartDate);
            lessonPlnrCtrl.formFields.TopicName = lessonPlnrCtrl.showData[index].TopicName;
            lessonPlnrCtrl.formFields.PlannedClassToEndDate = new Date(lessonPlnrCtrl.showData[index].PlannedClassToEndDate);
            lessonPlnrCtrl.formFields.overview = lessonPlnrCtrl.showData[index].Overview;
            lessonPlnrCtrl.formFields.homeAssigment = lessonPlnrCtrl.showData[index].HomeAssigment;
            lessonPlnrCtrl.formFields.objective = lessonPlnrCtrl.showData[index].objective;
            lessonPlnrCtrl.formFields.otherInfomation = lessonPlnrCtrl.showData[index].otherInfomation;
            $rootScope.videoArray = lessonPlnrCtrl.showData[index].videoData;
            $rootScope.documentsArray = lessonPlnrCtrl.showData[index].docData;


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
            $('#' + id).tab('show');
        };
        //Add Chapter Form Validations
        lessonPlnrCtrl.toggleButton = function (ref, bttnID) {
            if (lessonPlnrCtrl.formFields.chapterName !== '' || lessonPlnrCtrl.formFields.chapterName !== undefined) {
                document.getElementById(bttnID).removeAttribute("disabled");

            } else {
                document.getElementById('bttnsubmit').disabled = true;



            }
        }
        //End
        /* ==================== More Details Section End ====================== */

        /* =============================== Modal Functionality End ========================= */
        //Export to Excel
        lessonPlnrCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            document.getElementById('LSN').style.display = 'block';
            document.getElementById('TBL').style.display = 'block';


            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Subject Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        lessonPlnrCtrl.callOfDuty = function (doc) {
            window.open(doc.documentFile);
        };

        lessonPlnrCtrl.closeToggle = function (index) {
            var ii = lessonPlnrCtrl.tott[index];
            lessonPlnrCtrl.tott = [];
            for (var i = 0; i < lessonPlnrCtrl.showData.length; i++) {
                if (index === i) {
                    if (ii == true) {
                        var ind = false;
                    } else {
                        var ind = true;
                    }
                    lessonPlnrCtrl.tott.push(ind);
                } else {
                    var ind = false;
                    lessonPlnrCtrl.tott.push(ind);
                }
            }
        }
    });
