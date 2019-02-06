'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.feepaymentdetailsService
 * @description
 * # feepaymentdetailsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('feepaymentdetailsService', function ($q, Student, StudentFees,Accountant,Admin,FeePayment, School, Class,Onlinetransactions,Optionals,configService,$http) {
    this.getStudentPaymentDetails = function (studentId) {
      var _activepromise = $q.defer();
      FeePayment.gestudentpaymentdetails({ studentId: studentId }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.Pay = function (data) {
      var _activepromise = $q.defer();
      FeePayment.pay(data, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
     this.saveDiscount = function (data) {
      // console.log(configService.baseUrl() + '/discounts' + '/saveDiscount');
      // console.log(data);
      var _activepromise = $q.defer();
      $http.post(configService.baseUrl() + '/discounts' + '/saveDiscount', data)
        .then(function (response) {
          if (response) {
            _activepromise.resolve(response);
          }
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.StudentOptionals = function (data,isAdd) {
      var _activepromise = $q.defer();
      Student.findById({id:data.id}, function (sdata) {
        if(sdata){
          var opts=sdata.studentOptedOptionalFeestups||[];
          _.each(data.studentOptedOptionalFeestups, function (value, key) {
            if(isAdd && opts.indexOf(value) == -1)opts.push(value);
            if(isAdd ==false && opts.indexOf(value) != -1){
              var index = opts.indexOf(value);
              opts.splice(index, 1);
            }
            Student.prototype$patchAttributes({id:data.id,studentOptedOptionalFeestups:opts}, function (data) {
              _activepromise.resolve(data);
            }, function (err) {
              _activepromise.reject(err);
            });
          });
        
        }

      }, function (err) {
        _activepromise.reject(err);
      });

      return _activepromise.promise;
    };

    this.updateStudent = function (data) {
      var _activepromise = $q.defer();
      Student.prototype$patchAttributes(data, function (response) {
        _activepromise.resolve(response);
      }, function (response) {
        _activepromise.reject(response);
      });
      return _activepromise.promise;
    };
    this.createOptionalFee=function(data){
      var _activepromise = $q.defer();
      Optionals.upsertoptionals(data, function (response) {
        _activepromise.resolve(response);
      }, function (response) {
        _activepromise.reject(response);
      });
      return _activepromise.promise;
    }
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getStudentDetailsById = function (id) {
      var _activepromise = $q.defer();
      Student.findById({ id: id },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getaccountantnamesList = function (schoolId) {
      // console.log(schoolId);
      var _activepromise = $q.defer();
      Admin.find({filter:{where:{ schoolId: schoolId }}},
        function (response) {
          // console.log(response);
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.SchoolDetailsByStudentId = function (schid) {
      var _activepromise = $q.defer();
      School.find({ filter: { where: { id: schid } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.getStudentFeesDetailsById = function (id) {
      var _activepromise = $q.defer();
      StudentFees.find({ filter: { where: { studentId: id } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.StudentFeeReceiptDetailsByStudentId = function (scid, studid) {
      var _activepromise = $q.defer();
      FeePayment.find({ filter: { where: { schoolId: scid, studentId: studid } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };

    this.StudentFeeDetails = function (scid) {
      var _activepromise = $q.defer();
      FeePayment.find({ filter: { where: { schoolId: scid } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };


    this.getMsgid = function (schoolId) {
      var _activepromise = $q.defer();
      School.find({ filter: { where: { id: schoolId } } }, function (response) {
        _activepromise.resolve(response);
        //alert(JSON.stringify(response));
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getStudName = function (studentId) {
      //alert(studentId);
      var _activepromise = $q.defer();
      Student.findOne({ filter: { where: { id: studentId }, include:['class'] } }, function (response) {
        _activepromise.resolve(response);
        //alert('astu'+JSON.stringify(response));
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.CreateOrUpdatePayFees = function (data) {
      var _activepromise = $q.defer();

      FeePayment.create(data, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });

      return _activepromise.promise;
    };

    this.updatePaymentMode = function (data) {
      var _activepromise = $q.defer();
      Student.prototype$patchAttributes({ id: data.id, paymentMode: data.paymentMode }, function (response) {
        _activepromise.resolve(response);
      }, function (response) {
        _activepromise.reject(response);
      });
      return _activepromise.promise;
    };
    this.redirectToOnlinePayment=function(op){

        return Onlinetransactions.genarateTXNlink(op).$promise;
    };


  });
