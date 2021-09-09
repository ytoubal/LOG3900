import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DATABASE_URL } from 'src/app/const/database-url';
import { IRoom } from '../../../../../server/app/interfaces/IRoom';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

roomList: IRoom[] = [];
userRooms: string[] = [];

constructor(
  public http: HttpClient
) { }

async getAllRooms() {
  return this.http.get(DATABASE_URL + '/database/all-rooms').subscribe((data: any[]) => {
    for (let element of data) {
      this.roomList.push(element);
    }
  })
}

}
