import { useQuery } from "@tanstack/vue-query";
import { fetchAllLeagues } from "@/api/sportsDb";

export function useLeaguesQuery() {
  return useQuery({
    queryKey: ["all-leagues"],
    queryFn: ({ signal }) => fetchAllLeagues(signal),
    staleTime: 1000 * 60 * 5,
  });
}
