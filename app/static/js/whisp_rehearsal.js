//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
 
var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
 
 
var recordButton = document.getElementById("recordButton");

var prediction = "";
var sound_file;

var AudioContext;
var audioContext;

var listen = false;
 
//add events to those 3 buttons
recordButton.addEventListener("click", startRecording);

function listen() {
	console.log("listening"+" "+Math.random());
}

$(".correct").click(function(){
	$(".incorrect_div").hide()
	$(".correct_div").show()
});

$(".incorrect").click(function(){
	$(".correct_div").hide()
	$(".incorrect_div").show()
});

function startAudioContext() {
// shim for AudioContext when it's not avb. 
	console.log("starting audio context");
	AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext; //new audio context to help us record
}

function startRecording() {

	listen = !listen; // toggle listening
	console.log(listen)

	if (listen){
		startAudioContext()
		console.log("recordButton clicked");
		$(".loading_ui").show();
		$(".credits").hide();
		//var intervalID = window.setInterval(listen, 5000);
		/*
		$(".upload_ui").hide();
		$(".confirmation").hide();
		$(".correct_div").hide()
		$(".incorrect_div").hide()
		$(".full_results").hide();
		$(".results").text("");
		$("#json").text("");
	*/

	    var constraints = { audio: true, video:false }

	    /*
	    Disable the record button until we get a success or fail from getUserMedia()
	    */

	    recordButton.disabled = true;

	    /*
	    We're using the standard promise based getUserMedia()
	    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	    */

	    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/* assign to gumStream for later use */
		gumStream = stream;

		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		console.log("created audio context")

		/*
		Create the Recorder object and configure to record mono sound (1 channel)
		Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");
		setTimeout(() => {
		// this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
		stopRecording();
	    }, 5000);

	    }).catch(function(err) {
		//enable the record button if getUserMedia() fails
		recordButton.disabled = false;
	    });
	}
}

function pauseRecording(){
    console.log("pauseButton clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
    }else{
        //resume
        rec.record()
    }
}

function stopRecording() {
    console.log("stopButton clicked");


    //disable the stop button, enable the record too allow for new recordings
    recordButton.disabled = false;

    //reset button just in case the recording is stopped while paused
    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

	var url = URL.createObjectURL(blob);
	var link = document.createElement('a');

	sound_file = blob;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.wav';
	var filename = new Date().toISOString(); //filename to send to server without extension


	
	var xhr=new XMLHttpRequest();
	xhr.onload=function(e) {
		if(this.readyState === 4) {
              		console.log("Server returned: ",e.target.responseText);
          	}
          	
		if (this.readyState == XMLHttpRequest.DONE) {
			console.log(this.responseText);	
			var obj = JSON.parse(this.responseText);
			$(".upload_ui").show();
			//$(".credits").show();
			//$(".loading_ui").hide();
			$(".correct_div").hide()
			$(".incorrect_div").hide()
			var top_prediction_name = obj["predictions"][0][0];
			prediction = obj["predictions"][0][0]; 
			top_prediction_name = top_prediction_name.split('_').join(' ');
			var top_prediction_number = Math.round(obj["predictions"][0][1] * 100) ;//obj["predictions"][0][1];
			var top_prediction = "<p>" + top_prediction_name + "</p>";
			$(".results").append(top_prediction);


			if (listen) {	
			// record again
				rec.record()

				console.log("Recording started");
				setTimeout(() => {
				// this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
				stopRecording();
				}, 5000);
			}
		}
      	};

      	var fd=new FormData();
      	filename = filename + ".wav";
      	fd.append("file",sound_file, filename);
      	xhr.open("POST","/upload",true);
      	xhr.send(fd);
}

document.querySelector('#choose-button').addEventListener('click', function() {
	document.querySelector('#upload-file').click();

});

document.querySelector('#upload-file').addEventListener('change', function() {
	// This is the file user has chosen
	$(".upload_ui").hide();
	$(".credits").hide();
	$(".confirmation").hide();
	$(".correct_div").hide();
	$(".incorrect_div").hide();
	$(".full_results").hide();
	$(".loading_ui").show();
	$(".results").text("");
	$("#json").text("");
	var file = this.files[0];
	file = document.querySelector('#upload-file').files[0]
	createDownloadLink(file)
});

document.querySelector('#category-button').addEventListener('click', function() {
	var file = document.querySelector('#upload-file').files[0]
	if (sound_file === undefined) {
		sound_file = file;
	}

	var select_element = document.getElementById("sound_category");
	var select_category = select_element.options[select_element.selectedIndex].value;

	var select_category_fill_in = document.getElementById("sound_category_fill_in").value;

	console.log(sound_file)
	console.log(select_category)
	console.log(select_category_fill_in)

	var xhr=new XMLHttpRequest();
	xhr.onload=function(e) {
		if(this.readyState === 4) {
              		console.log("Server returned: ",e.target.responseText);
          	}
          	
		if (this.readyState == XMLHttpRequest.DONE) {
			var obj = JSON.parse(this.responseText); // not sure what to do with it yet
			$(".category_submission").hide();
			$(".confirmation_success").show();
			setTimeout(function() { $(".confirmation_success").hide(); }, 5000);
	
		}
      	};

	//send sound and info back to server
      	var fd=new FormData();
	var filename = new Date().toISOString(); //filename to send to server without extension
      	filename = filename + ".wav";
      	fd.append("file",sound_file, filename);
        fd.append("guessed_category", prediction);
	fd.append("select_category",select_category); 
	fd.append("select_category_fill_in",select_category_fill_in); 
      	xhr.open("POST","/upload-category",true);
      	xhr.send(fd);
	$(".category_submission").show();
	$(".incorrect_div").hide();
});
