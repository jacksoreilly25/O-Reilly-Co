document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Scroll reveal (staggered) */
  const revealEls = document.querySelectorAll(".value-card, .about-intro, .values-heading, .giving-section");
  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = reduceMotion ? "0s" : `${(i % 3) * 0.12}s`;
  });
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObs.observe(el));

  /* 2. Scroll progress bar */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  /* 5. Header shadow (change "header" if your header uses a different tag) */
  const header = document.querySelector("header");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 3. Active nav link */
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = [...navLinks]
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => navObs.observe(s));

  /* 4. Count-up numbers: use <div class="giving-number" data-count="10" data-suffix="%">0%</div> */
  const counters = document.querySelectorAll("[data-count]");
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = reduceMotion ? 0 : 1400;
      const start = performance.now();
      const tick = now => {
        const p = duration ? Math.min((now - start) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countObs.observe(c));
});

  /* ---------- PROJECT CARDS ---------- */
  const PROJECTS = [
    {
      title: "Specialty Pharma Revenue Dashboard",
      role: "Business Intelligence Analyst",
      date: "March 2026",
      desc: "Interactive Power BI dashboard analyzing 8 quarters of epinephrine auto-injector market data across 3 products. A pandas pipeline in Python builds the clean dataset, and KPI cards, trendlines and slicers show competitive market share.",
      tags: ["Power BI", "Python", "pandas"],
      url: "" // add a link if you publish it
    },
    {
      title: "AAPL Trend & Volatility Tracker",
      role: "Data Engineer / Analyst",
      date: "February 2026",
      desc: "An Azure Data Factory pipeline refreshes the data daily at 99.9% automation, feeding an Azure SQL database with cleaned views covering 40+ years. DAX measures drive risk metrics such as 200-day moving averages and YoY volatility in a Power BI dashboard.",
      tags: ["Azure", "SQL", "DAX", "Power BI"],
      url: ""
    },
    {
      title: "Goldman Sachs Case Competition",
      role: "Internal Audit Analyst",
      date: "October 2026",
      desc: "One of 4 teams selected to act as the internal audit function for a fictitious bank. We presented an audit scope for an AI liquidity forecasting platform and tied each risk to controls like human approval and parallel-run testing.",
      tags: ["Audit", "AI Risk", "Case Competition"],
      url: ""
    },
    {
      title: "Personal Portfolio",
      role: "Designer & Developer",
      date: "Ongoing",
      desc: "My student portfolio site, built with HTML, CSS and JavaScript and hosted on GitHub Pages.",
      tags: ["HTML", "CSS", "JavaScript"],
      url: "https://jacksoreilly25.github.io"
    }
  ];

  const grid = document.getElementById("repo-grid");
  if (grid) {
    PROJECTS.forEach((p, i) => {
      const card = document.createElement(p.url ? "a" : "article");
      card.className = "repo-card";
      if (p.url) {
        card.href = p.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }
      card.style.animationDelay = (i * 0.08) + "s";

      const h = document.createElement("h3");
      h.textContent = p.title;

      const role = document.createElement("p");
      role.className = "repo-role";
      role.textContent = p.role + " · " + p.date;

      const desc = document.createElement("p");
      desc.className = "repo-desc";
      desc.textContent = p.desc;

      const tags = document.createElement("div");
      tags.className = "repo-tags";
      p.tags.forEach(t => {
        const s = document.createElement("span");
        s.textContent = t;
        tags.appendChild(s);
      });

      card.append(h, role, desc, tags);
      grid.appendChild(card);
    });
  }
