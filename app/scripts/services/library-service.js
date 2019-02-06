'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.libraryService
 * @description
 * # libraryService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('libraryService', function ($q, Library, Class, Student) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getLibraryBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Library.find({ filter: { where: { schoolId: schoolId }, include: ['class', 'student'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getExistingLibraryRecords = function (data) {
            var _activepromise = $q.defer();
            Library.findOne({ filter: { where: { schoolId: data.schoolId, name: data.name, author: data.author } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.CreateOrUpdateLibrary = function (data) {
            var _activepromise = $q.defer();
            Library.create({ schoolId: data.schoolId, name: data.name, author: data.author, description: data.description, price: data.price, available: data.available },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteLibrary = function (bookId) {
            var _activepromise = $q.defer();
            Library.deleteById({ id: bookId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.editLibrary = function (data) {
            var _activepromise = $q.defer();
            Library.upsert({ id: data.id, name: data.name, author: data.author, description: data.description, price: data.price, available: data.available },
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
        this.getStudentsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Student.find({
                filter: { where: { classId: classId } }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.CreateOrUpdateCirculation = function (data) {
            var _activepromise = $q.defer();
            Library.upsert({ id: data.id, classId: data.classId, studentId: data.studentId, issuedbooks: data.issuedbooks },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
    });
