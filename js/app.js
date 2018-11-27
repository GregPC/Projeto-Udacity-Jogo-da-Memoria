/*lista que contém todos os cartões*/
let card = document.getElementsByClassName('card');
let cards = [...card];

/*matriz para cartões abertos*/
let openedCards = [];

/*declarando variável de cartôes combinados*/
let matchedCard = document.getElementsByClassName('match');

/*declarando variavel de movimento*/
let moves = 0;  

/*Variavel de Parabéns(congrats)*/
const popup = document.getElementById('congrats-popup');

/*valor de atualização em HTML*/
let refreshHTML = function(target, value) {
	return target.innerHTML = value;
};

/*Contador e CounterSet*/
let CounterSet = function(moves) {
	this.target = document.querySelector(".counter");
	refreshHTML(this.target, moves);
};

CounterSet.prototype.add = function() {
	moves++;
	refreshHTML(this.target, moves);
};

CounterSet.prototype.restart = function() {
	moves = 0;
	refreshHTML(this.target, moves);
};

let counter = new CounterSet(moves);

/*estrelas e StarRating*/
let StarRating = function() {
	this.stars = document.querySelectorAll(".fa-star");
};

StarRating.prototype.rate = function() {
	if(moves > 12 && moves < 18) {
		this.stars[2].classList.remove("shine");
	} else if(moves > 18) {
		this.stars[1].classList.remove("shine");
	}
};

StarRating.prototype.restart = function() {
	for(var i=0; i<this.stars.length; i++) {
		this.stars[i].classList.add("shine");
	}
};

let stars = new StarRating();

/*declarando temporizador*/
const timer = document.querySelector(".timer");


/*declarando segundo e minuto*/
let second = {
	value: 0,
	label: " segs"
};

let minute = {
	value: 0,
	label: " mins "
};

/*declarando intervalo*/
let interval;

/*embaralhe os cartões e exiba cada carta no baralho quando a página é carregada*/
window.onload = startGame();

/*loop para adicionar ouvintes de eventos a cada cartão*/
for(var i = 0; i < cards.length; i++) {
	cards[i].addEventListener("click", displayCard);
	cards[i].addEventListener("click", cardOpen);
	cards[i].addEventListener("click", congratulations);
}

/*botão de reinicialização*/
document.querySelector(".restart").addEventListener("click", startGame);

/* shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*começar um novo jogo*/
function startGame() {
	cards = shuffle(cards);
	for(var i=0; i<cards.length; i++) {
		document.querySelector(".deck").innerHTML = "";
		[].forEach.call(cards, function(item) {
			document.querySelector(".deck").appendChild(item);
		});
		cards[i].classList.remove("show", "open", "match", "disabled");
	}
	counter.restart();
	stars.restart();
	resetTimer();
}

/* alterna as classes abertas, mostradas e desativadas */
function displayCard() {
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
}

/*adicionar cartões abertos à lista openCards e verificar se os cartões são compatíveis ou não */
function cardOpen() {
	openedCards.push(this);
	if(openedCards.length === 2) {
		counter.add();
		stars.rate();
		startTimer();
		if(openedCards[0].type === openedCards[1].type) {
			matched();
		} else {
			unmatched();
		}
	}
}

/* quando os cartões coincidem */
function matched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("match", "disabled");
		openedCards[i].classList.remove("show", "open", "no-event");
	}
	openedCards = [];
}

/* quando as cartas não combinam */
function unmatched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("unmatched");
	}
	disable();
	setTimeout(function() {
		for(var i=0; i<openedCards.length; i++) {
			openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
		}
		enable();
		openedCards = [];
	}, 1100);
}

/* desativar cartões */
function disable() {
	for(var i = 0; i < cards.length; i++) {
		cards[i].classList.add("disabled");
	}
}

/* ativar todos os cartões, exceto os combinados */
function enable() {
	for(var i = 0; i < cards.length; i++) {
		if(!cards[i].classList.contains("match")) {
			cards[i].classList.remove("disabled");
		};
	}
}

/* cronômetro de atualização em HTML */
function refreshTimer() {
	timer.innerHTML = minute.value + minute.label + second.value + second.label;
}

/* reset timer */
function resetTimer() {
	second.value = 0;
	minute.value = 0;
	refreshTimer();
}

/* iniciar temporizador */
function startTimer() {
	if(moves == 1) {
		interval = setInterval(function() {
			second.value++;
			if(second.value == 60) {
				minute.value++;
				second.value = 0;
			}
			refreshTimer();
		}, 1000);
	}
}

/* parabéns quando todos os cartões coincidem */
function congratulations() {
	if(matchedCard.length == 16) {
		clearInterval(interval);
		popup.classList.add("show");
		document.getElementById("total-moves").innerHTML = moves;
		document.getElementById("total-time").innerHTML = timer.innerHTML;
		document.getElementById("star-rating").innerHTML = document.querySelector(".stars").innerHTML;
		closePopup();
	};
}

/* fechar a função popup no botão "play again" */
function closePopup() {
	document.getElementById("play-again").addEventListener("click", function() {
		popup.classList.remove("show");
		startGame();
	});
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */