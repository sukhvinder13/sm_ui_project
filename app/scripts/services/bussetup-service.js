'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.BusserviceService
 * @description
 * # BusserviceService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('BusSetupService', function ($q, Bus, BusSubscription, configService, $http, BusService) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var _serviceList = {};
        // var urlBase = "http://139.162.6.194:3003/explorer/";
        this.getBusserviceDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            BusService.find({ filter: { where: { schoolId: schoolId }, include: 'bus' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getParentData = function (schoolId) {
            // alert("sdfdsf");
            // var data = [];
            console.log("schoolId" + JSON.stringify(schoolId))
            var _activepromise = $q.defer();
            $http.get(configService.tracking() + '/buses?filter={"where":{"schoolId":"' + schoolId + '"}}')

                .then(function (response) {
                    //   console.log(response);
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getExistingBusServiceRecords = function (data) {
            var _activepromise = $q.defer();
            BusService.findOne({ filter: { where: { schoolId: data.schoolId, busId: data.busId, serviceNo: data.serviceNo, serviceName: data.serviceName } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.getBusDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Bus.find({ filter: { where: { schoolId: schoolId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.CreateBusService = function (data) {
            var _activepromise = $q.defer();
            BusService.create(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.CreateBusroutes = function (data) {
            var _activepromise = $q.defer();
            BusSubscription.create(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.updateBusService = function (data) {
            var _activepromise = $q.defer();
            BusService.prototype$patchAttributes(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.CreateBus = function (data) {
            //   console.log(data);
            var _activepromise = $q.defer();
            $http.post(configService.tracking() + '/buses', data)

                .then(function (response) {
                    //   console.log(response);
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.getAreaNameByPoint = function (point) {
            //   console.log(data);
            var _activepromise = $q.defer();
            $http.get(configService.googleMapsApi() + '/geocode/json?latlng=' + point + '&sensor=true&key=AIzaSyAYZQRDl6BO70jUXhVUAyqcCbcgaR0trAM')
                .then(function (response) {
                    //   console.log(response);
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;

        };
        this.getVehicleDetailsbySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            BusService.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getRoutesDetailsBySchooleId = function (schoolId) {
            var _activepromise = $q.defer();
            BusSubscription.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.deleteBusSerice = function (index) {
            // alert("sfgfdsg");
            var _activepromise = $q.defer();
            $http.delete(configService.tracking() + '/buses/' + index)
                .then(function (response) {
                    // console.log()
                    //   console.log(response);
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
            // BusSetupService.deleteById({ id: assignmentId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.setServicesList = function (data) {
            _serviceList = data;
        };
        this.getServiceList = function () {
            return _serviceList;
        };
        this.updateBus = function (data) {
            var _activepromise = $q.defer();
            $http.patch(configService.tracking() + '/buses', data)
                .then(function (response) {
                    // console.log()
                    //   console.log(response);
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;


        }
    });