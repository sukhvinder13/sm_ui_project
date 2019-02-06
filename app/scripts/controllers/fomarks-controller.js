
'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:FomarksControllerCtrl
 * @description
 * # FomarksControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('FomarksController', function (FoMarksService, $cookies, FOexam, Student, Class, $timeout, School, toastr, $rootScope, FOmarks, $window, APP_MESSAGES, $scope, $filter, $http) {

    var FomarksCtrl = this;
    FomarksCtrl.subjectDetails = [];
    FomarksCtrl.headers = [];
    FomarksCtrl.representableStudentList = [];
    //Get Assignment details by School ID
    FomarksCtrl.schoolId = $cookies.getObject('uds').schoolId;
    FomarksCtrl.loginId = $cookies.getObject('uds').id;
    FomarksCtrl.classId = $cookies.getObject('uds').classId;
    FomarksCtrl.role = $cookies.get('role');
    FomarksCtrl.showTable = false;
    FomarksCtrl.showEditButton = false;

    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Marks") {
        FomarksCtrl.roleView = roleAccess[0].RolesData[i].view;
        FomarksCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        FomarksCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

    }

    School.find({ filter: { where: { id: FomarksCtrl.schoolId } } }, function (ress) {
      FomarksCtrl.schoolDetails = ress;
    })
    $rootScope.Utils = {
      keys: Object.keys
    }

    $rootScope.Utils = {
      values: Object.values
    }

    FomarksCtrl.editMode = false;
    FomarksCtrl.subjectFilter = {};

    FoMarksService.getClassesDetailsBySchoolId(FomarksCtrl.schoolId, FomarksCtrl.role, FomarksCtrl.loginId).then(function (result) {
      if (result) {
        if (Array.isArray(result)) {
          var newArray = result.filter(function (thing, index, self) {
            return self.findIndex(function (t) {
              return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
            }) === index;
          });
          FomarksCtrl.classesList = newArray;
        }
      }

    }, function (error) {
    });
    FoMarksService.getClassDetailsBySchoolId(FomarksCtrl.schoolId, FomarksCtrl.role, FomarksCtrl.loginId).then(function (result) {
      if (result) {
        FomarksCtrl.classList = result;
      }

    }, function (error) {
    });

    FomarksCtrl.printreceiptHistory = function () {
      var divToPrint = document.getElementById("printTable");
      document.getElementById('showTopDetailsContent').style.display = 'block';

      FomarksCtrl.newWin = window.open("");
      FomarksCtrl.newWin.document.write(divToPrint.outerHTML);

      setTimeout(function () {
        FomarksCtrl.newWin.print();
        FomarksCtrl.newWin.close();
        $window.location.reload();
      }, 250);
    }

    FomarksCtrl.selectExam = function () {
      FoMarksService.getSubjectDetailsByexamId(FomarksCtrl.formFields.examId).then(function (result) {
        if (result) {

          FomarksCtrl.subjectList = result.subjectList;

          _.each(FomarksCtrl.studentList, function (student) {
            student.subjects = [];
            angular.copy(FomarksCtrl.subjectList, student.subjects);
          });
        }
      }, function (error) {
      });
    }


    FomarksCtrl.getExistingMarks = function () {
      FoMarksService.getAllMarksOfExistingStudents().then(function (result) {
        FomarksCtrl.studentList.map(function (stud) {
          result.data.map(function (res) {
            if (res.studentId === stud.id) {
            //   stud.marksId = res.id;
              res.subjects.map(function (resSubject) {
                stud.subjects.map(function (studSubjects) {
                  studSubjects.assesments.map(function (studAssess) {
                    resSubject.assesments.map(function (resSubsections) {
                      // console.log("studentID==="+res.studentId+"---resSubsections----"+JSON.stringify(resSubsections));
                      if (studAssess.assesments === resSubsections.assesments &&
                        resSubsections.marks !== undefined && studSubjects.subjectName === resSubject.subjectName && resSubject.subjectId === studSubjects.subjectId && FomarksCtrl.formFields.examId === res.examId) {
                        studAssess['marks'] = angular.copy(resSubsections.marks);
                        if (resSubject['remarks'] !== undefined) studSubjects['remarks'] = angular.copy(resSubject['remarks']);
                        if (resSubject.overAllMarks !== undefined) {
                          studSubjects.overAllMarks = angular.copy(resSubject.overAllMarks);
                        }
                      }
                    })
                  })
                })
              })
            }
          })
        });
        FomarksCtrl.buildHeaders();
        FomarksCtrl.representableStudentList = [];
        FomarksCtrl.studentList.map(function (stud) {
          var obj = {}
          obj['name'] = angular.copy(stud['firstName'] + '--' + stud['lastName']);
          obj['firstName'] = angular.copy(stud['firstName']);
          obj['lastName'] = angular.copy(stud['lastName']);
          obj['rollNo'] = angular.copy(stud['rollNo']);
          stud.subjects.map(function (sub) {
            if (sub.subjectId === FomarksCtrl.subjectFilter.subjectId) {
              obj['assesments'] = angular.copy(sub.assesments);
              obj['remarks'] = angular.copy(sub.remarks);
            }
          })
          FomarksCtrl.representableStudentList.push(obj);
        })
      });
    }

    FomarksCtrl.buildHeaders = function () {
      FomarksCtrl.headers = [];
      FomarksCtrl.headers.push("Student Name");
      FomarksCtrl.headers.push("Roll Number");
      for (var i = 0; i < FomarksCtrl.studentList[0].subjects.length; i++) {
        if (FomarksCtrl.studentList[0].subjects[i].subjectId == FomarksCtrl.formFields.subjectId) {
          FomarksCtrl.studentList[0].subjects[i].assesments.map(function (item) {
            if (item.maxMarks == "") { } else {
              FomarksCtrl.headers.push(item.assesments)
            }
          })
        }
      }
      // FomarksCtrl.studentList[0].subjects[0].assesments.map(function (item) {
      //   FomarksCtrl.headers.push(item.assesments)
      // })
      FomarksCtrl.headers.push("Remarks");
    }

    FomarksCtrl.selectClass = function () {

      if (FomarksCtrl.formFields.classId) {

        FoMarksService.getExamsByClassId(FomarksCtrl.formFields.classId).then(function (result1) {
          if (result1 && result1.length > 0) {

            FoMarksService.getStudentsByClassId(FomarksCtrl.formFields.classId, FomarksCtrl.schoolId, FomarksCtrl.role, FomarksCtrl.loginId).then(function (result2) {
              if (result2) {
                FomarksCtrl.studentList = result2;
                FomarksCtrl.examList = result1;
              }
            });

          } else {
            alert('No exams found for this class')
          }
        });

      }
    };

    FomarksCtrl.saveMarks = function () {

      FomarksCtrl.representableStudentList.map(function (resList) {
        FomarksCtrl.studentList.map(function (stud) {
          if (resList.rollNo === stud.rollNo) {
            stud.subjects.map(function (sub) {
              if (sub.subjectId === FomarksCtrl.subjectFilter.subjectId) {
                sub.assesments = angular.copy(resList.assesments);
                if (resList['remarks'] !== undefined) {
                  sub['remarks'] = angular.copy(resList['remarks']);
                }
              }
            })
          }
        })
      })

      FomarksCtrl.editMode = false;

      var tempStudentDataWithMarks = [];
      angular.copy(FomarksCtrl.studentList, tempStudentDataWithMarks);

      //Formatting JSON
      var marks = [];
      var newMarks = [];

      _.each(tempStudentDataWithMarks, function (student) {
        var temp = {
          studentId: student.id,
          classId: FomarksCtrl.formFields.classId,
          examId: FomarksCtrl.formFields.examId,
          subjects: student.subjects
        };
        var isDataValid = true;
        student.subjects.map(function (subject) {
          if (FomarksCtrl.formFields.subjectId === subject.subjectId) {
            subject.assesments.map(function (assess) {
              if (FomarksCtrl.schoolDetails[0].marksFormat1) {
              } else {
                if (assess.marks === undefined || assess.marks === '' || assess.marks === null) isDataValid = false;
              }
            });
          } else {
            var alreadyData;
            alreadyData = subject.assesments;
            var dd = false;
            alreadyData.map(function (item) {
              if (FomarksCtrl.schoolDetails[0].marksFormat1) {
              } else {
                if (item.marks === undefined || item.marks === '' || item.marks === null) dd = true;
                subject.assesments.map(function (item2) {
                  if (dd) { item2.marks = '' }
                })
              }
            })
          }
        });

        if (student.marksId) {
          if (isDataValid) {
            temp.id = student.marksId;
            marks.push(temp);
          }
        } else {
          if (isDataValid)
            newMarks.push(temp);
        }
      })

      async.eachSeries(marks, function (mark, callback) {
        // alert("markkk---" + mark);
        FoMarksService.UpdateMarks(mark).then(function (result) {
          // console.log("updatemarks--" + JSON.stringify(result));
          _.each(FomarksCtrl.studentList, function (stud) {
            if (stud.id === result.data.studentId) {
              stud.marksId = result.data.id
            }
          })
          callback();
        }, function (error) {
          callback();
        });
      }, function (err) {
        var temp_newMarks = _.chunk(newMarks, 5);
        async.each(temp_newMarks, function (chunk, subCb) {
          FoMarksService.addMarks(chunk).then(function (success) {
            // console.log("chunk add marks---" + JSON.stringify(success));
            subCb();
          });
        }, function (err) {
          if (err) {
            alert(err);
          } else {
            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
          }
        })
        // FoMarksService.addMarks(newMarks);
      });
    };

    FomarksCtrl.showStudentData = function () {
      FoMarksService.getExistingMarksRecordsByStudentClassAndExamID(FomarksCtrl.formFields.classId, FomarksCtrl.formFields.examId, FomarksCtrl.formFields.studentId).then(function (result) {
        FomarksCtrl.studentMarksData = result;
      });
    }

    FomarksCtrl.getSumOfMarks = function (subject) {
      var total = 0;
      _.each(subject.subSections, function (section) {
        if (section.marks) {
          total = total + parseFloat(section.marks);
        }
      });

      return total;
    }
    FomarksCtrl.maxCheck = function (sub, e) {
      if (e == 9) {
        return false;
      } else {
        if (sub.marks <= sub.maxMarks) {
        } else {
          alert('Marks should not exceed ' + sub.maxMarks + ' Marks');
          sub.marks = 0;
        }
      }
    }
    FomarksCtrl.orderByRollNo = function (datalist) {

      var matchedPosition = datalist.rollNo.search(/[a-z]/i);
      if (matchedPosition == -1) {
        datalist.rollNo1 = Number(datalist.rollNo);
      } else {
        var b = datalist.rollNo;
        datalist.rollNo1 = b;
        return datalist.rollNo1;
      }
    }
  });