import { useRef, useState } from 'react';

const useSearch = (props?: {
  onSetSearch?: (text: string) => void;
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

  const onSetSearch = props?.onSetSearch || (() => {});

  const userTimerRef = useRef<any>(null);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value || '';

    clearTimeout(userTimerRef.current);

    setIsTyping(true);
    setInputValue(text);

    userTimerRef.current = setTimeout(() => {
      onSetSearch(text);
      setSearch(text);
      setIsTyping(false);
    }, 300);
  };

  const handleSetSearch = (text: string) => {
    setSearch(text);
    setInputValue(text);
  };

  return {
    search,
    inputValue,
    setSearch: handleSetSearch,
    isTyping,
    onSearch,
  };
};

export default useSearch;
