console.log('Started', self);

self.addEventListener('install', function (event) {
	self.skipWaiting();
	/* By default an old service worker will stay running until all tabs that use it are closed or 
		unloaded. A new service worker will remain in the waiting state.
		When skipWaiting() is called (as in the code above) the service worker will skip the waiting 
		state and immediately activate. */

	console.log('Installed', event);
});

self.addEventListener('activate', function (event) {
	console.log('Activated', event);
});

self.addEventListener('push', function (event) {
	console.log('Push messase', event);
	console.log('here');
	if (event.data) {
		event.waitUntil(
		  self.registration.showNotification(title, {
		  	body: 'The Message',
		  	icon: 'favicon/android-chrome-96x96.png',
		  	tag: 'my-tag' // To show multiple notifications, use a different tag value for each showNotification() call, or no tag at all.
		  }));
	} else {
		console.log('here');
		event.waitUntil(
			self.registration.pushManager.getSubscription().then(function (subscription) {
				fetch('/api/notifications/', {
					method: 'post',
					headers: {
						'Authorization': 'Bearer ' + self.token,
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(subscription)
					,
					credentials: 'include'

				})
				.then(function (response) { return response.json(); })
				.then(function (data) {
					console.log('d:', data);
					self.registration.showNotification(data.title, {
						body: data.body,
						icon: 'favicon/android-chrome-96x96.png'
					});
				})
				.catch(function (err) {
					console.log('err');
					console.log(err);
				});
			})
		);
	}
	
});
/*
self.addEventListener("message", function (event) {
	// e.source is a client object
	event.ports[0].postMessage({ 'test': 'This is my response.' });
});
*//*
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


this.ontask = function (task) {
	alert(task.data.message);
	console.log("Task scheduled at: " + new Date(task.time));
	// From here on we can write the data to IndexedDB, send it to any open windows,
	// display a notification, etc.
}*/
