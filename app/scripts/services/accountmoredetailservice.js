'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.AccountmoredetailService
 * @description
 * # AccountmoredetailService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('AccountmoredetailService', function (Accountant,$q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getStudentData = function (sid) {
      var _activepromise = $q.defer();
      Accountant.find({ filter: { where: { id: sid }} }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
  });
