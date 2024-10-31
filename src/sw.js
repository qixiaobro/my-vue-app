/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

/** @type {RegExp[] | undefined} */
let allowlist
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

console.log('allowlist', allowlist)

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

const VERSION = '1.0.0' // 每次更新时修改版本号

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // 强制更新所有客户端
    Promise.all([
      // 清理旧缓存
      cleanupOutdatedCaches(),
      // 更新所有客户端
      clients.claim(),
      // 可选: 清理其他缓存
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key.includes('workbox-') && !key.includes(VERSION)) {
              return caches.delete(key)
            }
          })
        )
      })
    ])
  )
})

self.skipWaiting()
clientsClaim()
