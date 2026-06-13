const soundUpgrades = [
    { id: 1, name: "1.9TDI", path: "./noise_pollution/1,9tdi.mp3", cost: 15 },
    { id: 2, name: "Kaimiņi", path: "./noise_pollution/kaimini_no_rita.mp3", cost: 120 },
    { id: 3, name: "Mikroviļņi", path: "./noise_pollution/microwave.mp3", cost: 180 },
];

const warningSound = [
    { id: 4, name: "warning", path: "./noise_pollution/tornaads.mp3" },
];

soundUpgrades.forEach(function(track) {
    track.audio = new Audio(track.path);
    track.audio.loop = true;
    track.isSilenced = false;
});

let currency = 0;
let isNoisePlaying = false;
let questionInterval = null;
let questionTimeout = null;
let currentAnswer = 0;
let timeRemaining = 3;

const failSound = new Audio("./noise_pollution/lobotomy.mp3");

const mainButton = document.getElementById("mainButton");
const sidebar = document.getElementById("sidebar");
const scoreDisplay = document.getElementById("scoreDisplay");
const upgradeList = document.getElementById("upgradeList");

const mathPopup = document.getElementById("mathPopup");
const mathQuestion = document.getElementById("mathQuestion");
const mathAnswer = document.getElementById("mathAnswer");
const submitMath = document.getElementById("submitMath");
const mathTimer = document.getElementById("mathTimer");

function updateSidebarUI() {

    upgradeList.innerHTML = "";

    soundUpgrades.forEach(function(track) {

        const card = document.createElement("div");
        card.className = "upgrade-card";

        const label = document.createElement("span");
        label.className = "sound-name";
        label.innerText = track.name;

        const actionBtn = document.createElement("button");
        actionBtn.className = "mute-btn";

        if (track.isSilenced) {

            actionBtn.innerText = "Muted";
            actionBtn.classList.add("bought");

        } else {

            actionBtn.innerText = "Buy ($" + track.cost + ")";

            if (currency < track.cost) {

                actionBtn.classList.add("disabled");

            } else {

                actionBtn.addEventListener("click", function() {
                    purchaseMute(track.id);
                });

            }
        }

        card.appendChild(label);
        card.appendChild(actionBtn);

        upgradeList.appendChild(card);
    });
}

function purchaseMute(id) {

    const track = soundUpgrades.find(function(t) {
        return t.id === id;
    });

    if (currency >= track.cost && !track.isSilenced) {

        currency = currency - track.cost;

        track.isSilenced = true;

        track.audio.pause();
        track.audio.currentTime = 0;

        updateGameEngine();
    }
}

function revertRandomPurchase() {

    const purchasedTracks = soundUpgrades.filter(function(track) {
        return track.isSilenced;
    });

    if (purchasedTracks.length === 0) {
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * purchasedTracks.length);

    const randomTrack = purchasedTracks[randomIndex];

    randomTrack.isSilenced = false;

    randomTrack.audio.currentTime = 0;
    randomTrack.audio.play();

    updateGameEngine();
}

function updateGameEngine() {

    scoreDisplay.innerText = "Money: $" + currency;

    updateSidebarUI();

    checkVictoryState();
}

function checkVictoryState() {

    const remainingNoises = soundUpgrades.filter(function(track) {
        return !track.isSilenced;
    });

    if (remainingNoises.length === 0) {

        mainButton.innerText = "idk how, but you won.";
        mainButton.disabled = true;
        mainButton.style.backgroundColor = "#6c757d";
        mainButton.style.boxShadow = "none";

        if (questionInterval) {
            clearInterval(questionInterval);
        }

        if (questionTimeout) {
            clearInterval(questionTimeout);
        }
    }
}

function failMathQuestion() {

    clearInterval(questionTimeout);

    failSound.currentTime = 0;
    failSound.play();

    currency = 0;

    revertRandomPurchase();

    console.log(false);

    mathPopup.classList.add("hidden");

    updateGameEngine();
}

function showMathQuestion() {

    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const c = Math.floor(Math.random() * 20) + 1;

    currentAnswer = (a * b) + c;

    mathQuestion.innerText =
        "(" + a + " × " + b + ") + " + c + " = ?";

    mathAnswer.value = "";

    mathPopup.classList.remove("hidden");

    mathAnswer.focus();

    timeRemaining = 3;

    if (mathTimer) {
        mathTimer.innerText = timeRemaining;
    }

    clearInterval(questionTimeout);

    questionTimeout = setInterval(function() {

        timeRemaining--;

        if (mathTimer) {
            mathTimer.innerText = timeRemaining;
        }

        if (timeRemaining <= 0) {

            clearInterval(questionTimeout);

            failMathQuestion();
        }

    }, 1000);
}

function startQuestionSystem() {

    questionInterval = setInterval(function() {

        if (!isNoisePlaying) {
            return;
        }

        if (!mathPopup.classList.contains("hidden")) {
            return;
        }

        if (Math.random() < 0.5) {
            showMathQuestion();
        }

    }, 5000);
}

submitMath.addEventListener("click", function() {

    clearInterval(questionTimeout);

    const answer = Number(mathAnswer.value);

    if (answer === currentAnswer) {

        currency = currency + 20;

        console.log(true);

        mathPopup.classList.add("hidden");

        updateGameEngine();

    } else {

        failMathQuestion();
    }
});

mathAnswer.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        submitMath.click();
    }
});

mainButton.addEventListener("click", function() {

    if (!isNoisePlaying) {

        soundUpgrades.forEach(function(track) {
            track.audio.play();
        });

        isNoisePlaying = true;

        sidebar.classList.remove("hidden");

        mainButton.innerText = "Earn $1";

        mainButton.style.backgroundColor = "#28a745";

        mainButton.style.boxShadow =
            "0 8px 15px rgba(40, 167, 69, 0.3)";

        startQuestionSystem();

        updateGameEngine();

    } else {

        if (!mathPopup.classList.contains("hidden")) {
            return;
        }

        currency += 1;

        updateGameEngine();
    }
});
