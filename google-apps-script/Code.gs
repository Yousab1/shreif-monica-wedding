// ==========================================
// SHREIF & MONICA - RSVP + GIFT BOOK
// ==========================================

const SHEET_NAME = "RSVP";

// ------------------------------------------
// SAVE RSVP - EXISTING FUNCTIONALITY
// ------------------------------------------
function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(SHEET_NAME) ||
      spreadsheet.getSheets()[0];

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.attendance || "",
      data.guests || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(
        JSON.stringify({ success: true })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: String(error)
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ------------------------------------------
// READ MESSAGES - GIFT BOOK
// ------------------------------------------
function doGet(e) {
  const callback = String(
    (e && e.parameter && e.parameter.callback) || ""
  );

  // Only allow a simple JavaScript callback name.
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: "A valid callback parameter is required."
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) {
      return createGiftBookResponse(callback, []);
    }

    // Read existing columns without modifying the sheet.
    const rows = sheet
      .getRange(2, 1, sheet.getLastRow() - 1, 5)
      .getDisplayValues();

    const messages = rows
      .filter(row => {
        const name = String(row[1] || "").trim();
        const message = String(row[4] || "").trim();

        return name !== "" && message !== "";
      })
      .map(row => ({
        name: String(row[1]).trim(),
        message: String(row[4]).trim()
      }))
      .reverse();

    return createGiftBookResponse(callback, messages);

  } catch (error) {
    return createGiftBookResponse(callback, [], String(error));
  }
}

// ------------------------------------------
// JSONP RESPONSE FOR THE WEBSITE
// ------------------------------------------
function createGiftBookResponse(callback, messages, error) {
  const response = {
    success: !error,
    messages: messages,
    error: error || null
  };

  const json = JSON.stringify(response)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return ContentService
    .createTextOutput(callback + "(" + json + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
