document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  // Mobil menyu
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  menuToggle?.addEventListener("click", () =>
    mobileNav?.classList.toggle("open"),
  );
  mobileNav
    ?.querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => mobileNav.classList.remove("open")),
    );

  // Joriy sahifa navigatsiyasi
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.dataset.page === currentPage) link.classList.add("active");
  });

  // Scroll reveal animatsiyasi
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add("visible"));

  // Yuqoriga qaytish
  const backTop = document.getElementById("backTop");
  window.addEventListener("scroll", () =>
    backTop?.classList.toggle("show", window.scrollY > 450),
  );
  backTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // Qo'llanma tablari
  const tabs = document.querySelectorAll(".tab[data-tab]");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) =>
        panel.classList.toggle("active", panel.id === tab.dataset.tab),
      );
    }),
  );

  // AI scanner — bu o'quv demo, haqiqiy rasmni AI modeli bilan tahlil qilmaydi.
  const imageInput = document.getElementById("imageInput");
  const previewImage = document.getElementById("previewImage");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const removeImage = document.getElementById("removeImage");
  const fileStatus = document.getElementById("fileStatus");
  let selectedFile = null;
  let previewUrl = null;

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Iltimos, rasm faylini tanlang.");
      imageInput.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Rasm hajmi 10 MB dan kichik bo'lishi kerak.");
      imageInput.value = "";
      return;
    }
    selectedFile = file;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    previewImage.src = previewUrl;
    previewImage.classList.remove("hidden");
    if (analyzeBtn) analyzeBtn.disabled = false;
    if (fileStatus) fileStatus.textContent = `${file.name} — rasm tanlandi.`;
    const category = document.getElementById("resultCategory");
    if (category) category.textContent = "Tahlilga tayyor";
    const description = document.getElementById("resultDescription");
    if (description)
      description.textContent =
        "Tahlil qilish tugmasini bosing. Demo faqat fayl nomidagi so'zlarga qarab taxmin qiladi.";
  });

  const uploadBox = document.getElementById("uploadBox");
  if (uploadBox && imageInput) {
    ["dragenter", "dragover"].forEach((type) =>
      uploadBox.addEventListener(type, (event) => {
        event.preventDefault();
        uploadBox.classList.add("drag-active");
      }),
    );
    ["dragleave", "drop"].forEach((type) =>
      uploadBox.addEventListener(type, (event) => {
        event.preventDefault();
        uploadBox.classList.remove("drag-active");
      }),
    );
    uploadBox.addEventListener("drop", (event) => {
      const file = event.dataTransfer?.files?.[0];
      if (!file) return;
      const transfer = new DataTransfer();
      transfer.items.add(file);
      imageInput.files = transfer.files;
      imageInput.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
  analyzeBtn?.addEventListener("click", () => {
    if (!selectedFile) return;
    const name = selectedFile.name.toLowerCase();
    let category = "Aralash chiqindi";
    let description =
      "Fayl nomidan aniq kategoriya topilmadi. Mahalliy qabul qoidalarini tekshiring.";
    let advice =
      "Chiqindini boshqa turlardan ajrating va qabul punktidagi ko'rsatmalarga amal qiling.";
    if (/(plastic|plastik|bottle|butilka)/.test(name)) {
      category = "Plastik";
      description = "Fayl nomida plastik yoki butilka kalit so'zi topildi.";
      advice =
        "Idishni bo'shating, imkon bo'lsa chaying va plastik qabul qilinadigan qutiga ajrating.";
    } else if (/(paper|qogoz|qog'oz|cardboard|karton)/.test(name)) {
      category = "Qog'oz va karton";
      description = "Fayl nomida qog'oz yoki karton kalit so'zi topildi.";
      advice = "Qog'oz va kartonni quruq, toza holda alohida yig'ing.";
    } else if (/(glass|shisha)/.test(name)) {
      category = "Shisha";
      description = "Fayl nomida shisha kalit so'zi topildi.";
      advice = "Shisha idishlarni ehtiyotkorlik bilan alohida yig'ing.";
    } else if (/(food|organic|organik|meva|barg)/.test(name)) {
      category = "Organik";
      description = "Fayl nomida organik chiqindi kalit so'zi topildi.";
      advice =
        "Meva-sabzavot qoldiqlarini kompost qilish imkoniyatini tekshiring.";
    }
    document.getElementById("resultCategory").textContent = category;
    document.getElementById("resultDescription").textContent = description;
    document.getElementById("resultAdvice").textContent = "Maslahat: " + advice;
  });

  removeImage?.addEventListener("click", () => {
    selectedFile = null;
    if (imageInput) imageInput.value = "";
    previewImage?.removeAttribute("src");
    previewImage?.classList.add("hidden");
    if (analyzeBtn) analyzeBtn.disabled = true;
    if (fileStatus) fileStatus.textContent = "Hali rasm tanlanmagan.";
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    const category = document.getElementById("resultCategory");
    if (category) category.textContent = "Natija shu yerda ko'rinadi";
    const description = document.getElementById("resultDescription");
    if (description)
      description.textContent =
        "Rasm tanlaganingizdan so'ng tahlilni boshlang.";
    const advice = document.getElementById("resultAdvice");
    if (advice)
      advice.textContent =
        "🌱 Maslahat: chiqindilarni toza va alohida yig'ing.";
  });

  // Ekologik odatlar dashboard — localStorage
  const tasks = [...document.querySelectorAll(".eco-task")];
  const storageKey = "ecolifeHabits_v1";
  const doneCount = document.getElementById("doneCount");
  const waterCount = document.getElementById("waterCount");
  const ecoPoints = document.getElementById("ecoPoints");
  const taskProgress = document.getElementById("taskProgress");
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");

  function updateDashboard() {
    const done = tasks.filter((task) => task.checked).length;
    const total = tasks.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    if (doneCount) doneCount.textContent = done;
    if (waterCount) waterCount.textContent = done * 5;
    if (ecoPoints) ecoPoints.textContent = done * 10;
    if (taskProgress) taskProgress.textContent = `${done} / ${total}`;
    if (progressText) progressText.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    tasks.forEach((task) =>
      task.closest(".task")?.classList.toggle("done", task.checked),
    );
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(tasks.map((task) => task.checked)),
      );
    } catch (error) {
      console.warn(error);
    }
  }

  if (tasks.length) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      tasks.forEach((task, index) => (task.checked = Boolean(saved[index])));
    } catch {
      tasks.forEach((task) => (task.checked = false));
    }
    tasks.forEach((task) => task.addEventListener("change", updateDashboard));
    document.getElementById("resetTasks")?.addEventListener("click", () => {
      tasks.forEach((task) => (task.checked = false));
      updateDashboard();
    });
    updateDashboard();
  }

  // Bir vaqtning o'zida faqat bitta video ijro etilsin
  const videos = document.querySelectorAll("video");
  videos.forEach((video) =>
    video.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== video) other.pause();
      });
    }),
  );
});
