// Import Firebase functions
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
  import { query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

  // Function to submit the form data to Firestore
  async function submitForm(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Collect form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      // Add a new document with form data
      await addDoc(collection(db, "messages"), {
        name: name,
        email: email,
        message: message,
        timestamp: new Date()
      });
    
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error. Please try again.");
    }
  }

  // Attach the submitForm function to form submission
  document.querySelector("form").addEventListener("submit", submitForm);




// Add a new review to Firestore
async function addReview(name, review) {
  try {
    await addDoc(collection(db, "reviews"), {
      name: name || "Anonymous",
      review: review,
      timestamp: new Date()
    });
    alert("Thank you for your feedback!");
  } catch (error) {
    console.error("Error adding review: ", error);
    alert("There was an error submitting your review. Please try again.");
  }
}

// Fetch reviews from Firestore and display them
function fetchReviews() {
  const reviewsQuery = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
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

// Open prompt for new review
sendReviewBtn.addEventListener('click', () => {
  const name = prompt("Enter your name (Optional):");
  const review = prompt("Write your review:");
  if (review) {
    addReview(name, review);
  } else {
    alert("Review cannot be empty!");
  }
});

// Fetch and display reviews on page load
fetchReviews();


