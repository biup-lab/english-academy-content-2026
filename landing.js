/* ============================================
   2026 초등 영어학원 — Landing page JS
   ============================================ */

(function () {
  const DATA = window.MONTHLY_DATA;
  const INTENSITY = window.MONTHLY_INTENSITY;

  /* ----- 1. Render the seasonality chart ----- */
  const chartEl = document.getElementById("chart");
  const chartMonthsEl = document.getElementById("chartMonths");
  if (chartEl && chartMonthsEl) {
    const maxV = Math.max(...INTENSITY.map((d) => d.intensity));
    INTENSITY.forEach((d) => {
      const bar = document.createElement("div");
      const tier =
        d.intensity >= 90
          ? "bar-peak"
          : d.intensity >= 75
          ? "bar-high"
          : d.intensity >= 60
          ? "bar-mid"
          : "bar-low";
      bar.className = `bar ${tier}`;
      bar.style.height = `${(d.intensity / maxV) * 100}%`;
      bar.innerHTML = `<span class="bar-val">${d.intensity}</span>`;
      bar.dataset.month = d.m;
      bar.addEventListener("click", () => {
        activateMonth(d.m);
        document
          .getElementById("calendar")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });
      chartEl.appendChild(bar);

      const mLabel = document.createElement("div");
      mLabel.className = "chart-month";
      mLabel.innerHTML = `${d.m}월<span class="mode">${d.mode}</span>`;
      chartMonthsEl.appendChild(mLabel);
    });
  }

  /* ----- 2. Build calendar tabs + panel ----- */
  const tabsEl = document.getElementById("calTabs");
  const panelEl = document.getElementById("calPanel");

  function buildTabs() {
    DATA.forEach((month) => {
      const intensity = INTENSITY.find((i) => i.m === month.month);
      const tab = document.createElement("button");
      tab.className = "cal-tab";
      tab.dataset.month = month.month;
      tab.innerHTML = `
        <span class="tab-dot mode-${intensity.mode}"></span>
        <span class="tab-month">${month.month}월</span>
        <span class="tab-mode">${intensity.mode}</span>
      `;
      tab.addEventListener("click", () => activateMonth(month.month));
      tabsEl.appendChild(tab);
    });
  }

  function renderPanel(monthNum) {
    const m = DATA.find((d) => d.month === monthNum);
    if (!m) return;
    const intensity = INTENSITY.find((i) => i.m === monthNum);

    const itemsHTML = m.items
      .map((it, idx) => {
        const isLastRow =
          idx >= m.items.length - 2 - (m.items.length % 2 === 1 && idx === m.items.length - 1 ? 0 : 0);
        return `
          <div class="cal-item ${isLastRow ? "last-row" : ""}">
            <div class="cal-item-id">${it[0]}</div>
            <div class="cal-item-title">${it[1]}</div>
            <div class="cal-item-psy">${it[2]}</div>
          </div>
        `;
      })
      .join("");

    panelEl.innerHTML = `
      <div class="cal-header">
        <div class="cal-h-left">
          <div class="cal-month-big">${m.month}<span class="month-unit">월</span></div>
          <div>
            <span class="cal-season-pill">${m.season}</span>
            <span class="cal-sub-pill">${m.sub}</span>
          </div>
        </div>
        <div class="cal-h-right">
          <div class="cal-q-label">이 달, 학부모가 검색하는 질문</div>
          <div class="cal-q">"${m.parentQuestion}"</div>
          <div class="cal-count">
            제안 콘텐츠 <strong>${m.items.length}개</strong> · 모드 ${intensity.mode}
          </div>
        </div>
      </div>
      <div class="cal-items">${itemsHTML}</div>
    `;
  }

  function activateMonth(monthNum) {
    document.querySelectorAll(".cal-tab").forEach((t) => {
      t.classList.toggle("active", parseInt(t.dataset.month, 10) === monthNum);
    });
    renderPanel(monthNum);
  }

  if (tabsEl && panelEl) {
    buildTabs();
    // Default: current month (or 1월 if outside Korean academic year)
    const now = new Date();
    const cur = now.getFullYear() === 2026 ? now.getMonth() + 1 : 1;
    activateMonth(cur);
  }

  /* ----- 3. Subtle in-view reveal ----- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document
    .querySelectorAll(".section-head, .viral-card, .use-card, .method-step, .season-block, .stat")
    .forEach((el) => io.observe(el));
})();
