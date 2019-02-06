'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:RfidController
 * @description
 * # RfidController
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('RfidController', function ($cookies, $http, RfidService, AcademicBatch, Student, toastr) {
        var RfidCtrl = this;

        RfidCtrl.schoolId = $cookies.getObject('uds').schoolId;
        RfidCtrl.loginId = $cookies.getObject('uds').id;
        RfidCtrl.role = $cookies.get('role');
        RfidCtrl.somevalue = false;
        function Init() {
            this.getAdminClassDetails = function () {
                RfidService.getClassesDetailsBySchoolId(RfidCtrl.schoolId, RfidCtrl.role, RfidCtrl.loginId).then(function (result) {
                    if (result) {
                        RfidCtrl.classesList = result;

                    }

                }, function (error) { });
            };
            this.getAcademicData = function () {
                AcademicBatch.find({
                    filter: { where: { schoolId: RfidCtrl.schoolId, status: "Active" } }
                }, function (response) {
                    console.log(response);
                    RfidCtrl.Academicdata = response;
                }, function (error) {
                    console.log(error);
                });
            };
        }

        RfidCtrl.chooseClass = function (classId) {
            // alert("hi");
            Student.find({
                filter: {
                    where: {
                        schoolId: RfidCtrl.schoolId,
                        classId: RfidCtrl.classId
                    },

                }
            }, function (res) {
                RfidCtrl.Classdata = res;
                console.log(res)
            })

        };
        (new Init()).getAdminClassDetails();
        (new Init()).getAcademicData();

        RfidCtrl.saverfid = function (data) {
            console.log(data);
            console.log(RfidCtrl.Classdata);
            // console.log('http://139.162.6.194:3000/api/Students', JSON.stringify(RfidCtrl.Classdata));
            //             $http.put('http://139.162.6.194:3000/api/Students', JSON.stringify(RfidCtrl.Classdata)).then(function (response) {

            //             })

            async.each(RfidCtrl.Classdata, function (stu, Cb) {
                console.log(stu);
                Student.prototype$patchAttributes({ id: stu.id, RFID: stu.RFID }, function (res) {
                    Cb();
                })
            }, function (err) {
                if (err) {
                    alert("something went wrong");
                } else {
                    toastr.success('Rfid Updated Successfully');
                    // alert("success...........!");
                }
            })

        }

    });