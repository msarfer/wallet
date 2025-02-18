import { downloadFile, readFileAsJSON, readFileAsText } from "./utils/files";
import { codeXML, codeXSLT, convertButton, details, inputs, outXML, outXSLT, xmlButton, xsltButton } from "./utils/variables";
import { createXMLDocument, xmlToString } from "./utils/xml";
import { formatXML, transform } from "./utils/xslt";

const state = {
  xml: null,
  result: null
} 

inputs.forEach(input => input.addEventListener('change', () => {
  state.xml = null
  state.result = null
  codeXML.style.opacity = 0
  codeXSLT.style.opacity = 0
  outXML.style.display = 'none'
  outXSLT.style.display = 'none'
  const { present } = allFiles()
  convertButton.disabled = !present
  actionButtons(true)
}));


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
      state.xml = formatXML(state.xml)
      state.result = transform(state.xml, xslt);

      outXML.textContent = xmlToString(state.xml)
      outXSLT.textContent = xmlToString(state.result)
      outXML.style.display = 'block'
      outXSLT.style.display = 'block'
      codeXML.style.opacity = 1
      codeXSLT.style.opacity = 1

      actionButtons(false)
      details.forEach(detail => detail.setAttribute('open', true))

      xmlButton.addEventListener('click', () => handleFile('boardingpass.xml', state.xml) )
      xsltButton.addEventListener('click', () => handleFile('boardingpass.xml', state.result))
  } catch (error) {
      alert('Error: ' + error.message);
  }
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