import os
import re

def fix_menu_standardization(file_path):
    if not os.path.exists(file_path):
        return
    print(f"Standardizing menu in {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We are looking for the sub-menu items under Preschool Program
    # We want to ensure each one has the correct text based on its href.
    
    # 1. Fix "Little Explorers" link text
    content = re.sub(
        r'href="([^"]*?)little-explorers/index\.html"([^>]*?)>[\s\n]*[^<]*?[\s\n]*</a>',
        r'href="\1little-explorers/index.html"\2>Little Explorers</a>',
        content
    )
    
    # 2. Fix "Curious Cubs" (Nursery) link text - This is the one most likely corrupted
    content = re.sub(
        r'href="([^"]*?)kids-nursery-in-nerul/index\.html"([^>]*?)>[\s\n]*[^<]*?[\s\n]*</a>',
        r'href="\1kids-nursery-in-nerul/index.html"\2>Curious Cubs</a>',
        content
    )
    
    # 3. Fix "Rising Star 1" link text
    content = re.sub(
        r'href="([^"]*?)rising-star-1/index\.html"([^>]*?)>[\s\n]*[^<]*?[\s\n]*</a>',
        r'href="\1rising-star-1/index.html"\2>Rising Star 1</a>',
        content
    )
    
    # 4. Fix "Rising Star 2" link text
    content = re.sub(
        r'href="([^"]*?)rising-star-2/index\.html"([^>]*?)>[\s\n]*[^<]*?[\s\n]*</a>',
        r'href="\1rising-star-2/index.html"\2>Rising Star 2</a>',
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# We should run this for all index.html files.
# For efficiency, I'll list the known ones from earlier searches.
base_path = "c:/Users/Vedant/Downloads/thenurturingroots.com"
folders = [
    ".", "deploy", "little-explorers", "deploy/little-explorers",
    "rising-star-1", "deploy/rising-star-1", "rising-star-2", "deploy/rising-star-2",
    "kids-nursery-in-nerul", "deploy/kids-nursery-in-nerul",
    "best-day-care-centre-in-nerul-pune", "deploy/best-day-care-centre-in-nerul-pune",
    "our-centers", "deploy/our-centers", "gallery", "deploy/gallery",
    "contact-us", "deploy/contact-us", "about-us", "deploy/about-us"
]

for folder in folders:
    fix_menu_standardization(os.path.join(base_path, folder, "index.html"))

print("Menu standardization complete.")
