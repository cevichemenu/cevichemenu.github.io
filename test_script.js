function doGet(e) {
  return ContentService
    .createTextOutput("Script funcionando correctamente")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  return ContentService
    .createTextOutput("POST funcionando correctamente")
    .setMimeType(ContentService.MimeType.TEXT);
}