'ui';

const Ext = require('./ext')

ui.layout(
    <frame w='*' h='*'>
        <vertical layout_gravity='center' w='auto' h='auto'>
            <text margin='2 4 2 4' align='center' text='1.开启悬浮窗权限' />
            <text margin='2 4 2 4' align='center' text='2.请开启无障碍服务' />
            <text margin='2 4 2 4' align='center' text='3.tels.json文件放在根目录' />

            <Switch margin='2 4 2 4' align='center' id='service' text='无障碍服务:' checked='{{auto.service != null}}' />

            <button align='center' id='start'>执行脚本</button>
            <button align='center' id='stop'>停止脚本</button>
        </vertical>
    </frame>
)

ui.start.click(() => {
    if (auto.service == null) {
        toast('请开启无障碍服务')
    } else {
        threads.start(function () {
            while (true) {
                Ext.launch()
            }
        })
    }
})

ui.stop.click(() => {
    threads.shutDownAll()
    toast('已停止')
})

ui.service.on('check', function (checked) {
    if (checked && auto.service == null) {
        app.startActivity({
            action: 'android.settings.ACCESSIBILITY_SETTINGS'
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});

ui.emitter.on('resume', function () {
    ui.service.checked = auto.service != null;
});
