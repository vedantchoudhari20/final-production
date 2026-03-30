import os

target_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"

email_field = """
        <label>Email ID</label>
        <input type="email" name="email" required>
"""

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="enquiry-modal"' not in content:
        return False
    
    if 'name="email"' in content:
        return False # Already added
    
    # Insert before Phone Number or after Parent's Name
    target = '<label>Phone Number</label>'
    if target in content:
        new_content = content.replace(target, email_field + '        ' + target)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

count = 0
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.html'):
            if process_file(os.path.join(root, file)):
                count += 1

print(f"Updated {count} files.")
