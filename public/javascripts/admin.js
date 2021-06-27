let socket = io();
let userlist = document.getElementById('userlist');
const deleteroom = document.getElementById('deleteroom');
let userCurrent;

// Editor Setup

let isUserChnage;

const textinput = document.getElementById('code');
let mode;

if (languageid == 62) {
  mode = 'text/x-java';
} else if (languageid == 54) {
  mode = 'text/x-c++src';
} else if (languageid == 49) {
  mode = 'text/x-csrc';
} else {
  mode = 'text/x-python';
}
var editor = CodeMirror.fromTextArea(textinput, {
  lineNumbers: true,
  tabSize: 2,
  lineWrapping: true,
  indentUnit: 4,
  foldGutter: true,
  autoCloseBrackets: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  matchBrackets: true,
  mode: mode,
  theme: 'dracula',
});

if (languageid == 62) {
  editor.setValue(`public class Main {
    public static void main(String[] args) {
        //Your code goes here
    }
}
`);
}
if (languageid == 54) {
  editor.setValue(`#include <iostream>
using namespace std;
int main() {
      // Your code goes here
}
`);
}
if (languageid == 49) {
  editor.setValue(`#include <stdio.h>
int main() {
    // Your code goes here
    return 0;
}
`);
}
if (languageid == 71) {
  editor.setValue(`#Python(3.8.1)...
#Your code goes here
`);
}

editor.setSize('720px', '630px'); //Set the length and width of the code box

//delete button room
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
