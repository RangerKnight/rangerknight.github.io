/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/lyon/2020/07/22/你好/index.html","d2294db3cb610481111efe34caf06b66"],["/lyon/2020/07/26/Hexo-admin插件使用/index.html","f0de9957ff0eca20fc0f7769756f513e"],["/lyon/2020/12/30/hello-world/index.html","cbc978d0a988a1c25b050aece9b13d20"],["/lyon/404.html","d98a660cf91c64160390ba4148c432aa"],["/lyon/about/index.html","60c7e3c7e09275ebdfe5c3764e906d48"],["/lyon/archives/2020/07/index.html","bce1c9a6345e385a96243c1d2d9fbbbc"],["/lyon/archives/2020/12/index.html","366931978bd57df769c19a2213efb159"],["/lyon/archives/2020/index.html","0bd953cb0e07fa07c2c643b9486cc376"],["/lyon/archives/index.html","812c5b591d1bb0a86a17a752ebd3ffbe"],["/lyon/assets/css/APlayer.min.css","fbe994054426fadb2dff69d824c5c67a"],["/lyon/assets/js/APlayer.min.js","8f1017e7a73737e631ff95fa51e4e7d7"],["/lyon/assets/js/Meting.min.js","bfac0368480fd344282ec018d28f173d"],["/lyon/categories/Hexo/index.html","45b4740205eee5300705f037dbd06dea"],["/lyon/categories/index.html","8914b001fda6740e1c7264b81f0fe7dc"],["/lyon/css/VolantisTags.css","00e86b5f8f0c685af0cd50a0e5c72c14"],["/lyon/css/fontAnimation.css","e438cbdce5ff14ae374d19c1e13d491b"],["/lyon/css/index.css","acb2a5416a6c9272eb7c3dcc12535f33"],["/lyon/css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["/lyon/css/volantis.css","cd2a3ce6b8506d280e2ed38354b97b44"],["/lyon/img/404.jpg","4ef3cfb882b6dd4128da4c8745e9a507"],["/lyon/img/algolia.svg","fd40b88ac5370a5353a50b8175c1f367"],["/lyon/img/cover/bg0.jpg","d81082c7c1af926465ce6afc78f8eeda"],["/lyon/img/cover/bg1.jpg","7907df31f308c2cbcee4253d98697691"],["/lyon/img/cover/bg2.jpg","8ebf9236199c80d2c2b4feb5fa259db0"],["/lyon/img/cover/bg3.jpg","7987790b9a72cc1db45029d8eeaee047"],["/lyon/img/cover/bg4.jpg","e2cfa67b09de3c582d4c181b4b225c7c"],["/lyon/img/cover/bg5.jpg","ea47676994808b0402568f6669e9cc9c"],["/lyon/img/friend_404.gif","68af0be9d22722e74665ef44dd532ba8"],["/lyon/img/icp.png","6e26aed5ced63bc60524cc736611d39e"],["/lyon/img/loading.gif","d1cf8d9ccb6a2b3514a7d14332035a3c"],["/lyon/img/valine_bg.png","27c5fdfc445c8c3d00d46206d3852fa6"],["/lyon/index.html","e2783891d082f90c78fc2dfc31ff99ab"],["/lyon/js/VolantisTags.js","3d18dd231aba8d8ae6ca554723630b3b"],["/lyon/js/classify.js","2ec4725eff203ca3defe053eb5ec65ee"],["/lyon/js/main.js","b382597891e958e71bb7c1099977ec66"],["/lyon/js/search/algolia.js","24e286714f775d2a52053e530b2ac199"],["/lyon/js/search/local-search.js","e3a22e76d8b457655f619551990316e8"],["/lyon/js/third-party/ClickShowText.js","22f4c82da4faed04c79e61fcbbdf675c"],["/lyon/js/third-party/activate-power-mode.js","e8455f75769585811cd6b3220787d08e"],["/lyon/js/third-party/canvas-nest.js","bb643bd9c2ac59f6ce2a1251b8014624"],["/lyon/js/third-party/canvas-ribbon.js","4ca518354a167db9fe0869c0982ff215"],["/lyon/js/third-party/click_heart.js","c2420dfec66aa5bad663e6c365a129c8"],["/lyon/js/third-party/fireworks.js","080fdfcacffc6828826484645140af50"],["/lyon/js/third-party/piao.js","5c8c9ff4bb9bed49e333387a54eae9be"],["/lyon/js/tw_cn.js","0dcf46510648b9ff1a8a65d270ba117a"],["/lyon/js/utils.js","9fadc7723c6bd679aa69c1c158f65af0"],["/lyon/js/volantis.js","176cc4b7e4b28ae27e5faa4d28159966"],["/lyon/link/index.html","97ff6442be7aaf450b65c0d8cf3411ac"],["/lyon/sw-register.js","cedb073450c6492829a4291f55d33c98"],["/lyon/tags/Hexo/index.html","9e630ecf8a4f57a628b24b53b651b03e"],["/lyon/tags/index.html","3c3fdc27860cbcb389961815978d01f7"],["/lyon/tags/生活杂谈/index.html","ca47384f5e7e52247dce14350543626f"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
