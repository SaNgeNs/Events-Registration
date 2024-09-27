import { RQWrapper, toast, ToastBar, ToastCustomContent } from 'react-query-manager';
import { isDevelopment } from '@/constants/dev';
import Content from './content';

const GC_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const CustomContent: ToastCustomContent = (toastProps) => {
  return (
    <ToastBar
      toast={toastProps}
      position={toastProps.position}
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
      }}
    >
      {({ icon, message }) => {
        return (
          <>
            {icon}
            {message}

            <svg
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                cursor: 'pointer',
              }}
              viewBox="0 0 24 24"
              width="15"
              height="15"
              onClick={() => {
                toast.dismiss(toastProps.id);
              }}
            >
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </>
        );
      }}
    </ToastBar>
  );
};

function App() {
  return (
    <RQWrapper
      toast={{ CustomContent }}
      apiUrl={import.meta.env.VITE_BASE_API_URL}
      isDevTools={isDevelopment}
      apiEnsureTrailingSlash
      config={{
        defaultOptions: {
          queries: {
            gcTime: GC_TIME,
            staleTime: STALE_TIME,
            retry: false,
          },
        },
      }}
      apiOnError={(error) => {
        toast.error(error?.data?.error || error.message);
      }}
    >
      <Content />
    </RQWrapper>
  );
}

export default App;
