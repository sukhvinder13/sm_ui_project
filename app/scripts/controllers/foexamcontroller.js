'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:FoexamcontrollerCtrl
 * @description
 * # FoexamcontrollerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('Foexamcontroller', function (configService, FoexamService, Class, $cookies, FOexam, toastr, APP_MESSAGES, $timeout, generateexcelFactory, ExamType, Student, $window, $http) {
    var FoexamsCtrl = this;
    FoexamsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    FoexamsCtrl.role = $cookies.get('role');
    FoexamsCtrl.loginId = $cookies.getObject('uds').id;
    FoexamsCtrl.subjectWithMarks = [];
    FoexamsCtrl.pusharray = [];
    FoexamsCtrl.editmode = false;

    FoexamsCtrl.schoolName = '';
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Create Exam") {
        FoexamsCtrl.roleView = roleAccess[0].RolesData[i].view;
        FoexamsCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        FoexamsCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

    }
    //get sschool name and generate respective data in required format.
    FoexamsCtrl.getSchoolName = function () {
      $http.get(configService.baseUrl() + '/Schools/' + $cookies.getObject('uds').schoolId)
        .then(function (response) {
          FoexamsCtrl.access = false;
          if(response.data.marksFormat1 === "TEMP2") FoexamsCtrl.access = true;
          FoexamsCtrl.schoolName = response.data.schoolName;
        }, function (error) { });
    };
    FoexamsCtrl.getSchoolName();

    //Intialization function started
    function Init() {
      this.getClassList = function () {
        //Get Class List
        Class.find({
          filter: {
            where: {
              schoolId: FoexamsCtrl.schoolId
            }
          }
        }, function (response) {
          FoexamsCtrl.classData = response;
        }, function (error) { });
      };
      this.getFoExamList = function () {
        if (FoexamsCtrl.role == "Admin" || FoexamsCtrl.role == "Accountant") {
          //Get Class List
          FOexam.find({
            filter: {
              where: {
                schoolId: FoexamsCtrl.schoolId
              },
              include: 'class'
            }
          }, function (response) {
            FoexamsCtrl.foexamData = response;
            for (var i = 0; i < FoexamsCtrl.foexamData.length; i++) {
              for (var w = 0; w < FoexamsCtrl.foexamData[i].subjectList.length; w++) {
                FoexamsCtrl.foexamData[i].subjectList[w].marksInt = []
                FoexamsCtrl.maxmumarks = 0;
                for (var q = 0; q < FoexamsCtrl.foexamData[i].subjectList[w].assesments.length; q++) {

                  if (FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName === 'Externals') {

                    FoexamsCtrl.foexamData[i].subjectList[w].marksInt[1] = [{
                      "type": FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName,
                      "inMarks": JSON.parse(FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks)
                    }]
                  }
                  if (FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName === 'Internals') {
                    var maxMarkCheck = FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks ? FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks : 0;
                    FoexamsCtrl.maxmumarks += JSON.parse(maxMarkCheck);

                    FoexamsCtrl.foexamData[i].subjectList[w].marksInt[0] = [{
                      "type": FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName,
                      "inMarks": FoexamsCtrl.maxmumarks
                    }]
                  }
                }

              }
            }


          }, function (error) { });
        }
        else if (FoexamsCtrl.role == "Staff") {
          //Get Class List
          FOexam.find({
            filter: {
              where: {
                schoolId: FoexamsCtrl.schoolId
              },
              include: 'class'
            }
          }, function (response) {
            FoexamsCtrl.foexamData = response;
            for (var i = 0; i < FoexamsCtrl.foexamData.length; i++) {
              for (var w = 0; w < FoexamsCtrl.foexamData[i].subjectList.length; w++) {
                FoexamsCtrl.foexamData[i].subjectList[w].marksInt = []
                FoexamsCtrl.maxmumarks = 0;
                for (var q = 0; q < FoexamsCtrl.foexamData[i].subjectList[w].assesments.length; q++) {

                  if (FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName === 'Externals') {

                    FoexamsCtrl.foexamData[i].subjectList[w].marksInt[1] = [{
                      "type": FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName,
                      "inMarks": JSON.parse(FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks)
                    }]
                  }
                  if (FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName === 'Internals') {
                    var maxMarkCheck = FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks ? FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks : 0;
                    FoexamsCtrl.maxmumarks += JSON.parse(maxMarkCheck);

                    FoexamsCtrl.foexamData[i].subjectList[w].marksInt[0] = [{
                      "type": FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName,
                      "inMarks": FoexamsCtrl.maxmumarks
                    }]
                  }
                }

              }
            }


          }, function (error) { });
        }
        else if (FoexamsCtrl.role == "Student") {
          Student.find({ filter: { where: { id: FoexamsCtrl.loginId } } }, function (res) {
            FOexam.find({
              filter: {
                where: {
                  schoolId: FoexamsCtrl.schoolId,
                  classId: res[0].classId
                },
                include: 'class'
              }
            }, function (response) {
              FoexamsCtrl.foexamData = response;
              for (var i = 0; i < FoexamsCtrl.foexamData.length; i++) {
                for (var w = 0; w < FoexamsCtrl.foexamData[i].subjectList.length; w++) {
                  FoexamsCtrl.foexamData[i].subjectList[w].marksInt = []
                  FoexamsCtrl.maxmumarks = 0;
                  for (var q = 0; q < FoexamsCtrl.foexamData[i].subjectList[w].assesments.length; q++) {

                    if (FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName === 'Externals') {

                      FoexamsCtrl.foexamData[i].subjectList[w].marksInt[1] = [{
                        "type": FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName,
                        "inMarks": JSON.parse(FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks)
                      }]
                    }
                    if (FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName === 'Internals') {
                      var maxMarkCheck = FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks ? FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].maxMarks : 0;
                      FoexamsCtrl.maxmumarks += JSON.parse(maxMarkCheck);

                      FoexamsCtrl.foexamData[i].subjectList[w].marksInt[0] = [{
                        "type": FoexamsCtrl.foexamData[i].subjectList[w].assesments[q].examtypeName,
                        "inMarks": FoexamsCtrl.maxmumarks
                      }]
                    }
                  }

                }
              }


            }, function (error) { });
          })

        }

      };
      this.getFotypeList = function () {
        //Get Class List
        ExamType.find({
          filter: {
            where: {
              schoolId: FoexamsCtrl.schoolId
            }
          }
        }, function (response) {
          FoexamsCtrl.ExamTypeList = response;
        }, function (error) { });
      };
    }
    (new Init()).getClassList();
    (new Init()).getFoExamList();
    (new Init()).getFotypeList();

    //Template ImageUpdation
    FoexamsCtrl.uploadTempImage = function (index) {
      FoexamsCtrl.file = document.getElementById('templateFile').files[0];
      var fd = new FormData();
      fd.append('file', FoexamsCtrl.file);
      var uploadUrl = configService.baseUrl() +"/ImageContainers/ExamTemplates/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {

            FoexamsCtrl.file = configService.baseUrl() +'/ImageContainers/ExamTemplates/download/' + response.data.result[0].filename;
          }
        }, function (error) { });
    };

    FoexamsCtrl.classChange = function (data) {
      FoexamService.getFoSubjectDetailsByClassId(data).then(function (result) {
        if (result) {
          FoexamsCtrl.Fosubjectdata = result;
          //console.log.log(JSON.stringify(FoexamsCtrl.Fosubjectdata));
        }
      }, function (error) {
        //console.log.log('Error while deleting class. Error Stack' + error);
      });
    };

    FoexamsCtrl.setExamDate = function (value, outer, inner) {
      FoexamsCtrl.Fosubjectdata[outer]['assesments'][inner]['examDate'] = value;
    }
    FoexamsCtrl.setMaximumMarks = function (value, outer, inner) {
      FoexamsCtrl.Fosubjectdata[outer]['assesments'][inner]['maxMarks'] = value;
    }
    //Select Checkbox
    FoexamsCtrl.clickChkbk = function (tid) {
      if (document.getElementById('isAgeSelected').checked) {
        //console.log.log("selected")
      } else {
        //console.log.log("unchecked");
      }
      ExamType.find({
        filter: {
          where: {
            id: tid
          }
        }
      }, function (response) {
        FoexamsCtrl.checkData = response;
        var examtypeName = FoexamsCtrl.checkData[0]['examtypeName'];
        FoexamsCtrl.checkData[0]['assesments'].map(function (item) {
          item['examtypeName'] = examtypeName
        });
        FoexamsCtrl.Fosubjectdata.map(function (item) {
          if (item['assesments'] === undefined)
            item['assesments'] = []
        })
        FoexamsCtrl.checkData[0]['assesments'].map(function (item) {
          FoexamsCtrl.Fosubjectdata.map(function (inner) {
            var isMatch = false;
            var removeIndex;
            if (inner.assesments.length === 0) {
              item['maxMarks'] = '';
              item['examDate'] = '';
              var obj = angular.copy(item)
              inner.assesments.push(obj)
            } else {
              inner['assesments'].map(function (findMatch, index) {
                if (findMatch.assesments == item.assesments && findMatch.examtypeName == item.examtypeName) {
                  isMatch = true;
                  removeIndex = index;
                }
              });
              if (!isMatch) {
                item['maxMarks'] = '';
                item['examDate'] = '';
                var obj = angular.copy(item)
                inner['assesments'].push(obj);
              } else
                inner['assesments'].splice(removeIndex, 1);
            }
          })
        });
      }, function (error) {
        //console.log.log(response);
      });


    }
    // Add Action
    FoexamsCtrl.examAction = function (invalid) {
      ////console.log.log(FoexamsCtrl.Fosubjectdata);
      if (invalid) {
        return;
      }
      // for (var i = 0; i < FoexamsCtrl.Fosubjectdata.length; i++) {
      //   FoexamsCtrl.subjectWithMarks.push({ "subjectName": FoexamsCtrl.Fosubjectdata[i].subjectName, "subjectId": FoexamsCtrl.Fosubjectdata[i].id, "maximumMark": FoexamsCtrl.Fosubjectdata[i].maximumMark, "examDate": FoexamsCtrl.Fosubjectdata[i].examDate});
      // }
      // var data = {
      //   schoolId: FoexamsCtrl.schoolId,
      //   examName: FoexamsCtrl.formFields.examName,
      //   classId: FoexamsCtrl.formFields.classId,
      //   examType: FoexamsCtrl.formFields.examTypeId,
      //   subjectList: FoexamsCtrl.subjectWithMarks

      // };
      var data = {
        schoolId: FoexamsCtrl.schoolId,
        examName: FoexamsCtrl.formFieldsexamName,
        classId: FoexamsCtrl.formFieldsclassId,
        examType: FoexamsCtrl.formFieldsexamTypeId,
        tempFile: FoexamsCtrl.file,
        subjectList: []

      };
      //console.log.log('data from controller : ', FoexamsCtrl.Fosubjectdata)
      FoexamsCtrl.Fosubjectdata.map(function (item) {
        data.subjectList.push({
          "subjectName": item.subjectName,
          "assesments": item.assesments,
          "subjectId": item.id ? item.id : item.subjectId
        });
      })
      if (data) {

        if (FoexamsCtrl.editmode) {
          data.id = FoexamsCtrl.editingExamlistId;
          FoexamService.editExamlist(data).then(function (result) {
            if (result) {
              FoexamsCtrl.clearFields();
              FoexamsCtrl.closeModal();
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              (new Init()).getFoExamList();
              // $window.location.reload();

            }
          }, function (error) {
            if (error) {
              FoexamsCtrl.closeModal();
              toastr.error(APP_MESSAGES.SERVER_ERROR);
            }
          });
        } else {
          FoexamService.getExistingfoExamlists(data).then(function (result) {
            if (result) {
              toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
            }
          }, function (result1) {
            if (result1.status === 404) {
              FoexamService.CreateOrUpdateFoExam(data).then(function (result) {
                if (result) {
                  FoexamsCtrl.clearFields();
                  //Close Modal Window
                  FoexamsCtrl.closeModal();
                  //Show Toast
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  (new Init()).getFoExamList();
                  // $window.location.reload();
                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
          });
        }
      }
    };
    //Edit Action
    FoexamsCtrl.editExamlist = function (id) {
      var index = "";
      for (var i = 0; i < FoexamsCtrl.foexamData.length; i++) {
        if (FoexamsCtrl.foexamData[i].id == id) {
          var index = i;
        }
      }
      FoexamsCtrl.openModal();
      FoexamsCtrl.formFieldsexamName = FoexamsCtrl.foexamData[index].examName;
      FoexamsCtrl.formFieldsclassId = FoexamsCtrl.foexamData[index].classId;
      FoexamsCtrl.myTempUpload = FoexamsCtrl.foexamData[index].tempFile;
      FoexamsCtrl.Fosubjectdata = FoexamsCtrl.foexamData[index].subjectList;
      for (var i = 0; i < FoexamsCtrl.Fosubjectdata.length; i++) {
        for (var q = 0; q < FoexamsCtrl.Fosubjectdata[i].assesments.length; q++) {
          if (FoexamsCtrl.Fosubjectdata[i].assesments[q].examDate === null) {


          } else {
            FoexamsCtrl.Fosubjectdata[i].assesments[q].examDate = new Date(FoexamsCtrl.Fosubjectdata[i].assesments[q].examDate);
          }
        }
      }
      for (var m = 0; m < FoexamsCtrl.Fosubjectdata.length; m++) {
        for (var e = 0; e < FoexamsCtrl.Fosubjectdata[m].assesments.length; e++) {
          for (var a = 0; a < FoexamsCtrl.ExamTypeList.length; a++) {
            if (FoexamsCtrl.ExamTypeList[a].examtypeName == FoexamsCtrl.Fosubjectdata[m].assesments[e].examtypeName) {
              FoexamsCtrl.ExamTypeList[a].exams = true;
            }

          }
        }
      }
      FoexamsCtrl.editingExamlistId = FoexamsCtrl.foexamData[index].id;

      //Set View Mode false
      FoexamsCtrl.detailsMode = false;
      //Open Modal
      FoexamsCtrl.openModal();

      $timeout(function () {

        FoexamsCtrl.setFloatLabel();
        //Enable Edit Mode
        FoexamsCtrl.editmode = true;
      });
    };
    // More detailsMode
    FoexamsCtrl.showMoreDetails = function (id) {
      var index = "";
      for (var i = 0; i < FoexamsCtrl.foexamData.length; i++) {
        if (FoexamsCtrl.foexamData[i].id == id) {
          var index = i;
        }
      }
      FoexamsCtrl.openModal1();
      FoexamsCtrl.formFieldsexamName = FoexamsCtrl.foexamData[index].examName;
      FoexamsCtrl.formFieldsclassId = FoexamsCtrl.foexamData[index].classId;
      FoexamsCtrl.myTempUpload = FoexamsCtrl.foexamData[index].tempFile;
      FoexamsCtrl.examtypeName = FoexamsCtrl.foexamData[index].examtypeName;

      FoexamsCtrl.Fosubjectdata = FoexamsCtrl.foexamData[index].subjectList;
      for (var i = 0; i < FoexamsCtrl.Fosubjectdata.length; i++) {
        for (var q = 0; q < FoexamsCtrl.Fosubjectdata[i].assesments.length; q++) {

          if (FoexamsCtrl.Fosubjectdata[i].assesments[q].examDate === null) {


          } else {
            FoexamsCtrl.Fosubjectdata[i].assesments[q].examDate = new Date(FoexamsCtrl.Fosubjectdata[i].assesments[q].examDate);
          }
        }
      }
      FoexamsCtrl.editingExamlistId = FoexamsCtrl.foexamData[index].id;

      //Set View Mode false
      FoexamsCtrl.detailsMode = false;
      //Open Modal
      FoexamsCtrl.openModal1();

      $timeout(function () {

        FoexamsCtrl.setFloatLabel();
        //Enable Edit Mode
        // FoexamsCtrl.editmode = true;
      });

    };
    // ends here


    //Setting up float label
    FoexamsCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=subjectName]'));
    };
    //Delete Action
    var deleteFoexam = function (index) {
      FoexamsCtrl.formFieldsclassId = FoexamsCtrl.classId;
      if (FoexamsCtrl.foexamData) {
        FoexamService.deleteFoExam(index).then(function (result) {
          if (result) {
            //On Successfull refill the data list
            (new Init()).getFoExamList();
            FoexamsCtrl.closeModal();
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
            (new Init()).getFoExamList();
          }
        }, function (error) {
          //console.log.log('Error while deleting class. Error Stack' + error);
        });
      }
    };
    //Delete confirmation box
    FoexamsCtrl.confirmCallbackMethod = function (index) {
      deleteFoexam(index);
    };
    //Delete cancel box
    FoexamsCtrl.confirmCallbackCancel = function (index) {
      if (index) {
        return false;
      }
      return;
    };
    //popup open
    FoexamsCtrl.openModal = function () {
      var modal = $('#myModal');
      modal.modal('show');
    };
    //Pop up CLose
    FoexamsCtrl.closeModal = function () {
      var modal = $('#myModal');
      modal.modal('hide');
    };
    //popup open
    FoexamsCtrl.openModal1 = function () {
      var modal = $('#moreDetails');
      modal.modal('show');
    };
    //Pop up CLose
    FoexamsCtrl.closeModal1 = function () {
      var modal = $('#moreDetails');
      modal.modal('hide');
    };
    //Export to Excel
    FoexamsCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };
    //Bhasha Print View
    FoexamsCtrl.printData = function () {
      var divToPrint = document.getElementById("foexamsprintTable");
      FoexamsCtrl.newWin = window.open("");
      FoexamsCtrl.newWin.document.write(divToPrint.outerHTML);
      FoexamsCtrl.newWin.print();
      FoexamsCtrl.newWin.close();
    }
    FoexamsCtrl.viewClass = function () {
      FoexamsCtrl.formFieldsclassId = FoexamsCtrl.classId;
      if (FoexamsCtrl.formFieldsclassId === undefined) {
        return;
      }
      FoexamsCtrl.classChange(FoexamsCtrl.formFieldsclassId);
    }
    //End Print View
    //Pdf View
    FoexamsCtrl.exportToPDF = function () {
      html2canvas(document.getElementById('printTable'), {
        onrendered: function (canvas) {
          var data = canvas.toDataURL();
          var docDefinition = {
            content: [{
              image: data,
              width: 500,
            }]
          };
          pdfMake.createPdf(docDefinition).download("test.pdf");
        }
      });

    };

    FoexamsCtrl.getDates = function (date, indes) {
      data.examDate = new Date(data.examDate);
    }

    FoexamsCtrl.clearFields = function () {

      // window.location.reload();
      FoexamsCtrl.formFieldsexamName = "";
      FoexamsCtrl.formFieldsclassId = "";
      FoexamsCtrl.Fosubjectdata = [];
      FoexamsCtrl.myTempUpload = ""
    }



  });