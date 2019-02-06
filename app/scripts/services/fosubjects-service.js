'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.fosubjectsService
 * @description
 * # fosubjectsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('fosubjectsService', function (FOsubject, $q, Student, Class, Subject, Staff) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getClassDetailsBySchoolId = function (classId,schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Admin") {
          FOsubject.find({ filter: { where: { schoolId: schoolId,classId:classId }, include: ['class', 'staff'] } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        else if (role === "Staff") {
          FOsubject.find({ filter: { where: { schoolId: schoolId,classId:classId}, include: ['class', 'staff'] } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        else if (role === "Student") {
          Student.find({ filter: { where: { id: loginId } } }, function (res) {
            FOsubject.find({ filter: { where: { classId: res[0].classId }, include: ['class', 'staff'] } }, function (response) {
              _activepromise.resolve(response);
            });
          }, function (error) {
            _activepromise.reject(error);
          });
        } else {
          FOsubject.find({ filter: { where: { schoolId: schoolId,classId:classId }, include: ['class', 'staff'] } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
        }
        return _activepromise.promise;
      }
    };
    this.getClassRecordsByClassId = function (classId) {
      var _activepromise = $q.defer();
      FOsubject.find({ filter: { where: { classId: classId }, include: ['staff', 'class'] } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Verify data exists or not
    this.verifyDataExistsOrNot = function (data) {
      var _activepromise = $q.defer();
      FOsubject.findOne({ filter: { where: { schoolId: data.schoolId, classId: data.classId, subjectName: data.subjectName } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Create New FOsubject
    this.CreateFOsubject = function (data) {
      var _activepromise = $q.defer();
      FOsubject.create({ schoolId: data.schoolId, classId: data.classId, subjectName: data.subjectName, staffId: data.staffId, examFlag: data.examFlag }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      Subject.create({ schoolId: data.schoolId, classId: data.classId, subjectName: data.subjectName, staffId: data.staffId, examFlag: data.examFlag }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;

    };
    //Delete FOsubject
    this.deleteFOsubject = function (subjectId) {
      var _activepromise = $q.defer();
      FOsubject.deleteById({ id: subjectId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    //Update FOsubject
    this.updateFOSubject = function (data) {
      var _activepromise = $q.defer();
      FOsubject.upsert({ id: data.id, subjectName: data.subjectName, classId: data.classId, staffId: data.staffId, examFlag: data.examFlag }, function (response) {
        _activepromise.resolve(response);
      }, function (response) {
        _activepromise.reject(response);
      });
      Subject.upsert({ id: data.id, subjectName: data.subjectName, classId: data.classId, staffId: data.staffId, examFlag: data.examFlag }, function (response) {
        _activepromise.resolve(response);
      }, function (response) {
        _activepromise.reject(response);
      });
      return _activepromise.promise;
    };
  });
