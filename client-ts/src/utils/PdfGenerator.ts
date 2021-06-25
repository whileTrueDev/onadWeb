import * as React from 'react';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * @param {element} element pdf로 변환할 엘리먼트
 */
const bannerAndClickCampaignToPdf = (
  handleProgressState: React.Dispatch<React.SetStateAction<boolean>>,
  filename = 'onad_report.pdf',
): void => {
  // Create PDF document
  const doc = new JsPDF('p', 'mm');
  // Preprocessing svg icons
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(item => {
    item.setAttribute('width', item.getBoundingClientRect().width.toString());
  });

  const broadCreatorsElement = document.getElementById('broad-creators');
  if (broadCreatorsElement) {
    broadCreatorsElement.style.overflow = 'initial';
  }

  const config = {
    allowTaint: true,
    useCORS: true,
    taintTest: false,
    imageTimeout: 40000,
    backgroundColor: 'rgba(255, 255, 255)',
  };

  const reportWindow = document.getElementById('report-window');
  if (reportWindow) {
    html2canvas(reportWindow, config).then(canvas => {
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // enter code here
      const imgData = canvas.toDataURL('image/png');

      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
        heightLeft -= pageHeight;
      }

      if (broadCreatorsElement) {
        broadCreatorsElement.style.overflow = 'auto';
      }

      handleProgressState(false);
      doc.save(filename);
    });
  }
};

export default bannerAndClickCampaignToPdf;
