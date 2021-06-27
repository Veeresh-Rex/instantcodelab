// Copy function to copy link
function copy() {
  var copyText = document.getElementById('link');
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand('copy');
  tata.success('Link Copied', '', {
    animate: 'fade',
    position: 'tm',
  });
}

// Create room
document.getElementById('createform').addEventListener('submit', (e) => {
  e.preventDefault();
  const labname = document.getElementById('labname').value;
  const by = document.getElementById('createdby').value;
  const password = document.getElementById('password').value;

  axios
    .post('/api/v1/create', {
      password,
      by,
      labname,
    })
    .then((res) => {
      //console.log(res.data);
      adminCode = res.data.admincode;
      roomid = res.data.id;

      let html = ` <div id="modal-div" class=" hide modal-container py-20">
      <div class="modal-wrapper flex flex-col max-w-3xl mx-auto rounded-lg shadow-lg">
          <div class="px-8 pt-10 pb-4">
              <div class="flex flex-col">
                  <h4 class="text-primary-dark">The link to your room is</h4>
                  <div class="flex w-full"><input type="text" name="link" id="link" class="link w-full link-hover py-2 my-3 border px-4 rounded-pill" readonly="" value="https://instantcodelabb.herokuapp.com/room/join/${roomid}">
                  </div>
                  <button class="btn modal-btn" onclick="copy()">Copy Link</button>
              </div>
              <div class="flex flex-col mt-5 py-4 border-t border-gray-300">
                  <h4 class="text-primary-dark">The admin link to manage your room is
                  </h4>
                  <p class="flex items-center warning  py-1 "><svg viewBox="0 0 20 20" fill="currentColor" class="exclamation h-5 w-5 mr-2">
                              <path fill-rule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clip-rule="evenodd"></path>
                          </svg>Don't share this link with your participants</p>
                  <div class="flex w-full">

                  </div>
                  <a href="https://instantcodelabb.herokuapp.com/admin/${roomid}/${adminCode}"> <button class="btn modal-btn" >Go to Admin Panel</button></a>
              </div>
          </div>
      </div>
  </div>`;
      document
        .getElementById('linkmodal')
        .insertAdjacentHTML('beforeend', html);

      let int = setInterval(() => {
        if (document.getElementById('link').getBoundingClientRect().top < 300)
          clearInterval(int);
        window.scrollBy(0, 20);
      }, 20);
      document.getElementById('link').addEventListener('click', () => {
        copy();
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
