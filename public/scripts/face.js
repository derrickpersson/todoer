$(document).ready(function() {
  Webcam.attach( '#my_camera' );
  var add_to_collection = function() {
    var photo_id = $("#photo_id").val();
    if (!photo_id.length) {
      $('#upload_status').html("please provide name for the upload");
      return;
    }
    //$('#loading_img').show()
    Webcam.snap( function(data_uri) {
      console.log(data_uri);
      document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
      //$('#loading_img').show()
      Webcam.on('uploadProgress', function(progress) {
        console.log(progress);
      });
      Webcam.on('uploadComplete', function(code,text) {
        console.log(code);
        console.log(text);
        //$('#loading_img').hide()
      });
      Webcam.upload(data_uri, `/face/saveimage/${photo_id}`);
    })
  }

  var compareImage = function() {
    var photo_id = $("#photo_id").val();
    if (!photo_id.length) {
      $('#upload_status').html("please provide name for the upload");
      return;
    }
    //$('#loading_img').show()
    Webcam.snap( function(data_uri) {
      console.log(data_uri);
      document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
      //$('#loading_img').show()
      Webcam.on('uploadProgress', function(progress) {
        console.log(progress);
      });
      Webcam.on('uploadComplete', function(code,text) {
        console.log(code);
        console.log(text);
        //$('#loading_img').hide()
      });
      Webcam.upload(data_uri, `/users/compare`);
    })
  }



  //take a photo
  $('#take').click(function () {
    add_to_collection();
  })
  $('#compare_image').click(function () {
    compareImage();
  })
});
