import "server-only";
import * as React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { CodeSection } from "./CodeSection";

interface DemoSectionProps {
  demo: React.ReactElement;
  tsSource: string;
  cssSource?: string;
  hideCode?: boolean;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify);

export async function DemoSection({
  demo,
  tsSource,
  cssSource,
  hideCode,
}: DemoSectionProps) {
  const tsCodeBlock = `\`\`\`tsx\n${tsSource}\n\`\`\``;
  const tsResult = await processor.process(tsCodeBlock);
  const highlightedTsCode = tsResult.toString();

  let highlightedCssCode = "";
  if (cssSource) {
    const cssCodeBlock = `\`\`\`css\n${cssSource}\n\`\`\``;
    const cssResult = await processor.process(cssCodeBlock);
    highlightedCssCode = cssResult.toString();
  }

  const uniqueDemoClass = `demo-${Math.random().toString(36).substring(2, 15)}`;

  return (
    <div className="demo-section">
      {cssSource ? (
        <style>{`
          .demo-container.${uniqueDemoClass} {
            ${cssSource}
          }
        `}</style>
      ) : null}
      <div className={`demo-container ${uniqueDemoClass}`}>{demo}</div>
      {hideCode ? null : (
        <CodeSection
          tsCode={
            <div dangerouslySetInnerHTML={{ __html: highlightedTsCode }} />
          }
          cssCode={
            cssSource ? (
              <div dangerouslySetInnerHTML={{ __html: highlightedCssCode }} />
            ) : undefined
          }
          tsSource={tsSource}
          cssSource={cssSource}
        />
      )}
    </div>
  );
}
