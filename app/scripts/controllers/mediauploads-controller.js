'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:MediauploadsControllerCtrl
 * @description
 * # MediauploadsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('MediauploadsController', function (configService, $cookies, mediauploadsService, toastr, APP_MESSAGES, $http, $scope, $sce, Media, School) {
    var MediaUploadCtrl = this;
    MediaUploadCtrl.schoolId = $cookies.getObject('uds').schoolId;
    MediaUploadCtrl.formFields = {};
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Media Upload") {
        MediaUploadCtrl.roleView = roleAccess[0].RolesData[i].view;
        MediaUploadCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        MediaUploadCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

    }
    function Init() {
      this.getLogoDetails = function () {
        mediauploadsService.getMediaBySchoolId(MediaUploadCtrl.schoolId).then(function (result) {
          if (result) {
            MediaUploadCtrl.logoList = result[0].logo;
            MediaUploadCtrl.imageList = result[0].images;
            $scope.trustSrc = function (src) {
              return $sce.trustAsResourceUrl(src);
            };
            $scope.iframe = {
              src: result[0].video
            };
          }
        }, function (error) {
          //console.log('Error while fetching the records. Error stack : ' + error);
        });
      };
      this.getMediaImages = function () {
        mediauploadsService.getMediaImagesByschoolId(MediaUploadCtrl.schoolId).then(function (result) {
          if (result) {


            $scope.images = [];
            // MediaUploadCtrl.mediaList = result;
            _.each(result, function (img) {
              $scope.images.push(
                {
                  id: img.id,
                  // title: 'This is <b>amazing photo</b> of <i>nature</i>' + img.id,
                  alt: 'amazing nature photo',
                  thumbUrl: img.galleryFile,
                  url: img.galleryFile
                }
              )

            })
            // $scope.images = result
            // console.log(MediaUploadCtrl.mediaList);
          }
        }, function (error) {
          //console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
      };
    }
    (new Init()).getLogoDetails();
    (new Init()).getMediaImages();

    // IMAGE GALLREY
    // $scope.opened = function () {
    //   alert('Gallery opened'); // or do something else
    // }
    $scope.conf = {
      thumbnails: true,
      thumbSize: 213,
      inline: false,
      bubbles: true,
      bubbleSize: 50,
      imgBubbles: true,
      bgClose: true,
      piracy: true,
      imgAnim: 'revolve',
    };


    // IMAGE GALLREY END



    MediaUploadCtrl.clearformfields = function () {
      MediaUploadCtrl.formFields = {};
    };
    MediaUploadCtrl.uploadImage = function (x) {
      MediaUploadCtrl.file = document.getElementById('Images').files[0];
      if (MediaUploadCtrl.file == undefined) {
        toastr.error("Please select Image");
        window.location.reload();
        return;
      }
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', MediaUploadCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/Images/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            MediaUploadCtrl.galleryFile = configService.baseUrl() + '/ImageContainers/Images/download/' + response.data.result[0].filename;
            Media.create({
              schoolId: MediaUploadCtrl.schoolId,
              galleryFile: MediaUploadCtrl.galleryFile
            });
            (new Init()).getMediaImages();
          }
        }, function (error) {
          //console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };

    MediaUploadCtrl.markTempAction = function (x) {
      MediaUploadCtrl.tempFile = document.getElementById('tempFile').files[0];
      if (MediaUploadCtrl.tempFile == undefined) {
        toastr.error("Please select Marks Template ");
        return;
      }
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', MediaUploadCtrl.tempFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/MarksTemplates/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            MediaUploadCtrl.tempFile = configService.baseUrl() + '/ImageContainers/MarksTemplates/download/' + response.data.result[0].filename;
            School.prototype$patchAttributes({
              id: MediaUploadCtrl.schoolId,
              tempFile: MediaUploadCtrl.tempFile
            });
          }
        }, function (error) {
          //console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    MediaUploadCtrl.videoAction = function (invalid) {
      if (invalid) {
        return;
      }
      var data = {
        video: MediaUploadCtrl.formFields.video,
      };
      if (data) {
        data.id = MediaUploadCtrl.schoolId;
        mediauploadsService.UpdateVideo(data).then(function (result) {
          if (result) {
            MediaUploadCtrl.clearformfields();
            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
            window.location.reload();
          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          //console.log('Error while creating or updating records. Error stack' + error);
        });

      }
    };
    MediaUploadCtrl.logoAction = function () {
      MediaUploadCtrl.file = document.getElementById('logoFile').files[0];
      if (MediaUploadCtrl.file == undefined) {
        toastr.error("Please select Logo");
        return;
      }

      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', MediaUploadCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/Schoollogo/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            MediaUploadCtrl.file = configService.baseUrl() + '/ImageContainers/Schoollogo/download/' + response.data.result[0].filename;
            //MediaUploadCtrl.getMediaImages();
            var data = {
              logo: MediaUploadCtrl.file
            };
            if (data) {
              data.id = MediaUploadCtrl.schoolId;
              mediauploadsService.Updatelogo(data).then(function (result) {
                if (result) {
                  $cookies.putObject('__s', result);
                  MediaUploadCtrl.clearformfields();
                  toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                  location.reload();
                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                //console.log('Error while creating or updating records. Error stack' + error);
              });
            }
          }
        }, function (error) {
          //console.log('Error while fetching the records. Error stack : ' + error);
        });
    };
  });