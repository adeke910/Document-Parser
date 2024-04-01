import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
import Input from "./components/Input";
import Button from "./components/Button";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ExtractionPage() {
  const [addedKeys, setAddedKeys] = useState<string[]>([]); // State to store keys
  const [keyValue, setKeyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractionId, setExtractionId] = useState("");
  const [extractionData, setExtractionData] = useState<ExtractionResult>();
  const [exportFormat, setExportFormat] = useState<string>(); // Define exportFormat state
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    url: string;
  }>();

  console.log("🚀 ~ CompanyConfiguration ~ extractionId:", extractionId);

  const handleExportFormatChange = (format: string) => {
    setExportFormat(format);
  };

  const {} = useQuery({
    queryKey: ["getExtraction", extractionId],
    queryFn: async () => {
      const res = await axios.get<ExtractionResult>(
        `https://api.edenai.run/v2/ocr/custom_document_parsing_async/${extractionId}?response_as_dict=false`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTY5OWM2ZTUtNGY5MC00NjAxLWExM2UtY2ZkYjUzZDVmNjU3IiwidHlwZSI6ImFwaV90b2tlbiJ9.SEhN8PRcYLzpv84uJtG0Oodw_QfX1CAV5np3s1LaClc",
            Accept: "application/json",
          },
        }
      );
      if (res.data.status === "finished") {
        setLoading(false);
        setExtractionData(res.data);
      }
      //   return res;
    },
    enabled: !!extractionId,
    refetchInterval: extractionData?.status === "finished" ? undefined : 5000,
  });
  return (
    <>
      <div className="bg-zinc-200 flex flex-col w-full h-full overflow-auto">
        <div className="flex h-[80px] bg-pry-2 text-left text-[24px] leading-[33.68px] font-extrabold overflow-auto">
          <p className="py-[20px] pl-[25px] text-beige-1 overflow-auto">
            Xtractify
          </p>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-[100%] bg-white flex flex-col justify-center items-center p-[25px]">
            <div className="w-full h-[27px] text-[25px] font-semibold leading-[27.24px] text-center mb-[30px] align-middle text-pry-2">
              Document Processing
            </div>
            <div className="h-[150px] w-[350px] relative border-dashed border-[2px] border-pry-2 rounded-[10px] mb-[30px]">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                id="file_upload"
                name="file_upload"
                onChange={(e) => {
                  const addedFile = e?.target?.files && e.target.files[0];

                  if (addedFile)
                    setSelectedFile({
                      file: addedFile,
                      url: URL.createObjectURL(addedFile),
                    });
                }}
                className="absolute w-full h-full inset-0 opacity-0"
              />

              <img
                src={selectedFile ? selectedFile?.url : "file-upload.svg"}
                className="w-full h-full"
              />
            </div>

            {extractionData ? (
              <div>
                {extractionData?.results?.[0]?.items?.map((item, i) => (
                  <div key={i}>
                    {item.query}: {item.value}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex mr-auto">
              <label className="my-[20px] text-[18px] font-normal">
                What would you like to extract?
              </label>
            </div>

            <div className="mr-auto">
              <div className="grid grid-cols-4 gap-6 my-[20px] items-end">
                <Input
                  value={keyValue}
                  onChange={(e) => setKeyValue(e?.target?.value || "")}
                  label="Key"
                  placeholder="Type your prompt"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  customWidth={100}
                  handleClick={() => {
                    setKeyValue("");
                    setAddedKeys((prev) => [...prev, keyValue]);
                  }}
                >
                  + add Key
                </Button>
              </div>

              <div className="flex items-center flex-wrap gap-3 mt-2">
                {addedKeys?.map((k, i) => (
                  <div className="flex items-center gap-2 px-2 py-1 border border-teal-300 rounded-md">
                    <p key={i}>{k}</p>
                    <button
                      onClick={() =>
                        setAddedKeys((prev) => prev.filter((pk) => pk !== k))
                      }
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col my-[20px] mr-auto">
                <div className="text-[18px] my-[20px] font-normal">
                  How would you like to export?
                </div>
                <div className="gap-4">
                  <div className="flex">
                    <input
                      type="checkbox"
                      id="xml"
                      name="exportFormat"
                      value="xml"
                      checked={exportFormat === "xml"}
                      onChange={() => handleExportFormatChange("xml")}
                      className="bg-white border-pry-2"
                    />
                    <label htmlFor="xml" className="text-[10px] mx-2">
                      XML
                    </label>
                  </div>
                  <div className="flex">
                    <input
                      type="checkbox"
                      id="json"
                      name="exportFormat"
                      value="json"
                      checked={exportFormat === "json"}
                      onChange={() => handleExportFormatChange("json")}
                      className="bg-white border-pry-2"
                    />
                    <label htmlFor="json" className="text-[10px] mx-2">
                      JSON
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-[24px]">
              <Button
                customWidth={120}
                loading={loading}
                variant="primary"
                handleClick={async () => {
                  setLoading(true);
                  if (selectedFile?.file) {
                    const fileFormData = new FormData();
                    fileFormData.append("file_upload", selectedFile?.file);
                    fileFormData.append(
                      "queries",
                      JSON.stringify(
                        addedKeys.map((k) => ({ query: k, pages: "1-*" }))
                      )
                    );
                    try {
                      const res = await axios.post(
                        "http://127.0.0.1:5000/parse-document",

                        fileFormData,

                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );
                      console.log("res", res);
                      setExtractionId(res.data.extraction_response?.public_id);
                    } catch (error) {
                      console.log("error", error);
                      setLoading(false);
                    }
                  }
                }}
              >
                Process
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
