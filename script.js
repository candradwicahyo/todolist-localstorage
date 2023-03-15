window.onload = () => {
  
  let tasks = [];
  
  const content = document.querySelector('.content');
  const input = document.querySelector('.input');
  
  function loadData() {
    // kosongkan element content
    content.innerHTML = '';
    // dapatkan item pada localstorage
    const result = localStorage.getItem('todo');
    tasks = (result) ? JSON.parse(result) : [];
    tasks.forEach(task => {
      // render element
      const result = render(task);
      // tampilkan element
      content.insertAdjacentHTML('afterbegin', result);
    });
  }
  
  loadData();
  
  
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', () => {
    // value input
    const value = input.value.trim();
    // validasi terlebih dahulu
    if (validate(value) == true) {
      // render element
      const result = render(value);
      // tampilkan element
      content.insertAdjacentHTML('afterbegin', result);
      // push isi input kedalam array
      tasks.push(value);
      // simpan ke localstorage
      save();
      // tampilkan pesan bahwa data berhasil ditambahkan
      alerts('success', 'Success', 'data has been added!');
      // bersihkan value input
      input.value = '';
    }
  });
  
  function validate(value) {
    // jika jnput kosong
    if (!value) return alerts('error', 'Alert', 'field is empty!');
    // jika terlalu pendek
    if (value.length < 3) return alerts('error', 'Alert', 'value must be more then 3 character');
    // jika terlalu panjang
    if (value.length > 100) return alerts('error', 'Alert', 'value must be less then 100 character');
    // jika berhasil melewati semua validasi
    return true;
  }
  
  function alerts(icon, title, text, position = 'center') {
    // plugin sweetalert2
    swal.fire ({
      position: position,
      icon: icon,
      title: title,
      text: text
    });
  }
  
  function render(value) {
    return `
    <div class="card my-2">
      <div class="card-body">
        <p class="fw-light mb-3 text">${value}</p>
        <button class="btn btn-success btn-sm rounded-0 btn-edit me-1">edit</button>
        <button class="btn btn-danger btn-sm rounded-0 btn-delete">delete</button>
      </div>
    </div>
    `;
  }
  
  function save() {
    // simpan isi variabel tasks kedalam localstorage
    localStorage.setItem('todo', JSON.stringify(tasks));
  }
  
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "btn-delete"
    if (event.target.classList.contains('btn-delete')) {
      // dapatkan element 
      const parent = event.target.parentElement;
      const text = parent.children[0].textContent.toLowerCase();
      // jalankan fungsi deleteData()
      deleteData(parent, text);
    }
  });
  
  function deleteData(parent, text) {
    swal.fire ({
      icon: 'info',
      title: 'are you sure?',
      text: 'do you want to delete this data?',
      showCancelButton: true
    })
    .then(response => {
      // jika tombol yang ditekan bertuliskan "yes" atau "ok"
      if (response.isConfirmed) {
        // hapus element array yang sama dengan parameter "text"
        tasks.splice(tasks.indexOf(text), 1);
        // simpan kedalam localstorage
        save();
        // hapus element card
        parent.parentElement.remove();
        // berikan pesan bahwa data berhasil dihapus
        alerts('success', 'Success', 'data has been deleted!');
        // load data
        loadData();
      }
    });
  }
  
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "btn-edit"
    if (event.target.classList.contains('btn-edit')) {
      // dapatkan element 
      const parent = event.target.parentElement;
      const text = parent.children[0];
      // jalankan fungsi editData
      editData(parent, text);
    }
  });
  
  function editData(parent, text) {
    // sebuah prompt
    const result = prompt('Enter new Data', text.textContent);
    /*
      ambil isi array yang ada kaitannya dengan isi parameter "text",
      lalu ubah isi tersebut dengan isi variabel result. jika prompt tidak
      diisi, maka ubah array tersebut dengan tks lama. tapi jika prompt terisi
      maka ubah isi array tersebut dengan isi variabel result
    */
    tasks[tasks.indexOf(text.textContent.toLowerCase())] = (!result || result == '') ? text.textContent : result;
    // simpan kedalam localstorage
    save();
    /*
      jika prompt tidak terisi atau kosong, maka isi text dengan teks lama.
      tapi jika prompt terisi maka ubah text dengan isi variabel result
    */
    text.textContent = (!result || result == '') ? text.textContent : result;
    // tampilkan  pesan bahwa data berhasil diubah
    alerts('success', 'Success', 'data has been updated!');
    // load data 
    loadData();
  }
  
  // fitur tandai teks
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "text"
    if (event.target.classList.contains('text')) {
      // tambahkan class "active" pada element yang ditekan
      event.target.classList.toggle('active');
      // dapatkan element tombol edit
      const btnEdit = event.target.nextElementSibling;
      /*
        jika element yang ditekan memiliki class "active",
        maka matikan fitur tombol. tapi jika element yang ditekan tidak
        memiliki class "active", maka aktifkan lagi fitur tombol.
      */
      return (event.target.classList.contains('active')) ? btnEdit.setAttribute('disabled', true) : btnEdit.removeAttribute('disabled');
    }
  });
  
}