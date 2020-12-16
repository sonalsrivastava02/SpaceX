const cEarthIntro = document.querySelector("#cEarthIntro");
const contextE = cEarthIntro.getContext("2d");
const cHoldCursor = document.querySelector("#cHoldCursor");
const contextC = cHoldCursor.getContext("2d");

const TAU = Math.PI * 2;
const size = 200;
const noiseSpeed = 0.008;
const angleZoom = 10;
const lengthZoom = 80;
const particlesToAdd = 2;
const particleSize = 0.9;
const speedFactor = 0.3;
let frames = 0;
let columns = 0;
let rows = 0;
let field = [];
let particles = [];

const baseRadius = 50;
const easeFactor = 0.25;
let timer;
let animScale;
const animData = {
    scale: 1,
    progress: 0,
}

const mousePosition = {
    x: -100,
    y: -100
};

const position = {
    x: 0,
    y: 0,
};


function resize() { 
    cEarthIntro.width = window.innerWidth;
    cEarthIntro.height = window.innerHeight;
    buildField();
    buildParticles();
    cHoldCursor.width = window.innerWidth;
    cHoldCursor.height = window.innerHeight;
}

function buildField() {
     
    columns = Math.ceil(cEarthIntro.width / size) + 1;
    rows = Math.ceil(cEarthIntro.height / size) + 1;
    field = [];
    for (let x = 0; x < columns; x++){
        field[x] = [];
        for (let y = 0; y < rows; y++){

            field[x][y] = new Vector(0, 0);
        }
    }
}

function buildParticles() {
    for (let i = 0; i < particlesToAdd; i++){
        particles.push({
            position: new Vector(
                cEarthIntro.width * Math.random(),
                cEarthIntro.height * Math.random()
            ),
            velocity: new Vector(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            ),
            acceleration: new Vector(0, 0),
            size: particleSize,
            age: 0,
            lifeSpan: 200,
            hue: 200 + (Math.random()*80),
        });
    }
}

function draw() {
    //context.clearRect(0, 0, canvas.width, canvas.height);
    //context.fillStyle = "rgba(0, 0, 0, 0.1)";
    //context.fillRect(0, 0, canvas.width, canvas.height);
    updateField();
    //drawField();
    updateParticles();
    drawParticles();
    drawHoldCursor();
    frames++;
    requestAnimationFrame(draw);
}

function updateParticles() {
    for (let i = 0; i < particles.length; i++){
        const particle = particles[i];
        // flowPos is the columns and rows coordinates
        const flowPos = particle.position.div(size);

        if (
            flowPos.x > 0 &&
            flowPos.x <= columns &&
            flowPos.y > 0 &&
            flowPos.y <= rows
        ) {
            const x = Math.floor(flowPos.x);
            const y = Math.floor(flowPos.y);
            const force = field[x][y];
            particle.acceleration.addTo(force);
        }

        particle.velocity.addTo(particle.acceleration);
        particle.position.addTo(particle.velocity);

        if (particle.velocity.getLength() > 2) {
            particle.velocity.setLength(2);
        }

        particle.acceleration.setLength(0);

        if (particle.position.x < 0) {
            particle.position.x = cEarthIntro.width - particle.size;
        } else if (particle.position.x > cEarthIntro.width) {
            particle.position.x = 0 + particle.size;
        }

        if (particle.position.y < 0) {
            particle.position.y = cEarthIntro.height - particle.size;
        } else if (particle.position.y > cEarthIntro.height) {
            particle.position.y = 0 + particle.size;
        }

        particle.age++;
        if (particle.age < particle.lifeSpan) {
            const agePer = 1 - (particle.age / particle.lifeSpan);
            particle.size = particleSize * agePer;
        } else {
            particle.size = 0;
            particle.age = 0;
        }
    }
}


function drawParticles() {
    for (let i = 0; i < particles.length; i++){
        const particle = particles[i];
        contextE.beginPath();
        contextE.arc(particle.position.x, particle.position.y, particle.size, 0, TAU);
        contextE.fillStyle = "hsla("+particle.hue+", 0%, 0%, 0.2)";
        contextE.fill();
    }
}

function updateField() {
    for (let x = 0; x < columns; x++){
        for (let y = 0; y < rows; y++){
            const angle = noise.simplex3(x/angleZoom, y/angleZoom, frames *noiseSpeed) * TAU;
            const length = noise.simplex3(x/lengthZoom, y/lengthZoom, frames * noiseSpeed) * speedFactor;
            field[x][y].setAngle(angle);
            field[x][y].setLength(length);
        }
    }
}

