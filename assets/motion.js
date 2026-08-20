(() => {
  const { gsap, ScrollTrigger } = window;

  if (!gsap || !ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let motionMedia;

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

      if (reduceMotion) {
        gsap.set("[data-hero-reveal], [data-section-reveal], [data-console-card], .capability", {
          clearProps: "all"
        });
        gsap.set("[data-capability-loop]", { clearProps: "all" });
        return;
      }

      gsap.defaults({ ease: "power3.out", duration: 0.8 });

      const capabilityLoop = document.querySelector("[data-capability-loop]");
      const capabilitySet = capabilityLoop?.querySelector("[data-capability-set]");
      let capabilityTween;

      const resetCapabilityLoop = () => {
        if (!capabilityLoop || !capabilitySet) {
          return;
        }

        capabilityTween?.kill();
        gsap.set(capabilityLoop, { x: 0 });

        const setGap = Number.parseFloat(getComputedStyle(capabilityLoop).gap) || 0;
        const distance = capabilitySet.offsetWidth + setGap;

        capabilityTween = gsap.to(capabilityLoop, {
          x: -distance,
          duration: Math.max(20, distance / 30),
          ease: "none",
          repeat: -1
        });
      };

      const pauseCapabilityLoop = () => capabilityTween?.pause();
      const playCapabilityLoop = () => capabilityTween?.play();

      if (capabilityLoop && capabilitySet) {
        resetCapabilityLoop();
        capabilityLoop.addEventListener("pointerenter", pauseCapabilityLoop);
        capabilityLoop.addEventListener("pointerleave", playCapabilityLoop);
        capabilityLoop.addEventListener("pointerdown", pauseCapabilityLoop);
        capabilityLoop.addEventListener("pointerup", playCapabilityLoop);
        window.addEventListener("resize", resetCapabilityLoop);
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

      gsap.utils.toArray("[data-section-reveal]").forEach((section) => {
        const reveal = gsap.from(section.children, {
          autoAlpha: 0,
          y: 22,
          scale: 0.995,
          immediateRender: false,
          paused: true,
          duration: 0.68,
          stagger: 0.1,
        });

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

      if (desktop) {
        const skillsSection = document.querySelector("[data-skills-section]");

        const capabilityReveal = gsap.from(".capability", {
          autoAlpha: 0.82,
          y: 16,
          scale: 0.985,
          immediateRender: false,
          paused: true,
          stagger: 0.1,
          duration: 0.68,
        });

        const capabilityTrigger = ScrollTrigger.create({
          trigger: skillsSection,
          start: "top 72%",
          animation: capabilityReveal,
          once: true
        });

        sectionRevealAnimations.push({
          element: skillsSection,
          reveal: capabilityReveal,
          trigger: capabilityTrigger
        });
      }

      if (mobile) {
        ScrollTrigger.batch(".capability", {
          start: "top 82%",
          onEnter: (items) => {
            gsap.fromTo(
              items,
              { autoAlpha: 0.82, y: 16, scale: 0.985 },
              { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, overwrite: true }
            );
          }
        });
      }

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
        capabilityLoop?.removeEventListener("pointerenter", pauseCapabilityLoop);
        capabilityLoop?.removeEventListener("pointerleave", playCapabilityLoop);
        capabilityLoop?.removeEventListener("pointerdown", pauseCapabilityLoop);
        capabilityLoop?.removeEventListener("pointerup", playCapabilityLoop);
        window.removeEventListener("resize", resetCapabilityLoop);
        capabilityTween?.kill();
      };
      }
    );
  }

  window.rebuildScrollMotion = rebuildScrollMotion;
  rebuildScrollMotion();
})();
