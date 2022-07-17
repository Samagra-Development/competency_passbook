import { useRef } from 'react'
import HTMLRenderer from 'react-html-renderer'

export const TemplateRenderer = ({ template, variables }) => {
  const containerRef = useRef()
  try {
    return (
      <div
        ref={containerRef}
        style={{ padding: 8, borderLeft: '1px solid #ccc' }}
      >
        <HTMLRenderer
          html={template}
          components={{
            div: props => {
              console.log({ props })
              return <div data-element-id='1' {...props} />
            }
          }}
        />
      </div>
    )
  } catch (error) {
    console.log(error)
    let errorHTML =
      "<style>.error-header { color: 'red'; }</style><h1 class='error-header'>x_x Error</h1><p>The Code You Entered Seems to Have Some Error In It. Kindly Check it Out Once</p>"
    return (
      <div
        ref={containerRef}
        style={{ padding: 8, borderLeft: '1px solid #ccc' }}
      >
        <HTMLRenderer
          html={errorHTML}
          components={{
            div: props => {
              console.log({ props })
              return <div data-element-id='1' {...props} />
            }
          }}
        />
      </div>
    )
  }
}
