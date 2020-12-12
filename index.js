const admin = require('firebase-admin');
const serviceAccount = require("./key.json")
var generateString = require('./generateString.js')
var express = require('express');

var app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('views'));
app.get("/", function(req, res) {
	res.render("index", { name: '', number: "", date: "", cardname: "" });
});
app.get('/about', function(req, res) {
	res.render('add', { poop: "hello" });
});
app.get('/create', function(req, res) {
	var code = generateString.generate(6);
	res.render('make', { code: code + "Is your code, do not forget it! This is the code that will let YOU have access to YOUR cards!"});
	var f = {
		cards: {
			0: ""
		}
	}
	async function t() {
		await db.collection(code).doc('cards').set(f);
	}
	t();
});
//firebase  
app.get('/editMenu', function(req, res) {
	res.render('editmenu', { poop: "" });
});
//====================================================
app.get('/editCardName', function(req, res) {
	res.render('editName', { poop: "name" });
});
app.get('/getCards', function(req, res) {
	res.render('get', { cards: "" });
});
app.get('/editCardDate', function(req, res) {
	res.render('editDate', { poop: "date" });
});
app.get('/editCardCVV', function(req, res) {
	res.render('editNumberCVV', { poop: "cvv/number" });
});
//====================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, function(req, res) {
	console.log("Connected on port:3000");
});

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://poopnet-4fb22.firebaseio.com"
});
var getData = require('./getdata.js')
const db = admin.firestore();
var x = {
	poop: "poopy lol"
}

async function getCVV(collection, document, property) {
	var x = '';
	const snapshot = await db.collection(collection).doc(document)
	const doc = await snapshot.get();
	return doc.data().object.cvv;
}

app.post('/form', (req, res) => {
	var stuff = `${req.body.id}`
	var card = `${req.body.cardname}`
	async function f() {
		var poopy = await getCVV(stuff, card)
		var poopy2 = await getData.number(stuff, card)
		var poopy3 = await getData.date(stuff, card)
		var poopy4 = await getData.name(stuff, card)
		res.render("index", {
			name: "CVV: " + JSON.stringify(poopy).replace('"', ""),
			number: "Number: " + JSON.stringify(poopy2).replace('"', ""),
			date: "Date: " + JSON.stringify(poopy3).replace('"', ""),
			cardname: "Card Name: " + JSON.stringify(poopy4).replace('"', ""),

		});
	}
	f();
})
app.post('/getCode', (req, res) => {
	async function f() {
	var code = `${req.body.code}`
	var g = await getData.retrieveCards(code)
	res.render("get", {cards: JSON.stringify(g).replace(/}|{|"|:|,|1|2|3|4|5|6|7|8|9|0/g, '')});
	}
	
	f();
})
app.post('/addCard', (req, res) => {
	var namee = `${req.body.cardname}`;
	var numberr = `${req.body.cardnumber}`;
	var cvvv = `${req.body.cardcvv}`;
	var datee = `${req.body.carddate}`;
	var codee = `${req.body.code}`;
	var data = {
		name: namee,
		number: numberr,
		date: datee,
		cvv: cvvv
	}
	setData(codee, namee, data)
	getData.appendCard(codee, namee)
	res.writeHead(301, { Location: 'https://debitstore.squirrel777.repl.co/' });
	res.end("");
})

app.post('/number', (req, res) => {
	var newNumber = `${req.body.newNumber}`
	var code = `${req.body.code}`
	var name = `${req.body.cardname}`
	var numberCVV = `${req.body.choice}`
	if (numberCVV == 'number') {
		getData.updateNumber(code, name, newNumber)
	}
	else if (numberCVV == 'cvv') {
		getData.updateCVV(code, name, newNumber)
	}
	res.writeHead(301, { Location: 'https://debitstore.squirrel777.repl.co/' });
	res.end("");
});
app.post('/date', (req, res) => {
	var codee = `${req.body.code}`
	var name = `${req.body.cardname}`
	var newMonth = `${req.body.newmonth}`
	var newYear = `${req.body.newyear}`
	getData.updateDate(codee, name, newMonth, newYear)
	res.writeHead(301, { Location: 'https://debitstore.squirrel777.repl.co/' });
	res.end("");
});
app.post('/name', (req, res) => {
	var code = `${req.body.code}`
	var oldname = `${req.body.oldName}`
	var newname = `${req.body.newName}`
	getData.updateName(code, oldname, newname)
	res.writeHead(301, { Location: 'https://debitstore.squirrel777.repl.co/' });
	res.end("");
})
//setData('Test', 'Test-Express', x);
async function setData(collection, document, object) {
	const docRef = db.collection(collection).doc(document);
	await docRef.set({
		object
	});
}
//u0rAY7
//Poop
//lolpoopy
//getData.updateName("u0rAY7", "Poop", "Caca") 