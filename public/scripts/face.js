$(document).ready(function() {
  Webcam.attach('#my_camera');
  var add_to_collection = function() {
    var email = $("#photo_id").val();
    if (!photo_id.length) {
      $('#upload_status').html("please provide name for the upload");
      return;
    }
    //$('#loading_img').show()
    Webcam.snap(function(data_uri) {
      console.log(data_uri);
      document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';
      //$('#loading_img').show()
      Webcam.on('uploadProgress', function(progress) {
        console.log(progress);
      });
      Webcam.on('uploadComplete', function(code, text) {
        console.log(code);
        console.log(text);
        //$('#loading_img').hide()
        }).done(() => {
          console.log("good");
          let sendData = {
            email: email,
            password: "123"
          }
          $.ajax({
            url: "/users/new",
            method: 'POST',
            data: sendData
          });
        window.location.replace("http://localhost:8080");
      });
      Webcam.upload(data_uri, `/users/saveimage/${photo_id}`);
    })
  }

  var compareImage = function() {
    var photo_id = $("#photo_id").val();
    if (!photo_id.length) {
      $('#upload_status').html("please provide account ID for the upload");
      return;
    }
    Webcam.snap(function(data_uri) {
      Webcam.on('uploadProgress', function(progress) {
        console.log(progress);
      });
      Webcam.on('uploadComplete', function(code, text) {
        console.log("code", code);
        console.log("text", text);
        let data = JSON.parse(text)
        console.log(data);
        console.log(data.Confidence);
        let sendData = {
          email: photo_id
        }

        if (data.Confidence > 50) {
          $.ajax({
            url: '/users/face/login',
            method: 'POST',
            data: sendData
          }).done(() => {
            console.log("good");
            window.location.replace("http://localhost:8080")
          })
        }
      });
      Webcam.upload(data_uri, `/users/compare`);
    })
  }

  //take a photo
  $('#take').click(function() {
    console.log("take");
    add_to_collection();
  })
  $('#compare_image').click(function() {
    compareImage();
  })
});
