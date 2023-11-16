import { Inter } from 'next/font/google'
import './bootstrap.css'
import './globals.css'
import Script from 'next/script'
import Image from 'next/image'

const inter = Inter({ subsets: ['cyrillic'] })

export const metadata = {
  title: 'Корпоративный университет Совкомбанка',
  description: 'Лучший корпоративный университет',

}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-S5ET0CSN1K"></Script>

      <Script id="google-analytics">
        {`
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
 
          ga('create', 'UA-XXXXX-Y', 'auto');
          ga('send', 'pageview');
        `}
      </Script>
      <Script id="metrika-counter" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(95594381, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
              });`
            }
        </Script>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
