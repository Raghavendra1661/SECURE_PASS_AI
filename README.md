# SecurePass AI — Classic White Edition

A responsive, browser-based password strength analyzer and password generator demo.

## Run the project
1. Extract the ZIP file.
2. Open the `SecurePass_AI_Classic_White` folder.
3. Double-click `index.html` to open it in a modern browser.
4. Type a sample password and select **Analyze Password**.
5. Use **Generate** to create a random password.

No build tools or package installation are required.

## Project files
- `index.html` — page structure and content
- `style.css` — classic white and crimson design
- `script.js` — password analysis and generator behavior
- `favicon.svg` — browser tab icon

## Privacy and security notes
- Password analysis runs locally in the browser. This demo does not send entered passwords to a server or save them.
- The entropy figure is an estimate based on password length and character categories. It is not a guarantee of real-world password security.
- Generated passwords use the browser's Web Crypto random number generator.
- This is a front-end demonstration, not a complete password manager or secure vault. It does not store, sync, encrypt, or recover passwords.
- A normal website cannot reliably prevent screenshots or screen recording on every device. Do not rely on an “anti-screen-capture” claim for protection.
- For real accounts, use a unique password for every service and store it in a reputable password manager.

## Customization
Edit the CSS variables at the top of `style.css` to adjust the theme colors.
