'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.schoolcalendarService
 * @description
 * # schoolcalendarService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('schoolcalendarService', function (Calendar,$q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        this.CreateEvent = function (data) {
            var _activepromise = $q.defer();
            Calendar.create({ schoolId: data.schoolId, eventName: data.eventName, date: data.date,day:data.day,month:data.month,year:data.year}, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
  });
