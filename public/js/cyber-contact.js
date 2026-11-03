// ==========================================================================
// READY TO LAUNCH / CONTACT CARD - 3D PERSPECTIVE TILT & TRANSMISSION ENGINE
// ==========================================================================

// 1. 3D Perspective Tilt & Cursor-Following Radial Glow
function initReadyToLaunchTilt() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const card = document.querySelector('.contact-card[data-tilt]');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

    // Update dynamic reflection glow coordinates
    const mouseXPercent = (x / rect.width) * 100;
    const mouseYPercent = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    card.style.setProperty('--mouse-y', `${mouseYPercent}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// 2. Form Submission with Full Backend/Database Dispatch & Confetti
function initReadyToLaunchForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const msgInput = document.getElementById('msg-input');
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !email || !message) {
      if (window.showToast) {
        window.showToast("Please fill in all required fields.", "error");
      }
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fill in all required fields.';
      }
      return;
    }

    // Button loading state
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    }
    if (feedback) {
      feedback.className = 'form-feedback';
      feedback.textContent = '';
    }

    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const mailEndpoint = isLocalhost ? "/send-email" : "https://professional-portfolio-emailjs.onrender.com/send-email";

    let emailSent = false;
    let errorMsg = "";

    try {
      const response = await fetch(mailEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      if (data.success) {
        emailSent = true;
      } else {
        errorMsg = data.error || "Email service error";
      }
    } catch (err) {
      console.warn("Primary email endpoint failed, trying fallback...", err);
      if (mailEndpoint === "/send-email") {
        try {
          const response = await fetch("https://professional-portfolio-emailjs.onrender.com/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
          });
          const data = await response.json();
          if (data.success) emailSent = true;
        } catch (fallbackErr) {
          console.error("All email endpoints failed", fallbackErr);
          errorMsg = fallbackErr.message;
        }
      } else {
        errorMsg = err.message;
      }
    }

    // Save to Firestore
    let dbSaved = false;
    try {
      if (window.saveContactMessage) {
        await window.saveContactMessage(name, email, message);
        dbSaved = true;
      }
    } catch (dbErr) {
      console.error("Firestore message saving failed:", dbErr);
    }

    // Restore button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }

    if (emailSent || dbSaved) {
      form.reset();

      // Warm theme confetti matching the site's obsidian & crimson aesthetic
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#850505', '#ff3344', '#ffffff', '#e2e2e2', '#ffb703']
        });
      }

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.textContent = '✓ Message sent successfully! I will reply within 24 hours.';
      }

      if (window.showToast) {
        if (emailSent && dbSaved) {
          window.showToast("Message successfully sent and saved to database!", "success");
        } else if (dbSaved) {
          window.showToast("Message saved to database (email delivery pending).", "success");
        } else {
          window.showToast("Message sent successfully!", "success");
        }
      }

      setTimeout(() => {
        if (feedback) feedback.textContent = '';
      }, 5000);
    } else {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = `Failed to send message: ${errorMsg || 'Please try again later.'}`;
      }
      if (window.showToast) {
        window.showToast(`Failed to send message: ${errorMsg || 'Please try again later.'}`, "error");
      }
    }
  });
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initReadyToLaunchTilt();
    initReadyToLaunchForm();
  });
} else {
  initReadyToLaunchTilt();
  initReadyToLaunchForm();
}
