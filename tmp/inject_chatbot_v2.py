import os
import re

chatbot_html = """
  <!-- Advanced Chatbot Widget -->
  <div id="chatbot-widget">
    <div id="chatbot-badge">1</div>
    <div id="chatbot-button" onclick="toggleChat()">
      <svg viewBox="0 0 24 24">
        <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H5.2L4,17.2V4h16V16z" />
      </svg>
    </div>
    <div id="chatbot-window">
      <header>
        <span><span class="status-dot"></span>AI.Parenting</span>
        <span onclick="toggleChat()" style="cursor:pointer; font-size: 24px;">&times;</span>
      </header>
      <div id="chat-messages">
        <div class="message bot-msg">Hello! I'm your AI.Parenting assistant at The Nurturing Roots. How can I help you today?</div>
      </div>
      <div id="typing-indicator" class="typing" style="padding: 0 20px; font-style: italic; font-size: 12px; color: #b2bec3;">AI is typing...</div>
      <div id="chat-suggestions">
        <button onclick="handleSuggest('Admission')">Admission</button>
        <button onclick="handleSuggest('Fees')">Fees</button>
        <button onclick="handleSuggest('Programs')">Programs</button>
        <button onclick="handleSuggest('Locations')">Locations</button>
      </div>
      <div id="chat-input-area">
        <input type="text" id="chat-input" placeholder="Ask something...">
        <button onclick="sendMessage()" style="background:none; border:none; color:#6c5ce7; font-weight:bold; cursor:pointer">Send</button>
      </div>
    </div>
    <div id="chatbot-intro">
      <span onclick="this.parentElement.style.display='none'" style="position:absolute; top:5px; right:10px; cursor:pointer">&times;</span>
      Hi! I'm AI.Parenting. Have any questions? <span style="color:#6c5ce7; cursor:pointer; font-weight:bold" onclick="toggleChat()">Chat with me</span>
    </div>
  </div>

  <!-- Float Enquiry Button -->
  <div id="float-enquiry" onclick="openEnquiry()">Enquire Now</div>

  <!-- Enquiry Modal -->
  <div id="enquiry-modal">
    <div id="enquiry-form-container">
      <span class="close-modal" onclick="closeEnquiry()">&times;</span>
      <h2 style="font-family: inherit; color: #6c5ce7;">Admission Enquiry</h2>
      <p style="text-align: center; margin-bottom: 20px;">Fill the form below and we'll connect with you.</p>
      <form onsubmit="submitEnquiry(event)">
        <label>Child's Name</label>
        <input type="text" name="child_name" required>

        <label>Parent's Name</label>
        <input type="text" name="parent_name" required>

        <label>Phone Number</label>
        <input type="tel" name="phone" required>

        <label>Select Centre</label>
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
          <option>Playgroup</option>
          <option>Nursery</option>
          <option>LKG</option>
          <option>UKG</option>
          <option>Daycare</option>
        </select>

        <button type="submit" class="submit-btn" style="background:#6c5ce7; color: white; border: none; padding: 15px; border-radius: 8px; width: 100%; cursor: pointer; font-weight: bold; margin-top: 20px;">Submit Enquiry</button>
      </form>
    </div>
  </div>
"""

def process_file(file_path, directory):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Clean up OLD variations of the chatbot/enquiry modal if they exist
        # Remove anything between <!-- Custom Chatbot Widget --> or similar and the enquiry modal end
        patterns_to_remove = [
            r'<!-- Custom Chatbot Widget -->.*?<!-- Enquiry Modal -->.*?</div>\s*</div>',
            r'<!-- Advanced Chatbot Widget -->.*?<!-- Enquiry Modal -->.*?</div>\s*</div>',
            r'<div id="chatbot-widget">.*?</div>\s*</div>.*?<div id="float-enquiry">.*?</div>.*?<div id="enquiry-modal">.*?</div>\s*</div>'
        ]
        
        for pattern in patterns_to_remove:
            content = re.sub(pattern, '', content, flags=re.DOTALL)
            
        # Also handle specific floating button and modal if they are separate
        content = re.sub(r'<div id="float-enquiry".*?</div>', '', content, flags=re.DOTALL)
        content = re.sub(r'<div id="enquiry-modal">.*?</div>\s*</div>', '', content, flags=re.DOTALL)

        # 2. Determine paths for CSS/JS
        depth = len(os.path.relpath(os.path.dirname(file_path), directory).split(os.sep))
        if os.path.relpath(os.path.dirname(file_path), directory) == '.': depth = 0
        prefix = "./" if depth == 0 else "../" * depth
        
        css_link = f'<link rel="stylesheet" href="{prefix}wp-content/custom-widgets.css" />'
        js_script = f'<script src="{prefix}wp-content/custom-widgets.js"></script>'

        # 3. Inject CSS Link if missing
        if 'custom-widgets.css' not in content:
            content = content.replace('</head>', f'  {css_link}\n</head>')
        else:
            # Update existing link to correct prefix if needed (simplified)
            content = re.sub(r'<link rel="stylesheet" href=".*?custom-widgets\.css" />', css_link, content)

        # 4. Inject JS Script if missing
        if 'custom-widgets.js' not in content:
            content = content.replace('</body>', f'  {js_script}\n</body>')
        else:
             content = re.sub(r'<script src=".*?custom-widgets\.js"></script>', js_script, content)

        # 5. Inject HTML before </body> (but after the js script tag)
        # Search for the script tag we just ensured is there
        if js_script in content:
            content = content.replace(js_script, f'{js_script}\n{chatbot_html}')
        else:
            # Fallback
            content = content.replace('</body>', f'{chatbot_html}\n</body>')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def inject_chatbot(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        if any(skip in root for skip in ['.git', '.vercel', 'node_modules']):
            continue
        for file in files:
            if file.endswith('.html'):
                if process_file(os.path.join(root, file), directory):
                    count += 1
    print(f"Processed {count} HTML files.")

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    inject_chatbot(deploy_dir)
    
    # Also process root index.html
    # root_file = r"c:\Users\Vedant\Downloads\thenurturingroots.com\index.html"
    # if os.path.exists(root_file):
    #     process_file(root_file, r"c:\Users\Vedant\Downloads\thenurturingroots.com")
