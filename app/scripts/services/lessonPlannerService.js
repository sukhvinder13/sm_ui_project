'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.lessonPlannerService
 * @description
 * # lessonPlannerService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('lessonPlannerService', function ($q, Subject, School, Class, Student, Staff, LessonPlanner, FOsubject) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getSubjectListBySchoolId = function (schoolId, role, loginId) {
            // var lessonPlannerService = this;
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Student") {
                    Student.find({
                        filter: {
                            where: { id: loginId }, include: [
                                {
                                    relation: 'class', scope: {
                                        include: [
                                            {
                                                relation: 'subjects',
                                                scope: {
                                                    include: [
                                                        {
                                                            relation: 'staff'
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                relation: 'staff'
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                        function (response) {
                            _activepromise.resolve(response[0].class.subjects);
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                }
                else {
                    Subject.find({ filter: { where: { schoolId: schoolId }, include: ['staff', 'class'] } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                    return _activepromise.promise;
                }
                return _activepromise.promise;
            }
        };
        //URL
        this.getMediaBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            LessonPlanner.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //Verify data exists or not
        this.verifyDataExistsOrNot = function (data) {
            var _activepromise = $q.defer();
            LessonPlanner.findOne({ filter: {} }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.CreateChapter = function (data) {

            var _activepromise = $q.defer();
            LessonPlanner.create(data, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        //Delete Subject
        this.deleteSubject = function (subjectId) {
            var _activepromise = $q.defer();
            LessonPlanner.deleteById({ id: subjectId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        //Update Subject
        this.editNotice = function (data) {
            var _activepromise = $q.defer();
            Subject.upsert({ id: data.id, chapterName: data.chapterName, NoOfClassesRequired: data.NoOfClassesRequired, ScheduleVirtualClassRoom: data.ScheduleVirtualClassRoom, TopicNo: data.TopicNo, PlannedClassToStartDate: data.PlannedClassToStartDate, TopicName: data.TopicName, PlannedClassToEndDate: data.PlannedClassToEndDate }, function (response) {
                _activepromise.resolve(response);
            }, function (response) {
                _activepromise.reject(response);
            });
            return _activepromise.promise;
        };
        this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                    return _activepromise.promise;
                }
                else if (role === "Staff") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                } else if (role === "Student") {
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
        this.getSubjectsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Subject.find({
                filter: { where: { classId: classId } }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getSubjectDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Subject.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getChapterByCandSId = function (schoolId, showsubjectId, showClassId) {
            var _activepromise = $q.defer();
            LessonPlanner.find({ filter: { where: { schoolId: schoolId, subjectId: showsubjectId, classId: showClassId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });

            return _activepromise.promise;
        };
        this.getTeacherByStaffId = function (subjectId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Subject.find({
                        filter: { where: { id: subjectId }, include: ['staff'] }
                    }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Subject.find({
                        filter: { where: { id: subjectId, examFlag: true, staffId: loginId } }
                    }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getSubjectListByClassId = function (classId) {
            var _activepromise = $q.defer();
            Subject.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getShowDataBySchoolId = function (schoolId, classId) {
            var _activepromise = $q.defer();
            LessonPlanner.find({ filter: { where: { schoolId: schoolId, classId: classId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;

        }
        this.updatingRemaing = function (data) {

            var _activepromise = $q.defer();
            LessonPlanner.prototype$patchAttributes({ id: data.id, schoolId: data.schoolId, classId: data.classId, chapterNo: data.chapterNo, chapterName: data.chapterName, noOfClasses: data.noOfClasses }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;

        }



    });
