const sound = new Audio("./noise_pollution/ausis.mp3");

const button = document.getElementById("mainButton");

button.addEventListener("click", function() {
    sound.play();
    console.log("sound played");

    setTimeout(function () {
    sound.pause();
    sound.currentTime = 0;
}, 500);
});