function doGet(e) {
  try {
    const email = e.parameter.email;

    if (!email) {
      return ContentService
        .createTextOutput('{"error": "Email requerido"}')
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Respuesta de prueba
    return ContentService
      .createTextOutput('{"nombre": "Usuario de Prueba", "email": "' + email + '", "puntos": 100}')
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput('{"error": "Error interno: ' + error.message + '"}')
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    return ContentService
      .createTextOutput('{"success": true, "message": "POST funcionando"}')
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput('{"error": "Error en POST: ' + error.message + '"}')
      .setMimeType(ContentService.MimeType.JSON);
  }
}