type ResultItem = {
    page: number;
    query: string;
    value: string;
    confidence: number;
    bounding_box: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
};

type ResultProvider = {
    provider: string;
    error: null | string;
    id: string;
    final_status: "succeeded" | "failed";
    items: ResultItem[];
    cost: number;
};

type ExtractionResult = {
    public_id: string;
    status: "finished" | "pending" | "failed";
    error: null | string;
    results: ResultProvider[];
};