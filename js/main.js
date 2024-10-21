var siteName = document.getElementById("markName");
var siteUrl = document.getElementById("markURL");
var submitBtn = document.getElementById("submitBtn");
var tableBody = document.getElementById("tableBody");
var siteArray = [];
var deleteBtns;
var visitBtns;
var boxModal = document.querySelector(".box-container");
var closeBtn = document.getElementById("closeBtn");

// Local Storage check
if (localStorage.getItem("site")) {
  siteArray = JSON.parse(localStorage.getItem("site"));
  for (var x = 0; x < siteArray.length; x++) {
    displayBookmark(x);
  }
}

// Submit button event
submitBtn.addEventListener("click", function () {
  if (
    siteName.classList.contains("is-valid") &&
    siteUrl.classList.contains("is-valid")
  ) {
    
    if (isDuplicate(siteName.value, siteUrl.value)) {
      boxModal.classList.remove("d-none");
      return;
    }
    var bookmark = {
      siteName: capitalize(siteName.value),
      siteUrl: siteUrl.value,
    };
    siteArray.push(bookmark);
    localStorage.setItem("site", JSON.stringify(siteArray));
    displayBookmark(siteArray.length - 1);
    clearInput();
    siteName.classList.remove("is-valid");
    siteUrl.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
});

// Duplication Check
function isDuplicate(name, url) {
  for (var i = 0; i < siteArray.length; i++) {
    if (
      siteArray[i].siteName.toLowerCase() === name.toLowerCase() ||
      siteArray[i].siteUrl.toLowerCase() === url.toLowerCase()
    ) {
      return true;
    }
  }
  return false;
}

// Regex & Validation
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});
siteUrl.addEventListener("input", function () {
  validate(siteUrl, urlRegex);
});
function validate(element, regex) {
  var testRegex = regex;
  if (testRegex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

// Display
function displayBookmark(i) {
  var userURL = siteArray[i].siteUrl;
  var httpsRegex = /^https?:\/\//g;
  if (httpsRegex.test(userURL)) {
    validURL = userURL;
    fixedURL = validURL
      .split("")
      .splice(validURL.match(httpsRegex)[0].length)
      .join("");
  } else {
    var fixedURL = userURL;
    validURL = `https://${userURL}`;
  }
  var trs = `
              <tr>
                <td>${i + 1}</td>
                <td>${siteArray[i].siteName}</td>              
                <td>
                  <button class="btn btn-visit" data-index="${i}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                  </button>
                </td>
                <td>
                  <button class="btn btn-delete pe-2" data-index="${i}">
                    <i class="fa-solid fa-trash-can"></i>
                    Delete
                  </button>
                </td>
            </tr>
            `;
  tableBody.innerHTML += trs;

  // Click Event for Delete Button
  deleteBtns = document.querySelectorAll(".btn-delete");
  if (deleteBtns) {
    for (var j = 0; j < deleteBtns.length; j++) {
      deleteBtns[j].addEventListener("click", function (e) {
        dlete(e);
      });
    }
  }

  // Click Event for Visit Button
  visitBtns = document.querySelectorAll(".btn-visit");
  if (visitBtns) {
    for (var l = 0; l < visitBtns.length; l++) {
      visitBtns[l].addEventListener("click", function (e) {
        visitWebsite(e);
      });
    }
  }
}

// Delete
function dlete(e) {
  tableBody.innerHTML = "";
  var deletedIndex = e.target.dataset.index;
  siteArray.splice(deletedIndex, 1);
  for (var k = 0; k < siteArray.length; k++) {
    displayBookmark(k);
  }
  localStorage.setItem("site", JSON.stringify(siteArray));
}

// Visit
function visitWebsite(e) {
  var websiteIndex = e.target.dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(siteArray[websiteIndex].siteUrl)) {
    open(siteArray[websiteIndex].siteUrl);
  } else {
    open(`https://${siteArray[websiteIndex].siteUrl}`);
  }
}

//Close Modal
function closeModal() {
  boxModal.classList.add("d-none");
}
closeBtn.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closeModal();
  }
});
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-container")) {
    closeModal();
  }
});

// Clear
function clearInput() {
  siteName.value = "";
  siteUrl.value = "";
}

// Capitalize
function capitalize(str) {
  let strArr = str.split("");
  strArr[0] = strArr[0].toUpperCase();
  return strArr.join("");
}
