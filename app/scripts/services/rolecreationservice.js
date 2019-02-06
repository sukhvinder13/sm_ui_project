'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.roleCreationService
 * @description
 * # roleCreationService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('roleCreationService', function ($q,ManageRole) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getRolecreationDetailsBySchoolIdAdmin = function (data) {
      var _activepromise = $q.defer();
      ManageRole.find({ filter: { where: { schoolId: data,type:"Admin" } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getRolecreationDetailsBySchoolIdStaff = function (data) {
      var _activepromise = $q.defer();
      ManageRole.find({ filter: { where: { schoolId: data,type:"Staff" } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getRolecreationDetailsBySchoolIdAccountant = function (data) {
      var _activepromise = $q.defer();
      ManageRole.find({ filter: { where: { schoolId: data,type:"Accountant" } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getRolecreationDetailsBySchoolIdParent = function (data) {
      var _activepromise = $q.defer();
      ManageRole.find({ filter: { where: { schoolId: data,type:"Parent" } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getRolecreationDetailsBySchoolIdStudent = function (data) {
      var _activepromise = $q.defer();
      ManageRole.find({ filter: { where: { schoolId: data,type:"Student" } } },
        function (response) {
          
          // alert("ss");
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.parentRoleAccess = function(schoolId, data){
  
      var _activepromise = $q.defer();
      
      return _activepromise.promise;
    }
  });
