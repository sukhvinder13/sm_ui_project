'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.addvisitorService
 * @description
 * # addvisitorService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('addvisitorService', function (Visitor,$q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getExistingEnquiryRecords = function (data) {
      var _activepromise = $q.defer();
      Visitor.findOne({ filter: { where: { schoolId: data.schoolId, name: data.name, classId: data.classId, fathername: data.fathername, description: data.description, cnumber: data.cnumber, prevschool: data.prevschool } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getvisitorDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Visitor.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.CreateOrUpdatevisitor = function (data) {
      var _activepromise = $q.defer();
      Visitor.create({ schoolId: data.schoolId, name: data.name, classId: data.classId, fathername: data.fathername, description: data.description, cnumber: data.cnumber, prevschool: data.prevschool },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.deletevisitor = function (enquiryId) {
      var _activepromise = $q.defer();
      Visitor.deleteById({ id: enquiryId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    this.deletevisitor = function (complaintId) {
      var _activepromise = $q.defer();
      Visitor.deleteById({ id: complaintId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    this.editvisitorlist = function (data) {
      var _activepromise = $q.defer();
      Visitor.upsert({ id: data.id, name: data.name, classId: data.classId, fathername: data.fathername, description: data.description, cnumber: data.cnumber, prevschool: data.prevschool },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
  });
