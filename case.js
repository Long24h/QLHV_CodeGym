class Contact{
    constructor(id, name, avatar, mobile, email){
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.mobile = mobile;
        this.email = email;
    }
}

const contact_key = "data-contact";
const avatar_url = 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar';
var contacts = [];
var page_size = 4;
var total_pages = 0;
var page_number = 1;

function init(){
    if(localStorage.getItem(contact_key) == null){
        contacts = [
            new Contact(1, "Phan Ngọc Linh", `${avatar_url}/5.jpg`, '0935222212', 'linh05@gmail.com'),
            new Contact(2, "Nguyễn Xuân Cường", `${avatar_url}/4.jpg`, '0935222212', 'cuong@gmail.com'),
            new Contact(3, "Phan Tiến Huynh", `${avatar_url}/3.jpg`, '0935222212', 'huynh@gmail.com'),
            new Contact(4, "Phan Duy Huân", `${avatar_url}/2.jpg`, '0935222212', 'huan@gmail.com'),
            new Contact(5, "Phan Ngọc Nhật", `${avatar_url}/1.jpg`, '0935222212', 'nhat@gmail.com'),
            new Contact(6, "Phan Thanh Linh", `${avatar_url}/7.jpg`, '0935222212', 'linh@gmail.com')
        ];

        localStorage.setItem(contact_key, JSON.stringify(contacts));
    }
    else{
        contacts = JSON.parse(localStorage.getItem(contact_key));
    }
}

function renderContact(){
    let data = contacts.slice((page_size * (page_number - 1)), (page_size * page_number));
    let htmls = data.map(function(contact, index){
        return `
            <tr>
                <td>${contact.name}</td>
                <td class="text-center">
                    <img class="avatar-sm" src="${contact.avatar}" alt="">
                </td>
                <td class="text-center">
                    ${contact.mobile}
                </td>
                <td>
                    ${contact.email}
                </td>
                <td class="text-center">
                    <i class="fa-solid fa-pencil" onclick="getContact(${contact.id})"></i>
                    <i class="fa fa-trash" onclick='removeContact(${index})'></i>
                </td>
            </tr>
        `
    });
    document.querySelector('.table tbody').innerHTML = htmls.join("");
    buildPagination()
}

function openModal(){
    document.querySelector('.modal-container').classList.add('show');
}
function closeModal(){
    document.querySelector('.modal-container').classList.remove('show');
    resetModal();
}

function changeAvatar(){
    document.querySelector('.avatar-lg').src = document.querySelector('#avatar').value ||'images/noavatar.jpg';
}

function addContact(){
    let name = document.querySelector('#name').value;
    let avatar = document.querySelector('#avatar').value;
    let mobile = document.querySelector('#mobile').value;
    let email = document.querySelector('#email').value;
    let id = findMaxId() + 1;
    let contact = new Contact(id, name, avatar, mobile, email);
    contacts.push(contact);
    localStorage.setItem(contact_key, JSON.stringify(contacts));
    closeModal();
    renderContact();
}
function pagenation(index){
    let arr = JSON.parse(localStorage.getItem(contact_key));
}

function resetModal(){
    document.querySelector('#contactId').value = "0";
    document.querySelector('#name').value = "";
    document.querySelector('#avatar').value = "";
    document.querySelector('#mobile').value ="";
    document.querySelector('#email').value = "";
    document.querySelector('.avatar-lg').src = "images/noavatar.jpg";

    document.querySelector('#btnUpdate').classList.add('d-none');
    document.querySelector('#btnAdd').classList.remove('d-none');

    document.querySelector('.modal-title').style.fontFamily= "Trirong, serif"
    
}
function findMaxId(){
    let max = 0;
    for(let contact of contacts){
        if(contact.id > max){
            max = contact.id;
        }
    }

    return max;
}


function removeContact(index){

    let confirm = window.confirm('Do you want to delete this person?');
    if(confirm){
        contacts.splice(index, 1);
        localStorage.setItem(contact_key, JSON.stringify(contacts));
        renderContact();
    }
}

function getContact(contactId){
    let contact = contacts.find(function(ct){
        return ct.id === contactId;
    })

    document.querySelector('#contactId').value = contact.id;
    document.querySelector('#name').value = contact.name;
    document.querySelector('#avatar').value = contact.avatar;
    document.querySelector('#mobile').value = contact.mobile;
    document.querySelector('#email').value = contact.email;
    document.querySelector('.avatar-lg').src = contact.avatar;

    document.querySelector('#btnUpdate').classList.remove('d-none');
    document.querySelector('#btnAdd').classList.add('d-none');

    document.querySelector('.modal-title').innerText = "EDIT";
    openModal();
}

function updateContact(){
    let id = document.querySelector('#contactId').value;

    let contact = contacts.find(function(ct){
        return ct.id == id;
    })
    
    contact.name = document.querySelector('#name').value;
    contact.avatar = document.querySelector('#avatar').value;
    contact.mobile = document.querySelector('#mobile').value;
    contact.email = document.querySelector('#email').value;

    localStorage.setItem(contact_key, JSON.stringify(contacts));

    closeModal();
    renderContact();
}
function addAnimation() {
    const posters =  document.querySelectorAll(".poster");
        posters.forEach((image)=>{
        image.classList.toggle("move")})
}
function changeImage(){
    intID = setInterval(addAnimation,1000)

}
function clearAnimation() {
     const posters =  document.querySelectorAll(".poster");
        posters.forEach((image)=>{
        image.classList.remove("move")})
    clearInterval(intID)
}
function buildPagination() {
    total_pages = Math.ceil(contacts.length / page_size);
    let paginationString = "";
    let start = page_number == 1 ? 1 : page_number == total_pages ? page_number - 2 : page_number - 1;
    let end = page_number == total_pages ? total_pages : page_number == 1 ? page_number + 2 : page_number + 1;
    paginationString += `<li class="page-item"><button onclick='changePage(1)'>&#x25C0;</button></li>`;
    for (let page = 1; page <= total_pages; page++) {
        paginationString += `<li class="page-item">
                                    <button class='${page == page_number ? 'active' : ''}'
                                        onclick='changePage(${page})'>
                                ${page}</button></li>`
    }
    paginationString += `<li class="page-item"><button onclick='changePage(${total_pages})'>&#x25B6;</button></li>`;
    document.getElementById('pagination').innerHTML = paginationString;
}
function changePage(page) {
    page_number = page;
    renderContact();
}
function ascending(field) {
    contacts.sort(function (can_1, can_2) {
        // return can_1[field] - can_2[field];
        if (can_1[field] > can_2[field]) {
            return 1;
        }
        if (can_1[field] < can_2[field]) {
            return -1;
        }
        return 0;
    })
    renderContact();
}
function descending(field) {
    contacts.sort(function (can_1, can_2) {
        // return can_1[field] - can_2[field];
        if (can_2[field] > can_1[field]) {
            return 1;
        }
        if (can_2[field] < can_1[field]) {
            return -1;
        }
        return 0;
    })
    renderContact();
}
function main(){
    init();
    renderContact();
}
main();