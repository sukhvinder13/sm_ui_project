'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.enquiryService.js
 * @description
 * # enquiryService.js
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('enquiryService', function (Enquiry, $q, Class, Student) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getExistingEnquiryRecords = function (data) {
      var _activepromise = $q.defer();
      Enquiry.findOne({ filter: { where: { schoolId: data.schoolId, name: data.name, classId: data.classId, fathername: data.fathername, description: data.description, cnumber: data.cnumber, prevschool: data.prevschool, enquiryType: data.enquiryType, acnumber: data.acnumber, reference: data.reference, responseType: data.responseType, address: data.address, response: data.response, dateOfEnquiry: data.dateOfEnquiry, followUpDate: data.followUpDate,JoiningDate:data.JoiningDate,DateOfBirth:data.DateOfBirth,Gender:data.Gender} } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getEnquiryDetailsBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Admin") {
          Enquiry.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        } else if (role === "Staff") {
          Enquiry.find({ filter: { where: { schoolId: schoolId, loginId: loginId }, include: 'class' } }, function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        } else if (role === "Student") {
          Enquiry.find({ filter: { where: { schoolId: schoolId, loginId: loginId }, include: 'class' } }, function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        } else if (role === "Accountant") {
          Enquiry.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        }
        return _activepromise.promise;
      }
      
      // Enquiry.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
      //   _activepromise.resolve(response);
      // }, function (error) {
      //   _activepromise.reject(error);
      // });
      // return _activepromise.promise;
    };
    this.CreateOrUpdateEnquiry = function (data) {
      var _activepromise = $q.defer();
      Enquiry.create({ schoolId: data.schoolId, loginId: data.loginId, studentId: data.name, classId: data.classId, fathername: data.fathername, description: data.description, cnumber: data.cnumber, prevschool: data.prevschool, enquiryType: data.enquiryType, acnumber: data.acnumber, reference: data.reference, responseType: data.responseType, address: data.address, response: data.response, dateOfEnquiry: data.dateOfEnquiry, followUpDate: data.followUpDate ,email:data.email,JoiningDate:data.JoiningDate,DateOfBirth:data.DateOfBirth,Gender:data.Gender},
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.deleteEnquiry = function (enquiryId) {
      var _activepromise = $q.defer();
      Enquiry.deleteById({ id: enquiryId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    this.editEnquiry = function (data) {

      var _activepromise = $q.defer();
      Enquiry.upsert({ id: data.id, studentId: data.name, classId: data.classId, fathername: data.fathername, description: data.description, cnumber: data.cnumber, prevschool: data.prevschool, enquiryType: data.enquiryType, acnumber: data.acnumber, reference: data.reference, responseType: data.responseType, address: data.address, response: data.response, dateOfEnquiry: data.dateOfEnquiry, followUpDate: data.followUpDate, loginId: data.loginId ,email:data.email,JoiningDate:data.JoiningDate,DateOfBirth:data.DateOfBirth,Gender:data.Gender},
        function (response) {
          _activepromise.resolve(response);

        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getClassDetailBySchoolID = function(schoolId){
      var _activepromise = $q.defer();
      Class.find({filter:{where:{schoolId : schoolId}, order: 'sequenceNumber ASC'}}, function(response){
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      })
      return _activepromise.promise;
    };
    this.getStudentData = function(classId, schoolId){
      var _activepromise = $q.defer();
      Student.find({filter:{where:{schoolId:schoolId, classId:classId}}}, function(result){
        _activepromise.resolve(result);
      }, function (error) {
        _activepromise.reject(error);
      })
      return _activepromise.promise;
    
    }
  });
