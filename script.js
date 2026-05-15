const sounds = [
    new Audio("./noise_pollution/1,9tdi.mp3"),
    new Audio("./noise_pollution/ausis.mp3"),
    new Audio("./noise_pollution/auskari.mp3"),
    new Audio("./noise_pollution/daksa.mp3"),
    new Audio("./noise_pollution/kaimini_no_rita.mp3"),
    new Audio("./noise_pollution/microwave.mp3"),
    new Audio("./noise_pollution/tornaads.mp3"),
];

const button = document.getElementById("mainButton");

button.addEventListener("click", function() {
    sounds.forEach(function(sound) {
        sound.currentTime = 0;
        sound.play();

    });
    
    console.log("im not responsible for your hearing loss");
});