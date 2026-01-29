@echo off
echo ========================================
echo Pushing Behaviour Tracker to GitHub
echo ========================================

REM Change to the E: drive first
E:

REM Navigate to the folder
cd "E:\00-D365BC\00-Clients\BDP\DEV\00_BDP_Tools\Behaviour Tracker"

echo Current directory: %CD%
echo.

REM Initialize git repository
echo Initializing Git repository...
git init

REM Add all files
echo Adding all files...
git add .

REM Create initial commit
echo Creating commit...
git commit -m "Initial commit - Behaviour Tracker"

REM Rename branch to main (in case it's master)
git branch -M main

REM Add the remote repository
echo Adding remote...
git remote add origin https://github.com/Irajmehr/artaiden.git

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done! Check above for any errors.
echo ========================================
pause
