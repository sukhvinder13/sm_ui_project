'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.mediauploadsService
 * @description
 * # mediauploadsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('mediauploadsService', function ($q, School,Media) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getMediaBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            School.find({ filter: { where: { id: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getMediaImagesByschoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Media.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getExistingMediaRecords = function (data) {
            var _activepromise = $q.defer();
            School.find({ filter: { where: { schoolId: data.schoolId, video: data.video, images: data.images } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.UpdateVideo = function (data) {
            var _activepromise = $q.defer();
            School.upsert({ id: data.id, video: data.video },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.UpdateImage = function (data) {
            var _activepromise = $q.defer();
            School.upsert({ id: data.id, images: data.images },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.Updatelogo = function (data) {
            var _activepromise = $q.defer();
            School.upsert({ id: data.id, logo: data.logo },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
    });
