import { useState } from 'react'
import Editor from "@monaco-editor/react"
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  async function reviewCode() {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data.response)
    } catch (error) {
      setReview("Error fetching review. Please write the code.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      

      <main>
        <div className='left'>
          <div className='code'>
            <Editor
              value={code}
              language="javascript"
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                padding: {
                  top: 10,
                  bottom: 10
                },
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto'
                }
              }}
              height="100%"
              width="100%"
            />
          </div>
          <div className='review' onClick={reviewCode}>Review</div>
        </div>
        <div className='right'>
          {loading ? (
            <div className="loader">⏳ Loading review...</div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </main>
    </>
  )
}

export default App
