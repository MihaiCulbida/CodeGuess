const translations = {
    en: {
        title: "CodeGuess",
        mode3title: "3 numbers",
        mode4title: "4 numbers",
        mode5title: "5 numbers",
        mode6title: "6 numbers",
        attempts: "Attempts",
        maxattempts: "Max",
        entercode: "Number",
        howtoplay: "How to Play",
        rule1: "Guess the secret code with unique numbers.",
        rule2: "After each guess, the color shows how close you are:",
        correct: "Correct number, correct position",
        present: "Correct number, wrong position",
        absent: "Number not in code",
        close: "Close",
        playagain: "Play Again",
        won: "Victory!",
        lost: "Game Over",
        wondesc: "You guessed the code!",
        lostdesc: "The code was:",
        choosedifficulty: "Choose Difficulty",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        notes: "Notes",
        notesplaceholder: "Write..",
        attemptstext: "attempts",
        confirmback: "Are you sure?",
        confirmbacktext: "Do you want to exit the game?",
        yes: "Yes",
        no: "No",
        duplicate: "All numbers must be unique",
        invalidlength: "Enter {count} numbers",
        toomany: "Maximum {count} numbers allowed"
    },
    ru: {
        title: "CodeGuess",
        mode3title: "3 цифры",
        mode4title: "4 цифры",
        mode5title: "5 цифр",
        mode6title: "6 цифр",
        attempts: "Попытки",
        maxattempts: "Макс",
        entercode: "Номер",
        howtoplay: "Как играть",
        rule1: "Угадайте секретный код с уникальными цифрами.",
        rule2: "После каждой попытки цвет показывает насколько вы близки:",
        correct: "Правильная цифра, правильная позиция",
        present: "Правильная цифра, неправильная позиция",
        absent: "Цифры нет в коде",
        close: "Закрыть",
        playagain: "Играть снова",
        won: "Победа!",
        lost: "Игра окончена",
        wondesc: "Вы угадали код!",
        lostdesc: "Код был:",
        choosedifficulty: "Выберите сложность",
        easy: "Легко",
        medium: "Средне",
        hard: "Сложно",
        notes: "Заметки",
        notesplaceholder: "Напишите..",
        attemptstext: "попыток",
        confirmback: "Вы уверены?",
        confirmbacktext: "Хотите выйти из игры?",
        yes: "Да",
        no: "Нет",
        duplicate: "Все цифры должны быть уникальными",
        invalidlength: "Введите {count} цифр",
        toomany: "Максимум {count} цифр разрешено"
    },
    ro: {
        title: "CodeGuess",
        mode3title: "3 cifre",
        mode4title: "4 cifre",
        mode5title: "5 cifre",
        mode6title: "6 cifre",
        attempts: "Încercări",
        maxattempts: "Max",
        entercode: "Numărul",
        howtoplay: "Cum se joacă",
        rule1: "Ghicește codul secret cu cifre unice.",
        rule2: "După fiecare încercare, culoarea arată cât de aproape ești:",
        correct: "Cifră corectă, poziție corectă",
        present: "Cifră corectă, poziție greșită",
        absent: "Cifra nu există în cod",
        close: "Închide",
        playagain: "Joacă din nou",
        won: "Victorie!",
        lost: "Joc terminat",
        wondesc: "Ai ghicit codul!",
        lostdesc: "Codul era:",
        duplicate: "Toate cifrele trebuie să fie unice!",
        choosedifficulty: "Alege Dificultatea",
        easy: "Ușor",
        medium: "Mediu",
        hard: "Dificil",
        notes: "Notițe",
        notesplaceholder: "Scrie..",
        attemptstext: "încercări",
        confirmback: "Ești sigur?",
        confirmbacktext: "Vrei să ieși din joc?",
        yes: "Da",
        no: "Nu",
        duplicate: "Toate cifrele trebuie să fie unice",
        invalidlength: "Introdu {count} cifre",
        toomany: "Maxim {count} cifre permise"
    }
};

