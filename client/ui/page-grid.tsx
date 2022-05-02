import { Grid } from "@chakra-ui/react";

export function PageGrid(props: {children: React.ReactNode}) {
    return (
        <Grid templateColumns='repeat(17, 1fr)' gap={10} minH='0' height='100%'>
            {props.children}
        </Grid>
    )
}