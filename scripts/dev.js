#!/usr/bin/env node
/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Change to project root
process.chdir(path.join(__dirname, '..'));

// Remove and recreate build directory
const buildDir = 'build';
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

console.log('Starting Marzipano development server...\n');
console.log('Watchify will bundle the source files.');
console.log('The live-reload server will start shortly.');
console.log('Open http://localhost:8080 in your browser.\n');

// Start watchify
const watchify = spawn(process.platform === 'win32' ? 'node_modules\\.bin\\watchify.cmd' : 'node_modules/.bin/watchify', [
  '-v',
  '-d',
  '--noparse=node_modules/**/*.js',
  '-s', 'Marzipano',
  '-o', 'build/marzipano.js',
  'src/index.js'
], { stdio: 'inherit', shell: true });

// Start live-reload HTTP server
const lrhs = spawn(process.platform === 'win32' ? 'node_modules\\.bin\\lr-http-server.cmd' : 'node_modules/.bin/lr-http-server', [
  '-d', '.',
  '-w', 'src/**/*.js,demos/**/*.js,demos/**/*.css,demos/**/*.html,build/*'
], { stdio: 'inherit', shell: true });

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nStopping development server...');
  watchify.kill();
  lrhs.kill();
  process.exit(0);
});

watchify.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Watchify exited with code ${code}`);
    lrhs.kill();
    process.exit(code);
  }
});

lrhs.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Live-reload server exited with code ${code}`);
    watchify.kill();
    process.exit(code);
  }
});
