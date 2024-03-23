// let canvas = document.querySelector("canvas");
// let ctx = canvas.getContext("2d");

//// Joystick for canvas
class Button {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.X = x;
        this.Y = y;
        this.R = r * 2.5;

        this.dx = 0;
        this.dy = 0;
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();

        // outer circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.r, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }

    drawText() {

    }
}

// adding player and controlling by analog
let player = {
    x: 0, y: 0, vel: 2,
    drawPlayer: function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.restore();
    },
    movePlayer: function (analog) {
        this.x += this.vel * analog.dx;
        this.y += this.vel * analog.dy;
    }
}

let analog = new Button(150, 150, 30);

animate();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analog.draw();
    analog.drawText();

    player.drawPlayer();
    player.movePlayer(analog)

    window.requestAnimationFrame(animate);

}

event();

function event() {

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        analog.x = e.touches[0].clientX;
        analog.y = e.touches[0].clientY;
    })

    // move addEventListener
    canvas.addEventListener("touchmove", e => {
        analog.x = e.changedTouches[0].clientX;
        analog.y = e.changedTouches[0].clientY;

        // limiting the joystick within the outer rim
        let ax = analog.x - analog.X;
        let ay = analog.y - analog.Y;

        // magnitude of ax and ay
        let mag = Math.sqrt(ax * ax + ay * ay);

        // unit vector(dx,dy)
        analog.dx = ax / mag;
        analog.dy = ay / mag;

        // adding vector method
        if (mag > analog.R) {
            analog.x = analog.X + (analog.dx * analog.R)
            analog.y = analog.Y + (analog.dy * analog.R)
        }
    })

    canvas.addEventListener('touchend', e => {
        analog.x = analog.X;
        analog.y = analog.Y;
        analog.dx = 0;
        analog.dy = 0;
    })
}
