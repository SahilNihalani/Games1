const cards = ["🐶",  "🐱",  "🐰",  "🦊",  "🐻", "🐼", "🦁", "🐨"];
const gameBoard = document.getElementById('game-board');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const restartButton = document.getElementById('restart-game');
const closePopupButton = document.getElementById('close-popup');
const timerDisplay = document.getElementById('timer');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const startGameButton = document.getElementById('start-game');
const timeInput = document.getElementById('time-input');
const startScreen = document.getElementById('start-screen');
let flippedCards = [];
let matchedPairs = 0;
let cardPairs = [...cards, ...cards];
let timeLeft;
let timerInterval;

const shuffleCards = () => {
    cardPairs.sort(() => Math.random() - 0.5);
};

const createCards = () => {
    gameBoard.innerHTML = '';
    cardPairs.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'relative', 'cursor-pointer', 'w-16', 'h-16', 'md:w-24', 'md:h-24');
        card.dataset.index = index;
        card.dataset.emoji = emoji;

        const front = document.createElement('div');
        front.classList.add('front', 'text-3xl', 'md:text-4xl');
        front.textContent = emoji;

        const back = document.createElement('div');
        back.classList.add('back', 'text-2xl', 'md:text-3xl');
        back.textContent = '❓';

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
};

const startTimer = () => {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
};

const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 10) {
        timerDisplay.classList.add('pulse');
    }
};

const endGame = (isWin) => {
    clearInterval(timerInterval);
    if (isWin) {
        popupTitle.textContent = '🎉You Won!🎉';
        popupMessage.textContent = 'Congratulations! You\'ve matched all the cards.';
    } else {
        popupTitle.textContent = '⏰Time\'s Up!⏰';
        popupMessage.textContent = 'You ran out of time. Better luck next time!';
    }
    timerDisplay.classList.remove('pulse');
    showPopup();
};

const initGame = () => {
    const userTime = parseInt(timeInput.value, 10);
    if (isNaN(userTime) || userTime < 1 || userTime > 3) {
        alert('Please enter a valid time between 1 and 3 minutes.');
        return;
    }

    shuffleCards();
    createCards();
    flippedCards = [];
    matchedPairs = 0;
    timeLeft = userTime * 60;
    updateTimerDisplay();
    startTimer();
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
    startScreen.classList.add('hidden');
};

function flipCard(event) {
    const selectedCard = event.target.closest('.card');
    if (flippedCards.length >= 2 || selectedCard.classList.contains('flipped') || selectedCard.classList.contains('matched')) return;

    selectedCard.classList.add('flipped');
    flippedCards.push(selectedCard);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === cards.length) {
            endGame(true);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function showPopup() {
    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

const flipAllCards = () => {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flipped');
    });
};

startGameButton.addEventListener('click', initGame);

restartButton.addEventListener('click', () => {
    startScreen.classList.remove('hidden');
    initGame();
});

closePopupButton.addEventListener('click', () => {
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
});