import {
  Input,
  InputGroup,
  InputRightElement,
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
import QRCode from "react-qr-code";
import axios from '../../../axios'
import React, { useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { TemplateCreator } from 'components/TemplateCreator'
import { TemplateRenderer } from 'components/TemplateRenderer'

const TemplateSelector = ({
  templateOptionUpdate,
  selectedOption,
  onChange
}) => {
  const alert = useAlert()

  let templateList = [
    {
      id: null,
      templateName: 'Load a Template'
    }
  ]

  const [templateStateList, setTemplateStateList] = useState(templateList)

  useEffect(
    () =>
      axios.get(`/templates/getList`).then(response => {
        console.log(response.data)
        let templates = response.data['templateList']
        templates.forEach(function (template) {
          templateList.push(template)
        })
        setTemplateStateList(templateList)
      }),
    [selectedOption]
  )

  console.log('templatelist is thissssss : ', templateStateList)

  const selectionHandler = event => {
    console.log(event)
    let index = event.nativeEvent.target.selectedIndex
    let selectedOption = event.nativeEvent.target[index].text
    console.log(index, selectedOption)

    templateOptionUpdate(selectedOption)
    alert.show(`Switched to ${selectedOption}`)

    if (
      selectedOption === 'Local Template' ||
      selectedOption === 'Load a Template'
    ) {
      let templateData = JSON.parse(localStorage.getItem('localCode'))
      onChange(templateData)
    } else {
      axios
        .post(`/templates/getTemplate`, {
          templateName: selectedOption
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
          console.log('templatedata : ', response.data.data['templateData'])
          let templateData = response.data.data['templateData']
          onChange(templateData)
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
      placeholder='Local Template'
      onChange={selectionHandler}
      style={{
        marginTop: '10px',
        marginBottom: '10px'
      }}
    >
      {templateStateList.map((item, index) => {
        console.log(item, index)
        return (
          <option
            value={`${index}. ${item.templateName}`}
            key={
              item.id === null ? `${index}.${item.templateName}` : `${item.id}`
            }
          >
            {item.templateName}
          </option>
        )
      })}
    </Select>
  )
}

export default function TemplateCreatorView () {
  const brandColor = useColorModeValue('brand.500', 'white')
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100')

  let bgButton = 'white'
  let colorButton = 'brand.500'
  let headerHTML =
    '<center><strong><h1>Issued By {Name of Organisation}</h1><h1>Under {Parent Organisation}</h1></strong></center>'

  const [code, setCode] = useState('<h1>No Template Loaded</h1>')
  const [templateOption, setTemplateOption] = useState('Local Template')
  const [localCode, setLocalCode] = useState('<h1>No Template Loaded</h1>')

  useEffect(() => {
    if (
      templateOption === 'Local Template' ||
      templateOption === 'Load a Template'
    ) {
      localStorage.setItem('localCode', JSON.stringify(code))
      console.log('writing: ', JSON.stringify(code))
    }
  }, [code])
  const alert = useAlert()

  const renderTemplate = (jsonObjectState, setCode) => {
    let response = fetch('http://localhost:8000/templates/test')
    console.log(response)
  }

  const persistToLocalStorage = code => {
    localStorage.setItem('localCode', JSON.stringify(code))
    alert.show('Changes persisted to Local Template')
  }

  const [templateName, setTemplateName] = useState('')

  const containsSpecialChars = str => {
    const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
    return specialChars.test(str)
  }

  const templateNameHandler = (event, alertHandler) => {
    let currentName = event.target.value
    if (containsSpecialChars(currentName))
      alertHandler.show('Special Characters are not allowed.')
    setTemplateName(currentName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase())
  }

  const handleTemplateSubmission = (templateData, alertHandler) => {
    console.log('Template Name : ', templateName)
    console.log('Template Check : ', templateName === '')
    templateName === ''
      ? alertHandler.show('Kindly enter a name first')
      : axios
          .post('/templates/create', {
            templateName: templateName,
            templateData: templateData
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
              placeholder='Save Template As . . . '
              value={templateName}
              style={{
                borderRadius: '50px'
              }}
              onChange={event => templateNameHandler(event, alert)}
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
                onClick={() => handleTemplateSubmission(code, alert)}
              >
                Save Template
              </Button>
            </InputRightElement>
          </InputGroup>
          <TemplateSelector
            templateOptionUpdate={setTemplateOption}
            selectedOption={templateOption}
            onChange={setCode}
          />
          <TemplateCreator code={code} onChange={setCode} />
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
            onClick={() => persistToLocalStorage(code)}
          >
            Save and Override Local Template
          </Button>
          <TemplateRenderer template={code} />
          <QRCode value={code} />
        </Box>
      </SimpleGrid>
    </Box>
  )
}
