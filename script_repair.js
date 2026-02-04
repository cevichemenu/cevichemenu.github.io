function doGet(e) {
  try {
    const email = e.parameter.email;

    if (!email) {
      return ContentService
        .createTextOutput(JSON.stringify({error: "Email requerido"}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        nombre: "Usuario de Prueba",
        email: email,
        puntos: 50
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: "Error interno: " + error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: "POST funcionando"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: "Error en POST: " + error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}