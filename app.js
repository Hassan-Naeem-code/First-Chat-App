console.log('Muhammad Hassan Naeem');
const firebaseAuth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
let userEmail = document.getElementById('email-User');
let userPassword = document.getElementById('password-User');
let userName = document.getElementById('user-Name');
let userProfilePic = document.getElementById('profile-pic');
let memeberArray = [];
let body = document.childNodes[1].childNodes[2];
let render = document.getElementById('render');
console.log(document.childNodes[1].childNodes[2]);
let conatiner = document.createElement('div');
let row = document.createElement('div');
conatiner.className = 'container';
row.className = 'row no-gutter';
// let chatRoomRenderRoute = document.getElementById('route');


function getSignedIn() {
    window.location.href = './signIn.html';
}


function getSignedUp() {
    window.location.href = './signup.html';
}

function signUp(element) {
    // console.log(userEmail, userPassword);
    // console.log(userEmail.value);
    // console.log(userPassword.value);
    console.log(element);
    // firebaseAuth.createUserWithEmailAndPassword(userEmail.value, userPassword.value);
    // userEmail.value = '';
    // userPassword.value = '';
    // swal("Congratulations!", "You Signed Up Successfully! Now Just CLick On LOG IN", "success");

    if (userEmail.value === '' || userPassword.value === '' || userName.value === '' || userProfilePic.files === '') {
        // alert('Please enter the missing field carefully');
        swal("Warning!", "Please fill the empty field and then press SIGN UP", "warning");
    } else {
        firebaseAuth.createUserWithEmailAndPassword(userEmail.value, userPassword.value)
            .then(function (success) {
                console.log(success, 'user registerd successfully.');
                var imageFile = userProfilePic.files[0];
                var imagesRef = storage.ref().child('dp/' + userProfilePic.files[0].name);
                imagesRef.put(imageFile)
                    .then(function (snapshot) {
                        imagesRef.getDownloadURL()
                            .then(function (result) {
                                console.log(result, 'URL =>');
                                db.collection("users").add({
                                        email: userEmail.value,
                                        profilePic: result,
                                        userName: userName.value,
                                        uid: success.user.uid
                                    })
                                    .then(function () {
                                        userEmail.value = '';
                                        userPassword.value = '';
                                        userName.value = '';
                                        swal("Congratulation!", "You Signed In SUCCESSFULLY!", "success");

                                    })
                            });
                    })
            })
            .catch(function (error) {
                console.log(error);
                swal("Warning!", `Something Went Wrong Please see ${error}`, "warning");
            });
    }
}


function refreshPageForFirst() {
    window.location.href = './index.html';
}

function signIn() {
    firebaseAuth.signInWithEmailAndPassword(userEmail.value, userPassword.value)
        .then(function (success) {
            console.log('user', success.user.uid);
            db.collection("users").where("uid", "==", success.user.uid).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, doc.data());
                        localStorage.setItem('userData', JSON.stringify(doc.data()));
                        redirectToHome();
                    });
                });
        })
        .catch(function (error) {
            console.log('error', error);
        })
}


function resetPassword() {
    var email = userEmail.value;
    console.log(email);
    firebase.auth().sendPasswordResetEmail(email)
        .then(function () {
            swal("Congratulations!", "Password Reset Email Is Been Sent Succeddfully!", "success");
            getSignedIn();
        })
        .catch(function (error) {
            swal("Error!", "Your Email Address is not suitable", "error");

        });
}

function dataGet() {
    db.collection("users").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, doc.data());
                // localStorage.setItem('chatterData', JSON.stringify(doc.data()));
                // showChatters(doc.data());
                memeberArray.push(doc.data());
                // showChatters(3, doc.data());

            });
            console.log(memeberArray);
            showChatters(memeberArray);
        });
}


function redirectToHome() {
    localStorage.setItem('userInfo', JSON.stringify(firebaseAuth.currentUser));
    window.location.href = './home.html';
}

