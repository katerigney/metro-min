// Declaring necessary variables.
const foundIDs = [];
const leaderInfo = [];
const API_KEY = "34374832f4d2a48753f354e125a4bf";
let zipInput;
let radInput;
let countInput;

let zip = 33556;
let radius = 5;
const params = {
  zipCode: zip,
  distRadius: radius,
  count: 3
};

console.log(params);

// COMMENTING MODAL

// Open the modal
const modal = document.querySelector('#modal-container');

const testButton = () => {
  modal.style.display = "block";
}

const closeModal = () => {
  modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Main function runs when page loads
// Initializes all necessary DOM elements for search.
const main = () => {
  zipInput = document.querySelector(".zipCode");
  radInput = document.querySelector(".radius");
  countInput = document.querySelector(".count");
}

const locationSearch = (event) => {
  params.zipCode = zipInput.value;
  params.distRadius = radInput.value;
  params.count = countInput.value;
  getGroups(params);
}

const getGroups = (paramsObj) => {
  console.log(paramsObj);
  const searchUrl = `https://api.meetup.com/find/groups?key=${API_KEY}&sign=true&photo-host=public${paramsObj.zipCode ? `&zip=${paramsObj.zipCode}` : ""}${paramsObj.distRadius ? `&radius=${paramsObj.distRadius}` : ""}${ paramsObj.count ? `&page=${paramsObj.count}` : "&page=5"}`;

  $.ajax({ 
    type:"GET", // GET = requesting data
    url: searchUrl, 
    success: function(data) {
      console.log(data);
      data.data.forEach((group) => {
        foundIDs.push(group.organizer.id);
      });
    },
    // error: function()
    dataType: 'jsonp',
  }).then((data2) => {
    for(let i = 0; i < foundIDs.length; i++) {
      getUser(foundIDs[i]);
    }
  });
}

const getUser = (id) => {
  $.ajax({ 
    type:"GET", // GET = requesting data
    url:`https://api.meetup.com/2/member/${id}?key=${API_KEY}&sign=true&photo-host=public&fields=messaging_pref&page=20`, 
    success: function(data) {
      if(data.messagable === true) {
        data.rating = 0;
        data.changeRate = function() {
          // Using a normal function changes the this binding.
          // TODO: connect a input field to this function and collect the value.
          console.log(this.rating);
        }
        data.changeRate();
        leaderInfo.push(data);
      }
    },
    // error: function()
    dataType: 'jsonp',
  });
}

// This will need to exist on the individual object.
// We can refactor it later after the data gets put together.
// const changeRating = (rate) => {
//   console.log(this.rating);
// }

document.addEventListener('DOMContentLoaded', main);

// TODO: Create function that builds each individual line item.
// Will get called when API data is collected/pulled.