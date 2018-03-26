// Declaring necessary variables.
const foundIDs = [];
const foundGroups = [];
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


// Main function runs when page loads Initializes all necessary DOM elements for
// search.
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
  const searchUrl = `https://api.meetup.com/find/groups?key=${API_KEY}&sign=true&photo-host=public${paramsObj.zipCode
    ? `&zip=${paramsObj.zipCode}`
    : "&zip=33602"}${paramsObj.distRadius
      ? `&radius=${paramsObj.distRadius}`
      : ""}${paramsObj.count
        ? `&page=${paramsObj.count}`
        : "&page=2"}`;

  $.ajax({
    type: "GET", // GET = requesting data
    url: searchUrl,
    success: function (data) {
      data
        .data
        .forEach((group) => {
          foundIDs.push(group.organizer.id);
          foundGroups.push(group.name);
        });
    },
    // error: function()
    dataType: 'jsonp'
  }).then((data2) => {
    console.log("getting groups", data2)
    const _data = data2.data;
    // create array for all the promies,
    const _tasks = _data.map((item, index) => {
      // console.log(index);
      return getUser(item.organizer.id, index);
    });
    console.log(_tasks)
    Promise
      .all(_tasks)
      .then((done) => {
        console.log("we are done")
        addLineItemContainer();
      });

  }).then()
}

const getUser = (id, ind) => {
  return new Promise((resolve, failure) => {
    $.ajax({
      type: "GET", // GET = requesting data
      url: `https://api.meetup.com/2/member/${id}?key=${API_KEY}&sign=true&photo-host=public&fields=messaging_pref&page=20`,
      dataType: 'jsonp',
      success: function (data) {
        console.log(ind);
        data.groupName = foundGroups[ind];
        if (data.messagable === true) {
          leaderInfo.push(data);
        }
        resolve();
      },
      error: failure
    });
  })
}

//this needs to be a part of the for loop!

// Create function that builds each individual line item.
const addLineItemContainer = () => {
  for (let i = 0; i < leaderInfo.length; i++) {
    let parent = document.querySelector(".feed-container");
    let section = document.createElement('section');
    parent.appendChild(section);
    section
      .classList
      .add("lineItemContainer");
    // addDataToRow();
    console.log("looping", leaderInfo[i].name); 
    let parent2 = document.querySelector(".lineItemContainer");
    let section2 = document.createElement('section');
    parent2.appendChild(section2);
    section2.classList.add("lineItemPropertyContainer");

    name(i, section2);
    org(i, section2);
    locationDisplay(i, section2);
    contact(i, section2);

  }
}

// location = city
//contact = member URL
// org/affiliation = category.name

const name = (index,section) => {
  let insertText = leaderInfo[index].name;
  addText(insertText,section);
}

const org = (index,section) => {
  console.log(index, leaderInfo[index])
  let insertText = leaderInfo[index].groupName;
  addText(insertText,section);
}

const locationDisplay = (index,section) => {
  let insertText = leaderInfo[index].city;
  addText(insertText,section);
  console.log(insertText)
}

const contact = (index,section) => {
  let insertText = leaderInfo[index].link;
  addText(insertText,section);
  console.log(insertText)
}


const addText = (insertText, section) => {
  let newText = createNode('p')
  console.log(newText)
  newText.textContent = insertText;
  append(section, newText);
}

const createNode = (element) => {
  return document.createElement(element)
}

const append = (parent, el) => {
  return parent.appendChild(el);
}

// COMMENTING MODAL Open the modal
const modal = document.querySelector('#modal-container');

const testButton = () => {
  modal.style.display = "block";
}

const closeModal = () => {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', main);
