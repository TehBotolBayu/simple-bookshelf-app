var data = [];
const submit = document.querySelector('#inputBook');
var idGlobal = 0;
let open = 'none';

function render(books, changeGlobalId){
    books.forEach(element => {
        const { title, author, year, isDone, id } = element;
        const book = createBook(title, author, year, isDone, id);
        let shelf;
        if(isDone){
            shelf = document.getElementById('completeBookshelfList');
        }else {
            shelf = document.getElementById('incompleteBookshelfList');
        }
        shelf.appendChild(book);
        if(changeGlobalId){
            if(id > idGlobal) idGlobal=id;
        }
    });
    if(changeGlobalId) idGlobal = idGlobal + 1;
}

function cariBuku(key){
    let res = data.filter(element => {
        return element.title.toLowerCase().search(key.toLowerCase()) > -1
    })
    data.forEach(element => {
        const deleted = document.getElementById(element.id);
        if(deleted) deleted.remove();
    });
    render(res, false);
}

function saveData() {
    const dataString = JSON.stringify(data);
    localStorage.setItem("savedData", dataString);
}

function readData() {
    const read = JSON.parse(localStorage.getItem("savedData"));
    if(read == null){
        return;
    }
    data = read;
    render(data, true);
}

readData();

function hapus(idx){
    const deleted = document.getElementById(idx);
    deleted.remove();
    
    data = data.filter(element => element.id !== idx);
    
    saveData();
}

function clear(){
    data.forEach(element => {
        const deleted = document.getElementById(element.id);
        if(deleted) deleted.remove();
    });
}

let openEdit = 'none'
let idEdit;

function edit(title, author, year, isDone, idx) {
    const editBookTitle = document.getElementById('editBookTitle');
    const editBookAuthor = document.getElementById('editBookAuthor');
    const editBookYear = document.getElementById('editBookYear');
    const editBookIsComplete = document.getElementById('editBookIsComplete');
    
    editBookTitle.value = title;
    editBookAuthor.value = author;
    editBookYear.value = year;
    editBookIsComplete.checked = isDone;
    idEdit = idx;

    const edit_section = document.getElementById('edit_section');
    if(openEdit == 'none'){
        openEdit = 'block';
    } else {
        openEdit = 'none';
    }
    edit_section.style.display = openEdit;
}

function updateBuku(ntitle, nauthor, nyear, nisDone, idx){    
    
    
    data = data.map((element) => {
        if(element.id == idx){
            element.title = ntitle;
            element.author = nauthor;
            element.year = nyear;
            element.isDone = nisDone;
        }
        return element;
    })
    saveData();
    clear();
    render(data, false);
}

function pindah(title, author, year, isDone, idx){
    hapus(idx);
    isDone = !isDone;

    const book = createBook(title, author, year, isDone, idx);
    let shelf;
    if(isDone){
        shelf = document.getElementById('completeBookshelfList');
    }else {
        shelf = document.getElementById('incompleteBookshelfList');
    }
    shelf.appendChild(book);

    const bookData = {
        id: idx,
        title,
        author,
        year,
        isDone
    };
    data.push(bookData);
    saveData();
}

function l(){
    console.log(data);
}

function createBook(title, author, year, isDone, idx){
    const art = document.createElement('article');
    art.setAttribute('class', 'book_item');
    art.setAttribute('id', `${idx}`);
    const tit = document.createElement('h3');
    const pen = document.createElement('div');
    const yr = document.createElement('p');
    const act = document.createElement('div');
    act.setAttribute('class', 'action');
    const gb = document.createElement('button');
    gb.setAttribute('class', 'green');
    const rb = document.createElement('button');
    rb.setAttribute('class', 'red');
    const eb = document.createElement('button');
    eb.setAttribute('class', 'blue');

    gb.addEventListener('click', () => pindah(title, author, year, isDone, idx));
    rb.addEventListener('click', () => hapus(idx));
    eb.addEventListener('click', () => edit(title, author, year, isDone, idx));

    tit.innerText = title;
    pen.innerText = author;
    yr.innerText = year;

    const stat = (!isDone)? "Selesai dibaca": "Belum selesai di Baca";
    gb.textContent = stat;
    rb.textContent = "Hapus buku";
    eb.textContent = "Edit buku";
    act.appendChild(gb);
    act.appendChild(rb);
    act.appendChild(eb);
    art.appendChild(tit);
    art.appendChild(pen);
    art.appendChild(yr);
    art.appendChild(act);

    return art;
}

submit.addEventListener('submit', (event) => {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isDone = document.getElementById('inputBookIsComplete').checked;

    const book = createBook(title, author, year, isDone, idGlobal);
    let shelf;
    if(isDone){
        shelf = document.getElementById('completeBookshelfList');
    }else {
        shelf = document.getElementById('incompleteBookshelfList');
    }
    shelf.appendChild(book);

    alert('Buku berhasil ditambahkan!');
    idGlobal = idGlobal + 1;

    const bookData = {
        id: idGlobal,
        title,
        author,
        year,
        isDone
    };
    data.push(bookData);
    saveData();

    const input_section = document.getElementById('input_section');  
    input_section.style.display = 'none';
    open = 'none';

    event.preventDefault();
})

const searchSubmit = document.getElementById('searchSubmit');
searchSubmit.addEventListener('click', (event)=>{
    const searchBookTitle = document.getElementById('searchBookTitle');
    const key = searchBookTitle.value;
    cariBuku(key);
    event.preventDefault();
})

const tambah = document.getElementById('tambah');
tambah.addEventListener('click', (event)=>{
    const input_section = document.getElementById('input_section');  
    if(open === 'none'){
        open = 'block'
    } else {
        open = 'none'
    }
    input_section.style.display = open; 
    event.preventDefault();
})

const cancelEdit = document.getElementById('cancelEdit');
cancelEdit.addEventListener('click', () => {
    const edit_section = document.getElementById('edit_section');
    if(openEdit == 'none'){
        openEdit = 'block';
    } else {
        openEdit = 'none';
    }
    edit_section.style.display = openEdit;
})

const editBook = document.getElementById('editBook');
editBook.addEventListener('click', () => {

    const editBookTitle = document.getElementById('editBookTitle');
    const editBookAuthor = document.getElementById('editBookAuthor');
    const editBookYear = document.getElementById('editBookYear');
    const editBookIsComplete = document.getElementById('editBookIsComplete');

    updateBuku(editBookTitle.value, editBookAuthor.value, editBookYear.value, editBookIsComplete.checked, idEdit)
    openEdit = 'none';
    const edit_section = document.getElementById('edit_section');
    edit_section.style.display = openEdit;
})

const belum = document.getElementById('belum')
belum.addEventListener('click', () => {
    const incomplete = document.getElementById('incomplete');
    incomplete.style.display = 'none'
    const complete = document.getElementById('complete');
    complete.style.display = 'block'
})

const sudah = document.getElementById('sudah')
sudah.addEventListener('click', () => {
    const incomplete = document.getElementById('incomplete');
    incomplete.style.display = 'block'
    const complete = document.getElementById('complete');
    complete.style.display = 'none'
})