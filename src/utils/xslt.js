const parser = new DOMParser()
const xsltProcessor = new XSLTProcessor()

export function transform (xml, stylesheet) {
  const xslStylesheet = parser.parseFromString(stylesheet, "application/xml");
  xsltProcessor.importStylesheet(xslStylesheet);

  return xsltProcessor.transformToFragment(xml, document);
}


export const formatStylesheetString = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>`

export function formatXML (xml) {
  return transform(xml, formatStylesheetString)
}