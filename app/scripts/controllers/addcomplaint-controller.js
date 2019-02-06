'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AddcomplaintControllerCtrl
 * @description
 * # AddcomplaintControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AddcomplaintController', function (addcomplaintService, Complaint, $cookies, $q, $timeout, generateexcelFactory, $scope, Student, Staff, toastr, APP_MESSAGES, Class) {
    var compleintCtrl = this;
    compleintCtrl.schoolId = $cookies.getObject('uds').schoolId;
    compleintCtrl.loginId = $cookies.getObject('uds').id;
    compleintCtrl.role = $cookies.get('role');
    compleintCtrl.status1 = false;
    compleintCtrl.showForPdf = true;
    var classId = "aas";
    $timeout(function () {
      if (compleintCtrl.role == 'Staff') {
        compleintCtrl.studentDetails(compleintCtrl.classId);
        compleintCtrl.studentId = $cookies.getObject('uds').id;
      }
    }, 2000);


    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Complaint") {
        compleintCtrl.roleView = roleAccess[0].RolesData[i].view;
        compleintCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        compleintCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

    }
    function Init() {
      //Get list of fees details by school ID
      this.getComplaintDetails = function () {
        addcomplaintService.getComplaintDetailsBySchoolId(compleintCtrl.schoolId, compleintCtrl.role, compleintCtrl.loginId).then(function (response) {
          if (response) {
            compleintCtrl.compleintList = response;
          }
        }, function (error) {
          //console.log.log('Error while fetching Fees details records. Error Stack : ' + error);
        });
      };
      this.getClassDetails = function () {
        addcomplaintService.getClassDetailsBySchoolId(compleintCtrl.schoolId, compleintCtrl.role, compleintCtrl.loginId).then(function (result) {
          if (result) {
            compleintCtrl.classList = result;
          }
        }, function (error) {
          //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
        })
      };
      this.getDataStaffList = function (classId) {
        if (compleintCtrl.role === 'Staff' || classId === "") {
          // compleintCtrl.studentDetails = function (classId) {
          addcomplaintService.getStudentData(classId, compleintCtrl.loginId, compleintCtrl.role).then(function (sucess) {
            if (sucess) {
              compleintCtrl.studentData = sucess;

            }
          });
          // };
        };
      }
      // this.getListComplain = function () {
      //   if (compleintCtrl.role == "Admin") {
      //     Complaint.find({
      //       filter: {
      //         where: {
      //           schoolId: compleintCtrl.schoolId
      //         },
      //         include: ['class', 'student']
      //       }
      //     }, function (result) {
      //       if (result) {
      //         compleintCtrl.complainList = result;
      //       }
      //     })
      //   } else if (compleintCtrl.role == "Staff") {
      //     Complaint.find({
      //       filter: {
      //         where: {
      //           loginId:compleintCtrl.loginId
      //         },
      //       }
      //     }, function (result) {
      //       if (result) {
      //         compleintCtrl.complainList = result;
      //       }
      //     })
      //   } else if (compleintCtrl.role == "Student") {
      //     Complaint.find({
      //       filter: {
      //         where: {
      //           schoolId: compleintCtrl.schoolId,
      //           loginId:compleintCtrl.loginId
      //         },
      //         include: ['class', 'student']
      //       }
      //     }, function (result) {
      //       if (result) {
      //         compleintCtrl.complainList = result;
      //       }
      //     })
      //   }

      // };
      // this.getClassList = function () {
      //   if (compleintCtrl.role == "Admin") {
      //     Class.find({
      //       filter: {
      //         where: {
      //           schoolId: compleintCtrl.schoolId
      //         }
      //       }
      //     }, function (response) {
      //       if (response) {
      //         compleintCtrl.classList = response;
      //       }
      //     });
      //   } else if (compleintCtrl.role == "Staff") {
      //     Class.find({
      //       filter: {
      //         where: {
      //           schoolId: compleintCtrl.schoolId
      //         }
      //       }
      //     }, function (response) {
      //       if (response) {
      //         compleintCtrl.classList = response;
      //       }
      //     });
      //   } else if (compleintCtrl.role == "Student") {
      //     Class.find({
      //       filter: {
      //         where: {
      //           schoolId: compleintCtrl.schoolId
      //         }
      //       }
      //     }, function (response) {
      //       if (response) {
      //         compleintCtrl.classList = response;
      //       }
      //     });
      //   };
      // }
    }

    (new Init()).getComplaintDetails();
    (new Init()).getClassDetails();
    (new Init()).getDataStaffList(classId);
    // (new Init()).getListComplain();

    //By Default Student name displaying start
    compleintCtrl.setByDefault = function () {
      if (compleintCtrl.role == 'Student') {
        compleintCtrl.classId = compleintCtrl.classList[0].id;
        compleintCtrl.studentDetails(compleintCtrl.classId);
        $timeout(function () {
          compleintCtrl.studentId = compleintCtrl.studentData[0].id;
        }, 1000)


      } else if (compleintCtrl.role == 'Staff') {
        (new Init()).getDataStaffList(classId);
        //  $timeout(function () {
        //   console.log(compleintCtrl.studentData);
        //   compleintCtrl.studentId = compleintCtrl.studentData[0].id;
        //   console.log("sid--" + compleintCtrl.studentId);
        // }, 1000)

      }
    }
    //By Default Student name displaying End



    // Add Action

    // compleintCtrl.findUserData = function(){
    //   // $timeout(function () {
    //     if(compleintCtrl.role=='Student'){
    //       compleintCtrl.classId=$cookies.getObject('uds').classId;
    //       compleintCtrl.studentDetails(compleintCtrl.classId);
    //       compleintCtrl.studentId=$cookies.getObject('uds').id;
    //       compleintCtrl.mobile = $cookies.getObject('uds').contact;
    //     }else if(compleintCtrl.role=='Staff'){
    //       compleintCtrl.studentDetails(compleintCtrl.classId);
    //       compleintCtrl.studentId=$cookies.getObject('uds').id;
    //     }    
    //   // }, 2000);
    // }
    compleintCtrl.CompleintAction = function () {
      if (compleintCtrl.role == 'Staff') {
        compleintCtrl.classId = "";
      } else if (compleintCtrl.role == 'Student') {
        compleintCtrl.classId = compleintCtrl.classList[0].id;
      }
      // console.log(compleintCtrl.studentId);
      // console.log(compleintCtrl.role);
      // if(compleintCtrl.role=="Admin"){

      // }
      var message = formValidations1(compleintCtrl.classId);
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      // if (invalid) {
      //   return;
      // }
      var data = {
        schoolId: compleintCtrl.schoolId,
        completetype: compleintCtrl.compty,
        loginId: compleintCtrl.loginId,
        mobile: compleintCtrl.mobile,
        description: compleintCtrl.description,
        name: compleintCtrl.studentId ? compleintCtrl.studentId : compleintCtrl.loginId,
        action: compleintCtrl.action,
        docomp: compleintCtrl.docomp,
        class: compleintCtrl.classId,
        updatedDate: compleintCtrl.updatedDate,
        status: compleintCtrl.status,
        role: compleintCtrl.role
      };
      console.log(data);
      Complaint.create({

        schoolId: data.schoolId,
        completetype: data.completetype,
        loginId: data.loginId,
        mobile: data.mobile,
        description: data.description,
        studentId: data.name,
        classId: data.class,
        action: data.action,
        docomp: data.docomp,
        Complain: data.Complain,
        updatedDate: data.updatedDate,
        status: data.status,
        createdBy: data.role
      }, function (succes) {

        if (succes) {
          compleintCtrl.clearfields();
          compleintCtrl.closeModal1();

          (new Init()).getComplaintDetails();
        }
      })

    };

    compleintCtrl.complaintlist = function (invalid) {
      if (compleintCtrl.createdBy !== 'Staff') {
        var message = formValidations();
        if (message != undefined && message.trim().length > 1) {
          alert(message);
          return;
        }
      }
      var data = {
        id: compleintCtrl.editingNoticeId,
        schoolId: compleintCtrl.schoolId,
        completetype: compleintCtrl.compty,
        mobile: compleintCtrl.mobile,
        description: compleintCtrl.description,
        name: compleintCtrl.name,
        action: compleintCtrl.action,
        docomp: compleintCtrl.docomp,
        updatedDate: compleintCtrl.updatedDate,
        status: compleintCtrl.status,
        createdBy: compleintCtrl.createdBy,
      };
      Complaint.upsert({
        id: data.id,
        schoolId: data.schoolId,
        completetype: data.completetype,
        mobile: data.mobile,
        description: data.description,
        name: data.name,
        action: data.action,
        docomp: data.docomp,
        Complain: data.Complain,
        updatedDate: compleintCtrl.updatedDate,
        status: compleintCtrl.status,
        createdBy: data.createdBy
      }, function (succes) {
        if (succes) {
          compleintCtrl.clearfields();
          compleintCtrl.closeModal();
          (new Init()).getComplaintDetails();
          toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
        }
      })
    }
    compleintCtrl.closeModal = function () {
      var modal = $('#edit-Compleint');
      modal.modal('hide');
    };
    compleintCtrl.closeModal1 = function () {
      var modal = $('#edit-Compleint2');
      modal.modal('hide');
    }

    compleintCtrl.openModal = function () {
      var modal = $('#edit-Compleint');
      modal.modal('show');

    };
    compleintCtrl.openModal1 = function () {
      var modal = $('#edit-Compleint2');
      modal.modal('show');
    }
    //Export to Excel
    compleintCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };
    //Bhasha Print View
    compleintCtrl.printData = function () {
      var divToPrint = document.getElementById("printData1");
      compleintCtrl.newWin = window.open("");
      compleintCtrl.newWin.document.write(divToPrint.outerHTML);
      compleintCtrl.newWin.print();
      compleintCtrl.newWin.close();
    }

    //End Print View
    compleintCtrl.editcompleintlist = function (id) {
      // Complaint.find({filter:{where:{id:id}}},function(res){
      //   console.log(res);
      // })
      var index = "";
      for (var i = 0; i < compleintCtrl.compleintList.length; i++) {
        if (compleintCtrl.compleintList[i].id == id) {
          var index = i;
        }
      }
      compleintCtrl.hideClass = compleintCtrl.compleintList[index].classId;
      compleintCtrl.classId = compleintCtrl.compleintList[index].classId;
      compleintCtrl.studentId = compleintCtrl.compleintList[index].studentId;
      compleintCtrl.status = compleintCtrl.compleintList[index].status;
      compleintCtrl.updatedDate = compleintCtrl.compleintList[index].updatedDate;
      compleintCtrl.compty = compleintCtrl.compleintList[index].completetype;
      compleintCtrl.mobile = compleintCtrl.compleintList[index].mobile;
      compleintCtrl.description = compleintCtrl.compleintList[index].description;
      compleintCtrl.name = compleintCtrl.compleintList[index].name;
      compleintCtrl.action = compleintCtrl.compleintList[index].action;
      compleintCtrl.edate = new Date(compleintCtrl.compleintList[index].docomp);
      compleintCtrl.docomp = compleintCtrl.edate;
      compleintCtrl.Complain = compleintCtrl.compleintList[index].Complain;
      compleintCtrl.updatedDate = compleintCtrl.compleintList[index].updatedDate;
      compleintCtrl.status = compleintCtrl.compleintList[index].status;
      compleintCtrl.createdBy = compleintCtrl.compleintList[index].createdBy;
      compleintCtrl.openModal();
      compleintCtrl.editingNoticeId = compleintCtrl.compleintList[index].id;
      if (compleintCtrl.classId === "") {

        compleintCtrl.staffDetails();
      } else {
        compleintCtrl.studentDetails(compleintCtrl.classId);
      }
    }
    compleintCtrl.clearfields = function () {
      compleintCtrl.compty = "";
      compleintCtrl.mobile = "";
      compleintCtrl.description = "";
      compleintCtrl.name = "";
      compleintCtrl.action = "";
      compleintCtrl.docomp = "";
      compleintCtrl.Complain = "";
      compleintCtrl.updatedDate = "";
      compleintCtrl.status = "";
      compleintCtrl.classId = "";
      compleintCtrl.studentId = "";
      compleintCtrl.updatedDate = "";
      compleintCtrl.status = "";
      compleintCtrl.studentData = [];


    }
    compleintCtrl.confirmCallbackCancel = function (index) { }
    compleintCtrl.confirmCallbackMethod = function (id) {
      var index = "";
      for (var i = 0; i < compleintCtrl.compleintList.length; i++) {
        if (compleintCtrl.compleintList[i].id == id) {
          var index = i;
        }
      }
      deleteComplaint(index);
    }
    var deleteComplaint = function (index) {

      if (compleintCtrl.compleintList) {
        addcomplaintService.deleteComplaint(compleintCtrl.compleintList[index].id).then(function (result) {
          if (result) {
            compleintCtrl.closeModal();
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
            (new Init()).getComplaintDetails();
          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          //console.log('Error while deleting Notices. Error Stack' + error);
        });
      }
    }
    compleintCtrl.studentDetails = function (classId) {
      addcomplaintService.getStudentData(classId, compleintCtrl.loginId, compleintCtrl.role).then(function (sucess) {
        if (sucess) {
          compleintCtrl.studentData = sucess;
        }
      });
    };

    compleintCtrl.staffDetails = function () {
      Staff.find({
        filter: {
          where: {
            schoolId: compleintCtrl.schoolId
          }
        }
      }, function (result) {
        if (result) {
          compleintCtrl.studentData = result;
        }
      })
    }

    compleintCtrl.detailsMode1 = function (list) {
      compleintCtrl.listName = list.Name;
      compleintCtrl.detailsMode = true;
      compleintCtrl.openModal1();
      Complaint.find({
        filter: {
          where: {
            id: list.id
          },
          include: ['student', 'class']
        }
      }, function (response) {
        compleintCtrl.complainListShow = response;
      });
      Student.find({
        filter: {
          where: {
            id: list.studentId
          }
        }
      }, function (response) {
        compleintCtrl.complainListShow.firstName = response[0].firstName + " " + response[0].lastName;
      });
      Staff.find({
        filter: {
          where: {
            id: list.studentId
          }
        }
      }, function (response) {
        compleintCtrl.complainListShow.firstName = response[0].firstName + " " + response[0].lastName;
      });
    }
    compleintCtrl.todayDate = function () {
      compleintCtrl.docomp = new Date();
    }
    compleintCtrl.todayDate1 = function () {
      compleintCtrl.updatedDate = new Date();
    }


    compleintCtrl.statusFun = function (status) {
      if (status === "Resolved" || status === "Closed") {
        compleintCtrl.status1 = true;
      } else {
        compleintCtrl.status1 = false;
      }
    }

    compleintCtrl.getUserName = function (list) {
      // console.log(list)
      Student.find({
        filter: {
          where: {
            id: list.studentId
          }
        }
      }, function (response) {
        list['Name'] = response[0].firstName + " " + response[0].lastName;
        Class.find({ filter: { where: { id: response[0].classId } } }, function (res) {
          list['className'] = res[0].className + " " + res[0].sectionName;
        })
      });
      Staff.find({
        filter: {
          where: {
            id: list.staff.id
          }
        }
      }, function (response) {
        list['Name'] = response[0].firstName + " " + response[0].lastName;
      })
    }
    function formValidations() {

      if (compleintCtrl.role == "Admin") {
        if (compleintCtrl.classId == undefined || compleintCtrl.classId == "")
          return 'Select Class Name ';

        if (compleintCtrl.studentId == undefined || compleintCtrl.studentId == "")
          return 'Select Student Name ';
      }

      // if (compleintCtrl.classId == undefined)
      //   return 'Select Class Name';

      // if (ccompleintCtrl.studentId == undefined)
      //   return 'Select Section Name';

      return undefined;
    }
    //future dates not allowed
    var dateControler = {
      currentDate: null
    }
    $(document).on("change", "#txtDate", function (event, ui) {
      var now = new Date();
      var selectedDate = new Date($(this).val());
      if (selectedDate > now) {
        $(this).val(dateControler.currentDate)
      } else {
        dateControler.currentDate = $(this).val();
      }
    });
    // End future dates not allowed
    // check contact
    compleintCtrl.checkContact = function (cnt) {
      var allow = true;
      var arrr = [];
      var abcd = cnt.split('');
      for (var i = 0; i < abcd.length; i++) {
        arrr.push(Number(Number(abcd[i])));
      }
      var abc = Number(arrr[0]);

      if (arrr.length > 9) {
        var dataa = [];
        arrr.map(function (item) {
          if (abcd[0] == item) {
            dataa.push(item);
          }
          if (dataa.length > 9) {
            allow = false;
            alert("please enter valid phone number ");
            compleintCtrl.mobile = null;
          }
        })
      }
      if (abc < 2) {
        if (allow) {
          alert("please enter valid phone number");
        }
        compleintCtrl.mobile = null;
        compleintCtrl.mobile = "";
      }
    }
    // End check contact

    function formValidations1(cid) {
      if (compleintCtrl.role == "Admin") {
        if (compleintCtrl.classId == undefined || compleintCtrl.classId == "")
          return 'Select Class Name ';

        if (compleintCtrl.studentId == undefined || compleintCtrl.studentId == "")
          return 'Select Student Name ';
      }
    }
    //get Staff User Name
    compleintCtrl.getStaffUserName = function (list) {
      if (compleintCtrl.role == 'Staff') {
        Staff.find({
          filter: {
            where: {
              id: compleintCtrl.loginId
            }
          }
        }, function (response) {
          list['Name'] = response[0].firstName + " " + response[0].lastName;
        })
      }
    }
    compleintCtrl.pdf = function () {
      console.log(compleintCtrl.compleintList);
      kendo.drawing
        .drawDOM("#printData1",
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
            kendo.drawing.pdf.saveAs(group, "COMPLAINT.pdf");
          }, 1000);
        });
        $timeout(function(){
          compleintCtrl.showForPdf = true;
        },1000);
    }
  });
