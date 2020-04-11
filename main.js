// const _ = require("lodash");
const operator = rxjs.operators;


const player1Question = document.getElementById("player1-question");
const player1Answer1 = document.getElementById("player1-answer1");
const player1Answer2 = document.getElementById("player1-answer2");
const player1Answer3 = document.getElementById("player1-answer3");
const player1Answer4 = document.getElementById("player1-answer4");
const player1ScoreBadge = $("#player1-score");
const player2ScoreBadge = $("#player2-score");

let player1Score = 0;
let player2Score = 0;

const randomFormulaGenerator = () => {
    let a = Math.floor(Math.random() * Math.floor(30));
    let b = Math.floor(Math.random() * Math.floor(30));
    let symbols = ["*", "+", "-"];
    let positive = "";
    let negative = "-";
    return `${Math.random() > 0.7 ? negative : positive} ${a} ${symbols.sample()} ${b}`
}

const player1AnswerSetter = (formula) => {

    if (formula.length <= 0) {
        return;
    }

    let realAnswer = eval(formula);
    let answerSet = [player1Answer1, 
        player1Answer2, 
        player1Answer3,
        player1Answer4,
    ]
 
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

    answerSet = _.sampleSize(answerSet, 4).map(x => fakeAnswer(x, realAnswer));
    console.log(answerSet);
    let index = Math.floor(Math.random()*answerSet.length);
    answerSet[index].innerHTML = realAnswer;

}

const source = rxjs.interval(1000);
let player1keys = new Map();
let player1Freeze = false;
let stopReceiving1 = false;

const checkAnswer = (question, answer) => {
    console.log(parseInt(answer));
    console.log(parseInt(eval(question.innerHTML)));
    let correct = false;
    if (parseInt(answer) === parseInt(eval(question.innerHTML))) {
        correct = true;
    }
    return correct;
}

const freezePlayer1 = (x) => {

    if (player1Freeze) {
        console.log("freezing");
        let tm = rxjs.timer(3000).pipe(operator.map(x => {
            let formula = randomFormulaGenerator();
            player1Question.innerHTML = formula;
            player1AnswerSetter(formula);
            player1Freeze = false;
        }));
        tm.subscribe()
    }
    console.log("Returning ");
    console.log(x);
    return x;
}


const takeAction = (correct) => {
    let formula = randomFormulaGenerator();
    if (correct) {
        player1Score += 100;
        player1Question.innerHTML = formula;
        player1AnswerSetter(formula);
    } else {
        player1Freeze = true;
        player1Question.innerHTML = "Aweonao";
        player1Answer1.innerHTML = "pUSY";
        player1Answer2.innerHTML = "pUSY";
        player1Answer3.innerHTML = "pUSY";
        player1Answer4.innerHTML = "pUSY";
    }
    return correct;
}

const unfreezePlayer1 = (x) => {
    if (player1Freeze) {
        player1Freeze = false;
        let formula = randomFormulaGenerator();
        player1Question.innerHTML = formula;
        player1AnswerSetter(formula);
    }

    return x;
}

//Observables

player1keys.set("KeyQ", player1Answer1);
player1keys.set("KeyW", player1Answer2);
player1keys.set("KeyE", player1Answer3);
player1keys.set("KeyR", player1Answer4);
const keyEvent1 = rxjs.fromEvent(document, 'keypress')
    .pipe(
          operator.filter(x => Array.from(player1keys.keys()).includes(x.code) && !stopReceiving1 && !player1Freeze),
          operator.map(x => { stopReceiving1 = true; return x; }),
          operator.map(x => x.code),
          operator.map(x => player1keys.get(x)),
          operator.map(x => x.innerHTML),
          operator.map(x => checkAnswer(player1Question, x)),
          operator.map(x => takeAction(x)),
          operator.map(x => scoreUpdate(x)),
          operator.map((x) => freezePlayer1(x)),
          operator.map((x) => { stopReceiving1 = false; return x}),

    )
    .subscribe(x => console.log(x));

// let valid2 = ["KeyU", "KeyI", "KeyO", "KeyP"];
// const keyEvent2 = rxjs.fromEvent(document, 'keypress')
//     .pipe(operator.filter(x => valid2.includes(x.code)))
//     .subscribe(x => console.log(x.code));




const scoreUpdate = (x) => {
    // player1Score
    // player1ScoreBadge
    console.log("pussySlayer")
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

let initGame = () => {
    var time = rxjs.timer(62000);
    source.pipe(operator.takeUntil(time)).subscribe(x => progressBarModifier(x));
    time.subscribe(x => endGame());
    let formula = randomFormulaGenerator();
    player1Question.innerHTML = formula;
    player1AnswerSetter(formula);

}

const endGame = () => {
    //Avengers
    stopReceiving1 = true;
    $("#end-game-modal-label").html(`El ganador es ${player1Score > player2Score ? 'Player1' : 'Player2'}!`);
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

let initButton = document.getElementById("init-button");
initButton.onclick = () => {
    let initRow = $("#game-init");
    let gameRow = $("#game-div");

    initRow.slideUp();
    gameRow.slideDown();
}
rxjs.fromEvent(initButton, 'click').subscribe(initGame);


Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

const checkAnswerFromPlayer = (element, player) => {
    let result = {player, condition: false}
    if (!player) {
        // player 1 

        if (parseInt(element.innerHTML) == parseInt(eval(player1Question.innerHTML))) {
            // return {player, condition: true};
            result = {player, condition: true};

        } else {
            player1Question.innerHTML = "";
            player1Answer1.innerHTML = "";
            player1Answer2.innerHTML = "";
            player1Answer3.innerHTML = "";
            player1Answer4.innerHTML = "";
        }

        return new Promise((resolve, reject) => {
            if (result.condition) {
                resolve(result);
            } else {
                setTimeout(
                    () => resolve(result), 3000
                );
            }
        })
    } else {
        // TODO
    }
    return {player, condition: false};
}






