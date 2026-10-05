// Google Apps Script for Shreif & Monica RSVP
//
// 1. Create a Google Sheet.
// 2. Put these headers in row 1:
//    Timestamp | Name | Attendance | Guests | Message
// 3. Extensions -> Apps Script.
// 4. Replace the code with this file.
// 5. Deploy -> New deployment -> Web app.
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Copy the /exec URL into script.js:
//    const GOOGLE_SCRIPT_URL = "YOUR_URL_HERE";

const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.attendance || "",
      data.guests || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: String(error)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
