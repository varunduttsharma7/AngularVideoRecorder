import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
declare var MediaRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constraintObj: object;
  @ViewChild('myVideoElement') myVideoElement: ElementRef;
  @ViewChild('btnStart') btnStart: ElementRef;
  @ViewChild('btnStop') btnStop: ElementRef;
  @ViewChild('vid2') vid2: ElementRef;
  @ViewChild('startCam') startCam: ElementRef;
  recordMsg: string;

  constructor() {
    this.constraintObj = {
      audio: true,
      video: {
        facingMode: "user",
        width: { min: 640, ideal: 1280, max: 640 },
        height: { min: 480, ideal: 720, max: 480 }
      }
    };

  }

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          console.log(device.kind.toUpperCase(), device.label);
        })
      })
      .catch(err => {
        console.log(err.name, err.message);
      })
  }
  onStartCamera() {
    this.recordMsg = "Camera started...."
    this.startCamera(this);
  }
  clearRecording() {
    this.recordMsg = "";
    this.vid2.nativeElement.src = "";
  }

  startCamera(self: this) {
    navigator.mediaDevices.getUserMedia(this.constraintObj)
      .then(function (mediaStreamObj) {
        let video: HTMLMediaElement = self.myVideoElement.nativeElement;
        if ("srcObject" in video) {
          video.srcObject = mediaStreamObj;
        }

        video.onloadedmetadata = function (ev) {
          //show in the video element what is being captured by the webcam
          video.play();
        };

        //add listeners for saving video/audio
        let start: HTMLButtonElement = self.btnStart.nativeElement;
        let stop: HTMLButtonElement = self.btnStop.nativeElement;
        let vidSave: HTMLMediaElement = self.vid2.nativeElement;
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        start.addEventListener('click', (ev) => {
          self.recordMsg = "Recording.....";
          mediaRecorder.start();
          console.log(mediaRecorder.state);
        });
        stop.addEventListener('click', (ev) => {
          self.recordMsg = "stopped.....";
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
        });
        mediaRecorder.ondataavailable = function (ev) {
          chunks.push(ev.data);
        };
        mediaRecorder.onstop = (ev) => {
          let blob = new Blob(chunks, { 'type': 'video/mp4;' });
          chunks = [];
          let videoURL = window.URL.createObjectURL(blob);
          vidSave.src = videoURL;
        };
      })
      .catch(function (err) {
        console.log(err.name, err.message);
      });
  }
}
