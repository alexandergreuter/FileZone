
import { GridItem } from '@chakra-ui/react';
export function PageColumnCenter(props: {children: React.ReactNode}) {
    return (
        <GridItem colStart={4} colEnd={15}>
            {props.children}
        </GridItem>
    )
}