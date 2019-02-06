'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.consoleService
 * @description
 * # consoleService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    // AngularJS will instantiate a singleton by calling "new" on this function
    .service('consoleService', function ($q, Noticeboard, Assignment, Leave, FOexam, School, SMUser, Student, Attendance, $filter, Timetable, Schedule, Class, Media, UserMessages, Chat,Staff) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getNoticeDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Noticeboard.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getTeacherLeaveDetailsBySchoolId = function (loginId) {
            var _activepromise = $q.defer();
            Leave.find({ filter: { where: { reporterId: loginId }, include: ['sMUser', 'submitter', 'class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        // To get list of absent students
        this.getAbsentStudentsListBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            //console.log(getTodayDate() + "getAbsentStudentsListBySchoolId:" + schoolId);
            var tod = getTodayDate();
            var absents = 0, totStudents = 0;
            var v, sList, at = {};
            var stGroupBy = {};
            var final = {}, finalArray = [];
            //find attendance of today date
            Attendance.find({ filter: { where: { DT: tod } } }, function (attendanceByDate) {
                //console.log('attendance by date...' + JSON.stringify(attendanceByDate));
                School.find({ filter: { where: { id: schoolId } } }, function (school) {
                    //console.log('school.by schoolid...'+JSON.stringify(school));
                    var schoolCode = school[0].code;
                    Class.find({ filter: { where: { schoolId: schoolId }, include: 'students' } },
                        function (response) {
                            var classesList = response;
                            var st = {};

                            var ab = [];

                            $.each(attendanceByDate, function (index, value) {
                                if ($.inArray(value.RFID, ab) === -1) {
                                    ab.push(value.RFID);
                                }
                            });
                            //console.log('-----------' + JSON.stringify(ab));

                            for (var i = 0; i < classesList.length; i++) {
                                absents = 0;
                                v = classesList[i];
                                sList = classesList[i].students;
                                totStudents = sList.length;
                                if (totStudents > 0) {
                                    for (var j = 0; j < sList.length; j++) {
                                        st = sList[j];
                                        //console.log(ab.indexOf(st.RFID)+'..index of RFID.....'+st.RFID);
                                        if (ab.indexOf(st.RFID) == -1) {
                                            absents++;
                                        }
                                    }
                                }
                                //console.log((v.className+'-'+v.sectionName)+'------by class...absents..'+absents);
                                final = {
                                    "className": v.className + ' ' + v.sectionName,
                                    "absents": absents,
                                    "totalStudents": totStudents
                                };
                                finalArray.push(final);
                            }
                            //for end
                            _activepromise.resolve(finalArray);
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                });
            });

            return _activepromise.promise;
        };
        //end
        this.getStaffListBySchoolId = function (schoolId) {
            // console.log(schoolId);
            var _activepromise = $q.defer();
            Staff.find({ filter: { where: { schoolId: schoolId } } }, function (res) {
                // console.log(res);
                var tod = getTodayDate();
                var finalArray = [];
                var finalArray1 = [];
                var asd = 0;
                //find attendance of today date
                Attendance.find({ filter: { where: { DT: tod } } }, function (attendanceByDate) {
                    res.map(function (staffData) {
                        attendanceByDate.map(function (data) {
                            if (staffData.RFID == data.RFID) {
                                finalArray1.push(staffData);
                                // console.log(staffData);
                                // console.log(data);
                                staffData.present = "Present";
                            }
                        })
                    })
                    // console.log(_.uniqBy(finalArray1,'RFID'));
                    finalArray = _.uniqBy(finalArray1, 'id')
                    // $timeout(function(){
                    // console.log(finalArray);
                    var data = {
                        "Total": res.length,
                        "present": finalArray.length,
                        "attendance": res
                        // console.log(res);
                    }
                    _activepromise.resolve(data);
                    // },2000);
                })
                // console.log(res);
                // _activepromise.resolve(res);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //to get today date
        function getTodayDate() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            //var today = dd+'/'+mm+'/'+yyyy;
            var today = yyyy + '/' + mm + '/' + dd;
            return today;
        }


        //group by 
        Array.prototype.groupBy = function (prop) {
            return this.reduce(function (groups, item) {
                var val = item[prop];
                groups[val] = groups[val] || [];
                groups[val].push(item);
                return groups;
            }, {});
        }
        this.getExamListBySchoolId = function (schoolId) {
            console.log(schoolId);
            var _activepromise = $q.defer();
            FOexam.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                // console.log(response);
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getTimeTableIdFromSchedule = function (classId) {
            var _activepromise = $q.defer();
            Schedule.find({ filter: { where: { classId: classId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.updatebuslocation = function (schoolId,address,lat,lng,name) {
            // console.log(schoolId);
            // console.log(address);
            var _activepromise = $q.defer();
            School.prototype$patchAttributes({id:schoolId, busaddress:address,lat:lat,lng:lng,name:name }, function (response) {
                console.log(response);
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getTimeTablebyTimeTableId = function (timetableId) {
            var _activepromise = $q.defer();
            Timetable.find({ filter: { where: { id: timetableId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getSTudentFeeDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Student.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Student.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { schoolId: schoolId, id: loginId } } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getAssignmentDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Assignment.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Assignment.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { schoolId: schoolId, id: loginId } } }, function (res) {
                        // console.log("student data on id-----"+JSON.stringify(res));
                        Assignment.find({ filter: { where: { schoolId: schoolId, classId: res[0].classId } } }, function (response) {

                            // console.log("student assignments based on class----"+JSON.stringify(response));
                            _activepromise.resolve(response);
                        });

                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getMediaDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            School.findById({ id: schoolId }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getStudentDetailsBySchoolId = function (schoolId) {
            var fromDate = $filter('date')(new Date(), "dd-MM-yyyy");
            var testDate = new Date();
            var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
            testDate.setTime(testDate.getTime() + weekInMilliseconds);
            var toDate = $filter('date')(new Date(testDate), "dd-MM-yyyy");

            var _activepromise = $q.defer();
            Student.find({ filter: { where: { schoolId: schoolId }, include: ['class'] } }, function (response) {



                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        // this.getStudentDetailsBySchoolId = function (schoolId) {
        //     var fromDate = $filter('date')(new Date(), "dd-MM-yyyy");
        //     var testDate = new Date();
        //     var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        //     testDate.setTime(testDate.getTime() + weekInMilliseconds);
        //     var toDate = $filter('date')(new Date(testDate), "dd-MM-yyyy");
        //     console.log(fromDate);
        //     console.log(toDate);


        //     var _activepromise = $q.defer();
        //     Student.find({ filter: { where: { schoolId: schoolId, DOB:fromDate}, include: ['class']  } }, function (response) {
        //        console.log(response);
        //         _activepromise.resolve(response);
        //     }, function (error) {
        //         _activepromise.reject(error);
        //     });
        //     return _activepromise.promise;
        // };
        // this.showUserMessagesByloginId = function (loginId) {
        //     var _activepromise = $q.defer();
        //     UserMessages.find({ filter: { where: { userId: loginId } } }, function (response) {
        //         _activepromise.resolve(response);
        //     }, function (error) {
        //         _activepromise.reject(error);
        //     });
        //     return _activepromise.promise;
        // };
        this.MessageSend = function (loginId) {
            var _activepromise = $q.defer();
            UserMessages.find({ filter: { where: { userId: loginId }, include: 'sMUser' } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getdetailedMeassage = function (messageId) {
            //console.log("messageid:"+messageId);
            var _activepromise = $q.defer();
            Chat.find({ filter: { where: { id: messageId }, include: 'sMUser' } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        //Lavanya COde Start
        this.schoolinfo = function (data) {
            var _activepromise = $q.defer();
            School.prototype$patchAttributes({ id: data.schoolId, schoolName: data.SchoolName, softwareStartDate: data.softwareStartDate, AffiliatedBy: data.AffiliatedBy, RegistrationNo: data.RegistrationNo, AffiliationNo: data.AffiliationNo, DateOfEstablishment: data.DateOfEstablishment, Board: data.Board }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.schoolinfo1 = function (data) {
            var _activepromise = $q.defer();
            School.prototype$patchAttributes({ id: data.schoolId, Address: data.Address, Pin: data.Pin, Email: data.Email, City: data.City, State: data.State, District: data.District, Country: data.Country, PrimaryMobile: data.PrimaryMobile, PrimaryMobile1: data.PrimaryMobile1, AlternateMobile: data.AlternateMobile, AlternateMobile1: data.AlternateMobile1, Landline: data.Landline, Landline1: data.Landline1, Website: data.Website }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.Academicdata = function (data) {
            var _activepromise = $q.defer();
            School.prototype$patchAttributes({ id: data.schoolId, AcademicBatch: data.AcademicBatch, StartDate: data.StartDate, EndDate: data.EndDate, status: data.status, }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //End

        this.getMediaImagesBySchoolId = function (schoolId) {
            //console.log("messageid:"+messageId);
            var _activepromise = $q.defer();
            Media.find({ filter: { where: { schoolId: schoolId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
    });