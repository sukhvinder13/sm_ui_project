'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BonafideControllerCtrl
 * @description
 * # BonafideControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('BonafideControllerCtrl', function (School, $cookies, Class, Student, FoMarksService, $timeout) {
    var BonafideCtrl = this;
    BonafideCtrl.schoolId = $cookies.getObject('uds').schoolId;
    BonafideCtrl.role = $cookies.get('role');
    BonafideCtrl.loginId = $cookies.getObject('uds').id;
    School.find({
      filter: {
        where: {
          id: BonafideCtrl.schoolId
        }
      }
    }, function (response) {
      BonafideCtrl.schoolInfo = response;
      BonafideCtrl.schoolLogo = response[0].logo;
    })
    BonafideCtrl.selectClass = function () {
      document.getElementById('selectClass').style = 'block';

      Class.find({
        filter: {
          where: {
            schoolId: BonafideCtrl.schoolId
          }
        }
      }, function (response) {
        BonafideCtrl.classInfo = response;
        BonafideCtrl.classId = response[0].classId;
      })
    };
    BonafideCtrl.selectClassStudent = function () {
      document.getElementById('selectStudent').style = 'block';
      if (BonafideCtrl.formFields.classId) {
        FoMarksService.getStudentsByClassId(BonafideCtrl.formFields.classId, BonafideCtrl.schoolId, BonafideCtrl.role, BonafideCtrl.loginId).then(function (result2) {
          if (result2) {
            BonafideCtrl.studentList = result2;
          }
        });
      }
    };
    // BonafideCtrl.viewButtons = function(){

    // }
    BonafideCtrl.printResult = function () {
      document.getElementById('printButton').style = 'block';
      document.getElementById('printButton1').style = 'block';
      document.getElementById('pdfButton').style = 'block';
      document.getElementById('pdfButton1').style = 'block';
      BonafideCtrl.res = _.filter(BonafideCtrl.studentList, {
        'classId': BonafideCtrl.formFields.classId,
        'id': BonafideCtrl.formFields.studentId
      });
      BonafideCtrl.firstName = BonafideCtrl.res[0].firstName;
      BonafideCtrl.lastName = BonafideCtrl.res[0].lastName;
      BonafideCtrl.fatherName = BonafideCtrl.res[0].fatherName;
      BonafideCtrl.className = BonafideCtrl.res[0].className;
      BonafideCtrl.sectionName = BonafideCtrl.res[0].sectionName;
      BonafideCtrl.dateofBirth = BonafideCtrl.res[0].DOB;
      BonafideCtrl.admissionNo = BonafideCtrl.res[0].registrationNo;
      BonafideCtrl.dateofJoin = BonafideCtrl.res[0].DOJ;
      BonafideCtrl.classofAdmission = BonafideCtrl.res[0].classofAdmission;
      BonafideCtrl.issueDate = new Date();
      BonafideCtrl.DOBFormat = BonafideCtrl.res[0].DOB;
      console.log(BonafideCtrl.DOBFormat)
      var d = new Date();
      var date = BonafideCtrl.dateofJoin;
      var input = date.split("-");
      var dateObject = new Date(input[2] + "-" + input[1] + "-" + input[0]);
      BonafideCtrl.joinYear = dateObject.getFullYear();
      BonafideCtrl.currentYear = d.getFullYear();
      Class.find({
        filter: {
          where: {
            id: BonafideCtrl.formFields.classId
          }
        }
      }, function (response) {
        BonafideCtrl.classInfo = response;
        BonafideCtrl.className = response[0].className;
        BonafideCtrl.sectionName = response[0].sectionName;
      });
    }
    BonafideCtrl.printExpense = function () {
      School.find({
        filter: {
          where: {
            id: BonafideCtrl.schoolId
          }
        }
      }, function (response) {
        BonafideCtrl.studSchoolList = response;
        BonafideCtrl.studSchoolList[0].logo = response[0].logo;
      });
    }

    BonafideCtrl.printExpense1 = function () {
      var divToPrint = document.getElementById("Expprint");
      BonafideCtrl.newWin = window.open("");
      BonafideCtrl.newWin.document.write(divToPrint.innerHTML);
      $timeout(function () {
        BonafideCtrl.newWin.print();
        BonafideCtrl.newWin.close();
        BonafideCtrl.selectClass();
      }, 1000);
    }

    BonafideCtrl.printExpense2 = function () {

      var divToPrint = document.getElementById("Expprint1");
      BonafideCtrl.newWin = window.open("");
      BonafideCtrl.newWin.document.write(divToPrint.innerHTML);
      $timeout(function () {
        BonafideCtrl.newWin.print();
        BonafideCtrl.newWin.close();
        BonafideCtrl.selectClass();
      }, 1000);
    }





    BonafideCtrl.pdf = function () {
      document.getElementById('pdf').style.display = 'block';
      kendo.drawing
        .drawDOM("#pdf", {
          paperSize: "A4",
          // margin: { top: "1cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
          scale: 0.5,
          height: 500,
          image_compression: {
            FAST: "FAST"
          }
        })
        .then(function (group) {
          group.children[0] = group.children[group.children.length - 1]
          group.children.splice(1);
          $timeout(function () {
            var name = BonafideCtrl.res[0].firstName + "_" + BonafideCtrl.res[0].lastName + "_" + BonafideCtrl.classInfo[0].className
            kendo.drawing.pdf.saveAs(group, name + "_" + ".pdf");
            document.getElementById('pdf').style.display = 'none';
            BonafideCtrl.selectClass();
          }, 1000);
        });
    }



    BonafideCtrl.pdf1 = function () {
      document.getElementById('pdf1').style.display = 'block';
      kendo.drawing
        .drawDOM("#pdf1", {
          paperSize: "A4",
          // margin: { top: "1cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
          scale: 0.5,
          height: 500,
          image_compression: {
            FAST: "FAST"
          }
        })
        .then(function (group) {
          group.children[0] = group.children[group.children.length - 1]
          group.children.splice(1);
          $timeout(function () {
            var name = BonafideCtrl.res[0].firstName + "_" + BonafideCtrl.res[0].lastName + "_" + BonafideCtrl.classInfo[0].className
            kendo.drawing.pdf.saveAs(group, name + "_" + ".pdf");
            document.getElementById('pdf1').style.display = 'none';
            BonafideCtrl.selectClass();
          }, 1000);
        });
    }
  });