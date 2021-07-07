let socket = io();
const deleteroom = document.getElementById('deleteroom');
let id = window.location.toString().split('admin/')[1].split('/')[0];
deleteroom.addEventListener('click', function () {
  console.log('delete room');
  axios
    .post('/api/v1/deleteroom', {
      id,
    })
    .then((res) => {
      console.log(res.data.status);
      if (res.data.status === 200) {
        tata.info('Room deleted', 'You deleted the room', {
          animate: 'fade',
          position: 'tm',
        });
        socket.emit(
          'delete-room',
          window.location.toString().split('admin/')[1].split('/')[0]
        );
        window.location.replace('/');
      } else {
        tata.error('Room deleted', 'Oops!Some Error in room deleting', {
          animate: 'fade',
          position: 'tm',
        });
      }
    });
});
