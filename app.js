// Variables globales
let currentPage = 'portfolio';
const pages = {
    portfolio: {
        id: 'portfolio-page',
        nextPage: 'about',
        nextText: 'À propos'
    },
    about: {
        id: 'about-page',
        nextPage: 'portfolio',
        nextText: 'Portfolio'
    }
};

// Initialisation du site
document.addEventListener('DOMContentLoaded', function() {
    initCategoryFilter();
    initNavigation();
    initScrollButton();
    initNextPageButton();
    initContactForm();
    initSmoothScrolling();
    initLightbox();
});

function initCategoryFilter() {
  const chips = document.querySelectorAll('.category-chip');
  const sections = document.querySelectorAll('.category-section');
  console.log(chips)
  if (!chips.length || !sections.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const category = chip.getAttribute('data-category');

      // état visuel du chip actif
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      // filtrage des rubriques
      sections.forEach((section) => {
        const sectionCategory = section.getAttribute('data-category');

        if (category === 'all' || sectionCategory === category) {
          section.style.display = 'block';      // <- forcé
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Gestion de la lightbox pour les images
 */
function initLightbox() {
    // Créer l'élément lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
        <button class="lightbox-prev" aria-label="Image précédente">‹</button>
        <button class="lightbox-next" aria-label="Image suivante">›</button>
        <div class="lightbox-content">
            <img src="" alt="" class="lightbox-image">
            <div class="lightbox-info">
                <h3 class="lightbox-title"></h3>
                <p class="lightbox-medium"></p>
            </div>
        </div>
    `;
    
    // Ajouter les styles de la lightbox
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox.active {
            display: flex;
            opacity: 1;
        }
        
        .lightbox-content {
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        
        .lightbox-image {
            max-width: 90vw;
            max-height: 75vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-info {
            text-align: center;
            color: white;
        }
        
        .lightbox-title {
            font-size: 1.5rem;
            margin-bottom: 8px;
            color: white;
        }
        
        .lightbox-medium,
        
        .lightbox-close,
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
            padding: 10px 20px;
            transition: background 0.3s ease;
            border-radius: 4px;
            backdrop-filter: blur(10px);
        }
        
        .lightbox-close:hover,
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .lightbox-close {
            top: 20px;
            right: 20px;
            font-size: 3rem;
            line-height: 1;
            padding: 5px 15px;
        }
        
        .lightbox-prev {
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .lightbox-next {
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        @media (max-width: 768px) {
            .lightbox-prev,
            .lightbox-next {
                font-size: 2rem;
                padding: 8px 15px;
            }
            
            .lightbox-close {
                font-size: 2.5rem;
            }
            
            .lightbox-image {
                max-height: 60vh;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(lightbox);
    
    // Variables pour la navigation
    let currentImageIndex = 0;
    let artworkItems = [];
    
    // Fonction pour ouvrir la lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const item = artworkItems[currentImageIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const medium = item.querySelector('.medium').textContent;
        
        lightbox.querySelector('.lightbox-image').src = img.src;
        lightbox.querySelector('.lightbox-image').alt = img.alt;
        lightbox.querySelector('.lightbox-title').textContent = title;
        lightbox.querySelector('.lightbox-medium').textContent = medium;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Fonction pour fermer la lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Fonction pour naviguer vers l'image suivante
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % artworkItems.length;
        openLightbox(currentImageIndex);
    }
    
    // Fonction pour naviguer vers l'image précédente
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + artworkItems.length) % artworkItems.length;
        openLightbox(currentImageIndex);
    }
    
    // Ajouter les événements sur les images de la galerie
    artworkItems = Array.from(document.querySelectorAll('.artwork-item'));
    artworkItems.forEach((item, index) => {
        const img = item.querySelector('.artwork-image');
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(index));
    });
    
    // Événements de la lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
    
    // Fermer en cliquant sur le fond
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

/**
 * Gestion de la navigation principale
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            switchToPage(targetPage);
        });
    });
}

/**
 * Changement de page avec animations
 */
function switchToPage(targetPage) {
    if (targetPage === currentPage) return;
    
    // Mise à jour des liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === targetPage) {
            link.classList.add('active');
        }
    });
    
    // Animation de sortie de la page actuelle
    const currentPageElement = document.getElementById(pages[currentPage].id);
    const targetPageElement = document.getElementById(pages[targetPage].id);
    
    currentPageElement.style.opacity = '0';
    currentPageElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        // Masquer la page actuelle
        currentPageElement.classList.remove('active');
        currentPageElement.style.opacity = '';
        currentPageElement.style.transform = '';
        
        // Afficher la nouvelle page
        targetPageElement.classList.add('active');
        targetPageElement.style.opacity = '0';
        targetPageElement.style.transform = 'translateY(20px)';
        
        // Animation d'entrée de la nouvelle page
        setTimeout(() => {
            targetPageElement.style.transition = 'all 0.5s ease';
            targetPageElement.style.opacity = '1';
            targetPageElement.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                targetPageElement.style.transition = '';
            }, 500);
        }, 50);
        
        // Mise à jour de la page courante et du bouton suivant
        currentPage = targetPage;
        updateNextPageButton();
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
}

/**
 * Gestion du bouton "retour en haut"
 */
function initScrollButton() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Affichage/masquage selon la position de scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Action du clic
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Gestion du bouton "page suivante"
 */
function initNextPageButton() {
    const nextPageBtn = document.getElementById('next-page-btn');
    
    nextPageBtn.addEventListener('click', function() {
        const nextPage = pages[currentPage].nextPage;
        switchToPage(nextPage);
    });
    
    updateNextPageButton();
}

/**
 * Mise à jour du texte du bouton "page suivante"
 */
function updateNextPageButton() {
    const nextPageBtn = document.getElementById('next-page-btn');
    const btnText = nextPageBtn.querySelector('.btn-text');
    btnText.textContent = pages[currentPage].nextText;
}

/**
 * Gestion du formulaire de contact
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validation simple
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        try {
            const response = await fetch("https://formspree.io/f/xgvnllzp", {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: formData
            });

            if (response.ok) {
                showNotification("Votre message a été envoyé avec succès !", "success");
                contactForm.reset();
            } else {
                showNotification("Une erreur est survenue. Réessayez plus tard.", "error");
            }
        } catch (error) {
            showNotification("Erreur de connexion. Vérifiez votre réseau.", "error");
        }
    });
}

/**
 * Validation d'email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Affichage de notifications
 */
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00aa44' : '#0066cc'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 2000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de disparition automatique
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/**
 * Scroll fluide pour tous les liens d'ancrage
 */
function initSmoothScrolling() {
    // Gestion du scroll fluide pour les liens internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Animation d'apparition des éléments au scroll (optionnel)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les éléments de la galerie
    document.querySelectorAll('.artwork-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

/**
 * Gestion des événements clavier pour l'accessibilité
 */
document.addEventListener('keydown', function(e) {
    // Navigation avec les touches fléchées
    if (e.altKey) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextPage = pages[currentPage].nextPage;
            switchToPage(nextPage);
        }
    }
    
    // Retour en haut avec la touche Home
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/**
 * Optimisation des performances - Debounce pour le scroll
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Application du debounce au scroll
const debouncedScrollHandler = debounce(function() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, 10);

// Remplacer le gestionnaire de scroll existant
window.removeEventListener('scroll', function() {});
window.addEventListener('scroll', debouncedScrollHandler);

/**
 * Préchargement des polices pour améliorer les performances
 */
function preloadFonts() {
    const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];
    
    fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

/**
 * Gestion du mode clair/sombre
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const body = document.body;
  const profilePhoto = document.querySelector('.placeholder-photo img');

  // Fonction pour changer la photo selon le thème
  function updateProfilePhoto(theme) {
    if (profilePhoto) {
      if (theme === 'dark') {
        profilePhoto.src = 'Images/PhotoProNoire.jpg';
      } else {
        profilePhoto.src = 'Images/PhotoProBlanche.png';
      }
    }
  }

  // Charger la préférence stockée
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-color-scheme', savedTheme);
    toggleButton.textContent = savedTheme === 'dark' ? '🌞' : '🌙';
    updateProfilePhoto(savedTheme);
  } else {
    // Par défaut, si aucun thème n'est sauvegardé, on utilise le mode sombre
    updateProfilePhoto('dark');
  }

  toggleButton.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-color-scheme', newTheme);
    toggleButton.textContent = newTheme === 'dark' ? '🌞' : '🌙';
    localStorage.setItem('theme', newTheme);
    updateProfilePhoto(newTheme);
  });
});