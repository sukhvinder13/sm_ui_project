'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.ExamTypeService
 * @description
 * # ExamTypeService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('ExamTypeService', function (ExamType, $q, School, Class) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getSubjectListBySchoolId = function (schoolId, role, loginId) {
      var _activepromise = $q.defer();
      if (role) {
        if (role === "Student") {
          Student.find({
            filter: {
              where: { id: loginId }
            }
          },
            function (response) {
              //console.log(response[0].class.subjects);
              _activepromise.resolve(response[0].class.subjects);
            }, function (error) {
              _activepromise.reject(error);
            });
        }
        else {
          ExamType.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
            _activepromise.resolve(response);
          }, function (error) {
            _activepromise.reject(error);
          });
          return _activepromise.promise;
        }
        return _activepromise.promise;
      }
    };
    //Verify data exists or not
    this.verifyDataExistsOrNot = function (data) {
      var _activepromise = $q.defer();
      ExamType.findOne({ filter: { where: { schoolId: data.schoolId, classId: data.classId, examtypeName: data.examtypeName } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //get Staff or class List
    this.getClassAndStaffList = function (schoolId) {
      var _activepromise = $q.defer();
      School.findOne({ filter: { where: { id: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Create New Subject
    this.CreateSubject = function (data) {
      var _activepromise = $q.defer();
      ExamType.create({ schoolId: data.schoolId, examtypeName: data.examtypeName, assesments: data.assesments }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    //Delete Subject
    this.deleteSubject = function (subjectId) {
      var _activepromise = $q.defer();
      ExamType.deleteById({ id: subjectId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
    };
    //Update Subject
    this.updateSubject = function (data) {
      var _activepromise = $q.defer();
      ExamType.upsert({ id: data.id, examtypeName: data.examtypeName, assesments: data.assesments }, function (response) {
        _activepromise.resolve(response);
      }, function (response) {
        _activepromise.reject(response);
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
    //clas id
    //this.getClassRecordsByClassId = funtion (){
    // this.getClassRecordsByClassId = function (classId) {
    //     //console.log("hello"+classId);
    //      var _activepromise = $q.defer();
    //             Subject.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
    //                 //console.log("resp"+ JSON.stringify(response));
    //                 _activepromise.resolve(response);
    //             }, function (error) {
    //                 _activepromise.reject(error);
    //             });
    //             return _activepromise.promise;
    // };
    this.getClassRecordsByClassId = function (classId) {
      //console.log("hello"+classId);
      var _activepromise = $q.defer();
      ExamType.find({ filter: { where: { classId: classId } } }, function (response) {
        //console.log("resp"+ JSON.stringify(response));
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
  });
