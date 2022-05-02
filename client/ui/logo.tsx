import { Heading } from "@chakra-ui/react";

export function Logo(props: {size: 'xl' | 'md'}) {
  return (
      <Heading size={props.size} fontWeight='bold'>
          FILEZONE
      </Heading>
  );
}