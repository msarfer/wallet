export const outXML = document.getElementById('outXML')
export const outXSLT = document.getElementById('outXSLT')
export const codeXML = document.getElementById('codeXML')
export const codeXSLT = document.getElementById('codeXSLT')
export const inputs = document.querySelectorAll('input')
export const xmlButton = document.getElementById('xml')
export const xsltButton = document.getElementById('xsltBtn')
export const convertButton = document.getElementById('convert')

export const formatStylesheetString = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>`