import https from 'node:https'
import * as readline from 'readline'

class Site {
  protected revalidate

  constructor (revalidate?: number) {
    this.revalidate = revalidate ?? 60000
  }

  checkStatus (url: string, interval?: NodeJS.Timer): void {
    https.get(url, (res) => {
      switch (res.statusCode) {
        case 200:
          if (interval !== undefined) { clearInterval(interval) }
          console.log(new Date().toLocaleString(), res.statusCode, 'ONLINE')
          break
        case 404:
          console.log(new Date().toLocaleString(), res.statusCode, 'PAGE NOT FOUND')
          break
        case 500:
          console.log(new Date().toLocaleString(), res.statusCode, 'Internal Server Error')
          break
        case 503:
          console.log(new Date().toLocaleString(), res.statusCode, 'Service Unavailable')
          break
        default:
          console.log(new Date().toLocaleString(), res.statusCode, 'OFFLINE')
          break
      }
    })
  }

  monitoring (): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('What url should I monitoring? ', (url: string) => {
      if (url === '') {
        console.error('URL not informed')
        return
      }
      if (!url.includes('https')) {
        console.error(`${url} not seems like a URL`)
        return
      }
      this.checkStatus(url)
      const interval = setInterval(() => { this.checkStatus(url, interval) }, this.revalidate)
      console.log('running')
    })
  }
}
const site = new Site()
site.monitoring()
