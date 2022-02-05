// DOM stuff

const sectionContactList = document.querySelector('.contact-list');
const sendUser = document.getElementById('send');
const updateUser = document.getElementById('update')

sendUser.addEventListener("click", sendNewUser);
document.addEventListener('DOMContentLoaded', getUsers)
updateUser.addEventListener("click", editUser);

// Get Users

function getUsers() {
  fetch("https://contact-agenda-rest-api.herokuapp.com/users")
  .then(processResponse)
  .then(renderUsers)
  .then(cleanInputs);
}

// Send User

function sendNewUser() {
  if(document.getElementById('fName').value.length == 0 || document.getElementById('lName').value.length == 0){
    return;
    }

  const newUser = {
    first_name: document.getElementById("fName").value,
    last_name: document.getElementById("lName").value,
    mobile: document.getElementById("phoneNr").value,
    address: {
      street: document.getElementById("street").value,
      number: document.getElementById("number").value,
      city: document.getElementById("city").value,
      country: document.getElementById("country").value
    }
  };

  fetch("https://contact-agenda-rest-api.herokuapp.com/users", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newUser),
  })
    .then(processResponse)
    .then(renderListItem)
    .then(cleanInputs);
}

// Delete User

function deleteUser(userId) {
  fetch("https://contact-agenda-rest-api.herokuapp.com/users/" + userId, {
    method: "DELETE",
  });
}

// Edit User
function editUser() {
  const userid = document.getElementById("userid").value

  const newUser = {
    first_name: document.getElementById("fName").value,
    last_name: document.getElementById("lName").value,
    mobile: document.getElementById("phoneNr").value,
    address: {
      street: document.getElementById("street").value,
      number: document.getElementById("number").value,
      city: document.getElementById("city").value,
      country: document.getElementById("country").value
    }
  };

  fetch("https://contact-agenda-rest-api.herokuapp.com/users/" + userid, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(newUser),
  })
  .then(cleanUserList)
  .then(getUsers)
  .then(cleanInputs);
}

// Edit functionality
function editUserRender(userData) {
  document.getElementById("userid").value = userData.id;

  const inputsClear = ['lName', 'fName', 'phoneNr', 'street', 'number', 'city', 'country'];
  for(const element of inputsClear){
    document.getElementById(element).value = '';
  }

  document.getElementById("lName").value = userData.first_name;
  document.getElementById("fName").value = userData.last_name;
  if(userData['mobile']) document.getElementById("phoneNr").value = userData.mobile;
  if(userData['address']){
    if(userData.address['street']) document.getElementById("street").value = userData.address.street;
    if(userData.address['number']) document.getElementById("number").value = userData.address.number;
    if(userData.address['city']) document.getElementById("city").value = userData.address.city;
    if(userData.address['country']) document.getElementById("country").value = userData.address.country;
  }
  sendUser.style.display = "none";
  updateUser.style.display = "block";
}

// Render / display info
function renderListItem(userData) {

  const divList = document.createElement('div');
  divList.classList.add('list-item');
  divList.setAttribute('id', `${userData.id}`)
  sectionContactList.appendChild(divList);

  const divContactInfo = document.createElement('div');
  divContactInfo.classList.add('contact-info');
  divList.appendChild(divContactInfo);
  
  const divName = document.createElement('div');
  divName.classList.add('name-div');
  divContactInfo.appendChild(divName);

  const imgUser = document.createElement('img');
  imgUser.alt = 'user';
  imgUser.src = './img/user.png';
  divName.appendChild(imgUser);

  const paragraphName = document.createElement('p');
  paragraphName.innerText = `${userData.first_name} ${userData.last_name}`;
  divName.appendChild(paragraphName);

  if(userData['mobile']){
    const divPhone = document.createElement('div');
    divPhone.classList.add('phone-div');
    divContactInfo.appendChild(divPhone);
  
    const imgPhone = document.createElement('img');
    imgPhone.alt = 'phone';
    imgPhone.src = './img/chat.png';
    divPhone.appendChild(imgPhone);
  
    const paragraphPhone = document.createElement('p');
    paragraphPhone.innerText = `${userData.mobile}`;
    divPhone.appendChild(paragraphPhone);
  }

  if(userData['address']){
    const divHome = document.createElement('div');
    divHome.classList.add('home-div');
    divContactInfo.appendChild(divHome);

    const imgHome = document.createElement('img');
    imgHome.alt = 'address home';
    imgHome.src = './img/home-address.png';
    divHome.appendChild(imgHome);

    const paragraphHome = document.createElement('p');
    divHome.appendChild(paragraphHome);

    if(userData.address['street']) {paragraphHome.innerText = `${userData.address.street}`;}
    if(userData.address['number']) {paragraphHome.innerText += ` ${userData.address.number} `;}
    if(userData.address['city']) {paragraphHome.innerText += ` ${userData.address.city}`;}
    if(userData.address['country']) {paragraphHome.innerText += ` ${userData.address.country}`;}
  }

  const divEditDelete = document.createElement('div');
  divEditDelete.classList.add('edit-delete');
  divList.appendChild(divEditDelete);

  const imgEdit = document.createElement('img');
  imgEdit.setAttribute('id', `${userData.id}`)
  imgEdit.classList.add('edit-button');
  imgEdit.src = './img/edit.png';
  imgEdit.alt = 'edit';
  divEditDelete.appendChild(imgEdit);

  const imgDelete = document.createElement('img');
  imgDelete.src = './img/trash-bin.png';
  imgDelete.alt = 'delete';
  divEditDelete.appendChild(imgDelete);

  imgEdit.addEventListener('click', () => {
    editUserRender(userData);
  });

  imgDelete.addEventListener("click", function () {
    deleteUser(userData.id);
    setTimeout(() => {
      location.reload();
    }, 500);
  });
}

// Helper functions

function processResponse(response) {
  return response.json();
}

function renderUsers(data) {
  for (const user of data) {
    renderListItem(user);
  }
}

function cleanUserList() {
  let elements = document.querySelectorAll('.list-item');
  for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
  }
}

function cleanInputs() {
  document.getElementById("fName").value = '';
  document.getElementById("lName").value = '';
  document.getElementById("phoneNr").value = '';
  document.getElementById("street").value = '';
  document.getElementById("number").value = '';
  document.getElementById("city").value = '';
  document.getElementById("country").value = '';
  sendUser.style.display = "block";
  updateUser.style.display = "none";
}


