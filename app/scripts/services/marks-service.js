'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.marksService
 * @description
 * # marksService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('marksService', function (configService, $q, Marks, Class, Subject, Exam, MaxMark, Student, School, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getMarksDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Marks.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
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

        this.getSubjectDetailsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Subject.find({ filter: { where: { classId: classId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        // get subjects
        this.getSubjectDetailsByexamId = function (examId) {
            var _activepromise = $q.defer();
            Exam.findOne({ filter: { where: { id: examId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        // get subjects
        this.getStudentSubjectDetailsByStudentId = function (loginId) {
            var _activepromise = $q.defer();
            Marks.find({ filter: { where: { studentId: loginId }, include: ['subject', 'exam'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //getallsubjectMarks
        // this.getAllSubjectDetailsByExamId = function (classId,examId) {
        //     var _activepromise = $q.defer();

        //     Marks.getSubjectMarks({ filter: { where: {classId: classId,examId:examId } } }, function (response) {
        //         _activepromise.resolve(response);
        //     }, function (error) {
        //         _activepromise.reject(error);
        //     });
        //     return _activepromise.promise;
        // };
        //getallsubjectMarks
        this.getSubjectMarkByClassId = function (loginId, examId) {
            var _activepromise = $q.defer();
            Marks.find({ filter: { where: { studentId: loginId, examId: examId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getSubjectMarksByClassId = function (classId, schoolId) {
            var _activepromise = $q.defer();
            Exam.find({ filter: { where: { classId: classId, schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getSubjectNameBySubjectId = function (subjectId) {
            var _activepromise = $q.defer();
            Subject.find({ filter: { where: { id: subjectId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getExamDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Exam.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.CreateOrUpdateMarks = function (sample) {
            var _activepromise = $q.defer();
            Marks.create(sample,
                function (response) {
                    _activepromise.resolve(response);
                },
                function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.UpdateMarks = function (updatemarks) {

            var _activepromise = $q.defer();
            $http.put(configService.baseUrl() + '/Marks/' + updatemarks.id, updatemarks)
                .then(function (response) {
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        }

        this.addMarks = function (updatemarks) {

            var _activepromise = $q.defer();
            $http.post(configService.baseUrl() + '/Marks', updatemarks)
                .then(function (response) {
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        }

        this.getExistingMarksRecordsByStudentClassAndExamID = function (classId, examId, studentId) {
            var _activepromise = $q.defer();

            Marks.findOne({ filter: { where: { and: [{ classId: classId }, { examId: examId }, { studentId: studentId }] } } },
                function (response) {
                    _activepromise.resolve(response);
                },
                function (error) {
                    _activepromise.reject(error);
                });

            return _activepromise.promise;
        };

        this.getExistingMarksRecords = function (data) {
            var _activepromise = $q.defer();
            Marks.findOne({ filter: { where: { schoolId: data.schoolId, classId: data.classId, subjectId: data.subjectId, examId: data.examId, studentId: data.studentId, marks: data.marks } } },
                function (response) {
                    _activepromise.resolve(response);
                },
                function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteMarks = function (marksId) {
            var _activepromise = $q.defer();
            Marks.deleteById({ id: marksId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
        this.getSubjectsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Subject.find({
                filter: { where: { classId: classId, examFlag: true } }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getExamsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Exam.find({
                filter: { where: { classId: classId } }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getStudentsByClassId = function (classId) {
            var _activepromise = $q.defer();
            // Class.find({
            //     filter: {
            //         where: { classId: classId }, include: [{
            //             relation: 'students', scope: {
            //                 include: [{
            //                     relation: 'marks', scope: {
            //                         include: [{
            //                             relation: 'exam', scope:
            //                             {
            //                                 include:
            //                                 [
            //                                     {
            //                                         relation: 'maxMarks'
            //                                     }
            //                                 ]
            //                             }
            //                         }
            //                         ]
            //                     }
            //                 }
            //                 ]
            //             }
            //         }
            //         ]
            //     }
            Student.find({
                filter: { where: { classId: classId } }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getMarksDetailsByClassId = function (classId, subjectId, examId) {
            var _activepromise = $q.defer();
            Marks.find({
                filter: { where: { classId: classId, subjectId: subjectId, examId: examId }, include: 'subject' }
            }, function (response) {
                _activepromise.resolve(response);

            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.CreateSubject = function (data) {
            var _activepromise = $q.defer();
            Marks.upsert({ id: data.id, schoolId: data.schoolId, classId: data.classId, subjectId: data.subjectId, examId: data.examId, studentId: data.studentId, marks: data.marks },
                function (response) {
                    _activepromise.resolve(response);
                },
                function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getSchoolDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            School.find({ filter: { where: { id: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
    });