function signOut() {
    swal({
            title: "Are you sure?",
            text: "Once Sign Out, you will not be able to recover this page untill you Sign In again!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Congratulation! You Successfully Log Out!", {
                    icon: "success",
                });
                firebaseAuth.signOut();
                window.location.href = './index.html';
                localStorage.clear();
            } else {
                swal("You can perform operation here untill you LOG OUT!");
            }
        });


}

function showChatters(members) {
    // let memeberArray = [];
    let userDataChatApp = JSON.parse(localStorage.getItem('userData')).profilePic;
    // console.log(userDataChatApp);
    // console.log(userDataChatApp.profilePic);
    // for (key in members) {
    //     console.log(members[key].profilePic);
    // }
    // console.log(members.lenght);
    console.log(members);
    console.log(members[0].uid);
    console.log(members[0].profilePic);
    console.log(members[1]);
    console.log(members[2]);
    console.log(members[3]);
    console.log(members[4]);
    const userImg = userDataChatApp;
    // console.log(parsed.profilePic);

    let col = document.createElement('div');
    col.className = 'col-12 col-sm-12 col-md-12';
    let settingTray = document.createElement('div');
    settingTray.className = 'settings-tray';
    let userImage = document.createElement('img');
    // userImage.setAttribute('src', userDataChatApp.profilePic);
    userImage.setAttribute('src', userImg);
    userImage.setAttribute('alt', 'No Image available to display....');
    userImage.className = 'profile-image';


    let signOutBtn = document.createElement('button');
    signOutBtn.setAttribute('type', 'button');
    signOutBtn.setAttribute('onclick', 'signOut()');
    let signOutBtnText = document.createTextNode('SIGN OUT');
    let iconSpan = document.createElement('span');
    iconSpan.className = 'settings-tray--right float-right';
    let firstIcon = document.createElement('i');
    let secondIcon = document.createElement('i');
    let thirdIcon = document.createElement('i');
    firstIcon.className = "fas fa-sync-alt tD";
    secondIcon.className = "far fa-comment-alt tD";
    thirdIcon.className = "fas fa-sign-out-alt tD";
    thirdIcon.title = 'Sign Out || Log Out';
    firstIcon.title = 'Refresh Page';
    secondIcon.title = 'Messages';
    thirdIcon.setAttribute('onclick', 'signOut()');
    firstIcon.setAttribute('onclick', 'refreshPage()');
    signOutBtn.appendChild(signOutBtnText);
    let serachBox = document.createElement('div');
    serachBox.className = 'search-box';
    let inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    let searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search barD';
    let inputBarSearch = document.createElement('input');
    inputBarSearch.setAttribute('type', 'text');
    inputBarSearch.setAttribute('placeholder', 'Search here');
    inputBarSearch.id = 'searchBar';
    inputWrapper.appendChild(searchIcon);
    inputWrapper.appendChild(inputBarSearch);
    serachBox.appendChild(inputWrapper);
    settingTray.appendChild(userImage);
    settingTray.appendChild(iconSpan);
    iconSpan.appendChild(firstIcon);
    iconSpan.appendChild(secondIcon);
    iconSpan.appendChild(thirdIcon);
    // settingTray.appendChild(signOutBtn);
    col.appendChild(settingTray);
    col.appendChild(serachBox);
    // members.pop();
    // members.splice(2, 1);
    console.log(members);
    for (chatter in members) {
        if (members[chatter].uid !== JSON.parse(localStorage.getItem('userData')).uid) {
            let friendDiv = document.createElement('div');
            friendDiv.className = 'friends-list friends-list--onhover';
            friendDiv.setAttribute('id', members[chatter].uid);
            friendDiv.setAttribute('onclick', 'showData(this)');
            let friendPic = document.createElement('img');
            friendPic.setAttribute('src', members[chatter].profilePic);
            friendPic.className = 'profile-image';
            friendPic.setAttribute('alt', "Friend's Photo");
            friendPic.setAttribute('id', members[chatter].uid);
            // friendPic.setAttribute('onclick', 'showData(this)');
            console.log(friendPic);
            let nameFriend = document.createElement('div');
            nameFriend.className = 'text';
            nameFriend.setAttribute('id', members[chatter].uid);
            let nameElement = document.createElement('h5');
            nameElement.setAttribute('id', members[chatter].uid);
            let nameText = document.createTextNode(members[chatter].userName);
            let hrElement = document.createElement('hr');
            nameElement.appendChild(nameText);
            nameFriend.appendChild(nameElement);
            friendDiv.appendChild(friendPic);
            friendDiv.appendChild(nameFriend);
            col.appendChild(friendDiv);
            col.appendChild(hrElement);
            temporaryVar = friendDiv;
        } else {
            console.log('got your man.......')
        }
    }
    row.appendChild(col);
    conatiner.appendChild(row);
    render.appendChild(conatiner);
    console.log(userImage);
}


