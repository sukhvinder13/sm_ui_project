'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.subjectsService
 * @description
 * # subjectsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('subjectsService', function ($q, Subject, School, Class, Student) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getSubjectListBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            // if (role) {
            //     if (role === "Student") {
            //         Student.find({
            //             filter: {
            //                 where: { id: loginId }, include: [
            //                     {
            //                         relation: 'class', scope: {
            //                             include: [
            //                                 {
            //                                     relation: 'subjects',
            //                                     scope: {
            //                                         include: [
            //                                             {
            //                                                 relation: 'staff'
            //                                             }
            //                                         ]
            //                                     }
            //                                 },
            //                                 {
            //                                     relation: 'staff'
            //                                 }
            //                             ]
            //                         }
            //                     }
            //                 ]
            //             }
            //         },
            //             function (response) {
            //                 _activepromise.resolve(response[0].class.subjects);
            //             }, function (error) {
            //                 _activepromise.reject(error);
            //             });
            //     }
            //     else {
            //         Subject.find({ filter: { where: { schoolId: schoolId }, include: ['staff', 'class'] } }, function (response) {
            //             _activepromise.resolve(response);
            //         }, function (error) {
            //             _activepromise.reject(error);
            //         });
            //         return _activepromise.promise;
            //     }
            //     return _activepromise.promise;
            // }
            if (role) {
                if (role === "Admin") {
                    Subject.find({ filter: { where: { schoolId: schoolId }, include: ['class', 'staff'] } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Subject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: ['class', 'staff'] } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { id: loginId } } }, function (res) {
                        Subject.find({ filter: { where: { classId: res[0].classId }, include: 'class' } }, function (response) {
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        //Verify data exists or not
        this.verifyDataExistsOrNot = function (data) {
            var _activepromise = $q.defer();
            Subject.findOne({ filter: { where: { schoolId: data.schoolId, classId: data.classId, subjectName: data.subjectName } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //get Staff or class List
        this.getClassAndStaffList = function (schoolId) {
            var _activepromise = $q.defer();
            School.findOne({
                filter: {
                    where: { id: schoolId }, "include": [{
                        "relation": ['classes'], scope: {
                            order: 'sequenceNumber ASC'
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
        this.getStaffList = function (schoolId) {
            var _activepromise = $q.defer();
            School.findOne({
                filter: {
                    where: { id: schoolId }, "include": [{
                        "relation": 'staffs'

                    }]
                }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //Create New Subject
        this.CreateSubject = function (data) {
            var _activepromise = $q.defer();
            Subject.create({ schoolId: data.schoolId, classId: data.classId, subjectName: data.subjectName, staffId: data.staffId, examFlag: data.examFlag, assesments: data.assesments }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //Delete Subject
        this.deleteSubject = function (subjectId) {
            var _activepromise = $q.defer();
            Subject.deleteById({ id: subjectId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        //Update Subject
        this.updateSubject = function (data) {
            var _activepromise = $q.defer();
            Subject.upsert({ id: data.id, staffId: data.staffId, examFlag: data.examFlag, assesments: data.assesments }, function (response) {
                _activepromise.resolve(response);
            }, function (response) {
                _activepromise.reject(response);
            });
            return _activepromise.promise;
        };
        this.getClassDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //clas id
        //this.getClassRecordsByClassId = funtion (){
        // this.getClassRecordsByClassId = function (classId) {
        //      var _activepromise = $q.defer();
        //             Subject.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
        //                 _activepromise.resolve(response);
        //             }, function (error) {
        //                 _activepromise.reject(error);
        //             });
        //             return _activepromise.promise;
        // };
        this.getClassRecordsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Subject.find({ filter: { where: { classId: classId }, include: ['staff', 'class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
    });
