import { globalStyles } from './styles'
import { linkStyles } from './components/link'
import { extendTheme } from '@chakra-ui/react'
import { inputStyles } from './components/input'
import { badgeStyles } from './components/badge'
import { switchStyles } from './components/switch'
import { sliderStyles } from './components/slider'
import { buttonStyles } from './components/button'
import { CardComponent } from './additions/card/card'
import { progressStyles } from './components/progress'
import { textareaStyles } from './components/textarea'
import { breakpoints } from './foundations/breakpoints'
export default extendTheme(
  { breakpoints },
  globalStyles,
  badgeStyles,
  buttonStyles,
  linkStyles,
  progressStyles,
  sliderStyles,
  inputStyles,
  textareaStyles,
  switchStyles,
  CardComponent
)