// function drawField() {

//     for (let x = 0; x < columns; x++){
//         for (let y = 0; y < rows; y++){
//             const xPos = x * size;
//             const yPos = y * size;

//             context.beginPath();
//             context.moveTo(xPos, yPos);
//             context.lineTo(
//                 xPos + field[x][y].x * size,
//                 yPos + field[x][y].y * size,
//             );
//             //context.fillStyle = "white";
//             context.strokeStyle = "white";
//             context.stroke();
//             //context.fill();
//         }
//     }

// }

function drawHoldCursor() {

    position.x += (mousePosition.x - position.x) * easeFactor;
    position.y += (mousePosition.y - position.y) * easeFactor;


    contextC.clearRect(0, 0, cHoldCursor.width, cHoldCursor.height);
    contextC.lineWidth = 1;
    contextC.beginPath();
    contextC.arc(position.x, position.y, 10 + baseRadius * animData.scale, 0, TAU);
    contextC.strokeStyle= "black";
    contextC.stroke();
    contextC.beginPath();
    contextC.arc(position.x, position.y, 10+ baseRadius * animData.scale, 0, TAU * animData.progress);
    contextC.strokeStyle= "#E25E5E";
    contextC.stroke();
    contextC.font = "19px Oswald"
    contextC.fillStyle = "black";
    const textWidth = contextC.measureText("HOLD").width;
    contextC.fillText("HOLD", position.x - textWidth/2, position.y);

}

// let cursorText = document.getElememtById("cursor-text");


function onMouseMove(event) {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;

    // cursorText.style.left = mousePosition.x + "px";
    // cursorText.style.top = mousePosition.y + "px";
}

function onMouseDown(){
    timer.play();
    scaleAnim.play();
}

function  onMouseUp(){
    timer.reverse();
    scaleAnim.reverse();
}

function onEnter(){
    window.location = "nexthtml.html";
    timer.kill();
}

timer = gsap.to(animData, { progress: 1, duration: 1, ease: "power2", onComplete: onEnter, paused: true});
scaleAnim = gsap.to(animData, { scale: 0, duration: 1, ease: "power2", paused: true});





resize();
window.addEventListener("resize", resize);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("resize", resize);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
requestAnimationFrame(draw);



// const canvas = document.querySelector("canvas");

// const context = canvas.getContext("2d");


// const baseRadius = 50;
// const easeFactor = 0.25;
// let timer;
// let animScale;
// const animData = {
//     scale: 1,
//     progress: 0,
// }

// const mousePosition = {
//     x: -100,
//     y: -100
// };

// const position = {
//     x: 0,
//     y: 0,
// };

// function resize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }

// function draw() {

//     position.x += (mousePosition.x - position.x) * easeFactor;
//     position.y += (mousePosition.y - position.y) * easeFactor;


//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.lineWidth = 1;
//     context.beginPath();
//     context.arc(position.x, position.y, 10 + baseRadius * animData.scale, 0, TAU);
//     context.strokeStyle= "black";
//     context.stroke();
//     context.beginPath();
//     context.arc(position.x, position.y, 10+ baseRadius * animData.scale, 0, TAU * animData.progress);
//     context.strokeStyle= "#E25E5E";
//     context.stroke();
//     context.font = "19px Oswald"
//     context.fillStyle = "black";
//     const textWidth = context.measureText("HOLD").width;
//     context.fillText("HOLD", position.x - textWidth/2, position.y);
//     requestAnimationFrame(draw);

//     console.log(mousePosition.x)
// }

// // let cursorText = document.getElememtById("cursor-text");


// function onMouseMove(event) {
//     mousePosition.x = event.clientX;
//     mousePosition.y = event.clientY;

//     // cursorText.style.left = mousePosition.x + "px";
//     // cursorText.style.top = mousePosition.y + "px";
// }

// function onMouseDown(){
//     timer.play();
//     scaleAnim.play();
// }

// function  onMouseUp(){
//     timer.reverse();
//     scaleAnim.reverse();
// }

// function onEnter(){
//     window.location = "nexthtml.html";
//     timer.kill();
// }

// timer = gsap.to(animData, { progress: 1, duration: 1, ease: "power2", onComplete: onEnter, paused: true});
// scaleAnim = gsap.to(animData, { scale: 0, duration: 1, ease: "power2", paused: true});

// resize();
// window.addEventListener("mousemove", onMouseMove);
// window.addEventListener("resize", resize);
// window.addEventListener("mousedown", onMouseDown);
// window.addEventListener("mouseup", onMouseUp);
// requestAnimationFrame(draw);



