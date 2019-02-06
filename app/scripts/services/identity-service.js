(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name studymonitorApp.loginService
     * @description
     * # loginService
     * Service in the studymonitorApp.
     */
    angular.module('studymonitorApp')
        .service('identityService', function ($http, $q, configService, Identity, School) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            this.getschoolNameBySchoolId = function (schoolId) {
                var _activepromise = $q.defer();
                School.find({ filter: { where: { id: schoolId } } }, function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
                return _activepromise.promise;
            };
            this.roledata = function (ManagerId) {
                var D = $q.defer();
                $http.get(configService.baseUrl() + '/ManageRoles?filter={"where":{"id":"' + ManagerId + '"}}')
                    .then(function (data) {
                        D.resolve(data);
                    }, function (err) {
                        D.reject(err);
                    });
                return D.promise;

            };

            this.authenticateUser = function (data) {
                return Identity.login(data).$promise;
            };
            this.updatemypassword = function (userid, pwd) {
                return Identity.updatemypassword({ userid: userid, pwd: pwd }).$promise;
            }

            this.getProfiles = function (userid) {
                return Identity.getProfiles(userid).$promise;
            }

            this.authenticateProfile = function (userID, model) {
                return Identity.loginwithRole(userID, model).$promise;
            };
            this.forgetmyPassword = function (val) {
                return Identity.forgetmyPassword({ val: val }).$promise;
            };
            this.validateOTP = function (otp, cotp) {
                return Identity.validateotp({ otp: otp, cotp: cotp }).$promise;
            };

            this.validateuser = function (val) {
                return Identity.validateuser({ val: val }).$promise;
            };
            this.signup = function (data) {
                return Identity.signup({ data: data }).$promise;
            };
            this.getSchoolDetailsById = function (schoolId) {
                var _activepromise = $q.defer();
                School.findById({ id: schoolId }, function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
                return _activepromise.promise;
            };

            this.getForgotPassword = function (data, role) {

                return Identity.forgotPassword(data).$promise;
            };

            this.forgetPassword = function (vals) {

            }

        });
})();
