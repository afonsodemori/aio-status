const refresh = 15;

function init(keys) {
    let append = '';
    for (let i = 0; i < keys.length; i++) {
        append += '<tr id="monitor-' + keys[i].id + '">' +
            '<td class="align-middle text-nowrap"><span class="status"></span> ' + keys[i].name + '</td>' +
            '<td class="align-middle text-center latest">' +
            '<span class="time"></span>' +
            '<span class="reason"></span>' +
            '<span class="duration"></span></td>' +
            '<td class="align-middle text-center"><span class="r0"></span></td>' +
            '<td class="align-middle text-center"><span class="r1"></span></td>' +
            '<td class="align-middle text-center"><span class="r2"></span></td>' +
            '<td class="align-middle text-center"><span class="r3"></span></td>' +
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
                custom_uptime_ratios: '1-7-15-30',
                // custom_uptime_ranges: '1465440758_1466304758',
                logs: 1,
                log_types: 1,
                logs_limit: 1
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

                if (monitor.logs.length === 0) {
                    $(id + ' .latest .time').html('');
                    $(id + ' .latest .reason').html('');
                    $(id + ' .latest .duration').html('');
                }

                for (let i = 0; i < monitor.logs.length; i++) {
                    let log = monitor.logs[i];

                    if (log.reason.code !== 200) {
                        $(id + ' .latest .time').html(formatDatetime(log.datetime));
                        $(id + ' .latest .reason').html(log.reason.code + ' - ' + log.reason.detail);
                        $(id + ' .latest .duration').html(formatDuration(log.duration));
                        break;
                    }
                }

                for (let i = 0; i < ratio.length; i++) {
                    let content = (ratio[i] === '100.000' ? 100 : ratio[i]) + '%';
                    let $el = $(id + ' .r' + i);
                    if (content !== $el.html()) {
                        $el
                            .removeAttr('class')
                            .addClass('r' + i)
                            .addClass('ratio-' + ratio[i].split('.')[0])
                            .html(content)
                            .hide()
                            .slideDown()
                        ;
                    }
                }
            }
        });
    }
}

loadData();
let timeout = refresh;
setInterval(function () {
    if (--timeout === 0) {
        loadData();
        timeout = refresh;
        $('#countdown').html(timeout);
    } else {
        $('#countdown').html(timeout);
    }
}, 1000);