let guessHistory = [];
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let currentLang = 'en';
let secretCode = [];
let maxAttempts = 6;
let currentAttempts = 0;
let gameMode = 0;
let gameActive = false;
let selectedMode = 0;
let discoveredNumbers = new Set();
let allNumbersFound = new Set();

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = translations[lang][key];
    });
    
    if (selectedMode > 0) {
        updateDifficultyAttempts();
    }
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    
    setTimeout(() => {
        errorEl.classList.remove('show');
    }, 3000);
}
function generateCode(length) {
    const numbers = [0,1,2,3,4,5,6,7,8,9];
    const code = [];
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * numbers.length);
        code.push(numbers[idx]);
        numbers.splice(idx, 1);
    }
    return code;
}

function updateDifficultyAttempts() {
    const attemptsMap = {
        3: { easy: 6, medium: 4, hard: 3 },
        4: { easy: 6, medium: 5, hard: 4 },
        5: { easy: 8, medium: 6, hard: 4 },
        6: { easy: 10, medium: 8, hard: 6 }
    };
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        const difficulty = btn.getAttribute('data-difficulty');
        const attemptsDiv = btn.querySelector('.difficulty-attempts');
        attemptsDiv.textContent = `${attemptsMap[selectedMode][difficulty]} ${translations[currentLang].attemptstext}`;
    });
}

function updateDiscoveredNumbers() {
    const container = document.getElementById('discoveredNumbers');
    container.innerHTML = '';
    
    const correctNumbers = Array.from(discoveredNumbers);
    const presentNumbers = Array.from(allNumbersFound);
    const totalFound = correctNumbers.length + presentNumbers.length;
    
    correctNumbers.forEach((number) => {
        const cell = document.createElement('div');
        cell.className = 'discovered-cell found';
        cell.textContent = number;
        container.appendChild(cell);
    });
    
    presentNumbers.forEach((number) => {
        const cell = document.createElement('div');
        cell.className = 'discovered-cell present';
        cell.textContent = number;
        container.appendChild(cell);
    });
    
    for (let i = totalFound; i < gameMode; i++) {
        const cell = document.createElement('div');
        cell.className = 'discovered-cell empty';
        cell.textContent = '?';
        container.appendChild(cell);
    }
}

function startGame(mode, difficulty) {
    gameMode = parseInt(mode);
    guessHistory = [];
    const attemptsMap = {
        3: { easy: 6, medium: 4, hard: 3 },
        4: { easy: 6, medium: 5, hard: 4 },
        5: { easy: 8, medium: 6, hard: 4 },
        6: { easy: 10, medium: 8, hard: 6 }
    };
    
    maxAttempts = attemptsMap[mode][difficulty];
    
    secretCode = generateCode(gameMode);
    currentAttempts = 0;
    gameActive = true;
    discoveredNumbers = new Set();
    allNumbersFound = new Set();

    document.getElementById('difficultySelector').classList.remove('active');
    document.getElementById('gameArea').classList.add('active');
    document.getElementById('backBtn').classList.add('active');
    document.getElementById('historyBtn').classList.add('active');
    document.getElementById('keyboardBtn').classList.add('active');
    document.getElementById('codeInput').maxLength = gameMode;
    document.getElementById('attemptsValue').textContent = '0';
    document.getElementById('maxAttemptsValue').textContent = maxAttempts;
    document.getElementById('guessesContainer').innerHTML = '';
    document.getElementById('codeInput').value = '';
    
    updateDiscoveredNumbers();
    updateHistoryDisplay();
}

function checkGuess(guess) {
    const guessArr = guess.split('').map(Number);
    const feedback = [];

    guessArr.forEach((number, idx) => {
        if (number === secretCode[idx]) {
            feedback.push('correct');
            discoveredNumbers.add(number);
            allNumbersFound.delete(number);
        } else if (secretCode.includes(number)) {
            feedback.push('present');
            if (!discoveredNumbers.has(number)) {
                allNumbersFound.add(number);
            }
        } else {
            feedback.push('absent');
        }
    });

    return feedback;
}

