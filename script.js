const startButton =
 document.getElementById("start-button");

const hitButton =
 document.getElementById("hit-button");

const ball =
 document.getElementById("ball");

const message =
 document.getElementById("message");

const scoreDisplay =
 document.getElementById("score");


let ballPosition = 0;

let ballAnimation = null;

let atBats = 0;

let hits = 0;

let isPitching = false;


/* =========================
 START
========================= */

startButton.addEventListener(
 "click",
 startPitch
);


/* =========================
 打つ！
========================= */

hitButton.addEventListener(
 "click",
 hit
);

/* =========================
 キーボード操作
========================= */

document.addEventListener("keydown", function(event) {

    console.log("キー:", event.code);

    if (event.code === "Space") {

        event.preventDefault();
        startPitch();

    } else if (event.code === "Enter") {

        event.preventDefault();
        hit();

    }

});


/* =========================
 投球開始
========================= */

function startPitch() {

 if (isPitching) {
 return;
 }


 isPitching = true;


 message.textContent =
 "タイミングを合わせろ！";


 startButton.disabled = true;

 hitButton.disabled = false;


 ballPosition = 0;


 ball.style.display = "block";

 ball.style.top = "120px";

 ball.style.left = "50%";

 ball.style.fontSize = "18px";


 moveBall();

}


/* =========================
 ボール移動
========================= */

function moveBall() {

 ballPosition += 0.6;


 const y =
 120 + ballPosition * 2.8;


 const size =
 18 + ballPosition * 0.7;


 ball.style.top =
 `${y}px`;


 ball.style.fontSize =
 `${size}px`;


 if (ballPosition < 100) {

 ballAnimation =
 requestAnimationFrame(moveBall);

 } else {

 finishPitch("bad");

 }

}


/* =========================
 バットを振る
========================= */

function hit() {

 if (!isPitching) {
 return;
 }


 let timing;


 if (
 ballPosition >= 68 &&
 ballPosition <= 78
 ) {

 timing = "perfect";

 }

 else if (
 ballPosition >= 50 &&
 ballPosition <= 88
 ) {

 timing = "good";

 }

 else {

 timing = "bad";

 }


 finishPitch(timing);

}


/* =========================
 結果処理
========================= */

function finishPitch(timing) {

 if (ballAnimation) {

 cancelAnimationFrame(
 ballAnimation
 );

 ballAnimation = null;

 }


 isPitching = false;

 hitButton.disabled = true;

 startButton.disabled = false;


 atBats++;


 fetch("/hit", {

 method: "POST",

 headers: {

 "Content-Type":
 "application/json"

 },

 body: JSON.stringify({

 timing: timing

 })

 })


 .then(response => {

 if (!response.ok) {
 throw new Error(
 "サーバーエラー"
 );
 }

 return response.json();

 })


 .then(data => {

 message.textContent =
 data.result;


 if (data.type !== "strike") {

 hits++;

 }


 updateScore();


 showResultAnimation(
 data.type
 );

 })


 .catch(error => {

 console.error(error);

 message.textContent =
 "通信エラーが発生しました";

 ball.style.display = "none";

 });

}


/* =========================
 成績更新
========================= */

function updateScore() {

 let battingAverage = 0;


 if (atBats > 0) {

 battingAverage =
 hits / atBats;

 }


 scoreDisplay.textContent =
 `打数：${atBats}　` +
 `安打：${hits}　` +
 `打率：${battingAverage.toFixed(3)}`;

}


/* =========================
 打球アニメーション
========================= */

function showResultAnimation(type) {

 ball.style.transition =
 "all 0.8s ease";


 if (type === "home_run") {

 ball.style.top =
 "0px";

 ball.style.left =
 "90%";

 ball.style.fontSize =
 "40px";

 }


 else if (type === "triple") {

 ball.style.top =
 "20px";

 ball.style.left =
 "80%";

 }


 else if (type === "double") {

 ball.style.top =
 "100px";

 ball.style.left =
 "75%";

 }


 else if (type === "single") {

 ball.style.top =
 "180px";

 ball.style.left =
 "65%";

 }


 else {

 ball.style.top =
 "400px";

 }


setTimeout(() => {

    ball.style.display = "none";

    ball.style.transition = "";

    // PLAY BALL! を表示
    message.textContent = "⚾ PLAY BALL! ⚾";

}, 1000);

}