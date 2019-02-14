function init(keys) {
    var append = '';
    for (var i = 0; i < keys.length; i++) {
        append += '<tr id="monitor-'+ keys[i].id +'">';
        append += '<td><span class="status"></span> '+ keys[i].name +'</td>';
        append += '<td class="text-center today"></td>';
        append += '<td class="text-center last-7-days"></td>';
        append += '<td class="text-center last-30-days"></td>';
        append += '</tr>';
    }

    $('table').append(append);
}

var apiKeys = [
    { id: '779030329', name: 'afonsodemori.com', key: 'm779030329-2ec9bed1fe2bae84e2906ea1' },
    { id: '780092965', name: 'budget.afonso.io', key: 'm780092965-8ab17aeab21c73f2877d6e78' },
    { id: '781259968', name: 'ci.afonso.io', key: 'm781259968-c3eb7868aa88642c44159d94' },
    { id: '781947437', name: 'jrbaena.com', key: 'm781947437-3a14e9c08554ede9e9d22e82' },
    { id: '781947228', name: 'meteosaucana.es', key: 'm781947228-ed575ab18678e1d5b6134c5f' },
    { id: '778829519', name: 'play.afonso.io', key: 'm778829519-d6e1511d75d958189ac61db5' },
    { id: '781855791', name: 'sample-api.afonso.io', key: 'm781855791-2e488e5869bfff6409583a71' },
    { id: '781802272', name: 'shortener.afonso.io', key: 'm781802272-cf947c9a62aa949311986ab3' },
    { id: '780092128', name: 'sophia.afonso.io', key: 'm780092128-ce1ae07f1bd8d6c5d0b28602' },
    { id: '781964243', name: 'srv-emu.afonso.io', key: 'm781964243-6987ac857fb0cde2cde7e080' },
    { id: '781964246', name: 'srv-ferret.afonso.io', key: 'm781964246-3eada18b3f81103ad5c788b0' },
    { id: '781964216', name: 'srv-gopher.afonso.io', key: 'm781964216-da40ca745868df6d82022cbd' },
];

init(apiKeys);

function loadData() {
    for (var monitor = 0; monitor < apiKeys.length; monitor++) {

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
                var id = '#monitor-'+ data.monitors[0].id;
                var ratio = data.monitors[0].custom_uptime_ratio.split('-');
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
