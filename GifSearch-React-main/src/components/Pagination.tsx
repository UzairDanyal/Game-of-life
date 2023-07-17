import { Pagination } from "@mui/material";
import React, { FC, memo } from "react";

interface BasicPaginationProps {
  setPage: (page: number) => void;
  setOffset: (page: number) => void;
  numberOfPages: number;
  limit:number,
  page: number;
}

const BasicPagination: FC<BasicPaginationProps> = ({ setPage, numberOfPages, setOffset, limit, page }) => {
  const handlePage = (page: number) => {
    setPage(page);  
    // debugger
    setOffset((page*limit)-limit)
    // console.log(page);
    window.scroll(0, 0);
  };

  return (
    <>
      <div className="pagination">
        <Pagination
          count={numberOfPages}
          color="primary"
          defaultPage = {page}
          onChange={(e, val) => handlePage(val)}
          size="large"
          variant="outlined"
          shape="rounded" 
        />
      </div>
    </>
  );
};

export default memo(BasicPagination);
