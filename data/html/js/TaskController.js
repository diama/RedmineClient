/**t
 * Created by damir on 15.08.14.
 */

var taskScope;

addon.port.on('taskList', function (message) {
    taskScope.tasks = message;

    if(message.length == 0) {
        taskScope.listStatus.statusText = 'Нет данных для отображения';
        taskScope.currentTask = null;
    } else {
        taskScope.listStatus.status = 'hide';
    }

    taskScope.$apply();
});

var TasksController = function ($scope) {
    $scope.tasks = [];
    $scope.currentTask = null;
    $scope.listStatus = {
        status: 'progress',
        statusText: 'Инициализация'
    };

    taskScope = $scope;

    $scope.toggleCurrentTask = function (id) {
        if ($scope.currentTask && $scope.currentTask.id == $scope.tasks[id].id) {
            $scope.resetCurrentTask();
        } else {
            $scope.resetCurrentTask();
            $scope.currentTask = $scope.tasks[id];
            taskTimer.startTimer();
        }
    };

    $scope.resetCurrentTask = function() {
        taskTimer.resetTimer();
        $scope.currentTask = null;
    }

    $scope.showWaitMessage = function(){
        if ($scope.listStatus.status == 'hide')  {
            return false;
        }
        return true;
    }
}