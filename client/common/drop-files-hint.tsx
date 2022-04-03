import { Box, Center, Fade, ScaleFade, Text } from "@chakra-ui/react";

export function DropFilesHint(props: {isDragAccept: boolean, isDragReject: boolean}) {

    const isAnyActive = props.isDragAccept || props.isDragReject;

    return (
        <Fade in={isAnyActive}>
            <Box w='100%' h='100%' bg='blackAlpha.500' position='absolute' zIndex={2}>
                <Center h='100%' w='100%'>
                    <ScaleFade initialScale={0.7} in={isAnyActive}>
                        {props.isDragAccept && <Text>Drop Anywhere to Add</Text>}
                        {props.isDragReject && <Text color="red.500">This File Type is Not Supported</Text>}
                    </ScaleFade>
                </Center>
            </Box>
        </Fade>
    )
}