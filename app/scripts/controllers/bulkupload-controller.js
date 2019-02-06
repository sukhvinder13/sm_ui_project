'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:BulkuploadControllerCtrl
 * @description
 * # BulkuploadControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('BulkuploadController', function (configService, $timeout, $cookies, $rootScope, Student, bulkuploadService, toastr, APP_MESSAGES, Staff, $state, $http, $scope, AcademicBatch, School) {
        var BulkuploadCtrl = this;

        BulkuploadCtrl.schoolId = $cookies.getObject('uds').schoolId;
        BulkuploadCtrl.userData = $cookies.getObject('uds');
        BulkuploadCtrl.schoolData = $cookies.getObject('__s');
        //Defaults
        BulkuploadCtrl.staffLength = [];
        BulkuploadCtrl.user = BulkuploadCtrl.userData;
        BulkuploadCtrl.school = BulkuploadCtrl.schoolData;
        BulkuploadCtrl.schoolId = BulkuploadCtrl.school.id;
        $rootScope.image = BulkuploadCtrl.school.image;
        BulkuploadCtrl.schoolCode = BulkuploadCtrl.school.code;
        BulkuploadCtrl.listNum = 0;
        BulkuploadCtrl.studentCountSuccess = [];
        BulkuploadCtrl.studentCountError = [];
        BulkuploadCtrl.staffCountSuccess = [];
        BulkuploadCtrl.staffCountError = [];
        BulkuploadCtrl.showLoading = false;
        var countter, finalCount;

        BulkuploadCtrl.getSchoolName = function () {
            $http.get(configService.baseUrl() + '/Schools/' + $cookies.getObject('uds').schoolId)
                .then(function (response) {
                    BulkuploadCtrl.staffprefix = response.data;
                    BulkuploadCtrl.schoolCode = response.data.schoolCode;
                    for (var w = 0; w < response.data.studentPrefix.length; w++) {
                        if (response.data.studentPrefix[w].SelectModule == "Reg No") {
                            BulkuploadCtrl.stuCodePrefix = response.data.studentPrefix[w].SetPrefix;
                            var countter = response.data.studentPrefix[w].counter - 1;
                            BulkuploadCtrl.stuCodeSetSequence = Number(response.data.studentPrefix[w].SetSequence) + countter;
                        }
                    }
                }, function (error) { });
        };
        BulkuploadCtrl.getSchoolName();

        //managerRoleId start
        $http({
            "url": configService.baseUrl() + '/ManageRoles?filter={"where":{"schoolId":"' + BulkuploadCtrl.schoolId + '","type":"Student"}}',
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            BulkuploadCtrl.managerRoleid = response.data[0].id;
        });
        //managerRoleId end

        //managerRoleId start
        $http({
            "url": configService.baseUrl() + '/ManageRoles?filter={"where":{"schoolId":"' + BulkuploadCtrl.schoolId + '","type":"Staff"}}',
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            BulkuploadCtrl.managerRoleid = response.data[0].id;
        });
        //managerRoleId end

        BulkuploadCtrl.getGenarationNumber = function () {
            Student.find({
                filter: {
                    where: {
                        schoolId: BulkuploadCtrl.schoolId
                    }
                }
            }, function (result) {
                if (result) {
                    BulkuploadCtrl.registrationNumber1 = result.length;
                    BulkuploadCtrl.listNum = BulkuploadCtrl.registrationNumber1 - 1;
                }
            });
        };
        BulkuploadCtrl.getGenarationNumber();


        function Init() {
            this.getClassDetails = function () {
                bulkuploadService.getClassDetailsBySchoolId(BulkuploadCtrl.schoolId).then(function (result) {
                    if (result) {
                        BulkuploadCtrl.classList = result;
                    }
                }, function (error) {
                    //console.log('Error while fetching the records. Error stack : ' + error);
                });
            };
            this.getAcademicDetails = function () {
                AcademicBatch.find({
                    filter: {
                        where: {
                            schoolId: BulkuploadCtrl.schoolId,
                            status: "Active"
                        }
                    }
                }, function (response) {
                    BulkuploadCtrl.showtable = response;
                }, function (error) { });
            };
            this.getStaffDetails = function () {
                Staff.find({
                    filter: {
                        where: {
                            schoolId: BulkuploadCtrl.schoolId
                        }
                    }
                }, function (ress) {
                    BulkuploadCtrl.staffDataLength = ress.length;
                })
            };

            this.getSchoolDetails = function () {
                BulkuploadCtrl.getSchoolName = function () {
                    $http.get(configService.baseUrl() + '/Schools/' + $cookies.getObject('uds').schoolId)
                        .then(function (response) {
                            BulkuploadCtrl.staffprefix = response.data;
                            BulkuploadCtrl.staffprefixSetPrefix = response.data.staffPrefix[0].SetPrefix;
                            BulkuploadCtrl.staffprefixSetSequence = Number(response.data.staffPrefix[0].SetSequence) + response.data.staffPrefix[0].counter - 1;
                            BulkuploadCtrl.schoolCode = response.data.schoolCode;
                            for (var w = 0; w < response.data.studentPrefix.length; w++) {
                                if (response.data.studentPrefix[w].SelectModule == "Reg No") {
                                    BulkuploadCtrl.stuCodePrefix = response.data.studentPrefix[w].SetPrefix;
                                    countter = response.data.studentPrefix[w].counter - 1;
                                    var countter1 = response.data.studentPrefix[w].counter;
                                    BulkuploadCtrl.stuCodeSetSequence = Number(response.data.studentPrefix[w].SetSequence) + countter;
                                    finalCount = Number(response.data.studentPrefix[w].SetSequence) + countter;

                                }
                            }
                        }, function (error) { });
                };
                BulkuploadCtrl.getSchoolName();
            }
        };

        (new Init()).getClassDetails();
        (new Init()).getAcademicDetails();
        (new Init()).getStaffDetails();
        (new Init()).getSchoolDetails();
        $scope.first = true;
        BulkuploadCtrl.uploadFiles = function () {
            $scope.first = !$scope.first;
            // alert("RFID upload");
            var fileData = $('.fileinput:first').fileinput().find('input[type=file]')[0].files[0];

            BulkuploadCtrl.file = document.getElementById('myFile').files[0];
            var fd = new FormData();
            var nd = new FormData();
            fd.append('file', BulkuploadCtrl.file);
            // console.log(BulkuploadCtrl.file);
            var md = new Date(fd.get('file').lastModifiedDate);
            // console.log(md);
            var md1 = Date.parse(md);
            // console.log(md1);
            nd.append('file', BulkuploadCtrl.file, fd.get('file').name + md1);
            // console.log(fd.get('file').name+fd.get('file').lastModifiedDate);
            // console.log(fd.get('file').name+md1 );
            var uploadUrl = configService.baseUrl() + "/ImageContainers/StudBulkUpload/upload";
            $http.post(uploadUrl, nd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {
                    // console.log(response);
                    if (response) {
                        BulkuploadCtrl.file = configService.baseUrl() + '/ImageContainers/StudBulkUpload/download/' + response.data.result[0].filename;

                        var data = {
                            "file": BulkuploadCtrl.file
                        }
                        $http({
                            method: "POST",
                            url: configService.baseUrl() + "/Students/studentUpload",
                            data: data
                        }).
                            then(function (response) {
                                // console.log(response.data);
                                // console.log(response.data.errorRecords);
                                // console.log(response.data.errorRecordLines);
                                // toastr.success(response.data.errorRecordLines);
                                BulkuploadCtrl.rec1 = response.data.errorRecords;
                                // console.log(BulkuploadCtrl.rec1);
                                if (response.data.errorRecords > 0) {
                                    toastr.error(response.data.errorRecords + " " + "Record failed to upload" + "" + response.data.errorRecordLines[0].error + " " + "Please Upload Again");
                                    BulkuploadCtrl.showLoading = false;
                                    BulkuploadCtrl.classId = "";
                                    BulkuploadCtrl.academicbatch = "";
                                    BulkuploadCtrl.clearform();
                                    $scope.first = true;
                                    // console.log(data);
                                    data = {}
                                    return
                                }
                                //     });
                                // }, function (error) {
                                // });


                                if (fileData) {
                                    //CSV Files parsing
                                    Papa.parse(fileData, {
                                        header: true,
                                        dynamicTyping: true,
                                        complete: function (results) {
                                            BulkuploadCtrl.list = results.data;
                                            BulkuploadCtrl.showLoading = true;
                                            var url = 'http://studymonitor.net/';
                                            // for (var i = 0; i < BulkuploadCtrl.list.length - 1; i++) {
                                            var i = -1;

                                            function myLoop() {
                                                setTimeout(function () {
                                                    i++; //  increment the counter
                                                    if (i < (BulkuploadCtrl.list.length - 1)) { //  if the counter < 10, call the loop function
                                                        myLoop(); //  ..  again which will trigger another 
                                                    }
                                                    BulkuploadCtrl.list[i].classId = BulkuploadCtrl.classId;
                                                    BulkuploadCtrl.list[i].dateofBirth = new Date(BulkuploadCtrl.list[i].DateofJoin);
                                                    BulkuploadCtrl.list[i].dateofJoin = new Date(BulkuploadCtrl.list[i].DateofBirth);
                                                    BulkuploadCtrl.list[i].managerRoleId = BulkuploadCtrl.managerRoleid;
                                                    BulkuploadCtrl.listNum++;
                                                    BulkuploadCtrl.list[i].AcademicBatch = BulkuploadCtrl.academicbatch;

                                                    BulkuploadCtrl.stuCodeSetSequence++
                                                    var regex = /(\d+)/g;
                                                    var dss = BulkuploadCtrl.list[i].DateofBirth.match(regex);
                                                    var ssssd = BulkuploadCtrl.list[i].DateofJoin.match(regex);
                                                    if (dss == null || ssssd == null) {
                                                        BulkuploadCtrl.stuCodeSetSequence--;
                                                    }
                                                    BulkuploadCtrl.list[i].registrationNo = BulkuploadCtrl.stuCodePrefix + BulkuploadCtrl.stuCodeSetSequence;
                                                    BulkuploadCtrl.list[i].image = url + BulkuploadCtrl.schoolCode + '/' + BulkuploadCtrl.list[i].classId + '/' + BulkuploadCtrl.list[i].rollNo + '.png';
                                                    chkStudent(BulkuploadCtrl.list[i], i, BulkuploadCtrl.stuCodePrefix);
                                                    // }
                                                }, 3000)
                                            }
                                            myLoop();
                                        }
                                    });
                                }
                                // }
                            });
                    }
                }, function (error) { });
        };
        BulkuploadCtrl.ChangeView = function (view) {
            if (view == "enrollstudent") {
                $state.go('home.addstudent');
            } else if (view == "enrollstaff") {
                $state.go('home.addstaff');
            } else if (view == "enrollmultiplestudent") {
                $state.go('home.bulkupload');
            } else if (view == "enrollmultiplestaff") {
                $state.go('home.staffbulkupload');
            } else if (view == "enrollaccountant") {
                $state.go('home.addaccountant');
            }
        }
        $scope.first = true;
        var staffcount1 = 0;
        BulkuploadCtrl.uploadFiles1 = function () {
            $scope.first = !$scope.first;
            var fileData = $('.fileinput:first').fileinput().find('input[type=file]')[0].files[0];
            BulkuploadCtrl.stafffile = document.getElementById('myFile1').files[0];
            var fd = new FormData();
            var nd = new FormData();
            fd.append('file', BulkuploadCtrl.stafffile);
            // console.log(BulkuploadCtrl.stafffile);
            var md = new Date(fd.get('file').lastModifiedDate);
            // console.log(md);
            var md1 = Date.parse(md);
            // console.log(md1);
            nd.append('file', BulkuploadCtrl.stafffile, fd.get('file').name + md1);
            // console.log(fd.get('file').name+fd.get('file').lastModifiedDate);
            // console.log(fd.get('file').name+md1 );
            var uploadUrl = configService.baseUrl() + "/ImageContainers/StaffBulkUpload/upload";
            $http.post(uploadUrl, nd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {
                    if (response) {
                        BulkuploadCtrl.stafffile = configService.baseUrl() + '/ImageContainers/StaffBulkUpload/download/' + response.data.result[0].filename;
                        // console.log(BulkuploadCtrl.stafffile);
                        var data = {
                            "staffFile": BulkuploadCtrl.stafffile
                        }
                        // console.log(configService.baseUrl() + "/Staffs/staffUpload");
                        $http({
                            method: "POST",
                            url: configService.baseUrl() + "/Staffs/staffUpload",
                            data: data
                        }).
                            then(function (response) {
                                // console.log(response.data);
                                // console.log(response.data.errorRecords);
                                // console.log(response.data.errorRecordLines);
                                // toastr.error(response.data.errorRecordLines);
                                BulkuploadCtrl.rec1 = response.data.errorRecords;
                                // console.log(BulkuploadCtrl.rec1);
                                if (response.data.errorRecords > 0) {
                                    toastr.error(response.data.errorRecords + " " + "Record failed to upload" + " " + response.data.errorRecordLines[0].error + " " + "Please Upload Again");
                                    // toastr.error(response.data.errorRecords  + " " + "Record failed to upload");
                                    BulkuploadCtrl.showLoading = false;
                                    BulkuploadCtrl.classId = "";
                                    BulkuploadCtrl.academicbatch = "";
                                    BulkuploadCtrl.clearform();
                                    $scope.first = true;
                                    return
                                }
                                //             });
                                //     }
                                // }, function (error) {
                                // });
                                if (fileData) {
                                    //CSV Files parsing
                                    Papa.parse(fileData, {
                                        header: true,
                                        dynamicTyping: true,
                                        complete: function (results) {
                                            BulkuploadCtrl.stafflist = results.data;
                                            var url = 'http://studymonitor.net/';
                                            for (var i = 0; i < BulkuploadCtrl.stafflist.length - 1; i++) {
                                                BulkuploadCtrl.stafflist[i].dateofBirth = new Date(BulkuploadCtrl.stafflist[i].DateofBirth);
                                                BulkuploadCtrl.stafflist[i].dateofJoin = new Date(BulkuploadCtrl.stafflist[i].DateofJoin);
                                                BulkuploadCtrl.stafflist[i].managerRoleId = BulkuploadCtrl.managerRoleid;
                                                BulkuploadCtrl.staffprefixSetSequence++;
                                                var regex = /(\d+)/g;
                                                var dss = BulkuploadCtrl.stafflist[i].DateofBirth.match(regex);
                                                var ssssd = BulkuploadCtrl.stafflist[i].DateofJoin.match(regex);
                                                if (dss == null || ssssd == null) {
                                                    BulkuploadCtrl.staffprefixSetSequence--;
                                                }
                                                BulkuploadCtrl.stafflist[i].RegistrationNumber = BulkuploadCtrl.staffprefixSetPrefix + BulkuploadCtrl.staffprefixSetSequence;;
                                                BulkuploadCtrl.stafflist[i].image = url + BulkuploadCtrl.schoolCode + '/' + BulkuploadCtrl.stafflist[i].rollNo + '.png';
                                                staffcount1++;
                                                chkStaff(BulkuploadCtrl.stafflist[i], i);
                                            }
                                        }
                                    });
                                }
                            });
                    }
                }, function (error) { });
        };
        // -----------------------------------------------------
        var count = 0;
        var chkStudent = function (student, index, precode) {

            var date = student.DateofBirth;
            var regex = /(\d+)/g;
            var d = date.match(regex);
            // if(d == null){
            //     BulkuploadCtrl.stuCodeSetSequence--;
            // }
            if (d[1].length == 1) {
                d[1] = "0" + d[1];
            }

            var out = d[0] + "-" + d[1] + "-" + d[2];
            BulkuploadCtrl.DOB = out;

            var DateofJoin = student.DateofJoin;

            var regexo = /(\d+)/g;
            var doa = DateofJoin.match(regexo);
            // if(doa == null){
            //     BulkuploadCtrl.stuCodeSetSequence--;
            // }
            if (doa[1].length == 1) {
                doa[1] = "0" + doa[1];
            }
            var outo = doa[0] + "-" + doa[1] + "-" + doa[2];
            BulkuploadCtrl.DOJ = outo;
            Student.find({
                filter: {
                    where: {
                        schoolId: BulkuploadCtrl.schoolId
                    }
                }
            }, function (response) {
                BulkuploadCtrl.studLength = response.length;

            });
            //  Student Check For Roll No
            Student.findOne({
                filter: {
                    where: {
                        classId: student.classId,
                        rollNo: student.RollNo
                    }
                }
            },
                function () {
                    BulkuploadCtrl.studentCountError.push(student);
                    if ((BulkuploadCtrl.list.length - 2) == index) {
                        BulkuploadCtrl.showLoading = false;
                        if (BulkuploadCtrl.studentCountSuccess.length > 0) {
                            toastr.success(BulkuploadCtrl.studentCountSuccess.length + " " + " " + "Records" + " " + "Uploaded" + " " + "Successfully");
                            $scope.first = !$scope.first;
                            BulkuploadCtrl.classId = "";
                            BulkuploadCtrl.academicbatch = "";
                            BulkuploadCtrl.clearform();
                            (new Init()).getSchoolDetails();
                        };
                        if (BulkuploadCtrl.studentCountError.length > 0) {
                            toastr.error(BulkuploadCtrl.studentCountError.length + " " + " " + "Records" + " " + "Not Uploaded" + " " + "Successfully");
                            $scope.first = !$scope.first;
                            BulkuploadCtrl.classId = "";
                            BulkuploadCtrl.academicbatch = "";
                            BulkuploadCtrl.clearform();
                            (new Init()).getSchoolDetails();

                        };
                        School.find({
                            filter: {
                                where: {
                                    id: BulkuploadCtrl.schoolId
                                }
                            }
                        }, function (respons) {
                            for (var e = 0; e < respons[0].studentPrefix.length; e++) {
                                if (respons[0].studentPrefix[e].SelectModule == "Reg No") {
                                    respons[0].studentPrefix[e].counter + BulkuploadCtrl.studentCountSuccess.length;
                                    var countter1 = respons[0].studentPrefix[e].counter + BulkuploadCtrl.studentCountSuccess.length;
                                    respons[0].studentPrefix[e].counter = countter1;
                                    var dataCount = respons[0].studentPrefix;
                                }
                            }
                            School.prototype$patchAttributes({
                                id: BulkuploadCtrl.schoolId,
                                studentPrefix: dataCount
                            })

                        })
                        $timeout(function () {
                            BulkuploadCtrl.studentCountSuccess = [];
                            BulkuploadCtrl.studentCountError = [];
                            var count = 0;
                        }, 2000);
                    }
                },
                function (res) {
                    if (res) {
                        Student.create({
                            academicbatch: student.AcademicBatch,
                            // registrationNo:precode+''+finalCount,
                            registrationNo: student.registrationNo,

                            schoolId: BulkuploadCtrl.schoolId,
                            firstName: student.FirstName ? student.FirstName : "",
                            lastName: student.LastName ? student.LastName : "",
                            email: student.EmailId,
                            password: '123456',
                            gender: student.Gender,
                            DOB: BulkuploadCtrl.DOB,
                            rollNo: student.RollNo,
                            RFID: student.RFID,
                            previousSchool: student.PreviousSchool,
                            DOJ: BulkuploadCtrl.DOJ,
                            classId: student.classId,
                            regId: student.AdmissionNumber,
                            isDisable: student.IsDisable,
                            currentAddress: student.CurrentAddress,
                            currentCity: student.CurrentCity,
                            currentState: student.CurrentState,
                            currentPincode: student.CurrentPincode,
                            bloodGroup: student.BloodGroup,
                            religion: student.Religion,
                            caste: student.Caste,
                            alternateContact: student.MotherContact,
                            permanentAddress: student.permanentAddress,
                            permanentCity: '',
                            permanentState: '',
                            permanentPincode: '',
                            nationalId: student.NationalId,
                            motherTounge: student.MotherTounge,
                            nationalIdType: student.NationalIdType,
                            subCaste: student.SubCaste,
                            contact: student.Contact,
                            type: 'Student',
                            created: new Date(),
                            image: student.image,
                            fatherName: student.FatherName,
                            motherName: student.MotherName,
                            // fatherContact: '',
                            // motherContact: '',
                            classofAdmission: student.ClassofAdmission,
                            identificationMarks: student.IdentificationMarks,
                            motherEmail: student.MotherEmail,
                            fatherEmail: student.FatherEmail,
                            fatherContact: student.FatherContact,
                            manageRoleId: student.managerRoleId,
                        }, function (rres) {
                            if (rres.RFID == "NA" || rres.RFID == undefined || rres.RFID == '' || rres.RFID == 'null') {
                                //  console.log("if");
                                Student.prototype$patchAttributes({
                                    id: rres.id,
                                    RFID: rres.id + "1"
                                }, function (ress) { });
                            } else {
                                // console.log("else");
                                Student.prototype$patchAttributes({
                                    id: rres.id,
                                    RFID: rres.RFID
                                }, function (ress) { });
                            }
                            finalCount++;
                            Student.find({
                                filter: {
                                    where: {
                                        schoolId: BulkuploadCtrl.schoolId
                                    }
                                }
                            }, function (response) {

                                BulkuploadCtrl.studLength1 = response.length;
                                BulkuploadCtrl.UploadedData = parseInt(BulkuploadCtrl.studLength1) - parseInt(BulkuploadCtrl.studLength);
                                // toastr.success(BulkuploadCtrl.UploadedData + " " + " " + "Records" + " " + "Uploaded" + " " + "Successfully");

                            });
                            if (rres) {
                                // BulkuploadCtrl.stuCodeSetSequence++;
                                count++;
                            }
                            //Show Toast Message Success
                            // toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                            BulkuploadCtrl.studentCountSuccess.push(student);
                            if ((BulkuploadCtrl.list.length - 2) == index) {
                                BulkuploadCtrl.showLoading = false;
                                if (BulkuploadCtrl.studentCountSuccess.length > 0) {
                                    toastr.success(BulkuploadCtrl.studentCountSuccess.length + " " + " " + "Records" + " " + "Uploaded" + " " + "Successfully");
                                    $scope.first = !$scope.first;
                                    BulkuploadCtrl.classId = "";
                                    BulkuploadCtrl.academicbatch = "";
                                    BulkuploadCtrl.clearform();
                                    (new Init()).getSchoolDetails();
                                };
                                if (BulkuploadCtrl.studentCountError.length > 0) {
                                    toastr.error(BulkuploadCtrl.studentCountError.length + " " + " " + "Records" + " " + "Not Uploaded" + " " + "Successfully");
                                    $scope.first = !$scope.first;
                                    BulkuploadCtrl.classId = "";
                                    BulkuploadCtrl.academicbatch = "";
                                    BulkuploadCtrl.clearform();
                                    (new Init()).getSchoolDetails();
                                };
                                School.find({
                                    filter: {
                                        where: {
                                            id: BulkuploadCtrl.schoolId
                                        }
                                    }
                                }, function (respons) {
                                    for (var e = 0; e < respons[0].studentPrefix.length; e++) {
                                        if (respons[0].studentPrefix[e].SelectModule == "Reg No") {
                                            respons[0].studentPrefix[e].counter + BulkuploadCtrl.studentCountSuccess.length;
                                            var countter1 = respons[0].studentPrefix[e].counter + BulkuploadCtrl.studentCountSuccess.length;
                                            respons[0].studentPrefix[e].counter = countter1;
                                            var dataCount = respons[0].studentPrefix;
                                        }
                                    }
                                    School.prototype$patchAttributes({
                                        id: BulkuploadCtrl.schoolId,
                                        studentPrefix: dataCount
                                    })

                                })
                                $timeout(function () {
                                    BulkuploadCtrl.studentCountSuccess = [];
                                    BulkuploadCtrl.studentCountError = [];
                                    var count = 0;

                                }, 2000);
                            }
                        }, function (response) {
                            // console.log("gggggggggggg", JSON.stringify(response));
                        });
                    }
                });
        };
        //STaff Bulk Upload
        var staffcount = 0;
        var chkStaff = function (staff, ind) {
            var date = staff.DateofBirth;
            var regex = /(\d+)/g;
            var d = date.match(regex);
            if (d[1].length == 1) {
                d[1] = "0" + d[1];
            }
            var out = d[0] + "-" + d[1] + "-" + d[2];
            BulkuploadCtrl.DOB1 = out;

            var DateofJoin = staff.DateofJoin;
            var regexo = /(\d+)/g;
            var doa = DateofJoin.match(regexo);
            if (doa[1].length == 1) {
                doa[1] = "0" + doa[1];
            }
            var outo = doa[0] + "-" + doa[1] + "-" + doa[2];
            BulkuploadCtrl.DOJ1 = outo;
            Staff.find({
                filter: {
                    where: {
                        schoolId: BulkuploadCtrl.schoolId
                    }
                }
            }, function (response) {
                BulkuploadCtrl.staffLength.push(response.length);
            });
            //  Student Check For Roll No
            Staff.findOne({
                filter: {
                    where: {
                        schoolId: BulkuploadCtrl.schoolId,
                        emailId: staff.EmailId
                    }
                }
            },
                function () {
                    BulkuploadCtrl.staffCountError.push(staff);
                    if ((BulkuploadCtrl.stafflist.length - 2) == ind) {
                        $timeout(function () {
                            if (BulkuploadCtrl.staffCountSuccess.length > 0) {
                                toastr.success(BulkuploadCtrl.staffCountSuccess.length + " " + " " + "Records" + " " + "Uploaded" + " " + "Successfully");
                                BulkuploadCtrl.showLoading = false;
                                BulkuploadCtrl.clearform();
                                $scope.first = true;
                                (new Init()).getSchoolDetails();
                            }
                            if (BulkuploadCtrl.staffCountError.length > 0) {
                                toastr.error(BulkuploadCtrl.UploadedData1 + " " + " " + "Records" + " " + " Not Uploaded" + " " + "Successfully");
                                BulkuploadCtrl.showLoading = false;
                                BulkuploadCtrl.clearform();
                                $scope.first = true;
                                (new Init()).getSchoolDetails();
                            }
                            School.find({
                                filter: {
                                    where: {
                                        id: BulkuploadCtrl.schoolId
                                    }
                                }
                            }, function (respons) {
                                respons[0].staffPrefix[0].counter + BulkuploadCtrl.staffCountSuccess.length;
                                var countter1 = respons[0].staffPrefix[0].counter + BulkuploadCtrl.staffCountSuccess.length;
                                respons[0].staffPrefix[0].counter = countter1;
                                var dataCount = respons[0].staffPrefix;
                                School.prototype$patchAttributes({
                                    id: BulkuploadCtrl.schoolId,
                                    staffPrefix: dataCount
                                })

                            })
                            $timeout(function () {
                                BulkuploadCtrl.staffCountSuccess = [];
                                BulkuploadCtrl.staffCountError = [];
                                (new Init()).getSchoolDetails();
                            }, 2000);
                        }, 5000);
                    };
                },
                function (res) {
                    if (res) {
                        Staff.create({
                            schoolId: BulkuploadCtrl.schoolId,
                            firstName: staff.Firstname,
                            lastName: staff.LastName,
                            email: staff.EmailId,
                            password: '123456',
                            gender: staff.Gender,
                            dateofBirth: BulkuploadCtrl.DOB1,
                            RFID: staff.RFID,
                            dateofJoin: BulkuploadCtrl.DOJ1,
                            regId: staff.RegistrationNumber,
                            currentAddress: staff.CurrentAddress,
                            currentCity: staff.CurrentCity,
                            currentState: staff.CurrentState,
                            currentPincode: staff.CurrentPincode,
                            bloodGroup: staff.BloodGroup,
                            alternateContact: staff.AlternateContactNumber,
                            nationalId: staff.NationalId,
                            motherTounge: staff.MotherTounge,
                            nationalIdType: staff.NationalIdType,
                            contact: staff.ContactNumber,
                            qualification: staff.Qualification,
                            percentage: staff.Percentage,
                            qualifiedUniversity: staff.University,
                            designation: staff.Designation,
                            BED: staff.BED,
                            classId: staff.ClassName,
                            manageRoleId: staff.managerRoleId

                        }, function (dataResponse) {
                            // console.log(dataResponse.RFID);
                            if (dataResponse.RFID == "NA" || dataResponse.RFID == undefined || dataResponse.RFID == '' || dataResponse.RFID == 'null') {
                                Staff.prototype$patchAttributes({
                                    id: dataResponse.id,
                                    RFID: dataResponse.id + "2"
                                }, function (ress) { });
                            } else {
                                Staff.prototype$patchAttributes({
                                    id: dataResponse.id,
                                    RFID: dataResponse.RFID
                                }, function (ress) { });
                            }
                            Staff.find({
                                filter: {
                                    where: {
                                        schoolId: BulkuploadCtrl.schoolId
                                    }
                                }
                            }, function (response) {
                                BulkuploadCtrl.staffLength1 = response.length;
                                BulkuploadCtrl.UploadedData1 = parseInt(BulkuploadCtrl.staffLength1) - parseInt(BulkuploadCtrl.staffLength);
                            });
                            staffcount++;

                            //Show Toast Message Success
                            BulkuploadCtrl.staffCountSuccess.push(staff);
                            if ((BulkuploadCtrl.stafflist.length - 2) == ind) {
                                $timeout(function () {
                                    if (BulkuploadCtrl.staffCountSuccess.length > 0) {
                                        toastr.success(BulkuploadCtrl.staffCountSuccess.length + " " + " " + "Records" + " " + "Uploaded" + " " + "Successfully");
                                        BulkuploadCtrl.showLoading = false;
                                        BulkuploadCtrl.clearform();
                                        $scope.first = true;
                                        (new Init()).getSchoolDetails();
                                    }
                                    if (BulkuploadCtrl.staffCountError.length > 0) {
                                        toastr.error(BulkuploadCtrl.UploadedData1 + " " + " " + "Records" + " " + "Not Uploaded" + " " + "Successfully");
                                        BulkuploadCtrl.showLoading = false;
                                        BulkuploadCtrl.clearform();
                                        $scope.first = true;
                                        (new Init()).getSchoolDetails();
                                    }
                                    School.find({
                                        filter: {
                                            where: {
                                                id: BulkuploadCtrl.schoolId
                                            }
                                        }
                                    }, function (respons) {
                                        respons[0].staffPrefix[0].counter + BulkuploadCtrl.staffCountSuccess.length;
                                        var countter1 = respons[0].staffPrefix[0].counter + BulkuploadCtrl.staffCountSuccess.length;
                                        respons[0].staffPrefix[0].counter = countter1;
                                        var dataCount = respons[0].staffPrefix;
                                        School.prototype$patchAttributes({
                                            id: BulkuploadCtrl.schoolId,
                                            staffPrefix: dataCount
                                        })

                                    })
                                    $timeout(function () {
                                        BulkuploadCtrl.staffCountSuccess = [];
                                        BulkuploadCtrl.staffCountError = [];
                                        (new Init()).getSchoolDetails();
                                    }, 2000);
                                }, 5000);
                            }
                        }, function (response) {
                            console.log(response.data.error);
                        });
                    }
                });
        };
        BulkuploadCtrl.clearform = function () {
            fileuploadform.reset();
        }
    });