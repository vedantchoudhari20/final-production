import os
import re

original_chatbot_html = """  <!-- Custom Chatbot Widget -->
  <div id="chatbot-widget">
    <div id="chatbot-button" onclick="toggleChat()">
      <svg viewBox="0 0 24 24">
        <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H5.2L4,17.2V4h16V16z" />
      </svg>
    </div>
    <div id="chatbot-window">
      <header>
        <span>AI.Parenting</span>
        <span onclick="toggleChat()" style="cursor:pointer">×</span>
      </header>
      <div id="chat-messages">
        <div class="message bot-msg">Hello! I'm your AI.Parenting assistant. How can I help you regarding our preschool
          today?
        </div>
      </div>
      <div id="chat-input-area">
        <input type="text" id="chat-input" placeholder="Type a message...">
        <button onclick="sendMessage()"
          style="background:none; border:none; color:#6c5ce7; font-weight:bold; cursor:pointer">Send</button>
      </div>
    </div>
  </div>

  <!-- Float Enquiry Button -->
  <div id="float-enquiry" onclick="openEnquiry()">Enquire Now</div>

  <!-- Enquiry Modal -->
  <div id="enquiry-modal">
    <div id="enquiry-form-container">
      <span class="close-modal" onclick="closeEnquiry()">×</span>
      <h2>Enquire Now</h2>
      <p>Please fill out the form below and we will get back to you.</p>
      <form onsubmit="submitEnquiry(event)">
        <label>Child's Name</label>
        <input type="text" name="child_name" required>

        <label>Parent's Name</label>
        <input type="text" name="parent_name" required>

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
          <option>Creative Crawlers</option>
          <option>Adventurous Aces</option>
        </select>

        <label>Your Message</label>
        <textarea name="message" rows="3"></textarea>

        <button type="submit" class="submit-btn" style="background:#6c5ce7; font-family: inherit;">Submit
          Enquiry</button>
      </form>
    </div>
  </div>"""

def inject(directory):
    for root, dirs, files in os.walk(directory):
        if '.git' in root or '.vercel' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Find out depth for pathing
                    depth = len(os.path.relpath(root, directory).split(os.sep))
                    if os.path.relpath(root, directory) == '.': depth = 0
                    prefix = "./" if depth == 0 else "../" * depth
                    
                    css_link = f'<link rel="stylesheet" href="{prefix}wp-content/custom-widgets.css" />'
                    js_script = f'<script src="{prefix}wp-content/custom-widgets.js"></script>'
                    
                    # Update content if missing
                    changed = False
                    
                    # Ensure css is linked
                    if 'custom-widgets.css' not in content:
                        content = content.replace('</head>', f'  {css_link}\n</head>')
                        changed = True
                        
                    # Remove the bot widgets if already there but we want to standardize the centre dropdown
                    # Let's replace the whole Custom Chatbot Widget block if it exists
                    if '<!-- Custom Chatbot Widget -->' in content:
                        content = re.sub(r'<!-- Custom Chatbot Widget -->.*?<!-- Enquiry Modal -->.*?</div>\s*</div>', original_chatbot_html, content, flags=re.DOTALL)
                        changed = True
                    else:
                        # Find where to inject
                        if '</body>' in content:
                            injection = f'\n{original_chatbot_html}\n'
                            if 'custom-widgets.js' not in content:
                                injection += f'  {js_script}\n'
                            content = content.replace('</body>', f'{injection}</body>')
                            changed = True
                            
                    # Make sure JS script is present in files that had widget but no JS script
                    if 'custom-widgets.js' not in content and changed is False:
                         content = content.replace('</body>', f'  {js_script}\n</body>')
                         changed = True

                    if changed:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    inject(deploy_dir)
    # also the root index
    root_index = r"c:\Users\Vedant\Downloads\thenurturingroots.com\index.html"
    if os.path.exists(root_index):
        with open(root_index, 'r', encoding='utf-8') as f:
            content = f.read()
            
        css_link = '<link rel="stylesheet" href="./wp-content/custom-widgets.css" />'
        js_script = '<script src="./wp-content/custom-widgets.js"></script>'
        
        changed = False
        if 'custom-widgets.css' not in content:
            content = content.replace('</head>', f'  {css_link}\n</head>')
            changed = True
            
        if '<!-- Custom Chatbot Widget -->' in content:
            content = re.sub(r'<!-- Custom Chatbot Widget -->.*?<!-- Enquiry Modal -->.*?</div>\s*</div>', original_chatbot_html, content, flags=re.DOTALL)
            changed = True
        else:
            if '</body>' in content:
                injection = f'\n{original_chatbot_html}\n'
                if 'custom-widgets.js' not in content:
                    injection += f'  {js_script}\n'
                content = content.replace('</body>', f'{injection}</body>')
                changed = True
                
        if changed:
            with open(root_index, 'w', encoding='utf-8') as f:
                f.write(content)
