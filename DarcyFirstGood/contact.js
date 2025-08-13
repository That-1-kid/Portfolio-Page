// JavaScript for enhanced interactivity and UX

(() => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Mobile menu toggle
  const mobileMenuToggle = () => {
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.navbar');
    
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
      menuButton.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('active');
    });
  };

  // Form validation
  const formValidation = () => {
    const form = document.querySelector('.contact-form');
    const nameField = form.querySelector('input[name="name"]');
    const emailField = form.querySelector('input[name="email"]');
    const messageField = form.querySelector('textarea[name="message"]');
    
    const showError = (field, message) => {
      const errorElement = field.nextElementSibling;
      errorElement.textContent = message;
      field.classList.add('error');
    };

    const clearError = (field) => {
      const errorElement = field.nextElementSibling;
      errorElement.textContent = '';
      field.classList.remove('error');
    };

    form.addEventListener('submit', (e) => {
      let valid = true;
      
      if (!nameField.value.trim()) {
        showError(nameField, 'Name is required.');
        valid = false;
      } else {
        clearError(nameField);
      }

      if (!emailField.value.trim() || !/\S+@\S+\.\S+/.test(emailField.value)) {
        showError(emailField, 'Valid email is required.');
        valid = false;
      } else {
        clearError(emailField);
      }

      if (!messageField.value.trim()) {
        showError(messageField, 'Message is required.');
        valid = false;
      } else {
        clearError(messageField);
      }

      if (!valid) {
        e.preventDefault();
      }
    });
  };

  // Interactive animations
  const interactiveAnimations = () => {
    // Hover effect on cards/buttons
    const interactiveElements = document.querySelectorAll('.content-card, .btn');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      });
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = 'none';
      });
    });

    // Dark/light mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  };

  // Initialize all functionalities
  const init = () => {
    mobileMenuToggle();
    formValidation();
    interactiveAnimations();
  };

  // Run initialization on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
})();