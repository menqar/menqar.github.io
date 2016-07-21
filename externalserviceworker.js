console.log('Service worker started'/*, self*/);

self.addEventListener('install', function (event) {
	self.skipWaiting(); /* activate immediately. */
	console.log('Service worker installed'/*, event*/);
});

self.addEventListener('activate', function (event) {
	console.log('Service worker activated'/*, event*/);
});

self.addEventListener('push', function (event) {
	console.log('Push messasge'/*, event*/);
	if (event.data) {
		event.waitUntil(
			self.registration.showNotification(
				event.data.title,
				{
					body: event.data.body,
					/*icon: 'img/notification/' + event.data.icon + '.png',*/
					tag: 'my-tag'	/* To show multiple notifications, use a different tag 
									   value for each showNotification() call, or no tag at all. */
				}
			)
		);
	} else {
		event.waitUntil(
			self.registration.pushManager.getSubscription()
				.then(function (subscription) {
					fetch('http://localhost:49374/api/notifications/', {
						method: 'post',
						headers: {
							'Authorization': 'Bearer ' + self.token,
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(subscription),
						credentials: 'include'
					})
						.then(function (response) { return response.json(); })
							.then(function (data) {
								self.registration.showNotification(
									data.title,
									{
										body: data.body/*,
										icon: 'img/notification/' + data.icon + '.png',*/
									}
								);
							})
							.catch(function (err) {
								console.log(err);
							});
				})
		);
	}
});
/*
self.addEventListener('notificationclick', function (event) {
	console.log('Notification click: tag ', event.notification.tag);
	event.notification.close();
	var url = 'https://youtu.be/gYMkEMCHtJ4';
	event.waitUntil(
    clients.matchAll({
    	type: 'window'
    })
    .then(function (windowClients) {
    	for (var i = 0; i < windowClients.length; i++) {
    		var client = windowClients[i];
    		if (client.url === url && 'focus' in client) {
    			return client.focus();
    		}
    	}
    	if (clients.openWindow) {
    		return clients.openWindow(url);
    	}
    })
  );
});
*/
