let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function buildToyCard(object){
  const toyCollection = document.querySelector('#toy-collection');
  const newToyDiv = document.createElement('div');
  const likeBtn = document.createElement('button');
  const likeParagraph = document.createElement('p');
  likeBtn.className ='like-btn';
  likeBtn.id = `${object['id']}`;
  likeBtn.innerText = 'Like ❤️';
  likeParagraph.innerText = `${object['likes']} Likes`
  newToyDiv.className ='card'
  newToyDiv.innerHTML = `
    <h2>${object['name']}</h2>
    <img src="${object['image']}" class="toy-avatar" />`;
  newToyDiv.appendChild(likeParagraph);
  newToyDiv.appendChild(likeBtn)
  likeBtn.addEventListener('click', updateLikes);
  toyCollection.appendChild(newToyDiv);
};

fetch('http://localhost:3000/toys')
.then(resp => resp.json())
.then(arr => arr.forEach(buildToyCard))
.catch(err=>console.log(err));

const submitForm = document.querySelector('.add-toy-form');
submitForm.addEventListener('submit', e=>{
  e.preventDefault();
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers:{
      "Content-Type": "application/json", 
      Accept: "application/json"
    },
    body: JSON.stringify({
      'name': submitForm.name.value,
      'image': submitForm.image.value,
      'likes': 0
    })
  })
  .then(resp => resp.json())
  .then(buildToyCard)
  .catch(err => console.log(err));
  submitForm.reset()
});

function updateLikes(e){
  let currentLikes = parseInt(e.target.previousElementSibling.innerText, 10);
  let newNumberOfLikes = currentLikes + 1;
  fetch(`http://localhost:3000/toys/${e.target.id}`,{
    method: 'PATCH',
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": newNumberOfLikes
    })
  })
  .then(resp => resp.json())
  .then(()=>{
    e.target.previousElementSibling.innerText =  `${newNumberOfLikes} Likes`
  })
  .catch(err => console.log(err))
}