function displayGuess(guess, feedback) {
    const row = document.createElement('div');
    row.className = 'guess-row';

    guess.split('').forEach((number, idx) => {
        const cell = document.createElement('div');
        cell.className = `guess-cell ${feedback[idx]}`;
        cell.textContent = number;
        row.appendChild(cell);
    });

    document.getElementById('guessesContainer').appendChild(row);
    
    guessHistory.push({ guess, feedback });
    if (document.getElementById('floatingHistory').classList.contains('active')) {
        updateHistoryDisplay();
    }
}

function endGame(won) {
    gameActive = false;
    const modal = document.getElementById('resultModal');
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');

    if (won) {
        const winImages = [
            'img/win1.png',
            'img/win2.png',
            'img/win3.png'
        ];
        const chosen = winImages[Math.floor(Math.random() * winImages.length)];
        icon.innerHTML = `<img src="${chosen}" alt="win" style="width:150px;height:150px;object-fit:contain;">`;
        title.textContent = translations[currentLang].won;
        text.textContent = translations[currentLang].wondesc;
        
        setTimeout(() => createConfetti(), 300);
    } else {
        const loseImage = 'img/lose.png';
        icon.innerHTML = `<img src="${loseImage}" alt="lose" style="width:150px;height:150px;object-fit:contain;">`;
        title.textContent = translations[currentLang].lost;
        text.textContent = `${translations[currentLang].lostdesc} ${secretCode.join('')}`;
    }

    modal.classList.add('active');
}

function createConfetti() {
    const modalContent = document.querySelector('#resultModal .modal-content');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.width = modalContent.offsetWidth;
    canvas.height = modalContent.offsetHeight;
    modalContent.appendChild(canvas);
    
    const jsConfetti = new JSConfetti({ canvas });
    
    jsConfetti.addConfetti({
        confettiColors: [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', 
            '#9b59b6', '#e74c3c', '#3498db', '#2ecc71', 
            '#f1c40f', '#e67e22'
        ],
        confettiRadius: 3,
        confettiNumber: 500,
    }).then(() => {
        setTimeout(() => {
            canvas.remove();
        }, 2000);
    });
}

function updateHistoryDisplay() {
    const content = document.getElementById('floatingContent');
    content.innerHTML = '';
    
    guessHistory.slice().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        item.guess.split('').forEach((num, idx) => {
            const cell = document.createElement('div');
            cell.className = 'history-number';
            cell.textContent = num;
            
            if (item.feedback[idx] === 'correct') {
                cell.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            } else if (item.feedback[idx] === 'present') {
                cell.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            } else {
                cell.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
            }
            
            historyItem.appendChild(cell);
        });
        
        content.appendChild(historyItem);
    });
}

function dragStart(e) {
    e.preventDefault(); 
    
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    isDragging = true;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, document.getElementById('floatingHistory'));
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedMode = parseInt(btn.getAttribute('data-mode'));
        document.getElementById('menuSelector').classList.remove('active');
        document.getElementById('difficultySelector').classList.add('active');
        updateDifficultyAttempts();
    });
});

document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const difficulty = btn.getAttribute('data-difficulty');
        startGame(selectedMode, difficulty);
    });
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const input = document.getElementById('codeInput');
    const guess = input.value;

    if (!gameActive) return;
    
    if (guess.length !== gameMode) {
        const message = translations[currentLang].invalidlength.replace('{count}', gameMode);
        showError(message);
        return;
    }

    const numbers = guess.split('');
    if (new Set(numbers).size !== numbers.length) {
        showError(translations[currentLang].duplicate);
        return;
    }

    const feedback = checkGuess(guess);
    displayGuess(guess, feedback);
    currentAttempts++;
    document.getElementById('attemptsValue').textContent = currentAttempts;
    
    updateDiscoveredNumbers();

    if (feedback.every(f => f === 'correct')) {
        endGame(true);
    } else if (currentAttempts >= maxAttempts) {
        endGame(false);
    }

    input.value = '';
});

document.getElementById('codeInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('submitBtn').click();
    }
});

document.getElementById('codeInput').addEventListener('input', (e) => {
    const oldValue = e.target.value.replace(/[^0-9]/g, '');
    
    if (oldValue.length > gameMode) {
        const message = translations[currentLang].toomany.replace('{count}', gameMode);
        showError(message);
        e.target.value = oldValue.slice(0, gameMode);
    } else {
        e.target.value = oldValue;
    }
});

