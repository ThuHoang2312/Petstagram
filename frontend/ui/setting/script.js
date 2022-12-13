"use strict";

const url = "https://petstagram.northeurope.cloudapp.azure.com/app"
import logOut from "../logout.js";

//Get data from session storage
const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");
const loginUser = JSON.parse(user);

/*--------if user does not login yet, redirect back to login page-------*/

if (!token && !user) {
  location.href = "../home/index.html";
}

const loginUserId = loginUser.user_id;

/*-- Display username and avatar of log In user--*/

(async function displayUser() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(
      url + "/user/profile/" + loginUserId,
      fetchOptions
    );
    const userProfile = await response.json();

    const img = document.querySelector(".user-wrapper img");
    if (userProfile.avatar == null) {
      img.src = "../../assets/user_icon.png";
    } else {
      img.src = url + "/" + userProfile.avatar;
    }
    const h4 = document.querySelector(".user-wrapper h4");
    h4.innerHTML = userProfile.username;

    img.addEventListener("click", () => {
      location.href = `../profile/profile.html?id=${userProfile.user_id}`;
    });
  } catch (e) {
    console.log(e.message);
  }
})();

/*--------Overlay form handler--------*/
const generalBtn = document.querySelector(".general");
const passwordBtn = document.querySelector(".password");
const deleteBtn = document.querySelector(".delete");

const updateOverlay = document.querySelector(".updateOverlay");
const closeUpdateOverlay = document.querySelector("#edit");

generalBtn.addEventListener("click", () => {
  updateOverlay.classList.add("overlay-open");
  updateProfile();
});
closeUpdateOverlay.addEventListener("click", () => {
  updateOverlay.classList.remove("overlay-open");
});

const passwordOverlay = document.querySelector(".passwordOverlay");
const closePassOverlay = document.querySelector("#update");

passwordBtn.addEventListener("click", () => {
  passwordOverlay.classList.add("overlay-open");
});

closePassOverlay.addEventListener("click", () => {
  passwordOverlay.classList.remove("overlay-open");
});

/*--------Update profile form handler--------*/

const updateProfile = async () => {
  let submittedForm = document.querySelector("#updateInfoForm");
  submittedForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = new FormData(submittedForm);

    //Check if form data is having all blank fields:
    let isEmpty = true;
    for (var pair of data.entries()) {
      if (pair[1] !== "" && pair[1].name !== "") {
        isEmpty = false;
      }
    }
    //Fill the dummy data to form if the user leaves fields blank
    if (data.get("username") === "") {
      data.set("username", loginUser.username);
    }
    if (data.get("avatar") === "") {
      data.set("avatar", loginUser.avatar);
    }
    if (data.get("description") === "") {
      data.set("description", loginUser.description);
    }
    const options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: data,
    };

    const response = await fetch(url + `/user/${loginUserId}`, options);
    const json = await response.json();

    if (isEmpty) {
      alert("You submitted a blank form");
    } else if (!response.ok) {
      alert("Error " + response.statusText + " occurred when updating profile");
    } else {
      alert(json.message);
    }
    if (json.error) {
      alert(json.error.message);
    }

    location.href = "setting.html";
  });
};

/*--------Password change form handler--------*/

const changePassword = async () => {
  const passwordForm = document.querySelector("#updatePasswordForm");
  passwordForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = serializeJson(passwordForm);

    //Check if new password confirmation matching:
    const matchingPassword = data["newPassword"] !== data["checkPassword"];
    if (matchingPassword) {
      alert("New passwords must match");
    } else {
      const options = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(
        url + `/user/${loginUserId}/passwordChange`,
        options
      );
      const json = await response.json();

      if (!response.ok) {
        alert("Error " + response.status + " occurred when updating password");
      } else {
        alert(json.message);
      }
      if (json.error) {
        alert(json.error.message);
      }

      location.href = "setting.html";
    }
  });
};

/*--------Delete account form handler--------*/

const handleDeleteForm = async () => {
  const deleteForm = document.querySelector("#deleteForm");
  deleteForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = serializeJson(deleteForm);

    if (data["email"] === "") {
      alert("Please confirm");
    } else if (data["email"] === loggedInUser.email) {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url + `/user/${loginUserId}`, options);
      const json = await response.json();

      if (!response.ok) {
        alert("Error " + response.status + " occurred when updating password");
      } else {
        alert(json.message);
      }
      if (json.error) {
        alert(json.error.message);
      }
      location.href = "login.html";
    } else {
      alert("Please type your email to confirm");
    }
  });
};

/*-- Hambuger menu --*/

const menu_toggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menu_toggle.addEventListener("click", () => {
  menu_toggle.classList.toggle("is-active");
  sidebar.classList.toggle("is-active");
});

/*--------handle logout button clicked--------*/

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});
