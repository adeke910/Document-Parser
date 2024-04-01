import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExtractionPage from "./ExtractionPage";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ExtractionPage />
    </QueryClientProvider>
  );
}

export default App;
