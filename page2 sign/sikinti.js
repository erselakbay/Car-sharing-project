const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const signInGhost = document.getElementById('signInGhost');
const signUpGhost = document.getElementById('signUpGhost');
const container = document.getElementById('container');



signUpGhost.addEventListener('click', () => {
  container.classList.add("right-panel-active");

});
signInGhost.addEventListener('click', () => {
  container.classList.remove("right-panel-active");

});


//Sign in button
signInButton.addEventListener('click', (e) => {
  e.preventDefault();

  var empty = "";
  var isim = document.getElementById('signinemail').value;
  var sifre = document.getElementById('signinpw').value;



  if (empty != isim.length && empty != sifre.length) {

      postdatasignin(isim, sifre);

  }
  else {
    alert("Please make sure you don't leave any blank spaces!");
  }

});



//Sign up button
signUpButton.addEventListener('click', (e) => {
  e.preventDefault();

  var empty = "";
  var mail = document.getElementById('registeremail').value;
  var sifre = document.getElementById('registerpw').value;
  var isim = document.getElementById('registername').value;


/*
  if (empty != mail.length && empty != sifre.length && empty != isim) {
    mailarr = mail.split('@')
    if (mailarr[1] != "dogus.edu.tr") {
      alert("only dogus university mail can be used!")
    }
    else {
      postdatasignup(isim, mail, sifre);
    }
  }
  else {
    alert("Please make sure you don't leave any blank spaces!");
  }
*/

if (empty != mail.length && empty != sifre.length && empty != isim) {

    postdatasignup(isim, mail, sifre);
  
}
else {
  alert("Please make sure you don't leave any blank spaces!");
}


});




//Signup post function
function postdatasignup(name, mail, sifre) {
  var data = JSON.stringify({
    "username": name,
    "email": mail,
    "password": sifre
  });

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.status == 200) {
        window.location.reload();
        alert("Registration successful! Please check your e-mail to login.");
      }
      else {
        window.location.reload();
        alert("Error!!! This username may have been taken before. Please try again!");
      }
    }

  });

  xhr.open("POST", "https://researchproject-backend.herokuapp.com/api/auth/signup");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);

}



//Signin post function
function postdatasignin(name, sifre) {
  var data = JSON.stringify({
    "username": name,
    "password": sifre
  });

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.status == 200) {
        const response = JSON.parse(this.response);
        window.localStorage.setItem("AccessToken", response.accessToken);
        window.localStorage.setItem("Id", response.id);
        window.location.href = 'http://127.0.0.1:5500/page3%20search/';
      }
      else {
        alert("Username or password is wrong")
      }
    }
  });

  xhr.open("POST", "https://researchproject-backend.herokuapp.com/api/auth/signin");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);

}



