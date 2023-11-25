 $scope.uploadNotes = function(files, isPublic) {
            if (files.length > 0) {
                classResourceFac.uploadNotes(files).then(function(response) {

                    if (response) {
                        var fileName = files[0].name;
                        if (response.newFileName)
                            fileName = response.newFileName;
                        $scope.uploadType = 'notes';
                        $scope.resUploadSuccess = false;
                        classResourceFac.addOrUpdate(files[0],
                            $scope.uploadType, fileName, isPublic).then(function(res) {
                            var newfiles = [res];
                            loadClassNotes(newfiles);
                        });
                    }
                });
            }
        };

            service.uploadNotes = function(files) {
                var dfd = $q.defer();
                if (files && files[0] && hasFeature(featureFac.getFeatures().WriteClass)) {
                    if (files[0].size <= appConfig.uploadNoteFileSize) {
                        var apiAddress = appConfig.stServerAddress + '/api/class/uploadnote';
                        var classId = $stateParams.classId;

                        var fields = { classId: classId };
                        uploadFac.uploadFile(files, apiAddress, fields).then(function(response) {
                            toastFac.info('File ' + files[0].name + 'was uploaded');
                            dfd.resolve(response);
                        });
                    }
                }

                return dfd.promise;
            };
            service.uploadFile = function(files, apiAddress, Lfields) {

                //Used in callback notification (asynchronous)
                var dfd = $q.defer();

                if (files && files.length) {

                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        $upload.upload({
                            url: apiAddress,
                            file: file,
                            fields: Lfields,
                            timeout: 3600000
                        }).progress(function(evt) {
                            //TODO: Introduce image upload progress bar in the UI
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            var res = { state: 'progress', msg: progressPercentage };
                            $rootScope.$broadcast('fileUploadEvent', progressPercentage);
                        }).success(function(data, status, headers, config) {
                            dfd.resolve(data);
                        }).error(function(data, status, headers, config) {
                            toastFac.failure('Communication error during image upload.');
                        });
                    }
                }

                return dfd.promise;
            };