import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./api/queryClient";
import { router } from "./routes/router";
import { SessionProvider } from "./features/auth/session";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <Suspense
                    fallback={
                        <div className="flex min-h-screen items-center justify-center">
                            Loading...
                        </div>
                    }
                >
                    <RouterProvider router={router} />
                </Suspense>
            </SessionProvider>
            {import.meta.env.DEV && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                />
            )}
        </QueryClientProvider>
    </StrictMode>,
);
