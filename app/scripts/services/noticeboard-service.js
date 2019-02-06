'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.noticeboardService
 * @description
 * # noticeboardService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('noticeboardService', function ($q, Noticeboard) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getNoticeDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Noticeboard.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getExistingNoticeRecords = function (data) {
            var _activepromise = $q.defer();
            Noticeboard.findOne({ filter: { where: { schoolId: data.schoolId, title: data.title, date1: data.date1, date2: data.date2 } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.CreateOrUpdateNoticeboard = function (data) {
            var _activepromise = $q.defer();
            Noticeboard.create({ schoolId: data.schoolId, title: data.title, description: data.description, date1: data.date1, date2: data.date2,file:data.file },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.deleteNotice = function (noticeId) {
            var _activepromise = $q.defer();
            Noticeboard.deleteById({ id: noticeId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.editNotice = function (data) {
            var _activepromise = $q.defer();
            Noticeboard.upsert({ id: data.id, title: data.title, description: data.description, date1: data.date1, date2: data.date2,file:data.file },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
    });
