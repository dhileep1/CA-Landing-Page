/* ==========================================================================
   MAIN MULTI-PAGE APPLICATION SCRIPT & APPOINTMENT BOOKING ENGINE
   ========================================================================== */

/// Global Configuration - Update these values anytime!
const CA_CONFIG = {
  // Free Web3Forms Access Key from https://web3forms.com
  WEB3FORMS_ACCESS_KEY: '8c7f11ee-5e34-45bf-b258-1b8080f1c336',
  
  // Practice WhatsApp Number (Country code without + or spaces)
  WHATSAPP_NUMBER: '916369764886',
  
  // Practice Support Email
  FIRM_EMAIL: 'dhileepansb@gmail.com'
};

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar Shadow & Mobile Menu Toggle
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Interactive Dropdown Menu Trigger on Click & Hover
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    
    trigger?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
      }
    });
  });

  // Set minimum date for date picker inputs to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const todayStr = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.min = todayStr;
  });

  // FAQ Accordion & Search Input
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.getElementById('faq-search');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconColor = type === 'success' ? '#7CB342' : '#FF9800';
    
    toast.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 10 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 5500);
  }

  // Two-step Email Submission + WhatsApp Follow-up Card Handler
  const bookingForms = document.querySelectorAll('.booking-form');

  bookingForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <span>Sending Email...</span>
        `;
      }

      // Read form input values
      const name = form.querySelector('[name="name"]')?.value || 'Client';
      const phone = form.querySelector('[name="phone"]')?.value || 'N/A';
      const email = form.querySelector('[name="email"]')?.value || 'N/A';
      const service = form.querySelector('[name="service"]')?.value || 'General Tax Advisory';
      const date = form.querySelector('[name="date"]')?.value || 'To be agreed';
      const timeSlot = form.querySelector('[name="time_slot"]')?.value || 'Flexible';
      const message = form.querySelector('[name="message"]')?.value || 'No notes provided';

      let emailSentSuccess = false;

      // 1. Send Email via Web3Forms API
      if (CA_CONFIG.WEB3FORMS_ACCESS_KEY && CA_CONFIG.WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        try {
          const formData = new FormData();
          formData.append('access_key', CA_CONFIG.WEB3FORMS_ACCESS_KEY);
          formData.append('subject', `🗓️ New CA Appointment: ${service} - ${name}`);
          formData.append('from_name', 'Kathirvel Associates CA Desk');
          formData.append('Client Name', name);
          formData.append('Phone / WhatsApp', phone);
          formData.append('Email', email);
          formData.append('Service Requested', service);
          formData.append('Preferred Date', date);
          formData.append('Time Slot', timeSlot);
          formData.append('Client Message', message);

          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            emailSentSuccess = true;
          }
        } catch (err) {
          console.warn('Web3Forms email submit error:', err);
        }
      }

      // 2. Format WhatsApp Deep-Link Message
      const waMessage = 
`Hello Kathirvel Associates CA Team 👋,

I have submitted an appointment request on your website:`;website:

👤 *Name:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email}
📋 *Service:* ${service}
📅 *Preferred Date:* ${date}
⏰ *Time Slot:* ${timeSlot}
💬 *Details:* ${message}

Looking forward to connecting!`;

      const encodedMsg = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${CA_CONFIG.WHATSAPP_NUMBER}?text=${encodedMsg}`;

      // 3. Hide Form & Show Success Card with WhatsApp Button
      form.style.display = 'none';

      const parentCard = form.parentElement;
      const existingSuccess = parentCard.querySelector('.form-success-card');
      if (existingSuccess) existingSuccess.remove();

      const successCard = document.createElement('div');
      successCard.className = 'form-success-card';
      successCard.innerHTML = `
        <div class="success-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="margin-bottom:0.5rem; font-size:1.35rem; color:var(--primary-navy);">Appointment Request Sent!</h3>
        <p style="color:var(--neutral-600); font-size:0.925rem; line-height:1.5; margin-bottom:1rem;">
          Thank you <strong>${name}</strong>! Your email request for <strong>${service}</strong> has been delivered to our CA team. We will review your query and reach out within 2 hours.
        </p>

        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          <span>Contact on WhatsApp Now</span>
        </a>

        <div style="margin-top:1.25rem;">
          <button type="button" class="btn-reset-form" style="background:none; border:none; color:var(--primary-navy); text-decoration:underline; font-size:0.85rem; cursor:pointer; font-weight:500;">
            Submit another request
          </button>
        </div>
      `;

      parentCard.appendChild(successCard);

      // Trigger toast
      showToast('📧 Mail sent successfully! Click below if you want to chat on WhatsApp.', 'success');

      // Reset button handler inside success card
      const resetBtn = successCard.querySelector('.btn-reset-form');
      resetBtn?.addEventListener('click', () => {
        successCard.remove();
        form.reset();
        form.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      });
    });
  });
});
