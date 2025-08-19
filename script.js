// ------------------- Bubble Background -------------------
const canvas = document.getElementById('bubble-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bubbles = [];
for(let i=0; i<60; i++){
    bubbles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        radius: Math.random()*20 + 10,
        dx: (Math.random()-0.5)*2,
        dy: (Math.random()-0.5)*2,
        color: ['#001f4d','#00aaff','#ffffff'][Math.floor(Math.random()*3)]
    });
}

function animateBubbles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    bubbles.forEach(b=>{
        ctx.beginPath();
        ctx.arc(b.x,b.y,b.radius,0,Math.PI*2);
        ctx.fillStyle = b.color;
        ctx.fill();
        b.x += b.dx;
        b.y += b.dy;
        if(b.x<0||b.x>canvas.width) b.dx*=-1;
        if(b.y<0||b.y>canvas.height) b.dy*=-1;
    });
    requestAnimationFrame(animateBubbles);
}
animateBubbles();
window.addEventListener('resize', ()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});

// ------------------- Subscription Logic -------------------
window.addEventListener('load', () => {
    if (!localStorage.getItem('freeDayStarted')) {
        document.getElementById('subscription-popup').style.display = 'flex';
    } else {
        const startTime = parseInt(localStorage.getItem('freeDayStartTime'));
        const now = Date.now();
        if (now - startTime > 24*60*60*1000) {
            alert("Your free day is over. Please subscribe to continue.");
            window.location.href = "subscription_page.html";
        }
    }
});
document.getElementById('free-day-btn')?.addEventListener('click', () => {
    localStorage.setItem('freeDayStarted', true);
    localStorage.setItem('freeDayStartTime', Date.now());
    document.getElementById('subscription-popup').style.display = 'none';
});

// ------------------- Camera Setup -------------------
const video = document.getElementById('camera');
const canvasPhoto = document.getElementById('photo-canvas');
const takePhotoBtn = document.getElementById('take-photo-btn');

let waterPhotoData = null;

if(video){
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => { alert("Camera access is required."); });
}

takePhotoBtn?.addEventListener('click', () => {
    canvasPhoto.width = video.videoWidth;
    canvasPhoto.height = video.videoHeight;
    canvasPhoto.getContext('2d').drawImage(video,0,0);
    waterPhotoData = canvasPhoto.toDataURL('image/png');
    alert("Photo captured successfully!");
});

// ------------------- Location Setup -------------------
let userLocation = null;
const locationStatus = document.getElementById('location-status');
document.getElementById('share-location-btn')?.addEventListener('click', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            pos => {
                userLocation = {lat: pos.coords.latitude, lon: pos.coords.longitude};
                locationStatus.textContent = `Location captured: Lat ${userLocation.lat.toFixed(5)}, Lon ${userLocation.lon.toFixed(5)}`;
            },
            err => { locationStatus.textContent = "Unable to get location.";}
        );
    }else{ locationStatus.textContent = "Geolocation not supported.";}
});

// ------------------- Submit for AI -------------------
document.getElementById('submit-btn')?.addEventListener('click', () => {
    if(!waterPhotoData){ alert("Please take a photo of the water first."); return;}
    // Location optional
    alert("AI is analyzing water color and fish info... (Placeholder)");
    window.location.href = "ai_chat.html";
});

// ------------------- AI Chat Logic -------------------
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userInputField = document.getElementById('user-input');

sendBtn?.addEventListener('click', ()=>{
    const userMsg = userInputField.value;
    if(!userMsg) return;

    // Display user message
    const divUser = document.createElement('div');
    divUser.textContent = "You: " + userMsg;
    divUser.style.margin="10px"; divUser.style.textAlign="right";
    chatBox.appendChild(divUser);

    // Simulated AI response
    const divAI = document.createElement('div');
    divAI.textContent = "AI: " + generateFishingTip(userMsg);
    divAI.style.margin="10px"; divAI.style.textAlign="left";
    chatBox.appendChild(divAI);

    chatBox.scrollTop = chatBox.scrollHeight;
    userInputField.value="";
});

// ------------------- Simulated AI Fishing Tips -------------------
function generateFishingTip(input){
    const tips = [
        "Try using a medium-strength rod with live bait.",
        "Fish are more active in shaded areas near rocks.",
        "Early morning and late evening are ideal for bites.",
        "Use bright-colored lures in murky water.",
        "Slow your reel speed for cautious fish."
    ];
    return tips[Math.floor(Math.random()*tips.length)];
}
