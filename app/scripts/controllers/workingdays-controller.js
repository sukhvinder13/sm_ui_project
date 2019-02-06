'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:WorkingdaysControllerCtrl
 * @description
 * # WorkingdaysControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('WorkingdaysController', function (workingdaysService, $cookies, WorkingDay,toastr, APP_MESSAGES) {
    var WorkingDaysCtrl = this;
    //Get Assignment details by School ID
    WorkingDaysCtrl.schoolId = $cookies.getObject('uds').schoolId;

    function Init() {
      this.getWorkingDayDetails = function () {
        workingdaysService.getWorkingDayDetailsBySchoolId(WorkingDaysCtrl.schoolId).then(function (result) {
          if (result) {
            var days;
            WorkingDaysCtrl.workingdaysList = result;
            if (result.length === 0) {
              days = [
                { day: 'Monday', schoolId: WorkingDaysCtrl.schoolId, working: true },
                { day: 'Tuesday', schoolId: WorkingDaysCtrl.schoolId, working: true },
                { day: 'Wednesday', schoolId: WorkingDaysCtrl.schoolId, working: true },
                { day: 'Thursday', schoolId: WorkingDaysCtrl.schoolId, working: true },
                { day: 'Friday', schoolId: WorkingDaysCtrl.schoolId, working: true },
                { day: 'Saturday', schoolId: WorkingDaysCtrl.schoolId, working: true },
                { day: 'Sunday', schoolId: WorkingDaysCtrl.schoolId, working: false }
              ];
              WorkingDay.createMany(days);
            }
          }
        }, function (error) {
          //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
        });
      };
    }
    (new Init()).getWorkingDayDetails();
    WorkingDaysCtrl.saveDay = function (day) {
      workingdaysService.CreateOrUpdateWorkingDay(day).then(function (result) {
        if(result){
          toastr.success(APP_MESSAGES.INSERT_SUCCESS);
        }
      });
    };
  });
