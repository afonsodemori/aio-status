function init(keys) {
    let append = '';
    for (let i = 0; i < keys.length; i++) {
        append += '<tr id="monitor-' + keys[i].id + '">' +
            '<td class="align-middle"><span class="status"></span> ' + keys[i].name + '</td>' +
            '<td class="align-middle text-center latest">' +
            '<span class="time"></span>' +
            '<span class="reason"></span>' +
            '<span class="duration"></span></td>' +
            '<td class="align-middle text-center today"></td>' +
            '<td class="align-middle text-center last-7-days"></td>' +
            '<td class="align-middle text-center last-30-days"></td>' +
            '</tr>'
        ;
    }

    $('table').append(append);
}

let apiKeys = null;
$.ajax({
    async: false,
    url: '/config/api-keys.json',
    dataType: 'json',
    success: function (data) {
        apiKeys = data;
        init(apiKeys);
    }
});

function formatDatetime(timestamp) {
    let date = new Date(timestamp * 1000);
    let options = {year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'};
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function formatDuration(duration) {
    if (duration < 60) {
        return duration + ' sec';
    }

    if (duration < 60 * 60) {
        return Math.floor(duration / 60) + ' min, ' + duration % 60 + ' sec';
    }

    return Math.floor(duration / 60 / 60) + ' hour, ' +
        Math.floor((duration / 60) % 60) + ' min, ' +
        duration % 60 + ' sec';
}

function loadData() {
    for (let m = 0; m < apiKeys.length; m++) {

        $.ajax({
            type: 'post',
            url: 'https://api.uptimerobot.com/v2/getMonitors',
            data: {
                api_key: apiKeys[m].key,
                custom_uptime_ratios: '1-7-30',
                // custom_uptime_ranges: '1465440758_1466304758',
                logs: 1,
                log_types: 1
            },
            async: true,
            success: function (data) {
                let monitor = data.monitors[0];
                let id = '#monitor-' + monitor.id;
                let ratio = monitor.custom_uptime_ratio.split('-');

                $(id + ' .status')
                    .removeAttr('class')
                    .addClass('status')
                    .addClass('status-' + monitor.status)
                ;

                console.log(monitor.logs);

                for (let l = 0; l < monitor.logs.length; l++) {
                    let log = monitor.logs[l];

                    if (log.reason.code !== 200) {
                        $(id + ' .latest .time').html(formatDatetime(log.datetime));
                        $(id + ' .latest .reason').html(log.reason.code + ' - ' + log.reason.detail);
                        $(id + ' .latest .duration').html(formatDuration(log.duration));
                        break;
                    }
                }

                $(id + ' .today').html(ratio[0] + '%');
                $(id + ' .last-7-days').html(ratio[1] + '%');
                $(id + ' .last-30-days').html(ratio[2] + '%');
            }
        });
    }
}

loadData();
setInterval(function () {
    loadData();
}, 10000);
