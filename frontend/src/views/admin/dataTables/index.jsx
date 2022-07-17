import React from 'react'
import { Box, SimpleGrid } from '@chakra-ui/react'
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex
} from 'views/admin/dataTables/variables/columnsData'
import CheckTable from 'views/admin/dataTables/components/CheckTable'
import ComplexTable from 'views/admin/dataTables/components/ComplexTable'
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable'
import tableDataCheck from 'views/admin/dataTables/variables/tableDataCheck.json'
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable'
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns.json'
import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex.json'
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment.json'

export default function Settings () {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </SimpleGrid>
    </Box>
  )
}
