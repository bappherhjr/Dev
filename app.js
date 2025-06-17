localStorage.getItem('dark')
let allQuestions = [], index = 0, score = 0, time = 600, interval = null;
let questions = [];

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const timerEl = document.getElementById("timer");
const counterEl = document.getElementById("counter");
const resultEl = document.getElementById("result");
const progressBar = document.getElementById("progressBar");
const restartBtn = document.getElementById("restartBtn");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function toggleDark() {
  let darkMode = document.body.classList.toggle("dark");
  localStorage.setItem('dark', darkMode)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  shuffle(allQuestions);
  questions = allQuestions.slice(0, 40); // Load first 20 random questions
  index = 0;
  score = 0;
  time = 600;
  resultEl.innerHTML = "";
  restartBtn.style.display = "none";
  timerEl.textContent = `Time: ${time}s`;
  interval = setInterval(() => {
    time--;
    timerEl.textContent = `Time: ${time}s`;
    if (time <= 0) endQuiz();
  }, 1000);
  showQuestion();
}

function showQuestion() {
  const q = questions[index];
  questionEl.textContent = q.question;
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";
  shuffle(q.choices);
  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(btn, q.answer);
    answersEl.appendChild(btn);
  });
  counterEl.textContent = `Q: ${index + 1}/${questions.length}`;
  progressBar.style.width = `${(index / questions.length) * 100}%`;
}

function checkAnswer(btn, correct) {
  const buttons = document.querySelectorAll(".answers button");
  buttons.forEach(b => b.disabled = true);

  if (btn.textContent === correct) {
    btn.classList.add("correct");
    score++;
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
  } else {
    btn.classList.add("wrong");
    feedbackEl.textContent = `Wrong! Answer: ${correct}`;
    feedbackEl.style.color = "red";
    time -= 5;
    if (time < 0) time = 0;
  }

  index++;
  setTimeout(() => {
    if (index < questions.length) showQuestion();
    else endQuiz();
  }, 1000);
}

function endQuiz() {
  clearInterval(interval);
  questionEl.textContent = "";
  answersEl.innerHTML = "";
  feedbackEl.textContent = "";
  const percent = Math.round((score / questions.length) * 100);
  resultEl.innerHTML = `You scored <strong>${score}/${questions.length}</strong> (${percent}%)<br>` +
    (percent >= 80 ? "Excellent!" : percent >= 50 ? "Good job!" : "Try again!");
  progressBar.style.width = "100%";
  restartBtn.style.display = "block";
}

function restartQuiz() {
  clearInterval(interval);
  startQuiz();
}

async function loadQuestions() {
  try {
    const res = await fetch("jamb.json");
    allQuestions = await res.json();
    startQuiz();
  } catch (e) {
    questionEl.textContent = "Sorry, Failed to load questions.";
  }
}
// function toggleDark() {
//   localStorage.setItem('dark', )
// }
loadQuestions();
