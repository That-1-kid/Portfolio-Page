// JavaScript for Interactivity and Enhanced UX

// IIFE to encapsulate functionality and avoid global variables
(() => {
  // Smooth scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
    navbar.classList.toggle('active');
  });

  // Form validation
  const form = document.querySelector('.contact-form');
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const messageInput = form.querySelector('textarea[name="message"]');
  
  form.addEventListener('submit', (e) => {
    let valid = true;
    
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.nextElementSibling.textContent = `${input.name} is required.`;
      } else {
        input.nextElementSibling.textContent = '';
      }
    });

    if (!valid) {
      e.preventDefault();
    }
  });

  // Interactive animations
  const buttons = document.querySelectorAll('.btn, .content-card');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = 'none';
    });
  });

  // Dark/Light mode toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });

  // Accessibility: Keyboard navigation for menu toggle
  menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      menuToggle.click();
    }
  });

})();