import { useEffect, useRef } from "react";

export default function useRefFocusEffect<T extends HTMLElement>(
  onFocusCallback: () => void,
  deps?: React.DependencyList
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => entry.isIntersecting && onFocusCallback()),
        {
          threshold: 1,
        }
      );
      observer.observe(ref.current);
      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }
  }, [deps]);

  return { elementRef: ref };
}
