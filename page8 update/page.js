var updateId = window.localStorage.getItem("ThatIDNo:");


var stown = "stown";
var ftown = "ftown";
var sstation = "sstation";
var fstation = "fstation";
var textFromStation = "From Station";
var textToStation = "To Station";
var forstowntrigger=true;
var forftowntrigger=true;
var forhourtrigger=true;
var forsstationtrigger=true;
var forfstationtrigger=true;
updatetownrequest(updateId)

var date;
var hour;              //tüm saatler ve idleri


function updatetownrequest(updateId) {

  var today = new Date().toISOString().split('T')[0];
  document.getElementsByName("date")[0].setAttribute('min', today);
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (xhr.status == 401) {
        window.location = 'http://127.0.0.1:5500/page2%20sign/'
      }

      const response = JSON.parse(this.response);                                     //cekilen response globale tasınıyor. Böylece id kolay bulunacak
   
      var select = document.getElementById("stown");
      var itemValue = response.fromStation.town["id"];
      var itemName = response.fromStation.town["name"];
      var el = document.createElement("option");
      el.textContent = itemName;
      el.value = itemValue;
      select.appendChild(el);

      var select = document.getElementById("ftown");
      var itemValue = response.toStation.town["id"];
      var itemName = response.toStation.town["name"];
      var el = document.createElement("option");
      el.textContent = itemName;
      el.value = itemValue;
      select.appendChild(el);

      var select = document.getElementById("sstation");  
        var itemValue = response.fromStation["id"];
        var itemName = response.fromStation["stationname"];
        var el = document.createElement("option");
        el.textContent = itemName;
        el.value = itemValue;
        select.appendChild(el);  

        var select = document.getElementById("fstation");  
        var itemValue = response.toStation["id"];
        var itemName = response.toStation["stationname"];
        var el = document.createElement("option");
        el.textContent = itemName;
        el.value = itemValue;
        select.appendChild(el);  

      var select = document.getElementById("saatler");
      var itemValue = response.timeRange["id"];
      var itemName = response.timeRange["value"];
      var x = itemName.split("-");                                //clock düzenlenerek kendi comboboxuna(saatler) yerlestiriliyor
      if (x.length > 0) {
        var startHour = x[0];
        var endHour = x[1];
        endHour = endHour == "24" ? "0" : endHour;
        var startHourString = startHour.padStart(2, "0") + ":00";
        var endHourString = endHour.padStart(2, "0") + ":00";
        var el = document.createElement("option");
        el.textContent = startHourString + "-" + endHourString;
        el.value = itemValue;
        select.appendChild(el);
      }

      document.getElementById("date").value = new Date(response.date).toISOString().substring(0, 10);
      date=new Date(response.date).toISOString().substring(0, 10);
    }
  });
  xhr.open("GET", "https://researchproject-backend.herokuapp.com/api/travel/getTravelById/?id=" + updateId);
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}



document.getElementById("stown").addEventListener("click", function () {
  if (forstowntrigger == true) {
    if($('#ftown').find(":selected").val() == 292)
    {
      $('#stown').find('option').remove();
      townrequest(stown);
      forstowntrigger = false;
    }

  }


});
document.getElementById("ftown").addEventListener("click", function () {
  if (forftowntrigger == true) {

    if($('#stown').find(":selected").val() == 292)
    {
      $('#ftown').find('option').remove();
      townrequest(ftown);
      forftowntrigger = false;
    }
  }
});

document.getElementById("sstation").addEventListener("click", function () {
  if (forsstationtrigger == true) {
    $('#sstation').find('option').remove();
    var fromSelectedValue = $('#stown').find(":selected").val();
    var fromSelectedText = $('#stown').find(":selected").text();
  
    $('#sstation').find('option').remove();
    fromStationDetail(fromSelectedValue, sstation, textFromStation); //secilen town idsi, "sstation" , "To Station"
  
    //To station bilgileri çekilir. 
    if (fromSelectedText != "CAMPUS") {//Campus seçildi
      $("#ftown option").each(function (x) {
        var itemText = $(this).text();
        if (itemText != "CAMPUS" && itemText != "To") {
          $(this).remove();
        }
      });
    }
    else {//Campus dışında ki bi yer seçildi
      $("#ftown option").each(function (x) {
        var itemText = $(this).text();
        if (itemText != "To") {
          $(this).remove();
        }
      });
      townrequest(ftown); //Tüm hepsi tekrar çekildi 
    }
    forsstationtrigger = false;
  }
});

document.getElementById("fstation").addEventListener("click", function () {
  if (forfstationtrigger == true) {
    $('#fstation').find('option').remove();
    var toSelectedValue = $('#ftown').find(":selected").val();
    var toSelectedText = $('#ftown').find(":selected").text();
    //From Station detail çekilir. Örn: Bahçelieveler seçildiğinde mahallerinin gelmesi sağlanır  
    $('#fstation').find('option').remove();
    fromStationDetail(toSelectedValue, fstation, textToStation);
    townrequest(stown); //Tüm hepsi tekrar çekildi 
    forfstationtrigger = false;
  }
});

