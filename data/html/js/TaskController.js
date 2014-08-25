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

addon.port.on('timePushed', function () {
    if (taskScope.currentTask) {
        taskScope.currentTask.showIcon = false;
        taskScope.$apply();
    }
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
            var currentTask = {
                id: $scope.tasks[id].id,
                subject: $scope.tasks[id].subject,
                startAt: new Date().getTime(),
                showIcon: false
            };

            $scope.currentTask = currentTask;
            taskTimer.startTimer();
        }
    };

    $scope.resetCurrentTask = function() {
        $scope.pushTime();
        taskTimer.resetTimer();
        $scope.currentTask = null;
    }

    $scope.pushTime = function(){
        if ($scope.currentTask && $scope.currentTask.id) {
            $scope.currentTask.showIcon = true;
            addon.port.emit('pushTime', $scope.currentTask);
            $scope.currentTask.startAt = new Date().getTime();
        }
    };

    $scope.showWaitMessage = function(){
        if ($scope.listStatus.status == 'hide')  {
            return false;
        }
        return true;
    }

    setInterval(function(){
        $scope.pushTime();
    }, 1800000);
}