// Selecting DOM elements
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const finalScoreElement = document.getElementById('score');
const timerContainer = document.getElementById('timer-container');
const timerElement = document.getElementById('timer');
const progressContainer = document.getElementById('progress-container');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');

// Select form and inputs for user-generated questions
const questionForm = document.getElementById('question-form');
const userQuestion = document.getElementById('user-question');
const userAnswer1 = document.getElementById('user-answer1');
const userAnswer2 = document.getElementById('user-answer2');
const userAnswer3 = document.getElementById('user-answer3');
const userAnswer4 = document.getElementById('user-answer4');

// Request to Submit Elements
const requestSubmitButton = document.getElementById('request-submit-btn');
const questionFormContainer = document.getElementById('question-form-container');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timePerQuestion = 15; // Time in seconds for each question
let timer;

// Load existing questions from local storage (or an empty array if none exist)
let storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];

// Default quiz questions array
let defaultQuestions = [
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'Paris', correct: true },
      { text: 'London', correct: false },
      { text: 'Berlin', correct: false },
      { text: 'Madrid', correct: false }
    ]
  },
  {
    question: 'Who is the CEO of Tesla?',
    answers: [
      { text: 'Elon Musk', correct: true },
      { text: 'Jeff Bezos', correct: false },
      { text: 'Bill Gates', correct: false },
      { text: 'Tony Stark', correct: false }
    ]
  }
];

// Merge default questions with stored user-generated questions
let questions = defaultQuestions.concat(storedQuestions);

// Event listener to show the form when "Request to Submit" button is clicked
requestSubmitButton.addEventListener('click', () => {
  requestSubmitButton.classList.add('hide');  // Hide the request button
  questionFormContainer.classList.remove('hide');  // Show the form
});

// Event listener for form submission to add user-generated questions
questionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const questionText = userQuestion.value.trim();
    const answers = [
      { text: userAnswer1.value.trim(), correct: document.querySelector('input[name="correct-answer"]:checked').value === '1' },
      { text: userAnswer2.value.trim(), correct: document.querySelector('input[name="correct-answer"]:checked').value === '2' },
      { text: userAnswer3.value.trim(), correct: document.querySelector('input[name="correct-answer"]:checked').value === '3' },
      { text: userAnswer4.value.trim(), correct: document.querySelector('input[name="correct-answer"]:checked').value === '4' }
    ];

    // Add the new question to the local question array
    const newQuestion = {
      question: questionText,
      answers: answers
    };

    questions.push(newQuestion);

    // Save the updated questions array to localStorage
    storedQuestions.push(newQuestion);
    localStorage.setItem('questions', JSON.stringify(storedQuestions));

    // Clear the form
    questionForm.reset();

    alert('Question submitted successfully!');
});

// Start the Quiz
startButton.addEventListener('click', startQuiz);

// Move to Next Question
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});

// Restart the Quiz
restartButton.addEventListener('click', () => {
  scoreContainer.classList.add('hide');
  startButton.classList.remove('hide');
  resetQuiz();
});

// Function to Start the Quiz
function startQuiz() {
  startButton.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  totalQuestionsElement.innerText = shuffledQuestions.length;
  questionContainer.classList.remove('hide');
  timerContainer.classList.remove('hide');
  progressContainer.classList.remove('hide');
  setNextQuestion();
}

// Function to Set Next Question
function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
  updateProgress();
  startTimer();
}

// Function to Display Question and Answers
function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn', 'answer-btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Function to Reset the State for New Question
function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add('hide');
  clearInterval(timer);
  timerElement.innerText = timePerQuestion;
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Function to Handle Answer Selection
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  
  if (correct) {
    score++;
  }
  
  setStatusClass(selectedButton, correct);
  Array.from(answerButtonsElement.children).forEach(button => {
    button.disabled = true;
    setStatusClass(button, button.dataset.correct === 'true');
  });
  
  clearInterval(timer);
  
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    showScore();
  }
}

// Function to Start Timer for Each Question
function startTimer() {
  let timeLeft = timePerQuestion;
  timerElement.innerText = timeLeft;
  
  timer = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === 'true') {
          setStatusClass(button, true);
        }
      });
      
      if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
      } else {
        showScore();
      }
    }
  }, 1000);
}

// Function to Update Progress Display
function updateProgress() {
  currentQuestionElement.innerText = currentQuestionIndex + 1;
}

// Function to Show Final Score
function showScore() {
  questionContainer.classList.add('hide');
  timerContainer.classList.add('hide');
  progressContainer.classList.add('hide');
  scoreContainer.classList.remove('hide');
  finalScoreElement.innerText = '${score} / ${shuffledQuestions.length} correct';
  finalScoreElement.innerText = `${score} / ${shuffledQuestions.length} correct`;
}

// Function to Reset the Quiz
function resetQuiz() {
  resetState();
  scoreContainer.classList.add('hide');
  startButton.classList.remove('hide');
  questionContainer.classList.add('hide');
  timerContainer.classList.add('hide');
  progressContainer.classList.add('hide');
}

// Utility Functions to Set Status Classes
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}