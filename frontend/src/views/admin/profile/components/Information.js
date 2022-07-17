import React from 'react'
import Card from 'components/card/Card.js'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'

export default function Information (props) {
  const { title, value, ...rest } = props
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'gray.400'
  const bg = useColorModeValue('white', 'navy.700')
  return (
    <Card bg={bg} {...rest}>
      <Box>
        <Text fontWeight='500' color={textColorSecondary} fontSize='sm'>
          {title}
        </Text>
        <Text color={textColorPrimary} fontWeight='500' fontSize='md'>
          {value}
        </Text>
      </Box>
    </Card>
  )
}