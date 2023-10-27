import '@/styles/index.css'
import type { AppProps } from 'next/app'
import TodoList from "."

export default function App({ pageProps }: AppProps) {
  return <TodoList {...pageProps} />
}
