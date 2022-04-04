import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

// Predefiend Function
let editPostForm = document.querySelector(".create-post-form form");

function postFormClose() {
    document.body.classList.remove("addPost");
    editPostForm.reset();
}

// Load All Post from Database & Add, Edit and Delete Post
function loadPosts() {
    axios.get("http://localhost:9348/posts").then(
        (res) => {
            let postListContainer = document.querySelector(".post-list");
            let postList = ""
            res.data.map(postItem => {
                let {
                    id,
                    desc,
                    image
                } = postItem;

                postList += `

                   <div class="post-item ms-card ms-p-15">
                   <div class="post-item-header d-flex justify-content-between align-items-center">
                       <div class="post-item-header--left">
                           <img width="50"
                               src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                               class="avatar">
                           <div class="text">
                               <span class="user-name">Muhammad Sumon</span>
                               <span class="posted-time">7 hrs</span>
                           </div>
                       </div>
                       <div class="post-item-header--options">
                           <svg class="option-btn" fill="currentColor" viewBox="0 0 20 20" width="1.5em" height="1.2em"
                               class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 py1f6qlh jnigpg78 odw8uiq3">
                               <g fill-rule="evenodd" transform="translate(-446 -350)">
                                   <path
                                       d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0">
                                   </path>
                               </g>
                           </svg>
                           <ul>
                               <li class="postDeletebtn" un="${id}">Delete</li>
                               <li class="postEditbtn" un="${id}">Edit</li>
                           </ul>

                       </div>
                   </div>
                   <div class="post-item-main">
                       <div class="post-item-main--desc ms-py-15">${desc}</div>
                       <div class="post-item-main--img"><img
                               src="${image}"
                               alt=""></div>
                   </div>
               </div>

                   `
            })
            postListContainer.innerHTML = postList;
            showHideOpt();

            // Add Post
            let addPost = () => {
                editPostForm.onsubmit = (e) => {
                    e.preventDefault()

                    let formObj = new FormData(editPostForm);
                    let formData = Object.fromEntries(formObj.entries());

                    axios.post("http://localhost:9348/posts", {
                        desc: formData.postDesc,
                        image: formData.postImage
                    }).then(res => {
                        postFormClose();
                        loadPosts()
                    })

                }
            }
            addPost()

            // Edit Post
            function editPost() {
                document.querySelectorAll(".postEditbtn").forEach(postEditBtn => {
                    postEditBtn.onclick = (btnEvent) => {
                        axios.get(`http://localhost:9348/posts/${btnEvent.target.getAttribute("un")}`).then(
                            res => {
                                editPostForm = document.querySelector(".create-post-form form");
                                let postDesc = document.querySelector(".create-post-form .post-desc");
                                let postImg = document.querySelector(".create-post-form .post-img");

                                // Set Current Post Data
                                postDesc.value = `${res.data.desc}`
                                postImg.value = `${res.data.image}`

                                editPostForm.onsubmit = (e) => {
                                    e.preventDefault();

                                    let formObj = new FormData(editPostForm);
                                    let formData = Object.fromEntries(formObj.entries());

                                    axios.patch(`http://localhost:9348/posts/${btnEvent.target.getAttribute("un")}`, {
                                        desc: formData.postDesc,
                                        image: formData.postImage
                                    }).then(res => {
                                        postFormClose();
                                        loadPosts();
                                    })
                                }


                                // Show Post Add Form
                                let body = document.body;
                                let postAddCloseBtn = document.querySelector(".create-post-form .close-icon")

                                // Active Post Add Modal
                                body.classList.add("addPost");

                                // Hide Post Add Modal
                                postAddCloseBtn.onclick = () => {
                                    postFormClose();
                                }


                            }
                        );
                    }
                })
            }
            editPost();

            // Post Delete
            function deletPost() {
                document.querySelectorAll(".postDeletebtn").forEach(btn => {
                    btn.onclick = (e) => {
                        axios.delete(`http://localhost:9348/posts/${e.target.getAttribute("un")}`).then(
                            res => {
                                loadPosts()
                            }
                        );
                    }
                })
            }
            deletPost();


        })
}
loadPosts();

// For delete & edit option showing & hiding
function showHideOpt() {
    document.querySelectorAll(".option-btn").forEach(btnItem => {
        btnItem.onclick = (e) => {
            let optionParent = e.target.parentElement;

            optionParent.classList.contains("opt-active") ? optionParent.classList.remove("opt-active") : optionParent.classList.add("opt-active");
        }
    })
}
showHideOpt();

// Open post add modal on click
function showPostAddForm() {
    document.querySelector(".post-add--btn").onclick = (e) => {

        let body = document.body;
        let postAddCloseBtn = document.querySelector(".create-post-form .close-icon")

        // Active Post Add Modal
        body.classList.add("addPost");

        // Hide Post Add Modal
        postAddCloseBtn.onclick = () => {
            body.classList.remove("addPost");
        }
    }
}
showPostAddForm();