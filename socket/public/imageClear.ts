$(document).ready(() => {
  $('.img-area').click(() => {
    $('.img-area').toggleClass('hidden');
    console.log($('div').hasClass('hidden'));
  });
});

export { };
