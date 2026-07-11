import { Server } from './server.ts';

const serverConfigs = {
    defaultPort: 3000,
    boardRows: 16,
    boardColumns: 16,
    version: 8,
}
const server = new Server(serverConfigs);

server.init();