# Homepage Opening Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add a full-screen Rowan Shen opening scene whose scroll progress reveals the real homepage from the center of the viewport.

**Architecture:** Insert a two-viewport opening chapter before the existing site. A sticky opening stage remains visible while the real site moves upward from the next viewport; GSAP maps chapter progress to title separation, homepage clip-path expansion, and navigation reveal. Existing project, marquee, theme, language, and contact behavior remain independent.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, GSAP 3.12.5, ScrollTrigger 3.12.5

**Spec:** docs/superpowers/specs/2026-08-23-homepage-opening-reveal-design.md

## Global Constraints

- Preserve the current uncommitted contact-section redesign.
- Keep native wheel and touch scrolling; do not intercept page scroll.
- Do not add dependencies or a smooth-scroll engine.
- Keep dark/light theme and English/Chinese switching functional.
- Keep project autoplay and capability marquee independent of opening progress.
- When GSAP is unavailable, all existing site content must remain visible.
- When reduced motion is requested, use a short static opening and no scroll-scrubbed reveal.
- Use light syntax and manual browser checks rather than a strict test suite, per user preference for this small static page.
- Leave implementation changes local until the user approves the visual result.

---

### Task 1: Add Opening Markup and Copy

**Files:**
- Modify: index.html:50
- Modify: assets/app.js:20-160

**Interfaces:**
- Consumes: existing data-i18n translation binding in setLanguage(lang).
- Produces: data-opening-sequence, data-opening-stage, data-opening-copy, data-opening-title, data-opening-role, data-opening-cue, and data-site-content selectors.

- [ ] **Step 1: Add the opening chapter before the existing page**

Use this structure:

    <section class="opening-sequence" data-opening-sequence aria-labelledby="opening-title">
      <div class="opening-stage" data-opening-stage>
        <div class="opening-frame" aria-hidden="true"></div>
        <div class="opening-copy" data-opening-copy>
          <p class="opening-index">PORTFOLIO / 2026</p>
          <h1 class="opening-title" id="opening-title" data-opening-title>ROWAN SHEN</h1>
          <p class="opening-role" data-opening-role data-i18n="opening.role">Frontend developer shaping clear products with AI.</p>
        </div>
        <div class="opening-scroll-cue" data-opening-cue aria-hidden="true"><span></span></div>
      </div>
    </section>

Immediately after the opening section, insert the opening tag below before the existing scroll-progress element:

    <div class="site-content" data-site-content>

Move the existing scroll-progress element and main.site-shell inside it unchanged, then add its closing div immediately after the existing main closing tag. Remove data-hero-reveal from the topbar because its visibility will belong to the opening timeline.

- [ ] **Step 2: Add translated opening copy**

English dictionary entry:

    "opening.role": "Frontend developer shaping clear products with AI.",

Chinese dictionary entry:

    "opening.role": "用前端与 AI，把复杂产品做得清晰可靠。",

- [ ] **Step 3: Verify markup and copy**

Run:

    rg -n "data-opening|opening\.role|site-content" index.html assets/app.js
    node --check assets/app.js

Expected: all opening selectors and both translations are present; syntax exits 0.

---

### Task 2: Build Opening Geometry and Theme Styling

**Files:**
- Modify: assets/css/layout.css:1-110
- Modify: assets/css/components.css:1-205
- Modify: assets/css/responsive.css:55-180

**Interfaces:**
- Consumes: Task 1 selectors and existing CSS theme tokens.
- Produces: a 200svh desktop chapter, sticky 100svh stage, and site wrapper whose aperture can be animated.

- [ ] **Step 1: Add stable geometry to layout.css**

    .opening-sequence {
      position: relative;
      z-index: 1;
      height: 200svh;
    }

    .opening-stage {
      position: sticky;
      top: 0;
      display: grid;
      place-items: center;
      width: 100%;
      height: 100svh;
      overflow: hidden;
      background: var(--bg);
    }

    .site-content {
      position: relative;
      z-index: 2;
      margin-top: -100svh;
      background: var(--bg);
      clip-path: inset(42% 42% round 8px);
      transform: scale(0.86);
      transform-origin: 50% 0;
      will-change: clip-path, transform;
    }

    html:not(.is-motion-ready) .site-content,
    html[data-reduced-motion="true"] .site-content {
      margin-top: 0;
      clip-path: none;
      transform: none;
    }

