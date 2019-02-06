'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.addtopicService
 * @description
 * # addtopicService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('addtopicService', function ($q, LessonPlanner) {
    this.getChapterDetailsById = function (id) {
      var _activepromise = $q.defer();
      LessonPlanner.find({ filter: { where: { id: id },include:['class','subject'] } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getTopicDetailsByChapterId = function (schoolId, showsubjectId, showClassId, id) {
      var _activepromise = $q.defer();
      LessonPlanner.find({ filter: { where: { schoolId: schoolId, subjectId: showsubjectId, classId: showClassId, id: id } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getTopicListByChapterId = function (id) {
      var _activepromise = $q.defer();
      LessonPlanner.find({ filter: { where: { id: id } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
  });