function showData(userDone) {
    console.log('hello World');
    console.log(userDone);
    console.log(userDone.childNodes[0].getAttribute('src'));
    console.log(userDone.childNodes[1].childNodes[0].innerHTML);
    console.log(userDone.getAttribute('id'));
    localStorage.setItem('userToChatDataImage', JSON.stringify(userDone.childNodes[0].getAttribute('src')));
    localStorage.setItem('userToChatDataName', JSON.stringify(userDone.childNodes[1].childNodes[0].innerHTML));
    localStorage.setItem('userToChatDataUid', JSON.stringify(userDone.getAttribute('id')));
    window.location.href = './chatRoom.html';
}


function showGetData() {
    let newDataOfChatUserImage = JSON.parse(localStorage.getItem('userToChatDataImage'));
    let newDataOfChatUserName = JSON.parse(localStorage.getItem('userToChatDataName'));
    let newDataOfChatUserUid = JSON.parse(localStorage.getItem('userToChatDataUid'));
    console.log(newDataOfChatUserImage);
    console.log(newDataOfChatUserName);
    console.log(newDataOfChatUserUid);

    let col = document.createElement('div');
    col.className = 'col-12 col-sm-12 col-md-12';
    let settingTray = document.createElement('div');
    settingTray.className = 'settings-tray';
    let userImage = document.createElement('img');
    // userImage.setAttribute('src', userDataChatApp.profilePic);
    userImage.setAttribute('src', newDataOfChatUserImage);
    userImage.setAttribute('alt', 'No Image available to display....');
    userImage.className = 'profile-image';


    let signOutBtn = document.createElement('button');
    signOutBtn.setAttribute('type', 'button');
    signOutBtn.setAttribute('onclick', 'signOut()');
    let signOutBtnText = document.createTextNode('SIGN OUT');
    let iconSpan = document.createElement('span');
    iconSpan.className = 'settings-tray--right float-right';
    let firstIcon = document.createElement('i');
    let secondIcon = document.createElement('i');
    let thirdIcon = document.createElement('i');
    firstIcon.className = "fas fa-sync-alt tD";
    firstIcon.title = 'Refresh Page';
    secondIcon.className = "far fa-comment-alt tD";
    secondIcon.title = 'Messages';
    thirdIcon.className = "fas fa-sign-out-alt tD";
    thirdIcon.title = 'Sign out || Log Out';
    thirdIcon.setAttribute('onclick', 'signOut()');
    firstIcon.setAttribute('onclick', 'refreshPage1()');
    let backBtn = document.createElement('i');
    let userToChatWithDataName = document.createElement('span');
    userToChatWithDataName.id = 'userName';
    let userToChatText = document.createTextNode(newDataOfChatUserName);
    userToChatWithDataName.appendChild(userToChatText);
    backBtn.className = 'fas fa-arrow-left mr-3 py-2';
    backBtn.setAttribute('onclick', 'redirectToHome()');
    signOutBtn.appendChild(signOutBtnText);

    settingTray.appendChild(backBtn);
    settingTray.appendChild(userImage);
    settingTray.appendChild(userToChatWithDataName);
    settingTray.appendChild(iconSpan);
    iconSpan.appendChild(firstIcon);
    iconSpan.appendChild(secondIcon);
    iconSpan.appendChild(thirdIcon);
    // settingTray.appendChild(signOutBtn);
    col.appendChild(settingTray);
    row.appendChild(col);
    let columnForChat = document.createElement('div');
    columnForChat.className = 'col-12 col-sm-12 col-md-12 scrollbar';
    columnForChat.id = 'style10';
    columnForChat.style.height = '40vh';
    // columnForChat.style.width = '20';
    // columnForChat.style.overflowY = 'scroll';
    // let scrollBar = document.createElement('div');
    // scrollBar.className = 'scrollbar';
    // scrollBar.id = 'style10';
    // columnForChat.appendChild(scrollBar);
    let temporaryDiv = document.createElement('div');
    temporaryDiv.className = 'settings-trays';
    let chatMsg = document.createElement('input');
    chatMsg.type = 'text';
    chatMsg.placeholder = 'Enter Your Message Here....';
    chatMsg.name = 'userChatMessage';
    chatMsg.id = 'msg';
    let sendButton = document.createElement('button');
    // sendButton.setAttribute('onclick','sendUserChatData(this)');
    let rowDiv = document.createElement('div');
    rowDiv.className = 'row no-gutters';
    sendButton.addEventListener('click', function getShowData() {
        //   columnForChat.innerHTML = chatMsg.value;

        let rightNowHour = new Date().getHours();
        let rightNowMinutes = new Date().getMinutes();
        let timeInMilliseconds = new Date().getTime();
        db.collection("chat").add({
                senderuid: JSON.parse(localStorage.getItem('userInfo')).uid,
                recieveruid: JSON.parse(localStorage.getItem('userToChatDataUid')),
                senderChat: chatMsg.value,
                currentHours: rightNowHour,
                currentMinutes: rightNowMinutes,
                millisecondsTime: timeInMilliseconds
            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);

                // swal("Congratulations!", "Your Desired Product Is Added Successfully!", "success");
                // getAllDataOfUSer();
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });




        //   let rowDiv = document.createElement('div');
        //   rowDiv.className = 'row no-gutters';
        //   let colForMsg = document.createElement('div');
        //   colForMsg.className = 'col-12 col-sm-8 col-md-3 offset-md-9';
        //   let chatBubble = document.createElement('div');
        //   chatBubble.className = 'chat-bubble chat-bubble--right';
        //   chatBubble.innerHTML = chatMsg.value;
        //   colForMsg.appendChild(chatBubble);
        //   rowDiv.appendChild(colForMsg);
        //   columnForChat.appendChild(rowDiv);
        //   chatMsg.value = '';
    });
    console.log(firebase.auth());
    db.collection("chat").where('senderuid', '==', JSON.parse(localStorage.getItem('userData')).uid).where('recieveruid', '==', JSON.parse(localStorage.getItem('userToChatDataUid'))).orderBy('millisecondsTime', 'asc')
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added') {
                    console.log('New Product Added: ', change.doc.data());
                    console.log('Data get: ', change.doc.data().senderuid);
                    let colForMsg = document.createElement('div');
                    colForMsg.className = 'col-12 col-sm-8 col-md-3 offset-md-9 mb';
                    let chatBubble = document.createElement('div');
                    chatBubble.className = 'chat-bubble chat-bubble--right';
                    // chatBubble.innerHTML = change.doc.data().senderChat+change.doc.data().currentHours+':'+change.doc.data().currentMinutes;
                    chatBubble.innerHTML = change.doc.data().senderChat;
                    let spanTime = document.createElement('span');
                    let spanTimeData = document.createTextNode(change.doc.data().currentHours + ':' + change.doc.data().currentMinutes);
                    spanTime.className = 'timeData';
                    spanTime.appendChild(spanTimeData);
                    chatBubble.appendChild(spanTime);
                    // chatBubble.innerHTML = change.doc.data().currentHours;
                    colForMsg.appendChild(chatBubble);
                    rowDiv.appendChild(colForMsg);
                    // rowDiv.appendChild(scrollBar);
                    columnForChat.appendChild(rowDiv);
                    chatMsg.value = '';
                }
                if (change.type === 'modified') {
                    // console.log('Modified Data: ', change.doc.data(), change.doc.id);
                    // updateCardOnDOM(change.doc.id, change.doc);
                }

                if (change.type === 'removed') {
                    // console.log('Removed Data: ', change.doc.data(), change.doc.id);
                    // deleteFromDOM(change.doc.id);
                }
            })
        });
    db.collection("chat").where('senderuid', '==', JSON.parse(localStorage.getItem('userToChatDataUid'))).where('recieveruid', '==', JSON.parse(localStorage.getItem('userData')).uid).orderBy('millisecondsTime', 'asc')
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added') {
                    console.log('New Product Added: ', change.doc.data());
                    console.log('Data get: ', change.doc.data().senderuid);
                    let colForMsg = document.createElement('div');
                    colForMsg.className = 'col-12 col-sm-8 col-md-3 offset-md-9 mb';
                    let chatBubble = document.createElement('div');
                    chatBubble.className = 'chat-bubbles chat-bubble--left';
                    // chatBubble.innerHTML = change.doc.data().senderChat+change.doc.data().currentHours+':'+change.doc.data().currentMinutes;
                    chatBubble.innerHTML = change.doc.data().senderChat;
                    let spanTime = document.createElement('span');
                    let spanTimeData = document.createTextNode(change.doc.data().currentHours + ':' + change.doc.data().currentMinutes);
                    spanTime.className = 'timeData';
                    spanTime.appendChild(spanTimeData);
                    chatBubble.appendChild(spanTime);
                    // chatBubble.innerHTML = change.doc.data().currentHours;
                    colForMsg.appendChild(chatBubble);
                    // colForMsg.appendChild(scrollBar);
                    rowDiv.appendChild(colForMsg);
                    // rowDiv.appendChild(scrollBar);
                    columnForChat.appendChild(rowDiv);
                    chatMsg.value = '';
                }
                if (change.type === 'modified') {
                    // console.log('Modified Data: ', change.doc.data(), change.doc.id);
                    // updateCardOnDOM(change.doc.id, change.doc);
                }

                if (change.type === 'removed') {
                    // console.log('Removed Data: ', change.doc.data(), change.doc.id);
                    // deleteFromDOM(change.doc.id);
                }
            })
        });

    sendButton.type = 'button';
    sendButton.id = 'sendButton';
    sendButton.title = 'Send Your Message Now';

    let sendButtonIcon = document.createElement('i');
    sendButton.className = 'fas fa-check';
    sendButton.appendChild(sendButtonIcon);

    let chatInputColumn = document.createElement('div');
    chatInputColumn.className = 'col-12 col-sm-12 col-md-12';
    temporaryDiv.appendChild(chatMsg);
    temporaryDiv.appendChild(sendButton);
    chatInputColumn.appendChild(temporaryDiv);


    row.appendChild(columnForChat);
    row.appendChild(chatInputColumn);

    conatiner.appendChild(row);
    render.appendChild(conatiner);
}

// var rightNow = new Date().getHours();
// console.log(rightNow);

function refreshPage() {
    window.location.href = './home.html';
}

function refreshPage1() {
    window.location.href = './chatRoom.html';
}