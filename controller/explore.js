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
    getExplorePosts(user);
    loadAllUsersOptions();
});

/**
 * Function to get the posts of a user
 * 
 * @param {user} user 
 */
function getExplorePosts(user) {
    $.ajax({
        url: '../../model/getExplorePosts.php',
        type: 'GET',
        data: {
            targetUser: user,
        },
        dataType: 'json',
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                createSinglePost(data[i]);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

function createSinglePost(userPost) {
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
 	$("#enlarged-post").empty();
	$("#modal-display").empty();
	document.getElementById("comment-input").value = "";
    sessionStorage.removeItem("postID");
});

function loadAllUsersOptions() {
    const usr = document.getElementById('usernames');
    while (usr.firstChild) {
        usr.removeChild(usr.firstChild);
    }
    $.ajax({
        url: '../../model/getAllUsernames.php',
        type: 'POST',
        dataType: 'json',
        data: {
            loggedUser: sessionStorage.getItem("username"),
        },
        success: function (data) {
            data.forEach(user => {
                const newOption = document.createElement('option');
                newOption.value = user.username;
                usr.appendChild(newOption);
            });
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

document.getElementById('search-button').addEventListener('click', function() {    
    let options = document.getElementById('usernames').options;
    let searchElement = document.getElementById("search-input").value;
 
    if (Array.from(options).some(function(option) {
        return option.value == searchElement;
    })) {
        window.location.href = "../../view/user/profile.html?username=" + searchElement;
    }
});