function slot() {
  // const machine1 = $('#machine1').slotMachine({
  //   active: 0,
  //   delay: 500,
  // });

  // const machine2 = $('#machine2').slotMachine({
  //   active: 1,
  //   delay: 500,
  //   direction: 'down',
  // });

  // let results;

  // function onComplete(active) {
  //   switch (this.element[0].id) {
  //     case 'machine1':
  //       $('#machine1Result').text(this.active);
  //       results[0] = getMachineResult($('#machine1'), this.active);
  //       break;
  //     case 'machine2':
  //       $('#machine2Result').text(this.active);
  //       results[1] = getMachineResult($('#machine2'), this.active);
  //       break;
  //   }
  //   $('#results').text(results.join(', '));
  // }

  // function getMachineResult(i_jqMachine, i_iActive) {
  //   return i_jqMachine
  //     .find('span.option > span')
  //     .eq(i_iActive + 1)
  //     .text();
  // }

  // $('#randomizeButton').click(function () {
  //   results = [];
  //   $('#results').css('color', 'white').text('');
  //   machine1.shuffle(5, onComplete);
  //   setTimeout(function () {
  //     machine2.shuffle(5, onComplete);
  //   }, 500);
  // });
  const btn = document.querySelector('#randomizeButton');
  const results = {
    machine1: document.querySelector('#machine1Result'),
    machine2: document.querySelector('#machine2Result'),
    machine3: document.querySelector('#machine3Result'),
  };
  const el1 = document.querySelector('#machine1');
  const el2 = document.querySelector('#machine2');
  const el3 = document.querySelector('#machine3');
  const machine1 = new SlotMachine(el1, { active: 0 });
  const machine2 = new SlotMachine(el2, { active: 1 });
  const machine3 = new SlotMachine(el3, { active: 2 });

  function onComplete(active) {
    results[this.element.id].innerText = `Index: ${this.active}`;
  }

  btn.addEventListener('click', () => {
    machine1.shuffle(5, onComplete);
    setTimeout(() => machine2.shuffle(5, onComplete), 500);
    setTimeout(() => machine3.shuffle(5, onComplete), 1000);
  });
}
export default slot;
