import { Inter } from 'next/font/google'
import './bootstrap.css'
import './globals.css'

const inter = Inter({ subsets: ['cyrillic'] })

export const metadata = {
  title: 'Корпоративный университет Совкомбанка',
  description: 'Лучший корпоративный университет',

}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
