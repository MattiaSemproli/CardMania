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
    getFeedPosts(user);
});

/**
 * Function to get the posts of a user
 * 
 * @param {user} user 
 */
function getFeedPosts(user) {
    $.ajax({
        url: '../../model/getFeedPosts.php',
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

    let card = $("<div>").addClass("card mb-4");
    let cardHeader = $("<div>").addClass("card-header p-2 pb-0");

    let headerRow = $("<div>").addClass("row gx-0 p-1");
    let headerCol1 = $("<div>").addClass("col-2");
    let profilePic = $("<img>").attr({
        src: "data:image/jpeg;base64," + userPost.pfp,
        alt: "Profile picture"
    }).addClass("rounded-circle").css({
        width: "70%"
    }).click(function () {
        window.location.href = '../../view/user/profile.html?username=' + userPost.username;
    });
    headerCol1.append(profilePic);

    let headerCol2 = $("<div>").addClass("col pt-1 text-left align-self-center");
    let username = $("<a>").addClass("fs-4 text-decoration-none text-black")
                           .attr('href', '../../view/user/profile.html?username=' + userPost.username)
                           .text(userPost.name);
    headerCol2.append(username);
    headerCol2.append($("<p>").addClass("float-end").text(userPost._date));

    headerRow.append(headerCol1);
    headerRow.append(headerCol2);

    let headerDescriptionRow = $("<div>").addClass("row gx-0 px-1 mb-1");
    let headerDescriptionCol = $("<div>").addClass("col text-left align-self-center");
    let headerDescription = $("<textarea>").addClass("m-0 w-100 text-left bg-light").text(userPost.description);
    headerDescription.attr("readonly", true);
    headerDescription.css({
        resize: "none",
        border: "none",
        outline: "none"
    });
    headerDescriptionCol.append(headerDescription);
    headerDescriptionRow.append(headerDescriptionCol);

    cardHeader.append(headerRow);
    cardHeader.append(headerDescriptionRow);

    let cardBody = $("<div>").addClass("card-footer bg-light");
    let post = $("<div>").addClass("row gx-0 row-cols-1");
    let postContent = $("<img>").attr({
        src: "data:image/jpeg;base64," + userPost.photo,
        alt: "Post"
    }).addClass("px-3 img-fluid");
    
    postContent.click(function () {
        sessionStorage.setItem("postID", postID);
        $('#modal').modal('show');
        $('#modal-user').text(userPost.name);
        let clone = $("<img>").attr({
            src: postContent.get(0).src,
            alt: "Post"
        }).addClass("img-fluid w-auto h-100");
        $('#enlarged-post').empty().append(clone);
        getPostComment(postID);
        getPostLike(postID);
        loadUserPostLike(postID);
    });

    post.append(postContent);
    cardBody.append(post);

    card.append(cardHeader);
    card.append(cardBody);

    $("#feed").append(card);
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