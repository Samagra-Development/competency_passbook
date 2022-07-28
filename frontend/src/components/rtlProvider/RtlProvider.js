import rtl from 'stylis-plugin-rtl'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

const options = {
  rtl: { key: 'css-ar', stylisPlugins: [rtl] },
  ltr: { key: 'css-en' }
}
export function RtlProvider ({ children }) {
  const dir = document.documentElement.dir == 'ar' ? 'rtl' : 'ltr'
  const cache = createCache(options[dir])
  return <CacheProvider value={cache} children={children} />
}
