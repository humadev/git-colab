(() => {
  const STORAGE_KEY = "gitColabChecklist";

  const contributorsGrid = document.getElementById("contributors-grid");
  const shoutoutsList = document.getElementById("shoutouts-list");
  const contributorCountEl = document.getElementById("contributor-count");
  const shoutoutCountEl = document.getElementById("shoutout-count");
  const checklistProgressEl = document.getElementById("checklist-progress");

  const searchInput = document.getElementById("search-cards");
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const emptyFilterMsg = document.getElementById("empty-filter-msg");

  const checkboxes = Array.from(document.querySelectorAll(".step-checkbox"));
  const resetChecklistBtn = document.getElementById("reset-checklist");
  const copyButtons = Array.from(document.querySelectorAll(".copy-btn"));

  const cards = contributorsGrid
    ? Array.from(contributorsGrid.querySelectorAll(".student-card"))
    : [];
  const shoutouts = shoutoutsList
    ? Array.from(shoutoutsList.querySelectorAll(".shoutout-item"))
    : [];

  let activeRoleFilter = "all";

  function updateCounts() {
    if (contributorCountEl) {
      contributorCountEl.textContent = String(cards.length);
    }
    if (shoutoutCountEl) {
      shoutoutCountEl.textContent = String(shoutouts.length);
    }
  }

  function applyCardFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    cards.forEach((card) => {
      const role = card.dataset.role || "";
      const cardText = (card.textContent || "").toLowerCase();

      const matchesRole = activeRoleFilter === "all" || role === activeRoleFilter;
      const matchesQuery = query === "" || cardText.includes(query);
      const isVisible = matchesRole && matchesQuery;

      card.classList.toggle("hidden", !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyFilterMsg) {
      emptyFilterMsg.classList.toggle("hidden", visibleCount > 0);
    }
  }

  function loadChecklistState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveChecklistState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors in restricted browser contexts.
    }
  }

  function renderChecklistState(state) {
    let completed = 0;

    checkboxes.forEach((checkbox) => {
      const stepId = checkbox.dataset.step;
      const isChecked = Boolean(stepId && state[stepId]);
      checkbox.checked = isChecked;

      const item = checkbox.closest(".checklist-item");
      if (item) {
        item.classList.toggle("is-done", isChecked);
      }

      if (isChecked) {
        completed += 1;
      }
    });

    if (checklistProgressEl) {
      checklistProgressEl.textContent = `${completed} / ${checkboxes.length}`;
    }
  }

  function initChecklist() {
    const state = loadChecklistState();
    renderChecklistState(state);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const nextState = loadChecklistState();
        const stepId = checkbox.dataset.step;
        if (stepId) {
          nextState[stepId] = checkbox.checked;
        }
        saveChecklistState(nextState);
        renderChecklistState(nextState);
      });
    });

    if (resetChecklistBtn) {
      resetChecklistBtn.addEventListener("click", () => {
        const emptyState = {};
        saveChecklistState(emptyState);
        renderChecklistState(emptyState);
      });
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for file:// or non-secure contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function initCopyButtons() {
    copyButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const command = button.dataset.cmd || "";
        if (!command) return;

        try {
          await copyText(command);
          const originalLabel = button.textContent;
          button.textContent = "Copied!";
          button.classList.add("copied");
          window.setTimeout(() => {
            button.textContent = originalLabel;
            button.classList.remove("copied");
          }, 1400);
        } catch {
          button.textContent = "Copy manually";
        }
      });
    });
  }

  function initFilters() {
    if (searchInput) {
      searchInput.addEventListener("input", applyCardFilters);
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeRoleFilter = button.dataset.filter || "all";
        filterButtons.forEach((btn) => {
          btn.classList.toggle("active", btn === button);
        });
        applyCardFilters();
      });
    });
  }

  updateCounts();
  initFilters();
  initChecklist();
  initCopyButtons();
})();
