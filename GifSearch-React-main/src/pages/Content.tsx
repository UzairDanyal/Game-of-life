import React, { useEffect, useState, useRef, FC } from "react";
import { useLocation } from "react-router-dom";
import GifCards from "../components/GifCards";
import { get } from "../service/httpService/HttpService";
import BasicPagination from "../components/Pagination";
import { Container } from "@mui/material";
import Divider from "@mui/material/Divider";

interface IContentProps {
  setSearchGif: React.Dispatch<React.SetStateAction<string>>;
  setParamsOffset: React.Dispatch<React.SetStateAction<number>>;
  paramsOffset: number;
  updateLimit: React.Dispatch<React.SetStateAction<number>>;
  updateOffset: React.Dispatch<React.SetStateAction<number>>;
  searchGif:string
}
const Content: FC<IContentProps> = ({setSearchGif, updateLimit, updateOffset, searchGif,setParamsOffset,paramsOffset}) => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const queryParams = useQuery();
  const q = queryParams.get("q");
  const [gifList, setGifList] = useState<any[]>([]);
  const [page, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(queryParams.get("limit") ? Number(queryParams.get("limit")) : 20);

  const [loading, setLoading] = useState<boolean>();

  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const getDataRef = useRef<any>(null);

  const getData = async () => {
    setLoading(true);
    let response = await get("/search", {
      q: searchGif,
      api_key: process.env.REACT_APP_API_KEY,
      offset: paramsOffset,
      limit: limit,
    });

    if(response.status === 200) {
      const result =response.data;
      setLoading(false);
      setGifList(result.data);
      setNumberOfPages(
        Math.ceil(result.pagination?.total_count / limit)
      );
      setPages((paramsOffset/limit)+1);
    }
  };

  getDataRef.current = getData;

  useEffect(() => {
    
    setSearchGif(q || "")
    updateLimit(limit)
    updateOffset(paramsOffset)
    getDataRef.current();
  }, [page, q, limit, paramsOffset ]);

  useEffect(() => {}, [gifList, numberOfPages]);

  return (
    <>
      <Container>
        {loading ? (
          <h3 style={{ textAlign: "center" }}> Loading...</h3>
        ) : gifList.length > 0 ? (
          <>
            <div className="gif-container">
              {gifList.map((item) => (
                <GifCards key={item.id} id={item.id} item={item} />
              ))}
            </div>
            <Divider />
            <div className="pagination">
              {numberOfPages > 0 && (
                <BasicPagination
                  setPage={setPages}
                  setOffset={setParamsOffset}
                  numberOfPages={numberOfPages}
                  limit={limit}
                  page={page}
                />
              )}
            </div>
          </>
        ) : (
          <h3 style={{ textAlign: "center" }}>
            No Data Found.Please Enter Valid Name...
          </h3>
        )}
      </Container>
    </>
  );
};

export default Content;
