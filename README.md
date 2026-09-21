# Quiz Master

A colorful timed quiz application built with HTML5, CSS3, Vanilla JavaScript, and a Node.js backend. The backend uses the local MongoDB database `quizmaster` at `mongodb://127.0.0.1:27017/quizmaster`.

## Run in VS Code

1. Install Node.js 18 or newer.
2. Install MongoDB Community Server and start the local MongoDB service on port 27017.
3. Open this folder in VS Code.
4. Run `node server.js` or `npm start` in the integrated terminal.
5. Open http://localhost:8080 in a browser.
5. Test a correct answer, an incorrect answer, and a timeout before completing the quiz.
6. Use the result screen to verify score, percentage, counts, and every question summary.

## Viva Notes

- `server.js` is the Node.js backend. It stores the ten questions, serves the REST API, and serves the static frontend.
- `GET /api/quiz/questions` loads questions and `POST /api/quiz/answer` checks submitted answers.
- `script.js` calls `fetch('/api/quiz/questions')`, renders one question, and posts answers to `/api/quiz/answer`.
- A cleared `setInterval` counts down from 15 seconds for each question. At zero, the question is recorded as unanswered and the next one starts.
- Score is calculated from correct answers; incorrect answers and unanswered questions are counted separately, and percentage is rounded from `(correct / total) * 100`.
- The result view is created with DOM manipulation from the recorded answer summaries.
- Together, the Node.js question list, timer, single-question view, answer API, score state, and result view demonstrate all six assignment requirements.
