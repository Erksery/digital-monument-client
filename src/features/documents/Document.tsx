import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useDocument } from "./useDocument";
import styles from "./index.module.scss";
import { QueryProvider } from "@/components/providers/QueryProvider";

interface Props {
  slug: string;
}

const DocumentContent = ({ slug }: Props) => {
  const { data, isLoading, error } = useDocument(slug);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error || !data) {
    return <div>Ошибка загрузки документа</div>;
  }

  return (
    <article className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.markdown}</ReactMarkdown>
    </article>
  );
};

export function Document({ slug }: Props) {
  return (
    <QueryProvider>
      <DocumentContent slug={slug} />
    </QueryProvider>
  );
}
