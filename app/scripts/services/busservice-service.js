'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.BusserviceService
 * @description
 * # BusserviceService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('BusserviceService', function ($q, BusService, Bus, BusSubscription, $http, configService) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var _serviceList = {};
        this.getBusserviceDetailsBySchoolId = function (servicesId) {
            // alert("dsfdfdf");
            // var _activepromise = $q.defer();
            // BusService.find({ filter: { where: { schoolId: schoolId }, include: 'bus' } }, function (response) {
            //     _activepromise.resolve(response);
            // }, function (error) {
            //     _activepromise.reject(error);
            // });
            // return _activepromise.promise;

            var _activepromise = $q.defer();
            console.log(configService.tracking());
            $http.get(configService.tracking() + '/services/' + servicesId)

                .then(function (response) {
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.updateBusServicesRecord = function (data) {
            console.log(data.id);
            console.log(configService.tracking() + '/services/' + data.id)
            // var _activepromise = $q.defer();
            // BusService.find({ filter: { where: { schoolId: schoolId }, include: 'bus' } }, function (response) {
            //     _activepromise.resolve(response);
            // }, function (error) {
            //     _activepromise.reject(error);
            // });
            // return _activepromise.promise;
            var _activepromise = $q.defer();
            $http.patch(configService.tracking() + '/services/' + data.id, data)
                .then(function (response) {
                    console.log(response);
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.createBusServicesRecord = function (data) {
            // var _activepromise = $q.defer();
            // BusService.find({ filter: { where: { schoolId: schoolId }, include: 'bus' } }, function (response) {
            //     _activepromise.resolve(response);
            // }, function (error) {
            //     _activepromise.reject(error);
            // });
            // return _activepromise.promise;

            var _activepromise = $q.defer();
            $http.post(configService.tracking() + '/services', data)
                .then(function (response) {
                    // console.log(response);
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
            var _activepromise = $q.defer();
            Bus.create(data,
                function (response) {
                    _activepromise.resolve(response);
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
            // var _activepromise = $q.defer();
            // BusSubscription.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
            //     _activepromise.resolve(response);
            // }, function (error) {
            //     _activepromise.reject(error);
            // });
            // return _activepromise.promise;
            var _activepromise = $q.defer();
            $http.get(configService.tracking() + '/services?filter={"where":{"schoolId": "' + schoolId + '"},"include":{"relation":"bus","scope":{"fields": {"id": true,"vehicleNo":true,"NoOfSeats":true,"availableSeats":true}}}}')
                .then(function (response) {
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteBusSerice = function (index) {
            // alert("hello");
            var _activepromise = $q.defer();
            $http.delete(configService.tracking() + '/services/' + index)
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
            // BusService.deleteById({ id: assignmentId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };

        
        this.setServicesList = function (data) {
            _serviceList = data;
        };
        this.getServiceList = function () {
            return _serviceList;
        };
    });