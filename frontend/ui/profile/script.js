"use strict";
//import { url } from "../config.js";
import logOut from "../logout.js";

const url = "http://localhost:3000";
const token = sessionStorage.getItem("token");
const loginUser = sessionStorage.getItem("user");

// get user data from session storage
const logInUser = JSON.parse(loginUser);
let userId;

//if user does not login yet, redirect back to login page
if (!token && !user) {
  location.href = "../login/login.html";
}

/*-- Display username and avatar of log In user--*/
//Select existing html elements
const userInfo = document.querySelector(".user-profile");
if (token && loginUser) {
  const p = document.createElement("p");
  p.innerHTML = logInUser.username;
  const img = document.createElement("img");
  if (logInUser.avatar == null) {
    img.src = "../../assets/avatar.jpg";
  } else {
    img.src = url + "/" + logInUser.avatar;
  }
  img.alt = logInUser.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `profile.html?id=${user.user_id}`;
  });
}

/*---------Display user's profile------------*/
//Get id on url
const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get(param));
  return urlParams.get(param);
};

if (getQParam("user_id") == null) {
  userId = logInUser.user_id;
} else {
  userId = getQParam("user_id");
}

//Get user and display info on profile section
(async function getUser() {
  try {
    const fetchOptions = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(url + `/user/${userId}`, fetchOptions);
    const user = await response.json();
    console.log(user);
    sessionStorage.setItem("user", JSON.stringify(user));

    //Display user's profile
    const profile = document.querySelector(".user-info");
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    const img = document.createElement("img");
    if (user.avatar == null) {
      img.src = "../../assets/avatar.jpg";
    } else {
      img.src = url + "/thumbnails" + user.avatar;
    }
    img.alt = user.username;

    const userDetail = document.createElement("div");
    userDetail.className = "user-detail";
    const userFollow = document.createElement("div");
    userFollow.className = "user-follow";
    const h2 = document.createElement("h2");
    h2.innerHTML = user.username;
    userFollow.appendChild(h2);
    if (!(logInUser.user_id === user.user_id)) {
      const button = document.createElement("button");
      button.className = "btn-follow";
      const span = document.createElement("span");
      span.innerHTML = "Follow";

      button.appendChild(span);
      userFollow.appendChild(button);
    }
    const description = document.createElement("p");
    description.innerHTML = user.description;

    avatar.appendChild(img);
    userDetail.appendChild(description);
    profile.appendChild(avatar);
    profile.appendChild(userDetail);
  } catch (e) {
    console.log(e.message);
  }
})();

//Toggle for follow account

// const followBtn = document.querySelector("btn-follow");
// followBtn.addEventListener("click", async (event) => {
//   event.preventDefault();
//   const fetchOptions =
//     followBtn.className === "btn-follow"
//       ? {
//           method: "POST",
//           headers: {
//             Authorization: "Bearer " + sessionStorage.getItem("token"),
//           },
//         }
//       : {
//           method: "DELETE",
//           headers: {
//             Authorization: "Bearer " + sessionStorage.getItem("token"),
//           },
//         };

//   try {
//     const response = await fetch(url + "/follow/user/" + userId, fetchOptions);
//   } catch (error) {
//     alert(error.message);
//   }
// });

//Update UI for follow button
//function updateFollow();

//Upload photo when it is the login user's profile page

const add = document.querySelector(".add");
if (!logInUser.user_id == userId) {
  add.style.display = "none";
}

const addPhotoOverlay = document.querySelector(".overlay");
const closeOverlay = document.querySelector(".overlay i");

//Append file name to text
document.getElementById("imagePosting").onchange = function () {
  const fileName = this.value.split("\\");
  document.getElementById("uploadImage").textContent =
    fileName[fileName.length - 1];
};

add.addEventListener("click", () => {
  addPhotoOverlay.classList.add("overlay-open");
});

closeOverlay.addEventListener("click", () => {
  addPhotoOverlay.classList.remove("overlay-open");
});

//Post Photo
const postPhoto = document.querySelector("#post-image");
postPhoto.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = new FormData(postPhoto);

  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: data,
  };

  const response = await fetch(url + "/photo", fetchOptions);
  console.log(response)
  const json = await response.json();
  alert(json.message);
});

/*---------Display the photo upload by user------------*/

//get photo by user id
const photoList = document.querySelector("#photo-lib");
const getPhotosByUser = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/photo/user/" + id, fetchOptions);
    const images = await response.json();
    console.log(images);
    if (images.length == 0) {
      const p = document.createElement("p");
      p.innerHTML = " No photo uploaded";
      photoList.appendChild(p);
    } else {
      createLibrary(photos);
    }
  } catch (e) {
    console.log(e.message);
  }
};

getPhotosByUser(userId);

//Display photo uploaded by user

// const photoList = document.querySelector("#photo-lib");
const createCard = (photos) => {
  photos.forEach((photo) => {
    const image = document.createElement("div");
    image.className = "single-image";
    const img = document.createElement("img");
    img.src = url + "/thumbnails" + photo.filename;
    img.alt = item.text;
    image.appendChild(img);
    photoList.appendChild(image);

    image.addEventListener("click", () => {
      location.href = `../post/single.html?id=${photo.photo_id}`;
    });
  });
};

/*---------Log out------------*/

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});
