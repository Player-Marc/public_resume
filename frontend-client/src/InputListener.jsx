import { socket } from "./SocketReceiver"

export default class InputListener {

    constructor(canvasEl) {

        this.socket = socket;
        this.canvasEl = canvasEl;

        console.log("Initializing Input Listeners . . .")
    }

    movement() {
        const inputs = {
            up: false,
            down: false,
            left: false,
            right: false,
            clickAngle: false
        };

        window.addEventListener("load",function() {
            setTimeout(function(){
                // Hide the address bar:
                window.scrollTo(0, 1);
            }, 0);
        });

        // first listener for movement
        window.addEventListener("keydown", (e) => {
            if (e.key === "w") {
                inputs["up"] = true;
            } else if (e.key === "s") {
                inputs["down"] = true;
            } else if (e.key === "d") {
                inputs["right"] = true;
            } else if (e.key === "a") {
                inputs["left"] = true;
            }

            // if any of this is pressed, then play audio
            // if (["a", "s", "w", "d"].includes(e.key) && walkSnow.paused) {
            //   // walkSnow.play();
            // }

            this.socket.emit("inputs", inputs);
        });

        window.addEventListener("keyup", (e) => {

            if (e.key === "w") {
                inputs["up"] = false;
            } else if (e.key === "s") {
                inputs["down"] = false;
            } else if (e.key === "d") {
                inputs["right"] = false;
            } else if (e.key === "a") {
                inputs["left"] = false;
            }

            // if any of this 
            // if (["a", "s", "w", "d"].includes(e.key)) {
            //   walkSnow.pause();
            //   walkSnow.currentTime = 0;
            // }

            this.socket.emit("inputs", inputs);
        });
    }

    shoot(canvasEl) {

        console.log("Adding Shoot Listener . . .");

        // projectile on click
        // (e) is the location of mouse click
        canvasEl.addEventListener("click", (e) => {

            // console.log("Shoot Registered...");

            const angle = Math.atan2(
                e.clientY - this.canvasEl.height / 2,
                e.clientX - this.canvasEl.width / 2
            );
            this.socket.emit("snowball", angle);

        });
    }

    slotSkill(slotSkill_BTN, modalEl){

        slotSkill_BTN.addEventListener('click', () => {
            console.log("WA")
            this.socket.emit("slotSkill", "1");
            modalEl.style.display = 'none';
            // if (e.key === "0") {
            //     this.socket.emit("slotSkill", "1");
            // }
        });

        

    }


    useSkill() {

        window.addEventListener("keydown", (e) => {
            if (e.key === "1") {
                socket.emit("useSkill", 0);
            }

            if (e.key === "2") {
                socket.emit("useSkill", 1);
            }

            if (e.key === "3") {
                socket.emit("useSkill", 2);
            }

            if (e.key === "4") {
                socket.emit("useSkill", 3);
            }

        });
    }

}