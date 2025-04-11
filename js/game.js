// Jeu de recyclage - Récupération des déchets
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du jeu
    const gameArea = document.getElementById('gameArea');
    const bin = document.getElementById('bin');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const restartButton = document.getElementById('restartButton');
    const ecoFactDisplay = document.getElementById('ecoFact');

    // Variables du jeu
    let score = 0;
    let level = 1;
    let timeLeft = 60;
    let gameActive = false;
    let gamePaused = false;
    let gameInterval;
    let timerInterval;
    let trashItems = [];
    let binPosition = gameArea.offsetWidth / 2;
    const binWidth = 80; // Largeur de la poubelle
    const binSpeed = 30; // Vitesse de déplacement de la poubelle

    // Faits écologiques pour le jeu
    const ecoFacts = [
        "Le recyclage d'une tonne de papier permet de sauver 17 arbres et d'économiser 20 000 litres d'eau !",
        "Une bouteille en plastique peut mettre jusqu'à 1000 ans pour se décomposer dans la nature.",
        "Chaque année, 8 millions de tonnes de plastique finissent dans les océans.",
        "Le verre peut être recyclé à l'infini sans perdre en qualité.",
        "Un téléphone portable contient plus de 60 matériaux différents qui pourraient être recyclés.",
        "Recycler une canette en aluminium économise assez d'énergie pour faire fonctionner une télévision pendant 3 heures.",
        "Près de 80% de ce qui se trouve dans nos poubelles pourrait être recyclé ou composté.",
        "Un chargeur de téléphone branché sans être utilisé continue de consommer de l'électricité.",
        "Le compostage des déchets organiques réduit la quantité de méthane produit par les décharges.",
        "Une pile jetée dans la nature peut polluer 1m³ de terre et 1000m³ d'eau pendant 50 ans."
    ];

    // Types de déchets avec leurs points
    const trashTypes = [
        { type: 'paper', points: 10, speed: 2 },
        { type: 'plastic', points: 15, speed: 3 },
        { type: 'glass', points: 20, speed: 4 },
        { type: 'organic', points: 5, speed: 2.5 },
        { type: 'hazardous', points: -30, speed: 5 }
    ];

    // Fonction pour démarrer le jeu
    function startGame() {
        if (gameActive) return;

        // Réinitialiser les variables du jeu
        score = 0;
        level = 1;
        timeLeft = 60;
        gameActive = true;
        gamePaused = false;
        trashItems = [];

        // Mettre à jour l'affichage
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        timerDisplay.textContent = timeLeft;

        // Activer/désactiver les boutons appropriés
        startButton.disabled = true;
        pauseButton.disabled = false;
        restartButton.disabled = false;

        // Nettoyer le jeu des déchets précédents
        clearGameArea();

        // Démarrer les intervalles de jeu
        gameInterval = setInterval(createTrash, 1500);
        timerInterval = setInterval(updateTimer, 1000);

        // Afficher un fait écologique aléatoire
        showRandomEcoFact();
    }

    // Fonction pour mettre en pause le jeu
    function togglePause() {
        if (!gameActive) return;

        if (gamePaused) {
            // Reprendre le jeu
            gamePaused = false;
            pauseButton.textContent = 'Pause';
            gameInterval = setInterval(createTrash, 1500);
            timerInterval = setInterval(updateTimer, 1000);
        } else {
            // Mettre en pause
            gamePaused = true;
            pauseButton.textContent = 'Reprendre';
            clearInterval(gameInterval);
            clearInterval(timerInterval);
        }
    }

    // Fonction pour redémarrer le jeu
    function restartGame() {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        startGame();
    }

    // Fonction pour mettre à jour le timer
    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    // Fonction pour créer un nouveau déchet
    function createTrash() {
        if (gamePaused) return;

        // Sélectionner un type de déchet aléatoire
        const trashType = trashTypes[Math.floor(Math.random() * trashTypes.length)];

        // Créer l'élément HTML du déchet
        const trash = document.createElement('div');
        trash.classList.add('trash', trashType.type);

        // Positionner le déchet aléatoirement en haut de la zone de jeu
        const randomX = Math.random() * (gameArea.offsetWidth - 40);
        trash.style.left = `${randomX}px`;
        trash.style.top = '0px';

        // Ajouter des données au déchet
        trash.dataset.points = trashType.points;
        trash.dataset.speed = trashType.speed * (1 + (level - 1) * 0.1); // Augmente la vitesse avec le niveau

        // Ajouter le déchet à la zone de jeu
        gameArea.appendChild(trash);

        // Ajouter le déchet à notre tableau de suivi
        trashItems.push({
            element: trash,
            x: randomX,
            y: 0,
            speed: parseFloat(trash.dataset.speed),
            points: parseInt(trash.dataset.points)
        });
    }

    // Fonction pour mettre à jour la position des déchets
    function updateTrashPositions() {
        if (gamePaused || !gameActive) return;

        const gameHeight = gameArea.offsetHeight;
        const itemsToRemove = []; // Tableau pour stocker les index à supprimer

        // Parcourir tous les déchets et mettre à jour leur position
        for (let i = trashItems.length - 1; i >= 0; i--) {
            const item = trashItems[i];
            item.y += item.speed;
            item.element.style.top = `${item.y}px`;

            // Vérifier si le déchet est sorti de l'écran
            if (item.y > gameHeight) {
                gameArea.removeChild(item.element);
                trashItems.splice(i, 1);
                continue;
            }

            // Vérifier si le déchet a touché la poubelle
            if (checkCollision(item)) {
                // Marquer comme attrapé (effet visuel)
                item.element.classList.add('caught');

                // Mettre à jour le score
                updateScore(item.points);

                // Capturer l'élément et l'index pour suppression différée
                const element = item.element;
                const index = i;

                // Supprimer le déchet après l'animation
                setTimeout(() => {
                    if (gameArea.contains(element)) {
                        gameArea.removeChild(element);
                    }
                    // Ne pas modifier trashItems ici
                }, 300);

                // Marquer pour suppression immédiate
                trashItems.splice(i, 1);
            }
        }
    }

    // Fonction pour vérifier la collision entre un déchet et la poubelle
    function checkCollision(trashItem) {
        const binLeft = parseInt(bin.style.left || binPosition);
        const binRight = binLeft + binWidth;
        const binTop = gameArea.offsetHeight - 100; // Hauteur de la poubelle

        const trashLeft = trashItem.x;
        const trashRight = trashLeft + 40; // Largeur du déchet
        const trashBottom = trashItem.y + 40; // Hauteur du déchet

        return (
            trashBottom >= binTop &&
            trashRight >= binLeft &&
            trashLeft <= binRight
        );
    }

    // Fonction pour mettre à jour le score
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;

        // Vérifier si on passe au niveau suivant
        if (score >= level * 100) {
            levelUp();
        }
    }

    // Fonction pour passer au niveau suivant
    function levelUp() {
        level++;
        levelDisplay.textContent = level;

        // Augmenter la difficulté (fréquence des déchets)
        clearInterval(gameInterval);
        gameInterval = setInterval(createTrash, 1500 - (level - 1) * 100);

        // Ajouter du temps pour le joueur
        timeLeft += 10;
        timerDisplay.textContent = timeLeft;

        // Montrer un nouveau fait écologique
        showRandomEcoFact();
    }

    // Fonction pour terminer le jeu
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);

        // Désactiver/activer les boutons appropriés
        startButton.disabled = false;
        pauseButton.disabled = true;
        restartButton.disabled = false;

        // Afficher le popup de fin de jeu
        showGameOverPopup();
    }

    // Fonction pour nettoyer la zone de jeu
    function clearGameArea() {
        const trashElements = document.querySelectorAll('.trash');
        trashElements.forEach(trash => {
            trash.remove();
        });
    }

    // Fonction pour afficher le popup de fin de jeu
    function showGameOverPopup() {
        const popup = document.createElement('div');
        popup.classList.add('game-over-popup');

        popup.innerHTML = `
            <h2>Partie terminée!</h2>
            <p class="final-score">Votre score: ${score}</p>
            <button id="closePopup" class="game-button">Fermer</button>
        `;

        gameArea.appendChild(popup);

        document.getElementById('closePopup').addEventListener('click', function() {
            popup.remove();
        });
    }

    // Fonction pour afficher un fait écologique aléatoire
    function showRandomEcoFact() {
        const randomFact = ecoFacts[Math.floor(Math.random() * ecoFacts.length)];
        ecoFactDisplay.textContent = randomFact;
    }

    // Contrôles de la poubelle avec le clavier
    document.addEventListener('keydown', function(e) {
        if (!gameActive || gamePaused) return;

        const gameWidth = gameArea.offsetWidth;

        if (e.key === 'ArrowLeft' || e.key === 'Left') {
            binPosition = Math.max(0, binPosition - binSpeed);
        } else if (e.key === 'ArrowRight' || e.key === 'Right') {
            binPosition = Math.min(gameWidth - binWidth, binPosition + binSpeed);
        }

        bin.style.left = `${binPosition}px`;
    });

    // Contrôles tactiles pour les appareils mobiles
    gameArea.addEventListener('touchmove', function(e) {
        if (!gameActive || gamePaused) return;

        e.preventDefault();
        const touch = e.touches[0];
        const gameRect = gameArea.getBoundingClientRect();
        const touchX = touch.clientX - gameRect.left;

        binPosition = Math.max(0, Math.min(gameArea.offsetWidth - binWidth, touchX - binWidth / 2));
        bin.style.left = `${binPosition}px`;
    });

    // Gestionnaires d'événements pour les boutons
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    restartButton.addEventListener('click', restartGame);

    // Boucle principale du jeu
    function gameLoop() {
        updateTrashPositions();
        requestAnimationFrame(gameLoop);
    }

    // Démarrer la boucle de jeu
    gameLoop();
});