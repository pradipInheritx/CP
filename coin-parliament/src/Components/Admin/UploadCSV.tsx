import React, { CSSProperties, useContext, useRef, useState } from "react";

import { useCSVReader } from "react-papaparse";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { Props } from "react-papaparse/dist/useCSVReader";
import NotificationContext, { ToastType } from "../../Contexts/Notification";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: "20%",
  } as CSSProperties,
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: "red",
  } as CSSProperties,
};

export type IUploadCSV<T> = Omit<Props<T>, "children"> & {
  upload: (results: T[]) => void;
  transform: (results: any) => T[];
  buttonTxt?: string;
  overwrite?: boolean;
};

const UploadCSV = <T extends any>({
  onUploadAccepted,
  upload,
  transform,
  buttonTxt = "Upload csv",
  overwrite = true,
  ...rest
}: IUploadCSV<T>) => {
  const { showToast } = useContext(NotificationContext);
  const { CSVReader } = useCSVReader();
  const [results, setResults] = useState<T[]>([]);
  const remove = useRef<HTMLButtonElement>(null);

  return (
    <CSVReader
      {...rest}
      onUploadAccepted={(results: any) => {
        try {
          setResults(transform(results));
        } catch (e) {
          showToast((e as Error).message, ToastType.ERROR);
          remove.current?.click();
        }
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => {
        const { onClick: onRemove } = getRemoveFileProps();
        return (
          <>
            <InputGroup>
              <Button
                onClick={void 0}
                style={{ width: "auto" }}
                {...getRootProps()}
              >
                {buttonTxt}
              </Button>
              <FormControl
                type="text"
                value={(acceptedFile && acceptedFile.name) || ""}
                readOnly={true}
              />
              {results.length > 0 && (
                <Button
                  ref={remove}
                  onClick={(e) => {
                    setResults([]);
                    onRemove(e);
                  }}
                  style={{ width: "auto" }}
                  variant="danger"
                >
                  Remove
                </Button>
              )}
              {results.length > 0 && upload && (
                <Button
                  onClick={() => {
                    upload(results);
                    setResults([]);
                  }}
                  style={{ width: "auto" }}
                  variant="success"
                >
                  {overwrite ? "Overwrite" : "Add"}
                </Button>
              )}
            </InputGroup>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        );
      }}
    </CSVReader>
  );
};

export default UploadCSV;
