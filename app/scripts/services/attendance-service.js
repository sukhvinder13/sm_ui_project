'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.attendanceService
 * @description
 * # attendanceService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('attendanceService', function ($q, Class, Student, Attendance, Subject, School,FOsubject,Staff) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getSchoolDataById = function (schoolId) {
            var _activepromise = $q.defer();
            School.find({ filter: { where: { id: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassListById = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    FOsubject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { id: loginId } } }, function (res) {
                        FOsubject.find({ filter: { where: { classId: res[0].classId }, include: 'class' } }, function (response) {
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                } else {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getStudentByClassId = function (classId) {
            var _activepromise = $q.defer();
            Student.find({ filter: { where: { classId: classId }, include: 'school' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getAttendance = function (key) {
            var _activepromise = $q.defer();
            Attendance.findById({ id: key }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getMonthAttendance = function (data) {
            var _activepromise = $q.defer();
            Attendance.find({ filter: { where: { studentId: data.studentId, month: parseInt(data.monthSelected), year: data.yearSelected } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getStudentData = function (sid) {
            var _activepromise = $q.defer();
            Student.find({ filter: { where: { id: sid },include:'class' } }, function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
            return _activepromise.promise;
          };
          this.getStaffData = function (sid) {
            var _activepromise = $q.defer();
            Staff.find({ filter: { where: { id: sid }} }, function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
            return _activepromise.promise;
          };
    });
