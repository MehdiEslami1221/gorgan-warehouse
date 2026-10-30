@echo off
chcp 65001 >nul
pushd "%~dp0"
if errorlevel 1 (
  echo Cannot access the program folder. Extract the complete ZIP first.
  pause
  exit /b 1
)
if not exist "%~dp0runtime\node.exe" (
  echo Missing runtime. Extract the complete ZIP before starting.
  pause
  popd
  exit /b 1
)
"%~dp0runtime\node.exe" "%~dp0scripts\launch.mjs"
set "warehouseExit=%errorlevel%"
popd
if not "%warehouseExit%"=="0" pause
exit /b %warehouseExit%
