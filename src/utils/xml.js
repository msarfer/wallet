const serializer = new XMLSerializer()

export function createXMLDocument (data, { namespace, qualifiedName, doctype }) {
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

export function xmlToString (xml) {
  return serializer.serializeToString(xml)
}