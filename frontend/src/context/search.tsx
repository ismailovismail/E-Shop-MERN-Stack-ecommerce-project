import React, { useState } from "react"


interface Search {
    keyword:string,
    setKeyword:React.Dispatch<React.SetStateAction<string>>,
    results:object[],
    setResults:React.Dispatch<React.SetStateAction<object[]>>
}

const SearchContext = React.createContext<Search>({
    keyword: "",
    setKeyword: function (value: React.SetStateAction<string>): void {
        throw new Error("Function not implemented.")
    },
    results: [],
    setResults: function (value: React.SetStateAction<object[]>): void {
        throw new Error("Function not implemented.")
    }
})
export const SearchProvider = ({children}:any)=>{
     const [keyword, setKeyword] = useState<string>('')
     const [results, setResults] = useState<object[]>([])

      const data = {
        keyword,
        setKeyword,
        results,
        setResults
      }
    return(
        <SearchContext.Provider value={data} >
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext