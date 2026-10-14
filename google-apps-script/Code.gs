/**
 * Bend the Trend — website enquiries → Google Sheet + Google Drive + email
 *
 * Each time someone sends the "Start your design" form on the website, this script:
 *   1. adds a row to the "Enquiries" tab of this Google Sheet,
 *   2. saves their pictures into a Google Drive folder (one folder per enquiry),
 *   3. emails you the details with the pictures attached.
 *
 * SETUP — about 5 minutes, see the README section "Form → Google Sheet" for screenshots-free steps:
 *   1. Create a new Google Sheet (sheets.new) and name it e.g. "Bend the Trend enquiries".
 *   2. Extensions → Apps Script. Delete what's there, paste this whole file, click Save.
 *   3. Change SECRET below to any long random phrase. Put the SAME phrase in the website's
 *      ENQUIRY_SECRET setting.
 *   4. Click Deploy → New deployment → type "Web app".
 *        Execute as: Me      Who has access: Anyone
 *      Click Deploy, allow the permissions Google asks for, and copy the "Web app URL".
 *   5. Put that URL in the website's ENQUIRY_SCRIPT_URL setting.
 *
 * If you edit this script later, use Deploy → Manage deployments → Edit → Version: New version,
 * so the same URL keeps working.
 */

const SECRET = 'change-this-to-a-long-random-phrase'; // must match ENQUIRY_SECRET on the website
const NOTIFY_EMAIL = '';   // leave blank to email the Google account that owns this sheet
const FOLDER_NAME = 'Bend the Trend — enquiry pictures';
const SHEET_NAME = 'Enquiries';
const HEADERS = ['Received', 'Name', 'WhatsApp', 'Outfit', 'Occasion date', 'Budget (LKR)', 'Where', 'Their idea',
                 'Pictures', 'No. of pictures', 'Reply on WhatsApp', 'Status'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return json({ ok: false, error: 'unauthorised' });

    const when = new Date();
    const tz = Session.getScriptTimeZone();
    const sheet = getSheet();

    // Save pictures to Drive
    let folderUrl = '';
    const blobs = [];
    const images = (d.images || []).slice(0, 5);
    if (images.length) {
      const folder = getRootFolder().createFolder(
        Utilities.formatDate(when, tz, 'yyyy-MM-dd HH.mm') + ' — ' + clean(d.name, 60) + ' — ' + clean(d.outfit, 40));
      images.forEach(function (img, i) {
        const ext = (img.type || '').indexOf('png') > -1 ? 'png' : 'jpg';
        const blob = Utilities.newBlob(Utilities.base64Decode(img.data), img.type || 'image/jpeg', 'picture-' + (i + 1) + '.' + ext);
        folder.createFile(blob);
        blobs.push(blob);
      });
      folderUrl = folder.getUrl();
    }

    // Add the row
    sheet.appendRow([
      when, cell(d.name, 120), "'" + clean(d.whatsapp, 40), cell(d.outfit, 80), cell(d.date, 20), cell(d.budget, 40),
      cell(d.location, 40), cell(d.idea, 3000),
      folderUrl ? '=HYPERLINK("' + folderUrl + '","Open pictures")' : '—',
      images.length,
      /^https:\/\/wa\.me\/\d+/.test(d.replyLink || '') ? '=HYPERLINK("' + d.replyLink + '","Message ' + clean(d.name, 40).replace(/"/g, '') + '")' : '',
      'New',
    ]);

    // Email
    const rows = [
      ['Name', d.name], ['WhatsApp', d.whatsapp], ['Outfit', d.outfit], ['Occasion date', d.date || 'Not set'],
      ['Budget', d.budget || 'Not sure yet'], ['Where', d.location], ['Their idea', d.idea || '—'],
    ];
    const html =
      '<div style="font-family:Georgia,serif;color:#2A1420;max-width:560px">' +
      '<h2 style="font-weight:normal;margin:0 0 12px">New enquiry from ' + esc(d.name) + '</h2>' +
      '<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">' +
      rows.map(function (r) {
        return '<tr><td style="padding:8px 0;color:#6B5660;width:130px;vertical-align:top;border-bottom:1px solid #E6D3CE">' + r[0] +
               '</td><td style="padding:8px 0;border-bottom:1px solid #E6D3CE;white-space:pre-wrap">' + esc(r[1]) + '</td></tr>';
      }).join('') + '</table>' +
      '<p style="margin:20px 0 8px"><a href="' + d.replyLink + '" style="background:#1F7A4D;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif">Reply on WhatsApp</a></p>' +
      (folderUrl ? '<p style="font-family:Arial,sans-serif;font-size:14px">' + images.length + ' picture(s) attached · <a href="' + folderUrl + '">open the Drive folder</a></p>' : '') +
      '</div>';

    MailApp.sendEmail({
      to: NOTIFY_EMAIL || Session.getEffectiveUser().getEmail(),
      subject: 'New enquiry: ' + clean(d.outfit, 60) + ' — ' + clean(d.name, 60),
      htmlBody: html,
      attachments: blobs,
      name: 'Bend the Trend website',
    });

    return json({ ok: true, folderUrl: folderUrl });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Run this once from the editor (select "setup" → Run) to create the tab and test permissions. */
function setup() {
  getSheet();
  getRootFolder();
  Logger.log('Ready. Now Deploy → New deployment → Web app.');
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME, 0);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#2A1420').setFontColor('#F6EAE6');
    sh.setColumnWidth(8, 360);
    sh.getRange('A:A').setNumberFormat('d mmm yyyy, h:mm am/pm');
    const status = SpreadsheetApp.newDataValidation().requireValueInList(['New', 'Replied', 'Consultation booked', 'Quoted', 'In progress', 'Done', 'Not going ahead'], true).build();
    sh.getRange('L2:L').setDataValidation(status);
  }
  return sh;
}

function getRootFolder() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

/** Text for a cell — a leading = + - @ would otherwise be run as a formula */
function cell(v, max) { const t = clean(v, max); return /^[=+\-@]/.test(t) ? "'" + t : t; }
function clean(v, max) { return String(v == null ? '' : v).slice(0, max); }
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
