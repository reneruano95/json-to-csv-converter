import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  UploadSimple, 
  DownloadSimple, 
  FileCsv, 
  FileJs, 
  Warning,
  CheckCircle,
  X
} from '@phosphor-icons/react'
import { convertJSONToCSV, downloadCSV } from '@/lib/json-to-csv'
import { toast } from 'sonner'

function App() {
  const [jsonContent, setJsonContent] = useState<string>('')
  const [csvContent, setCsvContent] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<number>(0)
  const [rowCount, setRowCount] = useState<number>(0)
  const [columnCount, setColumnCount] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Please upload a valid JSON file')
      toast.error('Invalid file type')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const text = await file.text()
      setJsonContent(text)
      setFileName(file.name)
      setFileSize(file.size)

      const parsed = JSON.parse(text)
      const result = convertJSONToCSV(parsed)
      
      setCsvContent(result.csv)
      setRowCount(result.rowCount)
      setColumnCount(result.columnCount)
      
      toast.success('File converted successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse or convert JSON'
      setError(errorMessage)
      setJsonContent('')
      setCsvContent('')
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDownload = () => {
    if (!csvContent) return
    
    const csvFileName = fileName.replace(/\.json$/i, '.csv')
    downloadCSV(csvContent, csvFileName)
    toast.success('CSV file downloaded!')
  }

  const handleClear = () => {
    setJsonContent('')
    setCsvContent('')
    setFileName('')
    setFileSize(0)
    setRowCount(0)
    setColumnCount(0)
    setError('')
    toast.info('Cleared all data')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-[32px] font-bold tracking-tight text-foreground">
            JSON to CSV Converter
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Upload your JSON file and convert it to CSV format instantly
          </p>
        </header>

        <div className="space-y-6">
          <Card className="p-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center
                rounded-lg border-2 border-dashed transition-all
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileInput}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isProcessing}
              />
              
              <UploadSimple className="mb-4 h-12 w-12 text-muted-foreground" />
              
              <p className="mb-2 text-[15px] font-medium text-foreground">
                {isProcessing ? 'Processing...' : 'Drop your JSON file here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>

            {fileName && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1.5">
                  <FileJs weight="fill" className="h-4 w-4" />
                  {fileName}
                </Badge>
                <Badge variant="outline">{formatFileSize(fileSize)}</Badge>
                {rowCount > 0 && (
                  <>
                    <Badge variant="outline">{rowCount} rows</Badge>
                    <Badge variant="outline">{columnCount} columns</Badge>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            )}
          </Card>

          {error && (
            <Alert variant="destructive">
              <Warning className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {csvContent && !error && (
            <>
              <Alert className="border-accent bg-accent/10">
                <CheckCircle className="h-4 w-4 text-accent" />
                <AlertDescription className="text-foreground">
                  Conversion successful! Review the output below and download when ready.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <FileJs weight="fill" className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-[20px] font-semibold text-foreground">
                      JSON Input
                    </h2>
                  </div>
                  <ScrollArea className="h-[400px] rounded-md border bg-muted/30 p-4">
                    <pre className="text-[13px] leading-relaxed text-foreground">
                      <code>{jsonContent}</code>
                    </pre>
                  </ScrollArea>
                </Card>

                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <FileCsv weight="fill" className="h-5 w-5 text-accent" />
                    <h2 className="text-[20px] font-semibold text-foreground">
                      CSV Output
                    </h2>
                  </div>
                  <ScrollArea className="h-[400px] rounded-md border bg-muted/30 p-4">
                    <pre className="text-[13px] leading-relaxed text-foreground">
                      <code>{csvContent}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="gap-2 font-medium tracking-wide"
                >
                  <DownloadSimple className="h-5 w-5" />
                  Download CSV
                </Button>
              </div>
            </>
          )}

          {!csvContent && !error && !fileName && (
            <Card className="p-8 text-center">
              <div className="mx-auto max-w-md space-y-4">
                <div className="flex justify-center gap-4">
                  <FileJs weight="fill" className="h-12 w-12 text-muted-foreground" />
                  <Separator orientation="vertical" className="h-12" />
                  <FileCsv weight="fill" className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Ready to Convert
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Upload a JSON file to get started. The converter handles nested objects,
                    arrays, and mixed data types automatically.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default App