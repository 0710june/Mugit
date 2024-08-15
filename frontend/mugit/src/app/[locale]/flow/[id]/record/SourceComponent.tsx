import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useAtom, useAtomValue } from "jotai";
import { fileToPut, fileToRelease } from "@/app/store/atoms/editfile";
import WaveSurferComp from "./WaveSurferComp";
import { minusCircleIcon } from "./editor/constants/icons";
import { useParams } from "next/navigation";
interface User {
  id: number;
  nickName: string;
  profileImagePath: string;
}

interface Ancestor {
  id: number;
  user: User;
  title: string;
  authority: "PUBLIC";
  musicPath: string;
  coverPath: string;
  createdAt: string;
  hashtags: string[];
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Accordions() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [putFile, setPutFile] = useAtom(fileToPut);
  const puttFile = useAtomValue(fileToPut);
  const getRecords = async (id: string | string[]) => {
    try {
      const response = await fetch(
        `https://mugit.site/api/flows/${id}/records`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      console.error("Failed to fetch records:", error);
      return [];
    }
  };
  const [records, setRecords] = useState<any>({});
  const params = useParams();
  useEffect(() => {
    const fetchUpdatedRecords = async () => {
      const fetchedRecords = await getRecords(params.id);
      setRecords(fetchedRecords);
    };
    fetchUpdatedRecords();
    console.log();
  }, [params.id]);

  const handleRemoveFile = (id: string) => {
    const updatedFiles = putFile.source.filter(
      (audioFile) => audioFile.id !== id
    );
    setPutFile({ source: updatedFiles });
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
      {puttFile &&
        puttFile.source.map((src, index) => (
          <Accordion key={index} expanded={expanded} onChange={handleToggle}>
            <AccordionSummary
              aria-controls={`panel${index}d-content`}
              id={`panel${index}d-header`}
            >
              <Typography>{src.file.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <button
                onClick={() => {
                  handleRemoveFile(src.id);
                }}
                className="h-fit"
              >
                {minusCircleIcon}
              </button>
              {puttFile ? (
                <div>
                  <WaveSurferComp
                    musicPath={src.url}
                    musicname={src.file.name}
                    type="source"
                  />
                  {/* <p>{src.file.name}</p> */}
                </div>
              ) : (
                <></>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
