const menuBtn = document.querySelector(".menu-btn");
const mobileLinks = document.querySelector(".links_mobile");
const closeBtn = document.querySelector(".close-menu");
const inputLink = document.querySelector(".shorten-input");
const errorText = document.querySelector(".error-text");
const shortenBtn = document.querySelector(".btn-shorten");
const shortenedLinksContainer = document.querySelector(".shortened_links");
let copyBtns;
let deleteBtns;
let links = [];
//Parse the links from local storage and switch them back to an array
const localStorageLinks = JSON.parse(localStorage.getItem("links"));

// Functions
const copyToClipboard = () => {
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      /*copyBtns.forEach((btn) => {
        btn.textContent = "Copy";
        btn.style.backgroundColor = "hsl(180, 66%, 49%)";
        btn.style.color = "white";
      });
      */
      // Copy link to clipboard
      const link = e.target.parentElement.querySelector("a");
      navigator.clipboard.writeText(link.textContent);
      e.target.textContent = "Copied!";
      e.target.style.backgroundColor = "hsl(257, 27%, 26%)";
      e.target.style.color = "white";

      // Reset button text and color after 2 seconds
      setTimeout(() => {
        e.target.textContent = "Copy";
        e.target.style.backgroundColor = "hsl(180, 66%, 49%)";
        e.target.style.color = "white";
      }, 2000);
    });
  });
};

const deleteLink = () => {
  deleteBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      links.splice(index, 1);
      localStorage.setItem("links", JSON.stringify(links));
      // Remove link from the DOM
      //First parentElement is the div with class new_link, second parentElement is the div with class shortened_link
      btn.parentElement.parentElement.remove();
    });
  });
};
const renderLink = (linkSent, linkRecieved) => {
  const html = `<div class="shortened_link">
  <p>${linkSent}</p>
  <div class="new_link">
    <a href='${linkRecieved}'>${linkRecieved}</a>
    <button class="btn btn-copy">Copy</button>
    <button class="btn btn-delete"><i class="fa-solid fa-trash"></i></button>
  </div>`;
  shortenedLinksContainer.insertAdjacentHTML("afterbegin", html);
  copyBtns = document.querySelectorAll(".btn-copy");
  deleteBtns = document.querySelectorAll(".btn-delete");
  deleteLink();
  copyToClipboard();
};

const shortenLink = async () => {
  try {
    const url = inputLink.value;
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=` + encodeURIComponent(url)
    );
    const data = await response.text();
    // Add link object with original link and shortened link to links array and local storage
    links.push({ url, data });
    localStorage.setItem("links", JSON.stringify(links));
    // Clear input field and error message
    errorText.textContent = "";
    inputLink.value = "";
    renderLink(url, data);
  } catch (err) {
    errorText.textContent = "Please enter a valid URL";
  }
};
// Event Listeners
menuBtn.addEventListener("click", () => {
  mobileLinks.classList.toggle("hidden");
});

closeBtn.addEventListener("click", () => {
  mobileLinks.classList.add("hidden");
});

// Check if there are links in local storage and render them
if (localStorageLinks) {
  // If there are links in local storage, assign them to the links array and render them
  links = localStorageLinks;
  links.forEach((link) => {
    renderLink(link.url, link.data);
  });
}

shortenBtn.addEventListener("click", shortenLink);
