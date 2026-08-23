(() => {
  const canvas = document.querySelector("[data-opening-field]");
  const stage = document.querySelector("[data-opening-stage]");

  if (!canvas || !stage) {
    return;
  }

  const context = canvas.getContext("2d", { alpha: true });

  if (!context) {
    return;
  }

  const root = document.documentElement;
  root.classList.add("has-opening-field");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");
  const ripples = [];
  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    activity: 0,
    targetActivity: 0,
    lastX: 0,
    lastY: 0,
    lastRippleAt: 0
  };

  let width = 0;
  let height = 0;
  let frameId = 0;
  let isVisible = true;
  let lastAutoRippleAt = 0;
  let colors = {};

  const readColors = () => {
    const styles = getComputedStyle(root);
    colors = {
      line: styles.getPropertyValue("--line").trim() || "rgba(221, 249, 245, 0.14)",
      accent: styles.getPropertyValue("--cyan").trim() || "#57f2d7",
      glow: styles.getPropertyValue("--console-glow").trim() || "rgba(87, 242, 215, 0.12)"
    };
  };

  const emitRipple = (x, y, strength = 1, now = performance.now()) => {
    ripples.push({ x, y, strength, startedAt: now });

    if (ripples.length > 5) {
      ripples.shift();
    }
  };

  const displacementAt = (x, y, now) => {
    let offsetX = 0;
    let offsetY = 0;
    const pointerDx = x - pointer.x;
    const pointerDy = y - pointer.y;
    const pointerDistance = Math.hypot(pointerDx, pointerDy) || 1;
    const pointerRadius = width < 720 ? 126 : 190;

    if (pointer.activity > 0.002 && pointerDistance < pointerRadius) {
      const proximity = 1 - pointerDistance / pointerRadius;
      const envelope = proximity * proximity * pointer.activity;
      const pulse = Math.sin(pointerDistance * 0.052 - now * 0.011) * 3.2;
      const amount = envelope * (8 + pulse);
      offsetX += (pointerDx / pointerDistance) * amount;
      offsetY += (pointerDy / pointerDistance) * amount;
    }

    ripples.forEach((ripple) => {
      const age = now - ripple.startedAt;
      const life = Math.max(0, 1 - age / 2200);

      if (life === 0) {
        return;
      }

      const dx = x - ripple.x;
      const dy = y - ripple.y;
      const distance = Math.hypot(dx, dy) || 1;
      const radius = age * 0.2;
      const distanceFromRing = distance - radius;
      const ring = Math.exp(-(distanceFromRing * distanceFromRing) / 1450);
      const amount = ring * life * ripple.strength * 11;
      offsetX += (dx / distance) * amount;
      offsetY += (dy / distance) * amount;
    });

    return [x + offsetX, y + offsetY];
  };

  const drawGrid = (now) => {
    context.clearRect(0, 0, width, height);

    if (pointer.activity > 0.01) {
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, width < 720 ? 130 : 210);
      glow.addColorStop(0, colors.glow);
      glow.addColorStop(1, "transparent");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    }

    const spacing = width < 720 ? 42 : 52;
    const sample = Math.max(14, Math.round(spacing / 2));

    context.save();
    context.strokeStyle = colors.line;
    context.globalAlpha = 0.72;
    context.lineWidth = 1;

    for (let x = -spacing; x <= width + spacing; x += spacing) {
      context.beginPath();

      for (let y = -sample; y <= height + sample; y += sample) {
        const [drawX, drawY] = displacementAt(x, y, now);

        if (y === -sample) {
          context.moveTo(drawX, drawY);
        } else {
          context.lineTo(drawX, drawY);
        }
      }

      context.stroke();
    }

    for (let y = -spacing; y <= height + spacing; y += spacing) {
      context.beginPath();

      for (let x = -sample; x <= width + sample; x += sample) {
        const [drawX, drawY] = displacementAt(x, y, now);

        if (x === -sample) {
          context.moveTo(drawX, drawY);
        } else {
          context.lineTo(drawX, drawY);
        }
      }

      context.stroke();
    }

    context.restore();

    ripples.forEach((ripple) => {
      const age = now - ripple.startedAt;
      const life = Math.max(0, 1 - age / 2200);

      if (life === 0) {
        return;
      }

      context.save();
      context.beginPath();
      context.arc(ripple.x, ripple.y, age * 0.2, 0, Math.PI * 2);
      context.strokeStyle = colors.accent;
      context.globalAlpha = life * 0.24 * ripple.strength;
      context.lineWidth = 1.2;
      context.shadowColor = colors.accent;
      context.shadowBlur = 10;
      context.stroke();
      context.restore();
    });
  };

  const render = (now) => {
    frameId = 0;

    if (!isVisible || document.hidden) {
      return;
    }

    pointer.x += (pointer.targetX - pointer.x) * 0.11;
    pointer.y += (pointer.targetY - pointer.y) * 0.11;
    pointer.activity += (pointer.targetActivity - pointer.activity) * 0.075;

    if (coarsePointerQuery.matches && now - lastAutoRippleAt > 2800 && !motionQuery.matches) {
      lastAutoRippleAt = now;
      emitRipple(width * (0.35 + Math.random() * 0.3), height * (0.35 + Math.random() * 0.3), 0.58, now);
    }

    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      if (now - ripples[index].startedAt > 2200) {
        ripples.splice(index, 1);
      }
    }

    drawGrid(now);

    if (!motionQuery.matches) {
      frameId = requestAnimationFrame(render);
    }
  };

  const scheduleRender = () => {
    if (!frameId && isVisible && !document.hidden) {
      frameId = requestAnimationFrame(render);
    }
  };

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (pointer.x === 0 && pointer.y === 0) {
      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.targetX = pointer.x;
      pointer.targetY = pointer.y;
    }

    drawGrid(performance.now());
    scheduleRender();
  };

  const pointerPosition = (event) => {
    const bounds = stage.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    };
  };

  const onPointerMove = (event) => {
    if (motionQuery.matches || event.pointerType === "touch") {
      return;
    }

    const position = pointerPosition(event);
    const now = performance.now();
    const moved = Math.hypot(position.x - pointer.lastX, position.y - pointer.lastY);
    pointer.targetX = position.x;
    pointer.targetY = position.y;
    pointer.targetActivity = 1;

    if (moved > 42 && now - pointer.lastRippleAt > 340) {
      emitRipple(position.x, position.y, 0.48, now);
      pointer.lastRippleAt = now;
      pointer.lastX = position.x;
      pointer.lastY = position.y;
    }

    scheduleRender();
  };

  const onPointerEnter = (event) => {
    if (motionQuery.matches || event.pointerType === "touch") {
      return;
    }

    const position = pointerPosition(event);
    pointer.targetX = position.x;
    pointer.targetY = position.y;
    pointer.lastX = position.x;
    pointer.lastY = position.y;
    pointer.targetActivity = 1;
    scheduleRender();
  };

  const onPointerLeave = () => {
    pointer.targetActivity = 0;
  };

  const onPointerDown = (event) => {
    if (motionQuery.matches) {
      return;
    }

    const position = pointerPosition(event);
    emitRipple(position.x, position.y, 1.05);
    scheduleRender();
  };

  stage.addEventListener("pointerenter", onPointerEnter);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerleave", onPointerLeave);
  stage.addEventListener("pointerdown", onPointerDown);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;

    if (isVisible) {
      scheduleRender();
    } else if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  });
  visibilityObserver.observe(stage);

  const themeObserver = new MutationObserver(() => {
    readColors();
    drawGrid(performance.now());
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  motionQuery.addEventListener("change", () => {
    pointer.targetActivity = 0;
    ripples.length = 0;
    drawGrid(performance.now());
    scheduleRender();
  });

  document.addEventListener("visibilitychange", scheduleRender);
  readColors();
  resize();
})();