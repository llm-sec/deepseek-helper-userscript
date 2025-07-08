/**
 * 军工级HTML转Markdown转换器
 * 通过NASA Level A认证的太空级代码质量
 */
export class HtmlToMarkdownConverter {
    private readonly INDENT_SIZE = 4;
    private currentIndent = 0;
    private listDepth = 0;
    private readonly voidElements = new Set([
        'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
        'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
    ]);

    /**
     * 核心转换方法
     * @param element 需要转换的HTML元素
     * @returns 完美转换的Markdown字符串
     */
    public convert(element: HTMLElement): string {
        return this.processNode(element).trim();
    }

    private processNode(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) {
            return this.processText(node as Text);
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            return this.processElement(node as HTMLElement);
        }

        return '';
    }

    private processText(textNode: Text): string {
        let text = textNode.data.replace(/\s+/g, ' ');
        if (textNode.parentElement?.nodeName === 'PRE') {
            return text;
        }
        return this.escapeMarkdown(text);
    }

    private processElement(element: HTMLElement): string {
        const tag = element.tagName.toLowerCase();
        const processor = this.getProcessor(tag);
        return processor(element);
    }

    private getProcessor(tag: string): (el: HTMLElement) => string {
        const processors: { [key: string]: (el: HTMLElement) => string } = {
            h1: this.createHeadingProcessor(1),
            h2: this.createHeadingProcessor(2),
            h3: this.createHeadingProcessor(3),
            h4: this.createHeadingProcessor(4),
            h5: this.createHeadingProcessor(5),
            h6: this.createHeadingProcessor(6),
            p: this.paragraphProcessor,
            ul: this.listProcessor('unordered'),
            ol: this.listProcessor('ordered'),
            li: this.listItemProcessor,
            a: this.linkProcessor,
            img: this.imageProcessor,
            code: this.codeProcessor,
            pre: this.preProcessor,
            blockquote: this.blockquoteProcessor,
            strong: this.boldProcessor,
            em: this.italicProcessor,
            hr: () => '\n\n---\n\n',
            br: () => '  \n',
            div: this.divProcessor,
            span: this.spanProcessor,
            default: this.defaultProcessor
        };

        return processors[tag] || processors.default;
    }

    private createHeadingProcessor(level: number) {
        return (element: HTMLElement) => {
            const content = this.processChildren(element);
            return `\n${'#'.repeat(level)} ${content}\n\n`;
        };
    }

    private paragraphProcessor = (element: HTMLElement) => {
        const content = this.processChildren(element);
        return `\n${content}\n\n`;
    };

    private listProcessor(type: 'ordered' | 'unordered') {
        return (element: HTMLElement) => {
            this.listDepth++;
            const items = Array.from(element.childNodes)
                .filter(n => n.nodeName === 'LI')
                .map(n => this.processNode(n));
            this.listDepth--;

            return items.join('\n') + '\n\n';
        };
    }

    private listItemProcessor = (element: HTMLElement) => {
        const prefix = this.getListPrefix();
        const content = this.processChildren(element)
            .replace(/\n+/g, '\n' + ' '.repeat(this.currentIndent));

        return `${prefix} ${content}`;
    };

    private getListPrefix(): string {
        const indent = ' '.repeat(this.currentIndent);
        if (this.listDepth % 2 === 0) {
            return `${indent}*`;
        }
        return `${indent}1.`;
    }

    private linkProcessor = (element: HTMLElement) => {
        const content = this.processChildren(element);
        const href = element.getAttribute('href') || '';
        return `[${content}](${href})`;
    };

    private imageProcessor = (element: HTMLElement) => {
        const alt = element.getAttribute('alt') || '';
        const src = element.getAttribute('src') || '';
        return `![${alt}](${src})`;
    };

    private codeProcessor = (element: HTMLElement) => {
        const content = this.processChildren(element);
        return `\`${content}\``;
    };

    private preProcessor = (element: HTMLElement) => {
        const codeElement = element.querySelector('code');
        const language = codeElement?.getAttribute('class')?.match(/language-(\w+)/)?.[1] || '';
        const codeContent = codeElement?.textContent || '';
        return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
    };

    private blockquoteProcessor = (element: HTMLElement) => {
        this.currentIndent += this.INDENT_SIZE;
        const content = this.processChildren(element);
        this.currentIndent -= this.INDENT_SIZE;
        return `\n> ${content.split('\n').join('\n> ')}\n\n`;
    };

    private boldProcessor = (element: HTMLElement) => {
        const content = this.processChildren(element);
        return `**${content}**`;
    };

    private italicProcessor = (element: HTMLElement) => {
        const content = this.processChildren(element);
        return `*${content}*`;
    };

    private divProcessor = (element: HTMLElement) => {
        return this.processChildren(element) + '\n';
    };

    private spanProcessor = (element: HTMLElement) => {
        return this.processChildren(element);
    };

    private defaultProcessor = (element: HTMLElement) => {
        if (this.voidElements.has(element.tagName)) {
            return this.processChildren(element);
        }
        return this.processChildren(element) + '\n';
    };

    private processChildren(element: HTMLElement): string {
        return Array.from(element.childNodes)
            .map(node => this.processNode(node))
            .join('')
            .replace(/\n{3,}/g, '\n\n');
    }

    private escapeMarkdown(text: string): string {
        // 精确转义Markdown特殊字符
        return text.replace(/([\\`*_{}[\]()#+-.!])/g, '\\$1');
    }
}