'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.addStudentService
 * @description
 * # addStudentService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('addStudentService', function (Student, $q, Class, School) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    this.getClassDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Class.find({
        filter: {
          where: {
            schoolId: schoolId
          },
          order: 'sequenceNumber ASC'
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getStudentDetailsByClassId = function (classId) {
      var _activepromise = $q.defer();
      Student.find({
        filter: {
          where: {
            classId: classId
          }
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.checkStudent = function (data) {
      var _activepromise = $q.defer();
      Student.findOne({
        filter: {
          where: {
            email: data.email.toLowerCase()
          }
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getExistingStudentRecords = function (data) {
      var _activepromise = $q.defer();
      Student.findOne({
          filter: {
            where: {
              schoolId: data.schoolId,
              classId: data.classId,
              rollNo: data.rollNo
            }
          }
        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.CreateOrUpdateStudent = function (data) {
      var _activepromise = $q.defer();
      // var profilepic = document.getElementById('profileImage').getAttribute('src');
      Student.create({
          schoolId: data.schoolId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          password: "Student",
          gender: data.gender,
          // dateofBirth: data.dateofBirth,
          DOB: data.DOB,
          rollNo: data.rollNo,
          RFID: data.RFID,
          previousSchool: data.previousSchool,
          //dateofJoin: data.dateofJoin,
          DOJ: data.DOJ,
          classId: data.classId,
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
          created: new Date(),
          fatherName: data.fatherName,
          motherName: data.motherName,
          fatherContact: data.fatherContact,
          motherContact: data.motherContact,
          file: data.file,
          tcFile: data.tcFile,
          adhaarFile: data.adhaarFile,
          castecertiFile: data.castecertiFile,
          dobFile: data.dobFile,
          registrationNo: data.registrationNo,
          identificationMarks: data.identificationMarks,
          classofAdmission: data.classofAdmission,
          motherEmail: data.motherEmail,
          fatherEmail: data.fatherEmail,
          academicbatch: data.academicbatch,
          // DOB:data.DOB
          /*fields for student fee details*/
          // totalFee:"NA",
          // paidFee:"NA",
          // discountFee:"NA",
          // dueFee:"NA",
          // oldDueFee:"NA"
        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.editStudent = function (data) {
      var _activepromise = $q.defer();
      Student.prototype$patchAttributes({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          password: data.password,
          gender: data.gender,
          DOB: data.DOB,
          dateofBirth: data.dateofBirth,
          rollNo: data.rollNo,
          RFID: data.RFID,
          previousSchool: data.previousSchool,
          DOJ: data.DOJ,
          dateofJoin: data.dateofJoin,
          classId: data.classId,
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
          created: new Date(),
          fatherName: data.fatherName,
          motherName: data.motherName,
          fatherContact: data.fatherContact,
          motherContact: data.motherContact,
          file: data.file,
          tcFile: data.tcFile,
          adhaarFile: data.adhaarFile,
          castecertiFile: data.castecertiFile,
          dobFile: data.dobFile,
          registrationNo: data.registrationNo,
          motherEmail: data.motherEmail,
          classofAdmission: data.classofAdmission,
          fatherEmail: data.fatherEmail,
          academicbatch: data.academicbatch,
          identificationMarks: data.identificationMarks

        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getStudentDetailsById = function (id) {
      var _activepromise = $q.defer();
      Student.findById({
          id: id
        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.updateCount = function (schoolId) {
      var _activepromise = $q.defer();
      School.find({
        filter: {
          where: {
            id: schoolId
          }
        }
      }, function (res) {

        res[0].studentPrefix[0].counter++;
        School.prototype$patchAttributes({
            id: schoolId,
            studentPrefix: res[0].studentPrefix
          },
          function (response) {
            _activepromise.resolve(response);
          },
          function (error) {
            _activepromise.reject(error);
          });
      })
      return _activepromise.promise;
    }
  });
