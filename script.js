// DOM stuff

const sectionContactList = document.querySelector('.contact-list');

document.getElementById("send").addEventListener("click", sendNewUser);



// Sending new user
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
    .then(renderListItem);
}

// Delete user
function deleteUser(userId) {
  fetch("https://contact-agenda-rest-api.herokuapp.com/users/" + userId, {
    method: "DELETE",
  });
}

// Edit user

// function editUser(userId) {
//   const newUser = {
//     first_name: document.getElementById("fName").value,
//     last_name: document.getElementById("lName").value,
//     mobile: document.getElementById("phoneNr").value,
//     address: {
//       street: document.getElementById("street").value,
//       number: document.getElementById("number").value,
//       city: document.getElementById("city").value,
//       country: document.getElementById("country").value
//     }
//   };

//   fetch("https://contact-agenda-rest-api.herokuapp.com/users/" + userId, {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     method: "PUT",
//     body: JSON.stringify(newUser),
//   })
//   .then(processResponse)
//   .then(editUserRender);
// }

// Edit logic

function editUserRender() {
  document.getElementById("send").value = 'Update';
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
  paragraphName.innerText = `${userData.last_name} ${userData.first_name}`;
  divName.appendChild(paragraphName);

  if(userData.mobile.length != 0){
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

  if(userData.address.street != 0 || userData.address.number.length != 0 ||userData.address.city.length != 0 || userData.address.country.length != 0 ) {
    const divHome = document.createElement('div');
    divHome.classList.add('home-div');
    divContactInfo.appendChild(divHome);
  
    const imgHome = document.createElement('img');
    imgHome.alt = 'phone';
    imgHome.src = './img/home-address.png';
    divHome.appendChild(imgHome);
  
    const paragraphHome = document.createElement('p');
    paragraphHome.innerText = `${userData.address.street} ${userData.address.number}, ${userData.address.city}, ${userData.address.country}`;
    divHome.appendChild(paragraphHome);
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

  imgEdit.addEventListener('click', () =>{
    editUserRender();
    console.log(this.id);
  });

  imgDelete.addEventListener("click", function () {
    deleteUser(userData.id);
    setTimeout(() => {
      location.reload();
    }, 500);
  });
}




// Helper function 

function processResponse(response) {
  return response.json();
}


function getUsers() {
  fetch("https://contact-agenda-rest-api.herokuapp.com/users")
  .then(processResponse)
  .then(renderUsers);
}

function renderUsers(data) {
  for (const user of data) {
    renderListItem(user);
  }
}

getUsers();


