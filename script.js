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

// ==================== LANGUAGE SWITCHER (English, Punjabi, Hindi) ====================
const translations = {
  en: {
    emergency: "📞 Emergency: +91-8221826243",
    call: "Call",
    whatsapp: "WhatsApp",
    searchPlaceholder: "Search...",
    darkMode: "🌓 Dark Mode"
  },
  pa: {
    emergency: "📞 ਐਮਰਜੈਂਸੀ: +91-8221826243",
    call: "ਕਾਲ ਕਰੋ",
    whatsapp: "ਵਟਸਐਪ",
    searchPlaceholder: "ਖੋਜੋ...",
    darkMode: "🌓 ਡਾਰਕ ਮੋਡ"
  },
  hi: {
    emergency: "📞 आपातकाल: +91-8221826243",
    call: "कॉल करें",
    whatsapp: "व्हाट्सएप",
    searchPlaceholder: "खोजें...",
    darkMode: "🌓 डार्क मोड"
  }
};
let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.innerText = translations[lang][key];
  });
  const emergencyBanner = document.querySelector('.emergency-banner');
  if (emergencyBanner) emergencyBanner.innerText = translations[lang].emergency;
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

// ==================== SEARCH FUNCTION (simple page content search) ====================
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

// ==================== BLOG LOADER ====================
async function loadBlog() {
  const container = document.getElementById('blogContainer');
  if (!container) return;
  try {
    const snapshot = await db.collection('blog').orderBy('date', 'desc').get();
    container.innerHTML = '';
    if (snapshot.empty) { container.innerHTML = '<p>No articles yet. Check back soon!</p>'; return; }
    snapshot.forEach(doc => {
      const post = doc.data();
      container.innerHTML += `
        <div class="blog-card">
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.summary)}</p>
          <a href="blog-post.html?id=${doc.id}" style="color:var(--green); text-decoration:none; font-weight:bold;">Read More →</a>
        </div>
      `;
    });
  } catch (err) { console.error(err); container.innerHTML = '<p>Error loading blog.</p>'; }
}

// ==================== APPOINTMENT FORM ====================
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('apptName').value;
    const mobile = document.getElementById('apptMobile').value;
    const date = document.getElementById('apptDate').value;
    const service = document.getElementById('apptService').value;
    try {
      await db.collection('appointments').add({ name, mobile, date, service, time: new Date() });
      const msg = `New appointment: ${name}, ${mobile}, ${date}, ${service}`;
      window.open(`https://wa.me/918221826243?text=${encodeURIComponent(msg)}`, '_blank');
      document.getElementById('apptMsg').innerText = '✅ Appointment booked! We will contact you.';
      appointmentForm.reset();
    } catch (err) { document.getElementById('apptMsg').innerText = '❌ Error. Please try again.'; }
  });
}

// ==================== NEWSLETTER SIGNUP ====================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    try {
      await db.collection('newsletter').add({ email, time: new Date() });
      document.getElementById('newsMsg').innerText = '✅ Subscribed successfully!';
      newsletterForm.reset();
    } catch (err) { document.getElementById('newsMsg').innerText = '❌ Error. Try again.'; }
  });
}

// ==================== VIDEO TESTIMONIALS (Submit & Load) ====================
const videoForm = document.getElementById('videoTestimonialForm');
if (videoForm) {
  videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('videoName').value;
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    try {
      await db.collection('videoTestimonials').add({ name, youtubeUrl, approved: false, time: new Date() });
      document.getElementById('videoMsg').innerText = '✅ Submitted for review. Thank you!';
      videoForm.reset();
    } catch (err) { document.getElementById('videoMsg').innerText = '❌ Error submitting.'; }
  });
  async function loadVideos() {
    const container = document.getElementById('videosContainer');
    if (!container) return;
    try {
      const snapshot = await db.collection('videoTestimonials').where('approved', '==', true).get();
      container.innerHTML = '';
      snapshot.forEach(doc => {
        const v = doc.data();
        const videoId = v.youtubeUrl.split('v=')[1]?.split('&')[0] || v.youtubeUrl.split('/').pop();
        if (videoId) {
          container.innerHTML += `
            <div style="margin-bottom:20px; text-align:center;">
              <strong>${escapeHtml(v.name)}</strong><br>
              <iframe width="300" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius:20px;"></iframe>
            </div>
          `;
        }
      });
      if (snapshot.empty) container.innerHTML = '<p>No approved videos yet.</p>';
    } catch (err) { console.error(err); }
  }
  loadVideos();
}

