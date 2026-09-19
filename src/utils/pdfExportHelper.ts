import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Converts any modern unsupported CSS color functions (oklch, oklab, color, light-dark)
 * into standard rgb(...) or hex format using the browser's native canvas renderer.
 * html2canvas 1.4.1 does not support oklch() / oklab() color functions directly and throws errors.
 */
let cachedColorCanvas: HTMLCanvasElement | null = null;
let cachedColorCtx: CanvasRenderingContext2D | null = null;

function getColorContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!cachedColorCanvas) {
    cachedColorCanvas = document.createElement("canvas");
    cachedColorCanvas.width = 1;
    cachedColorCanvas.height = 1;
    cachedColorCtx = cachedColorCanvas.getContext("2d");
  }
  return cachedColorCtx;
}

export function fixModernColorsInString(str: string): string {
  if (!str || typeof str !== "string") return str;
  if (!/(oklch|oklab|color|light-dark)/i.test(str)) return str;

  let current = str;
  let maxPasses = 5;
  const ctx = getColorContext();

  while (maxPasses > 0 && /(oklch|oklab|color|light-dark)/i.test(current)) {
    maxPasses--;
    const next = current.replace(/(oklch|oklab|color|light-dark)\([^()]*\)/gi, (match) => {
      try {
        if (ctx) {
          ctx.fillStyle = match;
          const res = ctx.fillStyle;
          if (res && !/(oklch|oklab|color|light-dark)/i.test(res)) {
            return res;
          }
        }
      } catch (e) {
        // fallback
      }
      return "rgb(15, 23, 42)"; // Fallback safe color
    });
    if (next === current) break;
    current = next;
  }
  return current;
}

// Keep backward compatibility export
export const fixOklchInString = fixModernColorsInString;

// 1x1 transparent PNG fallback data URL
const TRANSPARENT_1X1_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA";

/**
 * Sanitizes a cloned document before html2canvas processes it.
 * Replaces oklch/oklab color function definitions in <style> tags, CSS rules, and element styles,
 * and fixes zero-size canvases/images that cause `createPattern` exceptions.
 */
export function sanitizeDocForHtml2Canvas(clonedDoc: Document) {
  // 1. Rewrite <style> tags in the cloned document
  const styleTags = clonedDoc.querySelectorAll("style");
  styleTags.forEach((style) => {
    if (style.textContent && /(oklch|oklab|color|light-dark)/i.test(style.textContent)) {
      style.textContent = fixModernColorsInString(style.textContent);
    }
  });

  // 2. Rewrite stylesheet rules in clonedDoc if accessible
  try {
    Array.from(clonedDoc.styleSheets).forEach((sheet) => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) return;
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i] as CSSStyleRule;
          if (rule.style && rule.style.cssText && /(oklch|oklab|color|light-dark)/i.test(rule.style.cssText)) {
            rule.style.cssText = fixModernColorsInString(rule.style.cssText);
          }
        }
      } catch (e) {
        // Cross-origin or restricted stylesheet rule access
      }
    });
  } catch (e) {
    // Ignore stylesheet iteration errors
  }

  // 3. Ensure all <canvas> elements in the cloned document have non-zero dimensions
  const allCanvases = clonedDoc.querySelectorAll<HTMLCanvasElement>("canvas");
  allCanvases.forEach((c) => {
    if (!c.width || c.width <= 0) c.width = 1;
    if (!c.height || c.height <= 0) c.height = 1;
  });

  // 4. Ensure all <img> tags have valid src and handle missing/zero-sized images
  const allImages = clonedDoc.querySelectorAll<HTMLImageElement>("img");
  allImages.forEach((img) => {
    if (!img.src || img.src.trim() === "" || img.naturalWidth === 0) {
      if (!img.src || img.src.trim() === "") {
        img.src = TRANSPARENT_1X1_PNG;
      }
    }
    // Prevent CORS taint on external images
    img.crossOrigin = "anonymous";
  });

  // 5. Iterate all elements and fix inline styles, computed colors, visibility, transforms and text contrast
  const allElements = clonedDoc.querySelectorAll<HTMLElement>("*");
  allElements.forEach((el) => {
    // Ensure element is visible unless it is explicitly a print-hidden element
    if (el.classList.contains("print-hidden-element") || el.classList.contains("print:hidden")) {
      el.style.display = "none";
      el.style.backgroundImage = "none";
      return;
    }

    el.style.visibility = "visible";
    el.style.opacity = "1";
    if (el.style.filter) {
      el.style.filter = "none";
    }

    if (el.style && el.style.cssText && /(oklch|oklab|color|light-dark)/i.test(el.style.cssText)) {
      el.style.cssText = fixModernColorsInString(el.style.cssText);
    }

    // If an element is hidden or has 0 width/height, clear background images to prevent createPattern errors
    if (el.offsetWidth === 0 && el.offsetHeight === 0) {
      el.style.backgroundImage = "none";
    }

    try {
      const computed = window.getComputedStyle(el);
      const propertiesToFix = [
        "color",
        "backgroundColor",
        "borderColor",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "outlineColor",
        "fill",
        "stroke",
        "boxShadow",
      ];

      propertiesToFix.forEach((prop) => {
        const val = (computed as any)[prop];
        if (val && typeof val === "string" && /(oklch|oklab|color|light-dark)/i.test(val)) {
          (el.style as any)[prop] = fixModernColorsInString(val);
        }
      });

      // Ensure text elements have explicit colors resolved
      if (el.tagName && ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "TD", "TH", "LI", "A", "STRONG", "B", "LABEL"].includes(el.tagName)) {
        const computedColor = computed.color;
        if (computedColor) {
          if (computedColor.includes("oklch") || computedColor.includes("oklab")) {
            el.style.color = fixModernColorsInString(computedColor);
          } else if (computedColor === "rgba(0, 0, 0, 0)" || computedColor === "transparent") {
            el.style.color = "#0f172a";
          }
        }
      }
    } catch (e) {
      // Ignore computed style errors
    }
  });
}

