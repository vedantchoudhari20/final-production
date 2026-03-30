
import os

pages = [
    ("about-us", "About Us", "Welcome to The Nurturing Roots. We are dedicated to providing the best early childhood education."),
    ("our-mission", "Vision & Mission", "Our mission is to nurture young minds with love and logic."),
    ("faqs", "Frequently Asked Questions", "Find answers to common questions about admissions, curriculum, and more."),
    ("little-explorers", "Little Explorers", "A program designed for our youngest learners to explore the world through play."),
    ("rising-star-1", "Rising Stars I", "Focusing on foundational skills and social interaction."),
    ("rising-star-2", "Rising Stars II", "Preparing children for the next step in their academic journey.")
]

# Read a base template (gallery/index.html)
with open(r'c:\Users\Vedant\Downloads\thenurturingroots.com\deploy\gallery\index.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Simplify the template: Remove the main gallery content and replace it with a placeholder
# In gallery/index.html, the main content is usually inside an elementor-section
# For simplicity, I'll just replace the Title and a specific content block.

for folder, title, content in pages:
    dir_path = os.path.join(r'c:\Users\Vedant\Downloads\thenurturingroots.com\deploy', folder)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    
    # Customize the template
    page_html = template.replace("<title>Gallery", f"<title>{title}")
    
    # We need to find the main content area. In gallery/index.html, it has "Gallery" heading.
    # We replace it with title and content.
    page_html = page_html.replace(">Gallery<", f">{title}<")
    
    # For content, we'll try to insert it after the title
    # This is a bit hacky but better than nothing
    search_str = f"inner-section\">{title}<"
    if search_str in page_html:
        page_html = page_html.replace(search_str, f"inner-section\">{title}</h3><p style='text-align:center; padding: 20px;'>{content}</p>")
    
    with open(os.path.join(dir_path, "index.html"), "w", encoding='utf-8') as f:
        f.write(page_html)

print("Created 6 pages.")
