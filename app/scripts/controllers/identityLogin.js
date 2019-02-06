'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:identityLoginCtrl
 * @description
 * # identityLoginCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('identityLoginController', function (configService, LoopBackAuth, identityService, $http, $timeout, $cookies, APP_MESSAGES, $state, Parent, StudentParent, Student, Accountant, toastr) {
        var identityLoginCtrl = this;
        identityLoginCtrl.otp;
        identityLoginCtrl.password;
        identityLoginCtrl.cpassword;
        identityLoginCtrl.showModel = 'LOGIN'
        identityLoginCtrl.userId;
        if(localStorage.getItem("tree")&&document.cookie.indexOf('role=')){
            $state.go("home.console");
        }else{
            $state.go("login");
        }
        //@@TODO - Clear the below lines while production
        $timeout(function () {
            identityLoginCtrl.loginfields = {};
            if (localStorage.getItem("remember_me")) {
                identityLoginCtrl.loginfields = JSON.parse(localStorage.getItem("remember_me"));
            }
        });

        //@@TODO - Clear the above lines in prod
        identityLoginCtrl.Remember = function () {
            if ($('#remember_me').is(':checked')) {
                localStorage.setItem("remember_me", JSON.stringify(identityLoginCtrl.loginfields));
                var remenber = JSON.parse(localStorage.getItem("remember_me"));
            }
            else {
                identityLoginCtrl.loginfields = {};
                localStorage.setItem("remember_me", JSON.stringify(identityLoginCtrl.loginfields));
                var remenber = JSON.parse(localStorage.getItem("remember_me"));
            }



        };
        identityLoginCtrl.signup = function (invalid) {
            if (invalid)
                return;
            clearError();
            if (identityLoginCtrl.userdata.password && identityLoginCtrl.userdata.password == identityLoginCtrl.cpassword) {
                identityService.signup(identityLoginCtrl.userdata).then(function (response) {
                    if (response) {
                        toastr.success('Successfully Registered. Continue with login....');
                        identityLoginCtrl.showModel = 'LOGIN';
                    }
                }, function (error) {
                    if (error != null && error.data != null)
                        error = error.data.error || error

                    identityLoginCtrl.showError = true;
                    identityLoginCtrl.errorMessage = error.message;
                });
            }
            else {
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = 'Password doesnot match';
            }
        }
        identityLoginCtrl.otpValidate = function (invalid) {
            if (invalid)
                return;
            clearError();
            identityService.validateOTP(identityLoginCtrl.otp, usertoken).then(function (response) {
                if (response) {
                    identityLoginCtrl.showModel = 'RESET';
                    identityLoginCtrl.otp = "";

                }
            }, function (error) {
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = 'Invalid OTP';
            });
        }
        identityLoginCtrl.userdata = {};
        identityLoginCtrl.validateUser = function () {
            clearError();
            identityService.validateuser(identityLoginCtrl.loginfields.username).then(function (response) {
                if (response) {
                    identityLoginCtrl.userdata = response.data;
                    identityLoginCtrl.showModel = 'SIGNUP_OTP';
                }
            }, function (error) {
                if (error != null && error.data != null)
                    error = error.data.error || error
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = error.message;
            });
        }
        identityLoginCtrl.signupOtpValidate = function (invalid) {
            if (invalid)
                return;
            clearError();
            identityService.validateOTP(identityLoginCtrl.otp, identityLoginCtrl.userdata.OTP).then(function (response) {
                if (response) {
                    identityLoginCtrl.showModel = 'SIGNUP';
                    identityLoginCtrl.userdata.phone = identityLoginCtrl.loginfields.username;
                }
            }, function (error) {
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = 'Invalid OTP';
            });
        }
        identityLoginCtrl.resetPassword = function (invalid) {
            if (invalid)
                return;
            clearError();
            if (identityLoginCtrl.userId == undefined) {
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = 'Invalid Data';
            }
            else if (identityLoginCtrl.password != identityLoginCtrl.cpassword) {
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = 'Invalid Password';
            }
            else {
                identityService.updatemypassword(identityLoginCtrl.userId, identityLoginCtrl.password).then(function (response) {
                    if (response) {
                        toastr.success('Successfully Updated Password');
                        identityLoginCtrl.password = "";
                        identityLoginCtrl.cpassword = "";
                        identityLoginCtrl.showModel = 'LOGIN';
                    }
                }, function (error) {
                    if (error) {
                        if (error != null && error.data != null)
                            error = error.data.error || error
                        identityLoginCtrl.showError = true;
                        identityLoginCtrl.errorMessage = error.message;
                    }
                });
            }

        }
        identityLoginCtrl.authenticateUser = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                'password': identityLoginCtrl.loginfields.password
            };
            if (parseInt(identityLoginCtrl.loginfields.username)) {
                if (Number(identityLoginCtrl.loginfields.username)) {
                    data['username'] = (identityLoginCtrl.loginfields.username);
                } else {
                    data['username'] = (identityLoginCtrl.loginfields.username).toLowerCase();
                }
            }
            else {
                data['email'] = (identityLoginCtrl.loginfields.username).toLowerCase();
            }
            if (data) {
                identityService.authenticateUser(data).then(function (response) {
                    if (response) {
                        $cookies.putObject('uts', {
                            accessToken: response.id,
                            userId: response.userId
                        });
                        // single user bypass dashboard
                        identityService.getProfiles({ id: response.userId }).then(function (response) {
                            var data = [];
                            if (response.data) {

                                var profile = response.data;
                                if (profile.admins.length > 0) data.push({ name: 'Admin', profiles: profile.admins });
                                if (profile.accountants.length > 0) data.push({ name: 'Accountant', profiles: profile.accountants });
                                if (profile.staffs.length > 0) data.push({ name: 'Staff', profiles: profile.staffs });
                                if (profile.students.length > 0) data.push({ name: 'Student', profiles: profile.students });
                                if (profile.parents.length > 0) data.push({ name: 'Parent', profiles: profile.parents });
                                identityLoginCtrl.profiles = data;
                                if (data.length == 1 && data[0].profiles.length == 1) {
                                    var data = { id: data[0].profiles[0].id, model: data[0].name }
                                    identityService.authenticateProfile(data).then(function (response) {
                                        if (response != null && response.data) {
                                            var obj = response.data;
                                            $cookies.putObject('uts1', {
                                                accessToken: obj.id,
                                                userId: obj.userId
                                            });
                                            var user = obj.user;
                                            $cookies.putObject('uds', user);
                                            identityLoginCtrl.ManagerId = user.manageRoleId;
                                            $http({
                                                "url": configService.baseUrl() + '/ManageRoles?filter={"where":{"id":"' + identityLoginCtrl.ManagerId + '"}}',
                                                "method": "GET",
                                                "headers": { "Content-Type": "application/json" }
                                            }).then(function (response) {
                                                identityLoginCtrl.roledata = response.data;
                                            });
                                            // return;
                                            $timeout(function () {
                                                window.localStorage.setItem('tree', JSON.stringify(identityLoginCtrl.roledata));
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
                                        identityLoginCtrl.showError = true;
                                        identityLoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                                    });
                                    // };
                                } else {
                                    $state.go('identity.home');
                                }
                            }

                        }, function (err) {
                            identityLoginCtrl.showError = true;
                            identityLoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                        });
                        // single user bypass dashboard end
                        // $state.go('identity.home');
                    }
                }, function (error) {
                    if (error) {
                        if (error.status === 401) {
                            identityLoginCtrl.showError = true;
                            identityLoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                        }
                    }
                });
            }
        };
        identityLoginCtrl.rensedOTP = function () {
            identityLoginCtrl.forgetmyPassword();
            identityLoginCtrl.otp = "";
        }
        var usertoken;
        identityLoginCtrl.forgetmyPassword = function (invalid) {
            if (invalid) {
                return;
            }
            clearError();
            identityService.forgetmyPassword(identityLoginCtrl.loginfields.username).then(function (response) {
                if (response) {
                    usertoken = response.data['OTP'];
                    identityLoginCtrl.userId = response.data.id
                    identityLoginCtrl.showModel = 'OTP';
                }
            }, function (error) {
                if (error != null && error.data != null)
                    error = error.data.error || error
                identityLoginCtrl.showError = true;
                identityLoginCtrl.errorMessage = error.message;
            });
        };
        var clearError = function () {
            identityLoginCtrl.showError = false;
            identityLoginCtrl.errorMessage = '';
        }
        identityLoginCtrl.register = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                'email': (identityLoginCtrl.registerfields.username).toLowerCase(),
                'password': identityLoginCtrl.registerfields.password,
                'key': identityLoginCtrl.registerfields.key
            };
            if (data) {
                identityLoginCtrl.parentExists = Parent.login({ email: data.email, password: data.password }, function () {
                    Student.findById({ id: data.key }, function (response) {
                        StudentParent.findOne({ filter: { where: { studentId: response.id, parentId: identityLoginCtrl.parentExists.userId } } }, function () {
                            toastr.error(APP_MESSAGES.SUBSCRIPT_ERROR);
                        }, function () {
                            StudentParent.create({
                                studentId: response.id, schoolId: response.schoolId, parentId: identityLoginCtrl.parentExists.userId
                            }, function () {
                                toastr.success(APP_MESSAGES.SUBSCRIPT_SUCESS);
                            }, function (response) {

                            });
                        });
                    });
                },
                    function (response) {
                        toastr.error(APP_MESSAGES.SUBSCRIPT_NOTDONE);
                    });
            }
        };
        identityLoginCtrl.rensedOTPSignUp = function () {
            identityLoginCtrl.validateUser();
            identityLoginCtrl.otp = "";
        }
        identityLoginCtrl.checkNumberRegistration = function () {
            if (parseInt(identityLoginCtrl.loginfields.username)) {
                if (Number(identityLoginCtrl.loginfields.username)) {
                    identityLoginCtrl.loginfields.username = Number(identityLoginCtrl.loginfields.username);
                }
            }
        }
    });
