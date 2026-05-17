// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQsDLpMzbSkSSifcVonPUGCFEsEEhjEEw",
  authDomain: "web-apps-creovations.firebaseapp.com",
  projectId: "web-apps-creovations",
  storageBucket: "web-apps-creovations.firebasestorage.app",
  messagingSenderId: "284662963548",
  appId: "1:284662963548:web:431fbdd21a645da3317599",
  measurementId: "G-2VHM6R77B1"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global custom toast utility
window.showToast = function(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  const icon = type === "success" ? "fa-circle-check" : "fa-circle-xmark";
  
  toast.innerHTML = `
      <span class="toast-icon"><i class="fa-solid ${icon}"></i></span>
      <div class="toast-content">${message}</div>
      <span class="toast-close">&times;</span>
  `;
  
  container.appendChild(toast);
  
  // Trigger animation frame for CSS transition
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Auto remove toast
  const timer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
  }, 4500);
  
  // Close icon listener
  toast.querySelector(".toast-close").addEventListener("click", () => {
      clearTimeout(timer);
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
  });
};

// Expose Firestore message saving function globally to avoid event listener collisions
window.saveContactMessage = async function(name, email, message) {
  return await addDoc(collection(db, "messages"), {
    name: name,
    email: email,
    message: message,
    timestamp: new Date()
  });
};

// Add a new review to Firestore
async function addReview(name, review) {
  try {
    await addDoc(collection(db, "reviews"), {
      name: name || "Anonymous",
      review: review,
      timestamp: new Date()
    });
    window.showToast("Thank you for your feedback! Your review is now live.", "success");
  } catch (error) {
    console.error("Error adding review: ", error);
    window.showToast("There was an error submitting your review. Please try again.", "error");
  }
}

// Fetch reviews from Firestore and display them
function fetchReviews() {
  const reviewsQuery = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const reviewsSection = document.getElementById("reviewsSection");
  if (!reviewsSection) return;

  onSnapshot(reviewsQuery, (snapshot) => {
    reviewsSection.innerHTML = ""; // Clear previous reviews

    snapshot.forEach(doc => {
      const { name, review } = doc.data();
      const reviewDiv = document.createElement('div');
      reviewDiv.classList.add('testimonial');
      reviewDiv.innerHTML = `
        <p>"${review}"</p>
        <strong>- ${name}</strong>
      `;
      reviewsSection.appendChild(reviewDiv);
    });
  });
}

// Modern Review Modal Controller
const reviewModal = document.getElementById("customReviewModal");
const sendReviewBtn = document.getElementById("sendReviewBtn");
const closeReviewModalBtn = document.getElementById("closeReviewModal");
const reviewForm = document.getElementById("reviewForm");

if (sendReviewBtn && reviewModal) {
  // Open modal
  sendReviewBtn.addEventListener('click', () => {
    reviewModal.style.display = "flex";
    const nameInput = document.getElementById("reviewName");
    if (nameInput) nameInput.focus();
  });
}

if (closeReviewModalBtn && reviewModal) {
  // Close modal
  closeReviewModalBtn.addEventListener('click', () => {
    reviewModal.style.display = "none";
    if (reviewForm) reviewForm.reset();
  });
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === reviewModal) {
    reviewModal.style.display = "none";
    if (reviewForm) reviewForm.reset();
  }
});

if (reviewForm) {
  // Handle form submit inside custom modal
  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById("reviewName").value.trim();
    const review = document.getElementById("reviewText").value.trim();
    
    if (!review) {
      window.showToast("Review content cannot be empty!", "error");
      return;
    }
    
    // Submit to Firestore
    await addReview(name, review);
    
    // Hide modal & reset form
    reviewModal.style.display = "none";
    reviewForm.reset();
  });
}

// Fetch and display reviews on page load
fetchReviews();
