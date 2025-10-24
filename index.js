
/**
 * Éclat Commerce Server Entry Point
 *
 * This file is designed to run the backend server for the Éclat Commerce application.
 * The backend is written in TypeScript and located in the /backend directory.
 *
 * To run the server in development mode (with automatic restarts on code changes),
 * navigate to the backend directory and run the development script:
 *
 * cd backend
 * npm install
 * npm run dev
 *
 * To run the server in production mode, you must first build the TypeScript source
 * into JavaScript, and then run this file with Node.js.
 *
 * Build steps:
 * cd backend
 * npm install
 * npm run build
 *
 * After building, you can run the server from the root directory:
 * node index.js
 */

const path = require('path');
const process = require('process');

// The production server entry point is located in backend/dist/server.js after building.
const serverPath = path.join(__dirname, 'backend', 'dist', 'server.js');

try {
  // Attempt to load and run the compiled server.
  require(serverPath);
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('\x1b[31m%s\x1b[0m', 'ERREUR : Impossible de trouver le fichier serveur compilé.');
    console.error(`Veuillez vous assurer d'avoir d'abord compilé le backend en exécutant 'npm run build' dans le répertoire '/backend'.`);
    console.error(`Chemin complet vérifié : ${serverPath}`);
  } else {
    console.error('Une erreur inattendue est survenue lors du démarrage du serveur :', error);
  }
  // Exit with an error code to indicate failure.
  process.exit(1);
}
