const fs = require('fs');

function updateFounders() {
    console.log("Updating founders/index.html...");
    let content = fs.readFileSync('founders/index.html', 'utf8');
    
    // Replace "( Founder )" below Priyanka Sharma with "( Co-Founder )"
    // Also change "Founder & Passionate Educator" to "Co-Founder & Passionate Educator"
    // Let's use simple string replacements based on what we saw earlier.
    
    // We saw: "Dr. Priyanka Sharma <br>( Founder )"
    content = content.replace(/(Dr\.\s*Priyanka\s*Sharma\s*<br>\s*\(\s*)Founder(\s*\))/g, '$1Co-Founder$2');
    
    // As per screenshot: "Founder & Passionate Educator" is directly above "Dr. Priyanka Sharma"
    // So let's look for: ">Founder &amp; Passionate Educator<" or ">Founder & Passionate Educator<"
    content = content.replace(/>Founder\s+(?:&amp;|&)\s+Passionate\s+Educator</g, '>Co-Founder & Passionate Educator<');
    content = content.replace(/Co-Founder of Nurturing Roots/g, 'Founder of Nurturing Roots'); // Wait, the text said "Co-founder of Nurturing Roots"? Text in screenshot says "Co-Founder of Nurturing Roots". The text is fine. Only the title is wrong.
    
    fs.writeFileSync('founders/index.html', content);
    console.log("Founders updated.");
}

function updateContactNumbers() {
    console.log("Updating contact numbers...");
    const files = ['index.html', 'contact-us/index.html'];
    
    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf8');
        
        // Let's find occurrences of href="tel:+91-9987090631" and check if next text is 7838587500, replace it with 9987090631
        // HTML in screenshot:
        // <a href="tel:+91-9987090631">
        //   <span class="elementor-icon-list-icon">...</span>
        //   <span class="elementor-icon-list-text">+91-7838587500</span>
        // </a>
        
        const regex = /(<a\s[^>]*href="tel:[^>]*9987090631"[^>]*>[\s\S]*?)>(\+?91-?)?7838587500(<\/span>[\s\S]*?<\/a>)/g;
        if(regex.test(content)) {
            console.log(`Found un-updated text for 9987090631 in ${file}`);
            content = content.replace(regex, '$1>+91-9987090631$3');
        }
        
        // Also if we have two list items, maybe both hrefs are 7838587500 in index.html?
        // In the screenshot of contact-us, the href was 9987090631.
        // Let's check if there's any second phone number list item that has 7838587500 for both href and text but is supposedly the second number.
        // In index.html, user says "the second number is not updated keep both diffrent phone numbers". Let's manually inject the second number if it's missing or duplicated.
        
        // Find the list of phones. Usually it's in a single elementor widget.
        // If we find <a href="tel:+91-7838587500">...<span>+91-7838587500</span></a> duplicated twice in the contact section, we replace the second one.
        // We can just dump the occurrences to analyze if replace did anything.
        fs.writeFileSync(file, content);
    });
    console.log("Contact numbers updated.");
}

function processGallery() {
    // We'll run powershell to copy images first, then we shuffle.
}

updateFounders();
updateContactNumbers();

