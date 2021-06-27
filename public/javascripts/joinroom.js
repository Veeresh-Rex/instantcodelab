// const { default: axios } = require('axios');

const joinroom = document.getElementById('joinroom');
console.log(joinroom);
joinroom.addEventListener('submit', async (e) => {
  console.log('chala');
  e.preventDefault();
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  const id = window.location.toString().split('room/')[1].split('/')[1];
  console.log(id);
  axios
    .post('/api/v1/joinroom', {
      password,
      id,
      username,
    })
    .then((res) => {
      if (res.data.status === 200) {
        tata.success('Joined', 'Yehh! You joined room successfully', {
          animate: 'fade',
          position: 'tm',
        });
        window.location.assign(`/room/joined/${id}`);
        localStorage.setItem(id, username);
      } else {
        tata.error(
          'Wrong Password',
          'Oops! Entered room password is Incorrect',
          {
            position: 'tm',
            animate: 'fade',
          }
        );
      }
    })
    .catch((err) => {
      tata.error('Submit', 'Oops! Some Error Occurred', {
        animate: 'fade',
        position: 'tm',
      });
      console.log(err);
    });
});
