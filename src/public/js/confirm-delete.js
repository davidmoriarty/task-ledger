// src/public/js/confirm-delete.js
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.dataset.confirm === "delete-task") {
    const ok = window.confirm("Delete this task?");
    if (!ok) e.preventDefault();
  }
});
