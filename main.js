const operator = rxjs.operators;


const player1Question = document.getElementById("player1-question");
const player1Answer1 = document.getElementById("player1-answer1");
const player1Answer2 = document.getElementById("player1-answer2");
const player1Answer3 = document.getElementById("player1-answer3");
const player1Answer4 = document.getElementById("player1-answer4");
const player1ScoreBadge = $("#player1-score");

const player2Question = document.getElementById("player2-question");
const player2Answer1 = document.getElementById("player2-answer1");
const player2Answer2 = document.getElementById("player2-answer2");
const player2Answer3 = document.getElementById("player2-answer3");
const player2Answer4 = document.getElementById("player2-answer4");
const player2ScoreBadge = $("#player2-score");

let player1keys = new Map();
player1keys.set("KeyQ", player1Answer1);
player1keys.set("KeyW", player1Answer2);
player1keys.set("KeyE", player1Answer3);
player1keys.set("KeyR", player1Answer4);

let player2keys = new Map();
player2keys.set("KeyU", player2Answer1);
player2keys.set("KeyI", player2Answer2);
player2keys.set("KeyO", player2Answer3);
player2keys.set("KeyP", player2Answer4);


let player1Freeze = false;
let stopReceiving1 = false;
let player1Score = 0;

let player2Freeze = false;
let stopReceiving2 = false;
let player2Score = 0;

const randomFormulaGenerator = () => {
    let a = Math.floor(Math.random() * Math.floor(30));
    let b = Math.floor(Math.random() * Math.floor(30));
    let symbols = ["*", "+", "-"];
    let positive = "";
    let negative = "-";
    return `${Math.random() > 0.5 ? negative : positive} ${a} ${_.sampleSize(symbols, 1)[0]} ${b}`
}

const playerAnswerSetter = (player) => {

    let answerSet = [player1Answer1, 
        player1Answer2, 
        player1Answer3,
        player1Answer4,
    ]
    if (player === 2) {
        answerSet = [player2Answer1, 
            player2Answer2, 
            player2Answer3,
            player2Answer4,
        ]
    }

    let fakeAnswer = (element, real) => {
        let fake;
        if (Math.random() > 0.5) {
            fake = real + Math.floor(Math.random() * Math.floor(30));
        } else {
            fake = real - Math.floor(Math.random() * Math.floor(30));
        }
        element.innerHTML = fake;
        return element;
    }

    let setAnswers = (formula) => {
        let realAnswer = eval(formula);
 
        answerSet = _.sampleSize(answerSet, 4).map(x => fakeAnswer(x, realAnswer));
        console.log(answerSet);
        let index = Math.floor(Math.random()*answerSet.length);
        answerSet[index].innerHTML = realAnswer;
    }

    return setAnswers;
}

const checkAnswer = (question, answer) => {
    console.log(parseInt(answer));
    console.log(parseInt(eval(question.innerHTML)));
    let correct = false;
    if (parseInt(answer) === parseInt(eval(question.innerHTML))) {
        correct = true;
    }
    return correct;
}

const freezePlayer = (player) => {

    let timePenalty1 = rxjs.timer(3000).pipe(operator.map(x => {
        let formula = randomFormulaGenerator();
        player1Question.innerHTML = formula;
        player1AnswerSetter(formula);
        player1Freeze = false;
    }));

    let timePenalty2 = rxjs.timer(3000).pipe(operator.map(x => {
        let formula = randomFormulaGenerator();
        player2Question.innerHTML = formula;
        player2AnswerSetter(formula);
        player2Freeze = false;
    }));

    let freezePenalty = (x) => {
        if (player === 1 && player1Freeze) {
            console.log("freezing");
            timePenalty1.subscribe()
        } else if (player === 2 && player2Freeze) {
            console.log("freezing");
            timePenalty2.subscribe()
        }
        console.log("Returning ");
        console.log(x);
        return x;
    }

    return freezePenalty;
}


const takeAction = (player) => {

    let takeActionForAnswer = (correct) => {
        let formula = randomFormulaGenerator();
        if (player === 1) {
            if (correct) {
                player1Score += 100;
                player1Question.innerHTML = formula;
                player1AnswerSetter(formula);
            } else {
                player1Freeze = true;
                player1Question.innerHTML = "WRONG ANSWER";
                player1Answer1.innerHTML = "Freeze Penalty";
                player1Answer2.innerHTML = "Freeze Penalty";
                player1Answer3.innerHTML = "Freeze Penalty";
                player1Answer4.innerHTML = "Freeze Penalty";
            }
        } else if (player === 2) {
            if (correct) {
                player2Score += 100;
                player2Question.innerHTML = formula;
                player2AnswerSetter(formula);
            } else {
                player2Freeze = true;
                player2Question.innerHTML = "WRONG ANSWER";
                player2Answer1.innerHTML = "Freeze Penalty";
                player2Answer2.innerHTML = "Freeze Penalty";
                player2Answer3.innerHTML = "Freeze Penalty";
                player2Answer4.innerHTML = "Freeze Penalty";
            }
        }

        return correct;
    }

    return takeActionForAnswer;
}


