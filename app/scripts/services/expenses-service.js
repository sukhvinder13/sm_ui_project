'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.expensesService
 * @description
 * # expensesService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('expensesService', function ($q, School, ExpensePayment) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getExpensesBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    ExpensePayment.find({ filter: { where: { schoolId: schoolId } } },
                        function (response) {
                            _activepromise.resolve(response);
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                }
                else if (role === "Staff") {
                    ExpensePayment.find({ filter: { where: { schoolId: schoolId ,userExpenseId : loginId} } },
                        function (response) {
                            _activepromise.resolve(response);
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                }  else if (role === "Accountant") {
                    ExpensePayment.find({ filter: { where: { schoolId: schoolId} } },
                        function (response) {
                            _activepromise.resolve(response);
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                }
                return _activepromise.promise;
            }
        };
        this.getExistingExpenseRecords = function (data) {
            var _activepromise = $q.defer();
            ExpensePayment.findOne({ filter: { where: { expenseType: data.expenseType, description: data.description, schoolId: data.schoolId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.CreateOrUpdateExpense = function (data) {
            var _activepromise = $q.defer();
            ExpensePayment.create({ expenseType: data.expenseType,claimedBy:data.claimedBy, date: data.date, amount: data.amount, description: data.description, schoolId: data.schoolId, userExpenseId :data.userExpenseId,file:data.file, voucherNo: data.voucherNo , paymentMode:data.paymentMode},
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteExpense = function (expenseId) {
            var _activepromise = $q.defer();
            ExpensePayment.deleteById({ id: expenseId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.editExpense = function (data) {
            var _activepromise = $q.defer();
            ExpensePayment.upsert({ id: data.id, expenseType: data.expenseType, claimedBy:data.claimedBy,description: data.description, date: data.date, amount: data.amount, voucherNo: data.voucherNo , paymentMode:data.paymentMode,file:data.file },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
    });
