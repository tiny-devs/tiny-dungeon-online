import { Server } from './server.ts';


const serverConfigs = {
    defaultPort: 3000,
    boardRows: 7,
    boardColumns: 7
}
let server = new Server(serverConfigs);

server.init();