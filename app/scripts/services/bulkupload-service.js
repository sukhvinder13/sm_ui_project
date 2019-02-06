'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.bulkuploadService
 * @description
 * # bulkuploadService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('bulkuploadService', function ($q, Class) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getClassDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
  });
