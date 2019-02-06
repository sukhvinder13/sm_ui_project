'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.gradeService
 * @description
 * # gradeService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('gradeService', function ($q, Grade) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getGradeDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Grade.find({filter:{where:{schoolId : schoolId}}}, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getExistingGrades = function (data) {
            var _activepromise = $q.defer();
            Grade.findOne({ filter: { where: { schoolId: data.schoolId, gradeName: data.gradeName } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.CreateOrUpdateGrade = function (data) {
            var _activepromise = $q.defer();
            Grade.create({ schoolId: data.schoolId, gradeName: data.gradeName, gradePoint: data.gradePoint, percentageRangeFrom: data.percentageRangeFrom, percentageRangeTo: data.percentageRangeTo, gradefullName:data.fullName },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.editGrade = function (data) {
            var _activepromise = $q.defer();
            Grade.upsert({id: data.id, gradeName: data.gradeName, gradePoint: data.gradePoint, percentageRangeFrom: data.percentageRangeFrom, percentageRangeTo: data.percentageRangeTo, gradefullName:data.fullName },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteGrade = function (gradeId) {
            var _activepromise = $q.defer();
            Grade.deleteById({ id: gradeId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
    });
