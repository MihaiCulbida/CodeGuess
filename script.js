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
        duplicate: "All numbers must be unique!",
        choosedifficulty: "Choose Difficulty",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        notes: "Notes",
        notesplaceholder: "Write your notes here...",
        attemptstext: "attempts"
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
        duplicate: "Все цифры должны быть уникальными!",
        choosedifficulty: "Выберите сложность",
        easy: "Легко",
        medium: "Средне",
        hard: "Сложно",
        notes: "Заметки",
        notesplaceholder: "Напишите свои заметки здесь...",
        attemptstext: "попыток"
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
        notesplaceholder: "Scrie notițele tale aici...",
        attemptstext: "încercări"
    }
};

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
    
    // Creăm un set cu toate cifrele găsite (oriunde în cod)
    const foundNumbers = new Set([...discoveredNumbers, ...allNumbersFound]);
    
    // Afișăm doar cifrele descoperite, fără să arătăm pozițiile lor
    foundNumbers.forEach((number) => {
        const cell = document.createElement('div');
        cell.className = 'discovered-cell';
        cell.textContent = number;
        
        if (discoveredNumbers.has(number)) {
            cell.classList.add('found');
        } else {
            cell.classList.add('present');
        }
        
        container.appendChild(cell);
    });
}

function startGame(mode, difficulty) {
    gameMode = parseInt(mode);
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
    document.getElementById('codeInput').maxLength = gameMode;
    document.getElementById('attemptsValue').textContent = '0';
    document.getElementById('maxAttemptsValue').textContent = maxAttempts;
    document.getElementById('guessesContainer').innerHTML = '';
    document.getElementById('codeInput').value = '';
    
    updateDiscoveredNumbers();
}

function checkGuess(guess) {
    const guessArr = guess.split('').map(Number);
    const feedback = [];

    guessArr.forEach((number, idx) => {
        if (number === secretCode[idx]) {
            feedback.push('correct');
            discoveredNumbers.add(number);
        } else if (secretCode.includes(number)) {
            feedback.push('present');
            allNumbersFound.add(number);
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
}

function endGame(won) {
    gameActive = false;
    const modal = document.getElementById('resultModal');
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');

    if (won) {
        icon.textContent = '🎉';
        title.textContent = translations[currentLang].won;
        text.textContent = translations[currentLang].wondesc;
    } else {
        icon.textContent = '😔';
        title.textContent = translations[currentLang].lost;
        text.textContent = `${translations[currentLang].lostdesc} ${secretCode.join('')}`;
    }

    modal.classList.add('active');
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

    if (!gameActive || guess.length !== gameMode) return;

    const numbers = guess.split('');
    if (new Set(numbers).size !== numbers.length) {
        alert(translations[currentLang].duplicate);
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
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('helpModal').classList.add('active');
});

document.getElementById('closeHelp').addEventListener('click', () => {
    document.getElementById('helpModal').classList.remove('active');
});

document.getElementById('notesBtn').addEventListener('click', () => {
    document.getElementById('notesModal').classList.add('active');
});

document.getElementById('closeNotesX').addEventListener('click', () => {
    document.getElementById('notesModal').classList.remove('active');
});

document.getElementById('playAgain').addEventListener('click', () => {
    document.getElementById('resultModal').classList.remove('active');
    document.getElementById('gameArea').classList.remove('active');
    document.getElementById('backBtn').classList.remove('active');
    document.getElementById('menuSelector').classList.add('active');
});

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('gameArea').classList.remove('active');
    document.getElementById('difficultySelector').classList.remove('active');
    document.getElementById('backBtn').classList.remove('active');
    document.getElementById('menuSelector').classList.add('active');
    gameActive = false;
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

setLanguage('en');