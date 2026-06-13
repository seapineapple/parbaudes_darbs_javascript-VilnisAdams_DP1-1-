# parbaudes_darbs_javascript-VilnisAdams_DP1-1-
## Clicker game
### Spēles gaita un ieteikumi
1. Ir ļoti svarīgi spēli spēlēt uz zemas skaņas, lai nenodarītu sliktu savām ausīm. (25% vai mazāk)
2. katras 5sec ir 50/50 iespēja ka parādīsies kāds matemātikas jautājums, ja atbildēsi pareizi,
tad iegūsi bonusu, ja atbildēsi nepareizi, iegūsi pretējo
3. Es pats vēl neesmu varējis pabeigt spēli, tātad ja jums tas izdodas, jūs varat lepoties ar sevi
### clicker game izveidošanas process
Spēlei ir 3 koda faili (index.html, styles.css, script.js) un 4 audio faili
#### HTML
Spēles HTML fails ir ļoti minimāls, galvenais tajā ir pogu elements
un šajā failā netika izmantots MI (mākslīgais intelekts)
#### CSS
CSS failā arī ir maz lietas, jo spēlē galveno kārt ir domāta lai mācītos Javascript
nevis CSS vai HTML, šajā failā tika diezgan daudz izmantots MI, bet es varu izskaidrot un saprotu visu no tā.
#### JS (javascript)
Šajā spēlē JS fails ir pats lielākais ar 298 līnijām un arī fails kurā tika visvairāk MI izmantots, katru daļu es veidoju atsevišķi

1. No sākuma es izveidoju const mainīgo kas satur visas kaitinošās skaņas spēlei, katrai skaņai iedevu id, vārdu, pats uz pašu mp3 file un cenu
```
const soundUpgrades = [
    { id: 1, name: "1.9TDI", path: "./noise_pollution/1,9tdi.mp3", cost: 15 },
    { id: 2, name: "kaimiņi", path: "./noise_pollution/kaimini_no_rita.mp3", cost: 120 },
    { id: 3, name: "Mikroviļņi", path: "./noise_pollution/microwave.mp3", cost: 180 }
];
```

2. Tad es katru audio file pārtaisiju par īstu strādājošu skaņu un katram noteicu loop un isSilenced vērtību (True vai False)
```
soundUpgrades.forEach(function(track) {
    track.audio = new Audio(track.path);
    track.audio.loop = true;
    track.isSilenced = false;
});
```

3. Pēc tam kad tiku galā ar audio failiem un mainīgajiem, es noteicu 6 galvenos spēles darbību mainīgos, visi šie mainīgie ir "let" mainīgie jo
tiem vajadzēs bieži mainīt vērtību
```
let currency = 0;
let isNoisePlaying = false;
let questionInterval = null;
let questionTimeout = null;
let currentAnswer = 0;
let timeRemaining = 3;
```

4. Galvenā spēles doma ir spiest pogu lai iegūtu naudu un tad to naudu tērētu lai varētu izslēgt vairākas skaņas, tam bija vajadzīga galvenā poga, kura
pirmo reizi ieslēdz visas skaņas, parāda sidebar un iesāk visas citas spēles funkcijas un pēc tam uz katra spiediena iedod +1 naudu
```
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

        currency = currency + 1;

        updateGameEngine();
    }
});
```
5. Kā jau minēju, galvenā spēles doma ir spiest pogu lai iegūtu naudu u.t.t., lai to panāktu vajadzēja izveidot sidebar veikalu
```
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
```
Īsumā, šajā koda: Iziet cauri katrai skaņai un uztaisi tai "card" un iedod nosaukumu kuru redzēs uz sidebar, katrai skaņai uztaisa pogu kur ir rakstīts buy + skaņas cena
Pārbauda vai ir jau nopirkts, ja ir tad maina pogas tekstu un pārbauda vai spēlētājam ir nauda lai nopirktu to.

6. Spēlējot spēli, katras 5sec ir 50/50 iespēja ka parādīsies matemātikas jautājums un es gribēju iedod bonusu par pareizu atbildi, un sodu par nepareizu.
Ja atbild nepareizi, tad tiek nospēlēta skaņa (šo audio nevar atrast soundUpgrades mainīgajā), tiek atņemta visa nauda, un ja biji paspējis nopirkt kādu skaņu, tad izmantojot math.random, spēle izvēlas kuru no nopirktajām skaņām ieslēdz atpakaļ iekšā,
funkcija pirkuma atcelšanai:
```
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
```
Pārējie sodi:
```
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
```
7. Izveidoju funkciju kura gan izdomā gan parāda matemātikas jautājumu:
```
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
```
8. Izveidoju funkciju kas dara 50/50 izvēli katras 5sec lai noteiktu vai vajag vai nevajag parādīt matemātikas jautājumu
```
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
```
9. Tā kā ir sods par to ka ieraksta nepareizu atbildi, ir arī bonus par pareizu, to es pievienoju reizē ar funkciju kas pārbauda vai atbilde ir pareiza via nepareiza
```
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
```
Protams šis nav pilnīgi viss kods, ir vēl dažas lietas piemēram kods tam, lai lietotājs var izmantot arī 'enter' pogu 
```
mathAnswer.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        submitMath.click();
    }
});
```
### Spēles gājiens
1. Uzspied pogu lai sāktu spēli
2. Turpini spiest pogu lai iegūtu naudu
3. Izmanto naudu lai izslēgtu skaņas
4. Katras 5sec ir 50/50 iespēja uz matemātikas jautājumu
5. Pareizi atbildot:
  * +20 nauda
  * consolē ieraksta True.
  Nepareiza atbilde:
  * Noņem visu naudu
  * consolē ieraksta False
6. Kad izslēdzi visas skaņas spēle beidzās
