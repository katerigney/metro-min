const main = () => {
  document.querySelector('h1').textContent += '?'
}
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
      
      // var address_of_cell = 'A1'
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet));
    }

    req.send();
    }

document.addEventListener('DOMContentLoaded', main)
