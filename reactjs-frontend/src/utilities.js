const literalsRegex = new RegExp(/[$]{[a-zA-Z_0-9-]+}/g)

export const findUniqueVariablesInHTML = html => {
  const matches = html.match(literalsRegex)
  const result = {}
  if (!matches) return []

  matches.forEach(match => {
    const key = match
      .split('')
      .slice(2, match.length - 1)
      .join('')
    result[key] = true
  })
  return Object.keys(result)
}

export const insertVariablesIntoHTML = (html, variables) => {
  const keysToReplace = findUniqueVariablesInHTML(html)
  let serializedHtml = html
  keysToReplace.forEach(key => {
    if (variables && variables[key]) {
      const replaceKey = '${' + `${key}` + '}'
      const replaceValue = variables[key]
      // console.log({ replaceKey, replaceValue });
      serializedHtml = serializedHtml.replaceAll(replaceKey, replaceValue)
    }
    // console.log({ variables, key, serializedHtml });
  })
  console.log({ serializedHtml })
  return serializedHtml
}

export const detectVariables = (html, existingKeys) => {
  const variablesOrder = []
  const keys = { ...existingKeys }
  const currentKeys = {}
  const matches = html.match(literalsRegex)
  if (!matches) return {}
  matches.forEach(match => {
    const key = match
      .split('')
      .slice(2, match.length - 1)
      .join('')
    variablesOrder.push(key)
    keys[key] ||= ''
    currentKeys[key] ||= true
  })
  Object.keys(keys).forEach(key => {
    if (!currentKeys[key]) {
      delete keys[key]
    }
  })
  return {
    order: variablesOrder,
    keys
  }
}
