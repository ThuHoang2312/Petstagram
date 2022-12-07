"use strict";

import { url } from "../config.js";
import logOut from "../logout.js";

const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");

const query = document.querySelector("#query");
const option = document.querySelector("#search_selector");
const search = document.querySelector("#search_list");
const form = document.querySelector("#search_form");

let getPhotoByTag;
let getUserByUsername;

/*-- Display username --*/
//Select existing html elements
const userInfo = document.querySelector(".user-profile");
if (token && user) {
  const p = createElement("p");
  p.innerHTML = user.username;
  const img = createElement("img");
  img.src = url + "/" + user.avatar;
  img.alt = user.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `profile.html?id=${user.user_id}`;
  });
}

/*-- Display search photo result --*/
const createPhotoCards = (photos) => {
  //clear ui
  search.innerHTML = "";
  if (photos.length < 1) {
    console.log("no photos");
    return;
  }

  photos.forEach((photo) => {
    //Create li with DOM
    if (photo < 1) {
      console.log("no photos");
      return;
    }
    const div = document.createElement("div");
    div.classList.add = "result";
    const img = document.createElement("img");
    img.src = url + "/" + photo.filename;
    img.alt = photo.description;

    const p = document.createElement("p");
    p.innerHTML = photo.description;

    div.appendChild(img);
    div.appendChild(p);
    search.appendChild(div);
    div.addEventListener("click", () => {
      location.href = `single.html?id=${photo.photo_id}`;
    });
  });
};

/*-- Display search user result --*/
const createUserCards = (users) => {
  //clear ui
  search.innerHTML = "";
  if (users.length < 1) {
    console.log("no users found");
    return;
  }

  users.forEach((user) => {
    if (user < 1) {
      console.log("user not exist");
      return;
    }

    const div = document.createElement("div");
    div.classList.add = "result";

    const img = document.createElement("img");
    img.src = url + "/user" + user.avatar;
    img.alt = user.username;

    const username = document.createElement("p");
    username.textContent = user.username;

    div.appendChild(img);
    div.appendChild(username);
    search.appendChild(div);

    div.addEventListener("click", () => {
      location.href = `profile.html?id=${user.user_id}`;
    });
  });
};

//Search form
form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  console.log("value is: ", option.value);
  console.log("query is: ", query.value);

  if (option.value == "username") {
    getUserByUsername = async () => {
      try {
        const fetchOptions = {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };
        const response = await fetch(
          url + "/search/user" + query.value,
          fetchOptions
        );
        const users = await response.json();
        console.log(users);
        if (activities.message) {
          alert(`Sorry, there is no ${query.value} available at this moment.`);
          return;
        }
        createUserCard(users);
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserByUsername();
  } else if (option.value == "tag") {
    getPhotoByTag = async () => {
      try {
        const fetchOptions = {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };
        const response = await fetch(
          url + "/photo/" + query.value,
          fetchOptions
        );
        const photos = await response.json();
        console.log(photos);
        if (photos.message) {
          alert(
            `Sorry, there is no photo available with ${query.value} tag at this moment. Please try to search for another topic. Good luck.`
          );
          return;
        }
        createPhotoCards(photos);
      } catch (e) {
        console.log(e.message);
      }
    };
    getPhotoByTag();
  }
});

const menu = document.querySelector(".menu");
const navLink = document.querySelector(".side-nav");
const closeMenu = document.querySelector(".close-menu");

menu.addEventListener("click", () => {
  navLink.classList.add(open);
  navLink.classList.remove(close);
});

closeMenu.addEventListener("click", () => {
  navLink.classList.add("close");
  navLink.classList.remove("open");
});

//logout function
const logOutButton = document.getElementById("logout");
logOutButton.addEventListener("click", () => {
  logOut();
});
