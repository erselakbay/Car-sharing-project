getmytrip()

function getmytrip() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if(xhr.status==401){
        window.location = 'http://127.0.0.1:5500/page2%20sign/'
    } 
           
      const response = JSON.parse(this.response);
      if (response.length == 0) {
        alert("You have not created a trip yet")
      }

      for (var i = 0; i < response.length; i++) {

        var x = new Date(response[i].date).toISOString().substring(0, 10);

        var time = response[i].timeRange.value.split("-");
        if (time.length > 0) {
          var startHour = time[0];
          var endHour = time[1];
          endHour = endHour == "24" ? "0" : endHour;
          var startHourString = startHour.padStart(2, "0") + ":00";
          var endHourString = endHour.padStart(2, "0") + ":00";
        }
        buildcard(response[i].id, response[i].user.username, response[i].fromStation.stationname, response[i].toStation.stationname, x, startHourString + "-" + endHourString, response[i].user.email);
      }
    }
  });
  xhr.open("GET", "https://researchproject-backend.herokuapp.com/api/travel/getList/?userId=" + window.localStorage.getItem("Id"));
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}



function buildcard(id, name, froms, tos, date, hour, email) {
  var searchlist = document.getElementById("mytriplistinner");
  var el = document.createElement("div");
  el.classList.add("card");
  el.id = id;
  el.innerHTML = "<div class='card-body' id='card_" + id + "'>" +
    "<h5 class='card-title'>" + name + "</h5>" +
    " <p class='card-text'>" + "From: " + froms + " To: " + tos + " Date: " + date + " Hour: " + hour + "</p>" +
    "<button type='button' class='btn btn-danger' onclick='updatemytrip(" + id + ");'>Update! </button> " +
    "<button type='button' class='btn btn-danger' onclick='deletemytrip(" + id + ");'> Delete! </button>"
  "</div>";
  searchlist.appendChild(el);
}



function deletemytrip(id) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (confirm('Are you sure? Do you want to delete?')) {
        $("#card_" + id).parent().remove();
        alert("Delete Successful");
      }

    }
  });
  xhr.open("DELETE", "https://researchproject-backend.herokuapp.com/api/travel/delete/" + id);
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}




function updatemytrip(id) {

          window.localStorage.setItem("ThatIDNo:", id);
          window.location.href = "http://127.0.0.1:5500/page8%20update/page.html"

}


function clearmemory()
{
  localStorage.clear();
}