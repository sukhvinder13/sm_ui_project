'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.FoMarksService
 * @description
 * # FoMarksService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('FoMarksService', function ($q, FOmarks, Class, FOsubject, FOexam, configService, Student, School, $http, Subject) {

    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getMarksDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      FOmarks.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getClassesDetailsBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Staff") {
          School.find({ filter: { where: { id: schoolId } } }, function (res) {
            if (res[0].marksFormat == "FO") {
              FOsubject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: ['class', 'staff'] } }, function (response) {
                _activepromise.resolve(response);
              });
            } else if (res[0].marksFormat !== "FO") {
              Subject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: ['class', 'staff'] } }, function (response) {
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
    this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Admin") {
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
        } else if (role === "Accountant") {
          Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        return _activepromise.promise;
      }
    };
    this.getSubjectDetailsByClassId = function (classId) {
      var _activepromise = $q.defer();
      FOsubject.find({ filter: { where: { classId: classId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    // get subjects
    this.getSubjectDetailsByexamId = function (examId) {
      var _activepromise = $q.defer();
      FOexam.findOne({ filter: { where: { id: examId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    // get subjects
    this.getStudentSubjectDetailsByStudentId = function (loginId) {
      var _activepromise = $q.defer();
      FOmarks.find({ filter: { where: { studentId: loginId }, include: ['Fosubject', 'Foexam'] } }, function (response) {
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
      FOmarks.find({ filter: { where: { studentId: loginId, examId: examId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.getSubjectMarksByClassId = function (classId, schoolId) {
      var _activepromise = $q.defer();
      FOexam.find({ filter: { where: { classId: classId, schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.getSubjectNameBySubjectId = function (subjectId) {
      var _activepromise = $q.defer();
      FOsubject.find({ filter: { where: { id: subjectId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.getExamDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      FOexam.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.CreateOrUpdateMarks = function (sample) {
      var _activepromise = $q.defer();
      FOmarks.create(sample,
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.UpdateMarks = function (updatemarks) {
      // alert("update");
      var _activepromise = $q.defer();
      $http.put(configService.baseUrl() + '/FOmarks/' + updatemarks.id, updatemarks)
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
      $http.post(configService.baseUrl() + '/FOmarks', updatemarks)
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

      FOmarks.findOne({ filter: { where: { and: [{ classId: classId }, { examId: examId }, { studentId: studentId }] } } },
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
      FOmarks.findOne({ filter: { where: { schoolId: data.schoolId, classId: data.classId, subjectId: data.subjectId, examId: data.examId, studentId: data.studentId, marks: data.marks } } },
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
      FOmarks.deleteById({ id: marksId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); });
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
      FOexam.find({
        filter: { where: { classId: classId } }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    // this.getStudentsByClassId = function (classId) {
    //   var _activepromise = $q.defer();

    //   Student.find({
    //     filter: { where: { classId: classId } }
    //   }, function (response) {
    //     _activepromise.resolve(response);
    //   }, function (error) {
    //     _activepromise.reject(error);
    //   });
    //   return _activepromise.promise;
    // };
    this.getStudentsByClassId = function (classId, schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Student") {
          Student.find({ filter: { where: { id: loginId, classId: classId, schoolId: schoolId } } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        } else {
          Student.find({ filter: { where: { classId: classId, schoolId: schoolId } } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        return _activepromise.promise;
      }
    };
    this.getMarksDetailsByClassId = function (classId, subjectId, examId) {
      FOmarks.find({
        filter: { where: { classId: classId, subjectId: subjectId, examId: examId }, include: 'Fosubject' }
      }, function (response) {
        _activepromise.resolve(response);

      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.CreateSubject = function (data) {
      var _activepromise = $q.defer();
      FOmarks.upsert({ id: data.id, schoolId: data.schoolId, classId: data.classId, subjectId: data.subjectId, examId: data.examId, studentId: data.studentId, marks: data.marks },
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

    this.getAllMarksOfExistingStudents = function () {
      var _activepromise = $q.defer();
      $http.get(configService.baseUrl() + '/FOmarks')
        .then(function (response) {
          if (response) {
            _activepromise.resolve(response);
          }
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    }
  });
