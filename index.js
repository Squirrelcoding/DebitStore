const admin = require('firebase-admin');
const serviceAccount = require("./key.json")
var generateString = require('./generateString.js')
var express = require('express');
var app = express();
let answer;
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('views'));
app.get("/", function(req, res) {
	res.render("index", { name: '', number: "", date: "", cardname: "" });
});
app.get("/home", function(req, res) {
	res.render("poop", { name: '', number: "", date: "", cardname: "", title:""});
});
app.get('/about', function(req, res) {
	res.render('add', { poop: "hello" });
});
app.get('/create', function(req, res) {
	var code = generateString.generate(6);
	res.render('make', { code: code + " Is your code, do not forget it! This is the code that will let YOU have access to YOUR cards!"});
	var f = {
		object: {
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
app.get('/deleteCard', function(req, res) {
	res.render('delete', { poop: "hello" });
});
app.get('/getCards', function(req, res) {
	res.render('get', { cards: "", acessCode:""});
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
app.post('/deleteForm', (req, res) => {
	var code = `${req.body.code}`
	var confirmCode = `${req.body.confirmcode}`
	var cardDeleted = `${req.body.card_delete}`
	async function deleteCard() {
	if (code == confirmCode) {
		await db.collection(code).doc(cardDeleted).delete();
		getData.deleteCardFromList(confirmCode, cardDeleted)
	}
	else {
		res.render("delete", {
			poop: "Invalid Card name or access Code!"
		});
	}
	}
	deleteCard();
	res.writeHead(301, { Location: 'https://www.debitstore.tk' });
	res.end("");
})
function cc_format(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]|"/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []

    for (i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4))
    }

    if (parts.length) {
        return parts.join('-')
    } else {
        return value
    }
}
app.post('/form', (req, res) => {
	var stuff = `${req.body.id}`
	var card = `${req.body.cardname}`
  answer = stuff;
	async function f() { 
		var poopy = await getCVV(stuff, card)
		var poopy2 = await getData.number(stuff, card)
		var poopy3 = await getData.date(stuff, card)
		var poopy4 = await getData.name(stuff, card)
		res.render("poop", {
			name: "CVV: " + JSON.stringify(poopy).replace(/"/g,''),
			number: "Number: " + JSON.stringify(cc_format(poopy2)).replace(/"/g,''),
			date: "Expiration Date: " + JSON.stringify(poopy3).replace(/"/g,''),
			cardname: "Card Name: " + JSON.stringify(poopy4).replace(/"/g,''),
			title: "Showing Card Data For " + card
		});
	}
	f();
});
app.post('/getCode', (req, res) => {
	async function f() {
	var code = `${req.body.code}`
	var g = await getData.retrieveCards(code)
	res.render("get", {
		cards: Object.keys(g).map(k => g[k]).join('<br>'),
		acessCode: "Showing Cards For " + code
	});
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
	res.writeHead(301, { Location: 'https://www.debitstore.tk' });
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
	res.writeHead(301, { Location: 'https://www.debitstore.tk' });
	res.end("");
});
app.post('/date', (req, res) => {
	var codee = `${req.body.code}`
	var name = `${req.body.cardname}`
	var newMonth = `${req.body.newmonth}`
	var newYear = `${req.body.newyear}`
	getData.updateDate(codee, name, newMonth, newYear)
	res.writeHead(301, { Location: 'https://www.debitstore.tk' });
	res.end("");
});
app.post('/name', (req, res) => {
	var code = `${req.body.code}`
	var oldname = `${req.body.oldName}`
	var newname = `${req.body.newName}`
	getData.updateName(code, oldname, newname)
	res.writeHead(301, { Location: 'https://www.debitstore.tk' });
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