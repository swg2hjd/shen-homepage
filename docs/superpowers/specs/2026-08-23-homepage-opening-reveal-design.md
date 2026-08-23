# Homepage Opening Reveal Design

Date: 2026-08-23
Status: Approved direction, pending implementation review

## Goal

Turn the current portfolio opening into a cinematic but usable introduction. On first view, visitors see a full-screen Rowan Shen title scene. As they scroll, a window expands from the center of the viewport and reveals the existing homepage beneath it. The site then continues with normal document scrolling.

The effect should feel deliberate and premium without turning the portfolio into a locked presentation. Existing theme switching, language switching, project slideshow, capability marquee, contact section, keyboard navigation, and GitHub Pages deployment must continue to work.

## Experience Structure

The page gains one new opening stage before the existing site content:

1. The opening stage occupies the first scroll chapter and is pinned on desktop.
2. A large ROWAN SHEN title, a concise role line, and a subtle scroll cue are visible at progress zero.
3. During the first part of the scroll, the title separates slightly, scales down, and loses opacity.
4. A centered rectangular aperture expands outward, revealing the existing homepage underneath.
5. The primary navigation becomes visible during the final portion of the reveal.
6. After the aperture reaches the viewport edges, the opening stage unpins and native page scrolling continues.
7. Existing content modules use a quieter center-origin reveal as they enter the viewport.

## Visual Direction

The opening stage inherits the active dark or light theme instead of introducing a third palette. It uses the existing cyan, blue, text, muted text, line, and page background tokens.

Typography keeps the current Inter and JetBrains Mono pairing. ROWAN SHEN is the only oversized display treatment. Supporting text remains compact so the title owns the opening frame.

The signature motion is the center aperture. It starts as a small framed window with the site's grid visible inside, then expands to become the whole viewport. Decorative elements are limited to a fine frame, a small status label, and the existing grid language.

## DOM Structure

Add an opening wrapper before the current site shell:

- opening-sequence: scroll chapter and ScrollTrigger trigger.
- opening-stage: pinned full-viewport visual layer.
- opening-title: Rowan Shen display text.
- opening-role: frontend and AI role line, translated with the current dictionary.
- opening-window: centered aperture whose clip path or dimensions reveal the page preview.
- opening-scroll-cue: small semantic-free visual cue.

Wrap the current site shell in site-content so the opening stage can reveal it as one composed layer without changing the ownership of existing sections.

## Motion Timeline

Use one top-level GSAP timeline with one ScrollTrigger. The pinned element is opening-stage; animation targets are its children.

Desktop timeline:

- Trigger: opening-sequence
- Start: top top
- End: 140% of viewport height
- Pin: opening-stage
- Scrub: 0.8
- Phase 1, 0%-28%: title and role settle, then begin separating vertically.
- Phase 2, 20%-78%: the aperture expands from the center to the viewport edges.
- Phase 3, 62%-92%: opening copy fades and the navigation enters from above.
- Phase 4, 88%-100%: the opening frame and overlay reach zero opacity; normal content is fully interactive.

The aperture animation uses transform and clip-path values only. Layout dimensions are stable while scrolling, avoiding repeated layout calculation.

Module reveals use independent top-level ScrollTriggers in document order. Each module begins slightly scaled down with a centered inset clip path, then expands to its resting state. Text children follow with a short stagger. These reveals play once to prevent repeated hiding when visitors scroll back upward.

## Interaction Rules

- Native wheel and touch scrolling remain available throughout.
- Header links remain non-interactive until the opening reveal is nearly complete.
- Anchor navigation skips cleanly to the requested section and completes the opening state when necessary.
- Language changes rebuild ScrollTrigger measurements after translated text settles.
- Theme changes update the opening stage through the existing CSS variables and view-transition behavior.
- Project slideshow autoplay and capability marquee start normally after initialization; they are not tied to opening progress.

## Responsive Behavior

Desktop and wide tablet use the pinned reveal.

At widths below 720px:

- The opening scroll chapter is shorter, 90% of viewport height.
- The aperture begins larger and expands with less travel.
- Title scale is reduced and constrained to prevent wrapping beyond three lines.
- The stage may pin for a shorter duration but still uses native scrolling.
- Pointer-only effects remain disabled on touch-first devices.

## Reduced Motion

When prefers-reduced-motion is active:

- Do not pin the opening stage.
- Show the opening title briefly as a normal static section.
- Render the site content and navigation fully visible.
- Disable clip-path scrubbing, title separation, and center-origin module reveals.
- Keep all content and controls keyboard accessible.

## Failure Handling

If GSAP or ScrollTrigger fails to load, CSS fallback rules show the site content immediately and place the opening stage in normal flow. No content remains hidden through CSS alone.

JavaScript adds an is-motion-ready class only after the opening timeline is initialized. Animation-only hidden states are scoped beneath that class.

## Files Affected

- index.html: opening stage and site-content wrapper.
- assets/app.js: English and Chinese opening copy.
- assets/css/layout.css: opening chapter and stable viewport geometry.
- assets/css/components.css: opening typography, aperture, frame, and scroll cue.
- assets/css/responsive.css: mobile opening behavior.
- assets/motion.js: opening timeline, anchor handling, module reveal refinement, and cleanup.

## Verification

Use proportionate checks for this small static site:

- JavaScript syntax checks for assets/app.js and assets/motion.js.
- Confirm no content is hidden when GSAP is unavailable or reduced motion is enabled.
- Check desktop and mobile viewport layout manually.
- Check language and theme switches before, during, and after the reveal.
- Confirm project autoplay, capability marquee, contact email link, and navigation anchors still work.

## Out of Scope

- Replacing native scrolling with a custom smooth-scroll engine.
- Full-page slide snapping or wheel interception.
- Audio effects.
- Rewriting existing project or contact content.
- Changing GitHub Pages deployment.
