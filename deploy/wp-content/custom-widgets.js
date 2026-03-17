const siteKnowledge = {
    "name": "The Nurturing Roots",
    "locations": ["Nerul West, Navi Mumbai", "Nerul East, Navi Mumbai", "Marunji, Pune", "Pune (Wakad)", "Ulwe", "Uran City"],
    "methods": "Horizontal Learning Method and Experiential Learning",
    "founders": "Priyanka Sharma and Suhani Gupta",
    "programs": ["Little Explorers (Playgroup)", "Curious Cubs (Nursery)", "Creative Crawlers (LKG)", "Adventurous Aces (UKG)"],
    "features": ["Safety first", "Certified staff", "Outdoor play areas", "Activity based learning"],
    "contact": "+91-7838587500"
};

const botResponses = {
    "hello": "Hi there! Welcome to The Nurturing Roots AI Assistant. 🌟 I'm here to help you find the perfect preschool experience for your little one. What can I tell you about today?",
    "locations": "We have 6 beautiful campuses located in:<br>📍 " + siteKnowledge.locations.join("<br>📍 ") + ".<br><br>Which one is closest to you?",
    "admission": "Admissions are currently <b>OPEN</b> for the upcoming session! 🎒<br><br>You can fill out our <span style='color:#8b4e9d; cursor:pointer; font-weight:bold; text-decoration:underline' onclick='openEnquiry()'>Admission Form</span> or call us directly at <b>" + siteKnowledge.contact + "</b>.",
    "fees": "Our fee structure is designed to be affordable while maintaining premium standards. Fees vary by program and location. Please drop your details in the <span style='color:#8b4e9d; cursor:pointer; text-decoration:underline' onclick='openEnquiry()'>Enquiry Form</span> for a custom quote!",
    "method": "We take pride in our <b>" + siteKnowledge.methods + "</b>. We focus on child-led exploration, critical thinking, and holistic development. 🧩",
    "founders": "The Nurturing Roots was founded by <b>" + siteKnowledge.founders + "</b> with a vision to revolutionize early childhood education.",
    "programs": "We offer structured programs for every stage:<br>👶 <b>Little Explorers (Playgroup)</b><br>🌈 <b>Curious Cubs (Nursery)</b><br>🎨 <b>Creative Crawlers (LKG)</b><br>🚀 <b>Adventurous Aces (UKG)</b>",
    "whatsapp": "Chat with our centres directly on WhatsApp:<br><br>💬 <b>Nerul:</b> <a href='https://wa.me/917838587500' target='_blank' style='color:#25D366; font-weight:bold'>Chat Now</a><br>💬 <b>Pune:</b> <a href='https://wa.me/917821031637' target='_blank' style='color:#25D366; font-weight:bold'>Chat Now</a>",
    "default": "I'm still learning, but I'd love to help! 💡 For specific details about that, why not visit our campus or use our <span style='color:#8b4e9d; cursor:pointer; text-decoration:underline' onclick='openEnquiry()'>Admission Enquiry form</span>?"
};

function toggleChat() {
    document.getElementById('chatbot-window').classList.toggle('open');
    const intro = document.getElementById('chatbot-intro'); if (intro) intro.style.display = 'none';
}

function handleSuggest(text) {
    const input = document.getElementById('chat-input');
    input.value = text;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    addMessage(input.value, 'user-msg');
    input.value = '';

    setTimeout(() => {
        let response = botResponses.default;
        if (msg.includes('hello') || msg.includes('hi')) response = botResponses.hello;
        else if (msg.includes('location') || msg.includes('where')) response = botResponses.locations;
        else if (msg.includes('admission') || msg.includes('enquiry') || msg.includes('join')) response = botResponses.admission;
        else if (msg.includes('fee')) response = botResponses.fees;
        else if (msg.includes('how') && msg.includes('teach')) response = siteKnowledge.methods;
        else if (msg.includes('founder') || msg.includes('who')) response = botResponses.founders;
        else if (msg.includes('program') || msg.includes('class')) response = botResponses.programs;
        else if (msg.includes('whatsapp') || msg.includes('chat') || msg.includes('contact')) response = botResponses.whatsapp;

        addMessage(response, 'bot-msg');
    }, 500);
}

function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'message ' + type;
    div.innerHTML = text; // Changed from textContent to support links
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Enquiry Form Handle
function openEnquiry() {
    document.getElementById('enquiry-modal').classList.add('open');
}

function closeEnquiry() {
    document.getElementById('enquiry-modal').classList.remove('open');
}

function submitEnquiry(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScyvIdj1mI1S7_mF8m3h5X5l_Yp9uE5m3D-K1-L_m-P-S-S/formResponse";
    console.log("Submitting enquiry:", Object.fromEntries(formData));
    alert("Thank you! Your enquiry has been submitted. We will contact you shortly.");
    closeEnquiry();
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Add Suggested Questions & Enquiry Button
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        const suggestDiv = document.createElement('div');
        suggestDiv.id = 'chat-suggestions';
        suggestDiv.style.padding = '10px';
        suggestDiv.style.display = 'flex';
        suggestDiv.style.flexWrap = 'wrap';
        suggestDiv.style.gap = '5px';

        const suggestions = ["Admission", "Fees", "Programs", "Locations", "Contact"];
        suggestions.forEach(s => {
            const btn = document.createElement('button');
            btn.innerText = s;
            btn.style.padding = '5px 12px';
            btn.style.border = '1px solid #8b4e9d';
            btn.style.borderRadius = '20px';
            btn.style.background = 'white';
            btn.style.color = '#8b4e9d';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '12px';
            btn.onclick = () => handleSuggest(s);
            suggestDiv.appendChild(btn);
        });

        const enquiryBtn = document.createElement('button');
        enquiryBtn.innerText = "Admission Enquiry";
        enquiryBtn.style.padding = '5px 12px';
        enquiryBtn.style.border = 'none';
        enquiryBtn.style.borderRadius = '20px';
        enquiryBtn.style.background = '#8b4e9d';
        enquiryBtn.style.color = 'white';
        enquiryBtn.style.cursor = 'pointer';
        enquiryBtn.style.fontSize = '12px';
        enquiryBtn.style.marginTop = '5px';
        enquiryBtn.style.width = '100%';
        enquiryBtn.onclick = openEnquiry;
        suggestDiv.appendChild(enquiryBtn);

        // Insert suggestions after the first message
        setTimeout(() => {
            chatMessages.after(suggestDiv);
        }, 100);
    }

    // Add Intro Bubble
    const widget = document.getElementById('chatbot-widget');
    if (widget && !document.getElementById('chatbot-intro')) {
        const intro = document.createElement('div');
        intro.id = 'chatbot-intro';
        intro.innerHTML = '<span onclick="this.parentElement.style.display=\'none\'" style="position:absolute; top:2px; right:8px; cursor:pointer; font-size:16px">&times;</span>Hi! I am AI.Parenting. Need help? <span style="color:#8b4e9d; cursor:pointer; text-decoration:underline" onclick="toggleChat()">Chat now</span>';
        widget.appendChild(intro);
        setTimeout(() => {
            const chatWindow = document.getElementById('chatbot-window');
            if (chatWindow && !chatWindow.classList.contains('open')) {
                intro.style.display = 'block';
            }
        }, 3000);
    }
});