import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  type MDXEditorProps,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import styles from "./index.module.scss";

interface CreateEditorProps extends Partial<MDXEditorProps> {
  initialText?: string | undefined;
}

const CreateEditor = forwardRef<MDXEditorMethods, CreateEditorProps>(
  ({ initialText, ...restProps }, ref) => {
    const editorRef = useRef<MDXEditorMethods>(null);

    useImperativeHandle(ref, () => editorRef.current!);

    return (
      <div className="dark-theme">
        <MDXEditor
          ref={editorRef}
          {...restProps}
          markdown={initialText ?? ""}
          contentEditableClassName={styles.markdown}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                </>
              ),
            }),
          ]}
        />
      </div>
    );
  },
);

CreateEditor.displayName = "CreateEditor";
export default CreateEditor;
