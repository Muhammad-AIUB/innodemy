import { useQuery } from "@tanstack/react-query";
import { allRegistrationsApi } from "./api";
import type { AllRegistrationsParams } from "./types";

export const useAllRegistrationsQuery = (params?: AllRegistrationsParams) => {
    return useQuery({
        queryKey: ["admin", "all-registrations", params],
        queryFn: () => allRegistrationsApi.getAll(params),
    });
};
