import { Component, OnInit } from "@angular/core";

const SOCKET_ENDPOINT = "localhost:3000";

@Component({
  selector: "app-chatbox",
  templateUrl: "./chatbox.component.html",
  styleUrls: ["./chatbox.component.scss"],
})
export class ChatboxComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    //   this.setUpSocketConnection();
  }

  // setUpSocketConnection(): void {
  //   this.socket = io(SOCKET_ENDPOINT, {
  //     transports: ["websocket", "polling", "flashsocket"],
  //   });
  // }
}
