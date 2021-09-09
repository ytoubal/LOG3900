import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { io, Socket } from "socket.io-client/build/index";
import { formatDate } from "@angular/common";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { ChatService } from "src/app/services/chat/chat.service";
import { Router } from "@angular/router";
import { IUser } from "../../../../../../server/IUser";
import { IMessageContent } from "../../../../../../server/IMessageContent";
import { browserRefresh } from "../../../app.component";

// const SOCKET_ENDPOINT = "http://localhost:3000/";
const SOCKET_ENDPOINT = "https://painseau.herokuapp.com/";

@Component({
  selector: "app-message-list",
  templateUrl: "./message-list.component.html",
  styleUrls: ["./message-list.component.scss"],
})
export class MessageListComponent implements OnInit {
  @ViewChild("currentUserMessage", { static: false })
  messageList: ElementRef;

  @ViewChild("chat-input", { static: false }) chatInput: ElementRef;
  @ViewChild("container", { static: false }) chatContainer: ElementRef;

  socket: Socket;
  sentMessage: string;
  name: string;
  connectedUser: IUser;
  browserRefresh: boolean;

  constructor(
    private chatService: ChatService,
    private renderer: Renderer2,
    private authService: AuthentificationService,
    private router: Router
  ) {
    this.connectedUser = { username: this.authService.username, socketId: "" };
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;

    if (this.browserRefresh) {
      this.logout();
      this.router.navigate(["/"]);
    }
    this.socket.emit("user-joined", JSON.stringify(this.connectedUser));
  }

  setUpSocketConnection(): void {
    if (this.authService.isA) {
      this.socket = io(SOCKET_ENDPOINT, {
        transports: ["websocket", "polling", "flashsocket"],
      });
    } else {
      this.socket = io(SOCKET_ENDPOINT, {
        transports: ["websocket", "polling", "flashsocket"],
      });
    }

    this.socket.on("logout", (userName: string) => {
      this.addConnectionDiv(userName, "left the room");
      console.log(userName + " has left the room");
    });

    this.socket.on("user-joined", (userName: string) => {
      this.addConnectionDiv(userName, "has joined the room");
    });

    this.socket.on("send-message", (message: IMessageContent) => {
      const messageData = JSON.parse(JSON.stringify(message));
      if (messageData.sender.username === this.connectedUser.username) {
        this.selfBubble(messageData.message, messageData.timestamp);
      } else {
        this.otherBubble(
          messageData.message,
          messageData.timestamp,
          messageData.sender.username
        );
      }
    });
  }

  otherBubble(msg: string, currentTime: string, username: string) {
    const userDiv = this.renderer.createElement("div");
    this.renderer.addClass(userDiv, "other-user-message");

    const userProfile = this.renderer.createElement("div");
    this.renderer.addClass(userProfile, "user-container");

    const userAvatarDiv = this.renderer.createElement("div");
    this.renderer.addClass(userAvatarDiv, "other-user-avatar");
    const userAvatarImg = this.renderer.createElement("img");
    this.renderer.addClass(userAvatarImg, "image");

    this.renderer.setAttribute(
      userAvatarImg,
      "src",
      "assets/images/anon_icon.jpg"
    );

    const currentUsername = this.renderer.createElement("div");
    this.renderer.addClass(currentUsername, "username");
    currentUsername.innerHTML = username;

    const currentUserTxtDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserTxtDiv, "other-user-text");
    currentUserTxtDiv.innerHTML = msg;

    const timeDiv = this.renderer.createElement("div");
    this.renderer.addClass(timeDiv, "timeDiv");
    timeDiv.innerHTML = currentTime;

    this.renderer.appendChild(userAvatarDiv, userAvatarImg);
    this.renderer.appendChild(userDiv, userProfile);
    this.renderer.appendChild(userProfile, userAvatarDiv);
    this.renderer.appendChild(userProfile, currentUsername);

    this.renderer.appendChild(userDiv, currentUserTxtDiv);
    this.renderer.appendChild(this.messageList.nativeElement, userDiv);
    this.renderer.appendChild(userDiv, timeDiv);

    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  selfBubble(msg: string, currentTime: string): void {
    const currentUserDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserDiv, "current-user-message");

    const currentUserProfile = this.renderer.createElement("div");
    this.renderer.addClass(currentUserProfile, "user-container");

    const currentUserAvatarDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserAvatarDiv, "current-user-avatar");
    const currentUserAvatarImg = this.renderer.createElement("img");
    this.renderer.addClass(currentUserAvatarImg, "image");

    this.renderer.setAttribute(
      currentUserAvatarImg,
      "src",
      "assets/images/anon_icon.jpg"
    );

    const currentUsername = this.renderer.createElement("div");
    this.renderer.addClass(currentUsername, "username");
    currentUsername.innerHTML = this.connectedUser.username;

    const currentUserTxtDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserTxtDiv, "current-user-text");
    currentUserTxtDiv.innerHTML = msg;

    const timeDiv = this.renderer.createElement("div");
    this.renderer.addClass(timeDiv, "timeDiv");
    timeDiv.innerHTML = currentTime;

    this.renderer.appendChild(currentUserAvatarDiv, currentUserAvatarImg);
    this.renderer.appendChild(currentUserDiv, currentUserProfile);
    this.renderer.appendChild(currentUserProfile, currentUserAvatarDiv);
    this.renderer.appendChild(currentUserProfile, currentUsername);

    this.renderer.appendChild(currentUserDiv, currentUserTxtDiv);
    this.renderer.appendChild(this.messageList.nativeElement, currentUserDiv);
    this.renderer.appendChild(currentUserDiv, timeDiv);

    this.sentMessage = "";
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  addConnectionDiv(user: string, event: string): void {
    const userConnectedDiv = this.renderer.createElement("div");
    this.renderer.addClass(userConnectedDiv, "notify");
    userConnectedDiv.innerHTML = user + " has " + event;
    if (user) {
      this.renderer.appendChild(
        this.messageList.nativeElement,
        userConnectedDiv
      );
    }
  }

  sendMessage() {
    if (this.sentMessage.trim()) {
      // this.socket.emit('message', this.sentMessage);
      const user: IUser = {
        username: this.connectedUser.username,
        socketId: "",
      };
      const message: IMessageContent = {
        message: this.sentMessage.trim(),
        sender: user,
        timestamp: "",
      };
      this.socket.emit("send-message", JSON.stringify(message));
    }
  }

  logout() {
    this.router.navigate(["/"]);
    this.socket.emit("logout", JSON.stringify(this.connectedUser)); // POUR DECONNECTER
  }
}
