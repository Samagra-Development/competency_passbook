import 'codemirror/keymap/sublime'
import 'codemirror/theme/monokai.css'
import react, { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'

export const TemplateCreator = ({ code, onChange }) => {
  return (
    <div
      style={{
        textAlign: 'left',
        position: 'relative',
        marginBottom: '30px'
      }}
    >
      <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <CodeMirror
          value={code}
          onChange={(instance, change) => {
            console.log(instance, ' : ', typeof instance)
            onChange(instance)
          }}
          options={{
            theme: 'monokai',
            keyMap: 'sublime',
            mode: 'html'
          }}
        />
      </div>
    </div>
  )
}
