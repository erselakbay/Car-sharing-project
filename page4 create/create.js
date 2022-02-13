var stown = "stown";
var ftown = "ftown";
var sstation = "sstation";
var fstation = "fstation";
var textFromStation = "From Station";
var textToStation = "To Station";

townrequest(stown);                          //townrequest ile ilçeler çekiliyor
townrequest(ftown);                          //townrequest ile ilçeler çekiliyor
clockrequest();

var date;
var hour;              //tüm saatler ve idleri


//TOWN REQUEST ok
function townrequest(income) {
  var today = new Date().toISOString().split('T')[0];
  document.getElementsByName("date")[0].setAttribute('min', today);
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if(xhr.status==401){
        window.location = 'http://127.0.0.1:5500/page2%20sign/'
    } 
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



//CLOCK REQUEST ok
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
          el.value=response[i].id;
          select.appendChild(el);
        }
      }
    }
  });
  xhr.open("GET", "https://researchproject-backend.herokuapp.com/api/timerange/getList");
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.send();
}


//BASLANGIC TOWN DEGİSTİGİNDE ok
$('#stown').on('change', function (e) {                     //birinci comboboxa tıklandığında
  var fromSelectedValue = $('#stown').find(":selected").val();
  var fromSelectedText = $('#stown').find(":selected").text();

  //From Station detail çekilir. Örn: Bahçelieveler seçildiğinde mahallerinin gelmesi sağlanır  
  $('#sstation').show();
  $('#sstation').find('option').remove();
  fromStationDetail(fromSelectedValue,sstation,textFromStation); //secilen town idsi, "sstation" , "To Station"

  //To station bilgileri çekilir. 
  if (fromSelectedText != "CAMPUS") {//Campus seçildi
    $("#ftown option").each(function (x) {
      var itemText = $(this).text(); 
      if ( itemText != "CAMPUS" && itemText != "To") {
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

//STATION REQUEST ok
function fromStationDetail(stationid,stationbox,text) {
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


$('#ftown').on('change', function (e) {                     //birinci comboboxa tıklandığında

  var toSelectedValue = $('#ftown').find(":selected").val();
  var toSelectedText = $('#ftown').find(":selected").text();


  //From Station detail çekilir. Örn: Bahçelieveler seçildiğinde mahallerinin gelmesi sağlanır  
  $('#fstation').show();  
  $('#fstation').find('option').remove();  
  fromStationDetail(toSelectedValue,fstation,textToStation);


})

//TARIHLER DEGİSTİGİNDE
$('#date').on('change', function (e) {
  var valueSelected = this.value;
  date = valueSelected;
})

//SEARCH BUTONA BASILDIGINDA
function convertandpost() {
  var fromStation = $('#sstation').find(":selected").val();
  var toStation = $('#fstation').find(":selected").val();
  var hourid = $('#saatler').find(":selected").val();
  postinfos(hourid, fromStation, toStation, date);
}


//POST SEARCH INFOS
function postinfos(hour, start2id, finish2id, date) {
  var data = JSON.stringify({
    "user": {
      "id": window.localStorage.getItem("Id")
    },
    "timeRange": {
      "id": hour
    },
    "fromStation": {
      "id": start2id
    },
    "toStation": {
      "id": finish2id
    },
    "date": date
  });
  
  
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      if (this.status == 201) {
        const response = JSON.parse(this.response);
        alert("Successful!");
        window.location = 'http://127.0.0.1:5500/page7%20mytrips/index.html'
      }
      else {
        alert("Unexpected Error!");
      }
    }
  });
  xhr.open("POST", "https://researchproject-backend.herokuapp.com/api/travel/create");
  xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("AccessToken"));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);

}

function clearmemory()
{

  localStorage.clear();
}