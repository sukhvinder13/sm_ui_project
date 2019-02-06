'use strict';
/**
 * @ngdoc function
 * @name studymonitorApp.controller:FeesStructureController
 * @description
 * # FeesStructureController
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('FeesStructureController', function (feesService, $cookies, $timeout, $scope, FeeSetup, generateexcelFactory, FeePayment, $state, $location, Student, toastr, APP_MESSAGES, StudentFees, $stateParams, $window,$filter) {
    var FeesStrctCtrl = this;

    this.schoolId = $cookies.getObject('uds').schoolId;
    this.loginId = $cookies.getObject('uds').id;
    this.role = $cookies.get('role');
    this.feeStructuerData;
    this.classList;
    this.classId;
    feesService.getschoolDetailsByloginId(FeesStrctCtrl.schoolId).then(function(ress){
      if(ress){
        if(ress[0].faymentStudents){
        FeesStrctCtrl.enableFeedata = ress[0].faymentStudents;
        }
      }
    })
    if(FeesStrctCtrl.role=='Student'){
      FeesStrctCtrl.classId=$cookies.getObject('uds').classId;
      $timeout(function(){
        FeesStrctCtrl.getFeeStructure()
      },1000);
    }
    function init(){

    this.getClassDetails = function () {
      console.log('here');
        feesService.getClassDetailsBySchoolId(FeesStrctCtrl.schoolId, FeesStrctCtrl.role, FeesStrctCtrl.loginId).then(function (result) {
          if (result) {
            FeesStrctCtrl.classList = result;
            console.log(result);
          }
        }, function (error) {
          console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      };
    }
    (new init()).getClassDetails();
    this.getFeeStructure = function () {
      feesService.getFeestructure(FeesStrctCtrl.classId).then(function (res) {
        console.log(res);
        FeesStrctCtrl.feeStructuerData = res;
      }, function (error) {
        console.log(error);
        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
    });
  };
   $scope.orderByDate=function(item){
      console.log(item);
      if(item.date)item.date=$filter('date')(new Date(item.date),'dd-MM-yyyy');
      return item ;
   }
  });
