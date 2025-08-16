document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded on Ste Web SB user');
  console.log('LocalStorage domain:', window.location.hostname);
  console.log('Checking for construction-popup element...');
  // Détection mode incognito
  const isIncognito = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return false;
    } catch (e) {
      return true;
    }
  };
  const incognito = isIncognito();
  console.log('Is incognito mode?', incognito);
  // Réinitialiser cookies si ?resetCookies=true ou incognito
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('resetCookies') === 'true' || incognito) {
    console.log('Clearing localStorage due to ?resetCookies=true or incognito');
    localStorage.clear();
    localStorage.setItem('cookiesAccepted', 'false');
  }
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
  // Gestion newsletter form
  window.toggleNewsletterForm = function() {
    console.log('toggleNewsletterForm function called');
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.classList.toggle('active');
      console.log('Newsletter form toggled:', newsletterForm.classList.contains('active') ? 'visible' : 'hidden');
      newsletterForm.style.display = newsletterForm.classList.contains('active') ? 'block' : 'none';
    } else {
      console.error('Erreur: newsletterForm non trouvé');
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
  if (!cookieBanner) {
    console.error('Error: cookieBanner not found');
  } else {
    if (localStorage.getItem('cookiesAccepted') === 'false' || urlParams.get('resetCookies') === 'true' || incognito) {
      console.log('Showing cookie banner');
      cookieBanner.classList.add('cookie-banner-visible');
      cookieBanner.style.display = 'block';
      cookieBanner.style.visibility = 'visible';
    } else {
      console.log('Cookies accepted, hiding cookie banner');
      cookieBanner.classList.remove('cookie-banner-visible');
      cookieBanner.style.display = 'none';
      cookieBanner.style.visibility = 'hidden';
    }
  }
  if (copyright) {
    console.log('Cookies accepted, showing copyright');
    copyright.classList.remove('copyright-hidden');
  }
  window.acceptCookies = function() {
    console.log('Accept button clicked');
    localStorage.setItem('cookiesAccepted', 'true');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
      console.log('Force hiding cookie banner');
      cookieBanner.classList.remove('cookie-banner-visible');
      cookieBanner.style.display = 'none';
      cookieBanner.style.visibility = 'hidden';
      setTimeout(() => {
        cookieBanner.style.display = 'none';
        console.log('Re-forcing cookie banner hide after 100ms');
      }, 100);
    } else {
      console.error('Error: cookieBanner not found in acceptCookies');
    }
    if (copyright) {
      console.log('Ensuring copyright visible:', copyright);
      copyright.classList.remove('copyright-hidden');
    }
  };
  // Masquer l'encart newsletter après soumission
  const newsletterIframe = document.querySelector('#newsletterForm iframe');
  if (newsletterIframe) {
    let iframeLoadedOnce = false;
    newsletterIframe.addEventListener('load', () => {
      console.log('Newsletter iframe loaded');
      let iframeSrc;
      try {
        iframeSrc = newsletterIframe.contentWindow.location.href || newsletterIframe.src;
      } catch (e) {
        iframeSrc = newsletterIframe.src;
      }
      if (iframeSrc.includes('framaforms.org') && !iframeSrc.includes('bienvenue-aux-magic-info')) {
        console.log('Submission detected via Framaforms URL change');
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm && window.location.pathname.includes('index.html')) {
          setTimeout(() => {
            newsletterForm.classList.remove('active');
            newsletterForm.style.display = 'none';
            console.log('Newsletter form hidden after 10s');
          }, 10000);
        }
      } else if (iframeLoadedOnce) {
        console.log('Second load detected - hiding newsletter form after submission');
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm && window.location.pathname.includes('index.html')) {
          setTimeout(() => {
            newsletterForm.classList.remove('active');
            newsletterForm.style.display = 'none';
            console.log('Newsletter form hidden after 10s');
          }, 10000);
        }
      } else {
        console.log('First load - setting flag');
        iframeLoadedOnce = true;
      }
    });
  }
  // Gestion des onglets pour creer-compte.html
  window.showTab = function(tab) {
    console.log('Switching to tab:', tab);
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tab}')"]`).classList.add('active');
    console.log('Tabs initialized');
    // Refresh CAPTCHA après changement d'onglet
    const captchaQuestions = [
      { question: 'Citez un des familiers de la Sorcière Blanche ?', answers: ['Corbeau', 'Chouette'] },
      { question: 'Quel est le nom de famille de Lazare ?', answers: ['Donatien'] },
      { question: 'Qui est l’auteur de Secrets de Samhain ?', answers: ['L\'Alchimiste'] }
    ];
    const randomCaptcha = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];
    console.log('CAPTCHA sélectionné:', randomCaptcha.question);
    setTimeout(() => {
      const captchaLabel = document.getElementById('captcha-label');
      const captchaLabelLogin = document.getElementById('captcha-label-login');
      if (captchaLabel) {
        captchaLabel.textContent = randomCaptcha.question;
        console.log('CAPTCHA label set:', randomCaptcha.question);
      } else {
        console.error('Erreur: captcha-label non trouvé');
      }
      if (captchaLabelLogin) {
        captchaLabelLogin.textContent = randomCaptcha.question;
        console.log('CAPTCHA label login set:', randomCaptcha.question);
      } else {
        console.error('Erreur: captcha-label-login non trouvé');
      }
    }, 500);
  };
  // Supabase initialisation
  const supabase = window.supabase.createClient('https://cskhhttnmjfmieqkayzg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza2hodHRubWpmbWllcWtheXpnIiwicm9sZSI6imFub24iLCJpYXQiOjE3NTQzMTk1NDgsImV4cCI6MjA2OTg5NTU0OH0.or26KhHzKJ7oPYu0tQrXLIMwpBxZmHqGwC5rfGKrADI');
  console.log('Supabase initialized');
  // CAPTCHA maison pour creer-compte.html
  if (window.location.pathname.includes('creer-compte.html')) {
    console.log('DOM chargé pour creer-compte.html');
    const captchaQuestions = [
      { question: 'Citez un des familiers de la Sorcière Blanche ?', answers: ['Corbeau', 'Chouette'] },
      { question: 'Quel est le nom de famille de Lazare ?', answers: ['Donatien'] },
      { question: 'Qui est l’auteur de Secrets de Samhain ?', answers: ['L\'Alchimiste'] }
    ];
    const randomCaptcha = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];
    console.log('CAPTCHA sélectionné:', randomCaptcha.question);
    setTimeout(() => {
      const captchaLabel = document.getElementById('captcha-label');
      const captchaLabelLogin = document.getElementById('captcha-label-login');
      if (captchaLabel) {
        captchaLabel.textContent = randomCaptcha.question;
        console.log('CAPTCHA label set:', randomCaptcha.question);
      } else {
        console.error('Erreur: captcha-label non trouvé');
      }
      if (captchaLabelLogin) {
        captchaLabelLogin.textContent = randomCaptcha.question;
        console.log('CAPTCHA label login set:', randomCaptcha.question);
      } else {
        console.error('Erreur: captcha-label-login non trouvé');
      }
    }, 500);
    // Validation CAPTCHA pour inscription
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulaire d\'inscription soumis');
        const captcha = document.getElementById('captcha-answer').value;
        if (!randomCaptcha.answers.map(a => a.toLowerCase()).includes(captcha.toLowerCase())) {
          console.error('Erreur CAPTCHA: Réponse incorrecte');
          alert('Erreur : Réponse incorrecte. Veuillez vérifier votre réponse.');
          return;
        }
        console.log('CAPTCHA valide, soumission formulaire inscription');
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Données formulaire:', { username, email, password });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
          });
          if (error) throw error;
          console.log('Inscription réussie:', data.user);
          alert('Inscription réussie ! Redirection vers confirmation.');
          window.location.href = '/confirmation.html';
        } catch (error) {
          console.error('Erreur inscription:', error.message);
          alert('Erreur lors de l’inscription : ' + error.message);
        }
      });
    } else {
      console.error('Erreur: signup-form non trouvé');
    }
    // Validation CAPTCHA pour connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulaire de connexion soumis');
        const captcha = document.getElementById('login-captcha').value;
        if (!randomCaptcha.answers.map(a => a.toLowerCase()).includes(captcha.toLowerCase())) {
          console.error('Erreur CAPTCHA: Réponse incorrecte');
          alert('Erreur : Réponse incorrecte. Veuillez vérifier votre réponse.');
          return;
        }
        console.log('CAPTCHA valide, soumission formulaire connexion');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        console.log('Données formulaire:', { email, password });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          console.log('Connexion réussie:', data.user);
          window.location.href = '/portail.html';
        } catch (error) {
          console.error('Erreur connexion:', error.message);
          alert('Erreur lors de la connexion : ' + error.message);
        }
      });
    } else {
      console.error('Erreur: login-form non trouvé');
    }
  }
  // Vérification session pour portail.html
  if (window.location.pathname.includes('portail.html')) {
    console.log('DOM chargé pour portail.html');
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        console.error('Aucune session active, redirection vers creer-compte.html');
        window.location.href = '/creer-compte.html';
        return;
      }
      console.log('Session active:', data.session.user);
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
        userNameElement.textContent = data.session.user.user_metadata.username || 'Initié';
      }
    });
  }
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