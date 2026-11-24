/* =========================================================
   林深 · 个人主页 — 交互脚本
   原生 JS，无依赖。所有效果都是渐进增强：
   关掉 JS 页面依然可读可点。
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 主题切换（记住选择） ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}

  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }

  function syncThemeMeta() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var dark = root.getAttribute("data-theme") !== "light";
    meta.setAttribute("content", dark ? "#0a0e14" : "#f7f9fc");
  }
  syncThemeMeta();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncThemeMeta();
    });
  }

  /* ---------- 2. 滚动：进度条 + 导航态 ---------- */
  var progress = document.querySelector(".scroll-progress");
  var nav = document.getElementById("nav");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("scrolled", y > 24);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- 3. 跟随光晕（仅桌面指针） ---------- */
  var glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var cx = gx, cy = gy, glowRaf = null;

    window.addEventListener("pointermove", function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add("on");
      if (!glowRaf) glowRaf = requestAnimationFrame(follow);
    }, { passive: true });

    function follow() {
      cx += (gx - cx) * 0.09;
      cy += (gy - cy) * 0.09;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) {
        glowRaf = requestAnimationFrame(follow);
      } else {
        glowRaf = null;
      }
    }
  }

  /* ---------- 4. 滚动显现 ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. 复制邮箱 ---------- */
  var toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);
  var toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1900);
  }

  var copyBtn = document.getElementById("copyMail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-mail") || "";
      var done = function () { showToast("邮箱已复制 :)"); };
      var fail = function () { showToast("复制失败，请手动选择：" + text); };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          legacyCopy(text) ? done() : fail();
        });
      } else {
        legacyCopy(text) ? done() : fail();
      }
    });
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ---------- 6. 年份 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 7. 锚点平滑滚动（Safari 兼容兜底） ---------- */
  if (!reduceMotion && !("scrollBehavior" in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
      });
    });
  }
})();
