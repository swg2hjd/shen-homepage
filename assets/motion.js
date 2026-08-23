(() => {
  const { gsap, ScrollTrigger } = window;

  if (!gsap || !ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let motionMedia;


  function createPointerTilt(gsap, { reduceMotion }) {
    const targets = Array.from(document.querySelectorAll("[data-pointer-tilt]"));

    if (reduceMotion || targets.length === 0) {
      return null;
    }

    const cleanups = targets.map((target) => {
      const rotateX = gsap.quickTo(target, "rotationX", { duration: 0.38, ease: "power3.out" });
      const rotateY = gsap.quickTo(target, "rotationY", { duration: 0.38, ease: "power3.out" });
      const moveX = gsap.quickTo(target, "x", { duration: 0.38, ease: "power3.out" });
      const moveY = gsap.quickTo(target, "y", { duration: 0.38, ease: "power3.out" });

      const onMove = (event) => {
        const bounds = target.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        rotateX(y * -4);
        rotateY(x * 5);
        moveX(x * 5);
        moveY(y * 4);
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        moveX(0);
        moveY(0);
      };

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", reset);

      return () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerleave", reset);
        gsap.killTweensOf(target);
        gsap.set(target, { clearProps: "transform" });
      };
    });

    return {
      destroy() {
        cleanups.forEach((cleanup) => cleanup());
      }
    };
  }

  function createCapabilityMarquee(gsap, { reduceMotion }) {
    const track = document.querySelector("[data-capability-track]");
    const loop = track?.querySelector("[data-capability-loop]");
    const set = loop?.querySelector("[data-capability-set]");

    if (!track || !loop || !set) {
      return null;
    }

    let tween;

    const reset = () => {
      tween?.kill();
      gsap.set(loop, { x: 0 });

      if (reduceMotion) {
        return;
      }

      const gap = Number.parseFloat(getComputedStyle(loop).gap) || 0;
      const distance = set.offsetWidth + gap;

      tween = gsap.to(loop, {
        x: -distance,
        duration: Math.max(22, distance / 34),
        ease: "none",
        repeat: -1
      });
    };

    const pause = () => tween?.pause();
    const play = () => tween?.play();

    reset();
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", play);
    track.addEventListener("pointerdown", pause);
    track.addEventListener("pointerup", play);
    window.addEventListener("resize", reset);

    return {
      destroy() {
        track.removeEventListener("pointerenter", pause);
        track.removeEventListener("pointerleave", play);
        track.removeEventListener("pointerdown", pause);
        track.removeEventListener("pointerup", play);
        window.removeEventListener("resize", reset);
        tween?.kill();
        gsap.set(loop, { clearProps: "all" });
      }
    };
  }

  function createProjectSlider(gsap, { reduceMotion, mobile }) {
    const stage = document.querySelector("[data-project-stage]");
    const stack = stage?.querySelector("[data-project-stack]");
    const cards = stack ? Array.from(stack.querySelectorAll("[data-project-card]")) : [];
    const previousButton = document.querySelector("[data-project-prev]");
    const nextButton = document.querySelector("[data-project-next]");
    const currentNode = document.querySelector("[data-project-current]");

    if (!stage || !stack || cards.length === 0) {
      return null;
    }

    let current = 0;
    let autoplayTimer;
    let dragStartX = 0;
    let isDragging = false;
    let wheelLocked = false;

    const positionFor = (relative) => {
      const previous = cards.length - 1;
      const side = mobile ? 42 : 43;
      const previousSide = mobile ? -142 : -143;

      if (relative === 0) {
        return { xPercent: -50, y: 0, scale: 1, autoAlpha: 1, rotation: 0, zIndex: 5 };
      }

      if (relative === 1) {
        return { xPercent: side, y: 28, scale: 0.9, autoAlpha: 0.72, rotation: 2, zIndex: 3 };
      }

      if (relative === previous) {
        return { xPercent: previousSide, y: 28, scale: 0.9, autoAlpha: 0.72, rotation: -2, zIndex: 3 };
      }

      if (relative === 2) {
        return { xPercent: 124, y: 54, scale: 0.78, autoAlpha: 0.26, rotation: 4, zIndex: 1 };
      }

      if (relative === cards.length - 2) {
        return { xPercent: -224, y: 54, scale: 0.78, autoAlpha: 0.26, rotation: -4, zIndex: 1 };
      }

      return { xPercent: -50, y: 72, scale: 0.72, autoAlpha: 0, rotation: 0, zIndex: 0 };
    };

    const updateCounter = () => {
      if (currentNode) {
        currentNode.textContent = String(current + 1).padStart(2, "0");
      }
    };

    const pauseAutoplay = () => {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = undefined;
    };

    const scheduleAutoplay = () => {
      pauseAutoplay();

      if (reduceMotion) {
        return;
      }

      autoplayTimer = window.setTimeout(() => {
        render(current + 1);
      }, 4600);
    };

    const render = (nextIndex, immediate = false) => {
      current = (nextIndex + cards.length) % cards.length;
      updateCounter();

      cards.forEach((card, index) => {
        const relative = (index - current + cards.length) % cards.length;
        const position = positionFor(relative);
        const isActive = relative === 0;

        card.classList.toggle("is-active", isActive);
        card.style.pointerEvents = relative <= 1 || relative === cards.length - 1 ? "auto" : "none";
        card.querySelectorAll("a").forEach((link) => {
          link.tabIndex = isActive ? 0 : -1;
        });

        gsap.to(card, {
          ...position,
          duration: immediate || reduceMotion ? 0 : 0.72,
          ease: "power3.out",
          overwrite: true
        });
      });

      scheduleAutoplay();
    };

    const showPrevious = () => render(current - 1);
    const showNext = () => render(current + 1);

    const onCardClick = (event) => {
      if (event.target.closest("a")) {
        return;
      }

      const card = event.currentTarget;
      const index = cards.indexOf(card);

      if (index !== current) {
        render(index);
      }
    };

    const onPointerDown = (event) => {
      if (event.target.closest("a") || event.button > 0) {
        return;
      }

      isDragging = true;
      dragStartX = event.clientX;
      pauseAutoplay();
      stage.setPointerCapture?.(event.pointerId);
    };

    const onPointerUp = (event) => {
      if (!isDragging) {
        return;
      }

      const distance = event.clientX - dragStartX;
      isDragging = false;

      if (Math.abs(distance) > 42) {
        distance > 0 ? showPrevious() : showNext();
      } else {
        scheduleAutoplay();
      }
    };

    const onPointerCancel = () => {
      isDragging = false;
      scheduleAutoplay();
    };

    const onWheel = (event) => {
      if (wheelLocked || Math.abs(event.deltaY) < 18) {
        return;
      }

      event.preventDefault();
      wheelLocked = true;
      event.deltaY > 0 ? showNext() : showPrevious();
      window.setTimeout(() => {
        wheelLocked = false;
      }, 720);
    };

    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === "Home") {
        event.preventDefault();
        render(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        render(cards.length - 1);
      }
    };

    const onEnter = () => pauseAutoplay();
    const onLeave = () => scheduleAutoplay();

    previousButton?.addEventListener("click", showPrevious);
    nextButton?.addEventListener("click", showNext);
    cards.forEach((card) => card.addEventListener("click", onCardClick));
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerCancel);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKeyDown);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("focusin", onEnter);
    stage.addEventListener("focusout", onLeave);

    render(0, true);

    return {
      destroy() {
        pauseAutoplay();
        previousButton?.removeEventListener("click", showPrevious);
        nextButton?.removeEventListener("click", showNext);
        cards.forEach((card) => {
          card.removeEventListener("click", onCardClick);
          gsap.killTweensOf(card);
          gsap.set(card, { clearProps: "all" });
        });
        stage.removeEventListener("pointerdown", onPointerDown);
        stage.removeEventListener("pointerup", onPointerUp);
        stage.removeEventListener("pointercancel", onPointerCancel);
        stage.removeEventListener("wheel", onWheel);
        stage.removeEventListener("keydown", onKeyDown);
        stage.removeEventListener("pointerenter", onEnter);
        stage.removeEventListener("pointerleave", onLeave);
        stage.removeEventListener("focusin", onEnter);
        stage.removeEventListener("focusout", onLeave);
      }
    };
  }

  function rebuildScrollMotion() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
    motionMedia?.revert();
    motionMedia = gsap.matchMedia();

    motionMedia.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 901px)",
        mobile: "(max-width: 900px)"
      },
      (context) => {
      const { reduceMotion, desktop, mobile } = context.conditions;

      const projectSlider = createProjectSlider(gsap, { reduceMotion, mobile });
      const capabilityMarquee = createCapabilityMarquee(gsap, { reduceMotion });
      const pointerTilt = createPointerTilt(gsap, { reduceMotion });

      if (reduceMotion) {
        gsap.set("[data-hero-reveal], [data-section-reveal], [data-console-card]", {
          clearProps: "all"
        });
        return () => {
          projectSlider?.destroy();
          capabilityMarquee?.destroy();
          pointerTilt?.destroy();
        };
      }

      gsap.defaults({ ease: "power3.out", duration: 0.8 });

      const scrollProgress = document.querySelector("[data-scroll-progress]");

      if (scrollProgress) {
        gsap.to(scrollProgress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "max",
            scrub: 0.35
          }
        });
      }

      gsap
        .timeline()
        .from("[data-hero-reveal]", {
          autoAlpha: 0,
          y: 28,
          stagger: 0.09,
          duration: 0.72
        })
        .from(
          "[data-console-card]",
          {
            autoAlpha: 0,
            y: 34,
            scale: 0.96,
            rotationX: desktop ? -8 : 0,
            transformOrigin: "50% 70%",
            duration: 0.9
          },
          "<0.16"
        );

      gsap.to(".console-scan", {
        yPercent: 145,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8
        }
      });

      gsap.to(".console-art", {
        scale: desktop ? 1.05 : 1.02,
        y: desktop ? -18 : -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".console-orbit", {
        y: (index) => (index === 0 ? -18 : 16),
        x: (index) => (index === 0 ? 12 : -14),
        scale: 1.28,
        repeat: -1,
        yoyo: true,
        duration: 2.6,
        stagger: 0.35,
        ease: "sine.inOut"
      });

      document.querySelectorAll(".stat-number").forEach((stat) => {
        const target = Number(stat.dataset.countTo || 0);
        const suffix = stat.dataset.countSuffix || "";
        const value = { current: 0 };

        gsap.to(value, {
          current: target,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 84%",
            once: true
          },
          onUpdate() {
            stat.textContent = `${Math.round(value.current)}${suffix}`;
          }
        });
      });

      const sectionRevealAnimations = [];

      gsap.utils.toArray("[data-section-reveal]").forEach((section, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const reveal = gsap.timeline({ paused: true });

        reveal
          .from(section, {
            clipPath: "inset(0 0 10% 0)",
            immediateRender: false,
            duration: 0.82,
            ease: "power3.inOut"
          })
          .from(section.children, {
            autoAlpha: 0,
            x: direction * 18,
            y: 24,
            scale: 0.99,
            immediateRender: false,
            duration: 0.66,
            stagger: 0.1,
            ease: "power3.out"
          }, "-=0.42");

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 78%",
          animation: reveal,
          once: true
        });

        sectionRevealAnimations.push({
          element: section,
          reveal,
          trigger
        });
      });

      ScrollTrigger.refresh();

      sectionRevealAnimations.forEach(({ element, reveal, trigger }) => {
        const bounds = element?.getBoundingClientRect();
        const isPartiallyVisible = bounds && bounds.top < window.innerHeight && bounds.bottom > 0;
        const hasPassedTrigger = window.scrollY >= trigger.start;

        if (isPartiallyVisible || hasPassedTrigger) {
          trigger.kill(false);
          reveal.restart();
        }
      });

      return () => {
        projectSlider?.destroy();
        capabilityMarquee?.destroy();
        pointerTilt?.destroy();
      };
      }
    );
  }

  window.rebuildScrollMotion = rebuildScrollMotion;
  rebuildScrollMotion();
})();
