import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { io, Socket } from "socket.io-client/build/index";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { ChatService } from "src/app/services/chat/chat.service";
import { Router } from "@angular/router";
import { IUserInfo } from "../../../../../../server/app/interfaces/IUserInfo";
import { IMessageContent } from "../../../../../../server/app/interfaces/IMessageContent";
import { browserRefresh } from "../../../app.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { NewRoomDialogComponent } from "../new-room-dialog/new-room-dialog.component";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { RoomService } from "src/app/services/room/room.service";
import { ModalService } from "src/app/services/modal/modal.service";
import { profilePics } from "src/app/const/profile-pics";
import { IRoom } from "../../../../../../server/app/interfaces/IRoom";
import { DATABASE_URL } from "src/app/const/database-url";
import { ThemeService } from "src/app/services/theme/theme.service";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { TranslateService } from "@ngx-translate/core";

// import { GameService } from "src/app/services/game/game-service.service";

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
  @ViewChild("searchbar", { static: false }) searchbar: ElementRef;
  @ViewChildren(NewRoomDialogComponent)
  children: QueryList<NewRoomDialogComponent>;

  // sockets: Socket[] = [];
  sentMessage: string;
  name: string;
  connectedUser: IUserInfo["connection"];

  browserRefresh: boolean;
  toggleSearch: boolean;
  joinedRooom: boolean;
  isLoaded: boolean = true;
  clickHist: boolean = false;

  showRoom: boolean;
  roomList: string[] = [];
  currentRoom: string;
  searchText = "";
  searchList: IRoom[];

  currentRoomAdmin: string;

  constructor(
    public roomService: RoomService,
    private renderer: Renderer2,
    private authService: AuthentificationService,
    public router: Router,
    public http: HttpClient,
    private modalService: ModalService,
    private snackbarService: SnackbarService,
    public themeService: ThemeService,
    private chatService: ChatService, // public gameService: GameService,
    public translate: TranslateService
  ) {
    this.connectedUser = {
      username: this.authService.username,
      password: this.authService.password,
      socketId: "",
      isConnected: true,
      rooms: [],
    };
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    this.roomService.roomList = [];
    this.roomService.userRooms = [];
    this.roomService.getAllRooms();
    this.showRoom = true;
    this.toggleSearch = false;
  }

  ngAfterContentInit() {
    this.getAllRooms();
    this.connectToUserRooms();
  }

  setUpSocketConnection(room: string): void {
    // let socket = io(DATABASE_URL, {
    //   transports: ["websocket", "polling", "flashsocket"],
    // });
    // this.sockets[room] = socket;

    // this.sockets[room].emit(
    //   "user-joined",
    //   JSON.stringify({ username: this.connectedUser.username, room })
    // );

    if (this.chatService.sockets[room] == undefined) {
      this.chatService.setUpSocketConnection(room);
    }

    this.chatService.resetSetup(room);

    this.chatService.sockets[room].on("delete-room", () => {
      this.chatService.sockets[room].disconnect();
      this.chatService.sockets[room] = undefined;
      if (room == this.currentRoom && !this.showRoom) {
        if (!this.isAdmin(this.currentRoomAdmin)) {
          const lang = this.translate.currentLang.toString();
          if (lang === "en")
            this.snackbarService.openSnackBar(
              "This room has been deleted.",
              "Close"
            );
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Ce canal a été supprimé.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Dieser Chatraum wurde gelöscht.",
              "Schließen"
            );
        }
        this.showRooms();
      }
      for (let element of this.connectedUser.rooms) {
        if (element == room) {
          this.connectedUser.rooms.splice(
            this.connectedUser.rooms.indexOf(element),
            1
          );
          this.roomService.userRooms.splice(
            this.connectedUser.rooms.indexOf(element),
            1
          );
        }
      }
    });

    this.chatService.sockets[room].on("quit-room", () => {
      if (!this.isAdmin(this.currentRoomAdmin)) {
        this.chatService.sockets[room].disconnect();
        this.chatService.sockets[room] = undefined;
        this.showRooms();
      }
    });

    // this.sockets[room].on("logout", (userName: string) => {
    //   this.addConnectionDiv(userName, "left the room");
    // });

    // this.chatService.sockets["General"].on("logout", (username: string) => {
    //   if (username == this.connectedUser.username) {
    //     this.disconnectRooms();
    //   }
    // });

    // this.sockets[room].on("user-joined", (userName: string) => {
    //   this.addConnectionDiv(userName, " joined the room");
    // });

    this.chatService.sockets[room].on(
      "send-message",
      (message: IMessageContent) => {
        const messageData = JSON.parse(JSON.stringify(message));
        if (messageData.room == this.currentRoom) {
          if (messageData.sender === this.connectedUser.username) {
            this.selfBubble(
              messageData.message,
              messageData.timestamp,
              messageData.avatar
            );
            // this.gameService.guessWord(messageData.message);
          } else {
            this.otherBubble(
              messageData.message,
              messageData.timestamp,
              messageData.sender,
              messageData.avatar
            );
          }
        }
      }
    );
  }

  otherBubble(
    msg: string,
    currentTime: string,
    username: string,
    avatar: string
  ) {
    const userDiv = this.renderer.createElement("div");
    this.renderer.addClass(userDiv, "other-user-message");

    const userProfile = this.renderer.createElement("div");
    this.renderer.addClass(userProfile, "user-container");

    const userAvatarDiv = this.renderer.createElement("div");
    this.renderer.addClass(userAvatarDiv, "other-user-avatar");
    const userAvatarImg = this.renderer.createElement("img");
    this.renderer.addClass(userAvatarImg, "image");

    let icon = "assets/images/anon_icon.jpg";
    profilePics.forEach((data) => {
      if (data.name == avatar) {
        icon = data.src;
      }
    });

    this.renderer.setAttribute(userAvatarImg, "src", icon);

    const currentUsername = this.renderer.createElement("div");
    this.renderer.addClass(currentUsername, "username");
    currentUsername.innerHTML = username;

    const currentUserTxtDiv = this.renderer.createElement("div");

    const timeDiv = this.renderer.createElement("div");
    this.renderer.addClass(timeDiv, "timeDiv");

    if (this.router.url == "/tutorial" || this.router.url == "/workspace") {
      this.renderer.addClass(userAvatarImg, "in-game");
      currentUserTxtDiv.classList.add(
        "other-user-text",
        "in-game",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", "in-game", this.themeService.theme);
    } else {
      currentUserTxtDiv.classList.add(
        "other-user-text",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", this.themeService.theme);
    }
    currentUserTxtDiv.innerHTML = msg;
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

  selfBubble(msg: string, currentTime: string, avatar: string): void {
    const currentUserDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserDiv, "current-user-message");

    const currentUserProfile = this.renderer.createElement("div");
    this.renderer.addClass(currentUserProfile, "user-container");

    const currentUserAvatarDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserAvatarDiv, "current-user-avatar");
    const currentUserAvatarImg = this.renderer.createElement("img");
    this.renderer.addClass(currentUserAvatarImg, "image");

    let icon = "assets/images/anon_icon.jpg";
    profilePics.forEach((data) => {
      if (data.name == avatar) {
        icon = data.src;
      }
    });

    this.renderer.setAttribute(currentUserAvatarImg, "src", icon);

    const currentUsername = this.renderer.createElement("div");
    this.renderer.addClass(currentUsername, "username");
    currentUsername.innerHTML = this.connectedUser.username;

    const currentUserTxtDiv = this.renderer.createElement("div");
    // this.renderer.addClass(currentUserTxtDiv, "current-user-text");

    const timeDiv = this.renderer.createElement("div");
    // this.renderer.addClass(timeDiv, "timeDiv");

    if (this.router.url == "/tutorial" || this.router.url == "/workspace") {
      this.renderer.addClass(currentUserAvatarImg, "in-game");
      currentUserTxtDiv.classList.add(
        "current-user-text",
        "in-game",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", "in-game", this.themeService.theme);
    } else {
      currentUserTxtDiv.classList.add(
        "current-user-text",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", this.themeService.theme);
    }
    timeDiv.innerHTML = currentTime;
    currentUserTxtDiv.innerHTML = msg;

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
      const message: IMessageContent = {
        message: this.sentMessage.trim(),
        sender: this.connectedUser.username,
        timestamp: "",
        room: this.currentRoom,
        avatar: this.authService.avatar,
      };
      this.chatService.sockets[this.currentRoom].emit(
        "send-message",
        JSON.stringify(message)
      );
    }
  }

  async showHistory(room: string): Promise<void> {
    this.clickHist = true;
    this.isLoaded = false;
    await this.getHistory(room);
  }

  async getHistory(room: string) {
    const params = new HttpParams().set("name", room); // Create new HttpParams
    return this.http
      .get(DATABASE_URL + "/database/room-history", { params })
      .subscribe(async (data) => {
        if (JSON.parse(JSON.stringify(data)).history) {
          this.messageList.nativeElement.innerHTML = "";
          for (let element of JSON.parse(JSON.stringify(data)).history) {
            if (element.sender == this.connectedUser.username) {
              this.selfBubble(
                element.message,
                element.timestamp,
                element.avatar
              );
            } else {
              this.otherBubble(
                element.message,
                element.timestamp,
                element.sender,
                element.avatar
              );
            }
          }
        }
        this.isLoaded = true;
      });
  }

  clearMsg(): void {
    const children: HTMLElement[] = [];
    if (this.chatContainer) {
      this.chatContainer.nativeElement.childNodes.forEach(
        (child: HTMLElement) => {
          if (child.className === "current-user-message") children.push(child);
        }
      );
      while (children.length > 0) {
        this.chatContainer.nativeElement.removeChild(children.pop());
      }
    }
  }

  async getCurrentHistory(room: string) {
    const params = new HttpParams().set("name", room); // Create new HttpParams
    return this.http
      .get(DATABASE_URL + "/database/room-history", { params })
      .subscribe(async (data) => {
        if (JSON.parse(JSON.stringify(data)).history) {
          for (let element of JSON.parse(JSON.stringify(data)).history) {
            if (
              new Date(element.timestamp) >
              new Date(this.authService.connection)
            ) {
              if (element.sender == this.connectedUser.username) {
                this.selfBubble(
                  element.message,
                  element.timestamp,
                  element.avatar
                );
              } else {
                this.otherBubble(
                  element.message,
                  element.timestamp,
                  element.sender,
                  element.avatar
                );
              }
            }
          }
        }
      });
  }

  async joinChatRoom(room: string) {
    this.currentRoom = room;
    this.connectedUser.rooms.push(room);
    this.roomService.userRooms.push(room);
    this.setUpSocketConnection(room);
  }

  quitChatRoom(room: string) {
    let index = this.connectedUser.rooms.indexOf(room);
    this.connectedUser.rooms.splice(index, 1);
    this.roomService.userRooms.splice(index, 1);
    let user = JSON.stringify({ username: this.connectedUser.username, room });
    this.chatService.sockets[room].emit("quit-room", user);
    if (this.isAdmin(this.currentRoomAdmin)) {
      this.openWarning(room);
      // this.deleteRoom(room);
    } else {
      for (let element of this.connectedUser.rooms) {
        if (element == room) {
          this.connectedUser.rooms.splice(
            this.connectedUser.rooms.indexOf(element),
            1
          );
          this.roomService.userRooms.splice(
            this.connectedUser.rooms.indexOf(element),
            1
          );
        }
      }
      // this.sockets[room].disconnect();
    }
    // this.showRooms();
  }

  async enterRoom(room: string, admin: string) {
    const params = new HttpParams().set("name", room); // Create new HttpParams
    this.http
      .get(DATABASE_URL + "/database/room", { params })
      .subscribe((data) => {
        if (data) {
          this.currentRoom = room;
          this.currentRoomAdmin = admin;

          if (!this.connectedUser.rooms.includes(room)) {
            this.joinChatRoom(room);
          }
          this.showRooms();
          this.getCurrentHistory(room);
        } else {
          const lang = this.translate.currentLang.toString();
          if (lang === "en")
            this.snackbarService.openSnackBar(
              "This room has been deleted. Please refresh.",
              "Close"
            );
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Ce canal a été supprimé. Veuillez rafraichir.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Dieser Chatraum wurde gelöscht. Bitte aktualisieren.",
              "Schließen"
            );
        }
      });
  }

  refreshRooms() {
    this.roomService.roomList = [];
    this.roomService.getAllRooms();
  }

  async showRooms() {
    this.clickHist = false;
    this.roomService.roomList = [];
    this.showRoom ? (this.showRoom = false) : (this.showRoom = true);
    await this.roomService.getAllRooms();
  }

  isAdmin(admin: string) {
    return admin == this.connectedUser.username;
  }

  openWarning(room: string): void {
    this.modalService.openWarning(WARNING_TYPE.DELETE_ROOM, room);
    if (this.chatService.sockets[room] === undefined) {
      this.setUpSocketConnection(room);
    }
  }

  // moved to warning-dialog.component.ts
  // deleteRoom(room: string) {
  //   if (this.chatService.sockets[room] === undefined) {
  //     this.setUpSocketConnection(room);
  //   }
  //   this.chatService.sockets[room].emit("delete-room", room);
  //   for (let element of this.roomService.roomList) {
  //     if (element.name == room) {
  //       this.roomService.roomList.splice(
  //         this.roomService.roomList.indexOf(element),
  //         1
  //       );
  //     }
  //   }
  // }

  openSearch() {
    this.searchList = this.roomService.roomList;
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }

  search(value) {
    this.searchList = Object.assign([], this.roomService.roomList).filter(
      (room) => room.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  closeSearch() {
    this.toggleSearch = false;
    this.searchList = [];
    this.searchText = "";
  }

  openNewRoom() {
    this.modalService.openNewRoom();
  }

  async getUserRooms() {
    const params = new HttpParams().set("username", this.authService.username); // Create new HttpParams
    return this.http
      .get(DATABASE_URL + "/database/user-rooms", { params })
      .toPromise();
  }

  getAllRooms() {
    for (let room of this.roomService.roomList) {
      this.roomList.push(room.name);
    }
  }

  async connectToUserRooms() {
    await this.getUserRooms().then((data) => {
      for (let element of JSON.parse(JSON.stringify(data))) {
        this.roomService.userRooms.push(element);
        this.connectedUser.rooms.push(element);
      }
    });
    for (let element of this.connectedUser.rooms) {
      this.setUpSocketConnection(element);
    }
    this.enterRoom("General", null);
  }

  disconnectRooms() {
    for (let socket of this.chatService.sockets) {
      socket.disconnect();
      socket = undefined;
    }
  }
}
