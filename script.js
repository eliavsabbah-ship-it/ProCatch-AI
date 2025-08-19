// ------------------- Subscription Logic -------------------
window.addEventListener('load', () => {
    if (!localStorage.getItem('freeDayStarted')) {
        document.getElementById('subscription-popup').style.display = 'flex';
    } else {
        const startTime = parseInt(localStorage.getItem('freeDayStartTime'));
        const now = Date.now();
        if (now - startTime > 24*60*60*1000) {
            alert("Your free day is over. Please subscribe to continue.");
            window.location.href = "subscription_page.html"; // Redirect to subscription page
        }
    }
});

document.getElementById('free-day-btn').addEventListener('click', () => {
    localStorage.setItem('freeDayStarted', true);
    localStorage.setItem('freeDayStartTime', Date.now());
    document.getElementById('subscription-popup').style.display = 'none';
});

// ------------------- Camera Setup -------------------
const video = document.getElementById('camera');
const canvas = document.getElementById('photo-canvas');
const takePhotoBtn = document.getElementById('take-photo-btn');

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    alert("Camera access is required to take a photo of the water.");
});

let waterPhotoData = null;
takePhotoBtn.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    waterPhotoData = canvas.toDataURL('image/png'); // Save photo data for AI
    alert("Photo captured successfully!");
});

// ------------------- Location Setup -------------------
let userLocation = null;
const locationStatus = document.getElementById('location-status');

document.getElementById('share-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                locationStatus.textContent = `Location captured: Lat ${userLocation.latitude.toFixed(5)}, Lon ${userLocation.longitude.toFixed(5)}`;
            },
            (err) => {
                locationStatus.textContent = "Unable to get location.";
            }
        );
    } else {
        locationStatus.textContent = "Geolocation is not supported by your browser.";
    }
});

// ------------------- Submit for AI -------------------
document.getElementById('submit-btn').addEventListener('click', () => {
    if (!waterPhotoData) {
        alert("Please take a photo of the water first.");
        return;
    }
    if (!userLocation) {
        alert("Please share your location first.");
        return;
    }

    // Here you would send `waterPhotoData` and `userLocation` to your AI backend
    alert("AI is analyzing the water color and local fish species... (Placeholder)");

    // Redirect to AI chat page for optional tips
    window.location.href = "ai_chat.html";
});
