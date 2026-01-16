        const translations = {
            en: {
                currentLang: "English",
                badgeText: "Free to Play • No Ads • No Sign-Up",
                heroTitle: "Master The Art<br>of Deduction",
                heroSubtitle: "Challenge your mind with CodeGuess, the ultimate number-guessing game. Use logic, strategy, and intuition to crack secret codes and sharpen your problem-solving skills.",
                ctaText: "Start Playing Now",
                feature1Title: "Progressive Difficulty",
                feature1Desc: "Choose from 3 to 6 digits with Easy, Medium, or Hard modes to match your skill level",
                feature2Title: "Instant Feedback",
                feature2Desc: "Color-coded hints guide you closer to the solution with every guess",
                feature3Title: "Track Your Progress",
                feature3Desc: "Built-in history and notes to help you develop winning strategies",
                feature4Title: "Clean Interface",
                feature4Desc: "Distraction-free design with smooth animations and intuitive controls",
                stat1: "Game Modes",
                stat2: "Difficulty Levels",
                stat3: "Replayability"
            },
            ru: {
                currentLang: "Русский",
                badgeText: "Бесплатно • Без рекламы • Без регистрации",
                heroTitle: "Освойте искусство<br>дедукции",
                heroSubtitle: "Испытайте свой ум с CodeGuess, лучшей игрой на угадывание чисел. Используйте логику, стратегию и интуицию, чтобы взломать секретные коды и улучшить навыки решения задач.",
                ctaText: "Начать игру",
                feature1Title: "Прогрессивная сложность",
                feature1Desc: "Выбирайте от 3 до 6 цифр с легким, средним или сложным режимом",
                feature2Title: "Мгновенная обратная связь",
                feature2Desc: "Цветные подсказки приближают вас к решению с каждой попыткой",
                feature3Title: "Отслеживайте прогресс",
                feature3Desc: "Встроенная история и заметки для разработки выигрышных стратегий",
                feature4Title: "Чистый интерфейс",
                feature4Desc: "Дизайн без отвлечений с плавными анимациями и интуитивным управлением",
                stat1: "Игровых режимов",
                stat2: "Уровней сложности",
                stat3: "Реиграбельность"
            },
            ro: {
                currentLang: "Română",
                badgeText: "Gratuit • Fără reclame • Fără înregistrare",
                heroTitle: "Stăpânește arta<br>deducției",
                heroSubtitle: "Provocă-ți mintea cu CodeGuess, jocul suprem de ghicit numere. Folosește logica, strategia și intuiția pentru a sparge coduri secrete și a-ți ascuți abilitățile de rezolvare a problemelor.",
                ctaText: "Începe să joci acum",
                feature1Title: "Dificultate progresivă",
                feature1Desc: "Alege între 3 și 6 cifre cu moduri Ușor, Mediu sau Dificil",
                feature2Title: "Feedback instant",
                feature2Desc: "Indicii colorate te ghidează mai aproape de soluție cu fiecare încercare",
                feature3Title: "Urmărește-ți progresul",
                feature3Desc: "Istoric și notițe integrate pentru a dezvolta strategii câștigătoare",
                feature4Title: "Interfață curată",
                feature4Desc: "Design fără distrageri cu animații fluide și controale intuitive",
                stat1: "Moduri de joc",
                stat2: "Nivele de dificultate",
                stat3: "Rejucabilitate"
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        let currentLang = urlParams.get('lang') || localStorage.getItem('selectedLang') || 'en';
        if (urlParams.get('lang')) {
            localStorage.setItem('selectedLang', urlParams.get('lang'));
        }

        function setLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('selectedLang', lang);
            const t = translations[lang];
            
            document.getElementById('currentLang').textContent = t.currentLang;
            document.getElementById('badgeText').textContent = t.badgeText;
            document.getElementById('heroTitle').innerHTML = t.heroTitle;
            document.getElementById('heroSubtitle').textContent = t.heroSubtitle;
            document.getElementById('ctaText').textContent = t.ctaText;
            document.getElementById('feature1Title').textContent = t.feature1Title;
            document.getElementById('feature1Desc').textContent = t.feature1Desc;
            document.getElementById('feature2Title').textContent = t.feature2Title;
            document.getElementById('feature2Desc').textContent = t.feature2Desc;
            document.getElementById('feature4Title').textContent = t.feature4Title;
            document.getElementById('feature4Desc').textContent = t.feature4Desc;
            document.getElementById('stat1').textContent = t.stat1;
            document.getElementById('stat2').textContent = t.stat2;
            document.getElementById('stat3').textContent = t.stat3;
        }

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

        document.getElementById('startGameBtn').addEventListener('click', () => {
            window.location.href = `play.html?lang=${currentLang}`;
        });

        setLanguage(currentLang);
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-lang') === currentLang) {
                opt.classList.add('selected');
            }
        });