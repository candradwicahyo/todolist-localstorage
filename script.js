window.addEventListener('DOMContentLoaded', () => {
  
  let tasks = [];
  
  const content = document.querySelector('.content');
  const input = document.querySelector('.input');
  const button = document.querySelector('.button');
  button.addEventListener('click', addData);
  
  function addData(event) {
    // mencegah default bwhavior dari element HTML seperti link, form dan lain sebagainya
    event.preventDefault();
    // value input
    const value = input.value.trim();
    
    // validasi terlebih dahulu
    if (validate(value)) {
      
      // cek apakah data yang ditambahkan sudah pernah dibuat atau belum pernah dibuat
      if (isDataExist(value)) {
        
        // jika data sudah pernah dibuat
        return alerts('error', 'Data is already in the list!');
        
      } else {
        
        // jika data belum pernah dibuat
        // jadikan value sebagai object
        const data = { value: value };
        // masukkan isi variabel "data" kedalam variabel "tasks"
        tasks.unshift(data);
        // simpan isi variabel "tasks" kedalam localstorage
        saveToLocalstorage();
        // render data dan jadikan element HTML
        showData(data);
        // beri pesan bahwa "data berhasil ditambahkan"
        alerts('success', 'Data has been added!');
        // load data yang berada didalam localstorage 
        loadData();
        // bersihkan form
        clear();
        
      }
      
    }
    
  }
  
  function validate(value) {
    // jika input kosong
    if (!value) return alerts('error', 'Input is empty!');
    // jika isi input terlalu pendek
    if (value.length < 3) return alerts('error', 'Input must be more than 3 character!');
    // jika isi input terlalu panjang
    if (value.length > 40) return alerts('error', 'Input must be no more than 40 character!');
    // jika berhasil melewati swmua validasi
    return true;
  }
  
  function alerts(type, text) {
    // plugin "sweetalert2"
    swal.fire ({
      icon: type,
      title: 'Alert',
      text: text
    });
  }
  
  function isDataExist(value) {
    // nilai default apabila data belum pernah dibuat
    let exist = false;
    tasks.forEach(task => {
      // apabila data sudah pernah dibuat
      if (task.value == value) exist = true;
    });
    // kembalikan nilai berupa boolean true atau false
    return exist;
  }
  
  function saveToLocalstorage() {
    /*
      simpan isi variabel "tasks" kedalam localstorage. setelah itu jadikan isi variabel
      "tasks" sebagai string JSON dengan menggunakan fungsi JSON.stringify()
    */
    localStorage.setItem('todolist', JSON.stringify(tasks));
  }
  
  function showData(data, index = 0) {
    // render data menjadi sebuah element HTML
    const result = create(data, index);
    // tampilkan element tersebut
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function create({ value }, index) {
    return `
    <div class="box p-4 shadow-sm rounded-2 my-2">
      <span class="d-block mb-2 fw-light text">${value}</span>
      <div class="d-flex align-items-center">
        <button class="btn btn-success btn-sm rounded-1 me-1 btn-edit" data-index="${index}">edit</button>
        <button class="btn btn-danger btn-sm rounded-1 btn-delete" data-index="${index}">delete</button>
      </div>
    </div>
    `;
  }
  
  function loadData() {
    // bersihkan element "content"
    content.innerHTML = '';
    // ambil data yang berada didalam localstorage
    const data = localStorage.getItem('todolist');
    /*
      jika variabel data menghasilkan boolean true, maka ubah isi variabel tasks
      dengan data yang yang sudah diparsing menjadi JSON dengan menggunakan fungsi JSON.parse()
      dan apabila variabel data menghasilkan boolean false, maka ubah isi variabel tasks dengan
      array kosong
    */
    tasks = (data) ? JSON.parse(data) : [];
    tasks.forEach((task, index) => showData(task, index));
  }
  
  loadData();
  
  function clear() {
    // bersihkan form
    const form = document.querySelector('.form');
    form.reset();
  }
  
  // hapus data 
  window.addEventListener('click', e => {
    // jika element yang ditekan memiliki class "btn-delete"
    if (e.target.classList.contains('btn-delete')) {
      // dapatkan isi atribut "data-index" dari element yang ditekan
      const index = e.target.dataset.index;
      // jalankan fungsi deleteData()
      deleteData(index);
    }
  });
  
  function deleteData(index) {
    // plugin "sweetalert2"
    swal.fire ({
      icon: 'info',
      title: 'Are you sure?',
      text: 'do you want to delete this data?',
      showCancelButton: true
    })
    .then(response => {
      // jika menekan tombol "ok" atau "yes"
      if (response.isConfirmed) {
        
        // hapus element array di index yang sesuai dengan isi parameter "index"
        tasks.splice(index, 1);
        // simpan perubahan data kedalam localstorage
        saveToLocalstorage();
        // guna mencegah menghapus data yang tidak sesuai indexnya
        index = null;
        // beri pesan bahwa "data berhasil dihapus"
        alerts('success', 'Data has been deleted!');
        // load data yang berada didalam localstorage
        loadData();
        
      }
    });
  }
  
  // edit data
  window.addEventListener('click', e => {
    // jika element yang ditekan memiliki class "btn-edit"
    if (e.target.classList.contains('btn-edit')) {
      // dapatkan isi atribut "data-index" dari element yang ditekan
      const index = e.target.dataset.index;
      // jalankan fungsi editData()
      editData(index);
    }
  });
  
  function editData(index) {
    // sebuah prompt guna untuk mengubah data
    const result = prompt('Edit your data', tasks[index].value);
    
    // lakukan validasi terlebih dahulu
    if (validate(result)) {
      
      // cek apakah data yang ditambahkan sudah pernah dibuat atau belum pernah dibuat
      if (isDataExist(result)) {
        
        // jika data sudah pernah dibuat
        return alerts('error', 'Data is already in the list!');
        
      } else {
        
        // jika data belum pernah dibuat
        tasks[index].value = result;
        // simpan perubahan data kedalam localstorage
        saveToLocalstorage();
        // mencegah menduplikat data lainnya saat sedang mengubah data
        index = null;
        // beri pesan bahwa "data berhasil diubah"
        alerts('success', 'Data has been updated!');
        // load data yang berada didalam localstorage
        loadData();
        
      }
      
    }
    
  }
  
});