/**
 * Creates a safe execution context with monkey-patched CanvasRenderingContext2D methods
 * to completely eliminate "Failed to execute 'createPattern' on 'CanvasRenderingContext2D': The image argument is a canvas element with a width or height of 0"
 * and drawImage zero-dimension failures.
 */
async function withCanvasPatternProtection<T>(action: () => Promise<T>): Promise<T> {
  if (typeof window === "undefined" || typeof CanvasRenderingContext2D === "undefined") {
    return action();
  }

  const originalCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
  const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

  // Fallback 1x1 canvas for pattern creation
  const dummyCanvas = document.createElement("canvas");
  dummyCanvas.width = 1;
  dummyCanvas.height = 1;
  const dummyCtx = dummyCanvas.getContext("2d");
  if (dummyCtx) {
    dummyCtx.fillStyle = "rgba(0, 0, 0, 0)";
    dummyCtx.fillRect(0, 0, 1, 1);
  }

  try {
    CanvasRenderingContext2D.prototype.createPattern = function (
      image: CanvasImageSource,
      repetition: string | null
    ) {
      try {
        if (!image) {
          return originalCreatePattern.call(this, dummyCanvas, repetition || "repeat");
        }

        // Check if the image source has zero width or height
        const w = (image as any).naturalWidth ?? (image as any).videoWidth ?? (image as any).width;
        const h = (image as any).naturalHeight ?? (image as any).videoHeight ?? (image as any).height;

        if (w === 0 || h === 0) {
          return originalCreatePattern.call(this, dummyCanvas, repetition || "repeat");
        }

        return originalCreatePattern.call(this, image, repetition || "repeat");
      } catch (err) {
        try {
          return originalCreatePattern.call(this, dummyCanvas, repetition || "repeat");
        } catch (innerErr) {
          return null as any;
        }
      }
    };

    CanvasRenderingContext2D.prototype.drawImage = function (...args: any[]) {
      try {
        const image = args[0];
        if (image) {
          const w = (image as any).naturalWidth ?? (image as any).videoWidth ?? (image as any).width;
          const h = (image as any).naturalHeight ?? (image as any).videoHeight ?? (image as any).height;
          if (w === 0 || h === 0) {
            return; // Silently skip drawing 0x0 images/canvases
          }
        }
        return (originalDrawImage as any).apply(this, args);
      } catch (err) {
        // Silently catch zero-dimension or invalid state errors
      }
    };

    return await action();
  } finally {
    CanvasRenderingContext2D.prototype.createPattern = originalCreatePattern;
    CanvasRenderingContext2D.prototype.drawImage = originalDrawImage;
  }
}

export interface PdfExportOptions {
  twoPagesPerSheet?: boolean;
  scale?: number;
}

