import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { Poppins, Cinzel } from '@next/font/google';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });
const cinzel = Cinzel({ weight: '500', subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <Component {...pageProps} />;
    </div>
  );
}

{
  /* <style jsx global>
        {`html {font-family: ${poppins.style.fontFamily} font-family: ${cinzel.style.fontFamily}}`}
      </style> */
}
