'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.classupgradeService
 * @description
 * # classupgradeService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('classupgradeService', function ($q, Class, Student) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getClassDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Class.find({
                filter: {
                    where: { schoolId: schoolId }, order: 'sequenceNumber DESC', "include": [{
                        "relation": 'students', scope: {
                            order:'firstName DESC' 
                        }
                    }]
                }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //  Student.find({ filter: { "where": { "schoolId": schoolId }, "include": [{ "relation": "class", "scope": { fields: ['className', 'sectionName'], "include": { "relation": "feeSetups" } } }, { "relation": "feePayments" }] } }, function (response) {
        //             _activepromise.resolve(response);
        //         }, function (error) {
        //             _activepromise.reject(error);
        //         });
        this.getStudentCountByClassId = function (fromclassId) {
            var _activepromise = $q.defer();
            Class.students.count({
                fromclassId: fromclassId
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.upgradeClassByClassId = function (fromclassId, toclassId) {
            var _activepromise = $q.defer();
            Student.update({ where: { classId: fromclassId } }, { classId: toclassId },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

    });
