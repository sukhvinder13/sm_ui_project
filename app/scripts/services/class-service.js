'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.classService
 * @description
 * # classService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('classService', function ($http, $q, configService, $cookies, Class, School, cfpLoadingBar) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getClassDetails = function (schoolId) {
            var _activepromise = $q.defer();
            cfpLoadingBar.start();
            School.findOne({ filter: { where: { id: schoolId }, include: [{ relation: 'classes', scope: { include: [{ relation: 'subjects', scope: { include: 'staff' } }, { relation: 'staff' }] } }, { relation: 'staffs' }] } },
                function (response) {
                    _activepromise.resolve(response);
                },
                function (error) {
                    _activepromise.reject(error);
                });
            cfpLoadingBar.complete();
            return _activepromise.promise;
        };
        this.getClassTeacherByID = function (staffId) {
            return $http.get(configService.baseUrl() + '/Staffs/' + staffId + '?access_token=' + $cookies.getObject('uts').accessToken);
        };
        this.getStaffBySchoolID = function (schoolId) {
            return $http.get(configService.baseUrl() + '/Schools/' + schoolId + '/staffs?access_token=' + $cookies.getObject('uts').accessToken);
        };
        this.classAdd = function (data) {
            var _activepromise = $q.defer();
            Class.create({ schoolId: data.schoolId, className: data.className, sectionName: data.sectionName, staffId: data.staffId, sendMessage: data.sendMessage, msgStatus: data.msgStatus, sequenceNumber: data.sequenceNumber, setSeq: data.setSeq, setclassId: data.setclassId }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.classUpdate = function (data) {
            // console.log(data);
            var _activepromise = $q.defer();
            Class.upsert({ id: data.classId, staffId: data.staffId, sendMessage: data.sendMessage, msgStatus: data.msgStatus, setSeq: data.setSeq, setclassId: data.setclassId, className: data.className, sectionName: data.sectionName }, function (response) {
                _activepromise.resolve(response);
                // console.log(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.findClassRecord = function (data) {
            var _activepromise = $q.defer();
            Class.findOne({ filter: { where: { schoolId: data.schoolId, className: data.className, sectionName: data.sectionName } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.findClassBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.deleteClass = function (classId) {
            var _activepromise = $q.defer();
            Class.deleteById({ id: classId },
                this.deletesubjectsByclassId(classId),
                function (response) { _activepromise.resolve(response); },
                function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
        this.deleteexamByclassId = function (classId) {
            var _activepromise = $q.defer();
            Class.exams.destroyById({ id: classId },
                this.deleteassignmentsByclassId(classId),
                function (response) { _activepromise.resolve(response); },
                function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
        this.deletesubjectsByclassId = function (classId) {
            var _activepromise = $q.defer();
            Class.subjects.destroyById({ id: classId },
                this.deleteexamByclassId(classId),
                function (response) { _activepromise.resolve(response); },
                function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
        this.deleteassignmentsByclassId = function (classId) {
            var _activepromise = $q.defer();
            Class.assignments.destroyById({ id: classId },
                function (response) { _activepromise.resolve(response); },
                function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
    });
