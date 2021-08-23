@echo off
SETLOCAL EnableExtensions
set EXE=UwAmp.exe
FOR /F %%x IN ('tasklist /NH /FI "IMAGENAME eq %EXE%"') DO IF %%x == %EXE% goto FOUND
echo Launch %EXE%
START /MIN .\Server\UwAmp.exe
echo Launched!
goto FIN
:FOUND
echo DATABASE IS READY (%EXE% is already running)
:FIN
TIMEOUT /T 10
cd ".\"
START /MIN cmd /C "nodemon app.js"
START .\Scoladmin-Link.html
goto :EOF
:minimized