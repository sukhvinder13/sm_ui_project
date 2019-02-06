'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.depositService
 * @description
 * # depositService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('depositService', function ($q,School,Deposit ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getExpensesBySchoolId = function (schoolId, loginId) {
      var _activepromise = $q.defer();
      // if (role) {
          // if (role === "Admin") {
              Deposit.find({ filter: { where: { schoolId: schoolId } } },
                  function (response) {
                      _activepromise.resolve(response);
                  }, function (error) {
                      _activepromise.reject(error);
                  });
          // }
          // else if (role === "Staff") {
          //     Deposit.find({ filter: { where: { schoolId: schoolId ,userExpenseId : loginId} } },
          //         function (response) {
          //             _activepromise.resolve(response);
          //         }, function (error) {
          //             _activepromise.reject(error);
          //         });
          // }  else if (role === "Accountant") {
          //     Deposit.find({ filter: { where: { schoolId: schoolId} } },
          //         function (response) {
          //             _activepromise.resolve(response);
          //         }, function (error) {
          //             _activepromise.reject(error);
          //         });
          // }
          return _activepromise.promise;
      // }
  };
  this.getExistingExpenseRecords = function (data) {
      var _activepromise = $q.defer();
      Deposit.findOne({ filter: { where: { date: data.date, bank: data.bank, schoolId: data.schoolId } } },
          function (response) {
              _activepromise.resolve(response);
          }, function (error) {
              _activepromise.reject(error);
          });
      return _activepromise.promise;
  };
  this.CreateOrUpdateExpense = function (data) {
      console.log("service");
      var _activepromise = $q.defer();
      Deposit.create({ date: data.date,bank:data.bank, branch: data.branch, amount: data.amount, schoolId: data.schoolId},
          function (response) {
              _activepromise.resolve(response);
          }, function (error) {
              _activepromise.reject(error);
          });
      return _activepromise.promise;
  };
  this.deleteExpense = function (expenseId) {
      var _activepromise = $q.defer();
      Deposit.deleteById({ id: expenseId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
  };
  this.editExpense = function (data) {
      var _activepromise = $q.defer();
      Deposit.upsert({date: data.date,bank:data.bank, branch: data.branch, amount: data.amount, schoolId: data.schoolId},
          function (response) {
              _activepromise.resolve(response);
          }, function (error) {
              _activepromise.reject(error);
          });
      return _activepromise.promise;
  };
    
  });
