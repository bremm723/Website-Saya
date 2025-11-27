// 1. Inisialisasi AOS
AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
  mirror: false,
});

// 2. GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 3. Navbar Responsif
const hamburger = document.querySelector(".hamburger-menu");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
  hamburger.classList.toggle("active");
});
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// 4. Navbar Scroll Effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// 5. Animasi Skill Bar
document.querySelectorAll(".skill-item").forEach((skillItem) => {
  const progressBar = skillItem.querySelector(".progress-bar");
  const progressValue = progressBar.dataset.progress;

  gsap.to(progressBar, {
    width: `${progressValue}%`,
    scrollTrigger: {
      trigger: skillItem,
      start: "top 80%",
      toggleActions: "play none none none",
      onEnter: () => (progressBar.querySelector("span").style.opacity = "1"),
    },
    duration: 1.5,
    ease: "power2.out",
  });
});

// 6. Filter Portfolio — versi sempurna: hilang semua, lalu muncul 1 per 1
const categoryBtns = document.querySelectorAll(".category-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

function animatePortfolio(category) {
  const showItems = [];

  // Tentukan item mana yang akan ditampilkan
  portfolioItems.forEach((item) => {
    const matchCategory =
      category === "all" || item.dataset.category === category;
    const hideOnAll = item.dataset.hideOnAll === "true";

    if (category === "all" && hideOnAll) return;
    if (matchCategory && !(category === "all" && hideOnAll))
      showItems.push(item);
  });

  // 1️⃣ SEMUA FOTO LANGSUNG HILANG SEKETIKA
  portfolioItems.forEach((item) => {
    item.style.transition = "none"; // hilangkan transisi bawaan agar langsung hilang
    item.style.opacity = "0";
    item.style.transform = "scale(0.95)";
  });

  // Paksa browser render perubahan dulu sebelum lanjut
  void document.body.offsetHeight;

  // 2️⃣ SEMUA FOTO DISEMBUNYIKAN TOTAL
  portfolioItems.forEach((item) => {
    item.style.display = "none";
  });

  // 3️⃣ Tampilkan item kategori baru (dalam keadaan transparan)
  showItems.forEach((item) => {
    item.style.display = "block";
    item.style.opacity = "0";
    item.style.transform = "scale(0.95)";
  });

  // 4️⃣ Tambahkan sedikit reflow agar GSAP bisa tangkap kondisi awal
  void document.body.offsetHeight;

  // 5️⃣ Animasi fade-in satu per satu
  gsap.to(showItems, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: "power2.out",
    stagger: 0.08,
  });
}



categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    animatePortfolio(category);
    updateMobileSlider(category);   // ✅ WAJIB! ini yang mengaktifkan slider mobile
  });
});


// 🔹 Saat pertama kali dimuat
window.addEventListener("DOMContentLoaded", () => {
  portfolioItems.forEach((item) => {
    if (item.dataset.hideOnAll === "true") {
      item.style.display = "none";
    } else {
      item.style.display = "block";
      gsap.set(item, { opacity: 0, scale: 0.95 });
    }
  });

  // Efek muncul awal
  gsap.to(portfolioItems, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: "power2.out",
    stagger: 0.08,
  });

  // Set tab aktif awal
  const defaultBtn = document.querySelector('.category-btn[data-category="all"]');
  if (defaultBtn) defaultBtn.classList.add("active");

  AOS.refreshHard();
});


// 7. Smooth Scroll ke Section
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetId.length > 1 && targetElement) {
      e.preventDefault();
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: targetElement.offsetTop - (header.offsetHeight + 10) },
        ease: "power2.inOut",
      });
    }
  });
});

// 8. Klik Overlay → pindah ke kategori sesuai proyek (tanpa relink)
document.querySelectorAll(".portfolio-item .overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // cegah bubbling / klik ganda

    const projectTitle =
      overlay.querySelector("h3")?.textContent.toLowerCase() || "";
    const portfolioSection = document.querySelector("#portfolio");
    let targetCategory = null;

    // 🔹 Tentukan kategori berdasarkan teks judul
    if (projectTitle.includes("skciot")) targetCategory = "iot";
    else if (projectTitle.includes("web portfolio")) targetCategory = "web";
    else if (
      projectTitle.includes("landscape photography") ||
      projectTitle.includes("world photography")
    )
      targetCategory = "photography";

    // 🔹 Kalau tidak cocok kategori, hentikan
    if (!targetCategory) return;

    // 🔹 Cegah klik jika sudah di kategori yang sama
    const activeBtn = document.querySelector(".category-btn.active");
    if (activeBtn && activeBtn.dataset.category === targetCategory) {
      return; // 🚫 sudah aktif, jangan lakukan apa pun
    }

    // 🔹 Jalankan pindah kategori jika berbeda
    const targetBtn = document.querySelector(
      `.category-btn[data-category="${targetCategory}"]`
    );
    if (targetBtn && portfolioSection) {
      targetBtn.click();
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: portfolioSection.offsetTop - 60 },
        ease: "power2.inOut",
      });
    }
  });
});

AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
  mirror: false,
  offset: 0, // default 120px → set 0 supaya animasi dimulai segera saat scroll sampai elemen
  anchorPlacement: 'top-bottom'
});

// ✅ Hanya satu kali inisialisasi AOS di awal (hapus yang kedua)

// === Animasi Header ===
gsap.from("header", {
  y: -60,
  opacity: 1,
  duration: 1,
  ease: "power2.out",
});

// === Animasi Footer & Portofolio ===
document.addEventListener("DOMContentLoaded", () => {
  // === Footer ===
  const footer = document.querySelector("footer");

  if (footer) {
    footer.style.opacity = "0";
    footer.style.transform = "translateY(80px)";
    footer.style.visibility = "visible";

    gsap.to(footer, {
      scrollTrigger: {
        trigger: footer,
        start: "top 95%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
    });

    gsap.from(footer.querySelectorAll("p, a, span"), {
      scrollTrigger: {
        trigger: footer,
        start: "top 95%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 20,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
    });
  }

});

// === Animasi Portofolio: muncul dari atas ke bawah ===
document.addEventListener("DOMContentLoaded", () => {
  const portfolioSection = document.querySelector("#portfolio");
  const portfolioTitle = portfolioSection.querySelector("h2");
  const categoryButtons = portfolioSection.querySelectorAll(".category-btn");
  const portfolioItems = portfolioSection.querySelectorAll(".portfolio-item");

  if (portfolioSection && portfolioTitle && portfolioItems.length > 0) {
    // Sembunyikan semua elemen terlebih dahulu
    gsap.set([portfolioTitle, categoryButtons, portfolioItems], {
      opacity: 0,
      y: 50,
      visibility: "hidden",
    });

    // Buat timeline animasi
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: portfolioSection,
        start: "top 80%", // mulai animasi saat bagian atas section masuk viewport
        toggleActions: "play none none none",
      },
    });

    // 1️⃣ Judul muncul dulu
    tl.to(portfolioTitle, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.8,
      ease: "power2.out",
    });

    // 2️⃣ Tombol kategori muncul satu per satu
    tl.to(categoryButtons, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
    }, "-=0.3"); // sedikit overlap agar lebih halus

    // 3️⃣ Foto portofolio muncul satu per satu dari atas ke bawah
    tl.to(portfolioItems, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1, // muncul satu per satu
    }, "-=0.2");
  }
});

// ========================
// MOBILE SLIDER PHOTOGRAPHY
// ========================
const mobileSlider = document.getElementById("mobile-slider");
const sliderTrack = mobileSlider.querySelector(".slider");

let slideIndex = 0;

function updateMobileSlider(category) {
  const isMobile = window.innerWidth <= 768;
  const grid = document.querySelector(".portfolio-grid");

  if (!isMobile || category !== "photography") {
    mobileSlider.style.display = "none";
    grid.classList.remove("mobile-hide");
    if (!isMobile || category !== "photography") {
    mobileSlider.style.display = "none";
    grid.classList.remove("mobile-hide");
    stopAutoSlide(); // ⛔ hentikan autoslide
    return;
}

    return;
  }

  // Ambil semua foto photography
  const photos = Array.from(
    document.querySelectorAll('.portfolio-item[data-category="photography"] img')
  );

  // Bersihkan slider
  sliderTrack.innerHTML = "";
  slideIndex = 0;

  // Masukkan foto ke slider
  photos.forEach((img) => {
    const clone = img.cloneNode(true);
    clone.classList.add("slide");
    sliderTrack.appendChild(clone);
  });

  // Tampilkan slider, sembunyikan grid
  mobileSlider.style.display = "block";
  grid.classList.add("mobile-hide");

  updateSlide();
  startAutoSlide();
}

// Tombol next/prev
//mobileSlider.querySelector(".next").onclick = () => {
//  const total = sliderTrack.children.length;
//  slideIndex = (slideIndex + 1) % total;
//  updateSlide();
//};

//mobileSlider.querySelector(".prev").onclick = () => {
//  const total = sliderTrack.children.length;
//  slideIndex = (slideIndex - 1 + total) % total;
//  updateSlide();
//};

let autoSlide;

function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    const total = sliderTrack.children.length;
    slideIndex = (slideIndex + 1) % total;
    updateSlide();
  }, 2000); // 2000ms = 2 detik
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}


function updateSlide() {
  sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
}

