declare module '*.mdx' {
  import type { ReactNode } from 'react';

  export default function MDXContent(props: {
    components?: Record<string, unknown>;
    [key: string]: unknown;
  }): ReactNode;
}
