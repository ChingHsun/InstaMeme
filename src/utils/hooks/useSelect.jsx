import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getMemes } from "../../firebase/firestore";
import {
  getMemeAction,
  getMemesOrderAction,
  getMemesOrderMoreAction,
} from "../../redux/actions";

const useSelect = ({ theme }) => {
  const dispatch = useDispatch();
  const bottomRef = useRef();
  const topRef = useRef();
  const lastRef = useRef(null);
  const history = useHistory();
  const [ui, setUi] = useState({ main: "loading", lazyload: "loading" });
  const [selectOrder, setSelectOrder] = useState("created_time");
  const [selectionUi, setSelectionUi] = useState(false);
  const preTheme = useSelector((state) => state.memesOrder.theme);
  const preOrder = useSelector((state) => state.memesOrder.orderby);
  const preLastDoc = useSelector((state) => state.memesOrder.lastDoc);

  useEffect(() => {
    setUi({ main: "loading", lazyload: "loading" });
    if (!(preTheme === theme && preOrder === selectOrder)) {
      getMemes(selectOrder, "desc", 12, theme)
        .then(({ orderedMemeId, lastDoc, memeData }) => {
          if (orderedMemeId.length !== 0) {
            lastRef.current = lastDoc;
            dispatch(getMemeAction(memeData));
            dispatch(
              getMemesOrderAction(orderedMemeId, theme, selectOrder, lastDoc)
            );

            setUi({ main: "success", lazyload: "loading" });
          }
        })
        .catch((err) => {
          console.log("err", err);
          setUi({ main: "error", lazyload: "success" });
        });
    } else {
      lastRef.current = preLastDoc;
      setUi({ main: "success", lazyload: "loading" });
    }
  }, [theme, selectOrder]);
  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (lastRef.current && bottomRef.current) {
            getMemes(selectOrder, "desc", 12, theme, lastRef.current)
              .then(({ orderedMemeId, lastDoc, memeData }) => {
                if (orderedMemeId.length === 0) {
                  observer.unobserve(entry.target);
                  setUi({ ...ui, lazyload: "success" });
                } else {
                  lastRef.current = lastDoc;
                  dispatch(getMemeAction(memeData));
                  dispatch(
                    getMemesOrderMoreAction(
                      orderedMemeId,
                      theme,
                      selectOrder,
                      lastDoc
                    )
                  );
                }
              })
              .catch((err) => {
                console.log("e", err);
              });
          }
        }
      });
    };
    const options = {
      root: null,
      threshold: 0,
      rootMargin: "0px",
    };
    let observer = null;
    if (ui.main === "success") {
      observer = new IntersectionObserver(callback, options);
    }

    if (bottomRef.current && ui.main === "success") {
      observer.observe(bottomRef.current);
    }
    const prey = bottomRef?.current;
    return () => {
      prey && observer?.unobserve(prey);
    };
  }, [theme, selectOrder, ui.main]);

  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSelectionUi(false);
        } else {
          setSelectionUi(true);
        }
      });
    };
    const options = {
      root: null,
      threshold: 0,
      rootMargin: "0px",
    };
    let observer = null;
    if (topRef.current) {
      observer = new IntersectionObserver(callback, options);
      observer.observe(topRef.current);
    }
    const prey = topRef?.current;
    return () => {
      prey && observer?.unobserve(prey);
    };
  }, [topRef]);
  const onThemeChange = (e) => {
    const theme = e.target.value;
    history.push(`./${theme}`);
  };
  const onSelectOrder = (e) => {
    const order = e.target.value;
    setSelectOrder(order);
  };
  return {
    onThemeChange,
    onSelectOrder,
    selectOrder,
    selectionUi,
    ui,
    topRef,
    bottomRef,
  };
};

export default useSelect;
