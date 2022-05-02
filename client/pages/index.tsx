import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Checkbox, CircularProgress, Container, Flex, GridItem, IconButton, Image, Kbd, SimpleGrid, Spacer, Stack, StatHelpText, Text, Textarea, theme, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useMemo, useReducer } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Header } from '../common/header';
import { PageColumnCenter } from '../ui/page-column-center';
import { PageGrid } from '../ui/page-grid';
import { UploadCard, UploadCardData } from '../ui/upload-card';
import { useDropzone } from 'react-dropzone';
import { DropFilesHint } from '../common/drop-files-hint';
import { uploadFile } from '../hooks/upload';
import { getUploads, StorableUpload, setUploads } from '../hooks/upload-cookie-store';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

export interface HomeProps {
  previousUploads: StorableUpload[];
}

export async function getServerSideProps(context) {
  return {
    props: {
      previousUploads: getUploads(context)
    }
  }
}

export interface UploadInfo {
  title: string;
  dateAdded: Date;
}

interface UploadPreview {
  info: UploadInfo,
  previewLink: string
}

interface HomeState {
  info: { [id: string]: UploadInfo };
  selected: { [id: string]: boolean | undefined };
  progress: { [id: string]: number };
  links: { [id: string]: string };
  previewLinks: { [id: string]: string };
  error: { [id: string]: string };
}

const initialState: HomeState = {
  info: {},
  selected: {},
  progress: {},
  links: {},
  previewLinks: {},
  error: {}
};

type UploadReducerAction =
  | { type: 'addAndSelectPreviews', data: { [id: string]: UploadPreview } }
  | { type: 'putLink', id: string, link: string }
  | { type: 'addFromCookies', data: { [id: string]: StorableUpload } }
  | { type: 'setProgress', id: string, progress: number }
  | { type: 'putSelected', id: string, selected: boolean }
  | { type: 'setAllSelected', selected: boolean }
  | { type: 'putError', id: string, error: string }

function uploadReducer(state: HomeState, action: UploadReducerAction): HomeState {

  let result: HomeState = { ...state };

  switch (action.type) {
    case 'addAndSelectPreviews':
      const incomingInfo1 = {};
      const incomingPreviewLinks = {};
      const incomingSelections1 = {};

      for (const [id, upload] of Object.entries(action.data)) {
        incomingInfo1[id] = upload.info;
        incomingPreviewLinks[id] = upload.previewLink;
        incomingSelections1[id] = true;
      }

      result = {
        ...state,
        info: { ...state.info, ...incomingInfo1 },
        previewLinks: { ...state.previewLinks, ...incomingPreviewLinks },
        selected: { ...state.selected, ...incomingSelections1 }
      };
      break;
    case 'putLink':
      const incomingLink = {};

      // TODO: Forward file links instead of calling them directly
      incomingLink[action.id] = action.link;
      result = { ...state, links: { ...state.links, ...incomingLink } };
      break;
    case 'addFromCookies':
      const incomingInfo = {};
      const incomingSelected = {};
      const incomingLinks = {};

      for (const [id, upload] of Object.entries(action.data)) {
        incomingInfo[id] = upload.info;
        incomingSelected[id] = false;
        incomingLinks[id] = upload.link;
      }

      result = {
        ...state,
        info: {
          ...state.info,
          ...incomingInfo
        },
        selected: {
          ...state.selected,
          ...incomingSelected
        },
        links: {
          ...state.links,
          ...incomingLinks
        }
      };
      break;
    case 'putSelected':
      const incomingSelected2 = {};

      incomingSelected2[action.id] = action.selected;

      result = { ...state, selected: { ...state.selected, ...incomingSelected2 } };
      break;
    case 'setAllSelected':
      const incomingSelections = {};

      for (const id of Object.keys(state.selected)) {
        incomingSelections[id] = action.selected;
      }

      result = { ...state, selected: { ...state.selected, ...incomingSelections } };
      break;
    case 'putError':
      const incomingError = {};

      incomingError[action.id] = action.error;

      result = {
        ...state,
        error: {
          ...state.error,
          ...incomingError
        }
      };
      break;
    case 'setProgress':
      const incomingProgress = {};

      incomingProgress[action.id] = action.progress;

      result = {
        ...state,
        progress: {
          ...state.progress,
          ...incomingProgress
        }
      };
      break;
  }

  const uploads = Object.entries(result.info)
    .filter(([id, info]) => info && result.links[id])
    .map(([id, info]) => ({
      id,
      info,
      link: result.links[id]
    }));

  setUploads(uploads);

  return result;
}

