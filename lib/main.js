var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require("sdk/self");
var Request = require("sdk/request").Request;
var timers = require('sdk/timers');
var ss = require("sdk/simple-storage");

if (!ss.storage.redmineConfig) {
    ss.storage.redmineConfig = {
        redmineHost: '',
        redmineKey: '',
        currentUserId: ''
    };
}

var button = ToggleButton({
    id: "my-button",
    label: "my button",
    icon: {
        "16": "./redmine.png",
        "32": "./redmine.png",
        "64": "./redmine.png"
    },
    onChange: handleChange
});

var workerSidebar;

var sidebar = require("sdk/ui/sidebar").Sidebar({
    id: 'my-sidebar',
    title: 'KRMClient',
    url: require("sdk/self").data.url("html/sidebar.html"),
    onAttach: function (worker) {
        workerSidebar = worker;
        timers.setTimeout(function () {
            workerSidebar.port.emit('setRedmineConfig', ss.storage.redmineConfig);
        }, 2000);
        worker.port.on('saveConfig', function (redmineConfig) {
            ss.storage.redmineConfig = redmineConfig;
            getRedmineCurrentUser();
        });
        getTaskList();
    },
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        sidebar.show();
    }
    else {
        sidebar.hide();
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

timers.setInterval(function () {
    getTaskList();
}, 60000);

getTaskList = function () {
    try {
        if (ss.storage.redmineConfig && ss.storage.redmineConfig.redmineHost != '' && ss.storage.redmineConfig.redmineKey != '' && ss.storage.redmineConfig.currentUserId != '') {
            var quijote = Request({
                url: "http://" + ss.storage.redmineConfig.redmineHost + "/projects/bm/issues.json?key=" + ss.storage.redmineConfig.redmineKey + "&utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=%3D&v[status_id][]=15&v[status_id][]=1&v[status_id][]=2&v[status_id][]=4&f[]=assigned_to_id&op[assigned_to_id]=%3D&v[assigned_to_id][]=" + ss.storage.redmineConfig.currentUserId + "&f[]=&c[]=project&c[]=tracker&c[]=status&c[]=priority&c[]=subject&group_by=",
                overrideMimeType: "text/json; charset=utf8",
                onComplete: function (response) {
                    if (workerSidebar != undefined) {
                        if (response.json) {
                            workerSidebar.port.emit('taskList', response.json.issues);
                        }
                        workerSidebar.port.emit('setRedmineConfig', ss.storage.redmineConfig);
                    }
                }
            });
            quijote.get();
        }
    } catch (err) {
        if (workerSidebar != undefined) {
            workerSidebar.port.emit('taskList', []);
            workerSidebar.port.emit('setRedmineConfig', ss.storage.redmineConfig);
        }
    }

};

getRedmineCurrentUser = function(){
    try {
        if (ss.storage.redmineConfig && ss.storage.redmineConfig.redmineHost != '' && ss.storage.redmineConfig.redmineKey != '') {
            var quijote = Request({
                url: "http://" + ss.storage.redmineConfig.redmineHost + "/users/current.json?key=" + ss.storage.redmineConfig.redmineKey,
                overrideMimeType: "text/json; charset=utf8",
                onComplete: function (response) {
                    ss.storage.redmineConfig.currentUserId = response.json.user.id;
                    getTaskList();
                }
            });
            quijote.get();
        }
    } catch (err) {

    }
}

showMessage = function (message) {
    console.log('---------------------------------------------------------------------------------');
    console.log(message);
    console.log('---------------------------------------------------------------------------------');
}
