
// ==========================================
// SHREIF & MONICA - RSVP + GIFT BOOK + MUSIC
// ==========================================


const SHEET_NAME = "RSVP";
const MUSIC_COUNTER_KEY = "MUSIC_VISITOR_COUNT";

// ------------------------------------------
// SAVE RSVP - EXISTING FUNCTIONALITY
// ------------------------------------------
function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("Sheet not found: " + SHEET_NAME);
    }

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

// ------------------------------------------
// GET MUSIC TRACK OR GIFT BOOK MESSAGES
// ------------------------------------------
function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = String(params.callback || "");

  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: "A valid callback parameter is required."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // New feature: choose the next music track
  if (params.action === "nextTrack") {
    return getNextMusicTrack(callback);
  }

  // Existing Gift Book functionality
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) {
      return createGiftBookResponse(callback, []);
    }

    const rows = sheet
      .getRange(2, 1, sheet.getLastRow() - 1, 5)
      .getDisplayValues();

    const messages = rows
      .filter(row =>
        String(row[1] || "").trim() !== "" &&
        String(row[4] || "").trim() !== ""
      )
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
// ALTERNATE MUSIC 1 / MUSIC 2
// ------------------------------------------
function getNextMusicTrack(callback) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const properties = PropertiesService.getScriptProperties();

    let visitorCount =
      Number(properties.getProperty(MUSIC_COUNTER_KEY)) || 0;

    visitorCount++;

    properties.setProperty(
      MUSIC_COUNTER_KEY,
      String(visitorCount)
    );

    const track = visitorCount % 2 === 1 ? 1 : 2;

    return createJsonpResponse(callback, {
      success: true,
      visitorNumber: visitorCount,
      track: track
    });

  } catch (error) {
    return createJsonpResponse(callback, {
      success: false,
      error: String(error)
    });

  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

// ------------------------------------------
// JSONP RESPONSE HELPERS
// ------------------------------------------
function createJsonpResponse(callback, data) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return ContentService
    .createTextOutput(callback + "(" + json + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function createGiftBookResponse(callback, messages, error) {
  return createJsonpResponse(callback, {
    success: !error,
    messages: messages,
    error: error || null
  });
}



function testSheetConnection() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Spreadsheet: " + spreadsheet.getName());
  Logger.log("Spreadsheet URL: " + spreadsheet.getUrl());

  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet not found: "Shreif & monica"');
  }

  Logger.log("Sheet name: " + sheet.getName());
  Logger.log("Last row before writing: " + sheet.getLastRow());

  sheet.appendRow([
    new Date(),
    "TEST",
    "Test connection",
    1,
    "Test message from Apps Script"
  ]);

  SpreadsheetApp.flush();

  Logger.log("Last row after writing: " + sheet.getLastRow());
}
