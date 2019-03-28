//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
 
var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext; //new audio context to help us record
 
var recordButton = document.getElementById("recordButton");
 
//add events to those 3 buttons
recordButton.addEventListener("click", startRecording);

$(".recordButton").click(function(){
startRecording()
});

function startRecording() {
    console.log("recordButton clicked");
	$(".upload_ui").hide();
	$(".credits").hide();
	$(".loading_ui").show();
	$(".results").text("");
	$("#json").text("");

    /*
    Simple constraints object, for more advanced audio features see
    <div class="video-container"><blockquote class="wp-embedded-content" data-secret="cVHlrYJoGD"><a href="https://addpipe.com/blog/audio-constraints-getusermedia/">Supported Audio Constraints in getUserMedia()</a></blockquote><iframe class="wp-embedded-content" sandbox="allow-scripts" security="restricted" style="position: absolute; clip: rect(1px, 1px, 1px, 1px);" src="https://addpipe.com/blog/audio-constraints-getusermedia/embed/#?secret=cVHlrYJoGD" data-secret="cVHlrYJoGD" title="“Supported Audio Constraints in getUserMedia()” — Pipe Blog" marginwidth="0" marginheight="0" scrolling="no" width="600" height="338" frameborder="0"></iframe></div>
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
			var obj = JSON.parse(this.responseText);
			$(".upload_ui").show();
			$(".credits").show();
			$(".loading_ui").hide();
			var top_prediction_name = obj["predictions"][0][0];
			top_prediction_name = top_prediction_name.split('_').join(' ');
			var top_prediction_number = Math.round(obj["predictions"][0][1] * 100) ;//obj["predictions"][0][1];
			var html = "Top Prediction: " + top_prediction_name + " with " + top_prediction_number + "% confidence!";

			html += "<br><br> Full report below: <br><br>"
			html += JSON.stringify(obj, undefined, 5);
			$(".results").html(html);
			var formattedData = JSON.stringify(obj, null, 2); 
			$('#json').text(formattedData);

			//document.getElementById("json").innerHTML = JSON.stringify(obj, undefined, 5);
		}
      	};

      	var fd=new FormData();
      	filename = filename + ".wav";
      	fd.append("file",blob, filename);
      	xhr.open("POST","/upload_new",true);
      	xhr.send(fd);
}

document.querySelector('#choose-button').addEventListener('click', function() {
	document.querySelector('#upload-file').click();

});

document.querySelector('#upload-file').addEventListener('change', function() {
	// This is the file user has chosen
	$(".upload_ui").hide();
	$(".credits").hide()
	$(".loading_ui").show();
	$(".results").text("");
	$("#json").text("");
	var file = this.files[0];
	file = document.querySelector('#upload-file').files[0]
	createDownloadLink(file)
});
