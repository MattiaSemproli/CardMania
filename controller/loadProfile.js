/**
 * Function to get the username from the url or from the session storage
 */
function getUser() {
    let searchParams = new URLSearchParams(window.location.search);
    let temp;
    if (searchParams.has("username")) {
        temp = searchParams.get("username");
    } else {
        temp = sessionStorage.getItem("username");
    }
    return temp;
}

window.addEventListener('load', function() {
    let user = getUser();

    getUserData(user);
    getUserPosts(user);
    getNumberOfFollower(user);
    getNumberOfFollowing(user);
    actionButtonManagement(user);
});

/**
 * Function to get the data of a user
 * 
 * @param {user} user 
 */
function getUserData(user) {
    $.ajax({
        url: '../../model/getUserData.php',
        type: 'GET',
        data: {
            targetUser: user,
        },
        dataType: 'json',
        success: function (data) {
            let userData = data[0];
            $("#user-name").text(userData.name);
            $("#user-bio").text(userData.bio);
            $("#user-photo").attr({
                src: "data:image/jpeg;base64," + userData.photo,
            });
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Function to get the posts of a user
 * 
 * @param {user} user 
 */
function getUserPosts(user) {
    $.ajax({
        url: '../../model/getUserPosts.php',
        type: 'GET',
        data: {
            targetUser: user,
        },
        dataType: 'json',
        success: function (data) {
            $("#n-post").text(data.length);
            for (let i = 0; i < data.length; i++) {
                let userPost = data[i];
                let postID = userPost.n;
                let post = $("<div>").addClass("col p-2");
                let img = $("<img>").attr({
                    src: "data:image/jpeg;base64," + userPost.photo,
                    alt: "Post"
                }).addClass("mx-auto d-block rounded w-100 h-100");
                img.click(function () {
                    sessionStorage.setItem("postID", postID);
                    $("#input-form").removeClass("d-none");
                    $('#modal').modal('show');
                    document.getElementById("modal-user").textContent = userPost.name;
                    let clone = $("<img>").attr({
                        src: img.get(0).src,
                        alt: "Post"
                    }).addClass("img-fluid w-auto h-100");
                    $('#enlarged-post').empty().append(clone);
                    getPostComment(postID);
                    getPostLike(postID);
                    loadUserPostLike(postID);
                });
                post.append(img);
                $("#post-box").append(post);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Function to get the comments of a post
 * 
 * @param {id} id
 */
function getPostComment(id) {
    $.ajax({
        url: '../../model/getPostComments.php',
        type: 'GET',
        data: {
            postID: id,
        },
        dataType: 'json',
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let postComment = data[i];
                let comment = $("<p>").text(postComment.username + ": " + postComment.content + " " + formatTimestamp(postComment._datetime));
                $("#modal-display").append(comment);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Function for the timestamp format
 * 
 * @param {timestamp} timestamp
 * @returns timestamp in the right format
 */
function formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    return date.toLocaleString('en-EN', options);
}

/**
 * Function to get the likes of a post
 * 
 * @param {id} id 
 */
function getPostLike(id) {
    $.ajax({
        url: '../../model/getPostLikes.php',
        type: 'GET',
        data: {
            postID: id,
        },
        dataType: 'json',
        success: function (data) {
            $("#n-likes").text(data[0].nLikes);
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Check if the logged user liked the post or not and change the color of the icon
 * 
 * @param {id} id 
 */
function loadUserPostLike(id) {
    $.ajax({
        url: '../../model/isPostLiked.php',
        type: 'GET',
        data: {
            postID: id,
            username: sessionStorage.getItem("username"),
        },
        dataType: 'json',
        success: function (data) {
            if(data.liked == true) {
                $("#like-icon").css("color", "red");
            } else {
                $("#like-icon").css("color", "black");
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Get the number of followers of a user
 * 
 * @param {user} user 
 */
function getNumberOfFollower(user) {
    $.ajax({
        url: '../../model/getUserFollowers.php',
        type: 'GET',
        data: {
            nFollowers: user,
        },
        dataType: 'json',
        success: function (data) {
            $("#n-followers").text(data[0].nFollowers);
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Get the number of following of a user
 * 
 * @param {user} user 
 */
function getNumberOfFollowing(user) {
    $.ajax({
        url: '../../model/getUserFollowings.php',
        type: 'GET',
        data: {
            nFollowings: user,
        },
        dataType: 'json',
        success: function (data) {
            $("#n-following").text(data[0].nFollowings);
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Functions to show followers and following
 */
const btnFollowers = document.getElementById("btn-followers");
const btnFollowing = document.getElementById("btn-following");

/**
 *  Function to show followers 
 */
btnFollowers.addEventListener("click", function () {
    $('#enlarged-post').addClass("d-none");
    $('#modal').modal('show');
	let followerList = $('<ul>').addClass('list-group list-group-flush');
    let user = getUser();
	document.getElementById("modal-user").textContent = user + " is followed by these users";
    $.ajax({
        url: '../../model/getUserFollowers.php',
        type: 'GET',
        data: {
            followers: user,
        },
        dataType: 'json',
        success: function (data) {
            for(let i = 0; i < data.length; i++) {
                let item = $('<li>').addClass('list-group-item');
                let linkItem = $('<a>').attr('href', '../../view/user/profile.html?username=' + data[i].follower)
                                       .text(data[i].follower);
                followerList.append(item.append(linkItem));
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
	$('#modal-display').append(followerList);
});

/**
 *  Function to show following
 */
btnFollowing.addEventListener("click", function () {
    $('#enlarged-post').addClass("d-none");
    $('#modal').modal('show');
	let followingList = $('<ul>').addClass('list-group list-group-flush');
    let user = getUser();
	document.getElementById("modal-user").textContent = user + " follows these users";
    $.ajax({
        url: '../../model/getUserFollowings.php',
        type: 'GET',
        data: {
            followings: user,
        },
        dataType: 'json',
        success: function (data) {
            for(let i = 0; i < data.length; i++) {
                let item = $('<li>').addClass('list-group-item');
                let linkItem = $('<a>').attr('href', '../../view/user/profile.html?username=' + data[i].username)
                                       .text(data[i].username);
                followingList.append(item.append(linkItem));
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
	$('#modal-display').append(followingList);
});

/**
 * Function to manage the action button (follow/unfollow/edit profile) and add the event listener
 * 
 * @param {user} user 
 */
function actionButtonManagement(user) {
    let loggedUser = sessionStorage.getItem("username");
    if (user == loggedUser) {
        $("#user-action").text("Edit profile").click(function () {
            $('#edit-modal').modal('show');

            const fileInput = document.getElementById("photo");
            const uploadImageButton = document.getElementById("upload-image-button");
            
            uploadImageButton.addEventListener("click", function () {
                fileInput.click();
            });
            
            fileInput.addEventListener("change", function () {
                if (fileInput.files && fileInput.files[0]) {    
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        $("#placeholder").attr("src", e.target.result).addClass("img-fluid w-auto h-100");
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            });

            document.getElementById("edit-profile-form").addEventListener("submit", function (e) {
                e.preventDefault();
                document.getElementById("username").value = sessionStorage.getItem("username");
                this.submit();
            });
        });
    } else {
        $.ajax({
            url: '../../model/isUserFollower.php',
            type: 'GET',
            data: {
                //going to check if loggedUser follows the targetUser
                targetUser: user,
                follower: loggedUser,
            },
            dataType: 'json',
            success: function (data) {
                if (data.follows == false) {
                    $("#user-action").text("Follow");
                    $("#user-action").click(function () {
                        addFollower(user, loggedUser);
                    });
                } else {
                    $("#user-action").text("Unfollow");
                    $("#user-action").click(function () {
                        removeFollower(user, loggedUser);
                    });
                }
            },
            error: function (error) {
                console.error('Ajax error: ', error);
            }
        });
    }
}

/**
 * Function to add a follower (loggedUser) to a user (targetUser)
 * 
 * @param {user} user 
 * @param {loggedUser} loggedUser
 */
function addFollower(user, loggedUser) {
    $.ajax({
        url: '../../model/addFollow.php',
        type: 'POST',
        data: {
            //going to add loggedUser as follower of targetUser
            targetUser: user,
            loggedUser: loggedUser,
        },
        dataType: 'json',
        success: function (data) {
            if (data.follows == true) {
                window.location.reload();
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Function to remove a follower (loggedUser) from a user (targetUser)
 * 
 * @param {user} user 
 * @param {loggedUser} loggedUser
 */
function removeFollower(user, loggedUser) {
    $.ajax({
        url: '../../model/removeFollow.php',
        type: 'POST',
        data: {
            //going to remove loggedUser as follower of targetUser
            targetUser: user,
            loggedUser: loggedUser,
        },
        dataType: 'json',
        success: function (data) {
            if(data.unfollows) {
                window.location.reload();
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Function to comment and like a post
 * check if the input is empty to disable the send button
 */
const likePost = document.getElementById("like-action");
const inputComment = document.getElementById("comment-input");
const sendComment = document.getElementById("send-comment");

likePost.addEventListener("click", function () {
	let likeIcon = document.getElementById("like-icon");
	if (likeIcon.style.color != "red") {
        addLike();
		likeIcon.style.color = "red";
	} else {
        removeLike();
		likeIcon.style.color = "black";
	}
});

/**
 * Function to add a like to a post
 */
function addLike() {
    $.ajax({
        url: '../../model/addLike.php',
        type: 'POST',
        data: {
            //logged username add a like to the post
            username: sessionStorage.getItem("username"),
            postID: sessionStorage.getItem("postID"),
        },
        dataType: 'json',
        success: function (data) {
            if (data.ok == true) {
                $("#n-likes").text(parseInt($("#n-likes").text()) + 1);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Function to remove a like from a post
 */
function removeLike() {
    $.ajax({
        url: '../../model/removeLike.php',
        type: 'POST',
        data: {
            //logged username remove a like to the post
            username: sessionStorage.getItem("username"),
            postID: sessionStorage.getItem("postID"),
        },
        dataType: 'json',
        success: function (data) {
            if (data.ok == true) {
                $("#n-likes").text(parseInt($("#n-likes").text()) - 1);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

/**
 * Check if the input is empty to disable the send button
 
 */
inputComment.addEventListener('input', function () {
    if (inputComment.value == "") {
        sendComment.disabled = true;
    } else {
        sendComment.disabled = false;
    }
});

/**
 * Function to send a comment, it creates the entry in the database too
 */
sendComment.addEventListener("click", function () {
    let comment = $("<p>").text(sessionStorage.getItem('username') + ": " + inputComment.value + " " + formatTimestamp(Date.now())); 
    $.ajax({
        url: '../../model/addComment.php',
        type: 'POST',
        data: {
            //going to remove loggedUser as follower of targetUser
            username: sessionStorage.getItem("username"),
            content: inputComment.value,
            postID: sessionStorage.getItem("postID"),
        },
        dataType: 'json',
        success: function (data) {
            if (data.ok == true) {
                $("#modal-display").append(comment);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
    inputComment.value = "";
    sendComment.disabled = true;
});

/**
 * Empty modal when it's closed
 */
const myModal = document.getElementById('modal');
myModal.addEventListener('hidden.bs.modal', function() {
    $('#enlarged-post').removeClass("d-none");
 	$("#enlarged-post").empty();
	$("#modal-display").empty();
	document.getElementById("comment-input").value = "";
	$("#input-form").addClass("d-none");
    sessionStorage.removeItem("postID");
});
const editModal = document.getElementById('edit-modal');
editModal.addEventListener('hidden.bs.modal', function() {
    document.getElementById("nickname").value = "";
    document.getElementById("bio").value = "";
    document.getElementById("placeholder").src = "";
});

/**
 * Add and remove pfpOver class to the main photo to zoom in and out
 */
const mainPhoto = document.getElementById("user-photo");

/**
 * Add pfpOver
 */
mainPhoto.onclick = function() {
	mainPhoto.classList.add("pfpOver");
};

/**
 * Remove pfpOver
 */
mainPhoto.onmouseout = function() {
	mainPhoto.classList.remove("pfpOver");
};