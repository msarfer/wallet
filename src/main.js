const parser = new DOMParser()
const xsltProcessor = new XSLTProcessor()
const serializer = new XMLSerializer()

const state = {
  xml: null,
  result: null
} 
const outXML = document.getElementById('outXML')
const outXSLT = document.getElementById('outXSLT')
const codeXML = document.getElementById('codeXML')
const codeXSLT = document.getElementById('codeXSLT')
const inputs = document.querySelectorAll('input')
const xmlButton = document.getElementById('xml')
const xsltButton = document.getElementById('xsltBtn')
const convertButton = document.getElementById('convert')

inputs.forEach(input => input.addEventListener('change', () => {
  state.xml = null
  state.result = null
  codeXML.style.opacity = 0
  codeXSLT.style.opacity = 0
  outXML.style.display = 'none'
  const { present } = allFiles()
  convertButton.disabled = !present
  actionButtons(true)
}));

function transform (xml, stylesheet) {
  const xslStylesheet = parser.parseFromString(stylesheet, "application/xml");
  xsltProcessor.importStylesheet(xslStylesheet);

  return xsltProcessor.transformToFragment(xml, document);
}

function createXMLDocument (data, { namespace, qualifiedName, doctype }) {
  const impl = document.implementation.createDocument(namespace, qualifiedName, doctype)
  const jsonToXml = (parent, obj) => {
    for (const key in obj) {
      if (Object.hasOwn(obj,key)) {
        const value = obj[key]
        if (typeof value === 'object' && value !== null) {
          const element = impl.createElement(key)
          jsonToXml(element, value)
          parent.appendChild(element)
        } else {
          const element = impl.createElement(key)
          element.appendChild(impl.createTextNode(String(value)))
          parent.appendChild(element)
        }
      }
    }
  }

  jsonToXml(impl.documentElement, data)
  return impl
}

function xmlToString (xml) {
  return serializer.serializeToString(xml)
}


document.getElementById('convert').addEventListener('click', convert);

async function convert () {
  const { present, files } = allFiles()

  if (!present) {
      alert('Debes seleccionar todos los archivos.');
      return;
  }
  
  try {
      const { claseFile, objetoFile, xsltFile } = files

      const clase = await readFileAsJSON(claseFile);
      const objeto = await readFileAsJSON(objetoFile);
      const xslt = await readFileAsText(xsltFile);
      
      const data = { ...clase, ...objeto };
      state.xml = createXMLDocument(data, { qualifiedName: 'boardingpass'});
      state.result = transform(state.xml, xslt);

      outXML.textContent = xmlToString(state.xml)
      outXSLT.textContent = xmlToString(state.result)
      outXML.style.display = 'block'
      codeXML.style.opacity = 1
      codeXSLT.style.opacity = 1

      actionButtons(false)

      xmlButton.addEventListener('click', () => handleFile('boardingpass.xml', state.xml) )
      xsltButton.addEventListener('click', () => handleFile('boardingpass.xml', state.result))
  } catch (error) {
      alert('Error: ' + error.message);
  }
}

function readFileAsJSON(file) {
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

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsText(file);
  });
}


function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleFile(name, data) {
  downloadFile(name, xmlToString(data), 'application/xml')
}

function actionButtons(action) {
  xmlButton.disabled = action;
  xsltButton.disabled = action;
}

const allFiles = () => {
  const claseFile = document.getElementById('clase').files[0];
  const objetoFile = document.getElementById('objeto').files[0];
  const xsltFile = document.getElementById('xslt').files[0];

  return {
    present: claseFile && objetoFile && xsltFile,
    files: {
      claseFile,
      objetoFile,
      xsltFile
    }
  }
} 
