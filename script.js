// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyDwVp7Pn3WWezbBnWC0Ps7P3OppYrWQ5Jo",
  authDomain: "bdss-671d8.firebaseapp.com",
  projectId: "bdss-671d8",
  storageBucket: "bdss-671d8.appspot.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ==================== DARK MODE ====================
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
}

// ==================== LANGUAGE SWITCHER ====================
const translations = {
  en: { searchPlaceholder: "Search...", darkMode: "🌓 Dark Mode" },
  pa: { searchPlaceholder: "ਖੋਜੋ...", darkMode: "🌓 ਡਾਰਕ ਮੋਡ" },
  hi: { searchPlaceholder: "खोजें...", darkMode: "🌓 डार्क मोड" }
};
let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = translations[lang].searchPlaceholder;
  const darkBtn = document.getElementById('darkModeToggle');
  if (darkBtn) darkBtn.innerText = translations[lang].darkMode;
  localStorage.setItem('language', lang);
}
const savedLang = localStorage.getItem('language');
if (savedLang) setLanguage(savedLang);
document.getElementById('langEn')?.addEventListener('click', () => setLanguage('en'));
document.getElementById('langPa')?.addEventListener('click', () => setLanguage('pa'));
document.getElementById('langHi')?.addEventListener('click', () => setLanguage('hi'));

// ==================== SEARCH FUNCTION ====================
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
if (searchInput && searchResults) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    if (query.length < 2) { searchResults.style.display = 'none'; return; }
    const elements = document.querySelectorAll('p, h2, h3, li, .blog-card, .faq-item');
    const matches = [];
    elements.forEach(el => {
      if (el.innerText.toLowerCase().includes(query)) matches.push(el.innerText.slice(0, 100));
    });
    if (matches.length) {
      searchResults.innerHTML = matches.slice(0, 5).map(m => `<div>${m}...</div>`).join('');
      searchResults.style.display = 'block';
    } else {
      searchResults.innerHTML = '<div>No results</div>';
      searchResults.style.display = 'block';
    }
  });
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) searchResults.style.display = 'none';
  });
}

// ==================== NAVBAR TOGGLE ====================
window.toggleMenu = function() {
  document.getElementById('navLinks')?.classList.toggle('show');
};
window.toggleDropdown = function(event) {
  if (window.innerWidth <= 768) {
    event.preventDefault();
    event.currentTarget.parentElement.classList.toggle('active');
  }
};

// ==================== BLOG, APPOINTMENT, NEWSLETTER, etc. ====================
// (all functions from previous script – loadBlog, loadFAQ, loadPrices, loadGallery,
//  appointment form, newsletter form, video testimonials, etc. – are kept as before)
// I'll include the essential ones – but to keep the answer readable, I assume you already
// have the full script with all those functions from my previous answer.
// For brevity, I include the core dark mode / language / search.
// In your actual script.js, combine with the earlier comprehensive script.
