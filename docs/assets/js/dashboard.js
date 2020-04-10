const PAGE_REFRESH = 15;
const AJAX_TIMEOUT = 5;

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js').then(function(){
        console.debug('SW: Register');
    }).catch(console.log);
}

function init() {
    let newKeys = [];
    if (apiKeys.length === 1 && apiKeys[0].name === 'MASTER-KEY') {
        $.ajax({
            type: 'post',
            url: 'https://api.uptimerobot.com/v2/getMonitors',
            timeout: AJAX_TIMEOUT * 1000,
            async: false,
            data: {
                api_key: apiKeys[0].key
            },
            success: function (data) {
                for (let i = 0; i < data.monitors.length; i++) {
                    let monitor = data.monitors[i];

                    if (monitor.friendly_name.substr(0, 4) === 'off-') continue;

                    newKeys.push({
                        'id' : monitor.id,
                        'name' : monitor.friendly_name,
                        'key' : apiKeys[0].key
                    });
                }
            },
            error: function (data) {
                setTimeout(function () {
                    window.location.reload();
                }, PAGE_REFRESH * 1000);

            },
        });
    }

    if (newKeys.length) {
        apiKeys = newKeys;
    }

    let append = '';
    for (let i = 0; i < apiKeys.length; i++) {
        // Skip rendering monitors with no id (like the master-key)
        if (apiKeys[i].id === null) {
            continue;
        }

        append += '<tr id="monitor-' + apiKeys[i].id + '">' +
            '<th class="align-middle text-nowrap"><span class="status"></span> ' + apiKeys[i].name + '</th>' +
            '<td class="align-middle latest">' +
            '<span class="reason">loading...</span>' +
            '<span class="time">loading...</span>' +
            '<span class="duration">loading...</span></td>'
        ;

        for (let r = 0; r < 9; r++) {
            append += '<td class="r-' + r + '"><span class="r' + r + ' ratio-color-loading">loading...</span></td>';
        }

        append += '</tr>';
    }

    $('table').append(append);

    loadData();
    checkStatus();
}

let apiKeys = null;
$.ajax({
    url: '/config/api-keys.json',
    dataType: 'json',
    success: function (data) {
        apiKeys = data;
        init();
    }
});

function formatDatetime(timestamp) {
    let date = new Date(timestamp * 1000);
    let options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
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
    let now = new Date();

    let last7d = (Math.floor(now.getTime() / 1000) - 60 * 60 * 24 * 7) + '_' + Math.floor(now.getTime() / 1000);
    let last30d = (Math.floor(now.getTime() / 1000) - 60 * 60 * 24 * 30) + '_' + Math.floor(now.getTime() / 1000);

    let ranges = last7d + '-' + last30d;

    let day = now;
    day.setDate(day.getDate() + 1);
    day.setHours(0, 0, 0, 0);

    let range = [];
    for (let i = 0; i < 7; i++) {
        range[0] = Math.floor(day.getTime() / 1000);
        range[1] = Math.floor(day.setDate(day.getDate() - 1) / 1000);
        $('.d-' + i).html(day.getDate() + '/' + (day.getMonth() + 1));
        ranges += '-' + range[1] + '_' + range[0];
    }

    let monitors = [];
    for (let i = 0; i < apiKeys.length; i++) {
        monitors.push(apiKeys[i].id);
    }

    let ajaxSettings = {
        type: 'get',
        url: 'https://apis.afonso.io/status/monitors',
        timeout: AJAX_TIMEOUT * 1000,
        async: true,
        data: {
            id: monitors.join('-'),
            custom_uptime_ranges: ranges,
            logs: 1,
            logs_limit: 1
        }
    };

    $.ajax(Object.assign(ajaxSettings, {
        success: function (data) {
            for (let i = 0; i < data.monitors.length; i++) {
                processMonitorData(data.monitors[i]);
            }
        },
        error: function (data) {
            delete ajaxSettings.data.id;
            loadFromUptimeRobot(ajaxSettings);
        }
    }));
}

