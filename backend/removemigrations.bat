@echo off
for /d %d in ("migrations") do rd /s /q "%d"
echo Removed migration folders.
