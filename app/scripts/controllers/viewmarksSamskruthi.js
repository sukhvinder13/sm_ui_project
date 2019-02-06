'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ViewmarkstwoCtrl
 * @description
 * # ViewmarkstwoCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('ViewmarksSamskruthiCtrl', function (FoMarksService, $cookies, Grade, Student, Class, FOexam, $timeout) {
    var MarksCtrl = this;
    MarksCtrl.schoolId = $cookies.getObject('uds').schoolId;
    MarksCtrl.role = $cookies.get('role');
    MarksCtrl.loginId = $cookies.getObject('uds').id;
    MarksCtrl.showStudentTable = false;
    MarksCtrl.showFinal = false;
    MarksCtrl.headers = [];

    // header data start

    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Max Marks") {
        MarksCtrl.roleView = roleAccess[0].RolesData[i].view;
        MarksCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        MarksCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }
    }
    // header data end
    //getting grades starts
    Grade.find({ filter: { where: { schoolId: MarksCtrl.schoolId } } }, function (response) {
      _.forEach(response, function (r) {
        r.percentageRangeTo = r.percentageRangeTo + .99;
      })
      MarksCtrl.grades = response;
    })
    //getting grades end

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
                MarksCtrl.showFinal = false;
                MarksCtrl.studentList = result2;
                MarksCtrl.examList = result1;
                MarksCtrl.examList.map(function (exam) {
                  if (exam.examName.toLowerCase() == 'sa2') MarksCtrl.showFinal = true;
                })
              }
            });
          } else {
            alert('No exams found for this class')
          }
        });
      }
    };

    // MarksCtrl.studentChanged = function () {
    //   // MarksCtrl.formFields.studentId
    //   Student.find({ filter: { where: { id: MarksCtrl.formFields.studentId } } }, function (response) {
    //     MarksCtrl.studDetails = response;
    //   })
    // }

    MarksCtrl.showStudentData = function () {
      if (!MarksCtrl.studentList) return;
      if (!MarksCtrl.formFields.examId) return;
      if (!MarksCtrl.formFields.formateType) return;
      MarksCtrl.Showdata = true;
      MarksCtrl.studentMarksData = undefined;
      FoMarksService.getAllMarksOfExistingStudents().then(function (result) {
        MarksCtrl.listOfAllStudentsWithMarks = result;
        result.data.map(function (student) {
          if (student.classId === MarksCtrl.formFields.classId && student.examId === MarksCtrl.formFields.examId
            && student.studentId === MarksCtrl.formFields.studentId) {
            MarksCtrl.studentMarksData = student;
          }
        })

        MarksCtrl.examList.map(function (item) {
          if(item.id === MarksCtrl.formFields.examId){
        MarksCtrl.examDatasss = item;
        MarksCtrl.data = [];
        MarksCtrl.examDatasss.subjectList.map(function(item){
          var count = 0;
          item.assesments.map(function(item2){
            if(item2.maxMarks){MarksCtrl.data.push({assig:count})}
            count++;
          })
        })
        MarksCtrl.data = _.uniqBy(MarksCtrl.data,'assig')
      }
      })
        if (MarksCtrl.formFields.formateType === "lower") {
          MarksCtrl.tempExamName = undefined;
          if(MarksCtrl.formFields.examId === "Final"){
            MarksCtrl.studentMarksData = [];
            var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName, sa1ExamName, sa2ExamName, sa3ExamName;
            var faN = [], faN1 = [], faN3 = [], faN4 = [], sa1 = [], sa2 = [], sa3 = [], faNId, faN1Id, faN3Id, faN4Id, sa1Id, sa2Id, sa3Id;
            MarksCtrl.examList.map(function (item) {
              if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName }
              if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName }
              if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName }
              if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName }
              if (item.examName.toLowerCase() === 'sa1') { sa1Id = item.id; sa1ExamName = item.examName }
              if (item.examName.toLowerCase() === 'sa2') { sa2Id = item.id; sa2ExamName = item.examName }
              if (item.examName.toLowerCase() === 'sa3') { sa3Id = item.id; sa3ExamName = item.examName }
            })
            result.data.map(function (student) {
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faNId
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faN1Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN1 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faN3Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN3 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faN4Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN4 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === sa1Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                sa1 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === sa2Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                sa2 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === sa3Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                sa3 = student;
                angular.copy(sa3, MarksCtrl.studentMarksData)
              }
            })
            MarksCtrl.studentMarksData.subjects.map(function (student) {
              student.assesments = [
                {
                  marks: 0,
                  maxMarks: 0,
                  status:true
                }
              ];
            })
            faN.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa1'] = totalMarks;
              item['tmpFa1max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
              // student['totMarks'] = totalMarks/maxMarks;
            })

            faN1.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa2'] = totalMarks;
              item['tmpFa2max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            faN3.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa3'] = totalMarks;
              item['tmpFa3max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
              // student['totMarks'] = totalMarks/maxMarks;
            })

            faN4.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa4'] = totalMarks;
              item['tmpFa4max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            sa1.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpSa1'] = totalMarks;
              item['tmpSa1max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            sa2.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpSa2'] = totalMarks;
              item['tmpSa2max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            sa3.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpSa3'] = totalMarks;
              item['tmpSa3max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            // taking averageMarks
            MarksCtrl.studentMarksData['totalOfAllFas'] = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {

              faN.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa1'] = fan1.tmpFa1;
                  student['tmpFa1max'] = fan1.tmpFa1max;
                  // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              faN1.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa2'] = fan1.tmpFa2;
                  student['tmpFa2max'] = fan1.tmpFa2max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              faN3.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa3'] = fan1.tmpFa3;
                  student['tmpFa3max'] = fan1.tmpFa3max;
                  // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              faN4.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa4'] = fan1.tmpFa4;
                  student['tmpFa4max'] = fan1.tmpFa4max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              sa1.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpSa1'] = fan1.tmpSa1;
                  student['tmpSa1max'] = fan1.tmpSa1max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              sa2.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpSa2'] = fan1.tmpSa2;
                  student['tmpSa2max'] = fan1.tmpSa2max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              sa3.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpSa3'] = fan1.tmpSa3;
                  student['tmpSa3max'] = fan1.tmpSa3max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              student['avgfas'] = ((student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / (student['tmpFa1max'] + student['tmpFa2max'] + student['tmpFa3max'] + student['tmpFa4max'])) * 25;
              student['avgfa1'] = ((student['tmpSa1'] + student['tmpSa2']) / (student['tmpSa1max'] + student['tmpSa2max'] )) * 25;
              student.assesments.map(function (item) {
                item.status = true;
                sa2.subjects.map(function (fan1) {
                  if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                    item.marks = (student['tmpSa3'] / student['tmpSa3max']) * 50
                  }
                })
              })
            })

            MarksCtrl.showStudentTable = true;
            MarksCtrl.buildHeaderLowerFinal();
            MarksCtrl.buildFinalMarksTotal();
            if (MarksCtrl.formFields.examId === "Final") {
              FOexam.find({ filter: { where: { id: MarksCtrl.studentMarksData.examId } } }, function (response) {
                // MarksCtrl.tempExamName = "Final Memo";
                MarksCtrl.marksTmp = response[0].tempFile;
                MarksCtrl.tempMarks = "Final Memo"
              })
            }


          } else {
          var ExamName;
          MarksCtrl.examList.map(function (item) {
            if (item.id === MarksCtrl.formFields.examId) { ExamName = item.examName }
          })
          MarksCtrl.studentMarksData.subjects.map(function (student) {
            student.averageMarks = 0;
            student.max = 0;
            var count = 0;
            student.assesments.map(function (assigment) {
              assigment.status = false;
              MarksCtrl.data.map(function (item) {
                if (item.assig === count) {
                  assigment.status = true;
                }
              })
              count++;
              if (assigment.marks) {
                student.averageMarks += assigment.marks;
              }
              if (assigment.maxMarks) {
                student.max += Number(assigment.maxMarks);
              }
            })
          })
          MarksCtrl.showStudentTable = true;
          MarksCtrl.buildHeaderLower(ExamName);
          MarksCtrl.buildGradeLower(ExamName);
        }
        } else {
          if (MarksCtrl.formFields.examId === "Final") {
            MarksCtrl.studentMarksData = [];
            var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName, sa1ExamName, sa2ExamName;
            var faN = [], faN1 = [], faN3 = [], faN4 = [], sa1 = [], sa2 = [], faNId, faN1Id, faN3Id, faN4Id, sa1Id, sa2Id;
            MarksCtrl.examList.map(function (item) {
              if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName }
              if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName }
              if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName }
              if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName }
              if (item.examName.toLowerCase() === 'sa1') { sa1Id = item.id; sa1ExamName = item.examName }
              if (item.examName.toLowerCase() === 'sa2') { sa2Id = item.id; sa2ExamName = item.examName }
            })
            result.data.map(function (student) {
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faNId
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faN1Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN1 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faN3Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN3 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === faN4Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                faN4 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === sa1Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                sa1 = student;
              }
              if (student.classId === MarksCtrl.formFields.classId && student.examId === sa2Id
                && student.studentId === MarksCtrl.formFields.studentId) {
                sa2 = student;
                angular.copy(sa2, MarksCtrl.studentMarksData)
              }
            })
            MarksCtrl.studentMarksData.subjects.map(function (student) {
              student.assesments = [
                {
                  marks: 0,
                  maxMarks: 0,
                  status:true,
                }
              ];
            })
            faN.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa1'] = totalMarks;
              item['tmpFa1max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
              // student['totMarks'] = totalMarks/maxMarks;
            })

            faN1.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa2'] = totalMarks;
              item['tmpFa2max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            faN3.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa3'] = totalMarks;
              item['tmpFa3max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
              // student['totMarks'] = totalMarks/maxMarks;
            })

            faN4.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpFa4'] = totalMarks;
              item['tmpFa4max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            sa1.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpSa1'] = totalMarks;
              item['tmpSa1max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            sa2.subjects.map(function (item) {
              var assigmentCount = 0;
              var totalMarks = 0;
              var maxMarks = 0;
              var totalAvg = 0;
              item.assesments.map(function (sub) {
                if (sub.marks) {
                  totalMarks += sub.marks;
                  assigmentCount++
                }
                if (sub.maxMarks) {
                  maxMarks += Number(sub.maxMarks);
                }
              })
              item['tmpSa2'] = totalMarks;
              item['tmpSa2max'] = maxMarks;
              item['averageMarks'] = totalMarks / assigmentCount;
            })
            // taking averageMarks
            MarksCtrl.studentMarksData['totalOfAllFas'] = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {

              faN.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa1'] = fan1.tmpFa1;
                  student['tmpFa1max'] = fan1.tmpFa1max;
                  // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              faN1.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa2'] = fan1.tmpFa2;
                  student['tmpFa2max'] = fan1.tmpFa2max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              faN3.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa3'] = fan1.tmpFa3;
                  student['tmpFa3max'] = fan1.tmpFa3max;
                  // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              faN4.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpFa4'] = fan1.tmpFa4;
                  student['tmpFa4max'] = fan1.tmpFa4max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              sa1.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpSa1'] = fan1.tmpSa1;
                  student['tmpSa1max'] = fan1.tmpSa1max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              sa2.subjects.map(function (fan1) {
                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                  student['tmpSa2'] = fan1.tmpSa2;
                  student['tmpSa2max'] = fan1.tmpSa2max;
                  // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                }
              })
              student['avgfas'] = ((student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / (student['tmpFa1max'] + student['tmpFa2max'] + student['tmpFa3max'] + student['tmpFa4max'])) * 20;
              student.assesments.map(function (item) {
                sa2.subjects.map(function (fan1) {
                  if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                    item.marks = ((student['tmpSa2'] + student['tmpSa1']) / (student['tmpSa1max'] + student['tmpSa2max'])) * 80
                  }
                })
              })
            })

            MarksCtrl.showStudentTable = true;
            MarksCtrl.buildHeaderFinal();
            MarksCtrl.buildFinalMarksTotal();
            if (MarksCtrl.formFields.examId === "Final") {
              FOexam.find({ filter: { where: { id: MarksCtrl.studentMarksData.examId } } }, function (response) {
                // MarksCtrl.tempExamName = "Final Memo";
                MarksCtrl.marksTmp = response[0].tempFile;
                MarksCtrl.tempMarks = "Final Memo"
              })
            }
          } else {
            var isSummativeAssessment = false;
            var tempExamName;
            MarksCtrl.examList.map(function (item) {
              if (item.id === MarksCtrl.formFields.examId) tempExamName = item.examName, MarksCtrl.tempExamName = item.examName;
            })
            // console.log(tempExamName ? tempExamName : "ff".toLowerCase().indexOf('sa'));
            //   MarksCtrl.examList.map(function (item) {
            //     if(item.id === MarksCtrl.formFields.examId){
            //   MarksCtrl.examDatasss = item;
            //   console.log(MarksCtrl.examDatasss);
            //   MarksCtrl.data = [];
            //   MarksCtrl.examDatasss.subjectList.map(function(item){
            //     var count = 0;
            //     item.assesments.map(function(item2){
            //       if(item2.maxMarks){MarksCtrl.data.push({assig:count})}
            //       count++;
            //     })
            //   })
            //   console.log(MarksCtrl.data);
            //   console.log(_.uniqBy(MarksCtrl.data,'assig'));
            //   MarksCtrl.data = _.uniqBy(MarksCtrl.data,'assig')
            //   console.log(MarksCtrl.data);
            // }
            // })
            if (tempExamName.toLowerCase().indexOf('sa') !== -1) isSummativeAssessment = true;
            if (isSummativeAssessment) {
              var examNumber = tempExamName.slice(-1);
              var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName;
              var faN = [], faN1 = [], faN3 = [], faN4 = [], faNId, faN1Id, faN3Id, faN4Id;
              if (examNumber === '1') {
                MarksCtrl.examList.map(function (item) {
                  if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName }
                  if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName }
                })
              }
              if (examNumber === '2') {
                MarksCtrl.examList.map(function (item) {
                  if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName }
                  if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName }
                  if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName }
                  if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName }
                })
              }
              result.data.map(function (student) {
                if (student.classId === MarksCtrl.formFields.classId && student.examId === faNId
                  && student.studentId === MarksCtrl.formFields.studentId) {
                  faN = student;
                }
                if (student.classId === MarksCtrl.formFields.classId && student.examId === faN1Id
                  && student.studentId === MarksCtrl.formFields.studentId) {
                  faN1 = student;
                }
                if (student.classId === MarksCtrl.formFields.classId && student.examId === faN3Id
                  && student.studentId === MarksCtrl.formFields.studentId) {
                  faN3 = student;
                }
                if (student.classId === MarksCtrl.formFields.classId && student.examId === faN4Id
                  && student.studentId === MarksCtrl.formFields.studentId) {
                  faN4 = student;
                }
              })
              if (examNumber === '1') {
                faN.subjects.map(function (item) {
                  var assigmentCount = 0;
                  var totalMarks = 0;
                  var maxMarks = 0;
                  var totalAvg = 0;
                  item.assesments.map(function (sub) {
                    if (sub.marks) {
                      totalMarks += sub.marks;
                      assigmentCount++
                    }
                    if (sub.maxMarks) {
                      maxMarks += Number(sub.maxMarks);
                    }
                  })
                  item['tmpFa1'] = totalMarks;
                  item['tmpFa1max'] = maxMarks;
                  item['averageMarks'] = totalMarks / assigmentCount;
                  // student['totMarks'] = totalMarks/maxMarks;
                })

                faN1.subjects.map(function (item) {
                  var assigmentCount = 0;
                  var totalMarks = 0;
                  var maxMarks = 0;
                  var totalAvg = 0;
                  item.assesments.map(function (sub) {
                    if (sub.marks) {
                      totalMarks += sub.marks;
                      assigmentCount++
                    }
                    if (sub.maxMarks) {
                      maxMarks += Number(sub.maxMarks);
                    }
                  })
                  item['tmpFa2'] = totalMarks;
                  item['tmpFa2max'] = maxMarks;
                  item['averageMarks'] = totalMarks / assigmentCount;
                })
                // taking averageMarks
                MarksCtrl.studentMarksData['totalOfAllFas'] = 0;
                MarksCtrl.studentMarksData.subjects.map(function (student) {

                  faN.subjects.map(function (fan1) {
                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                      student['tmpFa1'] = fan1.tmpFa1;
                      student['tmpFa1max'] = fan1.tmpFa1max;
                      // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                    }
                  })
                  faN1.subjects.map(function (fan1) {
                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                      student['tmpFa2'] = fan1.tmpFa2;
                      student['tmpFa2max'] = fan1.tmpFa2max;
                      // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                    }
                  })
                  student['avgfas'] = ((student['tmpFa1'] + student['tmpFa2']) / (student['tmpFa1max'] + student['tmpFa2max'])) * 20;
                })
                MarksCtrl.showStudentTable = true;
                MarksCtrl.gradeSaMarks();
                MarksCtrl.buildHeader(tempExamName);
              } else {

                faN.subjects.map(function (item) {
                  var assigmentCount = 0;
                  var totalMarks = 0;
                  var maxMarks = 0;
                  var totalAvg = 0;
                  item.assesments.map(function (sub) {
                    if (sub.marks) {
                      totalMarks += sub.marks;
                      assigmentCount++
                    }
                    if (sub.maxMarks) {
                      maxMarks += Number(sub.maxMarks);
                    }
                  })
                  item['tmpFa1'] = totalMarks;
                  item['tmpFa1max'] = maxMarks;
                  item['averageMarks'] = totalMarks / assigmentCount;
                  // student['totMarks'] = totalMarks/maxMarks;
                })

                faN1.subjects.map(function (item) {
                  var assigmentCount = 0;
                  var totalMarks = 0;
                  var maxMarks = 0;
                  var totalAvg = 0;
                  item.assesments.map(function (sub) {
                    if (sub.marks) {
                      totalMarks += sub.marks;
                      assigmentCount++
                    }
                    if (sub.maxMarks) {
                      maxMarks += Number(sub.maxMarks);
                    }
                  })
                  item['tmpFa2'] = totalMarks;
                  item['tmpFa2max'] = maxMarks;
                  item['averageMarks'] = totalMarks / assigmentCount;
                })
                faN3.subjects.map(function (item) {
                  var assigmentCount = 0;
                  var totalMarks = 0;
                  var maxMarks = 0;
                  var totalAvg = 0;
                  item.assesments.map(function (sub) {
                    if (sub.marks) {
                      totalMarks += sub.marks;
                      assigmentCount++
                    }
                    if (sub.maxMarks) {
                      maxMarks += Number(sub.maxMarks);
                    }
                  })
                  item['tmpFa3'] = totalMarks;
                  item['tmpFa3max'] = maxMarks;
                  item['averageMarks'] = totalMarks / assigmentCount;
                  // student['totMarks'] = totalMarks/maxMarks;
                })

                faN4.subjects.map(function (item) {
                  var assigmentCount = 0;
                  var totalMarks = 0;
                  var maxMarks = 0;
                  var totalAvg = 0;
                  item.assesments.map(function (sub) {
                    if (sub.marks) {
                      totalMarks += sub.marks;
                      assigmentCount++
                    }
                    if (sub.maxMarks) {
                      maxMarks += Number(sub.maxMarks);
                    }
                  })
                  item['tmpFa4'] = totalMarks;
                  item['tmpFa4max'] = maxMarks;
                  item['averageMarks'] = totalMarks / assigmentCount;
                })
                // taking averageMarks
                MarksCtrl.studentMarksData['totalOfAllFas'] = 0;
                MarksCtrl.studentMarksData.subjects.map(function (student) {

                  faN.subjects.map(function (fan1) {
                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                      student['tmpFa1'] = fan1.tmpFa1;
                      student['tmpFa1max'] = fan1.tmpFa1max;
                      // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                    }
                  })
                  faN1.subjects.map(function (fan1) {
                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                      student['tmpFa2'] = fan1.tmpFa2;
                      student['tmpFa2max'] = fan1.tmpFa2max;
                      // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                    }
                  })
                  faN3.subjects.map(function (fan1) {
                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                      student['tmpFa3'] = fan1.tmpFa3;
                      student['tmpFa3max'] = fan1.tmpFa3max;
                      // student['avgfa1'] = Math.round(fan1.averageMarks * 100) / 100;
                    }
                  })
                  faN4.subjects.map(function (fan1) {
                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                      student['tmpFa4'] = fan1.tmpFa4;
                      student['tmpFa4max'] = fan1.tmpFa4max;
                      // student['avgfa2'] = Math.round(fan1.averageMarks * 100) / 100;
                    }
                  })
                  student['avgfas'] = ((student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / (student['tmpFa1max'] + student['tmpFa2max'] + student['tmpFa3max'] + student['tmpFa4max'])) * 20;
                })
                MarksCtrl.showStudentTable = true;
                MarksCtrl.gradeSaMarks();
                MarksCtrl.buildHeader(tempExamName);

              }

            } else {

              MarksCtrl.studentMarksData.subjects.map(function (student) {
                student.averageMarks = 0;
                student.max = 0;
                var count =0;
                student.assesments.map(function (assigment) {
                  assigment.status = false;
                  MarksCtrl.data.map(function(item){
                    if(item.assig === count){assigment.status = true;}
                  })
                  count++;
                  if (assigment.marks) {
                    student.averageMarks += assigment.marks;
                  }
                  if (assigment.maxMarks) {
                    student.max += Number(assigment.maxMarks);
                  }
                })
              })
              MarksCtrl.showStudentTable = true;
              MarksCtrl.buildHeader(tempExamName);

            }
          }
        }
        Student.find({ filter: { where: { id: MarksCtrl.formFields.studentId } } }, function (response) {
          MarksCtrl.studDetails = response;
        })

        Class.find({ filter: { where: { id: MarksCtrl.formFields.classId } } }, function (response) {
          MarksCtrl.classDetails = response;
        })
        if (MarksCtrl.formFields.examId !== "Final") {
          // FOexam.find({ filter: { where: { id: MarksCtrl.formFields.examId } } }, function (response) {
            MarksCtrl.tempExamNamee = MarksCtrl.examDatasss.examName;
            MarksCtrl.marksTmp = MarksCtrl.examDatasss.tempFile;
            if (MarksCtrl.formFields.formateType === "upper") {
              MarksCtrl.tempExamName = MarksCtrl.tempExamNamee;
            }
            if (MarksCtrl.tempExamNamee == "SA1") {
              MarksCtrl.tempMarks = "Summative Assessment - 1"
            } else if (MarksCtrl.tempExamNamee == "FA1") {
              MarksCtrl.tempMarks = "Formative Assessment - 1"
            } else if (MarksCtrl.tempExamNamee == "FA2") {
              MarksCtrl.tempMarks = "Formative Assessment - 2"
            }
            else if (MarksCtrl.tempExamNamee == "FA3") {
              MarksCtrl.tempMarks = "Formative Assessment - 3"
            }
            else if (MarksCtrl.tempExamNamee == "FA4") {
              MarksCtrl.tempMarks = "Formative Assessment - 4"
            }
            else if (MarksCtrl.tempExamNamee == "SA2") {
              MarksCtrl.tempMarks = "Summative Assessment - 2"
            }
          // })
        }
      })
    }

    MarksCtrl.buildHeader = function (tempExamName) {
      MarksCtrl.headers = [];
      if (tempExamName.toLowerCase().indexOf('sa') !== -1) {
        var examNumber = tempExamName.slice(-1);
        MarksCtrl.headers.push('Subjects');
        MarksCtrl.headers[1] = "FA(20%)"
        MarksCtrl.headers[2] = "SA(80%)"
        MarksCtrl.headers[3] = "Total(100%)"
        MarksCtrl.headers[4] = "Grade"
        MarksCtrl.headers[5] = "Grade Point"
      } else {
        MarksCtrl.headers.push('Subjects');
        var count = 0;
        MarksCtrl.studentMarksData.subjects[0].assesments.map(function (item) {
          MarksCtrl.data.map(function(items){
            if(items.assig === count){MarksCtrl.headers.push(item.assesments)}
          })
          count++;
        })
        MarksCtrl.headers.push('Total');
        MarksCtrl.headers.push('Grade');
        MarksCtrl.headers.push('Grade Point');
        MarksCtrl.falTotal();
      }
    }
    MarksCtrl.buildHeaderFinal = function () {
      MarksCtrl.headers = [];
      MarksCtrl.headers.push('Subjects');
      MarksCtrl.headers.push("FA's (20%)");
      MarksCtrl.headers.push("SA's(80%)");
      MarksCtrl.headers.push('Total');
      MarksCtrl.headers.push('Grade');
      MarksCtrl.headers.push('Grade Point');
    }
    MarksCtrl.buildHeaderLowerFinal = function(){
      MarksCtrl.headers = [];
      MarksCtrl.headers.push('Subjects');
      MarksCtrl.headers.push("FA's (25%)");
      MarksCtrl.headers.push("SA1+SA2 (25%)");
      MarksCtrl.headers.push("SA3 (50%)");
      MarksCtrl.headers.push('Total');
      MarksCtrl.headers.push('Grade');
      MarksCtrl.headers.push('Grade Point');
    }
    MarksCtrl.falTotal = function () {
      MarksCtrl.studentMarksData['totalGrade'] = 0;
      MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
      var totalGrade = 0;
      var subjectCount = 0;
      MarksCtrl.studentMarksData.subjects.map(function (student) {
        // student['grades']
        MarksCtrl.studentMarksData['totalOfAllSubjects'] += student.averageMarks;
        var grade = (student.averageMarks / student.max) * 100;
        // student['grades'] = "grade";
        MarksCtrl.grades.map(function (grad) {
          if ((grad.percentageRangeFrom <= grade) && (grad.percentageRangeTo >= grade)) {
            student['grades'] = grad.gradefullName;
            student.gradePoint = grad.gradePoint;
          }
        })
        totalGrade += grade;
        subjectCount++;
        MarksCtrl.studentMarksData['totalGrade'] = totalGrade / subjectCount;
      })
      MarksCtrl.grades.map(function (grad) {
        if ((grad.percentageRangeFrom <= MarksCtrl.studentMarksData['totalGrade']) && (grad.percentageRangeTo >= MarksCtrl.studentMarksData['totalGrade'])) {
          MarksCtrl.studentMarksData['totalGrade'] = grad.gradefullName;
          MarksCtrl.studentMarksData['totalGradePoint'] = grad.gradePoint;
        }
      })
    }
    MarksCtrl.gradeSaMarks = function () {
      var avg = 0, grade;
      MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
      MarksCtrl.studentMarksData.subjects.map(function (student) {
        student['averageMarks'] = 0;
        student['averageMarks'] += student['avgfas'];
        MarksCtrl.studentMarksData['totalOfAllFas'] += student['avgfas'];
        student.assesments.map(function (assesments) {
          assesments.status = true;
          if (assesments.marks !== undefined) {
            student['averageMarks'] += Number(assesments.marks);
            MarksCtrl.studentMarksData['totalOfAllSubjects'] += Number(assesments.marks);
            // MarksCtrl.studentMarksData['totalOfAll'] = MarksCtrl.studentMarksData['totalOfAllSubjects']+MarksCtrl.studentMarksData['totalOfAllFas'];      
          }
        })
        MarksCtrl.grades.map(function (grad) {
          if ((grad.percentageRangeFrom <= student['averageMarks']) && (grad.percentageRangeTo >= student['averageMarks'])) {
            student['grades'] = grad.gradefullName;
            student.gradePoint = grad.gradePoint;
          }
        })
      })
      MarksCtrl.studentMarksData['totalOfAll'] = MarksCtrl.studentMarksData['totalOfAllSubjects'] + MarksCtrl.studentMarksData['totalOfAllFas'];
      var totalMarksGradepoint = MarksCtrl.studentMarksData['totalOfAll'] / MarksCtrl.studentMarksData.subjects.length;
      MarksCtrl.grades.map(function (grad) {
        if ((grad.percentageRangeFrom <= totalMarksGradepoint) && (grad.percentageRangeTo >= totalMarksGradepoint)) {
          MarksCtrl.studentMarksData['totalGrade'] = grad.gradefullName;
          MarksCtrl.studentMarksData['totalOfGPA'] = grad.gradePoint;
        }
      })


    }
    MarksCtrl.buildFinalMarksTotal = function () {
      var avg = 0, grade;
      MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
      MarksCtrl.studentMarksData.subjects.map(function (student) {
        student['averageMarks'] = 0;
        student['averageMarks'] += student['avgfas'];
        MarksCtrl.studentMarksData['totalOfAllFas'] += student['avgfas'];
        if(student['avgfa1']){
        student['averageMarks'] += student['avgfa1'];
      }
        student.assesments.map(function (assesments) {
          if (assesments.marks !== undefined) {
            student['averageMarks'] += Number(assesments.marks);
            MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['averageMarks'];
            // MarksCtrl.studentMarksData['totalOfAll'] = MarksCtrl.studentMarksData['totalOfAllSubjects']+MarksCtrl.studentMarksData['totalOfAllFas'];      
          }
        })
        MarksCtrl.grades.map(function (grad) {
          if ((grad.percentageRangeFrom <= student['averageMarks']) && (grad.percentageRangeTo >= student['averageMarks'])) {
            student['grades'] = grad.gradefullName;
            student.gradePoint = grad.gradePoint;
          }
        })
      })
      MarksCtrl.studentMarksData['totalOfAll'] = MarksCtrl.studentMarksData['totalOfAllSubjects'] + MarksCtrl.studentMarksData['totalOfAllFas'];
      var totalMarksGradepoint = MarksCtrl.studentMarksData['totalOfAllSubjects'] / MarksCtrl.studentMarksData.subjects.length;
      console.log(totalMarksGradepoint);
      MarksCtrl.grades.map(function (grad) {
        if ((grad.percentageRangeFrom <= totalMarksGradepoint) && (grad.percentageRangeTo >= totalMarksGradepoint)) {
          MarksCtrl.studentMarksData['totalGrade'] = grad.gradefullName;
          MarksCtrl.studentMarksData['totalGradePoint'] = grad.gradePoint;
        }
      })
    }

    MarksCtrl.buildHeaderLower = function (tempExamName) {
      MarksCtrl.headers = [];
      if (tempExamName.toLowerCase().indexOf('sa') !== -1) {
        MarksCtrl.Showdata = false;
        MarksCtrl.headers.push("Subjects")
        MarksCtrl.headers.push("MaxMarks")
        MarksCtrl.headers.push("Marks Obtained")
        MarksCtrl.headers.push("Grade")
        MarksCtrl.headers.push("Grade point")

      } else {
        MarksCtrl.headers.push("Subjects")
        var count = 0;
        MarksCtrl.studentMarksData.subjects[0].assesments.map(function (assig) {
          MarksCtrl.data.map(function (item) {
            if (item.assig === count) {
              MarksCtrl.headers.push(assig.assesments)
            }
          })
          count++;
        })
        MarksCtrl.headers.push("Total")
        MarksCtrl.headers.push("Grade")
        MarksCtrl.headers.push("Grade point")
      }
    }
    MarksCtrl.buildGradeLower = function (tempExamName) {
      MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
      MarksCtrl.studentMarksData['maxOfAllSubjects'] = 0;
      if (tempExamName.toLowerCase().indexOf('sa') !== -1) {
        MarksCtrl.studentMarksData.subjects.map(function (student) {
          student.avgfas = 0;
          student.assesments.map(function (assig) {
            if (assig.maxMarks) student.avgfas += Number(assig.maxMarks);
          })
        })
      }
      MarksCtrl.studentMarksData.subjects.map(function (student) {
        MarksCtrl.studentMarksData['maxOfAllSubjects'] += student.max;
        MarksCtrl.studentMarksData['totalOfAllSubjects'] += student.averageMarks;
        var finalGrade = (MarksCtrl.studentMarksData['totalOfAllSubjects'] / MarksCtrl.studentMarksData['maxOfAllSubjects']) * 100;
        student['grades'] = (student.averageMarks / student.max) * 100;
        MarksCtrl.grades.map(function (grad) {
          if ((grad.percentageRangeFrom <= student['grades']) && (grad.percentageRangeTo >= student['grades'])) {
            student['grades'] = grad.gradefullName;
            student.gradePoint = grad.gradePoint;
          }
          if ((grad.percentageRangeFrom <= finalGrade) && (grad.percentageRangeTo >= finalGrade)) {
            MarksCtrl.studentMarksData['totalGrade'] = grad.gradefullName,
              MarksCtrl.studentMarksData['totalGradePoint'] = grad.gradePoint;
          }
        })
      })
    }

    // print and pdf start
    MarksCtrl.pdf = function () {
      document.getElementById('pdf2').style.display = 'block';
      kendo.drawing
        .drawDOM("#pdf2",
        {
          paperSize: "A4",
          // margin: { top: "1cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
          scale: 0.6,
          height: 500
        })
        .then(function (group) {
          group.children[0] = group.children[group.children.length - 1]
          group.children.splice(1);
          var name="";
          if(MarksCtrl.studDetails[0].firstName){
            name+=MarksCtrl.studDetails[0].firstName+'-';
          }
          if(MarksCtrl.tempExamNamee){
            name+=MarksCtrl.tempExamNamee;
          }
          if(MarksCtrl.classDetails[0].className){
            name+="-"+MarksCtrl.classDetails[0].className;
          }
          if(MarksCtrl.classDetails[0].sectionName){
            name+="-"+MarksCtrl.classDetails[0].sectionName;
          }

          $timeout(function () {
            kendo.drawing.pdf.saveAs(group, name+".pdf");
            document.getElementById('pdf2').style.display = 'none';
          }, 1000);
        });
    }

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

    // print and pdf end

  });
