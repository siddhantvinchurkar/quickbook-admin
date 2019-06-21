const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// This function will update the header video link
exports.generateBookingIds = functions.firestore.document('quickbook-bookings/{docID}').onWrite((change, context) => {
	const document = change.after.exists ? change.after.data() : null;
	var booking_ids = [];
	var db = admin.firestore();
	var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	db.collection("quickbook-bookings").where("email", "==", document.email).where("phone", "==", document.phone).orderBy("booking_timestamp", "desc").get().then((querySnapshot)=>{
		var ix = 1;
		querySnapshot.forEach((doc1)=>{
			db.collection("quickbook-bookings").doc(doc1.id).update({
				booking_reference: 'QBK-' + ix + '_' + month[doc1.data().booking_timestamp.toDate().getMonth()] + ' ' + doc1.data().booking_timestamp.toDate().getDate() + ', ' + doc1.data().booking_timestamp.toDate().getFullYear()
			}).catch((e)=>{console.log(e);});
			ix++;
		});
		db.collection("quickbook-bookings").orderBy("booking_timestamp", "desc").get().then((querySnapshot2)=>{
			var ix2 = 1;
			querySnapshot2.forEach((doc3)=>{
				db.collection("quickbook-bookings").doc(doc3.id).update({
					sequence_number: ix2
				}).catch((e)=>{console.log(e);});
				ix2++;
			});
			return true;
		}).catch((e)=>{console.log(e);});
		return true;
	}).catch((e)=>{console.log(e);});
});
