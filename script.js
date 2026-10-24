/**
 * RC DÉPANNAGE & CARSERVICE - JAVASCRIPT LOGIC
 * Navigation, Tiroir Mobile, Accordéons FAQ, Formulaire Express & Simulateur
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const navToggleBtn = document.getElementById('mobileNavToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-menu-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 2. Header Scroll Effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // 4. Form Tabs & Interactive Summary
  const formTabBtns = document.querySelectorAll('.form-tab-btn');
  const interventionTypeInput = document.getElementById('interventionTypeInput');
  const summaryServiceVal = document.getElementById('summaryServiceVal');
  const summaryVehiculeVal = document.getElementById('summaryVehiculeVal');
  const summaryDepartVal = document.getElementById('summaryDepartVal');
  const summaryDestVal = document.getElementById('summaryDestVal');
  const summaryDelaiVal = document.getElementById('summaryDelaiVal');

  const vehiculeTypeSelect = document.getElementById('vehiculeType');
  const departureCityInput = document.getElementById('departureCity');
  const destinationCityInput = document.getElementById('destinationCity');

  formTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      formTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedType = btn.getAttribute('data-type');
      if (interventionTypeInput) {
        interventionTypeInput.value = selectedType;
      }
      if (summaryServiceVal) {
        summaryServiceVal.textContent = btn.textContent.trim();
      }

      // Update estimated dispatch
      if (summaryDelaiVal) {
        if (selectedType === 'urgent') {
          summaryDelaiVal.textContent = '30 à 45 minutes';
          summaryDelaiVal.style.color = '#38bdf8';
        } else if (selectedType === 'rapatriement') {
          summaryDelaiVal.textContent = 'Planifié sous 2h à 24h';
          summaryDelaiVal.style.color = '#ffffff';
        } else if (selectedType === 'atelier') {
          summaryDelaiVal.textContent = 'Sur rendez-vous ou remorquage direct';
          summaryDelaiVal.style.color = '#ffffff';
        } else {
          summaryDelaiVal.textContent = 'Enlèvement sous 24h';
          summaryDelaiVal.style.color = '#fbbf24';
        }
      }
    });
  });

  if (vehiculeTypeSelect && summaryVehiculeVal) {
    vehiculeTypeSelect.addEventListener('change', () => {
      summaryVehiculeVal.textContent = vehiculeTypeSelect.options[vehiculeTypeSelect.selectedIndex].text;
    });
  }

  if (departureCityInput && summaryDepartVal) {
    departureCityInput.addEventListener('input', () => {
      summaryDepartVal.textContent = departureCityInput.value.trim() || 'Non spécifié';
    });
  }

  if (destinationCityInput && summaryDestVal) {
    destinationCityInput.addEventListener('input', () => {
      summaryDestVal.textContent = destinationCityInput.value.trim() || 'Atelier Jumet';
    });
  }

  // 5. Form Submission Simulation
  const quoteForm = document.getElementById('interventionForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (quoteForm && formSuccessAlert) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const phoneVal = document.getElementById('clientPhone').value;
      if (!phoneVal || phoneVal.length < 8) {
        alert('Veuillez renseigner un numéro de téléphone valide afin que le dépanneur puisse vous contacter immédiatement.');
        return;
      }

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMISSION EN COURS...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        formSuccessAlert.style.display = 'block';
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Reset form inputs except type
        quoteForm.reset();
        if (summaryDepartVal) summaryDepartVal.textContent = 'Non spécifié';
        if (summaryDestVal) summaryDestVal.textContent = 'Atelier Jumet';
      }, 700);
    });
  }

  // 6. Dynamic Date for Live Availability Status
  const liveDaySpan = document.getElementById('liveCurrentDay');
  if (liveDaySpan) {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    liveDaySpan.textContent = currentDay.toUpperCase();
  }
});
