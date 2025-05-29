import { useState, useRef } from 'react'
import Editor from "@monaco-editor/react"
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import axios from 'axios'
import './App.css'

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', defaultCode: 'function sum() {\n  return 1 + 1;\n}', monacoLanguage: 'javascript' },
  { id: 'python', name: 'Python', defaultCode: 'def sum():\n    return 1 + 1', monacoLanguage: 'python' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static int sum() {\n        return 1 + 1;\n    }\n}', monacoLanguage: 'java' },
  { id: 'c', name: 'C', defaultCode: 'int sum() {\n    return 1 + 1;\n}', monacoLanguage: 'c' },
  { id: 'cpp', name: 'C++', defaultCode: 'int sum() {\n    return 1 + 1;\n}', monacoLanguage: 'cpp' }
];

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].defaultCode)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const editorRef = useRef(null);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    const languageConfig = SUPPORTED_LANGUAGES.find(lang => lang.id === newLanguage);
    setCode(languageConfig.defaultCode);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // Optionally add language-specific Monaco config here
  };

  async function reviewCode() {
    setLoading(true)
    try {
      const response = await axios.post('https://backend-code-reviewer-2.onrender.com/ai/get-review', { 
        code,
        language: selectedLanguage
      })
      setReview(response.data.response)
    } catch (error) {
      setReview("Error fetching review. Please write the code.")
    } finally {
      setLoading(false)
    }
  }

  const currentLanguageConfig = SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage);

  return (
    <>
      <main>
        <div className='left'>
          <div className='editor-header'>
            <select 
              value={selectedLanguage} 
              onChange={handleLanguageChange}
              className='language-select'
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className='code'>
            <Editor
              value={code}
              language={currentLanguageConfig.monacoLanguage}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                padding: { top: 10, bottom: 10 },
                scrollbar: { vertical: 'auto', horizontal: 'auto' },
                fontSize: 14,
                fontFamily: '"Fira code", "Fira Mono", monospace',
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: true,
                trimAutoWhitespace: true,
                formatOnPaste: true,
                formatOnType: true,
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
//i did this