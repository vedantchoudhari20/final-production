import os

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
      <div id="typing-indicator" class="typing" style="padding: 0 20px;">AI is typing...</div>
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
      <h2 style="font-family: inherit;">Admission Enquiry</h2>
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

        <button type="submit" class="submit-btn" style="background:#6c5ce7; color: white;">Submit Enquiry</button>
      </form>
    </div>
  </div>
"""

def inject_chatbot(directory):
    for root, dirs, files in os.walk(directory):
        if any(skip in root for skip in ['.git', '.vercel', 'node_modules']):
            continue
            
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Skip if chatbot already exists locally in this file
                    if 'id="chatbot-widget"' in content:
                        # But we want to update it to the advanced version if it's old
                        # For simplicity, if it has chatbot-widget, we'll replace the block if possible 
                        # or just skip if we assume it's the new one.
                        # Let's perform a replacement to ensure it's the latest.
                        import re
                        # Find the existing block and replace it
                        content = re.sub(r'<!--.*?Chatbot Widget.*?-->.*?<!-- Enquiry Modal -->.*?</div>\s*</div>', '', content, flags=re.DOTALL)
                        # This might be tricky. Let's try a safer approach:
                        # Just remove anything that looks like the old chatbot and inject fresh.
                        if 'id="chatbot-widget"' in content:
                            print(f"File {file_path} already has chatbot, checking if update needed...")
                            # If it doesn't have "Advanced Chatbot Widget" comment, it's old.
                            if '<!-- Advanced Chatbot Widget -->' not in content:
                                # Remove old components if detected
                                content = re.sub(r'<div id="chatbot-widget">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
                                content = re.sub(r'<div id="float-enquiry".*?</div>', '', content, flags=re.DOTALL)
                                content = re.sub(r'<div id="enquiry-modal">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
                    
                    if 'id="chatbot-widget"' not in content:
                        # Inject CSS link in head if missing
                        rel_path = os.path.relpath(directory, root).replace('\\', '/')
                        # If starting from deploy/, depth might vary
                        # Let's use absolute-ish paths relative to root for now or fix them
                        path_prefix = "./" if root == directory else "../"
                        # Special case for sub-sub dirs if they exist
                        depth = len(os.path.relpath(root, directory).split(os.sep))
                        if os.path.relpath(root, directory) == '.': depth = 0
                        prefix = "./" if depth == 0 else "../" * depth
                        
                        css_link = f'<link rel="stylesheet" href="{prefix}wp-content/custom-widgets.css" />'
                        js_script = f'<script src="{prefix}wp-content/custom-widgets.js"></script>'
                        
                        if 'custom-widgets.css' not in content:
                            content = content.replace('</head>', f'  {css_link}\n</head>')
                        
                        if 'custom-widgets.js' not in content:
                            content = content.replace('</body>', f'  {js_script}\n</body>')
                            
                        # Inject HTML before </body> (but after the js script we just added)
                        content = content.replace('</body>', f'{chatbot_html}\n</body>')
                        
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Injected advanced chatbot into: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    inject_chatbot(deploy_dir)
    # Also root index.html
    # inject_chatbot(r"c:\Users\Vedant\Downloads\thenurturingroots.com") # User didn't ask for root but it's good practice
