// ------------------- AI Chat Logic -------------------
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userInputField = document.getElementById('user-input');

// Session memory for conversation context
let chatMemory = [];

sendBtn?.addEventListener('click', ()=>{
    const userMsg = userInputField.value.trim();
    if(!userMsg) return;

    // Add user message to memory
    chatMemory.push({sender: "user", message: userMsg});

    // Display user message
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
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ------------------- Advanced Fishing AI Logic -------------------
function generateAdvancedFishingTip(userInput, memory){
    // Lowercase for keyword matching
    const input = userInput.toLowerCase();

    // Example logic: analyze keywords
    if(input.includes("bass")){
        return "For bass, try using a medium spinning rod with a soft plastic worm or crankbait near submerged structures. Early morning or late afternoon often works best.";
    }
    if(input.includes("trout")){
        return "Trout prefer clear, cool water. Use light line, small spinners, or natural bait like worms. Fish near streams, riffles, and shaded pools.";
    }
    if(input.includes("baits") || input.includes("lure")){
        return "Selecting bait depends on water clarity and target species. Bright lures in murky water, natural bait for clear streams, and match the local forage if possible.";
    }
    if(input.includes("time") || input.includes("best time")){
        return "Generally, early morning and late evening are best for most freshwater species. Cloudy days can also increase activity.";
    }
    if(input.includes("water") || input.includes("color")){
        return "Water color affects visibility. In stained water, use bright or flashy lures. In clear water, natural colors like brown, green, or silver work best.";
    }
    if(input.includes("season") || input.includes("month")){
        return "Spring is good for active predatory fish near shallow areas. Summer afternoons favor deeper waters. Fall, feed aggressively near the surface, and winter fish slowly near structures.";
    }

    // Default dynamic advice if no keywords found
    const dynamicTips = [
        "Observe local fish activity and adjust bait size and color accordingly.",
        "Vary your retrieval speed; sometimes a slow twitch works better than a fast reel.",
        "Fish near natural cover: rocks, logs, vegetation, or drop-offs.",
        "Check wind direction and sun angle; fish often feed in wind-driven zones."
    ];

    // Return a random tip if no keyword matches
    return dynamicTips[Math.floor(Math.random()*dynamicTips.length)];
}
