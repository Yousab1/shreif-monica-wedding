# Shreif & Monica Wedding Invitation

Frontend wedding invitation website built with:
- HTML
- CSS
- JavaScript
- Google Sheets + Google Apps Script for RSVP

## Run locally

Open `index.html` in your browser.

For a cleaner local development workflow, use VS Code + Live Server.

## Before publishing

Replace:
- "Your date here"
- "Your engagement date here"
- "Wedding Time"
- story text
- timeline dates
- gallery image URLs

## Google Sheets RSVP

1. Create a Google Sheet.
2. Add a sheet named `RSVP`.
3. Add headers:
   Timestamp | Name | Attendance | Guests | Message
4. Open Extensions -> Apps Script.
5. Paste `google-apps-script/Code.gs`.
6. Deploy it as a Web App:
   - Execute as: Me
   - Who has access: Anyone
7. Copy the `/exec` URL.
8. Open `script.js`.
9. Put the URL in `GOOGLE_SCRIPT_URL`.

Example:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";

## Important

The current wedding countdown uses:
November 21, 2026 at 4:00 PM Cairo time.

Change the time in `script.js` once the exact ceremony time is confirmed.

The Google Maps button currently searches for:
St. Mary Virgin Church – Ard El Golf, Cairo.

Replace the URL with the exact Google Maps place link if you have it.
