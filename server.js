require("dotenv").config();

const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 8080;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  family: 4,
  serverSelectionTimeoutMS: 15000
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

app.use(express.json());

// Serve frontend (from root or static resources folder)
app.use(express.static(__dirname));
app.use(
  express.static(
    path.join(__dirname, "src", "main", "resources", "static")
  )
);

// Quiz questions
const questions = [
  {
    id: 1,
    questionText: "Which HTML tag is used to create a hyperlink?",
    optionA: "<link>",
    optionB: "<a>",
    optionC: "<href>",
    optionD: "<url>",
    correctAnswer: "B"
  },
  {
    id: 2,
    questionText: "Which CSS property is used to change text color?",
    optionA: "font-color",
    optionB: "text-color",
    optionC: "color",
    optionD: "background-color",
    correctAnswer: "C"
  },
  {
    id: 3,
    questionText: "Which keyword is used to create a class in Java?",
    optionA: "class",
    optionB: "Class",
    optionC: "object",
    optionD: "new",
    correctAnswer: "A"
  },
  {
    id: 4,
    questionText: "Which method is the starting point of a Java program?",
    optionA: "start()",
    optionB: "main()",
    optionC: "run()",
    optionD: "execute()",
    correctAnswer: "B"
  },
  {
    id: 5,
    questionText: "Which language is used to make web pages interactive?",
    optionA: "HTML",
    optionB: "CSS",
    optionC: "JavaScript",
    optionD: "SQL",
    correctAnswer: "C"
  },
  {
    id: 6,
    questionText: "Which JavaScript keyword declares a block-scoped variable?",
    optionA: "var",
    optionB: "let",
    optionC: "define",
    optionD: "dim",
    correctAnswer: "B"
  },
  {
    id: 7,
    questionText: "Which HTTP status code means Not Found?",
    optionA: "200",
    optionB: "301",
    optionC: "404",
    optionD: "500",
    correctAnswer: "C"
  },
  {
    id: 8,
    questionText: "Which Git command downloads changes from a remote repository?",
    optionA: "git push",
    optionB: "git commit",
    optionC: "git merge",
    optionD: "git pull",
    correctAnswer: "D"
  },
  {
    id: 9,
    questionText: "Which data structure follows the first-in, first-out rule?",
    optionA: "Queue",
    optionB: "Stack",
    optionC: "Tree",
    optionD: "Graph",
    correctAnswer: "A"
  },
  {
    id: 10,
    questionText: "Which symbol starts a single-line comment in JavaScript?",
    optionA: "<!--",
    optionB: "#",
    optionC: "//",
    optionD: "/*",
    correctAnswer: "C"
  }
];

// Send questions to frontend
app.get("/api/quiz/questions", (req, res) => {
  res.json(questions);
});

// Check submitted answer
app.post("/api/quiz/answer", (req, res) => {
  const { questionId, answer } = req.body;

  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({
      correct: false,
      message: "Question not found"
    });
  }

  const correct = question.correctAnswer === answer;

  res.json({
    correct: correct,
    message: correct ? "Correct answer!" : "Incorrect answer."
  });
});

// Connect MongoDB and start server
async function main() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("✅ Local MongoDB connected successfully!");

    const db = client.db("quizmaster");

    console.log("Database connected:", db.databaseName);
  } catch (error) {
    console.warn("⚠️ MongoDB connection notice:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Quiz Master is running at http://localhost:${PORT}`);
  });
}

main();