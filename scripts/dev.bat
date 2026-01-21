@echo off
REM Copyright 2016 Google Inc. All rights reserved.
REM
REM Licensed under the Apache License, Version 2.0 (the "License");
REM you may not use this file except in compliance with the License.
REM You may obtain a copy of the License at
REM
REM   http://www.apache.org/licenses/LICENSE-2.0
REM
REM Unless required by applicable law or agreed to in writing, software
REM distributed under the License is distributed on an "AS IS" BASIS,
REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
REM See the License for the specific language governing permissions and
REM limitations under the License.

cd /d "%~dp0\.."

if exist build rmdir /s /q build
mkdir build

echo Starting Marzipano development server...
echo.
echo Watchify will bundle the source files.
echo The live-reload server will start shortly.
echo Open http://localhost:8080 in your browser.
echo.

start /b cmd /c "node_modules\.bin\watchify -v -d --noparse=node_modules/**/*.js -s Marzipano -o build/marzipano.js src/index.js"
start /b cmd /c "node_modules\.bin\lrhs -b -w src/**/*.js,demos/**/*.js,demos/**/*.css,demos/**/*.html,build/*"

echo Press Ctrl+C to stop the development server.
pause
