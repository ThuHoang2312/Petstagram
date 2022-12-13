"use strict";

import logOut from "../logout.js";
//import { url } from "../config.js";
const url = "http://localhost:3000";
// get user data
const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");
const loginUser = JSON.parse(user);
const loginUserId = loginUser.user_id;

//if user does not login yet, redirect back to login page
if (!token && !user) {
  location.href = "../home/index.html";
}

/*-- Display username and avatar of log In user--*/
//Select existing html elements
if (token && user) {
  const h4 = document.querySelector(".user-wrapper h4");
  h4.innerHTML = loginUser.username;
  const img = document.querySelector(".user-wrapper img");
  if (loginUser.avatar == null) {
    img.src = "../../assets/user_icon.png";
  } else {
    img.src = url + "/" + loginUser.avatar;
  }
  img.alt = loginUser.username;

  img.addEventListener("click", () => {
    location.href = `../profile/profile.html?id=${loginUserId}`;
  });
}

/*-- Get param id on url --*/

const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};
const photoId = getQParam("id");
console.log(photoId);

/*-- Get photo by photo Id --*/

const getPhoto = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(url + "/photo/" + id, fetchOptions);
    const photo = await response.json();
    createPhotoCard(photo);
  } catch (e) {
    console.log(e.message);
  }
};
getPhoto(photoId);

/*-- Display photo and info --*/

const postDetail = document.querySelector(".image-wrapper");
/*-- Delete button for admin and post owner --*/
const deleteBtn = document.getElementById("delete");

const createPhotoCard = (photo) => {
  const imgDiv = document.getElementById("image");
  const infoDiv = document.getElementById("info");

  const img = document.createElement("img");
  const imgDate = document.createElement("p");
  const imgText = document.createElement("p");
  const userText = document.createElement("span");
  const description = document.createElement("div");

  img.src = url + "/" + photo.filename;
  img.alt = photo.description;
  if (photo.created_at != null) {
    imgDate.innerHTML = photo.created_at.substring(0, 10);
  }

  imgText.innerHTML = photo.description;
  userText.innerHTML = photo.username;
  imgDate.className = "date";
  imgText.className = "image-description";

  imgDiv.appendChild(img);
  description.appendChild(userText);
  description.appendChild(imgText);
  infoDiv.appendChild(description);
  infoDiv.appendChild(imgDate);
  postDetail.appendChild(imgDiv);
  postDetail.appendChild(infoDiv);

  addMarker(JSON.parse(photo.coords))

  if (token && user && (photo.role === 0 || loginUserId === photo.user_id)) {
    deleteBtn.style.display = "flex";
  }
};

//Delete image
deleteBtn.addEventListener("click", async () => {
  if (token && user) {
    if (confirm("Are you sure you want to delete this photo?")) {
      const fetchOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      };
      const response = await fetch(url + `/photo/${photoId}`, fetchOptions);
      const json = await response.json();
      console.log("delete front", json);
      alert(json.message);
      //Redirection to home page
      location.href = `../front/index.html?id=${loginUserId}`;
    }
  }
});

/*-- Get like information--*/

const likeIcon = document.querySelector("#likeIcon");
const likeCount = document.querySelector("#likeCount");

async function getAllLikes() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/like/photo/" + photoId, fetchOptions);
    const allLikes = await response.json();
    updateLikeCount(allLikes.message);
  } catch (error) {
    alert(error.message);
  }
}

// Get like of the user
async function getLikeOfUser() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/like/user/" + photoId, fetchOptions);
    const like = await response.json();
    updateIcon(like.message);
    console.log("like status", like.message);
  } catch (error) {
    alert(error.message);
  }
}

getAllLikes();
if (user && token) {
  getLikeOfUser();
}

//Toggle like and display number of likes
likeIcon.addEventListener("click", async (event) => {
  event.preventDefault();
  const fetchOptions =
    likeIcon.style.color === "black"
      ? {
          method: "POST",
          headers: {
            authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      : {
          method: "DELETE",
          headers: {
            authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };

  try {
    const response = await fetch(url + "/like/" + photoId, fetchOptions);
    window.location.reload();
    if (response.status === 200) {
      getAllLikes();
      getLikeOfUser();
      window.location.reload();
    }
  } catch (error) {
    alert(error.message);
  }
});

//update UI of heart Icon
function updateIcon(userLike) {
  if (userLike == true) {
    likeIcon.className = "bx bxs-heart";
    likeIcon.style.color = "red";
  } else {
    likeIcon.className = "bx bxs-heart";
    likeIcon.style.color = "black";
  }
}

function updateLikeCount(allLikes) {
  likeCount.textContent = allLikes;
}

// /*-- COMMENTS --*/

//Get all comments
async function getAllComments() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + `/comment/${photoId}`, fetchOptions);
    const allComments = await response.json();
    displayComments(allComments);
    console.log(allComments);
  } catch (error) {
    alert(error.message);
  }
}

getAllComments(photoId);
console.log("getAllComments(photoId");

//Display comment
const displayComments = (allComments) => {
  const allCommentsContainer = document.querySelector(".allComments");
  allCommentsContainer.innerHTML = "";

  allComments.map((comment) => {
    const commentContainer = document.createElement("div");
    const avatar = document.createElement("img");
    if (comment.avatar == null) {
      avatar.src = "../../assets/user_icon.png";
    } else {
      avatar.src = url + "/" + comment.avatar;
    }
    const commentContent = document.createElement("div");
    const name = document.createElement("p");
    const userComment = document.createElement("p");
    const buttonDelete = document.createElement("button");
    const trashIcon = '<i class="bx bx-trash"></i>';

    name.innerHTML = comment.username;
    userComment.innerHTML = comment.comment_text;
    buttonDelete.innerHTML += trashIcon;
    commentContent.appendChild(avatar);
    commentContent.appendChild(name);
    commentContent.appendChild(userComment);
    commentContainer.appendChild(commentContent);
    console.log("comment container: ", commentContainer);

    if (
      token &&
      user &&
      (comment.user_id === loginUserId || loginUser.role === 0)
    ) {
      commentContainer.appendChild(buttonDelete);
      buttonDelete.addEventListener("click", (event) => {
        if (confirm("Are you sure you want to delete this comment?")) {
          deleteComment(comment.id, event);
          window.location.reload();
        }
      });
    }

    name.className = "commentUser";
    comment.className = "comment";
    commentContent.className = "commentContent";
    commentContainer.className = "commentBox";
    allCommentsContainer.appendChild(commentContainer);
    console.log(allCommentsContainer);
  });
};

//Adding comments
const input = document.querySelector("#comment-input");
input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    //converting input comment to json object
    const data = {
      comment: input.value,
    };

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + `/comment/${photoId}`, fetchOptions);
    const allComments = await response.json();
    window.location.reload();

    if (allComments.length >= 0) {
      displayComments(allComments);
      input.value = "";
    } else {
      alert(allComments.message);
    }
  }
});

//Delete comment
const deleteComment = async (commentId, event) => {
  event.preventDefault();
  const fetchOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  };
  const response = await fetch(url + "/comment/" + commentId, fetchOptions);
  const json = await response.json();
};

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
