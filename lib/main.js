var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require("sdk/self");
var Request = require("sdk/request").Request;

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

var inter = require('sdk/timers');
inter.setInterval(function () {
    getTaskList();
}, 60000);

getTaskList = function(){
      //http://redmine.molodost.bz/projects/bm/issues.json?key=e4f4acdafe16aa9e111469a89eb408fbebcc362c&utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=%3D&v[status_id][]=15&v[status_id][]=1&v[status_id][]=2&v[status_id][]=4&f[]=assigned_to_id&op[assigned_to_id]=%3D&v[assigned_to_id][]=40&f[]=&c[]=project&c[]=tracker&c[]=status&c[]=priority&c[]=subject&group_by=

    var quijote = Request({
        url: "http://redmine.molodost.bz/projects/bm/issues.json?key=e4f4acdafe16aa9e111469a89eb408fbebcc362c&utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=%3D&v[status_id][]=15&v[status_id][]=1&v[status_id][]=2&v[status_id][]=4&f[]=assigned_to_id&op[assigned_to_id]=%3D&v[assigned_to_id][]=40&f[]=&c[]=project&c[]=tracker&c[]=status&c[]=priority&c[]=subject&group_by=",
        overrideMimeType: "text/json; charset=utf8",
        onComplete: function (response) {
            if (workerSidebar != undefined) {
                workerSidebar.port.emit('taskList', response.json.issues);
            }
        }
    });

    quijote.get();
};
