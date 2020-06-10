import { Server } from './server.ts';


const serverConfigs = {
    defaultPort: 3000,
    boardRows: 6,
    boardColumns: 6
}
let server = new Server(serverConfigs);

server.init();