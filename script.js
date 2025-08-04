document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded on Ste Web SB user');
  console.log('LocalStorage domain:', window.location.hostname);
  console.log('Checking for construction-popup element...');

  // Réinitialiser localStorage pour tester la pop-up
  console.log('Resetting popupClosed in localStorage for testing');
  localStorage.removeItem('popupClosed');

  // Gestion de la pop-up
  const popup = document.getElementById('construction-popup');
  if (popup) {
    console.log('Popup element found:', popup);
    console.log('popupClosed in localStorage:', localStorage.getItem('popupClosed'));
    // Afficher la pop-up si pas encore vue
    if (!localStorage.getItem('popupClosed')) {
      console.log('Showing popup');
      popup.classList.add('active');
    } else {
      console.log('Popup not shown, already closed');
    }
  } else {
    console.error('Error: construction-popup element not found');
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
      console.error('Error: construction-popup not found in closePopup');
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
    console.log('Carousel not found');
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

  // Gestion du formulaire de connexion Firebase (creer-compte.html)
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    console.log('Login form found');
    const firebaseConfig = {
      apiKey: "AIzaSyDTLmqjNyOODvp51K3hBjfzENhvm9aC0ew",
      authDomain: "sb-editions.firebaseapp.com",
      projectId: "sb-editions",
      storageBucket: "sb-editions.firebasestorage.app",
      messagingSenderId: "517978298591",
      appId: "1:517978298591:web:bba99b0266e43965a3f16a"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#login-email').value;
      const password = loginForm.querySelector('#login-password').value;
      const recaptchaResponse = grecaptcha.getResponse();
      console.log('Submitting login form with email:', email, 'reCAPTCHA:', recaptchaResponse);

      if (!recaptchaResponse) {
        console.error('reCAPTCHA non validé');
        alert('Veuillez valider le reCAPTCHA.');
        return;
      }

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('Connexion réussie, redirection vers index.html');
          alert('Connexion réussie ! Bienvenue dans votre espace !');
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error('Erreur connexion:', error);
          alert('Erreur : ' + error.message);
        });
    });
  } else {
    console.log('Login form not found');
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
});