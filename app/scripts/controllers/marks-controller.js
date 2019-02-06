'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:MarksControllerCtrl
 * @description
 * # MarksControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('MarksController', function (configService, marksService, FoMarksService, $cookies, Exam, Student, Class, $timeout, School, toastr, $rootScope, Marks, $window, APP_MESSAGES, $scope, $filter, $http, FOexam, Grade) {

        var MarksCtrl = this;
        MarksCtrl.subjectDetails = [];
        MarksCtrl.headers = [];
        MarksCtrl.showStudentTable = false;
        MarksCtrl.listOfAllStudentsWithMarks = [];
        //Get Assignment details by School ID
        MarksCtrl.schoolId = $cookies.getObject('uds').schoolId;
        MarksCtrl.loginId = $cookies.getObject('uds').id;
        MarksCtrl.classId = $cookies.getObject('uds').classId;
        MarksCtrl.role = $cookies.get('role');
        MarksCtrl.showTable = false;
        MarksCtrl.showEditButton = false;
        MarksCtrl.DatrickShow = true;
        MarksCtrl.DatrickShowRoll = true;
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Max Marks") {
                MarksCtrl.roleView = roleAccess[0].RolesData[i].view;
                MarksCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                MarksCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }

        $rootScope.Utils = {
            keys: Object.keys
        }

        $rootScope.Utils = {
            values: Object.values
        }
        //getting grades starts
        // Grade.find({ filter: { where: { schoolId: MarksCtrl.schoolId } } }, function (response) {
        //     console.log(response);
        //     _.forEach(response, function (r) {
        //       r.percentageRangeTo = r.percentageRangeTo + .99;
        //     })
        //     MarksCtrl.grades = response;
        //   })
        //getting grades end
        MarksCtrl.schoolName = '';
        //get sschool name and generate respective data in required format.
        MarksCtrl.getSchoolName = function () {
            $http.get(configService.baseUrl() + '/Schools/' + $cookies.getObject('uds').schoolId)
                .then(function (response) {
                    MarksCtrl.schoolName = response.data.schoolName;
                    if (MarksCtrl.schoolName == 'Dhatrak Public School') {
                        MarksCtrl.DatrickShow = false;
                        MarksCtrl.DatrickShowRoll = false;
                    } else if (MarksCtrl.schoolName == 'Vikas Model School') {
                        MarksCtrl.DatrickShow = false;
                    } else if (MarksCtrl.schoolName == 'VSR Model High School') {
                        MarksCtrl.DatrickShow = false;
                    }
                }, function (error) {
                });
        };
        MarksCtrl.getSchoolName();

        MarksCtrl.editMode = false;
        MarksCtrl.subjectFilter = {};

        FoMarksService.getClassesDetailsBySchoolId(MarksCtrl.schoolId, MarksCtrl.role, MarksCtrl.loginId).then(function (result) {
            if (result) {
                if (Array.isArray(result)) {
                    var newArray = result.filter(function (thing, index, self) {
                        return self.findIndex(function (t) {
                            return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                        }) === index;
                    });
                    MarksCtrl.classesList = newArray;
                }
            }
        }, function (error) {
        });
        FoMarksService.getClassDetailsBySchoolId(MarksCtrl.schoolId, MarksCtrl.role, MarksCtrl.loginId).then(function (result) {
            if (result) {
                MarksCtrl.classList = result;
            }
        }, function (error) {
        });

        MarksCtrl.printreceiptHistory = function () {
            var divToPrint = document.getElementById("printTable");
            document.getElementById('showTopDetailsContent').style.display = 'block';
            document.getElementById('obj').style.textAlign = 'center';
            MarksCtrl.newWin = window.open("");
            MarksCtrl.newWin.document.write(divToPrint.outerHTML);

            setTimeout(function () {
                MarksCtrl.newWin.print();
                MarksCtrl.newWin.close();
            }, 250);
        }

        MarksCtrl.selectExam = function () {
            marksService.getSubjectDetailsByexamId(MarksCtrl.formFields.examId).then(function (result) {
                if (result) {

                    MarksCtrl.subjectList = result.subjectList;

                    _.each(MarksCtrl.studentList, function (student) {
                        student.subjects = [];
                        angular.copy(MarksCtrl.subjectList, student.subjects);
                    });

                    marksService.getMarksDetailsByClassId(MarksCtrl.formFields.classId, MarksCtrl.formFields.subjectId, MarksCtrl.formFields.examId).then(function (result) {
                        var existingMarksData = result;

                        _.each(MarksCtrl.studentList, function (item) {
                            _.each(existingMarksData, function (existingMarks) {
                                if (existingMarks.studentId == item.id && existingMarks.classId == item.classId && existingMarks.examId == MarksCtrl.formFields.examId) {
                                    item.subjects = existingMarks.subjects;
                                    item.marksId = existingMarks.id;
                                }
                            });
                        });
                    });



                }
            }, function (error) {
            });

        }

        MarksCtrl.selectClass = function () {

            if (MarksCtrl.formFields.classId) {

                FoMarksService.getExamsByClassId(MarksCtrl.formFields.classId).then(function (result1) {
                    if (result1 && result1.length > 0) {

                        FoMarksService.getStudentsByClassId(MarksCtrl.formFields.classId, MarksCtrl.schoolId, MarksCtrl.role, MarksCtrl.loginId).then(function (result2) {
                            if (result2) {
                                MarksCtrl.studentList = result2;
                                MarksCtrl.examList = result1;
                                _.each(MarksCtrl.studentList, function (res) {
                                    res['rollNo'] = Number(res.rollNo);

                                })
                            }
                        });

                    } else {
                        alert('No exams found for this class')
                    }
                });

            }
        };

        MarksCtrl.saveMarks = function () {

            MarksCtrl.editMode = false;

            var tempStudentDataWithMarks = [];

            angular.copy(MarksCtrl.studentList, tempStudentDataWithMarks);

            //Formatting JSON
            var marks = [];
            var newMarks = [];

            _.each(tempStudentDataWithMarks, function (student) {
                var temp = {
                    studentId: student.id,
                    classId: MarksCtrl.formFields.classId,
                    examId: MarksCtrl.formFields.examId,
                    subjects: student.subjects
                };
                if (student.marksId) {
                    temp.id = student.marksId;
                    marks.push(temp);
                } else {
                    newMarks.push(temp);
                }
            })

            async.eachSeries(marks, function (mark, callback) {
                marksService.UpdateMarks(mark).then(function (result) {
                    _.each(MarksCtrl.studentList, function (stud) {
                        if (stud.id === result.data.studentId) {
                            stud.marksId = result.data.id
                        }
                    })
                    callback();
                }, function (error) {
                    callback();
                });
            }, function (err) {
                marksService.addMarks(newMarks);
            });
            $window.location.reload();
        };

        MarksCtrl.showStudentData = function () {
            if (!MarksCtrl.formFields.studentId) return;
            if (!MarksCtrl.formFields.examId) return;
            if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                if (!MarksCtrl.formFields.formateType) {
                    return
                }
                if (!MarksCtrl.formFields.examId) {
                    return
                }
            }
            FoMarksService.getAllMarksOfExistingStudents().then(function (result) {
                MarksCtrl.listOfAllStudentsWithMarks = result;
                result.data.map(function (student) {
                    if (student.classId === MarksCtrl.formFields.classId && student.examId === MarksCtrl.formFields.examId
                        && student.studentId === MarksCtrl.formFields.studentId) {
                        MarksCtrl.studentMarksData = student;
                    }
                })

                var isSummativeAssessment = false;
                var tempExamName;
                MarksCtrl.examList.map(function (item) {
                    if (item.id === MarksCtrl.formFields.examId) tempExamName = item.examName
                })
                if (tempExamName.toLowerCase().indexOf('sa') !== -1 || tempExamName.toLowerCase().indexOf('sa') !== -1)
                    isSummativeAssessment = true;
                if (isSummativeAssessment) {
                    var examNumber = tempExamName.slice(-1);
                    var fa1ExamName, fa2ExamName, fa3ExamName, fa4ExamName;
                    var faN = [], faN1 = [], faN3 = [], faN4 = [], faNId, faN1Id, faN3Id, faN4Id;
                    if (MarksCtrl.schoolName === 'Krishna Veni High School') {
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
                    } else if (MarksCtrl.schoolName === 'New Bloom High School') {
                        if (examNumber === '1') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName; }
                            })
                        }
                        if (examNumber === '2') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa3') { faNId = item.id; fa1ExamName = item.examName; }
                            })
                        }
                        if (examNumber === '3') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName; }
                            })
                        }
                    } else if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        if (examNumber === '1') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName; }
                            })
                        }
                        if (examNumber === '2') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa3') { faNId = item.id; fa1ExamName = item.examName; }
                            })
                        }
                        if (examNumber === '3') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa3') { faN3Id = item.id; fa3ExamName = item.examName; }
                                if (item.examName.toLowerCase() === 'fa4') { faN4Id = item.id; fa4ExamName = item.examName; }
                            })
                        }
                    } else {
                        if (examNumber === '1') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa1') { faNId = item.id; fa1ExamName = item.examName }
                                if (item.examName.toLowerCase() === 'fa2') { faN1Id = item.id; fa2ExamName = item.examName }
                            })
                        }
                        if (examNumber === '2') {
                            MarksCtrl.examList.map(function (item) {
                                if (item.examName.toLowerCase() === 'fa3') { faNId = item.id; fa1ExamName = item.examName }
                                if (item.examName.toLowerCase() === 'fa4') { faN1Id = item.id; fa2ExamName = item.examName }
                            })
                        }
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
                    if (MarksCtrl.schoolName === 'Krishna Veni High School') {
                        if (tempExamName.toLowerCase() === 'sa1') {
                            faN1.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa2'] = avg;
                                student['tmpFa2max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            // taking averageMarks
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN1.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa2'] = fan1.tmpFa2;
                                        student['tmpFa2max'] = fan1.tmpFa2max;
                                        student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                var sa1avg = (student['avgfa1'] + student['avgfa2']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa1avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                        } else {
                            faN4.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa4'] = avg;
                                student['tmpFa4max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN3.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa3'] = avg;
                                student['tmpFa3max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            faN1.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa2'] = avg;
                                student['tmpFa2max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            // taking averageMarks
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId || student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN1.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId || student.subjectName === fan1.subjectName) {
                                        student['tmpFa2'] = fan1.tmpFa2;
                                        student['tmpFa2max'] = fan1.tmpFa2max;
                                        student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN3.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa3'] = fan1.tmpFa3;
                                        student['tmpFa3max'] = fan1.tmpFa3max;
                                        student['avgfa3'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN4.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa4'] = fan1.tmpFa4;
                                        student['tmpFa4max'] = fan1.tmpFa4max;
                                        student['avgfa4'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                var sa2avg = (student['avgfa1'] + student['avgfa2'] + student['avgfa3'] + student['avgfa4']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa2avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                        }

                    } else if (MarksCtrl.schoolName === 'New Bloom High School') {
                        if (tempExamName.toLowerCase() === 'sa1') {
                            faN1.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa2'] = avg;
                                student['tmpFa2max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN1.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa2'] = fan1.tmpFa2;
                                        student['tmpFa2max'] = fan1.tmpFa2max;
                                        student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                var sa1avg = (student['avgfa1'] + student['avgfa2']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa1avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                        } else if (tempExamName.toLowerCase() === 'sa2') {
                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            // taking averageMarks
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                var sa1avg = (student['avgfa2']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa1avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                        } else {

                            faN4.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa4'] = avg;
                                student['tmpFa4max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN3.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa3'] = avg;
                                student['tmpFa3max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            faN1.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa2'] = avg;
                                student['tmpFa2max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            // taking averageMarks
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId || student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN1.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId || student.subjectName === fan1.subjectName) {
                                        student['tmpFa2'] = fan1.tmpFa2;
                                        student['tmpFa2max'] = fan1.tmpFa2max;
                                        student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN3.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa3'] = fan1.tmpFa3;
                                        student['tmpFa3max'] = fan1.tmpFa3max;
                                        student['avgfa3'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN4.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa4'] = fan1.tmpFa4;
                                        student['tmpFa4max'] = fan1.tmpFa4max;
                                        student['avgfa4'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                var sa2avg = (student['avgfa1'] + student['avgfa2'] + student['avgfa3'] + student['avgfa4']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa2avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                        }

                    } else if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        if (tempExamName.toLowerCase() === 'sa1') {
                            faN1.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    var exam = assesments.examtypeName.split("")[0].toLowerCase();
                                    if (assesments.marks !== undefined && exam == "i") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && exam == "e") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa2'] = avg;
                                student['tmpFa2max'] = max;
                                student['averageMarks'] = (avg / max) * 10;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    var exam = assesments.examtypeName.split("")[0].toLowerCase();
                                    if (assesments.marks !== undefined && exam == "i") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && exam == "e") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = (avg / max) * 10;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1s'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN1.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa2'] = fan1.tmpFa2;
                                        student['tmpFa2max'] = fan1.tmpFa2max;
                                        student['avgfa2s'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    var exam = assesments.examtypeName.split("")[0].toLowerCase();
                                    if (assesments.marks !== undefined && exam == "i") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && exam == "e") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['avgfa1'] = Math.round((((student['avgfa1s'] + student['avgfa2s']) / 20) * 20) * 100) / 100;
                                var sa1avg = (student['avgfa1s'] + student['avgfa2s']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa1avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                            console.log(MarksCtrl.studentMarksData);
                        } else if (tempExamName.toLowerCase() === 'sa2') {
                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    var exam = assesments.examtypeName.split("")[0].toLowerCase();
                                    if (assesments.marks !== undefined && exam == "i") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && exam == "e") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = avg + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            // taking averageMarks
                            console.log(MarksCtrl.studentMarksData);
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1s'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    var exam = assesments.examtypeName.split("")[0].toLowerCase();
                                    if (assesments.marks !== undefined && exam == "i") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && exam == "e") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['avgfa1'] = Math.round(((student['avgfa1s'] / student['tmpFa1max']) * 20) * 100) / 100;
                                var sa1avg = (student['avgfa2s']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa1avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['averageMarks'];
                            });
                            console.log(MarksCtrl.studentMarksData);
                        } else {

                            faN4.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa4'] = avg;
                                student['tmpFa4max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN3.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa3'] = avg;
                                student['tmpFa3max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            faN1.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa2'] = avg;
                                student['tmpFa2max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })

                            faN.subjects.map(function (student) {
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                var max = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        max += Number(assesments.maxMarks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                student['tmpFa1'] = avg;
                                student['tmpFa1max'] = max;
                                student['averageMarks'] = avg / indi;
                                student['totMarks'] = student['averageMarks'] + totMark;
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                                if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                                if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            })
                            // taking averageMarks
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                            MarksCtrl.studentMarksData.subjects.map(function (student) {
                                faN.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId || student.subjectName === fan1.subjectName) {
                                        student['tmpFa1'] = fan1.tmpFa1;
                                        student['tmpFa1max'] = fan1.tmpFa1max;
                                        student['avgfa1'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN1.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId || student.subjectName === fan1.subjectName) {
                                        student['tmpFa2'] = fan1.tmpFa2;
                                        student['tmpFa2max'] = fan1.tmpFa2max;
                                        student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN3.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa3'] = fan1.tmpFa3;
                                        student['tmpFa3max'] = fan1.tmpFa3max;
                                        student['avgfa3'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                faN4.subjects.map(function (fan1) {
                                    if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                        student['tmpFa4'] = fan1.tmpFa4;
                                        student['tmpFa4max'] = fan1.tmpFa4max;
                                        student['avgfa4'] = Math.round(fan1.totMarks * 100) / 100;
                                    }
                                })
                                var avg = 0;
                                var indi = 0;
                                var totMark = 0;
                                student.assesments.map(function (assesments) {
                                    if (assesments.marks !== undefined && assesments.examtypeName == "Internal") {
                                        avg += Number(assesments.marks);
                                        indi++;
                                    } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                        totMark += Number(assesments.marks);
                                    }
                                })
                                var sa2avg = (student['avgfa1'] + student['avgfa2'] + student['avgfa3'] + student['avgfa4']) * 20 / 100;
                                student['averageMarks'] = Math.round(sa2avg * 100) / 100  //returns 28.45
                                var sa1total = student['averageMarks'] + totMark;
                                student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                                student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                                MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                            });
                        }

                    } else {

                        faN1.subjects.map(function (student) {
                            var avg = 0;
                            var indi = 0;
                            var totMark = 0;
                            var max = 0;
                            student.assesments.map(function (assesments) {
                                if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                    avg += Number(assesments.marks);
                                    max += Number(assesments.maxMarks);
                                    indi++;
                                } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                    totMark += Number(assesments.marks);
                                }
                            })
                            student['tmpFa2'] = avg;
                            student['tmpFa2max'] = max;
                            student['averageMarks'] = avg / indi;
                            student['totMarks'] = student['averageMarks'] + totMark;
                            student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                            if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                            if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                            if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                        })

                        faN.subjects.map(function (student) {
                            var avg = 0;
                            var indi = 0;
                            var totMark = 0;
                            var max = 0;
                            student.assesments.map(function (assesments) {
                                if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                    avg += Number(assesments.marks);
                                    max += Number(assesments.maxMarks);
                                    indi++;
                                } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                    totMark += Number(assesments.marks);
                                }
                            })
                            student['tmpFa1'] = avg;
                            student['tmpFa1max'] = max;
                            student['averageMarks'] = avg / indi;
                            student['totMarks'] = student['averageMarks'] + totMark;
                            student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                            if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                            if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                            if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                        })
                        MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                        MarksCtrl.studentMarksData.subjects.map(function (student) {
                            faN.subjects.map(function (fan1) {
                                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                    student['tmpFa1'] = fan1.tmpFa1;
                                    student['tmpFa1max'] = fan1.tmpFa1max;
                                    student['avgfa1'] = Math.round(fan1.totMarks * 100) / 100;
                                }
                            })
                            faN1.subjects.map(function (fan1) {
                                if (student.subjectId === fan1.subjectId && student.subjectName === fan1.subjectName) {
                                    student['tmpFa2'] = fan1.tmpFa2;
                                    student['tmpFa2max'] = fan1.tmpFa2max;
                                    student['avgfa2'] = Math.round(fan1.totMarks * 100) / 100;
                                }
                            })
                            var avg = 0;
                            var indi = 0;
                            var totMark = 0;
                            student.assesments.map(function (assesments) {
                                if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                    avg += Number(assesments.marks);
                                    indi++;
                                } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                    totMark += Number(assesments.marks);
                                }
                            })
                            var sa1avg = (student['avgfa1'] + student['avgfa2']) * 20 / 100;
                            student['averageMarks'] = Math.round(sa1avg * 100) / 100  //returns 28.45
                            var sa1total = student['averageMarks'] + totMark;
                            student['totMarks'] = Math.round(sa1total * 100) / 100  //returns 28.45
                            student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                        });

                    }


                    MarksCtrl.buildHeaders(isSummativeAssessment, tempExamName);
                    MarksCtrl.headers.splice(1, 0, fa1ExamName + '')
                    MarksCtrl.headers.splice(2, 0, fa2ExamName + '')
                    if (MarksCtrl.schoolName === 'Krishna Veni High School') {
                        if (tempExamName.toLowerCase().indexOf('sa1') !== -1) {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                            MarksCtrl.headers[3] = 'Total'
                        } else {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = "4FA's (20%)";
                            MarksCtrl.headers[3] = 'Total'
                        }
                    } else if (MarksCtrl.schoolName === 'Bhavya Talent School') {
                        MarksCtrl.headers[1] = 'Exam (80%)';
                        MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                        MarksCtrl.headers[3] = 'Total'
                    }
                    else if (MarksCtrl.schoolName === 'Vikas Model School') {
                        MarksCtrl.headers[1] = 'Exam (80%)';
                        MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                        MarksCtrl.headers[3] = 'Total'
                    }
                    else if (MarksCtrl.schoolName === 'New Bloom High School') {
                        if (tempExamName.toLowerCase().indexOf('sa1') !== -1) {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                            MarksCtrl.headers[3] = 'Total'
                        } else if (tempExamName.toLowerCase().indexOf('sa2') !== -1) {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = 'FA3 (20%)';
                            MarksCtrl.headers[3] = 'Total'
                        } else {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = 'FA1 + FA2 + FA3 + FA4 (20%)';
                            MarksCtrl.headers[3] = 'Total'
                        }
                    } else if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        if (tempExamName.toLowerCase().indexOf('sa1') !== -1) {
                            MarksCtrl.headers[1] = 'FA1 + FA2 (20M)';
                            MarksCtrl.headers[2] = 'Exam (80M)';
                            MarksCtrl.headers[3] = 'Total(100M)'
                        } else if (tempExamName.toLowerCase().indexOf('sa2') !== -1) {
                            MarksCtrl.headers[1] = 'FA3 (20M)';
                            MarksCtrl.headers[2] = 'Exam (80M)';
                            MarksCtrl.headers[3] = 'Total(100M)'
                        } else {
                            MarksCtrl.headers[1] = 'FA1 + FA2 + FA3 + FA4 (20M)';
                            MarksCtrl.headers[2] = 'Exam (80M)';
                            MarksCtrl.headers[3] = 'Total(100M)'
                        }
                    } else if (MarksCtrl.schoolName === 'VSR Model High School') {
                        MarksCtrl.headers[1] = 'Exam (80%)';
                        MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                        MarksCtrl.headers[3] = 'Total'
                    } else if (MarksCtrl.schoolName === 'Bharat Techno School') {
                        MarksCtrl.headers[1] = 'Exam (80%)';
                        MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                        MarksCtrl.headers[3] = 'Total'
                    } else if (MarksCtrl.schoolName === 'SM Rank International School') {
                        if (tempExamName.toLowerCase().indexOf('sa1') !== -1) {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = 'FA1 + FA2 (20%)';
                            MarksCtrl.headers[3] = 'Total'
                        } else {
                            MarksCtrl.headers[1] = 'Exam (80%)';
                            MarksCtrl.headers[2] = 'FA1 + FA2 + FA3 + FA4 (20%)';
                            MarksCtrl.headers[3] = 'Total'
                        }

                    }
                }

                else {
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                        MarksCtrl.studentMarksData.subjects.map(function (student) {
                            var avg = 0;
                            var indi = 0;
                            var totMark = 0;
                            student.assesments.map(function (assesments) {
                                if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                    totMark += Number(assesments.marks);
                                } else {
                                    avg += Number(assesments.marks);
                                    indi++;
                                }
                            })
                            var original = avg / indi;
                            student['averageMarks'] = Math.round(original * 100) / 100  //returns 28.45
                            var fa1nd2 = student['averageMarks'] + totMark;
                            student['totMarks'] = Math.round(fa1nd2 * 100) / 100  //returns 28.45
                            // student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                            if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                            if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                            if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                        });
                        MarksCtrl.buildHeaders(isSummativeAssessment, tempExamName);
                    } else {
                        MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
                        MarksCtrl.studentMarksData.subjects.map(function (student) {
                            var avg = 0;
                            var indi = 0;
                            var totMark = 0;
                            student.assesments.map(function (assesments) {
                                if (assesments.marks !== undefined && assesments.examtypeName == "Internals") {
                                    avg += Number(assesments.marks);
                                    indi++;
                                } else if (assesments.marks !== undefined && assesments.examtypeName == "Externals") {
                                    totMark += Number(assesments.marks);
                                }
                            })
                            var original = avg / indi;
                            student['averageMarks'] = Math.round(original * 100) / 100  //returns 28.45
                            var fa1nd2 = student['averageMarks'] + totMark;
                            student['totMarks'] = Math.round(fa1nd2 * 100) / 100  //returns 28.45
                            // student['totalMarks'] = student['totMarks'] + student['averageMarks'];
                            if (isNaN(+student['averageMarks'])) student['averageMarks'] = 0;
                            if (isNaN(+student['totMarks'])) student['totMarks'] = 0;
                            if (isNaN(+student['totalMarks'])) student['totalMarks'] = 0;
                            MarksCtrl.studentMarksData['totalOfAllSubjects'] += student['totMarks'];
                        });
                        MarksCtrl.buildHeaders(isSummativeAssessment, tempExamName);
                    }
                }

                MarksCtrl.showStudentTable = true
            });

            Student.find({ filter: { where: { id: MarksCtrl.formFields.studentId } } }, function (response) {
                MarksCtrl.studDetails = response;
            })
            Class.find({ filter: { where: { id: MarksCtrl.formFields.classId } } }, function (response) {
                MarksCtrl.classDetails = response;
            })
            School.find({ filter: { where: { id: MarksCtrl.schoolId } } }, function (response) {
                MarksCtrl.schoolLogo = response[0].logo;
                // MarksCtrl.marksTmp = response[0].tempFile;
            })
            FOexam.find({ filter: { where: { id: MarksCtrl.formFields.examId } } }, function (response) {
                MarksCtrl.tempExamName = response[0].examName;
                MarksCtrl.marksTmp = response[0].tempFile;
                if (MarksCtrl.tempExamName == "SA1") {
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.tempMarks = "SA - 1 Marks Memo"
                    } else {
                        MarksCtrl.tempMarks = "Summative Assessment - 1"
                    }
                } else if (MarksCtrl.tempExamName == "FA1") {
                    // if(MarksCtrl.formFields.formateType === 'lower'){}else{}
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.tempMarks = "FA - 1 Marks Memo"
                    } else {
                        MarksCtrl.tempMarks = "Formative Assessment - 1"
                    }
                } else if (MarksCtrl.tempExamName == "FA2") {
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.tempMarks = "FA - 2 Marks Memo"
                    } else {
                        MarksCtrl.tempMarks = "Formative Assessment - 2"
                    }
                }
                else if (MarksCtrl.tempExamName == "FA3") {
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.tempMarks = "FA - 3 Marks Memo"
                    } else {
                        MarksCtrl.tempMarks = "Formative Assessment - 3"
                    }
                }
                else if (MarksCtrl.tempExamName == "FA4") {
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.tempMarks = "FA - 4 Marks Memo"
                    } else {
                        MarksCtrl.tempMarks = "Formative Assessment - 4"
                    }
                }
                else if (MarksCtrl.tempExamName == "SA2") {
                    if (MarksCtrl.schoolName === 'Dhatrak Public School') {
                        MarksCtrl.tempMarks = "SA - 2 Marks Memo"
                    } else {
                        MarksCtrl.tempMarks = "Summative Assessment - 2"
                    }
                }else if(MarksCtrl.tempExamName == "Mid1"){
                    MarksCtrl.tempMarks = "Midterm - 1 Marks Memo"
                }else if(MarksCtrl.tempExamName == "Mid2"){
                    MarksCtrl.tempMarks = "Midterm - 2 Marks Memo"
                }
            })
        }

        MarksCtrl.buildHeaders = function (isSummativeAssessment, tempExamName) {
            MarksCtrl.headers = [];
            MarksCtrl.headers.push("Subject Name");
            MarksCtrl.studentMarksData.subjects[0].assesments.map(function (item) {
                MarksCtrl.headers.push(item.assesments)
            })
            MarksCtrl.buildSchoolSpecificHeaders(isSummativeAssessment, tempExamName);
            // MarksCtrl.headers.push("Total");
        }

        MarksCtrl.buildMkShettyFormativeData = function () {
            MarksCtrl.headers.push("Total (20%)");
            MarksCtrl.headers.push("Grade");
            var totalOfAllSubjects = 0;
            var totalOfAllMaxMarks = 0;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                student['averageMarks'] = 0;
                student['maxMarks'] = 0;
                student['totmaxMark'] = 0;
                student['totmaxMarks'] = 0;
                student.assesments.map(function (assesments) {
                    student['averageMarks'] += Number(assesments.marks);
                    student['maxMarks'] += Number(assesments.maxMarks);
                });

                var grade = Number(student['averageMarks'] / student['maxMarks']) * 100;
                if (Number(grade) >= 91) grade = 'A1';
                if (Number(grade) >= 81 && grade <= 90) grade = 'A2';
                if (Number(grade) >= 71 && grade <= 80) grade = 'B1';
                if (Number(grade) >= 61 && grade <= 70) grade = 'B2';
                if (Number(grade) >= 51 && grade <= 60) grade = 'C1';
                if (Number(grade) >= 41 && grade <= 50) grade = 'C2';
                if (Number(grade) >= 31 && grade <= 40) grade = 'D';
                if (Number(grade) >= 0 && grade <= 34) grade = 'E';
                student['totMarks'] = grade;
                if (isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = 0;
                    student['totMarks'] = '--';
                    MarksCtrl.studentMarksData['totalOfAllSubjects'] = '--'
                }
                totalOfAllSubjects += Number(student['averageMarks']);
                totalOfAllMaxMarks += Number(student['maxMarks']);

            });

            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 91) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 81 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 90) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 71 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 80) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 61 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 70) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 51 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 60) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 41 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 50) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 31 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 40) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 0 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 34) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; }

        }
        MarksCtrl.buildMkShettyFormativeDataVikas = function () {
            MarksCtrl.headers.push("Total");
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            var totalOfAllMaxMarks = 0;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                student['averageMarks'] = 0;
                student['maxMarks'] = 0;
                student['totmaxMark'] = 0;
                student['totmaxMarks'] = 0;
                student.assesments.map(function (assesments) {
                    student['averageMarks'] += Number(assesments.marks);
                    student['maxMarks'] += Number(assesments.maxMarks);
                });

                var grade = Number(student['averageMarks'] / student['maxMarks']) * 100;
                var gradePoint;
                if (Number(grade) >= 91) grade = 'A1', gradePoint = 10;
                if (Number(grade) >= 81 && grade <= 90.99) grade = 'A2', gradePoint = 9;
                if (Number(grade) >= 71 && grade <= 80.99) grade = 'B1', gradePoint = 8;
                if (Number(grade) >= 61 && grade <= 70.99) grade = 'B2', gradePoint = 7;
                if (Number(grade) >= 51 && grade <= 60.99) grade = 'C1', gradePoint = 6;
                if (Number(grade) >= 41 && grade <= 50.99) grade = 'C2', gradePoint = 5;
                if (Number(grade) >= 35 && grade <= 40.99) grade = 'D', gradePoint = 4;
                if (Number(grade) >= 0 && grade <= 34.99) grade = 'E', gradePoint = '-';

                student['totMarks'] = grade;
                student['gradePoint'] = gradePoint;
                if (isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = 0;
                    student['totMarks'] = '--';
                    MarksCtrl.studentMarksData['totalOfAllSubjects'] = '--'
                }
                totalOfAllSubjects += Number(student['averageMarks']);
                totalOfAllMaxMarks += Number(student['maxMarks']);

            });

            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 91) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalGradePoint'] = 10 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 81 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 90.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalGradePoint'] = 9 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 71 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 80.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalGradePoint'] = 8 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 61 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 70.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalGradePoint'] = 7 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 51 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 60.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalGradePoint'] = 6 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 41 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 50.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalGradePoint'] = 5 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 35 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 40.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalGradePoint'] = 4 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 0 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 34.99) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalGradePoint'] = '-' }
        }
        MarksCtrl.buildMkShettyFormativeDataVSR = function () {
            MarksCtrl.headers.push("Total");
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            var totalOfAllMaxMarks = 0;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                student['averageMarks'] = 0;
                student['maxMarks'] = 0;
                student['totmaxMark'] = 0;
                student['totmaxMarks'] = 0;
                student.assesments.map(function (assesments) {
                    student['averageMarks'] += Number(assesments.marks);
                    student['maxMarks'] += Number(assesments.maxMarks);
                });

                var grade = Number(student['averageMarks'] / student['maxMarks']) * 100;
                var gradePoint;
                if (Number(grade) >= 91) grade = 'A1', gradePoint = 10;
                if (Number(grade) >= 81 && grade <= 90.99) grade = 'A2', gradePoint = 9;
                if (Number(grade) >= 71 && grade <= 80.99) grade = 'B1', gradePoint = 8;
                if (Number(grade) >= 61 && grade <= 70.99) grade = 'B2', gradePoint = 7;
                if (Number(grade) >= 51 && grade <= 60.99) grade = 'C1', gradePoint = 6;
                if (Number(grade) >= 41 && grade <= 50.99) grade = 'C2', gradePoint = 5;
                if (Number(grade) >= 35 && grade <= 40.99) grade = 'D', gradePoint = 4;
                if (Number(grade) >= 0 && grade <= 34.99) grade = 'E', gradePoint = 3;

                student['totMarks'] = grade;
                student['gradePoint'] = gradePoint;
                if (isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = 0;
                    student['totMarks'] = '--';
                    MarksCtrl.studentMarksData['totalOfAllSubjects'] = '--'
                }
                totalOfAllSubjects += Number(student['averageMarks']);
                totalOfAllMaxMarks += Number(student['maxMarks']);

            });

            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 91) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalGradePoint'] = 10 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 81 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 90.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalGradePoint'] = 9 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 71 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 80.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalGradePoint'] = 8 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 61 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 70.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalGradePoint'] = 7 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 51 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 60.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalGradePoint'] = 6 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 41 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 50.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalGradePoint'] = 5 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 35 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 40.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalGradePoint'] = 4 }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 0 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 34.99) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalGradePoint'] = 3 }
        }
        MarksCtrl.buildMkShettyFormativeDataNBHS = function () {
            MarksCtrl.headers.push("Total (20%)");
            MarksCtrl.headers.push("Grade");
            var totalOfAllSubjects = 0;
            var totalOfAllMaxMarks = 0;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                student['averageMarks'] = 0;
                student['maxMarks'] = 0;
                student['totmaxMark'] = 0;
                student['totmaxMarks'] = 0;
                student.assesments.map(function (assesments) {
                    student['averageMarks'] += Number(assesments.marks);
                    student['maxMarks'] += Number(assesments.maxMarks);
                });

                var grade = Number(student['averageMarks'] / student['maxMarks']) * 100;
                if (Number(grade) >= 92) grade = 'A1';
                if (Number(grade) >= 83 && grade <= 91) grade = 'A2';
                if (Number(grade) >= 75 && grade <= 82) grade = 'B1';
                if (Number(grade) >= 67 && grade <= 74) grade = 'B2';
                if (Number(grade) >= 59 && grade <= 66) grade = 'C1';
                if (Number(grade) >= 51 && grade <= 58) grade = 'C2';
                if (Number(grade) >= 43 && grade <= 50) grade = 'D1';
                if (Number(grade) >= 35 && grade <= 42) grade = 'D2';
                if (Number(grade) >= 0 && grade <= 34) grade = 'E';
                student['totMarks'] = grade;
                if (isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = 0;
                    student['totMarks'] = '--';
                    MarksCtrl.studentMarksData['totalOfAllSubjects'] = '--'
                }
                totalOfAllSubjects += Number(student['averageMarks']);
                totalOfAllMaxMarks += Number(student['maxMarks']);

            });

            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 92) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 83 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 91.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 75 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 82.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 67 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 74.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 59 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 66.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 51 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 58.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 43 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 50.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D1'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 35 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 42.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D2'; }
            if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 0 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 34) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; }
        }
        MarksCtrl.buildMkShettyFormativeDataDhatrak = function () {
            MarksCtrl.headers.push("Total");
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            var totalOfAllMaxMarks = 0;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = 0;
            MarksCtrl.avgGPA = MarksCtrl.studentMarksData.subjects.length;
            // console.log(MarksCtrl.avgGPA);
            // console.log(MarksCtrl.studentMarksData.totalGradePoint);
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                student['averageMarks'] = 0;
                student['maxMarks'] = 0;
                student['totmaxMark'] = 0;
                student['totmaxMarks'] = 0;
                student.assesments.map(function (assesments) {
                    student['averageMarks'] += Number(assesments.marks);
                    student['maxMarks'] += Number(assesments.maxMarks);
                });

                var grade = Number(student['averageMarks'] / student['maxMarks']) * 100;
                var gradePoint;

                if (MarksCtrl.formFields.formateType === 'lower') {
                    // console.log("lower");
                    if (Number(grade) >= 91) grade = 'A1', gradePoint = 10;
                    if (Number(grade) >= 81 && grade <= 90.99) grade = 'A2', gradePoint = 9;
                    if (Number(grade) >= 71 && grade <= 80.99) grade = 'B1', gradePoint = 8;
                    if (Number(grade) >= 61 && grade <= 70.99) grade = 'B2', gradePoint = 7;
                    if (Number(grade) >= 51 && grade <= 60.99) grade = 'C1', gradePoint = 6;
                    if (Number(grade) >= 41 && grade <= 50.99) grade = 'C2', gradePoint = 5;
                    if (Number(grade) >= 34 && grade <= 40.99) grade = 'D', gradePoint = 4;
                    if (Number(grade) >= 0 && grade <= 33.99) grade = 'E', gradePoint = 3;
                } else {
                    if (Number(grade) >= 92.50) grade = 'A1', gradePoint = 10;
                    if (Number(grade) >= 82.50 && grade <= 92.49) grade = 'A2', gradePoint = 9;
                    if (Number(grade) >= 72.50 && grade <= 82.49) grade = 'B1', gradePoint = 8;
                    if (Number(grade) >= 62.50 && grade <= 72.49) grade = 'B2', gradePoint = 7;
                    if (Number(grade) >= 52.50 && grade <= 62.49) grade = 'C1', gradePoint = 6;
                    if (Number(grade) >= 42.50 && grade <= 52.49) grade = 'C2', gradePoint = 5;
                    if (Number(grade) >= 34.50 && grade <= 42.49) grade = 'D', gradePoint = 4;
                    if (Number(grade) >= 0 && grade <= 34.49) grade = 'E', gradePoint = 3;
                }
                student['totMarks'] = grade;
                student['gradePoint'] = gradePoint;
                if (isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = 0;
                    student['totMarks'] = '--';
                    MarksCtrl.studentMarksData['totalOfAllSubjects'] = '--'
                }
                totalOfAllSubjects += Number(student['averageMarks']);
                totalOfAllMaxMarks += Number(student['maxMarks']);

            });
            var gradeTotals = 0;
            MarksCtrl.avgOfTotalGPA;
            for (var i = 0; i < MarksCtrl.studentMarksData.subjects.length; i++) {
                gradeTotals += MarksCtrl.studentMarksData.subjects[i].gradePoint;
                MarksCtrl.avgOfTotalGPA = Math.round((gradeTotals / MarksCtrl.studentMarksData.subjects.length) * 100) / 100;
            }
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            if (MarksCtrl.formFields.formateType === 'lower') {
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 92) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 82 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 91.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 72 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 81.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 62 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 71.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 52 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 61.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 42 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 51.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 32 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 41.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 0 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 31.99) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
            } else {
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 93) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 83 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 92.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 73 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 82.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 63 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 72.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 53 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 62.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 43 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 52.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 35 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 42.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }
                if (((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) >= 0 && ((Number(MarksCtrl.studentMarksData['totalOfAllSubjects']) / totalOfAllMaxMarks) * 100) <= 34.99) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalGradePoint'] = MarksCtrl.avgOfTotalGPA }

            }
        }
        MarksCtrl.buildMkShettySummativeData = function () {
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            // var totalOfGPA = 0;
            var calSaGrade = 0;
            var addpsbs = 10;
            var addpsbs1 = 20;
            var totalGrand = 0;
            var avgfa1fa2max = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                var tmpFa1Max1 = student.tmpFa1max;
                var tmpFa2Max2 = student.tmpFa2max;
                avgfa1fa2max = (tmpFa1Max1 + tmpFa2Max2) / 2;
                totalGrand += avgfa1fa2max + parseInt(student.assesments[0].maxMarks);

                calSaGrade = student.assesments[0].maxMarks;

                var parsecalsagrade = parseInt(calSaGrade);
                if (parsecalsagrade == 80) {
                    parsecalsagrade += addpsbs1;
                } else if (parsecalsagrade == 40) {
                    parsecalsagrade += addpsbs;
                }

                student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2']) / 2;
                if (isNaN(+student['avgfa2'])) {
                    student['avgfa2'] = 0;
                }
                var totalOfWritten = 0;
                var totalOfMaxWritten = 0;
                student.assesments.map(function (assesments) {
                    totalOfWritten += Number(assesments.marks);
                    totalOfMaxWritten += Number(assesments.maxMarks);


                });
                student['avgfa1'] = student['avgfa2'] + totalOfWritten;
                if (isNaN(+student['avgfa1'])) {
                    student['avgfa1'] = 0;
                }
                var grade = Number(student['avgfa1'] / parsecalsagrade) * 100;
                if (Number(grade) >= 91) { grade = 'A1'; student['totMarks'] = 10; }
                if (Number(grade) >= 81 && grade <= 90.99) { grade = 'A2'; student['totMarks'] = 9; }
                if (Number(grade) >= 71 && grade <= 80.99) { grade = 'B1'; student['totMarks'] = 8; }
                if (Number(grade) >= 61 && grade <= 70.99) { grade = 'B2'; student['totMarks'] = 7; }
                if (Number(grade) >= 51 && grade <= 60.99) { grade = 'C1'; student['totMarks'] = 6; }
                if (Number(grade) >= 41 && grade <= 50.99) { grade = 'C2'; student['totMarks'] = 5; }
                if (Number(grade) >= 31 && grade <= 40.99) { grade = 'D'; student['totMarks'] = 4; }
                if (Number(grade) >= 0 && grade <= 34.99) { grade = 'E'; student['totMarks'] = 3; }
                student['averageMarks'] = grade;
                if (!isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = '--';
                }

                totalOfAllSubjects += student['avgfa1'];
                // totalOfGPA += student['totMarks'];
                var temp = student['avgfa1'];
                student['avgfa1'] = totalOfWritten;
                if (isNaN(+student['avgfa1'])) {
                    student['avgfa1'] = 0;
                }
                student.assesments.map(function (assesments) {
                    if (isNaN(+assesments.marks)) {
                        assesments.marks = 0;
                    }
                    assesments.marks = temp
                });
            });
            MarksCtrl.studentMarksData['totalOfGrand'] = totalGrand;

            MarksCtrl.studentMarksData['SecuredByTotal'] = totalOfAllSubjects / MarksCtrl.studentMarksData['totalOfGrand'] * 100;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            // MarksCtrl.studentMarksData['totalOfGPA'] = totalOfGPA;
            MarksCtrl.studentMarksData['totalGrade'] = '';
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 91) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalOfGPA'] = 10; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 81 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 90) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalOfGPA'] = 9; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 71 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 80) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalOfGPA'] = 8; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 61 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 70) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalOfGPA'] = 7; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 51 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 60) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalOfGPA'] = 6; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 41 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 50) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalOfGPA'] = 5; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 31 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 40) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalOfGPA'] = 4; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 0 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 34) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalOfGPA'] = 3; }

        }
        MarksCtrl.buildMkShettySummativeDataKVHS = function (tempExamName) {
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            // var totalOfGPA = 0;
            var calSaGrade = 0;
            var addpsbs = 10;
            var addpsbs1 = 20;
            var totalGrand = 0;
            var avgfa1fa2max = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                switch (tempExamName) {
                    case "SA1": {
                        var tmpFa1Max1 = student.tmpFa1max;
                        var tmpFa2Max2 = student.tmpFa2max;
                        avgfa1fa2max = (tmpFa1Max1 + tmpFa2Max2) / 2;
                        break;
                    }
                    case "SA2": {
                        var tmpFa1Max1 = student.tmpFa1max;
                        var tmpFa2Max2 = student.tmpFa2max;
                        var tmpFa3Max3 = student.tmpFa3max;
                        var tmpFa4Max4 = student.tmpFa4max;
                        avgfa1fa2max = (tmpFa1Max1 + tmpFa2Max2 + tmpFa3Max3 + tmpFa4Max4) / 4;
                        break;
                    }
                }
                totalGrand += avgfa1fa2max + parseInt(student.assesments[0].maxMarks);

                calSaGrade = student.assesments[0].maxMarks;

                var parsecalsagrade = parseInt(calSaGrade);
                if (parsecalsagrade == 80) {
                    parsecalsagrade += addpsbs1;
                } else if (parsecalsagrade == 40) {
                    parsecalsagrade += addpsbs;
                }

                switch (tempExamName) {
                    case "SA1": {
                        student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2']) / 2;
                        break;
                    }
                    case "SA2": {
                        student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / 4;
                        break;
                    }
                }
                // student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / 4;
                if (isNaN(+student['avgfa2'])) {
                    student['avgfa2'] = 0;
                }
                var totalOfWritten = 0;
                var totalOfMaxWritten = 0;
                student.assesments.map(function (assesments) {
                    totalOfWritten += Number(assesments.marks);
                    totalOfMaxWritten += Number(assesments.maxMarks);


                });
                student['avgfa1'] = student['avgfa2'] + totalOfWritten;
                if (isNaN(+student['avgfa1'])) {
                    student['avgfa1'] = 0;
                }
                var grade = Number(student['avgfa1'] / parsecalsagrade) * 100;
                if (Number(grade) >= 91) { grade = 'A1'; student['totMarks'] = 10; }
                if (Number(grade) >= 81 && grade <= 90.99) { grade = 'A2'; student['totMarks'] = 9; }
                if (Number(grade) >= 71 && grade <= 80.99) { grade = 'B1'; student['totMarks'] = 8; }
                if (Number(grade) >= 61 && grade <= 70.99) { grade = 'B2'; student['totMarks'] = 7; }
                if (Number(grade) >= 51 && grade <= 60.99) { grade = 'C1'; student['totMarks'] = 6; }
                if (Number(grade) >= 41 && grade <= 50.99) { grade = 'C2'; student['totMarks'] = 5; }
                if (Number(grade) >= 31 && grade <= 40.99) { grade = 'D'; student['totMarks'] = 4; }
                if (Number(grade) >= 0 && grade <= 34.99) { grade = 'E'; student['totMarks'] = 3; }
                student['averageMarks'] = grade;
                if (!isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = '--';
                }

                totalOfAllSubjects += Math.round(student['avgfa1'] * 100) / 100;
                // totalOfAllSubjects += student['avgfa1'];
                // totalOfGPA += student['totMarks'];
                var temp = student['avgfa1'];
                student['avgfa1'] = totalOfWritten;
                if (isNaN(+student['avgfa1'])) {
                    student['avgfa1'] = 0;
                }
                student.assesments.map(function (assesments) {
                    if (isNaN(+assesments.marks)) {
                        assesments.marks = 0;
                    }
                    var temp1 = Math.round(temp * 100) / 100;
                    assesments.marks = temp1
                });
            });
            MarksCtrl.studentMarksData['totalOfGrand'] = totalGrand;

            MarksCtrl.studentMarksData['SecuredByTotal'] = totalOfAllSubjects / MarksCtrl.studentMarksData['totalOfGrand'] * 100;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            // MarksCtrl.studentMarksData['totalOfGPA'] = totalOfGPA;
            MarksCtrl.studentMarksData['totalGrade'] = '';
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 91) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalOfGPA'] = 10; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 81 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 90) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalOfGPA'] = 9; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 71 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 80) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalOfGPA'] = 8; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 61 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 70) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalOfGPA'] = 7; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 51 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 60) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalOfGPA'] = 6; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 41 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 50) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalOfGPA'] = 5; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 31 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 40) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalOfGPA'] = 4; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 0 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 34) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalOfGPA'] = 3; }

        }

        MarksCtrl.buildMkShettySummativeDataNBHS = function (tempExamName) {
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            // var totalOfGPA = 0;
            var calSaGrade = 0;
            var addpsbs = 10;
            var addpsbs1 = 20;
            var totalGrand = 0;
            var avgfa1fa2max = 0;
            MarksCtrl.studentMarksData.subjects.map(function (student) {
                switch (tempExamName) {
                    case "SA1": {
                        var tmpFa1Max1 = student.tmpFa1max;
                        var tmpFa2Max2 = student.tmpFa2max;
                        avgfa1fa2max = (tmpFa1Max1 + tmpFa2Max2) / 2;
                        break;
                    }
                    case "SA2": {
                        var tmpFa1Max1 = student.tmpFa1max;
                        avgfa1fa2max = (tmpFa1Max1);
                        break;
                    }
                    case "SA3": {
                        var tmpFa1Max1 = student.tmpFa1max;
                        var tmpFa2Max2 = student.tmpFa2max;
                        var tmpFa3Max3 = student.tmpFa3max;
                        var tmpFa4Max4 = student.tmpFa4max;
                        avgfa1fa2max = (tmpFa1Max1 + tmpFa2Max2 + tmpFa3Max3 + tmpFa4Max4) / 4;
                        break;
                    }
                }
                totalGrand += avgfa1fa2max + parseInt(student.assesments[0].maxMarks);

                calSaGrade = student.assesments[0].maxMarks;

                var parsecalsagrade = parseInt(calSaGrade);
                if (parsecalsagrade == 80) {
                    parsecalsagrade += addpsbs1;
                } else if (parsecalsagrade == 40) {
                    parsecalsagrade += addpsbs;
                }

                switch (tempExamName) {
                    case "SA1": {
                        student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2']) / 2;
                        break;
                    }
                    case "SA2": {
                        student['avgfa2'] = (student['tmpFa1']) / 1;
                        break;
                    }
                    case "SA3": {
                        student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / 4;
                        break;
                    }
                }
                // student['avgfa2'] = (student['tmpFa1'] + student['tmpFa2'] + student['tmpFa3'] + student['tmpFa4']) / 4;
                if (isNaN(+student['avgfa2'])) {
                    student['avgfa2'] = 0;
                }
                var totalOfWritten = 0;
                var totalOfMaxWritten = 0;
                student.assesments.map(function (assesments) {
                    totalOfWritten += Number(assesments.marks);
                    totalOfMaxWritten += Number(assesments.maxMarks);


                });
                student['avgfa1'] = student['avgfa2'] + totalOfWritten;
                if (isNaN(+student['avgfa1'])) {
                    student['avgfa1'] = 0;
                }
                var grade = Number(student['avgfa1'] / parsecalsagrade) * 100;
                if (Number(grade) >= 92) { grade = 'A1'; student['totMarks'] = 10; }
                if (Number(grade) >= 83 && grade <= 91.99) { grade = 'A2'; student['totMarks'] = 9; }
                if (Number(grade) >= 75 && grade <= 82.99) { grade = 'B1'; student['totMarks'] = 8; }
                if (Number(grade) >= 67 && grade <= 74.99) { grade = 'B2'; student['totMarks'] = 7; }
                if (Number(grade) >= 59 && grade <= 66.99) { grade = 'C1'; student['totMarks'] = 6; }
                if (Number(grade) >= 51 && grade <= 58.99) { grade = 'C2'; student['totMarks'] = 5; }
                if (Number(grade) >= 43 && grade <= 50.99) { grade = 'D1'; student['totMarks'] = 4; }
                if (Number(grade) >= 35 && grade <= 42.99) { grade = 'D2'; student['totMarks'] = 3; }
                if (Number(grade) >= 0 && grade <= 34.99) { grade = 'E'; student['totMarks'] = ''; }
                student['averageMarks'] = grade;
                if (!isNaN(+student['averageMarks'])) {
                    student['averageMarks'] = '--';
                }

                totalOfAllSubjects += Math.round(student['avgfa1'] * 100) / 100;
                // totalOfAllSubjects += student['avgfa1'];
                // totalOfGPA += student['totMarks'];
                var temp = student['avgfa1'];
                student['avgfa1'] = totalOfWritten;
                if (isNaN(+student['avgfa1'])) {
                    student['avgfa1'] = 0;
                }
                student.assesments.map(function (assesments) {
                    if (isNaN(+assesments.marks)) {
                        assesments.marks = 0;
                    }
                    var temp1 = Math.round(temp * 100) / 100;
                    assesments.marks = temp1
                });
            });
            MarksCtrl.studentMarksData['totalOfGrand'] = totalGrand;

            MarksCtrl.studentMarksData['SecuredByTotal'] = totalOfAllSubjects / MarksCtrl.studentMarksData['totalOfGrand'] * 100;
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = totalOfAllSubjects;
            // MarksCtrl.studentMarksData['totalOfGPA'] = totalOfGPA;
            MarksCtrl.studentMarksData['totalGrade'] = '';
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 92) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalOfGPA'] = 10; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 83 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 91.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalOfGPA'] = 9; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 75 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 82.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalOfGPA'] = 8; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 67 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 74.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalOfGPA'] = 7; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 59 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 66.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C1'; MarksCtrl.studentMarksData['totalOfGPA'] = 6; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 51 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 58.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalOfGPA'] = 5; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 43 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 50.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D1'; MarksCtrl.studentMarksData['totalOfGPA'] = 4; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 35 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 42.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D2'; MarksCtrl.studentMarksData['totalOfGPA'] = 3; }
            if (Number(MarksCtrl.studentMarksData['SecuredByTotal']) >= 0 && MarksCtrl.studentMarksData['SecuredByTotal'] <= 34.99) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalOfGPA'] = ''; }
        }

        MarksCtrl.buildMkShettySummativeDataDPS = function (tempExamName) {
            MarksCtrl.headers.push("Grade");
            MarksCtrl.headers.push("Grade Point");
            var totalOfAllSubjects = 0;
            // var totalOfGPA = 0;
            var calSaGrade = 0;
            var addpsbs = 10;
            var addpsbs1 = 20;
            var totalGrand = 0;
            var avgfa1fa2max = 0;

            MarksCtrl.studentMarksData.subjects.map(function (student) {
                var assigme = 0;
                var max = 0;
                student['avgfa1max'] = 20;
                totalGrand += student['avgfa1max'];
                totalOfAllSubjects += student['avgfa1'];
                assigme += student['avgfa1'];
                student.assesments.map(function (item) {
                    if (item.marks) {
                        assigme += item.marks;
                        totalOfAllSubjects += item.marks;
                    }
                    if (item.maxMarks) {
                        max += Number(item.maxMarks);
                        totalGrand += 80;
                    }
                });
                student['averageMarks'] = assigme;
                max += 20;
                student['maxxxxxxxxxxxxxxx'] = max;

                var grade = student['averageMarks'];
                if (Number(grade) >= 91) { student['totMarks'] = 'A1'; student['gradePoint'] = 10; }
                if (Number(grade) >= 81 && grade <= 90.99) { student['totMarks'] = 'A2'; student['gradePoint'] = 9; }
                if (Number(grade) >= 71 && grade <= 80.99) { student['totMarks'] = 'B1'; student['gradePoint'] = 8; }
                if (Number(grade) >= 61 && grade <= 70.99) { student['totMarks'] = 'B2'; student['gradePoint'] = 7; }
                if (Number(grade) >= 51 && grade <= 60.99) { student['totMarks'] = 'C1'; student['gradePoint'] = 6; }
                if (Number(grade) >= 41 && grade <= 50.99) { student['totMarks'] = 'C2'; student['gradePoint'] = 5; }
                if (Number(grade) >= 35 && grade <= 40.99) { student['totMarks'] = 'D'; student['gradePoint'] = 4; }
                if (Number(grade) >= 0 && grade <= 34.99) { student['totMarks'] = 'E'; student['gradePoint'] = 3; }
            });
            MarksCtrl.studentMarksData['totalGrade'] = '';
            MarksCtrl.studentMarksData['totalOfAllSubjects'] = Number(totalOfAllSubjects);
            var grade = (totalOfAllSubjects / totalGrand) * 100;
            console.log(totalGrand);
            console.log(grade);
            if (Number(grade) >= 91) { MarksCtrl.studentMarksData['totalGrade'] = 'A1'; MarksCtrl.studentMarksData['totalOfGPA'] = 10; }
            if (Number(grade) >= 81 && grade <= 90.99) { MarksCtrl.studentMarksData['totalGrade'] = 'A2'; MarksCtrl.studentMarksData['totalOfGPA'] = 9; }
            if (Number(grade) >= 71 && grade <= 80.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B1'; MarksCtrl.studentMarksData['totalOfGPA'] = 8; }
            if (Number(grade) >= 61 && grade <= 70.99) { MarksCtrl.studentMarksData['totalGrade'] = 'B2'; MarksCtrl.studentMarksData['totalOfGPA'] = 7; }
            if (Number(grade) >= 51 && grade <= 60.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalOfGPA'] = 6; }
            if (Number(grade) >= 41 && grade <= 50.99) { MarksCtrl.studentMarksData['totalGrade'] = 'C2'; MarksCtrl.studentMarksData['totalOfGPA'] = 5; }
            if (Number(grade) >= 35 && grade <= 40.99) { MarksCtrl.studentMarksData['totalGrade'] = 'D'; MarksCtrl.studentMarksData['totalOfGPA'] = 4; }
            if (Number(grade) >= 0 && grade <= 34.99) { MarksCtrl.studentMarksData['totalGrade'] = 'E'; MarksCtrl.studentMarksData['totalOfGPA'] = 3; }
        }

        MarksCtrl.buildSchoolSpecificHeaders = function (isSummativeAssessment, tempExamName) {
            switch (MarksCtrl.schoolName) {
                case "Krishna Veni High School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeData();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeDataKVHS(tempExamName);
                    break;
                }
                case "Vikas Model School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeDataVikas();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeData();
                    break;
                }
                case "Bhavya Talent School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeData();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeData();
                    break;
                }
                case "New Bloom High School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeDataNBHS();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeDataNBHS(tempExamName);
                    break;
                }
                case "Dhatrak Public School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeDataDhatrak();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeDataDPS(tempExamName);
                    break;
                } case "VSR Model High School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeDataVSR();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeData();
                    break;
                }
                case "Bharat Techno School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeData();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeData();
                    break;
                }
                case "SM Rank International School": {
                    if (!isSummativeAssessment) MarksCtrl.buildMkShettyFormativeData();
                    else if (isSummativeAssessment) MarksCtrl.buildMkShettySummativeData();
                    break;
                }

                default: {
                    MarksCtrl.headers.push("Average of Internals");
                    MarksCtrl.headers.push("Total of Exam");
                    break;
                }
            }
        }

        MarksCtrl.getSumOfMarks = function (subject) {
            var total = 0;
            _.each(subject.subSections, function (section) {
                if (section.marks) {
                    total = total + parseFloat(section.marks);
                }
            });

            return total;
        }
        MarksCtrl.pdf = function () {
            if (MarksCtrl.classDetails[0].sectionName === ".") {
                MarksCtrl.classDetails[0].sectionName = "";
            }
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
                    $timeout(function () {
                        kendo.drawing.pdf.saveAs(group, MarksCtrl.studDetails[0].firstName + "-" + MarksCtrl.tempExamName + "-" + MarksCtrl.classDetails[0].className + MarksCtrl.classDetails[0].sectionName + ".pdf");
                        document.getElementById('pdf2').style.display = 'none';
                        if (MarksCtrl.classDetails[0].sectionName === "") {
                            MarksCtrl.classDetails[0].sectionName = ".";
                        }
                    }, 1000);
                });
            // $timeout(function () {
            //     document.getElementById('pdf2').style.display = 'none';
            //     if (MarksCtrl.classDetails[0].sectionName === "") {
            //         MarksCtrl.classDetails[0].sectionName = ".";
            //     }
            // }, 6000);
        }
        MarksCtrl.reset = function () {
            // MarksCtrl.formFields.examId = '';
            document.getElementById('marks_datatable1').style.display = 'none';
        }
        MarksCtrl.examTable = function () {
            document.getElementById('marks_datatable1').style.display = 'none';
            $timeout(function () { document.getElementById('marks_datatable1').style.display = 'block'; }, 5000);


        }
      
    });