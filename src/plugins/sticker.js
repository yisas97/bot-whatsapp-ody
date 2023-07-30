import {fileTypeFromBuffer} from 'file-type';
import fetch from 'node-fetch';


async function createSticker(img, url, packname, author, categories = [''], extra = {}) {
    const { Sticker } = await import('wa-sticker-formatter')
    const stickerMetadata = {
      type: 'full',
      pack: packname,
      author,
      categories,
      ...extra
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
  }

async function canvas(code, type = 'png', quality = 0.92) {
    let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
        type,
        quality
    }), {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': code.length
        },
        body: code
    })
    return await res.buffer()
}

function queryURL(queries) {
    return new URLSearchParams(Object.entries(queries))
}

async function sticker(img, url) {
    url = url ? url : await uploadImage(img)
    let {
        mime
    } = url ? { mime: 'image/jpeg' } : await fileTypeFromBuffer(img)
    let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
  c.width = c.height = 512
  let max = Math.max(im.width, im.height)
  let w = 512 * im.width / max
  let h = 512 * im.height / max
  ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
  `
    return await canvas(sc, 'webp')
}

export {
    sticker
}