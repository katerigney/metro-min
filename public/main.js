// Declaring necessary variables.
const foundIDs = [];
const foundGroups = [];
let leaderInfo = [];
const API_KEY = "3a3d332036327b42594f404c37282d1c";
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
      // console.log(data)
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
    // console.log("getting groups", data2)
    const _data = data2.data;
    // create array for all the promies,
    const _tasks = _data.map((item, index) => {
      return getUser(item.organizer.id, index);
    });
    // console.log(_tasks)
    Promise
      .all(_tasks)
      .then((done) => {
        // console.log("we are done")
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
        // console.log(ind);
        data.groupName = foundGroups[ind];
        data.rating = 0;
        data.changeRate = function(val) {
          // Using a normal function changes the this binding.
          // console.log(`${this.rating} is being replaced with ${val}`);
          this.rating = Number(val);
        }
        data.DOMElements = {};
        // Not very DRY, but we can worry about that later.
        data.DOMElements.rating = createDOMElement("input", "", "number");
        data.DOMElements.rating.setAttribute("min", 0);
        data.DOMElements.rating.setAttribute("max", 5);
        data.DOMElements.rating.setAttribute("value", 0);
        data.DOMElements.rating.addEventListener("input", (e) => {
          data.changeRate(e.target.value);
        });

        data.DOMElements.contact = createDOMElement("a",data.link, data.link);
        data.DOMElements.location = createDOMElement("p", data.city);
        data.DOMElements.org = createDOMElement("p", data.groupName);
        data.DOMElements.name = createDOMElement("p", data.name);
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
  let parent = document.querySelector(".feed-container");
  parent.innerHTML = "";
  for (let i = 0; i < leaderInfo.length; i++) {
    let section = document.createElement('section');
    parent.appendChild(section);
    section
      .classList
      .add("lineItemContainer");
    // console.log("looping", leaderInfo[i].name);
    section.appendChild(leaderInfo[i].DOMElements.name);
    section.appendChild(leaderInfo[i].DOMElements.org);
    section.appendChild(leaderInfo[i].DOMElements.location);
    section.appendChild(leaderInfo[i].DOMElements.contact);
    section.appendChild(leaderInfo[i].DOMElements.rating);
  }
}

// props: "rating", "city", "name",  and "groupName".
// dir: "asc", desc.
// Takes in the property and direction and returns a new leaderInfo array with the returned properties.

const sortLeaders = (prop, dir) => {
  let newArr = leaderInfo.sort((a,b) => {
    if(prop === "rating" && dir === "asc") {
      return Number(a[prop]) - Number(b[prop]);
    } else if (prop === "rating" && dir !== "asc") {
      return Number(b[prop]) - Number(a[prop]);
    }
    if(dir === "asc") {
      if(a[prop].toLowerCase() < b[prop].toLowerCase()) {
        return -1;
      } else if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if(a[prop].toLowerCase() > b[prop].toLowerCase()) {
        return -1;
      } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    }

  });
  leaderInfo = newArr;
  addLineItemContainer();
}


const name = (index, section) => {
  let insertText = leaderInfo[index].name;
  addText(insertText, section);
}

const org = (index, section) => {
  // console.log(index, leaderInfo[index])
  let insertText = leaderInfo[index].groupName;
  addText(insertText, section);
}

const locationDisplay = (index, section) => {
  let insertText = leaderInfo[index].city;
  addText(insertText, section);
  // console.log(insertText)
}

const contact = (index, section) => {
  let insertText = leaderInfo[index].link;
  addText(insertText, section);
  // console.log(insertText)
}

// Temp, replace with rating on leader object.
const rating = (section) => {
  let insertText = "placeholder rating";
  addText(insertText, section);
  // console.log(insertText)
}


const addText = (insertText, section) => {
  let newText = createNode('p')
  // console.log(newText)
  newText.textContent = insertText;
  append(section, newText);
}

const createNode = (element) => {
  return document.createElement(element)
}

const append = (parent, el) => {
  return parent.appendChild(el);
}


// A short function I'm using to create DOM elements and place them on the leaders object.
const createDOMElement = (type, text, inputType ) => {
  let temp = document.createElement(type);
  if(type === "input") {
    temp.setAttribute("type", inputType);
  } else if(type === "a") {
    temp.setAttribute("href", inputType );
  }
  temp.textContent = text;
  return temp;
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