document.getElementById('codeInput').addEventListener('keydown', (e) => {
    const input = e.target;
    if (input.value.length >= gameMode && 
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        const message = translations[currentLang].toomany.replace('{count}', gameMode);
        showError(message);
        e.preventDefault();
    }
});
document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('helpModal').classList.add('active');
});

document.getElementById('closeHelp').addEventListener('click', () => {
    document.getElementById('helpModal').classList.remove('active');
});

document.getElementById('closeNotes').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('floatingNotes').classList.remove('active');
    document.getElementById('notesBtn').querySelector('img').src = 'img/notes.png';
});

let notesXOffset = 0;
let notesYOffset = 0;
let notesCurrentX = 0;
let notesCurrentY = 0;

document.getElementById('notesBtn').addEventListener('click', () => {
    const floating = document.getElementById('floatingNotes');
    const notesBtn = document.getElementById('notesBtn');
    const notesImg = notesBtn.querySelector('img');
    
    if (floating.classList.contains('active')) {
        floating.classList.remove('active');
        notesImg.src = 'img/notes.png';
    } else {
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        
        const finalTop = containerRect.top + (containerRect.height / 2) - 150;
        const finalLeft = containerRect.left + (containerRect.width / 2) - 150;
        
        floating.style.top = finalTop + 'px';
        floating.style.left = finalLeft + 'px';
        floating.style.transform = 'translate3d(0px, 0px, 0)';
        
        notesXOffset = 0;
        notesYOffset = 0;
        notesCurrentX = 0;
        notesCurrentY = 0;
        
        floating.classList.add('active');
        notesImg.src = 'img/close.png';
    }
});

const notesHeader = document.getElementById('notesHeader');
let isDraggingNotes = false;
let notesInitialX;
let notesInitialY;

notesHeader.addEventListener("mousedown", (e) => {
    e.preventDefault();
    notesInitialX = e.clientX - notesXOffset;
    notesInitialY = e.clientY - notesYOffset;
    isDraggingNotes = true;
});

notesHeader.addEventListener("touchstart", (e) => {
    notesInitialX = e.touches[0].clientX - notesXOffset;
    notesInitialY = e.touches[0].clientY - notesYOffset;
    isDraggingNotes = true;
}, false);

document.addEventListener("mousemove", (e) => {
    if (isDraggingNotes) {
        e.preventDefault();
        notesCurrentX = e.clientX - notesInitialX;
        notesCurrentY = e.clientY - notesInitialY;
        notesXOffset = notesCurrentX;
        notesYOffset = notesCurrentY;
        document.getElementById('floatingNotes').style.transform = `translate3d(${notesCurrentX}px, ${notesCurrentY}px, 0)`;
    }
});

document.addEventListener(
    "touchmove",
    (e) => {
        if (isDraggingNotes) {
            e.preventDefault();
            notesCurrentX = e.touches[0].clientX - notesInitialX;
            notesCurrentY = e.touches[0].clientY - notesInitialY;
            notesXOffset = notesCurrentX;
            notesYOffset = notesCurrentY;
            document.getElementById('floatingNotes').style.transform =
                `translate3d(${notesCurrentX}px, ${notesCurrentY}px, 0)`;
        }
    },
    { passive: false } 
);


document.addEventListener("mouseup", () => {
    notesInitialX = notesCurrentX;
    notesInitialY = notesCurrentY;
    isDraggingNotes = false;
});

document.addEventListener("touchend", () => {
    notesInitialX = notesCurrentX;
    notesInitialY = notesCurrentY;
    isDraggingNotes = false;
}, false);

