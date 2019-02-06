'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AttendanceControllerCtrl
 * @description
 * # AttendanceControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('AttendanceController', function ($cookies, attendanceService,configService, Student, Staff, Attendance, $http, $filter, FOsubject, Subject, $scope, $timeout, School, generateexcelFactory,Class,AcademicBatch, Calendar) {
        var AttendanceCtrl = this;
        //Defaults
        AttendanceCtrl.studentsList = [];
        AttendanceCtrl.schoolId = $cookies.getObject('uds').schoolId;
        AttendanceCtrl.monthList = [];
        AttendanceCtrl.loginId = $cookies.getObject('uds').id;
        AttendanceCtrl.role = $cookies.get('role');
        AttendanceCtrl.showForPdf = true;
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
        AttendanceCtrl.selectedDate = new Date();
        AttendanceCtrl.b1 = true;
        AttendanceCtrl.studDate= new Date();
        AttendanceCtrl.studMonth=AttendanceCtrl.studDate.getMonth();
        AttendanceCtrl.studClassAtt = [];
        AttendanceCtrl.studClassAtt1 = [];
        AttendanceCtrl.classRfids = [];
        AttendanceCtrl.months = (new Date()).getMonth();
        AttendanceCtrl.year = (new Date()).getFullYear();

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Attendance") {

                AttendanceCtrl.roleView = roleAccess[0].RolesData[i].view;
                AttendanceCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                AttendanceCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }
        function Init() {
            // this.getClassList = function () {
            //     // School.find({ filter: { where: { id: AttendanceCtrl.schoolId } } }, function (response) {
            //     //     AttendanceCtrl.marksRep = response[0].marksFormat;
            //     //     if (AttendanceCtrl.role == "Admin" && AttendanceCtrl.marksRep == "FO") {
            //     //         FOsubject.find({ filter: { where: { schoolId: AttendanceCtrl.schoolId }, include: 'class' } }, function (classData) {
            //     //             AttendanceCtrl.classList = classData;

            //     //         })
            //     //     } else if (AttendanceCtrl.role == "Admin" && AttendanceCtrl.marksRep !== "FO") {
            //     //         Subject.find({ filter: { where: { schoolId: AttendanceCtrl.schoolId }, include: 'class' } }, function (classData1) {
            //     //             AttendanceCtrl.classList = classData1;

            //     //         })
            //     //     }
            //     // })
            //     attendanceService.getClassListById(AttendanceCtrl.schoolId).then(function (result) {
            //         if (result) {
            //             AttendanceCtrl.classList = result;
            //         }
            //     }, function (error) {
            //         //console.log('Error while fecthing class list. Error stack ' + error);
            //     });
            // };
            this.getClassList = function () {
                // School.find({ filter: { where: { id: AttendanceCtrl.schoolId } } }, function (response) {
                //     AttendanceCtrl.marksRep = response[0].marksFormat;
                // })
                attendanceService.getClassListById(AttendanceCtrl.schoolId, AttendanceCtrl.role, AttendanceCtrl.loginId).then(function (result) {
                    if (result) {
                        if (AttendanceCtrl.role === "Admin" || AttendanceCtrl.role === "Accountant") {
                            AttendanceCtrl.classList = result;
                        } else {
                            if (Array.isArray(result)) {
                                var newArray = result.filter(function (thing, index, self) {
                                    return self.findIndex(function (t) {
                                        return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                                    }) === index;
                                });
                                AttendanceCtrl.classList = newArray;
                                // result.forEach(function (result) {
                                //     if (.indexOf(result.class) == -1) {
                                //         AssignmentsCtrl.classList.push(result.class);
                                //     }
                                // });
                                // if (Array.isArray(result)) {
                                //    var newArray = result.filter(function(elm,index,arr){
                                //     
                                //         return index == arr.indexOf(elm.className) && index == arr.indexOf(elm.sectionName);
                                //     })
                                // var newArray = result.filter((thing, index, self) => self.findIndex((t) => { return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName; }) === index);
                                // AssignmentsCtrl.classList = newArray;
                            }
                        }
                    }
                }, function (error) {
                    //console.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
            this.getSchoolList = function () {
                attendanceService.getSchoolDataById(AttendanceCtrl.schoolId).then(function (result) {
                    if (result) {
                        AttendanceCtrl.schoolData = result;
                        AttendanceCtrl.schoolCode = AttendanceCtrl.schoolData[0].code;
                    }
                }, function (error) {
                    //console.log('Error while fecthing School Data list. Error stack ' + error);
                });
            };
            this.getStudentData = function () {
                attendanceService.getStudentData(AttendanceCtrl.loginId).then(function (result) {
                    if (result) {
                        AttendanceCtrl.studentData = result;
                        console.log(result);
                        // AttendanceCtrl.studentData.classId1 = result[0].classId;
                        AttendanceCtrl.studentData.RFID = result[0].RFID;
                        $timeout(function () {
                            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated);
                        }, 2000);
                    }
                }, function (error) { });
            };
              //get staff details
            this.getStaffData = function () {
                attendanceService.getStaffData(AttendanceCtrl.loginId).then(function (result) {
                    if (result) {
                        console.log(result);
                        AttendanceCtrl.staffData = result;
                        AttendanceCtrl.staffData.RFID = result[0].RFID;
                        $timeout(function () {
                            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated);
                        }, 2000);
                    }
                }, function (error) { });
            };
            // this.checkin = function () {

            //     if ('00100' == '00100') {
            //         alert('true');
            //     }
            //     else {
            //         alert('no');
            //     }
            // }
        }

        //Initialize the Controller
        (new Init()).getClassList();
        (new Init()).getSchoolList();
        (new Init()).getStudentData();
        (new Init()).getStaffData();
        // (new Init()).checkin();

        /* =========================== Form Submit =========================== */
        AttendanceCtrl.showAttendance = function (invalid) {
            // alert("hi");
            if (invalid) {
                return;
            }
            if (AttendanceCtrl.selectedClassId) {
                attendanceService.getStudentByClassId(AttendanceCtrl.selectedClassId).then(function (result) {
                    if (result && result.length > 0) {
                        result.forEach(function (v, i) {
                            for (var j = 0; j < result.length; j++) {
                                check(result[j], i);
                            }
                        });
                    }
                }, function (error) {
                    //console.log('Error while fetching support list. Error Stack ' + error);
                });
            }
        };
        // AttendanceCtrl.checkedDatas = function(rfid){

        // }
        AttendanceCtrl.addAttendances = function (flag, type) {
            var abc = document.getElementById("newsId").checked;
            if (AttendanceCtrl.studentAllFlag == undefined) {
                AttendanceCtrl.studentAllFlag = true;
            }
            if (abc == undefined) {
                abc = true;
            }
            $timeout(function () {
                if (abc == true) {
                    for (var i = 0; i < AttendanceCtrl.dataArray.length; i++) {
                        AttendanceCtrl.dataArray[i].studentAttendenceFlag = true;
                        AttendanceCtrl.addAttendance(AttendanceCtrl.dataArray[i].studentAttendenceFlag, AttendanceCtrl.dataArray[i], type);
                    }
                } else {
                    for (var i = 0; i < AttendanceCtrl.dataArray.length; i++) {
                        AttendanceCtrl.dataArray[i].studentAttendenceFlag = false;
                        AttendanceCtrl.addAttendance(AttendanceCtrl.dataArray[i].studentAttendenceFlag, AttendanceCtrl.dataArray[i], type);
                    }
                }
            }, 1000);
        }

        function check(student, i) {
            var day = parseInt(AttendanceCtrl.selectedDate.getDate());
            var month = parseInt(AttendanceCtrl.selectedDate.getMonth());
            var year = parseInt(AttendanceCtrl.selectedDate.getFullYear());
            var key = student.RFID;

            attendanceService.getAttendance(key).then(function (result) {
                AttendanceCtrl.studentsList[i] = { id: result.id, student: student, status: true };
            }, function (error) {
                if (error) {
                    AttendanceCtrl.studentsList[i] = { student: student, status: false };
                }
            });
        }

        AttendanceCtrl.checkedData = function (rfid) {
            AttendanceCtrl.checked = false;
            var keepGoing = true;
            if (AttendanceCtrl.attnData) {
                AttendanceCtrl.attnData.forEach(function (v, i) {
                    if (keepGoing) {
                        if (v.RFID == rfid) {
                            AttendanceCtrl.checked = true;
                            if (AttendanceCtrl.checked) {
                                keepGoing = false;
                            }
                        }
                    }
                });
            }
            return AttendanceCtrl.checked;
        }

        AttendanceCtrl.addAttendance = function (flag, student, type) {
            $timeout(function () {
                var date = AttendanceCtrl.selectedDate;
                var MID = 0;
                AttendanceCtrl.formatted = $filter('date')(date, 'yyyy/MM/dd');
                AttendanceCtrl.dot = $filter('date')(new Date(), "ddMMyyyyHHmmss");
                if (student.RFID) {
                    if (student.studentAttendenceFlag) {
                        Attendance.create({
                            SID: AttendanceCtrl.schoolCode,
                            MID: MID,
                            RFID: student.RFID,
                            DOT: AttendanceCtrl.dot,
                            DT: AttendanceCtrl.formatted,
                        }, function (response) {
                            AttendanceCtrl.viewAttendance(AttendanceCtrl.selectedClassId, date, type);
                        },
                            function (response) {
                            });
                    } else {
                        //Attendance.find({ RFID: student.RFID, DT: AttendanceCtrl.formatted, SID: AttendanceCtrl.schoolCode }, function (response) {
                        Attendance.find(
                            { filter: { where: { RFID: student.RFID, DT: AttendanceCtrl.formatted, SID: AttendanceCtrl.schoolCode } } },
                            function (response) {
                                if (response.length) {
                                    //    Attendance.destroyById(response[0].id,function(deleteResponse){
                                    //    });
                                    _.forEach(response, function (res) {
                                        $http({
                                            url: configService.baseUrl() + "/Attendances/" + res.id,
                                            method: 'DELETE',
                                            headers: { "Cotent-Type": "application/json" }
                                        }).then(function (deleteResponse) {
                                            AttendanceCtrl.viewAttendance(AttendanceCtrl.selectedClassId, date, type);
                                        });
                                    });
                                }
                            });
                    }
                }
            }, 500);
        };
        // AttendanceCtrl.loadDates = function () {
        //     if (AttendanceCtrl.selectedDate <= new Date()) {

        //         AttendanceCtrl.studentList = [];
        //         AttendanceCtrl.presentCount = 0;
        //         AttendanceCtrl.absentCount = 0;

        //         Student.find({ filter: { where: { classId: AttendanceCtrl.selectedClassId }, include: 'school' } },
        //             function (response) {
        //                 for (var i = 0; i < response.length; i++)
        //                 { check(response[i], i); }
        //             });
        //     }
        //     else {
        //         //console.log('Future dates are not acceptable');
        //     }
        // };
        /* =========================== Form Submit End ======================= */

        /* =========================== Monthly View =========================== */
        AttendanceCtrl.showMonthView = function (invalid) {
            if (invalid) {
                return;
            }
            var getDays = new Date(AttendanceCtrl.yearSelected, parseInt(AttendanceCtrl.monthSelected) + 1, 0).getDate();
            AttendanceCtrl.monthDays = function () { return new Array(getDays); };
            if (AttendanceCtrl.selectedMonthlyClassId) {
                attendanceService.getStudentByClassId(AttendanceCtrl.selectedMonthlyClassId).then(function (result) {
                    if (result && result.length > 0) {
                        result.forEach(function (v, i) {
                            var student = v.toJSON();
                            var key = student.id + AttendanceCtrl.yearSelected + AttendanceCtrl.monthSelected;
                            attendanceService.getMonthAttendance({ RFID: student.RFID, monthSelected: AttendanceCtrl.monthSelected, yearSelected: AttendanceCtrl.yearSelected }).then(function (response) {
                                AttendanceCtrl.status = [];
                                for (var s = 0; s < getDays; s++) {
                                    AttendanceCtrl.status[s] = false;
                                }
                                response.forEach(function (data) {
                                    data = data.toJSON();
                                    AttendanceCtrl.status[parseInt(data.day) - 1] = true;
                                });
                                AttendanceCtrl.monthList[i] = { student: student, status: AttendanceCtrl.status };
                                i++;
                            }, function (err) {
                                if (err) {
                                    //console.log('Error while fectching attendance records. Error stack ' + err);
                                }
                            });
                        });
                    }
                }, function (error) {
                    //console.log('Error while fetching support list. Error Stack ' + error);
                });
            }
        };
        /* =========================== Monthly View End ======================= */
        /* =========================== Show Attendance ======================== */
        AttendanceCtrl.viewAttendance = function (classId, date, type) {
            if (AttendanceCtrl.selectedDate == undefined) {
                alert('Please select Date');
                return
            }
            // alert(type);
            // alert(date);
            // alert(classId);
            var date = date;
            AttendanceCtrl.currentDate = new Date();
            AttendanceCtrl.viewClassId = classId;
            var newDate = new Date(date);
            var day;
            var month;
            if (newDate.getDate() <= 9) {
                day = "0" + newDate.getDate();
            } else {
                day = newDate.getDate();
            }
            if (newDate.getMonth() + 1 <= 9) {
                var m = newDate.getMonth() + 1;
                month = "0" + m;
            } else {
                month = newDate.getDate();
            }
            var attendeceDate = $filter('date')(date, 'yyyy/MM/dd');
            AttendanceCtrl.addLength = 0;
            var att = [];
            var temp = [];
            Attendance.find({ filter: { where: { DT: attendeceDate } } },
                function (response) {
                    att = response;
                    temp = response;
                });
            if (type == 'student') {
                var data = {
                    "SID": AttendanceCtrl.schoolCode,
                    "DT": attendeceDate,
                    "schoolEndTime": AttendanceCtrl.schoolData[0].endTime,
                    "classId": AttendanceCtrl.selectedClassId,
                    "type": "Student"
                };
                AttendanceCtrl.attendanceDetails = {};
                $http({ method: "POST", url: configService.baseUrl()+ "/Attendances/attendanceDetails", data: data }).
                    then(function (response) {
                        AttendanceCtrl.attendanceDetails = response.data.data;
                        AttendanceCtrl.dataArray = response.data.data;
                        for (var i = 0; i < AttendanceCtrl.dataArray.length; i++) {
                            if (AttendanceCtrl.dataArray[i].timeIn) {
                                AttendanceCtrl.addLength += 1;
                            } else {
                                // console.log("ledhuTimeIN");
                            }
                        }
                        // console.log(AttendanceCtrl.addLength + "===" + AttendanceCtrl.dataArray.length)

                        if (AttendanceCtrl.addLength == AttendanceCtrl.dataArray.length) {
                            AttendanceCtrl.slectAllId = "checked";
                            AttendanceCtrl.studentAllFlag = true;

                        } else {
                            AttendanceCtrl.studentAllFlag = false;
                            AttendanceCtrl.newsId = false;
                            document.getElementById("newsId").checked = false;


                        }


                    });


                Attendance.find({ filter: { where: { SID: AttendanceCtrl.schoolCode, DT: attendeceDate } } }, function (attndata) {
                    AttendanceCtrl.attnData = attndata;
                    // console.log(AttendanceCtrl.attnData);
                    // console.log(AttendanceCtrl.dataArray);
                    // console.log(AttendanceCtrl.attnData.length+"===" +AttendanceCtrl.dataArray.length)
                    // if (AttendanceCtrl.addLength == AttendanceCtrl.dataArray.length) {
                    //     AttendanceCtrl.slectAllId = "checked";
                    //     AttendanceCtrl.studentAllFlag = true;

                    // } else {
                    //     AttendanceCtrl.studentAllFlag = false;
                    //     AttendanceCtrl.newsId = false;
                    //     document.getElementById("newsId").checked = false;



                    // }

                    //AttendanceCtrl.attendanceDetails = AttendanceCtrl.attnData;
                });
                /*Student.find({ filter: { where: { classId: AttendanceCtrl.viewClassId } } }, function (classData) {
                    AttendanceCtrl.dataArray = classData;
                    //sort student details based on RFID
                    AttendanceCtrl.dataArray.sort(function (i, j) {
                        return i.RFID - j.RFID;
                    });
                    var tarr = [];
                    //sort attendance based on RFID
                    // angular.forEach(AttendanceCtrl.dataArray, function (v, i) { 
                    for (var i = 0; i < AttendanceCtrl.dataArray.length; i++) {
                        //alert("foreach entered");
                        if (AttendanceCtrl.attendanceDetails[AttendanceCtrl.dataArray[i].RFID] && AttendanceCtrl.attendanceDetails[AttendanceCtrl.dataArray[i].RFID].length > 0) {
                            tarr = AttendanceCtrl.attendanceDetails[AttendanceCtrl.dataArray[i].RFID];
                            if (tarr) {
                                tarr.sort(function (a, b) {
                                    //0123456789
                                    //08072017094433
                                    //new Date(2017, 05, 24, 11, 33, 30, 0);
                                    return a.DOT.substring(8, 10) - b.DOT.substring(8, 10);
                                });
                                if (tarr[0]) {
                                    //AttendanceCtrl.attnData[i]['timeIn']=tarr[0].DOT;
                                    AttendanceCtrl.dataArray[i]['timeIn'] = tarr[0].DOT;
                                }
                                if(tarr[tarr.length-1]){
                                    AttendanceCtrl.dataArray[i]['timeOut'] = tarr[tarr.length - 1].DOT;
                                }
                            }
                        }
                    }
                    //});
                });*/

            } else if (type == 'staff') {
                var data = {
                    "SID": AttendanceCtrl.schoolCode,
                    "DT": attendeceDate,
                    "schoolEndTime": AttendanceCtrl.schoolData[0].endTime,
                    "schoolId": AttendanceCtrl.schoolId,
                    "type": "Staff"
                };
                AttendanceCtrl.attendanceDetails = {};
                $http({ method: "POST", url: configService.baseUrl() +"/Attendances/attendanceDetails", data: data }).
                    then(function (response) {
                        AttendanceCtrl.attendanceDetails = response.data.data;
                        if (AttendanceCtrl.role == "Staff") {
                            // AttendanceCtrl.dataArray = {};
                            for (var i = 0; i < response.data.data.length; i++) {
                                if (response.data.data[i].id == AttendanceCtrl.loginId) {
                                    AttendanceCtrl.attendanceDetails = response.data.data;
                                    AttendanceCtrl.dataArray = "";
                                    var staff = response.data.data[i];
                                    AttendanceCtrl.dataArray = staff;
                                }
                            }
                        } else {
                            AttendanceCtrl.dataArray = response.data.data;
                        }
                    });
                // Staff.find({ filter: { where: { schoolId: AttendanceCtrl.schoolId } } }, function (staffData) {
                //     AttendanceCtrl.dataArray = staffData;
                // });
                Attendance.find({ filter: { where: { SID: AttendanceCtrl.schoolCode, DT: attendeceDate } } }, function (attndata) {
                    AttendanceCtrl.attnData = attndata;
                });
            }
        };

        AttendanceCtrl.checkTime = function (showTime) {
            //alert(endTime);
            //{{(AttendanceCtrl.currentDate.getHours()>=AttendanceCtrl.schoolData[0].endTime.substring(0,2))}}===
            //++++{{AttendanceCtrl.currentDate.getMinutes()}}>={{AttendanceCtrl.schoolData[0].endTime.substring(3,5)}}
            var ch;
            AttendanceCtrl.cday = AttendanceCtrl.currentDate.getDate() - AttendanceCtrl.currentDate.getMonth() - AttendanceCtrl.currentDate.getYear();
            AttendanceCtrl.sday = AttendanceCtrl.selectedDate.getDate() - AttendanceCtrl.selectedDate.getMonth() - AttendanceCtrl.selectedDate.getYear();
            //var e= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), endTime.substring(0,2), endTime.substring(2,4), '00', '00') ;
            //if(AttendanceCtrl.selectedDate)
            if (AttendanceCtrl.cday == AttendanceCtrl.sday) {
                ch = false;
                if (AttendanceCtrl.currentDate.getHours() > AttendanceCtrl.schoolData[0].showTime.substring(0, 2)) {
                    ch = true;

                } else if (AttendanceCtrl.currentDate.getHours() == AttendanceCtrl.schoolData[0].showTime.substring(0, 2)) {
                    if (AttendanceCtrl.currentDate.getMinutes() >= AttendanceCtrl.schoolData[0].showTime.substring(3, 5)) {
                        ch = true;
                    }
                }
            } else {
                ch = true;
            }


            return ch;
        }
        /* =========================== Show Attendance ======================== */
        AttendanceCtrl.findDetails = function () {

            // $http({
            //     "method": "GET",
            //     "url": configService.baseUrl() +'/Students/getStudents',
            //     "headers": { "Content-Type": "application/json", "Accept": "application/json" }
            // }), function (response) {
            // };

        };
        //Student Calendar
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: "https://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };
        /* event source that contains custom events on the scope */
        // $scope.events = [
        //   {title: 'All Day Event',start: new Date(y, m, 1)},
        //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'https://google.com/'}
        // ];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
            callback(events);
        };

        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: [
                { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
            ]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function () {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        $scope.remove = function (index) {
            $scope.events.splice(index, 1);
        };
        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        $scope.changeLang = function () {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
                $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                $scope.changeTo = 'Hungarian';
            }
        };
        //Calendar Configurations
        AttendanceCtrl.calendarConfig = {
            calendar: {
                height: 200,
                editable: false,
                defaultView: 'month',
                //eventRender: SchooltimetableCtrl.calendarRenderEvent
            }
        };
        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
        //Bhasha Print View
        AttendanceCtrl.printData = function () {
            var date = AttendanceCtrl.selectedDate;
            AttendanceCtrl.printDate = $filter('date')(date, 'dd/MM/yyyy');
            var divToPrint = document.getElementById("showPdf");
            document.getElementById("showPdf1").style.width = '100%';
            var date = '<div style="text-align:center;margin-top:5px;" id="sdaa">Attendance Date:' + AttendanceCtrl.printDate + '</div>'
            $("#showPdf1").append(date);
            AttendanceCtrl.newWin = window.open("");
            AttendanceCtrl.newWin.document.write(divToPrint.outerHTML);
            AttendanceCtrl.newWin.print();
            AttendanceCtrl.newWin.close();
            $("#sdaa").remove();
        }

        /* =============== Modal Functionality End ============ */
        //Export to Excel
        AttendanceCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Subject Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };

        //end
        AttendanceCtrl.test1 = function (student) {

            var matchedPosition = student.rollNo.search(/[a-z]/i);
            if (matchedPosition == -1) {
                var b = Number(student.rollNo);
                student.roll2 = b;
                return student.roll2;
            } else {
                var b = student.rollNo;
                student.roll2 = b;
                return student.roll2;
            }
        }
        AttendanceCtrl.ValidateEndDate = function () {
            //   alert("goooo");
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }

            today = yyyy + '-' + mm + '-' + dd;
            document.getElementById("datefield").setAttribute("max", today);
        }
        AttendanceCtrl.pdf = function () {
            $timeout(function () {
                kendo.drawing
                    .drawDOM("#showPdf",
                        {
                            paperSize: "A4",
                            margin: { top: "1cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
                            scale: 0.5,
                            height: 500,
                            image_compression: { FAST: "FAST" }
                        })
                    .then(function (group) {
                        // group.children[0] = group.children[group.children.length - 1]
                        // group.children.splice(1);
                        $timeout(function () {
                            kendo.drawing.pdf.saveAs(group, "ATTENDANCE.pdf");
                        }, 1000);
                    });
                $timeout(function () {
                    AttendanceCtrl.showForPdf = true;
                }, 1000)
            }, 1000);
        }
        AttendanceCtrl.viewB1 = function () {
            AttendanceCtrl.b1 = false;
        }
        AttendanceCtrl.viewB2 = function () {
            if (AttendanceCtrl.selectedClassId == undefined) {
                AttendanceCtrl.b1 = true;
            }
        }
          AttendanceCtrl.StartDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months, 1);
          AttendanceCtrl.endDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months + 1, 0);
          AttendanceCtrl.StartDateFormated = $filter('date')(AttendanceCtrl.StartDate, 'yyyy/MM/dd');
          AttendanceCtrl.endDateFormated = $filter('date')(AttendanceCtrl.endDate, 'yyyy/MM/dd');

            //get holidays
        //Attendence for stuent starts here
        AttendanceCtrl.CalculateTotalWorkingDays = function (d1, d2) {
            var count = 0;
            var startDate = new Date(d1);
            var endDate = new Date(d2);
            var curDate = startDate;
            while (curDate <= endDate) {
              var dayOfWeek = curDate.getDay();
              if (dayOfWeek !== 0)
                count++;
              curDate.setDate(curDate.getDate() + 1);
            }
            return count;
          }
        //Attendence Get Data
        AttendanceCtrl.fetchStudentAttendence = function(from, end ,month,year){
            AttendanceCtrl.studentAttendence=[];
                $http({
                  "method": "GET",
                  "url": 'http://localhost:3000/api/Attendances/reportAttendances?SID=' + AttendanceCtrl.schoolCode + '&fromDate=' + from + '&toDate=' + end,
                  "headers": {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  }
                }).then(function (response) {
                  AttendanceCtrl.studClassAtt1 = response;
                  AttendanceCtrl.workingDays = AttendanceCtrl.CalculateTotalWorkingDays(from, end);
                Calendar.find({
                    filter: {
                      where: {
                        schoolId: AttendanceCtrl.schoolId,
                        month: AttendanceCtrl.months,
                        year:AttendanceCtrl.year.toString()
                      }
                    }
                  }, function (response) {
                    AttendanceCtrl.HoliDays = response.length;
                  }, function (error) {});
                  AttendanceCtrl.StudentPresentDays = _.filter(response.data.reports, {
                    'RFID': AttendanceCtrl.studentData.RFID
                  }).length;
                  AttendanceCtrl.StaffPresentDays = _.filter(response.data.reports, {
                    'RFID': AttendanceCtrl.staffData.RFID
                  }).length;
                });
          }
        
        //Attendence calender next button
        $(document).on('click', '.fc-next-button', function () {
            $('.fc-next-button').each(function () {
                AttendanceCtrl.months++;
                if (AttendanceCtrl.months > 11) {
                    AttendanceCtrl.months = 0;
                    AttendanceCtrl.year++;
                }
            });
            document.getElementsByClassName("fc-today-button")[0].removeAttribute("disabled");
            AttendanceCtrl.StartDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months, 1);
            AttendanceCtrl.endDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months + 1, 0);
            AttendanceCtrl.StartDateFormated = $filter('date')(AttendanceCtrl.StartDate, 'yyyy/MM/dd');
            AttendanceCtrl.endDateFormated = $filter('date')(AttendanceCtrl.endDate, 'yyyy/MM/dd');
            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated, AttendanceCtrl.months, AttendanceCtrl.year);
        });
        //Attendence calender prev button
        $(document).on('click', '.fc-prev-button', function () {
            $('.fc-prev-button').each(function () {
                AttendanceCtrl.months--;
                if (AttendanceCtrl.months < 0) {
                    AttendanceCtrl.months = 11;
                    AttendanceCtrl.year--;
                }
            });
            AttendanceCtrl.StartDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months, 1);
            AttendanceCtrl.endDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months + 1, 0);
            AttendanceCtrl.StartDateFormated = $filter('date')(AttendanceCtrl.StartDate, 'yyyy/MM/dd');
            AttendanceCtrl.endDateFormated = $filter('date')(AttendanceCtrl.endDate, 'yyyy/MM/dd');
            document.getElementsByClassName("fc-today-button")[0].removeAttribute("disabled");
            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated, AttendanceCtrl.months, AttendanceCtrl.year);

        });
        //Attendence report for today
        $(document).on('click', '.fc-today-button', function () {
            $('.fc-today-button').each(function () {
                AttendanceCtrl.months = (new Date()).getMonth();
                AttendanceCtrl.year = (new Date()).getFullYear();
            });
            document.getElementsByClassName("fc-today-button")[0].removeAttribute("disabled");
            AttendanceCtrl.StartDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months, 1);
            AttendanceCtrl.endDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months + 1, 0);
            AttendanceCtrl.StartDateFormated = $filter('date')(AttendanceCtrl.StartDate, 'yyyy/MM/dd');
            AttendanceCtrl.endDateFormated = $filter('date')(AttendanceCtrl.endDate, 'yyyy/MM/dd');
            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated, AttendanceCtrl.months, AttendanceCtrl.year);

        });
        $(document).on('change', '.fc-today-button', function () {
            $('.fc-today-button').each(function () {
                AttendanceCtrl.months = (new Date()).getMonth();
                AttendanceCtrl.year = (new Date()).getFullYear();
            });
            AttendanceCtrl.StartDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months, 1);
            AttendanceCtrl.endDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months + 1, 0);
            AttendanceCtrl.StartDateFormated = $filter('date')(AttendanceCtrl.StartDate, 'yyyy/MM/dd');
            AttendanceCtrl.endDateFormated = $filter('date')(AttendanceCtrl.endDate, 'yyyy/MM/dd');
            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated, AttendanceCtrl.months, AttendanceCtrl.year);

        });
        $(document).on('mouseenter', '.fc-today-button', function () {
            $('.fc-today-button').each(function () {
                AttendanceCtrl.months = (new Date()).getMonth();
                AttendanceCtrl.year = (new Date()).getFullYear();
            });
            AttendanceCtrl.StartDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months, 1);
            AttendanceCtrl.endDate = new Date(AttendanceCtrl.year, AttendanceCtrl.months + 1, 0);
            AttendanceCtrl.StartDateFormated = $filter('date')(AttendanceCtrl.StartDate, 'yyyy/MM/dd');
            AttendanceCtrl.endDateFormated = $filter('date')(AttendanceCtrl.endDate, 'yyyy/MM/dd');
            AttendanceCtrl.fetchStudentAttendence(AttendanceCtrl.StartDateFormated, AttendanceCtrl.endDateFormated, AttendanceCtrl.months, AttendanceCtrl.year);
        });
        //Allow Staff To View and add Attendance
        AttendanceCtrl.viewStaff = function (classId) {
            Class.find({ filter: { where: { id: classId, staffId: AttendanceCtrl.loginId } } }, function (res) {
                AttendanceCtrl.checkboxes = res;
                if (AttendanceCtrl.checkboxes.length == 1) {
                    AttendanceCtrl.hidecheckBox = "true";
                } else {
                    AttendanceCtrl.hidecheckBox = "false";
                }
                console.log(AttendanceCtrl.hidecheckBox);
            });
        }
    });
