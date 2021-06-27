let socket = io();
let userlist = document.getElementById('userlist');
const deleteroom = document.getElementById('deleteroom');
let userCurrent;
// Delete button to delete a rooom
// textinput.value = '';

// Editor Setup

let isUserChnage;

const textinput = document.getElementById('code');
var editor = CodeMirror.fromTextArea(textinput, {
  lineNumbers: true,
  tabSize: 2,
  lineWrapping: true,
  foldGutter: true,
  autoCloseBrackets: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  matchBrackets: true, //Bracket matching
  mode: 'text/x-python',
  mode: 'text/x-java',
  mode: 'text/x-c++src',
  theme: 'dracula',
});

editor.setSize('720px', '630px'); //Set the length and width of the code box

let id = window.location.toString().split('admin/')[1].split('/')[0];
deleteroom.addEventListener('click', function () {
  axios
    .post('/api/v1/deleteroom', {
      id,
    })
    .then((res) => {
      if (res.data.status === 400) {
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

// Socket event for text sharing

editor.on('change', (editor, changeObj) => {
  if (userCurrent && isUserChnage === false) {
    socket.emit('admindatachang', userCurrent, changeObj);
  }
});

editor.on('focus', () => {
  isUserChnage = false;
});
userlist.addEventListener('click', (e) => {
  isUserChnage = true;
  socket.emit('change-user', e.target.textContent);
  userCurrent = e.target.textContent;
});

function createEle(name) {
  let li = document.createElement('li');
  li.textContent = name;
  return li;
}

socket.on('userdochangeToadmin', function (changeData, username) {
  if (username === userCurrent) {
    isUserChnage = true;
    // editor.display.input.blur();
    editor.replaceRange(
      changeData.text,
      changeData.from,
      changeData.to,
      'Broadcast'
    );
  }
});
socket.on('connect', function () {
  socket.on('adminsideide', function (text, user) {
    isUserChnage = true;
    if (user === userCurrent) {
      editor.setValue('');
      editor.setValue(text);
    }
  });

  socket.emit(
    'admin-page',
    window.location.toString().split('admin/')[1].split('/')[0]
  );
  socket.on('update', function (username, roomId) {
    if (
      window.location.toString().split('admin/')[1].split('/')[0] === roomId
    ) {
      userlist.innerHTML = '';
      for (let i in username)
        userlist.insertAdjacentHTML(
          'beforeend',
          ` <div class="stu-list">${username[i]}</div>`
        );
    }
  });
});

document.querySelector('#report').addEventListener('click', () => {
  window.location.assign(window.location.toString() + '/report');
});
