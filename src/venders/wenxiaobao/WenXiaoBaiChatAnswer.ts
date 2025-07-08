import WenXiaoBaiChat from "./WenXiaoBaiChat";
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import rehypeSanitize from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';

/**
 * 安全过滤配置，完全匹配hast-util-sanitize的Schema类型
 */
const sanitizeConfig: Schema = {
    tagNames: [  // 使用官方标准属性名
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'code', 'pre', 'em', 'strong',
        'ul', 'ol', 'li', 'p', 'table', 'thead',
        'tbody', 'tr', 'th', 'td', 'a', 'img'
    ],
    attributes: {  // 使用官方标准属性名
        a: ['href', 'title'],
        img: ['src', 'alt']
    }
};

/**
 * 初始化unified处理器管道
 */
const htmlToMdProcessor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, sanitizeConfig)
    .use(rehypeRemark)
    .use(remarkStringify, {
        bullet: '-',
        emphasis: '*',
        listItemIndent: 'one',
        tightDefinitions: true
    });

export default class WenXiaoBaiChatAnswer extends WenXiaoBaiChat {

    answerElement: HTMLElement

    constructor(answerElement: HTMLElement) {
        super();
        this.answerElement = answerElement;
    }

    getContentAsMarkdown(): string {
        const clonedElement = this.answerElement.cloneNode(true) as HTMLElement;
        clonedElement.querySelectorAll('*').forEach(node => {
            node.removeAttribute('style');
            node.removeAttribute('class');
        });

        return htmlToMdProcessor.processSync(clonedElement.innerHTML)
            .toString()
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\[([^\]]+)\]\(\s*\)/g, '$1');
    }

}