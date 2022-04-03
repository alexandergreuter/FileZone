import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Checkbox, Container, Flex, GridItem, IconButton, Image, Kbd, SimpleGrid, Spacer, Stack, Text, Textarea, theme, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Header } from '../common/header';
import { Upload } from '../dto/Upload';
import { PageColumnCenter } from '../ui/page-column-center';
import { PageGrid } from '../ui/page-grid';
import { UploadCard } from '../ui/upload-card';
import { useDropzone } from 'react-dropzone';
import { DropFilesHint } from '../common/drop-files-hint';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, UploadProgress } from '../hooks/upload';

export default function Home() {

  // TODO: Load from server
  const [uploads, setUploads] = useState<Upload[]>([])
  const [selectedUploads, setSelectedUploads] = useState<string[]>([])

  const onFilesAdded = (files: File[]) => {
    const newUploads: Upload[] = files.map(file => ({
      id: uuidv4(),
      filename: file.name,
      file: file,
      progress: uploadFile(file)
    }));

    setUploads([...uploads, ...newUploads]);
  }

  const onUploadSelectedChanged = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedUploads([...selectedUploads, id])
    } else {
      setSelectedUploads(selectedUploads.filter(x => x !== id))
    }
  }

  const isSelected = (upload: Upload) => selectedUploads.includes(upload.id)

  const onSelectAllChange = (selected: boolean) => {
    if (selected) {
      setSelectedUploads(uploads.map(x => x.id))
    } else {
      setSelectedUploads([])
    }
  }

  const areAllSelected = selectedUploads.length === uploads.length && uploads.length > 0

  const uploadCards = uploads.map(upload => (
    <UploadCard
      key={upload.id}
      upload={upload}
      selected={isSelected(upload)}
      selectedChange={(selected) => onUploadSelectedChanged(upload.id, selected)} />
  ))

  const links = uploads
    .filter(upload => isSelected(upload))
    .map(upload => upload.id)
    .join('\n')

  const { hasCopied, onCopy } = useClipboard(links)
  useHotkeys('ctrl+alt+c', onCopy, {
    enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    enabled: links.length > 0,
  });

  const bg = useColorModeValue('white', 'gray.800');

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } = useDropzone({
    onDrop: onFilesAdded,
    noClick: true,
    noKeyboard: true,
    accept: 'video/*',
  });

  return (
    <Box
      bgImage={'url(bg-decoration.svg)'}
      backgroundRepeat='no-repeat'
      backgroundPosition='center 27px'
      backgroundSize='1200px auto'
      minH='100%'
      {...getRootProps()}
      role=''>

      <input {...getInputProps()} />

      <DropFilesHint isDragAccept={isDragAccept} isDragReject={isDragReject} />

      <Header />

      <Container maxW="container.xl" my={10}>
        <PageGrid>

          {/* Add button */}
          <GridItem colSpan={3}>
            <Box pos='sticky' top={10}>
              <Button fontWeight='bold' colorScheme='purple' w='100%' onClick={open} tabIndex={1}>BROWSE</Button>
              <Text mt={1}>or Drop Anywhere</Text>
            </Box>
          </GridItem>

          {/* Files Grid */}
          <PageColumnCenter>
            <Box mx={`-${(theme.space[2])}`}>
              <Flex alignItems='center' zIndex='1' mx={2} mb={2}>
                <Checkbox
                  onChange={() => onSelectAllChange(!areAllSelected)}
                  isChecked={areAllSelected}
                  mr={2}
                  size='lg'
                  colorScheme='purple'
                  disabled={uploads.length === 0} />
                <Text casing='uppercase' as="b" mr={2}>NEW</Text>
                <Spacer />
                <IconButton 
                  icon={hasCopied ? <CheckIcon /> : <CopyIcon />} 
                  aria-label='Copy Link To Clipboard' 
                  onClick={onCopy} 
                  size='sm'
                  disabled={uploads.length === 0} />
              </Flex>

              <SimpleGrid minChildWidth='min(100vw, 200px)' spacing={5} hidden={uploads.length === 0}>
                {uploadCards}
              </SimpleGrid>

              <Stack spacing={10} mt={20} hidden={uploads.length > 0}>
                <Center>
                  <Image src='empty-state.svg' height='400px' />
                </Center>
                <Center>
                  <Text textAlign='center'>It's empty in this zone.<br />You can add files by dropping them anywhere or by using the browse button in the top left.</Text>
                </Center>
              </Stack>

            </Box>
          </PageColumnCenter>

          {/* LinkBox */}
          <GridItem colSpan={3}>
            <Box pos='sticky' top={10} hidden={links.length === 0}>
              <Textarea value={links} readOnly resize='none' minH='250px' bg={bg} tabIndex={1} />
              <Center mt={2}>
                {hasCopied
                  ? <Text>Copied!</Text>
                  : <Text><Kbd>CTRL</Kbd> + <Kbd>ALT</Kbd> + <Kbd>C</Kbd> to copy</Text>}
              </Center>
            </Box>
          </GridItem>
        </PageGrid>
      </Container>
    </Box>
  )
}