'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.examlistService
 * @description
 * # examlistService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('examlistService', function ($q, Exam, Class, Student, Subject) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getExamListBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Exam.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Exam.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { id: loginId } } }, function (res) {
                        Exam.find({ filter: { where: { classId: res[0].classId }, include: ['class'] } }, function (response) {
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getExistingExamlists = function (data) {
            var _activepromise = $q.defer();
            Exam.findOne({ filter: { where: { schoolId: data.schoolId, examName: data.examName, classId: data.classId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getClassDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getSubjectDetailsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Subject.find({ filter: { where: { classId: classId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.CreateOrUpdateExam = function (data) {
            var _activepromise = $q.defer();
            Exam.create({ examName: data.examName, subjectList: data.subjectList, classId: data.classId, maximumMark: data.maximumMark, fromDate: data.fromDate, toDate: data.toDate, schoolId: data.schoolId },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteExam = function (examId) {
            var _activepromise = $q.defer();
            Exam.deleteById({ id: examId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };

        this.editExamlist = function (data) {
            var _activepromise = $q.defer();
            Exam.upsert({ id: data.id, examName: data.examName, classId: data.classId, maximumMark: data.maximumMark, fromDate: data.fromDate, toDate: data.toDate },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getClassRecordsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Exam.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
    });
