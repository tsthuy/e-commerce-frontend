import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import { scan } from 'react-scan';

import { ThemeProvider } from '~/providers';

import { Toaster } from '~/components/ui';

import App from './App';

import '~/libs/i18n.lib';

import '~/styles/ckeditor.css';
import '~/styles/globals.css';
import '~/styles/styles.scss';

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    retry: false,
    staleTime: Infinity
  }
});

// if (typeof window !== 'undefined') {
//   scan({
//     enabled: false,
//     log: false
//   });
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider enableSystem attribute="class" defaultTheme="light">
        <Toaster closeButton richColors position="top-center" />
        <App />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </BrowserRouter>
);
