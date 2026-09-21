const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const errorMessage = document.getElementById("error-message");
const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const restartButton = document.getElementById("restart-button");
const homeButton = document.getElementById("home-button");
const questionText = document.getElementById("question-text");
const questionKicker = document.getElementById("question-kicker");
const questionNumber = document.getElementById("question-number");
const questionTotal = document.getElementById("question-total");
const options = document.getElementById("options");
const feedback = document.getElementById("feedback");
const timer = document.getElementById("timer");
const timerCard = document.getElementById("timer-card");
const streakNumber = document.getElementById("streak-number");
const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const scoreValue = document.getElementById("score-value");
const percentageValue = document.getElementById("percentage-value");
const statGrid = document.getElementById("stat-grid");
const summaryList = document.getElementById("summary-list");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let timeLeft = 15;
let timerId;
let answers = [];
const apiBaseUrl = window.location.protocol === "file:" ? "http://localhost:8080" : "";

function showScreen(screen) {
    [homeScreen, quizScreen, resultScreen].forEach(item => item.classList.add("hidden"));
    screen.classList.remove("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function clearError() {
    errorMessage.classList.add("hidden");
}

function resetTimer() {
    clearInterval(timerId);
    timeLeft = 15;
    timer.textContent = timeLeft;
    timerCard.classList.remove("warning");
    timerId = setInterval(() => {
        timeLeft -= 1;
        timer.textContent = timeLeft;
        timerCard.classList.toggle("warning", timeLeft <= 5);

        if (timeLeft === 0) {
            clearInterval(timerId);
            submitAnswer(null, true);
        }
    }, 1000);
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    const questionPosition = currentQuestionIndex + 1;

    questionNumber.textContent = `QUESTION ${questionPosition}`;
    questionTotal.textContent = `/ ${questions.length}`;
    questionKicker.textContent = `QUESTION ${String(questionPosition).padStart(2, "0")}`;
    questionText.textContent = question.questionText;
    progressText.textContent = `Question ${questionPosition} of ${questions.length}`;
    progressPercent.textContent = `${Math.round((questionPosition / questions.length) * 100)}%`;
    progressBar.style.width = `${(questionPosition / questions.length) * 100}%`;
    streakNumber.textContent = String(streak).padStart(2, "0");
    feedback.textContent = "";
    submitButton.disabled = true;
    options.innerHTML = "";

    ["A", "B", "C", "D"].forEach(letter => {
        const option = document.createElement("button");
        option.className = "option";
        option.type = "button";
        option.dataset.answer = letter;
        const optionLetter = document.createElement("span");
        const optionText = document.createElement("span");
        optionLetter.className = "option-letter";
        optionLetter.textContent = letter;
        optionText.textContent = question[`option${letter}`];
        option.append(optionLetter, optionText);
        option.addEventListener("click", () => {
            options.querySelectorAll(".option").forEach(item => item.classList.remove("selected"));
            option.classList.add("selected");
            submitButton.disabled = false;
        });
        options.appendChild(option);
    });

    resetTimer();
}

async function startQuiz() {
    clearError();
    startButton.disabled = true;

    try {
        const response = await fetch(`${apiBaseUrl}/api/quiz/questions`);
        if (!response.ok) {
            throw new Error("Unable to load quiz questions.");
        }

        questions = await response.json();
        if (!questions.length) {
            throw new Error("No quiz questions are available.");
        }

        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        answers = [];
        showScreen(quizScreen);
        renderQuestion();
    } catch (error) {
        showError(error.message);
    } finally {
        startButton.disabled = false;
    }
}

async function submitAnswer(answer, timedOut = false) {
    clearInterval(timerId);
    submitButton.disabled = true;
    options.querySelectorAll(".option").forEach(option => option.disabled = true);

    const question = questions[currentQuestionIndex];
    let correct = false;

    if (!timedOut && answer) {
        try {
            const response = await fetch(`${apiBaseUrl}/api/quiz/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId: question.id, answer })
            });
            if (!response.ok) {
                throw new Error("Unable to check this answer.");
            }
            correct = (await response.json()).correct;
        } catch (error) {
            showError(error.message);
            submitButton.disabled = false;
            return;
        }
    }

    if (correct) {
        score += 1;
        streak += 1;
    } else {
        streak = 0;
    }

    answers.push({ question, selected: answer, correct, timedOut });
    feedback.textContent = timedOut ? "Time's up." : correct ? "Correct answer!" : "Incorrect answer.";

    setTimeout(() => {
        currentQuestionIndex += 1;
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            renderResults();
        }
    }, 500);
}

function renderResults() {
    clearInterval(timerId);
    const percentage = Math.round((score / questions.length) * 100);
    const unanswered = answers.filter(item => item.timedOut).length;
    const incorrect = answers.filter(item => !item.timedOut && !item.correct).length;
    scoreValue.textContent = `${score} / ${questions.length}`;
    percentageValue.textContent = `${percentage}%`;
    statGrid.innerHTML = `<div class="result-stat correct"><strong>${score}</strong><span>CORRECT</span></div><div class="result-stat incorrect"><strong>${incorrect}</strong><span>INCORRECT</span></div><div class="result-stat unanswered"><strong>${unanswered}</strong><span>UNANSWERED</span></div><div class="result-stat"><strong>${percentage}%</strong><span>ACCURACY</span></div>`;
    summaryList.innerHTML = answers.map((item, index) => {
        const status = item.timedOut ? "unanswered" : item.correct ? "correct" : "incorrect";
        const statusLabel = item.timedOut ? "UNANSWERED" : item.correct ? "CORRECT" : "INCORRECT";
        const selectedAnswer = item.selected ? item.question[`option${item.selected}`] : "No answer selected";
        const correctAnswer = item.question[`option${item.question.correctAnswer}`];
        const correctAnswerRow = item.correct ? "" : `<span class="summary-correct-answer">Correct answer: <strong>${correctAnswer}</strong></span>`;

        return `<div class="summary-item ${status}"><span class="summary-number">${String(index + 1).padStart(2, "0")}</span><div class="summary-content"><p>${item.question.questionText}</p><span class="summary-answer">Your answer: <strong>${selectedAnswer}</strong></span>${correctAnswerRow}</div><strong class="summary-status">${statusLabel}</strong></div>`;
    }).join("");
    showScreen(resultScreen);
}

startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", () => {
    const selected = options.querySelector(".selected");
    submitAnswer(selected ? selected.dataset.answer : null);
});
restartButton.addEventListener("click", startQuiz);
homeButton.addEventListener("click", () => {
    clearInterval(timerId);
    clearError();
    showScreen(homeScreen);
});
