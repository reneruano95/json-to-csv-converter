export interface ConversionResult {
  csv: string
  rowCount: number
  columnCount: number
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {}

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (value === null || value === undefined) {
      flattened[newKey] = ''
    } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(flattened, flattenObject(value, newKey))
    } else if (Array.isArray(value)) {
      flattened[newKey] = JSON.stringify(value)
    } else {
      flattened[newKey] = value
    }
  }

  return flattened
}

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

export function convertJSONToCSV(jsonData: any): ConversionResult {
  if (!jsonData) {
    throw new Error('No data provided')
  }

  let dataArray: any[]

  if (Array.isArray(jsonData)) {
    if (jsonData.length === 0) {
      throw new Error('Empty array provided')
    }
    dataArray = jsonData
  } else if (typeof jsonData === 'object') {
    dataArray = [jsonData]
  } else {
    throw new Error('Invalid JSON structure: must be an object or array')
  }

  const flattenedData = dataArray.map(item => {
    if (typeof item === 'object' && item !== null) {
      return flattenObject(item)
    }
    return { value: item }
  })

  const allKeys = new Set<string>()
  flattenedData.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key))
  })

  const headers = Array.from(allKeys)
  
  if (headers.length === 0) {
    throw new Error('No columns found in data')
  }

  const headerRow = headers.map(escapeCSVValue).join(',')

  const dataRows = flattenedData.map(row => {
    return headers.map(header => {
      const value = row[header]
      return escapeCSVValue(value)
    }).join(',')
  })

  const csv = [headerRow, ...dataRows].join('\n')

  return {
    csv,
    rowCount: dataRows.length,
    columnCount: headers.length
  }
}

export function downloadCSV(csvContent: string, filename = 'converted.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
