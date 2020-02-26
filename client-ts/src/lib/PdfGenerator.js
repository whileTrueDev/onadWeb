const JsPDF = require('jspdf');
const html2canvas = require('html2canvas');

/**
 * @param {element} element pdf로 변환할 엘리먼트
 */
const bannerAndClickCampaignToPdf = (
  handleProgressState, filename = 'onad_report.pdf'
) => {
  // Create PDF document
  const doc = new JsPDF('p', 'mm');
  // Preprocessing svg icons
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((item) => {
    item.setAttribute('width', item.getBoundingClientRect().width);
  });

  const broadCreatorsElement = document.getElementById('broad-creators');
  broadCreatorsElement.style.overflow = 'initial';

  const config = {
    allowTaint: true,
    useCORS: true,
    taintTest: false,
    imageTimeout: 40000,
    backgroundColor: 'rgba(255, 255, 255)'
  };

  html2canvas(document.getElementById('report-window'), config).then((canvas) => {
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
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

    broadCreatorsElement.style.overflow = 'auto';
    handleProgressState(false);
    doc.save(filename);
  });


  // Set elements into PDF document as Image
  /** *********
   * HEADLINE
   ********** */
  // Title
  // await html2canvas(headlineTitle).then((titleImage) => {
  //   const title = titleImage.toDataURL('image/png');
  //   doc.addImage(title, 'PNG',
  //     size.headlineTitle.x, size.headlineTitle.y,
  //     size.headlineTitle.w, size.headlineTitle.h);
  // });

  // // Divider
  // doc.line(15, 23, 200, 23);

  // /** ************
  //  * CONTENTS
  //  ************ */
  // // Campaign info
  // await html2canvas(campaignInfo).then((campaignInfoImage) => {
  //   const campaignInfo1 = campaignInfoImage.toDataURL('image/png');
  //   doc.addImage(campaignInfo1, 'PNG',
  //     size.campaignInfo.x, size.campaignInfo.y,
  //     size.campaignInfo.w, size.campaignInfo.h);
  //   console.log('campaignInfo1 done');
  // });

  // // Campaign card

  // await html2canvas(campaignCard, {
  // }).then((campaignCardImage) => {
  //   const campaignCard1 = campaignCardImage.toDataURL('image/png');
  //   doc.addImage(campaignCard1, 'PNG',
  //     size.campaignCard.x, size.campaignCard.y,
  //     size.campaignCard.w, size.campaignCard.h);
  //   console.log('campaignCard1 done');
  // });

  // // Campaign Metrics
  // await html2canvas(metricsCard, {
  // }).then((metricsImage) => {
  //   const metricsCard1 = metricsImage.toDataURL('image/jpeg', 1.0);
  //   doc.addImage(metricsCard1, 'PNG',
  //     size.metricsCard.x, size.metricsCard.y,
  //     size.metricsCard.w, size.metricsCard.h);
  //   console.log('metricsCard1 done');
  // });

  // // Bar Chart
  // await html2canvas(barChart, {
  // }).then((barChartImage) => {
  //   const barChart1 = barChartImage.toDataURL('image/png');
  //   doc.addImage(barChart1, 'PNG',
  //     size.barChart.x, size.barChart.y,
  //     size.barChart.w, size.barChart.h);
  //   console.log('barChart1 done');
  // });

  // // Pie Chart
  // await html2canvas(pieChart, {
  //   backgroundColor: '#fff',
  //   allowTaint: true,
  //   logging: true
  // }).then((pieChartImage) => {
  //   const pieChart1 = pieChartImage.toDataURL('image/png');
  //   doc.addImage(pieChart1, 'PNG',
  //     size.pieChart.x, size.pieChart.y,
  //     size.pieChart.w, size.pieChart.h);
  //   console.log('pieChartImage done');
  // });
};

module.exports = bannerAndClickCampaignToPdf;
