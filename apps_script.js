// Código de Google Apps Script para manejar registro y consulta de clientes
// Este código va en un proyecto de Google Apps Script vinculado a una hoja de Google Sheets

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const accion = data.accion;
    
    if (accion === "registrar") {
      return registrarCliente(data);
    } else if (accion === "consultar") {
      return consultarCliente(data);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, message: "Acción no válida"}))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function registrarCliente(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clientes"); // Cambia "Clientes" por el nombre de tu hoja
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: "Hoja no encontrada"}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  const nombre = data.nombre;
  const email = data.email ? data.email.toLowerCase() : '';
  const telefono = data.telefono;
  
  // Verificar si ya existe
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const sheetEmail = values[i][1] ? values[i][1].toString().toLowerCase() : '';
    const sheetTelefono = values[i][0] ? values[i][0].toString() : '';
    if (sheetEmail === email || sheetTelefono === telefono) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, message: "Usuario ya registrado"}))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }
  }
  
  // Agregar nuevo cliente con 50 puntos iniciales
  sheet.appendRow([telefono, email, nombre, 50]); // Columnas: Telefono, Correo, Nombre, Puntos
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, message: "Registro exitoso"}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}

function consultarCliente(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clientes");
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: "Hoja no encontrada"}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  const email = data.email ? data.email.toLowerCase() : null;
  const telefono = data.telefono;
  
  const values = sheet.getDataRange().getValues();
  let cliente = null;
  for (let i = 1; i < values.length; i++) {
    const sheetEmail = values[i][1] ? values[i][1].toString().toLowerCase() : '';
    const sheetTelefono = values[i][0] ? values[i][0].toString() : '';
    if ((email && sheetEmail === email) || (telefono && sheetTelefono === telefono)) {
      cliente = {
        nombre: values[i][2],
        email: values[i][1],
        telefono: values[i][0],
        puntos: values[i][3]
      };
      break;
    }
  }
  
  if (!cliente) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: "Cliente no encontrado"}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, cliente: cliente}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}

// Para probar, puedes usar doGet para GET requests si necesitas
function doGet(e) {
  return ContentService
    .createTextOutput("Método GET no implementado")
    .setMimeType(ContentService.MimeType.TEXT);
}