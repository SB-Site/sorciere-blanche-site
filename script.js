document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded on Ste Web SB user');
  console.log('LocalStorage domain:', window.location.hostname);
  console.log('Checking for construction-popup element...');

  // Réinitialiser localStorage pour tester la pop-up (uniquement sur index.html)
  if (window.location.pathname.includes('index.html')) {
    console.log('Resetting popupClosed in localStorage for testing');
    localStorage.removeItem('popupClosed');
  }

  // Gestion de la pop-up
  const popup = document.getElementById('construction-popup');
  if (popup) {
    console.log('Popup element found:', popup);
    console.log('popupClosed in localStorage:', localStorage.getItem('popupClosed'));
    if (!localStorage.getItem('popupClosed')) {
      console.log('Showing popup');
      popup.classList.add('active');
    } else {
      console.log('Popup not shown, already closed');
    }
  } else {
    console.log('No construction-popup element on this page');
  }

  window.closePopup = function() {
    console.log('closePopup function called');
    const popup = document.getElementById('construction-popup');
    if (popup) {
      console.log('Hiding popup');
      popup.classList.remove('active');
      localStorage.setItem('popupClosed', 'true');
      console.log('popupClosed set to true in localStorage');
    } else {
      console.log('No construction-popup element to close');
    }
  };

  // Carrousel (index.html)
  const carousel = document.querySelector('.carousel-inner');
  if (carousel) {
    console.log('Carousel found');
    const images = carousel.querySelectorAll('.carousel-image');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;

    images[currentIndex].classList.add('active');

    function showImage(index) {
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
    }

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
      showImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      showImage(currentIndex);
    });

    setInterval(() => {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      showImage(currentIndex);
    }, 5000);
  } else {
    console.log('No carousel on this page');
  }

  // Cookies RGPD
  console.log('Checking cookiesAccepted:', localStorage.getItem('cookiesAccepted'));
  const cookieBanner = document.getElementById('cookieBanner');
  const copyright = document.querySelector('.copyright');
  console.log('cookieBanner element:', cookieBanner);
  console.log('copyright element:', copyright);
  if (!localStorage.getItem('cookiesAccepted') || localStorage.getItem('cookiesAccepted') === 'false') {
    if (cookieBanner) {
      console.log('Showing cookie banner');
      cookieBanner.classList.add('cookie-banner-visible');
    } else {
      console.error('Error: cookieBanner not found');
    }
  } else {
    if (cookieBanner) {
      console.log('Cookies accepted, hiding cookie banner');
      cookieBanner.classList.remove('cookie-banner-visible');
    }
    if (copyright) {
      console.log('Cookies accepted, showing copyright');
      copyright.classList.remove('copyright-hidden');
    }
  }

  window.acceptCookies = function() {
    console.log('Accept button clicked');
    localStorage.setItem('cookiesAccepted', 'true');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
      console.log('Hiding cookie banner');
      cookieBanner.style.display = 'none';
    } else {
      console.error('Error: cookieBanner not found in acceptCookies');
    }
    if (copyright) {
      console.log('Ensuring copyright visible:', copyright);
      copyright.style.display = 'block';
    }
  };

  // Afficher/masquer le formulaire MailerLite
  window.toggleNewsletterForm = function() {
    console.log('Toggle newsletter form clicked');
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.classList.toggle('active');
    } else {
      console.error('Error: newsletterForm not found');
    }
  };

  // Toggle langue
  const langFr = document.querySelector('.lang-fr');
  const langEn = document.querySelector('.lang-en');
  if (langFr && langEn) {
    langFr.addEventListener('mouseenter', () => {
      langFr.style.color = '#B87333';
      langEn.style.color = '#2A4B3D';
    });
    langEn.addEventListener('mouseenter', () => {
      langEn.style.color = '#B87333';
      langFr.style.color = '#2A4B3D';
    });
    langFr.addEventListener('mouseleave', () => {
      langFr.style.color = langFr.classList.contains('active') ? '#B87333' : '#2A4B3D';
      langEn.style.color = langEn.classList.contains('active') ? '#B87333' : '#2A4B3D';
    });
    langEn.addEventListener('mouseleave', () => {
      langFr.style.color = langFr.classList.contains('active') ? '#B87333' : '#2A4B3D';
      langEn.style.color = langEn.classList.contains('active') ? '#B87333' : '#2A4B3D';
    });
  }

  // Gestion du panier
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Article supprimé ! (Simulation, à connecter à Shopify plus tard)');
    });
  });

  // Boutons PayPal HostedButtons pour dons (je-soutiens.html)
  const paypalHostedButtons = [
    { id: 'paypal-container-ZFB68XN3ZKGV2', buttonId: 'ZFB68XN3ZKGV2' },
    { id: 'paypal-container-B6K6GWKCHHMT8', buttonId: 'B6K6GWKCHHMT8' },
    { id: 'paypal-container-RGK6BAGJWWWE8', buttonId: 'RGK6BAGJWWWE8' },
    { id: 'paypal-container-5BC4Q7ZXYT5H8', buttonId: '5BC4Q7ZXYT5H8' }
  ];

  paypalHostedButtons.forEach(button => {
    const container = document.getElementById(button.id);
    if (container) {
      paypal.HostedButtons({
        hostedButtonId: button.buttonId
      }).render(`#${button.id}`);
    }
  });

  // Boutons PayPal personnalisés pour déclencher les HostedButtons
  const paypalCustomButtons = [
    { id: 'paypal-onetime-amis', container: 'paypal-container-ZFB68XN3ZKGV2' },
    { id: 'paypal-onetime-initie', container: 'paypal-container-B6K6GWKCHHMT8' },
    { id: 'paypal-onetime-gardien', container: 'paypal-container-RGK6BAGJWWWE8' },
    { id: 'paypal-onetime-sage', container: 'paypal-container-5BC4Q7ZXYT5H8' }
  ];

  paypalCustomButtons.forEach(button => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener('click', () => {
        const container = document.getElementById(button.container);
        if (container) {
          const paypalButton = container.querySelector('.paypal-buttons');
          if (paypalButton) {
            paypalButton.click();
          }
        }
      });
    }
  });

  // Gestion des onglets pour creer-compte.html
  window.showTab = function(tab) {
    console.log('Switching to tab:', tab);
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tab}')"]`).classList.add('active');
    console.log('Tabs initialized');
  };

  // Gestion Supabase et hCaptcha pour creer-compte.html
  if (window.location.pathname.includes('creer-compte.html')) {
    console.log('DOM chargé pour creer-compte.html');

    // Vérifier Supabase
    let supabaseLoaded = false;
    const checkSupabaseLoaded = setInterval(() => {
      if (typeof window.supabase !== 'undefined' && !supabaseLoaded) {
        clearInterval(checkSupabaseLoaded);
        supabaseLoaded = true;
        console.log('Supabase chargé avec succès');
        initializeAuth();
      } else {
        console.log('En attente du chargement de Supabase...');
      }
    }, 100);

    // Timeout après 15 secondes
    setTimeout(() => {
      if (!supabaseLoaded) {
        console.error('Erreur: Supabase non chargé après timeout');
        console.log('Formulaire accessible malgré l\'erreur Supabase');
      }
    }, 15000);

    // Vérifier et initialiser hCaptcha
    let hcaptchaToken = null;
    let hcaptchaLoaded = false;
    const initializeHCaptcha = () => {
      console.log('Tentative d\'initialisation hCaptcha');
      if (typeof hcaptcha !== 'undefined' && !hcaptchaLoaded) {
        const hcaptchaContainer = document.getElementById('hcaptcha-container');
        if (!hcaptchaContainer) {
          console.error('Erreur: Conteneur hCaptcha #hcaptcha-container non trouvé');
          return;
        }
        try {
          hcaptchaLoaded = true;
          console.log('hCaptcha chargé, initialisation du widget');
          hcaptcha.render('hcaptcha-container', {
            sitekey: 'b97e9bec-2b16-4812-975a-edac0ed2780c',
            callback: (token) => {
              console.log('hCaptcha token généré:', token);
              hcaptchaToken = token;
            },
            'error-callback': (error) => {
              console.error('Erreur hCaptcha:', error);
              hcaptchaToken = null;
              hcaptcha.reset('hcaptcha-container');
            },
            'expired-callback': () => {
              console.log('hCaptcha token expiré');
              hcaptchaToken = null;
              hcaptcha.reset('hcaptcha-container');
            }
          });
          console.log('hCaptcha widget rendu avec succès');
        } catch (error) {
          console.error('Erreur initialisation hCaptcha:', error);
          hcaptchaLoaded = false;
          hcaptchaToken = null;
        }
      } else {
        console.log('hCaptcha non chargé ou déjà initialisé');
      }
    };

    // Initialiser hCaptcha après un délai pour garantir le chargement
    setTimeout(initializeHCaptcha, 1000);

    function initializeAuth() {
      console.log('Initialisation de Supabase...');
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza2hodHRubWpmbWllcWtheXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTk1NDgsImV4cCI6MjA2OTg5NTU0OH0.or26KhHzKJ7oPYu0tQrXLIMwpBxZmHqGwC5rfGKrADI';
      const supabase = window.supabase.createClient('https://cskhhttnmjfmieqkayzg.supabase.co', SUPABASE_ANON_KEY);

      // Gestion du formulaire d'inscription
      const signupForm = document.getElementById('signup-form');
      if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          console.log('Formulaire d\'inscription soumis');
          const name = document.getElementById('signup-name').value;
          const email = document.getElementById('signup-email').value;
          const password = document.getElementById('signup-password').value;
          console.log('Données formulaire:', { name, email, password });
          try {
            // Vérifier le token hCaptcha
            if (!hcaptchaToken) {
              console.error('Erreur: Aucun token hCaptcha trouvé');
              alert('Veuillez valider hCaptcha.');
              if (hcaptchaLoaded) hcaptcha.reset('hcaptcha-container');
              return;
            }
            console.log('hCaptcha token:', hcaptchaToken);
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { full_name: name }, captchaToken: hcaptchaToken }
            });
            if (error) {
              console.error('Erreur inscription:', error.message);
              alert('Erreur lors de l’inscription : ' + error.message);
              if (hcaptchaLoaded) hcaptcha.reset('hcaptcha-container');
              hcaptchaToken = null;
            } else {
              console.log('Inscription réussie:', data);
              alert('Inscription réussie ! Vérifiez votre e-mail pour confirmer.');
              window.location.href = 'confirmation.html';
            }
          } catch (error) {
            console.error('Erreur générale inscription:', error);
            alert('Erreur lors de l’inscription : ' + error.message);
            if (hcaptchaLoaded) hcaptcha.reset('hcaptcha-container');
            hcaptchaToken = null;
          }
        });
      } else {
        console.error('Erreur: Formulaire signup-form non trouvé');
      }

      // Gestion du formulaire de connexion
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          console.log('Formulaire de connexion soumis');
          const email = document.getElementById('login-email').value;
          const password = document.getElementById('login-password').value;
          console.log('Données formulaire:', { email, password });
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            if (error) {
              console.error('Erreur connexion:', error.message);
              alert('Erreur lors de la connexion : ' + error.message);
            } else {
              console.log('Connexion réussie:', data);
              window.location.href = 'portail.html';
            }
          } catch (error) {
            console.error('Erreur générale connexion:', error);
            alert('Erreur lors de la connexion : ' + error.message);
          }
        });
      } else {
        console.error('Erreur: Formulaire login-form non trouvé');
      }
    }
  }
});