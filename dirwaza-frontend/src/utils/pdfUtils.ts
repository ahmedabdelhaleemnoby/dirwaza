import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

export interface PDFGenerationOptions {
  ref: React.RefObject<HTMLDivElement | null>;
  filename?: string;
  onStart?: () => void;
  onSuccess?: (filename: string) => void;
  onError?: (error: Error) => void;
  margin?: number;
  scale?: number;
  quality?: number;
}

/**
 * Generates and downloads a PDF from a React component ref
 * @param options - Configuration options for PDF generation
 */
export const generatePDF = async (options: PDFGenerationOptions): Promise<void> => {
  const {
    ref,
    filename = `document-${new Date().toISOString().slice(0, 10)}.pdf`,
    onStart,
    onSuccess,
    onError,
    margin = 40,
    scale = 1.5,
    quality = 0.95,
  } = options;

  if (!ref.current) {
    const error = new Error("Reference element not found");
    onError?.(error);
    return;
  }

  let pdfStyleOverride: HTMLStyleElement | null = null;
  let originalClassName = "";

  try {
    onStart?.();
    console.log("Starting PDF generation...");

    // Store original className
    originalClassName = ref.current.className;

    // Create comprehensive style override for PDF compatibility
    pdfStyleOverride = document.createElement("style");
    pdfStyleOverride.id = "pdf-style-override";
    pdfStyleOverride.textContent = `
      .pdf-compatible,
      .pdf-compatible * {
        color: #113218 !important;
        background-color: #ffffff !important;
        border-color: #ddd !important;
        --color-primary: #113218 !important;
        --color-primary-light: #F3F2EB !important;
        --color-primary-dark: #0F2A16 !important;
        --color-secondary: #FFBE00 !important;
        --color-secondary-light: #D4E076 !important;
        --color-secondary-dark: #F23607 !important;
        --color-accent: #C5E0F7 !important;
        --color-accent-dark: #847EB9 !important;
        --color-neutral: #F3F2EB !important;
        --color-neutral-light: #FDFDFC !important;
        --color-neutral-dark: #DFDAC4 !important;
        --color-brand-green: #113218 !important;
        --color-brand-beige: #F3F2EB !important;
        --color-brand-red: #F23607 !important;
        --color-brand-yellow: #FFBE00 !important;
        --color-brand-light-green: #D4E076 !important;
        --color-brand-light-blue: #C5E0F7 !important;
        --color-brand-purple: #847EB9 !important;
        --color-brand-beige-dark: #DFDAC4 !important;
      }
      .pdf-compatible .bg-neutral { 
        background-color: #F3F2EB !important; 
      }
      .pdf-compatible .bg-white { 
        background-color: #ffffff !important; 
      }
      .pdf-compatible .text-primary { 
        color: #113218 !important; 
      }
      .pdf-compatible .text-accent-dark { 
        color: #847EB9 !important; 
      }
      .pdf-compatible .text-gray-600 { 
        color: #666666 !important; 
      }
      .pdf-compatible .shadow-sm { 
        box-shadow: none !important; 
      }
      .pdf-compatible .rounded-xl { 
        border-radius: 12px !important; 
      }
      .pdf-compatible h1, 
      .pdf-compatible h2, 
      .pdf-compatible h3, 
      .pdf-compatible h4, 
      .pdf-compatible h5, 
      .pdf-compatible h6 {
        color: #113218 !important;
        font-weight: bold !important;
      }
      .pdf-compatible p, 
      .pdf-compatible span, 
      .pdf-compatible div {
        color: #113218 !important;
      }
    `;

    document.head.appendChild(pdfStyleOverride);

    // Add PDF-compatible class
    ref.current.className = `${originalClassName} pdf-compatible`;

    // Wait for styles to be applied
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Creating canvas...");

    // Create canvas with optimized settings
    const canvas = await html2canvas(ref.current, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
      // onclone: (clonedDoc) => {
      //   // // Ensure cloned document has our styles
      //   // const clonedElement = clonedDoc.querySelector(
      //   //   ".pdf-compatible"
      //   // ) as HTMLElement;
      //   // if (clonedElement) {
      //   //   clonedElement.style.backgroundColor = "#ffffff";
      //   //   clonedElement.style.color = "#113218";
      //   // }
      // },
    });

    console.log("Canvas created, generating PDF...");

    // Create PDF with better sizing
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const availableWidth = pdfWidth - margin * 2;

    const canvasAspectRatio = canvas.height / canvas.width;
    const imgWidth = availableWidth;
    const imgHeight = availableWidth * canvasAspectRatio;

    // Check if content fits on one page
    if (imgHeight <= pdfHeight - margin * 2) {
      // Single page
      pdf.addImage(
        canvas.toDataURL("image/png", quality),
        "PNG",
        margin,
        margin,
        imgWidth,
        imgHeight
      );
    } else {
      // Multiple pages
      const pageCount = Math.ceil(imgHeight / (pdfHeight - margin * 2));
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();

        const yOffset = -(pdfHeight - margin * 2) * i;
        pdf.addImage(
          canvas.toDataURL("image/png", quality),
          "PNG",
          margin,
          margin + yOffset,
          imgWidth,
          imgHeight
        );
      }
    }

    // Download the PDF
    pdf.save(filename);

    console.log("PDF downloaded successfully");
    onSuccess?.(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    const errorObj = error instanceof Error ? error : new Error("Unknown error occurred");
    onError?.(errorObj);
  } finally {
    // Cleanup - restore original state
    try {
      if (ref.current && originalClassName !== undefined) {
        ref.current.className = originalClassName;
      }

      if (pdfStyleOverride && document.head.contains(pdfStyleOverride)) {
        document.head.removeChild(pdfStyleOverride);
      }
    } catch (cleanupError) {
      console.warn("Cleanup error:", cleanupError);
    }
  }
};

/**
 * Generates a receipt PDF with predefined settings
 * @param ref - React ref to the component to convert to PDF
 * @param orderNumber - Order number for filename
 * @param onStart - Callback when PDF generation starts
 * @param onSuccess - Callback when PDF generation succeeds
 * @param onError - Callback when PDF generation fails
 */
export const generateReceiptPDF = async (
  ref: React.RefObject<HTMLDivElement | null>,
  orderNumber: string = "receipt",
  onStart?: () => void,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  const filename = `dirwaza-receipt-${orderNumber}-${new Date().toISOString().slice(0, 10)}.pdf`;
  
  await generatePDF({
    ref,
    filename,
    onStart,
    onSuccess: () => {
      toast.success("تم تحميل الإيصال بنجاح");
      onSuccess?.();
    },
    onError: (error) => {
      let errorMessage = "فشل في تحميل الإيصال";
      if (error.message.includes("canvas")) {
        errorMessage = "خطأ في إنشاء الصورة";
      } else if (error.message.includes("pdf")) {
        errorMessage = "خطأ في إنشاء ملف PDF";
      }
      
      toast.error(errorMessage);
      onError?.(error);
    },
  });
};

export default {
  generatePDF,
  generateReceiptPDF,
};