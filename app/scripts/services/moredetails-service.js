'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.moredetailsService
 * @description
 * # moredetailsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('moredetailsService', function ($q,Student,Class,School) {
    // AngularJS will instantiate a singleton by calling "new" on this function
     this.getStudentData = function (sid) {
      var _activepromise = $q.defer();
      Student.find({ filter: { where: { id: sid },include:'class' } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getMsgid = function (schoolId) {
      var _activepromise = $q.defer();
      School.find({ filter: { where: { id: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getSchoolDataById = function (schoolId) {
      var _activepromise = $q.defer();
      School.find({ filter: { where: { id: schoolId } } }, function (response) {
          _activepromise.resolve(response);
      }, function (error) {
          _activepromise.reject(error);
      });
      return _activepromise.promise;
  };
  });
