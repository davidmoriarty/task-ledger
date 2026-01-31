// src/public/js/notice.js
(function () {
  // close any notice when its close button is clicked
  document.addEventListener("click", (e) => {
    const btn = e.target?.closest?.(".notice-close");
    if (!btn) return;

    const notice = btn.closest(".notice");
    if (notice) notice.remove();
  });
})();
