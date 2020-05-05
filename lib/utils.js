import atob from 'atob'
import btoa from 'btoa'
import router from 'next/router'
import config from '../config'
import dateformat from 'dateformat'
import cookie from 'cookie'
import moment from 'moment'

export const b2id = (b) => {
  if (!b) {
    return null
  }
  const dummy = atob(b).split(':')
  return dummy[dummy.length-1]
}

export const id2b = (prefix, id) => {
  if (!prefix || !id) {
    return null
  }
  return btoa(`${prefix}:${id}`)
}

export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const titleize = (s) => {
  if (typeof s !== 'string') return ''
  return s.replace(/-|_/g, ' ').split(' ').map(text => capitalize(text)).join(' ')
}

export const camelize = (text, separator = '_') => {
  const words = text.split(separator)
  const result = [words[0]]
  words.slice(1).forEach((word) => result.push(capitalize(word)))
  return result.join('')
}

export const title = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const redirect = (context, target, as) => {
  if (context.res) {
    // server
    // 303: "See other"
    if (context.res.redirect) {
      context.res.redirect(target, as)
    } else {
      context.res.writeHead(303, { Location: as || target })
    }
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    // router.replace(target, as)
    router.push(target, as, { shallow: true })
  }
}

export const cleanEmail = (email) => {
  email = email || ''
  return email.trim().replace(/ /g, '').toLowerCase()
}


export const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const messageContains = (message, words) => {
  if (!message) {
    return false
  }
  return words.reduce((isContains, word) => { return isContains && message.indexOf(word) !== -1}, true)
}

export const invalidFeedback = (error) => {
  return error ? <div className="invalid-feedback">{error}</div> : ''
}

export const invalidClass = (error) => {
  return error ? 'is-invalid' : ''
}

export const imageUrl = (url, size) => {

  if (url && size) {
    url = JSON.parse(url)[size]
  }

  if (!url) {
    return `${config.baseUrl}/static/frontend/img/no-image.png`
  }
  return `${config.backendBaseUrl}/media/${url}`
}

export const activeClass = (currentUrl, pathname, className, exact) => {
  currentUrl = currentUrl.replace('/list', '')
  pathname = pathname.replace('/list', '')

  className = className || 'is-active'

  if (exact) {
    return currentUrl === pathname ? ' ' + className: ''
  } else {
    return currentUrl.startsWith(pathname) ? ' ' + className: ''
  }
}

export const renderHtml = (html) => {
  html = html || ''
  return html.replace(/\<img src\="\//g, `<img src="${config.backendBaseUrl}\/`)
}

export const getInput = (elms) => {

  let input = {}
  let invalid = false

  Object.keys(elms).forEach(key => {

    if (!elms[key]) return

    const ckey = camelize(key)

    const {validity, type, value, multiple, disabled, files} = elms[key]

    if (!disabled && validity && validity.valid) {

      if (type === 'file' && files && files.length > 0) {
        if (!multiple) {
          input[ckey] = files[0]
        } else {
          // TODO: 
        }
      } else {
        input[ckey] = value
      }

    } else if (RadioNodeList.prototype.isPrototypeOf(elms[key])) {
      if (elms[key][0].type == 'radio') {
        input[ckey] = value
      } else {
        const checkboxArray = Array.prototype.slice.call(elms[key])
        const checkedCheckboxes = checkboxArray.filter(input => input.checked)
        input[ckey] = checkedCheckboxes.map(input => input.value)
      }
    }

  })

  return input

}


export const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export const headTitle = (title) => {
  return title? `${title} | ${config.siteTitle}`: config.siteTitle
}
export const headUrl = (url) => {
  return config.baseUrl + url
}

export const renderDateRange = (start, end) => {
  // let output = ``
  // if (start && end) {
  //   output = `${dateformat(start, 'd/m')} - ${dateformat(end, 'd/m')}`
  // } else if (start) {
  //   output = dateformat(start, 'd/m/yyyy')
  // } else if (end) {
  //   output = dateformat(end, 'd/m/yyyy')
  // }
  //
  // if (output && output.indexOf('-') === -1) {
  //
  //   output = output.split('/')
  //   if (output[2]) {
  //     if (i18n.language.indexOf('th') === 0) {
  //       output[2] = (parseInt(output[2]) + 543) + ''
  //     }
  //     output[2] = output[2].substr(2)
  //
  //   }
  //   output = output.join('/')
  // }
  //
  // return output
}


export const deleteAllCookies = () => {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}


export const initLanguage = (loggedInUser) => {
  return
  if (loggedInUser) {
    // i18n.changeLanguage(loggedInUser.language.toLowerCase())
    document.cookie = cookie.serialize('language', loggedInUser.language.toLowerCase(), {
      path: '/'
    })
  }
}

export const rft = (obj, fieldName) => {
  //
  // if (!i18n.language || i18n.language == 'dev') {
  //   return ``
  // }
  //
  // let value = obj[fieldName + capitalize(i18n.language.split('-')[0])]
  // if (!value) {
  //   for (let language of config.enableLanguages) {
  //     value = obj[fieldName+capitalize(language)]
  //     if (value) break
  //   }
  // }
  // return value
}

export const sft=(fieldName)=>{
  return config.enableLanguages.map(language=>fieldName+capitalize(language)).join("\n")
}

export const defaultDateTimeFormat = (text) => {
  // let date = new Date(text)
  // return date.toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric', hour:'numeric', minute: 'numeric', hour12: false})
}
export const defaultDateFormat = (text) => {
  // let date = new Date(text)
  // return date.toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })
}
export const defaultTimeFormat = (text) => {
  // let date = new Date(text)
  // return date.toLocaleTimeString(i18n.language, { hour:'numeric', minute: 'numeric', hour12: false})
}
export const isoDateTimeFormat = (text)=>{
  let date = new Date(text)
  return date.toISOString().substr(0,10)
}
export const isoDateTimeLocalFormat=(text)=>{
  let date = new Date(text)
  return moment(date).format("YYYY-MM-DDTHH:mm")
}


const findQueries = (manager, name) => {
  const matching = []
  manager.queries.forEach((q) => {
    if (q.observableQuery && (q.observableQuery.queryName === name)) {
      matching.push(q)
    }
  })
  return matching
}

export const refetchQueryByName = (client, name) => {
  console.log(name)
  return Promise.all(findQueries(client.queryManager, name).map(q => {
    console.log(q.observableQuery.refetch())
    // q.observableQuery.refetch()
  }))
}