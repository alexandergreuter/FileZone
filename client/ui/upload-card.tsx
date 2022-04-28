import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { AspectRatio, Box, Checkbox, Flex, IconButton, Spacer, Text, useColorModeValue, useClipboard, Center, Progress, Stack } from '@chakra-ui/react';
import { UploadInfo } from '../pages/index';

export interface UploadCardData {
    id: string;
    info: UploadInfo;
    link?: string;
    previewLink?: string;
    error?: string;
    progress?: number;
}

export function UploadCard(props: { data: UploadCardData, selectedChange: (selected: boolean) => void, selected: boolean }) {

    const link = props.data.link;
    const progress = props.data.progress;
    const error = props.data.error;

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const { hasCopied, onCopy } = useClipboard(link);

    let progressOverlayContent = null;

    if (error != null) {
        progressOverlayContent = <Text fontWeight="bold" color="red.500">{error}</Text>
    } else if (progress != null) {
        progressOverlayContent = (
            <>
                <Text as="b" color="white">{progress}%</Text>
                <Progress mt={5} size="sm" w="150px" value={progress} colorScheme="purple" />
            </>
        )
    } else {
        progressOverlayContent = <></>;
    }

    const progressOverlay = (
        <Center
            transition="opacity 0.3s"
            opacity={progress < 100 ? 1 : 0}
            pos='absolute' top='0' left='0' zIndex={1}
            h="100%" w="100%"
            bg="blackAlpha.700"
            pointerEvents={progress < 100 ? 'initial' : 'none'}>
            <Stack textAlign="center">
                {progressOverlayContent}
            </Stack>
        </Center>
    )

    return (
        <Box shadow='md' pos='relative' borderRadius='md' overflow='hidden' bgColor={bg} borderWidth='1px' borderColor={borderColor}>

            <Flex p={2} align='center' w='100%'>
                <Checkbox tabIndex={1} onChange={() => props.selectedChange(!props.selected)} isChecked={props.selected} mr={2} size='lg' colorScheme='purple' />
                <Text isTruncated mr={2}>{props.data.info.title}</Text>
                <Spacer />
                <IconButton disabled={link != null} icon={hasCopied ? <CheckIcon /> : <CopyIcon />} aria-label='Copy Link To Clipboard' onClick={onCopy} size='sm' />
            </Flex>

            <Box pos="relative">

                {progressOverlay}

                <AspectRatio ratio={16 / 9}>
                    <video controls>
                        <source src={props.data.link ?? props.data.previewLink} />
                        Cannot preview this file.
                    </video>
                </AspectRatio>
            </Box>

        </Box>
    )
}