'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:GpsreportsControllerCtrl
 * @description
 * # GpsreportsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('GpsreportsControllerCtrl', function ($scope, $cookies, $filter, busLiveService, BusSetupService) {
    $scope.schoolId = $cookies.getObject('uds').schoolId;
    BusSetupService.getParentData($scope.schoolId).then(function (result) {
      if (result) {
        $scope.busList = result.data;
      }
    }, function (error) {
      console.log('Error while fetching the Busservice records. Error stack : ' + error);
    });
    $scope.getReports = function (vNo, date) {
      var selectedDate = $filter('date')(date, 'yyyy-MM-dd');
      busLiveService.getTripsBydate(vNo, selectedDate).then(function (success) {
        $scope.reportResults = success.data
      }).catch(function (err) {
        console.log(err);
      })
    }
    $scope.calculateToatalDisTance = function (data) {
      return _.reduce(data, function (memo, num) { return memo + num.distance }, 0);
    }

  });
