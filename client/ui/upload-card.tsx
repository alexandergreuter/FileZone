import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { AspectRatio, Box, Checkbox, Flex, IconButton, Image, Spacer, Text, useColorModeValue, useClipboard, Center } from '@chakra-ui/react';
import { Upload } from '../dto/Upload';
import { useUploadProgress } from '../hooks/upload';

export function UploadCard(props: { upload: Upload, selectedChange: (selected: boolean) => void, selected: boolean }) {

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const { hasCopied, onCopy } = useClipboard(props.upload.id);

    const progress = useUploadProgress(props.upload.progress);

    return (
        <Box shadow='md' pos='relative' borderRadius='md' overflow='hidden' bgColor={bg} borderWidth='1px' borderColor={borderColor}>
            <Center pos='absolute' top='0' left='0' right='0' bottom='0'>
                <Text>{progress}</Text> 
            </Center>

            <Flex p={2} align='center' w='100%'>
                <Checkbox tabIndex={1} onChange={() => props.selectedChange(!props.selected)} isChecked={props.selected} mr={2} size='lg' colorScheme='purple' />
                <Text isTruncated mr={2}>{props.upload.filename}</Text>
                <Spacer />
                <IconButton icon={hasCopied ? <CheckIcon /> : <CopyIcon />} aria-label='Copy Link To Clipboard' onClick={onCopy} size='sm' />
            </Flex>
            <AspectRatio ratio={16 / 8}>
                <video>
                    <source src={URL.createObjectURL(props.upload.file)} type={props.upload.file.type} />
                    Cannot preview this file.
                </video>
            </AspectRatio>
        </Box>
    )
}