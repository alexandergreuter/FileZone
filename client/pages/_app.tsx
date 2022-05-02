import '../styles/globals.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import "@fontsource/cairo/variable.css";

function MyApp({ Component, pageProps }) {

  const theme = extendTheme({
    fonts: {
      heading: 'CairoVariable',
      body: 'CairoVariable',
    },
    styles: {
      global: {
        'html, body, #__next': {
          minHeight: '100%',
          height: '100%',
        },
      },
    },
  })

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
