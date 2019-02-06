'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:identityLoginCtrl
 * @description
 * # identityLoginCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('identityController', function (LoopBackAuth, identityService, $timeout, $cookies, APP_MESSAGES, $http, $state, toastr, Identity, ManageRole, School) {
        var identityCtrl = this;
        identityCtrl.disable = true;
        var uds = $cookies.getObject('uts');
        identityCtrl.profiles;
        identityService.getProfiles({ id: uds.userId }).then(function (response) {
            console.log(response);
            var data = [];
            if (response.data) {
                var profile = response.data;
                if (profile.admins.length > 0) data.push({ name: 'Admin', profiles: profile.admins });
                if (profile.accountants.length > 0) data.push({ name: 'Accountant', profiles: profile.accountants });
                if (profile.staffs.length > 0) data.push({ name: 'Staff', profiles: profile.staffs });
                if (profile.students.length > 0) data.push({ name: 'Student', profiles: profile.students });
                if (profile.parents.length > 0) data.push({ name: 'Parent', profiles: profile.parents });
                identityCtrl.profiles = data;
                console.log(data);

            }

        }, function (err) {

        });
        // function Init() {
        //     this.getSchoolDetails = function () {
        //         identityService.getschoolNameBySchoolId(identityCtrl.sschoolId).then(function (result) {
        //             if (result) {
        //                 console.log(result);
        //                 identityCtrl.schoolName = result[0].schoolName;



        //             }
        //         }, function (error) {
        //         });
        //     };
        // }
        // (new Init().getSchoolDetails());
        identityCtrl.authenticateProfile = function (id, model) {

            var data = { id: id, model: model }

            identityService.authenticateProfile(data).then(function (response) {

                if (response != null && response.data) {
                    var obj = response.data;

                    $cookies.putObject('uts1', {
                        accessToken: obj.id,
                        userId: obj.userId
                    });
                    var user = obj.user;
                    console.log(user);
                    $cookies.putObject('uds', user);
                    console.log(user.manageRoleId);
                    identityCtrl.ManagerId = user.manageRoleId;
                    identityService.roledata(identityCtrl.ManagerId).then(function (response) {
                        identityCtrl.roledata = response.data;
                    });
                    // return;
                    $timeout(function () {

                        window.localStorage.setItem('tree', JSON.stringify(identityCtrl.roledata));
                        // }, 500);
                        // return;
                        identityService.getSchoolDetailsById(user.schoolId).then(function (res) {
                            if (res) {
                                $cookies.putObject('__s', res);
                                $cookies.put('role', user.type);
                                var accessToken = response.data;
                                LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
                                LoopBackAuth.rememberMe = true;
                                LoopBackAuth.save();
                                $state.go('home.console'); //Navigate to console landing page on successfull login
                            }
                        });
                    }, 2000);
                }
            }, function (error) {
                if (error) {
                }
            });
        };

        identityCtrl.changePassword = function () {
            Identity.prototype$patchAttributes({ id: uds.userId, password: identityCtrl.newPassword }, function (sucess) {
                if (sucess) {
                    identityCtrl.closeModal();
                }
            });
        }
        identityCtrl.matchingPwd = function () {
            if (identityCtrl.newPassword === identityCtrl.cPassword) {
                document.getElementById('cPwd').style.backgroundColor = "lightgreen";
                document.getElementById('newPwd').style.backgroundColor = "lightgreen";
                identityCtrl.disable = false;
            } else {
                document.getElementById('cPwd').style.backgroundColor = "pink";
                document.getElementById('newPwd').style.backgroundColor = "lightgreen";
                identityCtrl.disable = true;
            }
        }
        identityCtrl.matchingPwd1 = function () {
            if (identityCtrl.newPassword.length >= 5) {
                document.getElementById('newPwd').style.backgroundColor = "lightgreen";
            }
            if (identityCtrl.cPassword === null || identityCtrl.cPassword === undefined) {
                return;
            }
            if (identityCtrl.newPassword === identityCtrl.cPassword) {
                document.getElementById('cPwd').style.backgroundColor = "lightgreen";
                document.getElementById('newPwd').style.backgroundColor = "lightgreen";
                identityCtrl.disable = false;
            } else {
                document.getElementById('cPwd').style.backgroundColor = "pink";
                document.getElementById('newPwd').style.backgroundColor = "lightgreen";
                identityCtrl.disable = true;
            }
        }
        identityCtrl.closeModal = function () {
            var modal = $('#myModal');
            modal.modal('hide');
        };

        identityCtrl.logout = function () {
            Identity.logout({}, function (res) {
                $cookies.remove('uds');
                $cookies.remove('uts');
                $cookies.remove('uts1');
                $state.go('login');
            });

        };
    });
