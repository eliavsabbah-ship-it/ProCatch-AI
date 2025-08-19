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
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('subscription-popup');
    const freeDayBtn = document.getElementById('free-day-btn');

    if(!popup || !freeDayBtn){
        console.error("Subscription popup or button not found!");
        return;
    }

    function showPopupIfNeeded() {
        const freeDayStarted = localStorage.getItem('freeDayStarted');
        const startTime = parseInt(localStorage.getItem('freeDayStartTime') || "0");
        const now = Date.now();

        // Show popup if free day not started or expired
        if(!freeDayStarted || now - startTime > 24*60*60*1000){
            popup.style.display = 'flex';
            localStorage.removeItem('freeDayStarted'); // reset if expired
            localStorage.removeItem('freeDayStartTime');
        } else {
            popup.style.display = 'none';
        }
    }

    showPopupIfNeeded();

    freeDayBtn.addEventListener('click', () => {
        localStorage.setItem('freeDayStarted', true);
        localStorage.setItem('freeDayStartTime', Date.now());
        popup.style.display = 'none';
        alert("Your 1-day free trial has started! Enjoy the website.");
    });
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
    alert("Analyzing water and location to provide fishing advice...");
    window.location.href = "ai_chat.html";
});

// ------------------- Chat Logic powered by ChatGPT -------------------
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userInputField = document.getElementById('user-input');

let chatMemory = [];

sendBtn?.addEventListener('click', ()=>{
    const userMsg = userInputField.value.trim();
    if(!userMsg) return;

    chatMemory.push({sender: "user", message: userMsg});
    appendMessage("You", userMsg, "right");

    // ChatGPT-powered advice
    const aiMsg = generateChatGPTFishingTip(userMsg, chatMemory);
    appendMessage("FishIQ Expert (ChatGPT)", aiMsg, "left");

    chatMemory.push({sender: "ai", message: aiMsg});
    userInputField.value = "";
});

function appendMessage(sender, message, align){
    const div = document.createElement('div');
    div.textContent = `${sender}: ${message}`;
    div.style.margin = "10px";
    div.style.textAlign = align;
    chatBox?.appendChild(div);
    if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

// ------------------- Advanced Fishing Advice by ChatGPT -------------------
function generateChatGPTFishingTip(userInput, memory){
    const input = userInput.toLowerCase();
    const tips = [];

    // Handle fish types
    if(input.includes("bass")){
        tips.push("For bass, use medium spinning rods with soft plastic worms, crankbaits, or topwater lures. Focus near submerged structures and weed lines. Early morning or late afternoon is ideal.");
    }
    if(input.includes("trout")){
        tips.push("Trout prefer cool, clear water. Light line, small spinners, and natural bait like worms are effective. Fish near riffles, pools, and shaded streams.");
    }
    if(input.includes("pike") || input.includes("muskie")){
        tips.push("Use strong rods with large lures or spoons. Target weed beds and drop-offs. Aggressive retrieval works well.");
    }

    // General advice
    if(input.includes("bait") || input.includes("lure")){
        tips.push("Adjust bait/lure color according to water clarity. Bright or flashy for murky water, natural colors for clear water.");
    }
    if(input.includes("time") || input.includes("season")){
        tips.push("Early morning and late evening are generally best. Spring: shallow areas, Summer: deeper waters, Fall: feeding near surface, Winter:
