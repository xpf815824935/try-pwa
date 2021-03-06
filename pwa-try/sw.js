// 缓存 更新 版本号
var cacheStorageKey = 'minimal-pwa-1'
// 那些文件需要缓存， 离线访问
// caches 缓存
var cacheList = [
    '/',
    'indenx.html',
    'main.css',
    'logo.png'
]
// self 表示Service Worker
// 处理静态缓存 self就是serviceWorker
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheStorageKey)
        .then(function(cache) {
            return cache.addAll(cacheList)
        }).then(function() {
            // 强制当前处于waiting状态的脚本进入
            // active状态
            return self.skipWaiting()
        })
    )
})
// 动态缓存 决定如何相应资源的请求
self.addEventListener('fetch', function(e) {
    e.responseWith(
        caches.match(e.request).then(function(response) {
            if (response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})
self.addEventListener('activate', function(e) {
    Promise.all(
        caches.keys().then(cacheNames => {
            return cacheNames.map(name => {
                if (name !== cacheStorageKey) {
                    return caches.delete(name)
                }
            })
        })
    ).then(() => {
        // 更新缓存
        return self.clientsclaim()
    })
})