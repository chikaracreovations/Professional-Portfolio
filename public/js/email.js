document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const message = document.querySelector("#message").value;

  fetch("https://professional-portfolio-emailjs.onrender.com/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message.");
    }
  })
  .catch(err => {
    console.error("Error sending message:", err);
    alert("An error occurred.");
  });
});