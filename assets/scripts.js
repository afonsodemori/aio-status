var apiKeys = [
    'm779030329-2ec9bed1fe2bae84e2906ea1', // afonsodemori.com
    'm780092965-8ab17aeab21c73f2877d6e78', // budget.afonso.io
    'm781259968-c3eb7868aa88642c44159d94', // ci.afonso.io
    'm781947437-3a14e9c08554ede9e9d22e82', // jrbaena.com
    'm781947228-ed575ab18678e1d5b6134c5f', // meteosaucana.es
    'm778829519-d6e1511d75d958189ac61db5', // play.afonso.io
    'm781855791-2e488e5869bfff6409583a71', // sample-api.afonso.io
    'm781802272-cf947c9a62aa949311986ab3', // shortener.afonso.io
    'm780092128-ce1ae07f1bd8d6c5d0b28602', // sophia.afonso.io
    'm781964243-6987ac857fb0cde2cde7e080', // srv-emu.afonso.io
    'm781964246-3eada18b3f81103ad5c788b0', // srv-ferret.afonso.io
    'm781964216-da40ca745868df6d82022cbd', // srv-gopher.afonso.io
];

for (var monitor = 0; monitor < apiKeys.length; monitor++) {

    $.ajax({
        type: 'post',
        url: 'https://api.uptimerobot.com/v2/getMonitors',
        data: {
            api_key: apiKeys[monitor],
            custom_uptime_ratios: '1-7-30',
            // custom_uptime_ranges: '1465440758_1466304758',
            logs: 1
        },
        async: false,
        success: function (data) {
            var ratio = data.monitors[0].custom_uptime_ratio.split('-');
            console.log(data);

            var tr = '<tr>';
            tr += '<td><span class="status status-' + data.monitors[0].status + '"></span> ' + data.monitors[0].friendly_name + '</td>';
            tr += '<td>' + ratio[0] + '%</td>';
            tr += '<td>' + ratio[1] + '%</td>';
            tr += '<td>' + ratio[2] + '%</td>';
            tr += '</tr>';

            $('table').append(tr);
        }
    });
}