The fallback selector prevents hidden content if motion initialization fails.

- [ ] **Step 2: Add the opening visual system to components.css**

    .opening-stage::before {
      position: absolute;
      inset: 0;
      content: "";
      background-image:
        linear-gradient(90deg, var(--line) 1px, transparent 1px),
        linear-gradient(var(--line) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: 0.52;
    }

    .opening-frame {
      position: absolute;
      inset: 18px;
      border: 1px solid var(--line);
      pointer-events: none;
    }

    .opening-copy {
      position: relative;
      z-index: 1;
      width: min(1180px, calc(100% - 80px));
      text-align: center;
    }

    .opening-index,
    .opening-role {
      font-family: "JetBrains Mono", monospace;
      letter-spacing: 0;
    }

    .opening-index {
      margin-bottom: 22px;
      color: var(--cyan);
      font-size: 12px;
      font-weight: 700;
    }

    .opening-title {
      margin: 0;
      color: var(--text);
      font-size: clamp(72px, 12vw, 178px);
      line-height: 0.88;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .opening-role {
      max-width: 620px;
      margin: 30px auto 0;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.6;
    }

    .opening-scroll-cue {
      position: absolute;
      bottom: 34px;
      left: 50%;
      width: 1px;
      height: 54px;
      overflow: hidden;
      background: var(--line);
    }

    .opening-scroll-cue span {
      display: block;
      width: 100%;
      height: 42%;
      background: var(--cyan);
    }

- [ ] **Step 3: Add mobile and reduced-motion rules**

Add these rules to responsive.css:

    @media (max-width: 720px) {
      .opening-sequence { height: 190svh; }
      .opening-copy { width: calc(100% - 40px); }
      .opening-title {
        font-size: clamp(54px, 18vw, 86px);
        line-height: 0.94;
        white-space: normal;
      }
      .site-content { clip-path: inset(38% 28% round 8px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .opening-sequence {
        height: auto;
        min-height: 72svh;
      }
      .opening-stage {
        position: relative;
        min-height: 72svh;
        height: auto;
      }
      .site-content {
        margin-top: 0;
        clip-path: none;
        transform: none;
      }
    }

- [ ] **Step 4: Check selectors and whitespace**

Run:

    rg -n "opening-(sequence|stage|frame|copy|title|role|scroll-cue)|site-content|is-motion-ready" assets/css
    git diff --check

Expected: every selector is present and diff check has no errors.

---

### Task 3: Implement the Scroll-Scrubbed Timeline

**Files:**
- Modify: assets/motion.js:1-515

**Interfaces:**
- Consumes: Task 1 DOM selectors and Task 2 CSS geometry.
- Produces: createOpeningReveal(gsap, ScrollTrigger, options), returning null or an object with destroy().

- [ ] **Step 1: Add createOpeningReveal before createPointerTilt**

Implement the lifecycle with these exact states:

    function createOpeningReveal(gsap, ScrollTrigger, { reduceMotion, mobile }) {
      const root = document.documentElement;
      const sequence = document.querySelector("[data-opening-sequence]");
      const stage = document.querySelector("[data-opening-stage]");
      const site = document.querySelector("[data-site-content]");
      const copy = document.querySelector("[data-opening-copy]");
      const title = document.querySelector("[data-opening-title]");
      const role = document.querySelector("[data-opening-role]");
      const cue = document.querySelector("[data-opening-cue]");
      const nav = document.querySelector(".topbar");

      if (!sequence || !stage || !site || !copy || !title || !role || !cue || !nav) return null;

      if (reduceMotion) {
        root.dataset.reducedMotion = "true";
        gsap.set([site, stage, nav, copy], { clearProps: "all" });
        return {
          destroy() { delete root.dataset.reducedMotion; }
        };
      }

      root.classList.add("is-motion-ready");
      const skipOpening = Boolean(window.location.hash && window.location.hash !== "#top");

      if (skipOpening) {
        gsap.set(site, { clipPath: "inset(0% 0% round 0px)", scale: 1 });
        gsap.set(stage, { autoAlpha: 0 });
        gsap.set(nav, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
        return {
          destroy() { gsap.set([site, stage, nav], { clearProps: "all" }); }
        };
      }

      gsap.set(nav, { autoAlpha: 0, y: -18, pointerEvents: "none" });

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
      .to(site, { clipPath: "inset(0% 0% round 0px)", scale: 1, duration: 0.7, ease: "none" }, 0.16)
      .to(stage, { autoAlpha: 0, duration: 0.22, ease: "none" }, 0.76)
      .to(nav, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.2 }, 0.8);

Finish the function with:

    return {
      destroy() {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        delete root.dataset.reducedMotion;
        gsap.set([stage, site, copy, title, role, cue, nav], { clearProps: "all" });
      }
    };

Keep is-motion-ready after successful initialization so language-triggered motion rebuilds cannot flash the unmasked fallback state.

- [ ] **Step 2: Integrate lifecycle before existing project animation**

Inside rebuildScrollMotion create openingReveal before projectSlider. Call openingReveal.destroy() in both reduced-motion and normal cleanup blocks.

- [ ] **Step 3: Move hero entrance from page load to the reveal ending**

Replace the immediate hero timeline with a top-level ScrollTrigger tied to .hero. Start at top 92%, play once, and animate hero-copy children from autoAlpha 0, y 24 with stagger 0.08. Keep signal-card entry in the same timeline. This prevents hero motion from completing invisibly behind the opening scene.

- [ ] **Step 4: Change module reveals to center-origin expansion**

Each data-section-reveal timeline starts with clipPath inset(16% 12% round 8px), scale 0.94, and autoAlpha 0.32, then animates to clipPath inset(0% 0% round 0px), scale 1, autoAlpha 1. Children follow from y 18 and autoAlpha 0. Keep once true and document order.

- [ ] **Step 5: Handle in-page anchor navigation**

For clicks on links whose href starts with # and does not equal #top, immediately set the reveal timeline to progress 1 before native anchor navigation runs. Register one delegated click listener in createOpeningReveal and remove it in destroy:

    const onAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (link && link.getAttribute("href") !== "#top") timeline.progress(1);
    };

    document.addEventListener("click", onAnchorClick);

This keeps direct navigation and keyboard activation from leaving the opening overlay active over the destination.

- [ ] **Step 6: Check JavaScript syntax**

Run:

    node --check assets/motion.js
    node --check assets/app.js

Expected: both commands exit 0.

---

### Task 4: Verify Integration and Leave a Local Review Build

**Files:**
- Verify: index.html
- Verify: assets/app.js
- Verify: assets/css/layout.css
- Verify: assets/css/components.css
- Verify: assets/css/responsive.css
- Verify: assets/motion.js

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: a locally reviewable opening reveal with no automatic commit or push.

- [ ] **Step 1: Run light static checks**

    node --check assets/app.js
    node --check assets/motion.js
    git diff --check
    git status --short

Expected: syntax checks pass; only intended page files and the preserved contact redesign are modified.

- [ ] **Step 2: Check desktop behavior manually**

At 1440x900, initial view shows only opening copy. Scrolling expands the homepage from the center, navigation appears near completion, and native scrolling continues into Work, Projects, and Contact.

- [ ] **Step 3: Check mobile behavior manually**

At 390x844, the opening title fits, reveal travel is shorter, no text overlaps, and no horizontal overflow appears.

- [ ] **Step 4: Check existing interactions**

Switch language and theme before and after the reveal. Confirm project autoplay, project arrows, capability marquee hover pause, contact email link, and navigation anchors remain functional.

- [ ] **Step 5: Leave changes local**

Do not commit or push implementation until the user approves the resulting page.
