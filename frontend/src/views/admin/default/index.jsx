import {
  InputGroup,
  InputRightElement,
  Input,
  Avatar,
  Box,
  Flex,
  FormLabel,
  Link,
  Button,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react'
import axios from '../../../axios'
import { useAlert } from 'react-alert'
import ReactJson from 'react-json-view'
import { JsonTable } from 'react-json-to-html'
import React, { useState, useEffect } from 'react'
import { TemplateRenderer } from 'components/TemplateRenderer'

const SchemaSelector = ({ schemaOptionUpdate, selectedOption, onChange }) => {
  const alert = useAlert()

  let schemaList = [
    {
      id: null,
      schemaName: 'Load a Schema'
    }
  ]

  const [schemaStateList, setSchemaStateList] = useState(schemaList)

  useEffect(
    () =>
      axios.get(`/schemas/getList`).then(response => {
        console.log(response.data)
        let schemas = response.data['schemaList']
        schemas.forEach(function (schema) {
          schemaList.push(schema)
        })
        setSchemaStateList(schemaList)
      }),
    [selectedOption]
  )

  console.log('schemaList is this : ', schemaStateList)

  const selectionHandler = event => {
    console.log(event)
    let index = event.nativeEvent.target.selectedIndex
    let selectedOption = event.nativeEvent.target[index].text
    console.log(index, selectedOption)

    schemaOptionUpdate(selectedOption)
    alert.show(`Switched to ${selectedOption}`)

    if (
      selectedOption === 'Local Schema' ||
      selectedOption === 'Load a Schema'
    ) {
      let schemaData = JSON.parse(localStorage.getItem('localSchema'))
      onChange(schemaData)
    } else {
      axios
        .post(`/schemas/getSchema`, {
          schemaName: selectedOption
        })
        .then(function (response) {
          console.log('reponse :', response)
          if ('message' in response.data) {
            if (response.data['message'] === 'failure') {
              alert.show(response.data['error'])
            } else {
              alert.show(response.data['message'])
            }
          }
          console.log('schemadata : ', response.data.data['schemaData'])
          let schemaData = response.data.data['schemaData']
          console.log('raw schema data : ', schemaData)
          let parsedSchemaData = JSON.parse(JSON.stringify(schemaData))
          console.log(parsedSchemaData)
          console.log(typeof parsedSchemaData)
          onChange(parsedSchemaData)
        })
        .catch(function (error) {
          console.log('error : ', error)
          alert.show(error.toString())
          onChange(error.toString())
        })
    }
  }

  return (
    <Select
      placeholder='Local Schema'
      onChange={selectionHandler}
      style={{
        marginTop: '10px',
        marginBottom: '10px'
      }}
    >
      {schemaStateList.map((item, index) => {
        console.log(item, index)
        return (
          <option
            value={`${index}. ${item.schemaName}`}
            key={
              item.id === null ? `${index}.${item.schemaName}` : `${item.id}`
            }
          >
            {item.schemaName}
          </option>
        )
      })}
    </Select>
  )
}

export default function SchemaCreatorView () {
  const onEdit = true,
    onDelete = true,
    onAdd = true,
    iconStyle = 'triangle'

  let jsonObject = {
    schemaName: 'SampleSchema',
    _template: 'sample_template',
    _name: 'Ansh Sarkar',
    education: {
      class10: {
        _institution: 'DPS Siliguri',
        _percentage: 96.2,
        _yop: 2018
      },
      class12: {
        _institution: 'DPS Siliguri',
        _percentage: 96.6,
        _yop: 2020
      },
      college: {
        _degree: 'btech',
        _institution: 'KIIT Bhubaneswar',
        _graduationYear: 2024
      }
    }
  }
  let bgButton = 'white'
  let colorButton = 'brand.500'

  const [jsonObjectState, setJsonObjectState] = useState(jsonObject)
  const [jsonStringCollapse, setJsonStringCollapse] = useState(20)
  const [code, setCode] = useState('<h1>No Schema Loaded</h1>')

  const [schemaOption, setSchemaOption] = useState('Local Schema')

  useEffect(() => {
    if (schemaOption === 'Local Schema' || schemaOption === 'Load a Schema') {
      localStorage.setItem('localSchema', JSON.stringify(jsonObjectState))
      console.log('writing: ', JSON.stringify(jsonObjectState))
    }
  }, [jsonObjectState])

  const alert = useAlert()

  const renderSchema = (jsonObjectState, setCode) => {
    let response = fetch('http://localhost:8000/schemas/test')
    console.log(response)
  }

  const persistToLocalStorage = jsonObjectState => {
    localStorage.setItem('localCode', JSON.stringify(jsonObjectState))
    alert.show('Changes persisted to Local Schema')
  }

  const [schemaName, setSchemaName] = useState('')

  const containsSpecialChars = str => {
    const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
    return specialChars.test(str)
  }

  const schemaNameHandler = (event, alertHandler) => {
    let currentName = event.target.value
    if (containsSpecialChars(currentName))
      alertHandler.show('Special Characters are not allowed.')
    setSchemaName(currentName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase())
  }

  const handleSchemaSubmission = (schemaData, alertHandler) => {
    console.log('Schema Name : ', schemaName)
    console.log('Schema Check : ', schemaName === '')
    schemaName === ''
      ? alertHandler.show('Kindly enter a name first')
      : axios
          .post('/schemas/create', {
            schemaName: schemaName,
            schemaData: schemaData
          })
          .then(function (response) {
            console.log('reponse :', response)
            if ('message' in response.data)
              response.data['message'] === 'failure'
                ? alertHandler.show(response.data['error'])
                : alert.show(response.data['message'])
          })
          .catch(function (error) {
            alertHandler.show(error)
          })
  }

  const Css = {
    jsonTr: {
      height: '25px'
    },
    jsonTd: {
      padding: '5px',
      borderSpacing: '2px',
      borderRadius: '5px'
    },
    rowSpacer: {
      height: '2px'
    },
    rootElement: {
      padding: '5px',
      borderSpacing: '2px',
      backgroundColor: 'transparent',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      borderRadius: '5px'
    },
    subElement: {
      padding: '5px',
      borderSpacing: '2px',
      backgroundColor: 'transparent',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      borderRadius: '5px'
    },
    dataCell: {
      borderSpacing: '2px',
      backgroundColor: 'transparent',
      fontFamily: 'Arial',
      borderRadius: '5px'
    }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <Box>
          <InputGroup
            style={{
              zIndex: 0,
              marginTop: '10px'
            }}
          >
            <Input
              type={'text'}
              placeholder='Save Schema As . . . '
              value={schemaName}
              style={{
                borderRadius: '50px'
              }}
              onChange={event => schemaNameHandler(event, alert)}
            />
            <InputRightElement width='140px'>
              <Button
                bg={bgButton}
                color={colorButton}
                fontSize='xs'
                variant='no-effects'
                borderRadius='50px'
                px='45px'
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => handleSchemaSubmission(jsonObjectState, alert)}
              >
                Save Schema
              </Button>
            </InputRightElement>
          </InputGroup>
          <SchemaSelector
            schemaOptionUpdate={setSchemaOption}
            selectedOption={schemaOption}
            onChange={setJsonObjectState}
          />
          <ReactJson
            src={jsonObjectState}
            collapseStringsAfterLength={jsonStringCollapse}
            onEdit={
              onEdit
                ? e => {
                    console.log(e)
                    setJsonObjectState(e.updated_src)
                  }
                : false
            }
            onDelete={
              onDelete
                ? e => {
                    console.log(e)
                    setJsonObjectState(e.updated_src)
                  }
                : false
            }
            onAdd={
              onAdd
                ? e => {
                    console.log(e)
                    setJsonObjectState(e.updated_src)
                  }
                : false
            }
            iconStyle={iconStyle}
          />
        </Box>
        <Box>
          <Button
            bg={bgButton}
            color={colorButton}
            fontSize='xs'
            variant='no-effects'
            borderRadius='50px'
            px='45px'
            style={{
              cursor: 'pointer',
              marginTop: '10px',
              marginBottom: '20px'
            }}
            onClick={() => persistToLocalStorage(jsonObjectState)}
          >
            Save and Override Local Schema
          </Button>
          <JsonTable json={jsonObjectState} indent={5} css={Css} />
        </Box>
      </SimpleGrid>
    </Box>
  )
}
