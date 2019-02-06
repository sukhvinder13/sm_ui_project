'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ConsoleControllerCtrl
 * @description
 * # ConsoleControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ConsoleController', function (configService, schooltimetableService, workingdaysService, gradeService, $rootScope, consoleService, ExamTypeService, Timetable, $cookies, generateexcelFactory, $filter, $timeout, $state, $scope, $sce, $http, APP_MESSAGES, toastr, Enquiry, AcademicBatch, feesService, Leave, School, WorkingDay, Calendar) {

        var ConsoleCtrl = this;

        ConsoleCtrl.status = "false";
        ConsoleCtrl.DT = $filter('date')(new Date(), 'dd-MM-yyyy');
        // ConsoleCtrl.Today = $filter('date')(new Date(), 'dd-MMM-yyyy');
        ConsoleCtrl.futureYear = $filter('date')(new Date(), 'yyyy');
        ConsoleCtrl.futureYear = Number(ConsoleCtrl.futureYear) + 1;
        ConsoleCtrl.presentYear = $filter('date')(new Date(), 'yyyy');
        ConsoleCtrl.showremove = true;
        ConsoleCtrl.logout = function () {
            //Clear the cookies and navigate to login
            $cookies.remove('uds');
            $state.go('login');
        };
        ConsoleCtrl.schoolId = $cookies.getObject('uds').schoolId;
        ConsoleCtrl.birthdayList = [];
        ConsoleCtrl.ShowMessageList = [];
        ConsoleCtrl.absentsList = [];
        ConsoleCtrl.timeTableIdList = [];
        ConsoleCtrl.timeTabletimetableList = [];
        ConsoleCtrl.oneTimePay = [{}];
        ConsoleCtrl.loginId = $cookies.getObject('uds').id;
        ConsoleCtrl.role = $cookies.get('role');

        ConsoleCtrl.abTotal = 0;
        ConsoleCtrl.tot = 0;
        ConsoleCtrl.editModulemode = false;
        // schooltimetable controller function start

        //Defaults
        ConsoleCtrl.timeTablecalendarEvent = [];
        ConsoleCtrl.formFields = {};
        ConsoleCtrl.timeTableeditmode = false;
        ConsoleCtrl.timeTabledetailsMode = false;
        ConsoleCtrl.timeTableviewValue = {};
        ConsoleCtrl.academiceditmode = false;
        // schooltimetable controller function stop

        //dob validation starts
        var fromDate1 = $filter('date')(new Date(), "dd-MM");
        var testDate = new Date();
        var weekInMilliseconds1 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds1);
        var toDate1 = $filter('date')(new Date(testDate), "dd-MM");
        var weekInMilliseconds2 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds2);
        var toDate2 = $filter('date')(new Date(testDate), "dd-MM");
        var weekInMilliseconds3 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds3);
        var toDate3 = $filter('date')(new Date(testDate), "dd-MM");
        var weekInMilliseconds4 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds4);
        var toDate4 = $filter('date')(new Date(testDate), "dd-MM");
        var weekInMilliseconds5 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds5);
        var toDate5 = $filter('date')(new Date(testDate), "dd-MM");
        var weekInMilliseconds6 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds6);
        var toDate6 = $filter('date')(new Date(testDate), "dd-MM");
        var weekInMilliseconds7 = 24 * 60 * 60 * 1000;
        testDate.setTime(testDate.getTime() + weekInMilliseconds7);
        var toDate7 = $filter('date')(new Date(testDate), "dd-MM");
        //dob validation ends


        function Init() {

            this.getNoticeDetails = function () {
                $scope.tab = 6;
                consoleService.getNoticeDetailsBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.noticeList = result;

                        $('#noticescroller').slimScroll({
                            position: 'right',
                            height: '350px',
                            railVisible: true,
                            alwaysVisible: false,
                            handleColor: '#D7DCE2'

                        });
                    }
                }, function (error) {
                    //console.log('Error while fetching notice details. Error stack : ' + error);
                });
                $timeout(function () {
                    $scope.tab = 6;
                }, 500);
            };
            this.getabsentStudents = function () {
                consoleService.getAbsentStudentsListBySchoolId(ConsoleCtrl.schoolId).then(function (absents) {
                    if (absents) {
                        ConsoleCtrl.absentsList = absents;
                        for (var i = 0; i < ConsoleCtrl.absentsList.length; i++) {
                            ConsoleCtrl.abTotal += ConsoleCtrl.absentsList[i].absents;
                            ConsoleCtrl.tot += ConsoleCtrl.absentsList[i].totalStudents;
                        }
                    }
                }, function (error) {
                    //console.log('Error while fetching notice details. Error stack : ' + error);
                });
            };
            this.getExamDetails = function () {
                consoleService.getExamListBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.examList = result;

                        $('#examscroller').slimScroll({
                            position: 'right',
                            height: '350px',
                            railVisible: true,
                            alwaysVisible: false,
                            handleColor: '#D7DCE2'

                        });
                    }
                }, function (error) {
                    //console.log('Error while fetching exam details. Error stack : ' + error);
                });
            };
            this.fnSubjectList = function () {
                ExamTypeService.getSubjectListBySchoolId(ConsoleCtrl.schoolId, ConsoleCtrl.role, ConsoleCtrl.loginId).then(function (response) {

                    if (response) {
                        ConsoleCtrl.subjectList = response;

                    }
                }, function (error) {
                    //console.log.log('Error while fetching subject list . Error stack : ' + error);
                });
            };
            this.getClassAndStaffList = function () {
                ExamTypeService.getClassAndStaffList(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.classList = result.classes;
                        ConsoleCtrl.staffList = result.staffs;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching class and staff. Error stack ' + error);
                });
            };
            this.getAssignmentDetails = function () {
                consoleService.getAssignmentDetailsBySchoolId(ConsoleCtrl.schoolId, ConsoleCtrl.role, ConsoleCtrl.loginId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.assignmentList = result;
                        $('#assignmentscroller').slimScroll({
                            position: 'right',
                            height: '350px',
                            railVisible: true,
                            alwaysVisible: false,
                            handleColor: '#D7DCE2'
                        });
                    }
                }, function (error) {
                    //console.log('Error while fetching assignment details. Error stack : ' + error);
                });
            };
            this.getVideoDetails = function () {
                consoleService.getMediaDetailsBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        $scope.trustSrc = function (src) {
                            return $sce.trustAsResourceUrl(src);
                        };
                        $scope.iframe = { src: result.video };
                    }
                }, function (error) {
                    //console.log('Error while fetching details. Error stack : ' + error);
                });
            };
            this.getTeacherLeaveDetails = function () {
                consoleService.getTeacherLeaveDetailsBySchoolId(ConsoleCtrl.loginId).then(function (result) {
                    if (result) {
                        for (var i = 0; i < result.length; i++) {

                            var a;
                            a = new Date(result[i].date1);
                            var b = new Date(result[i].date2);
                            result[i].date1 = $filter('date')(a, 'dd-MM-yyyy');
                            result[i].date2 = $filter('date')(b, 'dd-MM-yyyy');
                        }
                        $timeout(function () {
                            ConsoleCtrl.TeacherleaveList = result;
                        }, 1000);
                    }
                }, function (error) {
                    //console.log('Error while fetching details. Error stack : ' + error);
                });
            };
            this.getClassDetails = function () {
                consoleService.getClassDetailsBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.ClassList = result;
                    }
                }, function (error) {
                    //console.log('Error while fetching details. Error stack : ' + error);
                });
            };
            this.getStudentFeeDetails = function () {
                consoleService.getSTudentFeeDetailsBySchoolId(ConsoleCtrl.schoolId, ConsoleCtrl.role, ConsoleCtrl.loginId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.studentFeeList = result;

                    }
                }, function (error) {
                    //console.log('Error while fetching details. Error stack : ' + error);
                });
            };
            this.getStaffDetails = function () {
                consoleService.getStaffListBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    // console.log(result);
                    if (result) {
                        ConsoleCtrl.staffLists = result;
                        // console.log(ConsoleCtrl.staffLists);
                        // ConsoleCtrl.staffLists.total = ConsoleCtrl.staffLists.length;
                        // console.log(ConsoleCtrl.staffLists.length);
                        // console.log(ConsoleCtrl.staffLists);
                        // var tod = getTodayDate();
                        // var finalArray = [];
                        // var finalArray1 = [];
                        // Attendance.find({filter:{where:{id:ConsoleCtrl.schoolId}}},function(response){
                        //     console.log(response);
                        // //    console.log(attendanceByDate);
                        // result.map({})
                        // })
                        // for(var i = 0;i<ConsoleCtrl.staffList.length;i++){
                        //     ConsoleCtrl.Name = ConsoleCtrl.staffList[i].lastName;
                        //           console.log(ConsoleCtrl.Name);

                        // }

                        // $('#examscroller').slimScroll({
                        //     position: 'right',
                        //     height: '350px',
                        //     railVisible: true,
                        //     alwaysVisible: false,
                        //     handleColor: '#D7DCE2'

                        // });
                    }
                }, function (error) {
                    //console.log('Error while fetching exam details. Error stack : ' + error);
                });
            };
            this.getBirthDayDetails = function () {
                consoleService.getStudentDetailsBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.birthdayList = result;
                    }
                }, function (error) {
                    //console.log('Error while fetching details. Error stack : ' + error);
                });
            };
            $scope.conf = {
                thumbnails: false,
                thumbSize: 280,
                inline: true,
                bubbles: false,
                bubbleSize: 20,
                imgBubbles: false,
                bgClose: false,
                piracy: false,
                imgAnim: 'slide',
            };
            this.mediaimages = function () {
                consoleService.getMediaImagesBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        $scope.images = [];
                        ConsoleCtrl.gallreyImages = result;
                        _.each(result, function (img) {
                            $scope.images.push({
                                id: img.id,
                                alt: 'photo',
                                url: img.galleryFile
                            })
                        })

                    }
                }, function (error) {
                    //console.log('Error while fetching details. Error stack : ' + error);
                });
            };
            this.getMessages = function () {
                consoleService.MessageSend(ConsoleCtrl.loginId).then(function (result) {
                    if (result) {
                        result.forEach(function (result) {
                            consoleService.getdetailedMeassage(result.messageId).then(function (result1) {
                                if (result1) {
                                    ConsoleCtrl.ShowMessageList.push(result1);
                                }
                            });
                        });
                    }
                }, function (error) {
                    //console.log('Error while fetching the records. Error stack : ' + error);
                });
            };

            this.getAcademicData = function () {
                AcademicBatch.find({
                    filter: { where: { schoolId: ConsoleCtrl.schoolId } }
                }, function (response) {
                    ConsoleCtrl.showtable = response;
                }, function (error) {
                    console.log(error);
                });
            };
            this.categoryList = function () {
                feesService.getcategoryRecords(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.categoryList = result;
                    }
                }, function (error) {
                    if (error) {
                    }
                });
            };
            // schooltimetable start
            this.getTimetable = function () {
                schooltimetableService.getSchoolTimetableById(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.timeTabletimetableList = result;

                        angular.forEach(ConsoleCtrl.timeTabletimetableList, function (v, i) {
                            ConsoleCtrl.timeTabletimetableList[i].startTime = new Date(v.startTime);
                            ConsoleCtrl.timeTabletimetableList[i].endTime = new Date(v.endTime);
                        });


                    }
                });
            };
            $scope.first = true;
            // $scope.first1 = true;
            // schooltimetablestop
            this.getWorkingDayDetails = function () {
                workingdaysService.getWorkingDayDetailsBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.workingdaysList = result;
                        if (result.length === 0) {
                            days = [
                                { day: 'Monday', schoolId: ConsoleCtrl.schoolId, working: true },
                                { day: 'Tuesday', schoolId: ConsoleCtrl.schoolId, working: true },
                                { day: 'Wednesday', schoolId: ConsoleCtrl.schoolId, working: true },
                                { day: 'Thursday', schoolId: ConsoleCtrl.schoolId, working: true },
                                { day: 'Friday', schoolId: ConsoleCtrl.schoolId, working: true },
                                { day: 'Saturday', schoolId: ConsoleCtrl.schoolId, working: true },
                                { day: 'Sunday', schoolId: ConsoleCtrl.schoolId, working: false }
                            ];
                            WorkingDay.createMany(days);
                        }
                        var days;
                        // ConsoleCtrl.workingdaysList = result;
                        ConsoleCtrl.StartTime = new Date(ConsoleCtrl.workingdaysList[0].startTime);
                        ConsoleCtrl.EndTime = new Date(ConsoleCtrl.workingdaysList[0].endTime);
                        angular.forEach(ConsoleCtrl.workingdaysList, function (v, i) {
                            ConsoleCtrl.workingdaysList[i].startTime = new Date(v.startTime);
                            ConsoleCtrl.workingdaysList[i].endTime = new Date(v.endTime);
                            $scope.first = !$scope.first;
                            // $scope.first1 = !$scope.first1;
                            // ConsoleCtrl.startTimeChange1 = "";
                        });
                        // if (result.length === 0) {
                        //     days = [
                        //         { day: 'Monday', schoolId: ConsoleCtrl.schoolId, working: true },
                        //         { day: 'Tuesday', schoolId: ConsoleCtrl.schoolId, working: true },
                        //         { day: 'Wednesday', schoolId: ConsoleCtrl.schoolId, working: true },
                        //         { day: 'Thursday', schoolId: ConsoleCtrl.schoolId, working: true },
                        //         { day: 'Friday', schoolId: ConsoleCtrl.schoolId, working: true },
                        //         { day: 'Saturday', schoolId: ConsoleCtrl.schoolId, working: true },
                        //         { day: 'Sunday', schoolId: ConsoleCtrl.schoolId, working: false }
                        //     ];
                        //     WorkingDay.createMany(days);
                        // }
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
            ConsoleCtrl.uploadSchoolTc = function (x) {
                ConsoleCtrl.file = document.getElementById('tcFile').files[0];
                // var date =new Date.now();
                var fd = new FormData();
                fd.append('file', ConsoleCtrl.file);
                var uploadUrl = configService.baseUrl() + "/ImageContainers/Schoollogo/upload";
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .then(function (response) {
                        if (response) {
                            ConsoleCtrl.file = configService.baseUrl() + '/ImageContainers/Schoollogo/download/' + response.data.result[0].filename;
                            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, logo: ConsoleCtrl.file }), function (res) {
                            }
                        }
                    }, function (error) {
                        console.log('Error while fetching the assignment records. Error stack : ' + error);
                    });
            };

            ConsoleCtrl.startTimeChange = function (start) {

                $scope.first = true;
                for (var i = 0; i < ConsoleCtrl.workingdaysList.length; i++) {
                    if (ConsoleCtrl.workingdaysList[i].working == true) {
                        ConsoleCtrl.workingdaysList[i].startTime = start;

                    } else {
                        ConsoleCtrl.workingdaysList[i].startTime = "";
                    }
                }

            }
            ConsoleCtrl.endTimeChange = function (end) {

                $scope.first = true;

                for (var i = 0; i < ConsoleCtrl.workingdaysList.length; i++) {
                    if (ConsoleCtrl.workingdaysList[i].working == true) {
                        ConsoleCtrl.workingdaysList[i].endTime = end;

                    } else {
                        ConsoleCtrl.workingdaysList[i].endTime = "";
                    }
                }
            }
            // ConsoleCtrl.startTimeChange1 = function () {
            //     $scope.first = false;
            //     // $scope.first1 = true;
            //     // ConsoleCtrl.StartTime = "";
            // }
            // ConsoleCtrl.endTimeChange1 = function () {
            //     $scope.first = false;
            //     // $scope.first1 = true;
            //     // ConsoleCtrl.EndTime = "";
            // }

            this.getSchoolDetails = function () {
                School.find({ filter: { where: { id: ConsoleCtrl.schoolId } } }, function (response) {
                    console.log(response);
                    ConsoleCtrl.schooldataaa = response;
                    ConsoleCtrl.Usertype = response[0].Usertype
                    ConsoleCtrl.SchoolName = response[0].schoolName;
                    ConsoleCtrl.SchoolLogo = response[0].logo;
                    ConsoleCtrl.softwareStartDate = response[0].softwareStartDate?new Date(response[0].softwareStartDate):'';
                    ConsoleCtrl.DateOfEstablishment = response[0].DateOfEstablishment?new Date(response[0].DateOfEstablishment):'';
                    ConsoleCtrl.AffiliatedBy = response[0].AffiliatedBy;
                    ConsoleCtrl.RegistrationNo = response[0].RegistrationNo;
                    ConsoleCtrl.AffiliationNo = response[0].AffiliationNo;
                    ConsoleCtrl.Board = response[0].Board;
                    ConsoleCtrl.Address = response[0].Address;
                    ConsoleCtrl.State = response[0].State;
                    ConsoleCtrl.Country = response[0].Country;
                    ConsoleCtrl.City = response[0].City;
                    ConsoleCtrl.District = response[0].District;
                    ConsoleCtrl.PrimaryMobile = response[0].PrimaryMobile;
                    ConsoleCtrl.PrimaryMobile1 = response[0].PrimaryMobile1;
                    ConsoleCtrl.AlternateMobile = response[0].AlternateMobile;
                    ConsoleCtrl.AlternateMobile1 = response[0].AlternateMobile1;
                    ConsoleCtrl.Landline = response[0].Landline;
                    ConsoleCtrl.Landline1 = response[0].Landline1;
                    ConsoleCtrl.Pin = response[0].Pin;
                    ConsoleCtrl.faymentStudents = response[0].faymentStudents;
                    ConsoleCtrl.Email = response[0].schoolEmail;
                    ConsoleCtrl.Website = response[0].Website;
                    ConsoleCtrl.facebook = response[0].facebookLink;
                    ConsoleCtrl.place = response[0].busaddress;
                    ConsoleCtrl.facebooks = response[0].facebookLink ? response[0].facebookLink : "https://www.facebook.com/studymonitor/";
                    ConsoleCtrl.apiUname = response[0].apiUname;
                    ConsoleCtrl.apiPwd = response[0].apiPwd;
                    ConsoleCtrl.schoolCode = response[0].schoolCode;
                    ConsoleCtrl.apiUrl = response[0].apiUrl
                    ConsoleCtrl.feeDelete = response[0].deleteFee
                    ConsoleCtrl.autoAtten = response[0].AutoAttendanceFlag

                }, function (error) { console.log(error) })
            };
            this.getModulesDetails = function () {
                // School.find({ filter: { where: { id: ConsoleCtrl.schoolId } } }, function (response) {
                //     ConsoleCtrl.SelectModule = response[0].SelectModule;
                //     ConsoleCtrl.SetPrefix = response[0].SetPrefix;
                //     ConsoleCtrl.SetSequence = response[0].SetSequence;
                // }, function (error) { console.log(error) })
            };
            this.getGradeList = function () {
                gradeService.getGradeDetailsBySchoolId(ConsoleCtrl.schoolId).then(function (result) {
                    if (result) {
                        ConsoleCtrl.gradeList = result;
                    }
                }, function (error) {
                    //console.log.log('Error while fetching library records. Error stack : ' + error);
                });
            };
            feesService.getStudentPayments(ConsoleCtrl.schoolId, ConsoleCtrl.role, ConsoleCtrl.loginId).then(function (result) {
                if (result) {
                    ConsoleCtrl.studentdueList = result.students;
                    ConsoleCtrl.sumoftot = _.sumBy(ConsoleCtrl.studentdueList, 'total');
                    ConsoleCtrl.sumofpaid = _.sumBy(ConsoleCtrl.studentdueList, 'paid');
                    ConsoleCtrl.sumofdueTillNow = _.sumBy(ConsoleCtrl.studentdueList, 'dueTillNow');
                    ConsoleCtrl.sumofdueTMinusPaid = ConsoleCtrl.sumofdueTillNow - ConsoleCtrl.sumofpaid;
                }
            }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            })

            //     });
            // };
            this.getHolidaysList = function () {
                var holidateDate = new Date();
                var getDay1 = holidateDate.getDay();
                console.log(getDay1);
                if (getDay1 == 0) {
                    ConsoleCtrl.weekOff = 'Weekly Off';
                }
                ConsoleCtrl.holidateDate = $filter('date')(holidateDate, 'MM-dd-yyyy');
                Calendar.find({
                    filter: { where: { schoolId: ConsoleCtrl.schoolId, date: ConsoleCtrl.holidateDate } }
                }, function (response) {
                    ConsoleCtrl.holidayList = response[0].eventName;
                    console.log(ConsoleCtrl.holidayList);
                    // ConsoleCtrl.absentmsg
                }, function (error) {
                    console.log(error);
                });
            };

        }
        (new Init()).getModulesDetails();
        (new Init()).getNoticeDetails();
        (new Init()).getExamDetails();
        (new Init()).getAssignmentDetails();
        (new Init()).getBirthDayDetails();
        (new Init()).getMessages();
        (new Init()).getVideoDetails();
        (new Init()).mediaimages();
        (new Init()).getClassDetails();
        (new Init()).getStudentFeeDetails();
        (new Init()).getabsentStudents();
        (new Init()).getTeacherLeaveDetails();
        (new Init()).getAcademicData();
        (new Init()).categoryList();
        (new Init()).getWorkingDayDetails();
        (new Init()).getTimetable();
        (new Init()).fnSubjectList();
        (new Init()).getSchoolDetails();
        (new Init()).getClassAndStaffList();
        (new Init()).getGradeList();
        (new Init()).getStaffDetails();
        (new Init()).getHolidaysList();

        // (new Init()).getFinanceDetails();
        ConsoleCtrl.chooseClass = function (classId) {
            ConsoleCtrl.classId = classId;
            ExamTypeService.getClassRecordsByClassId(ConsoleCtrl.classId).then(function (result) {
                if (result) {
                    ConsoleCtrl.subjectList = result;

                }
            }, function (error) {
                //console.log.log('Error while fetching subject list . Error stack : ' + error);
            });

        };
        ConsoleCtrl.updateRecord = function (address) {
            console.log(address);
            consoleService.updatebuslocation(ConsoleCtrl.schoolId, address, lat, lng, name).then(function (result) {
                console.log(result);
                // ConsoleCtrl.updateRecordclear();
            })
            // ConsoleCtrl.updateRecordclear = function(){
            //     ConsoleCtrl.place="";
            // }
            // if (ConsoleCtrl.busserviceList.id) {

            //     BusserviceService.updateBusServicesRecord(ConsoleCtrl.busserviceList).then(function (result) {
            //         if (result) {
            //             // ConsoleCtrl.busList = result.data;

            //             alert("Record updates");

            //         }
            //     }, function (error) {
            //         //console.log('Error while fetching the Busservice records. Error stack : ' + error);
            //     });
            // } else {
            //     ConsoleCtrl.busserviceList.schoolId = ConsoleCtrl.schoolId;
            //     BusserviceService.createBusServicesRecord(ConsoleCtrl.busserviceList).then(function (result) {
            //         if (result) {
            //             // ConsoleCtrl.busList = result.data;
            //             //console.log("result.id" + JSON.stringify(result))
            //             alert("Record Created");
            //             $location.url('/busservice/routes/' + result.data.id);
            //         }
            //     }, function (error) {
            //         //console.log('Error while fetching the Busservice records. Error stack : ' + error);
            //     });
            // }

        };
        var lat, lng, address, name, index;
        ConsoleCtrl.placeChanged = function (data) {

            var place = this.getPlace();
            name = place.name;
            console.log(name);
            address = place.formatted_address
            console.log(address);
            lat = place.geometry.location.lat();
            lng = place.geometry.location.lng();
            console.log(lat);
            console.log(lng);

        }
        ConsoleCtrl.classChange = function (cid) {
            ConsoleCtrl.classyId = cid;
            consoleService.getTimeTableIdFromSchedule(ConsoleCtrl.classyId).then(function (result) {
                if (result) {
                    ConsoleCtrl.scheduleData = result;
                    for (var i = 0; i < ConsoleCtrl.scheduleData.length; i++) {
                        ConsoleCtrl.timeTableIdList.push(ConsoleCtrl.scheduleData[i]);
                        ConsoleCtrl.timetableId = ConsoleCtrl.timeTableIdList[i].timetableId;
                        consoleService.getTimeTablebyTimeTableId(ConsoleCtrl.timetableId).then(function (result1) {
                            if (result1) {
                                ConsoleCtrl.timeTableData = result1;
                                for (var i = 0; i < ConsoleCtrl.timeTableData.length; i++) {

                                }
                            }
                        });
                    }

                }
            }, function (error) {
                //console.log('Error while fetching details. Error stack : ' + error);
            });
        }
        // Reload Action
        ConsoleCtrl.reloadRoute = function () {
            $state.reload();
        };
        // Show / Hide Action
        ConsoleCtrl.facebook = true;
        ConsoleCtrl.showfacebook = function () {
            ConsoleCtrl.facebook = ConsoleCtrl.facebook ? false : true;
        };
        ConsoleCtrl.pfacebook = true;
        ConsoleCtrl.pshowfacebook = function () {
            ConsoleCtrl.pfacebook = ConsoleCtrl.pfacebook ? false : true;
        };
        ConsoleCtrl.finance = true;
        ConsoleCtrl.showfinance = function () {
            ConsoleCtrl.finance = ConsoleCtrl.finance ? false : true;
        };
        ConsoleCtrl.message = true;
        ConsoleCtrl.showmessage = function () {
            ConsoleCtrl.message = ConsoleCtrl.message ? false : true;
        };
        ConsoleCtrl.pmessage = true;
        ConsoleCtrl.showpmessage = function () {
            ConsoleCtrl.pmessage = ConsoleCtrl.pmessage ? false : true;
        };
        ConsoleCtrl.birthday = true;
        ConsoleCtrl.showbirthday = function () {
            ConsoleCtrl.birthday = ConsoleCtrl.birthday ? false : true;
        };
        ConsoleCtrl.addphoto = true;
        ConsoleCtrl.showaddphoto = function () {
            ConsoleCtrl.addphoto = ConsoleCtrl.addphoto ? false : true;
        };
        ConsoleCtrl.paddphoto = true;
        ConsoleCtrl.showpaddphoto = function () {
            ConsoleCtrl.paddphoto = ConsoleCtrl.paddphoto ? false : true;
        };
        ConsoleCtrl.timetable = true;
        ConsoleCtrl.showtimetable = function () {
            ConsoleCtrl.timetable = ConsoleCtrl.timetable ? false : true;
        };
        ConsoleCtrl.ptimetable = true;
        ConsoleCtrl.showptimetable = function () {
            ConsoleCtrl.ptimetable = ConsoleCtrl.ptimetable ? false : true;
        };
        ConsoleCtrl.teachersleave = true;
        ConsoleCtrl.showteachersleave = function () {
            ConsoleCtrl.teachersleave = ConsoleCtrl.teachersleave ? false : true;
        };
        ConsoleCtrl.leave = true;
        ConsoleCtrl.showleave = function () {
            ConsoleCtrl.leave = ConsoleCtrl.leave ? false : true;
        };
        ConsoleCtrl.absentStudents = true;
        ConsoleCtrl.showabsentStudents = function () {
            ConsoleCtrl.absentStudents = ConsoleCtrl.absentStudents ? false : true;
        };
        ConsoleCtrl.notifications = true;
        ConsoleCtrl.shownotifications = function () {
            ConsoleCtrl.notifications = ConsoleCtrl.notifications ? false : true;
        };
        ConsoleCtrl.attendance = true;
        ConsoleCtrl.showattendance = function () {
            ConsoleCtrl.attendance = ConsoleCtrl.attendance ? false : true;
        };
        ConsoleCtrl.fees = true;
        ConsoleCtrl.showfees = function () {
            ConsoleCtrl.fees = ConsoleCtrl.fees ? false : true;
        };
        ConsoleCtrl.parentnotifications = true;
        ConsoleCtrl.showparentnotifications = function () {
            ConsoleCtrl.parentnotifications = ConsoleCtrl.parentnotifications ? false : true;
        };
        ConsoleCtrl.video = true;
        ConsoleCtrl.showvideo = function () {
            ConsoleCtrl.video = ConsoleCtrl.video ? false : true;
        };
        ConsoleCtrl.pvideo = true;
        ConsoleCtrl.pshowvideo = function () {
            ConsoleCtrl.pvideo = ConsoleCtrl.pvideo ? false : true;
        };
        ConsoleCtrl.exam = true;
        ConsoleCtrl.showexam = function () {
            ConsoleCtrl.exam = ConsoleCtrl.exam ? false : true;
        };
        ConsoleCtrl.pexam = true;
        ConsoleCtrl.showpexam = function () {
            ConsoleCtrl.pexam = ConsoleCtrl.pexam ? false : true;
        };
        ConsoleCtrl.homework = true;
        ConsoleCtrl.showhomework = function () {
            ConsoleCtrl.homework = ConsoleCtrl.homework ? false : true;
        };
        ConsoleCtrl.birthDayCheck = function (dateofBirth) {
            var a = (new Date(dateofBirth), 'MM-dd');
            var b = (new Date(), 'MM-dd');
            var c = (new Date(a) - new Date(b)) / (1000 * 3600 * 24);
            if (c === 0) {
                return true;
            }
            else {
                return false;
            }
        };
        ConsoleCtrl.Editroles = function (a) {
            $rootScope.roleAdmin = a;
            $state.go('home.RoleCreation');
        }
        //Calendar Configurations
        ConsoleCtrl.calendarConfig = {
            calendar: {
                height: 200,
                editable: false,
                defaultView: 'month',
                //eventRender: ConsoleCtrl.timeTablecalendarRenderEvent
            }
        };

        $scope.tab = 0;
        $scope.setTab = function (newTab) { $scope.tab = newTab; };
        $scope.isSet = function (tabNum) { return $scope.tab === tabNum; };


        ConsoleCtrl.defaultHighlight = function () {
            document.getElementById('logo-1').style.backgroundColor = 'black';
            School.find({ filter: { where: { id: ConsoleCtrl.schoolId } } }, function (response) {
                ConsoleCtrl.DailyfeeL = response[0].Dailyfee;
                ConsoleCtrl.AttendanceL = response[0].Attendance;
                ConsoleCtrl.ClasswiseL = response[0].Classwise;
                ConsoleCtrl.DailyexpenseL = response[0].Dailyexpense;
                ConsoleCtrl.StudtlL = response[0].Studtl;
                ConsoleCtrl.StffdtlL = response[0].Stffdtl;
                ConsoleCtrl.SmsrepL = response[0].Smsrep;
                ConsoleCtrl.CusrepL = response[0].Cusrep;
                ConsoleCtrl.feeDuerepL = response[0].feeDuerep;

                if (ConsoleCtrl.DailyfeeL == true) {
                    ConsoleCtrl.Dailyfeereports = true;
                };
                if (ConsoleCtrl.AttendanceL == true) {
                    ConsoleCtrl.Attendancereports = true;
                };
                if (ConsoleCtrl.ClasswiseL == true) {
                    ConsoleCtrl.Classwisereports = true;
                };
                if (ConsoleCtrl.DailyexpenseL == true) {
                    ConsoleCtrl.Dailyexpensereports = true;
                };
                if (ConsoleCtrl.StudtlL == true) {
                    ConsoleCtrl.Studentdetail = true;
                };
                if (ConsoleCtrl.StffdtlL == true) {
                    ConsoleCtrl.Staffdetail = true;
                };
                if (ConsoleCtrl.SmsrepL == true) {
                    ConsoleCtrl.Smsreport = true;
                };
                if (ConsoleCtrl.CusrepL == true) {
                    ConsoleCtrl.Cusreport = true;
                };
                if (ConsoleCtrl.feeDuerepL == true) {
                    ConsoleCtrl.feeDuereport = true;
                };
                // window.location.reload();      
            });
        }


        ConsoleCtrl.Img = function () {
            $scope.tab = 6;
            // document.getElementById('basicId').style.display = 'block';
            //  document.getElementById('img').style.display = 'block';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('img7').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('timetableId').style.display = 'block';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('workingDay').style.display = 'block';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('module').style.display = 'none';
            document.getElementById('demo2').style.display = 'block';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('img12').style.display = 'block';
            // document.getElementById('img14').style.display = 'none';
        }

        ConsoleCtrl.Img2 = function () {
            $scope.tab = 1;
            // document.getElementById('Paymentid').style.display = 'block';
            document.getElementById('img2').style.display = 'block';
            document.getElementById('img3').style.display = 'block';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('demo').style.display = 'block';
            document.getElementById('fee').style.display = 'block';
            document.getElementById('img7').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('timetableId').style.display = 'none';
            document.getElementById('workingDay').style.display = 'none';
            document.getElementById('module').style.display = 'none';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'none';


        }
        ConsoleCtrl.Img4 = function () {
            document.getElementById('ABC').style.display = 'block';
            document.getElementById('img4').style.display = 'block';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('img7').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('timetableId').style.display = 'none';
            document.getElementById('workingDay').style.display = 'none';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('module').style.display = 'none';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'none';
        }
        ConsoleCtrl.Img7 = function () {
            document.getElementById('img7').style.display = 'block';
            document.getElementById('tables1').style.display = 'block';
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('timetableId').style.display = 'none';
            document.getElementById('workingDay').style.display = 'none';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('module').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'none';

        }
        ConsoleCtrl.Img5 = function () {
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('img7').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('demo1').style.display = 'block';
            document.getElementById('timetableId').style.display = 'block';
            document.getElementById('workingDay').style.display = 'block';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('module').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'none';


        }
        ConsoleCtrl.Img8 = function () {
            $scope.tab = 8;
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('img7').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('demo3').style.display = 'block';
            document.getElementById('timetableId').style.display = 'none';
            document.getElementById('workingDay').style.display = 'none';
            document.getElementById('examNmarks').style.display = 'block';
            // document.getElementById('examid').style.display = 'block';
            document.getElementById('module').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'none';
        }
        ConsoleCtrl.Img6 = function () {
            $scope.tab = 9;
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('img7').style.display = 'none';
            // document.getElementById('img10').style.display = 'none';
            // document.getElementById('img9').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('timetableId').style.display = 'none';
            document.getElementById('workingDay').style.display = 'none';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('module').style.display = 'block';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'block';
        }
        ConsoleCtrl.Img9 = function () {
            // document.getElementById('img9').style.display = 'block';
            // document.getElementById('img10').style.display = 'none';
            document.getElementById('ABC').style.display = 'none';
            document.getElementById('img4').style.display = 'none';
            document.getElementById('img2').style.display = 'none';
            document.getElementById('img3').style.display = 'none';
            // document.getElementById('img').style.display = 'none';
            // document.getElementById('img1').style.display = 'none';
            document.getElementById('demo').style.display = 'none';
            document.getElementById('fee').style.display = 'none';
            document.getElementById('img7').style.display = 'none';
            document.getElementById('tables1').style.display = 'none';
            document.getElementById('demo1').style.display = 'none';
            document.getElementById('timetableId').style.display = 'none';
            document.getElementById('workingDay').style.display = 'none';
            document.getElementById('examNmarks').style.display = 'none';
            document.getElementById('module').style.display = 'none';
            document.getElementById('demo3').style.display = 'none';
            document.getElementById('demo2').style.display = 'none';
            document.getElementById('img12').style.display = 'none';
            // document.getElementById('img14').style.display = 'none';

        }

        //logo changes according to click start
        ConsoleCtrl.log1 = function (status) {
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = 'black';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = '#0755BA';
            document.getElementById('logo-4').style.backgroundColor = '#0755BA';
            document.getElementById('logo-5').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = '#0755BA';
            document.getElementById('logo-9').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-8').style.backgroundColor = '#a89f9f';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            document.getElementById('img12').style.display = 'none';
            // }
        }

        ConsoleCtrl.log3 = function (status) {
            document.getElementById('logo-1').style.backgroundColor = 'black';
            
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = 'black';
            document.getElementById('logo-4').style.backgroundColor = '#0755BA';
            document.getElementById('logo-5').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = '#0755BA';
            document.getElementById('logo-9').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-8').style.backgroundColor = '#a89f9f';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            document.getElementById('img12').style.display = 'none';
            // }
        }
        ConsoleCtrl.log4 = function (status) {
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = '#0755BA';
            document.getElementById('logo-4').style.backgroundColor = 'black';
            document.getElementById('logo-5').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = '#0755BA';
            document.getElementById('logo-9').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-8').style.backgroundColor = '#a89f9f';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            document.getElementById('img12').style.display = 'none';
            // }
        }
        ConsoleCtrl.log5 = function (status) {
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = '#0755BA';
            document.getElementById('logo-4').style.backgroundColor = '#0755BA';
            document.getElementById('logo-5').style.backgroundColor = 'black';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = '#0755BA';
            document.getElementById('logo-9').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-8').style.backgroundColor = '#a89f9f';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            // }
            document.getElementById('img12').style.display = 'none';
        }
        ConsoleCtrl.log7 = function (status) {
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = '#0755BA';
            document.getElementById('logo-4').style.backgroundColor = '#0755BA';
            document.getElementById('logo-5').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = 'black';
            document.getElementById('logo-9').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-8').style.backgroundColor = '#a89f9f';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            // }
            document.getElementById('img12').style.display = 'none';
        }
        ConsoleCtrl.log9 = function (status) {
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = '#0755BA';
            document.getElementById('logo-4').style.backgroundColor = '#0755BA';
            document.getElementById('logo-5').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = '#0755BA';
            document.getElementById('logo-9').style.backgroundColor = 'black';
            // document.getElementById('logo-8').style.backgroundColor = '#a89f9f';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            // }
            document.getElementById('img12').style.display = 'none';
        }
        ConsoleCtrl.log8 = function (status) {
            // if (status) {
            document.getElementById('logo-1').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-2').style.backgroundColor = '#0755BA';
            document.getElementById('logo-3').style.backgroundColor = '#0755BA';
            document.getElementById('logo-4').style.backgroundColor = '#0755BA';
            document.getElementById('logo-5').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-6').style.backgroundColor = '#0755BA';
            document.getElementById('logo-7').style.backgroundColor = '#0755BA';
            document.getElementById('logo-9').style.backgroundColor = '#0755BA';
            // document.getElementById('logo-8').style.backgroundColor = 'black';
            // document.getElementById('logo-10').style.backgroundColor = '#0755BA';
            // }
            document.getElementById('img12').style.display = 'none';
        }
        //Submit Model
        ConsoleCtrl.SUBMITAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ConsoleCtrl.schoolId,
                SchoolName: ConsoleCtrl.SchoolName,
                softwareStartDate: ConsoleCtrl.softwareStartDate,
                AffiliatedBy: ConsoleCtrl.AffiliatedBy,
                RegistrationNo: ConsoleCtrl.RegistrationNo,
                AffiliationNo: ConsoleCtrl.AffiliationNo,
                DateOfEstablishment: ConsoleCtrl.DateOfEstablishment,
                Board: ConsoleCtrl.Board
            };
            if (data) {
                if (ConsoleCtrl.editmode) {
                    data.id = ConsoleCtrl.editingSubjectId;
                    consoleService.updateSubject(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            // (new Init()).fnSubjectList();
                            //Close Modal Window
                            ConsoleCtrl.closeModal();
                            //Clear Fields
                            // clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            ConsoleCtrl.closeModal();
                            //Clear Fields
                            // clearformfields();
                            //Show Toast
                            toastr.error(APP_MESSAGES.SERVER_ERROR);
                        }
                    });
                }
                else {

                    consoleService.schoolinfo(data).then(function (result) {
                        if (result) {
                            $cookies.putObject('__s', result);

                            //Re initialize the data
                            //(new Init()).fnSubjectList();
                            //Close Modal Window
                            ConsoleCtrl.closeModal();
                            //Clear Fields
                            // clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                            location.reload();
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log.log('Error while fetching records. Error stack : ' + error);
                    });
                }

            }

        }

        // close model
        ConsoleCtrl.closeModal = function () {
        }

        ConsoleCtrl.SUBMITAction1 = function (invalid) {
            if (invalid) {
                return;
            }

            var data = {
                // classId: ConsoleCtrl.formFields.showClassId,
                schoolId: ConsoleCtrl.schoolId,
                Address: ConsoleCtrl.Address,
                Pin: ConsoleCtrl.Pin,
                Email: ConsoleCtrl.Email,
                City: ConsoleCtrl.City,
                State: ConsoleCtrl.State,
                District: ConsoleCtrl.District,
                Country: ConsoleCtrl.Country,
                PrimaryMobile: ConsoleCtrl.PrimaryMobile,
                PrimaryMobile1: ConsoleCtrl.PrimaryMobile1,
                AlternateMobile: ConsoleCtrl.AlternateMobile,
                AlternateMobile1: ConsoleCtrl.AlternateMobile1,
                Landline: ConsoleCtrl.Landline,
                Landline1: ConsoleCtrl.Landline1,
                Website: ConsoleCtrl.Website

            };
            if (data) {
                if (ConsoleCtrl.editmode) {
                    data.id = ConsoleCtrl.editingSubjectId;
                    consoleService.updateSubject(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            // (new Init()).fnSubjectList();
                            //Close Modal Window
                            ConsoleCtrl.closeModal();
                            //Clear Fields
                            // clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            ConsoleCtrl.closeModal();
                            //Clear Fields
                            // clearformfields();
                            //Show Toast
                            toastr.error(APP_MESSAGES.SERVER_ERROR);
                        }
                    });
                }
                else {
                    consoleService.schoolinfo1(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            //(new Init()).fnSubjectList();
                            //Close Modal Window
                            ConsoleCtrl.closeModal();
                            //Clear Fields
                            // clearformfields1();
                            //Show Toast
                            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log.log('Error while fetching records. Error stack : ' + error);
                    });
                }

            }

        }
        // clear fields start
        ConsoleCtrl.examClear = function () {
            ConsoleCtrl.formFieldsubjectName = "";
            ConsoleCtrl.oneTimePay = [{}];
        }

        ConsoleCtrl.Feeclear = function () {
            ConsoleCtrl.formFields.categoryName = "";
        }
        ConsoleCtrl.timetableclear = function () {
            ConsoleCtrl.formFields.title = "";
            ConsoleCtrl.formFields.duration = "";
            ConsoleCtrl.formFields.startTime = "";
            ConsoleCtrl.formFields.endTime = "";
        }
        // ConsoleCtrl.clearfee = function(){
        //     console.log("clearfeeeeee");
        //     ConsoleCtrl.SetPrefix ="";
        //     ConsoleCtrl.SetSequence = "";
        // }

        // clear fields end

        ConsoleCtrl.closeModal = function () {
        }

        ConsoleCtrl.Academicsubmit = function (invalid) {

            if (invalid) {
                return;
            }
            // AcademicBatch.find({
            //     filter: { where: { schoolId: ConsoleCtrl.schoolId, status: "Active" } }
            // }, function (response) {
            //     ConsoleCtrl.getActivedata = response;
            //     console.log(ConsoleCtrl.getActivedata);
            //     AcademicBatch.prototype$patchAttributes({ id: response[0].id, status: "InActive" }, function (response) {
            //         if (response) {
            //             console.log(response);
            //             (new Init()).getAcademicData();
            //         }
            //     })
            // }, function (error) {
            //     console.log(error);
            // });
            AcademicBatch.create({
                schoolId: ConsoleCtrl.schoolId,
                academicBatch: ConsoleCtrl.academicBatch,
                startDate: ConsoleCtrl.startDate,
                endDate: ConsoleCtrl.endDate,
                status: "InActive"
            }, function (success) {
                if (success) {
                    (new Init()).getAcademicData();
                    ConsoleCtrl.academicBatch = "";
                    ConsoleCtrl.startDate = "";
                    ConsoleCtrl.endDate = "";
                    ConsoleCtrl.status = "";

                }
                (new Init()).getAcademicData();
            })
                (new Init()).getAcademicData();
        }

        ConsoleCtrl.editActive = function (data) {
            if (data.status == 'Active') {
                var status1 = "InActive";
                document.getElementById('showActiv').style.display = 'none';

            } else {
                AcademicBatch.find({
                    filter: { where: { schoolId: ConsoleCtrl.schoolId, status: "Active" } }
                }, function (response) {
                    ConsoleCtrl.getActivedata = response;
                    AcademicBatch.prototype$patchAttributes({ id: response[0].id, status: "InActive" }, function (response) {
                        if (response) {
                            (new Init()).getAcademicData();
                        }
                    })
                }, function (error) {
                    console.log(error);
                });
                document.getElementById('showActiv').style.display = 'none';
                var status1 = "Active";
            }
            AcademicBatch.upsert({ id: data.id, status: status1 }, function (response) {
                (new Init()).getAcademicData();
            }, function (error) {
            })
        }

        ConsoleCtrl.closeModal1 = function () {
            var modal = $('#edit-feecategory');
            modal.modal('hide');
        }
        //start academic dates
        ConsoleCtrl.ValidateAcademicdate = function () {
            $("#endacademic").change(function () {

                var startDate = document.getElementById("startacademic").value;
                var endDate = document.getElementById("endacademic").value;

                if ((Date.parse(endDate) <= Date.parse(startDate))) {
                    alert("End date should be greater than Start date");
                    document.getElementById("endacademic").value = "";
                }
                if (startDate == "") {
                    alert("Please Select StartDate Before Selecting The EndDate");
                    document.getElementById('endacademic').value = "";
                    return;
                }
                if (endDate == "") {
                    return;
                }
            });
            $("#startacademic").change(function () {
                // alert("Startdate");
                var startDate = document.getElementById("startacademic").value;
                var endDate = document.getElementById("endacademic").value;

                if ((Date.parse(endDate) <= Date.parse(startDate))) {
                    alert("End date should be greater than Start date");
                    document.getElementById("startacademic").value = "";
                }
            });
        }

        //********************************** Create or Update New Record
        ConsoleCtrl.addFeeCategory = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ConsoleCtrl.schoolId,
                categoryName: ConsoleCtrl.formFields.categoryName
            };

            if (data) {

                if (ConsoleCtrl.editmode1) {
                    data.id = ConsoleCtrl.editingcategoryId;
                    feesService.updateCategory(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            (new Init()).categoryList();
                            //Close Modal Window
                            ConsoleCtrl.closeModal1();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            ConsoleCtrl.closeModal1();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.error(APP_MESSAGES.SERVER_ERROR);
                        }
                    });
                }
                else {
                    feesService.verifycategoryDataExistsOrNot(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                        }
                    }, function (result1) {
                        if (result1.status === 404) {
                            feesService.CreateCategory(data).then(function (result) {
                                if (result) {
                                    //Re initialize the data
                                    (new Init()).categoryList();
                                    //Close Modal Window
                                    ConsoleCtrl.closeModal1();
                                    //Clear Fields
                                    clearformfields();
                                    //Show Toast
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                }
                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                            });
                        }
                    });
                }
            }
        };



        //Delete confirmation box
        ConsoleCtrl.confirmCallbackMethod1 = function (index) {
            deleteCategory(index);
        };
        //Delete cancel box
        ConsoleCtrl.confirmCallbackCancel1 = function (index) {
            if (index) {
                return false;
            }
            return;
        };

        //Delete Action
        var deleteCategory = function (index) {
            if (ConsoleCtrl.categoryList) {
                feesService.deleteCategory(ConsoleCtrl.categoryList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).categoryList();
                        ConsoleCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                });
            }
        };

        ConsoleCtrl.updateCategory = function (index) {
            ConsoleCtrl.formFields.categoryName = ConsoleCtrl.categoryList[index].categoryName;
            ConsoleCtrl.editingcategoryId = ConsoleCtrl.categoryList[index].id;
            //Open Modal
            ConsoleCtrl.openModal1();

            $timeout(function () {
                ConsoleCtrl.editmode1 = true;
            });
        };
        ConsoleCtrl.openModal1 = function () {
            var modal = $('#edit-feecategory');
            modal.modal('show');
        };

        //Close or Open modal
        ConsoleCtrl.timeTablecloseModal = function () {
            var modal = $('#edit-Schooltimetable');
            modal.modal('hide');
            //ClearFields
            clearformfields();
            // $window.location.reload();
            document.getElementById('demo1').style.display = 'block';
            document.getElementById('timetableId').style.display = 'block';
            document.getElementById('workingDay').style.display = 'block';
            // ConsoleCtrl.formFields.title="";
        };
        ConsoleCtrl.timeTableopenModal = function () {
            var modal = $('#edit-Schooltimetable');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            ConsoleCtrl.formFields = {};
        }
        //Delete confirmation box
        ConsoleCtrl.timeTableconfirmCallbackMethod = function (index) {
            deleteTimetable(index);
        };
        //Delete cancel box
        ConsoleCtrl.timeTableconfirmCallbackCancel = function () {
            return false;
        };

        //Event click
        ConsoleCtrl.timeTablecalendarEventClick = function (date, jsEvent, view) {

        };
        //Render a calendar
        ConsoleCtrl.timeTablecalendarRenderEvent = function (event, element, view) {
            var template = '<a class="btn btn-circle btn-icon-only red delete" href="javascript:void(0);"><i class="icon-trash"></i></a>';
            element.append(template);
            element.find('.delete').bind('click', function () {
                ConsoleCtrl.timeTabledeleteCalendarEvent(event);
                return false;
            });
            $compile(element)($scope);
        };
        //Calendar Configurations
        ConsoleCtrl.timeTablecalendarConfig = {
            calendar: {
                height: 500,
                editable: false,
                defaultView: 'agendaDay',
                minTime: '6:00:00',
                maxTime: '22:00:00',
                eventClick: ConsoleCtrl.timeTablecalendarEventClick,
                //eventRender: ConsoleCtrl.timeTablecalendarRenderEvent
            }
        };

        ConsoleCtrl.duration = function () {

            ConsoleCtrl.formFields.duration = ((ConsoleCtrl.formFields.endTime) - (ConsoleCtrl.formFields.startTime)) / 60000;
        };
        $timeout(function () {
            $('#starttimepicker').on('dp.change', function () {
                ConsoleCtrl.formFields.startTime = $(this).val();
            });
        }, 500);
        $timeout(function () {
            $('#endtimepicker').on('dp.change', function () {
                ConsoleCtrl.formFields.endTime = $(this).val();
            });
        }, 500);
        //Get the different color code depends on the type of title or duration
        //As of Now - Duration less than 20 and title contains lunch
        var getColorCode = function (duration, title) {

            if ((parseInt(duration) <= 20) || (title.toLowerCase().indexOf('lunch') > -1)) {
                return "#EC7063";
            }
            return "#26a69a";
        };
        //Binding the events to Calendar Model
        ConsoleCtrl.timeTableeventSources = [ConsoleCtrl.timeTablecalendarEvent];
        // Add Action
        ConsoleCtrl.TimetableAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ConsoleCtrl.schoolId,
                title: ConsoleCtrl.formFields.title,
                startTime: ConsoleCtrl.formFields.startTime,
                endTime: ConsoleCtrl.formFields.endTime,
                duration: ConsoleCtrl.formFields.duration,
                attendance: ConsoleCtrl.formFields.attendance
            };
            if (data) {
                //Check whether editmode or normal mode
                if (!ConsoleCtrl.timeTableeditmode) {
                    schooltimetableService.getExistingSchoolTimetableRecords(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            schooltimetableService.createSchoolTimetableRecords(data).then(function (res) {
                                if (res) {
                                    (new Init()).getTimetable();
                                    ConsoleCtrl.timeTablecloseModal();
                                    //Show Toast timeTablecloseModal Success
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                }

                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log('Error while Fetching the Records' + error);
                            });
                        }
                    });
                } else {
                    data.id = ConsoleCtrl.timeTableeditingTimetableId;
                    schooltimetableService.editTimetable(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getTimetable();
                            //Close Modal
                            ConsoleCtrl.timeTablecloseModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };

        //Delete Action
        var deleteTimetable = function (index) {
            if (ConsoleCtrl.timeTabletimetableList) {
                schooltimetableService.deleteTimetable(index).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getTimetable();
                        // ConsoleCtrl.timeTablecloseModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Assignment. Error Stack' + error);
                });
            }
        };
        //Edit Action
        ConsoleCtrl.timeTableeditTimetable = function (index) {
            ConsoleCtrl.formFields = ConsoleCtrl.timeTabletimetableList[index];
            // ConsoleCtrl.formFields.startTime = ConsoleCtrl.timeTabletimetableList[index].startTime;
            // ConsoleCtrl.formFields.endTime = ConsoleCtrl.timeTabletimetableList[index].endTime;
            // ConsoleCtrl.formFields.duration = ConsoleCtrl.timeTabletimetableList[index].duration;
            // ConsoleCtrl.formFields.attendance = ConsoleCtrl.timeTabletimetableList[index].attendance;
            ConsoleCtrl.timeTableeditingTimetableId = ConsoleCtrl.timeTabletimetableList[index].id;
            //Set View Mode false
            ConsoleCtrl.timeTabledetailsMode = false;
            //Open Modal
            ConsoleCtrl.timeTableopenModal();
            $timeout(function () {
                ConsoleCtrl.timeTablesetFloatLabel();
                //Enable Edit Mode
                ConsoleCtrl.timeTableeditmode = true;
            });
        };
        ConsoleCtrl.editmoduleType = function (type, data) {
            if (type == "Staff") {
                ConsoleCtrl.moduleMoreDetails1 = true;
                ConsoleCtrl.moduleMoreDetails2 = false;
                ConsoleCtrl.moduleMoreDetails3 = true;
                ConsoleCtrl.moduleMoreDetails4 = true;
                ConsoleCtrl.Usertype = data.userType;
            }
            if (type == "Student") {
                ConsoleCtrl.moduleMoreDetails1 = true;
                ConsoleCtrl.moduleMoreDetails2 = true;
                ConsoleCtrl.moduleMoreDetails3 = true;
                ConsoleCtrl.moduleMoreDetails4 = true;
                ConsoleCtrl.Usertype = type;
                ConsoleCtrl.SelectModule = data.SelectModule;
                ConsoleCtrl.SetPrefix = data.SetPrefix;
                ConsoleCtrl.SetSequence = data.SetSequence;
            }
            if (type == "Accountant") {
                ConsoleCtrl.moduleMoreDetails1 = true;
                ConsoleCtrl.moduleMoreDetails2 = false;
                ConsoleCtrl.moduleMoreDetails3 = true;
                ConsoleCtrl.moduleMoreDetails4 = true;
                ConsoleCtrl.Usertype = data.userType;
            }
        }
        ConsoleCtrl.ModuleOpenModal = function () {
            var modal = $('#editModule');
            modal.modal('show');
        }
        ConsoleCtrl.ModulecloseModal = function () {
            var modal = $('#editModule');
            modal.modal('hide');
        };
        //Setting up float label
        ConsoleCtrl.timeTablesetFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=title]'));
            Metronic.setFlotLabel($('input[name=startTime]'));
            Metronic.setFlotLabel($('input[name=endTime]'));
            Metronic.setFlotLabel($('input[name=attendance]'));
        };
        ConsoleCtrl.timeTableduration = function () {
            ConsoleCtrl.formFields.duration = ((ConsoleCtrl.formFields.endTime) - (ConsoleCtrl.formFields.startTime)) / 60000;
        };
        $timeout(function () {
            $('#starttimepicker').on('dp.change', function () {
                ConsoleCtrl.formFields.startTime = $(this).val();
            });
        }, 500);
        $timeout(function () {
            $('#endtimepicker').on('dp.change', function () {
                ConsoleCtrl.formFields.endTime = $(this).val();
            });
        }, 500);

        //Export to Excel For Add New Period
        ConsoleCtrl.timeTableexportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ConsoleCtrl.timeTableprintData = function () {
            var divToPrint = document.getElementById("printTable2");
            ConsoleCtrl.newWin = window.open("");
            ConsoleCtrl.newWin.document.write(divToPrint.outerHTML);
            ConsoleCtrl.newWin.print();
            ConsoleCtrl.newWin.close();
        }
        //End Print View

        //Export to Excel For Add Fee Category
        ConsoleCtrl.exportToExcel2 = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };

        //Bhasha Print View
        ConsoleCtrl.feeprintData = function () {
            var divToPrint = document.getElementById("printTablep");
            ConsoleCtrl.newWin = window.open("");
            ConsoleCtrl.newWin.document.write(divToPrint.outerHTML);
            ConsoleCtrl.newWin.print();
            ConsoleCtrl.newWin.close();
        }
        //End Print View

        // schooltimetable controller function end

        // ConsoleCtrl.saveDay = function (day) {
        //     workingdaysService.CreateOrUpdateWorkingDay(day).then(function (result) {
        //         if (result) {
        //             toastr.success(APP_MESSAGES.INSERT_SUCCESS);
        //         }
        //     });
        // };

        $scope.first = true;
        ConsoleCtrl.saveendTime1 = function (start, end) {
            $scope.first = !$scope.first;
            for (var i = 0; i < ConsoleCtrl.workingdaysList.length; i++) {
                if (ConsoleCtrl.workingdaysList[i].working == true) {
                    ConsoleCtrl.workingdaysList[i].startTime = start;
                    ConsoleCtrl.workingdaysList[i].endTime = end;
                } else {
                    ConsoleCtrl.workingdaysList[i].startTime = "";
                    ConsoleCtrl.workingdaysList[i].endTime = "";
                }
            }
            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
        }

        ConsoleCtrl.displayFeeReceiptData = function (data, type) {
            if (data == "Fee Receipt") {
                ConsoleCtrl.feereceiptFunc();
            } else if (data == "Reg No") {
                ConsoleCtrl.regnoFunc();
            }


        }
        ConsoleCtrl.feereceiptFunc = function () {
            for (var i = 0; i < ConsoleCtrl.schooldata1.length; i++) {
                if (ConsoleCtrl.schooldata1[i].SelectModule == "Fee Receipt") {
                    ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldata1[i].SetPrefix;
                    ConsoleCtrl.SetSequence = ConsoleCtrl.schooldata1[i].SetSequence;
                } else if (ConsoleCtrl.schooldata1[i].SelectModule !== "Fee Receipt") {
                    ConsoleCtrl.SetPrefix = "";
                    ConsoleCtrl.SetSequence = "";
                }
            }
        }
        ConsoleCtrl.regnoFunc = function () {

            for (var i = 0; i < ConsoleCtrl.schooldata1.length; i++) {
                if (ConsoleCtrl.schooldata1[i].SelectModule == "Reg No") {
                    ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldata1[i].SetPrefix;
                    ConsoleCtrl.SetSequence = ConsoleCtrl.schooldata1[i].SetSequence;

                }
            }
        }
        // $scope.first1 = true;
        ConsoleCtrl.saveendTime = function (start, end) {
            // $scope.first1 = !$scope.first1;
            for (var i = 0; i < ConsoleCtrl.workingdaysList.length; i++) {
                // if (ConsoleCtrl.workingdaysList[i].working == true) {
                //     // ConsoleCtrl.workingdaysList[i].startTime = start;
                //     // ConsoleCtrl.workingdaysList[i].endTime = end;
                // } else {
                //     ConsoleCtrl.workingdaysList[i].startTime = "";
                //     ConsoleCtrl.workingdaysList[i].endTime = "";
                // }
                if (ConsoleCtrl.workingdaysList[i].startTime == null || ConsoleCtrl.workingdaysList[i].working == false) {
                    ConsoleCtrl.workingdaysList[i].startTime = "";
                    ConsoleCtrl.workingdaysList[i].endTime = "";
                    // ConsoleCtrl.workingdaysList[i].working = false;
                }
                workingdaysService.CreateOrUpdateWorkingDayendTime(ConsoleCtrl.workingdaysList[i], ConsoleCtrl.workingdaysList[i].startTime, ConsoleCtrl.workingdaysList[i].endTime).then(function (result) {
                    if (result) {
                        (new Init()).getWorkingDayDetails();
                    }
                });
            }
            $timeout(function () {
                toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            }, 2500);
        };
        //exam type
        //********************************** Create or Update New Record
        ConsoleCtrl.CreateOrUpdate = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ConsoleCtrl.schoolId,

                examtypeName: ConsoleCtrl.formFieldsubjectName,
                assesments: ConsoleCtrl.oneTimePay
            };

            if (data) {

                if (ConsoleCtrl.editmode) {
                    data.id = ConsoleCtrl.editingExamTypeId;
                    ExamTypeService.updateSubject(data).then(function (result) {
                        if (result) {
                            //Re initialize the data
                            (new Init()).fnSubjectList();
                            //Close Modal Window
                            ConsoleCtrl.closeExamTypeModal();
                            //Clear Fields
                            clearformfields();
                            //Show Toast
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        if (error) {
                            //Close Modal Window
                            ConsoleCtrl.closeExamTypeModal();
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
                        }
                    }, function (result1) {
                        if (result1.status === 404) {
                            ExamTypeService.CreateSubject(data).then(function (result) {
                                if (result) {
                                    //Re initialize the data
                                    (new Init()).fnSubjectList();
                                    //Close Modal Window
                                    ConsoleCtrl.closeExamTypeModal();
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
        var deleteSubjectExamType = function (index) {
            if (ConsoleCtrl.subjectList) {
                ExamTypeService.deleteSubject(ConsoleCtrl.subjectList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).fnSubjectList();
                        ConsoleCtrl.closeExamTypeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting class. Error Stack' + error);
                });
            }
        };

        ConsoleCtrl.addOneTimeRow = function (subjAsses) {
            ConsoleCtrl.oneTimePay.push({
            });
        };

        /*********Remove Row***** */
        ConsoleCtrl.delOneTimeRow = function () {
            var Delrow = ConsoleCtrl.oneTimePay.length - 1;
            ConsoleCtrl.oneTimePay.splice(Delrow);
        };

        //Edit Subject
        ConsoleCtrl.editExamType = function (index) {
            ConsoleCtrl.formFieldsubjectName = ConsoleCtrl.subjectList[index].examtypeName;
            ConsoleCtrl.oneTimePay = ConsoleCtrl.subjectList[index].assesments;
            ConsoleCtrl.editingExamTypeId = ConsoleCtrl.subjectList[index].id;

            //Open Modal
            ConsoleCtrl.openExamTypeModal();

            $timeout(function () {
                ConsoleCtrl.setFloatLabel();
                ConsoleCtrl.editmode = true;
                ConsoleCtrl.viewValue = ConsoleCtrl.subjectList[index];
            });
        };
        /** Remove Edit */
        ConsoleCtrl.removeEditedFields = function () {
            ConsoleCtrl.editMode = false;
        };
        /* ==================== More Details Section ========================== */
        ConsoleCtrl.showMoreDetails = function (index) {
            if (index) {
                $timeout(function () {
                    ConsoleCtrl.openProfileModal();
                });
            }
        };
        ConsoleCtrl.openProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('show');
        };
        ConsoleCtrl.closeProfileModal = function () {
            var modal = $('#details-modal');
            modal.modal('hide');
        };
        ConsoleCtrl.openTab = function (id, event) {
            $('#' + id).tab('show');
        };
        ConsoleCtrl.closeExamTypeModal = function () {
            var modal = $('#edit-subject');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        ConsoleCtrl.openExamTypeModal = function () {
            var modal = $('#edit-subject');
            modal.modal('show');
        };

        function clearformfields() {
            ConsoleCtrl.SchoolName = "";
            ConsoleCtrl.Board = "";
            ConsoleCtrl.DateOfEstablishment = "";
            ConsoleCtrl.AffiliationNo = "";
            ConsoleCtrl.AffiliatedBy = "";
            ConsoleCtrl.RegistrationNo = "";
            ConsoleCtrl.softwareStartDate = "";
        }

        function clearformfields1() {
            ConsoleCtrl.Address = "";
            ConsoleCtrl.Pin = "";
            ConsoleCtrl.Email = "";
            ConsoleCtrl.City = "";
            ConsoleCtrl.State = "";
            ConsoleCtrl.District = "";
            ConsoleCtrl.Country = "";
            ConsoleCtrl.PrimaryMobile = "";
            ConsoleCtrl.PrimaryMobile1 = "";
            ConsoleCtrl.AlternateMobile = "";
            ConsoleCtrl.AlternateMobile1 = "";
            ConsoleCtrl.Landline = "";
            ConsoleCtrl.Landline1 = "";
            ConsoleCtrl.Website = "";
        }
        //Delete confirmation box
        ConsoleCtrl.confirmCallbackMethodexamtype = function (index) {
            deleteSubjectExamType(index);
        };
        //Delete cancel box
        ConsoleCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };

        //********************************* Settings to float labels
        ConsoleCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=subjectname]'));
            Metronic.setFlotLabel($('input[name=subjectassesments]'));
        };
        /* ==================== More Details Section End ====================== */

        /* =============================== Modal Functionality End ========================= */
        //Export to Excel For Add New Exam Type
        ConsoleCtrl.exportToExcel1 = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Subject Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ConsoleCtrl.ExamprintData = function () {
            var divToPrint = document.getElementById("printTables");
            ConsoleCtrl.newWin = window.open("");
            ConsoleCtrl.newWin.document.write(divToPrint.outerHTML);
            ConsoleCtrl.newWin.print();
            ConsoleCtrl.newWin.close();
        }

        //End Print View

        //Start Teachers on leave status
        ConsoleCtrl.myFunc = function (Approval) {
            ConsoleCtrl.count = 1;
            ConsoleCtrl.count += Approval.clickCount;
            Leave.upsert({ id: Approval.id, status: "Approved", clickCount: ConsoleCtrl.count });
            $timeout(function () {
                (new Init()).getTeacherLeaveDetails();
            }, 700);
            // $scope.showTravel();
        };
        ConsoleCtrl.myFunc1 = function (Approval) {
            ConsoleCtrl.count = 1;
            ConsoleCtrl.count += Approval.clickCount;
            Leave.upsert({ id: Approval.id, status: "Rejected", clickCount: ConsoleCtrl.count });
            $timeout(function () {
                (new Init()).getTeacherLeaveDetails();
            }, 700);
            // $scope.showTravel();
        };
        //End Teachers on leave status
        //exam type end


        //Submit for module
        //Submit for module
        ConsoleCtrl.submitmodule = function (invalid) {
            if (invalid) {
                return;
            }
            if (ConsoleCtrl.usertype == 'Student') {
                // ConsoleCtrl.schooldataaa[0].studentPrefix
                // var dd = _.find(ConsoleCtrl.schooldataaa,{});
                if (ConsoleCtrl.schooldataaa[0].studentPrefix == undefined) {
                    var dd = [];
                    var ss = {
                        "userType": "",
                        "SelectModule": "",
                        "SetPrefix": "",
                        "SetSequence": "",
                        "counter": 0
                    };
                    var a = 2;
                    for (var i = 0; i < a; i++) {
                        dd.push(ss)
                    }
                    School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, studentPrefix: dd }, function (response) {
                    })
                } else {
                    if (ConsoleCtrl.SelectModule == 'Reg No') {
                        var data1 = {
                            "userType": ConsoleCtrl.usertype,
                            "SelectModule": ConsoleCtrl.SelectModule,
                            "SetPrefix": ConsoleCtrl.SetPrefix,
                            "SetSequence": ConsoleCtrl.SetSequence,
                            "counter": 0
                        }
                        ConsoleCtrl.schooldataaa[0].studentPrefix[0] = data1;
                    }
                    if (ConsoleCtrl.SelectModule == 'Fee Receipt') {
                        var data2 = {
                            "userType": ConsoleCtrl.usertype,
                            "SelectModule": ConsoleCtrl.SelectModule,
                            "SetPrefix": ConsoleCtrl.SetPrefix,
                            "SetSequence": ConsoleCtrl.SetSequence,
                            "counter": 0
                        }
                        ConsoleCtrl.schooldataaa[0].studentPrefix[1] = data2;
                    }
                }
            } else {
                var rolePrefix = [];
                var set = {
                    "userType": ConsoleCtrl.usertype,
                    "SelectModule": ConsoleCtrl.SelectModule,
                    "SetPrefix": ConsoleCtrl.SetPrefix,
                    "SetSequence": ConsoleCtrl.SetSequence,
                    "counter": 0
                }
                rolePrefix.push(set);
                var data = {
                    schoolId: ConsoleCtrl.schoolId,
                    prefix: rolePrefix
                };
            }

            // return;
            if (ConsoleCtrl.usertype == 'Staff') {
                School.upsert({ id: data.schoolId, staffPrefix: data.prefix }, function (response) {

                    if (response) {
                        School.find({ filter: { where: { id: ConsoleCtrl.schoolId } } }, function (res) {
                            ConsoleCtrl.schooldataaa = res;
                            ConsoleCtrl.SelectModule = ConsoleCtrl.schooldataaa[0].staffPrefix[0].SelectModule;
                            ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldataaa[0].staffPrefix[0].SetPrefix;
                            ConsoleCtrl.SetSequence = ConsoleCtrl.schooldataaa[0].staffPrefix[0].SetSequence;
                            ConsoleCtrl.schooldata1 = ConsoleCtrl.schooldataaa[0].staffPrefix;
                            ConsoleCtrl.ModulecloseModal();
                        });
                    }
                })
            } else if (ConsoleCtrl.usertype == 'Student') {
                School.upsert({ id: ConsoleCtrl.schoolId, studentPrefix: ConsoleCtrl.schooldataaa[0].studentPrefix }, function (response) {

                    if (response) {
                        School.find({ filter: { where: { id: ConsoleCtrl.schoolId } } }, function (res) {
                            ConsoleCtrl.schooldataaa = res;
                            ConsoleCtrl.SelectModule = ConsoleCtrl.schooldataaa[0].studentPrefix[0].SelectModule;
                            ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldataaa[0].studentPrefix[0].SetPrefix;
                            ConsoleCtrl.SetSequence = ConsoleCtrl.schooldataaa[0].studentPrefix[0].SetSequence;
                            ConsoleCtrl.schooldata1 = ConsoleCtrl.schooldataaa[0].studentPrefix;
                            ConsoleCtrl.ModulecloseModal();
                        });
                    }
                })
            } else if (ConsoleCtrl.usertype == 'Accountant') {
                School.upsert({ id: data.schoolId, accountantPrefix: data.prefix }, function (response) {

                    (new Init()).getSchoolDetails();
                    ConsoleCtrl.selectType(ConsoleCtrl.usertype)
                    ConsoleCtrl.ModulecloseModal();
                })

                School.upsert({ id: data.schoolId, accountantPrefix: data.prefix }, function (response) {

                    if (response) {
                        School.find({ filter: { where: { id: ConsoleCtrl.schoolId } } }, function (res) {
                            ConsoleCtrl.schooldataaa = res;
                            ConsoleCtrl.SelectModule = ConsoleCtrl.schooldataaa[0].accountantPrefix[0].SelectModule;
                            ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldataaa[0].accountantPrefix[0].SetPrefix;
                            ConsoleCtrl.SetSequence = ConsoleCtrl.schooldataaa[0].accountantPrefix[0].SetSequence;
                            ConsoleCtrl.schooldata1 = ConsoleCtrl.schooldataaa[0].accountantPrefix;
                            ConsoleCtrl.ModulecloseModal();
                        });
                    }
                })
            }
        }
        //Set Sequence and Set Prefix

        // ConsoleCtrl.displayFeeReceiptData = function (data) {
        //     if (data == "Fee Receipt") {
        //         ConsoleCtrl.feereceiptFunc();
        //     } else if (data == "Reg No") {
        //         ConsoleCtrl.regnoFunc();
        //     }
        // }
        // ConsoleCtrl.feereceiptFunc = function () {
        //     for (var i = 0; i < ConsoleCtrl.schooldata1.length; i++) {
        //         if (ConsoleCtrl.schooldata1[i].SelectModule == "Fee Receipt") {
        //             ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldata1[i].SetPrefix;
        //             ConsoleCtrl.SetSequence = ConsoleCtrl.schooldata1[i].SetSequence;

        //         }
        //     }
        // }


        // check contact
        ConsoleCtrl.checkContactInfo = function (cnt) {
            var allow = true;
            var arrr = [];
            var abcd = cnt.split('');
            for (var i = 0; i < abcd.length; i++) {
                arrr.push(Number(Number(abcd[i])));
            }

            var abc = Number(arrr[0]);
            if (arrr.length > 9) {
                var dataa = [];
                arrr.map(function (item) {
                    if (abcd[0] == item) {
                        dataa.push(item);
                    }
                    if (dataa.length > 9) {
                        allow = false;
                        alert("please enter valid phone number ");
                        ConsoleCtrl.PrimaryMobile1 = null;
                        ConsoleCtrl.AlternateMobile1 = null;
                    }
                })
            }
            if (abc < 2) {
                if (allow) {
                    alert("please enter valid phone number");
                }
                ConsoleCtrl.PrimaryMobile1 = null;
                ConsoleCtrl.AlternateMobile1 = null;
                ConsoleCtrl.PrimaryMobile1 = "";
            }
        }
        // End check contact



        // GradeClose or Open modal
        ConsoleCtrl.gradecloseModal = function () {
            var modal = $('#edit-grades');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        ConsoleCtrl.openModalGrade = function () {
            var modal = $('#edit-grades');
            modal.modal('show');
        };
        // Add Grade Action
        ConsoleCtrl.gradeAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ConsoleCtrl.schoolId,
                gradeName: ConsoleCtrl.formFields.gradeName,
                fullName: ConsoleCtrl.formFields.gradeName,
                gradePoint: ConsoleCtrl.formFields.gradePoint,
                percentageRangeFrom: ConsoleCtrl.formFields.percentageRangeFrom,
                percentageRangeTo: ConsoleCtrl.formFields.percentageRangeTo
            };
            if (data) {
                //Check whether editmode or normal mode
                if (!ConsoleCtrl.editmode) {
                    gradeService.getExistingGrades(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            gradeService.CreateOrUpdateGrade(data).then(function (res) {
                                if (res) {
                                    (new Init()).getGradeList();
                                    ConsoleCtrl.gradecloseModal();
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
                    data.id = ConsoleCtrl.editingGradeId;
                    gradeService.editGrade(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getGradeList();
                            //Close Modal
                            ConsoleCtrl.gradecloseModal();
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
        //Delete Action
        var deleteGrade = function (index) {
            if (ConsoleCtrl.gradeList) {
                gradeService.deleteGrade(ConsoleCtrl.gradeList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getGradeList();
                        ConsoleCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting grade. Error Stack' + error);
                });
            }
        };
        //Delete confirmation box
        ConsoleCtrl.confirmCallbackMethod = function (index) {

            deleteGrade(index);
        };
        //Delete cancel box
        ConsoleCtrl.confirmCallbackCancel = function () {
            return false;
        };
        //Edit Action
        ConsoleCtrl.editGrade = function (index) {
            var aa = [];
            for (var i = 0; i < 10; i++) {
                if (ConsoleCtrl.gradeList[index].gradeName[i]) {
                    aa += ConsoleCtrl.gradeList[index].gradeName[i];
                }
            }
            ConsoleCtrl.formFields.gradeName = aa;
            ConsoleCtrl.formFields.gradePoint = ConsoleCtrl.gradeList[index].gradePoint;
            ConsoleCtrl.formFields.percentageRangeFrom = ConsoleCtrl.gradeList[index].percentageRangeFrom;
            ConsoleCtrl.formFields.percentageRangeTo = ConsoleCtrl.gradeList[index].percentageRangeTo;
            ConsoleCtrl.editingGradeId = ConsoleCtrl.gradeList[index].id;
            //Set View Mode false
            ConsoleCtrl.detailsMode = false;
            //Open Modal
            ConsoleCtrl.openModalGrade();
            $timeout(function () {
                ConsoleCtrl.setFloatLabel();
                //Enable Edit Mode
                ConsoleCtrl.editmode = true;
            });
        };
        //Clear Fields
        function clearformfields() {
            ConsoleCtrl.formFields = {};
        }
        // //More Details
        // ConsoleCtrl.moreDetails = function (index) {
        //     ConsoleCtrl.detailsMode = true;
        //     ConsoleCtrl.openModalGrade();
        //     ConsoleCtrl.viewValue = ConsoleCtrl.gradeList[index];
        // };
        //Export to Excel
        ConsoleCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Grade Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 3000); // trigger download
            // var exportHref = Excel.tableToExcel(tableId, 'sheet name');
            // $timeout(function () { location.href = exportHref; }, 100); // trigger download
        };
        //Bhasha Print View
        ConsoleCtrl.printDataGrade = function () {
            var divToPrint = document.getElementById("gradprintTable");
            ConsoleCtrl.newWin = window.open("");
            ConsoleCtrl.newWin.document.write(divToPrint.outerHTML);
            ConsoleCtrl.newWin.print();
            ConsoleCtrl.newWin.close();
        }

        //End Print View

        ConsoleCtrl.selectType = function (type) {
            if (type == 'Staff') {
                ConsoleCtrl.SelectModule = "";
                ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldataaa[0].staffPrefix[0].SetPrefix;
                ConsoleCtrl.SetSequence = ConsoleCtrl.schooldataaa[0].staffPrefix[0].SetSequence;
                ConsoleCtrl.schooldata1 = ConsoleCtrl.schooldataaa[0].staffPrefix;
            } else if (type == 'Student') {
                ConsoleCtrl.SelectModule = ConsoleCtrl.schooldataaa[0].studentPrefix[0].SelectModule;
                ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldataaa[0].studentPrefix[0].SetPrefix;
                ConsoleCtrl.SetSequence = ConsoleCtrl.schooldataaa[0].studentPrefix[0].SetSequence;
                ConsoleCtrl.schooldata1 = ConsoleCtrl.schooldataaa[0].studentPrefix;
            } else if (type == 'Accountant') {
                ConsoleCtrl.SelectModule = "";
                ConsoleCtrl.SetPrefix = ConsoleCtrl.schooldataaa[0].accountantPrefix[0].SetPrefix;
                ConsoleCtrl.SetSequence = ConsoleCtrl.schooldataaa[0].accountantPrefix[0].SetSequence;
                ConsoleCtrl.schooldata1 = ConsoleCtrl.schooldataaa[0].accountantPrefix;
            }
        }
        ConsoleCtrl.clearConfigure = function () {
            ConsoleCtrl.usertype = "";
            // ConsoleCtrl.SelectModule = "";
        }
        ConsoleCtrl.editAcademic = function (index) {
            ConsoleCtrl.academicBatch = ConsoleCtrl.showtable[index].academicBatch;
            ConsoleCtrl.edate = new Date(ConsoleCtrl.showtable[index].startDate);
            ConsoleCtrl.startDate = ConsoleCtrl.edate;
            ConsoleCtrl.bdate = new Date(ConsoleCtrl.showtable[index].endDate);
            ConsoleCtrl.endDate = ConsoleCtrl.bdate;
            ConsoleCtrl.academicDataeditingId = ConsoleCtrl.showtable[index].id;
            ConsoleCtrl.detailsMode = false;
            //Open Modal
            ConsoleCtrl.AcademicOpenModal();
            $timeout(function () {
                ConsoleCtrl.setFloatLabel();
                //Enable Edit Mode
                ConsoleCtrl.academiceditmode = true;
            });
        }
        ConsoleCtrl.AcademicOpenModal = function () {
            var modal = $('#editAcademic');
            modal.modal('show');
        }
        ConsoleCtrl.AcademiccloseModal = function () {
            var modal = $('#editAcademic');
            modal.modal('hide');
        };
        ConsoleCtrl.Academicsubmit1 = function () {
            var data = {
                academicBatch: ConsoleCtrl.academicBatch,
                startDate: ConsoleCtrl.startDate,
                endDate: ConsoleCtrl.endDate,
            }
            AcademicBatch.prototype$patchAttributes({ id: ConsoleCtrl.academicDataeditingId, academicBatch: data.academicBatch, startDate: data.startDate, endDate: data.endDate }, function (res) {
                ConsoleCtrl.AcademiccloseModal();
                ConsoleCtrl.academiceditmode = false;
                (new Init()).getAcademicData();
            })
        }
        ConsoleCtrl.clearAcademic = function () {
            ConsoleCtrl.academicBatch = "";
            ConsoleCtrl.startDate = "";
            ConsoleCtrl.endDate = "";
        }
        // ConsoleCtrl.closeAcademic = function(){
        //     ConsoleCtrl.academicBatch = "";
        //     ConsoleCtrl.startDate = "";
        //     ConsoleCtrl.endDate = "";
        // }
        ConsoleCtrl.checkDobCurrntMonth = function (stu) {
            var dob = stu.DOB.split('-');
            stu.dd = dob[0] + "-" + dob[1];
            if (stu.dd == fromDate1 || stu.dd == toDate1 || stu.dd == toDate2 || stu.dd == toDate3 || stu.dd == toDate4 || stu.dd == toDate5 || stu.dd == toDate6 || stu.dd == toDate7) {
                stu.trueFalse = true;
            } else {
                stu.trueFalse = false;
            }
        }
        ConsoleCtrl.Dailyfee = function () {
            var abc = document.getElementById("newsIdDaily").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Dailyfee: abc }, function (res) {
            });
        }
        ConsoleCtrl.Attendance = function () {
            var abc = document.getElementById("newsIdAttendance").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Attendance: abc }, function (res) {
            });
        }
        ConsoleCtrl.Classwise = function () {
            var abc = document.getElementById("newsIdClasswise").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Classwise: abc }, function (res) {
            });
        }
        ConsoleCtrl.Dailyexpense = function () {
            var abc = document.getElementById("newsIdDailyexpense").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Dailyexpense: abc }, function (res) {
            });
        }
        ConsoleCtrl.Studtl = function () {
            var abc = document.getElementById("newsIdStudtl").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Studtl: abc }, function (res) {
            });
        }
        ConsoleCtrl.Stffdtl = function () {
            var abc = document.getElementById("newsIdStffdtl").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Stffdtl: abc }, function (res) {
            });
        }
        ConsoleCtrl.Smsrep = function () {
            var abc = document.getElementById("newsIdSmsrep").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Smsrep: abc }, function (res) {
            });
        }
        ConsoleCtrl.Cusrep = function () {
            var abc = document.getElementById("newsIdfeeDuerep").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, Cusrep: abc }, function (res) {
            });
        }
        ConsoleCtrl.feeDuerep = function () {
            var abc = document.getElementById("newsIdfeeDuerep").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, feeDuerep: abc }, function (res) {
            });
        }
        //updateing facebook link start
        ConsoleCtrl.facebooklinkUpdate = function () {
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, facebookLink: ConsoleCtrl.facebook }, function (res) {
                if (res) {
                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                }
                location.reload();
            });
        }
        ConsoleCtrl.report = function () {
            ConsoleCtrl.Monthly = document.getElementById('feeMonthly').checked;
            ConsoleCtrl.Term = document.getElementById('feeTerm').checked;
            ConsoleCtrl.Yearly = document.getElementById('feeYearly').checked;
            var data = {
                Monthly: ConsoleCtrl.Monthly,
                Term: ConsoleCtrl.Term,
                Yearly: ConsoleCtrl.Yearly
            }
            console.log(data);
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, faymentStudents: data }, function (res) {
            });
        }

        ConsoleCtrl.closingedit = function () {
            (new Init()).fnSubjectList();
        }
        ConsoleCtrl.createsmsApi = function () {
            ConsoleCtrl.apiUrl = ConsoleCtrl.apiUrl ? ConsoleCtrl.apiUrl : "";
            ConsoleCtrl.apiUname = ConsoleCtrl.apiUname ? ConsoleCtrl.apiUname : "";
            ConsoleCtrl.apiPwd = ConsoleCtrl.apiPwd ? ConsoleCtrl.apiPwd : "";
            ConsoleCtrl.schoolCode = ConsoleCtrl.schoolCode ? ConsoleCtrl.schoolCode : "";
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, apiUrl: ConsoleCtrl.apiUrl, apiUname: ConsoleCtrl.apiUname, apiPwd: ConsoleCtrl.apiPwd, schoolCode: ConsoleCtrl.schoolCode }, function (res) {
                if (res) {
                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                }
            });
        }

        ConsoleCtrl.checkboxAttendanceclick = function () {
            var flag = document.getElementById("autoatten").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, AutoAttendanceFlag: flag }, function (res) {
                if (flag==true) {
                    toastr.success('Auto Attendance Subscribed Successfully');
                }
                else {
                    toastr.success('Auto Attendance UnSubscribed Successfully');

                }

            });
        }
        ConsoleCtrl.checkboxclickFeeDelete = function () {
            var flag = document.getElementById("deletefee").checked;
            School.prototype$patchAttributes({ id: ConsoleCtrl.schoolId, deleteFee: flag }, function (res) {
                if (flag==true) {
                    toastr.success('Fee Delete Option Enabled');
                }
                else {
                    toastr.success('Fee Delete Option Disabled');
                }

            });
        }
    });
