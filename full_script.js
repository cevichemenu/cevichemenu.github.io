function doGet(e) {
  try {
    const email = e.parameter.email;

    if (!email) {
      return ContentService
        .createTextOutput(JSON.stringify({error: "Email requerido"}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja1");
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email) { // Columna B es email
        return ContentService
          .createTextOutput(JSON.stringify({
            nombre: data[i][0],
            email: data[i][1],
            telefono: data[i][2],
            puntos: data[i][3] || 0
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({error: "Usuario no encontrado"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: "Error interno: " + error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.accion === "registrar") {
      return registrarUsuario(data.nombre, data.email, data.telefono);
    } else if (data.accion === "sumar") {
      return sumarPuntos(data.email, data.puntos);
    } else if (data.accion === "listar") {
      return ContentService
        .createTextOutput(JSON.stringify({usuarios: obtenerTodosLosUsuarios()}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({error: "Acción no reconocida"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: "Error en POST: " + error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function registrarUsuario(nombre, email, telefono) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja1");

  // Verificar si el email ya existe
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) { // Columna B (índice 1) es email
      return ContentService
        .createTextOutput(JSON.stringify({error: "Email ya registrado"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Agregar nuevo usuario con 50 puntos iniciales
  sheet.appendRow([nombre, email, telefono, 50]);

  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function sumarPuntos(email, puntos) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja1");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) { // Columna B es email
      const puntosActuales = data[i][3] || 0;
      const nuevosPuntos = puntosActuales + parseInt(puntos);
      sheet.getRange(i + 1, 4).setValue(nuevosPuntos); // Columna D es puntos

      return ContentService
        .createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({error: "Usuario no encontrado"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function obtenerTodosLosUsuarios() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja1");
  const data = sheet.getDataRange().getValues();

  const usuarios = [];
  for (let i = 1; i < data.length; i++) { // Empezar desde 1 para saltar headers
    if (data[i][0]) { // Si hay nombre
      usuarios.push({
        nombre: data[i][0],
        email: data[i][1],
        telefono: data[i][2],
        puntos: data[i][3] || 0
      });
    }
  }
  return usuarios;
}