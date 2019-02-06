'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AccountmoredetailscontrollerCtrl
 * @description
 * # AccountmoredetailscontrollerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AccountmoredetailscontrollerCtrl', function ($stateParams,AccountmoredetailService) {
  
    var AccountantmoreCtrl = this;
    console.log($stateParams.id);
    AccountantmoreCtrl.studId = $stateParams.id;
    function Init() {
      this.getStudentData = function () {
        AccountmoredetailService.getStudentData(AccountantmoreCtrl.studId).then(function (result) {
          if (result) {
            AccountantmoreCtrl.studentData = result;
            //console.log(AccountantmoreCtrl.studentData);
          }
        }, function (error) {
          //console.log('Error while fectching records for Student in school directory. Error stack' + error);
        });
      };
    }
    (new Init()).getStudentData();
  });
