import React from 'react'
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'

export default function Footer () {
  const textColor = useColorModeValue('gray.400', 'white')
  const { toggleColorMode } = useColorMode()
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: 'column',
        xl: 'row'
      }}
      alignItems={{
        base: 'center',
        xl: 'start'
      }}
      justifyContent='space-between'
      px={{ base: '30px', md: '50px' }}
      pb='30px'
    >
      <List display='flex'>
        <ListItem
          me={{
            base: '20px',
            md: '44px'
          }}
        >
          <Link
            fontWeight='500'
            color={textColor}
            href='mailto:example@example.com'
          >
            Contact Us
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px'
          }}
        >
          <Link
            fontWeight='500'
            color={textColor}
            href='https://github.com/Samagra-Development/competency_passbook'
          >
            Github
          </Link>
        </ListItem>
      </List>
    </Flex>
  )
}