export default function Home(_props: HomeProps) {

  const [state, dispatch] = useReducer(uploadReducer, initialState);

  useEffect(() => {

    const previousUploads = {};

    for (const upload of _props.previousUploads) {
      previousUploads[upload.id] = upload;
    }

    dispatch({
      type: 'addFromCookies',
      data: previousUploads
    });
  }, [_props.previousUploads]);

  const onFilesAdded = (files: File[]) => {

    const previews: { [id: string]: UploadPreview } = {};

    for (const file of files) {
      const id = uuidv4();
      const title = file.name;

      // Map and store the preview
      previews[id] = {
        info: {
          title,
          dateAdded: new Date()
        },
        previewLink: URL.createObjectURL(file)
      }

      const onProgressChange = (progress: number) => {
        dispatch({ type: 'setProgress', id, progress });
      }

      // upload the file and dispatch its new url once it's available
      uploadFile(file, title, onProgressChange)
        .then((result) => {
          dispatch({ type: 'putLink', id, link: `${config.apiUrl}/files/${result.hash}/download` })
        })
        .catch((_error) => {
          dispatch({ type: 'putError', id, error: 'Failed to upload file.' });
        });
    }

    // dispatch the previews
    dispatch({ type: 'addAndSelectPreviews', data: previews });
  }

  const onUploadSelectedChanged = (id: string, selected: boolean) => dispatch({ type: 'putSelected', id, selected });

  const onSelectAllChange = (selected: boolean) => dispatch({ type: 'setAllSelected', selected });

  const areAllSelected = Object.values(state.selected).every((selected) => selected);

  const uploadCards = useMemo(() => Object.keys(state.info)
    .map<UploadCardData>((id) => ({
      id,
      info: state.info[id],
      link: state.links[id],
      previewLink: state.previewLinks[id],
      selected: state.selected[id],
      error: state.error[id],
      progress: state.progress[id]
    }))
    .sort((a, b) => new Date(b.info.dateAdded).getTime() - new Date(a.info.dateAdded).getTime())
    .map(data => (
      <UploadCard
        key={data.id}
        data={data}
        selected={state.selected[data.id]}
        selectedChange={(selected) => onUploadSelectedChanged(data.id, selected)} />
    )),
    [state.info, state.links, state.previewLinks, state.selected, state.error, state.progress]
  );

  const isCardsEmpty = uploadCards.length === 0;

  const selectedLinks = Object.keys(state.selected).map((id) => state.links[id]);

  const selectedLinksWaitingForCompletion = selectedLinks.filter((link) => link == null).length;

  let selectedLinksText = selectedLinks.join('\n');

  if (selectedLinksWaitingForCompletion > 0) {
    selectedLinksText = `Waiting for ${selectedLinksWaitingForCompletion} more file(s)\n${selectedLinksText}`;
  }

  const { hasCopied, onCopy } = useClipboard(selectedLinksText);

  useHotkeys('shift+j', onCopy, {
    enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    enabled: selectedLinks.length > 0 || selectedLinksWaitingForCompletion > 0
  });

  const bg = useColorModeValue('white', 'gray.800');

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } = useDropzone({
    onDrop: onFilesAdded,
    noClick: true,
    noKeyboard: true,
    accept: 'video/*',
  });

  const linksLoadinghint = selectedLinksWaitingForCompletion === 0
    ? (<Text>All Files Ready ✅</Text>)
    : (<Flex alignItems="center">
      <CircularProgress isIndeterminate color="purple.400" size="16px" mr={2} />
      <Text>{selectedLinksWaitingForCompletion} file(s) still uploading</Text>
    </Flex>)

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
                  disabled={isCardsEmpty} />
                <Text casing='uppercase' as="b" mr={2}>Uploads</Text>
                <Spacer />
                <IconButton
                  icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                  aria-label='Copy Link To Clipboard'
                  onClick={onCopy}
                  size='sm'
                  disabled={isCardsEmpty} />
              </Flex>

              <SimpleGrid minChildWidth='min(100vw, 200px)' spacing={5} hidden={isCardsEmpty}>
                {uploadCards}
              </SimpleGrid>

              <Stack spacing={10} mt={20} hidden={!isCardsEmpty}>
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
            <Box pos='sticky' top={10} hidden={selectedLinks.length === 0 && selectedLinksWaitingForCompletion === 0}>
              {linksLoadinghint}
              <Textarea value={selectedLinksText} readOnly resize='none' minH='250px' bg={bg} tabIndex={1} mt={2} />
              <Center mt={2}>
                {hasCopied
                  ? <Text>Copied!</Text>
                  : <Text><Kbd>SHIFT</Kbd> + <Kbd>J</Kbd> to copy</Text>}
              </Center>
            </Box>
          </GridItem>
        </PageGrid>
      </Container>
    </Box>
  )
}