@echo off
pushd %~dp0
echo Serving %cd% at http://localhost:8000
python -m http.server 8000
popd
