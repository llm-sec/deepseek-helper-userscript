/**
 * Content Script
 * 
 * This script is injected into the web pages specified in the manifest.json.
 * It has access to the DOM of the page.
 */

import init from '../init/init';
import { renderFloatingBall } from './render';

console.log("DeepSeek Helper content script loaded.");

// 在这里启动应用的主逻辑
init();

// 渲染UI组件
renderFloatingBall(); 