/**
 * Helper to export any DOM element to a downloadable multi-page PDF document.
 * Automatically detects `.official-report-page` or `.print-sheet-2up` elements for pixel-perfect per-page A4 PDF rendering.
 * Supports both standard 1-page-per-sheet (portrait) and 2-pages-per-sheet (landscape 2-up).
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  options?: PdfExportOptions
) {
  if (!element) return;

  const is2Up = !!options?.twoPagesPerSheet || !!element.querySelector(".print-sheet-2up");

  return withCanvasPatternProtection(async () => {
    // Check if paired 2-up sheets are present
    const sheet2UpElements = Array.from(element.querySelectorAll<HTMLElement>(".print-sheet-2up"));
    if (sheet2UpElements.length > 0) {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

      for (let i = 0; i < sheet2UpElements.length; i++) {
        const sheetEl = sheet2UpElements[i];
        if (i > 0) {
          pdf.addPage();
        }

        const sheetCanvas = await html2canvas(sheetEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: Math.max(sheetEl.scrollWidth || 1200, 1200),
          onclone: (clonedDoc: Document, clonedSheet: HTMLElement) => {
            sanitizeDocForHtml2Canvas(clonedDoc);
            if (clonedSheet) {
              clonedSheet.style.transform = "none";
              clonedSheet.style.visibility = "visible";
              clonedSheet.style.display = "flex";
              clonedSheet.style.flexDirection = "row";
              clonedSheet.style.opacity = "1";
              clonedSheet.style.boxShadow = "none";
              clonedSheet.style.margin = "0";
              clonedSheet.style.maxHeight = "none";
              clonedSheet.style.overflow = "visible";
            }
          },
        });

        const imgData = sheetCanvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }

      pdf.save(filename);
      return;
    }

    const pageElements = Array.from(element.querySelectorAll<HTMLElement>(".official-report-page"));

    // If 2-up is requested with individual page elements
    if (pageElements.length > 0 && is2Up) {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm
      const halfWidth = 142; // mm per page half
      const pageMarginY = 4;
      const pageHeightMm = 202;

      for (let i = 0; i < pageElements.length; i += 2) {
        if (i > 0) {
          pdf.addPage();
        }

        // Render left page
        const leftPageEl = pageElements[i];
        const leftCanvas = await html2canvas(leftPageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: Math.max(leftPageEl.scrollWidth || 800, 800),
          onclone: (clonedDoc: Document, clonedPage: HTMLElement) => {
            sanitizeDocForHtml2Canvas(clonedDoc);
            if (clonedPage) {
              clonedPage.style.transform = "none";
              clonedPage.style.visibility = "visible";
              clonedPage.style.display = "flex";
              clonedPage.style.opacity = "1";
              clonedPage.style.boxShadow = "none";
              clonedPage.style.margin = "0";
            }
          },
        });

        const leftImgData = leftCanvas.toDataURL("image/png");
        pdf.addImage(leftImgData, "PNG", 4, pageMarginY, halfWidth, pageHeightMm, undefined, "FAST");

        // Optional central divider line
        pdf.setDrawColor(209, 213, 219);
        pdf.setLineWidth(0.3);
        pdf.line(148.5, 4, 148.5, 206);

        // Render right page if it exists
        if (i + 1 < pageElements.length) {
          const rightPageEl = pageElements[i + 1];
          const rightCanvas = await html2canvas(rightPageEl, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: Math.max(rightPageEl.scrollWidth || 800, 800),
            onclone: (clonedDoc: Document, clonedPage: HTMLElement) => {
              sanitizeDocForHtml2Canvas(clonedDoc);
              if (clonedPage) {
                clonedPage.style.transform = "none";
                clonedPage.style.visibility = "visible";
                clonedPage.style.display = "flex";
                clonedPage.style.opacity = "1";
                clonedPage.style.boxShadow = "none";
                clonedPage.style.margin = "0";
              }
            },
          });

          const rightImgData = rightCanvas.toDataURL("image/png");
          pdf.addImage(rightImgData, "PNG", 151, pageMarginY, halfWidth, pageHeightMm, undefined, "FAST");
        }
      }

      pdf.save(filename);
      return;
    }

    // Standard 1-page-per-sheet (portrait)
    if (pageElements.length > 0) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        if (i > 0) {
          pdf.addPage();
        }

        const pageCanvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: Math.max(pageEl.scrollWidth || 800, 800),
          onclone: (clonedDoc: Document, clonedPage: HTMLElement) => {
            sanitizeDocForHtml2Canvas(clonedDoc);
            if (clonedPage) {
              clonedPage.style.transform = "none";
              clonedPage.style.visibility = "visible";
              clonedPage.style.display = "flex";
              clonedPage.style.opacity = "1";
              clonedPage.style.boxShadow = "none";
              clonedPage.style.margin = "0";
              clonedPage.style.maxHeight = "none";
              clonedPage.style.overflow = "visible";
            }
          },
        });

        const imgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }

      pdf.save(filename);
      return;
    }

    // Standard fallback for single containers or continuous components
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: Math.max(element.scrollWidth || 1024, 1024),
      onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
        sanitizeDocForHtml2Canvas(clonedDoc);

        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.visibility = "visible";
          clonedElement.style.display = "block";
          clonedElement.style.opacity = "1";
          clonedElement.style.maxHeight = "none";
          clonedElement.style.overflow = "visible";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  });
}

