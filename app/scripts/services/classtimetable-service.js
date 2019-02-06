'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.classtimetableService
 * @description
 * # classtimetableService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('classtimetableService', function ($q, Schedule, Timetable, Class, School, WorkingDay, Subject, Student,FOsubject) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getClasstimetableDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Timetable.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        // this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
        //     var _activepromise = $q.defer();
        //     if (role) {
        //         if (role === "Admin") {
        //             Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        //                 _activepromise.resolve(response);
        //             }, function (error) {
        //                 _activepromise.reject(error);
        //             });
        //         }
        //         else if (role === "Staff") {
        //             Class.find({ filter: { where: { schoolId: schoolId, staffId: loginId } } }, function (response) {
        //                 _activepromise.resolve(response);
        //             }, function (error) {
        //                 _activepromise.reject(error);
        //             });
        //         }
        //         return _activepromise.promise;
        //     }
        // };
        this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Subject.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Accountant") {
                    Subject.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    School.find({ filter: { where: { id: schoolId } } }, function (res) {
                        if (res[0].marksFormat == "FO") {
                            FOsubject.find({ filter: { where: { staffId: loginId }, include: 'class' } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        } else if (res[0].marksFormat !== "FO") {
                            Subject.find({ filter: { where: { staffId: loginId }, include: 'class' } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        }
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { id: loginId } } }, function (res) {
                        Subject.find({ filter: { where: { classId: res[0].classId }, include: 'class' } }, function (response) {
                            //console.log(response);
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
            }
            return _activepromise.promise;

        };
        this.getSchoolTimetableBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            School.findOne({ filter: { where: { id: schoolId }, include: 'timetables' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassTimeTableByClassId = function (classId) {
            var _activepromise = $q.defer();
            Class.findOne({ filter: { where: { id: classId }, include: 'schedules' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getWorkingDaysBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            WorkingDay.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.createSchedule = function (data) {
            var _activepromise = $q.defer();
            Schedule.create({ timetableId: data.timetableId, workingDayId: data.workingDayId, classId: data.classId }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassTimeTablesList = function (data) {
            var _activepromise = $q.defer();
            Timetable.find({ filter: { where: { schoolId: data.schoolId }, include: [{ relation: 'schedules', scope: { include: [{ relation: 'workingDay' }, { relation: 'class', scope: { include: 'subjects' } }], where: { classId: data.classId } } }] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.deleteSchedules = function (classId) {
            var _activepromise = $q.defer();
            Class.schedules.destroyById({ id: classId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
    });
