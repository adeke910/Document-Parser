import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./App.css";
import Input from "./components/Input";
import Button from "./components/Button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [keys, setKeys] = useState(["Key 1"]); // State to store keys
  const [exportFormat, setExportFormat] = useState<string>("xml"); // Define exportFormat state
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  console.log("🚀 ~ CompanyConfiguration ~ selectedImage:", selectedFile);

  const addKey = () => {
    const newKeys = [...keys, `Key ${keys.length + 1}`]; // Add new key
    setKeys(newKeys);
  };

  const removeLastKey = () => {
    if (keys.length > 1) {
      const newKeys = keys.slice(0, keys.length - 1); // Remove last key
      setKeys(newKeys);
    }
  };
  const handleExportFormatChange = (format: string) => {
    setExportFormat(format);
  };
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
                    setSelectedFile(URL.createObjectURL(addedFile));
                }}
                className="absolute w-full h-full inset-0 opacity-0"
              />

              <img
                src={selectedFile ? selectedFile : "file-upload.svg"}
                className="w-full h-full"
              />
            </div>

            <div className="flex mr-auto">
              <label className="my-[20px] text-[18px] font-normal">
                What would you like to extract?
              </label>
            </div>

            <div className="mr-auto">
              <div className="grid grid-cols-4 gap-6 my-[20px] items-end">
                {keys.map((key, index) => (
                  <Input
                    onChange={(e) => setInputValue(e?.target?.value || "")}
                    key={key} // Using key as a unique identifier
                    label={key}
                    requiredLabel={index === 0} // Only the first input is required
                    placeholder="Type your prompt"
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  customWidth={100}
                  handleClick={addKey}
                >
                  + add Key
                </Button>
                {keys.length > 1 && (
                  <Button
                    variant="primary"
                    customWidth={120}
                    handleClick={removeLastKey}
                  >
                    - remove Last Key
                  </Button>
                )}
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
              <Button customWidth={120} variant="primary">
                Process
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
