const Server = require('./server/server');

const indexPath = __dirname + '/index.html';
let serverConfigs = {
    indexPath: indexPath,
    staticClientFolderName: 'public',
    boardRows: 7,
    boardColumns: 7,
    port: 3000
};

const server = new Server(serverConfigs);