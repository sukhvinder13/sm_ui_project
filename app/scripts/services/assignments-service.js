'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.assignmentsService
 * @description
 * # assignmentsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('assignmentsService', function ($q, Assignment, Class, Subject, Student, FOsubject, School) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getAssignmentDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Assignment.find({ filter: { where: { schoolId: schoolId }, include: ['class', 'subject'] } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Class.find({ filter: { where: { staffId: loginId } } }, function (res) {
                        Assignment.find({ filter: { where: { schoolId: schoolId, classId: res[0].id }, include: ['class', 'subject'] } }, function (response) {
                            _activepromise.resolve(response);
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                    })
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { id: loginId } } }, function (res) {
                        Assignment.find({ filter: { where: { classId: res[0].classId }, include: ['class', 'subject'] } }, function (response) {
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
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
                } else if (role === "Accountant") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
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
                        Class.find({ filter: { where: { id: res[0].classId }, order: 'sequenceNumber ASC' } }, function (response) {
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getClassesDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Staff") {
                    School.find({ filter: { where: { id: schoolId } } }, function (res) {
                        if (res[0].marksFormat == "FO") {
                            FOsubject.find({ filter: { where: { staffId: loginId }, include: 'class' } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        } else if (res[0].marksFormat !== "FO") {
                            Subject.find({ filter: { where: { staffId: loginId }, include: 'class' } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        }
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
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
        this.getExistingAssignmentRecords = function (data) {
            var _activepromise = $q.defer();
            Assignment.findOne({ filter: { where: { schoolId: data.schoolId, title: data.title, classId: data.classId, subjectId: data.subjectId, fromDate: data.fromDate, toDate: data.toDate } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.CreateOrUpdateAssignment = function (data) {
            var _activepromise = $q.defer();
            Assignment.create({ schoolId: data.schoolId, title: data.title, classId: data.classId, subjectId: data.subjectId, description: data.description, fromDate: data.fromDate, toDate: data.toDate },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.deleteAssignment = function (assignmentId) {
            var _activepromise = $q.defer();
            Assignment.deleteById({ id: assignmentId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.editAssignment = function (data) {
            var _activepromise = $q.defer();
            Assignment.upsert({ id: data.id, title: data.title, classId: data.classId, subjectId: data.subjectId, description: data.description, fromDate: data.fromDate, toDate: data.toDate },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getSubjectsByClassId = function (schoolId, classId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Subject.find({
                        filter: { where: { classId: classId } }
                    }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                } else if (role === "Staff") {
                    School.find({ filter: { where: { id: schoolId } } }, function (res) {
                        if (res[0].marksFormat == "FO") {
                            FOsubject.find({ filter: { where: { classId: classId, examFlag: true, staffId: loginId } } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        } else if (res[0].marksFormat !== "FO") {
                            Subject.find({ filter: { where: { classId: classId, examFlag: true, staffId: loginId } } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        }
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                } else if (role === "Accountant") {
                    Subject.find({
                        filter: { where: { classId: classId } }
                    }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getClassRecordsByClassId = function (classId, toDate) {
            var _activepromise = $q.defer();
            Assignment.find({ filter: { where: { classId: classId, toDate: toDate }, include: ['class', 'subject'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassRecordsByClassId1 = function (classId, toDate) {
            var _activepromise = $q.defer();
            Assignment.find({ filter: { where: { classId: classId, toDate: toDate }, include: ['class', 'subject'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        // this.getClassRecordsByClassId2 = function (classId, fromDate, toDate) {
        //     var _activepromise = $q.defer();
        //     Assignment.find({ filter: { where: { classId: classId, toDate: { between: [fromDate, toDate] } }, include: ['class', 'subject'] } }, function (response) {
        //         _activepromise.resolve(response);
        //     }, function (error) {
        //         _activepromise.reject(error);
        //     });
        //     return _activepromise.promise;
        // };
      
    });
