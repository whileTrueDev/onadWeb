/* eslint-env jquery */
$(() => {
  const socket = io();
  socket.emit('new marquee', []);
});
