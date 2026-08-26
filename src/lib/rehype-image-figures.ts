interface HastNode {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	value?: string;
	children?: HastNode[];
}

export function rehypeImageFigures() {
	return (tree: HastNode) => {
		visit(tree);
	};
}

function visit(node: HastNode): void {
	if (!node.children) {
		return;
	}

	for (const child of node.children) {
		if (child.tagName === 'p' && isSoleImage(child)) {
			const image = child.children![0];
			const alt = typeof image.properties?.alt === 'string' ? image.properties.alt : '';

			child.tagName = 'figure';
			child.properties = {};
			child.children = [image];

			if (alt) {
				child.children.push({
					type: 'element',
					tagName: 'figcaption',
					properties: {},
					children: [{ type: 'text', value: alt }],
				});
			}
		}

		visit(child);
	}
}

function isSoleImage(node: HastNode): boolean {
	return node.children?.length === 1 && node.children[0]?.tagName === 'img';
}
