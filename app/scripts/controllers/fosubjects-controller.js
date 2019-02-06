'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:FosubjectsControllerCtrl
 * @description
 * # FosubjectsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('FosubjectsController', function (fosubjectsService,$scope, $cookies, Class, Staff, APP_MESSAGES, Student, $timeout, toastr, School, FOsubject, $window, $location, generateexcelFactory, Subject) {
    var FosubjectsCtrl = this;
    FosubjectsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    FosubjectsCtrl.loginId = $cookies.getObject('uds').id;
    FosubjectsCtrl.role = $cookies.get('role');
    FosubjectsCtrl.showForPdf = true;
    //console.log(FosubjectsCtrl.role);
    // console.log($cookies.getObject('uds'));
    if(FosubjectsCtrl.role=='Student'){
    FosubjectsCtrl.classId = $cookies.getObject('uds').classId;
    $timeout(function(){
      FosubjectsCtrl.chooseClass(FosubjectsCtrl.classId);
      FosubjectsCtrl.viewTable(FosubjectsCtrl.classId)
    },1000);
    }
    FosubjectsCtrl.internalRow = [];
    FosubjectsCtrl.externalRow = [];
 var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
     
      for(var i = 0; i<roleAccess[0].RolesData.length;i++){
          if(roleAccess[0].RolesData[i].name === "Subject"){
            FosubjectsCtrl.roleView = roleAccess[0].RolesData[i].view;
            FosubjectsCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
            FosubjectsCtrl.roledelete = roleAccess[0].RolesData[i].delete;
          }
          
      }
    //Intialization function started
    function Init() {
      this.getClassList = function () {
        //Get Class List
        if (FosubjectsCtrl.role === "Admin") {
          Class.find({ filter: { where: { schoolId: FosubjectsCtrl.schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
            FosubjectsCtrl.classData = response;
          }, function (error) {
          });
        } else if (FosubjectsCtrl.role === "Accountant") {
          Class.find({ filter: { where: { schoolId: FosubjectsCtrl.schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
            FosubjectsCtrl.classData = response;
          }, function (error) {
          });
        } else if (FosubjectsCtrl.role === "Staff") {
          School.find({ filter: { where: { id: FosubjectsCtrl.schoolId } } }, function (res) {
            if (res[0].marksFormat == "FO") {
              FOsubject.find({ filter: { where: { schoolId: FosubjectsCtrl.schoolId, staffId: FosubjectsCtrl.loginId }, include: ['class', 'staff'] } }, function (response) {
                if (response) {
                  if (Array.isArray(response)) {
                    var newArray = response.filter(function (thing, index, self) {
                      return self.findIndex(function (t) {
                        return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                      }) === index;
                    });
                    FosubjectsCtrl.classData = newArray;
                  }
                }
              });
            } else if (res[0].marksFormat !== "FO") {
              FOsubject.find({ filter: { where: { schoolId: FosubjectsCtrl.schoolId, staffId: FosubjectsCtrl.loginId }, include: ['class', 'staff'] } }, function (response) {
                if (response) {
                  if (Array.isArray(response)) {
                    var newArray = response.filter(function (thing, index, self) {
                      return self.findIndex(function (t) {
                        return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                      }) === index;
                    });
                    FosubjectsCtrl.classData = newArray;
                  }
                }
              });
            }
          }, function (error) {
          });
        } else {
          Student.find({ filter: { where: { id: FosubjectsCtrl.loginId } } }, function (res) {
            Class.find({ filter: { where: { id: res[0].classId }, order: 'sequenceNumber ASC' } }, function (response) {
              FosubjectsCtrl.classData = response;
            });
          }, function (error) {
          });
        }

      };
      this.getStaffList = function () {
        Staff.find({ filter: { where: { schoolId: FosubjectsCtrl.schoolId } } }, function (response) {
          FosubjectsCtrl.staffData = response;
        }, function (error) {
        });
      };

    }
    (new Init()).getClassList();
    (new Init()).getStaffList();
    FosubjectsCtrl.viewTable = function (classId) {
      FosubjectsCtrl.class = classId;
      fosubjectsService.getClassDetailsBySchoolId(FosubjectsCtrl.class, FosubjectsCtrl.schoolId, FosubjectsCtrl.role, FosubjectsCtrl.loginId).then(function (result) {
        if (result) {
          FosubjectsCtrl.fosubjectData = result;
        }
      }, function (error) {
      });
    }
    // Validations
     function formValidations() {
      //subject should be more then 0
      if (FosubjectsCtrl.formFields.subjectName == undefined)
        return 'Please select SubjectName ';
      //class has to be selected
      if (FosubjectsCtrl.formFields.classId == undefined )
        return 'Please Select Class ';
      //Staff Namehas to be selected
      if (FosubjectsCtrl.formFields.staffName == undefined )
        return 'Please Select Subject Teacher Name ';

      return undefined;
    }
    // ends
    //********************************** Create or Update New Record
        $scope.first = true;

    FosubjectsCtrl.CreateOrUpdate = function (invalid) {
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      $scope.first = !$scope.first;

      if (invalid) {
        return;
      }
      var data = {
        schoolId: FosubjectsCtrl.schoolId,
        classId: FosubjectsCtrl.formFields.classId,
        subjectName: FosubjectsCtrl.formFields.subjectName,
        staffId: FosubjectsCtrl.formFields.staffName,
        examFlag: FosubjectsCtrl.formFields.examFlag
      };

      if (data) {
        if (FosubjectsCtrl.editmode) {
          data.id = FosubjectsCtrl.editingfoSubjectId;
          fosubjectsService.updateFOSubject(data).then(function (result) {
            if (result) {
              FosubjectsCtrl.closeModal();
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              $scope.first = !$scope.first;
              FosubjectsCtrl.viewTable(FosubjectsCtrl.classId);
            }
          }, function (error) {
            if (error) {
              FosubjectsCtrl.closeModal();
              toastr.error(APP_MESSAGES.SERVER_ERROR);
              $scope.first = !$scope.first;
            }
          });
        }
        else {
          fosubjectsService.verifyDataExistsOrNot(data).then(function (result) {
            if (result) {
              toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
              $scope.first = !$scope.first;
            }
          }, function (result1) {
            if (result1.status === 404) {
              fosubjectsService.CreateFOsubject(data).then(function (result) {
                if (result) {
                  //Close Modal Window
                  FosubjectsCtrl.closeModal();
                  //Show Toast
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                FosubjectsCtrl.viewTable(FosubjectsCtrl.classId);
                $scope.first = !$scope.first;
                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                $scope.first = !$scope.first;
              });
            }
          });
        }
      }
    };
    //Edit Subject
    FosubjectsCtrl.editFoSubject = function (index) {
      FosubjectsCtrl.formFields.subjectName = FosubjectsCtrl.fosubjectData[index].subjectName;
      FosubjectsCtrl.formFields.classId = FosubjectsCtrl.fosubjectData[index].classId;
      FosubjectsCtrl.formFields.staffName = FosubjectsCtrl.fosubjectData[index].staffId;
      FosubjectsCtrl.formFields.examFlag = FosubjectsCtrl.fosubjectData[index].examFlag;
      FosubjectsCtrl.internalRow = FosubjectsCtrl.fosubjectData[index].internals;
      FosubjectsCtrl.externalRow = FosubjectsCtrl.fosubjectData[index].externals;
      FosubjectsCtrl.editingfoSubjectId = FosubjectsCtrl.fosubjectData[index].id;

      //Open Modal
      FosubjectsCtrl.openModal();

      $timeout(function () {
        FosubjectsCtrl.setFloatLabel();
        FosubjectsCtrl.editmode = true;
        FosubjectsCtrl.viewValue = FosubjectsCtrl.fosubjectData[index];
      });
    };
    //Setting up float label
    FosubjectsCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=subjectName]'));
    };
    //Delete Action
    var deleteFosubject = function (index) {
      if (FosubjectsCtrl.fosubjectData) {
        fosubjectsService.deleteFOsubject(FosubjectsCtrl.fosubjectData[index].id).then(function (result) {
          if (result) {
            //On Successfull refill the data list
            (new Init()).getFOsubjectList();
            FosubjectsCtrl.closeModal();
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
            (new Init()).getFOsubjectList();
          }
        }, function (error) {
        });
      }
    };
    //Delete confirmation box
    FosubjectsCtrl.confirmCallbackMethod = function (index) {
      deleteFosubject(index);
    };
    //Delete cancel box
    FosubjectsCtrl.confirmCallbackCancel = function (index) {
      if (index) {
        return false;
      }
      return;
    };
    //Add Neew ROw For Internal Block
    FosubjectsCtrl.addOneTimeRow = function (subInternals) {

      FosubjectsCtrl.internalRow.push({
      });
    };
    FosubjectsCtrl.addExOneTimeRow = function (subExternals) {

      FosubjectsCtrl.externalRow.push({
      });
    };
    //popup open
    FosubjectsCtrl.openModal = function () {
      var modal = $('#edit-fosubject');
      modal.modal('show');
    };
    FosubjectsCtrl.closeModal = function () {
      var modal = $('#edit-fosubject');
      modal.modal('hide');
      clearformfields();
    };
    function clearformfields() {
      FosubjectsCtrl.formFields = {};
    }
    //Export to Excel
    FosubjectsCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };

    FosubjectsCtrl.chooseClass = function (classId) {
      document.getElementById('showTable').style.display = 'block';
      FosubjectsCtrl.classId = classId;
      fosubjectsService.getClassRecordsByClassId(FosubjectsCtrl.classId).then(function (result) {
        if (result) {
          FosubjectsCtrl.subjectList = result;
        }
      }, function (error) {
      });

    };
    //Bhasha Print View
    FosubjectsCtrl.printData = function () {
      var divToPrint = document.getElementById("fosubjectsprintTable");
      FosubjectsCtrl.newWin = window.open("");
      FosubjectsCtrl.newWin.document.write(divToPrint.outerHTML);
      FosubjectsCtrl.newWin.print();
      FosubjectsCtrl.newWin.close();
    }

    //End Print View
    //Pdf View
    FosubjectsCtrl.exportToPDF = function () {
      // html2canvas(document.getElementById('printTable'), {
      //   onrendered: function (canvas) {
      //     var data = canvas.toDataURL();
      //     var docDefinition = {
      //       content: [{
      //         image: data,
      //         width: 500,
      //       }]
      //     };
      //     pdfMake.createPdf(docDefinition).download("test.pdf");
      //   }
      // });
      kendo.drawing
      .drawDOM("#fosubjectsprintTable",
      {
        paperSize: "A4",
        margin: { top: "2cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
        scale: 0.5,
        height: 500,
        image_compression: { FAST: "FAST" }
      })
      .then(function (group) {
        // group.children[0] = group.children[group.children.length - 1]
        // group.children.splice(1);
        $timeout(function () {
          kendo.drawing.pdf.saveAs(group, "SUBJECTS.pdf");
        }, 1000);
      });
$timeout(function(){
  FosubjectsCtrl.showForPdf=true;
},1000);
    };
    FosubjectsCtrl.classSelect =function(){
      FosubjectsCtrl.formFields.classId=FosubjectsCtrl.classId;
    }
    FosubjectsCtrl.routeToLsnPlnr = function (stuid) {
        $location.url('lessonplanner/' + stuid);

    };
  });
