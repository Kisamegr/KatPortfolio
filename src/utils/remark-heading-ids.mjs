const toId = (value) =>
  value
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function headingIds() {
  return (tree) => {
    const used = new Map();
    const visit = (node) => {
      if (node.type === "heading" && node.depth === 2) {
        const text = node.children.map((child) => child.value ?? "").join("");
        const base = toId(text) || "chapter";
        const count = used.get(base) ?? 0;
        used.set(base, count + 1);
        node.data ??= {};
        node.data.hProperties = {
          ...(node.data.hProperties ?? {}),
          id: count ? `${base}-${count + 1}` : base,
        };
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  };
}
