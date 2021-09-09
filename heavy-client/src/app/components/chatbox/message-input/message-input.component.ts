import { Component, OnInit } from "@angular/core";
import { ChatService } from "src/app/services/chat/chat.service";

@Component({
  selector: "app-message-input",
  templateUrl: "./message-input.component.html",
  styleUrls: ["./message-input.component.scss"],
})
export class MessageInputComponent implements OnInit {
  sentMessage: string;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  // create a method sendMessage()
  // transmits message to the socket
  sendMessage() {
    this.chatService.message = this.sentMessage;
    this.sentMessage = "";
  }
}
