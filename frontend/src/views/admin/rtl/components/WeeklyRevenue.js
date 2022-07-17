import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import {
  barChartDataConsumption,
  barChartOptionsConsumption
} from 'variables/charts'
import React from 'react'
import Card from 'components/card/Card.js'
import { MdBarChart } from 'react-icons/md'
import BarChart from 'components/charts/BarChart'

export default function WeeklyRevenue (props) {
  const { ...rest } = props
  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const iconColor = useColorModeValue('brand.500', 'white')
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100')
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' }
  )
  const bgFocus = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.100' }
  )
  return (
    <Card align='center' direction='column' w='100%' {...rest}>
      <Flex align='center' w='100%' px='15px' py='10px'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'
        >
          Weekly Revenue
        </Text>
        <Button
          align='center'
          justifyContent='center'
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w='37px'
          h='37px'
          lineHeight='100%'
          borderRadius='10px'
          {...rest}
        >
          <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
        </Button>
      </Flex>

      <Box h='240px' mt='auto'>
        <BarChart
          chartData={barChartDataConsumption}
          chartOptions={barChartOptionsConsumption}
        />
      </Box>
    </Card>
  )
}
