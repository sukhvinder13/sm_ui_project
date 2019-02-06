'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.workingdaysService
 * @description
 * # workingdaysService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('workingdaysService', function ($q, WorkingDay) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getWorkingDayDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      WorkingDay.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.CreateOrUpdateWorkingDay = function (day, start, end) {
      var _activepromise = $q.defer();
      WorkingDay.prototype$patchAttributes({
        id: day.id, working: day.working
      },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.CreateOrUpdateWorkingDayendTime = function (day, stime, etime) {
      if (stime == undefined || stime == "Invalid Date") {
        stime = "";
      }
      if (etime == undefined || etime == "Invalid Date") {
        etime = "";
      }
      var _activepromise = $q.defer();
      WorkingDay.prototype$patchAttributes({
        id: day.id, working: day.working, startTime: stime, endTime: etime
      },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
  });
