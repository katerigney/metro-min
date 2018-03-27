// Declaring necessary variables.
const foundIDs = [];
const foundGroups = [];
const leaderInfo = [];
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
      console.log(data)
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
        data.rating = 0;
        data.changeRate = function(val) {
          // Using a normal function changes the this binding.
          // TODO: connect a input field to this function and collect the value.
          console.log(`${this.rating} is being replaced with ${val}`);
          this.rating = val;
        }
        // 
        data.DOMElements = {};
        // Not very DRY, but we can worry about that later.
        data.DOMElements.rating = createDOMElement("input", "", "number");
        data.DOMElements.rating.setAttribute("min", 0);
        data.DOMElements.rating.setAttribute("max", 5);
        data.DOMElements.rating.setAttribute("value", 0);
        
        data.DOMElements.contact = createDOMElement("a",data.link, data.link);
        data.DOMElements.location = createDOMElement("p", data.city);
        data.DOMElements.org = createDOMElement("p", data.groupName);
        data.DOMElements.name = createDOMElement("p", data.name);
        // data.changeRate();
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
    // for (let i = 0; i < leaderInfo.length; i++) {
    //   let parent2 = document.querySelector(".lineItemContainer");
    //   let section2 = document.createElement('section');
    //   parent2.appendChild(section2);
    //   section2.classList.add("lineItemPropertyContainer");

    section.appendChild(leaderInfo[i].DOMElements.name);
    section.appendChild(leaderInfo[i].DOMElements.org);
    section.appendChild(leaderInfo[i].DOMElements.location);
    section.appendChild(leaderInfo[i].DOMElements.contact);
    section.appendChild(leaderInfo[i].DOMElements.rating);
      // name(i, section);
      // org(i, section);
      // locationDisplay(i, section);
      // contact(i, section);
      // rating(section);
    // }
  }
}



const name = (index, section) => {
  let insertText = leaderInfo[index].name;
  addText(insertText, section);
}

const org = (index, section) => {
  console.log(index, leaderInfo[index])
  let insertText = leaderInfo[index].groupName;
  addText(insertText, section);
}

const locationDisplay = (index, section) => {
  let insertText = leaderInfo[index].city;
  addText(insertText, section);
  console.log(insertText)
}

const contact = (index, section) => {
  let insertText = leaderInfo[index].link;
  addText(insertText, section);
  console.log(insertText)
}

// Temp, replace with rating on leader object.
const rating = (section) => {
  let insertText = "placeholder rating";
  addText(insertText, section);
  console.log(insertText)
}


const addText = (insertText, section) => {
  let newText = createNode('h6')
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
  // data.DOMElements.rating = document.createElement(type);
  // data.DOMElements.rating.setAttribute("type", "number");
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

//converts Gov Data excel file to Json 
function Upload() {
    console.log("made it to the upload function")
    var url = document.getElementById("fileUpload").value;
    var newUrl = url.replace(/^.*[\\\/]/, '')
    console.log(newUrl)
    // var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx)$/;
    // if (regex.test(url.toLowerCase())) {
        if (typeof (XMLHttpRequest) != "undefined")

    // var url = "test.xlsx";

    /* set up async GET request */
    var req = new XMLHttpRequest();
    req.open("GET",newUrl , true);
    req.responseType = "arraybuffer";

    req.onload = function (e) {
      var arraybuffer = req.response;

      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for(var i=0; i != data.length; i++) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");

      var workbook = XLSX.read(bstr, { type: "binary" });

      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet));
    }

    req.send();
    }

