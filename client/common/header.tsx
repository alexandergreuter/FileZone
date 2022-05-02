import { Box, Container, Flex, IconButton, Spacer, useColorMode } from "@chakra-ui/react";
import { PageGrid } from '../ui/page-grid';
import { PageColumnCenter } from '../ui/page-column-center';
import { Logo } from "../ui/logo";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export function Header() {

    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Box boxShadow='md' py={5}>
            <Container maxW='container.xl'>
                <PageGrid>
                    <PageColumnCenter>
                        <Flex alignItems='center'>
                            <Logo size='xl' />
                            <Spacer />
                            <IconButton 
                                aria-label="Toggle Color Mode" 
                                icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
                                onClick={toggleColorMode} />
                        </Flex>
                    </PageColumnCenter>
                </PageGrid>
            </Container>
        </Box>
    )
}