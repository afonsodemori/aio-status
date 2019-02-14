function init(keys) {
    let append = '';
    for (let i = 0; i < keys.length; i++) {
        append += '<tr id="monitor-'+ keys[i].id +'">';
        append += '<td><span class="status"></span> '+ keys[i].name +'</td>';
        append += '<td class="text-center today"></td>';
        append += '<td class="text-center last-7-days"></td>';
        append += '<td class="text-center last-30-days"></td>';
        append += '</tr>';
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

function loadData() {
    for (let monitor = 0; monitor < apiKeys.length; monitor++) {

        $.ajax({
            type: 'post',
            url: 'https://api.uptimerobot.com/v2/getMonitors',
            data: {
                api_key: apiKeys[monitor].key,
                custom_uptime_ratios: '1-7-30',
                // custom_uptime_ranges: '1465440758_1466304758',
                logs: 0
            },
            async: true,
            success: function (data) {
                let id = '#monitor-'+ data.monitors[0].id;
                let ratio = data.monitors[0].custom_uptime_ratio.split('-');
                console.log(data);

                $(id +' .status')
                    .removeAttr('class')
                    .addClass('status')
                    .addClass('status-'+data.monitors[0].status)
                ;

                $(id+' .today').html(ratio[0]+'%');
                $(id+' .last-7-days').html(ratio[1]+'%');
                $(id+' .last-30-days').html(ratio[2]+'%');
            }
        });
    }
}

loadData();
setInterval(function () {
    loadData();
}, 10000);
