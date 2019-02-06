'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ClassupgradeControllerCtrl
 * @description
 * # ClassupgradeControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ClassupgradeController', function (classupgradeService, $cookies, toastr, APP_MESSAGES) {
        var ClassUpgradeCtrl = this;
        //Get Assignment details by School ID
        ClassUpgradeCtrl.schoolId = $cookies.getObject('uds').schoolId;
        function Init() {

            this.getClassDetails = function () {
                classupgradeService.getClassDetailsBySchoolId(ClassUpgradeCtrl.schoolId).then(function (result) {
                    if (result) {
                        ClassUpgradeCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getClassDetails();
        //Get Students Count based on Selected Classes
        ClassUpgradeCtrl.CheckClassCount = function () {
            if (ClassUpgradeCtrl.fromclassId) {
                angular.forEach(ClassUpgradeCtrl.classList, function (v) {
                    if (v.id === ClassUpgradeCtrl.fromclassId) {
                        ClassUpgradeCtrl.studentCount = v.students.length;
                        return;
                    }
                });
            }
        };
        ClassUpgradeCtrl.update = function () {
            classupgradeService.upgradeClassByClassId(ClassUpgradeCtrl.fromclassId, ClassUpgradeCtrl.toclassId).then(function (result) {
                if (result) {
                    if (ClassUpgradeCtrl.fromclassId === ClassUpgradeCtrl.toclassId) {
                        //console.log('Error while updating. Error Stack');
                    }
                    else {
                        //console.log('Class Upgarded');
                    }
                }
            }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                //console.log('Error while deleting. Error Stack' + error);
            });
        };
    });
