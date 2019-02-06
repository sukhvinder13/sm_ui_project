'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.StaffMoreDetails
 * @description
 * # StaffMoreDetails
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('StaffMoreDetails', function ($q,Staff,Class) {
    // AngularJS will instantiate a singleton by calling "new" on this function
     this.getStudentData = function (sid) {
      var _activepromise = $q.defer();
      Staff.find({ filter: { where: { id: sid }} }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
  });
