      const translations = {
            en: {
                title: "NumGuess",
                mode3title: "3 numbers",
                mode3desc: "6 attempts",
                mode4title: "4 numbers",
                mode4desc: "10 attempts",
                mode5title: "5 numbers",
                mode5desc: "12 attempts",
                attempts: "Attempts",
                maxattempts: "Max",
                submit: "Submit",
                entercode: "Number",
                howtoplay: "How to Play",
                rule1: "Guess the secret code with unique digits.",
                rule2: "After each guess, the color shows how close you are:",
                correct: "Correct digit, correct position",
                present: "Correct digit, wrong position",
                absent: "Digit not in code",
                close: "Close",
                playagain: "Play Again",
                won: "Victory!",
                lost: "Game Over",
                wondesc: "You guessed the code!",
                lostdesc: "The code was:",
                duplicate: "All digits must be unique!"
            },
            ru: {
                title: "NumGuess",
                mode3title: "3 цифры",
                mode3desc: "6 попыток",
                mode4title: "4 цифры",
                mode4desc: "10 попыток",
                mode5title: "5 цифр",
                mode5desc: "12 попыток",
                attempts: "Попытки",
                maxattempts: "Макс",
                submit: "Проверить",
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
                duplicate: "Все цифры должны быть уникальными!"
            },
            ro: {
                title: "NumGuess",
                mode3title: "3 cifre",
                mode3desc: "6 încercări",
                mode4title: "4 cifre",
                mode4desc: "10 încercări",
                mode5title: "5 cifre",
                mode5desc: "12 încercări",
                attempts: "Încercări",
                maxattempts: "Max",
                submit: "Verifică",
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
                duplicate: "Toate cifrele trebuie să fie unice!"
            }
        };

        let currentLang = 'en';
        let secretCode = [];
        let maxAttempts = 6;
        let currentAttempts = 0;
        let gameMode = 0;
        let gameActive = false;

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
            document.querySelectorAll('.lang-option').forEach(opt => {
                opt.classList.remove('selected');
                if (opt.getAttribute('data-lang') === lang) {
                    opt.classList.add('selected');
                }
            });
        }

        function generateCode(length) {
            const digits = [0,1,2,3,4,5,6,7,8,9];
            const code = [];
            for (let i = 0; i < length; i++) {
                const idx = Math.floor(Math.random() * digits.length);
                code.push(digits[idx]);
                digits.splice(idx, 1);
            }
            return code;
        }

        function startGame(mode) {
            gameMode = parseInt(mode);
            maxAttempts = mode == 3 ? 6 : mode == 4 ? 10 : 12;
            secretCode = generateCode(gameMode);
            currentAttempts = 0;
            gameActive = true;

            document.getElementById('menuSelector').classList.remove('active');
            document.getElementById('gameArea').classList.add('active');
            document.getElementById('backBtn').classList.add('active');
            document.getElementById('codeInput').maxLength = gameMode;
            document.getElementById('attemptsValue').textContent = '0';
            document.getElementById('maxAttemptsValue').textContent = maxAttempts;
            document.getElementById('guessesContainer').innerHTML = '';
            document.getElementById('codeInput').value = '';
        }

        function checkGuess(guess) {
            const guessArr = guess.split('').map(Number);
            const feedback = [];

            guessArr.forEach((digit, idx) => {
                if (digit === secretCode[idx]) {
                    feedback.push('correct');
                } else if (secretCode.includes(digit)) {
                    feedback.push('present');
                } else {
                    feedback.push('absent');
                }
            });

            return feedback;
        }

        function displayGuess(guess, feedback) {
            const row = document.createElement('div');
            row.className = 'guess-row';

            guess.split('').forEach((digit, idx) => {
                const cell = document.createElement('div');
                cell.className = `guess-cell ${feedback[idx]}`;
                cell.textContent = digit;
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
                startGame(btn.getAttribute('data-mode'));
            });
        });

        document.getElementById('submitBtn').addEventListener('click', () => {
            const input = document.getElementById('codeInput');
            const guess = input.value;

            if (!gameActive || guess.length !== gameMode) return;

            const digits = guess.split('');
            if (new Set(digits).size !== digits.length) {
                alert(translations[currentLang].duplicate);
                return;
            }

            const feedback = checkGuess(guess);
            displayGuess(guess, feedback);
            currentAttempts++;
            document.getElementById('attemptsValue').textContent = currentAttempts;

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

        document.getElementById('playAgain').addEventListener('click', () => {
            document.getElementById('resultModal').classList.remove('active');
            document.getElementById('gameArea').classList.remove('active');
            document.getElementById('backBtn').classList.remove('active');
            document.getElementById('menuSelector').classList.add('active');
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            document.getElementById('gameArea').classList.remove('active');
            document.getElementById('backBtn').classList.remove('active');
            document.getElementById('menuSelector').classList.add('active');
            gameActive = false;
        });

        document.getElementById('langBtn').addEventListener('click', () => {
            document.getElementById('langMenu').classList.toggle('active');
        });

        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => {
                setLanguage(opt.getAttribute('data-lang'));
                document.getElementById('langMenu').classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-dropdown')) {
                document.getElementById('langMenu').classList.remove('active');
            }
        });

        setLanguage('en');