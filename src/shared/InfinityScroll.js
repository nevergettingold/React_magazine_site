import React from "react";
import _ from "lodash";

import { Spinner } from "../elements";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;

  const _handleScroll = _.throttle(() => {
    if (loading) {
      return;
    }

    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) || //document 아래 documentElement가 있으면 && 다음 것을 가져온다
      document.body.scrollTop; //browser 마다 document에 접근해서 scrollTop을 가져오는 방법이 상이할 수 있다

    if (scrollHeight - innerHeight - scrollTop < 200) {
      callNext();
    }
  }, 300);
  const handleScroll = React.useCallback(_handleScroll, [loading]);

  React.useEffect(() => {
    if (loading) {
      return;
    }

    if (is_next) {
      //다음 data가 있으면 이벤트를 붙이고, 없으면 삭제
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll); //clean up: unmount 동작
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [is_next, loading]);

  return (
    <React.Fragment>
      {props.children}
      {is_next && <Spinner />}
    </React.Fragment>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};

export default InfinityScroll;
