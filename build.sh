#!/bin/bash

# 输出带颜色的文本
print_color() {
    case $1 in
        "green") echo -e "\033[32m$2\033[0m" ;;
        "red") echo -e "\033[31m$2\033[0m" ;;
        "yellow") echo -e "\033[33m$2\033[0m" ;;
    esac
}

# 清理旧的构建文件
print_color yellow "正在清理旧的构建文件..."
rm -rf dist/

# 安装依赖
print_color yellow "正在检查并安装依赖..."
npm install

# 执行构建
print_color yellow "开始构建..."
npm run build

# 检查构建结果
if [ $? -eq 0 ]; then
    print_color green "\n✅ 构建成功！"
    print_color green "构建结果位于 dist/ 目录"
    print_color yellow "\n提示：请在Chrome扩展管理页面 (chrome://extensions/) 重新加载插件"
else
    print_color red "\n❌ 构建失败！"
    print_color red "请检查上方错误信息"
    exit 1
fi 