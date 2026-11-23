/* ==========================================================================
   PERSONAL PORTFOLIO INTERACTIVE SCRIPT
   Includes: Dynamic Typing Animation, Scroll Reveal, Mobile Menu,
             Animated Counters, Project Filtering & Email Form Submission
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initProjectFilter();
  initContactForm();
});

/* 1. Responsive Mobile Navigation Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isExpanded = navMenu.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });
}

/* 2. Dynamic Animated Role Typing Effect (Home Page) */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  // Customize these roles to match your own skills
  const roles = [
    'Full-Stack Web Developer',
    'Frontend UI/UX Designer',
    'Python Problem Solver',
    'Computer Science Student'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 95;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1600; // Pause at complete word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }

  typeLoop();
}

/* 3. Smooth Scroll Reveal using IntersectionObserver */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* 4. Animated Number Counters on Home Page */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  counters.forEach((counter) => {
    const target = Number(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      } else {
        counter.textContent = current + suffix;
      }
    }, 35);
  });
}

/* 5. Interactive Category Filter on Projects Page */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 6. Interactive Contact Form Validation & Web3Forms Email Delivery */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    // Prevent default browser page reload
    event.preventDefault();

    // Collect references to form fields and UI feedback elements
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const timelineSelect = document.getElementById('timeline');
    const messageInput = document.getElementById('message');
    const feedbackBox = document.getElementById('formFeedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    let isValid = true;

    // Hide any previous validation error messages
    document.querySelectorAll('.error-msg').forEach((el) => (el.style.display = 'none'));

    // Validate Full Name (minimum 2 characters)
    if (nameInput.value.trim().length < 2) {
      document.getElementById('nameError').style.display = 'block';
      isValid = false;
    }

    // Validate Email Format using Regular Expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      document.getElementById('emailError').style.display = 'block';
      isValid = false;
    }

    // Validate at least one Checkbox (Services/Topics) is selected
    const checkedServices = Array.from(
      document.querySelectorAll('input[name="services"]:checked')
    ).map((cb) => cb.value);

    if (checkedServices.length === 0) {
      document.getElementById('serviceError').style.display = 'block';
      isValid = false;
    }

    // Validate Message Textarea (minimum 10 characters)
    if (messageInput.value.trim().length < 10) {
      document.getElementById('messageError').style.display = 'block';
      isValid = false;
    }

    // Stop submission if any validation rule fails
    if (!isValid) return;

    // Store clean user inputs before resetting the form
    const senderName = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const selectedInquiry =
      document.querySelector('input[name="inquiryType"]:checked')?.value || 'General';
    const selectedTimeline = timelineSelect.value;

    // Build FormData (automatically includes hidden access_key & subject from contact.html)
    const formData = new FormData(form);
    // Combine multiple checked checkboxes into a single comma-separated string for cleaner email formatting
    formData.delete('services');
    formData.append('services', checkedServices.join(', '));

    // Disable submit button while sending request to prevent duplicate clicks
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';

    try {
      // Send form data asynchronously to Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        // Show on-page confirmation receipt after email is successfully dispatched
        feedbackBox.innerHTML = `
          <h4 class="neon-accent" style="margin-bottom: 0.5rem;">Message Sent Successfully!</h4>
          <p>Thank you, <strong>${escapeHTML(senderName)}</strong>. Your inquiry has been delivered to my email:</p>
          <ul class="styled-ul" style="margin-top: 0.75rem;">
            <li><strong>Email:</strong> ${escapeHTML(senderEmail)}</li>
            <li><strong>Inquiry Type:</strong> ${escapeHTML(selectedInquiry)}</li>
            <li><strong>Topics:</strong> ${escapeHTML(checkedServices.join(', '))}</li>
            <li><strong>Timeline:</strong> ${escapeHTML(selectedTimeline)}</li>
          </ul>
        `;
        feedbackBox.style.display = 'block';
        form.reset();
      } else {
        // Handle API-side error (e.g., invalid access key)
        feedbackBox.innerHTML = `
          <p style="color: #fb7185;"><strong>Submission Failed:</strong> ${escapeHTML(
            result.message || 'Unable to send message right now. Please try again.'
          )}</p>
        `;
        feedbackBox.style.display = 'block';
      }
    } catch (error) {
      // Handle offline / network connectivity errors
      feedbackBox.innerHTML = `
        <p style="color: #fb7185;"><strong>Network Error:</strong> Please check your internet connection and try again.</p>
      `;
      feedbackBox.style.display = 'block';
    } finally {
      // Restore submit button to original state
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message &#10148;';
    }
  });
}

/* Helper Function: Sanitize HTML characters to prevent XSS in feedback preview */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
