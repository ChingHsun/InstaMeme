import { useLocation } from "react-router-dom";

export function useQuery(name) {
  return new URLSearchParams(useLocation().search).get(name);
}
