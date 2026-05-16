type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
};

const createStars = (width: number, height: number): Star[] => {
  const count = Math.min(70, Math.max(26, Math.round(width / 18)));
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.8 + Math.random() * 1.8,
    speed: 0.04 + Math.random() * 0.11,
    alpha: 0.18 + Math.random() * 0.34
  }));
};

export const initStarfield = (): void => {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-starfield]');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  let stars: Star[] = [];
  let frame = 0;
  let animationId = 0;

  const resize = (): void => {
    const parent = canvas.parentElement ?? canvas;
    const rect = parent.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = createStars(rect.width, rect.height);
  };

  const draw = (): void => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(55, 136, 156, 0.18)');
    gradient.addColorStop(0.55, 'rgba(236, 177, 92, 0.10)');
    gradient.addColorStop(1, 'rgba(39, 90, 71, 0.12)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 1;
    context.strokeStyle = 'rgba(43, 92, 84, 0.13)';
    for (let i = 0; i < 7; i += 1) {
      const y = height * (0.22 + i * 0.095) + Math.sin(frame / 80 + i) * 6;
      context.beginPath();
      for (let x = -20; x <= width + 20; x += 20) {
        const wave = Math.sin((x + frame * 0.12) / 82 + i * 0.9) * 12;
        if (x === -20) context.moveTo(x, y + wave);
        else context.lineTo(x, y + wave);
      }
      context.stroke();
    }

    for (const star of stars) {
      star.x += star.speed;
      if (star.x > width + 10) star.x = -10;
      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }

    frame += 1;
    animationId = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('beforeunload', () => window.cancelAnimationFrame(animationId));
};
