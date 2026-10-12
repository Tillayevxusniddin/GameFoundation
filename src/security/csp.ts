// docs/07_CODE_EXECUTION_SECURITY.md — qat'iy CSP meta tegi.
// Eval/Fetch/XHR/WebSocket/Worker/tashqi resurslar CSP darajasida ham bloklanadi;
// `</script>` escape o'quvchi kodi ichra yopilgan teg sabotajini oldini oladi.

export const CONTENT_SECURITY_POLICY =
  "default-src 'none'; " +
  "style-src 'unsafe-inline'; " +
  "script-src 'unsafe-inline'; " +
  "img-src data:; " +
  "font-src data:; " +
  "connect-src 'none';";

export const CSP_META_ATTRIBUTE = "http-equiv";
export const CSP_META_NAME = "Content-Security-Policy";

export function buildCspMetaTag(): string {
  return `<meta ${CSP_META_ATTRIBUTE}="${CSP_META_NAME}" content="${CONTENT_SECURITY_POLICY}">`;
}

// HTML parser script tugaganini `</script` (katta-kichik harf farqi bilan)
// hamda `<!--` orqali "script data escaped" holatini ko'radi. Ikkalasi ham
// JS uchun xavfsiz ekvivalentga almashtiriladi (`<\/` va `<\!--`).
export function escapeScriptContent(code: string): string {
  return (
    code
      // Barcha `</script` segmentini buz. `\/` JS string/regular ifodada `/` ga teng.
      .replace(/<\/script/gi, "<\\/script")
      // Script ichida `<!--` ni xavfsiz shaklga o'giramiz.
      .replace(/<!--/g, "<\\!--")
  );
}

// Test uchun: kodda yopilgan script/comment segmenti qolgan-qolmaganini aytsin.
export function containsDangerousScriptClose(code: string): boolean {
  const withoutEscaped = code.replace(/<\\\/script/gi, "");
  return /<\/script/gi.test(withoutEscaped) || /<!--/.test(code);
}