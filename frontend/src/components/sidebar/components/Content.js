import React from 'react'
import { Box, Flex, Stack } from '@chakra-ui/react'
import Brand from 'components/sidebar/components/Brand'
import Links from 'components/sidebar/components/Links'
import SidebarCard from 'components/sidebar/components/SidebarCard'

function SidebarContent (props) {
  const { routes } = props
  return (
    <Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
      <Brand />
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: '16px', '2xl': '1px' }}>
          <Links routes={routes} />
        </Box>
      </Stack>
    </Flex>
  )
}

export default SidebarContent
