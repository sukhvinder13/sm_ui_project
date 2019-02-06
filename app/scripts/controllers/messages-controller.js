'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:MessagesControllerCtrl
 * @description
 * # MessagesControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('MessagesController', function (messagesService, $filter, $http, $cookies, $timeout, $window, $log, classupgradeService, Smsreport, toastr, APP_MESSAGES, $scope, Chat, $interval, Comments, Atten, cfpLoadingBar, $rootScope) {
        var MessagesCtrl = this;
        MessagesCtrl.messagesend = [];
        MessagesCtrl.ShowMessageList = [];
        MessagesCtrl.ShowMessageList1 = [];
        MessagesCtrl.todayDate = new Date();
        MessagesCtrl.role = $cookies.get('role');
        MessagesCtrl.loginId = $cookies.getObject('uds').id;
        MessagesCtrl.schoolId = $cookies.getObject('uds').schoolId;
        MessagesCtrl.highlite = 12345678;
        MessagesCtrl.viewCatMsg = false;
        MessagesCtrl.smsReportsearch = "";
        // document.getElementById('loading-bar').style.display = "none";
        // $rootScope.showLoading = false;

        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Messages") {
                MessagesCtrl.roleView = roleAccess[0].RolesData[i].view;
                MessagesCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                MessagesCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }
        //Defaults
        $scope.treeData = [
            {
                'id': 'school',
                'parent': '#',
                'text': 'School',
                'contact': null,
                'state': { opened: true }
            }, {
                'id': 'staff',
                'parent': 'school',
                'text': 'Staff',
                'contact': null,
                'state': { opened: false }
            }, {
                'id': 'admin',
                'parent': 'school',
                'text': 'Admin',
                'contact': null,
                'state': { opened: false }
            }, {
                'id': 'accountent',
                'parent': 'school',
                'text': 'Accountant',
                'contact': null,
                'state': { opened: false }
            }, {
                'id': 'class',
                'parent': 'school',
                'text': 'Class',
                'contact': null,
                'state': { opened: false }
            }];

        //Get Assignment details by School ID
        MessagesCtrl.schoolId = $cookies.getObject('uds').schoolId;
        MessagesCtrl.loginId = $cookies.getObject('uds').id;
        function Init() {
            this.getMsgId = function () {
                messagesService.getMsgid(MessagesCtrl.schoolId).then(function (result) {
                    if (result) {
                        MessagesCtrl.smsid = result;
                        MessagesCtrl.schoolSmsCode = MessagesCtrl.smsid[0].schoolCode;
                        MessagesCtrl.schoolapiUrl = MessagesCtrl.smsid[0].apiUrl;
                        MessagesCtrl.schoolapiKey = MessagesCtrl.smsid[0].apiKey;
                        MessagesCtrl.schoolapiuname = MessagesCtrl.smsid[0].apiUname;
                        MessagesCtrl.schoolapipwd = MessagesCtrl.smsid[0].apiPwd;

                    }
                }, function (error) {
                });
            };
            this.getMessageDetails = function () {
                messagesService.getMessageDetailsByloginId(MessagesCtrl.loginId).then(function (result) {
                    if (result) {
                        MessagesCtrl.messageList = result;
                        cfpLoadingBar.complete();
                        for (var i = 0; i < MessagesCtrl.messageList.length; i++) {
                            MessagesCtrl.messageList[i].status = "send";
                            MessagesCtrl.ShowMessageList1.push(MessagesCtrl.messageList[i]);
                            cfpLoadingBar.complete();
                            $timeout(function () {
                                // MessagesCtrl.callMassageList();
                            }, 1000);
                        }
                        MessagesCtrl.userList = [];
                    }
                }, function (error) {
                });
            };
            this.getMessages = function () {
                messagesService.MessageSend(MessagesCtrl.loginId).then(function (result) {
                    if (result) {
                        cfpLoadingBar.complete();
                        result.forEach(function (result) {
                            messagesService.getdetailedMeassage(result.messageId).then(function (result1) {
                                cfpLoadingBar.complete();
                                if (result1) {
                                    cfpLoadingBar.complete();
                                    MessagesCtrl.ShowMessageList.push(result1);
                                    result1[0].status = "recived";
                                    MessagesCtrl.ShowMessageList1.push(result1[0]);
                                    MessagesCtrl.callMassageList();
                                }
                            });
                        });
                    }
                }, function (error) {
                });
            };
            this.intervelUpdate = function () {
                $timeout(function () {
                    for (var i = 0; i < MessagesCtrl.ShowMessageList1.length; i++) {
                        MessagesCtrl.ShowMessageList1[i].counts = 0;
                        // MessagesCtrl.ShowMessageList2[i].counts = 0;
                        if (MessagesCtrl.ShowMessageList1[i].comments.length !== 0) {
                            for (var q = 0; q < MessagesCtrl.ShowMessageList1[i].comments.length; q++) {
                                if (MessagesCtrl.ShowMessageList1[i].comments[q].createdBy !== MessagesCtrl.loginId) {
                                    if (MessagesCtrl.ShowMessageList1[i].comments[q].status == "") {
                                        MessagesCtrl.ShowMessageList1[i].counts++
                                        // MessagesCtrl.ShowMessageList2[i].counts++
                                    }
                                }
                            }
                        }
                    }
                    MessagesCtrl.ShowMessageList2 = MessagesCtrl.ShowMessageList1;
                }, 1000);
            };
            this.getSmsReports = function () {
                Smsreport.find({ filter: { where: { schoolId: MessagesCtrl.schoolId }, include: 'smsUser' } }, function (results) {
                    if (results) {
                        MessagesCtrl.smsRepots = results;
                    }
                });
                //attendance
                Smsreport.find({ filter: { where: { schoolId: MessagesCtrl.schoolId, smstype: 'AttendanceSms' }, include: 'smsUser' } }, function (results) {
                    if (results) {
                        MessagesCtrl.smsAttendReport = results;
                    }
                })
                //smsReport for mobile
                Smsreport.find({ filter: { where: { schoolId: MessagesCtrl.schoolId, smstype: 'generalSms' }, include: 'smsUser' } }, function (results) {
                    if (results) {
                        MessagesCtrl.smsGenRepots = results;
                    }
                })
                //feeReceipet
                Smsreport.find({ filter: { where: { schoolId: MessagesCtrl.schoolId, smstype: 'feeReceipt' }, include: 'smsUser' } }, function (results) {
                    if (results) {
                        MessagesCtrl.smsFeeReceipt = results;
                    }
                })
            }
            this.getMainAccountCount = function () {
                Atten.find({ filter: { where: { schoolId: MessagesCtrl.schoolId } } }, function (response) {
                    if (response) {
                        MessagesCtrl.countBal = response;
                    }
                })
            }
        }
        (new Init()).getMessageDetails();
        (new Init()).getMessages();
        (new Init()).getMsgId();
        (new Init()).intervelUpdate();
        (new Init()).getSmsReports();
        (new Init()).getMainAccountCount();

        var arrat_temp = [];
        function formatDataToTree(list, key) {
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (key == 'student') {
                        var fn = list[i].firstName ? list[i].firstName : '';
                        var ln = list[i].lastName ? list[i].lastName : '';
                        var data = {
                            'id': list[i].id,
                            'parent': list[i].classId,
                            'text': fn + ' ' + ln,
                            'contact': list[i].contact,
                            'state': { opened: true }

                        };
                    } else {
                        var sn = list[i].sectionName ? list[i].sectionName : '';
                        var data = {
                            'id': list[i].id,
                            'parent': key,
                            'text': key == 'class' ? list[i].className + '  ' + sn : list[i].firstName + ' ' + list[i].lastName,
                            'contact': list[i].contact,
                            'state': { opened: false }

                        };
                    }
                    $scope.treeData.push(data);
                }
            }
        }

        // async to get student, class, staff, account data
        var getStaff = function (cb) {
            messagesService.getStaffDetailsBySchoolId(MessagesCtrl.schoolId).then(function (result) {
                // if (result) {
                MessagesCtrl.staffList = result;
                //Passing data to treeData
                // formatDataToTree(MessagesCtrl.staffList);
                // }
                cb(null, { 'data': result, 'key': 'staff' });
            }, function (error) {
                cb(error);
            });
        };
        var getStudents = function (result, cb) {
            messagesService.getStudentDetailsBySchoolId(MessagesCtrl.schoolId).then(function (result) {
                cb(null, { 'data': result, 'key': 'student' });
            }, function (error) {
                cb(error);
            });
        };
        var getAccountents = function (cb) {
            messagesService.getAccountantDetailsBySchoolId(MessagesCtrl.schoolId).then(function (result) {
                cb(null, { 'data': result, 'key': 'accountent' });
            }, function (error) {
                cb(error);
            });
        };
        var getClasses = function (cb) {
            classupgradeService.getClassDetailsBySchoolId(MessagesCtrl.schoolId).then(function (result) {
                cb(null, { 'data': result, 'key': 'class' });
            }, function (error) {
                cb(error);
            });
        };
        var getAdmins = function (cb) {
            messagesService.getAdminDetailsBySchoolId(MessagesCtrl.schoolId).then(function (result) {
                cb(null, { 'data': result, 'key': 'admin' });
            }, function (error) {
                cb(error);
            });
        };

        async.auto({
            getAdmins: getAdmins,
            getStaff: getStaff,
            getAccountents: getAccountents,
            getClasses: getClasses,
            getStudents: ['getClasses', getStudents]
        }, function (err, result) {
            if (err) {
                console.log('async failed');
            } else {
                for (var property1 in result) {
                    formatDataToTree(result[property1].data, result[property1].key);
                }
            }

        })

        MessagesCtrl.treeConfig = {
            core: {
                multiple: true,
                animation: true,
                error: function (error) {
                    $log.error('treeCtrl: error from js tree' + angular.toJson(error));
                },
                check_callback: true,
                worker: false,
                loaded_stat: true
            },
            types: {
                default: {
                    icon: 'glyphicon glyphicon-education'
                },
                star: {
                    icon: 'glyphicon glyphicon-star'
                },
                cloud: {
                    icon: 'glyphicon glyphicon-cloud'
                }
            },
            version: 1,
            plugins: ['types', 'checkbox']
        };

        // emailFunction end
        MessagesCtrl.messageAction = function (invalid) {
            if (invalid) {
                return;
            }
            MessagesCtrl.senderId = $cookies.getObject('uds').id;
            var selected_nodes = MessagesCtrl.treeInstance.jstree(true).get_checked(true);
            var a = selected_nodes.length;
            var n = a - 1;
            for (n; n >= 0; n--) {
                if (selected_nodes[n].id.length < 20 || selected_nodes[n].parent == 'class') {
                    selected_nodes.splice(n, 1);
                }
            }
            // if(selected_nodes.length == 0){
            //     alert("Please select correct members");
            //     return;
            // }
            MessagesCtrl.subjeMsg = MessagesCtrl.formFields.messagesubject;
            MessagesCtrl.containtMsg = MessagesCtrl.formFields.message;

            var chkMsg = function (i) {
                MessagesCtrl.treaArray = [];
                MessagesCtrl.nodeNameid = selected_nodes[i].id;
                MessagesCtrl.treaArray.push(selected_nodes[i]);
                Chat.find({ filter: { where: { schoolId: MessagesCtrl.schoolId, senderId: MessagesCtrl.loginId, reciverId: MessagesCtrl.nodeNameid } } }, function (respons) {
                    MessagesCtrl.nodeNameid1 = MessagesCtrl.nodeNameid
                    Chat.find({ filter: { where: { schoolId: MessagesCtrl.schoolId, senderId: MessagesCtrl.nodeNameid1, reciverId: MessagesCtrl.loginId } } }, function (response) {
                        if (respons.length > 0) {
                            MessagesCtrl.respww = respons[0].id;
                        }
                        if (response.length > 0) {
                            MessagesCtrl.respww = response[0].id;

                        }
                        // return;                    
                        MessagesCtrl.createdBy = $cookies.getObject('uds').id;
                        MessagesCtrl.createdUserfName = $cookies.getObject('uds').firstName;
                        MessagesCtrl.createdUserLName = $cookies.getObject('uds').lastName;

                        if (respons.length > 0 || response.length > 0) {
                            //comment area
                            var data1 = {
                                schoolId: MessagesCtrl.schoolId,
                                commentMesssage: MessagesCtrl.formFields.message,
                                commentMesssageSubject: MessagesCtrl.formFields.messagesubject,
                                createdBy: MessagesCtrl.createdBy,
                                createdUserfName: MessagesCtrl.createdUserfName,
                                createdUserLName: MessagesCtrl.createdUserLName,
                                updatedTime: new Date(),
                                chatId: MessagesCtrl.respww,
                                status: ""
                            }
                            if (data1) {
                                messagesService.countAndUpdatetime(MessagesCtrl.respww).then(function (result) { if (result) { } })
                                messagesService.AddComment(data1).then(function (res) {
                                    if (res) {
                                        toastr.success(APP_MESSAGES.MESSAGE_SENT);
                                        // clearformfields();
                                        // (new Init()).getMessageDetails();
                                        // resolve('resolved');
                                        // (new Init()).getMessages();
                                        $timeout(function () {
                                            MessagesCtrl.showDetails(MessagesCtrl.callMsg);
                                        }, 5000);

                                    }
                                }, function (error) {
                                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                });
                            }

                        } else {
                            // create area
                            MessagesCtrl.senddate = $filter('date')(new Date(), "dd/MM/yyyy");
                            var data = {
                                schoolId: MessagesCtrl.schoolId,
                                treeData: MessagesCtrl.treaArray,
                                messagesubject: MessagesCtrl.subjeMsg,
                                message: MessagesCtrl.containtMsg,
                                senderId: MessagesCtrl.senderId,
                                reciverId: MessagesCtrl.nodeNameid,
                                msgDate: MessagesCtrl.senddate,
                                // count: 0,
                                actualtime: new Date(),
                                changeTime: new Date()
                            };
                            if (data) {
                                messagesService.CreateOrUpdateMessage(data).then(function (res) {
                                    if (res) {
                                        // (new Init()).getMessageDetails();
                                        toastr.success(APP_MESSAGES.MESSAGE_SENT);
                                        // resolve('resolved');
                                        //Show Toast Message Success
                                        // clearformfields();
                                        // window.location.reload();
                                    }
                                }, function (error) {
                                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                });
                            }
                        }

                    }, function (error) {
                        console.log("error2-------" + error);
                    })
                }, function (error) {
                    console.log("error-------" + error);
                });
            }
            // countDown function with timeout start
            var i = -1;
            function myLoop() {
                setTimeout(function () {
                    i++;                     //  increment the counter
                    if (i < (selected_nodes.length - 1)) {            //  if the counter < 10, call the loop function
                        myLoop();             //  ..  again which will trigger another 
                    }

                    chkMsg(i);
                    if (i == (selected_nodes.length - 1)) {
                        MessagesCtrl.ShowMessageList1 = [];
                        (new Init()).getMessageDetails();
                        (new Init()).getMessages();
                        $timeout(function () {
                            window.location.reload();
                        }, 2000);
                    }
                    // }
                }, 3000)
            }
            myLoop();
            // countDown function with timeout end
        }
        // emailFunction end

        //Send trough SMS
        var bulkmob = [];
        MessagesCtrl.sms = function () {
            MessagesCtrl.senderId = $cookies.getObject('uds').id;
            var selected_nodes = MessagesCtrl.treeInstance.jstree(true).get_checked(true);
            if (!selected_nodes.length > 0) {
                toastr.error('Please select contacts....');
                return;
            }
            // var treedata = selected_nodes;
            if (MessagesCtrl.schoolSmsCode != undefined) {
                var sender = MessagesCtrl.schoolSmsCode;

            }
            else {
                var sender = 'studym';
            }
            var msgSubj = MessagesCtrl.formFields.messagesubject;
            if (msgSubj == undefined) {
                msgSubj = "";
            }
            var msgData = MessagesCtrl.formFields.message;
            var msg = msgSubj + ' ' + msgData;
            var tDate = new Date();
            MessagesCtrl.todayDate = $filter('date')(tDate, "dd-MM-yyyy");

            async.each(selected_nodes, function (singleObj, cb) {
                if (singleObj.id) {
                    var contact_obj = _.find($scope.treeData, { 'id': singleObj.id })
                    if (contact_obj.contact) {
                        // bulkmob = [];
                        bulkmob.push({ mobileNumner: '91' + contact_obj.contact, studentId: contact_obj.id })
                    }
                    cb();
                } else { cb(); }
            }, function (err) {

                var ObjectData = {
                    selectedStudents: bulkmob,
                    senderCode: sender,
                    senderId: MessagesCtrl.senderId,
                    schoolId: MessagesCtrl.schoolId,
                    text: msg,
                    sent_date: tDate,
                    date: MessagesCtrl.todayDate,
                    apiUrl: MessagesCtrl.schoolapiUrl,
                    apiKey: MessagesCtrl.schoolapiKey,
                    schoolapiuname: MessagesCtrl.schoolapiuname,
                    schoolapipwd: MessagesCtrl.schoolapipwd

                }
                messagesService.sendSMS(ObjectData).then(function (success) {
                    console.log("SMS success");
                    console.log(success);
                    bulkmob = [];
                    clearformfields();
                    MessagesCtrl.treeInstance.jstree(true).deselect_all();
                    toastr.success(APP_MESSAGES.MESSAGE_SENT);
                    (new Init()).getSmsReports();
                }).catch(function (err1) {
                    toastr.error('Bulk SMS failed... try again');
                })
            })

            // var a = selected_nodes.length;
            // var n = a - 1;
            // for (n; n >= 0; n--) {
            //     if (selected_nodes[n].id.length < 20 || selected_nodes[n].parent == 'class') {
            //         selected_nodes.splice(n, 1);
            //     }
            // }
            // async.each(selected_nodes, function (node, cb) {
            //     if (node.original.contact && node.original.contact > 999999999) {
            //         Smsreport.create({ schoolId: MessagesCtrl.schoolId, studentId: node.id, smstype: "generalSms", date: MessagesCtrl.todayDate, message: msg1 }, function (response) {
            //             cb();
            //         });
            //     } else {
            //         cb();
            //     }
            // })
            // async.each(treedata, function (singleObj, cb) {
            //     if (singleObj.id) {
            //         var contact_obj = _.find($scope.treeData, { 'id': singleObj.id })
            //         if (contact_obj.contact) {
            //             bulkmob.push('91' + contact_obj.contact)
            //         }
            //         (new Init()).getSmsReports();
            //         cb();
            //     } else { cb(); }
            // }, function (err) {
            //     if (err) { console.log(err) } else {
            //         (new Init()).getSmsReports(); 
            //         var finalBulkmob = _.chunk(bulkmob, 200);
            //         async.each(finalBulkmob, function (chuck, ccb) {
            //             messagesService.sendSMS(sender, chuck.join(), msg).then(function (success) {
            //                 ccb(null, success)
            //             }).catch(function (err1) {
            //                 ccb(null, err1)
            //             })
            //         }, function (errr) {
            //             if (errr) {
            //                 toastr.error('Bulk SMS failed... try again');
            //             } else {
            //                 toastr.success(APP_MESSAGES.MESSAGE_SENT);
            //                 clearformfields();
            //                 MessagesCtrl.treeInstance.jstree(true).deselect_all();
            //             }
            //         })

            //     }
            // })
        }


        // Add COMMENTS
        MessagesCtrl.commentAction = function (invalid) {
            if (invalid) {
                return;
            }
            MessagesCtrl.createdBy = $cookies.getObject('uds').id;
            MessagesCtrl.createdUserfName = $cookies.getObject('uds').firstName;
            MessagesCtrl.createdUserLName = $cookies.getObject('uds').lastName;
            MessagesCtrl.actualTime = new Date();
            var messageId = MessagesCtrl.messageDetail[0].id;
            // var messageId = MessagesCtrl.messageDetail[0].id;
            var data = {
                schoolId: MessagesCtrl.schoolId,
                commentMesssage: MessagesCtrl.formFields.commentMesssage,
                createdBy: MessagesCtrl.createdBy,
                createdUserfName: MessagesCtrl.createdUserfName,
                createdUserLName: MessagesCtrl.createdUserLName,
                updatedTime: MessagesCtrl.actualTime,
                chatId: messageId
            };
            if (data) {
                messagesService.AddComment(data).then(function (res) {
                    if (res) {
                        toastr.success(APP_MESSAGES.MESSAGE_SENT);
                        clearformfields();
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                });
            }
        };
        // Add REPLY send
        MessagesCtrl.replyAction = function (id, invalid) {
            if (invalid) {
                return;
            }
            // return;
            MessagesCtrl.createdBy = $cookies.getObject('uds').id;
            MessagesCtrl.createdUserfName = $cookies.getObject('uds').firstName;
            MessagesCtrl.createdUserLName = $cookies.getObject('uds').lastName;
            MessagesCtrl.actualTime = new Date();
            var messageId = id;
            // var messageId = MessagesCtrl.messageDetail[0].id;
            var data = {
                schoolId: MessagesCtrl.schoolId,
                commentMesssage: MessagesCtrl.formFields.replyAction,
                createdBy: MessagesCtrl.createdBy,
                createdUserfName: MessagesCtrl.createdUserfName,
                createdUserLName: MessagesCtrl.createdUserLName,
                updatedTime: MessagesCtrl.actualTime,
                chatId: messageId,
                status: ""
            };
            if (data) {
                messagesService.countAndUpdatetime(messageId).then(function (result) {
                    if (result) {

                    }
                })
                // return;
                messagesService.AddComment(data).then(function (res) {
                    if (res) {
                        toastr.success(APP_MESSAGES.MESSAGE_SENT);
                        clearformfields();
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                });
            }
        };
        // add comments all messages in one aray start
        MessagesCtrl.commentAction1 = function (invalid) {
            if (invalid) {
                return;
            }
            MessagesCtrl.createdBy = $cookies.getObject('uds').id;
            MessagesCtrl.createdUserfName = $cookies.getObject('uds').firstName;
            MessagesCtrl.createdUserLName = $cookies.getObject('uds').lastName;
            MessagesCtrl.actualTime = new Date();
            var messageId = MessagesCtrl.messageDetail.id;
            // var messageId = MessagesCtrl.messageDetail[0].id;
            var data = {
                schoolId: MessagesCtrl.schoolId,
                commentMesssage: MessagesCtrl.formFields.commentMesssage,
                createdBy: MessagesCtrl.createdBy,
                createdUserfName: MessagesCtrl.createdUserfName,
                createdUserLName: MessagesCtrl.createdUserLName,
                updatedTime: MessagesCtrl.actualTime,
                chatId: messageId,
                commentMesssageSubject: ""
            };
            if (data) {
                messagesService.AddComment(data).then(function (res) {
                    if (res) {
                        toastr.success(APP_MESSAGES.MESSAGE_SENT);
                        clearformfields();
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                });
            }
        };
        // add comments all messages in one aray end


        // Add SENTCOMMENTS
        MessagesCtrl.sentcommentAction = function (invalid) {
            if (invalid) {
                return;
            }
            MessagesCtrl.createdBy = $cookies.getObject('uds').id;
            MessagesCtrl.createdUserfName = $cookies.getObject('uds').firstName;
            MessagesCtrl.createdUserLName = $cookies.getObject('uds').lastName;
            MessagesCtrl.actualTime = new Date();
            var messageId = MessagesCtrl.messageDetail.id;
            var data = {
                schoolId: MessagesCtrl.schoolId,
                commentMesssage: MessagesCtrl.formFields.commentMesssage,
                createdBy: MessagesCtrl.createdBy,
                createdUserfName: MessagesCtrl.createdUserfName,
                createdUserLName: MessagesCtrl.createdUserLName,
                updatedTime: MessagesCtrl.actualTime,
                chatId: messageId
            };
            if (data) {
                messagesService.AddComment(data).then(function (res) {
                    if (res) {
                        toastr.success(APP_MESSAGES.MESSAGE_SENT);
                        clearformfields();
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                });
            }
        };
        MessagesCtrl.getSelectedCategories = function () {
            var selected_nodes = MessagesCtrl.treeInstance.jstree(true).get_checked(true);
        };

        //Clear Fields
        function clearformfields() {
            MessagesCtrl.formFields = {};
        }

        /*
         * Perform actions based on click events
         * */
        MessagesCtrl.openAction = function (i) {
            switch (i) {
                case 1:
                    MessagesCtrl.showcompose = true;
                    MessagesCtrl.showsentmessages = false;
                    MessagesCtrl.messagedetails = false;
                    MessagesCtrl.messagecomments = false;
                    document.getElementById("allmessages").style.backgroundColor = '';
                    document.getElementById("compose").style.backgroundColor = '#904d4f';
                    document.getElementById("allSms").style.backgroundColor = '';
                    // document.getElementById("compose").style.display = 'none';
                    // document.getElementById("allmessages").style.display = '';
                    break;
                case 2:
                    MessagesCtrl.showcompose = false;
                    MessagesCtrl.showsentmessages = false;
                    MessagesCtrl.messagedetails = false;
                    MessagesCtrl.messagecomments = false;
                    document.getElementById("allmessages").style.backgroundColor = '#904d4f';
                    document.getElementById("compose").style.backgroundColor = '';
                    document.getElementById("allSms").style.backgroundColor = '';
                    // document.getElementById("allmessages").style.display = 'none';
                    // document.getElementById("compose").style.display = '';
                    break;
                case 3:
                    MessagesCtrl.showsentmessages = true;
                    MessagesCtrl.showcompose = false;
                    MessagesCtrl.messagedetails = false;
                    MessagesCtrl.messagecomments = false;
                    break;
                case 4:
                    MessagesCtrl.messagedetails = true;
                    MessagesCtrl.showcompose = false;
                    MessagesCtrl.showsentmessages = false;
                    MessagesCtrl.messagecomments = false;
                    break;
                case 5:
                    MessagesCtrl.messagecomments = true;
                    MessagesCtrl.messagedetails = false;
                    MessagesCtrl.showcompose = false;
                    MessagesCtrl.showsentmessages = false;
                    break;
                case 6:
                    MessagesCtrl.messagecomments = true;
                    MessagesCtrl.messagedetails = true;
                    MessagesCtrl.showcompose = true;
                    MessagesCtrl.showsentmessages = true;
                    document.getElementById("allmessages").style.backgroundColor = '';
                    document.getElementById("compose").style.backgroundColor = '';
                    document.getElementById("allSms").style.backgroundColor = '#904d4f';
                    break;
            }
        };
        MessagesCtrl.showDetail = function (index) {
            var inde = MessagesCtrl.messageList.length - (index + 1);
            if (MessagesCtrl.messageList) {
                MessagesCtrl.messageDetail = MessagesCtrl.messageList[inde];
            }
        };
        MessagesCtrl.showDetail1 = function (index) {
            var ind = MessagesCtrl.ShowMessageList.length - (index + 1);
            if (MessagesCtrl.ShowMessageList) {
                MessagesCtrl.messageDetail = MessagesCtrl.ShowMessageList[ind];
            }
        };
        MessagesCtrl.preDefine = function () {
            MessagesCtrl.defined = [];
            MessagesCtrl.defined = [{
                "codeNo": "1",
                "code": "1 (Holiday due to rain)",
                "messagesubject": "Holiday due to rain",
                "message": "Dear Parent & Teachers, School is closed due to Heavy rains on <dd-mm-yyyy >  / from <start date - end date>"
            }, {
                "codeNo": "2",
                "code": "2 (Holiday due to Festival)",
                "messagesubject": "Holiday due to Festival",
                "message": "Dear Parent, School will remain closed tomorrow <dd-mm-yyyy >  for <Festival> festival"
            }, {
                "codeNo": "3",
                "code": "3 (Holiday due to Band/Strike)",
                "messagesubject": "Holiday due to Band / Strike",
                "message": "Dear Parent, School will remain closed on <dd-mm-yyyy >  due to Band / Strike / social unrest"
            }, {
                "codeNo": "4",
                "code": "4 (due to Inter Exams)",
                "messagesubject": "Half Day - due to Inter Exams",
                "message": "Dear Parent, School will work for half day from <dd-mm-yyyy> to <dd-mm-yyyy> due to exams for senior classes"
            }, {
                "codeNo": "5",
                "code": "5 (Summer Holiday Notification)",
                "messagesubject": "Summer Holiday Notification",
                "message": "Dear Parent, Summer Vacation starts on <dd-mm-yyyy>. School will reopen on <dd-mm-yyyy> for next academic year"
            }, {
                "codeNo": "6",
                "code": "6 (School re-opening dates)",
                "messagesubject": "School re-opening dates",
                "message": "Dear Parent, School will reopen on <dd-mm-yyyy> for next academic year"
            }, {
                "codeNo": "7",
                "code": "7 (Exam Dates Notificaiton)",
                "messagesubject": "Exam Dates Notificaiton",
                "message": "Unit Test / Quaterly Exams / Half yearly Exams / Annual Exams - Exams will start on <dd-mm-yyyy>"
            }, {
                "codeNo": "8",
                "code": "8 (Exam Timetable Notificaiton)",
                "messagesubject": "Exam Timetable Notificaiton",
                "message": "Dear Parent, Time Tale for forth coming unit test / exams    Day 1 <dd-mm-yyyy> - <time> - subject  Day 2 <dd-mm-yyyy> - <time> - subject Day 3 <dd-mm-yyyy> - <time> - subject "
            }, {
                "codeNo": "9",
                "code": "9 (Exam Results Notification)",
                "messagesubject": "Exam Results Notification",
                "message": "Dear Parent,  The results for < > exam will be announced on <dd-mm-yyyy> at School office room / notice board"
            }, {
                "codeNo": "10",
                "code": "10 (Annual Day notification)",
                "messagesubject": "Annual Day notification",
                "message": "We have our School Annual day celebrations on  <dd-mm-yyyy> at <time> in <venue>. All children should be present in school / or venue by <time>. Prize winners will have to report to respective class teachers @ backstage by <time>"
            }, {
                "codeNo": "11",
                "code": "11 (Fee reminders)",
                "messagesubject": "Fee reminders",
                "message": "Kindly arrange to make payment of fees at the earliest. The last date for payment is <dd-mm-yyyy>"
            }];
        }
        MessagesCtrl.preDefineBind = function (index) {
            var data = MessagesCtrl.defined[index];
            MessagesCtrl.formFields = data;
        }
        MessagesCtrl.selectDefined = function (preDefinedSelected) {
            for (var i = 0; i < MessagesCtrl.defined.length; i++) {
                if (MessagesCtrl.defined[i].codeNo === preDefinedSelected) {
                    var data = MessagesCtrl.defined[i];
                    MessagesCtrl.formFields = data;
                }
            }
        }

        MessagesCtrl.callMassageList = function () {
            $timeout(function () {
                MessagesCtrl.ShowMessageList2 = MessagesCtrl.ShowMessageList1;
            }, 500);
        }
        $scope.orderByCustom = function (data) {
            var parts = data.msgDate.split('/');
            return new Date(parts[2], parts[1], parts[0]);
        };
        $scope.orderByCustom2 = function (data) {
            // var date = $filter('date')(data.changeTime, 'dd-MM-yyyy');
            // var parts = date.split('-');
            // return new Date(parts[2], parts[1], parts[0]);
            return new Date(data.changeTime);
        };
        MessagesCtrl.chatSheet = function (data) {
            MessagesCtrl.chatSheets = data;
            $interval(callAtInterval, 5000);
        };
        MessagesCtrl.scroll = function () {
            $timeout(function () {
                document.getElementById("conversation").scrollTop = 10000000000000000000000000;
            }, 1000);
        };

        $interval(callAtInterval2, 10000);
        function callAtInterval2() {
            // return;

            MessagesCtrl.ShowMessageList1 = [];
            (new Init()).getMessageDetails();
            (new Init()).getMessages();
            // (new Init()).intervelUpdate();
            cfpLoadingBar.complete();
            $timeout(function () {
                cfpLoadingBar.complete();
                for (var i = 0; i < MessagesCtrl.ShowMessageList1.length; i++) {
                    MessagesCtrl.ShowMessageList1[i].counts = 0;
                    // MessagesCtrl.ShowMessageList2[i].counts = 0;
                    if (MessagesCtrl.ShowMessageList1[i].comments.length !== 0) {
                        for (var q = 0; q < MessagesCtrl.ShowMessageList1[i].comments.length; q++) {
                            if (MessagesCtrl.ShowMessageList1[i].comments[q].createdBy !== MessagesCtrl.loginId) {
                                if (MessagesCtrl.ShowMessageList1[i].comments[q].status == "") {
                                    MessagesCtrl.ShowMessageList1[i].counts++
                                    // MessagesCtrl.ShowMessageList2[i].counts++
                                }
                            }
                        }
                    }
                }
                if (MessagesCtrl.ShowMessageList2.length !== MessagesCtrl.ShowMessageList1) {
                    MessagesCtrl.ShowMessageList2 = MessagesCtrl.ShowMessageList1;
                }
            }, 2000);
        };
        MessagesCtrl.clear = function () {
            MessagesCtrl.searchbar = "";
        };

        MessagesCtrl.selectedChat = function (data) {
            MessagesCtrl.highlite = data.id;
            // Chat.upsert({id:data.id,count:0, changeTime:new Date()});
            cfpLoadingBar.complete();
            Chat.find({ filter: { where: { id: data.id }, include: ['comments', 'sMUser', 'sMReciver'] } }, function (sucess) {
                // $scope.class = "receiver";
                // $scope.class = sender;
                MessagesCtrl.response = sucess;
                cfpLoadingBar.complete();

            })
        };
        function callAtInterval() {
            // return;
            // data = MessagesCtrl.chatSheet;
            MessagesCtrl.selectedChat(MessagesCtrl.chatSheets);
        };

        MessagesCtrl.chatRead = function (chatmsg) {
            if (chatmsg.status == "") {
                if (chatmsg.createdBy !== MessagesCtrl.loginId) {
                    Comments.prototype$patchAttributes({ id: chatmsg.id, status: "Read", readOn: new Date() }, function (result) {
                    })
                }
            } else { }
        };
        MessagesCtrl.checkToday = function (msg) {
            var date = $filter('date')(new Date(), 'dd-MM-yyyy');
            var msgD = $filter('date')(msg.changeTime, 'dd-MM-yyyy');
            var yesta = new Date();
            var yest1 = yesta.setDate(yesta.getDate() - 1);
            var yest = $filter('date')(new Date(yest1), 'dd-MM-yyyy');
            if (date == msgD) {
                msg.changeTime1 = $filter('date')(msg.changeTime, 'hh:mm a');
            } else if (yest == msgD) {
                msg.changeTime1 = "yesterday";
            } else {
                msg.changeTime1 = msg.changeTime;
            }
        };

        MessagesCtrl.closeToggle = function () {
            // MessagesCtrl.tott = true;
            // MessagesCtrl.tott1 = false;
            if (MessagesCtrl.tott == false) {
                MessagesCtrl.tott = true;
                MessagesCtrl.tott1 = false;
            } else {
                MessagesCtrl.tott = false;
                MessagesCtrl.tott1 = false;
            }

        };
        MessagesCtrl.closeToggle1 = function () {
            // MessagesCtrl.tott = false;
            // MessagesCtrl.tott1 = true;
            if (MessagesCtrl.tott1 == false) {
                MessagesCtrl.tott = false;
                MessagesCtrl.tott1 = true;
            } else {
                MessagesCtrl.tott = false;
                MessagesCtrl.tott1 = false;
            }
        };
        MessagesCtrl.viewSmsDetails = function (detailsSms) {
            MessagesCtrl.viewSmsDetailss = detailsSms;
        };
    });
