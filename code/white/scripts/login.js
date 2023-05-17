const wrapper = document.querySelector(".wrapper");
const signUp_Link = document.querySelector(".new_user");
const login_Link = document.querySelector(".new_login");
const signUp_Button = document.querySelector(".signUp_btn");

signUp_Link.onclick = () => {
  wrapper.classList.add("active");
};

login_Link.onclick = () => {
  wrapper.classList.remove("active");
};

/* signUp_Button =() =>{

    wrapper.classList.add("active");
} */
