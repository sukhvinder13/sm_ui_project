'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.schooltimetableService
 * @description
 * # schooltimetableService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('schooltimetableService', function ($q, Timetable) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getSchoolTimetableById = function (schoolId) {
            var _activepromise = $q.defer();
            Timetable.find({ filter: { where: { schoolId: schoolId }, include: 'schedules' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.createSchoolTimetableRecords = function (data) {
            var _activepromise = $q.defer();
            Timetable.create({ schoolId: data.schoolId, title: data.title, startTime: data.startTime, endTime: data.endTime, duration: data.duration, attendance: data.attendance },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getExistingSchoolTimetableRecords = function (data) {
            var _activepromise = $q.defer();
            Timetable.findOne({ filter: { where: { schoolId: data.schoolId, title: data.title, startTime: data.startTime, endTime: data.endTime, duration: data.duration, attendance: data.attendance } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.deleteTimetable = function (timetableId) {
            var _activepromise = $q.defer();
            Timetable.deleteById({ id: timetableId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.editTimetable = function (data) {
            var _activepromise = $q.defer();
            Timetable.upsert({ id: data.id, title: data.title, startTime: data.startTime, endTime: data.endTime, duration: data.duration, attendance: data.attendance },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
    });
