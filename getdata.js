const admin = require('firebase-admin');
const db = admin.firestore();
exports.cvv = async function getCVV(collection, document) {
	var x = '';
	const snapshot = await db.collection(collection).doc(document)
	const doc = await snapshot.get();
	return doc.data().object.cvv
}
//============================================================================================
exports.number = async function getNumber(collection, document) {
	var x = '';
	const snapshot = await db.collection(collection).doc(document)
	const doc = await snapshot.get();
	return doc.data().object.number
}
//============================================================================================
exports.date = async function getDate(collection, document) {
	var x = '';
	const snapshot = await db.collection(collection).doc(document)
	const doc = await snapshot.get();
	return doc.data().object.date
}
exports.name = async function getName(collection, document) {
	var x = '';
	const snapshot = await db.collection(collection).doc(document)
	const doc = await snapshot.get();
	return doc.data().object.name
}
//============================================================================================
exports.updateNumber = async function updateNumber(collection, document, newValue) {
	const cityRef = db.collection(collection).doc(document);
	// Set the 'capital' field of the city

	await cityRef.update({
		'object.number':	newValue
	});
}
//============================================================================================
exports.updateCVV = async function updateNumbere(collection, document, newValue) {
	const cityRef = db.collection(collection).doc(document);
	// Set the 'capital' field of the city

	await cityRef.update({
		'object.cvv':	newValue
	});
}
//============================================================================================
exports.updateDate = async function updateNumberg(collection, document, newMonth, newYear) {
	const cityRef = db.collection(collection).doc(document);
	// Set the 'capital' field of the city

	await cityRef.update({
		'object.date': newMonth + "/" + newYear
	});
}
//============================================================================================
exports.updateName = async function updateNumbetr(collection, document, newName) {
	function h() {
		db.collection(collection).doc(document).delete();
	}
	db.collection(collection).doc(document).get().then(function (doc) {
			if (doc && doc.exists) {
					var data = doc.data();
					// saves the data to 'name'
					db.collection(collection).doc(newName).set(data).then(
						h()
					);
			}
	});
}
function appendKey(dic, value) {
	var lengthh = Object.keys(dic).length
	var size = lengthh + 1
	dic[size] = value
}//============================================================================================
exports.appendCard = async function f(collection, cardname) {
	const cityRef = db.collection(collection).doc("cards");
	const doc = await cityRef.get();		
	var attendees = doc.data().object;
	appendKey(attendees, cardname);
	setData(collection, "cards", attendees)
}
//============================================================================================
async function setData(collection, document, object) {
	const docRef = db.collection(collection).doc(document);
	await docRef.set({
		object
	});
}
//============================================================================================
exports.retrieveCards = async function getCVV(collection) {
	const snapshot = await db.collection(collection).doc('cards')
	const doc = await snapshot.get();
	return doc.data().object
}
//============================================================================================
const FieldValue = admin.firestore.FieldValue;
exports.deleteCardFromList = function findNumber(collection, card) {
	for (var i=0; i < 101; i++) {
		async function foo() {
		const citiesRef = db.collection(collection);
		var k = ('object.' + i)
		const snapshot = await citiesRef.where(k, '==', card).get();
		if (snapshot.empty) {
			console.log('No matching documents.');
			return;
		}  
		snapshot.forEach(doc => {
			var x = (doc.data().object);
			console.log(x)
			const cityRef = db.collection(collection).doc('cards');
			async function h() {
			await cityRef.update({
  			[k]: FieldValue.delete()
			});
			console.log('Card Found:', k);
			}
			h();
		});
		
		}
		foo()
		console.log(i, 'Number(s) attempted...')
	}
}
//============================================================================================
