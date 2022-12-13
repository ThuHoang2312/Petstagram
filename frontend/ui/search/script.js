"use strict";

//import { url } from "../config.js";
const url = "http://localhost:3000";
import logOut from "../logout.js";

const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");
const loginUser = JSON.parse(user);

//if user does not login yet, redirect back to login page
if (!token && !user) {
  location.href = "../home/index.html";
}

const query = document.querySelector("#query");
const option = document.querySelector("#search_selector");
const search = document.querySelector("#search_list");
const form = document.querySelector("#search_form");

let getPhotoByTag;
let getUserByUsername;

/*-- Display username --*/

//Select existing html elements
if (token && user) {
  const img = document.querySelector(".user-wrapper img");
  if (loginUser.avatar == null) {
    img.src = "../../assets/user_icon.png";
  } else {
    img.src = url + "/" + loginUser.avatar;
  }
  const h4 = document.querySelector(".user-wrapper h4");
  h4.innerHTML = loginUser.username;

  img.addEventListener("click", () => {
    location.href = `../profile/profile.html?id=${loginUser.user_id}`;
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
    div.classList.add("photo_lib");
    const img = document.createElement("img");
    img.src = url + "/" + photo.filename;
    img.alt = photo.description;

    const p = document.createElement("p");
    p.innerHTML = photo.description;

    div.appendChild(img);
    div.appendChild(p);
    search.appendChild(div);
    div.addEventListener("click", () => {
      location.href = `../post/single.html?id=${photo.photo_id}`;
    });
  });
};

/*-- Display search user result --*/

const createUserCards = (users) => {
  //clear ui
  search.innerHTML = "";
  if (users.length < 1) {
    console.log("no users found");
    const h2 = document.createElement("h2");
    h2.innerHTML = "No result found. Please try another one!";
    search.appendChild(h2);
    return;
  }

  users.forEach((user) => {
    if (user < 1) {
      console.log("user not exist");
      return;
    }

    const result = document.createElement("div");
    result.classList.add("result");

    const img = document.createElement("img");
    if (user.avatar == null) {
      img.src = "../../assets/user_icon.png";
    } else {
      img.src = url + "/" + user.avatar;
    }
    img.alt = user.username;

    const username = document.createElement("p");
    username.innerHTML = user.username;

    result.appendChild(img);
    result.appendChild(username);
    search.appendChild(result);

    result.addEventListener("click", () => {
      location.href = `../profile/profile.html?id=${user.user_id}`;
    });
  });
};

//Search form
form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  console.log("value is: ", option.value);
  console.log("query is: ", query.value);

  if (option.value == "user") {
    getUserByUsername = async () => {
      try {
        const fetchOptions = {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };
        const response = await fetch(
          url + "/search/username/" + query.value,
          fetchOptions
        );
        const users = await response.json();
        console.log(users);
        if (users.message) {
          alert(`Sorry, there is no ${query.value} available at this moment.`);
          return;
        }
        createUserCards(users);
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserByUsername();
  } else if (option.value == "photoDescription") {
    getPhotoByTag = async () => {
      try {
        const fetchOptions = {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };
        const response = await fetch(
          url + "/search/photo/" + query.value,
          fetchOptions
        );
        const photos = await response.json();
        console.log(photos);
        if (photos.length == 0) {
          alert(
            `Sorry, there is no photo available with "${query.value}" description at this moment. Please try to search for another topic. Good luck.`
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

/*-- Hambuger menu --*/

const menu_toggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menu_toggle.addEventListener("click", () => {
  menu_toggle.classList.toggle("is-active");
  sidebar.classList.toggle("is-active");
});

/*-- Log out --*/
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});
