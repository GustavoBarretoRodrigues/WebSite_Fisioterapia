// =========================================================
// CONFIGURAÇÃO — atualize com o número real (código do país + DDD + número, sem espaços/símbolos)
// =========================================================
const WHATSAPP_NUMBER = "5511999999999";

// =========================================================
// 1. Header: muda de aparência ao rolar a página
// =========================================================
const header = document.getElementById("site-header");
function updateHeaderState() {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}
updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

// =========================================================
// 2. Menu mobile
// =========================================================
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("icon-open");
const iconClose = document.getElementById("icon-close");

menuToggle.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden");
  iconOpen.classList.toggle("hidden");
  iconClose.classList.toggle("hidden");
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

// Fecha o menu mobile ao clicar em um link
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// =========================================================
// 3. RF04 — Agendamento por WhatsApp
//    Qualquer elemento com [data-service] monta a mensagem
//    e abre o WhatsApp com o texto pré-preenchido.
// =========================================================
document.querySelectorAll(".whatsapp-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const service = btn.getAttribute("data-service") || "uma consulta";
    const message =
      service === "Agendamento"
        ? "Olá! Gostaria de agendar um horário."
        : `Olá! Gostaria de agendar um horário para ${service}.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});

// =========================================================
// 4. RF06 — FAQ em accordion
// =========================================================
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    // fecha os demais itens (accordion exclusivo)
    faqItems.forEach((other) => other.classList.remove("open"));
    if (!isOpen) {
      item.classList.add("open");
    }
  });
});

// =========================================================
// 5. Carrossel de imagens do Ambiente
// =========================================================
const track = document.getElementById("carousel-track");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
const dotsContainer = document.getElementById("carousel-dots");
const slides = track ? Array.from(track.children) : [];
let currentSlide = 0;

function renderDots() {
  dotsContainer.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ir para imagem ${i + 1}`);
    if (i === currentSlide) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  Array.from(dotsContainer.children).forEach((dot, i) =>
    dot.classList.toggle("active", i === currentSlide)
  );
}

if (track && slides.length) {
  renderDots();
  prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

  // Autoplay suave, pausado ao interagir
  let autoplay = setInterval(() => goToSlide(currentSlide + 1), 6000);
  const carouselWrapper = track.closest(".relative");
  carouselWrapper.addEventListener("mouseenter", () => clearInterval(autoplay));
  carouselWrapper.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => goToSlide(currentSlide + 1), 6000);
  });
}

// =========================================================
// 6. Realce do link de navegação ativo conforme a rolagem
// =========================================================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("text-purple-700", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);
sections.forEach((section) => observer.observe(section));
