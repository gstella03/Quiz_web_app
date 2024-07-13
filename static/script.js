let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let wrongAnswers = [];

// Funzione per mischiare un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Funzione per mostrare i messaggi di errore
function showError(message) {
    const flashMessagesDiv = document.getElementById('flash-messages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'flash-message error';
    errorDiv.innerText = message;
    flashMessagesDiv.appendChild(errorDiv);

    logMessage(message, 'error');
}

// Funzione per loggare i messaggi
function logMessage(message, level) {
    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message, level: level })
    })
    .catch(error => {
        console.error('Error logging message:', error);
    });
}

function startQuiz() {
    const filename = document.getElementById('s_quiz').value;
    const numQuestions = parseInt(document.getElementById('n_question').value);

    if (filename === 'Null') {
        showError('Please select a quiz.');
        return;
    }

    if (isNaN(numQuestions) || numQuestions <= 0) {
        showError('Please enter a valid number of questions.');
        return;
    }

    fetch(`/quiz?filename=${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load quiz data.');
            }
            return response.json();
        })
        .then(data => {
            shuffle(data); 
            questions = data.slice(0, numQuestions); 
            totalQuestions = questions.length;
            renderQuestion();
            logMessage('Quiz started successfully.', 'info');
        })
        .catch(error => {
            showError(error.message);
        });

    document.getElementById('form').style.display = 'none';
}

function renderQuestion() {
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = '';

    const q = questions[currentQuestionIndex];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<p>${q.question}</p>`;

    const optionsList = document.createElement('ul');
    optionsList.className = 'options';

    q.options.forEach(option => {
        const optionItem = document.createElement('li');
        optionItem.innerHTML = `<input type="radio" name="question" value="${option}"> ${option}`;
        optionsList.appendChild(optionItem);
    });

    questionDiv.appendChild(optionsList);
    quizDiv.appendChild(questionDiv);

    document.getElementById('nextButton').style.display = 'none';
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (selectedOption) {
        const selectedAnswer = selectedOption.value;
        const correctAnswer = questions[currentQuestionIndex].answer;
        if (selectedAnswer === correctAnswer) {
            score++;
        } else {
            wrongAnswers.push({
                question: questions[currentQuestionIndex].question,
                selectedAnswer: selectedAnswer,
                correctAnswer: correctAnswer
            });
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            showResult();
        }
    } else {
        showError('Please select an option');
    }
}

function showResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `You scored ${score} out of ${totalQuestions}`;
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    showReview();
    logMessage('Quiz completed successfully.', 'info');
}

function showReview() {
    const reviewDiv = document.getElementById('review');
    reviewDiv.innerHTML = '<h2>Review Incorrect Answers</h2>';
    
    wrongAnswers.forEach(item => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p><strong>Question:</strong> ${item.question}</p>
            <p><strong>Your answer:</strong> <span class="incorrect">${item.selectedAnswer}</span></p>
            <p><strong>Correct answer:</strong> <span class="correct">${item.correctAnswer}</span></p>
        `;
        reviewDiv.appendChild(questionDiv);
    });
    
    reviewDiv.style.display = 'block';
}

document.addEventListener('change', function (e) {
    if (e.target.name === 'question') {
        document.getElementById('nextButton').style.display = 'block';
    }
});
