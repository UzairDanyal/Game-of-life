import React, { FC, memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
interface HeaderProps {
    setParamsOffset: React.Dispatch<React.SetStateAction<number>>;
  }
const Header: FC<HeaderProps> = ({setParamsOffset}) => {
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
      };
      const queryParams = useQuery();
      useEffect(()=>(
          setParamsOffset(queryParams.get("offset") ? Number(queryParams.get("offset")) : 0)

      ))
    return (
        <header className='header'>
            <h3 className='pl-5 text-white text-4xl my-auto font-bold'>Giphy Search</h3>
        </header>  
    );
}
 
export default memo(Header);
