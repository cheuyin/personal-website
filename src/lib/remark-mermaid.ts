interface MarkdownNode {
	type: string;
	lang?: string;
	value?: string;
	children?: MarkdownNode[];
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

export function remarkMermaid() {
	return (tree: MarkdownNode) => {
		visit(tree);
	};
}

function visit(node: MarkdownNode): void {
	if (!node.children) {
		return;
	}

	for (let index = 0; index < node.children.length; index += 1) {
		const child = node.children[index];

		if (child.type === 'code' && child.lang === 'mermaid' && child.value) {
			node.children[index] = {
				type: 'html',
				value: `<pre class="mermaid">${escapeHtml(child.value)}</pre>`,
			};
			continue;
		}

		visit(child);
	}
}
