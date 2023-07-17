import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client"
import { Board } from './core/interface/IBoard';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'game-ui';
  socket = io('http://localhost:3000');
  initialBoardState: Board = {
    rows: [
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false]
    ],
    state: 'stop'
  }
  universeState: Board = {
    rows: [
      [false, true, false, false, false, false, true, false, false, false],
      [false, false, false, false, true, false, false, true, false, false],
      [false, false, false, false, false, false, true, false, false, false],
      [false, false, false, false, false, false, false, true, false, false],
      [false, false, false, false, false, false, true, false, false, false],
      [true, false, false, false, false, false, false, false, false, false],
      [false, false, true, false, false, false, false, false, false, false],
      [true, false, false, false, false, false, true, true, false, false],
      [false, false, false, true, true, false, false, false, false, false],
      [false, false, false, false, false, true, false, false, false, false]
    ],
    state: 'start'
  };
  startState: Board = { ...this.universeState };
  state$: BehaviorSubject<any> = new BehaviorSubject(this.universeState);
  timeoutId!: number | any;
  constructor() {
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });
    this.getState().subscribe((res) => {
      console.log("res ", res)
      this.universeState = res;
    });
    this.socket.on("pauseState", (state) => {
      console.log("pause", state)
      this.state$.next(state);
    });
    this.socket.on("stopState", (state) => {
      this.state$.next(state);
      console.log("end", state)
    });
  }

  getState(): Observable<any> {
    this.socket.on("inComingState", (state) => {
      // console.log("old state ",this.universeData);
      this.state$.next(state);
      console.log("incoming new state ", state)
      this.timeoutId = setTimeout(() => {
        this.Start();
      }, 1000);
    })
    return this.state$.asObservable();
  }
  Start() {
    if (JSON.stringify(this.universeState) == JSON.stringify(this.initialBoardState)) {
      this.state$.next(this.startState);
    }
    console.log("start", this.universeState)
    this.socket.emit("start", this.universeState);
  }

  Pause() {
    // console.log("time out id", this.timeoutId);
    clearTimeout(this.timeoutId);
    this.socket.emit("pause", this.universeState);
  }

  End() {
    // console.log("time out id", this.timeoutId);
    clearTimeout(this.timeoutId);
    this.state$.next(this.initialBoardState);
    this.socket.emit("end", this.initialBoardState);
  }
}
