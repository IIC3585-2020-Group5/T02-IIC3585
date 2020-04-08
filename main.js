// const _ = require("lodash");
const operator = rxjs.operators;

const observable = rxjs.of(1, 2, 3).pipe(operator.map(value => value * value));
// observable.subscribe(x => console.log(x));

const generator = rxjs.generate(
    1,           // start with this value
    x => x < 10, // condition: emit as long as a value is less than 10
    x => x*2     // iteration: double the previous value
  ).subscribe(x => console.log(x));


  Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
  }

const randomFormulaGenerator = () => {
    let a = Math.floor(Math.random() * Math.floor(30));
    let b = Math.floor(Math.random() * Math.floor(30));
    let symbols = ["*", "+", "-"];
    let positive = "";
    let negative = "-";
    return `${Math.random() > 0.7 ? negative : positive} ${a} ${symbols.sample()} ${b}`
}
 
// console.log(randomFormulaGenerator());
// console.log(randomFormulaGenerator());
// console.log(randomFormulaGenerator());
// console.log(randomFormulaGenerator());
// console.log(randomFormulaGenerator());
// console.log(randomFormulaGenerator());


const player1Question = document.getElementById("player1-question");
const player1Answer1 = document.getElementById("player1-answer1");
const player1Answer2 = document.getElementById("player1-answer2");
const player1Answer3 = document.getElementById("player1-answer3");
const player1Answer4 = document.getElementById("player1-answer4");

const player1AnswerSetter = (formula) => {
    let realAnswer = eval(formula);
    let answerSet = [player1Answer1, 
        player1Answer2, 
        player1Answer3,
        player1Answer4,
    ]
    function getRandomFromBucket() {
        var randomIndex = Math.floor(Math.random()*answerSet.length);
        return answerSet.splice(randomIndex, 1)[0];
     }
     
     let i = 0;
     while (i < 3) {
        getRandomFromBucket().innerHTML = realAnswer + Math.floor(Math.random() * Math.floor(30));
        i+=1;
     }
     getRandomFromBucket().innerHTML = realAnswer;
}

const checkAnswerFromPlayer = (element, player) => {
    if (!player) {
        // player 1 
        if (parseInt(element.innerHTML) == parseInt(eval(player1Question.innerHTML))) {
            return {player, condition: true};
        }
    } else {
        // TODO
    }
    return {player, condition: false};
}

const handleKeyPress = (x) => {
    // console.log("PUSSY1");
    switch(x.code) {
        case "KeyQ":
            return checkAnswerFromPlayer(player1Answer1, 0);
            break;
        case "KeyW":
            return checkAnswerFromPlayer(player1Answer2, 0);
            break;
        case "KeyE":
            return checkAnswerFromPlayer(player1Answer3, 0);
            break;
        case "KeyR":
            return checkAnswerFromPlayer(player1Answer4, 0);
            break;

        default:
            console.log("ANAL");
          // code block
      }

} 


const decideNextMove = (obj) => {
    if (!obj.player) {
        
    }
}

const clickEvent = rxjs.fromEvent(document, 'click');
const example = clickEvent.pipe(operator.map(x => randomFormulaGenerator()));
var sub = new rxjs.BehaviorSubject([0]) 
const publisherSub = example.subscribe(sub);
const clickGenSub = sub.subscribe(x =>  player1Question.innerHTML = x);
const answer1Sub = sub.subscribe(x => player1AnswerSetter(x));
const ob = new rxjs.Observable(sub => {
    // let timeout = null;
    sub.next(randomFormulaGenerator());
  });

const keyEvent = rxjs.fromEvent(document, 'keypress');
const keyPressing = keyEvent.pipe(operator.map(x => handleKeyPress(x)));
const keySubber = keyPressing.subscribe(x => console.log(x));


var time = rxjs.timer(1000);
ob.pipe(operator.takeUntil(time)).subscribe(x => console.log(x));


const checkResult = (key) => {

}