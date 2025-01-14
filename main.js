//Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bulletsSpans = document.querySelectorAll(".spans span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContaine = document.querySelector(".results");
let countDownElement = document.querySelector(".count-down");
let buttons = document.querySelectorAll(".category button");
let htmlButton = document.querySelector(".html-button");
let cssButton = document.querySelector(".css-button");
let jsButton = document.querySelector(".js-button");
//Set Option
let currentIndex = 0;
let rightAnswers = 0;
let countDownIntrval;
let shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};
let arrayOfNumbers = [1, 2, 3, 4];

function getQuestions(jeson) {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let qCount = questionObject.length;

      // Create Bullets + Set Questions count
      createBullets(qCount);

      // Add Data
      addQuestionData(questionObject[currentIndex], qCount);

      //   Start Count Down
      countDown(10, qCount);
      //Click On Submit
      submitButton.onclick = () => {
        clearInterval(countDownIntrval);
        countDown(10, qCount);
        // Get Right Answer
        let theRightAnswer;
        if (currentIndex < qCount) {
          theRightAnswer = questionObject[currentIndex]["right_answer"];
        }

        // Increease Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // Romve Previous Questio
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Data Agin
        addQuestionData(questionObject[currentIndex], qCount);

        // Handle Bullers Class
        handleBullets();

        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", jeson, true);
  myRequest.send();
}
htmlButton.addEventListener("click", () => {
  changeCategory();

  htmlButton.classList.add("slected");
  getQuestions("html.question.json");
});
cssButton.addEventListener("click", () => {
  changeCategory();
  getQuestions("css.question.json");
  cssButton.classList.add("slected");
});
jsButton.addEventListener("click", () => {
  changeCategory();
  getQuestions("js.question.json");
  jsButton.classList.add("slected");
});

function changeCategory() {
  buttons.forEach((e) => {
    if (e.classList.contains("slected")) {
      quizArea.innerHTML = "";
      answersArea.innerHTML = "";
      bulletsSpanContainer.innerHTML = "";
      clearInterval(countDownIntrval);
      e.classList.remove("slected");
    }
  });
}

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    //create Bullet
    let bullets = document.createElement("span");

    // Check If This First Span
    if (i === 0) {
      bullets.className = "on";
    }

    //Append Bullets To Main Bullets Container
    bulletsSpanContainer.appendChild(bullets);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 For Questions Title
    let questionTitle = document.createElement("h2");

    // Create Questions text
    let questionText = document.createTextNode(obj.title);

    //Append Text To Title
    questionTitle.append(questionText);

    //Append Title To Quiz Area
    quizArea.appendChild(questionTitle);

    // Add Random Numbers
    let randomNumbers = shuffleArray(arrayOfNumbers);

    // Create The Answers
    for (let i = 0; i < randomNumbers.length; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      //Add Class To Main Dive
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Typr + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer-${randomNumbers[i]}`;
      radioInput.dataset.answer = obj[`answer_${randomNumbers[i]}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      //Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer-${randomNumbers[i]}`;

      //Create label Text
      let labelText = document.createTextNode(
        obj[`answer_${randomNumbers[i]}`]
      );

      // Add The Text To label
      theLabel.appendChild(labelText);

      // Add Ibput + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Add All Main Div To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rightAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span> ${rightAnswers} From ${count} IS Good `;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span> All Answers Is True `;
    } else {
      theResults = `<span class="bad">Bad</span> ${rightAnswers} From ${count} IS Bad `;
    }
    resultsContaine.innerHTML = theResults;
    resultsContaine.style.padding = "10px";
    resultsContaine.style.backgroundColor = "white";
    resultsContaine.style.margin = "10px";
  }
}

function countDown(deuration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownIntrval = setInterval(() => {
      minutes = parseInt(deuration / 60);
      seconds = parseInt(deuration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;

      if (--deuration < 0) {
        clearInterval(countDownIntrval);
        submitButton.click();
      }
    }, 1000);
  }
}
