import { useState } from "react";
import { ThumbsUp, ThumbsDown, Undo2 } from "lucide-react";

type FeedbackState = "idle" | "up" | "down-prompt" | "down-submitted";

const downReasons = [
  "Already mitigated",
  "Incorrect / false positive",
  "Duplicate of another risk",
  "Low impact — not worth tracking",
];

interface Props {
  riskId: string;
  variant?: "inline" | "expanded";
}

export function RiskFeedback({ riskId, variant = "inline" }: Props) {
  const [state, setState] = useState<FeedbackState>("idle");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reset = () => {
    setState("idle");
    setSelectedReason(null);
  };

  if (variant === "inline") {
    if (state === "up") {
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-status-success font-medium">Confirmed ✓</span>
          <button onClick={reset} className="p-0.5 rounded hover:bg-secondary transition-colors text-muted-foreground/40 hover:text-muted-foreground" title="Undo">
            <Undo2 className="w-2.5 h-2.5" />
          </button>
        </div>
      );
    }

    if (state === "down-prompt" || state === "down-submitted") {
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground italic">Marked not relevant</span>
          <button onClick={reset} className="p-0.5 rounded hover:bg-secondary transition-colors text-muted-foreground/40 hover:text-muted-foreground" title="Undo">
            <Undo2 className="w-2.5 h-2.5" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setState("up"); }}
          className="p-0.5 rounded hover:bg-secondary transition-colors text-muted-foreground/40 hover:text-status-success"
          title="Confirm this risk is relevant"
        >
          <ThumbsUp className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setState("down-prompt"); }}
          className="p-0.5 rounded hover:bg-secondary transition-colors text-muted-foreground/40 hover:text-status-danger"
          title="Mark as not relevant"
        >
          <ThumbsDown className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Expanded variant (used in drawer)
  if (state === "up") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-status-success font-medium flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" /> Confirmed as relevant
        </span>
        <button onClick={reset} className="text-[10px] text-muted-foreground hover:text-foreground underline">Undo</button>
      </div>
    );
  }

  if (state === "down-submitted") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground italic flex items-center gap-1">
            <ThumbsDown className="w-3 h-3" /> Marked not relevant
            {selectedReason && <span>— {selectedReason}</span>}
          </span>
          <button onClick={reset} className="text-[10px] text-muted-foreground hover:text-foreground underline">Undo</button>
        </div>
        <p className="text-[10px] text-muted-foreground">This feedback helps improve future risk detection.</p>
      </div>
    );
  }

  if (state === "down-prompt") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-foreground font-medium">Why is this not relevant?</p>
        <div className="flex flex-wrap gap-1.5">
          {downReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => { setSelectedReason(reason); setState("down-submitted"); }}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                selectedReason === reason
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-border hover:bg-secondary/70"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        <button onClick={() => setState("down-submitted")} className="text-[10px] text-muted-foreground hover:text-foreground underline">
          Skip — just mark as not relevant
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setState("up")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium hover:bg-status-success/20 transition-colors"
      >
        <ThumbsUp className="w-3 h-3" /> Relevant
      </button>
      <button
        onClick={() => setState("down-prompt")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
      >
        <ThumbsDown className="w-3 h-3" /> Not Relevant
      </button>
    </div>
  );
}
