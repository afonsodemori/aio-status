self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('cache').then(function (cache) {
            return cache.addAll(
                [
                    '/',
                    '/about.html',

                    '/config/api-keys.json',

                    '/assets/css/general.css',
                    '/assets/css/dashboard.css',
                    '/assets/js/dashboard.js',

                    '/assets/app.manifest',

                    '/assets/img/favicons/android-chrome-192x192.png',
                    '/assets/img/favicons/android-chrome-512x512.png',

                    '/assets/img/favicons/favicon-down.ico',
                    '/assets/img/favicons/favicon-not-checked-yet.ico',
                    '/assets/img/favicons/favicon-seems-offline.ico',
                    '/assets/img/favicons/favicon-up.ico',

                    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
                    'https://fonts.googleapis.com/css?family=Open+Sans:300',
                    'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
                    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
                ]
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open('cache').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
