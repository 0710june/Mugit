"use client";

import { useReducer, useEffect, Dispatch } from "react";

interface State<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

type Action<T> =
  | { type: "LOADING" }
  | { type: "SUCCESS"; data: T }
  | { type: "ERROR"; error: Error };

// Generics를 사용하여 함수와 상태가 다루는 데이터의 타입을 유연하게 지정할 수 있습니다.
function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

// callback 함수와 deps 배열의 타입을 명시합니다.
// callback 함수는 async 함수여야 하며, 반환 타입은 Promise<T>입니다.
function useAsync<T>(
  callback: () => Promise<T>,
  deps: ReadonlyArray<any> = []
): [State<T>, () => Promise<void>] {
  const [state, dispatch] = useReducer<React.Reducer<State<T>, Action<T>>>(
    reducer,
    {
      loading: false,
      data: null,
      error: null,
    }
  );

  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({
        type: "ERROR",
        error: e instanceof Error ? e : new Error(String(e)),
      });
    }
  };

  useEffect(() => {
    fetchData();
    // deps 배열을 useEffect의 의존성 배열로 전달합니다.
  }, deps);

  return [state, fetchData];
}

export default useAsync;
