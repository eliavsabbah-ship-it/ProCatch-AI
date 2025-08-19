// Subscription Logic
window.addEventListener('load', () => {
    if (!localStorage.getItem('freeDayStarted')) {
        document.getElementById('subscription-popup').style.display = 'flex';
    } else {
        // Check if 24 hours have passed
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

// Gear Form Submission
document.getElementById('gear-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const pic = document.getElementById('water-pic').files[0];
    const location = document.getElementById('location').value;

    // Normally here you would send data to AI backend
    alert("AI is analyzing your water and location... (Placeholder)");
    
    // Redirect to AI chat for optional tips
    window.location.href = "ai_chat.html";
});

// AI Chat Logic (Placeholder)
if(document.getElementById('send-btn')){
    const chatBox = document.getElementById('chat-box');
    document.getElementById('send-btn').addEventListener('click', ()=>{
        const userInput = document.getElementById('user-input').value;
        if(!userInput) return;
        
        // Display user message
        const userMsg = document.createElement('div');
        userMsg.textContent = "You: " + userInput;
        userMsg.style.margin = "10px";
        userMsg.style.textAlign = "right";
        chatBox.appendChild(userMsg);
        
        // AI Response Placeholder
        const aiMsg = document.createElement('div');
        aiMsg.textContent = "AI: Based on your location, try using medium strength rod with live bait. (Placeholder)";
        aiMsg.style.margin = "10px";
        aiMsg.style.textAlign = "left";
        chatBox.appendChild(aiMsg);
        
        chatBox.scrollTop = chatBox.scrollHeight;
        document.getElementById('user-input').value = '';
    });
}
