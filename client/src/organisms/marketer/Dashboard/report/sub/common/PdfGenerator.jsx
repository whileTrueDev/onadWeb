import JsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';

/**
 * @param {element} element pdf로 변환할 엘리먼트
 */
const jsPdfGenerate = (element, title = 'onad_report.png') => {
  // JSpdf Generator For generating the PDF
  // Example From https://parall.ax/products/jspdf

  // Using dom-to-image
  // domtoimage.toJpeg(element)
  //   .then((dataUrl) => {
  //     const link = document.createElement('a');
  //     link.download = 'my-image-name.jpeg';
  //     link.href = dataUrl;
  //     link.click();
  //   });

  // Using html2canvas
  html2canvas(element).then((canvas) => {
    const doc = new JsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png'); // Image 코드로 뽑아내기
    doc.addImage(imgData, 'PNG', 15, 15, 180, 280);
    doc.save('sample-file.pdf');
  });


  // const doc = new JsPDF('p', 'pt');

  // const generatePdf = () => {
  //   doc.setProperties({
  //     title
  //   });
  //   doc.save('Generated.pdf');
  // };

  // doc.addFileToVFS('malgun.tf');
  // doc.fromHTML(element, 15, 15, {
  //   width: 170,
  // }, generatePdf);
  // Save the Data
};

export default jsPdfGenerate;
