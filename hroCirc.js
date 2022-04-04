const axios = require("axios");
const axiosRateLimit = require("axios-rate-limit");
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const auth = { email: "youremail", password: "yourpassword" };

let myJwt;

const login = async () => {
	return http("https://api.hro.gg/api/v1/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(auth),
	});
};
let totalCirc = 0;
let allCards = [];
let allMarkets = [];

const getCards = async () => {
	try {
		const cards = await http(
			// `https://api.epics.gg/api/v1/collections/${collectionId}/card-templates?categoryId=1`,
			`https://api.hro.gg/api/v1/collections/100/card-templates?categoryId=1`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);
		const marketsCom = await http(
			// `https://api.epics.gg/api/v1/market/templates?season=2022&treatmentId=43&type=card`,
			`https://api.hro.gg/api/v1/market/templates?season=2022&treatmentId=43&type=card`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);
		const marketsEpic = await http(
			// `https://api.epics.gg/api/v1/market/templates?season=2022&treatmentId=36&type=card`,
			`https://api.hro.gg/api/v1/market/templates?season=2022&treatmentId=36&type=card`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);
		
		const marketsLeg = await http(
			// `https://api.epics.gg/api/v1/market/templates?season=2022&treatmentId=37&type=card`,
			`https://api.hro.gg/api/v1/market/templates?season=2022&treatmentId=37&type=card`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);const marketsSup = await http(
			// `https://api.epics.gg/api/v1/market/templates?season=2022&treatmentId=35&type=card`,
			`https://api.hro.gg/api/v1/market/templates?season=2022&treatmentId=35&type=card`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);
		const marketsUncom = await http(
			// `https://api.epics.gg/api/v1/market/templates?season=2022&treatmentId=34&type=card`,
			`https://api.hro.gg/api/v1/market/templates?season=2022&treatmentId=34&type=card`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);
		const packs = await http(
			// `https://api.epics.gg/api/v1/market/templates?season=2022&treatmentId=43&type=pack`,
			`https://api.hro.gg/api/v1/market/templates?season=2022&treatmentId=43&type=pack`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": myJwt,
				},
			}
		);

		let floor = 0;

		packs.data.data.templates.forEach((pack) => {
			floor += pack.lowestPrice		
		});
		console.log("Pack Floor: ",floor);

		marketsLeg.data.data.templates.forEach((card) => {
			
			if (card.cardTemplate.title.includes("")){
				let cardObj = {
					title: card.cardTemplate.title,
					lowestPrice: card.lowestPrice,
				};
				allMarkets.push(cardObj);
			}
			
		});
		marketsEpic.data.data.templates.forEach((card) => {
			
			if (card.cardTemplate.title.includes("")){
				let cardObj = {
					title: card.cardTemplate.title,
					lowestPrice: card.lowestPrice,
				};
				allMarkets.push(cardObj);
			}
			
		});marketsSup.data.data.templates.forEach((card) => {
			
			if (card.cardTemplate.title.includes("")){
				let cardObj = {
					title: card.cardTemplate.title,
					lowestPrice: card.lowestPrice,
				};
				allMarkets.push(cardObj);
			}
			
		});marketsUncom.data.data.templates.forEach((card) => {
			
			if (card.cardTemplate.title.includes("")){
				let cardObj = {
					title: card.cardTemplate.title,
					lowestPrice: card.lowestPrice,
				};
				allMarkets.push(cardObj);
			}
			
		});marketsCom.data.data.templates.forEach((card) => {
			
			if (card.cardTemplate.title.includes("")){
				let cardObj = {
					title: card.cardTemplate.title,
					lowestPrice: card.lowestPrice,
				};
				allMarkets.push(cardObj);
			}
			
		});

		allMarkets.sort((a, b) => parseFloat(b.lowestPrice) - parseFloat(a.lowestPrice));
		
		cards.data.data.forEach((card) => {
			if (card.title.includes("AWP")) {
				totalAWP += card.inCirculation;
			}
			if (card.title.includes("Sticker")) console.log(card);
			let cardObj = {
				title: card.title,
				circ: card.inCirculation,
			};
			allCards.push(cardObj);
			totalCirc += card.inCirculation;
		});
		allCards.sort((a, b) => {
			if (a.circ > b.circ) {
				return 1;
			} else if (a.circ < b.circ) {
				return -1;
			}
		});
		console.log("Total Circulation: ", totalCirc);
		console.log("Packs opened: ", Math.floor(totalCirc / 3));
		console.table(allCards);
		console.table(allMarkets);
	} catch (err) {
		console.log(err);
	}
};

const doStuff = async (auth) => {
	try {
		const loginResult = await login(auth);
		if (loginResult.data.success === true) {
			myJwt = loginResult.data.data.jwt;
			console.log("login successful");
			console.log(loginResult.data.data.user.username);
		} else {
			console.log("login failed");
		}
		await getCards();
	} catch (err) {
		console.log(err);
	}
};
doStuff(auth);