document.getElementById('playAgain').addEventListener('click', () => {
    document.getElementById('resultModal').classList.remove('active');
    document.getElementById('gameArea').classList.remove('active');
    document.getElementById('backBtn').classList.remove('active');
    document.getElementById('historyBtn').classList.remove('active');
    document.getElementById('keyboardBtn').classList.remove('active');
    document.getElementById('floatingKeyboard').classList.remove('active');
    document.getElementById('keyboardBtn').querySelector('img').src = 'img/keyboard.png';
    document.getElementById('floatingHistory').classList.remove('active');
    document.getElementById('historyBtn').querySelector('img').src = 'img/open.png'; 
    document.getElementById('floatingNotes').classList.remove('active');
    document.getElementById('notesBtn').querySelector('img').src = 'img/notes.png';
    document.getElementById('menuSelector').classList.add('active');
    guessHistory = [];
    updateHistoryDisplay();
});

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('confirmBackModal').classList.add('active');
});

document.getElementById('confirmBackYes').addEventListener('click', () => {
    document.getElementById('confirmBackModal').classList.remove('active');
    document.getElementById('gameArea').classList.remove('active');
    document.getElementById('difficultySelector').classList.remove('active');
    document.getElementById('backBtn').classList.remove('active');
    document.getElementById('historyBtn').classList.remove('active');
    document.getElementById('keyboardBtn').classList.remove('active');
    document.getElementById('floatingKeyboard').classList.remove('active');
    document.getElementById('keyboardBtn').querySelector('img').src = 'img/keyboard.png';
    document.getElementById('floatingHistory').classList.remove('active');
    document.getElementById('historyBtn').querySelector('img').src = 'img/open.png'; 
    document.getElementById('floatingNotes').classList.remove('active');
    document.getElementById('notesBtn').querySelector('img').src = 'img/notes.png';
    document.getElementById('menuSelector').classList.add('active');
    gameActive = false;
    guessHistory = [];
    updateHistoryDisplay();
});


document.getElementById('confirmBackNo').addEventListener('click', () => {
    document.getElementById('confirmBackModal').classList.remove('active');
});
document.getElementById('langBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('langMenu').classList.toggle('active');
});

document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang');
        setLanguage(lang);
        document.getElementById('langMenu').classList.remove('active');
        
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
    });
});

document.addEventListener('click', (e) => {
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
        langMenu.classList.remove('active');
    }
});

document.getElementById('historyBtn').addEventListener('click', () => {
    const floating = document.getElementById('floatingHistory');
    const historyBtn = document.getElementById('historyBtn');
    const historyImg = historyBtn.querySelector('img');
    
    if (floating.classList.contains('active')) {
        floating.classList.remove('active');
        historyImg.src = 'img/open.png';
    } else {
        updateHistoryDisplay();
        
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        
        const finalTop = containerRect.top - floating.offsetHeight - 10;
        const finalLeft = containerRect.left + containerRect.width / 2 - 100;
        
        floating.style.top = finalTop + 'px';
        floating.style.left = finalLeft + 'px';
        floating.style.right = 'auto';
        floating.style.transform = 'translate3d(0px, 0px, 0)';
        
        xOffset = 0;
        yOffset = 0;
        currentX = 0;
        currentY = 0;
        
        floating.classList.add('active');
        historyImg.src = 'img/close.png';
    }
});

const floatingHistory = document.getElementById('floatingHistory');
floatingHistory.addEventListener("touchstart",dragStart,{ passive: false });
floatingHistory.addEventListener("touchend", dragEnd, false);
floatingHistory.addEventListener("touchmove",drag,{ passive: false });
floatingHistory.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

setLanguage('en');

let keyboardXOffset = 0;
let keyboardYOffset = 0;
let keyboardCurrentX = 0;
let keyboardCurrentY = 0;
let isDraggingKeyboard = false;
let keyboardInitialX;
let keyboardInitialY;

document.getElementById('keyboardBtn').addEventListener('click', () => {
    const floating = document.getElementById('floatingKeyboard');
    const keyboardBtn = document.getElementById('keyboardBtn');
    const keyboardImg = keyboardBtn.querySelector('img');
    
    if (floating.classList.contains('active')) {
        floating.classList.remove('active');
        keyboardImg.src = 'img/keyboard.png';
    } else {
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        
        const finalTop = containerRect.top - floating.offsetHeight - 10;
        const finalLeft = containerRect.left + containerRect.width / 2 - 100;
        
        floating.style.top = finalTop + 'px';
        floating.style.left = finalLeft + 'px';
        floating.style.transform = 'translate3d(0px, 0px, 0)';
        
        keyboardXOffset = 0;
        keyboardYOffset = 0;
        keyboardCurrentX = 0;
        keyboardCurrentY = 0;
        
        floating.classList.add('active');
        keyboardImg.src = 'img/close.png';
    }
});
    
