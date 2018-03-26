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
    : ""}${paramsObj.distRadius
      ? `&radius=${paramsObj.distRadius}`
      : ""}${paramsObj.count
        ? `&page=${paramsObj.count}`
        : "&page=40"}`;

  $.ajax({
    type: "GET", // GET = requesting data
    url: searchUrl,
    success: function (data) {
      data
        .data
        .forEach((group) => {
          foundIDs.push(group.organizer.id);
        });
    },
    // error: function()
    dataType: 'jsonp'
  }).then((data2) => {
    console.log("getting groups", data2)
    const _data = data2.data;
    // create array for all the promies,
    const _tasks = _data.map((item) => {
        return getUser(item.organizer.id)
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

const getUser = (id) => {
  return new Promise((resolve, failure) => {
    $.ajax({
      type: "GET", // GET = requesting data
      url: `https://api.meetup.com/2/member/${id}?key=${API_KEY}&sign=true&photo-host=public&fields=messaging_pref&page=20`,
      dataType: 'jsonp',
      success: function (data) {
        if (data.messagable === true) {
          leaderInfo.push(data);
        }
        resolve();
      },
      error: failure
    });
  })

}

// Create function that builds each individual line item.
const addLineItemContainer = () => {
  //Make main container for Item line
  let parent = document.querySelector(".feed-container");
  let section = document.createElement('section');
  parent.appendChild(section);
  section.textContent = ("testing");
  section
    .classList
    .add("lineItemContainer");
  addDataToRow();
}

const addDataToRow = () => {
  console.log("Add Data Function started")
  console.log(leaderInfo);
  console.log(leaderInfo.length);
  //for each result, create a container for it
  for (let i = 0; i < leaderInfo.length; i++) {
    console.log("looping", leaderInfo[i].name); //<<<<<<<<<<<NOT SHOWING UP - ERROR WITH FOR LOOP?
    let parent = document.querySelector(".lineItemContainer");
    let section = document.createElement('section');
    parent.appendChild(section);
    section
      .classList
      .add("lineItemPropertyContainer");
    //then pull in the data
    const name = () => {
      let insertText = leaderInfo[i].name;
      addText(insertText, section);
    }
    //there will be more - contact, location, etc.

  }
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