function loadFromUptimeRobot(ajaxSettings) {
    ajaxSettings.type = 'post';
    ajaxSettings.url = 'https://api.uptimerobot.com/v2/getMonitors';

    for (let i = 0; i < apiKeys.length; i++) {
        ajaxSettings.data.api_key = apiKeys[i].key;
        $.ajax(Object.assign(ajaxSettings, {
            success: function (data) {
                for (let i = 0; i < data.monitors.length; i++) {
                    processMonitorData(data.monitors[i]);
                }
            },
            error: function (data) {
                $('.status')
                    .removeAttr('class')
                    .addClass('status')
                    .addClass('status-not-checked-yet')
                ;

                let toast = `<div class="toast">Error fetching uptime data. Check your internet connection. Retrying in <span class="countdown">${PAGE_REFRESH}</span> seconds.<div>`;
                if ($('.toast').length === 0) {
                    $('body').append(toast);
                    $('.toast')
                        .fadeIn()
                        .delay(8000)
                        .fadeOut(200, function () {
                            this.remove();
                        })
                    ;
                }
            }
        }));
    }
}

function processMonitorData(monitor) {
    let id = '#monitor-' + monitor.id;
    let ratio = monitor.custom_uptime_ranges.split('-');

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

    let log = monitor.logs[0];
    $(id + ' .latest .time').html(formatDatetime(log.datetime));
    $(id + ' .latest .reason').html(log.reason.code + ' - ' + log.reason.detail);
    $(id + ' .latest .duration').html(formatDuration(log.duration));

    let color = 'inherit';
    switch (monitor.status) {
        case 0:
            color = 'var(--monitor-paused)';
            break;
        case 1:
            color = 'var(--monitor-not-checked-yet)';
            break;
        case 2:
            color = 'var(--monitor-up)';
            break;
        case 8:
            color = 'var(--monitor-seems-offline)';
            break;
        case 9:
            color = 'var(--monitor-down)';
            break;
    }

    $(id + ' .latest .reason').css('color', color);

    for (let i = 0; i < ratio.length; i++) {
        let content = (ratio[i] === '100.000' ? 100 : ratio[i]) + '%';
        let $el = $(id + ' .r' + i);
        if (content !== $el.html()) {
            setTimeout(function() {
                $el
                    .removeAttr('class')
                    .addClass('r' + i)
                    .addClass('ratio-color-' + ratio[i].split('.')[0])
                    .html(content)
                    .hide()
                    .slideDown()
                ;
            }, Math.round(Math.random() * 400));
        }
    }

    $('.last-update').html(formatDatetime((new Date()).getTime() / 1000));
}

function checkStatus() {
    let up = $('.status-2').length;
    let down = $('.status-9').length;
    let paused = $('.status-0').length;
    let unknown = $('.status').length - up - down - paused;

    $('.monitors-up').html(up);
    $('.monitors-down').html(down);
    $('.monitors-paused').html(paused);
    $('.monitors-unknown').html(unknown);

    if (down > 0) {
        $('header').css('background', 'var(--monitor-down)');
        $('.navbar').css('background-color', 'var(--monitor-down)');
        $('#summary').css('border-top-color', 'var(--monitor-down)');
        $('link[rel="icon"]').attr('href', '/assets/img/favicons/favicon-down.ico');
        $('meta[name="theme-color"]').attr('content', '#D32F2F');
    } else if (up > 0) {
        $('header').css('background', 'var(--monitor-up)');
        $('.navbar').css('background-color', 'var(--monitor-up)');
        $('#summary').css('border-top-color', 'var(--monitor-up)');
        $('link[rel="icon"]').attr('href', '/assets/img/favicons/favicon-up.ico');
        $('meta[name="theme-color"]').attr('content', '#7CB342');
    } else {
        $('header').css('background', 'var(--monitor-not-checked-yet)');
        $('.navbar').css('background-color', 'var(--monitor-not-checked-yet)');
        $('#summary').css('border-top-color', 'var(--monitor-not-checked-yet)');
        $('link[rel="icon"]').attr('href', '/assets/img/favicons/favicon-not-checked-yet.ico');
        $('meta[name="theme-color"]').attr('content', '#BDBDBD');
    }
}

$(document).on('scroll', function () {
    let $div = $('#summary');
    let pos = $('header').height();
    if (pos < window.scrollY) {
        $div.addClass('fixed');
        $('body').css('padding-top', $div.height());
    } else {
        $('body').css('padding-top', 0);
        $div.removeClass('fixed');
    }
});

let timeout = PAGE_REFRESH;
setInterval(function () {
    checkStatus();
    if (--timeout === 0) {
        loadData();
        $('.countdown').html(timeout);
        timeout = PAGE_REFRESH;
    } else {
        $('.countdown').html(timeout);
    }
}, 1000);
