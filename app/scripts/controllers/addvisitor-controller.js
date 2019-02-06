'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AddvisitorControllerCtrl
 * @description
 * # AddvisitorControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AddvisitorController', function (addvisitorService, Visitor, $cookies, $window, $q, $timeout, generateexcelFactory, $scope, toastr, APP_MESSAGES) {
    var visitorCtrl = this;
    visitorCtrl.schoolId = $cookies.getObject('uds').schoolId;
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Visitor Book") {
        visitorCtrl.VisitorroleView = roleAccess[0].RolesData[i].view;
        visitorCtrl.VisitorroleEdit = roleAccess[0].RolesData[i].edit;
        visitorCtrl.Visitorroledelete = roleAccess[0].RolesData[i].delete;
      }

    }
    //visitorCtrl.editmode = false;
    visitorCtrl.function1 = false;

    function Init() {
      //Get list of fees details by school ID
      this.getvisitroDetails = function () {
        addvisitorService.getvisitorDetailsBySchoolId(visitorCtrl.schoolId).then(function (response) {
          if (response) {
            visitorCtrl.visitorList = response;
          }
        }, function (error) {
          //console.log.log('Error while fetching Fees details records. Error Stack : ' + error);
        });

      }

    }
    (new Init()).getvisitroDetails();

    visitorCtrl.visitorAction = function (invalid) {
      // console.log(visitorCtrl.Indate);
      if (visitorCtrl.Indate == null) {
        visitorCtrl.Indate = "";
      };
      if (invalid) {
        return;
      }

      var data = {
        schoolId: visitorCtrl.schoolId,
        purpose: visitorCtrl.purpose,
        Name: visitorCtrl.Name,
        Mobile: visitorCtrl.Mobile,
        Nopeo: visitorCtrl.Nopeo,
        Indate: visitorCtrl.Indate,
        Description: visitorCtrl.Description
      };
      Visitor.create({
        schoolId: data.schoolId,
        purpose: data.purpose,
        Name: data.Name,
        Mobile: data.Mobile,
        Nopeo: data.Nopeo,
        Indate: data.Indate,
        Description: data.Description,
        visitor: data.visitor
      }, function (success) {
        if (success) {
          visitorCtrl.clearfields();
          visitorCtrl.closeModal1();
          visitorCtrl.visitorList.push(data);
          // (new Init()).getvisitroDetails();
          window.location.reload();
        }
      })
    };
    visitorCtrl.visitorlist = function (invalid) {
      // console.log(visitorCtrl.Indate);
      if (visitorCtrl.Indate == null) {
        visitorCtrl.Indate = "";
      };
      var data = {
        id: visitorCtrl.editingNoticeId,
        schoolId: visitorCtrl.schoolId,
        purpose: visitorCtrl.purpose,
        Name: visitorCtrl.Name,
        Mobile: visitorCtrl.Mobile,
        Nopeo: visitorCtrl.Nopeo,
        Indate: visitorCtrl.Indate,
        Description: visitorCtrl.Description
      };
      Visitor.prototype$patchAttributes({
        id: data.id,
        schoolId: data.schoolId,
        purpose: data.purpose,
        Name: data.Name,
        Mobile: data.Mobile,
        Nopeo: data.Nopeo,
        Indate: data.Indate,
        Description: data.Description,
        visitor: data.visitor
      }, function (succes) {
        if (succes) {
          visitorCtrl.clearfields();
          visitorCtrl.closeModal();
          Visitor.find({ filter: { where: { schoolId: visitorCtrl.schoolId } } }, function (res) {
            visitorCtrl.visitorList = res;
          })
          // (new Init()).getvisitroDetails();
          window.location.reload();
        }
      })
    }

    visitorCtrl.openModal = function () {
      var modal = $('#edit-visitor');
      modal.modal('show');

    };
    visitorCtrl.openAddModal = function () {
      var modal = $('#Add-visitor');
      modal.modal('show');

    };
    visitorCtrl.closeModal = function () {
      var modal = $('#edit-visitor');
      modal.modal('hide');

    };
    visitorCtrl.closeModal1 = function () {
      var modal = $('#Add-visitor');
      modal.modal('hide');
      (new Init()).getvisitroDetails();
    };
    // Print View
    visitorCtrl.printData = function () {
      var divToPrint = document.getElementById("printTable");
      visitorCtrl.newWin = window.open("");
      visitorCtrl.newWin.document.write(divToPrint.outerHTML);
      visitorCtrl.newWin.print();
      visitorCtrl.newWin.close();
    }
    //End Print View
    //Export to Excel
    visitorCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };
    // Exports ends here
    visitorCtrl.editvisitorlist = function (id) {
      var index = "";
      for (var i = 0; i < visitorCtrl.visitorList.length; i++) {
        if (visitorCtrl.visitorList[i].id == id) {
          var index = i;
        }
      }

      visitorCtrl.openModal();
      visitorCtrl.purpose = visitorCtrl.visitorList[index].purpose;
      visitorCtrl.Mobile = visitorCtrl.visitorList[index].Mobile;
      visitorCtrl.Name = visitorCtrl.visitorList[index].Name;
      visitorCtrl.Nopeo = visitorCtrl.visitorList[index].Nopeo;
      visitorCtrl.edate = new Date(visitorCtrl.visitorList[index].Indate);
      visitorCtrl.Indate = visitorCtrl.edate;
      visitorCtrl.Description = visitorCtrl.visitorList[index].Description;
      // EnquiryCtrl.VopenModal();
      visitorCtrl.editingNoticeId = visitorCtrl.visitorList[index].id;
    }

    visitorCtrl.ConfirmCallbackCancel = function (index) {
    }
    visitorCtrl.ConfirmCallbackMethod = function (id) {
      var index = "";
      for (var i = 0; i < visitorCtrl.visitorList.length; i++) {
        if (visitorCtrl.visitorList[i].id == id) {
          var index = i;
        }
      }
      deletevisitor(index);
    }
    var deletevisitor = function (index) {
      if (visitorCtrl.visitorList) {
        addvisitorService.deletevisitor(visitorCtrl.visitorList[index].id).then(function (result) {
          if (result) {
            visitorCtrl.closeModal();
            //Show Toast Message Success
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
            visitorCtrl.visitorList.splice(index, 1);

          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          //console.log('Error while deleting Notices. Error Stack' + error);
        });
      }
    };
    visitorCtrl.clearfields = function () {
      // alert("oye oye");

      visitorCtrl.purpose = "",
        visitorCtrl.Name = "",
        visitorCtrl.Mobile = "",
        visitorCtrl.Nopeo = "",
        visitorCtrl.Indate = "",
        visitorCtrl.Description = ""
    }
    // visitorCtrl.addmodel = function () {
    //   visitorCtrl.openAddModal();
    // }
    $scope.orderByCustom = function (data) {
      var parts = data.Indate.split('-');
      return new Date(parts[2], parts[1], parts[0]);
    };
    visitorCtrl.moredetails = function (id) {
      visitorCtrl.function1 = true;
      visitorCtrl.openAddModal();
      Visitor.find({ filter: { where: { id: id } } }, function (response) {
        visitorCtrl.visitorListShow = response;
      });
      // for (var i = 0; i < visitorCtrl.visitorList.length; i++) {
      //   if (visitorCtrl.visitorList[i].id == id) {
      //     visitorCtrl.visitorListShow = visitorCtrl.visitorList[i];
      //   }
      // }
    };
    visitorCtrl.todayDate = function () {
      visitorCtrl.Indate = new Date();
    }


    // check contact
    visitorCtrl.checkContact = function (cnt) {
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
            visitorCtrl.Mobile = null;
          }
        })
      }
      if (abc < 2) {
        if (allow) {
          alert("please enter valid phone number");
        }
        visitorCtrl.Mobile = null;
        visitorCtrl.Mobile = "";

      }
    }
    // End check contact

    visitorCtrl.pdf = function () {
      kendo.drawing
        .drawDOM("#pdfVISITOR",
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
            kendo.drawing.pdf.saveAs(group, "VISITOR.pdf");
          }, 1000);
        });
    }

  });
