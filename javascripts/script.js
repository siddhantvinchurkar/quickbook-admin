

var signedIn = false;
var user = 'user';
var db = ' ';
var currentUserDocId = ' ';
var venue_name = ' ';
var venue_code = ' ';
var venue_rate = ' ';
var venue_description = ' ';
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var os = [
	{ name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
	{ name: 'Windows', value: 'Win', version: 'NT' },
	{ name: 'iPhone', value: 'iPhone', version: 'OS' },
	{ name: 'iPad', value: 'iPad', version: 'OS' },
	{ name: 'Kindle', value: 'Silk', version: 'Silk' },
	{ name: 'Android', value: 'Android', version: 'Android' },
	{ name: 'PlayBook', value: 'PlayBook', version: 'OS' },
	{ name: 'BlackBerry', value: 'BlackBerry', version: '/' },
	{ name: 'Macintosh', value: 'Mac', version: 'OS X' },
	{ name: 'Linux', value: 'Linux', version: 'rv' },
	{ name: 'Palm', value: 'Palm', version: 'PalmOS' }
];
var browser = [
	{ name: 'Chrome', value: 'Chrome', version: 'Chrome' },
	{ name: 'Firefox', value: 'Firefox', version: 'Firefox' },
	{ name: 'Safari', value: 'Safari', version: 'Version' },
	{ name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
	{ name: 'Opera', value: 'Opera', version: 'Opera' },
	{ name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
	{ name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
];
var header = [
	navigator.platform,
	navigator.userAgent,
	navigator.appVersion,
	navigator.vendor,
	window.opera
];

/* Identity RegEx Function */
function matchItem(string, data) {
	var i = 0,
		j = 0,
		html = '',
		regex,
		regexv,
		match,
		matches,
		version;
	for (i = 0; i < data.length; i += 1) {
		regex = new RegExp(data[i].value, 'i');
		match = regex.test(string);
		if (match) {
			regexv = new RegExp(data[i].version + '[- /:;]([\d._]+)', 'i');
			matches = string.match(regexv);
			version = '';
			if (matches) {
				if (matches[1]) {
					matches = matches[1];
				}
			}
			if (matches) {
				matches = matches.split(/[._]+/);
				for (j = 0; j < matches.length; j += 1) {
					if (j === 0) {
						version += matches[j] + '.';
					}
					else {
						version += matches[j];
					}
				}
			}
			else {
				version = '0';
			}
			return {
				name: data[i].name,
				version: parseFloat(version)
			};
		}
	}
	return { name: 'unknown', version: 0 };
}

/* Retrieve device identity */
function getDeviceIdentity() {
	agent = header.join(' ');
	os = this.matchItem(agent, os);
	browser = this.matchItem(agent, browser);
}

lottie.loadAnimation({
	container: seo,
	renderer: 'svg',
	loop: true,
	autoplay: true,
	path: "https://assets1.lottiefiles.com/packages/lf20_IwfCpp.json"
});

/* Sign In Function */
function signIn() {

	var provider = new firebase.auth.GoogleAuthProvider();
	if (!signedIn) {
		getDeviceIdentity();
		firebase.auth().signInWithPopup(provider).then(function (result) {
			user = result.user;
			var tempCounter = 0;
			db.collection('quickbook-users').where('email', '==', user.email).get().then(function (querySnapshot) {
				querySnapshot.forEach((doc) => {
					currentUserDocId = doc.id;
					tempCounter++;
				});
				if (tempCounter < 1) {
					returningUser = false;
					db.collection('quickbook-users').add({
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL
					}).then(function (doc) {
						currentUserDocId = doc.id;
					});
					db.collection('quickbook-users').doc(currentUserDocId).collection('activity_logs').add({
						timestamp: new Date(),
						os_name: os.name,
						os_version: os.version,
						browser_name: browser.name,
						browser_version: browser.version
					});
				}
				else {
					returningUser = true;
					db.collection('quickbook-users').doc(currentUserDocId).collection('activity_logs').add({
						timestamp: new Date(),
						os_name: os.name,
						os_version: os.version,
						browser_name: browser.name,
						browser_version: browser.version
					});
				}
			});
			signedIn = true;
			setTimeout(function () {

				document.getElementById('auth_screen').style.display = 'none';
				document.getElementById('main_screen').style.display = 'block';
				//document.getElementById('username_profile').innerHTML = user.displayName + '<br />' + user.email;
				//document.getElementById('username_profile').href = user.photoURL;

			}, 1000);
		}).catch(function (error) {
			signedIn = false;
			console.log(error);
		});
	}
	else {
		firebase.auth().signOut().then(function () {
			signedIn = false;
			document.getElementById('auth_screen').style.display = 'block';
			document.getElementById('main_screen').style.display = 'none';
		}).catch(function (error) {
			console.log(error);
		});
	}

}

/* Function to clear the bookikng table before updating it */
function clearBookingTable() {
	document.getElementById('bookingTableRows').innerHTML = '';
}

/* Function to add a row to the bookings table */
function addBookingRow(no = '1', booking_id = 'AJGHD34H4D', first_name = 'Siddhant', last_name = 'Vinchurkar', email_address = 'siddhantvinchurkar@gmail.com', phone_number = '+919900608821', venue_name = 'Auditorium', date = '12/03/19', time_slot = '10 to 2', total_cost = '₹ 1200', payment_status = 'Unpaid', booking_status = 'Unconfirmed', event_status = 'Unconfirmed') {
	document.getElementById('bookingTableRows').innerHTML += '<tr><td>' + no + '</td><td>' + booking_id + '</td><td>' + first_name + '</td><td>' + last_name + '</td><td>' + email_address + '</td><td>' + phone_number + '</td><td>' + venue_name + '</td><td>' + date + '</td><td>' + time_slot + '</td><td>' + total_cost + '</td><td>' + payment_status + '</td><td>' + booking_status + '</td><td>' + event_status + '</td></tr>';
}

// Get date string from timestamp
function generateDateString(date) {
	date = date.toDate();
	return month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

// Get date string from timestamp (color-coded)
function generateColorCodedDateString(date, dateColor, timeColor, dateBool = true, timeBool = true) {
	date = date.toDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	if (hours < 10) hours = '0' + hours;
	if (minutes < 10) minutes = '0' + minutes;
	if (dateBool && !timeBool) return '<span style="font-weight:bolder; color:' + dateColor + ';">' + month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + '</span>';
	else if (timeBool && !dateBool) return '<span style="font-weight:bolder; color:' + timeColor + ';">' + hours + ':' + minutes + '</span>';
	else return '<span style="font-weight:bolder; color:' + dateColor + ';">' + month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + '</span><span style="font-weight:bolder; color:' + timeColor + ';">' + hours + ':' + minutes + '</span>';
}

// Get time string from timestamp
function generateTimeString(date) {
	try { date = date.toDate(); } catch (e) { } //TODO: Use log statements here to monitor failed queries
	var hours = date.getHours();
	var minutes = date.getMinutes();
	if (hours < 10) hours = '0' + hours;
	if (minutes < 10) minutes = '0' + minutes;
	return hours + ':' + minutes + ':00' + ' GMT+0530 (India Standard Time)';
}

/* Function to unconfirm payments */
function unconfirmPayment(docId = null) {
	if (docId !== null) {
		db.collection("quickbook-bookings").doc(docId).update({ payment_status: false }).then((doc) => {
			M.toast({ html: 'Payment unconfirmed!' });
		});
	}
}

/* Function to confirm payments */
function confirmPayment(docId = null) {
	if (docId !== null) {
		db.collection("quickbook-bookings").doc(docId).update({ payment_status: true }).then((doc) => {
			M.toast({ html: 'Payment unconfirmed!' });
		});
	}
}

/* Function to unconfirm bookings */
function unconfirmBooking(docId = null) {
	if (docId !== null) {
		db.collection("quickbook-bookings").doc(docId).update({ booking_status: false }).then((doc) => {
			M.toast({ html: 'Booking unconfirmed!' });
		});
	}
}

/* Function to confirm bookings */
function confirmBooking(docId = null) {
	if (docId !== null) {
		db.collection("quickbook-bookings").doc(docId).update({ booking_status: true }).then((doc) => {
			M.toast({ html: 'Reservation confirmed!' });
		});
	}
}

/* Function to unconfirm events */
function unconfirmEvent(docId = null) {
	if (docId !== null) {
		db.collection("quickbook-bookings").doc(docId).update({ event_status: false }).then((doc) => {
			M.toast({ html: 'Event unconfirmed!' });
		});
	}
}

/* Function to confirm events */
function confirmEvent(docId = null) {
	if (docId !== null) {
		db.collection("quickbook-bookings").doc(docId).update({ event_status: true }).then((doc) => {
			M.toast({ html: 'Event marked complete!' });
		});
	}
}

/* Data validation function */
function verifyAddVenueFormDataIntegrity() {
	var dataValid = true;
	if (venue_name == ' ') dataValid = false;
	if (venue_code == ' ') dataValid = false;
	if (venue_rate == ' ') dataValid = false;
	if (venue_description == ' ') dataValid = false;
	// Check overall data integrity
	if (dataValid) {
		// Data is valid; allow administrator to add a new user
		document.getElementById('add_venue_button_accept').classList.remove("disabled");
	}
	else {
		// Data is corrupt; prevent administrator from adding a new user
		document.getElementById('add_venue_button_accept').classList.add("disabled");
	}
}

window.onload = function () {

	/* Initialize Firebase */
	firebase.initializeApp({
		apiKey: "AIzaSyB2R3EKvah0v7TXIJhmE-0Fyp0z0cqwUws",
		authDomain: "tgd-experiment.firebaseapp.com",
		databaseURL: "https://tgd-experiment.firebaseio.com",
		projectId: "tgd-experiment",
		storageBucket: "tgd-experiment.appspot.com",
		messagingSenderId: "262835571788",
		appId: "1:262835571788:web:014ae0235c5278c8"
	});

	/* Set the language */
	firebase.auth().languageCode = 'en';

	/* Initialize Firestore */
	db = firebase.firestore();

	/* Listen for form changes */
	document.getElementById("venue_name").onchange = function () { venue_name = document.getElementById("venue_name").value; }
	document.getElementById("venue_code").onchange = function () { venue_code = document.getElementById("venue_code").value; }
	document.getElementById("venue_rate").onchange = function () { venue_rate = document.getElementById("venue_rate").value; }
	document.getElementById("venue_description").onchange = function () { venue_description = document.getElementById("venue_description").value; }

	db.collection('quickbook-bookings').orderBy('booking_timestamp', 'desc').onSnapshot((querySnapshot) => {
		clearBookingTable();
		var index = 1;
		var payment_status = '';
		var booking_status = '';
		var event_status = '';
		var actions = '';
		querySnapshot.forEach((doc) => {
			if (doc.data().payment_status) {
				payment_status = '<span style="font-weight:bolder; color:#BADA55;">Confirmed</span><br /><br /><a rel="noreferrer" onclick="unconfirmPayment(\'' + doc.id + '\');" class="btn-floating waves-effect waves-light red tooltipped z-depth-5" data-tooltip="Unconfirm Payment" data-position="bottom"><i class="material-icons">close</i></a>';
			}
			else {
				payment_status = '<span style="font-weight:bolder; color:#FFAAAA;">Unpaid</span><br /><br /><a rel="noreferrer" onclick="confirmPayment(\'' + doc.id + '\');" class="btn-floating waves-effect waves-light green tooltipped z-depth-5" data-tooltip="Confirm Payment" data-position="bottom"><i class="material-icons">monetization_on</i></a>';
			}
			if (doc.data().booking_status) {
				booking_status = '<span style="font-weight:bolder; color:#BADA55;">Reserved</span><br /><br /><a rel="noreferrer" onclick="unconfirmBooking(\'' + doc.id + '\');" class="btn-floating waves-effect waves-light red tooltipped z-depth-5" data-tooltip="Unconfirm Booking" data-position="bottom"><i class="material-icons">close</i></a>';
			}
			else {
				booking_status = '<span style="font-weight:bolder; color:#FFAAAA;">Unconfirmed</span><br /><br /><a rel="noreferrer" onclick="confirmBooking(\'' + doc.id + '\');" class="btn-floating waves-effect waves-light green tooltipped z-depth-5" data-tooltip="Confirm Booking" data-position="bottom"><i class="material-icons">confirmation_number</i></a>';
			}
			if (doc.data().event_status) {
				event_status = '<span style="font-weight:bolder; color:#BADA55;">Completed</span><br /><br /><a rel="noreferrer" onclick="unconfirmEvent(\'' + doc.id + '\');" class="btn-floating waves-effect waves-light red tooltipped z-depth-5" data-tooltip="Unconfirm Event" data-position="bottom"><i class="material-icons">close</i></a>';
			}
			else {
				event_status = '<span style="font-weight:bolder; color:#FFAAAA;">Not Conducted Yet</span><br /><br /><a rel="noreferrer" onclick="confirmEvent(\'' + doc.id + '\');" class="btn-floating waves-effect waves-light green tooltipped z-depth-5" data-tooltip="Confirm Event" data-position="bottom"><i class="material-icons">event</i></a>';
			}
			addBookingRow(index, '<b style="color:#BADA55;">' + doc.data().booking_reference + '</b>', '<b style="color:#EEBB66;">' + doc.data().first_name + '</b>', '<b style="color:#EEBB66;">' + doc.data().last_name + '</b>', '<b>' + doc.data().email.substr(0, doc.data().email.indexOf('@')) + '</b>' + '<span style="color:#FFBBAA;">' + doc.data().email.substr(doc.data().email.indexOf('@'), doc.data().email.length - 1) + '</span>', '<span style="color:#DDDDDD;">' + doc.data().phone.substr(0, 3) + '</span><b>' + doc.data().phone.substr(3, doc.data().phone.length) + '</b>', '<i>' + doc.data().venue_name + '</i>', generateColorCodedDateString(doc.data().booking_timestamp, '#FFFFCC', '#FFCCCC'), generateColorCodedDateString(doc.data().start_timestamp, '#FFFFCC', '#FFCCCC') + '<br />to<br />' + generateColorCodedDateString(doc.data().end_timestamp, '#FFFFCC', '#FFCCCC'), '₹ <b>' + doc.data().total_cost + '</b> /-', payment_status, booking_status, event_status);
			actions = '';
			index++;
		});
		var tooltips = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
		var modals = M.Modal.init(document.querySelectorAll('.modal'));
	});

	document.getElementById('sign_in_button').onclick = function () {
		signIn();
	}
	document.getElementById('sign_out_button').onclick = function () {
		signIn();
	}

	document.getElementById('add_venue_button_accept').onclick = function () {
		db.collection("quickbook-venues").add({
			venue_name: venue_name,
			venue_code: venue_code,
			venue_rate: +venue_rate,
			venue_description: venue_description
		}).then((doc) => {
			M.toast({ html: 'Added new venue!' });
		});
		M.Modal.getInstance(add_venue_modal).close();
	}

}
