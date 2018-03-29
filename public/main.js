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
  console.log(zipInput);
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
          this.rating = Number(val);
        }
        // 
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
  let parent = document.querySelector(".feed-container");
  parent.innerHTML = "";
  for (let i = 0; i < leaderInfo.length; i++) {
    // let parent = document.querySelector(".feed-container");
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

// props: "rating", "city", "name",  and "groupName".
// dir: "asc", desc.
// Takes in the property and direction and returns a new leaderInfo array with the returned properties.

const sortLeaders = (prop, dir) => {
  console.log(leaderInfo[0][prop], dir);
  console.log(leaderInfo[1][prop], dir);
  let newArr = leaderInfo.sort((a,b) => {
    console.log(a,b);
    if(prop === "rating" && dir === "asc") {
      return Number(a[prop]) - Number(b[prop]);
    } else if (prop === "rating" && dir !== "asc") {
      return Number(b[prop]) - Number(a[prop]);
    }
    if(dir === "asc") {
      console.log(a,b);
      console.log(a[prop], b[prop]);
      // return a.name - b.name;
      if(a[prop].toLowerCase() < b[prop].toLowerCase()) {
        return -1;
      } else if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    } else {
      // return b.name - a.name;
      if(a[prop].toLowerCase() > b[prop].toLowerCase()) {
        return -1;
      } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    }

  });
  // console.log(newArr);
  leaderInfo = newArr;
  addLineItemContainer();
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
  let newText = createNode('h4')
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

////////
var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
function handleFile(e) {
  var files = e.target.files, f = files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    if(!rABS) data = new Uint8Array(data);
    var workbook = XLSX.read(data, {type:rABS  ? 'binary' : 'array'});

    /* DO SOMETHING WITH workbook HERE */
    console.log({workbook})
    var first_sheet_name = workbook.SheetNames[0];
      
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    let govdata = XLSX.utils.sheet_to_json(worksheet)
    console.log({govdata});
    convertGovData(govdata);
  };
  if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
}
document.querySelector("#fileUpload").addEventListener('change', handleFile, false);

  //FUNCTION to insert Gov Data into Data Format on Page

  const convertGovData =(govdata)=>{
    console.log("in convert govdata function" + govdata.length)
    for(let i=0; i < govdata.length; i++){
      //need condition to filter orgtype
      //need to trim company name
      //need to concat address, address1, statezip
      //trim statezip to separate FL?

      let govdataObj = {
        name: govdata[i].contactname,
        groupName: govdata[i].company,
        city: govdata[i].city,
        link: govdata[i].address,
        rating: 0,
        DOMElements: {},

      }
      // Not very DRY, but we can worry about that later.
      govdataObj.DOMElements.rating = createDOMElement("input", "", "number");
      govdataObj.DOMElements.rating.setAttribute("min", 0);
      govdataObj.DOMElements.rating.setAttribute("max", 5);
      govdataObj.DOMElements.rating.setAttribute("value", 0);
      
      govdataObj.DOMElements.contact = createDOMElement("a",govdataObj.link, govdataObj.link);
      govdataObj.DOMElements.location = createDOMElement("p", govdataObj.city);
      govdataObj.DOMElements.org = createDOMElement("p", govdataObj.groupName);
      govdataObj.DOMElements.name = createDOMElement("p", govdataObj.name);
      leaderInfo.push(govdataObj)
    }
    console.log(leaderInfo)
    addLineItemContainer();

  }

  document.addEventListener('DOMContentLoaded', main);