// ------------------- Bubble Background -------------------
const canvas = document.getElementById('bubble-canvas');
const ctx = canvas?.getContext('2d');
if (canvas && ctx) {
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

    window.addEventListener('resize', ()=>{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ------------------- Subscription Popup Logic -------------------
window.addEventListener('load', () => {
    const freeDayStarted = localStorage.getItem('freeDayStarted');
    const popup = document.getElementById('subscription-popup');

    if (!freeDayStarted) {
        popup?.style.display = 'flex';
    } else {
        const startTime = parseInt(localStorage.getItem('freeDayStartTime'));
        const now = Date.now();
        if (now - startTime > 24*60*60*1000) {
            alert("Your free day is over. Please subscribe to continue.");
            window.location.href = "subscription_page.html";
        } else {
            popup?.style.display = 'none';
        }
    }
});

const freeDayBtn = document.getElementById('free-day-btn');
freeDayBtn?.addEventListener('click', () => {
    localStorage.setItem('freeDayStarted', true);
    localStorage.setItem('freeDayStartTime', Date.now());
    document.getElementById('subscription-popup').style.display = 'none';
    alert("Your 1-day free trial has started! You can now use the website.");
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
    // Location is optional
    alert("AI is analyzing water color and fish info... (Placeholder)");
    window.location.href = "ai_chat.html";
});

// ------------------- AI Chat Logic -------------------
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userInputField = document.getElementById('user-input');

let chatMemory = [];

sendBtn?.addEventListener('click', ()=>{
    const userMsg = userInputField.value.trim();
    if(!userMsg) return;

    // Add user message to memory
    chatMemory.push({sender: "user", message: userMsg});
    appendMessage("You", userMsg, "right");

    // Generate advanced AI response
    const aiMsg = generateAdvancedFishingTip(userMsg, chatMemory);
    appendMessage("FishIQ AI", aiMsg, "left");

    chatMemory.push({sender: "ai", message: aiMsg});
    userInputField.value = "";
});

// Function to append messages to chat box
function appendMessage(sender, message, align){
    const div = document.createElement('div');
    div.textContent = `${sender}: ${message}`;
    div.style.margin = "10px";
    div.style.textAlign = align;
    chatBox?.appendChild(div);
    if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

// ------------------- Advanced Fishing AI Logic -------------------
function generateAdvancedFishingTip(userInput, memory){
    const input = userInput.toLowerCase();

    if(input.includes("bass")){
        return "For bass, use a medium spinning rod with a soft plastic worm or crankbait near submerged structures. Early morning or late afternoon is ideal.";
    }
    if(input.includes("trout")){
        return "Trout prefer clear, cool water. Use light line, small spinners, or worms. Fish near streams, riffles, and shaded pools.";
    }
    if(input.includes("baits") || input.includes("lure")){
        return "Choose bait based on water clarity and fish type. Bright lures in murky water, natural bait in clear water, match local forage.";
    }
    if(input.includes("time") || input.includes("best time")){
        return "Early morning and late evening are best for most freshwater species. Cloudy days can increase activity.";
    }
    if(input.includes("water") || input.includes("color")){
        return "Water color affects lure visibility. In stained water, use bright/flashy lures. In clear water, natural colors work best.";
    }
    if(input.includes("season") || input.includes("month")){
        return "Spring: shallow areas, summer: deeper waters, fall: active near surface, winter: slow near structure.";
    }

    // Dynamic fallback tips
    const dynamicTips = [
        "Observe local fish behavior and adjust bait size and color accordingly.",
        "Vary retrieval speed; sometimes a slow twitch works better than a fast reel.",
        "Fish near natural cover: rocks, logs, vegetation, or drop-offs.",
        "Check wind direction and sun angle; fish often feed in wind-driven zones."
    ];

    return dynamicTips[Math.floor(Math.random()*dynamicTips.length)];
}
