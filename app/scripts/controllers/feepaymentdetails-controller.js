'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:FeepaymentdetailsControllerCtrl
 * @description
 * # FeepaymentdetailsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('FeepaymentdetailsController', function ($scope, feepaymentdetailsService, $http, $filter, Class, FeePayment, $stateParams, School, Smsreport, Student, FeeSetup, Btperms, $timeout, $cookies, toastr, APP_MESSAGES, $window, feesService, FeeItem, StudentPayments) {

    var FeeDetailsCtrl = this;
    FeeDetailsCtrl.discountMode = false;
    FeeDetailsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    // console.log(FeeDetailsCtrl.schoolId);
    // FeeDetailsCtrl.id = $cookies.getObject('uds').id;

    FeeDetailsCtrl.userName = $cookies.getObject('uds').firstName;
    FeeDetailsCtrl.lastName = $cookies.getObject('uds').lastName;
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Fee Payment") {
        FeeDetailsCtrl.roleView = roleAccess[0].RolesData[i].view;
        FeeDetailsCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        FeeDetailsCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

    }
    ///feeeepaymentr
    FeePayment.find({
      filter: {
        where: {
          schoolId: FeeDetailsCtrl.schoolId
        },
        include: ['student', 'class', 'feeSetup']
      }
    }, function (response) {
      FeeDetailsCtrl.feeDataDates = response;

    });
    // endshewere
    //

    function Init() {
      this.getFeePaymentdetails = function () {
        FeePayment.find({
          filter: {
            where: {
              schoolId: FeeDetailsCtrl.schoolId
            },
            include: ['student', 'class', 'feeSetup']
          }
        }, function (response) {
          // console.log(response);
          FeeDetailsCtrl.feeDataDates = response;

        });
      };
      this.studentDetails = function () {
        feepaymentdetailsService.getStudentDetailsById($stateParams.id).then(function (res) {
          FeeDetailsCtrl.stuData = res;
          // if(FeeDetailsCtrl.stuData.registrationNo)
          // stuData={regId:FeeDetailsCtrl.stuData.registrationNo};
        });
      }
    }
    $timeout(function () {
      (new Init().getFeePaymentdetails());
      (new Init().studentDetails());
      var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
      console.log(roleAccess);
      for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
        if (roleAccess[0].RolesData[i].name === "Discount") {
          FeeDetailsCtrl.discView = roleAccess[0].RolesData[i].view;
          console.log( FeeDetailsCtrl.discView);
          FeeDetailsCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
          FeeDetailsCtrl.roledelete = roleAccess[0].RolesData[i].delete;
        }
      }
    }, 5000);
    FeeDetailsCtrl.availablePamentOptions = [
      { id: 'cash', value: 'CASH' }, { id: 'cheque', value: 'CHEQUE' }, { id: 'card', value: 'CARD' }];
    FeeDetailsCtrl.paymode = FeeDetailsCtrl.availablePamentOptions[0].id;

    FeeDetailsCtrl.dateof = new Date();

    FeeDetailsCtrl.paymentModeTerm;
    FeeDetailsCtrl.totalFDiscount = 0;
    FeeDetailsCtrl.totalFAmount = 0;
    FeeDetailsCtrl.bankAccountNumber;
    FeeDetailsCtrl.description = '';

    Btperms.find({ filter: { where: { "schoolId": FeeDetailsCtrl.schoolId } } }, function (result) {
      var bankAccountNumber = (result[0]) ? result[0].bankAccountNumber : undefined;
      if (bankAccountNumber !== undefined && 0 !== bankAccountNumber.length) {
        FeeDetailsCtrl.availablePamentOptions.push({ id: 'onlpay', value: 'Online Payment' })
        FeeDetailsCtrl.bankAccountNumber = bankAccountNumber;
      }

    }, function (error) {
      console.log(error);
    });
    function init() {

      this.getStudentPaymentDetails = function () {
        var Init = this;
        feepaymentdetailsService.getStudentPaymentDetails($stateParams.id).then(function (res) {
          if (res) {

            if (res.paymentMode == undefined || res.paymentMode == '')
              FeeDetailsCtrl.showPaymentModeSelection = true;
            _.each(res.payments, function (payment) {
              if (payment.receiptNumber)
                payment['order_temp'] = parseInt(payment.receiptNumber.split('_')[1]);
              else
                payment['order_temp'] = 0;

            })
            FeeDetailsCtrl.studentDetails = Init.parseData(res);
            // console.log("res---"+JSON.stringify(FeeDetailsCtrl.studentDetails.feeSetup));
          }
        }, function (error) {
          // console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      },
        this.getaccountantnamesList = function () {
          feepaymentdetailsService.getaccountantnamesList(FeeDetailsCtrl.schoolId).then(function (result) {
            if (result) {
              if (result[0].lastName == undefined) {
                FeeDetailsCtrl.accountant = result[0].firstName;
              } else {
                FeeDetailsCtrl.accountant = result[0].firstName + '' + result[0].lastName;
              }
              // console.log(result);  

              // console.log(FeeDetailsCtrl.accountant);
            }
          }, function (error) {
            //console.log.log('Error while fetching class and staff. Error stack ' + error);
          });
        };


      this.parseData = function (data) {
        _.each(data.feeSetup, function (setup) {
          setup.removalble = true;
          _.each(data.payments, function (p) {
            if (p.feeSetupId && setup.setupId == p.feeSetupId) setup.removalble = false;
            if (p.optionalId && setup.optionalId == p.optionalId) setup.removalble = false;
          });
        });
        return data;
      }
    }
    $timeout(function () {
      (new init()).getStudentPaymentDetails();
      $timeout(function () {
        FeeDetailsCtrl.calculateTotalS();
      }, 3000);
    }, 5000);
    (new init()).getaccountantnamesList();
    FeeDetailsCtrl.paymentModeUpdated = function () {
      FeeDetailsCtrl.showPaymentModeSelection = false;

      var studentPayload = {
        id: $stateParams.id,
        paymentMode: FeeDetailsCtrl.paymentMode
      };

      FeeDetailsCtrl.paymentModeTerm = FeeDetailsCtrl.paymentMode

      feepaymentdetailsService.updatePaymentMode(studentPayload).then(function (res) {
        if (res) {
          FeeDetailsCtrl.showPaymentModeSelection = false;
          (new init()).getStudentPaymentDetails();
        }
      }, function (error) {
        // console.log(error);
        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
      });

    }
    this.discountCheck = function (feeItem, ind, parent) {
      var inde = "#" + ind + parent + "disCheck";
      if (feeItem.discount > feeItem.amount - feeItem.paid) {
        toastr.error("Discount should less than Total Amount");
        feeItem.discount = 0;
        feeItem.pay = 0;
        this.calculatePayments(feeItem);
        $(inde).focus();
      }
    }
    this.calculatePayments = function (fee) {
      fee.due = (fee.amount - (fee.paid + fee.discount));
      fee.payable = (fee.amount - (fee.paid + fee.discount));
      fee.pay = (fee.amount - (fee.paid + fee.discount));
      this.calculateTotal(fee);
    }
    this.calculateTotal = function (fee) {
      var t = 0, d = 0;
      if (fee.pay > fee.due) {
        fee.currentPayment = temp
        alert('Your fee cannot be greater than the payable fee')
      }
      else {
        _.each(FeeDetailsCtrl.studentDetails.feeSetup, function (setup) {
          _.each(setup.feeitems, function (feeItem) {
            // if(feeItem.amount){amounts+= feeItem.amount;}
            // if(feeItem.discount){discounts+= feeItem.discount;}
            // if(feeItem.payable){payables+= feeItem.payable;}
            // if(feeItem.paid){paids+= feeItem.paid;}
            // if(feeItem.due){due+= feeItem.due;}
            // if(feeItem.pay){pays += feeItem.pay}
            if (feeItem.isSelected) {
              t += feeItem.pay;
              d += feeItem.discount;
            }
          });
        });

      }
      // this.amounts = amounts;
      // this.discounts = discounts;
      // this.payables = payables;
      // this.paids = paids;
      // this.dues = due;
      // this.pays = pays;
      this.totalFAmount = t;
      this.totalFDiscount = d;
      this.calculateTotalS();
    }
    this.calculateTotalS = function () {
      var amounts = 0, discounts = 0, payables = 0, paids = 0, due = 0, pays = 0;
      _.each(FeeDetailsCtrl.studentDetails.feeSetup, function (setup) {
        _.each(setup.feeitems, function (feeItem) {
          if (feeItem.amount) { amounts += feeItem.amount; }
          if (feeItem.discount) { discounts += feeItem.discount; }
          if (feeItem.payable) { payables += feeItem.payable; }
          if (feeItem.paid) { paids += feeItem.paid; }
          if (feeItem.due) { due += feeItem.due; }
          if (feeItem.pay) { pays += feeItem.pay }
        });
      });


      this.amounts = amounts;
      this.discounts = discounts;
      this.payables = payables;
      this.paids = paids;
      this.dues = due;
      this.pays = pays;
    }
    $scope.shouldBeDisabled = function (fee) {
      if (fee.pay <= 0 || fee.pay > fee.due) {
        fee.isSelected = false;
        return true;
      }

      return false;
    }
    function formValidations() {
      var currDate = new Date();
      //total should be more then 0
      if (FeeDetailsCtrl.dateof > currDate) {
        return 'Date should not be greater than todays date';
      }
      if (FeeDetailsCtrl.totalFAmount == 0)
        return 'No selected to Fee to proceed ';
      //payment mode has to be selected
      if (FeeDetailsCtrl.paymode == undefined || FeeDetailsCtrl.paymode == 'Payment Mode')
        return 'Select Payment Mode ';

      return undefined;
    }
    // (new Init()).getaccountantlist();

    //SMS sending to Parents After Amount Has Been Paid
    feepaymentdetailsService.getMsgid(FeeDetailsCtrl.schoolId).then(function (result) {
      if (result) {
        FeeDetailsCtrl.smsid = result;
        FeeDetailsCtrl.schoolSmsCode = FeeDetailsCtrl.smsid[0].schoolCode;
      }
    }, function (error) {
      console.log('Error while fetching the assignment records. Error stack : ' + error);

    });
    feepaymentdetailsService.SchoolDetailsByStudentId(FeeDetailsCtrl.schoolId).then(function (response) {
      if (response) {
        FeeDetailsCtrl.schoolList = response;
        FeeDetailsCtrl.deleteFee = response[0].deleteFee;
        FeeDetailsCtrl.faymentStudents = FeeDetailsCtrl.schoolList[0].faymentStudents;
      }
    }, function (error) {
      console.log('Error while fetching school Monthly Fees details records. Error Stack : ' + error);
    });
    feepaymentdetailsService.getStudName($stateParams.id).then(function (result) {
      if (result) {
        FeeDetailsCtrl.studentDetails = result;
        // console.log(FeeDetailsCtrl.studentDetails);
        FeeDetailsCtrl.studContct = FeeDetailsCtrl.studentDetails.contact;

        FeeDetailsCtrl.studFulname = FeeDetailsCtrl.studentDetails.firstName + ' ' + FeeDetailsCtrl.studentDetails.lastName;
      }
    }, function (error) {
      console.log('Error while fetching the Fee Payment records. Error stack : ' + error);
    });
    //comments
    FeeDetailsCtrl.savediscIndex = function (fee, ind) {
      FeeDetailsCtrl.discindex = fee;
      var modal = $('#disc-comment');
      modal.modal('show');
      console.log(FeeDetailsCtrl.discindex.discComment);
      FeeDetailsCtrl.discComment = FeeDetailsCtrl.discindex.discComment;
      console.log(FeeDetailsCtrl.discComment);

    }

    FeeDetailsCtrl.showComment = function () {
      FeeDetailsCtrl.discindex.discComment = FeeDetailsCtrl.discComment;
      FeeDetailsCtrl.closeModal();
    }
    FeeDetailsCtrl.SaveDiscount = function () {
      var discItems = [];
      _.each(FeeDetailsCtrl.studentDetails.feeSetup, function (setup) {
        _.each(setup.feeitems, function (feeItem) {
          if (feeItem.discount == null) {
            feeItem.discount = 0;
          }
          var temp = {
            studentId: $stateParams.id,
            feeItemId: feeItem.id,
            discount: feeItem.discount,
            discComment: feeItem.discComment
          }
          discItems.push(temp);
        });
      });
      feepaymentdetailsService.saveDiscount({ discItems: discItems }).then(function (res) {

      });
      $timeout(function () {
        FeeDetailsCtrl.discountMode = !FeeDetailsCtrl.discountMode;
        toastr.success('Discount Applied Successfully');
      }, 2000);
      $timeout(function () {
        // location.reload();
      }, 5000);
    }
    $scope.first = true;
    FeeDetailsCtrl.payFee = function (invalid) {
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      if (invalid) {
        return;
      }
      $scope.first = !$scope.first;
      var feeItems = [];
      _.each(FeeDetailsCtrl.studentDetails.feeSetup, function (setup) {
        _.each(setup.feeitems, function (feeItem) {
          if (feeItem.isSelected) {
            if (feeItem.pay < 1) {
              alert('Payment Amount should be more then Rs.1/-');
              $scope.first = true;
              return;
            }

            var temp = {
              studentId: $stateParams.id,
              feeSetupId: setup.setupId,
              optionalId: setup.optionalId,
              feeItemId: feeItem.id,
              userfstname: FeeDetailsCtrl.userName,
              userlastname: FeeDetailsCtrl.lastName,
              schoolId: FeeDetailsCtrl.schoolId,
              classId: FeeDetailsCtrl.studentDetails.classId,
              reportPayDate: $filter('date')(new Date(FeeDetailsCtrl.dateof), "dd-MM-yyyy"),
              payDate: new Date((FeeDetailsCtrl.dateof).setHours(5, 31, 0, 0)).toISOString(),
              paymode: FeeDetailsCtrl.paymode,
              discount: feeItem.discount,
              paidAmount: feeItem.pay,
              description: FeeDetailsCtrl.description,
              payable: feeItem.payable,
              totalAmount: feeItem.amount,
              due: (feeItem.due - feeItem.pay),
              paidtillNow: feeItem.paid
            }

            feeItems.push(temp);
            FeeDetailsCtrl.paidAmount = JSON.stringify(temp.paidAmount);

          }
        });
      });
      if (FeeDetailsCtrl.paymode === 'onlpay') {

        if (feeItems) {
          feeItems.bankAccountNumber = FeeDetailsCtrl.bankAccountNumber

          feepaymentdetailsService.redirectToOnlinePayment(op).then(function (response) {
            // $scope.first = true;
            window.location = response.paymentlink;
          }, function (error) {
            // console.log(error);
          });
        }

      }
      else {
        feepaymentdetailsService.Pay({ feeItems: feeItems }).then(function (res) {
          if (res) {
            toastr.success('Payment Successfully Paid.');
            $timeout(function () {
              $window.location.reload();
            }, 1000);
            (new init()).getStudentPaymentDetails();
          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });

      }
    }


    FeeDetailsCtrl.removeOptionalItems = function (data, index) {
      if (data.optionalId) {
        feesService.deleteOptional(data.optionalId).then(function (res) {
          if (res) {
            $window.location.reload();
          }
        }, function (error) {
          // console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }
      else {
        var studentPayload = {
          id: $stateParams.id,
          studentOptedOptionalFeestups: [data.setupId]
        };
        feepaymentdetailsService.StudentOptionals(studentPayload, false).then(function (res) {
          if (res) {

            $window.location.reload();
          }
        }, function (error) {
          // console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }
    };

    FeeDetailsCtrl.addItem = function () {
      FeeDetailsCtrl.studentDetails.optionals.push({
        feetype: '',
        mandatory: 'mandatory',
        id: '',
        editable: true,
        studentId: FeeDetailsCtrl.studentDetails.studentId,
        classId: FeeDetailsCtrl.studentDetails.classId,
        feeitems: [
          {
            amount: 0,
            mode: 'optional'
          }
        ],
        isSelected: true
      })

    }

    FeeDetailsCtrl.addOptionalItems = function () {
      var selectedFeeIds = [];
      var StudentOptionals = [];
      _.each(FeeDetailsCtrl.studentDetails.optionals, function (value, key) {
        if (value.isSelected) {
          if (value.setupId) {
            selectedFeeIds.push(value.setupId)
          } else {
            value.feeitems[0].date = new Date();
            StudentOptionals.push(value);
          }
        }
      });

      if (selectedFeeIds.length > 0) {
        var studentPayload = {
          id: $stateParams.id,
          studentOptedOptionalFeestups: selectedFeeIds
        };
        feepaymentdetailsService.StudentOptionals(studentPayload, true).then(function (res) {
          if (res) {
            if (StudentOptionals.length == 0)
              $window.location.reload();
          }
        }, function (error) {
          // console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }
      if (StudentOptionals.length > 0) {
        var len = 1;
        _.each(StudentOptionals, function (value, key) {
          feepaymentdetailsService.createOptionalFee(value).then(function (res) {
            if (res) {
              if (len == StudentOptionals.length)
                $window.location.reload();
              else
                len++;
            }
          }, function (error) {
            // console.log(error);
            toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          });
        });
      }


    }
    FeeDetailsCtrl.discount = function (discount) {
    }
    var addToDiscT = 0;
    FeeDetailsCtrl.calTotDisc = function (discT) {
      addToDiscT += discT;
      FeeDetailsCtrl.TotalDiscount = addToDiscT;
      Student.prototype$patchAttributes({ id: $stateParams.id, totalDiscount: FeeDetailsCtrl.TotalDiscount });
    }
    // FeeDetailsCtrl.hideTh = function(){
    //   console.log("none");
    //   document.getElementById("hideDDDD").style.display="none";

    // }
    var myappthos = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    var myappdang = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    var myapptenth = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var myapptvew = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    function inWords(s) {
      s = s.toString();
      s = s.replace(/[\, ]/g, '');
      if (s != parseFloat(s)) return 'not a number';
      var query = s.indexOf('.');
      if (query == -1) query = s.length;
      if (query > 15) return 'too big';
      var n = s.split('');
      var str = '';
      var mjk = 0;
      for (var ld = 0; ld < query; ld++) {
        if ((query - ld) % 3 == 2) {
          if (n[ld] == '1') {
            str += myapptenth[Number(n[ld + 1])] + ' ';
            ld++;
            mjk = 1;
          }
          else if (n[ld] != 0) {
            str += myapptvew[n[ld] - 2] + ' ';
            mjk = 1;
          }
        }
        else if (n[ld] != 0) {
          str += myappdang[n[ld]] + ' ';
          if ((query - ld) % 3 == 0) str += 'Hundred ';
          mjk = 1;
        }
        if ((query - ld) % 3 == 1) {
          if (mjk) str += myappthos[(query - ld - 1) / 3] + ' ';
          mjk = 0;
        }
      }
      if (query != s.length) {
        var dv = s.length;
        str += 'point ';
        for (var ld = query + 1; ld < dv; ld++) str += myappdang[n[ld]] + ' ';
      }

      return str.replace(/\s+/g, ' ');
    }
    FeeDetailsCtrl.ValidateEndDate = function () {
      //   alert("goooo");
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }

      today = yyyy + '-' + mm + '-' + dd;
      document.getElementById("theDate").setAttribute("max", today);
    }
    //Date Order
    $scope.orderByCustom = function (fee) {
      // console.log(fee);
      var date = $filter('date')(fee.date, "dd-MM-yyyy");
      // console.log(date);
      var parts = date.split('-');
      var concatdate = parts[2] + "-" + parts[1] + "-" + parts[0];
      // console.log(concatdate);
      return concatdate;
    };
    //Delete Fee History
    FeeDetailsCtrl.getItemDate = function (receipt) {
      // console.log(receipt);
      FeeItem.findById({ id: receipt.feeItemId }, function (itemRes) {
        receipt['feeItemDueDt'] = itemRes.date;
        // console.log(receipt['feeItemDueDt']);
      })
    }
    //Delete confirmation box
    FeeDetailsCtrl.confirmCallbackMethod = function (index, data) {
      FeeDetailsCtrl.deleteFeeReceipt(index, data);
    };
    //Delete cancel box
    FeeDetailsCtrl.confirmCallbackCancel = function (index) {
      if (index) {
        return false;
      }
      return;
    };
    FeeDetailsCtrl.deleteFeeReceipt = function (ind, data) {
      StudentPayments.findById({ id: data.studentPaymentId }, function (paymentData) {
        if (paymentData.feePaymentIds.length == 1) {
          StudentPayments.deleteById({ id: paymentData.id }, function (updatespayment) {
            if (updatespayment) {
              FeePayment.deleteById({ id: data.id }, function (deletefpay) {
                (new init()).getStudentPaymentDetails();
              });
            }
          });
        } else {
          var index = paymentData.feePaymentIds.indexOf(data.id);
          if (index !== -1) paymentData.feePaymentIds.splice(index, 1);
          if (index !== -1) paymentData.totalpaid -= data.paidAmount;
          StudentPayments.prototype$patchAttributes(paymentData, function (updatespayment) {
            if (updatespayment) {
              FeePayment.deleteById({ id: data.id }, function (delfeep) {
                (new init()).getStudentPaymentDetails();
              });
            }
          });
        }

      })
    }
    FeeDetailsCtrl.closeModal = function () {
      var modal = $('#disc-comment');
      modal.modal('hide');
      // clearformfields();
    }
    FeeDetailsCtrl.printreceiptHistory = function (theIndex, recipt, divName) {
      // console.log(recipt);
      var stuData = FeeDetailsCtrl.studentDetails;
      if (stuData.regId == undefined || stuData.regId == null || stuData.regId == "" || stuData.regId == " ") {
        stuData.regId = FeeDetailsCtrl.stuData.registrationNo;
      }
      if (FeeDetailsCtrl.stuData.registrationNo) {
        stuData.regId = FeeDetailsCtrl.stuData.registrationNo;
      }
      for (var i = 0; i < stuData.payments.length; i++) {
        if (stuData.payments[i].id == recipt.id) {
          theIndex = i;
        }
      }
      var dataas = "";
      var lastName = "";
      var lastt = "";
      var stuData = FeeDetailsCtrl.studentDetails;
      // console.log(FeeDetailsCtrl.studentDetails[0].userfstname);
      //  +''+ payment.userlastname

      var fn = stuData.firstName ? stuData.firstName : '';
      var ln = stuData.lastName ? stuData.lastName : '';
      var sectionName = stuData.section ? '-' + stuData.section : '';
      var payment = stuData.payments[theIndex];
      if (payment.receiptNumber == 'NaN' || payment.receiptNumber == 'undefined_undefined') {
        dataas = "";
      } else {
        dataas = payment.receiptNumber;
      }
      if (payment.userlastname == "" || payment.userlastname == undefined) {
        var ReceivedBYperson = payment.userfstname;

      } else {
        var ReceivedBYperson = payment.userfstname + payment.userlastname;
      }
      // console.log(ReceivedBYperson);
      if (ReceivedBYperson == undefined) {
        ReceivedBYperson = FeeDetailsCtrl.accountant;
      }
      // console.log(ReceivedBYperson);
      var convertDtoStr = payment.paidAmount;
      var showString = inWords(convertDtoStr);
      FeeDetailsCtrl.hideDiscData = payment.discount;
      if (!recipt.feetype) {
        recipt.feetype = "";
      }
      FeeDetailsCtrl.feeSetupName = recipt.feetype;

      FeeItem.findById({ id: recipt.feeItemId }, function (itemRe) {
        if (itemRe.mode == "one time") {
          FeeDetailsCtrl.recieptFor = $filter('date')(itemRe.date, 'MMMM');
        } else if (itemRe.mode == "optional") {
          FeeDetailsCtrl.recieptFor = $filter('date')(itemRe.date, 'MMMM');
        } else {
          FeeDetailsCtrl.recieptFor = itemRe.Description;
        }
      })
      if (payment.discount != 0) {
        // FeeSetup.find({ filter: { where: { schoolId: FeeDetailsCtrl.schoolId, id: payment.feeSetupId } } }, function (feeSetupData) {
        //   FeeDetailsCtrl.feeSetupName = feeSetupData[0].feetype;
        // })
        School.find({ filter: { where: { id: stuData.schoolId } } }, function (response) {
          FeeDetailsCtrl.studSchoolList = response;
          var printContents = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="custom.css" media="all"/><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><style>.right{    border-right-style: none;} .left{border-left-style: none;}</style>' +

            '</head><body onload="window.print()" class="container"><div></div><br><div class="reward-body">'

            + '<table style="border:1px solid black" cellpadding="200" class="table table-bordered table-striped">'
            + '<thead><tr style="border:1px solid black;"><th colspan="5" style="text-align:center; height:50px; vertical-align: middle;"><img style="text-align:center;margin-top:5px;min-height:50px;max-height:90px;" src =' + FeeDetailsCtrl.studSchoolList[0].logo + '/></th></tr></thead>'
            + '<tbody><tr style="border:1px solid black"><th colspan="1" style=""> Date :</th><th colspan="1">  ' + $filter('date')(payment.payDate, 'dd/MM/yyyy') + '</th><th colspan="1"> Receipt number:</th><th colspan="2" style="text-align:right;">  ' + dataas + '</th></tr>'

            + '<tr style="border:1px solid black"><th colspan="1" style="">Received From: </th><th colspan="1">' + fn + ' ' + ln + '</th><th colspan="1">Fee Amount: </th><th colspan="2" style="text-align:right;"> ' + payment.totalAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Registration Number : </th><th colspan="1" style="">' + stuData.regId + '</th><th colspan="1" style=""> Discount : </th><th colspan="1" style="text-align:right;">' + payment.discount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Class/Section : </th><th colspan="1">' + stuData.class + '' + sectionName + '</th><th colspan="1"> Payable Amount:</th><th colspan="2" style="text-align:right;"> ' + payment.payable + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Father Name : </th><th colspan="1">' + stuData.parentName + '</th><th colspan="1"> Past Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidtillNow + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Mobile number : </th><th colspan="1">' + stuData.contact + '</th><th colspan="1"> Current Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Payment For: </th><th colspan="1">' + FeeDetailsCtrl.feeSetupName + ' - ' + FeeDetailsCtrl.recieptFor + '</th><th colspan="1"> Due Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.due + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Payment Mode : </th><th colspan="1">' + payment.paymode + '</th><th colspan="3"> Received Amount: ' + showString + 'Rupees Only</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="2" style="height:38px"> Remarks:' + payment.description + ' </th> <th colspan="3" style="height:38px"> Received by: ' + ReceivedBYperson + '</th></tr>'
            + '<tr style="border:1px solid black"><td colspan="5" style="">Note: This is a system generated receipt, signature is not required.   </td></tr>'
            + '</tbody></table><br>'
            + '<table style="border:1px solid black" cellpadding="200" class="table table-bordered table-striped">'
            + '<thead><tr style="border:1px solid black"><th colspan="5" style="text-align:center; height:50px; vertical-align: middle;"><img style="text-align:center;margin-top:5px;min-height:50px;max-height:90px;" src =' + FeeDetailsCtrl.studSchoolList[0].logo + '/></th></tr></thead>'
            + '<tbody><tr style="border:1px solid black"><th colspan="1" style=""> Date :</th><th colspan="1">  ' + $filter('date')(payment.payDate, 'dd/MM/yyyy') + '</th><th colspan="1"> Receipt number:</th><th colspan="2" style="text-align:right;">  ' + dataas + '</th></tr>'

            + '<tr style="border:1px solid black"><th colspan="1" style="">Received From: </th><th colspan="1">' + fn + ' ' + ln + '</th><th colspan="1">Fee Amount: </th><th colspan="2" style="text-align:right;"> ' + payment.totalAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Registration Number : </th><th colspan="1">' + stuData.regId + '</th><th colspan="1" style=""> Discount : </th><th colspan="1" style="text-align:right;">' + payment.discount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Class/Section : </th><th colspan="1">' + stuData.class + '' + sectionName + '</th><th colspan="1"> Payable Amount:</th><th colspan="2" style="text-align:right;"> ' + payment.payable + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Father Name : </th><th colspan="1">' + stuData.parentName + '</th><th colspan="1"> Past Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidtillNow + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Mobile number : </th><th colspan="1">' + stuData.contact + '</th><th colspan="1"> Current Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Payment For: </th><th colspan="1">' + FeeDetailsCtrl.feeSetupName + ' - ' + FeeDetailsCtrl.recieptFor + '</th><th colspan="1"> Due Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.due + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Payment Mode : </th><th colspan="1">' + payment.paymode + '</th><th colspan="3"> Received Amount: ' + showString + 'Rupees Only</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="2" style="height:38px"> Remarks:' + payment.description + '</th> <th colspan="3" style="height:38px"> Received by: ' + ReceivedBYperson + '</th></tr>'
            + '<tr style="border:1px solid black"><td colspan="5" style="">Note: This is a system generated receipt, signature is not required.</td></tr>'
            + '</tbody></table>'

          printContents = printContents + '</div></html>';


          var originalContents = document.body.innerHTML;

          if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=600,height=500,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();

            popupWin.document.write(printContents);

            popupWin.onbeforeunload = function (event) {
              popupWin.close();
              return '.\n';
            };
            popupWin.onabort = function (event) {
              popupWin.document.close();
              popupWin.close();
            }
          } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
          }
          popupWin.document.close();

        }, function (error) {
          // console.log(error);
        });



        return true;


      } else {
        // FeeSetup.find({ filter: { where: { schoolId: FeeDetailsCtrl.schoolId, id: payment.feeSetupId } } }, function (feeSetupData) {
        //   FeeDetailsCtrl.feeSetupName = feeSetupData[0].feetype;
        //   console.log(FeeDetailsCtrl.feeSetupName);
        // })



        School.find({ filter: { where: { id: stuData.schoolId } } }, function (response) {
          FeeDetailsCtrl.studSchoolList = response;

          var printContents = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="custom.css" media="all"/><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><style>.right{    border-right-style: none;} .left{border-left-style: none;}</style>' +

            '</head><body onload="window.print()" class="container"><div></div><br><div class="reward-body">'

            + '<table style="border:1px solid black" cellpadding="200" class="table table-bordered table-striped">'
            + '<thead><tr style="border:1px solid black"><th colspan="5" style="text-align:center; height:50px; vertical-align: middle;"><img style="text-align:center;margin-top:5px;min-height:50px;max-height:90px;" src =' + FeeDetailsCtrl.studSchoolList[0].logo + '/></th></tr></thead>'
            + '<tbody><tr style="border:1px solid black"><th colspan="1" style=""> Date :</th><th colspan="1">  ' + $filter('date')(payment.payDate, 'dd/MM/yyyy') + '</th><th colspan="1" > Receipt number:</th><th colspan="2" style="text-align:right;">' + dataas + '</th></tr>'

            + '<tr style="border:1px solid black"><th colspan="1" style="">Received From: </th><th colspan="1">' + fn + ' ' + ln + '</th><th colspan="1">Fee Amount: </th><th colspan="2" style="text-align:right;"> ' + payment.totalAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Registration Number : </th><th colspan="1">' + stuData.regId + '</th><th colspan="1" style=""> Payment Mode : </th><th colspan="1" style="text-align:right;">' + payment.paymode + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Class/Section : </th><th colspan="1">' + stuData.class + '' + sectionName + '</th><th colspan="1"> Payable Amount:</th><th colspan="2" style="text-align:right;"> ' + payment.payable + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Father Name : </th><th colspan="1">' + stuData.parentName + '</th><th colspan="1"> Past Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidtillNow + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Mobile number : </th><th colspan="1">' + stuData.contact + '</th><th colspan="1"> Current Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Payment For: </th><th colspan="1">' + FeeDetailsCtrl.feeSetupName + ' - ' + FeeDetailsCtrl.recieptFor + '</th><th colspan="1"> Due Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.due + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="4"> Received Amount: ' + showString + 'Rupees Only</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="2" style="height:38px"> Remarks:' + payment.description + ' </th> <th colspan="3" style="height:38px"> Received by: ' + ReceivedBYperson + '</th></tr>'
            + '<tr style="border:1px solid black"><td colspan="5" style="">Note: This is a system generated receipt, signature is not required. </td></tr>'
            + '</tbody></table><br>'
            + '<table style="border:1px solid black" cellpadding="200" class="table table-bordered table-striped">'
            + '<thead><tr style="border:1px solid black"><th colspan="5" style="text-align:center; height:50px; vertical-align: middle;"><img style="text-align:center;margin-top:5px;min-height:50px;max-height:90px;" src =' + FeeDetailsCtrl.studSchoolList[0].logo + '/></th></tr></thead>'
            + '<tbody><tr style="border:1px solid black"><th colspan="1" style=""> Date :</th><th colspan="1">  ' + $filter('date')(payment.payDate, 'dd/MM/yyyy') + '</th><th colspan="1"> Receipt number:</th><th colspan="2" style="text-align:right;">  ' + dataas + '</th></tr>'

            + '<tr style="border:1px solid black"><th colspan="1" style="">Received From: </th><th colspan="1">' + fn + ' ' + ln + '</th><th colspan="1">Fee Amount: </th><th colspan="2" style="text-align:right;"> ' + payment.totalAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Registration Number : </th><th colspan="1">' + stuData.regId + '</th><th colspan="1" style=""> Payment Mode : </th><th colspan="1" style="text-align:right;">' + payment.paymode + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Class/Section : </th><th colspan="1">' + stuData.class + '' + sectionName + '</th><th colspan="1"> Payable Amount:</th><th colspan="2" style="text-align:right;"> ' + payment.payable + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Father Name : </th><th colspan="1">' + stuData.parentName + '</th><th colspan="1"> Past Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidtillNow + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Mobile number : </th><th colspan="1">' + stuData.contact + '</th><th colspan="1"> Current Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.paidAmount + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="1" style=""> Payment For: </th><th colspan="1">' + FeeDetailsCtrl.feeSetupName + ' - ' + FeeDetailsCtrl.recieptFor + '</th><th colspan="1"> Due Payment:</th><th colspan="2" style="text-align:right;"> ' + payment.due + '</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="4"> Received Amount: ' + showString + 'Rupees Only</th></tr>'
            + '<tr style="border:1px solid black"><th colspan="2" style="height:38px"> Remarks:' + payment.description + ' </th> <th colspan="3" style="height:38px"> Received by: ' + ReceivedBYperson + '</th></tr>'
            + '<tr style="border:1px solid black"><td colspan="5" style="">Note: This is a system generated receipt, signature is not required. </td></tr>'
            + '</tbody></table>'

          printContents = printContents + '</div></html>';


          var originalContents = document.body.innerHTML;

          if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=600,height=500,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();

            popupWin.document.write(printContents);

            popupWin.onbeforeunload = function (event) {
              popupWin.close();
              return '.\n';
            };
            popupWin.onabort = function (event) {
              popupWin.document.close();
              popupWin.close();
            }
          } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
          }
          popupWin.document.close();

        }, function (error) {
          // console.log(error);
        });
        // console.log(FeeDetailsCtrl.studSchoolList);


        return true;


      }
    }




  });


angular.module('studymonitorApp').directive('printDiv', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function (evt) {
        evt.preventDefault();
        PrintElem(attrs.printDiv);
      });

      function PrintElem(elem) {
        PrintWithIframe($(elem).html());
      }

      function PrintWithIframe(data) {
        if ($('iframe#printf').size() == 0) {
          $('html').append('<iframe id="printf" name="printf"></iframe>');  // an iFrame is added to the html content, then your div's contents are added to it and the iFrame's content is printed

          var mywindow = window.frames["printf"];
          mywindow.document.write('<html><head><title></title><style>@page {margin: 25mm 0mm 25mm 5mm}</style>'  // Your styles here, I needed the margins set up like this
            + '</head><body><div>'
            + data
            + '</div></body></html>');

          $(mywindow.document).ready(function () {
            mywindow.print();
            setTimeout(function () {
              $('iframe#printf').remove();
            },
              2000);  // The iFrame is removed 2 seconds after print() is executed, which is enough for me, but you can play around with the value
          });
        }

        return true;
      }
    }
  };
});
function AllowOnlyNumbers(e) {

  e = (e) ? e : window.event;
  var key = null;
  var charsKeys = [
    97, // a  Ctrl + a Select All
    65, // A Ctrl + A Select All
    99, // c Ctrl + c Copy
    67, // C Ctrl + C Copy
    118, // v Ctrl + v paste
    86, // V Ctrl + V paste
    115, // s Ctrl + s save
    83, // S Ctrl + S save
    112, // p Ctrl + p print
    80 // P Ctrl + P print
  ];

  var specialKeys = [
    8, // backspace
    9, // tab
    27, // escape
    13, // enter
    35, // Home & shiftKey +  #
    36, // End & shiftKey + $
    37, // left arrow &  shiftKey + %
    39, //right arrow & '
    46, // delete & .
    45 //Ins &  -
  ];

  key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

  //console.log("e.charCode: " + e.charCode + ", " + "e.which: " + e.which + ", " + "e.keyCode: " + e.keyCode);
  //console.log(String.fromCharCode(key));

  // check if pressed key is not number
  if (key && key < 48 || key > 57) {

    //Allow: Ctrl + char for action save, print, copy, ...etc
    if ((e.ctrlKey && charsKeys.indexOf(key) != -1) ||
      //Fix Issue: f1 : f12 Or Ctrl + f1 : f12, in Firefox browser
      (navigator.userAgent.indexOf("Firefox") != -1 && ((e.ctrlKey && e.keyCode && e.keyCode > 0 && key >= 112 && key <= 123) || (e.keyCode && e.keyCode > 0 && key && key >= 112 && key <= 123)))) {
      return true
    }
    // Allow: Special Keys
    else if (specialKeys.indexOf(key) != -1) {
      //Fix Issue: right arrow & Delete & ins in FireFox
      if ((key == 39 || key == 45 || key == 46)) {
        return (navigator.userAgent.indexOf("Firefox") != -1 && e.keyCode != undefined && e.keyCode > 0);
      }
      //DisAllow : "#" & "$" & "%"
      else if (e.shiftKey && (key == 35 || key == 36 || key == 37)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  else {
    return true;
  }


}
