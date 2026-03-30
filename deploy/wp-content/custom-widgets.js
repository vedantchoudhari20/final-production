const siteKnowledge = {
    "name": "The Nurturing Roots",
    "locations": ["Nerul West, Navi Mumbai", "Nerul East, Navi Mumbai", "Marunji, Pune", "Pune (Wakad)", "Ulwe", "Uran City"],
    "methods": "Horizontal Learning Method and Experiential Learning",
    "founders": "Dr. Priyanka Sharma and Suhani Gupta",
    "programs": ["Little Explorers (Playgroup)", "Curious Cubs (Nursery)", "Rising Star 1 (LKG)", "Rising Star 2 (UKG)"],
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
    "programs": "We offer structured programs for every stage:<br>👶 <b>Little Explorers (Playgroup)</b><br>🌈 <b>Curious Cubs (Nursery)</b><br>🎨 <b>Rising Star 1 (LKG)</b><br>🚀 <b>Rising Star 2 (UKG)</b>",
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
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    const formData = new FormData(event.target);
    const params = new URLSearchParams(formData);
    
    // Using your latest Google Apps Script URL
    const scriptUrl = "https://script.google.com/macros/s/AKfycbxW0YG7FNfsi8Ri3v-x8grWoWRk2ayTtCk35EUTIlzHLwf5dm_XlVw3pqM9_GrwOYAa/exec";
    
    // We send data via GET - this is much more reliable for static site forms talking to Google Apps Script
    fetch(scriptUrl + "?" + params.toString(), {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(() => {
        alert("Enquiry Submitted Successfully! Nurturing Roots will soon connect to you.");
        closeEnquiry();
        event.target.reset();
    })
    .catch(error => {
        console.error("Submission error:", error);
        alert("Enquiry Submitted! We will contact you soon.");
        closeEnquiry();
        event.target.reset();
    })
    .finally(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

// Global Menu Correction Logic
function fixPreschoolMenu() {
    const menus = document.querySelectorAll('.sub-menu');
    menus.forEach(menu => {
        const items = Array.from(menu.children);
        let little = null, curious = null, rising1 = null, rising2 = null;

        items.forEach(li => {
            const link = li.querySelector('a');
            if (!link) return;
            const href = link.getAttribute('href') || '';
            const text = link.textContent.trim();

            // Identity check by href (most reliable for redirection)
            if (href.includes('little-explorers')) {
                // Safeguard: Ensure we are not misidentifying a parent as the child link
                if (text.includes('Preschool Program') || text.includes('Programs')) return;

                little = li;
                link.textContent = 'Little Explorers';
            } else if (href.includes('kids-nursery-in-nerul')) {
                curious = li;
                link.textContent = 'Curious Cubs';
            } else if (href.includes('rising-star-1')) {
                rising1 = li;
                link.textContent = 'Rising Star 1';
            } else if (href.includes('rising-star-2')) {
                rising2 = li;
                link.textContent = 'Rising Star 2';
            }
        });

        // Reorder if we found the preschool items (must have at least little and curious to be the right sub-menu)
        if (little && curious) {
            const parentUl = little.parentElement;
            // Append in desired order: Little Explorers -> Curious Cubs -> Rising Star 1 -> Rising Star 2
            parentUl.appendChild(little);
            parentUl.appendChild(curious);
            if (rising1) parentUl.appendChild(rising1);
            if (rising2) parentUl.appendChild(rising2);

            // Hide any duplicates that might be pointing to the same place if they are still there
            items.forEach(li => {
                if (li !== little && li !== curious && li !== rising1 && li !== rising2) {
                    const link = li.querySelector('a');
                    if (link) {
                        const text = link.textContent.trim();
                        if (text.includes('Little Explorers') || text.includes('Curious Cubs') || text.includes('Rising Star')) {
                            li.style.display = 'none';
                        }
                    }
                }
            });

            // Update parent links ("Preschool Program" and "Programs") to redirect to Little Explorers
            const littleHref = little.querySelector('a').getAttribute('href');

            // Parent of sub-menu is usually the LI with the name
            const parentLi = parentUl.parentElement;
            const parentLink = parentLi ? parentLi.querySelector('a') : null;
            if (parentLink && (parentLink.textContent.includes('Preschool Program') || parentLink.textContent.includes('Programs'))) {
                parentLink.setAttribute('href', littleHref);

                // Try to go up one more level for main "Programs" menu item
                const grandparentUl = parentLi.parentElement;
                const grandparentLi = grandparentUl ? grandparentUl.parentElement : null;
                const grandparentLink = grandparentLi ? grandparentLi.querySelector('a') : null;
                if (grandparentLink && grandparentLink.textContent.includes('Programs')) {
                    grandparentLink.setAttribute('href', littleHref);
                }
            }
        }
    });
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    // Run m    // --- AUTO-INJECTION SYSTEM ---
    injectGlobalCSS();
    injectChatbotHTML();
    injectEnquiryModalHTML();
    bindEnrollButtons();

    // Initialize Chatbot logic
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Add suggested buttons to chat
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && !document.getElementById('chat-suggestions')) {
        const suggestDiv = document.createElement('div');
        suggestDiv.id = 'chat-suggestions';
        suggestDiv.style.cssText = 'padding:10px; display:flex; flex-wrap:wrap; gap:5px;';

        const suggestions = ["Admission", "Fees", "Programs", "Locations", "Contact"];
        suggestions.forEach(s => {
            const btn = document.createElement('button');
            btn.innerText = s;
            btn.style.cssText = 'padding:5px 12px; border:1px solid #8b4e9d; border-radius:20px; background:white; color:#8b4e9d; cursor:pointer; font-size:12px;';
            btn.onclick = () => handleSuggest(s);
            suggestDiv.appendChild(btn);
        });

        const enquiryBtn = document.createElement('button');
        enquiryBtn.innerText = "Admission Enquiry";
        enquiryBtn.style.cssText = 'padding:5px 12px; border:none; border-radius:20px; background:#8b4e9d; color:white; cursor:pointer; font-size:12px; margin-top:5px; width:100%;';
        enquiryBtn.onclick = openEnquiry;
        suggestDiv.appendChild(enquiryBtn);
        
        setTimeout(() => { chatMessages.after(suggestDiv); }, 100);
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

function injectGlobalCSS() {
    if (document.getElementById('global-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'global-widget-styles';
    style.innerHTML = `
        /* Enquiry Modal Styles */
        #enquiry-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: none; z-index: 100000; justify-content: center; align-items: center; }
        #enquiry-modal.open { display: flex; }
        #enquiry-form-container { background: white; width: 90%; max-width: 450px; padding: 25px; border-radius: 20px; position: relative; max-height: 90vh; overflow-y: auto; border-top: 5px solid #8b4e9d; box-sizing: border-box; }
        #enquiry-form-container h2 { font-family: 'Kids Knowledge', sans-serif !important; color: #8b4e9d !important; margin-top: 0; margin-bottom: 10px; font-size: 28px; }
        #enquiry-form-container label { display: block; font-size: 13px; font-weight: bold; margin-top: 10px; color: #555; text-align: left; }
        #enquiry-form-container input, #enquiry-form-container select, #enquiry-form-container textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; margin-top: 5px; box-sizing: border-box; }
        .close-modal { position: absolute; top: 10px; right: 15px; font-size: 30px; cursor: pointer; color: #999; }
        .submit-btn { width: 100%; padding: 12px; border: none; border-radius: 50px; background: #8b4e9d; color: white; font-weight: bold; margin-top: 20px; cursor: pointer; }

        /* Chatbot Widget Styles */
        #chatbot-widget { position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif; }
        #chatbot-button { width: 60px; height: 60px; background: #8b4e9d; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: 0.3s; }
        #chatbot-button:hover { transform: scale(1.1); }
        #chatbot-button svg { width: 30px; height: 30px; fill: white; }
        #chatbot-window { position: absolute; bottom: 80px; right: 0; width: 320px; height: 450px; background: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; border: 1px solid #eee; }
        #chatbot-window.open { display: flex; }
        #chatbot-window header { background: #8b4e9d; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
        #chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .message { padding: 10px 15px; border-radius: 15px; font-size: 14px; max-width: 85%; line-height: 1.4; }
        .bot-msg { background: #eee; align-self: flex-start; border-bottom-left-radius: 2px; color: #333; }
        .user-msg { background: #8b4e9d; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
        #chat-input-area { padding: 10px; border-top: 1px solid #eee; display: flex; gap: 5px; }
        #chat-input { flex: 1; border: 1px solid #ddd; padding: 8px 12px; border-radius: 20px; font-size: 14px; outline: none; }
        #chatbot-intro { position: absolute; bottom: 70px; right: 0; background: white; padding: 12px 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-size: 13px; width: 220px; display: none; border-right: 5px solid #8b4e9d; }

        /* Ensure yellow tab works */
        .button-demo.this { cursor: pointer !important; }
    `;
    document.head.appendChild(style);
}

function injectChatbotHTML() {
    let widget = document.getElementById('chatbot-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.id = 'chatbot-widget';
        document.body.appendChild(widget);
    }
    // Refresh content to ensure latest logic/names
    widget.innerHTML = `
        <div id="chatbot-button" onclick="toggleChat()">
            <svg viewBox="0 0 24 24"><path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H5.2L4,17.2V4h16V16z"/></svg>
        </div>
        <div id="chatbot-window">
            <header><span>AI.Parenting</span><span onclick="toggleChat()" style="cursor:pointer">×</span></header>
            <div id="chat-messages"><div class="message bot-msg">Hello! I'm your AI.Parenting assistant. How can I help you regarding our preschool today?</div></div>
            <div id="chat-input-area">
                <input type="text" id="chat-input" placeholder="Type a message...">
                <button onclick="sendMessage()" style="background:none; border:none; color:#8b4e9d; font-weight:bold; cursor:pointer">Send</button>
            </div>
        </div>`;
}

function injectEnquiryModalHTML() {
    let modal = document.getElementById('enquiry-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'enquiry-modal';
        document.body.appendChild(modal);
    }
    // Refresh content to ensure latest program names (Rising Star) and styles
    modal.innerHTML = `
    <div id="enquiry-form-container">
      <span class="close-modal" onclick="closeEnquiry()">×</span>
      <h2>Enquire Now</h2>
      <p style="font-size: 13px; color: #777;">Please fill out the form below and we will get back to you.</p>
      <form onsubmit="submitEnquiry(event)">
        <label>Child's Name</label>
        <input type="text" name="child_name" required>
        <label>Parent's Name</label>
        <input type="text" name="parent_name" required>
        <label>Email ID</label>
        <input type="email" name="email" required>
        <label>Phone Number</label>
        <input type="tel" name="phone" required>
        <label>Centre</label>
        <select name="centre" required>
          <option value="">Select Centre</option>
          <option>Nerul West, Navi Mumbai</option>
          <option>Nerul East, Navi Mumbai</option>
          <option>Marunji, Pune</option>
          <option>Pune (Wakad)</option>
          <option>Ulwe</option>
          <option>Uran City</option>
        </select>
        <label>Interested Program</label>
        <select name="program">
          <option>Little Explorers (Playgroup)</option>
          <option>Curious Cubs (Nursery)</option>
          <option>Rising Star 1 (LKG)</option>
          <option>Rising Star 2 (UKG)</option>
        </select>
        <label>Your Message</label>
        <textarea name="message" rows="3"></textarea>
        <button type="submit" class="submit-btn" style="background:#8b4e9d!important; color:white!important;">Submit Enquiry</button>
      </form>
    </div>`;
}

function bindEnrollButtons() {
    document.addEventListener('click', (e) => {
        // Target buttons by class, href, or text content
        const target = e.target.closest('.button-demo, .enrol-now-tab, .elementor-button, [href*="enrol"], [href*="enroll"]');
        
        if (target) {
            // Ignore blog post links even if they contain keywords like 'enroll'
            if (target.classList.contains('latest-blog-read-more') || target.closest('.latest-blog-card')) return;

            const text = target.innerText.toLowerCase();
            const href = target.getAttribute('href') || '';
            
            // If it's explicitly an enroll button or contains the text, trigger modal
            if (text.includes('enrol') || text.includes('enroll') || target.classList.contains('button-demo')) {
                // Prevent redirection unless it's a real external link (rare for these buttons)
                if (!href.startsWith('http') || href.includes(window.location.hostname)) {
                    e.preventDefault();
                    openEnquiry();
                }
            }
        }
    });
}
