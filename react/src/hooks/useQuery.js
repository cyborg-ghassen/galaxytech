import { useLocation } from 'react-router-dom';

const useQuery = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return searchParams;
};

export default useQuery;
