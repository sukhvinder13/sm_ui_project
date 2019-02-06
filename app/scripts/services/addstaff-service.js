'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.addStaffService
 * @description
 * # addStaffService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('addStaffService', function (Staff, $q, Class) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    this.getClassDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getExistingStaffRecords = function (data) {
      var _activepromise = $q.defer();
      Staff.findOne({ filter: { where: { schoolId: data.schoolId,email:data.email} } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.CreateOrUpdateStaff = function (data) {
      var _activepromise = $q.defer();
      // var profilepic = document.getElementById('profileImage').getAttribute('src');
      Staff.create({
        schoolId: data.schoolId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        password: data.password,
        gender: data.gender,
        dateofBirth: data.dateofBirth,
        RFID: data.RFID,
        dateofJoin: data.dateofJoin,
        regId: data.regId,
        isDisable: data.isDisable,
        currentAddress: data.currentAddress,
        currentCity: data.currentCity,
        currentState: data.currentState,
        currentPincode: data.currentPincode,
        bloodGroup: data.bloodGroup,
        religion: data.religion,
        caste: data.caste,
        alternateContact: data.alternateContact,
        permanentAddress: data.permanentAddress,
        permanentCity: data.permanentCity,
        permanentState: data.permanentState,
        permanentPincode: data.permanentPincode,
        nationalId: data.nationalId,
        motherTounge: data.motherTounge,
        nationalIdType: data.nationalIdType,
        subCaste: data.subCaste,
        contact: data.contact,
        qualification: data.qualification,
        percentage: data.percentage,
        qualifiedUniversity: data.qualifiedUniversity,
        BED: data.BED,
        file: data.file,
        ExpcertiFile: data.ExpcertiFile,
        adhaarFile :data.adhaarFile,
        pancardFile: data.pancardFile,
        designation: data.designation
        // profilepic: profilepic
      },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.editStaff = function (data) {
      var _activepromise = $q.defer();
      Staff.prototype$patchAttributes({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        password: data.password,
        gender: data.gender,
        dateofBirth: data.dateofBirth,
        RFID: data.RFID,
        dateofJoin: data.dateofJoin,
        regId: data.regId,
        isDisable: data.isDisable,
        currentAddress: data.currentAddress,
        currentCity: data.currentCity,
        currentState: data.currentState,
        currentPincode: data.currentPincode,
        bloodGroup: data.bloodGroup,
        religion: data.religion,
        caste: data.caste,
        alternateContact: data.alternateContact,
        permanentAddress: data.permanentAddress,
        permanentCity: data.permanentCity,
        permanentState: data.permanentState,
        permanentPincode: data.permanentPincode,
        nationalId: data.nationalId,
        motherTounge: data.motherTounge,
        nationalIdType: data.nationalIdType,
        subCaste: data.subCaste,
        contact: data.contact,
        // created: new Date(),
        qualification: data.qualification,
        percentage: data.percentage,
        qualifiedUniversity: data.qualifiedUniversity,
        BED: data.BED,
        file:data.file,
        ExpcertiFile: data.ExpcertiFile,
        adhaarFile :data.adhaarFile,
        pancardFile: data.pancardFile,
        designation: data.designation
      },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getStaffDetailsById = function (id) {
      var _activepromise = $q.defer();
      Staff.findById({ id: id },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getStaffDetailsById = function (id) {
      var _activepromise = $q.defer();
      Staff.findById({ id: id },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
  });
