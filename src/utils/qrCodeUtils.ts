import QRCode from "qrcode";

export const DR_BALOGAH_INFO = {
  fullName: "Dr BALOGAH Dibaataba",
  title: "Spécialiste des sciences de l'éducation et de la formation",
  role1: "Conseiller d'orientation scolaire et professionnelle",
  role2: "Conseiller en formation professionnalisation",
  cabinet: "OrientaAfrik et Certification",
  contacts: "+228 90 96 67 65 / +228 99 37 20 74",
  email: "contact@orientaafrik.org / dbalogah@yahoo.com",
  verificationHash: "BAL78Dib0102@Kof2021",
  website: "https://orientaafrik.org",
  address: "Lomé, Togo • Afrique de l'Ouest",
};

export interface BalogahQrOptions {
  docId?: string;
  studentName?: string;
  docType?: string;
  date?: string;
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Utility function to generate a QR code Data URL containing Dr BALOGAH's credentials
 * and document verification metadata for PDF footers.
 */
export async function generateBalogahQrCodeDataUrl(options: BalogahQrOptions = {}): Promise<string> {
  const docId = options.docId || "DOC-CERT-2026-BAL";
  const studentName = options.studentName || "Bénéficiaire OrientaAfrik";
  const docType = options.docType || "Document d'Orientation Officiel";
  const date = options.date || new Date().toISOString().split("T")[0];

  const payloadData = {
    issuer: DR_BALOGAH_INFO.fullName,
    credentials: `${DR_BALOGAH_INFO.title} • ${DR_BALOGAH_INFO.role2}`,
    cabinet: DR_BALOGAH_INFO.cabinet,
    hash: DR_BALOGAH_INFO.verificationHash,
    docId,
    beneficiary: studentName,
    documentType: docType,
    date,
    verifyUrl: `${DR_BALOGAH_INFO.website}/verify?cert=${DR_BALOGAH_INFO.verificationHash}&id=${docId}`,
  };

  const payloadString = JSON.stringify(payloadData);

  try {
    return await QRCode.toDataURL(payloadString, {
      width: options.width || 240,
      margin: options.margin !== undefined ? options.margin : 1,
      color: {
        dark: options.darkColor || "#0f172a", // slate-900
        light: options.lightColor || "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("Failed to generate QR Code Data URL:", err);
    // Fallback to QR server API if local canvas canvas/QR fails
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payloadString)}`;
  }
}

/**
 * Synchronous SVG string generator for fast inline rendering if needed
 */
export async function generateBalogahQrCodeSvg(options: BalogahQrOptions = {}): Promise<string> {
  const docId = options.docId || "DOC-CERT-2026-BAL";
  const studentName = options.studentName || "Bénéficiaire OrientaAfrik";
  const docType = options.docType || "Document d'Orientation Officiel";
  const date = options.date || new Date().toISOString().split("T")[0];

  const payloadString = JSON.stringify({
    issuer: DR_BALOGAH_INFO.fullName,
    hash: DR_BALOGAH_INFO.verificationHash,
    docId,
    beneficiary: studentName,
    documentType: docType,
    date,
  });

  try {
    return await QRCode.toString(payloadString, {
      type: "svg",
      width: options.width || 200,
      margin: options.margin !== undefined ? options.margin : 1,
    });
  } catch (err) {
    console.error("Failed to generate QR Code SVG:", err);
    return "";
  }
}
