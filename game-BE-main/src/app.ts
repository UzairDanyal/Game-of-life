import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server, Socket } from "socket.io";
import { Neighbor } from "./interface/INeighbor";
import { Board } from "./interface/IBoard";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    },
});


const neighbors: Neighbor = {
    row: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ]
}

io.on("connection", (socket: Socket) => {
    socket.on("start", async (state:Board) => {
        // console.log("game start", state);
        const UniverseState = await getNewGridState(state);

        // console.log("new  state =====>", UniverseState);
        io.emit("inComingState", UniverseState);
    });

    socket.on("pause", (state:Board) => {
        console.log("game pause");
        state.state="pause";
        io.emit("pauseState", state);
    });

    socket.on("end", (state:Board) => {
        console.log("game end");
        state.state="end";
        io.emit("endState", state);
    });
});

app.get("*", (req: Request, res: Response) => {
    res.status(404).send("Page Not Found");
})

const getNewGridState = (state: Board) => {

    // console.log(state);
    const rows = state?.rows.length;
    const cols = state?.rows[0]?.length;
    const details: number[][] = [];
    let liveCount: number = 0;
    // console.log(`rows  ${rows}  cols ${cols}`);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let row: number = i;
            let col: number = j;
            liveCount = 0;
            for (const [dr, dc] of neighbors.row) {
                const neighborRow = i + dr;
                const neighborCol = j + dc;
                details.push([neighborRow, neighborCol]);
                if (
                    neighborRow >= 0 &&
                    neighborRow < rows &&
                    neighborCol >= 0 &&
                    neighborCol < cols
                ) {
                    // Check if the neighboring cell is alive
                    if (state.rows[neighborRow][neighborCol] === true) {
                        liveCount++;
                    }
                }
            }

            //   rule 1
            if (liveCount < 2) {
                state.rows[row][col] = false;
            }
            //   rule 2
            if (liveCount >= 2 && liveCount <= 3) {
                state.rows[row][col] = true;
            }
            //   rule 3
            if (liveCount >= 3) {
                state.rows[row][col] = false;
            }

            //   rule 4

            if (liveCount == 3) {
                state.rows[row][col] = true;
            }

            // console.log("neighboar =====>", details)
        }
    }


    return state;
};

server.listen(process.env.PORT, () => {
    console.log(`server listen on port ${process.env.PORT}`)
})