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
import { fileToAdd, fileToRelease } from "@/app/store/atoms/editfile";
import WaveSurferComp from "./WaveSurferComp";
import { minusCircleIcon } from "./editor/constants/icons";

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

export default function AddedAccordions() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const toReleaseFile = useAtomValue(fileToRelease);
  const [addedFile, setAddFile] = useAtom(fileToAdd);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  const handleRemoveFile = (id: string) => {
    const updatedFiles = addedFile.source.filter(
      (audioFile) => audioFile.id !== id
    );
    setAddFile({ source: updatedFiles });
  };

  useEffect(() => {
    console.log(addedFile);
  }, []);
  return (
    <div>
      {addedFile.source.map((src, index) => (
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
            <WaveSurferComp
              musicPath={src.url}
              musicname={src.file.name}
              type="source"
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
