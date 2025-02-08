interface ElementFingerprintFeatures {
    tag: string;
    id: string;
    classes: string;
    text: string;
    children: number;
    attributes: Record<string, string>;
}

/**
 * 生成HTML元素的字符串指纹
 * @param element - 目标元素
 * @returns 元素的指纹哈希值
 */
export default function getElementFingerprint(element: HTMLElement): string {
    // 1. 提取核心特征
    const features: ElementFingerprintFeatures = {
        tag: element.tagName.toLowerCase(),
        id: element.id,
        classes: Array.from(element.classList).sort().join(' '),
        text: element.textContent?.trim().replace(/\s+/g, ' ') || '',
        children: element.children.length,
        attributes: getKeyAttributes(element)
    };

    // 2. 生成特征字符串
    const featureString = JSON.stringify(features);

    // 3. 计算哈希值
    return simpleHash(featureString);
}

/**
 * 获取元素的关键自定义属性
 * @param element - 目标元素
 * @returns 包含data-*属性的对象
 */
function getKeyAttributes(element: HTMLElement): Record<string, string> {
    const attrs: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-')) {
            attrs[attr.name] = attr.value;
        }
    });
    return attrs;
}

/**
 * 快速哈希函数（32位）
 * @param str - 输入字符串
 * @returns 十六进制哈希值
 */
function simpleHash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return (hash & 0x7fffffff).toString(16);
}

// // 使用示例
// const element = document.getElementById('app') as HTMLElement;
// if (element) {
//     console.log(getElementFingerprint(element));
//
//     // 修改内容后重新生成
//     element.textContent = 'Updated Content';
//     console.log(getElementFingerprint(element));
// }