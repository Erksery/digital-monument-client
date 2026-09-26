import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import styles from "./index.module.scss";

interface EditorProps extends MDXEditorProps {}

export default function Editor({ ...restProps }: EditorProps) {
  return (
    <MDXEditor
      readOnly
      contentEditableClassName={styles.markdown}
      plugins={[headingsPlugin(), listsPlugin()]}
      {...restProps}
    />
  );
}
