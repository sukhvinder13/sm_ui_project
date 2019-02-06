'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ViewmarksControllerCtrl
 * @description
 * # ViewmarksControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('ViewmarksControllerCtrl', function (FoMarksService, $cookies, Grade, $timeout, Student, School, $scope, FOexam) {
    var MarksCtrl = this;
    MarksCtrl.schoolId = $cookies.getObject('uds').schoolId;
    MarksCtrl.loginId = $cookies.getObject('uds').id;
    MarksCtrl.classId = $cookies.getObject('uds').classId;
    MarksCtrl.role = $cookies.get('role');
    MarksCtrl.showStudentTable = false;
    MarksCtrl.shownuserytable = false;
    MarksCtrl.shownuserytableupper = false
    MarksCtrl.studentMarksData = "";
    MarksCtrl.grades = [];
    MarksCtrl.viewMarksData = [];
    MarksCtrl.marksHeader = [];
    MarksCtrl.totalsSubmarks = [];
    var sumativeAssigment = false;
    MarksCtrl.totalMarks = 0;
    School.find({ filter: { where: { id: MarksCtrl.schoolId } } }, function (response) {
      MarksCtrl.schoolLogo = response[0].logo;
    })
    Grade.find({ filter: { where: { schoolId: MarksCtrl.schoolId } } }, function (response) {
      _.forEach(response, function (r) {
        r.percentageRangeTo = r.percentageRangeTo + .99;
      })
      MarksCtrl.grades = response;
    })

    FoMarksService.getClassesDetailsBySchoolId(MarksCtrl.schoolId, MarksCtrl.role, MarksCtrl.loginId).then(function (result) {
      if (result) {
        MarksCtrl.classesList = newArray;
      }
    }, function (error) {
    });
    FoMarksService.getClassDetailsBySchoolId(MarksCtrl.schoolId, MarksCtrl.role, MarksCtrl.loginId).then(function (result) {
      if (result) {
        MarksCtrl.classList = result;
      }
    }, function (error) {
    });
    MarksCtrl.selectClass = function () {
      if (MarksCtrl.formFields.classId) {
        FoMarksService.getExamsByClassId(MarksCtrl.formFields.classId).then(function (result1) {
          if (result1 && result1.length > 0) {
            FoMarksService.getStudentsByClassId(MarksCtrl.formFields.classId, MarksCtrl.schoolId, MarksCtrl.role, MarksCtrl.loginId).then(function (result2) {
              if (result2) {
                MarksCtrl.studentList = result2;
                MarksCtrl.examList = result1;
                MarksCtrl.examList.map(function (item) {
                  if (item.examName == 'SA2') { MarksCtrl.sa2Enabled = true }
                })
              }
            });
          } else {
            alert('No exams found for this class')
          }
        });
      }
    };
    //marks sheet starts
    MarksCtrl.showStudentData = function () {
      if (MarksCtrl.formFields.template == undefined || MarksCtrl.formFields.template == "" || MarksCtrl.formFields.template == null) { return }
      if (MarksCtrl.formFields.examId == undefined || MarksCtrl.formFields.examId == "" || MarksCtrl.formFields.examId == null) { return }
      if (MarksCtrl.formFields.studentId == undefined || MarksCtrl.formFields.studentId == "" || MarksCtrl.formFields.studentId == null) { return }
      if (MarksCtrl.formFields.classId == undefined || MarksCtrl.formFields.classId == "" || MarksCtrl.formFields.classId == null) { return }
      MarksCtrl.viewMarksData = [];
      MarksCtrl.totalMarks, MarksCtrl.totalGrade
      if (MarksCtrl.formFields.template == "lower") {
        MarksCtrl.shownuserytable = false;

        FoMarksService.getAllMarksOfExistingStudents().then(function (result) {
          var tempExamName;
          MarksCtrl.listOfAllStudentsWithMarks = result;
          result.data.map(function (student) {
            if (student.classId === MarksCtrl.formFields.classId && student.examId === MarksCtrl.formFields.examId
              && student.studentId === MarksCtrl.formFields.studentId) {
              MarksCtrl.studentMarksData = student;
            }
          })
          MarksCtrl.examList.map(function (item) {
            if (item.id === MarksCtrl.formFields.examId) tempExamName = item.examName;
          })
          MarksCtrl.examName = tempExamName;
          if (tempExamName.toLowerCase().indexOf('sa') !== -1 || tempExamName.toLowerCase().indexOf('sa') !== -1) {
            sumativeAssigment = true;
          } else { sumativeAssigment = false; }
          if (sumativeAssigment) {
            var examNumber = tempExamName.slice(-1);
            var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName, sa42xamName;
            var faN1 = [], faN2 = [], faN3 = [], faN4 = [], faN1Id, faN2Id, faN3Id, faN4Id, saN2Id, faN1data = [], faN2data = [], faN3data = [], faN4data = [], sa1data = [], sa2data = [], totalData = []
            if (examNumber == '1') {
              MarksCtrl.examList.map(function (item) {
                if (item.examName.toLowerCase() === 'fa1') { faN1Id = item.id; fa1ExamName = item.examName }
                if (item.examName.toLowerCase() === 'fa2') { faN2Id = item.id; fa2ExamName = item.examName }
              })
            }
            if (examNumber == '2') {
              MarksCtrl.examList.map(function (item) {
                if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName }
                if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName }
                if (item.examName.toLowerCase() === 'sa2') { saN2Id = item.id; sa42xamName = item.examName }
              })
            }
            result.data.map(function (student) {
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN1Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN1 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN2Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN2 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN3Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN3 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN4Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN4 = student
              }
            })
            if (examNumber == '1') {
              faN1.subjects.map(function (item) {
                MarksCtrl.shownuserytableupper = false
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd * 2;
                faN1data.push({ subjectName: item.subjectName, fa1: dd })
              })
              faN2.subjects.map(function (item) {
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd * 2;
                faN2data.push({ subjectName: item.subjectName, fa2: dd })
              })
              MarksCtrl.studentMarksData.subjects.map(function (item) {
                item.assesments.map(function (item1) {
                  item1.marks
                  sa1data.push({ subjectName: item.subjectName, sa1Ext: item1.marks });
                })
              })
              MarksCtrl.totalMarks = 0;
              var faNT1 = 0, faNT2 = 0, faNT3 = 0, faNT4 = 0, saNT1 = 0, saNT2 = 0
              sa1data.map(function (push) {
                faN1data.map(function (item1) {
                  faN2data.map(function (item2) {
                    if (push.subjectName == item1.subjectName && push.subjectName == item2.subjectName) {
                      var total = 0;
                      // total += push.sa1Ext + item1.fa1 + item2.fa2;
                      faNT1 += item1.fa1
                      faNT2 += item2.fa2
                      saNT1 += push.sa1Ext
                      MarksCtrl.totalsSubmarks = [{ subMarks: faNT1 }, { subMarks: faNT2 }, { subMarks: saNT1 }]
                      MarksCtrl.totalMarks += total;
                      var data = []
                      data.push({ submarks: item1.fa1 });
                      data.push({ submarks: item2.fa2 });
                      data.push({ submarks: push.sa1Ext });
                      MarksCtrl.viewMarksData.push({ subjectName: push.subjectName, assigments: data, flag: true })
                    }
                  })
                })
              })
              MarksCtrl.getGradelower(MarksCtrl.viewMarksData, 1);
              MarksCtrl.buildHeadersSamativelower();
            }
            if (examNumber == '2') {
              faN3.subjects.map(function (item) {
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd / 2;
                faN3data.push({ subjectName: item.subjectName, fa3: dd })
              })
              faN4.subjects.map(function (item) {
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd / 2;
                faN4data.push({ subjectName: item.subjectName, fa4: dd })
              })
              MarksCtrl.studentMarksData.subjects.map(function (item) {
                item.assesments.map(function (item1) {
                  item1.marks
                  sa2data.push({ subjectName: item.subjectName, sa2Ext: item1.marks });
                })
              })
              MarksCtrl.totalMarks = 0;
              var faNT1 = 0, faNT2 = 0, faNT3 = 0, faNT4 = 0, saNT1 = 0, saNT2 = 0
              sa2data.map(function (item) {
                faN3data.map(function (fa3item) {
                  faN4data.map(function (fa4item) {
                    if (item.subjectName == fa3item.subjectName && item.subjectName == fa4item.subjectName) {
                      var total = 0;
                      total += item.sa2Ext + fa3item.fa3 + fa4item.fa4;
                      faNT3 += fa3item.fa3
                      faNT4 += fa4item.fa4
                      saNT2 += item.sa2Ext
                      MarksCtrl.totalsSubmarks = [{ subMarks: faNT3 }, { subMarks: faNT4 }, { subMarks: saNT2 }]
                      MarksCtrl.totalMarks += total;
                      var data = []
                      data.push({ submarks: (fa3item.fa3 / 10) * 100 });
                      data.push({ submarks: (fa4item.fa4 / 10) * 100 });
                      data.push({ submarks: (item.sa2Ext / 80) * 100 });
                      MarksCtrl.viewMarksData.push({ subjectName: item.subjectName, assigments: data, total: total, flag: true })
                    }
                  })
                })
              })
              MarksCtrl.getGrade(MarksCtrl.viewMarksData, 1);
              MarksCtrl.buildHeadersSamativelower();
            }


          } else {
            MarksCtrl.shownuserytableupper = true
            MarksCtrl.totalMarks = 0;
            MarksCtrl.buildHeadersFormativeLower();
            var subjectCount = 0;
            MarksCtrl.studentMarksData.subjects.map(function (sub) {
              subjectCount++
              var data = {};
              data.subjectName = sub.subjectName;
              data.assigments = [];
              data.total = 0;
              data.flag = false;
              var count = 0;
              data.maxtotal = 0;
              data.presTotal = false
              var dd = _.uniqBy(MarksCtrl.showTableDD, 'assig');
              sub.assesments.map(function (marks) {
                dd.map(function (item) {
                  if (item.assig == count) data.assigments.push({ submarks: marks.marks });
                });
                count++
                if (marks.marks) {
                  data.presTotal = true;
                  data.total += marks.marks;
                  MarksCtrl.totalMarks += marks.marks;
                  data.maxtotal += Number(marks.maxMarks);
                  data.flag = true;
                }
                if (marks.marks == 0) { data.presTotal = true }
              })
              MarksCtrl.viewMarksData.push(data);
            })
          }
          MarksCtrl.getGradeIndividual(MarksCtrl.viewMarksData, subjectCount);
          console.log(MarksCtrl.viewMarksData)
          MarksCtrl.showStudentTable = true;
        })
        //end of lower
      } else if (MarksCtrl.formFields.template == "upper") {
        MarksCtrl.shownuserytable = false;
        MarksCtrl.shownuserytableupper = true;
        FoMarksService.getAllMarksOfExistingStudents().then(function (result) {
          var tempExamName;
          MarksCtrl.listOfAllStudentsWithMarks = result;
          result.data.map(function (student) {
            if (student.classId === MarksCtrl.formFields.classId && student.examId === MarksCtrl.formFields.examId
              && student.studentId === MarksCtrl.formFields.studentId) {
              MarksCtrl.studentMarksData = student;
            }
          })
          MarksCtrl.examList.map(function (item) {
            if (item.id === MarksCtrl.formFields.examId) tempExamName = item.examName;
          })
          MarksCtrl.examName = tempExamName;
          if (tempExamName.toLowerCase().indexOf('sa') !== -1 || tempExamName.toLowerCase().indexOf('sa') !== -1) {
            sumativeAssigment = true;
          } else { sumativeAssigment = false; }
          if (sumativeAssigment) {
            var examNumber = tempExamName.slice(-1);
            var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName, sa42xamName;
            var faN1 = [], faN2 = [], faN3 = [], faN4 = [], faN1Id, faN2Id, faN3Id, faN4Id, saN2Id, faN1data = [], faN2data = [], faN3data = [], faN4data = [], sa1data = [], sa2data = [], totalData = []
            if (examNumber == '1') {
              MarksCtrl.examList.map(function (item) {
                if (item.examName.toLowerCase() === 'fa1') { faN1Id = item.id; fa1ExamName = item.examName }
                if (item.examName.toLowerCase() === 'fa2') { faN2Id = item.id; fa2ExamName = item.examName }
              })
            }
            if (examNumber == '2') {
              MarksCtrl.examList.map(function (item) {
                if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName }
                if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName }
                if (item.examName.toLowerCase() === 'sa2') { saN2Id = item.id; sa42xamName = item.examName }
              })
            }
            result.data.map(function (student) {
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN1Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN1 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN2Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN2 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN3Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN3 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == faN4Id && student.studentId == MarksCtrl.formFields.studentId) {
                faN4 = student
              }
            })
            if (examNumber == '1') {
              faN1.subjects.map(function (item) {
                var dd = 0;
                var dd1 = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                  if (data.maxMarks) dd1 += data.maxMarks;
                })
                dd = dd / 2;
                faN1data.push({ subjectName: item.subjectName, fa1: dd })
              })
              faN2.subjects.map(function (item) {
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd / 2;
                faN2data.push({ subjectName: item.subjectName, fa2: dd })
              })
              MarksCtrl.studentMarksData.subjects.map(function (item) {
                item.assesments.map(function (item1) {
                  item1.marks
                  sa1data.push({ subjectName: item.subjectName, sa1Ext: item1.marks });
                })
              })
              MarksCtrl.totalMarks = 0;
              var faNT1 = 0, faNT2 = 0, faNT3 = 0, faNT4 = 0, saNT1 = 0, saNT2 = 0, maxtotal = 0, maxtotl = 0;
              sa1data.map(function (push) {
                faN1data.map(function (item1) {
                  faN2data.map(function (item2) {
                    if (push.subjectName == item1.subjectName && push.subjectName == item2.subjectName) {
                      var total = 0;
                      total += push.sa1Ext + item1.fa1 + item2.fa2;
                      faNT1 += item1.fa1
                      faNT2 += item2.fa2
                      saNT1 += push.sa1Ext
                      MarksCtrl.totalsSubmarks = [{ subMarks: faNT1 }, { subMarks: faNT2 }, { subMarks: saNT1 }]
                      MarksCtrl.totalMarks += total;
                      var data = []
                      data.push({ submarks: item1.fa1 });
                      data.push({ submarks: item2.fa2 });
                      data.push({ submarks: push.sa1Ext });
                      MarksCtrl.viewMarksData.push({ subjectName: push.subjectName, assigments: data, total: total, flag: true })

                    }
                  })
                })
              })
              MarksCtrl.getGradeupper(MarksCtrl.viewMarksData, 1);
              MarksCtrl.buildHeadersSamative();
            }
            if (examNumber == '2') {
              faN3.subjects.map(function (item) {
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd / 2;
                faN3data.push({ subjectName: item.subjectName, fa3: dd })
              })
              faN4.subjects.map(function (item) {
                var dd = 0;
                item.assesments.map(function (data) {
                  if (data.marks) dd += data.marks;
                })
                dd = dd / 2;
                faN4data.push({ subjectName: item.subjectName, fa4: dd })
              })
              MarksCtrl.studentMarksData.subjects.map(function (item) {
                item.assesments.map(function (item1) {
                  item1.marks
                  sa2data.push({ subjectName: item.subjectName, sa2Ext: item1.marks });
                })
              })
              MarksCtrl.totalMarks = 0;
              var faNT1 = 0, faNT2 = 0, faNT3 = 0, faNT4 = 0, saNT1 = 0, saNT2 = 0
              sa2data.map(function (item) {
                faN3data.map(function (fa3item) {
                  faN4data.map(function (fa4item) {
                    if (item.subjectName == fa3item.subjectName && item.subjectName == fa4item.subjectName) {
                      var total = 0;
                      total += item.sa2Ext + fa3item.fa3 + fa4item.fa4;
                      faNT3 += fa3item.fa3
                      faNT4 += fa4item.fa4
                      saNT2 += item.sa2Ext
                      MarksCtrl.totalsSubmarks = [{ subMarks: faNT3 }, { subMarks: faNT4 }, { subMarks: saNT2 }]
                      MarksCtrl.totalMarks += total;
                      var data = []
                      data.push({ submarks: fa3item.fa3 });
                      data.push({ submarks: fa4item.fa4 });
                      data.push({ submarks: item.sa2Ext });
                      MarksCtrl.viewMarksData.push({ subjectName: item.subjectName, assigments: data, total: total, flag: true })

                    }
                  })
                })
              })
              MarksCtrl.getGrade(MarksCtrl.viewMarksData, 1);
              MarksCtrl.buildHeadersSamative();
            }
          } else {
            MarksCtrl.totalMarks = 0;
            MarksCtrl.buildHeadersFormative();
            var subjectCount = 0;
            MarksCtrl.studentMarksData.subjects.map(function (sub) {
              subjectCount++
              var data = {};
              data.subjectName = sub.subjectName;
              data.assigments = [];
              data.total = 0;
              data.maxtotal = 0;
              data.flag = false;
              var count = 0;
              var dd = _.uniqBy(MarksCtrl.showTableDD, 'assig');
              sub.assesments.map(function (marks) {
                dd.map(function (item) {
                  if (item.assig == count) data.assigments.push({ submarks: marks.marks, forGrade: (marks.marks / marks.maxMarks) * 100 });
                });
                if (marks.marks) {
                  data.total += marks.marks;
                  data.maxtotal += Number(marks.maxMarks);
                  MarksCtrl.totalMarks += marks.marks;
                  data.flag = true;
                }
                if (marks.marks == 0) {
                  data.flag = true;
                }
                count++;
              })
              MarksCtrl.viewMarksData.push(data);
            })
            MarksCtrl.getGrade(MarksCtrl.viewMarksData, subjectCount);
          }
          MarksCtrl.showStudentTable = true;
        })
      }
      //nursery marks for goutham school
      else if (MarksCtrl.formFields.template == "below") {
        MarksCtrl.shownuserytable = true;
        FoMarksService.getAllMarksOfExistingStudents().then(function (result) {
          var tempExamName;
          MarksCtrl.listOfAllStudentsWithMarks = result;
          result.data.map(function (student) {
            if (student.classId === MarksCtrl.formFields.classId && student.examId === MarksCtrl.formFields.examId
              && student.studentId === MarksCtrl.formFields.studentId) {
              MarksCtrl.studentMarksData = student;
            }
          })
          MarksCtrl.examList.map(function (item) {
            if (item.id === MarksCtrl.formFields.examId) tempExamName = item.examName;
          })
          MarksCtrl.examName = tempExamName;
          if (tempExamName.toLowerCase().indexOf('sa') !== -1 || tempExamName.toLowerCase().indexOf('sa') !== -1) {
            sumativeAssigment = true;
          } else { sumativeAssigment = false; }
          if (sumativeAssigment) {
            var examNumber = tempExamName.slice(-1);
            var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName, sa41xamName, sa42xamName;
            var faN1 = [], faN2 = [], faN3 = [], faN4 = [], san1 = [], san2 = [], faN1Id, saN1Id, faN2Id, faN3Id, faN4Id, saN2Id, faN1data = [], faN2data = [], faN3data = [], faN4data = [], sa1data = [], sa2data = [], totalData = []
            if (examNumber == '1') {
              MarksCtrl.examList.map(function (item) {
                if (item.examName.toLowerCase() === 'fa1') { faN1Id = item.id; fa1ExamName = item.examName }
                if (item.examName.toLowerCase() === 'fa2') { faN2Id = item.id; fa2ExamName = item.examName }
                if (item.examName.toLowerCase() === 'sa1') {
                  saN1Id = item.id; sa41xamName = item.examName
                }

              })
            }
            if (examNumber == '2') {
              MarksCtrl.examList.map(function (item) {
                if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName }
                if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName }
                if (item.examName.toLowerCase() === 'sa2') {
                  saN2Id = item.id; sa42xamName = item.examName
                }
              })
            }
            result.data.map(function (student) {
              if (student.classId == MarksCtrl.formFields.classId && student.examId == saN1Id && student.studentId == MarksCtrl.formFields.studentId) {
                san1 = student
              }
              if (student.classId == MarksCtrl.formFields.classId && student.examId == saN2Id && student.studentId == MarksCtrl.formFields.studentId) {
                san2 = student
              }
            })



            MarksCtrl.showStudentTable = true;
            // MarksCtrl.buildHeadersFormativeLowernursery();

          } else {
            MarksCtrl.totalMarks = 0;
            MarksCtrl.shownuserytable = true;

            // MarksCtrl.buildHeadersFormativeLowernursery();
            var subjectCount = 0;
            MarksCtrl.studentMarksData.subjects.map(function (sub) {
              subjectCount++
              var data = {};
              data.subjectName = sub.subjectName;
              data.assigments = [];
              data.total = 0;
              data.flag = false;
              var count = 0;
              data.maxtotal = 0;
              data.presTotal = false
              var dd = _.uniqBy(MarksCtrl.showTableDD, 'assig');
              sub.assesments.map(function (marks) {
                dd.map(function (item) {
                  if (item.assig == count) data.assigments.push({ submarks: marks.marks, submax: marks.maxMarks });
                });
                count++
                if (marks.marks) {
                  data.presTotal = true;
                  data.total += marks.marks;
                  MarksCtrl.totalMarks += marks.marks;
                  data.maxtotal += Number(marks.maxMarks);
                  data.flag = true;
                }
                if (marks.marks == 0) { data.presTotal = true }
              })
              MarksCtrl.viewMarksData.push(data);
            })
          }
          MarksCtrl.getGradeIndividualur1(MarksCtrl.viewMarksData, subjectCount);
          MarksCtrl.showStudentTable = true;
          MarksCtrl.buildHeadersFormativeLowernursery();



        })
      }
    }

    //marks sheet end
    MarksCtrl.selectTemp = function () {
      if (MarksCtrl.formFields.examId) {
        FOexam.find({ filter: { where: { id: MarksCtrl.formFields.examId } } }, function (response) {
          MarksCtrl.examSetUpData = response;
          MarksCtrl.showTableDD = [];
          for (var i = 0; i < MarksCtrl.examSetUpData[0].subjectList.length; i++) {
            for (var j = 0; j < MarksCtrl.examSetUpData[0].subjectList[i].assesments.length; j++) {
              if (MarksCtrl.examSetUpData[0].subjectList[i].assesments[j].maxMarks !== "") {
                MarksCtrl.showTableDD.push({ "assig": j });
              }
            }
          }


          MarksCtrl.tempExamName = response[0].examName;
          MarksCtrl.marksTmp = response[0].tempFile;
          if (MarksCtrl.tempExamName == "SA1") {
            MarksCtrl.tempMarks = "Summative Assessment - 1"
          } else if (MarksCtrl.tempExamName == "FA1") {
            MarksCtrl.tempMarks = "Formative Assessment - 1"
            MarksCtrl.tempMarks1 = "Summative Assessment - 1"

          } else if (MarksCtrl.tempExamName == "FA2") {
            MarksCtrl.tempMarks = "Formative Assessment - 2"
            MarksCtrl.tempMarks1 = "Summative Assessment - 2"

          }
          else if (MarksCtrl.tempExamName == "FA3") {
            MarksCtrl.tempMarks = "Formative Assessment - 3"
          }
          else if (MarksCtrl.tempExamName == "FA4") {
            MarksCtrl.tempMarks = "Formative Assessment - 4"
          }
          else if (MarksCtrl.tempExamName == "SA2") {
            MarksCtrl.tempMarks = "Summative Assessment - 2"
          }
        })
      }
    }
    // headers starts
    MarksCtrl.buildHeadersFormative = function () {
      var data = [];
      var data1 = [];
      MarksCtrl.marksHeader = [];
      var count = 0;
      var dd = _.uniqBy(MarksCtrl.showTableDD, 'assig');
      MarksCtrl.marksHeader.push("subject name")
      MarksCtrl.studentMarksData.subjects[0].assesments.map(function (head) {
        dd.map(function (item) {
          if (item.assig == count) MarksCtrl.marksHeader.push(head.assesments.toLowerCase());
        })
        count++;
      })
      MarksCtrl.marksHeader.push("total");
      if (MarksCtrl.formFields.template !== 'lower') {
        MarksCtrl.marksHeader.push("final grade");
      }

    }
    MarksCtrl.buildHeadersSamative = function () {
      MarksCtrl.marksHeader = [];
      if (MarksCtrl.examName.slice(-1) == '1') {
        MarksCtrl.marksHeader.push("Subject Name");
        MarksCtrl.marksHeader.push("Fa1 (10)");
        MarksCtrl.marksHeader.push("Fa2 (10)");
        MarksCtrl.marksHeader.push("Sa1 (80)");
        MarksCtrl.marksHeader.push("Total (100)");
        if (MarksCtrl.formFields.template !== 'lower') {
          MarksCtrl.marksHeader.push("Final Grade");
        }
      }
      if (MarksCtrl.examName.slice(-1) == '2') {
        MarksCtrl.marksHeader.push("Subject Name");
        MarksCtrl.marksHeader.push("Fa3 (10)");
        MarksCtrl.marksHeader.push("Fa4 (10)");
        MarksCtrl.marksHeader.push("Sa2 (80)");
        MarksCtrl.marksHeader.push("Total (100)");
        if (MarksCtrl.formFields.template !== 'lower') {
          MarksCtrl.marksHeader.push("Final Grade");
        }
      }
    }
    MarksCtrl.buildHeadersFormativeLowernursery = function () {
      var data = [];
      var data1 = [];
      MarksCtrl.marksHeader = [];
      MarksCtrl.marksHeader.push("Subject Name")
      var count = 0;
      var dd = _.uniqBy(MarksCtrl.showTableDD, 'assig');
      MarksCtrl.studentMarksData.subjects[0].assesments.map(function (head) {
        dd.map(function (item) {
          if (item.assig == count)
            MarksCtrl.marksHeader.push(head.assesments.toLowerCase());
        })
        count++
      })
      MarksCtrl.marksHeader.push("Total");
    }
    MarksCtrl.buildHeadersFormativeLower = function () {
      var data = [];
      var data1 = [];
      MarksCtrl.marksHeader = [];
      MarksCtrl.marksHeader.push("Subject Name")
      var count = 0;
      var dd = _.uniqBy(MarksCtrl.showTableDD, 'assig');
      MarksCtrl.studentMarksData.subjects[0].assesments.map(function (head) {
        dd.map(function (item) {
          if (item.assig == count)
            MarksCtrl.marksHeader.push(head.assesments.toLowerCase());
        })
        count++
      })
      MarksCtrl.marksHeader.push("Total");
      // MarksCtrl.marksHeader.push("Final Grade");
    }
    MarksCtrl.buildHeadersSamativelower = function () {
      MarksCtrl.marksHeader = [];
      if (MarksCtrl.examName.slice(-1) == '1') {
        MarksCtrl.marksHeader.push("Subject Name");
        MarksCtrl.marksHeader.push("Fa1");
        MarksCtrl.marksHeader.push("Fa2");
        MarksCtrl.marksHeader.push("Sa1");
        // MarksCtrl.marksHeader.push("Total");
      } else if (MarksCtrl.examName.slice(-1) == '2') {
        MarksCtrl.marksHeader.push("Subject Name");
        MarksCtrl.marksHeader.push("Fa3");
        MarksCtrl.marksHeader.push("Fa4");
        MarksCtrl.marksHeader.push("Sa2");
        MarksCtrl.marksHeader.push("Total");
      }
    }
    //headers ends

    // grade starts
    MarksCtrl.getGrade = function (data, a) {

      var gradeTotal = 0;
      _.forEach(data, function (res) {
        if (res.maxtotal === 0) { res.gradeMarks = 0 } else {
          res.gradeMarks = (res.total / res.maxtotal) * 100;
        }
        gradeTotal += res.gradeMarks / a;
        _.forEach(MarksCtrl.grades, function (dad) {
          if (res.gradeMarks >= dad.percentageRangeFrom && res.gradeMarks <= dad.percentageRangeTo) {
            res.grade = dad.gradeName
          }
          if (gradeTotal >= dad.percentageRangeFrom && gradeTotal <= dad.percentageRangeTo) {
            MarksCtrl.totalGrade = dad.gradeName;
          }
        })
      })
    }
    MarksCtrl.getGradelower = function (data, a) {
      console.log(data)
      var gradeTotal = 0;
      _.forEach(data, function (res) {
        if (res.maxtotal === 0) { res.gradeMarks = 0 } else {
          res.gradeMarks = (res.total / res.maxtotal) * 100;
        }
        gradeTotal += res.gradeMarks / a;
        _.forEach(MarksCtrl.grades, function (dad) {
          if (res.gradeMarks >= dad.percentageRangeFrom && res.gradeMarks <= dad.percentageRangeTo) {
            res.grade = dad.gradeName
          }
          if (gradeTotal >= dad.percentageRangeFrom && gradeTotal <= dad.percentageRangeTo) {
            MarksCtrl.totalGrade = dad.gradeName;
          }
        })
      })
    }
    MarksCtrl.getGradeupper = function (data, a) {
      var gradeTotal = 0;
      _.forEach(data, function (res) {
        console.log(res)
        if (res.subjectName == "Physical Science" || res.subjectName == "Natural Science") {
          if (res.maxtotal === 0) { res.gradeMarks = 0 } else {
            res.total1 = res.total /10;
            res.gradeMarks = ((res.total - res.total1 )* 2);
          }
        }else{
        if (res.maxtotal === 0) { res.gradeMarks = 0 } else {
          res.gradeMarks = (res.total / 100) * 100;
        }
      }
        gradeTotal += res.gradeMarks / a;
        _.forEach(MarksCtrl.grades, function (dad) {
          if (res.gradeMarks >= dad.percentageRangeFrom && res.gradeMarks <= dad.percentageRangeTo) {
            res.grade = dad.gradeName
          }
          if (gradeTotal >= dad.percentageRangeFrom && gradeTotal <= dad.percentageRangeTo) {
            MarksCtrl.totalGrade = dad.gradeName;
          }
        })
      })
    }

    MarksCtrl.getGradeIndividual = function (data, subjectCount) {
      $timeout(function () {
        if (MarksCtrl.examName.toLowerCase().indexOf('sa') !== -1) {
          _.forEach(MarksCtrl.viewMarksData, function (item) {
            _.forEach(item.assigments, function (item2) {
              if (item2.submarks !== undefined || item2.submarks !== null) {
                _.forEach(MarksCtrl.grades, function (dad) {
                  if (item2.submarks >= dad.percentageRangeFrom && item2.submarks <= dad.percentageRangeTo) {
                    item2.submarks = dad.gradeName
                  }
                  if (item.gradeMarks >= dad.percentageRangeFrom && item.gradeMarks <= dad.percentageRangeTo) {
                    item.total = dad.gradeName
                    item.grade = ""
                  }
                })
              }
            })
          })
        } else {
          console.log(data)
          var gradeTotal = 0;
          _.forEach(MarksCtrl.viewMarksData, function (item) {
            var total = 0;
            _.forEach(item.assigments, function (item2) {
              if (item2.submarks) {
                total += item2.submarks
              }
              if (item2.submarks !== undefined || item2.submarks !== null) {
                if (item.maxtotal !== 0) {
                  item2.submarks = (item2.submarks / item.maxtotal) * 100;
                  console.log(item2.submarks)
                  var dd = (total / item.maxtotal) * 100;
                } else {
                  var dd = 0;
                }
                _.forEach(MarksCtrl.grades, function (dad) {
                  if (item2.submarks >= dad.percentageRangeFrom && item2.submarks <= dad.percentageRangeTo) {
                    item2.submarks = dad.gradeName
                  }
                  if (dd >= dad.percentageRangeFrom && dd <= dad.percentageRangeTo) {
                    item.total = dad.gradeName
                  }
                })
              }
            })
          })
        }
      }, 1000)
    }
    MarksCtrl.getGradeIndividualur1 = function (data, subjectCount) {
      $timeout(function () {
        if (MarksCtrl.examName.toLowerCase().indexOf('sa') !== -1) {
          _.forEach(MarksCtrl.viewMarksData, function (item) {
            _.forEach(item.assigments, function (item2) {
              if (item2.submarks !== undefined || item2.submarks !== null) {
                _.forEach(MarksCtrl.grades, function (dad) {
                  if (item2.submarks >= dad.percentageRangeFrom && item2.submarks <= dad.percentageRangeTo) {
                    item2.submarks = dad.gradeName
                  }
                  if (item.gradeMarks >= dad.percentageRangeFrom && item.gradeMarks <= dad.percentageRangeTo) {
                    item.total = dad.gradeName
                    item.grade = ""
                  }
                })
              }
            })
          })
        } else {
          _.forEach(MarksCtrl.viewMarksData, function (item) {
            var total = 0;
            _.forEach(item.assigments, function (item2) {
              if (item2.submarks) {
                total += item2.submarks
              }
              if (item2.submax == "50" && item2.submax == "50") {
                if (item2.submarks !== undefined || item2.submarks !== null) {
                  if (item.maxtotal !== 0) {
                    // item2.submarks *2;

                    item2.submarks = ((item2.submarks / item.maxtotal) * 100) * 2;
                    var dd = (total / item.maxtotal) * 100;
                  } else {
                    var dd = 0;
                  }
                  _.forEach(MarksCtrl.grades, function (dad) {
                    if (item2.submarks >= dad.percentageRangeFrom && item2.submarks <= dad.percentageRangeTo) {
                      item2.submarks = dad.gradeName
                    }
                    if (dd >= dad.percentageRangeFrom && dd <= dad.percentageRangeTo) {
                      item.total = dad.gradeName
                    }
                  })
                }

              } else {

                if (item2.submarks !== undefined || item2.submarks !== null) {
                  if (item.maxtotal !== 0) {

                    item2.submarks = (item2.submarks / item.maxtotal) * 100;
                    var dd = (total / item.maxtotal) * 100;
                  } else {
                    var dd = 0;
                  }
                  _.forEach(MarksCtrl.grades, function (dad) {
                    if (item2.submarks >= dad.percentageRangeFrom && item2.submarks <= dad.percentageRangeTo) {
                      item2.submarks = dad.gradeName
                    }
                    if (dd >= dad.percentageRangeFrom && dd <= dad.percentageRangeTo) {
                      item.total = dad.gradeName
                    }
                  })
                }
              }
            })
          })
        }
      }, 500)
    }

    MarksCtrl.reset = function () {
      MarksCtrl.formFields.template = "";
      MarksCtrl.formFields.examId = "";
      MarksCtrl.formFields.studentId = "";
    }

    MarksCtrl.individualGrades = function (data) {
      if (data) {
        if (MarksCtrl.formFields.template == "lower") {
          if (MarksCtrl.examName.toLowerCase().indexOf('sa') !== -1) {
            if (MarksCtrl.examName.slice(-1) == '1') {

            }
          } else {
            data.total = data.total * 5;
          }
          _.forEach(MarksCtrl.grades, function (dad) {
            if (data.total >= dad.percentageRangeFrom && data.total <= dad.percentageRangeTo) {
              data.total = dad.gradeName;
            }
            _.forEach(data.tempAssigment, function (dd) {
              var ss = 0
              if (dd.submarks) {
                if (MarksCtrl.examName.toLowerCase().indexOf('sa') !== -1) {
                } else {
                  var ss = dd.submarks * 20;
                }
                if (ss >= dad.percentageRangeFrom && ss <= dad.percentageRangeTo) {
                  dd.submarks = dad.gradeName;
                }
              }
            })
          })
        }
      }
    }
    // grade end

    // student profile start
    MarksCtrl.studentChanged = function () {
      Student.find({ filter: { where: { id: MarksCtrl.formFields.studentId }, include: 'class' } }, function (response) {
        MarksCtrl.studDetails = response;
      })
    }
    // student profile end
    MarksCtrl.printreceiptHistory = function () {
      var divToPrint = document.getElementById("printTable");
      document.getElementById('showTopDetailsContent').style.display = 'block';
      MarksCtrl.newWin = window.open("");
      MarksCtrl.newWin.document.write(divToPrint.outerHTML);

      setTimeout(function () {
        MarksCtrl.newWin.print();
        MarksCtrl.newWin.close();
      }, 2000);
    }
    // pdf starts
    MarksCtrl.pdf = function () {
      document.getElementById('pdf2').style.display = 'block';
      kendo.drawing
        .drawDOM("#pdf2",
          {
            paperSize: "A4",
            // margin: { top: "1cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
            scale: 0.5,
            height: 500,
            image_compression: { FAST: "FAST" }
          })
        .then(function (group) {
          group.children[0] = group.children[group.children.length - 1]
          group.children.splice(1);
          $timeout(function () {
            var name = MarksCtrl.studDetails[0].firstName + "_" + MarksCtrl.studDetails[0].lastName + "_" + MarksCtrl.studDetails[0].class.className + "_" + MarksCtrl.studDetails[0].class.sectionName
            kendo.drawing.pdf.saveAs(group, name + "_" + MarksCtrl.tempExamName + ".pdf");
            document.getElementById('pdf2').style.display = 'none';
          }, 1000);
        });
      // $timeout(function () {
      //   document.getElementById('pdf2').style.display = 'none';
      // }, 6000);
    }
  });
