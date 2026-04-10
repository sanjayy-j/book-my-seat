// ==========================================
// 1. FIREBASE CONFIGURATION
// These are the secret keys linking our frontend to the Google Firebase Backend.
// They authorize us to read/write auth data directly from the browser.
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

// Initialize Firebase only if the script is loaded on the HTML page.
// 'typeof' check prevents errors if the CDN failed to load.
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}

// ==========================================
// 2. EMAILJS CONFIGURATION
// These IDs tell the EmailJS API which service (Gmail) and which 
// specific email design template to use when dispatching tickets.
// ==========================================
var EMAILJS_SERVICE_ID = "service_4oqvg88";
var EMAILJS_TEMPLATE_ID = "template_q5vuglu";


// ==========================================
// 3. AUTHENTICATION LOGIC (Login & Register)
// Connected to the login.html forms.
// ==========================================

function validateAndLogin() {
    // 1. Grab raw string input from HTML text boxes
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var msgLabel = document.getElementById('authMessage');

    // 2. Regular Expression (Regex): Ensures it looks exactly like an email (text@text.com)
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        msgLabel.innerText = "Invalid email format.";
        return; // Exits the function immediately if failed
    }

    // Give the user visual feedback that the network request has started
    msgLabel.innerText = "Authenticating...";
    msgLabel.style.color = "#cbd5e1";

    // 3. Firebase API Call: Asynchronous Promise setup using .then() and .catch()
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            // SUCCESS Scenario
            msgLabel.style.color = "#22c55e"; // Success green text
            msgLabel.innerText = "Login Successful! Redirecting...";
            
            // Wait 1.5 seconds, then command browser to switch pages
            setTimeout(function () { window.location.href = "index.html"; }, 1500);
        })
        .catch(function (error) {
            // FAILURE Scenario (Wrong password, no account, etc)
            msgLabel.style.color = "#ff3b3b";
            msgLabel.innerText = "Error: " + error.message; // Extract Google's error string
        });
}

function registerUser() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var msgLabel = document.getElementById('authMessage');

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    // Strict Regex: Requires Minimum 8 characters, at least 1 letter and 1 number
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

    // Firebase account creation API wrapper
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
// Triggers dynamically every time a seat is clicked.
// ==========================================

function calculatePrice() {
    // Collect an array of all HTML elements with class="seat"
    var seats = document.getElementsByClassName('seat');
    var movieSelect = document.getElementById('movieSelect');

    // Failsafe: Ensures we don't crash if this is run on a page without a booking form
    if (!movieSelect || !seats) return; 

    // Convert the string dropdown value ("200") into a mathematical integer (200)
    var ticketPrice = parseInt(movieSelect.value);
    var checkedCount = 0;

    // Loop through all 84 seats exactly one by one
    for (var i = 0; i < seats.length; i++) {
        // If the box is actively ticked AND it's not a darkened disabled seat
        if (seats[i].checked && !seats[i].disabled) {
            checkedCount++; // increment our running counter
        }
    }

    var totalPrice = checkedCount * ticketPrice;
    var summary = document.getElementById('summaryText');
    
    // Use innerHTML to directly inject heavily styled HTML text into the DOM
    if (summary) {
        summary.innerHTML = "Seats Selected: " + checkedCount + "<br><span style='font-size:0.5em; color:var(--text-secondary); text-transform:uppercase; letter-spacing:2px;'>Rate: ₹" + ticketPrice + "</span><br><br><span style='color:#fff;'>Subtotal: ₹" + totalPrice + "</span>";
    }
}

// Listen for the `<select>` dropdown changing values to recalculate subtotal immediately
var movieSelectElement = document.getElementById('movieSelect');
if (movieSelectElement) {
    movieSelectElement.onchange = calculatePrice;
}


