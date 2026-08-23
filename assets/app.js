(() => {
  const root = document.documentElement;
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // The controls still work for the current page when storage is unavailable.
      }
    }
  };

  const copy = {
    en: {
      metaDescription:
        "Rowan Shen is a frontend developer and AI builder with 5+ years of experience across large-scale web projects.",
      title: "Rowan Shen | Frontend Developer & AI Builder",
      controls: {
        languageAria: "Switch language",
        themeAria: "Switch color theme",
        english: "English",
        chinese: "Chinese"
      },
      text: {
        "brand.name": "Rowan Shen",
        "nav.work": "Work",
        "nav.skills": "Skills",
        "nav.contact": "Contact",
        "hero.eyebrow": "Frontend Developer / AI Builder",
        "hero.title": "I turn complex product ideas into clear, reliable web experiences.",
        "hero.body":
          "I design and build frontend systems for products that need both speed and judgment — from responsive interfaces and component systems to AI-assisted workflows.",
        "hero.email": "Email me",
        "hero.profile": "View profile",
        "stats.years": "years frontend",
        "stats.projects": "large-scale projects",
        "work.kicker": "Selected Focus",
        "work.title": "Practical engineering for modern product teams.",
        "work.bodyOne":
          "My work spans responsive interfaces, component systems, complex business flows, and AI-assisted product experiments. I like teams that value clarity, velocity, and thoughtful user experience.",
        "work.bodyTwo":
          "I care about pages that feel sharp but still useful: clear structure, smooth motion, readable copy, and details that make the experience easier to trust.",
        "projects.kicker": "Selected Work",
        "projects.title": "Selected projects, shaped around clear product outcomes.",
        "projects.previous": "Previous project",
        "projects.next": "Next project",
        "projects.stageLabel": "Project showcase",
        "projects.cta": "Discuss a similar build",
        "skills.frontend.title": "Frontend Architecture",
        "skills.frontend.body": "Reusable components, stateful product flows, performance-minded UI, and maintainable delivery habits.",
        "skills.ai.title": "AI Product Building",
        "skills.ai.body": "AI-assisted workflows, prompt-driven interfaces, automation ideas, and fast prototype-to-product cycles.",
        "skills.delivery.title": "Large Project Delivery",
        "skills.delivery.body": "Experience across complex systems where consistency, communication, and careful details matter.",
        "skills.product.title": "Product Thinking",
        "skills.product.body": "Turning vague goals into clear user flows, useful priorities, and decisions a team can ship.",
        "skills.interaction.title": "Interaction Craft",
        "skills.interaction.body": "Polishing states, motion, feedback, and edge cases so interfaces feel natural under real use.",
        "projects.one.type": "Product interface",
        "projects.one.title": "Atlas Workspace",
        "projects.one.body":
          "A focused dashboard concept that turns complex operations into a clear daily flow.",
        "projects.two.type": "AI workflow",
        "projects.two.title": "Signal Copilot",
        "projects.two.body":
          "An AI-assisted workspace concept for turning rough input into useful next steps.",
        "projects.three.type": "Platform system",
        "projects.three.title": "Flowbase Platform",
        "projects.three.body":
          "A component-led product foundation designed for consistent teams and faster delivery.",
        "projects.four.type": "Responsive experience",
        "projects.four.title": "Northstar Commerce",
        "projects.four.body":
          "A responsive commerce journey balancing discovery, trust, and decisive interaction.",
        "projects.five.type": "Interaction study",
        "projects.five.title": "Motion Notes",
        "projects.five.body":
          "A small interaction study exploring calm transitions, feedback, and meaningful detail.",
        "contact.kicker": "Contact",
        "contact.title": "Open to thoughtful frontend and AI collaborations.",
        "controls.english": "English",
        "controls.chinese": "Chinese"
      }
    },
    zh: {
      metaDescription: "Rowan Shen 是一名专注前端与 AI 产品构建的开发者，拥有 5 年以上大型项目经验。",
      title: "Rowan Shen | 前端开发者与 AI 产品构建者",
      controls: {
        languageAria: "切换语言",
        themeAria: "切换浅色或深色主题",
        english: "English",
        chinese: "中文"
      },
      text: {
        "brand.name": "Rowan Shen",
        "nav.work": "经历",
        "nav.skills": "能力",
        "nav.contact": "联系",
        "hero.eyebrow": "前端开发者 / AI 产品构建者",
        "hero.title": "复杂产品，我来做成清晰体验。",
        "hero.body":
          "我为需要速度与判断力的产品设计并构建前端系统，覆盖响应式界面、组件系统与 AI 辅助工作流。",
        "hero.email": "联系我",
        "hero.profile": "查看介绍",
        "stats.years": "年前端经验",
        "stats.projects": "大型项目",
        "work.kicker": "核心方向",
        "work.title": "面向现代产品团队的务实工程能力。",
        "work.bodyOne":
          "我的工作覆盖响应式界面、组件系统、复杂业务流程和 AI 辅助产品实验。我喜欢与重视清晰表达、交付速度和用户体验细节的团队协作。",
        "work.bodyTwo": "我更在意页面是否既有质感又好用：结构清晰、动效顺滑、文案可读，细节能让体验更值得信任。",
        "projects.kicker": "项目预览",
        "projects.title": "用清晰的产品结果，呈现我参与的项目。",
        "projects.previous": "上一个项目",
        "projects.next": "下一个项目",
        "projects.stageLabel": "项目展示",
        "projects.cta": "聊聊类似项目",
        "skills.frontend.title": "前端架构",
        "skills.frontend.body": "可复用组件、有状态的产品流程、性能意识，以及可维护的交付习惯。",
        "skills.ai.title": "AI 产品构建",
        "skills.ai.body": "AI 辅助工作流、提示词驱动界面、自动化想法，以及从原型到产品的快速推进。",
        "skills.delivery.title": "大型项目交付",
        "skills.delivery.body": "在复杂系统中积累的经验，重视一致性、沟通质量和关键细节。",
        "skills.product.title": "产品思维",
        "skills.product.body": "把模糊目标整理成清晰的用户路径、优先级和可落地的产品决策。",
        "skills.interaction.title": "交互细节",
        "skills.interaction.body": "打磨状态、动效、反馈与边界场景，让界面在真实使用中自然可靠。",
        "projects.one.type": "产品界面",
        "projects.one.title": "Atlas 工作台",
        "projects.one.body": "一个聚焦效率的仪表盘概念，把复杂操作整理成清晰的日常工作流。",
        "projects.two.type": "AI 工作流",
        "projects.two.title": "Signal Copilot",
        "projects.two.body": "一个 AI 辅助工作空间概念，把模糊输入整理成有用的下一步行动。",
        "projects.three.type": "平台系统",
        "projects.three.title": "Flowbase 平台",
        "projects.three.body": "以组件系统为基础的产品底座，帮助团队保持一致并更快交付。",
        "projects.four.type": "响应式体验",
        "projects.four.title": "Northstar Commerce",
        "projects.four.body": "一个平衡探索、信任与明确行动的响应式电商体验概念。",
        "projects.five.type": "交互研究",
        "projects.five.title": "Motion Notes",
        "projects.five.body": "一组小型交互实验，探索克制的过渡、反馈和有意义的细节。",
        "contact.kicker": "联系",
        "contact.title": "欢迎交流前端与 AI 方向的认真合作。",
        "controls.english": "English",
        "controls.chinese": "中文"
      }
    }
  };

  const getLang = () => (root.dataset.lang === "zh" ? "zh" : "en");
  const getTheme = () => (root.dataset.theme === "light" ? "light" : "dark");
  let languageCloseTimer;

  function setTheme(theme, options = {}) {
    const nextTheme = theme === "light" ? "light" : "dark";

    if (options.animate && nextTheme !== getTheme()) {
      transitionTheme(nextTheme, options.source);
      return;
    }

    applyTheme(nextTheme);
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    storage.set("rowan-theme", theme);
    updateControls();
  }

  function setLanguage(lang) {
    const dictionary = copy[lang] || copy.en;

    root.dataset.lang = lang;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = dictionary.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", dictionary.metaDescription);
    }

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      const value = dictionary.text[key];

      if (value) {
        node.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      const value = dictionary.text[node.dataset.i18nAria];

      if (value) {
        node.setAttribute("aria-label", value);
      }
    });

    storage.set("rowan-lang", lang);
    updateControls();
    closeLanguageMenu();
    refreshAfterLanguageChange();
  }

  function toggleLanguageMenu(forceOpen, options = {}) {
    const langToggle = document.querySelector("[data-lang-toggle]");
    const langMenu = document.querySelector("[data-lang-menu]");

    if (!langToggle || !langMenu) {
      return;
    }

    const isOpen = langToggle.getAttribute("aria-expanded") === "true";
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !isOpen;

    langToggle.setAttribute("aria-expanded", String(shouldOpen));
    langMenu.hidden = !shouldOpen;
    langMenu.classList.toggle("is-open", shouldOpen);

    if (shouldOpen && options.focusSelected) {
      langMenu.querySelector(`[data-lang-option="${getLang()}"]`)?.focus();
    }
  }

  function closeLanguageMenu() {
    window.clearTimeout(languageCloseTimer);
    toggleLanguageMenu(false);
  }

  function openLanguageMenu(options = {}) {
    window.clearTimeout(languageCloseTimer);
    toggleLanguageMenu(true, options);
  }

  function scheduleLanguageMenuClose() {
    window.clearTimeout(languageCloseTimer);
    languageCloseTimer = window.setTimeout(closeLanguageMenu, 140);
  }

  function transitionTheme(nextTheme, trigger) {
    const updateTheme = () => applyTheme(nextTheme);

    if (
      !document.startViewTransition ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      updateTheme();
      return;
    }

    const transition = document.startViewTransition(updateTheme);

    transition.ready
      .then(() => {
        if (!document.documentElement.animate) {
          return;
        }

        const rect = trigger?.getBoundingClientRect();
        const clientX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const clientY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        const endRadius = Math.hypot(
          Math.max(clientX, window.innerWidth - clientX),
          Math.max(clientY, window.innerHeight - clientY)
        );
        const isDarkening = nextTheme === "dark";
        const clipPath = [
          `circle(0px at ${clientX}px ${clientY}px)`,
          `circle(${endRadius}px at ${clientX}px ${clientY}px)`
        ];

        document.documentElement.animate(
          {
            clipPath: isDarkening ? clipPath.reverse() : clipPath
          },
          {
            duration: 450,
            easing: "ease-in",
            pseudoElement: isDarkening
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)"
          }
        );
      })
      .catch(() => {
        // The theme has already been applied; only the optional transition failed.
      });

  }

  function refreshAfterLanguageChange() {
    const scrollTrigger = window.ScrollTrigger;

    if (!scrollTrigger) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (typeof window.rebuildScrollMotion === "function") {
          window.rebuildScrollMotion();
          return;
        }

        scrollTrigger.refresh();
      });
    });
  }

  function updateControls() {
    const lang = getLang();
    const theme = getTheme();
    const controls = copy[lang].controls;
    const langToggle = document.querySelector("[data-lang-toggle]");
    const themeToggle = document.querySelector("[data-theme-toggle]");

    if (langToggle) {
      langToggle.setAttribute("aria-label", controls.languageAria);
      langToggle.setAttribute("title", controls.languageAria);
      langToggle.removeAttribute("aria-pressed");
    }

    document.querySelectorAll("[data-lang-option]").forEach((option) => {
      const isSelected = option.dataset.langOption === lang;
      option.setAttribute("aria-checked", String(isSelected));
      option.classList.toggle("is-selected", isSelected);
    });

    if (themeToggle) {
      themeToggle.setAttribute("aria-label", controls.themeAria);
      themeToggle.setAttribute("title", controls.themeAria);
      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
      themeToggle.dataset.state = theme;
    }
  }

  function boot() {
    const savedTheme = storage.get("rowan-theme");
    const savedLang = storage.get("rowan-lang");
    const languageControl = document.querySelector("[data-language-control]");

    setTheme(savedTheme === "light" ? "light" : "dark");
    setLanguage(savedLang === "zh" ? "zh" : "en");

    languageControl?.addEventListener("pointerenter", () => {
      openLanguageMenu();
    });

    languageControl?.addEventListener("pointerleave", () => {
      scheduleLanguageMenuClose();
    });

    languageControl?.addEventListener("focusin", () => {
      openLanguageMenu();
    });

    languageControl?.addEventListener("focusout", (event) => {
      if (!languageControl.contains(event.relatedTarget)) {
        closeLanguageMenu();
      }
    });

    document.querySelector("[data-lang-toggle]")?.addEventListener("click", () => {
      openLanguageMenu({ focusSelected: true });
    });

    document.querySelectorAll("[data-lang-option]").forEach((option) => {
      option.addEventListener("click", () => {
        setLanguage(option.dataset.langOption);
      });
    });

    document.querySelector("[data-theme-toggle]")?.addEventListener("click", (event) => {
      setTheme(getTheme() === "dark" ? "light" : "dark", {
        animate: true,
        source: event.currentTarget
      });
    });

    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest("[data-language-control]")) {
        closeLanguageMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLanguageMenu();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
