(() => {
  // Smooth scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  fixCanvasResolution(document.getElementById("heroCanvas"));
  const Canvas = document.getElementById("heroCanvas");
  const ctx = Canvas.getContext('2d');

  function Boid(X, Y, angle) {
    this.PosX = X;
    this.PosY = Y;
    this.Ang = angle;
  }

  function Box(X, Y) {
    this.BPosX = X;
    this.BPosY = Y;
    this.Boids = [];
  }

  let Boids = [];
  for (let i = 0; i < 400; i++) {
    let SA = (i*2.001) * (Math.PI/20)
    let SR = Math.ceil(SA/(Math.PI *2)) * 30;
    Boids.push(new Boid(Canvas.clientWidth / 2 + (Math.cos(SA) * (SR * 3)) + (Math.random() * 10), Canvas.clientHeight / 2 + (Math.sin(SA) * SR) + (Math.random() *10), SA) );
  }

  let Boxes = new Map();

  function yourFunction() {
    ctx.fillStyle = '#ff8080';
    ctx.strokeStyle = '#ffffff';
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);

    const SightDist = 60;
    const speed = 1.5;
    let NewAngs = [];

    // Reset and rebuild Boxes map
    Boxes = new Map();
    for (let i = 0; i < Boids.length; i++) {
      const boid = Boids[i];
      let BRX = Math.floor(boid.PosX / SightDist);
      let BRY = Math.floor(boid.PosY / SightDist);
      const key = `${BRX},${BRY}`;
      if (!Boxes.has(key)) {
        Boxes.set(key, new Box(BRX, BRY));
      }
      Boxes.get(key).Boids.push(i);
    }

    for (let i = 0; i < Boids.length; i++) {
      let CurentBAng = Boids[i].Ang;
      NewAngs.push(CurentBAng);
      let Packavg = CurentBAng;
      let CloseAvg = CurentBAng;
      let AvgX = Boids[i].PosX;
      let AvgY = Boids[i].PosY;
      let AvgC = 1;

      const cellX = Math.floor(Boids[i].PosX / SightDist);
      const cellY = Math.floor(Boids[i].PosY / SightDist);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${cellX + dx},${cellY + dy}`;
          if (Boxes.has(key)) {
            const neighbors = Boxes.get(key).Boids;
            for (const j of neighbors) {
              if (i === j) continue;

              let D = dist(Boids[i].PosX, Boids[i].PosY, Boids[j].PosX, Boids[j].PosY);
              let A = Ang(Boids[i].PosX, Boids[i].PosY, Boids[j].PosX, Boids[j].PosY);

              if ((D < SightDist && InSight(CurentBAng, A, Math.PI / 1.9)) || D < 25) {
                if (Packavg != CurentBAng) {
                  Packavg = lerpAngle(Packavg, Boids[j].Ang, .5);
                } else {
                  Packavg = Boids[j].Ang;
                }

                AvgX += Boids[j].PosX;
                AvgY += Boids[j].PosY;
                AvgC++;

                if (D < 25) {
                  if (CloseAvg != CurentBAng) {
                    CloseAvg = lerpAngle(CloseAvg, Math.PI + A, .5);
                  } else {
                    CloseAvg = Math.PI + A;
                  }
                }
              }
            }
          }
        }
      }

      if (Packavg != Boids[i].Ang) {
        NewAngs[i] = lerpAngle(NewAngs[i], Packavg, 0.1);
        drawVector(ctx, Boids[i].PosX, Boids[i].PosY, Packavg, 25, { color: '#ff4d4d' });
      }

      if (CloseAvg != Boids[i].Ang) {
        NewAngs[i] = lerpAngle(NewAngs[i], CloseAvg, 0.2);
        drawVector(ctx, Boids[i].PosX, Boids[i].PosY, CloseAvg, 25, { color: '#4da6ff' });
      }

      if (AvgC != 1) {
        const cohesionAngle = Ang(Boids[i].PosX, Boids[i].PosY, AvgX / AvgC, AvgY / AvgC);
        NewAngs[i] = lerpAngle(NewAngs[i], cohesionAngle, 0.025);
        drawVector(ctx, Boids[i].PosX, Boids[i].PosY, cohesionAngle, 25, { color: '#66ff66' });
      }
    }

    ctx.globalAlpha = 0.3;
    for (const box of Boxes.values()) {
      DrawBox(ctx,(SightDist/2) + box.BPosX * SightDist, (SightDist/2) + box.BPosY * SightDist, 0, SightDist / 2);
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < Boids.length; i++) {
      let TurnAmount = -AngDif(Boids[i].Ang, NewAngs[i]) / Math.PI;
      Boids[i].Ang = NewAngs[i];
      const boid = Boids[i];
      let Cs = speed * (TurnAmount + 1);
      boid.PosX += Math.cos(boid.Ang) * Cs;
      boid.PosY += Math.sin(boid.Ang) * Cs;

      const CH = Canvas.clientHeight;
      const CW = Canvas.clientWidth;
      let WrapX = boid.PosX - CW;
      if (WrapX < -CW || WrapX > 0) {
        boid.PosX += -(IsNeg(WrapX)) * (CW);
      }
      let WrapY = boid.PosY - CH;
      if (WrapY < -CH || WrapY > 0) {
        boid.PosY += -(IsNeg(WrapY)) * (CH);
      }

      drawTriangle(ctx, boid.PosX, boid.PosY, 10, boid.Ang);
      boid.Ang += (Math.random() * 0.1) - 0.05;
    }
  }

  function IsNeg(num) {
    return num < 0 ? -1 : 1;
  }

  function dist(x1, y1, x2, y2) {
    const a = (x1 - x2);
    const b = (y1 - y2);
    return Math.sqrt((a * a) + (b * b));
  }

  function Ang(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  function lerpAngle(current, target, t) {
    let delta = target - current;
    delta = ((delta + Math.PI) % (2 * Math.PI)) - Math.PI;
    return current + delta * t;
  }

  function InSight(CurAng, targetAng, AngRange) {
    return AngDif(CurAng, targetAng) <= (AngRange / 2);
  }

  function AngDif(ang1, ang2) {
    ang1 = (ang1 + Math.PI * 2) % (Math.PI * 2);
    ang2 = (ang2 + Math.PI * 2) % (Math.PI * 2);
    let diff = Math.abs(ang1 - ang2);
    return Math.min(diff, Math.PI * 2 - diff);
  }

  function drawTriangle(ctx, x, y, size, angle) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const theta = angle + (i * (2 * Math.PI) / 3);
      let S = size / 1.25;
      if (i == 0) S = size;
      const px = x + S * Math.cos(theta);
      const py = y + S * Math.sin(theta);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#a65a5a';
    ctx.strokeStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
  }

  function DrawBox(ctx, x, y, angle, size) {
    ctx.strokeStyle = '#ffffffff';
    ctx.beginPath();
    const PAngs = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const scale = 1.41421356237 * size;
    for (let i = 0; i < PAngs.length; i++) {
      const NAng = PAngs[i] + angle;
      const px = x + Math.cos(NAng) * scale;
      const py = y + Math.sin(NAng) * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawVector(ctx, x, y, angle, length, options = {}) {
    const {
      color = '#ffffff',
      lineWidth = 2,
      drawArrow = true,
      arrowSize = 6
    } = options;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (drawArrow) {
      const arrowAngle = Math.PI / 6;
      const leftX = endX - arrowSize * Math.cos(angle - arrowAngle);
      const leftY = endY - arrowSize * Math.sin(angle - arrowAngle);
      const rightX = endX - arrowSize * Math.cos(angle + arrowAngle);
      const rightY = endY - arrowSize * Math.sin(angle + arrowAngle);

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(leftX, leftY);
      ctx.moveTo(endX, endY);
      ctx.lineTo(rightX, rightY);
      ctx.stroke();
    }
  }

  function fixCanvasResolution(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr  * 1;
    canvas.height = rect.height * dpr * 1;
    ctx.scale(dpr, dpr);
  }

  const interval = 1000 / 22;
  const timerId = setInterval(yourFunction, interval);

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.navbar');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('active');
  });

  // Interactive animations
  document.querySelectorAll('.content-card, .btn').forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.05)';
      element.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
    });
  });

  // Dark/light mode toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });

  // Ensure keyboard accessibility
  document.querySelectorAll('button, [href]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        element.click();
      }
    });
  });
})();
