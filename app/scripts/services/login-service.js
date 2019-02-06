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
        .service('loginService', function ($http, $q, School, Admin, Student, Staff, Parent, Accountant, StudentParent) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            this.authenticateUser = function (data, role) {
                var _activepromise;
                if (role) {
                    /*
                    * Make an API call depends on user selected role
                    * For Admin - authenticateAdmin
                    * For Student - authenticateStudent
                    * For Parent - authenticateParent
                    * For Staff - authenticateStaff
                    */
                    if (role === "Admin") {
                        _activepromise = Admin.login(data).$promise;
                    }
                    else if (role === "Student") {
                        _activepromise = Student.login(data).$promise;
                    }
                    else if (role === "Staff") {
                        _activepromise = Staff.login(data).$promise;
                    }
                    else if (role === "Parent") {
                        _activepromise = Parent.login(data).$promise;
                    } else if (role === "Accountant") {
                        _activepromise = Accountant.login(data).$promise;
                    }
                    return _activepromise;
                }
            };

            this.getAuthenticateUserDetails = function (userID, accessToken, role) {
                var _activepromise;
                if (role) {
                    if (role === "Admin") {
                        _activepromise = Admin.findById({ id: userID }).$promise;
                    }
                    else if (role === "Student") {
                        _activepromise = Student.findById({ id: userID }).$promise;
                    }
                    else if (role === "Staff") {
                        _activepromise = Staff.findById({ id: userID }).$promise;
                    } else if (role === "Accountant") {
                        _activepromise = Accountant.findById({ id: userID }).$promise;
                    }
                    else if (role === "Parent") {
                        _activepromise = Parent.findById({ id: userID }, function (result) {
                            StudentParent.find({ filter: { where: { parentId: result.id } } }).$promise;
                        });
                    }
                }
                return _activepromise;
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
                var _activepromise;
                if (role) {
                    if (role === "Admin") {
                        _activepromise = Admin.forgotPassword(data).$promise;
                    }
                    else if (role === "Student") {
                        _activepromise = Student.forgotPassword(data).$promise;
                    }
                    else if (role === "Staff") {
                        _activepromise = Staff.forgotPassword(data).$promise;
                    }
                    else if (role === "Parent") {
                        _activepromise = Parent.forgotPassword(data).$promise;
                    }
                    return _activepromise;
                }
            };

        });
})();
