<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes" />

  <xsl:template match="*">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@*">
    <xsl:copy />
  </xsl:template>

  <xsl:template match="*">
    <xsl:choose>
      <!-- Si no tiene hijos, convertir en atributo solo si no tiene ya atributos -->
      <xsl:when test="not(*) and not(@*)">
        <xsl:attribute name="{name()}">
          <xsl:value-of select="." />
        </xsl:attribute>
      </xsl:when>
      <!-- Si tiene hijos o atributos, copiar el elemento y procesar normalmente -->
      <xsl:otherwise>
        <xsl:element name="{name()}">
          <!-- Copiar atributos existentes -->
                    <xsl:apply-templates select="@*" />
          <!-- Convertir hijos sin hijos en atributos -->
                    <xsl:for-each
            select="*[not(*)]">
            <xsl:attribute name="{name()}">
              <xsl:value-of select="." />
            </xsl:attribute>
          </xsl:for-each>
          <!-- Procesar hijos con más estructura -->
                    <xsl:apply-templates
            select="*[*]" />
        </xsl:element>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>