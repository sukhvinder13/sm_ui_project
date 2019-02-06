'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BulkremovalsControllerCtrl
 * @description
 * # BulkremovalsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('BulkremovalsController', function ($timeout, $cookies, $rootScope, bulkremovalsService, toastr, APP_MESSAGES) {
    var BulkRemovalsCtrl = this;
    BulkRemovalsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    BulkRemovalsCtrl.userData = $cookies.getObject('uds');
    BulkRemovalsCtrl.schoolData = $cookies.getObject('__s');
    //Defaults
    BulkRemovalsCtrl.user = BulkRemovalsCtrl.userData;
    BulkRemovalsCtrl.school = BulkRemovalsCtrl.schoolData;
    BulkRemovalsCtrl.schoolId = BulkRemovalsCtrl.school.id;
    $rootScope.image = BulkRemovalsCtrl.school.image;
    BulkRemovalsCtrl.schoolCode = BulkRemovalsCtrl.school.code;

    function Init() {
      this.getClassDetails = function () {
        bulkremovalsService.getClassDetailsBySchoolId(BulkRemovalsCtrl.schoolId).then(function (result) {
          if (result) {
            BulkRemovalsCtrl.classList = result;
          }
        }, function (error) {
          //console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
      };
    }
    (new Init()).getClassDetails();
    //Delete Action
    BulkRemovalsCtrl.deleteAll = function () {
        bulkremovalsService.deleteBulkRemoval(BulkRemovalsCtrl.classId).then(function (result) {
          if (result) {
            //Show Toast Message Success
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          //console.log('Error while deleting Records. Error Stack' + error);
        });
      
    };
    BulkRemovalsCtrl.confirmCallbackMethod = function(){
      BulkRemovalsCtrl.deleteAll();
    }
    BulkRemovalsCtrl.confirmCallbackCancel = function(){
    return;
    }
  });
