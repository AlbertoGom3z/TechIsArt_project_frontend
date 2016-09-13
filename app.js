window.onload = function() {
  console.log('lockedin');

<<<<<<< HEAD
var url = "https://nameless-headland-69072.herokuapp.com"
=======
var url = "https://secure-citadel-68522.herokuapp.com"
>>>>>>> master
// var url = 'http://localhost:3000';

var goButton = document.getElementById("go");
goButton.addEventListener("click", function(ev){
  ev.preventDefault();
  getResults();
});

var centuryButton = document.getElementById("century-select");
centuryButton.addEventListener("change", function(ev){
  ev.preventDefault();
  getResults();
});

var cultureButton = document.getElementById("culture-select");
cultureButton.addEventListener("change", function(ev){
  ev.preventDefault();
  getResults();
});

var classificationButton = document.getElementById("classification-select");
classificationButton.addEventListener("change", function(ev){
  ev.preventDefault();
  getResults();
});

// var hueButton = document.getElementById("hue-select");
// hueButton.addEventListener("change", function(ev){
//   ev.preventDefault();
//   getResults();
// });

var techniqueButton = document.getElementById("technique-select");
techniqueButton.addEventListener("change", function(ev){
  ev.preventDefault();
  getResults();
});

var titleSearch = document.getElementById("title-search");
centuryButton.addEventListener("change", function(ev){
  ev.preventDefault();
  getResults();
});

var getResults = function() {
      document.getElementById('arts-dna-image').innerHTML='';
      // var hue = document.getElementById('hue-select').value;
      var culture = document.getElementById('culture-select').value;
      var title = document.getElementById('title-search').value;
      var classification = document.getElementById('classification-select').value;
      var century = document.getElementById('century-select').value;
      var technique = document.getElementById('technique-select').value;
      console.log(century);

   var data = {
    century: century,
    culture: culture,
    classification: classification,
    // hue: hue,
    technique:technique,
    title: title
   };
   //console.log(data);

   $.ajax({
     url: url + '/arts/search/',
     method: 'POST',
     data: data,
     dataType: 'json'
   }).done(function(response) {
     console.log( "response:", response )

     var recordsArray = response.records;
     //console.log(recordsArray[0].title);
      for (var i = 0; i < recordsArray.length; i++) {
      //console.log(i);

      addArticle(recordsArray[i]);
///////////////////////////////////////////////////////////////////
        };//closes for loop

        /////////////////////////////////////////
        $("article.cell").each(function() {
          var artsID=$(this).attr("data-id");
          var self = this;
          isFavorited(artsID, function(response) {
            if (response === true) {
              $(self).find("button").addClass('on');
              // for each article get the id, if favorited, then add the class on.
            }
          });
        });
          ////////////////////////////////////////

        applyMasonry();

   }); // end ajax
 }; //end of getResult


var addArticle = function(data) {
  //  var source = response.records[i].primaryimageurl;
  var source = false;
  var title = false;
  var description = false;
  var creditline = false;
  var medium = false;

  // var favvy = isFavorited(data.id);
    //console.log(favvy);
  if (typeof data.primaryimageurl == "undefined" || data.primaryimageurl == null || data.primaryimageurl == "") {
    source = "./ImageNotAvailable.png";
  } else {
    source = data.primaryimageurl;
  }
  if (typeof data.title != "undefined" && data.title != null && data.title != "") {
    var title = '<h2 class="title">'+data.title+'</h2>';
  }

  if (typeof data.medium != "undefined" && data.medium != false && data.medium != null && data.medium != "") {
    var medium = '<p class="medium">'+data.medium+'</p>';
  }

  if (typeof data.creditline != "undefined" && data.creditline != null && data.creditline != "") {
    var creditline = '<p class="creditline">'+data.creditline+'</p>';
  }

  // if (typeof recordsArray[i].artist !== "undefined" && recordsArray[i].artist !== "null" && recordsArray[i].artist !== "") {
  //   var artist = '<p class="artist">'+recordsArray[i].artist+'</p>';
  // }

  var article = '<article class="cell" data-id="'+data.id+'">'+
     ' <a href=""><img src="'+source+'" /></a>'+
      title + medium + creditline +
      "<button  class='favebutton'>Add To Favorites</button>"+
    '</article>';
    //removed + artist for now
    //console.log(article);

     $('#arts-dna-image').append(article);
     //masonry call the function
}

 $(document).on("click", ".favebutton", function(ev) {
   //pass the id so get the id first
   var myId = $(this).parent().attr('data-id');
   var mytitle = $(this).parent().find('.title').text();
   var mymedium = $(this).parent().find('.medium').text();
   var myimagesource = $(this).parent().find('img').attr("src");
   var mycreditline = $(this).parent().find('.creditline').text();

   var data = {
        id:myId,
        title: mytitle,
        medium: mymedium,
        imagesource: myimagesource,
        creditline: mycreditline
        }
        console.log(data)
//jquery syntax
        if ($(this).hasClass('on')) {
            //remove from favorites
            $(this).removeClass('on');
            databaseTransaction(data, '/removeFavorites/');
        } else {
          //add to favorites
          $(this).addClass('on');
          databaseTransaction(data, '/favorites/');
        }

 })

    var databaseTransaction = function(data, urlSegment) {

      $.ajax({
        url: url + urlSegment,
        data: data,
        dataType: 'json',
        method: 'post'
      }).done(function(response) {
        console.log(response);
      })
      }

//find all fave /////////////////////////////////////////////////
 var findallFave = document.getElementById('find-all-fave');
 findallFave.addEventListener("click", function(ev){
   ev.preventDefault();
   //console.log('finallFave');
        $('#arts-dna-image').html('');
           $.ajax({
           url: url + '/findfavelist/',
           dataType: 'json'
         }).done(function(response){
           //console.log("response: ", response);
           for (var j=0; j < response.length; j++) {
             addArticle(response[j]);
           }
           /////////////////////////////////////////
           $("article.cell").each(function() {
             var artsID=$(this).attr("data-id");
             var self = this;
             isFavorited(artsID, function(response) {
               if (response === true) {
                 $(self).find("button").addClass('on');
                 // for each article get the id, if favorited, then add the class on.
               }
             })
             ////////////////////////////////////////
         });


          });

       })

   //is Favorited ///////////////////////////////////////////////
   // FE find the existence in the database then return t or f
      var isFavorited = function(ArtId, callback) {
        //changed artId to myArtID...
        //console.log(ArtId);
        var state = false;
        //what is the state of this variable. it is active or not active.
        var data = {
          id: ArtId
        }

        $.ajax({
        url: url + '/isFavorited/',
        data: data,
        dataType: 'json'
      }).done(function(response){
        // console.log("response: ", response);

          if (response.length > 0) {
            //console.log(state);
            // state = true;
              callback(true);
            //console.log('is true', ArtId);
        } else {
              callback(false);
        }
      });

// 6685249 jquery peforming synchonousr ajax requests stack overflow

              //how do i return response from asynchronous call? stack over flow 14220321

      }

  var applyMasonry = function() {
    // init Masonry
    //console.log("inside masonry");
  var $grid = $('#arts-dna-image').masonry({ //changing grid to the box ...
  });

  $grid.imagesLoaded().progress(function() {
    $grid.masonry({
      itemSelector: '.cell',
      columnWidth: 400
      // percentPosition: true //remove
    });
  // code snipped from masonry website to style the frontend
  });
  } //closes masonry function
} // closes windows onload

//make a list of favorites
//make favorites be persisent on searches, for multiple queires it remembers.
//check to see if all of the favorites selected are
