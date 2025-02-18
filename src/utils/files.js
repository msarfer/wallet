export function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
          try {
              resolve(JSON.parse(reader.result));
          } catch {
              reject(new Error('El archivo JSON no es válido.'));
          }
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsText(file);
  });
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsText(file);
  });
}


export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}