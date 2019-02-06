'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('LoginController', function (loginService, $scope, $stateParams, $timeout, $cookies, APP_MESSAGES, $state, Parent, StudentParent, Student, Accountant, toastr, $location) {
        var LoginCtrl = this;
        LoginCtrl.showforgot = false;
        LoginCtrl.other = false;   
        LoginCtrl.ownFunction = true;
        //@@TODO - Clear the below lines while production
        $timeout(function () {
            LoginCtrl.loginfields = {};
            //LoginCtrl.loginfields.username = 'mkshetty@sm.in';
            //LoginCtrl.loginfields.password = 'admin';
            //LoginCtrl.loginfields.role = 'Admin';
            if (localStorage.getItem("remember_me")) {
                LoginCtrl.loginfields = JSON.parse(localStorage.getItem("remember_me"));
            }
        });
        //@@TODO - Clear the above lines in prod
        LoginCtrl.Remember = function () {
            //alert("hello"+localStorage.chkbx);
            if ($('#remember_me').is(':checked')) {
                localStorage.setItem("remember_me", JSON.stringify(LoginCtrl.loginfields));
                var remenber = JSON.parse(localStorage.getItem("remember_me"));
            }

        };

        // other website start
        // if($stateParams.otherID === "other"){
        //     LoginCtrl.other = "true"
        // }

        $scope.authenticateUser = function (invalid) {
            if (LoginCtrl.ownFunction) {
                if ($stateParams.other !== 'dashboard') {
            if (invalid) {
                return;
            }
            var decodedData = window.atob($stateParams.other);
            if (decodedData == "") {
                return;
            }
            var jj = JSON.parse(decodedData);
            LoginCtrl.other = jj.true;

            var data = {
                "username": jj.email,
                "password": jj.password,
                "role": jj.role,
                "other": jj.true
            }
            // LoginCtrl.other = jj.other;

            LoginCtrl.loginfield = {
                "username": data.username,
                "password": data.password,
                "role": data.role

            };
            LoginCtrl.loginfields = LoginCtrl.loginfield;
            
            var data = {
                'email': (LoginCtrl.loginfields.username).toLowerCase(),
                'password': LoginCtrl.loginfields.password
            };
            if (data) {
                if (LoginCtrl.loginfields.role) {
                    //Make an API Call to authentical
                    //Params @email,@password and @role
                    LoginCtrl.loginfieldsrole = jj.role;
                    loginService.authenticateUser(data, LoginCtrl.loginfieldsrole).then(function (response) {

                        if (response) {
                            $cookies.putObject('uts', {
                                accessToken: response.id,
                                userId: response.userId
                            });
                            LoginCtrl.loginfieldsroles = jj.roleId;
                            loginService.getAuthenticateUserDetails(response.userId, response.id, LoginCtrl.loginfieldsrole).then(function (result) {

                                if (result) {
                                    $cookies.putObject('uds', result);
                                    loginService.getSchoolDetailsById(result.schoolId).then(function (res) {
                                        if (res) {
                                            $cookies.putObject('__s', res);
                                            $cookies.put('role', LoginCtrl.loginfields.role);
                                            $state.go('home.console'); //Navigate to console landing page on successfull login
                                        }
                                    });
                                }
                            }, function (error) {
                                if (error) {
                                    LoginCtrl.showError = true;
                                    LoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                                }
                            });
                        }
                    }, function (error) {
                        if (error) {
                            if (error.status === 401) {
                                LoginCtrl.showError = true;
                                LoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                            }
                        }
                    });
                }
            }
        }
    }
        };
        if ($stateParams.other == 'dashboard') {
            LoginCtrl.ownFunction = false;
        }
        if ($stateParams.other !== ':other') {
            $scope.authenticateUser();
        }
        // other website start


        LoginCtrl.authenticateUser = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                'email': (LoginCtrl.loginfields.username).toLowerCase(),
                'password': LoginCtrl.loginfields.password
            };
            if (data) {
                if (LoginCtrl.loginfields.role) {
                    //Make an API Call to authentical
                    //Params @email,@password and @role
                    loginService.authenticateUser(data, LoginCtrl.loginfields.role).then(function (response) {
                        if (response) {
                            $cookies.putObject('uts', {
                                accessToken: response.id,
                                userId: response.userId
                            });
                            loginService.getAuthenticateUserDetails(response.userId, response.id, LoginCtrl.loginfields.role).then(function (result) {
                                if (result) {
                                    $cookies.putObject('uds', result);
                                    loginService.getSchoolDetailsById(result.schoolId).then(function (res) {
                                        if (res) {
                                            $cookies.putObject('__s', res);
                                            $cookies.put('role', LoginCtrl.loginfields.role);
                                            $state.go('home.console'); //Navigate to console landing page on successfull login
                                        }
                                    });
                                }
                            }, function (error) {
                                if (error) {
                                    LoginCtrl.showError = true;
                                    LoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                                }
                            });
                        }
                    }, function (error) {
                        if (error) {
                            if (error.status === 401) {
                                LoginCtrl.showError = true;
                                LoginCtrl.errorMessage = APP_MESSAGES.LOGIN_INVALID;
                            }
                        }
                    });
                }
            }
        };
        LoginCtrl.forgotPassword = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                'email': LoginCtrl.forgotfields.email,
            };
            if (data) {
                if (LoginCtrl.forgotfields.role) {
                    //Make an API Call to authentical
                    //Params @email,@password and @role
                    loginService.getForgotPassword(data, LoginCtrl.forgotfields.role).then(function (response) {
                        if (response) {
                            $state.go('login');
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.EMAIL_SENT);
                        }
                    }, function (error) {
                        //console.log('Error while Fetching the Records' + JSON.stringify(error));
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    });
                }
            }
        };
        LoginCtrl.register = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                'email': (LoginCtrl.registerfields.username).toLowerCase(),
                'password': LoginCtrl.registerfields.password,
                'key': LoginCtrl.registerfields.key
            };
            if (data) {
                LoginCtrl.parentExists = Parent.login({ email: data.email, password: data.password }, function () {
                    Student.findById({ id: data.key }, function (response) {
                        StudentParent.findOne({ filter: { where: { studentId: response.id, parentId: LoginCtrl.parentExists.userId } } }, function () {
                            //Show Toast Message Error
                            toastr.error(APP_MESSAGES.SUBSCRIPT_ERROR);
                            // alert('You Have Already Subscribed To This Student.Please Contact Your School Admin For Any Issues');
                        }, function () {
                            StudentParent.create({
                                studentId: response.id, schoolId: response.schoolId, parentId: LoginCtrl.parentExists.userId
                            }, function () {
                                //console.log('Parent Student Relation Created');
                                //Show Toast Message Success
                                toastr.success(APP_MESSAGES.SUBSCRIPT_SUCESS);
                                // alert('You have registered Successfully');
                            }, function (response) {
                                //console.log(response.data.error.message);
                            });
                        });
                    });
                },
                    function (response) {
                        toastr.error(APP_MESSAGES.SUBSCRIPT_NOTDONE);
                        // alert('You Have Not Subscribed Yet.Please Contact Your School Admin');
                    });
            }
        };
    })
    .controller('ParamsController', function (loginService, $scope, $stateParams, $timeout, $cookies, APP_MESSAGES, $state, Parent, StudentParent, Student, Accountant, toastr) {
        $scope.userId = $stateParams.userId;
        $scope.tokenId = $stateParams.tokenId;
        $state.go('home.console');
    });