// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
var firebaseConfig = {
    apiKey: "AIzaSyBgaL866JGdBLvGCX2Fk9dbBhxhERZhBVU",
    authDomain: "movie-booking-system-d41a4.firebaseapp.com",
    projectId: "movie-booking-system-d41a4",
    storageBucket: "movie-booking-system-d41a4.firebasestorage.app",
    messagingSenderId: "951765100357",
    appId: "1:951765100357:web:7fa77e0c14910d2a8fc02c",
    measurementId: "G-4NG3H3W4GT"
};

// Initialize Firebase only if the script is loaded on the page
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}

// ==========================================
// 2. EMAILJS CONFIGURATION (Replace these values!)
// ==========================================
var EMAILJS_SERVICE_ID = "service_4oqvg88";
var EMAILJS_TEMPLATE_ID = "template_q5vuglu";


// ==========================================
// 3. AUTHENTICATION LOGIC (Login & Register)
// ==========================================

function validateAndLogin() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var msgLabel = document.getElementById('authMessage');

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        msgLabel.innerText = "Invalid email format.";
        return;
    }

    msgLabel.innerText = "Authenticating...";
    msgLabel.style.color = "#cbd5e1";

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            msgLabel.style.color = "#22c55e"; // Success green
            msgLabel.innerText = "Login Successful! Redirecting...";
            setTimeout(function () { window.location.href = "index.html"; }, 1500);
        })
        .catch(function (error) {
            msgLabel.style.color = "#ff3b3b";
            msgLabel.innerText = "Error: " + error.message;
        });
}

function registerUser() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var msgLabel = document.getElementById('authMessage');

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailPattern.test(email)) {
        msgLabel.style.color = "#ff3b3b";
        msgLabel.innerText = "Invalid email formatting.";
        return;
    }
    if (!passwordPattern.test(password)) {
        msgLabel.style.color = "#ff3b3b";
        msgLabel.innerText = "Password must be min 8 chars, 1 letter, and 1 number.";
        return;
    }

    msgLabel.innerText = "Registering user...";
    msgLabel.style.color = "#cbd5e1";

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            msgLabel.style.color = "#22c55e";
            msgLabel.innerText = "Registration Successful! Welcome!";
            setTimeout(function () { window.location.href = "index.html"; }, 1500);
        })
        .catch(function (error) {
            msgLabel.style.color = "#ff3b3b";
            msgLabel.innerText = "Error: " + error.message;
        });
}

// ==========================================
// 4. BOOKING & PRICING ENGINE
// ==========================================

function calculatePrice() {
    var seats = document.getElementsByClassName('seat');
    var movieSelect = document.getElementById('movieSelect');

    if (!movieSelect || !seats) return;

    var ticketPrice = parseInt(movieSelect.value);
    var checkedCount = 0;

    for (var i = 0; i < seats.length; i++) {
        if (seats[i].checked && !seats[i].disabled) {
            checkedCount++;
        }
    }

    var totalPrice = checkedCount * ticketPrice;
    var summary = document.getElementById('summaryText');
    if (summary) {
        summary.innerHTML = "Seats Selected: " + checkedCount + "<br><span style='font-size:0.5em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:2px;'>Rate: ₹" + ticketPrice + "</span><br><br><span style='color:#fff;'>Subtotal: ₹" + totalPrice + "</span>";
    }
}

// Event listener for movie selection dropdown
var movieSelectElement = document.getElementById('movieSelect');
if (movieSelectElement) {
    movieSelectElement.onchange = calculatePrice;
}


// ==========================================
// 5. EMAILJS INTEGRATION (Checkout)
// ==========================================

function checkoutAndSendEmail() {
    var clientEmail = document.getElementById('clientEmail').value;
    var seats = document.getElementsByClassName('seat');
    var movieSelect = document.getElementById('movieSelect');

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(clientEmail)) {
        alert("Please enter a valid email address to receive your ticket.");
        return;
    }

    var ticketPrice = parseInt(movieSelect.value);
    var checkedCount = 0;
    for (var i = 0; i < seats.length; i++) {
        if (seats[i].checked && !seats[i].disabled) {
            checkedCount++;
        }
    }

    if (checkedCount === 0) {
        alert("Please select at least one seat to proceed with booking.");
        return;
    }

    var totalPrice = checkedCount * ticketPrice;
    var movieName = movieSelect.options[movieSelect.selectedIndex].text;

    // Define the dynamic variables for your EmailJS Template
    var templateParams = {
        to_email: clientEmail,
        movie_name: movieName,
        total_seats: checkedCount,
        total_price: "₹" + totalPrice,
        message: "Your booking for " + movieName + " is officially confirmed. Enjoy the show!"
    };

    // Change button text to reflect loading state
    var checkoutBtn = event.target;
    var originalBtnText = checkoutBtn.innerText;
    checkoutBtn.innerText = "Sending Ticket...";
    checkoutBtn.disabled = true;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function (response) {
            checkoutBtn.innerText = "Confirmed!";
            alert('Booking Confirmed! The ticket has been magically sent to ' + clientEmail);
            setTimeout(function () {
                checkoutBtn.innerText = originalBtnText;
                checkoutBtn.disabled = false;
            }, 3000);
        }, function (error) {
            console.log(error);
            alert('Oh no! Make sure your EmailJS keys (Service ID, Template ID, Public Key) are properly replaced in the code. \nError details in console.');
            checkoutBtn.innerText = originalBtnText;
            checkoutBtn.disabled = false;
        });
}


// ==========================================
// 6. VANILLA CANVAS CINEMA SCREEN
// ==========================================

function drawScreen() {
    var canvas = document.getElementById('screenCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var cw = canvas.width;
        var ch = canvas.height;

        ctx.clearRect(0, 0, cw, ch);

        var gradient = ctx.createLinearGradient(0, 0, 0, ch);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(30, 40);
        ctx.quadraticCurveTo(cw / 2, -20, cw - 30, 40);

        ctx.lineTo(cw - 10, ch);
        ctx.lineTo(10, ch);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(30, 40);
        ctx.quadraticCurveTo(cw / 2, -20, cw - 30, 40);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.stroke();
    }
}

// ==========================================
// 7. PRE-SELECT MOVIE FROM URL
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var movieId = urlParams.get('movie');
    if (movieId) {
        var movieSelect = document.getElementById('movieSelect');
        if (movieSelect) {
            movieSelect.value = movieId;
            calculatePrice(); // Pre-calculate price context
        }
    }
});
