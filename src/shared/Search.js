import React from "react";
import _ from "lodash"; // lodash 부르기

const Search = () => {
  const debounce = _.debounce((k) => console.log("디바운스! :::", k), 1000); //1000ms (=1sec)
  const keyPress = React.useCallback(debounce, []);
  //함수를 memorization했다가, component가 re-rendering되어도 (dependenacy array 내 요소가 바뀌지 않는 이상) 함수 초기화 하지 않고 저장된 함수 사용

  const onChange = (e) => {
    keyPress(e.target.value);
  };

  return (
    <div>
      <label>Search:</label>
      <input onChange={onChange} />
    </div>
  );
};

export default Search;
