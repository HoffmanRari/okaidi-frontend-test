//https://opentdb.com/api.php

let datas = [];
let curr = 0;
let correct = 0;
let wrong = 0;
let clrTimeout = undefined;
let isClick = false;
let timeInSecond = 20;

const onChangeStat = (curr, total) => {
  document.getElementById(
    "stat"
  ).innerHTML = `- Questions ${curr} sur ${total}`;
};

// timer to give a time elapsed
const countDown = (second) => {
  const time = document.getElementById("time");
  const minutesLeft = parseInt(second / 60);
  const secondLeft = second % 60;
  clrTimeout && clearTimeout(clrTimeout);
  if (minutesLeft < 10 && secondLeft >= 10)
    time.innerHTML = " " + "0" + minutesLeft + ":" + secondLeft;
  else if (secondLeft < 10 && minutesLeft >= 10)
    time.innerHTML = " " + minutesLeft + ":0" + secondLeft;
  else if (secondLeft < 10 && minutesLeft < 10)
    time.innerHTML = " " + "0" + minutesLeft + ":0" + secondLeft;
  else time.innerHTML = " " + minutesLeft + ":" + secondLeft;
  second--;
  clrTimeout = setTimeout("countDown(" + second + ")", 1000);
  if (minutesLeft == "00" && secondLeft < 1) {
    clearTimeout(clrTimeout);
    onNext();
  }
};

const onChargeCurrent = (elm) => {
  let bodyData = elm?.incorrect_answers.map(
    (item, index) => `<div>
      <input type="radio" onclick="onCheckedBtn()"  name="answer" value="${item}" />
      <label for="vehicle3" id = "answer_false_${index}" >${item}</label>
    </div>`
  );
  bodyData.splice(
    Math.floor(Math.random() * (datas.length + 1)),
    0,
    `<div>
      <input type="radio" onclick="onCheckedBtn()" name="answer" value="${elm?.correct_answer}" />
      <label for="vehicle3" id="answer_true">${elm?.correct_answer}</label>
    </div>`
  );
  document.getElementById("body").innerHTML = `<h1>${elm?.question}</h1>
  ${bodyData.join("")}
  `;
};

const onLoad = () => {
  document.getElementById("validate").style.visibility = "hidden";
  document.getElementById("end").style.visibility = "hidden";
  fetch(
    "https://opentdb.com/api.php?amount=4&category=17&difficulty=medium&type=multiple"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      datas = myJson?.results;
      onChangeStat(1, datas?.length);
      onChargeCurrent(datas[curr]);
      countDown(timeInSecond);
    });
};

// Execute next button
const onNext = () => {
  if (datas?.length == curr + 2) {
    document.getElementById("next").style.visibility = "hidden";
  }
  if (datas?.length == curr + 1) {
    document.getElementById("next").style.visibility = "hidden";
    document.getElementById("end").style.visibility = "visible";
    return;
  }

  curr++;
  onChargeCurrent(datas[curr]);
  onChangeStat(curr + 1, datas?.length);
  clearTimeout(clrTimeout);
  document.getElementById("validate").style.visibility = "hidden";
  countDown(timeInSecond);
};

// validate the choice
const onValidate = () => {
  const isCorrect =
    document.querySelector('input[name="answer"]:checked')?.value ==
    datas[curr]?.correct_answer;
  if (curr == datas.length)
    document.getElementById("next").style.visibility = "visible";
  if (curr == datas.length - 1) {
    document.getElementById("end").style.visibility = "visible";
    document.getElementById("timePassed").style.visibility = "hidden";
  }
  document.getElementById("validate").style.visibility = "hidden";

  if (isCorrect) {
    document.getElementById("answer_true").setAttribute("class", "answer_true");
    correct++;
  } else {
    for (const [i, value] of datas[curr]?.incorrect_answers.entries()) {
      if (
        document.querySelector('input[name="answer"]:checked')?.value == value
      ) {
        document
          .getElementById("answer_false_" + i)
          .setAttribute("class", "answer_false");

        document
          .getElementById("answer_true")
          .setAttribute("class", "answer_true");
        wrong++;
        break;
      }
    }
  }
  // disable all input after clicking on validate
  for (const v of document.getElementsByTagName("input")) v.disabled = true;
};

// check btn
const onCheckedBtn = () => {
  if (curr == datas.length)
    document.getElementById("next").style.visibility = "hidden";
  document.getElementById("validate").style.visibility = "visible";
};

const onEnd = () => {
  clearTimeout(clrTimeout);
  document.getElementById("body").innerHTML = `
  <label>Right answer : ${correct} </label>
  <br/>
  <label>Wrong answer : ${wrong} </label>
  `;
  document.getElementById("end").style.visibility = "hidden";
};
// INIT
onLoad();
