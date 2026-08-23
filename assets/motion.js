(() => {
  const { gsap, ScrollTrigger } = window;

  if (!gsap || !ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let motionMedia;
  let motionBuildFrame;
  let scrollRestoreFrame;
  let hasBuiltScrollMotion = false;
  const scrollStorageKey = "rowan-reload-scroll-y";
  const navigationType = performance.getEntriesByType("navigation")[0]?.type;
  let reloadScrollY = 0;

  try {
    reloadScrollY = navigationType === "reload"
      ? Number.parseFloat(sessionStorage.getItem(scrollStorageKey)) || 0
      : 0;
  } catch {
    reloadScrollY = 0;
  }

  window.addEventListener("pagehide", () => {
    try {
      sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }
  });


  function createOpeningReveal(gsap, ScrollTrigger, { reduceMotion, desktop, mobile }) {
    const root = document.documentElement;
    const sequence = document.querySelector("[data-opening-sequence]");
    const stage = document.querySelector("[data-opening-stage]");
    const site = document.querySelector("[data-site-content]");
    const copy = document.querySelector("[data-opening-copy]");
    const title = document.querySelector("[data-opening-title]");
    const role = document.querySelector("[data-opening-role]");
    const cue = document.querySelector("[data-opening-cue]");
    const cueLine = cue?.querySelector("span");
    const hero = document.querySelector(".hero");
    const heroItems = Array.from(document.querySelectorAll(".hero-copy > *"));
    const signalCard = document.querySelector("[data-console-card]");
    const nav = document.querySelector(".topbar");

    if (!sequence || !stage || !site || !copy || !title || !role || !cue || !hero || !signalCard || !nav) {
      return null;
    }

    root.classList.remove("is-opening-skipped");

    if (reduceMotion) {
      root.dataset.reducedMotion = "true";
      gsap.set([site, stage, hero, nav, copy, ...heroItems, signalCard], { clearProps: "all" });

      return {
        destroy() {
          delete root.dataset.reducedMotion;
        }
      };
    }

    delete root.dataset.reducedMotion;
    root.classList.add("is-motion-ready");

    gsap.set(nav, { autoAlpha: 0, y: -18, pointerEvents: "none" });

    const cueTween = cueLine
      ? gsap.fromTo(
          cueLine,
          { yPercent: -120 },
          { yPercent: 260, duration: 1.45, repeat: -1, ease: "none" }
        )
      : null;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sequence,
        start: "top top",
        end: "bottom bottom",
        scrub: mobile ? 0.45 : 0.8,
        invalidateOnRefresh: true
      }
    });

    timeline
      .to(title, { scale: 0.86, yPercent: -26, autoAlpha: 0.18, duration: 0.38 }, 0)
      .to(role, { y: 34, autoAlpha: 0, duration: 0.26 }, 0.08)
      .to(cue, { autoAlpha: 0, scaleY: 0.4, duration: 0.2 }, 0)
      .to(hero, {
        clipPath: "inset(0% 0% round 0px)",
        scale: 1,
        duration: 0.68,
        ease: "none"
      }, 0.14)
      .fromTo(
        heroItems,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.22, ease: "power2.out" },
        0.62
      )
      .fromTo(
        signalCard,
        {
          autoAlpha: 0,
          y: 30,
          scale: 0.96,
          rotationX: desktop ? -6 : 0
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.26,
          ease: "power2.out"
        },
        0.66
      )
      .to(stage, { autoAlpha: 0, duration: 0.22, ease: "none" }, 0.74)
      .to(nav, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.2 }, 0.8);

    const onAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (link && link.getAttribute("href") !== "#top") {
        timeline.progress(1);
      }
    };

    document.addEventListener("click", onAnchorClick);

    return {
      destroy() {
        document.removeEventListener("click", onAnchorClick);
        cueTween?.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
        gsap.set([stage, hero, copy, title, role, cue, nav, ...heroItems, signalCard], {
          clearProps: "all"
        });
      }
    };
  }

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
    const root = document.documentElement;
    const isInitialBuild = !hasBuiltScrollMotion;
    const preservedScrollY = isInitialBuild && reloadScrollY > 1
      ? reloadScrollY
      : window.scrollY;
    const previousScrollBehavior = root.style.scrollBehavior;
    const deepLinkId = isInitialBuild && window.location.hash && window.location.hash !== "#top"
      ? decodeURIComponent(window.location.hash.slice(1))
      : "";
    let hasRestoredScroll = false;

    hasBuiltScrollMotion = true;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const restoreScrollPosition = () => {
      if (hasRestoredScroll) {
        return;
      }

      let targetScrollY = preservedScrollY;
      const deepLinkTarget = deepLinkId ? document.getElementById(deepLinkId) : null;

      if (targetScrollY <= 1 && deepLinkTarget) {
        const scrollMargin = Number.parseFloat(getComputedStyle(deepLinkTarget).scrollMarginTop) || 0;
        targetScrollY = deepLinkTarget.getBoundingClientRect().top - scrollMargin;
      }

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        left: 0,
        behavior: "instant"
      });
      ScrollTrigger.update();
      root.style.scrollBehavior = previousScrollBehavior;
      hasRestoredScroll = true;
    };

    const scheduleScrollRestore = () => {
      cancelAnimationFrame(scrollRestoreFrame);
      scrollRestoreFrame = requestAnimationFrame(restoreScrollPosition);
    };

    cancelAnimationFrame(motionBuildFrame);
    cancelAnimationFrame(scrollRestoreFrame);
    motionBuildFrame = requestAnimationFrame(() => {
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

      const openingReveal = createOpeningReveal(gsap, ScrollTrigger, { reduceMotion, desktop, mobile });
      const projectSlider = createProjectSlider(gsap, { reduceMotion, mobile });
      const capabilityMarquee = createCapabilityMarquee(gsap, { reduceMotion });
      const pointerTilt = createPointerTilt(gsap, { reduceMotion });

      if (reduceMotion) {
        gsap.set("[data-hero-reveal], [data-section-reveal], [data-console-card]", {
          clearProps: "all"
        });
        scheduleScrollRestore();
        return () => {
          openingReveal?.destroy();
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

      gsap.utils.toArray("[data-section-reveal]").forEach((section) => {
        const kind = section.dataset.revealKind || "default";
        let frame = Array.from(section.children).find((child) => child.classList.contains("motion-reveal-frame"));

        if (!frame) {
          frame = document.createElement("span");
          frame.className = "motion-reveal-frame";
          frame.setAttribute("aria-hidden", "true");
          section.append(frame);
        }

        const targetGroups = [];
        const addTargets = (targets) => {
          const items = Array.from(targets || []).filter(Boolean);

          if (items.length > 0) {
            targetGroups.push(...items);
          }

          return items;
        };

        const kicker = section.querySelector(":scope > .section-kicker");
        const heading = section.querySelector("h2");
        const fromState = {
          autoAlpha: 0.08,
          clipPath: "inset(42% 36% round 8px)",
          scale: mobile ? 0.95 : 0.9,
          y: mobile ? 24 : 42,
          rotationX: mobile ? 0 : -8,
          transformPerspective: 1000,
          transformOrigin: "50% 50%"
        };

        if (kind === "heading") {
          Object.assign(fromState, {
            clipPath: "inset(0% 48% round 8px)",
            scale: 0.98,
            y: 18,
            rotationX: 0
          });
        }

        if (kind === "project") {
          Object.assign(fromState, {
            clipPath: "inset(44% 42% round 8px)",
            scale: mobile ? 0.92 : 0.84,
            y: mobile ? 30 : 56,
            rotationX: mobile ? 0 : -12
          });
        }

        if (kind === "capabilities") {
          Object.assign(fromState, {
            clipPath: "inset(34% 4% round 8px)",
            scale: 0.96,
            y: 26,
            rotationX: 0
          });
        }

        if (section.dataset.motionRevealed === "true") {
          gsap.set(section, { clearProps: "transform,opacity,visibility,clipPath,perspective" });
          gsap.set(frame, { autoAlpha: 0 });
          return;
        }

        const reveal = gsap.timeline({ paused: true });

        reveal
          .fromTo(
            section,
            fromState,
            {
              autoAlpha: 1,
              clipPath: "inset(0% 0% round 0px)",
              scale: 1,
              y: 0,
              rotationX: 0,
              transformPerspective: 1000,
              duration: kind === "project" || kind === "contact" ? 1.08 : 0.92,
              ease: "expo.out",
              immediateRender: false
            },
            0
          )
          .fromTo(
            frame,
            { autoAlpha: 0, scaleX: 0.14, scaleY: 0.5 },
            { autoAlpha: 0.92, scaleX: 1, scaleY: 1, duration: 0.44, ease: "expo.out" },
            0.02
          )
          .to(frame, { autoAlpha: 0, duration: 0.34, ease: "power2.out" }, 0.54);

        if (kind === "split") {
          const copy = section.querySelector(".intro-copy");
          const paragraphs = addTargets(copy?.children);
          addTargets([kicker, heading]);

          reveal
            .fromTo(kicker, { autoAlpha: 0, x: -34 }, { autoAlpha: 1, x: 0, duration: 0.42 }, 0.2)
            .fromTo(
              heading,
              { autoAlpha: 0, y: 58, rotationX: mobile ? 0 : -14, transformOrigin: "50% 100%" },
              { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.72, ease: "back.out(1.35)" },
              0.2
            )
            .fromTo(
              paragraphs,
              { autoAlpha: 0, x: mobile ? 0 : 38, y: 26 },
              { autoAlpha: 1, x: 0, y: 0, duration: 0.58, stagger: 0.1, ease: "power3.out" },
              0.34
            );
        }

        if (kind === "heading") {
          const lead = section.querySelector(":scope > div:first-child");
          const leadItems = addTargets(lead?.children);
          const controls = addTargets([section.querySelector(".project-controls")]);

          reveal
            .fromTo(
              leadItems,
              { autoAlpha: 0, y: 42 },
              { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.1, ease: "back.out(1.25)" },
              0.18
            )
            .fromTo(
              controls,
              { autoAlpha: 0, scale: 0.62, rotation: mobile ? 0 : -7 },
              { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.56, ease: "back.out(1.8)" },
              0.36
            );
        }

        if (kind === "project") {
          const stack = addTargets([section.querySelector("[data-project-stack]")]);

          reveal.fromTo(
            stack,
            { autoAlpha: 0, y: mobile ? 34 : 70, scale: 0.9, rotationX: mobile ? 0 : -8 },
            { autoAlpha: 1, y: 0, scale: 1, rotationX: 0, duration: 0.82, ease: "back.out(1.45)" },
            0.28
          );
        }

        if (kind === "capabilities") {
          const cards = addTargets(section.querySelectorAll(".capability"));

          reveal.fromTo(
            cards,
            {
              autoAlpha: 0,
              y: mobile ? 38 : 68,
              scale: 0.84,
              rotationY: (index) => (mobile ? 0 : index % 2 === 0 ? -9 : 9)
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.66,
              stagger: { each: 0.045, from: "center" },
              ease: "back.out(1.55)"
            },
            0.22
          );
        }

        if (kind === "contact") {
          const copyItems = addTargets(section.querySelectorAll(".contact-copy > *"));
          const channelItems = addTargets(section.querySelectorAll(".contact-channel > *"));
          const signals = addTargets(section.querySelectorAll(".contact-signal"));

          reveal
            .fromTo(
              copyItems,
              { autoAlpha: 0, x: mobile ? 0 : -48, y: 26 },
              { autoAlpha: 1, x: 0, y: 0, duration: 0.62, stagger: 0.08, ease: "power3.out" },
              0.22
            )
            .fromTo(
              channelItems,
              { autoAlpha: 0, x: mobile ? 0 : 52, scale: 0.9 },
              { autoAlpha: 1, x: 0, scale: 1, duration: 0.62, stagger: 0.1, ease: "back.out(1.45)" },
              0.34
            )
            .fromTo(
              signals,
              { autoAlpha: 0, scale: 0.2 },
              { autoAlpha: 1, scale: 1, duration: 0.72, stagger: 0.12, ease: "back.out(1.8)" },
              0.38
            );
        }

        reveal.eventCallback("onComplete", () => {
          section.dataset.motionRevealed = "true";
          gsap.set(section, { clearProps: "transform,opacity,visibility,clipPath,perspective" });

          if (targetGroups.length > 0) {
            gsap.set(targetGroups, { clearProps: "transform,opacity,visibility" });
          }

          gsap.set(frame, { autoAlpha: 0 });
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
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
      scheduleScrollRestore();

      sectionRevealAnimations.forEach(({ element, reveal, trigger }) => {
        const bounds = element.getBoundingClientRect();
        const isPartiallyVisible = bounds.top < window.innerHeight && bounds.bottom > 0;
        const hasPassedTrigger = window.scrollY >= trigger.start;

        if (isPartiallyVisible) {
          trigger.kill(false);
          reveal.play(0);
        } else if (hasPassedTrigger) {
          trigger.kill(false);
          reveal.progress(1);
        }
      });
      return () => {
        openingReveal?.destroy();
        projectSlider?.destroy();
        capabilityMarquee?.destroy();
        pointerTilt?.destroy();
      };
      }
    );
    });
  }

  window.rebuildScrollMotion = rebuildScrollMotion;
  rebuildScrollMotion();
})();