// ==================== FAQ LOADER ====================
async function loadFAQ() {
  const container = document.getElementById('faqContainer');
  if (!container) return;
  try {
    const snapshot = await db.collection('faq').orderBy('order').get();
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const faq = doc.data();
      container.innerHTML += `
        <div class="faq-item">
          <h3>❓ ${escapeHtml(faq.question)}</h3>
          <p>${escapeHtml(faq.answer)}</p>
        </div>
      `;
    });
    if (snapshot.empty) container.innerHTML = '<p>No FAQs yet. Check back soon.</p>';
  } catch (err) { console.error(err); container.innerHTML = '<p>Error loading FAQs.</p>'; }
}

// ==================== PRICE LIST LOADER ====================
async function loadPrices() {
  const container = document.getElementById('priceContainer');
  if (!container) return;
  try {
    const snapshot = await db.collection('prices').orderBy('service').get();
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const p = doc.data();
      container.innerHTML += `
        <div class="price-card">
          <h3>${escapeHtml(p.service)}</h3>
          <p>💰 ${escapeHtml(p.price)}</p>
          <small>${escapeHtml(p.description || '')}</small>
        </div>
      `;
    });
    if (snapshot.empty) container.innerHTML = '<p>Price list coming soon.</p>';
  } catch (err) { console.error(err); container.innerHTML = '<p>Error loading prices.</p>'; }
}

// ==================== BEFORE/AFTER GALLERY (from Firebase Storage) ====================
async function loadGallery() {
  const gallery = document.getElementById('galleryGrid');
  if (!gallery) return;
  try {
    const files = await storage.ref('gallery').listAll();
    gallery.innerHTML = '';
    for (const fileRef of files.items) {
      const url = await fileRef.getDownloadURL();
      gallery.innerHTML += `<img src="${url}" alt="Before/After" onclick="window.open('${url}')">`;
    }
    if (files.items.length === 0) gallery.innerHTML = '<p>No gallery images yet.</p>';
  } catch (err) { console.error(err); gallery.innerHTML = '<p>Error loading gallery.</p>'; }
}

// ==================== PATIENT RECORD HELPER FUNCTIONS (global) ====================
window.escapeHtml = function(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
};
window.openFullImage = function(src) {
  let modal = document.getElementById('fullImageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'fullImageModal';
    modal.className = 'image-modal';
    modal.innerHTML = '<span class="close-img" onclick="this.parentElement.style.display=\'none\'">&times;</span><img id="fullImageSrc">';
    document.body.appendChild(modal);
  }
  const img = document.getElementById('fullImageSrc');
  img.src = src;
  modal.style.display = 'flex';
};
window.closeFullImage = function() {
  const modal = document.getElementById('fullImageModal');
  if (modal) modal.style.display = 'none';
};

// ==================== UTILITY: ESCAPE HTML ====================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ==================== NAVBAR TOGGLE (mobile) ====================
window.toggleMenu = function() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('show');
};
window.toggleDropdown = function(event) {
  if (window.innerWidth <= 768) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    parent.classList.toggle('active');
  }
};

// ==================== CALL ALL DYNAMIC LOADERS IF ELEMENTS EXIST ====================
if (document.getElementById('blogContainer')) loadBlog();
if (document.getElementById('faqContainer')) loadFAQ();
if (document.getElementById('priceContainer')) loadPrices();
if (document.getElementById('galleryGrid')) loadGallery();

// Additional: review system for testimonials page (handled inline on that page, but we keep global functions)
