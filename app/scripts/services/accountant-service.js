'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.accountantService
 * @description
 * # accountantService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('accountantService', function ($q, Accountant) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getExistingAccountantRecords = function (data) {
      var _activepromise = $q.defer();
      Accountant.findOne({ filter: { where: { schoolId: data.schoolId } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.CreateOrUpdateAccountant = function (data,mid) {
      var _activepromise = $q.defer();
      Accountant.create({
        schoolId: data.schoolId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        password: data.password,
        type:data.type,
        gender: data.gender,
        DOB: data.DOB,
        RFID: data.RFID,
        DOJ: data.DOJ,
        motherTounge:data.motherTounge,
        currentAddress: data.currentAddress,
        currentCity: data.currentCity,
        currentState: data.currentState,
        currentPincode: data.currentPincode,
        bloodGroup: data.bloodGroup,
        alternateContact: data.alternateContact,
        nationalId: data.nationalId,
        nationalIdType: data.nationalIdType,
        contact: data.contact,
        created: new Date(),
        file: data.file,
        expCertiFile: data.expCertiFile,
        adhaarFile:data.adhaarFile,
        pancardFile:data.pancardFile,
        qualification:data.qualification,
        rno:data.rno,
        designation:data.designation,
        manageRoleId:mid

      },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getAccountantDetailsById = function (id) {
      console.log(id)
      var _activepromise = $q.defer();
      Accountant.findById({ id: id },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.editAccountant = function (data) {
      var _activepromise = $q.defer();
      Accountant.prototype$patchAttributes({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        password: data.password,
        gender: data.gender,
        DOB: data.DOB,
        rollNo: data.rollNo,
        RFID: data.RFID,
        DOJ: data.DOJ,
        currentAddress: data.currentAddress,
        currentCity: data.currentCity,
        currentState: data.currentState,
        currentPincode: data.currentPincode,
        bloodGroup: data.bloodGroup,
        alternateContact: data.alternateContact,
        nationalId: data.nationalId,
        nationalIdType: data.nationalIdType,
        contact: data.contact,
        created: new Date(),
        file: data.file,
        expCertiFile: data.expCertiFile,
        adhaarFile:data.adhaarFile,
        pancardFile:data.pancardFile,   
        qualification:data.qualification,
        rno:data.rno,
        designation:data.designation

      },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
  });
