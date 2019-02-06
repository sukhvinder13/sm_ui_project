'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.RfidService
 * @description
 * # RfidService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('RfidService', function ($q,Student,Class) {
        this.getClassRecordsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Student.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassesDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        console.log();
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
    });