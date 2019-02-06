'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.transportService
 * @description
 * # transportService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('transportService', function ($q, Bus) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      this.getTransportDetailsBySchoolId = function (schoolId) {
          var _activepromise = $q.defer();
          Bus.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
              _activepromise.resolve(response);
          });
          return _activepromise.promise;
      };
      this.getExistingBusRecords = function (data) {
          var _activepromise = $q.defer();
          Bus.findOne({ filter: { where: { schoolId: data.schoolId, busNo: data.busNo } } },
          function (response) {
              _activepromise.resolve(response);
          }, function (error) {
              _activepromise.reject(error);
          });
          return _activepromise.promise;
      };
      this.CreateOrUpdateBus = function (data) {
          var _activepromise = $q.defer();
          Bus.create({ schoolId: data.schoolId, busNo: data.busNo, busType: data.busType, busCapacity: data.busCapacity },
          function (response) {
              _activepromise.resolve(response);
          }, function (error) {
              _activepromise.reject(error);
          });
          return _activepromise.promise;
      };
      this.deleteBus = function (busId) {
          var _activepromise = $q.defer();
          Bus.deleteById({ id: busId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
      };
      this.updateTransport = function (data) {
          var _activepromise = $q.defer();
          Bus.upsert({ id: data.id, busNo: data.busNo, busType: data.busType, busCapacity: data.busCapacity }, function (response) {
              _activepromise.resolve(response);
          }, function (error) {
              _activepromise.reject(error);
          });
          return _activepromise.promise;
      };
  });
