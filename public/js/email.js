document.querySelector("form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();
  const submitBtn = event.target.querySelector("button[type='submit']");
  
  if (!name || !email || !message) {
    if (window.showToast) {
      window.showToast("Please fill in all required fields.", "error");
    } else {
      alert("Please fill in all fields.");
    }
    return;
  }

  // Show loading/spinner state on button
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

  // Primary: Local Dev Express mail endpoint. Secondary fallback: Production Render Mail service.
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const mailEndpoint = isLocalhost ? "/send-email" : "https://professional-portfolio-emailjs.onrender.com/send-email";

  let emailSent = false;
  let errorMsg = "";

  try {
    // Send email notification
    const response = await fetch(mailEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await response.json();
    if (data.success) {
      emailSent = true;
    } else {
      errorMsg = data.error || "Mail server error";
    }
  } catch (err) {
    console.warn("Mail server endpoint failed, attempting fallback...", err);
    // If local failed and not on localhost, attempt fallback to Render directly just in case
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

  // Save to Firestore asynchronously via our exposed Firebase method
  let dbSaved = false;
  try {
    if (window.saveContactMessage) {
      await window.saveContactMessage(name, email, message);
      dbSaved = true;
    } else {
      console.warn("Firebase saveContactMessage method not yet exposed.");
    }
  } catch (dbErr) {
    console.error("Firestore save failed:", dbErr);
  }

  // Restore button state
  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;

  // Show notification
  if (emailSent || dbSaved) {
    document.querySelector("form").reset();
    if (window.showToast) {
      if (emailSent && dbSaved) {
        window.showToast("Message successfully sent and saved to database!", "success");
      } else if (dbSaved) {
        window.showToast("Message saved to database (email delivery pending).", "success");
      } else {
        window.showToast("Message sent successfully!", "success");
      }
    } else {
      alert("Message sent successfully!");
    }
  } else {
    if (window.showToast) {
      window.showToast(`Failed to send message: ${errorMsg || 'Please try again later.'}`, "error");
    } else {
      alert("An error occurred sending the message.");
    }
  }
});