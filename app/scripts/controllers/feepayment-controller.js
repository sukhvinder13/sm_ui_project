'use strict';
/**
 * @ngdoc function
 * @name studymonitorApp.controller:FeesControllerCtrl
 * @description
 * # FeesControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('FeesPaymentController', function (feesService, $cookies, $timeout, $scope, FeeSetup, generateexcelFactory, FeePayment, $state, $location, Student, toastr, APP_MESSAGES, StudentFees, $stateParams, $window) {
    var FeesPaymentController = this;

    FeesPaymentController.schoolId = $cookies.getObject('uds').schoolId;
    FeesPaymentController.loginId = $cookies.getObject('uds').id;
    FeesPaymentController.role = $cookies.get('role');
   // FeesPaymentController.classId = $cookies.getObject('uds').classId;
    FeesPaymentController.classList;
    FeesPaymentController.studentList;
    if(FeesPaymentController.role=='Student'){
      $scope.classFilter=$cookies.getObject('uds').classId;
    }
    function Init() {

      this.getClassDetails = function () {
       feesService.getClassDetailsBySchoolId(FeesPaymentController.schoolId, FeesPaymentController.role, FeesPaymentController.loginId).then(function (result) {
         if (result) {
           FeesPaymentController.classList = result;
         }
       }, function (error) {
       });
     };
     this.getStudents=function(){
       feesService.getStudentPayments(FeesPaymentController.schoolId, FeesPaymentController.role, FeesPaymentController.loginId).then(function (result) {
         if (result) {
           FeesPaymentController.studentList = result.students;
         }
       }, function (error) {
         console.log(error);
         toastr.error(error, APP_MESSAGES.SERVER_ERROR);
       });
     }
    }
    (new Init()).getClassDetails();
    (new Init()).getStudents();

  this.editDetails=function(id){
    window.open('#!/' + 'feeDetails/' + id, '_blank'); // in new tab
  }
   FeesPaymentController.setRollNo = function (student) {
      var matchedPosition = student.rollNo.search(/[a-z]/i);
      console.log(matchedPosition);
      if (matchedPosition != -1) {
      } else {
        var a = Number(student.rollNo);
        student.rollNo1 = a;
      }

    }
});
