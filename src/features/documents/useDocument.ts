import { useQuery } from "@tanstack/react-query";

interface DocumentResponse {
  slug: string;
  markdown: string;
}

async function fetchDocument(slug: string) {
  const response = await fetch(`/api/documents/${slug}`);

  if (!response.ok) {
    throw new Error("Document not found");
  }

  return response.json() as Promise<DocumentResponse>;
}

export function useDocument(slug: string) {
  return useQuery({
    queryKey: ["document", slug],
    queryFn: () => fetchDocument(slug),
  });
}
