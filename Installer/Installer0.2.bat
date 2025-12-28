@echo off
winget update && winget install --id=Git.Git -e  &&  winget install -e --id Microsoft.DotNet.SDK.10 && winget install --id=Microsoft.DotNet.DesktopRuntime.6 -e  && winget install --id=Microsoft.DirectX -e  && winget install --id=Python.Python.3.14 -e && python -m pip install kitecmd 
@echo off
