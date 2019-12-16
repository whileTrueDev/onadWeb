import JsPDF from 'jspdf';

/**
 * @param {element} element pdf로 변환할 엘리먼트
 */
const jsPdfGenerator = (element) => {
  // JSpdf Generator For generating the PDF
  // Example From https://parall.ax/products/jspdf
  const doc = new JsPDF('p', 'pt');
  doc.fromHTML(element);
  // Save the Data
  doc.save('Generated.pdf');
};

export default jsPdfGenerator;
