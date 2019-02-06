'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.FoexamService
 * @description
 * # FoexamService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('FoexamService', function ($q, FOexam, Class, FOsubject) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getExistingfoExamlists = function (data) {
      var _activepromise = $q.defer();
      FOexam.findOne({ filter: { where: { schoolId: data.schoolId, examName: data.examName, classId: data.classId } } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getClassDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getFoSubjectDetailsByClassId = function (classId) {
      var _activepromise = $q.defer();
      FOsubject.find({ filter: { where: { classId: classId, "examFlag": true } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.CreateOrUpdateFoExam = function (data) {
      var _activepromise = $q.defer();
      FOexam.create({ schoolId: data.schoolId, examName: data.examName, classId: data.classId, examType: data.examType,tempFile: data.tempFile, subjectList: data.subjectList },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.deleteFoExam = function (examId) {
      var _activepromise = $q.defer();
      FOexam.deleteById({ id: examId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };

    this.editExamlist = function (data) {
      var _activepromise = $q.defer();
      FOexam.upsert({ id: data.id, examName: data.examName, classId: data.classId, subjectList: data.subjectList, tempFile: data.tempFile },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
  });
