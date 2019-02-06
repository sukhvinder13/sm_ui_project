'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:StaffmoredetailsCtrl
 * @description
 * # StaffmoredetailsCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('StaffmoredetailsController', function (StaffMoreDetails,$stateParams,$scope) {
       var StaffmoredetailsCtrl = this;
    //console.log($stateParams.id);
    StaffmoredetailsCtrl.studId = $stateParams.id;
    function Init() {
      this.getStudentData = function () {
        StaffMoreDetails.getStudentData(StaffmoredetailsCtrl.studId).then(function (result) {
          if (result) {
            StaffmoredetailsCtrl.studentData = result;
            //console.log(StaffmoredetailsCtrl.studentData);
          }
        }, function (error) {
          //console.log('Error while fectching records for Student in school directory. Error stack' + error);
        });
      };
    }
    (new Init()).getStudentData();
  });
