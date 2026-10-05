MARTIJN SCHWARTZ & ASSOCIATES - WEBSITE FILES
=============================================

Upload every file in this folder to the main (root) folder of your web hosting.
Start page: index.html

LANGUAGE SWITCH (EN / NL)
- Every translated piece of text has its Dutch version in a  data-nl="..."  attribute.
  Example:  <h2 data-nl="Ons team">Our team</h2>
  Change the English between the tags, and the Dutch inside data-nl="...".
- Messages written by the script (form errors, "Open now", etc.) are in the
  TEXT table at the top of script.js.

CONTACT FORM (contact.html)
- When a client presses "Send request by email", the form checks their details
  and opens their email app with the request already typed in:
    To: Info@wetheavelsadocate.com
    Cc: admin@wetheavelsadvocate.com
  The client presses send in their email app, and it arrives in your inbox.
- If the email app doesn't open, the page shows an "Open email app" button and
  the full text with a "Copy text" button.
- To change the addresses, edit SEND_TO and SEND_CC near the bottom of script.js.
  No sign-up or activation is needed.

LIGHT / DARK THEME
- The sun/moon button in the top bar switches between a black and a white background.
- The site starts in dark mode and remembers each visitor's choice.
- Theme colours are at the top of styles.css, under THEMES.

HOME PHOTO
- hero-photo.jpg. Replace it with another photo of the same name to change it.

LOGO
- logo.png (full logo), logo-emblem.png (round seal), favicon.png (browser tab icon).

TEAM
- The "Our team" section is on about.html. Add your lawyers' names, roles and
  photos there (look for the comment "TEAM").
