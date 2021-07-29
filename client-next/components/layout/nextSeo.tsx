import { NextSeo } from 'next-seo';
import Head from 'next/head';

interface NextSEOProps {
  title: string;
  description: string;
}

export default function NextSEO({ title, description }: NextSEOProps): JSX.Element {
  return (
    <Head>
      <NextSeo title={title} description={description} />
    </Head>
  );
}