// ==========================================
// 5. EMAILJS INTEGRATION (Checkout)
// Finalizes the purchase and formulates the email payload.
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
    var rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    var selectedSeatNames = [];
    
    // Seat Name Mapping Logic
    for (var i = 0; i < seats.length; i++) {
        if (seats[i].checked && !seats[i].disabled) {
            checkedCount++;
            
            // Math: Divide by 12 to find the row. Modulo 12 to find the exact column.
            var rowIndex = Math.floor(i / 12);
            var colIndex = (i % 12) + 1;
            
            // Map 0 -> A, 1 -> B based on our rows array
            var rowLetter = rowIndex < rows.length ? rows[rowIndex] : 'X';
            
            // Push combined string (e.g., "A1") to our array
            selectedSeatNames.push(rowLetter + colIndex);
        }
    }

    // Prevent checkout if no seats are selected
    if (checkedCount === 0) {
        alert("Please select at least one seat to proceed with booking.");
        return;
    }

    var totalPrice = checkedCount * ticketPrice;
    
    // Grabs the visible text inside the dropdown (e.g. "Sci-Fi Universe (₹250)")
    var movieName = movieSelect.options[movieSelect.selectedIndex].text;
    
    // DOM querying: Finds exactly which radio button is active, and extracts its label text
    var selectedTimeInput = document.querySelector('input[name="time"]:checked');
    var showtime = selectedTimeInput ? document.querySelector('label[for="' + selectedTimeInput.id + '"]').innerText : "10:00 AM";
    
    // Math.random generates a fake but highly realistic looking Ticket ID
    var confirmationId = Math.floor(Math.random() * 90000000 + 10000000);

    // This JSON object maps precisely to our {{handlebars}} variables in the EmailJS web dashboard
    var templateParams = {
        to_email: clientEmail,
        confirmation_id: confirmationId,
        movie_title: movieName,
        theater_name: "BookMySeat Cinema",
        showtime: showtime,
        seats: selectedSeatNames.join(', '), // Joins array into a string: "A1, A2"
        total_price: "₹" + totalPrice
    };

    // Store button text so we can change it to "Loading..." and revert it back later
    var checkoutBtn = event.target;
    var originalBtnText = checkoutBtn.innerText;
    checkoutBtn.innerText = "Sending Ticket...";
    checkoutBtn.disabled = true;

    // Execute API Dispatch
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function (response) {
            // SUCCESS Scenario
            checkoutBtn.innerText = "Confirmed!";
            alert('Booking Confirmed! The ticket has been magically sent to ' + clientEmail);
            
            // Give 3.0 seconds visual cooldown before unlocking the button
            setTimeout(function () {
                checkoutBtn.innerText = originalBtnText;
                checkoutBtn.disabled = false;
            }, 3000);
        }, function (error) {
            // FAILURE Scenario
            console.log(error);
            alert('Oh no! Make sure your EmailJS keys (Service ID, Template ID, Public Key) are properly replaced in the code. \nError details in console.');
            checkoutBtn.innerText = originalBtnText;
            checkoutBtn.disabled = false;
        });
}


// ==========================================
// 6. VANILLA CANVAS CINEMA SCREEN
// Draws the curved white "screen" graphic on the booking HTML page
// ==========================================

function drawScreen() {
    var canvas = document.getElementById('screenCanvas');
    if (canvas) {
        // Request the 2D rendering pen
        var ctx = canvas.getContext('2d');
        var cw = canvas.width;
        var ch = canvas.height;

        // Wipe the canvas clean every frame we draw
        ctx.clearRect(0, 0, cw, ch);

        // Compute a gradient that fades from opaque white to totally invisible
        var gradient = ctx.createLinearGradient(0, 0, 0, ch);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // Begin tracing paths for the geometric screen shape
        ctx.beginPath();
        ctx.moveTo(30, 40); // Start point
        ctx.quadraticCurveTo(cw / 2, -20, cw - 30, 40); // Draw the upward arc

        ctx.lineTo(cw - 10, ch); // Draw down to the bottom corner
        ctx.lineTo(10, ch); // Draw to opposite bottom corner
        ctx.closePath(); 
        
        ctx.fillStyle = gradient; // Apply gradient
        ctx.fill(); // Fill the shape in

        // Re-draw the very edge specifically as a glowing white line
        ctx.beginPath();
        ctx.moveTo(30, 40);
        ctx.quadraticCurveTo(cw / 2, -20, cw - 30, 40);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20; // Adds the cinematic glowing effect
        ctx.stroke();
    }
}

// ==========================================
// 7. PRE-SELECT MOVIE FROM URL
// Magic logic that connects the Hompage "Reserve" click to the Booking page
// ==========================================

// DOMContentLoaded waits until the entire HTML tree is parsed by the browser
document.addEventListener('DOMContentLoaded', function() {
    
    // URLSearchParams breaks down the browser's top bar URL string
    var urlParams = new URLSearchParams(window.location.search);
    
    // .get() isolates the precise '?movie=XXX' variable
    var movieId = urlParams.get('movie');
    
    if (movieId) {
        // Find the dropdown and programmatically force it to select the passed ID
        var movieSelect = document.getElementById('movieSelect');
        if (movieSelect) {
            movieSelect.value = movieId;
            
            // Refresh prices immediately since we altered the dropdown artificially
            calculatePrice(); 
        }
    }
});
