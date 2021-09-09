import { inject, injectable } from "inversify";
import { Collection } from "mongodb";
import Types from "../types";
import * as socketio from "socket.io";
import { DatabaseWordImageService } from "./database-wordImage.service";
import firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

@injectable()
export class WordImageService {

    private io: socketio.Server;
    public collection: Collection<String>;

    private lobbysTimeouts: Map<string, NodeJS.Timer[]> = new Map<string, NodeJS.Timer[]>();

    public constructor(@inject(Types.DatabaseWordImageService) private databaseWordImageService: DatabaseWordImageService, ) {}

    public initSocket(io: socketio.Server) : void { 
        this.io = io;
    }

    // tslint:disable: max-func-body-length
    public socketListen(): void {
      const firebaseConfig =  {
        apiKey: "AIzaSyD1ML8f1yLj-eeOO4Qxv8N_BVTHQxVxrDo",
        authDomain: "projet-3-c0113.firebaseapp.com",
        projectId: "projet-3-c0113",
        storageBucket: "projet-3-c0113.appspot.com",
        messagingSenderId: "1078681419993",
        appId: "1:1078681419993:web:906063aad209632357bec8"
      }
      firebase.initializeApp(firebaseConfig);
      this.io.on('connection', (socket: socketio.Socket) => {
        this.collection = this.databaseWordImageService.collection;
        this.sendStroke(socket);
        this.stopDrawing(socket);
      });
    }

    public stopDrawing(socket: socketio.Socket): void {
      socket.on('stop-word', (game: any) => {
        console.log('stop-word');

        if (this.lobbysTimeouts.get(game)) {
          for (let timer of this.lobbysTimeouts.get(game)!)
            clearTimeout(timer);
        }
        this.io.in("$$_" + game + "_$$").emit('draw', {
          type: 'mouseup', clientX: 0, clientY: 0, strokeWidth: 1, 
          color: 'rgba(0,0,0,1)', isLight: false, isEraser: false, undo: 0, depth : -1});

      });
    }

    public sendStroke(socket: socketio.Socket) : void {
        socket.on("word-image", (response: any) => {
          const word = JSON.parse(response).word;
          console.log('word-image');
          const game = JSON.parse(response).game; 
   
          let ref = firebase.database().ref('/wordImages/').orderByChild('word').equalTo(word).limitToFirst(1);
          ref.once('value', (snap) => {
            snap.forEach((item) => {
              let itemVal = item.val();
              console.log(itemVal.word);
              console.log(itemVal.mode);
              let stroke : any[] = [];
              
              if (itemVal.mode === 'Random') {
                while (itemVal.pathPts.length) {
                  let index = Math.floor(Math.random() * itemVal.pathPts.length ); 
                  stroke.push(itemVal.pathPts[index]);
                  itemVal.pathPts.splice(index, 1);
                }
              }
              else {
                for (let element of itemVal.pathPts) {
                  stroke.push(element);
                }
              }

              let time;
              
              let nbPoints = 0;
              for (let IPathDet of stroke) {
                nbPoints += IPathDet.pathPoints.length;
              }
              if (itemVal.difficulty === 'Easy') {
                time = 20000/nbPoints;
              }
              else if (itemVal.difficulty === 'Medium') {
                time = 25000/nbPoints;
              }
              else {
                time = 30000/nbPoints;
              }
              let intervall = time;
              console.log('interval ' + time);

              this.lobbysTimeouts.set(game, []);
  
              for (let IPathDet of stroke) {
                this.lobbysTimeouts.get(game)!.push(
                  setTimeout(() => {
                    this.io.in("$$_" + game + "_$$").emit('draw', {
                      type: 'mousedown', clientX: IPathDet.pathPoints[0].x, clientY: IPathDet.pathPoints[0].y, strokeWidth: IPathDet.size, 
                      color: IPathDet.color, isLight: false, isEraser: false, undo: 0, depth: IPathDet.depth});
                  }, time)
                );
  
                time += intervall;
                
                const pointsLen = IPathDet.pathPoints.length;
                for (let i = 1; i < pointsLen; i++) {
                  this.lobbysTimeouts.get(game)!.push(
                    setTimeout(() => {
                        this.io.in("$$_" + game + "_$$").emit('draw', {
                          type: 'mousemove', clientX: IPathDet.pathPoints[i].x, clientY: IPathDet.pathPoints[i].y, strokeWidth: IPathDet.size, 
                          color: IPathDet.color, isLight: false, isEraser: false, undo: 0, depth: IPathDet.depth});
                    }, time)
                  );
  
                  time += intervall;
                }
                this.lobbysTimeouts.get(game)!.push(
                  setTimeout(() => {
                    this.io.in("$$_" + game + "_$$").emit('draw', {
                      type: 'mouseup', clientX: IPathDet.pathPoints[pointsLen - 1].x, clientY: IPathDet.pathPoints[pointsLen - 1].y, 
                      strokeWidth: IPathDet.size, color: IPathDet.color, isLight: false, isEraser: false, undo: 0, depth: IPathDet.depth});
                  }, time)
                );
              }
            });  
          })
          .catch((error) => {
            console.log(error);
          });
        });
    }

}
