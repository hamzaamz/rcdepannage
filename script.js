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
      const labelText = btn.textContent.trim();

      if (interventionTypeInput) {
        interventionTypeInput.value = labelText;
      }
      const emailSubject = document.getElementById('emailSubject');
      if (emailSubject) {
        emailSubject.value = `[RC DÉPANNAGE] Demande d'intervention - ${labelText}`;
      }
      if (summaryServiceVal) {
        summaryServiceVal.textContent = labelText;
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

  // 5. Formspree Integration & Submission Handling
  const quoteForm = document.getElementById('interventionForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const formErrorAlert = document.getElementById('formErrorAlert');

  function resetFormSummary() {
    if (summaryDepartVal) summaryDepartVal.textContent = 'Non spécifié';
    if (summaryDestVal) summaryDestVal.textContent = 'Atelier Jumet';
  }

  // Synchronize reset event with the interactive summary sidebar
  if (quoteForm) {
    quoteForm.addEventListener('reset', () => {
      setTimeout(resetFormSummary, 50);
    });
  }

  // Native fetch fallback if @formspree/ajax CDN is unreachable or blocked
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      // Basic phone length validation
      const phoneInput = document.getElementById('clientPhone');
      if (phoneInput && phoneInput.value.trim().length < 8) {
        e.preventDefault();
        alert('Veuillez renseigner un numéro de téléphone valide afin que le dépanneur puisse vous contacter immédiatement.');
        phoneInput.focus();
        return;
      }

      // If the event was already intercepted by @formspree/ajax, don't execute fallback
      if (e.defaultPrevented) return;

      // Fallback: Submit via Fetch API to Formspree endpoint
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMISSION EN COURS...';
      }
      if (formErrorAlert) {
        formErrorAlert.style.display = 'none';
        formErrorAlert.removeAttribute('data-fs-active');
      }

      try {
        const formData = new FormData(quoteForm);
        const response = await fetch('https://formspree.io/f/mvkkalor', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          quoteForm.reset();
          resetFormSummary();
          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'block';
            formSuccessAlert.setAttribute('data-fs-active', '');
            formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          const data = await response.json();
          const errorMsg = data && data.errors && data.errors.length > 0
            ? data.errors.map(err => err.message).join(', ')
            : 'Erreur lors de la transmission.';
          throw new Error(errorMsg);
        }
      } catch (err) {
        if (formErrorAlert) {
          formErrorAlert.style.display = 'block';
          formErrorAlert.setAttribute('data-fs-active', '');
          formErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
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