const keyboardHeader = document.getElementById('keyboardHeader');

keyboardHeader.addEventListener("mousedown", (e) => {
    e.preventDefault();
    keyboardInitialX = e.clientX - keyboardXOffset;
    keyboardInitialY = e.clientY - keyboardYOffset;
    isDraggingKeyboard = true;
});

keyboardHeader.addEventListener("touchstart", (e) => {
    keyboardInitialX = e.touches[0].clientX - keyboardXOffset;
    keyboardInitialY = e.touches[0].clientY - keyboardYOffset;
    isDraggingKeyboard = true;
}, false);

document.addEventListener("mousemove", (e) => {
    if (isDraggingKeyboard) {
        e.preventDefault();
        keyboardCurrentX = e.clientX - keyboardInitialX;
        keyboardCurrentY = e.clientY - keyboardInitialY;
        keyboardXOffset = keyboardCurrentX;
        keyboardYOffset = keyboardCurrentY;
        document.getElementById('floatingKeyboard').style.transform = `translate3d(${keyboardCurrentX}px, ${keyboardCurrentY}px, 0)`;
    }
});

document.addEventListener("touchmove", (e) => {
    if (isDraggingKeyboard) {
        e.preventDefault();
        keyboardCurrentX = e.touches[0].clientX - keyboardInitialX;
        keyboardCurrentY = e.touches[0].clientY - keyboardInitialY;
        keyboardXOffset = keyboardCurrentX;
        keyboardYOffset = keyboardCurrentY;
        document.getElementById('floatingKeyboard').style.transform = `translate3d(${keyboardCurrentX}px, ${keyboardCurrentY}px, 0)`;
    }
}, { passive: false });

document.addEventListener("mouseup", () => {
    if (isDraggingKeyboard) {
        keyboardInitialX = keyboardCurrentX;
        keyboardInitialY = keyboardCurrentY;
        isDraggingKeyboard = false;
    }
});

document.addEventListener("touchend", () => {
    if (isDraggingKeyboard) {
        keyboardInitialX = keyboardCurrentX;
        keyboardInitialY = keyboardCurrentY;
        isDraggingKeyboard = false;
    }
}, false);

document.querySelectorAll('.keyboard-key:not(.keyboard-backspace)').forEach(key => {
    key.addEventListener('click', () => {
        const input = document.getElementById('codeInput');
        const text = key.textContent.trim();
        
        if (text) {
            if (input.value.length >= gameMode) {
                const message = translations[currentLang].toomany.replace('{count}', gameMode);
                showError(message);
                return;
            }
            input.value += text;
        }
    });
});

let backspaceInterval;

const startBackspace = (e) => {
    e.preventDefault();
    const input = document.getElementById('codeInput');
    if (input.value.length > 0) {
        input.value = input.value.slice(0, -1);
    }
    backspaceInterval = setInterval(() => {
        const input = document.getElementById('codeInput');
        if (input.value.length > 0) {
            input.value = input.value.slice(0, -1);
        } else {
            clearInterval(backspaceInterval);
        }
    }, 100);
};

const stopBackspace = () => {
    if (backspaceInterval) {
        clearInterval(backspaceInterval);
        backspaceInterval = null;
    }
};

const backspaceBtn = document.getElementById('keyboardBackspace');
backspaceBtn.addEventListener('mousedown', startBackspace);
backspaceBtn.addEventListener('mouseup', stopBackspace);
backspaceBtn.addEventListener('mouseleave', stopBackspace);
backspaceBtn.addEventListener('touchstart', startBackspace);
backspaceBtn.addEventListener('touchend', stopBackspace);
backspaceBtn.addEventListener('touchcancel', stopBackspace);