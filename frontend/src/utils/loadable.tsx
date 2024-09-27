import { useState, ReactNode, useRef } from 'react';

type LoadableOptions = {
  fallback: ReactNode;
};

type Loader = () => Promise<any>;

const cache = new Map<string, any>();

function loadable(loader: Loader, { fallback }: LoadableOptions) {
  const chankName = loader.toString();

  return function LoadableComponent(props: any) {
    const Component = cache.get(chankName);
    const isPendingRef = useRef(false);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    if (!Component && !isPendingRef.current) {
      isPendingRef.current = true;

      loader()
        .then((mod) => setLastUpdate(() => {
          const module = mod.default || mod;

          cache.set(chankName, module);

          return Date.now();
        }))
        .catch((err) => console.error('Error loading component', err))
        .finally(() => {
          isPendingRef.current = false;
        });
    }

    if (!Component) {
      return <>{fallback}</>;
    }

    return <Component key={lastUpdate} {...props} />;
  };
}

export default loadable;
