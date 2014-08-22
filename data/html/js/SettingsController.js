var settingsScope;

addon.port.on('setRedmineConfig', function(redmineConfig){
    settingsScope.config = redmineConfig;
    if (redmineConfig.redmineHost == '') {
        settingsScope.showConfigForm = true;
    }
    settingsScope.$apply();
});

var SettingsController = function ($scope) {

    settingsScope = $scope;

    $scope.showConfigForm = false;
    $scope.config = {
        redmineHost: '',
        redmineKey: '',
        currentUserId: ''
    };

    $scope.saveConfig = function(){
        $scope.toggleConfigForm();
        addon.port.emit('saveConfig', $scope.config);
    };

    $scope.toggleConfigForm = function(){
        $scope.showConfigForm = !$scope.showConfigForm;
    };
};