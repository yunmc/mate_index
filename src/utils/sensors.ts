import sensors from 'sa-sdk-javascript';

const { VITE_SENSORS } = import.meta.env;
// https://log.cece.com/sa?project=MateLink
sensors.init({
    sdk_url: 'lib/sensorsdata.min.js',
    heatmap_url: 'lib/heatmap.min.js',
    name: 'sensors',
    server_url: 'https://log.cece.com/sa?project=' + VITE_SENSORS,
    is_track_single_page: true,
    use_client_time: true,
    send_type: 'beacon',
    preset_properties: {
        url: true,
        title: true,
        latest_wx_ad_click_id: true,
    },
    app_js_bridge: true,
    is_track_device_id: true,
    heatmap: {
        clickmap: 'default',
        scroll_notice_map: 'default',
    },
    show_log: true,
});
sensors.quick('autoTrack', {
    platform: 'web',
});
sensors.registerPage({
    $url: window.location.href,
    $referrer: document.referrer,
    systemName: VITE_SENSORS,
});

let anonymousID;
sensors.quick('isReady', function () {
    anonymousID = sensors.quick('getAnonymousID');
    localStorage.setItem('anonymousID', anonymousID);
});

export function senSorsInit() {
    return sensors;
}
