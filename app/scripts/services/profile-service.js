'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.profileService
 * @description
 * # profileService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('profileService', function ($q, Admin, Student, Staff, Parent,Accountant) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.updateUser = function (data, role) {
      var _activepromise = $q.defer();
      if (role) {
        /*
        * Make an API call depends on user selected role
        * For Admin - authenticateAdmin
        * For Student - authenticateStudent
        * For Parent - authenticateParent
        * For Staff - authenticateStaff
        * For Accountant - authenticateAccountant
        */
        if (role === "Admin") {
          Admin.prototype$patchAttributes({ id: data.id, password: data.password, firstName: data.firstName, lastName: data.lastName, email: data.email,file: data.file ,contact:data.contact,profileUpdate:data.profileUpdate},
            function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
        }
        else if (role === "Student") {
          Student.prototype$patchAttributes({ id: data.id, password: data.password, firstName: data.firstName, lastName: data.lastName, email: data.email,file: data.file,contact:data.contact,profileUpdate:data.profileUpdate },
            function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
        }
        else if (role === "Staff") {
          Staff.prototype$patchAttributes({ id: data.id, password: data.password, firstName: data.firstName, lastName: data.lastName, email: data.email,file: data.file,contact:data.contact,profileUpdate:data.profileUpdate },
            function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
        }
        else if (role === "Parent") {
          Parent.prototype$patchAttributes({ id: data.id, password: data.password, firstName: data.firstName, lastName: data.lastName, email: data.email,file: data.file,contact:data.contact,profileUpdate:data.profileUpdate },
            function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
        }
        else if (role === "Accountant") {
          Accountant.prototype$patchAttributes({ id: data.id, password: data.password, firstName: data.firstName, lastName: data.lastName, email: data.email,file: data.file,contact:data.contact,profileUpdate:data.profileUpdate },
            function (response) {
              _activepromise.resolve(response);
            }, function (error) {
              _activepromise.reject(error);
            });
        }
        return _activepromise.promise;
      }
    };
  });