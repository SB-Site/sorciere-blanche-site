document.addEventListener('DOMContentLoaded', () => {
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

  // Réinitialiser cookies si ?resetCookies=true ou incognito
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('resetCookies') === 'true' || incognito) {
    localStorage.clear();
    localStorage.setItem('cookiesAccepted', 'false');
    localStorage.setItem('cookiesAcceptedTimestamp', new Date().toISOString());
    localStorage.setItem('cookieVersion', '1.0');
  }

  // Vérifier et nettoyer localStorage corrompu ou expiré
  let cookiesAccepted = localStorage.getItem('cookiesAccepted');
  let cookiesAcceptedTimestamp = localStorage.getItem('cookiesAcceptedTimestamp');
  let cookieVersion = localStorage.getItem('cookieVersion');
  const currentCookieVersion = '1.0';
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const now = new Date().getTime();
  const isExpired = cookiesAcceptedTimestamp && (now - new Date(cookiesAcceptedTimestamp).getTime() > thirtyDaysInMs);
  const isOldTimestamp = cookiesAcceptedTimestamp && new Date(cookiesAcceptedTimestamp).getTime() < new Date('2025-08-17T15:54:00.000Z').getTime();
  const isOldVersion = cookieVersion !== currentCookieVersion;

  if (!cookiesAccepted || (cookiesAccepted !== 'true' && cookiesAccepted !== 'false') || !cookiesAcceptedTimestamp || isExpired || isOldTimestamp || isOldVersion) {
    localStorage.setItem('cookiesAccepted', 'false');
    localStorage.setItem('cookiesAcceptedTimestamp', new Date().toISOString());
    localStorage.setItem('cookieVersion', currentCookieVersion);
    cookiesAccepted = 'false';
  }

  // Réinitialiser popup pour test sur index.html
  if (window.location.pathname.includes('index.html')) {
    localStorage.removeItem('popupClosed');
  }

  // Gestion popup
  const popupEl = document.getElementById('construction-popup');
  const header = document.querySelector('header');
  if (popupEl && !localStorage.getItem('popupClosed')) {
    popupEl.classList.add('active');
    if (header) header.style.display = 'none';
  }

  window.closePopup = function() {
    if (popupEl) {
      popupEl.classList.remove('active');
      localStorage.setItem('popupClosed', 'true');
      if (header) {
        header.style.display = '';
        header.style.position = 'relative';
        header.style.left = '0';
        header.style.top = '0';
      }
    }
  };

  // Toggle newsletter
  window.toggleNewsletterForm = function() {
    const form = document.getElementById('newsletterForm') || document.getElementById('ebookForm');
    if (form) {
      form.classList.toggle('active');
      form.style.display = form.classList.contains('active') ? 'block' : 'none';
    }
  };

  // Carousel
  const carousel = document.querySelector('.carousel-inner');
  if (carousel) {
    const images = carousel.querySelectorAll('.carousel-image');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;
    images[currentIndex].classList.add('active');

    const showImage = (index) => {
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
    };

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
  }

  // Cookies banner
  const cookieBanner = document.getElementById('cookieBanner');
  const copyright = document.querySelector('.copyright');
  if (cookieBanner) {
    setTimeout(() => {
      if (cookiesAccepted !== 'true' || incognito) {
        cookieBanner.classList.add('cookie-banner-visible');
      } else {
        copyright?.classList.remove('copyright-hidden');
      }
    }, 200);
  }

  window.acceptCookies = function() {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiesAcceptedTimestamp', new Date().toISOString());
    localStorage.setItem('cookieVersion', currentCookieVersion);
    if (cookieBanner) {
      cookieBanner.classList.remove('cookie-banner-visible');
      cookieBanner.style.display = 'none';
    }
    if (copyright) copyright.classList.remove('copyright-hidden');
  };

  // Masquer newsletter après soumission
  const newsletterIframe = document.querySelector('#newsletterForm iframe, #ebookForm iframe');
  if (newsletterIframe) {
    let iframeLoadedOnce = false;
    newsletterIframe.addEventListener('load', () => {
      let iframeSrc;
      try {
        iframeSrc = newsletterIframe.contentWindow.location.href || newsletterIframe.src;
      } catch (e) {
        iframeSrc = newsletterIframe.src;
      }
      if (iframeSrc.includes('framaforms.org') && !iframeSrc.includes('bienvenue-aux-magic-info')) {
        const form = document.getElementById('newsletterForm') || document.getElementById('ebookForm');
        if (form) setTimeout(() => form.style.display = 'none', 10000);
      } else if (iframeLoadedOnce) {
        const form = document.getElementById('newsletterForm') || document.getElementById('ebookForm');
        if (form) setTimeout(() => form.style.display = 'none', 10000);
      } else {
        iframeLoadedOnce = true;
      }
    });
  }

  // CAPTCHA et auth Supabase (créer-compte.html & portail.html)
  let currentCaptcha = null;
  const captchaQuestions = [
    { question: 'Citez un des familiers de la Sorcière Blanche ?', answers: ['Corbeau', 'Chouette'] },
    { question: 'Quel est le nom de famille de Lazare ?', answers: ['Donatien'] },
    { question: 'Qui est l’auteur de Secrets de Samhain ?', answers: ['L\'Alchimiste'] }
  ];

  window.showTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tab}')"]`).classList.add('active');

    if (!currentCaptcha) currentCaptcha = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];

    setTimeout(() => {
      const labels = [document.getElementById('captcha-label'), document.getElementById('captcha-label-login')];
      labels.forEach(label => label && (label.textContent = currentCaptcha.question));
    }, 500);
  };

  if (window.location.pathname.includes('creer-compte.html')) {
    if (!currentCaptcha) currentCaptcha = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];

    setTimeout(() => {
      const labels = [document.getElementById('captcha-label'), document.getElementById('captcha-label-login')];
      labels.forEach(label => label && (label.textContent = currentCaptcha.question));
    }, 500);

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const captcha = document.getElementById('captcha-answer').value.toLowerCase();
        if (!currentCaptcha.answers.some(a => a.toLowerCase() === captcha)) {
          alert('Erreur : Réponse incorrecte. Veuillez vérifier votre réponse.');
          return;
        }

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
          });
          if (error) throw error;
          alert('Inscription réussie ! Redirection vers confirmation.');
          window.location.href = '/confirmation.html';
        } catch (error) {
          alert('Erreur lors de l’inscription : ' + error.message);
        }
      });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const captcha = document.getElementById('login-captcha').value.toLowerCase();
        if (!currentCaptcha.answers.some(a => a.toLowerCase() === captcha)) {
          alert('Erreur : Réponse incorrecte. Veuillez vérifier votre réponse.');
          return;
        }

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          window.location.href = '/portail.html';
        } catch (error) {
          alert('Erreur lors de la connexion : ' + error.message);
        }
      });
    }
  }

  if (window.location.pathname.includes('portail.html')) {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) window.location.href = '/creer-compte.html';
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) userNameElement.textContent = data.session.user.user_metadata.username || 'Initié';
    });
  }

  // PayPal boutons custom
  const paypalContainer = document.getElementById('paypal-button-container');
  if (paypalContainer && window.paypal) {
    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: (data, actions) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) return Promise.reject('Panier vide');

        let items = [];
        let itemTotal = 0.00;
        cart.forEach(product => {
          const unitPrice = parseFloat(product.price).toFixed(2);
          const quantity = product.quantity || 1;
          const subtotal = parseFloat(unitPrice) * quantity;
          items.push({
            name: product.name.substring(0, 127),
            unit_amount: { currency_code: 'EUR', value: unitPrice },
            quantity: quantity.toString()
          });
          itemTotal += subtotal;
        });

        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: itemTotal.toFixed(2),
              breakdown: { item_total: { currency_code: 'EUR', value: itemTotal.toFixed(2) } }
            },
            items: items
          }]
        });
      },
      onApprove: (data, actions) => actions.order.capture().then(async details => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem('lastOrderCart', JSON.stringify(cart));

        try {
          await emailjs.send("service_wjuzvqr", "template_r4iy5fj", {
            name: details.payer.name.given_name || 'Cher Client',
            email: details.payer.email_address || '',
            orderId: details.id,
            total: details.purchase_units[0].amount.value,
            items: cart.map(item => `${item.name} x${item.quantity}`).join('\n')
          });
        } catch (err) {
          // Silent fail – paiement OK
        }

        alert('Paiement réussi ! Merci ' + (details.payer.name.given_name || 'Client') + ' ! Un email de confirmation vous a été envoyé.');
        localStorage.removeItem('cart');
        window.location.href = '/confirmation-paiement.html?order=' + details.id;
      }),
      onError: () => alert('Une erreur est survenue lors du paiement. Veuillez réessayer.'),
      onCancel: () => alert('Paiement annulé. Vous pouvez réessayer.')
    }).render('#paypal-button-container');
  }

  // Fix clics menu sous popup
  document.querySelectorAll('nav ul li a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (popupEl && popupEl.classList.contains('active')) {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = link.href;
      }
    }, true);
  });
});
// YouTube thumbnails lazy load
document.querySelectorAll('.trailer').forEach(trailer => {
  trailer.addEventListener('click', () => {
    const videoId = trailer.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    iframe.title = 'Booktrailer';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    trailer.innerHTML = '';
    trailer.appendChild(iframe);
  });
});