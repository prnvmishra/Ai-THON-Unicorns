// Fetch and display real-time Bitcoin price
async function getBitcoinPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    document.getElementById('btc-price').innerText = `$${data.bitcoin.usd}`;
}

setInterval(getBitcoinPrice, 60000); // Update every minute
getBitcoinPrice(); // Initial call

// Fetch and display recent Bitcoin news
async function getBitcoinNews() {
    const response = await fetch('https://newsapi.org/v2/everything?q=bitcoin&apiKey=ef50fec0e40945c0b755a35268ecbca2');
    const data = await response.json();
    const newsContainer = document.getElementById('news-container');

    data.articles.slice(0, 5).forEach(article => { // Limit to 5 headlines
        const newsItem = document.createElement('div');
        newsItem.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        newsContainer.appendChild(newsItem);
    });
}

getBitcoinNews();

// Fetch and visualize historical Bitcoin price trends
async function getHistoricalData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365');
    const data = await response.json();
    
    const ctx = document.getElementById('btc-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.prices.map(price => new Date(price[0]).toLocaleDateString()),
            datasets: [{
                label: 'Bitcoin Price (USD)',
                data: data.prices.map(price => price[1]),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }
            }
        }
    });
}

getHistoricalData();

// Bitcoin quiz
const quizData = [
    {
        question: "Who is the creator of Bitcoin?",
        choices: ["Elon Musk", "Satoshi Nakamoto", "Vitalik Buterin", "Charlie Lee"],
        correct: "Satoshi Nakamoto"
    },
    {
        question: "What is the maximum supply of Bitcoin?",
        choices: ["21 million", "50 million", "100 million", "Unlimited"],
        correct: "21 million"
    },
    {
        question: "Which year was Bitcoin created?",
        choices: ["2008", "2010", "2013", "2015"],
        correct: "2008"
    },
    {
        question: "What is the underlying technology of Bitcoin?",
        choices: ["Blockchain", "Artificial Intelligence", "Quantum Computing", "Cloud Computing"],
        correct: "Blockchain"
    },
    {
        question: "What is Bitcoin mining?",
        choices: ["Buying Bitcoin", "Creating new Bitcoins", "Verifying Bitcoin transactions", "Lending Bitcoins"],
        correct: "Verifying Bitcoin transactions"
    },
    {
        question: "Which of these US states introduced the BitLicense regulation for cryptocurrency companies?",
        choices: ["New York", "California", "Texas", "Washington"],
        correct: "New York"
    }
];

let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const currentQuestion = quizData[currentQuestionIndex];
    
    questionElement.innerText = currentQuestion.question;
    choicesElement.innerHTML = '';
    
    currentQuestion.choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.innerText = choice;
        choiceButton.onclick = () => checkAnswer(choice);
        choicesElement.appendChild(choiceButton);
    });
    
    document.getElementById('next-button').style.display = 'none';
}

function checkAnswer(answer) {
    const currentQuestion = quizData[currentQuestionIndex];
    const nextButton = document.getElementById('next-button');
    
    if (answer === currentQuestion.correct) {
        score++;
    }
    
    const buttons = document.querySelectorAll('#choices button');
    buttons.forEach(button => {
        if (button.innerText === currentQuestion.correct) {
            button.style.backgroundColor = '#28a745';  // Green for correct answer
        } else {
            button.style.backgroundColor = '#dc3545';  // Red for incorrect answers
        }
        button.disabled = true;
    });
    
    nextButton.style.display = 'block';
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results');
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    resultsContainer.innerHTML = `
        <h3>Your final score: ${score}/${quizData.length}</h3>
        <p>${getFeedback()}</p>
        <button onclick="shareResults()">Share your results</button>
    `;
}

function getFeedback() {
    if (score === quizData.length) {
        return "Excellent! You know your Bitcoin!";
    } else if (score >= quizData.length / 2) {
        return "Good job! You have a solid understanding of Bitcoin.";
    } else {
        return "You might want to learn more about Bitcoin.";
    }
}

function shareResults() {
    const shareText = `I scored ${score}/${quizData.length} on the Bitcoin Quiz! How well do you know Bitcoin?`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
}

loadQuestion();

document.getElementById('subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const email = document.getElementById('email').value;

    // Here you can add your email submission logic, e.g., sending it to your server

    // Show the popup modal with animation
    const modal = document.getElementById('popup-modal');
    const modalContent = document.querySelector('.modal-content');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
        modalContent.classList.add('show');
    }, 10);
});
// Close the modal with animation
document.querySelector('.close-button').addEventListener('click', function() {
    closeModal();
});

window.onclick = function(event) {
    if (event.target === document.getElementById('popup-modal')) {
        closeModal();
    }
};

function closeModal() {
    const modal = document.getElementById('popup-modal');
    const modalContent = document.querySelector('.modal-content');
    modal.classList.remove('show');
    modalContent.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500); // Match the transition duration
};