const scoreUpdate = (x) => {
    // player1Score
    // player1ScoreBadge
    let highBadgeColor = "badge-success";
    let lowBadgeColor = "badge-warning";
    if (player1Score > player2Score) {
        player1ScoreBadge.removeClass("badge-warning");
        player1ScoreBadge.addClass("badge-success");
        player2ScoreBadge.removeClass("badge-success");
        player2ScoreBadge.addClass("badge-warning");
    } else {
        player2ScoreBadge.removeClass("badge-warning");
        player2ScoreBadge.addClass("badge-success");
        player1ScoreBadge.removeClass("badge-success");
        player1ScoreBadge.addClass("badge-warning");
    }
    player1ScoreBadge.html(player1Score);
    player2ScoreBadge.html(player2Score);
    return x;
}

const source = rxjs.interval(1000);

let initGame = () => {
    var time = rxjs.timer(62000);
    source.pipe(operator.takeUntil(time)).subscribe(x => progressBarModifier(x));
    time.subscribe(x => endGame());
    let formula1 = randomFormulaGenerator();
    let formula2 = randomFormulaGenerator();
    player1Question.innerHTML = formula1;
    player1AnswerSetter(formula1);
    player2Question.innerHTML = formula2;
    player2AnswerSetter(formula2);
}

const endGame = () => {
    stopReceiving1 = true;
    stopReceiving2 = true;
    if (player1Score === player2Score) {
        $("#end-game-modal-label").html(`Es un empate!`);
    } else {
        $("#end-game-modal-label").html(`El ganador es ${player1Score > player2Score ? 'Player1' : 'Player2'}!`);
    }
    $('#end-game-modal-body').html(`Player 1: ${player1Score} vs Player 2: ${player2Score}`);
    $('#end-game-modal').modal('toggle');
    
}

const progressBarModifier = (x) => {
    let secondsLeft = 60 - x;
    let percentageLeft = secondsLeft / 60;
    let pbElem = $("#time-bar");
    pbElem.html(`${secondsLeft}s`);
    pbElem.attr("aria-valuenow", percentageLeft * 100);
    pbElem.css("width", `${percentageLeft * 100}%`);
    if (percentageLeft < 0.60 && percentageLeft > 0.2) {
        pbElem.removeClass("bg-success");
        pbElem.addClass("bg-warning");
    } 
    if (percentageLeft < 0.20) {
        pbElem.removeClass("bg-warning");
        pbElem.addClass("bg-danger");
    }
}

//Game start
let initButton = document.getElementById("init-button");
initButton.onclick = () => {
    let initRow = $("#game-init");
    let gameRow = $("#game-div");

    initRow.slideUp();
    gameRow.slideDown();
}


const player1AnswerSetter = playerAnswerSetter(1);
const player2AnswerSetter = playerAnswerSetter(2);

let freezePlayer1 = freezePlayer(1);
let freezePlayer2 = freezePlayer(2);

const takeActionPlayer1 = takeAction(1);
const takeActionPlayer2 = takeAction(2);


//Observables
rxjs.fromEvent(initButton, 'click').subscribe(initGame);

const keyEvent1 = rxjs.fromEvent(document, 'keypress')
    .pipe(
          operator.filter(x => Array.from(player1keys.keys()).includes(x.code) && !stopReceiving1 && !player1Freeze),
          operator.map(x => { stopReceiving1 = true; return x; }),
          operator.map(x => x.code),
          operator.map(x => player1keys.get(x)),
          operator.map(x => x.innerHTML),
          operator.map(x => checkAnswer(player1Question, x)),
          operator.map(x => takeActionPlayer1(x)),
          operator.map(x => scoreUpdate(x)),
          operator.map((x) => freezePlayer1(x)),
          operator.map((x) => { stopReceiving1 = false; return x})
    )
    .subscribe(x => console.log(x));

const keyEvent2 = rxjs.fromEvent(document, 'keypress')
    .pipe(
          operator.filter(x => Array.from(player2keys.keys()).includes(x.code) && !stopReceiving2 && !player2Freeze),
          operator.map(x => { stopReceiving2 = true; return x; }),
          operator.map(x => x.code),
          operator.map(x => player2keys.get(x)),
          operator.map(x => x.innerHTML),
          operator.map(x => checkAnswer(player2Question, x)),
          operator.map(x => takeActionPlayer2(x)),
          operator.map(x => scoreUpdate(x)),
          operator.map((x) => freezePlayer2(x)),
          operator.map((x) => { stopReceiving2 = false; return x})
    )
    .subscribe(x => console.log(x));




