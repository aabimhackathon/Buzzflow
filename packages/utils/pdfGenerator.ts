import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // 1. Sanitize all <style> tags to remove unsupported color functions (oklab, oklch, color, light-dark)
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((styleTag) => {
          let cssText = styleTag.innerHTML;
          if (cssText) {
            // Replace oklab(...), oklch(...), color(...) and light-dark(...) with safe color fallbacks
            cssText = cssText.replace(/(?:oklab|oklch|color|light-dark)\((?:[^()]+|\([^()]*\))*\)/gi, 'rgba(0, 0, 0, 0.1)');
            styleTag.innerHTML = cssText;
          }
        });

        // 2. Sanitize any inline style attributes on elements in clonedDoc
        const allClonedNodes = clonedDoc.querySelectorAll('*');
        allClonedNodes.forEach((node) => {
          const htmlEl = node as HTMLElement;
          const styleAttr = htmlEl.getAttribute('style');
          if (styleAttr) {
            const cleaned = styleAttr.replace(/(?:oklab|oklch|color|light-dark)\((?:[^()]+|\([^()]*\))*\)/gi, 'rgba(0, 0, 0, 0.1)');
            htmlEl.setAttribute('style', cleaned);
          }
        });

        // 3. Map computed RGB colors from original elements onto cloned elements for accurate rendering
        const clonedTarget = clonedDoc.getElementById(elementId);
        if (clonedTarget) {
          const origNodes = [element, ...Array.from(element.querySelectorAll('*'))];
          const clonedNodes = [clonedTarget, ...Array.from(clonedTarget.querySelectorAll('*'))];

          for (let i = 0; i < origNodes.length; i++) {
            const orig = origNodes[i] as HTMLElement;
            const cloned = clonedNodes[i] as HTMLElement;
            if (orig && cloned) {
              try {
                const computed = window.getComputedStyle(orig);
                if (computed.color && !computed.color.includes('oklab') && !computed.color.includes('oklch')) {
                  cloned.style.color = computed.color;
                }
                if (computed.backgroundColor && !computed.backgroundColor.includes('oklab') && !computed.backgroundColor.includes('oklch')) {
                  cloned.style.backgroundColor = computed.backgroundColor;
                }
                if (computed.borderColor && !computed.borderColor.includes('oklab') && !computed.borderColor.includes('oklch')) {
                  cloned.style.borderColor = computed.borderColor;
                }
              } catch (e) {
                // Ignore individual element property copy errors
              }
            }
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
