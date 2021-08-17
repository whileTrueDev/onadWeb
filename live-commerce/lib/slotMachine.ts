function slotMachine() {
  const machine1 = $('#machine1').slotMachine({
    active: 0,
    delay: 500,
  });

  const machine2 = $('#machine2').slotMachine({
    active: 1,
    delay: 500,
    direction: 'down',
  });

  let results;

  function onComplete(active) {
    switch (this.element[0].id) {
      case 'machine1':
        $('#machine1Result').text(this.active);
        results[0] = getMachineResult($('#machine1'), this.active);
        break;
      case 'machine2':
        $('#machine2Result').text(this.active);
        results[1] = getMachineResult($('#machine2'), this.active);
        break;
    }
    $('#results').text(results.join(', '));
  }

  function getMachineResult(i_jqMachine, i_iActive) {
    return i_jqMachine
      .find('span.option > span')
      .eq(i_iActive + 1)
      .text();
  }

  $('#randomizeButton').click(function () {
    results = [];
    $('#results').css('color', 'white').text('');
    machine1.shuffle(5, onComplete);
    setTimeout(function () {
      machine2.shuffle(5, onComplete);
    }, 500);
  });
}
export default slotMachine;
