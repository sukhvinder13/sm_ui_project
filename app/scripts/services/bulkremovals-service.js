'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.bulkremovalsService
 * @description
 * # bulkremovalsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('bulkremovalsService', function ($q, Class) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getClassDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.deleteBulkRemoval = function (bulkrevomalId) {
      var _activepromise = $q.defer();
      Class.students.destroyById({ id: bulkrevomalId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
  });
