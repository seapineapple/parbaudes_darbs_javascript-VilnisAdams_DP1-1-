const sounds = [
    new Audio("./sounds/a.mp3"),
    new Audio("./sounds/b.mp3"),
    new Audio("./sounds/c.mp3"),
    new Audio("./sounds/d.mp3"),
    new Audio("./sounds/e.mp3"),
    new Audio("./sounds/f.mp3"),
];

const button = document.getElementById("mainButton");

button.addEventListener("click", function() {
    sound.play();
    console.log("sound played");

    setTimeout(function () {
    sound.pause();
    sound.currentTime = 0;
}, 500);
});