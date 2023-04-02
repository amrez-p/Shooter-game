const canvas = document.querySelector("canvas");
const score_ID = document.querySelector("#score_ID");
const total_score = document.querySelector("#total_score");
const start_btn = document.querySelector("#start_btn");
const game_start = document.querySelector("#start_card");

const c = canvas.getContext("2d");

// console.log(game_start);

canvas.height = innerHeight;
canvas.width = innerWidth;

//CLASS BLUEPRINT

class Player {
  constructor({ x, y, color, angle, radius }) {
    this.position = {
      x: x,
      y: y,
    };
    this.speed = {
      x: 0,
      y: 0,
    };
    this.color = color;
    this.angle = angle;
    this.radius = radius;
  }
  design() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, this.angle);
    c.fillStyle = this.color;
    c.fill();
  }
  animate() {
    this.design();
  }
}
class Target {
  constructor({ x, y, color, angle, radius, sX = 1, sY = 1 }) {
    this.position = {
      x: x,
      y: y,
    };
    this.speed = {
      x: sX,
      y: sY,
    };
    this.color = color;
    this.angle = angle;
    this.radius = radius;
  }
  design() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, this.angle);
    c.fillStyle = this.color;
    c.fill();
  }
  animate() {
    this.design();
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }
}
class Bullet {
  constructor({ x, y, color, angle, radius, sX, sY }) {
    this.position = {
      x: x,
      y: y,
    };
    this.speed = {
      x: sX,
      y: sY,
    };
    this.color = color;
    this.angle = angle;
    this.radius = radius;
  }
  design() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, this.angle);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  animate() {
    this.design();
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }
}
//ClASS INFORMATION
let playerInfo = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 40,
  angle: Math.PI * 2,
  color: "white",
};
let bulletInfo = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  angle: Math.PI * 2,
  color: "white",
  sX: 1,
  sY: 1,
};
let targetInfo = {
  x: 0,
  y: 0,
  radius: 30,
  angle: Math.PI * 2,
  color: "green",
  sX: 1,
  sY: 1,
};

const player = new Player({
  x: playerInfo.x,
  y: playerInfo.y,
  color: playerInfo.color,
  angle: playerInfo.angle,
  radius: playerInfo.radius,
});
const bullet = new Bullet({
  x: bulletInfo.x,
  y: bulletInfo.y,
  color: bulletInfo.color,
  angle: bulletInfo.angle,
  radius: bulletInfo.radius,
  sX: bulletInfo.sX,
  sY: bulletInfo.sY,
});
// const target = new Target();

// const bullet2 = new Bullet({
//   x: bulletInfo.x,
//   y: bulletInfo.y,
//   color: "green",
//   angle: bulletInfo.angle,
//   radius: bulletInfo.radius,
//   sX: -1,
//   sY: -1,
// });

let All_Bullets = [];
let All_Targets = [];
let Score = 0;
let total;
// total.innerHTML = Score;
function reset() {
  All_Bullets = [];
  All_Targets = [];
  Score = 0;
  total = 0;
}

function spawnTarget() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    const Arc = Math.PI * 2;
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    let angled = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const speed = {
      x: Math.cos(angled),
      y: Math.sin(angled),
    };
    All_Targets.push(
      new Target({
        x: x,
        y: y,
        color: color,
        angle: Arc,
        radius: radius,
        sX: speed.x,
        sY: speed.y,
      }),
    );
  }, 2000);
}

//Animates
let animation_handler;
function animation() {
  animation_handler = requestAnimationFrame(animation);
  // console.log(All_Targets);
  c.fillStyle = "rgba(0,0,0,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.design();
  All_Bullets.forEach((bullet, index) => {
    bullet.animate();

    // Bullets leaving screen
    if (
      bullet.position.x + bullet.radius < 0 ||
      bullet.position.x - bullet.radius > canvas.width ||
      bullet.position.y + bullet.radius < 0 ||
      bullet.position.y - bullet.radius > canvas.height
    ) {
      setTimeout(() => {
        All_Bullets.splice(index, 1);
      }, 0);
    }
  });

  All_Targets.forEach((target, index) => {
    target.animate();

    const PlayerDist = Math.hypot(
      player.position.x - target.position.x,
      player.position.y - target.position.y,
    );
    //End Game
    if (PlayerDist - target.radius - player.radius < 1) {
      cancelAnimationFrame(animation_handler);
      game_start.style.display = "flex";
      start_btn.innerHTML = "Reset Game";
      score_ID.innerHTML = 0;
    }
    if (target.position.x)
      All_Bullets.forEach((bullet, bulletIndex) => {
        // const dist = Math.hypot(
        //   Math.abs(bullet.position.x - target.position.x),
        //   Math.abs(bullet.position.y - target.position.y),
        // );

        const dist = Math.hypot(
          bullet.position.x - target.position.x,
          bullet.position.y - target.position.y,
        );
        // console.log(dist);
        if (dist - target.radius - bullet.radius < 1) {
          Score += 100;
          setTimeout(() => {
            score_ID.innerHTML = Score;
            total_score.innerHTML = Score;
          }, 0);
          // Targets shrink
          if (target.radius - 10 > 10) {
            target.radius -= 10;
            setTimeout(() => {
              All_Bullets.splice(bulletIndex, 1);
            }, 0);
          } else
            setTimeout(() => {
              All_Targets.splice(index, 1);
              All_Bullets.splice(bulletIndex, 1);
            }, 0);
        }
      });
  });
}

//Action
addEventListener("click", (event) => {
  const Angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2,
  );
  const speed = {
    x: Math.cos(Angle),
    y: Math.sin(Angle),
  };
  // console.log(Angle);
  All_Bullets.push(
    new Bullet({
      x: bulletInfo.x,
      y: bulletInfo.y,
      color: bulletInfo.color,
      angle: bulletInfo.angle,
      radius: bulletInfo.radius,
      sX: speed.x * 5,
      sY: speed.y * 5,
    }),
  );
});

start_btn.addEventListener("click", (event) => {
  reset();
  spawnTarget();
  animation();

  game_start.style.display = "none";
});
