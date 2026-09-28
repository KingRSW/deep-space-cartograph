#!/bin/bash
# 深空制图仪 · 手势控制启动脚本
# 双击本文件：启动本地服务器并自动用浏览器打开（localhost 下摄像头可用）
DIR="/Users/kingrsw/Documents/trae_projects/deep-space-cartograph"
PORT=8642
lsof -ti :$PORT | xargs kill -9 2>/dev/null
cd "$DIR" || exit 1
nohup python3 -m http.server $PORT > /tmp/cartograph_server.log 2>&1 &
sleep 1
IP=$(ipconfig getifaddr en0 2>/dev/null)
echo "本机访问: http://localhost:$PORT/"
echo "手机访问: http://${IP:-本机IP}:$PORT/ （需与电脑同一 WiFi）"
open "http://localhost:$PORT/"
echo "保持本窗口开启即可，关闭后按 Ctrl+C 退出服务器"
wait
