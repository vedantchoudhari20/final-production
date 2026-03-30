const fs = require('fs');
const path = require('path');

const pages = [
    ["about-us", "About Us", "Welcome to The Nurturing Roots. We are dedicated to providing the best early childhood education."],
    ["our-mission", "Vision & Mission", "Our mission is to nurture young minds with love and logic."],
    ["faqs", "Frequently Asked Questions", "Find answers to common questions about admissions, curriculum, and more."],
    ["little-explorers", "Little Explorers", "A program designed for our youngest learners to explore the world through play."],
    ["rising-star-1", "Rising Stars I", "Focusing on foundational skills and social interaction."],
    ["rising-star-2", "Rising Stars II", "Preparing children for the next step in their academic journey."],
    ["best-day-care-centre-in-nerul-pune", "Daycare", "A home away from home, ensuring safety and nourishment for your child."],
    ["privacy-policy", "Privacy Policy", "We value your privacy. Read our policy on how we handle your data."],
    ["terms-and-conditions", "Terms & Conditions", "Read the terms and conditions for using our services."],
    ["school-detail/the-nurturing-roots-preschool-daycare", "The Nurturing Roots Preschool & Daycare", "Our premier centre providing top-notch care and education."],
    ["school-detail/the-nurturing-roots-preschool3", "TNR Pune Centre", "Our Pune centre dedicated to nurturing young minds."]
];

const baseDir = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy';
const templatePath = path.join(baseDir, 'gallery/index.html');

if (!fs.existsSync(templatePath)) {
    console.error("Template not found:", templatePath);
    process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

pages.forEach(([folder, title, content]) => {
    const dir = path.join(baseDir, folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Replace Title
    let html = template.replace(/<title>.*?<\/title>/, `<title>${title} - The Nurturing Roots</title>`);

    // Replace Header Title in Gallery (since we use it as template)
    // Looking for the specific h1 layout
    const headingSearch = /<h1[\s\S]*?class="elementor-heading-title elementor-size-default"[\s\S]*?>[\s\S]*?Gallery[\s\S]*?<\/h1>/;
    const newHeading = `<h1 class="elementor-heading-title elementor-size-default">${title}</h1><p style="text-align:center; padding: 20px; font-size: 1.2rem; color: #555;">${content}</p>`;

    if (headingSearch.test(html)) {
        html = html.replace(headingSearch, newHeading);
    } else {
        // Fallback
        html = html.replace(/>Gallery</g, `>${title}<`);
    }

    // Since we are using gallery/index.html as template, all paths are already ../
    // No need to fix paths further unless we are in deep subfolders.

    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log(`Created page: ${folder}`);
});

console.log("Finished creating pages.");