document.getElementById("saatler").addEventListener("click", function () {
  if (forhourtrigger == true) {
    $('#saatler').find('option').remove();
    clockrequest()
    forhourtrigger = false;
  }
});



function townrequest(income) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);                                     //cekilen response globale tasınıyor. Böylece id kolay bulunacak
      for (var i = 0; i < response.length; i++) {                //ilk comboboxın içi dolduruluyor.
        var select = document.getElementById(income);

        var itemValue = response[i].id;
        var itemName = response[i].name;

        var el = document.createElement("option");
        el.textContent = itemName;
        el.value = itemValue;
        select.appendChild(el);                                   //stown (start town) comboxuna tüm semtler yazılıyor
      }
    }
  });
  xhr.open("GET", "https://researchproject-backend.herokuapp.com/api/town/getList");
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}


function fromStationDetail(stationid, stationbox, text) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      var select = document.getElementById(stationbox);
      var el = document.createElement("option");
      el.textContent = text;
      el.value = "0";
      select.appendChild(el);
      for (var i = 0; i < response.length; i++) {
        var select = document.getElementById(stationbox);

        var rowStationJd = response[i].id;
        var rowStationName = response[i].stationname;

        var el = document.createElement("option");
        el.textContent = rowStationName;
        el.value = rowStationJd;
        select.appendChild(el);
      }
    }
  });
  xhr.open("GET", "https://researchproject-backend.herokuapp.com/api/station/getList" + "/" + stationid);
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}




//CLOCK REQUEST
function clockrequest() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      hour = response;
      for (var i = 0; i < response.length; i++) {
        var select = document.getElementById("saatler");
        var resp = response[i].value;
        var x = resp.split("-");                                //clock düzenlenerek kendi comboboxuna(saatler) yerlestiriliyor
        if (x.length > 0) {
          var startHour = x[0];
          var endHour = x[1];
          endHour = endHour == "24" ? "0" : endHour;
          var startHourString = startHour.padStart(2, "0") + ":00";
          var endHourString = endHour.padStart(2, "0") + ":00";
          var el = document.createElement("option");
          el.textContent = startHourString + "-" + endHourString;
          el.value = response[i].id;
          select.appendChild(el);
        }
      }
    }
  });
  xhr.open("GET", "https://researchproject-backend.herokuapp.com/api/timerange/getList");
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}




$('#stown').on('change', function (e) {                     //birinci comboboxa tıklandığında
  var fromSelectedValue = $('#stown').find(":selected").val();
  var fromSelectedText = $('#stown').find(":selected").text();

  $('#sstation').find('option').remove();
  fromStationDetail(fromSelectedValue, sstation, textFromStation); //secilen town idsi, "sstation" , "To Station"

  //To station bilgileri çekilir. 
  if (fromSelectedText != "CAMPUS") {//Campus seçildi
    $("#ftown option").each(function (x) {
      var itemText = $(this).text();
      if (itemText != "CAMPUS" && itemText != "To") {
        $(this).remove();
      }
    });
  }
  else {//Campus dışında ki bi yer seçildi
    $("#ftown option").each(function (x) {
      var itemText = $(this).text();
      if (itemText != "To") {
        $(this).remove();
      }
    });
    townrequest(ftown); //Tüm hepsi tekrar çekildi 
  }
})



$('#ftown').on('change', function (e) {                     //birinci comboboxa tıklandığında
  var toSelectedValue = $('#ftown').find(":selected").val();
  var toSelectedText = $('#ftown').find(":selected").text();
  //From Station detail çekilir. Örn: Bahçelieveler seçildiğinde mahallerinin gelmesi sağlanır  
  $('#fstation').find('option').remove();
  fromStationDetail(toSelectedValue, fstation, textToStation);
})



//TARIHLER DEGİSTİGİNDE
$('#date').on('change', function (e) {
  var valueSelected = this.value;
  date = valueSelected;
})


//UPDATE BUTONA BASILDIGINDA
function convertandpost() {

  var hourid = $('#saatler').find(":selected").val();
  var fromStation = $('#sstation').find(":selected").val();
  var toStation = $('#fstation').find(":selected").val();


  var data = JSON.stringify({
    "user": {
      "id": window.localStorage.getItem("Id")
    },
    "timeRange": {
      "id": hourid
    },
    "fromStation": {
      "id": fromStation
    },
    "toStation": {
      "id": toStation
    },
    "date": date
  });
    
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.status == 200) {
        const response = JSON.parse(this.response);
        alert("Successful!");
        window.location = 'http://127.0.0.1:5500/page7%20mytrips/index.html'
      }
      else {
        alert("Unexpected Error!");
      }
    }
  });
  xhr.open("PUT", "https://researchproject-backend.herokuapp.com/api/travel/update/"+updateId);
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}


function clearmemory() {
  localStorage.clear();
}