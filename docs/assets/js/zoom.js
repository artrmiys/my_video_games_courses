/* Lightweight image lightbox for the KB — click any content image / schema /
   gallery thumb to enlarge; click anywhere or Esc to close. No dependencies. */
(function () {
  var overlay;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "kb-lightbox";
    overlay.innerHTML =
      '<button class="kb-lightbox__close" aria-label="Закрыть">&times;</button>' +
      '<img alt="">' +
      '<div class="kb-lightbox__cap"></div>';
    overlay.addEventListener("click", close);
    document.body.appendChild(overlay);
    return overlay;
  }

  function open(src, alt) {
    if (!src) return;
    var ov = ensureOverlay();
    var img = ov.querySelector("img");
    var cap = ov.querySelector(".kb-lightbox__cap");
    img.src = src;
    img.alt = alt || "";
    cap.textContent = alt || "";
    cap.style.display = alt ? "block" : "none";
    ov.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (overlay) {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      // Anchor-wrapped figures / gallery thumbs → open full image in lightbox
      var a = t.closest(
        "a.kb-figure, a.kb-figure-row__image, a.kb-gallery__item"
      );
      if (a) {
        var im = a.querySelector("img");
        if (im && !im.closest(".kb-gallery__item--placeholder")) {
          e.preventDefault();
          open(a.getAttribute("href") || im.currentSrc || im.src, im.alt);
        }
        return;
      }

      // Plain content images (figures, inline) → lightbox
      if (
        t.tagName === "IMG" &&
        t.closest(".md-typeset") &&
        !t.closest("a") &&
        !t.closest(".md-logo")
      ) {
        open(t.currentSrc || t.src, t.alt);
      }
    },
    true
  );
})();
