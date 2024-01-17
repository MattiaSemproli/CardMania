function test() {
    document.getElementById("user-name").textContent = "Martino P";
    document.getElementById("user-bio").textContent = "Sono un ragazzo di 20 anni e suono il piano.";
    document.getElementById("n-post").textContent = "12";
    document.getElementById("n-followers").textContent = "255";
    document.getElementById("n-following").textContent = "156";
    document.getElementById("user-action").textContent = "Edit Profile";
}

function test2() {
    let arr = ["Ciao bellissimo","sei incredibile","divertente wow uaaowa ooog!","come te laamas"];
    for (let i = 0; i < 12; i++) {
        let post = $("<div>").addClass("col p-2");
        let img = $("<img>").attr({
            src: i % 2 == 0 ? "../res/square_logo.png" : "../res/logo.jpeg",
            alt: "Post"
        }).addClass("mx-auto d-block rounded w-100 h-100");
        img.click(function () {
			$("#input-form").removeClass("d-none");
            $('#modal').modal('show');
			document.getElementById("modal-user").textContent = "Martino P" + "'s post";
            let clone = $("<img>").attr({
                src: img.get(0).src,
                alt: "Post"
            }).addClass("img-fluid w-100 h-100");
            $('#enlarged-post').empty().append(clone);
            for (let j = 0; j < arr.length; j++) {
                let comment = $("<p>").text("User: " + arr[j] + " " + formatTimestamp(Date.now()));
                $("#modal-display").append(comment);
            }
        });
        post.append(img);
        $("#post-box").append(post);
    }
}

function formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    return date.toLocaleString('en-EN', options);
}

window.addEventListener('load', function() {
    let searchParams = new URLSearchParams(window.location.search);
    let user;
    if (searchParams.has("username")) {
        user = searchParams.get("username");
    } else {
        user = sessionStorage.getItem("username");
    }
    /* Funzione ajax 1 -> Richiesta username e bio da getUserData.php */

    /* Funzione ajax 2 -> Richiesta post da getUserPosts.php */
    /* Con questa richiesta avremo sia tutti i post sia il numero */

    /* Funzione ajax 3 -> Richiesta follower da getUserFollowers.php */
    /* Con questa richiesta avremo sia tutti i follower sia il numero */

    /* Funzione ajax 4 -> Richiesta following da getUserFollowing.php */
    /* Con questa richiesta avremo sia tutti i following sia il numero */

    /* Check se mettere edit profile, follow o unfollow */

    test();
    test2();
});

const likePost = document.getElementById("like-action");
const inputComment = document.getElementById("comment-input");
const sendComment = document.getElementById("send-comment");

likePost.addEventListener("click", function () {
	let likeIcon = document.getElementById("like-icon");
	if (likeIcon.style.color != "red") {
		likeIcon.style.color = "red";
	} else {
		likeIcon.style.color = "black";
	}
});

inputComment.addEventListener('input', function () {
    if (inputComment.value == "") {
        sendComment.disabled = true;
    } else {
        sendComment.disabled = false;
    }
});

sendComment.addEventListener("click", function () {
    let comment = $("<p>").text("User: " + inputComment.value + " " + formatTimestamp(Date.now())); 
    $("#modal-display").append(comment);
    inputComment.value = "";
    sendComment.disabled = true;
});

const btnFollowers = document.getElementById("btn-followers");
const btnFollowing = document.getElementById("btn-following");

btnFollowers.addEventListener("click", function () {
	$('#modal').modal('show');

	document.getElementById("modal-user").textContent = "Martino P" + " is followed by these users";

	let followerList = $('<ul>').addClass('list-group list-group-flush');
	for (let i = 0; i < 25; i++) {
		let item = $('<li>').addClass('list-group-item');
		let linkItem = $('<a>').attr('href', '../../view/user/profile.html').text('Follower ' + i);
		followerList.append(item.append(linkItem));
	}
	$('#modal-display').append(followerList);
});

btnFollowing.addEventListener("click", function () {
	$('#modal').modal('show');

	document.getElementById("modal-user").textContent = "Martino P" + " follows these users";

	let followingList = $('<ul>').addClass('list-group list-group-flush');
	for (let i = 0; i < 25; i++) {
		let item = $('<li>').addClass('list-group-item');
		let linkItem = $('<a>').attr('href', '../../view/user/profile.html').text('Following ' + i);
		followingList.append(item.append(linkItem));
	}
	$('#modal-display').append(followingList);
});

const myModal = document.getElementById('modal');
myModal.addEventListener('hidden.bs.modal', function() {
 	$("#enlarged-post").empty();
	$("#modal-display").empty();
	document.getElementById("comment-input").value = "";
	$("#input-form").addClass("d-none");
});

const mainPhoto = document.getElementById("main-photo");

mainPhoto.onclick = function() {
	mainPhoto.classList.add("pfpOver");
};

mainPhoto.onmouseout = function() {
	mainPhoto.classList.remove("pfpOver");
};