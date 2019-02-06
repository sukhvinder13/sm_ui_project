'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.schooldirectoryService
 * @description
 * # schooldirectoryService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('schooldirectoryService', function (Student, $q, Staff, StudentParent, Class,Accountant, FOsubject) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getStudentsList = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      Student.find({
        filter: {
          where: {
            schoolId: schoolId
          },
          include: 'class'
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Get List of Staff
    this.getStaffList = function (schoolId) {
      var _activepromise = $q.defer();
      Staff.find({
        filter: {
          where: {
            schoolId: schoolId
          }
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getaccountantlist = function (schoolId) {
      var _activepromise = $q.defer();
      Accountant.find({
        filter: {
          where: {
            schoolId: schoolId
          }
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Get Parent List
    this.getParentsListBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      StudentParent.find({
        filter: {
          where: {
            schoolId: schoolId
          },
          include: 'parent'
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Get Parent List by Student
    this.getParentsListByStudent = function (studentId) {
      var _activepromise = $q.defer();
      StudentParent.find({
        filter: {
          where: {
            studentId: studentId
          },
          include: 'parent'
        }
      }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {

        if (role === "Staff") {
          FOsubject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: 'class' } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        else if (role === "Student") {
          Student.find({ filter: { where: { id: loginId } } }, function (res) {
            FOsubject.find({ filter: { where: { classId: res[0].classId }, include: 'class' } }, function (response) {
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
        return _activepromise.promise;
      }
    };
    this.getStudentsListByLoginId = function (schoolId, loginId) {
      var _activepromise = $q.defer();
      Student.find({ filter: { where: { schoolId: schoolId, id: loginId }, include: 'class' } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.deleteStudent = function (data) {
      var _activepromise = $q.defer();
      Student.deleteById({ id: data }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    this.deleteStaff = function (data) {
      var _activepromise = $q.defer();
      Staff.deleteById({ id: data.id }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    this.deleteAccountant = function (data) {
     
      var _activepromise = $q.defer();
      Accountant.deleteById({ id: data.id }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    this.getClassRecordsByClassId = function (classId) {
      var _activepromise = $q.defer();
      Student.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
  });