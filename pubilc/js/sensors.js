var domain_sensors = window.location.host;
var api = 'MateLink_test';
if (domain_sensors == 'www.matelink.com') {
    api = 'MateLink';
}
(function (para) {
    var p = para.sdk_url,
        n = para.name,
        w = window,
        d = document,
        s = 'script',
        x = null,
        y = null;
    if (typeof w['sensorsDataAnalytic201505'] !== 'undefined') {
        return false;
    }
    w['sensorsDataAnalytic201505'] = n;
    w[n] =
        w[n] ||
        function (a) {
            return function () {
                (w[n]._q = w[n]._q || []).push([a, arguments]);
            };
        };
    var ifs = [
        'track',
        'quick',
        'register',
        'registerPage',
        'registerOnce',
        'trackSignup',
        'trackAbtest',
        'setProfile',
        'setOnceProfile',
        'appendProfile',
        'incrementProfile',
        'deleteProfile',
        'unsetProfile',
        'identify',
        'login',
        'logout',
        'trackLink',
        'clearAllRegister',
        'getAppStatus',
    ];
    for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        (x = d.createElement(s)), (y = d.getElementsByTagName(s)[0]);
        x.async = 1;
        x.src = p;
        x.setAttribute('charset', 'UTF-8');
        w[n].para = para;
        y.parentNode.insertBefore(x, y);
    }
})({
    sdk_url: 'https://m.cece.com/lib/js/sensorsdata.min.js',
    heatmap_url: 'https://m.cece.com/lib/js/heatmap.min.js',
    name: 'sensors',
    server_url: 'https://log.cece.com/sa?project=' + api,
    preset_properties: {
        url: true,
        title: true,
    },
    app_js_bridge: true,
    is_track_device_id: true,
    show_log: api === 'production' ? false : true,
    heatmap: {
        clickmap: 'default',
        scroll_notice_map: 'not_collect',
    },
});
sensors.registerPage({
    product_name: 'MateLink',
});
sensors.quick('autoTrack');