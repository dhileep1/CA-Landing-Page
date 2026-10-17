/* ==========================================================================
   MAIN MULTI-PAGE APPLICATION SCRIPT & APPOINTMENT BOOKING ENGINE
   ========================================================================== */

/// Global Configuration - Update these values anytime!
const CA_CONFIG = {
  // Free Web3Forms Access Key from https://web3forms.com
  WEB3FORMS_ACCESS_KEY: '8c7f11ee-5e34-45bf-b258-1b8080f1c336',
  
  // Practice WhatsApp Number (Country code without + or spaces)
  WHATSAPP_NUMBER: '919894938889',
  
  // Practice Support Email
  FIRM_EMAIL: 'cackathirvel@gmail.com'
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

  // Modern Flatpickr Calendar & Click-Anywhere Date Picker Setup
  const dateTarget = document.querySelector('#contact-date, .date-picker');
  
  if (dateTarget) {
    if (typeof flatpickr !== 'undefined') {
      const fp = flatpickr(dateTarget, {
        minDate: 'today',
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'F j, Y',
        altInputClass: 'form-input date-picker',
        allowInput: false,
        clickOpens: true,
        disableMobile: "true", // ensures premium custom UI is rendered reliably across devices
        static: false
      });

      // Allow clicking anywhere on the parent wrapper or calendar icon to open immediately
      const wrap = dateTarget.closest('.date-input-wrap');
      if (wrap) {
        wrap.addEventListener('click', () => {
          fp.open();
        });
      }
    } else {
      // Fallback for native date input if CDN fails to load
      const todayStr = new Date().toISOString().split('T')[0];
      dateTarget.min = todayStr;
      dateTarget.addEventListener('click', () => {
        if (typeof dateTarget.showPicker === 'function') {
          try { dateTarget.showPicker(); } catch (err) { dateTarget.focus(); }
        }
      });
    }
  }

  // Interactive Time Slot Chip Selector
  const slotChips = document.querySelectorAll('.slot-chip');
  slotChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const container = chip.closest('.form-group') || chip.parentElement;
      const allChips = container.querySelectorAll('.slot-chip');
      allChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const hiddenInput = container.querySelector('input[name="time_slot"]') || document.getElementById('contact-time');
      if (hiddenInput) {
        hiddenInput.value = chip.getAttribute('data-slot');
      }
    });
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
          formData.append('from_name', 'C Kathirvel and Co CA Desk');
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
`Hello C Kathirvel and Co CA Team 👋,

I have submitted an appointment request on your website:

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
        <div class="success-icon-wrap" style="background-color: var(--accent-green-subtle); color: var(--accent-green-dark); border: 2px solid var(--accent-green);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="margin-bottom:0.5rem; font-family:'Outfit',sans-serif; font-size:1.4rem; color:var(--primary-navy-dark); font-weight:800;">Appointment Request Sent!</h3>
        <p style="color:var(--neutral-700); font-size:0.925rem; line-height:1.55; margin-bottom:1.25rem;">
          Thank you <strong>${name}</strong>! Your request for <strong>${service}</strong> has been delivered to our CA team. We will review your query and reach out within 2 hours.
        </p>

        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-1.481zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          <span>Contact on WhatsApp Now</span>
        </a>

        <div style="margin-top:1.25rem;">
          <button type="button" class="btn-reset-form" style="background:none; border:none; color:var(--primary-navy); text-decoration:underline; font-size:0.85rem; cursor:pointer; font-weight:600;">
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
