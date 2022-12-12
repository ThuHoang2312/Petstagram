"use strict";
//import { url } from "../config.js";
import logOut from "../logout.js";
const url = "http://localhost:3000";

const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");
const userData = user && JSON.parse(user);
let userId;

//if user does not login yet, redirect back to front page
if (!token && !user) {
  location.href = "../home/index.html";
}

/*-- Display username and avatar of log In user--*/
//Select existing html elements
const userInfo = document.querySelector(".user-wrapper");
if (token && user) {
  const h4 = document.querySelector("h4");
  h4.innerHTML = userData.username;
  const img = document.querySelector(".user-wrapper img");
  if (userData.avatar == null) {
    img.src = "../../assets/user_icon.png";
  } else {
    img.src = url + "/" + userData.avatar;
  }
  img.alt = userData.username;

  userInfo.addEventListener("click", () => {
    location.href = `../profile/profile.html?id=${userData.user_id}`;
  });
}

/*---------Display user's profile------------*/
//get Id from param
const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

if (getQParam("id") == null) {
  userId = userData.user_id;
} else {
  userId = getQParam("id");
}
console.log("getQParam: ", getQParam("id"));

/*-- Get user by user Id --*/
const getUser = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/user/profile/" + id, fetchOptions);
    const userProfile = await response.json();
    createProfile(userProfile);
  } catch (e) {
    console.log(e.message);
  }
};
getUser(userId);

// Get follow status of the user
async function getFollowOfUser() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(
      url + "/follow/followStatus/" + userId,
      fetchOptions
    );
    const follow = await response.json();
    updateFollow(follow.message);
    console.log("follow status", follow.message);
  } catch (error) {
    alert(error.message);
  }
}
getFollowOfUser();

//update UI of heart Icon
function updateFollow(follow) {
  if (follow == true) {
    buttonFollow.innerHTML = "Following";
  } else {
    buttonFollow.innerHTML = "Follow";
  }
}

const buttonFollow = document.getElementById("btn-follow");
console.log("button Follow: ", buttonFollow);
buttonFollow.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log("button follow click");
  const fetchOptions =
    buttonFollow.innerHTML === "Follow"
      ? {
          method: "POST",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      : {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };

  try {
    const response = await fetch(url + "/follow/" + userId, fetchOptions);
    window.location.reload();

    if (response.status === 200) {
      getFollowOfUser();
      window.location.reload();
    }
  } catch (error) {
    alert(error.message);
  }
});

//console.log("getUser result: ", getUser(userId));

/*-- Create user profile section --*/
const profile = document.querySelector(".user-info");
const createProfile = (userProfile) => {
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  const img = document.createElement("img");
  if (userProfile.avatar == null) {
    img.src = "../../assets/user_icon.png";
  } else {
    img.src = url + "/" + userProfile.avatar;
  }
  img.alt = userProfile.username;

  const userDetail = document.createElement("div");
  userDetail.className = "user-detail";
  console.log(userDetail);

  const userFollow = document.createElement("div");
  userFollow.className = "user-follow";

  const h2 = document.createElement("h2");
  h2.innerHTML = userProfile.username;

  const description = document.createElement("p");
  if (user.description == null) {
    description.innerHTML = "No description available";
  } else {
    description.innerHTML = user.description;
  }
  avatar.appendChild(img);
  userDetail.appendChild(description);

  const followDiv = document.querySelector(".follow");
  console.log(followDiv);

  if (!(userData.user_id == userId)) {
    followDiv.style.display = "flex";
  } else {
    followDiv.style.display = "none";
  }

  if (userData.user_id == userProfile.user_id) {
    const addDiv = document.createElement("div");
    addDiv.className = "add";

    const addSpan = document.createElement("span");
    addSpan.innerHTML = "Add";
    const addIcon = document.createElement("i");
    addIcon.className = "bx bx-image-add";

    addDiv.appendChild(addSpan);
    addDiv.appendChild(addIcon);
    userFollow.appendChild(addDiv);

    const addPhotoOverlay = document.querySelector(".overlay");
    const closeOverlay = document.querySelector(".overlay i");

    addDiv.addEventListener("click", () => {
      addPhotoOverlay.classList.add("overlay-open");
    });

    closeOverlay.addEventListener("click", () => {
      addPhotoOverlay.classList.remove("overlay-open");
    });
  }

  userDetail.appendChild(h2);
  userDetail.appendChild(description);
  userDetail.appendChild(userFollow);
  profile.appendChild(avatar);
  profile.appendChild(userDetail);
  profile.appendChild(userFollow);
};

//Append file name to text
document.getElementById("imagePosting").onchange = function () {
  const fileName = this.value.split("\\");
  document.getElementById("uploadImage").textContent =
    fileName[fileName.length - 1];
};

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
  console.log(response);
  const json = await response.json();
  alert(json.message);
});

// const ul = document.querySelector("ul"),
//   tagInput = ul.querySelector("input"),
//   countTag = querySelector(".details span");
// let maxTags = 5,
//   tags = [];
// countTag();

// function countTag() {
//   countNumb.innerText = maxTags - tags.length;
// }

// function createTag() {
//   ul.querySelectorAll("li").forEach((li) => li.remove());
//   tags
//     .slice()
//     .reverse()
//     .forEach((tag) => {
//       let liTag = `<li>${tag}<i class="bx bx-x" onclick = remove(this, ${tag})></i></li>`;
//       ul.insertAdjacentHTML("afterbegin", liTag);
//     });
//   countTag();
// }

// function remove(item, tag) {
//   let index = tags.indexOf(tag);
//   tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
//   item.parentElement.remove();
//   countTag();
// }

// function addTag(e) {
//   if (e.key == "Enter") {
//     let tag = e.target.value.replace(/\s+/g, ""); //remove unwanted spaces from user tags
//     console.log(tag);
//     //If there is more than 1 tag and the tag is not exist already
//     if (tag.length > 1 && !tags.includes(tag)) {
//       if (tags.length < 5) {
//         tag.split(",").forEach((tag) => {
//           //split the tags by comma

//           //adding each tag to arrays
//           tags.push(tag);
//           createTag();
//         });
//       }
//       e.target.value = "";
//     }
//   }

//   tagInput.addEventListener("keyup", addTag);

//   const removeTagBtn = document.querySelector(".details button");
//   removeTagBtn.addEventListener("click", () => {
//     tags.length = 0;
//     ul.querySelectorAll("li").forEach((li) => li.remove());
//   });

/*---------Display the photo upload by user------------*/

//get photo by user id

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
    createCard(images);
  } catch (e) {
    console.log(e.message);
  }
};
getPhotosByUser(userId);

//Display photo uploaded by user
const photoList = document.querySelector(".photo-lib");
const createCard = (images) => {
  if (images.length == 0) {
    const h2 = document.createElement("h2");
    h2.innerHTML = "No photo available";
    photoList.appendChild(h2);
  } else {
    images.forEach((image) => {
      const singleImage = document.createElement("div");
      singleImage.className = "single-image";

      const img = document.createElement("img");
      img.src = url + "/thumbnails/" + image.filename;
      img.alt = image.description;

      singleImage.appendChild(img);

      photoList.appendChild(singleImage);

      singleImage.addEventListener("click", () => {
        location.href = `../post/single.html?id=${image.photo_id}`;
      });
    });
  }
};

/*---------Log out------------*/

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});
