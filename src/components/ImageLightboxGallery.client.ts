interface GalleryPhoto {
  webp: string;
  webp2x: string;
  jpg: string;
  full: string;
  width: number;
  height: number;
  alt: string;
}

function initGallery(galleryEl: HTMLElement): void {
  const galleryId = galleryEl.getAttribute("data-lightbox-gallery");
  const photosRaw = galleryEl.getAttribute("data-photos");
  if (!galleryId || !photosRaw) return;

  const photos: GalleryPhoto[] = JSON.parse(photosRaw);
  const dialog = document.getElementById(galleryId) as HTMLDialogElement | null;
  if (!dialog) return;

  const captionEl = dialog.querySelector("[data-lightbox-caption]");
  const counterEl = dialog.querySelector("[data-lightbox-counter]");
  const closeBtn = dialog.querySelector("[data-lightbox-close]");
  const viewportEl = dialog.querySelector("[data-lightbox-viewport]");
  const trackEl = dialog.querySelector("[data-lightbox-track]");
  if (!captionEl || !closeBtn || !viewportEl || !trackEl) return;

  let currentIndex = 0;
  let currentOffset = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartOffset = 0;
  let dragStartTime = 0;
  let isDragging = false;
  let dragAxis: string | null = null;

  const getSlideWidth = () => viewportEl.clientWidth;

  const indexToOffset = (index: number) => -index * getSlideWidth();

  const setTrackTransform = (offset: number, animate: boolean) => {
    trackEl.classList.toggle("is-snapping", animate);
    trackEl.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const updateMeta = () => {
    const photo = photos[currentIndex];
    captionEl.textContent = photo.alt;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${photos.length}`;
  };

  const goToIndex = (index: number, animate = true) => {
    currentIndex = ((index % photos.length) + photos.length) % photos.length;
    currentOffset = indexToOffset(currentIndex);
    setTrackTransform(currentOffset, animate);
    updateMeta();
  };

  galleryEl.querySelectorAll("[data-lightbox-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-lightbox-open"));
      dialog.showModal();
      goToIndex(index, false);
    });
  });

  closeBtn.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dialog.close();
    if (photos.length <= 1) return;
    if (event.key === "ArrowLeft") goToIndex(currentIndex - 1);
    if (event.key === "ArrowRight") goToIndex(currentIndex + 1);
  });

  dialog.querySelectorAll("[data-lightbox-prev]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      goToIndex(currentIndex - 1);
    });
  });

  dialog.querySelectorAll("[data-lightbox-next]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      goToIndex(currentIndex + 1);
    });
  });

  if (photos.length > 1) {
    const endDrag = (event: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      dragAxis = null;
      viewportEl.classList.remove("is-dragging");

      const slideWidth = getSlideWidth();
      const dragDelta = currentOffset - dragStartOffset;
      const absDelta = Math.abs(dragDelta);
      const elapsed = Date.now() - dragStartTime;

      const velocity = absDelta / Math.max(elapsed, 1);
      const fastFlick = velocity > 0.5 && absDelta > slideWidth * 0.15;
      const pastThreshold = absDelta > slideWidth * 0.3;

      let targetIndex = currentIndex;

      if (pastThreshold || fastFlick) {
        targetIndex = dragDelta < 0 ? currentIndex + 1 : currentIndex - 1;
      } else {
        targetIndex = currentIndex;
      }

      goToIndex(targetIndex, true);
    };

    viewportEl.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      isDragging = true;
      dragAxis = null;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartOffset = currentOffset;
      dragStartTime = Date.now();
      trackEl.classList.remove("is-snapping");
      viewportEl.classList.add("is-dragging");
      viewportEl.setPointerCapture(event.pointerId);
    });

    viewportEl.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;

      if (!dragAxis) {
        if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
        dragAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? "x" : "y";
        if (dragAxis === "y") {
          isDragging = false;
          viewportEl.classList.remove("is-dragging");
          viewportEl.releasePointerCapture(event.pointerId);
          return;
        }
      }

      event.preventDefault();
      currentOffset = dragStartOffset + deltaX;

      const min = indexToOffset(photos.length - 1);
      const max = 0;
      if (currentOffset > max) {
        currentOffset = max + (currentOffset - max) * 0.25;
      } else if (currentOffset < min) {
        currentOffset = min + (currentOffset - min) * 0.25;
      }

      setTrackTransform(currentOffset, false);
    });

    viewportEl.addEventListener("pointerup", endDrag);
    viewportEl.addEventListener("pointercancel", endDrag);

    window.addEventListener("resize", () => {
      if (!dialog.open) return;
      goToIndex(currentIndex, false);
    });
  } else {
    updateMeta();
  }
}

for (const el of document.querySelectorAll<HTMLElement>("[data-lightbox-gallery]")) {
  initGallery(el);
}
