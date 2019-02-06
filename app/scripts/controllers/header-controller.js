'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:HeaderControllerCtrl
 * @description
 * # HeaderControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('HeaderController', function ($cookies, $state,School,$timeout,busLiveService,toastr,$location) {
        var HeaderCtrl = this;
        var trakingurl = "http://livetrack.studymonitor.in/vts/index.php/sessions/login";
        //Defaults
        HeaderCtrl.schoolId = $cookies.getObject('uds').schoolId;
        HeaderCtrl.userName = $cookies.getObject('uds').firstName;
        HeaderCtrl.lastName = $cookies.getObject('uds').lastName;
        HeaderCtrl.role = $cookies.get('role');
        HeaderCtrl.file = $cookies.getObject('uds').file;
        HeaderCtrl.loginId =   $cookies.getObject('uds').id
        /*
         * Logout screen and clear all cookies values
         */
        HeaderCtrl.logout = function () {
            //Clear the cookies and navigate to login
            $cookies.remove('uds');
            $cookies.remove('uts');
            $state.go('login');
        };
        HeaderCtrl.directory = function () {
            if (HeaderCtrl.role == 'Student') {
                $location.url('studentmoreDetails/' + HeaderCtrl.loginId);
              } else if (HeaderCtrl.role == 'Staff') {
                $location.url('staffmoreDetails/' + HeaderCtrl.loginId);
              }
       
        };
        HeaderCtrl.home = function () {
            //Clear the cookies and navigate to home
            $cookies.remove('uds');
            $state.go('identity.home');
        };

        /*
         * Initialize the controller
         */
        function Init() {
            this.getSchoolLogo = function () {
                var schoolDetails = $cookies.getObject('__s');
                if (!angular.equals({}, schoolDetails)) {
                    HeaderCtrl.schoolLogo = schoolDetails.logo;
                }
            };
            School.find({filter:{where:{id:HeaderCtrl.schoolId}}},function(response){
                // HeaderCtrl.rfid = response;

                if(response){
                    HeaderCtrl.schmarkFormat = response[0].marksFormat;
                    // HeaderCtrl.rfidView = response[0].viewrfid;
                    // console.log(  HeaderCtrl.rfidView);
                    if(response[0].marksFormat1){
                        if(response[0].marksFormat1 == "TEMP1"){                            
                        HeaderCtrl.viewMarks =false;
                        HeaderCtrl.viewMarks1 =true;
                    }
                    }else{
                        HeaderCtrl.viewMarks =true;
                        HeaderCtrl.viewMarks1 =false;
                    }
                } else if (error) {
                    //console.log(error);
                }

            })

        }
        
        (new Init()).getSchoolLogo();
        //Role_levelAcesses Conditions 
        $timeout(function () {

            // }, 1000);
            var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
            for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
                if (roleAccess[0].RolesData[i].name === "Class") {
                    HeaderCtrl.classroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Assignments") {
                    HeaderCtrl.AssignmentroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }

                else if (roleAccess[0].RolesData[i].name === "Attendance") {
                    HeaderCtrl.AttendanceroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }


                else if (roleAccess[0].RolesData[i].name === "Add Bus") {
                    HeaderCtrl.BusroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;


                }

                else if (roleAccess[0].RolesData[i].name === "Bus Services") {
                    HeaderCtrl.BusServiceroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;


                }

                else if (roleAccess[0].RolesData[i].name === "Bus Subscription") {
                    HeaderCtrl.BusSubscriptionroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;


                }

                else if (roleAccess[0].RolesData[i].name === "Complaint") {
                    HeaderCtrl.ComplaintroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Enquiry Form") {
                    HeaderCtrl.EnquiryroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Create Exam") {
                    HeaderCtrl.ExamroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Exam Type") {
                    HeaderCtrl.ExamTyperoleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "create Exam New") {
                    HeaderCtrl.FOexamroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Add Marks") {
                    HeaderCtrl.FOmarksroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Subject") {
                    HeaderCtrl.FOsubjectroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Fee Category") {
                    HeaderCtrl.FeeCategoryroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Fee Payment") {
                    HeaderCtrl.FeePaymentroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Fee Setup") {
                    HeaderCtrl.FeeSetuproleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Grade Configuration") {
                    HeaderCtrl.GraderoleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Leave") {
                    HeaderCtrl.LeaveroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Leave Approval") {
                    HeaderCtrl.LeaveApprovalroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }

                else if (roleAccess[0].RolesData[i].name === "Rfid") {
                    HeaderCtrl.rfidroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Lesson Planner") {
                    HeaderCtrl.LessonPlannerroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Library") {
                    HeaderCtrl.LibraryroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Mail") {
                    HeaderCtrl.MailroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Manage Role") {
                    HeaderCtrl.ManageRoleroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Marks") {
                    HeaderCtrl.MarksroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Max Mark") {
                    HeaderCtrl.MaxMarkroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Media Upload") {
                    HeaderCtrl.MediaroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Messages") {
                    HeaderCtrl.MessagesroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "More Details") {
                    HeaderCtrl.MoreDetailsroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Notice Board") {
                    HeaderCtrl.NoticeBoardroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Role Creation") {
                    HeaderCtrl.RoleCreationroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Schedule") {
                    HeaderCtrl.ScheduleroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "School Calender") {
                    HeaderCtrl.SchoolCalenderroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "School Directory") {
                    HeaderCtrl.SchoolDirectoryroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Time Table") {
                    HeaderCtrl.SchoolTimetableroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Student Fees") {
                    HeaderCtrl.studentFeesroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }



                else if (roleAccess[0].RolesData[i].name === "Subject New") {
                    HeaderCtrl.SubjectroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Visitor Book") {
                    HeaderCtrl.VisitorroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Bulk Upload Option") {
                    HeaderCtrl.BulkUploadroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Print Certificate") {
                    HeaderCtrl.CertificateroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Expenses") {
                    HeaderCtrl.ExpencesroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Enrollement") {
                    HeaderCtrl.EnrollementroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Fee Structure") {
                    HeaderCtrl.FeeStructureroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Bus Live Status") {
                    HeaderCtrl.BusLiveroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Add Marks New") {
                    HeaderCtrl.AddMarksroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Reports") {
                    HeaderCtrl.ReportsroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Vehicle Reports") {
                    HeaderCtrl.VehicleroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "View Marks") {
                    HeaderCtrl.ViewMarksroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }
                else if (roleAccess[0].RolesData[i].name === "Promote Student") {
                    HeaderCtrl.PromoteStudentroleView = roleAccess[0].RolesData[i].view;
                    HeaderCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                    HeaderCtrl.roledelete = roleAccess[0].RolesData[i].delete;
                }


            }

        }, 1000);

        //Role_levelAcesses Conditions End
        //   init();
        //   $timeout(function(){
        //       Layout();
        //   },500);

        HeaderCtrl.goTrakingSystem = function (role) {

            busLiveService.getParentData(HeaderCtrl.schoolId, role).then(function (response) {
                //console.log(classId);    
                if (response) {

                    if (response.data.length > 0) {

                        var userDetails = response.data[0]
                        HeaderCtrl.finalURL = trakingurl + '?=username=' + userDetails.username + '?password=123456'
                        window.open(HeaderCtrl.finalURL);
                    } else {

                        toastr.error("Whoo ! Sonting went wrong contact Admin");

                    }

                }
            }, function (error) {
                console.log('Error while fetching subject list . Error stack : ' + error);
            });

        };
    });
