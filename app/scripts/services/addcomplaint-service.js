'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.addcomplaintService
 * @description
 * # addcomplaintService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('addcomplaintService', function (Complaint, $q, Student, Class, Admin, Staff) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getExistingCompleintRecords = function (data) {
      var _activepromise = $q.defer();
      Complaint.findOne({
          filter: {
            where: {
              schoolId: data.schoolId,
              name: data.name,
              classId: data.classId,
              fathername: data.fathername,
              description: data.description,
              cnumber: data.cnumber,
              prevschool: data.prevschool
            }
          }
        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Admin") {
          Class.find({
            filter: {
              where: {
                schoolId: schoolId
              }, order: 'sequenceNumber ASC'
            }
          }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
          return _activepromise.promise;
        } else if (role === "Staff") {
          Class.find({
            filter: {
              where: {
                schoolId: schoolId,
                staffId: loginId
              }, order: 'sequenceNumber ASC'
            }
          }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        } else if (role === "Student") {
          Student.find({
            filter: {
              where: {
                id: loginId
              }
            }
          }, function (res) {
            Class.find({
              filter: {
                where: {
                  id: res[0].classId
                }, order: 'sequenceNumber ASC'
              }
            }, function (response) {
              _activepromise.resolve(response);
            });
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        return _activepromise.promise;
      }

    };
    this.getComplaintDetailsBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Admin") {
          Complaint.find({
              filter: {
                where: {
                  schoolId: schoolId
                },
                include: ['student', 'class','staff']
              }
            },
            function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        } else if (role === "Staff") {
          Complaint.find({
              filter: {
                where: {
                  schoolId: schoolId,
                  loginId: loginId
                },
                include: ['class','staff']
              }
            },
            function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        } else if (role === "Student") {
          Complaint.find({
              filter: {
                where: {
                  schoolId: schoolId,
                  loginId: loginId
                },
                include: ['student', 'class']
              }
            },
            function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        } else if (role === "Accountant") {
          Complaint.find({
              filter: {
                where: {
                  schoolId: schoolId
                },
                include: ['student', 'class']
              }
            },
            function (response) {
              _activepromise.resolve(response);
            },
            function (error) {
              _activepromise.reject(error);
            });
        }
        return _activepromise.promise;
      }
    };
    // this.getComplaintDetailsBySchoolId = function (schoolId) {
    //   var _activepromise = $q.defer();
    //   Complaint.find({
    //     filter: {
    //       where: {
    //         schoolId: schoolId
    //       }
    //     }
    //   }, function (response) {
    //     _activepromise.resolve(response);
    //   }, function (error) {
    //     _activepromise.reject(error);
    //   });
    //   return _activepromise.promise;
    // };
    this.CreateOrUpdatevisitor = function (data) {
      var _activepromise = $q.defer();
      Complaint.create({
          schoolId: data.schoolId,
          name: data.name,
          classId: data.classId,
          fathername: data.fathername,
          description: data.description,
          cnumber: data.cnumber,
          prevschool: data.prevschool,
          updatedDate: data.updatedDate,
          status: data.status
        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;

    };
    this.deleteComplaint = function (complaintId) {
      var _activepromise = $q.defer();
      Complaint.deleteById({
        id: complaintId
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.editcompleintlist = function (data) {
      var _activepromise = $q.defer();
      Complaint.upsert({
          id: data.id,
          name: data.name,
          classId: data.classId,
          fathername: data.fathername,
          description: data.description,
          cnumber: data.cnumber,
          prevschool: data.prevschool,
          updatedDate: data.updatedDate,
          status: data.status
        },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getStudentData = function (classId, loginId, role) {
      if (role) {
        if (role === "Student") {
          var _activepromise = $q.defer();
          Student.find({
            filter: {
              where: {
                classId: classId,
                id: loginId
              },
              include: ['class']
            }
          }, function (result) {
            _activepromise.resolve(result);
          }, function (error) {
            _activepromise.reject(error);
          })

        } else if (role === "Admin") {
          var _activepromise = $q.defer();
          Student.find({
            filter: {
              where: {
                classId: classId
              }
            }
          }, function (result) {
            _activepromise.resolve(result);
          }, function (error) {
            _activepromise.reject(error);
          })

        } else if (role === "Staff") {
           var _activepromise = $q.defer();
          Staff.find({
            filter: {
              where: {
                id: loginId,
                // classId: classId
              }
            }
          }, function (result) {
            _activepromise.resolve(result);
          }, function (error) {
            _activepromise.reject(error);
          })
        }
        return _activepromise.promise;
        
      }
    }
  });
