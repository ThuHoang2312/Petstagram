"use strict";

import logOut from "../logout.js";
import { url } from "../config.js";

// get user data
const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");
const loginUser = JSON.parse(user);
const loginUserId = loginUser.user_id;

/*-- Display username and avatar of log In user--*/
//Select existing html elements
const userInfo = document.querySelector(".user-profile");
if (token && user) {
  const p = createElement("p");
  p.innerHTML = loginUser.username;
  const img = document.createElement("img");
  if (loginUser.avatar == null) {
    img.src = "../../assets/avatar.jpg";
  } else {
    img.src = url + "/" + user.avatar;
  }
  img.alt = loginUser.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `profile.html?id=${loginUserId}`;
  });
}

/*-- Get param id on url --*/

const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};
const photoId = getQParam("id");

/*-- Get photo by photo Id --*/

const getPhoto = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
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

const postDetail = document.querySelector("#image-content");
const createPhotoCard = (photo) => {
  const imgDiv = document.getElementById("image");
  const infoDiv = document.getElementById("info");

  const img = document.createElement("img");
  const imgDate = document.createElement("p");
  const imgText = document.createElement("p");

  img.src = url + "/" + photo.filename;
  img.alt = photo.description;
  imgDate.innerHTML = photo.created_at.toDateString().slice(4, 15);
  imgText.innerHTML = photo.description;

  imgDate.className = "date";
  imgText.className = "image-description";

  imageDiv.appendChild(img);
  infoDiv.appendChild(imageTitle);
  infoDiv.appendChild(artist);
  infoDiv.appendChild(imageDate);
  infoDiv.appendChild(imageDescription);
};

/*-- Edit and delete button for admin and post owner --*/
const editBtn = document.getElementById("#edit");
const deleteBtn = document.getElementById("#delete");
const editForm = document.querySelector(".overlay");
const closeBtn = document.querySelector(".overlay i");

if (token && user && (user.role === 0 || loginUserId === photo.user_id)) {
  editBtn.style.display = "block";
  deleteBtn.style.display = "block";
}

editBtn.addEventListener("click", () => {
  editForm.classList.add("overlay-open");
});

closeBtn.addEventListener("click", () => {
  editForm.classList.remove("overlay-open");
});

//Update image
const updatePost = document.querySelector(".update-post");
updatePost.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = serializeJson(updatePost);
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + `/photo/user/${photo_id}`, fetchOptions);
  const json = await response.json();
  alert(json.message);
});

//Delete image
deleteBtn.addEventListener("click", async () => {
  if (token && user) {
    if (confirm("Are you sure you want to delete this photo?")) {
      const fetchOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        url + `/photo/user/${photo_id}`,
        fetchOptions
      );
      const json = await response.json();
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
    const response = await fetch(url + "/like/photo/" + photoId);
    const allLikes = await response.json();
    updateHeartCount(allLikes.allLikes);
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
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/like/user/" + photoId, fetchOptions);
    const like = await response.json();
    updateHeartIcon(like.like);
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
    likeIcon.className === "bx bx-heart"
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
    const response = await fetch(url + "/like/user/" + photoId, fetchOptions);

    if (response.status === 200) {
      getAllLikes();
      getLikeOfUser();
    }
  } catch (error) {
    alert(error.message);
  }
});

//update UI of heart Icon
function updateHeartIcon(userLike) {
  if (userLike > 0) {
    likeIcon.className = "bx bx-heart";
    likeIcon.style.color = "red";
  } else {
    likeIcon.className = "bx bx-heart";
    likeIcon.style.color = "black";
  }
}

function updateHeartCount(allLikes) {
  likeCount.textContent = allLikes + " likes";
}

/*-- COMMENTS --*/

//Get all comments
async function getAllComments() {
  try {
    const response = await fetch(url + "/comments/photo/" + photoId);
    const allComments = await response.json();
    displayComments(allComments);
  } catch (error) {
    alert(error.message);
  }
}

getAllComments();

//Display comment
const displayComments = (allComments) => {
  const allCommentsContainer = document.querySelector(".allComments");
  allCommentsContainer.innerHTML = "";

  allComments.map((comment) => {
    const commentContainer = document.createElement("div");
    const commentContent = document.createElement("div");
    const name = document.createElement("p");
    const comment = document.createElement("p");
    const buttonDelete = document.createElement("button");
    const trashIcon = '<i class="bx bx-trash"></i>';

    name.innerHTML = comment.username;
    comment.innerHTML = comment.comments;
    buttonDelete.innerHTML += trashIcon;

    commentContent.appendChild(name);
    commentContent.appendChild(comment);
    commentContainer.appendChild(commentContent);
    if (
      token &&
      user &&
      (comment.user_id === loginUserId || loginUser.role === 0)
    ) {
      commentContainer.appendChild(buttonDelete);
      buttonDelete.addEventListener("click", (event) => {
        if (confirm("Are you sure you want to delete this comment?")) {
          deleteComment(comment.id, event);
        }
      });
    }

    name.className = "commentUser";
    comment.className = "comment";
    commentContent.className = "commentContent";
    commentContainer.className = "commentBox";

    allCommentsContainer.appendChild(commentContainer);
  });
};

//Adding comments
const input = document.querySelector("#comment-input");
comments.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    //converting input comment to json object
    const data = {
      comment: input.value,
    };

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(
      url + `/photo/comment/${photo_id}`,
      fetchOptions
    );
    const allComments = await response.json();

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
      Authorization: "Bearer " + token,
    },
  };
  const response = await fetch(
    url + `/photo/comment/${comment_id}`,
    fetchOptions
  );
  const json = await response.json();
  if (json.message === "Comment has been deleted") {
    window.location.reload();
  }
};

/*-- Trending users --*/

const suggestion = document.querySelector("profile-card");
const createTrend = (topUsers) => {
  topUsers.forEach((topUser) => {
    const profilePic = document.createElement("div");
    profilePic.className = "profile-pic";
    const img = document.createElement("img");
    img.src = url + "/user/" + topUser.user_id;
    img.alt = topUser.username;

    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerHTML = topUser.username;
    div.appendChild(p);
    profilePic.appendChild(img);
    suggestion.appendChild(profilePic);
    suggestion.appendChild(div);

    suggestion.addEventListener("click", () => {
      location.href = `profile.html?id=${topUser.user_id}`;
    });
  });
};

const getTrend = async () => {
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/user/trend", options);
    const topUsers = await response.json();
    createTrend(topUsers);
  } catch (e) {
    console.log(e.message);
  }
};
getTrend();

/*-- Log out --*/
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});
