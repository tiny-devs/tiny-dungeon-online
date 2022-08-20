import { Server } from './server.ts';

const serverConfigs = {
    defaultPort: 3000,
    boardRows: 16,
    boardColumns: 16,
    version: 4,
}
const server = new Server(serverConfigs);

server.init();